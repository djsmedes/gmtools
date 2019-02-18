from django.db import close_old_connections
from django.contrib.auth.models import AnonymousUser
from channels.sessions import CookieMiddleware
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

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
