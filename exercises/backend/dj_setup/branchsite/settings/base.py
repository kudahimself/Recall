"""Settings every environment shares; dev.py and prod.py build on them."""
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = "exercise-only-not-a-real-secret"
DEBUG = False
ALLOWED_HOSTS = []

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    # TODO: register the circulation app here, by its config class.
]

ROOT_URLCONF = "branchsite.urls"
DATABASES = {
    "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3"},
}
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
USE_TZ = True
