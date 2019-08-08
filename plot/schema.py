from graphene import relay
from graphene_django.types import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from .models import Encounter
from core.schema import CampaignOwnedMixin


class EncounterType(CampaignOwnedMixin, DjangoObjectType):
    class Meta:
        model = Encounter
        fields = (
            "uuid",
        )
        filter_fields = {
            "uuid": ["exact"]
        }
        interfaces = (relay.Node,)


class EncounterQuery:
    encounter_set = DjangoFilterConnectionField(EncounterType)
