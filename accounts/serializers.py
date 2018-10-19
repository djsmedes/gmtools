from rest_framework import serializers

from core.serializers import CampaignModelSerializer
from .models import User, Campaign


class UserSerializer(CampaignModelSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if hasattr(self.instance, 'campaigns'):
            qs = self.instance.campaigns.all()
        else:
            qs = []
        self.fields['current_campaign'].queryset = qs

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

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if hasattr(self.instance, 'plot_encounter_owned_set'):
            qs = self.instance.plot_encounter_owned_set.all()
        else:
            qs = []
        self.fields['active_encounter'].queryset = qs

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
            'active_encounter',
            'uuid', 'url'
        )
