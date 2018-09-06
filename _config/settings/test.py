from .base import *

if get_env_variable('LOCAL', False):
    ALLOWED_HOSTS += [
        '127.0.0.1',
        'localhost'
    ]
else:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

if get_env_variable('FORCE_DEBUG', False):
    DEBUG = True
