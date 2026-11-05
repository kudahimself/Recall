"""Packaging and environments: practise pyproject.toml, entry points and virtual environments.

Fill in each part (and pyproject.toml) so the tests in test_project.py pass.
Run them from this folder with: pytest
"""
import sys
import tomllib
from pathlib import Path

# The project's pyproject.toml, next to the loan_tool package.
PYPROJECT = Path(__file__).resolve().parent.parent / "pyproject.toml"


def read_pyproject(path=PYPROJECT):
    """Return the parsed contents of a pyproject.toml file as a dict (done for you)."""
    with open(path, "rb") as f:
        return tomllib.load(f)


def project_version(path=PYPROJECT):
    """Return the version from the [project] table."""
    # TODO
    raise NotImplementedError


def default_days(path=PYPROJECT):
    """Return default_days from the [tool.loan_tool] table, or 14 when the table or key is missing."""
    # TODO
    raise NotImplementedError


def in_virtualenv():
    """Return True when Python runs inside a virtual environment.

    Inside one, sys.prefix (this environment) differs from sys.base_prefix (the Python it was made from).
    """
    # TODO
    raise NotImplementedError


def main(argv=None):
    """Entry point of the `loans` command: print "loan-tool <version>: loans last <days> days" and return 0."""
    # TODO
    raise NotImplementedError
