"""Give the tests a fresh database for each test: nothing to change here.

The `con` fixture comes from exercises/sql/tsql_runner.py: an in-memory DuckDB database
that runs the T-SQL in your .sql file, so there is no server to start.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from tsql_runner import con  # noqa: E402,F401
