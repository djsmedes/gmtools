from core.viewsets import CampaignModelViewSet, UserOwnedModelViewSet

from .models import Combatant, GMScreenTab
from .serializers import CombatantSerializer, GMScreenTabSerializer


class CombatantViewSet(CampaignModelViewSet):
    model = Combatant
    serializer_class = CombatantSerializer


class GMScreenTabViewSet(UserOwnedModelViewSet):
    model = GMScreenTab
    serializer_class = GMScreenTabSerializer
