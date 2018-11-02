from rest_framework.response import Response
from rest_framework.decorators import action

from core.viewsets import CampaignModelViewSet
from .serializers import EncounterSerializer
from .models import Encounter


class EncounterViewSet(CampaignModelViewSet):
    model = Encounter
    serializer_class = EncounterSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).filter(completion_date__isnull=True)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['get'], detail=False, url_path='completed')
    def get_completed_encounters(self, request):
        qs = self.model.objects.of_requester(request).filter(completion_date__isnull=False)
        serializer = self.serializer_class(instance=qs, many=True, context={'request': request})
        return Response(serializer.data)
