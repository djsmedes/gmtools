from django.db import models
from django.conf import settings
from authtools.models import AbstractEmailUser

from core.utils import make_slug


class User(AbstractEmailUser):
    slug = models.SlugField(
        max_length=25, allow_unicode=True, default=make_slug, unique=True, editable=False
    )

    first_name = models.CharField(max_length=31, null=True, blank=True)
    last_name = models.CharField(max_length=31, null=True, blank=True)

    current_campaign = models.ForeignKey(
        'accounts.Campaign',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='current_users',
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
    slug = models.SlugField(
        max_length=25, allow_unicode=True, default=make_slug, unique=True, editable=False
    )
    name = models.CharField(
        max_length=63
    )
    creation_date = models.DateField(auto_now_add=True)
    gm_set = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        editable=False,
        related_name='campaigns_gm_of',
    )
    player_set = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='campaigns_player_of',
        editable=False
    )

    def __str__(self):
        return self.name
