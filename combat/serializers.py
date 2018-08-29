from rest_framework import serializers

from core.serializers import BaseModelSerializer
from .models import Combatant


class CombatantSerializer(BaseModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='combatant-detail',
        lookup_field='uuid'
    )

    class Meta:
        model = Combatant
        fields = ('name', 'initiative', 'hp', 'loot',
                  'uuid', 'url')


