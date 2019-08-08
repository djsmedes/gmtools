from graphene import relay
from graphene_django.types import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from .models import Combatant
from core.schema import CampaignOwnedMixin


class CombatantType(CampaignOwnedMixin, DjangoObjectType):
    class Meta:
        model = Combatant
        fields = (
            "uuid",
            "name",
            "initiative",
            "initiative_bonus",
            "hp",
            "max_hp",
            "temp_hp",
            "encounter",
            "campaign",
        )
        filter_fields = {
            "initiative": ["exact", "gte"],
        }
        interfaces = (relay.Node,)


class CombatQuery:
    combatant_set = DjangoFilterConnectionField(CombatantType)
    combatant = relay.Node.Field(CombatantType)
