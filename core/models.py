from django.db import models
from django_smalluuid.models import SmallUUIDField, uuid_default
from django.conf import settings

from .managers import CampaignModelManager, UserModelManager


class CampaignOwnedModel(models.Model):
    class Meta:
        abstract = True

    campaign = models.ForeignKey(
        'accounts.Campaign',
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_owned_set",
        editable=False
    )
    uuid = SmallUUIDField(editable=False, default=uuid_default())
    objects = CampaignModelManager()


class UserOwnedModel(models.Model):
    class Meta:
        abstract = True

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_owned_set",
        editable=False
    )
    uuid = SmallUUIDField(editable=False, default=uuid_default)
    objects = UserModelManager()
