from core.viewsets import BaseModelViewSet

from .models import Combatant
from .serializers import CombatantSerializer


class CombatantViewSet(BaseModelViewSet):
    model = Combatant
    serializer_class = CombatantSerializer
