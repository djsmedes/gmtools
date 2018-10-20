from rest_framework import serializers

from core.serializers import CampaignModelSerializer
from .models import Combatant


class CombatantSerializer(CampaignModelSerializer):
    view_name = 'combatant-detail'

    class Meta:
        model = Combatant
        fields = (
            'name', 'initiative', 'initiative_bonus',
            'hp', 'max_hp', 'temp_hp',
            'loot', 'effects',
            'encounter', 'campaign', 'uuid'
        )
