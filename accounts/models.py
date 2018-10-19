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
