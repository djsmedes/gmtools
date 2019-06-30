from .base import *

DEBUG = True
TESTING = True  # useful to determine between prod and test potentially

ALLOWED_HOSTS += ['*']

if get_env_variable('LOG_SQL', False):

    os.makedirs('.logs/', exist_ok=True)

    LOGGING = {
        'version': 1,
        'disable_existing_loggers': True,  # False to include django default logging in addition, True otherwise
        'filters': {
            'require_debug_true': {
                '()': 'django.utils.log.RequireDebugTrue',
            }
        },
        'handlers': {
            'console': {
                'level': 'DEBUG',
                'filters': ['require_debug_true'],
                'class': 'logging.StreamHandler',
            },
            'file': {
                'level': 'DEBUG',
                'filters': ['require_debug_true'],
                'class': 'logging.handlers.RotatingFileHandler',
                'filename': '.logs/sql.log',
            }
        },
        'loggers': {
            'django.db.backends': {
                'level': 'DEBUG',
                'handlers': ['console']  # ['file'] or ['console'] (uses handlers defined above)
            }
        }
    }
