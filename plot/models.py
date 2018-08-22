from django.db import models
from django.conf import settings

from core.models import TenantModel


class Campaign(TenantModel):
    creation_date = models.DateField(auto_now_add=True)
    gm_set = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        editable=False,
        related_name='campaigns_gm_of',
    )
    player_set = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='campaigns_player_of',
    )
