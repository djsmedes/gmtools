from rest_framework import serializers

from core.serializers import CampaignModelSerializer
from .models import Combatant


class CombatantSerializer(CampaignModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='combatant-detail',
        lookup_field='slug'
    )

    class Meta:
        model = Combatant
        fields = ('name', 'initiative', 'hp', 'loot', 'effects',
                  'slug', 'url')


