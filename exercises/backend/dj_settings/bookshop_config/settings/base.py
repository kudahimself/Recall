"""Settings every environment shares, as the team first committed them.

TODO: the secret key, DEBUG, ALLOWED_HOSTS and the database differ between machines,
and the key must never be committed: read all four from the environment with Env,
after loading a .env file from the folder the server runs in (see README.md).
"""
from bookshop_config.env import Env

SECRET_KEY = "django-insecure-q7#w0x!b2s9vp@4k$bookshop-first-commit"
DEBUG = True
ALLOWED_HOSTS = ["*"]
DATABASES = {
    "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": "db.sqlite3"},
}

# Written for you: the same on every machine.
INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
]
USE_TZ = True
TIME_ZONE = "UTC"
