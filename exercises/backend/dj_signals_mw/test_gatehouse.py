import re

import pytest
from django.contrib.auth import get_user_model
from django.db.models.signals import post_delete, post_save

from gatehouse import stack
from gatehouse.models import AuditEntry, Book, Loan

pytestmark = [pytest.mark.django_db, pytest.mark.urls("gatehouse.urls")]

# Not imported here on purpose: gatehouse.signals must be connected by the app itself.


@pytest.fixture
def gate(settings):
    """Use gatehouse/stack.py as settings.MIDDLEWARE."""
    settings.MIDDLEWARE = stack.MIDDLEWARE
    return settings


def test_every_response_gets_a_new_request_id(client, gate):
    first, second = client.get("/desk/"), client.get("/desk/")
    assert re.fullmatch(r"[0-9a-f]{32}", first["X-Request-ID"])
    assert first["X-Request-ID"] != second["X-Request-ID"]
    assert first.content.decode() == f"Desk, request {first['X-Request-ID']}, reader anonymous"


def test_an_incoming_request_id_is_kept(client, gate):
    response = client.get("/desk/", headers={"X-Request-ID": "trace-42"})
    assert response["X-Request-ID"] == "trace-42"
    assert response.content == b"Desk, request trace-42, reader anonymous"


def test_the_reader_header_names_the_signed_in_reader(client, gate):
    assert client.get("/desk/")["X-Reader"] == "anonymous"
    client.force_login(get_user_model().objects.create_user("ann"))
    response = client.get("/desk/")
    assert response["X-Reader"] == "ann"
    assert response.content.decode().endswith(", reader ann")


def test_maintenance_answers_503_before_any_inner_layer(client, gate, django_assert_num_queries):
    client.force_login(get_user_model().objects.create_user("ann"))
    gate.LIBRARY_CLOSED = True
    with django_assert_num_queries(0):
        response = client.get("/desk/")
    assert response.status_code == 503
    assert response.content == b"The library is closed for maintenance."
    assert re.fullmatch(r"[0-9a-f]{32}", response["X-Request-ID"])
    assert "X-Reader" not in response
    gate.LIBRARY_CLOSED = False
    assert client.get("/desk/").status_code == 200


def test_the_stack_keeps_djangos_own_order(gate):
    django_own = [m for m in stack.MIDDLEWARE if m.startswith("django.")]
    assert django_own == [
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
    ]
    assert len(stack.MIDDLEWARE) == 7


def test_the_app_connects_its_receivers():
    assert post_save.has_listeners(Loan)
    assert post_delete.has_listeners(Loan)


def test_only_a_new_loan_counts():
    dune = Book.objects.create(title="Dune")
    loan = Loan.objects.create(book=dune, reader="ann")
    Loan.objects.create(book=dune, reader="ben")
    loan.reader = "cat"
    loan.save()
    dune.refresh_from_db()
    assert dune.times_lent == 2


def test_a_deleted_loan_is_logged():
    dune = Book.objects.create(title="Dune")
    Loan.objects.create(book=dune, reader="ann").delete()
    assert list(AuditEntry.objects.values_list("message", flat=True)) == ["Loan of Dune to ann deleted"]
    dune.delete()
    assert AuditEntry.objects.count() == 1
