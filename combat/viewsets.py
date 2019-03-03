from core.viewsets import CampaignModelViewSet, UserOwnedModelViewSet

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


class StatblockPropViewSet(CampaignModelViewSet):
    model = StatblockProp
    serializer_class = StatblockPropSerializer
