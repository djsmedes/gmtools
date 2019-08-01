from .base import *

DEBUG = True
TESTING = True  # useful to determine between prod and test potentially

ALLOWED_HOSTS += ['*']


if get_env_variable('LOG_SQL', False):

    os.makedirs('.logs/', exist_ok=True)

    ANSI_CYAN = chr(27) + '[36m'
    ANSI_RED = chr(27) + '[31m'

    LOGGING = {
        'version': 1,

        # False to include django default logging in addition, True otherwise
        'disable_existing_loggers': False,

        'formatters': {
            'cyan': {
                'format': ANSI_CYAN + '{message}' + ANSI_RED,
                'style': '{'
            },
        },
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
                'formatter': 'cyan',
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
