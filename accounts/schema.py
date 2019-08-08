from graphene import relay
from graphene_django.types import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from .models import Campaign


class CampaignType(DjangoObjectType):
    class Meta:
        model = Campaign
        fields = (
            "uuid",
            "name",
            "creation_date",
            "active_encounter"
        )
        filter_fields = {
            "creation_date": ["exact", "lt", "lte", "gt", "gte"],
        }
        interfaces = (relay.Node,)


class AccountsQuery:
    campaign_set = DjangoFilterConnectionField(CampaignType)
