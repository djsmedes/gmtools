import graphene

from combat.schema import CombatQuery
from plot.schema import EncounterQuery
from accounts.schema import AccountsQuery


class Query(AccountsQuery, EncounterQuery, CombatQuery, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query)
