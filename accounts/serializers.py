from rest_framework import serializers

from core.serializers import CampaignModelSerializer
from .models import User, Campaign


class UserSerializer(CampaignModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        lookup_field='slug',
        view_name='user-detail',
    )

    def transform_queryset(self, queryset):
        return queryset

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email',
                  'current_campaign',
                  'slug', 'url')


class CampaignSerializer(CampaignModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='campaign-detail',
        lookup_field='slug'
    )

    class Meta:
        model = Campaign
        fields = (
            'gm_set', 'player_set',
            'slug', 'url'
        )

    def validate_gm_set(self, value):
        if not value:
            raise serializers.ValidationError('The last GM cannot be removed. Add another GM first.')
        return value
