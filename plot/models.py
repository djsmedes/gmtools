from django.db import models

from core.models import CampaignOwnedModel


class Encounter(CampaignOwnedModel):
    class Meta:
        abstract = True  # don't generate db rows yet - todo - make this real
