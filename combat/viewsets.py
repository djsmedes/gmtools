from core.viewsets import CampaignModelViewSet, UserOwnedModelViewSet

from .models import Combatant, GMScreenTab, Statblock
from .serializers import CombatantSerializer, GMScreenTabSerializer, StatblockSerializer


class CombatantViewSet(CampaignModelViewSet):
    model = Combatant
    serializer_class = CombatantSerializer


class GMScreenTabViewSet(UserOwnedModelViewSet):
    model = GMScreenTab
    serializer_class = GMScreenTabSerializer


class StatblockViewSet(CampaignModelViewSet):
    model = Statblock
    serializer_class = StatblockSerializer
