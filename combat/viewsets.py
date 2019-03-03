from core.viewsets import CampaignModelViewSet, UserOwnedModelViewSet, ParamFilterKwargHelper

from .models import Combatant, GMScreenTab, Statblock, CreatureProp, StatblockProp
from .serializers import (
    CombatantSerializer,
    GMScreenTabSerializer,
    StatblockSerializer,
    StatblockPropSerializer,
    CreaturePropSerializer
)


class CombatantViewSet(CampaignModelViewSet):
    model = Combatant
    serializer_class = CombatantSerializer


class GMScreenTabViewSet(UserOwnedModelViewSet):
    model = GMScreenTab
    serializer_class = GMScreenTabSerializer


class StatblockViewSet(CampaignModelViewSet):
    model = Statblock
    serializer_class = StatblockSerializer


class CreaturePropViewSet(CampaignModelViewSet):
    model = CreatureProp
    serializer_class = CreaturePropSerializer

    query_param_filters = {
        "statblock": ParamFilterKwargHelper(
            key="statblock_set__uuid__in",
            validity_checker=lambda x: type(x) == str and len(x) == 22,
        )
    }


class StatblockPropViewSet(CampaignModelViewSet):
    model = StatblockProp
    serializer_class = StatblockPropSerializer

    query_param_filters = {
        "statblock": ParamFilterKwargHelper(
            key="statblock__uuid__in",
            validity_checker=lambda x: type(x) == str and len(x) == 22,
        )
    }
