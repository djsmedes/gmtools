import datetime
from django.db import models
from django.conf import settings
from authtools.models import AbstractEmailUser
from django_smalluuid.models import SmallUUIDField, uuid_default


class User(AbstractEmailUser):
    uuid = SmallUUIDField(editable=False, default=uuid_default())

    first_name = models.CharField(max_length=31, null=True, blank=True)
    last_name = models.CharField(max_length=31, null=True, blank=True)

    current_campaign = models.ForeignKey(
        'accounts.Campaign',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='current_users',
    )

    campaigns = models.ManyToManyField(
        'accounts.Campaign',
        blank=True,
        through='accounts.CampaignRole'
    )

    class Meta:
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return '{0.name} <{0.email}>'.format(self)

    @property
    def name(self):
        return '{0.first_name} {0.last_name}'.format(self)

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name


class Campaign(models.Model):
    uuid = SmallUUIDField(editable=False, default=uuid_default())
    name = models.CharField(
        max_length=63
    )
    creation_date = models.DateField(auto_now_add=True)

    active_encounter = models.OneToOneField(
        'plot.Encounter',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='campaign_active_in'
    )

    def set_as_player(self, player: settings.AUTH_USER_MODEL):
        match_qs = CampaignRole.objects.filter(user=player, campaign=self)
        if match_qs.exists():
            match_qs.update(is_gm=False)
        else:
            CampaignRole.objects.create(user=player, campaign=self)

    def set_as_gm(self, gm: settings.AUTH_USER_MODEL):
        match_qs = CampaignRole.objects.filter(user=gm, campaign=self)
        if match_qs.exists():
            match_qs.update(is_gm=True)
        else:
            CampaignRole.objects.create(user=gm, campaign=self, is_gm=True)

    @property
    def player_set(self):
        return User.objects.filter(campaigns=self, campaignrole__is_gm=False)

    @property
    def gm_set(self):
        return User.objects.filter(campaigns=self, campaignrole__is_gm=True)

    def __str__(self):
        return self.name


class CampaignRole(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    campaign = models.ForeignKey(
        'accounts.Campaign',
        on_delete=models.CASCADE
    )
    is_gm = models.BooleanField(default=False)


class Invitation(models.Model):
    """Stores information during the process of both parties
    approving a link between a User and an Account."""

    EXPIRE_TIMEDELTA = datetime.timedelta(days=7)

    uuid = SmallUUIDField(editable=False, default=uuid_default())
    creation_date = models.DateField(auto_now_add=True)
    completion_date = models.DateField(editable=False, null=True, blank=True)
    campaign = models.ForeignKey(
        'accounts.Campaign',
        on_delete=models.CASCADE
    )
    joiner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    approver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='invites_approved',
    )
    joiner_external_identifier = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.joiner_external_identifier} -> {self.campaign!s}"

    class Expired(Exception):
        pass

    class ApproverNotAuthorized(Exception):
        pass

    def _validate(self, approving_user, accepting_user):
        assert approving_user, accepting_user
        if not approving_user.campaigns.filter(campaignrole__is_gm=True).filter(id=self.campaign_id):
            raise self.ApproverNotAuthorized
        if datetime.date.today() > self.creation_date + self.EXPIRE_TIMEDELTA:
            raise self.Expired

    def accept(self, accepting_user=None):
        self._validate(self.approver, accepting_user or self.joiner)
        self._complete(self.approver, accepting_user or self.joiner)

    def reject(self):
        self.joiner = None
        self.save()

    def approve(self, approving_user):
        self._validate(approving_user, self.joiner)
        self._complete(approving_user, self.joiner)

    def _complete(self, approving_user, accepting_user):
        CampaignRole.objects.create(user=accepting_user, campaign=self.campaign)
        self.approver = approving_user
        self.joiner = accepting_user
        self.completion_date = datetime.date.today()
        self.save()

    @classmethod
    def get_current_invites(cls):
        earliest_allowed_creation_date = datetime.date.today() - datetime.timedelta(days=7)
        return cls.objects.filter(
            creation_date__gt=earliest_allowed_creation_date
        ).filter(
            completion_date__isnull=True
        )
