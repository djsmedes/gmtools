from rest_framework import serializers

from core.serializers import CampaignModelSerializer
from .models import Encounter


class EncounterSerializer(CampaignModelSerializer):
    view_name = 'encounter-detail'

    class Meta:
        model = Encounter
        fields = ('uuid', 'name', 'campaign', 'completion_date')
