from rest_framework import serializers

from core.serializers import UUIDHyperlinkedModelSerializer
from .models import User


class UserSerializer(UUIDHyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email',
                  'current_campaign',
                  'uuid', 'url')
