"""Shared Django settings for the Django exercises (exercises/backend/dj_*/).

Each Django exercise folder holds a conftest.py that points pytest here, so its
tests run with no project, server or database service: the database is SQLite
in memory, created fresh for every test run and gone when it ends.

Each exercise folder holds one Django app (a package with an apps.py).
Run from inside an exercise folder, only that folder's app is installed, so a
half-finished app in another exercise cannot break the one you are working on.
Run from anywhere else (the repository root, say), every exercise's app is installed.
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def _exercise_folders():
    """The exercise folder the current directory is in, or every one."""
    cwd = Path.cwd().resolve()
    if cwd != HERE and HERE in cwd.parents:
        return [HERE / cwd.relative_to(HERE).parts[0]]
    return sorted(p for p in HERE.iterdir() if p.is_dir())


EXERCISE_APPS = []
for folder in _exercise_folders():
    for apps_file in sorted(folder.glob("*/apps.py")):
        if str(folder) not in sys.path:
            sys.path.insert(0, str(folder))
        EXERCISE_APPS.append(apps_file.parent.name)

SECRET_KEY = "exercises-only-not-a-real-secret"
DEBUG = False
ALLOWED_HOSTS = ["testserver", "localhost"]
USE_TZ = True
TIME_ZONE = "UTC"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

DATABASES = {
    "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"},
}

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "rest_framework",
    *EXERCISE_APPS,
]

MIDDLEWARE = [
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
]

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
            ],
        },
    },
]

# Each exercise's tests name the URLconf they use with @pytest.mark.urls(...).
ROOT_URLCONF = None
LOGIN_URL = "/login/"
