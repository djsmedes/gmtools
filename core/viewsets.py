from django.http.response import HttpResponseForbidden
from django.utils.encoding import force_text
from rest_framework.viewsets import ModelViewSet
from rest_framework.metadata import SimpleMetadata
from rest_framework.relations import RelatedField, ManyRelatedField


class ChoicesMetaData(SimpleMetadata):

    def get_field_info(self, field):
        field_info = super().get_field_info(field)
        if isinstance(field, (RelatedField, ManyRelatedField)):
            field_info['choices'] = [
                {
                    'value': choice_value,
                    'text': force_text(choice_name, strings_only=True)
                }
                for choice_value, choice_name in field.get_choices().items()
            ]
        return field_info


class MultiTenantedViewSet(ModelViewSet):
    """An ABSTRACT class, which other model viewsets should inherit from"""
    model = None
    lookup_field = 'uuid'
    metadata_class = ChoicesMetaData

    def get_queryset(self):
        return self.model.objects.of_requester(self.request)

    # object-level permissions
    create_permission = None
    retrieve_permission = None
    update_permission = None
    destroy_permission = None

    def _has_permission(self, which_permission, request, uuid):
        if not which_permission:
            return True
        if not uuid:
            return False
        user = request.user
        obj = self.model.objects.of_requester(request).get(uuid=uuid)
        if user.has_perm(which_permission, obj):
            return True
        return False

    def _permission_wrapper_function(self, success_function, which_permission, request, *args, **kwargs):
        if self._has_permission(which_permission, request, kwargs.get('uuid', None)):
            return success_function(request, *args, **kwargs)
        else:
            return HttpResponseForbidden()

    def create(self, request, *args, **kwargs):
        return self._permission_wrapper_function(
            super().create, self.create_permission, request, *args, **kwargs
        )

    def retrieve(self, request, *args, **kwargs):
        return self._permission_wrapper_function(
            super().retrieve, self.retrieve_permission, request, *args, **kwargs
        )

    def update(self, request, *args, **kwargs):
        return self._permission_wrapper_function(
            super().update, self.update_permission, request, *args, **kwargs
        )

    def destroy(self, request, *args, **kwargs):
        return self._permission_wrapper_function(
            super().destroy, self.destroy_permission, request, *args, **kwargs
        )


class CampaignModelViewSet(MultiTenantedViewSet):
    """self.model should inherit from CampaignOwnedModel"""

    def perform_create(self, serializer):
        assert self.request.user.is_authenticated, (
            'Log in to create objects.'
        )
        campaign = self.request.user.current_campaign
        assert campaign, (
            'Choose a campaign to create objects.'
        )

        serializer.save(campaign=campaign)


class UserOwnedModelViewSet(MultiTenantedViewSet):
    """self.model should inherit from UserOwnedModel"""

    def perform_create(self, serializer):
        assert self.request.user.is_authenticated, (
            'Log in to create objects.'
        )
        serializer.save(user=self.request.user)
