from rest_framework import serializers


class LiteSerializer(serializers.HyperlinkedModelSerializer):
    def get_str(self, val):
        return str(val)

    str = serializers.SerializerMethodField()

    class Meta:
        model = None
        fields = ('str', 'uuid', 'url')
        extra_kwargs = {
            'url': {'lookup_field': 'uuid'}
        }
