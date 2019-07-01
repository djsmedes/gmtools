from django.core.exceptions import ValidationError
from django.core.signing import Signer, BadSignature
from django.core.validators import validate_email
from django.middleware.csrf import rotate_token as rotate_csrf_token
from django.views.generic import TemplateView
from rest_framework import permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes, throttle_classes
from rest_framework.throttling import AnonRateThrottle
from rest_framework.authtoken.models import Token
from django.utils.cache import patch_vary_headers
from django.contrib.auth import get_user_model, password_validation
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


def handle_auth_cookies(request, response, token_key):
    rotate_csrf_token(request)
    response.set_cookie(
        "authToken",
        token_key,
        max_age=1209600,  # 2 weeks, in seconds
        domain=None,
        path='/',
        secure=settings.SECURE_SSL_REDIRECT,
        httponly=False,
        samesite='Lax',
    )
    patch_vary_headers(response, ('Cookie',))  # Set the Vary header since content varies with the CSRF cookie.

    return response


class AuthThrottle(AnonRateThrottle):
    rate = '6/minute'


@api_view(['post'])
@throttle_classes([AuthThrottle])
def login_view(request, *args, **kwargs):
    serializer = AuthTokenSerializer(
        data=json.loads(request.body, encoding='utf-8'),  # request.data
        context={'request': request}
    )
    serializer.is_valid(raise_exception=True)

    user = serializer.validated_data['user']
    token, _ = Token.objects.get_or_create(user=user)

    response = Response({})
    return handle_auth_cookies(request, response, token.key)


@api_view(['post'])
@permission_classes([])
@authentication_classes([])
@throttle_classes([AuthThrottle])
def signup_view(request, *args, **kwargs):
    email = request.data.get('email')
    password1 = request.data.get('password1')
    password2 = request.data.get('password2')
    response_content = {}

    User = get_user_model()
    user = User(email=email)

    # ==================== #
    # Check for bad inputs #
    # ==================== #
    if not email:
        response_content['email'] = ['This field may not be blank.']
    if not password1:
        response_content['password1'] = ['This field may not be blank.']
    if not password2:
        response_content['password2'] = ['This field may not be blank.']
    if password1 != password2:
        response_content['password2'] = ['Passwords must match.']
    try:
        validate_email(email)
    except ValidationError:
        response_content['email'] = ['Invalid email address.']
    try:
        password_validation.validate_password(password1, user)
    except ValidationError as e:
        response_content['password1'] = e.messages

    if response_content:
        # if there's any content yet, it's errors
        return Response(response_content, status=400)

    # ========== #
    # CAUTION!!! #
    # ========== #
    if User.objects.filter(email=email):
        response_content['email'] = ['A user with this email already exists.']
        return Response(response_content, status=400)
    else:
        user.set_password(password1)
        user.save()
        token, created = Token.objects.get_or_create(user=user)

    response = Response(response_content, status=201)
    return handle_auth_cookies(request, response, token.key)


@api_view(['get'])
def password_requirements(request, *args, **kwargs):
    return Response(password_validation.password_validators_help_texts())


class CsrfRotatingTemplateView(TemplateView):
    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            rotate_csrf_token(request)
        return super().get(request, *args, **kwargs)
