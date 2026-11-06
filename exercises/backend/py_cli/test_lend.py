import os

import pytest

from lend import DEFAULT_API, api_url, build_parser, load_env_file, main


@pytest.fixture(autouse=True)
def clean_environment():
    """Run each test without LIBRARY_API set, and put os.environ back afterwards."""
    saved = dict(os.environ)
    os.environ.pop("LIBRARY_API", None)
    yield
    os.environ.clear()
    os.environ.update(saved)


def test_parser_defaults():
    args = build_parser().parse_args(["Dune"])
    assert args.title == "Dune"
    assert args.days == 14
    assert args.verbose is False


def test_parser_converts_days_to_int():
    args = build_parser().parse_args(["Dune", "--days", "7", "-v"])
    assert args.days == 7
    assert args.days + 1 == 8
    assert args.verbose is True
    assert build_parser().parse_args(["Emma", "--verbose"]).verbose is True


@pytest.mark.parametrize("argv", [["Dune", "--days", "seven"], [], ["Dune", "--weeks", "2"]])
def test_parser_rejects_bad_input_with_exit_code_2(argv, capsys):
    with pytest.raises(SystemExit) as e:
        build_parser().parse_args(argv)
    assert e.value.code == 2
    assert "usage" in capsys.readouterr().err


def test_api_url_reads_the_environment(monkeypatch):
    assert api_url() == DEFAULT_API
    monkeypatch.setenv("LIBRARY_API", "https://books.example.org")
    assert api_url() == "https://books.example.org"


def test_main_builds_the_message(monkeypatch):
    assert main(["Dune"]) == "Lent Dune for 14 days"
    assert main(["Emma", "--days", "7", "-v"]) == f"Lent Emma for 7 days via {DEFAULT_API}"
    monkeypatch.setenv("LIBRARY_API", "https://books.example.org")
    assert main(["Ubik", "--verbose"]) == "Lent Ubik for 14 days via https://books.example.org"


def test_load_env_file_sets_missing_variables(tmp_path):
    env = tmp_path / ".env"
    env.write_text("# library settings\n\nLIBRARY_API = https://books.example.org\nLOAN_DAYS=21\n")
    os.environ.pop("LOAN_DAYS", None)
    assert load_env_file(env) == {"LIBRARY_API": "https://books.example.org", "LOAN_DAYS": "21"}
    assert os.environ["LOAN_DAYS"] == "21"
    assert api_url() == "https://books.example.org"


def test_load_env_file_keeps_variables_already_set(tmp_path, monkeypatch):
    monkeypatch.setenv("LIBRARY_API", "https://real.example.org")
    env = tmp_path / ".env"
    env.write_text("LIBRARY_API=https://from-file.example.org\n")
    assert load_env_file(env) == {}
    assert api_url() == "https://real.example.org"
