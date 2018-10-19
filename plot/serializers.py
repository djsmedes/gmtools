from rest_framework import serializers

from core.serializers import CampaignModelSerializer
from .models import Encounter


class EncounterSerializer(CampaignModelSerializer):
    class Meta:
        model = Encounter
        fields = ('uuid', 'name', 'campaign')
