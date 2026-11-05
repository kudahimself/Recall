import importlib
import sys
import tomllib
from pathlib import Path

from loan_tool import cli

PYPROJECT = Path(__file__).resolve().parent / "pyproject.toml"


def project():
    with open(PYPROJECT, "rb") as f:
        return tomllib.load(f)


def test_project_name_and_version():
    table = project()["project"]
    assert table["name"] == "loan-tool"
    assert table["version"] == "0.3.0"


def test_requires_python():
    assert project()["project"]["requires-python"].replace(" ", "") == ">=3.11"


def test_dependency_is_a_range():
    deps = [d.replace(" ", "") for d in project()["project"]["dependencies"]]
    assert deps == ["requests>=2.31"]


def test_loans_command_points_at_a_callable():
    target = project()["project"]["scripts"]["loans"]
    module_path, _, attr = target.partition(":")
    assert module_path == "loan_tool.cli"
    assert callable(getattr(importlib.import_module(module_path), attr))
    assert attr == "main"


def test_default_days_reads_the_tool_table(tmp_path):
    assert project()["tool"]["loan_tool"]["default_days"] == 14
    assert cli.default_days() == 14
    other = tmp_path / "pyproject.toml"
    other.write_text('[project]\nname = "x"\n\n[tool.loan_tool]\ndefault_days = 21\n')
    assert cli.default_days(other) == 21
    bare = tmp_path / "bare.toml"
    bare.write_text('[project]\nname = "x"\n')
    assert cli.default_days(bare) == 14


def test_in_virtualenv(monkeypatch):
    monkeypatch.setattr(sys, "base_prefix", "/usr")
    monkeypatch.setattr(sys, "prefix", "/home/me/loan-tool/.venv")
    assert cli.in_virtualenv() is True
    monkeypatch.setattr(sys, "prefix", "/usr")
    assert cli.in_virtualenv() is False


def test_main_prints_version_and_loan_period(capsys):
    assert cli.main([]) == 0
    assert capsys.readouterr().out == "loan-tool 0.3.0: loans last 14 days\n"
