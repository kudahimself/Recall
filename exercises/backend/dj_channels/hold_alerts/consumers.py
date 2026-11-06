"""WebSockets with Django Channels: a consumer for the hold-desk screens.

Write HoldDeskConsumer so the tests in test_hold_alerts.py pass.
"""
from channels.generic.websocket import AsyncJsonWebsocketConsumer

BRANCHES = {"north", "south"}


class HoldDeskConsumer(AsyncJsonWebsocketConsumer):
    """One open socket from a hold-desk screen at a branch, /ws/holds/<branch>/."""

    async def connect(self):
        """Refuse a branch not in BRANCHES; otherwise join the group "holds_<branch>" and accept."""
        # TODO
        raise NotImplementedError

    async def disconnect(self, code):
        """Leave the branch's group (a refused socket never joined one)."""
        # TODO
        raise NotImplementedError

    async def receive_json(self, content, **kwargs):
        """A screen marks a hold ready with {"title": "Dune"}.

        Send the event {"type": "hold.ready", "title": ..., "branch": ...} to the branch's group.
        A message with no title gets {"error": "title missing"} back on this socket only.
        """
        # TODO
        raise NotImplementedError

    # TODO: the method each group member runs for a "hold.ready" event:
    # it sends {"ready": <title>, "branch": <branch>} down this member's own socket.
