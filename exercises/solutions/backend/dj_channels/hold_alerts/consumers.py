"""WebSockets with Django Channels: a consumer for the hold-desk screens.

Write HoldDeskConsumer so the tests in test_hold_alerts.py pass.
"""
from channels.generic.websocket import AsyncJsonWebsocketConsumer

BRANCHES = {"north", "south"}


class HoldDeskConsumer(AsyncJsonWebsocketConsumer):
    """One open socket from a hold-desk screen at a branch, /ws/holds/<branch>/."""

    async def connect(self):
        branch = self.scope["url_route"]["kwargs"]["branch"]
        if branch not in BRANCHES:
            await self.close()
            return
        self.branch = branch
        self.group = f"holds_{branch}"
        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        if hasattr(self, "group"):
            await self.channel_layer.group_discard(self.group, self.channel_name)

    async def receive_json(self, content, **kwargs):
        title = content.get("title")
        if not title:
            await self.send_json({"error": "title missing"})
            return
        await self.channel_layer.group_send(
            self.group, {"type": "hold.ready", "title": title, "branch": self.branch})

    async def hold_ready(self, event):
        await self.send_json({"ready": event["title"], "branch": event["branch"]})
