from .base import *

if get_env_variable('LOCAL', False):
    ALLOWED_HOSTS += [
        '127.0.0.1',
        'localhost'
    ]
else:
    ALLOWED_HOSTS += [
        '.gmtools-test.herokuapp.com'
    ]
    ALLOWED_HOSTS += [
        f'.gmtools-test-pr-{num}.herokuapp.com' for num in range(
            1, 51
        )
    ]
    SECURE_SSL_REDIRECT = True
    CSRF_COOKIE_SECURE = True

if get_env_variable('FORCE_DEBUG', False):
    DEBUG = True

TESTING = True
