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
                self.fields[field_name] = type(field)(**kwargs)
            elif field._kwargs.get('child_relation'):
                kwargs = field._kwargs
                child_relation = kwargs.pop('child_relation')
                child_relation_kwargs = child_relation._kwargs
                child_relation_kwargs['lookup_field'] = 'uuid'
                child_relation = type(child_relation)(**child_relation_kwargs)
                kwargs['child_relation'] = child_relation
                self.fields[field_name] = type(field)(
                    **kwargs
                )
