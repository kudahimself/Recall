import pytest
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group, Permission
from django.core.exceptions import ValidationError

from cards import auth_settings
from cards.backends import CardBackend
from cards.models import LibraryCard, Loan
from cards.views import can_renew, issue_card

pytestmark = [pytest.mark.django_db, pytest.mark.urls("cards.urls")]

User = get_user_model()
CARD_BACKEND = "cards.backends.CardBackend"
MODEL_BACKEND = "django.contrib.auth.backends.ModelBackend"


@pytest.fixture(autouse=True)
def card_settings(settings):
    """Apply cards/auth_settings.py, as if it were part of settings.py."""
    for name in ("AUTHENTICATION_BACKENDS", "PASSWORD_HASHERS", "SESSION_COOKIE_SECURE",
                 "SESSION_COOKIE_HTTPONLY", "SESSION_COOKIE_SAMESITE"):
        setattr(settings, name, getattr(auth_settings, name))
    settings.AUTH_PASSWORD_VALIDATORS = [
        {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 6}},
    ]


@pytest.fixture
def ann():
    reader = User.objects.create_user("ann", password="773105")
    LibraryCard.objects.create(number="1042", reader=reader)
    return reader


def test_the_settings_put_the_card_backend_first():
    assert auth_settings.AUTHENTICATION_BACKENDS == [CARD_BACKEND, MODEL_BACKEND]
    assert auth_settings.PASSWORD_HASHERS[0] == "django.contrib.auth.hashers.PBKDF2PasswordHasher"


def test_issue_card_validates_the_pin_then_hashes_it():
    with pytest.raises(ValidationError):
        issue_card("ann", "1042", "77310")
    assert not User.objects.exists() and not LibraryCard.objects.exists()
    reader = issue_card("ann", "1042", "773105")
    assert reader.library_card.number == "1042"
    assert reader.password.startswith("pbkdf2_sha256$")
    assert reader.check_password("773105")


def test_a_card_signs_in_through_the_card_backend(ann):
    reader = authenticate(None, card="1042", pin="773105")
    assert reader == ann
    assert reader.backend == CARD_BACKEND
    reader = authenticate(None, username="ann", password="773105")
    assert reader.backend == MODEL_BACKEND


def test_misses_return_none_so_the_next_backend_can_try(ann):
    backend = CardBackend()
    assert backend.authenticate(None, card="9999", pin="773105") is None
    assert backend.authenticate(None, card="1042", pin="000000") is None
    assert backend.authenticate(None) is None
    ann.is_active = False
    ann.save()
    assert backend.authenticate(None, card="1042", pin="773105") is None
    assert authenticate(None, card="1042", pin="773105") is None


def test_get_user_reloads_by_primary_key(ann):
    backend = CardBackend()
    assert backend.get_user(ann.pk) == ann
    assert backend.get_user(ann.pk + 100) is None


def test_an_old_md5_hash_still_works_and_is_upgraded(ann):
    User.objects.filter(pk=ann.pk).update(password=make_password("773105", hasher="md5"))
    assert User.objects.get(pk=ann.pk).password.startswith("md5$")
    assert authenticate(None, card="1042", pin="773105") == ann
    assert User.objects.get(pk=ann.pk).password.startswith("pbkdf2_sha256$")


def test_card_login_signs_in_with_a_fresh_session(client, ann):
    session = client.session
    session["basket"] = ["Dune"]
    session.save()
    before = session.session_key
    response = client.post("/card-login/", {"card": "1042", "pin": "773105"})
    assert response.status_code == 200
    assert response.json() == {"reader": "ann", "backend": CARD_BACKEND}
    after = client.session
    assert after.session_key != before
    assert after["_auth_user_id"] == str(ann.pk)
    assert after["basket"] == ["Dune"]


def test_card_login_refuses_a_wrong_pin(client, ann):
    response = client.post("/card-login/", {"card": "1042", "pin": "000000"})
    assert response.status_code == 401
    assert response.content == b"Unknown card or wrong PIN."
    assert "_auth_user_id" not in client.session


def test_the_session_cookie_carries_its_flags(client, ann):
    client.post("/card-login/", {"card": "1042", "pin": "773105"})
    cookie = client.cookies["sessionid"]
    assert cookie["secure"] is True
    assert cookie["httponly"] is True
    assert cookie["samesite"] == "Lax"


def test_can_renew_checks_the_loan_itself(ann):
    ben = User.objects.create_user("ben")
    librarian = User.objects.create_user("lib")
    group = Group.objects.create(name="Librarians")
    group.permissions.add(Permission.objects.get(codename="change_loan", content_type__app_label="cards"))
    librarian.groups.add(group)
    loan = Loan.objects.create(reader=ann, title="Dune")
    assert can_renew(ann, loan) is True
    assert can_renew(ben, loan) is False
    assert can_renew(User.objects.get(pk=librarian.pk), loan) is True
    ann.is_active = False
    assert can_renew(ann, loan) is False


def test_renew_needs_a_signed_in_reader_allowed_to_renew(client, ann):
    loan = Loan.objects.create(reader=ann, title="Dune")
    assert client.post(f"/loans/{loan.pk}/renew/").status_code == 302
    client.post("/card-login/", {"card": "1042", "pin": "773105"})
    assert client.get(f"/loans/{loan.pk}/renew/").status_code == 405
    assert client.post(f"/loans/{loan.pk}/renew/").json() == {"title": "Dune", "renewals": 1}
    assert client.post("/loans/999/renew/").status_code == 404
    other = Loan.objects.create(reader=User.objects.create_user("ben"), title="Emma")
    assert client.post(f"/loans/{other.pk}/renew/").status_code == 403
