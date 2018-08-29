from rest_framework import serializers

from core.serializers import BaseModelSerializer
from .models import Campaign


class CampaignSerializer(BaseModelSerializer):
    class Meta:
        model = Campaign
        fields = (
            'gm_set', 'player_set',
            'record_owner', 'url'
        )
