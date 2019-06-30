from django.core.signing import Signer, BadSignature
from django.middleware.csrf import rotate_token as rotate_csrf_token
from django.views.generic import TemplateView
from rest_framework import permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from django.utils.cache import patch_vary_headers
from django.conf import settings
import json


def any_of_permissions(permission_list: list):

    class OrPermission(permissions.BasePermission):
        _permission_list = permission_list

        def has_permission(self, request, view):
            return any([p().has_permission(request, view) for p in self._permission_list])

    return OrPermission


class SignaturePermission(permissions.BasePermission):
    SEPARATOR = '/'
    NAMESPACE = None
    RAW_VALUE = 'gmtools'

    def has_permission(self, request, view):
        signature = request.META.get('HTTP_X_GMTOOLS_SIGNATURE', '')
        signer = Signer(sep='/', salt=self.NAMESPACE)
        try:
            return signer.unsign(signature) == self.RAW_VALUE
        except BadSignature:
            return False

    @classmethod
    def gen_gmtools_signature(cls):
        signer = Signer(sep=cls.SEPARATOR, salt=cls.NAMESPACE)
        return signer.sign(cls.RAW_VALUE)


@api_view(['post'])
def login_view(request, *args, **kwargs):
    serializer = AuthTokenSerializer(
        data=json.loads(request.body, encoding='utf-8'),  # request.data
        context={'request': request}
    )
    serializer.is_valid(raise_exception=True)

    rotate_csrf_token(request)

    user = serializer.validated_data['user']
    token, _ = Token.objects.get_or_create(user=user)

    response = Response({})
    response.set_cookie(
        "authToken",
        token.key,
        max_age=1209600,  # 2 weeks, in seconds
        domain=None,
        path='/',
        secure=settings.SECURE_SSL_REDIRECT,
        httponly=False,
        samesite='Lax',
    )
    patch_vary_headers(response, ('Cookie',))  # Set the Vary header since content varies with the CSRF cookie.

    return response


class CsrfRotatingTemplateView(TemplateView):
    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            rotate_csrf_token(request)
        return super().get(request, *args, **kwargs)
