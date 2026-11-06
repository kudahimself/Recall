"""The project's asgi.py: HTTP to Django's views, WebSockets to the consumers."""
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

from hold_alerts.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(websocket_urlpatterns),
})
