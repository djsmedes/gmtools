from django.db import models

from .utils import make_slug
from .managers import CampaignModelManager


class CampaignOwnedModel(models.Model):
    class Meta:
        abstract = True

    campaign = models.ForeignKey(
        'accounts.Campaign',
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_owned_set",
        editable=False
    )
    slug = models.SlugField(
        max_length=25, allow_unicode=True, default=make_slug, unique=True
    )
    objects = CampaignModelManager()
