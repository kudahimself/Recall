"""Check the hold-desk sockets in this process: no ASGI server, Redis or browser.

Each WebsocketCommunicator plays a browser opening a socket on the app, and the
channel layer is Channels' in-memory one, which the settings fixture sets from layers.py.
"""
import asyncio

import pytest
from channels.layers import get_channel_layer
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.testing import WebsocketCommunicator

from hold_alerts.layers import channel_layers
from hold_alerts.routing import websocket_urlpatterns

IN_MEMORY = "channels.layers.InMemoryChannelLayer"


@pytest.fixture(autouse=True)
def in_memory_layer(settings):
    """A fresh in-memory channel layer for every test, from your layers.py."""
    settings.CHANNEL_LAYERS = channel_layers(production=False)
    if settings.CHANNEL_LAYERS.get("default", {}).get("BACKEND") != IN_MEMORY:
        pytest.fail("channel_layers(production=False) should use Channels' InMemoryChannelLayer")


@pytest.fixture
def app():
    if not websocket_urlpatterns:
        pytest.fail("route ws/holds/<branch>/ to HoldDeskConsumer in routing.py")
    return URLRouter(websocket_urlpatterns)


def run(coro):
    return asyncio.run(coro)


async def open_screens(app, *paths):
    screens = [WebsocketCommunicator(app, p) for p in paths]
    for screen in screens:
        connected, _ = await screen.connect()
        assert connected, f"{screen.scope['path']} should be accepted"
    return screens


async def close_all(*screens):
    for screen in screens:
        await screen.disconnect()


def test_production_talks_through_redis():
    layers = channel_layers(production=True)
    assert layers["default"]["BACKEND"] == "channels_redis.core.RedisChannelLayer"
    assert layers["default"]["CONFIG"]["hosts"] == [("redis", 6379)]


def test_a_screen_at_a_branch_is_accepted(app):
    async def go():
        screen = WebsocketCommunicator(app, "/ws/holds/north/")
        connected, _ = await screen.connect()
        assert connected
        await screen.disconnect()
    run(go())


def test_an_unknown_branch_is_refused(app):
    async def go():
        screen = WebsocketCommunicator(app, "/ws/holds/east/")
        connected, _ = await screen.connect()
        assert not connected, "close() the socket in connect for a branch not in BRANCHES"
        await screen.disconnect()
    run(go())


def test_a_ready_hold_reaches_every_screen_at_the_branch_sender_included(app):
    async def go():
        front, back, south = await open_screens(
            app, "/ws/holds/north/", "/ws/holds/north/", "/ws/holds/south/")
        await back.send_json_to({"title": "Dune"})
        assert await front.receive_json_from() == {"ready": "Dune", "branch": "north"}
        assert await back.receive_json_from() == {"ready": "Dune", "branch": "north"}
        assert await south.receive_nothing(), "the south screen is in another group"
        await close_all(front, back, south)
    run(go())


def test_each_branch_has_its_own_group(app):
    async def go():
        north, south = await open_screens(app, "/ws/holds/north/", "/ws/holds/south/")
        await south.send_json_to({"title": "Emma"})
        assert await south.receive_json_from() == {"ready": "Emma", "branch": "south"}
        assert await north.receive_nothing()
        await close_all(north, south)
    run(go())


def test_a_message_without_a_title_is_answered_on_its_own_socket_only(app):
    async def go():
        front, back = await open_screens(app, "/ws/holds/north/", "/ws/holds/north/")
        await back.send_json_to({"note": "no title here"})
        assert await back.receive_json_from() == {"error": "title missing"}
        assert await front.receive_nothing()
        await close_all(front, back)
    run(go())


def test_a_closed_screen_leaves_its_group(app, monkeypatch):
    left = []
    layer = get_channel_layer()
    discard = layer.group_discard

    async def spy(group, channel):
        left.append(group)
        await discard(group, channel)

    monkeypatch.setattr(layer, "group_discard", spy)

    async def go():
        front, back = await open_screens(app, "/ws/holds/north/", "/ws/holds/north/")
        await front.disconnect()
        assert left == ["holds_north"]
        await back.send_json_to({"title": "Ubik"})
        assert await back.receive_json_from() == {"ready": "Ubik", "branch": "north"}
        await back.disconnect()
    run(go())


def test_asgi_sends_http_to_django_and_websockets_to_the_consumers():
    from hold_alerts.asgi import application

    assert isinstance(application, ProtocolTypeRouter)
    assert set(application.application_mapping) == {"http", "websocket"}

    async def go():
        screen = WebsocketCommunicator(application, "/ws/holds/south/")
        connected, _ = await screen.connect()
        assert connected
        await screen.send_json_to({"title": "Kim"})
        assert await screen.receive_json_from() == {"ready": "Kim", "branch": "south"}
        await screen.disconnect()
    run(go())
