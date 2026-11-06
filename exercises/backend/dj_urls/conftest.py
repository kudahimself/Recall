"""Set Django up for this folder's tests: nothing to change here.

It loads the shared settings in exercises/backend/exercise_settings.py,
which run Django on an in-memory SQLite database with this folder's app installed.
"""
import os
import sys
from pathlib import Path

import django

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "exercise_settings")
django.setup()
