from django.db.models import Q
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin, UpdateModelMixin
from rest_framework.response import Response
from rest_framework.status import HTTP_403_FORBIDDEN
from rest_framework.decorators import action

from .models import User, Campaign
from .serializers import UserSerializer, CampaignSerializer


class UserViewSet(RetrieveModelMixin, ListModelMixin, UpdateModelMixin, GenericViewSet):
    model = User
    serializer_class = UserSerializer
    lookup_field = 'slug'
    queryset = User.objects.all()

    def update(self, request, *args, **kwargs):
        if request.user == self.get_object():
            return super().update(request, *args, **kwargs)
        return Response({'detail': 'Users can only edit themselves.'}, status=HTTP_403_FORBIDDEN)

    @action(methods=['post'], detail=True)
    def set_active_campaign(self, request, slug=None, *args, **kwargs):
        print(slug)
        print(args)
        print(kwargs)
        return Response({})


class CampaignViewSet(ModelViewSet):
    model = Campaign
    serializer_class = CampaignSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Campaign.objects.filter(Q(gm_set=self.request.user) | Q(player_set=self.request.user))
        else:
            return Campaign.objects.none()

    def perform_create(self, serializer):
        assert self.request.user.is_authenticated, (
            'Log in to create campaigns.'
        )

        serializer.save(gm_set=[self.request.user])
