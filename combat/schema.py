from graphene import relay, Int
from graphene_django.types import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from .models import Combatant
from core.schema import CampaignOwnedMixin


class CountableConnection(relay.Connection):
    """
    from:
    https://github.com/graphql-python/graphene-django/issues/162
    """

    class Meta:
        abstract = True

    total_count = Int()

    def resolve_total_count(self, info, **kwargs):
        return self.iterable.count()


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
            "name": ["exact", "iexact", "contains", "icontains"],
        }
        interfaces = (relay.Node,)
        connection_class = CountableConnection


class CombatQuery:
    combatant_set = DjangoFilterConnectionField(CombatantType)
    combatant = relay.Node.Field(CombatantType)
