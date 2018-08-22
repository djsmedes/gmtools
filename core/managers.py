from django.db import models


class TenantModelManager(models.Manager):

    def owned_by(self, owner):
        """Get records owned by specific owner

        :param: owner -- the record owner, an accounts.User object
        :rtype: Queryset
        """
        return super().get_queryset().filter(record_owner=owner)

    def of_requester(self, request):
        """Get records owned by the requester

        :param: request -- django request
        :rtype: Queryset
        """
        if request.user.is_authenticated:
            return self.owned_by(request.user)
        else:
            return self.none()
