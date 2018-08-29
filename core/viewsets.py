from django.http.response import HttpResponseForbidden
from django.utils.encoding import force_text
from rest_framework.viewsets import ModelViewSet
from rest_framework.metadata import SimpleMetadata
from rest_framework.relations import RelatedField, ManyRelatedField


class TenantMetaData(SimpleMetadata):

    def get_field_info(self, field):
        field_info = super().get_field_info(field)
        if isinstance(field, (RelatedField, ManyRelatedField)):
            field_info['choices'] = [
                {
                    'value': choice_value,
                    'display_name': force_text(choice_name, strings_only=True)
                }
                for choice_value, choice_name in field.get_choices().items()
            ]
        return field_info


class BaseModelViewSet(ModelViewSet):
    """An ABSTRACT class, which other model viewsets should inherit from"""
    model = None  # model should inherit from TenantModel
    lookup_field = 'uuid'
    metadata_class = TenantMetaData

    def get_queryset(self):
        return self.model.objects.of_requester(self.request)

    def perform_create(self, serializer):
        record_owner = self.request.user
        assert record_owner.is_authenticated, (
            'Log in to create objects.'
        )
        serializer.save(record_owner=record_owner)

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
