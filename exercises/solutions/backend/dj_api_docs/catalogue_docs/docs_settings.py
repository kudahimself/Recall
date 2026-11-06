"""API Documentation: reference solution."""
from exercise_settings import INSTALLED_APPS as SHARED_APPS

INSTALLED_APPS = [*SHARED_APPS, "drf_spectacular"]

REST_FRAMEWORK = {"DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema"}
