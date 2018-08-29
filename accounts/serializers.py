from rest_framework import serializers

from core.serializers import BaseModelSerializer
from .models import User


class UserSerializer(BaseModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        lookup_field='uuid',
        view_name='user-detail',
    )

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email',
                  'current_campaign',
                  'uuid', 'url')
