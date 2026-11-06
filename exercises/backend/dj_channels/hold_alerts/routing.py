"""The WebSocket routes, as urls.py holds the HTTP ones."""
from django.urls import path  # noqa: F401

from hold_alerts.consumers import HoldDeskConsumer  # noqa: F401

# TODO: route ws/holds/<branch>/ to HoldDeskConsumer.
websocket_urlpatterns = []
