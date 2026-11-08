"""Give the tests the shared local Spark session: nothing to change here.

The `spark` fixture comes from exercises/databricks/spark_setup.py.
UDFs run in Python worker processes, which must be the same Python as the tests,
so this points Spark at it unless you have set PYSPARK_PYTHON yourself.
"""
import os
import sys
from pathlib import Path

os.environ.setdefault("PYSPARK_PYTHON", sys.executable)
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from spark_setup import spark  # noqa: E402,F401
