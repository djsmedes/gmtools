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
    ALLOWED_HOSTS += ['.gmtools-test-pr-{}.herokuapp.com'.format(num) for num in range(1, 51)]
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

if get_env_variable('FORCE_DEBUG', False):
    DEBUG = True
