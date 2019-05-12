from rest_framework import serializers

from core.serializers import CampaignModelSerializer, MultiTenantedModelSerializer
from .models import User, Campaign, Invitation


class UserSerializer(CampaignModelSerializer):
    view_name = 'user-detail'
    campaigns_gm_of = serializers.SerializerMethodField()

    def get_campaigns_gm_of(self, instance: User):
        return [c.uuid for c in instance.campaigns.filter(campaignrole__is_gm=True)]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if hasattr(self.instance, 'campaigns'):
            qs = self.instance.campaigns.all()
        else:
            qs = []
        self.fields['current_campaign'].queryset = qs
        if self.view_name and self.context.get('request'):
            self.fields['url'] = serializers.HyperlinkedIdentityField(
                view_name=self.view_name,
                lookup_field='uuid'
            )

    def transform_queryset(self, queryset):
        return queryset

    class Meta:
        model = User
        fields = (
            'first_name', 'last_name', 'email',
            'current_campaign', 'campaigns_gm_of',
            'uuid',
        )

    def validate_current_campaign(self, value):
        if value not in self.root.instance.campaigns.all():
            raise serializers.ValidationError('Cannot set current campaign to one of which you are not a member.')
        return value


class CampaignSerializer(CampaignModelSerializer):
    gm_set = serializers.SerializerMethodField()
    player_set = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if hasattr(self.instance, 'plot_encounter_owned_set'):
            qs = self.instance.plot_encounter_owned_set.all()
        else:
            qs = []
        self.fields['active_encounter'].queryset = qs
        if self.context.get('request'):
            self.fields['url'] = serializers.HyperlinkedIdentityField(
                view_name='campaign-detail', lookup_field='uuid'
            )

    def get_gm_set(self, instance: Campaign):
        return [user.uuid for user in instance.user_set.filter(campaignrole__is_gm=True)]

    def get_player_set(self, instance):
        return [user.uuid for user in instance.user_set.filter(campaignrole__is_gm=False)]

    class Meta:
        model = Campaign
        fields = (
            'name', 'gm_set', 'player_set',
            'active_encounter',
            'uuid'
        )


class InvitationSerializer(MultiTenantedModelSerializer):
    campaign_name = serializers.SerializerMethodField()
    approver_external_identifier = serializers.SerializerMethodField()

    def get_campaign_name(self, invite: Invitation):
        return invite.campaign.name

    def get_approver_external_identifier(self, invite: Invitation):
        return invite.approver.email  # may eventually be something less personal like a username

    class Meta:
        model = Invitation
        fields = (
            'uuid', 'campaign_name', 'campaign', 'joiner', 'approver',
            'joiner_external_identifier', 'approver_external_identifier',
        )
        read_only_fields = ('approver', 'joiner',)
