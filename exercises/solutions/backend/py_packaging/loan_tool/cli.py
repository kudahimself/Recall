"""Packaging and environments: reference solution."""
import sys
import tomllib
from pathlib import Path

PYPROJECT = Path(__file__).resolve().parent.parent / "pyproject.toml"


def read_pyproject(path=PYPROJECT):
    with open(path, "rb") as f:
        return tomllib.load(f)


def project_version(path=PYPROJECT):
    return read_pyproject(path)["project"]["version"]


def default_days(path=PYPROJECT):
    return read_pyproject(path).get("tool", {}).get("loan_tool", {}).get("default_days", 14)


def in_virtualenv():
    return sys.prefix != sys.base_prefix


def main(argv=None):
    print(f"loan-tool {project_version()}: loans last {default_days()} days")
    return 0
