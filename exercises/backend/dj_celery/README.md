# Due notices

Topic: Celery Tasks & Scheduling (Backend, Celery & Background Tasks).
Time: about 25 minutes.

## Task

The library emails readers whose books are due, and sending mail is slow work that belongs in a Celery task, not in the request.
The `Loan` model (`due_notices/models.py`) and the routes (`due_notices/urls.py`) are written for you, and `due_notices/__init__.py` imports the Celery app when Django starts, as a project's `__init__.py` does.

Start with `due_notices/celery_app.py`, the project's `celery.py`, because no task runs until the app is set up:

- read every `CELERY_*` Django setting into the app's configuration with `config_from_object`, so `CELERY_TASK_ALWAYS_EAGER` becomes `task_always_eager`;
- find the tasks in each installed app's `tasks.py` with `autodiscover_tasks()`;
- give beat a schedule with one entry, `"remind-due-loans"`, that sends `due_notices.tasks.remind_all_due` every hour (3600 seconds).

Then the tasks in `due_notices/tasks.py`, each one a `@shared_task`:

- `send_notice(loan_id)` receives itself as `self` (`bind=True`) and retries at most 3 times.
  It emails the reader with `send_mail("Book due", f"{title} is due back on {due_on}.", None, [email])`, marks the loan `reminded` and returns the email address.
  When the mail server cannot be reached, `send_mail` raises `OSError`: retry the task in 60 seconds with `raise self.retry(exc=..., countdown=60)`.
- `remind_all_due()` queues `send_notice` for every loan due today or earlier that has not been reminded, passing each loan's id, and returns how many it queued.
- `count_overdue()` counts the loans due before today, and `format_report(count)` turns a count into `"2 overdue"`.
- `overdue_report()` is a plain function: it builds the chain `count_overdue` then `format_report` from signatures (`.s()`) and returns it without running it.

Last, the views in `due_notices/views.py`, both answering `202` with `{"task_id": ...}` straight away:

- `remind` queues `send_notice` for the loan with `delay()`, and 404s for a loan that does not exist;
- `remind_later` queues it with `apply_async(...)` to run in an hour (`countdown=3600`).

## Examples

```python
send_notice.delay(dune.pk).get()     # "ann@example.com", and Dune is marked reminded
remind_all_due.delay().get()         # 2: Dune (overdue) and Emma (due today); Ubik is not due yet
overdue_report()                     # a chain, nothing has run yet
overdue_report().delay().get()       # "2 overdue"
client.post("/loans/1/remind/")      # 202 {"task_id": "1b4e28ba-..."}
```

Watch for the lesson's pitfall: `delay()` returns an `AsyncResult` at once, not the task's result.
A view that calls `get()` on it waits for the worker and undoes the point of the queue, so return the task id instead; the tests hand the views a result whose `get()` fails.
Pass ids, not model objects: a task's arguments travel through the broker as JSON.

## Run the tests

```bash
cd exercises/backend/dj_celery
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
There is no broker, Redis server or worker: the tests set `CELERY_TASK_ALWAYS_EAGER = True`, so once your app reads the `CELERY_*` settings, `delay()` runs each task at once in the test process, retries included, and `get()` returns its result.
Until then every test stops with a message saying so.
Mail goes to Django's in-memory outbox, and a test swaps `send_mail` for one that fails, as an unreachable mail server does.
When they all pass, tick the exercise done in Recall under Progress, Topics.
