from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from rest_framework.authtoken.models import Token

from .models import User, Campaign
from .serializers import UserWithPermsSerializer, CampaignSerializer


class UserView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        resp_data = {'user': {}, 'campaigns': []}

        if request.user.is_authenticated:
            resp_data['user'] = UserWithPermsSerializer(
                instance=request.user,
                context={'request': request}
            ).data
            campaigns = Campaign.objects.filter(user=request.user)
            resp_data['campaigns'] = CampaignSerializer(
                many=True,
                instance=campaigns,
                context={'request': request}
            ).data

        return Response(resp_data)


class SignupApiView(APIView):
    authentication_classes = []
    permission_classes = []

    # todo - add decorators like django's built in login view dispath method
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password1 = request.data.get('password1')
        password2 = request.data.get('password2')
        response_content = {}
        if not email:
            response_content['email'] = ['This field may not be blank.']
        if not password1:
            response_content['password1'] = ['This field may not be blank.']
        if not password2:
            response_content['password2'] = ['This field may not be blank.']
        if password1 != password2:
            response_content['password2'] = ['Passwords must match.']
        if response_content:
            # if there's any content yet, it's errors
            return Response(response_content, status=HTTP_400_BAD_REQUEST)

        # ========== #
        # CAUTION!!! #
        # ========== #
        if User.objects.filter(email=email):
            response_content['email'] = ['A user with this email already exists.']
            return Response(response_content, status=HTTP_400_BAD_REQUEST)
        else:
            user = User(email=email)
            user.set_password(password1)
            user.save()
            token, created = Token.objects.get_or_create(user=user)

        return Response(
            {
                'user': UserWithPermsSerializer(instance=user, context={'request': request}).data,
                'token': token.key
            },
            status=HTTP_201_CREATED
        )
