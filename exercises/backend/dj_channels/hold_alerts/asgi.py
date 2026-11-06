"""The project's asgi.py: HTTP to Django's views, WebSockets to the consumers."""
from channels.routing import ProtocolTypeRouter, URLRouter  # noqa: F401
from django.core.asgi import get_asgi_application  # noqa: F401

from hold_alerts.routing import websocket_urlpatterns  # noqa: F401

# TODO: a ProtocolTypeRouter that sends "http" to Django's ASGI app
# and "websocket" to a URLRouter of websocket_urlpatterns.
application = None
