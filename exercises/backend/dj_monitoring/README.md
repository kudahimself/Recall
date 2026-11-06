# Desk monitor

Topic: Monitoring & Observability (Backend, Real-time & Monitoring).
Time: about 30 minutes.

## Task

The loan desk's site is live, and when something goes wrong nobody can tell what.
Give it structured logs, error capture and a health check in the `desk_monitor` app.
The lending service (`desk_monitor/services.py`) and the routes (`desk_monitor/urls.py`) are written for you.

Start with `desk_monitor/log_format.py`:

- `JsonFormatter.format(record)` writes each record as one line of JSON with `"level"`, `"logger"` and `"msg"` (the message with its arguments filled in), then every field the call passed in `extra=`.
  `BUILT_IN` holds the attributes every record has, so any other attribute came from `extra=`.
  When the record carries an exception, add `"error"`, the exception class's name, and `"traceback"`, from `self.formatException(record.exc_info)`.
- `LOGGING` is the dict Django reads from the `LOGGING` setting, in `dictConfig` form: a `"json"` formatter made by `JsonFormatter`, a `"console"` handler that writes to standard output (`"stream": "ext://sys.stdout"`) with it, and the `"desk_monitor"` logger sending INFO and up to that handler.
  Keep the loggers that already exist switched on with `"disable_existing_loggers": False`.

Then the views in `desk_monitor/views.py`, logging through `log`, the module's logger:

- `checkout` lends a book to `request.POST["member"]`.
  It logs INFO `"checkout started"` with `book_id` and `member`, then on success INFO `"book lent"` with `book_id` and `loan_id`, and answers `201 {"loan_id": ...}`.
  A `LendingError` is the desk saying no, an expected outcome: log WARNING `"checkout refused"` with `book_id` and `reason` (the error's text) and answer `409 {"error": ...}`.
  A `CatalogueDown` is a fault: log `"catalogue unreachable"` with `book_id`, keeping the traceback, and answer `503 {"error": "try again later"}`.
  Let any other exception rise.
- `health` is what a load balancer or uptime monitor calls to ask whether the site can serve.
  It runs `SELECT 1` on the database with `connection.cursor()` and answers `200 {"status": "ok", "checks": {"database": "ok"}}`.
  On a `DatabaseError` it logs `"health check failed"` with `check="database"`, keeping the traceback, and answers `503 {"status": "error", "checks": {"database": "error"}}`, so the balancer stops sending traffic.

Last, error capture in `desk_monitor/middleware.py`, standing in for what Sentry does:

- `ErrorCaptureMiddleware.process_exception(request, exception)`, which Django calls when a view raises, logs `"unhandled error"` at ERROR with the traceback and the request's `path` and `method`, then returns `None` so Django still answers 500.

## Examples

```text
POST /checkout/1/ member=ana   -> 201 {"loan_id": 101}
  {"level": "INFO", "logger": "desk_monitor.views", "msg": "checkout started", "book_id": 1, "member": "ana"}
  {"level": "INFO", "logger": "desk_monitor.views", "msg": "book lent", "book_id": 1, "loan_id": 101}
POST /checkout/2/ member=ana   -> 409 {"error": "already on loan"}, a WARNING "checkout refused"
GET  /health/                  -> 200 {"status": "ok", "checks": {"database": "ok"}}
```

Watch for the lesson's pitfall: inside an `except`, `log.error(f"payment failed: {e}")` keeps one line of text and drops the traceback, and buries the context in the message where a log search cannot filter on it.
Write a fixed message, pass the context in `extra=`, and use `log.exception(...)` to keep the traceback.

## Run the tests

```bash
cd exercises/backend/dj_monitoring
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
Django's test client sends the requests and pytest's `caplog` fixture collects the log records, so there is no server, log store or error tracker.
The error-capture test adds your middleware to `MIDDLEWARE` itself, and the health test makes the database refuse every query.
A real project would also call `sentry_sdk.init(dsn=...)` in its settings, which reports the same unhandled errors to Sentry; the exercise leaves it out, so nothing is sent anywhere.
When they all pass, tick the exercise done in Recall under Progress, Topics.
