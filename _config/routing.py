from django.urls import path
from channels.routing import ProtocolTypeRouter, URLRouter

from combat.consumers import CombatConsumer
from .middlewares import TokenAuthMiddlewareStack

application = ProtocolTypeRouter({
    'websocket': TokenAuthMiddlewareStack(
        URLRouter([
            path('ws/combat/', CombatConsumer)
        ])
    ),
})
