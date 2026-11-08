"""Give the tests the shared local Spark session: nothing to change here.

The `spark` fixture comes from exercises/databricks/spark_setup.py.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from spark_setup import spark  # noqa: E402,F401
