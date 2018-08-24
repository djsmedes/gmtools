from .base import *

DEBUG = True

INSTALLED_APPS = INSTALLED_APPS + ['corsheaders', ]

MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware', ] + MIDDLEWARE

CORS_ORIGIN_WHITELIST = ['localhost:8080', ]

INTERNAL_IPS = ('127.0.0.1', )
