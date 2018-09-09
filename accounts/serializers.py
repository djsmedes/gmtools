from django.db.models import Q
from rest_framework import serializers

from core.serializers import CampaignModelSerializer
from .models import User, Campaign


class UserSerializer(CampaignModelSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['current_campaign']._kwargs['queryset'] = self.allowed_campaigns(self.root.instance)

    url = serializers.HyperlinkedIdentityField(
        lookup_field='slug',
        view_name='user-detail',
    )
    all_campaigns = serializers.SerializerMethodField()

    def get_all_campaigns(self, instance):
        return [campaign.slug for campaign in self.allowed_campaigns(instance)]

    def allowed_campaigns(self, instance):
        if instance is None:
            return Campaign.objects.none()
        return Campaign.objects.filter(Q(gm_set=instance) | Q(player_set=instance))

    def transform_queryset(self, queryset):
        return queryset

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email',
                  'current_campaign', 'all_campaigns',
                  'slug', 'url')

    def validate_current_campaign(self, value):
        ok_choices = [None]
        ok_choices.extend(self.root.instance.campaigns_player_of.all())
        ok_choices.extend(self.root.instance.campaigns_gm_of.all())
        if value not in ok_choices:
            raise serializers.ValidationError('Cannot set current campaign to one of which you are not a member.')
        return value


class CampaignSerializer(CampaignModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='campaign-detail',
        lookup_field='slug'
    )

    class Meta:
        model = Campaign
        fields = (
            'name', 'gm_set', 'player_set',
            'slug', 'url'
        )

    def validate_gm_set(self, value):
        if not value:
            raise serializers.ValidationError('The last GM cannot be removed. Add another GM first.')
        return value
