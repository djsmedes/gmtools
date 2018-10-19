from rest_framework import serializers

from core.serializers import CampaignModelSerializer
from .models import Combatant


class CombatantSerializer(CampaignModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='combatant-detail',
        lookup_field='uuid'
    )

    class Meta:
        model = Combatant
        fields = ('name', 'initiative', 'hp', 'max_hp', 'loot', 'effects',
                  'encounter', 'campaign', 'uuid', 'url')


class CombatantNoRequestSerializer(CampaignModelSerializer):
    class Meta:
        model = Combatant
        fields = ('name', 'initiative', 'hp', 'max_hp', 'loot', 'effects',
                  'encounter', 'campaign', 'uuid')

    def transform_queryset(self, queryset):
        return queryset
