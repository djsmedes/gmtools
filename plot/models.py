from django.db import models

from core.models import CampaignOwnedModel


class Encounter(CampaignOwnedModel):

    name = models.CharField(max_length=127)
    completion_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name
