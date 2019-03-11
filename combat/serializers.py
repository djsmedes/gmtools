from rest_framework import serializers

from core.serializers import (
    CampaignModelSerializer,
    UserOwnedModelSerializer,
    ClientControlledJSONField,
)
from .models import Combatant, GMScreenTab, Statblock, StatblockProp, CreatureProp


class CombatantSerializer(CampaignModelSerializer):
    view_name = 'combatant-detail'
    buffs = ClientControlledJSONField(allow_null=True, required=False)
    debuffs = ClientControlledJSONField(allow_null=True, required=False)
    others = ClientControlledJSONField(allow_null=True, required=False)

    class Meta:
        model = Combatant
        fields = (
            'name', 'initiative', 'initiative_bonus',
            'hp', 'max_hp', 'temp_hp',
            'loot',
            'buffs', 'debuffs', 'others',
            'statblock',
            'encounter', 'campaign', 'uuid',
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

    properties = serializers.SerializerMethodField()
    actions = serializers.SerializerMethodField()
    reactions = serializers.SerializerMethodField()
    legendary_actions = serializers.SerializerMethodField()
    _properties = serializers.ListField(
        write_only=True,
        child=serializers.CharField(max_length=22, min_length=22)
    )
    _actions = serializers.ListField(
        write_only=True,
        child=serializers.CharField(max_length=22, min_length=22)
    )
    _reactions = serializers.ListField(
        write_only=True,
        child=serializers.CharField(max_length=22, min_length=22)
    )
    _legendary_actions = serializers.ListField(
        write_only=True,
        child=serializers.CharField(max_length=22, min_length=22)
    )

    def get_properties(self, obj: Statblock):
        return [o.uuid for o in obj.creatureprop_set.filter(
            prop_type=CreatureProp.PROPERTY
        ).order_by(
            'statblockprop__manual_ordering'
        )]

    def get_actions(self, obj: Statblock):
        return [o.uuid for o in obj.creatureprop_set.filter(
            prop_type=CreatureProp.ACTION
        ).order_by(
            'statblockprop__manual_ordering'
        )]

    def get_reactions(self, obj: Statblock):
        return [o.uuid for o in obj.creatureprop_set.filter(
            prop_type=CreatureProp.REACTION
        ).order_by(
            'statblockprop__manual_ordering'
        )]

    def get_legendary_actions(self, obj: Statblock):
        return [o.uuid for o in obj.creatureprop_set.filter(
            prop_type=CreatureProp.LEGENDARY_ACTION
        ).order_by(
            'statblockprop__manual_ordering'
        )]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if hasattr(self, "initial_data"):
            for key in ["properties", "actions", "reactions", "legendary_actions"]:
                objs = self.initial_data.pop(key, None)
                if objs is not None:
                    self.initial_data["_" + key] = objs

    def create(self, validated_data):
        [validated_data.pop(key, None) for key in ["_properties", "_actions", "_reactions", "_legendary_actions"]]
        return super().create(validated_data)

    def update(self, instance: Statblock, validated_data):
        keys_and_types = [
            ("_properties", CreatureProp.PROPERTY),
            ("_actions", CreatureProp.ACTION),
            ("_reactions", CreatureProp.REACTION),
            ("_legendary_actions", CreatureProp.LEGENDARY_ACTION),
        ]
        for serializer_key, prop_type in keys_and_types:
            prop_set = validated_data.pop(serializer_key, None)
            if prop_set is not None:
                # remove any that were removed
                StatblockProp.objects.filter(
                    statblock=instance, creature_prop__prop_type=prop_type
                ).exclude(
                    creature_prop__uuid__in=prop_set
                ).delete()

                for index, uuid in enumerate(prop_set):
                    # add / update as needed
                    statblockprop, _ = StatblockProp.objects.get_or_create(
                        statblock=instance, creature_prop__uuid=uuid
                    )
                    statblockprop.manual_ordering = index
                    statblockprop.save()

        return super().update(instance, validated_data)

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

            "properties",
            "_properties",
            "actions",
            "_actions",
            "reactions",
            "_reactions",
            "legendary_actions",
            "_legendary_actions",
        )


class CreaturePropSerializer(CampaignModelSerializer):
    view_name = 'creatureprop-detail'

    class Meta:
        model = CreatureProp
        fields = (
            "uuid",
            "campaign",

            "title",
            "description",
            "save_dc_override",
            "save_source_ability",
            "save_ability",
            "prop_type",

            "attack_type",
            "uses_ability_mod",
            "tohit_bonus_override",
            "reach_range",
            "range_second",
            "num_targets",
            "hit_num_damage_dice",
            "hit_die_size",
            "hit_damage_type",
            "hit_extra_damage_dice",
            "hit_extra_damage_die_size",
            "hit_extra_damage_type",
        )


class StatblockPropSerializer(CampaignModelSerializer):
    view_name = 'statblockprop-detail'

    class Meta:
        model = StatblockProp
        fields = (
            "uuid",
            "campaign",

            "creature_prop",
            "statblock",
            "manual_ordering",
        )
