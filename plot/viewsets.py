from core.viewsets import CampaignModelViewSet
from .serializers import EncounterSerializer
from .models import Encounter


class EncounterViewSet(CampaignModelViewSet):
    model = Encounter
    serializer_class = EncounterSerializer
