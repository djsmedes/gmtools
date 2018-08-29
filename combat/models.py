from django.db import models

from core.models import TenantModel


class Combatant(TenantModel):
    name = models.CharField(max_length=31)
    initiative = models.IntegerField(null=True, blank=True)
    hp = models.IntegerField(null=True, blank=True)
    loot = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name
