from rest_framework import serializers

from core.serializers import CampaignModelSerializer
from .models import User, Campaign


class UserSerializer(CampaignModelSerializer):
    def __init__(self, instance, *args, **kwargs):
        super().__init__(instance, *args, **kwargs)
        self.fields['current_campaign']._kwargs['queryset'] = Campaign.objects.filter(user=instance)

    url = serializers.HyperlinkedIdentityField(
        lookup_field='uuid',
        view_name='user-detail',
    )

    def transform_queryset(self, queryset):
        return queryset

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email',
                  'current_campaign',
                  'uuid', 'url')

    def validate_current_campaign(self, value):
        if value not in self.root.instance.campaigns.all():
            raise serializers.ValidationError('Cannot set current campaign to one of which you are not a member.')
        return value


class CampaignSerializer(CampaignModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='campaign-detail',
        lookup_field='uuid'
    )
    gm_set = serializers.SerializerMethodField()
    player_set = serializers.SerializerMethodField()

    def get_gm_set(self, instance):
        return [user.uuid for user in instance.gm_set]

    def get_player_set(self, instance):
        return [user.uuid for user in instance.player_set]

    def transform_queryset(self, queryset):
        return queryset

    class Meta:
        model = Campaign
        fields = (
            'name', 'gm_set', 'player_set',
            'uuid', 'url'
        )
