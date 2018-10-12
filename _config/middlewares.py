from django.db import close_old_connections
from channels.sessions import CookieMiddleware
from rest_framework.authentication import TokenAuthentication

AUTH_TOKEN_COOKIE_KEY = 'authToken'


class TokenAuthMiddleware:
    """
    Custom middleware (insecure) that takes user IDs from the query string.
    """

    def __init__(self, inner):
        # Store the ASGI application we were passed
        self.inner = inner

    def __call__(self, scope):
        key = scope['cookies'][AUTH_TOKEN_COOKIE_KEY]
        user, _ = TokenAuthentication().authenticate_credentials(key)
        close_old_connections()
        # Return the inner application directly and let it run everything else
        return self.inner(dict(scope, user=user))


TokenAuthMiddlewareStack = lambda inner: CookieMiddleware(TokenAuthMiddleware(inner))
