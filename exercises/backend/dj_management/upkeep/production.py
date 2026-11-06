"""Deployment: the production settings.

In a project this module is settings/prod.py and starts with `from .base import *`.
Here the exercises' shared settings stand in for base.py.
Write it so the tests in test_upkeep.py pass.
"""
import os

from django.core.exceptions import ImproperlyConfigured

from exercise_settings import *  # noqa: F401,F403

# TODO: config comes from the environment, as text, so one build runs everywhere:
# - DEBUG is True only when DJANGO_DEBUG is exactly "True", and off when it is missing;
# - SECRET_KEY is DJANGO_SECRET_KEY; when that is missing, stop with ImproperlyConfigured;
# - ALLOWED_HOSTS is DJANGO_ALLOWED_HOSTS split on commas, spaces trimmed, blanks dropped.

# TODO: HTTPS, so `python manage.py check --deploy` reports nothing:
# - SecurityMiddleware first in MIDDLEWARE, and XFrameOptionsMiddleware last, around the
#   shared MIDDLEWARE you imported;
# - redirect plain HTTP to HTTPS, and send the session and CSRF cookies over HTTPS only;
# - HSTS for a year (31536000 seconds), subdomains included, preload on.

# TODO: STATIC_URL "static/", and STATIC_ROOT, where collectstatic gathers the files for
# the web server, from DJANGO_STATIC_ROOT, or /srv/library/static when it is missing.
