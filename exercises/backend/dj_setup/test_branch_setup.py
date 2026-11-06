import importlib
import os
import subprocess
import sys
from pathlib import Path

import pytest
from django.core.management import call_command
from django.db import connection
from django.db.migrations.loader import MigrationLoader

from circulation.models import Loan

HERE = Path(__file__).resolve().parent


def settings_module(name):
    return importlib.import_module(f"branchsite.settings.{name}")


def run_manage(*args, settings):
    """Run python manage.py ... in this folder, under the given settings module."""
    env = dict(os.environ, DJANGO_SETTINGS_MODULE=settings, PYTHONDONTWRITEBYTECODE="1")
    return subprocess.run(
        [sys.executable, "manage.py", *args],
        cwd=HERE, capture_output=True, text=True, env=env, timeout=120,
    )


def test_base_registers_circulation_by_its_config_class():
    installed = settings_module("base").INSTALLED_APPS
    assert "circulation.apps.CirculationConfig" in installed
    assert "circulation" not in installed
    assert installed[:2] == ["django.contrib.auth", "django.contrib.contenttypes"]


def test_dev_and_prod_build_on_base():
    base, dev, prod = settings_module("base"), settings_module("dev"), settings_module("prod")
    for env in (dev, prod):
        assert env.INSTALLED_APPS == base.INSTALLED_APPS
        assert env.DATABASES == base.DATABASES
        assert env.ROOT_URLCONF == "branchsite.urls"
    assert dev.DEBUG is True
    assert prod.DEBUG is False
    assert prod.ALLOWED_HOSTS == ["library.example.com"]


@pytest.mark.parametrize("module, debug", [("branchsite.settings.dev", "True"), ("branchsite.settings.prod", "False")])
def test_manage_py_loads_the_app_under_each_settings_module(module, debug):
    code = (
        "from django.apps import apps; from django.conf import settings; "
        "print(type(apps.get_app_config('circulation')).__name__, settings.DEBUG)"
    )
    result = run_manage("shell", "-c", code, settings=module)
    assert result.returncode == 0, result.stderr
    assert result.stdout.splitlines()[-1].split() == ["CirculationConfig", debug]


@pytest.mark.django_db
def test_renewals_is_on_the_model_and_in_a_migration():
    field = Loan._meta.get_field("renewals")
    assert field.get_internal_type() == "PositiveIntegerField"
    assert field.default == 0
    migrated = MigrationLoader(None, ignore_no_migrations=True).project_state()
    assert "renewals" in migrated.models["circulation", "loan"].fields
    try:
        call_command("makemigrations", "circulation", "--check", "--dry-run", verbosity=0)
    except SystemExit:
        pytest.fail("models.py has changes no migration holds yet: run makemigrations")


@pytest.mark.django_db
def test_migrate_builds_the_renewals_column():
    loan = Loan.objects.create(borrower="ann", title="Dune")
    assert Loan.objects.get(pk=loan.pk).renewals == 0
    with connection.cursor() as cursor:
        columns = [c.name for c in connection.introspection.get_table_description(cursor, "circulation_loan")]
    assert "renewals" in columns
