from django.db.models import Q
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin, UpdateModelMixin, CreateModelMixin
from rest_framework.response import Response
from rest_framework.status import HTTP_403_FORBIDDEN
from rest_framework.decorators import action
from django.core.validators import validate_email, ValidationError

from .models import User, Campaign, CampaignRole, Invitation
from .serializers import UserSerializer, CampaignSerializer, InvitationSerializer


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


class InvitationViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    serializer_class = InvitationSerializer

    def get_queryset(self):
        return Invitation.get_current_invites().filter(joiner=self.request.user)

    @action(methods=['get'], detail=False)
    def sent(self, request):
        ser = InvitationSerializer(
            many=True,
            instance=Invitation.get_current_invites().filter(approver=self.request.user)
        )
        return Response(ser.data)

    def create(self, request, *args, **kwargs):
        campaign = request.data.get('campaign')
        try:
            if not request.user.campaigns.filter(campaignrole__is_gm=True).filter(uuid=campaign):
                return Response(data={
                    "detail": "You do not have permission to create an invitation for this campaign"
                }, status=403)
        except Exception as e:
            print(repr(e))  # really just trying to catch malformed uuids here
            return Response(status=400)

        joiner_identifier = request.data.get('joiner_external_identifier')
        try:
            validate_email(joiner_identifier)
        except ValidationError:
            return Response(data={
                "joiner_external_identifier": ["Only invitations using email addresses are currently supported."]
            }, status=400)

        try:
            self.joiner = User.objects.get(email=joiner_identifier)
        except User.DoesNotExist:
            self.joiner = None

        if self.joiner is None:
            return Response(status=400)  # todo - write this in a way that obscures whether there is a user with this email address

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer, **kwargs):
        kwargs['approver'] = self.request.user
        kwargs['joiner'] = self.joiner  # if we don't have a self.joiner, an AttributeError is perfectly appropriate
        serializer.save(**kwargs)
