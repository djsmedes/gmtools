from core.viewsets import CampaignModelViewSet

from .models import Combatant
from .serializers import CombatantSerializer


class CombatantViewSet(CampaignModelViewSet):
    model = Combatant
    serializer_class = CombatantSerializer
