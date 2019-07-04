from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter

from accounts.viewsets import UserViewSet, CampaignViewSet, InvitationViewSet
from accounts.views import UserView
from combat.viewsets import (
    CombatantViewSet,
    GMScreenTabViewSet,
    StatblockViewSet,
    CreaturePropViewSet,
    StatblockPropViewSet,
)
from plot.viewsets import EncounterViewSet
from core.auth import CsrfRotatingTemplateView as TemplateView, login_view, signup_view, password_requirements
from vendor.spotify.views import spotify_auth

router = DefaultRouter()

router.register(
    prefix='user',
    viewset=UserViewSet,
    base_name='user'
)
router.register(
    prefix='campaign',
    viewset=CampaignViewSet,
    base_name='campaign'
)
router.register(
    prefix='invitation',
    viewset=InvitationViewSet,
    base_name='invitation'
)

router.register(
    prefix='encounter',
    viewset=EncounterViewSet,
    base_name='encounter'
)

router.register(
    prefix='combatant',
    viewset=CombatantViewSet,
    base_name='combatant'
)
router.register(
    prefix='gmscreentab',
    viewset=GMScreenTabViewSet,
    base_name='gmscreentab'
)
router.register(
    prefix='statblock',
    viewset=StatblockViewSet,
    base_name='statblock'
)
router.register(
    prefix='creatureprop',
    viewset=CreaturePropViewSet,
    base_name='creatureprop'
)
router.register(
    prefix='statblockprop',
    viewset=StatblockPropViewSet,
    base_name='statblockprop'
)


urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token-auth/', login_view, name='token-auth'),
    path('api/request-user/', UserView.as_view(), name='request-user-detail'),
    path('api/signup/', signup_view, name='api-signup'),
    path('api/password-reqs/', password_requirements, name='password-reqs'),
    path('api/spotify-auth/', spotify_auth, name='spotify-auth'),
]

urlpatterns += [
    # have a final fallback that matches anything that ends in /, send it to vue-router
    #   if it doesn't end in /, APPEND_SLASH django setting causes it to be re-run with
    #   a / appended; if a match is found, sends a redirect to the /-appended url
    re_path(r'^(.*/$|$)', TemplateView.as_view(template_name='index.html'), name='app'),
]
