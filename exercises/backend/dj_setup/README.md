# Branch project setup

Topic: Setup & Project Structure (Backend, Django).
Time: about 20 minutes.

## Task

This folder is a small Django project as `startproject` and `startapp` leave it: `manage.py`, the `branchsite` project with its settings split into `base.py`, `dev.py` and `prod.py`, and one app, `circulation`.
Finish the setup:

1. In `branchsite/settings/base.py`, register the `circulation` app in `INSTALLED_APPS` by its config class, the `CirculationConfig` in `circulation/apps.py`.
2. Make `dev.py` take every setting from `base.py` (`from .base import *`) and turn `DEBUG` on.
3. Make `prod.py` take every setting from `base.py`, keep `DEBUG` off and set `ALLOWED_HOSTS` to `["library.example.com"]`.
4. Add `renewals` to the `Loan` model in `circulation/models.py`: a `PositiveIntegerField` that starts at 0.
5. Make its migration and apply it, from this folder:

```bash
python manage.py makemigrations circulation
python manage.py migrate
python manage.py showmigrations circulation
```

`manage.py` picks `branchsite.settings.dev` unless `DJANGO_SETTINGS_MODULE` names another module, and the dev database is the file `db.sqlite3` here.
`showmigrations` should end with both migrations marked `[X]`.

## Examples

```text
$ python manage.py showmigrations circulation
circulation
 [X] 0001_initial
 [X] 0002_loan_renewals

$ DJANGO_SETTINGS_MODULE=branchsite.settings.prod python manage.py shell -c "from django.conf import settings; print(settings.DEBUG)"
False
```

Watch for the lesson's pitfall: running only `migrate` after editing `models.py` changes nothing, because `migrate` applies migration files and only `makemigrations` writes them.
And `makemigrations circulation` says `No installed app with label 'circulation'` until step 1 is done.

## Run the tests

```bash
cd exercises/backend/dj_setup
pytest
```

The tests run on their own in-memory database, set up by `conftest.py`; leave that file as it is.
Every test fails until you finish the setup.
When they all pass, tick the exercise done in Recall under Progress, Topics.
