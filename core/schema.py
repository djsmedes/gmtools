from graphene_django import DjangoObjectType

from core.models import CampaignOwnedModel


class CampaignOwnedMixin:
    @classmethod
    def get_queryset(cls: DjangoObjectType, queryset, info):
        if not info.context.user.is_authenticated:
            return cls._meta.model.objects.none()

        if issubclass(cls._meta.model, CampaignOwnedModel):
            campaign = info.context.campaign
            if campaign:
                return queryset.filter(campaign=campaign)

            return cls._meta.model.objects.none()
        return queryset
