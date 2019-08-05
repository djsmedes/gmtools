import graphene

from graphene_django.types import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from core.models import CampaignOwnedModel
from combat.models import Statblock, CreatureProp


class StatblockType(DjangoObjectType):
    class Meta:
        model = Statblock
        filter_fields = {
            'proficiency': [
                "exact",
                "gte", "lte", "lt", "gt", "isnull"
            ]
        }
        interfaces = (graphene.relay.Node,)

    @classmethod
    def get_queryset(cls, queryset, info):
        if issubclass(cls._meta.model, CampaignOwnedModel):
            campaign = info.context.campaign
            if campaign:
                return queryset.filter(campaign=campaign)

            return cls._meta.model.objects.none()
        return queryset


class CreaturePropType(DjangoObjectType):
    class Meta:
        model = CreatureProp

    prop_type = graphene.Int()


class CombatQuery(object):
    statblock_set = DjangoFilterConnectionField(StatblockType)
    statblock = graphene.relay.Node.Field(StatblockType)
    creatureprop_set = graphene.List(CreaturePropType)
    creatureprop = graphene.Field(CreaturePropType, id=graphene.String())

    # def resolve_statblock_set(self, info, **kwargs):
    #     return Statblock.objects.all()
    #
    # def resolve_statblock(self, info, uuid):
    #     return Statblock.objects.get(uuid=uuid)

    def resolve_creatureprop_set(self, info, **kwargs):
        return CreatureProp.objects.prefetch_related('statblock_set').all()

    def resolve_creatureprop(self, info, id):
        return CreatureProp.objects.get(uuid=id)


class Query(CombatQuery, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query)
