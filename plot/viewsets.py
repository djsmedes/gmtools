from datetime import datetime
from django.db.models import Q

from core.viewsets import CampaignModelViewSet
from .serializers import EncounterSerializer
from .models import Encounter


class EncounterViewSet(CampaignModelViewSet):
    model = Encounter
    serializer_class = EncounterSerializer

    def get_queryset(self):
        qs = self.model.objects.of_requester(self.request)
        comp = self.request.query_params.get('completed_after')
        if comp is None:
            qs = qs.filter(completion_date=None)
        else:
            try:
                comp_date = datetime.strptime(comp, "%Y-%m-%d")
            except ValueError:
                qs = qs.filter(completion_date=None)
            else:
                qs = qs.filter(Q(completion_date__gt=comp_date) | Q(completion_date=None))
        return self.filter_queryset(qs)
