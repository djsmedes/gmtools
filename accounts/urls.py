from django.urls import path, include

from .views import SignupView


account_patterns = [
    path('', include('authtools.urls')),
    path('signup/', SignupView.as_view(), name='signup')
]

urlpatterns = [
    path('account/', include(account_patterns))
]
