"""Set Django up for this folder's tests: nothing to change here.

It loads the shared settings in exercises/backend/exercise_settings.py,
which run Django on an in-memory SQLite database with this folder's app installed.
"""
import os
import sys
from pathlib import Path

import django

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
# Set the settings module only while Django starts, so it does not leak into
# pytest subprocesses that other exercises' tests start (from a repo-root run).
added = "DJANGO_SETTINGS_MODULE" not in os.environ
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "exercise_settings")
django.setup()
if added:
    del os.environ["DJANGO_SETTINGS_MODULE"]
