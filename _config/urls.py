"""gmtools URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import ObtainAuthToken

from accounts.viewsets import UserViewSet, CampaignViewSet, InvitationViewSet
from accounts.views import UserView, SignupApiView
from combat.viewsets import CombatantViewSet, GMScreenTabViewSet
from plot.viewsets import EncounterViewSet

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
    prefix='combatant',
    viewset=CombatantViewSet,
    base_name='combatant'
)
router.register(
    prefix='encounter',
    viewset=EncounterViewSet,
    base_name='encounter'
)
router.register(
    prefix='gmscreentab',
    viewset=GMScreenTabViewSet,
    base_name='gmscreentab'
)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token-auth/', ObtainAuthToken.as_view(), name='token-auth'),
    path('api/request-user/', UserView.as_view(), name='request-user-detail'),
    path('api/signup/', SignupApiView.as_view(), name='api-signup'),
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
]

if settings.TESTING:
    urlpatterns += [
        path('admin/', admin.site.urls),
        path('dev/', include('authtools.urls')),
    ]

urlpatterns += [
    # have a final fallback that matches anything that ends in /, send it to vue-router
    #   if it doesn't end in /, APPEND_SLASH django setting causes it to be re-run with
    #   a / appended; if a match is found, sends a redirect to the /-appended url
    re_path(r'^.*/$', TemplateView.as_view(template_name='index.html')),
]
