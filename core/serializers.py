from rest_framework import serializers


class UUIDHyperlinkedModelSerializer(serializers.HyperlinkedModelSerializer):
    record_owner = serializers.HyperlinkedRelatedField(
        read_only=True,
        view_name='user-detail',
        lookup_field='uuid'
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            if isinstance(field, serializers.HyperlinkedRelatedField):
                kwargs = field._kwargs
                kwargs['lookup_field'] = 'uuid'
                self.fields[field.field_name] = type(field)(**kwargs)
