"""The WebSocket routes, as urls.py holds the HTTP ones."""
from django.urls import path

from hold_alerts.consumers import HoldDeskConsumer

websocket_urlpatterns = [
    path("ws/holds/<branch>/", HoldDeskConsumer.as_asgi()),
]
