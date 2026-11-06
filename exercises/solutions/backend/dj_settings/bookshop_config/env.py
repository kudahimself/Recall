"""Django Settings & Environment: a small stand-in for django-environ's Env.

Reference solution.
"""
import os
from urllib.parse import urlsplit

from django.core.exceptions import ImproperlyConfigured

NOTSET = object()  # "no default given": a missing variable is then an error

TRUE_WORDS = {"1", "true", "yes", "on"}
ENGINES = {
    "postgres": "django.db.backends.postgresql",
    "postgresql": "django.db.backends.postgresql",
    "sqlite": "django.db.backends.sqlite3",
}


class Env:
    """Reads settings from environment variables, cast to the type each one needs.

    Env(DEBUG=(bool, False)) declares DEBUG's cast and default once, for env("DEBUG").
    """

    def __init__(self, **schema):
        self.schema = schema

    def __call__(self, name, cast=None, default=NOTSET):
        schema_cast, schema_default = self.schema.get(name, (None, NOTSET))
        cast = cast or schema_cast or str
        if default is NOTSET:
            default = schema_default
        if name not in os.environ:
            if default is NOTSET:
                raise ImproperlyConfigured(f"Set the {name} environment variable")
            return default
        value = os.environ[name]
        if cast is bool:
            return value.strip().lower() in TRUE_WORDS
        if cast is list:
            return [item.strip() for item in value.split(",") if item.strip()]
        return cast(value)

    def bool(self, name, default=NOTSET):
        return self(name, cast=bool, default=default)

    def list(self, name, default=NOTSET):
        return self(name, cast=list, default=default)

    def db(self, name="DATABASE_URL", default=NOTSET):
        url = urlsplit(self(name, cast=str, default=default))
        if url.scheme not in ENGINES:
            raise ImproperlyConfigured(f"{name} has an unknown database scheme {url.scheme!r}")
        if url.scheme == "sqlite":
            return {"ENGINE": ENGINES["sqlite"], "NAME": url.path[1:]}
        return {
            "ENGINE": ENGINES[url.scheme],
            "NAME": url.path[1:],
            "USER": url.username or "",
            "PASSWORD": url.password or "",
            "HOST": url.hostname or "",
            "PORT": url.port or "",
        }

    @staticmethod
    def read_env(path):
        try:
            with open(path) as env_file:
                lines = env_file.read().splitlines()
        except FileNotFoundError:
            return
        for line in lines:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip("\"'"))
