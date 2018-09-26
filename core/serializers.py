from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from .managers import CampaignModelManager


class CampaignModelSerializer(serializers.ModelSerializer):
    campaign = serializers.SlugRelatedField(
        read_only=True,
        slug_field='uuid'
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            if isinstance(field, PrimaryKeyRelatedField):
                self.fields[field_name] = self.gen_uuid_field(field)
            elif field._kwargs.get('child_relation'):
                kwargs = field._kwargs
                kwargs['child_relation'] = self.gen_uuid_field(kwargs.pop('child_relation'))
                self.fields[field_name] = type(field)(**kwargs)

    def transform_queryset(self, queryset):
        if isinstance(queryset, CampaignModelManager):
            return queryset.of_requester(self.root.context.get('request'))
        else:
            return queryset

    def gen_uuid_field(self, field):
        kwargs = field._kwargs
        kwargs['slug_field'] = 'uuid'
        if kwargs.get('queryset'):
            kwargs['queryset'] = self.transform_queryset(kwargs.pop('queryset'))
        return serializers.SlugRelatedField(**kwargs)
