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

    @action(methods=['post'], detail=True)
    def leave(self, request, uuid):
        campaign: Campaign = self.get_object()
        try:
            campaign_role = CampaignRole.objects.get(user=request.user, campaign=campaign)
        except CampaignRole.DoesNotExist:
            return Response(data={"detail": "You are not associated with a campaign with that ID."}, status=404)

        # don't let the last gm leave the campaign - they must delete it or assign a new GM first
        if campaign_role.is_gm and not CampaignRole.objects.filter(campaign=campaign, is_gm=True).exclude(
                user=request.user).exists():
            return Response(data={
                "detail": (
                    "You cannot leave a campaign as its only GM. "
                    "Either delete the entire campaign or promote another player "
                    "to GM before leaving."
                )
            }, status=400)

        campaign_role.delete()
        return Response(data={"detail": "You have left the campaign."})


class InvitationViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    serializer_class = InvitationSerializer
    lookup_field = 'uuid'

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

        # remove information that could be used to determine whether an email has an account
        if self.joiner is not None:
            response = super().create(request, *args, **kwargs)
            if response.status_code >= 400:
                return response
        return Response(data={
            "detail": "Success"
        })

    def perform_create(self, serializer, **kwargs):
        kwargs['approver'] = self.request.user
        kwargs['joiner'] = self.joiner  # if we don't have a self.joiner, an AttributeError is perfectly appropriate
        serializer.save(**kwargs)

    @action(methods=['post'], detail=True)
    def accept(self, request, uuid):
        invite: Invitation = self.get_object()
        if request.user != invite.joiner:
            return Response(status=403)

        try:
            invite.accept()
        except Invitation.ApproverNotAuthorized:
            return Response(data={
                "detail": "The user who invited you is not authorized to admit new users to this campaign."
            }, status=400)
        except Invitation.Expired:
            return Response(data={
                "detail": "The invitation has expired."
            }, status=400)

        return Response({
            "detail": "Invitation accepted"
        })

    @action(methods=['post'], detail=True)
    def reject(self, request, uuid):
        invite: Invitation = self.get_object()
        if request.user != invite.joiner:
            return Response(status=403)

        invite.reject()
        return Response({
            "detail": "Invitation rejected"
        })
