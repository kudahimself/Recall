"""Settings every environment shares: what differs between machines comes from the environment.

Reference solution.
"""
from bookshop_config.env import Env

env = Env(DEBUG=(bool, False))  # NAME=(cast, default)
Env.read_env(".env")             # .env is in .gitignore

SECRET_KEY = env("SECRET_KEY")   # no default: must be set
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])
DATABASES = {"default": env.db("DATABASE_URL", default="sqlite:///db.sqlite3")}

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
