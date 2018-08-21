from rest_framework import serializers


class LiteSerializer(serializers.HyperlinkedModelSerializer):
    str = serializers.SerializerMethodField(
        method_name=str
    )

    class Meta:
        model = None
        fields = ('str', 'uuid', 'url')
        extra_kwargs = {
            'url': {'lookup_field': 'uuid'}
        }
