from django.urls import path, include
from django.views.generic import TemplateView

from .views import SignupView


account_patterns = [
    path('', include('authtools.urls')),
    path('', TemplateView.as_view(template_name='registration/options.html'), name='account-options'),
    path('signup/', SignupView.as_view(), name='signup'),
]

urlpatterns = [
    path('account/', include(account_patterns))
]
