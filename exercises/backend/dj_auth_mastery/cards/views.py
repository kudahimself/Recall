"""Auth Mastery: issuing cards, signing in with one, and who may renew a loan.

Write the functions and views below so the tests in test_card_auth.py pass.
cards/urls.py already routes to each view.
"""
from django.contrib.auth import authenticate, get_user_model, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST

from cards.models import LibraryCard, Loan


def issue_card(username, number, pin):
    """Create a reader with the PIN as their password, and their card; return the reader.

    The PIN must pass the project's AUTH_PASSWORD_VALIDATORS first: a weak one raises
    ValidationError and creates nothing.
    """
    # TODO
    raise NotImplementedError


def card_login(request):
    """POST card and pin.

    Wrong ones answer "Unknown card or wrong PIN." with status 401.
    Right ones sign the reader in and answer JSON {"reader": <username>, "backend": <the
    backend that signed them in>}.
    """
    # TODO
    raise NotImplementedError


def can_renew(user, loan):
    """True when an active user may renew this loan: their own loan, or any loan when
    they hold the cards.change_loan permission. An inactive user may renew nothing."""
    # TODO
    raise NotImplementedError


# TODO: signed-in readers only, and POST only.
def renew(request, pk):
    """Add one to the loan's renewals and answer JSON {"title": ..., "renewals": ...}.

    A 404 for a missing loan, a 403 when can_renew() says no.
    """
    # TODO
    raise NotImplementedError
