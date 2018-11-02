from django.db import models
from django.conf import settings

from core.models import CampaignOwnedModel, UserOwnedModel


class Combatant(CampaignOwnedModel):
    name = models.CharField(max_length=31)

    initiative = models.IntegerField(null=True, blank=True)
    initiative_bonus = models.IntegerField(default=0, blank=True)
    hp = models.IntegerField(null=True, blank=True)
    max_hp = models.IntegerField(null=True, blank=True)
    temp_hp = models.IntegerField(default=0, blank=True)

    loot = models.TextField(null=True, blank=True)
    effects = models.TextField(null=True, blank=True)

    encounter = models.ForeignKey(
        'plot.Encounter',
        on_delete=models.CASCADE,
        null=True, blank=True,
    )

    player_editors = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="editable_combatants"
    )

    def __str__(self):
        return self.name


class GMScreenTab(UserOwnedModel):
    title = models.CharField(max_length=31)
    content = models.TextField()
    order = models.IntegerField(null=True, blank=True)
