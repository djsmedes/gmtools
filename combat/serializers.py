from rest_framework import serializers

from core.serializers import CampaignModelSerializer, UserOwnedModelSerializer, ClientControlledJSONField
from .models import Combatant, GMScreenTab, Statblock


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


class StatblockSerializer(CampaignModelSerializer):
    view_name = 'statblock-detail'
    generic_name = serializers.CharField(required=False, allow_null=True)
    damage_vulnerabilities = ClientControlledJSONField(allow_null=True, required=False)
    damage_resistances = ClientControlledJSONField(allow_null=True, required=False)
    damage_immunities = ClientControlledJSONField(allow_null=True, required=False)
    condition_immunities = ClientControlledJSONField(allow_null=True, required=False)
    languages = ClientControlledJSONField(allow_null=True, required=False)

    class Meta:
        model = Statblock
        fields = (
            "uuid",
            "campaign",

            "name",
            "generic_name",
            "proficiency",
            "challenge",
            "size",
            "type",
            "alignment",
            "armor_class",
            "armor_kind",

            "hit_points",
            "num_hit_die",

            "speed",
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha",

            "saving_throws",
            "skills",
            "senses",

            "damage_vulnerabilities",
            "damage_resistances",
            "damage_immunities",
            "condition_immunities",
            "languages",
        )
