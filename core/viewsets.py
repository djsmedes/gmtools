import re
from django.utils.functional import cached_property
from django.http.response import HttpResponseForbidden
from rest_framework.viewsets import ModelViewSet


class ParamFilterKwargHelper:
    def __init__(self, key, validity_checker=None):
        self.key = key
        if validity_checker is None:
            self.validity_checker = lambda _: True
        else:
            self.validity_checker = validity_checker

    def get_kwargs(self, param_value_list):
        return {
            self.key: [
                    val
                    for val in param_value_list
                    if self.validity_checker(val)
                ]
        }

    @staticmethod
    def is_uuid4(tst):
        return re.fullmatch(
            r'[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}',
            tst
        )


class GetParamFilterableMixin(ModelViewSet):
    query_param_filters = {}

    def get_query_param_filters(self):
        return self.query_param_filters

    @cached_property
    def _query_param_filters(self):
        return self.get_query_param_filters()

    def filter_queryset(self, queryset):
        try:
            for param in self.request.query_params:
                if param in self._query_param_filters:
                    f_kwargs = self._query_param_filters[param].get_kwargs(
                        self.request.query_params.getlist(param)
                    )
                    queryset = queryset.filter(**f_kwargs).distinct()
        except Exception as e:
            print(e)
        finally:
            return queryset


class MultiTenantedViewSet(GetParamFilterableMixin, ModelViewSet):
    """An ABSTRACT class, which other model viewsets should inherit from"""
    model = None
    lookup_field = 'uuid'

    def get_queryset(self):
        qs = self.model.objects.of_requester(self.request)
        return self.filter_queryset(qs)

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
