from django.db import models

from core.models import CampaignOwnedModel


class Combatant(CampaignOwnedModel):
    name = models.CharField(max_length=31)
    initiative = models.IntegerField(null=True, blank=True)
    hp = models.IntegerField(null=True, blank=True)
    max_hp = models.IntegerField(null=True, blank=True)
    loot = models.TextField(null=True, blank=True)
    effects = models.TextField(null=True, blank=True)

    encounter = models.ForeignKey(
        'plot.Encounter',
        on_delete=models.CASCADE,
        null=True, blank=True,
    )

    def __str__(self):
        return self.name
