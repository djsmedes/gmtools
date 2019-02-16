from core.serializers import CampaignModelSerializer, UserOwnedModelSerializer, ClientControlledJSONField
from .models import Combatant, GMScreenTab


class CombatantSerializer(CampaignModelSerializer):
    view_name = 'combatant-detail'
    effects = ClientControlledJSONField(allow_null=True, required=False)

    class Meta:
        model = Combatant
        fields = (
            'name', 'initiative', 'initiative_bonus',
            'hp', 'max_hp', 'temp_hp',
            'loot', 'effects',
            'encounter', 'campaign', 'uuid'
        )


class GMScreenTabSerializer(UserOwnedModelSerializer):
    view_name = 'gmscreentab-detail'

    class Meta:
        model = GMScreenTab
        fields = (
            'title', 'content', 'order',
            'user', 'uuid'
        )
