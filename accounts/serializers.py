from rest_framework import serializers

from core.serializers import LiteSerializer
from .models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email',
                  'uuid', 'url')
        extra_kwargs = {
            'url': {'lookup_field': 'uuid'}
        }


class UserLiteSerializer(LiteSerializer):
    class Meta(LiteSerializer.Meta):
        model = User
