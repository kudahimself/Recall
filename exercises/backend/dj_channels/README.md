# Hold alerts

Topic: WebSockets (Django Channels) (Backend, Real-time & Monitoring).
Time: about 30 minutes.

## Task

Each library branch has screens at its hold desk.
When a librarian marks a hold ready on one screen, every screen at that branch should show it at once, without anyone reloading a page.
Build it with Django Channels in the `hold_alerts` app.

Start with `hold_alerts/layers.py`, because the sockets reach each other only through a channel layer:

- `channel_layers(production)` returns the `CHANNEL_LAYERS` setting.
  In production that is channels_redis's `"channels_redis.core.RedisChannelLayer"` with `"hosts": [("redis", 6379)]` in its `CONFIG`; otherwise it is Channels' `"channels.layers.InMemoryChannelLayer"`.

Then `HoldDeskConsumer` in `hold_alerts/consumers.py`, an `AsyncJsonWebsocketConsumer`:

- `connect` reads the branch from the URL.
  A branch not in `BRANCHES` is refused with `close()`; any other joins the group `"holds_<branch>"` and accepts.
- `disconnect` leaves the group again.
- `receive_json` takes `{"title": "Dune"}` from a screen and sends the event `{"type": "hold.ready", "title": "Dune", "branch": "north"}` to the branch's group.
  A message with no title gets `{"error": "title missing"}` back on its own socket only.
- Add the method each group member runs for a `"hold.ready"` event: it sends `{"ready": "Dune", "branch": "north"}` down that member's own socket.

Last, the routes:

- `hold_alerts/routing.py` routes `ws/holds/<branch>/` to the consumer in `websocket_urlpatterns`, as `urls.py` routes paths to views.
- `hold_alerts/asgi.py` is the project's `asgi.py`: a `ProtocolTypeRouter` that sends `"http"` to Django's own ASGI app and `"websocket"` to a `URLRouter` of those routes.

## Examples

```text
screen A opens /ws/holds/north/    -> accepted, joins holds_north
screen B opens /ws/holds/north/    -> accepted, joins holds_north
screen C opens /ws/holds/south/    -> accepted, joins holds_south
screen D opens /ws/holds/east/     -> refused
B sends {"title": "Dune"}          -> A and B receive {"ready": "Dune", "branch": "north"}; C receives nothing
B sends {"note": "hi"}             -> only B receives {"error": "title missing"}
```

Watch for the lesson's pitfall: the in-memory layer keeps its groups inside one process.
Under two or more ASGI workers, `group_send` would reach only the screens connected to the sender's process, which is why production needs the Redis layer.
The in-memory layer is right for development and for these tests.

## Run the tests

```bash
cd exercises/backend/dj_channels
pytest
```

`conftest.py` sets Django up for you; leave it as it is.
There is no ASGI server, Redis or browser: each test sets `CHANNEL_LAYERS` from your `channel_layers(production=False)`, so until `layers.py` is written every test stops with its error.
Channels' `WebsocketCommunicator` then plays each screen, opening a socket on your app inside the test process, and the tests run it with `asyncio.run`.
When they all pass, tick the exercise done in Recall under Progress, Topics.
