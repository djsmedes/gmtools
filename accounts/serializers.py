from rest_framework import serializers

from .models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email',
                  'uuid', 'url')
        extra_kwargs = {
            'url': {'lookup_field': 'uuid'}
        }
