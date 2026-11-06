"""API Documentation: the settings drf-spectacular needs, as they would sit in settings.py.

The tests apply each name below over the shared exercise settings.
Change them so the tests in test_catalogue_docs.py pass.
"""
from exercise_settings import INSTALLED_APPS as SHARED_APPS

# TODO: install drf-spectacular's app ("drf_spectacular") after the shared apps.
INSTALLED_APPS = [*SHARED_APPS]

# TODO: make drf-spectacular's AutoSchema DRF's DEFAULT_SCHEMA_CLASS.
REST_FRAMEWORK = {}
