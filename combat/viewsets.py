from rest_framework.decorators import action
from rest_framework.response import Response

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

    @action(methods=['get'], detail=False)
    def autocomplete(self, request):
        match_str: str = request.query_params.get('match', '')

        response_data = [
            {"text": sblock.name, "value": sblock.uuid}
            for sblock in Statblock.objects.of_requester(request).filter(name__icontains=match_str)
        ]
        return Response(response_data)


class CreaturePropViewSet(CampaignModelViewSet):
    model = CreatureProp
    serializer_class = CreaturePropSerializer

    query_param_filters = {
        "statblock": ParamFilterKwargHelper(
            key="statblock_set__uuid__in",
            validity_checker=lambda x: type(x) == str and len(x) == 22,
        )
    }

    @action(methods=['get'], detail=False)
    def autocomplete(self, request):
        match_str: str = request.query_params.get('match')

        response_data = [
            {"text": cprop.title, "value": cprop.uuid}
            for cprop in CreatureProp.objects.of_requester(request).filter(title__istartswith=match_str)
        ]
        return Response(response_data)


class StatblockPropViewSet(CampaignModelViewSet):
    model = StatblockProp
    serializer_class = StatblockPropSerializer

    query_param_filters = {
        "statblock": ParamFilterKwargHelper(
            key="statblock__uuid__in",
            validity_checker=lambda x: type(x) == str and len(x) == 22,
        )
    }
