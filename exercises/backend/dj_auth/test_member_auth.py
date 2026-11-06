import pytest
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from members.models import Loan
from members.views import make_librarian, register

pytestmark = [pytest.mark.django_db, pytest.mark.urls("members.urls")]

User = get_user_model()


@pytest.fixture
def ann():
    user = User.objects.create_user("ann", password="s3cret-pass")
    Loan.objects.create(borrower=user, title="Emma")
    Loan.objects.create(borrower=user, title="Dune")
    return user


@pytest.fixture
def ben():
    user = User.objects.create_user("ben", password="other-pass")
    Loan.objects.create(borrower=user, title="Ubik")
    return user


def test_register_stores_a_hash():
    user = register("cat", "s3cret-pass")
    stored = User.objects.get(username="cat")
    assert stored.pk == user.pk
    assert stored.password != "s3cret-pass"
    assert stored.password.startswith("pbkdf2_sha256$")
    assert stored.check_password("s3cret-pass")


def test_a_loan_points_at_the_user_model(ann):
    field = Loan._meta.get_field("borrower")
    assert field.remote_field.model is User
    assert sorted(loan.title for loan in ann.member_loans.all()) == ["Dune", "Emma"]
    ann.delete()
    assert Loan.objects.count() == 0


def test_wrong_credentials_are_refused(client, ann):
    response = client.post("/login/", {"username": "ann", "password": "wrong"})
    assert response.status_code == 401
    assert response.content == b"Wrong username or password."
    assert "_auth_user_id" not in client.session


def test_right_credentials_sign_in_for_the_session(client, ann, ben):
    response = client.post("/login/", {"username": "ann", "password": "s3cret-pass"})
    assert response.status_code == 302
    assert response["Location"] == "/loans/"
    assert client.session["_auth_user_id"] == str(ann.pk)
    assert client.get("/loans/").json() == {"user": "ann", "titles": ["Dune", "Emma"]}


def test_my_loans_sends_visitors_to_login(client, ann):
    response = client.get("/loans/")
    assert response.status_code == 302
    assert response["Location"] == "/login/?next=/loans/"


def test_sign_out_ends_the_session(client, ann):
    client.force_login(ann)
    response = client.post("/logout/")
    assert response.status_code == 302
    assert response["Location"] == "/login/"
    assert client.get("/loans/").status_code == 302


def test_make_librarian_grants_change_loan_through_a_group(ann, ben):
    assert not ann.has_perm("members.change_loan")
    make_librarian(ann)
    make_librarian(ben)
    make_librarian(ann)
    assert Group.objects.filter(name="Librarians").count() == 1
    assert User.objects.get(pk=ann.pk).has_perm("members.change_loan")
    assert not ann.user_permissions.exists()


def test_only_librarians_renew(client, ann, ben):
    loan = ben.member_loans.get()
    assert client.post(f"/loans/{loan.pk}/renew/").status_code == 302
    client.force_login(ann)
    assert client.post(f"/loans/{loan.pk}/renew/").status_code == 403
    make_librarian(ann)
    assert client.post(f"/loans/{loan.pk}/renew/").json() == {"title": "Ubik", "renewals": 1}
    assert client.post("/loans/999/renew/").status_code == 404
