"""Check Env and the bookshop's settings with environment variables the tests set.

Each settings test runs in an empty temporary folder, with the bookshop's four
variables cleared and only the ones it names set, then imports the settings
module afresh, so every test sees the settings a server started that way would.
The deploy test runs Django's own `manage.py check --deploy` security checks
against the production settings.
"""
import importlib
import os
import sys

import pytest
from django.core import checks
from django.core.exceptions import ImproperlyConfigured
from django.test import override_settings

from bookshop_config.env import Env

KEY = "t3st-only-Vq8$wL2!pZ6#rN9@kD4&mB7*xF1^hJ5%cG0-sample-key"
BOOKSHOP_VARS = ["SECRET_KEY", "DEBUG", "ALLOWED_HOSTS", "DATABASE_URL"]
POSTGRES_URL = "postgres://shop:s3cret@db.internal:5432/bookshop"


@pytest.fixture
def environ(monkeypatch, tmp_path):
    """Run in an empty folder with the bookshop's variables cleared; returns monkeypatch.

    The environment is put back afterwards, including what a .env file added to it.
    """
    saved = dict(os.environ)
    monkeypatch.chdir(tmp_path)
    for name in BOOKSHOP_VARS + ["COPIES", "SHELVES", "SITE_NAME"]:
        monkeypatch.delenv(name, raising=False)
    yield monkeypatch
    os.environ.clear()
    os.environ.update(saved)


@pytest.fixture
def load(environ):
    """load("base", SECRET_KEY=..., ...) imports bookshop_config.settings.base afresh."""
    def load(module, **variables):
        for name, value in variables.items():
            environ.setenv(name, value)
        for loaded in [m for m in sys.modules if m.startswith("bookshop_config.settings.")]:
            del sys.modules[loaded]
        return importlib.import_module(f"bookshop_config.settings.{module}")
    return load


# Env

def test_a_variable_is_read_as_text(environ):
    environ.setenv("SITE_NAME", "Bookshop")
    env = Env()
    assert env("SITE_NAME") == "Bookshop"
    assert env("SHELVES", default="none") == "none"


def test_a_missing_variable_with_no_default_stops_start_up(environ):
    with pytest.raises(ImproperlyConfigured, match="Set the SECRET_KEY environment variable"):
        Env()("SECRET_KEY")


@pytest.mark.parametrize("text, expected", [
    ("True", True), ("true", True), ("1", True), ("yes", True), ("on", True),
    ("False", False), ("false", False), ("0", False), ("no", False), ("off", False), ("", False),
])
def test_a_bool_is_cast_from_its_text(environ, text, expected):
    environ.setenv("DEBUG", text)
    assert Env().bool("DEBUG") is expected
    assert Env(DEBUG=(bool, True))("DEBUG") is expected


def test_the_schema_gives_a_cast_and_a_default(environ):
    env = Env(DEBUG=(bool, False), COPIES=(int, 3))
    assert env("DEBUG") is False
    assert env("COPIES") == 3
    environ.setenv("COPIES", "12")
    assert env("COPIES") == 12


def test_a_list_is_split_on_commas(environ):
    environ.setenv("ALLOWED_HOSTS", "books.example.org, www.books.example.org,")
    env = Env()
    assert env.list("ALLOWED_HOSTS") == ["books.example.org", "www.books.example.org"]
    assert env.list("SHELVES", default=[]) == []


def test_a_database_url_becomes_a_databases_entry(environ):
    environ.setenv("DATABASE_URL", POSTGRES_URL)
    db = Env().db()
    assert {k: db.get(k) for k in ["ENGINE", "NAME", "USER", "PASSWORD", "HOST", "PORT"]} == {
        "ENGINE": "django.db.backends.postgresql", "NAME": "bookshop", "USER": "shop",
        "PASSWORD": "s3cret", "HOST": "db.internal", "PORT": 5432,
    }
    sqlite = Env().db("SHELVES", default="sqlite:///db.sqlite3")
    assert (sqlite["ENGINE"], sqlite["NAME"]) == ("django.db.backends.sqlite3", "db.sqlite3")
    environ.setenv("DATABASE_URL", "mongo://db.internal/bookshop")
    with pytest.raises(ImproperlyConfigured):
        Env().db()


def test_a_env_file_fills_in_what_the_environment_lacks(environ, tmp_path):
    (tmp_path / ".env").write_text(
        "# the bookshop's local settings\n"
        "\n"
        "SITE_NAME=\"Corner Books\"\n"
        "SHELVES=a,b\n"
        "COPIES=7\n"
    )
    environ.setenv("COPIES", "2")
    Env.read_env(tmp_path / ".env")
    assert os.environ["SITE_NAME"] == "Corner Books"
    assert os.environ["SHELVES"] == "a,b"
    assert os.environ["COPIES"] == "2", "a variable the environment already has keeps its value"
    Env.read_env(tmp_path / "missing.env")


# settings/base.py

def test_base_will_not_start_without_a_secret_key(load):
    with pytest.raises(ImproperlyConfigured, match="SECRET_KEY"):
        load("base")


def test_base_takes_its_values_from_the_environment(load):
    settings = load("base", SECRET_KEY=KEY, DEBUG="False",
                    ALLOWED_HOSTS="books.example.org,www.books.example.org", DATABASE_URL=POSTGRES_URL)
    assert settings.SECRET_KEY == KEY
    assert settings.DEBUG is False, 'DEBUG="False" is a non-empty string: cast it to a bool'
    assert settings.ALLOWED_HOSTS == ["books.example.org", "www.books.example.org"]
    db = settings.DATABASES["default"]
    assert (db["ENGINE"], db["HOST"], db["NAME"]) == ("django.db.backends.postgresql", "db.internal", "bookshop")


def test_base_defaults_to_debug_off_and_a_local_database(load):
    settings = load("base", SECRET_KEY=KEY)
    assert settings.DEBUG is False
    assert settings.ALLOWED_HOSTS == []
    assert settings.DATABASES["default"]["ENGINE"] == "django.db.backends.sqlite3"


def test_base_reads_the_env_file_in_the_folder_it_runs_in(load, tmp_path):
    (tmp_path / ".env").write_text(f"SECRET_KEY={KEY}\nALLOWED_HOSTS=localhost\nDATABASE_URL={POSTGRES_URL}\n")
    settings = load("base")
    assert settings.SECRET_KEY == KEY
    assert settings.ALLOWED_HOSTS == ["localhost"]
    assert settings.DATABASES["default"]["USER"] == "shop"


# settings/production.py

def test_production_keeps_debug_off_whatever_the_environment_says(load):
    settings = load("production", SECRET_KEY=KEY, DEBUG="true", ALLOWED_HOSTS="books.example.org")
    assert settings.DEBUG is False
    assert settings.ALLOWED_HOSTS == ["books.example.org"], "production keeps everything else from base"


def test_production_turns_the_security_settings_on(load):
    settings = load("production", SECRET_KEY=KEY, ALLOWED_HOSTS="books.example.org")
    assert getattr(settings, "SECURE_SSL_REDIRECT", False) is True
    assert getattr(settings, "SESSION_COOKIE_SECURE", False) is True
    assert getattr(settings, "CSRF_COOKIE_SECURE", False) is True
    assert getattr(settings, "SECURE_HSTS_SECONDS", 0) >= 31536000, "HSTS for at least a year"
    assert getattr(settings, "SECURE_PROXY_SSL_HEADER", None) == ("HTTP_X_FORWARDED_PROTO", "https")


def test_production_passes_the_deploy_checks(load):
    settings = load("production", SECRET_KEY=KEY, ALLOWED_HOSTS="books.example.org")
    values = {name: getattr(settings, name) for name in dir(settings)
              if name.isupper() and name not in ("INSTALLED_APPS", "DATABASES", "TIME_ZONE", "USE_TZ")}
    with override_settings(**values):
        found = checks.run_checks(include_deployment_checks=True, tags=[checks.Tags.security])
    wanted = {"security.W001", "security.W004", "security.W008", "security.W009", "security.W010",
              "security.W011", "security.W012", "security.W016", "security.W018", "security.W020"}
    problems = [f"{m.id}: {m.msg}" for m in found if m.id in wanted]
    assert problems == [], "manage.py check --deploy would warn:\n" + "\n".join(problems)
