# Upkeep

Topic: Management Commands & Deployment (Backend, Django Advanced & Deployment).
Time: about 30 minutes.

## Task

Two jobs for running the library in production: a command the night shift runs, and the production settings.
The `Loan` model and a `/health/` page are written for you.

In `upkeep/management/commands/overdue.py`, finish the `overdue` command, so `python manage.py overdue 2026-03-20 --grace 2 --flag` works:

- `add_arguments()`: `today`, a positional date written `2026-03-20` (`type=datetime.date.fromisoformat`); `--grace`, a whole number of days a loan may run past its due date, default 0; `--flag`, a switch (`action="store_true"`).
- `handle()` reads them from `options` and writes with `self.stdout.write()`: one line per overdue loan, earliest due date first, then by title, as `"<title> (<reader>), <n> days late"`, then `"<count> overdue"`.
  A loan is overdue when its due date is more than `grace` days before `today`.
  With `--flag`, it marks those loans `flagged` in one `update()` and writes `"Flagged <count>"`.
  With none overdue it writes only `"Nothing overdue."`, and a negative `--grace` stops with `CommandError("--grace cannot be negative.")`.

In `upkeep/production.py`, write the production settings on top of the shared ones (in a project: `settings/prod.py` starting with `from .base import *`):

- From the environment, as text: `DEBUG` is on only when `DJANGO_DEBUG` is exactly `"True"`; `SECRET_KEY` is `DJANGO_SECRET_KEY`, and a missing one stops start-up with `ImproperlyConfigured`; `ALLOWED_HOSTS` is `DJANGO_ALLOWED_HOSTS` split on commas, trimmed, with blanks dropped.
- HTTPS, so the deployment checks report nothing: `SecurityMiddleware` first in `MIDDLEWARE` and `XFrameOptionsMiddleware` last, around the shared list; `SECURE_SSL_REDIRECT`; secure session and CSRF cookies; HSTS for a year (`31536000` seconds) with subdomains and preload.
- `STATIC_URL = "static/"` and `STATIC_ROOT` from `DJANGO_STATIC_ROOT`, or `/srv/library/static` when it is missing.

## Examples

```text
$ python manage.py overdue 2026-03-20
Beloved (cat), 10 days late
Dune (ann), 10 days late
Emma (ben), 3 days late
3 overdue
$ python manage.py overdue 2026-03-20 --grace 5 --flag
Beloved (cat), 10 days late
Dune (ann), 10 days late
2 overdue
Flagged 2
```

```python
call_command("overdue", "2026-03-20", grace=5, flag=True, stdout=out)   # the same, from Python
```

```text
GET http://library.example.com/health/    301  Location: https://library.example.com/health/
GET https://library.example.com/health/   200  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
GET https://evil.example.com/health/      400  not in ALLOWED_HOSTS
```

On a real server, deploying then runs `python manage.py check --deploy`, `migrate` and `collectstatic`, and serves the app with gunicorn (`gunicorn mysite.wsgi:application --workers 4`), never `runserver`.
HSTS tells browsers to refuse plain HTTP for your domain for a year, and preload asks them to build that in, so turn it on only once HTTPS works everywhere.

Watch for the lesson's pitfall: shipping with `DEBUG = True` turns every error into a page of tracebacks, local variables and settings for whoever caused it.
Read `DEBUG` from the environment as text and default it to off: `os.environ.get("DJANGO_DEBUG", "False") == "True"`, since `bool("False")` is `True`.

## Run the tests

```bash
cd exercises/backend/dj_management
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
The tests run the command with `call_command`, import `production.py` under chosen environment variables, run the same security checks as `check --deploy` on it, and send test-client requests through its middleware; no server starts.
Every test fails until you write the command and the settings.
When they all pass, tick the exercise done in Recall under Progress, Topics.
