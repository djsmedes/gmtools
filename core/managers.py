from django.db import models


class CampaignModelManager(models.Manager):

    def of_campaign(self, campaign):
        """Get records for a specific campaign

        :param: campaign -- the campaign the record belongs to, an accounts.Campaign object
        :rtype: Queryset
        """
        return super().get_queryset().filter(campaign=campaign)

    def of_requester(self, request):
        """Get records from the requester's current campaign

        :param: request -- django request
        :rtype: Queryset
        """
        if request.user.is_authenticated and request.user.current_campaign:
            return self.of_campaign(request.user.current_campaign)
        else:
            return self.none()
