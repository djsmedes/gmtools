from django.db import models


class CampaignModelManager(models.Manager):

    def of_campaign(self, campaign):
        """Get records for a specific campaign

        :param: campaign -- the campaign the record belongs to, an accounts.Campaign object
        :rtype: Queryset
        """
        return super().get_queryset().filter(campaign=campaign)

    def of_user(self, user):
        """Get records from the requester's current campaign

        :param: user -- django user
        :rtype: Queryset
        """
        if user.is_authenticated:
            return super().get_queryset().filter(campaign__in=user.campaigns.all())
        else:
            return self.none()

    def of_requester(self, request):
        """Get records from the requester's current campaign

        :param: request -- django request
        :rtype: Queryset
        """
        return self.of_campaign(request.campaign)


class UserModelManager(models.Manager):

    def of_user(self, user):
        """Get records from specific user

        :param: user -- django user
        :rtype: Queryset
        """
        if user.is_authenticated:
            return super().get_queryset().filter(user=user)
        else:
            return self.none()

    def of_requester(self, request):
        """Get records from the request's user

        :param: request -- django request
        :rtype: Queryset
        """
        return self.of_user(request.user)
