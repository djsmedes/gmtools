import graphene

from graphene_django.types import DjangoObjectType
from graphene_django_extras.fields import DjangoFilterListField

from core.models import CampaignOwnedModel
from combat.models import CreatureProp


class CampaignOwnedMixin:
    @classmethod
    def get_queryset(cls, queryset, info):
        if issubclass(cls._meta.model, CampaignOwnedModel):
            campaign = info.context.campaign
            if campaign:
                return queryset.filter(campaign=campaign)

            return cls._meta.model.objects.none()
        return queryset


class CreaturePropType(CampaignOwnedMixin, DjangoObjectType):
    class Meta:
        model = CreatureProp
        filter_fields = {
            "prop_type": {
                "exact",
                "gt",
                "lt",
            },
            "title": {
                "exact",
                "icontains",
            }
        }


class CombatQuery(object):
    creatureprop_set = DjangoFilterListField(CreaturePropType)
    creatureprop = graphene.Field(CreaturePropType, id=graphene.String())


class Query(CombatQuery, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query)
