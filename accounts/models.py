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

    def __str__(self):
        return self.name
