from django.db.models import Q
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin, UpdateModelMixin
from rest_framework.response import Response
from rest_framework.status import HTTP_403_FORBIDDEN

from .models import User, Campaign, CampaignRole
from .serializers import UserSerializer, CampaignSerializer


class UserViewSet(RetrieveModelMixin, ListModelMixin, UpdateModelMixin, GenericViewSet):
    model = User
    serializer_class = UserSerializer
    lookup_field = 'uuid'

    def get_queryset(self):
        if self.request.user.is_authenticated:
            q = Q(id=self.request.user.id)
            q |= Q(campaigns__in=self.request.user.campaigns.all())
            return User.objects.filter(q).distinct()
        else:
            return User.objects.none()

    def update(self, request, *args, **kwargs):
        if request.user == self.get_object():
            return super().update(request, *args, **kwargs)
        return Response({'detail': 'Users can only edit themselves.'}, status=HTTP_403_FORBIDDEN)


class CampaignViewSet(ModelViewSet):
    model = Campaign
    serializer_class = CampaignSerializer
    lookup_field = 'uuid'

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Campaign.objects.filter(user=self.request.user)
        else:
            return Campaign.objects.none()

    def perform_create(self, serializer):
        assert self.request.user.is_authenticated, (
            'Log in to create campaigns.'
        )

        instance = serializer.save()
        CampaignRole.objects.create(user=self.request.user, campaign=instance, is_gm=True)
