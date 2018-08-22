from rest_framework import serializers

from core.serializers import UUIDHyperlinkedModelSerializer
from .models import Campaign


class CampaignSerializer(UUIDHyperlinkedModelSerializer):
    class Meta:
        model = Campaign
        fields = (
            'gm_set', 'player_set',
            'record_owner', 'url'
        )
