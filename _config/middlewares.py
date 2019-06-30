from typing import Optional
from django.db import close_old_connections
from channels.sessions import CookieMiddleware
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import AnonymousUser
from django.http import HttpResponseBadRequest
from rest_framework.authentication import TokenAuthentication
from rest_framework import exceptions as drf_exceptions
from uuid import UUID

from accounts.models import Campaign, CampaignRole



AUTH_TOKEN_COOKIE_KEY = 'authToken'


class TokenAuthMiddleware:

    def __init__(self, inner):
        # Store the ASGI application we were passed
        self.inner = inner

    def __call__(self, scope):
        key = scope['cookies'].get(AUTH_TOKEN_COOKIE_KEY)
        try:
            user, _ = TokenAuthentication().authenticate_credentials(key)
        except AuthenticationFailed:
            user = AnonymousUser()
        close_old_connections()
        # Return the inner application directly and let it run everything else
        return self.inner(dict(scope, user=user))


TokenAuthMiddlewareStack = lambda inner: CookieMiddleware(TokenAuthMiddleware(inner))


class AuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token_auth_checker = TokenAuthentication()
        user = None
        try:
            auth = token_auth_checker.authenticate(request)
            if auth is None:
                tokenKey = request.COOKIES.get('authToken')
                if tokenKey is not None:
                    auth = token_auth_checker.authenticate_credentials(tokenKey)
            if auth is not None:
                user = auth[0]
        except drf_exceptions.AuthenticationFailed:
            pass

        request.user = user or AnonymousUser()
        return self.get_response(request)


class InvalidUserCampaignPair(Exception):
    pass


def get_campaign_from_request(request):
    campaign_role: Optional[CampaignRole] = None
    campaign_uuid = request.META.get('HTTP_X_GMTOOLS_CAMPAIGN')
    if campaign_uuid is not None:
        try:
            campaign_uuid = UUID(campaign_uuid)
        except (ValueError, AttributeError):
            raise InvalidUserCampaignPair

        if request.user.is_superuser or request.user.is_staff:
            try:
                return Campaign.objects.get(uuid=campaign_uuid), True
            except Campaign.DoesNotExist:
                raise InvalidUserCampaignPair

        try:
            campaign_role = CampaignRole.objects.select_related(
                'campaign'
            ).get(
                campaign__uuid=campaign_uuid,
                user=request.user,
            )
        except CampaignRole.DoesNotExist:
            # don't catch MultipleObjectsReturned because that shouldn't happen, so we do want the
            #   500 error in that case
            raise InvalidUserCampaignPair
    else:  # org_uuid is None
        try:
            campaign_role = CampaignRole.objects.select_related(
                'campaign'
            ).get(
                campaign_id=request.user.current_campaign_id,
                user=request.user
            )
        except CampaignRole.DoesNotExist:
            # don't catch MultipleObjectsReturned because that shouldn't happen, so we do want the
            #   500 error in that case
            raise InvalidUserCampaignPair

    if campaign_role is not None:
        return campaign_role.campaign, campaign_role.is_gm
    else:
        return None, False


class CampaignMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.campaign = None
        request.from_gm = False
        if request.user and request.user.is_authenticated:
            try:
                request.campaign, request.from_gm = get_campaign_from_request(request)
            except InvalidUserCampaignPair:
                return HttpResponseBadRequest(content=b'Invalid authentication, organization pair')
        return self.get_response(request)
