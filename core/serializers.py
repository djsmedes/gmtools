import json
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from .managers import CampaignModelManager, UserModelManager


class MultiTenantedModelSerializer(serializers.ModelSerializer):
    view_name = None

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            if isinstance(field, PrimaryKeyRelatedField):
                self.fields[field_name] = self.gen_uuid_field(field)
            elif isinstance(field._kwargs.get('child_relation'), PrimaryKeyRelatedField):
                kwargs = field._kwargs
                kwargs['child_relation'] = self.gen_uuid_field(kwargs.pop('child_relation'))
                self.fields[field_name] = type(field)(**kwargs)
        if self.view_name and self.context.get('request'):
            self.fields['url'] = serializers.HyperlinkedIdentityField(
                view_name=self.view_name,
                lookup_field='uuid'
            )

    def transform_queryset(self, queryset):
        if isinstance(queryset, (CampaignModelManager, UserModelManager)):
            if self.user:
                return queryset.of_user(self.user)
            elif self.root.context.get('request'):
                return queryset.of_requester(self.root.context.get('request'))
            else:
                return queryset.none()
        else:
            return queryset

    def gen_uuid_field(self, field):
        kwargs = field._kwargs
        kwargs['slug_field'] = 'uuid'
        if kwargs.get('queryset'):
            kwargs['queryset'] = self.transform_queryset(kwargs.pop('queryset'))
        return serializers.SlugRelatedField(**kwargs)


class CampaignModelSerializer(MultiTenantedModelSerializer):
    campaign = serializers.SlugRelatedField(
        read_only=True,
        slug_field='uuid'
    )


class UserOwnedModelSerializer(MultiTenantedModelSerializer):
    user = serializers.SlugRelatedField(
        read_only=True,
        slug_field='uuid'
    )


class ClientControlledJSONField(serializers.Field):
    def to_representation(self, value):
        return json.loads(value)

    def to_internal_value(self, data):
        # store empty JSON objects/lists as NULL
        return json.dumps(data) or None
