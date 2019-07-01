from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Campaign
from .serializers import CampaignSerializer, UserSerializer


class UserView(APIView):

    def get(self, request, *args, **kwargs):
        resp_data = {'user': {}, 'campaigns': []}

        if request.user.is_authenticated:
            resp_data['user'] = UserSerializer(
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
