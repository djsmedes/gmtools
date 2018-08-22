from core.viewsets import BaseModelViewSet
from .models import Campaign
from .serializers import CampaignSerializer


class CampaignViewSet(BaseModelViewSet):
    model = Campaign
    serializer_class = CampaignSerializer
