"""Django Settings & Environment: a small stand-in for django-environ's Env.

Write the methods below so the tests in test_bookshop_settings.py pass, then use
Env in settings/base.py and settings/production.py.
Run them from the exercise folder with: pytest
"""
import os

from django.core.exceptions import ImproperlyConfigured

NOTSET = object()  # "no default given": a missing variable is then an error


class Env:
    """Reads settings from environment variables, cast to the type each one needs.

    Env(DEBUG=(bool, False)) declares DEBUG's cast and default once, for env("DEBUG").
    """

    def __init__(self, **schema):
        # TODO: keep the NAME=(cast, default) pairs for __call__.
        raise NotImplementedError

    def __call__(self, name, cast=None, default=NOTSET):
        """The variable's value, cast with `cast`, or with the schema's cast, or kept as text.

        When the variable is not set, return `default`, or the schema's default.
        With neither, raise ImproperlyConfigured("Set the NAME environment variable").
        Casts: bool (see README.md for the true words), int, and list (comma-separated).
        """
        # TODO
        raise NotImplementedError

    def bool(self, name, default=NOTSET):
        """The variable as True or False."""
        # TODO
        raise NotImplementedError

    def list(self, name, default=NOTSET):
        """The variable split on commas, each item stripped, empty items dropped."""
        # TODO
        raise NotImplementedError

    def db(self, name="DATABASE_URL", default=NOTSET):
        """A DATABASES entry from a database URL such as postgres://user:pass@host:5432/name."""
        # TODO
        raise NotImplementedError

    @staticmethod
    def read_env(path):
        """Load KEY=VALUE lines from a .env file into os.environ.

        A variable the environment already has keeps its value, and a missing file loads nothing.
        """
        # TODO
        raise NotImplementedError
