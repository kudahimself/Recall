# Gatehouse

Topic: Signals & Middleware (Backend, Django Advanced & Deployment).
Time: about 25 minutes.

## Task

Every request to the library passes the gatehouse: three middleware classes, and two signal receivers that keep count of loans.
The `Book`, `Loan` and `AuditEntry` models, the `desk` view and the URLconf are written for you.

In `gatehouse/middleware.py`, write three middleware classes, each built once with `get_response` and then called for every request:

- `RequestIdMiddleware`: on the way in, `request.request_id` is the incoming `X-Request-ID` header when there is one, else a new `uuid4().hex`; on the way out, the response gets an `X-Request-ID` header with it.
- `MaintenanceMiddleware`: while `settings.LIBRARY_CLOSED` is `True`, it answers `"The library is closed for maintenance."` with status 503 and never calls `get_response`.
  The setting may be missing, and then the library is open.
- `ReaderMiddleware`: on the way in, `request.reader` is the signed-in reader's username, or `"anonymous"`; on the way out, the response gets an `X-Reader` header with it.

In `gatehouse/stack.py`, add the three to `MIDDLEWARE`, keeping Django's own four in their order, so that every response carries its request id, the maintenance page included; while the library is closed, nothing below the maintenance layer runs, not even a session lookup; and `ReaderMiddleware` sits where `request.user` already exists.

In `gatehouse/signals.py`, connect two receivers with `@receiver`:

- after a `Loan` is inserted (`created`, not on later saves), add one to its book's `times_lent` in a single `UPDATE` computed by `F()`;
- after a `Loan` is deleted, record an `AuditEntry` `"Loan of <title> to <reader> deleted"`.

Then make `GatehouseConfig.ready()` in `gatehouse/apps.py` import the signals module, so the receivers are connected when Django starts.

## Examples

```text
GET /desk/                          200  Desk, request 3f2a...e9, reader anonymous   X-Request-ID: 3f2a...e9
GET /desk/  X-Request-ID: trace-42  200  Desk, request trace-42, reader anonymous    X-Request-ID: trace-42
GET /desk/  (signed in as ann)      200  ... reader ann                              X-Reader: ann
GET /desk/  (LIBRARY_CLOSED = True) 503  The library is closed for maintenance.      X-Request-ID: ..., no X-Reader
```

```python
loan = Loan.objects.create(book=dune, reader="ann")   # dune.times_lent: 1
loan.save()                                           # still 1: created is False
loan.delete()                                         # AuditEntry "Loan of Dune to ann deleted"
```

Watch for the lesson's pitfall: a receiver in a module nothing imports is never connected, so the loan saves, no receiver runs and nothing reports an error.
Import the `signals` module in the app config's `ready()`, which Django calls once at startup.
The tests never import `gatehouse.signals` themselves, so they only pass once the app connects it.

## Run the tests

```bash
cd exercises/backend/dj_signals_mw
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
The tests apply `stack.py` as `settings.MIDDLEWARE` and send requests through Django's test client, which runs the whole middleware stack.
Every test fails until you write the middleware, the stack and the receivers.
When they all pass, tick the exercise done in Recall under Progress, Topics.
