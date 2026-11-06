import datetime
import importlib
import io
import sys

import exercise_settings
import pytest
from django.core.checks import run_checks
from django.core.exceptions import ImproperlyConfigured
from django.core.management import call_command
from django.core.management.base import CommandError

from upkeep.models import Loan

ENV = ("DJANGO_DEBUG", "DJANGO_SECRET_KEY", "DJANGO_ALLOWED_HOSTS", "DJANGO_STATIC_ROOT")
A_REAL_SECRET = "p7#Lw2!xQe9vZr4Kt8@Ym1sHd6^Nc3uBj5&Fg0aT-oR$iVwE+lPq"


def run(*args, **options):
    """Run `python manage.py overdue ...` in this process and return what it wrote."""
    out = io.StringIO()
    call_command("overdue", *args, stdout=out, **options)
    return out.getvalue().splitlines()


@pytest.fixture
def loans(db):
    Loan.objects.create(title="Dune", reader="ann", due=datetime.date(2026, 3, 10))
    Loan.objects.create(title="Emma", reader="ben", due=datetime.date(2026, 3, 17))
    Loan.objects.create(title="Beloved", reader="cat", due=datetime.date(2026, 3, 10))
    Loan.objects.create(title="Ubik", reader="dan", due=datetime.date(2026, 3, 25))


def test_overdue_lists_the_late_loans(loans):
    assert run("2026-03-20") == [
        "Beloved (cat), 10 days late",
        "Dune (ann), 10 days late",
        "Emma (ben), 3 days late",
        "3 overdue",
    ]
    assert not Loan.objects.filter(flagged=True).exists()


def test_grace_and_flag_come_as_options_or_as_command_line_words(loans):
    assert run("2026-03-20", grace=5) == ["Beloved (cat), 10 days late", "Dune (ann), 10 days late", "2 overdue"]
    assert run("2026-03-20", "--grace", "5", "--flag")[-1] == "Flagged 2"
    assert sorted(Loan.objects.filter(flagged=True).values_list("title", flat=True)) == ["Beloved", "Dune"]


def test_nothing_overdue_and_bad_input(loans):
    assert run("2026-03-01", flag=True) == ["Nothing overdue."]
    assert not Loan.objects.filter(flagged=True).exists()
    with pytest.raises(CommandError, match="--grace cannot be negative."):
        run("2026-03-20", grace=-1)
    with pytest.raises(CommandError):
        run("20 March")


def load_production(monkeypatch, **env):
    """Import upkeep/production.py afresh, under exactly these environment variables."""
    for name in ENV:
        monkeypatch.delenv(name, raising=False)
    for name, value in env.items():
        monkeypatch.setenv(name, value)
    monkeypatch.delitem(sys.modules, "upkeep.production", raising=False)
    return importlib.import_module("upkeep.production")


def test_production_refuses_to_start_without_a_secret_key(monkeypatch):
    with pytest.raises(ImproperlyConfigured):
        load_production(monkeypatch)


def test_production_reads_its_config_from_the_environment(monkeypatch):
    prod = load_production(monkeypatch, DJANGO_SECRET_KEY=A_REAL_SECRET, DJANGO_ALLOWED_HOSTS="library.example.com, www.library.example.com,")
    assert prod.DEBUG is False
    assert prod.SECRET_KEY == A_REAL_SECRET
    assert prod.ALLOWED_HOSTS == ["library.example.com", "www.library.example.com"]
    assert prod.STATIC_URL == "static/"
    assert prod.STATIC_ROOT == "/srv/library/static"
    for text, debug in (("True", True), ("true", False), ("1", False), ("False", False)):
        assert load_production(monkeypatch, DJANGO_SECRET_KEY=A_REAL_SECRET, DJANGO_DEBUG=text).DEBUG is debug
    prod = load_production(monkeypatch, DJANGO_SECRET_KEY=A_REAL_SECRET, DJANGO_STATIC_ROOT="/var/www/static")
    assert prod.STATIC_ROOT == "/var/www/static"


@pytest.fixture
def production(monkeypatch, settings):
    """Run with what upkeep/production.py changes in the shared settings, as if
    DJANGO_SETTINGS_MODULE pointed at it."""
    prod = load_production(monkeypatch, DJANGO_SECRET_KEY=A_REAL_SECRET, DJANGO_ALLOWED_HOSTS="library.example.com")
    for name in dir(prod):
        value = getattr(prod, name)
        if name.isupper() and getattr(exercise_settings, name, None) != value:
            setattr(settings, name, value)
    return prod


def test_check_deploy_reports_nothing(production):
    assert production.MIDDLEWARE[0] == "django.middleware.security.SecurityMiddleware"
    assert production.MIDDLEWARE[-1] == "django.middleware.clickjacking.XFrameOptionsMiddleware"
    warnings = run_checks(include_deployment_checks=True, tags=["security"])
    assert [w.id for w in warnings] == []


@pytest.mark.urls("upkeep.urls")
def test_requests_are_sent_to_https(client, production):
    response = client.get("/health/", headers={"host": "library.example.com"})
    assert response.status_code == 301
    assert response["Location"] == "https://library.example.com/health/"
    response = client.get("/health/", headers={"host": "library.example.com"}, secure=True)
    assert response.status_code == 200
    assert response["Strict-Transport-Security"] == "max-age=31536000; includeSubDomains; preload"
    assert response["X-Frame-Options"] == "DENY"
    assert client.get("/health/", headers={"host": "evil.example.com"}, secure=True).status_code == 400
