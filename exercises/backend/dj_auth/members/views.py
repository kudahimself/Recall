"""Authentication & Permissions: practise users, sign-in, login_required and permissions.

Write the helpers and views below so the tests in test_member_auth.py pass.
members/urls.py already routes to each view.
Run them from the exercise folder with: pytest
"""
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group, Permission
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse
from django.shortcuts import get_object_or_404, redirect

from members.models import Loan


def register(username, password):
    """Create and return a user whose password is stored hashed, never as typed."""
    # TODO
    raise NotImplementedError


def make_librarian(user):
    """Put the user in the "Librarians" group, which holds the members.change_loan permission.

    Create the group the first time; calling this again must not make a second group.
    """
    # TODO
    raise NotImplementedError


def sign_in(request):
    """POST username and password.

    Wrong credentials answer "Wrong username or password." with status 401.
    Right ones sign the user in for this session and redirect to the my-loans route.
    """
    # TODO
    raise NotImplementedError


def sign_out(request):
    """Sign the user out and redirect to the sign-in route."""
    # TODO
    raise NotImplementedError


# TODO: only signed-in users may see this; send anyone else to the login page.
def my_loans(request):
    """JSON {"user": <username>, "titles": [...]}: the signed-in user's loans, in title order."""
    # TODO
    raise NotImplementedError


# TODO: only signed-in users may call this.
def renew_loan(request, pk):
    """POST: add one to the loan's renewals and answer JSON {"title": ..., "renewals": ...}.

    Only users with the members.change_loan permission may renew; anyone else gets 403.
    """
    # TODO
    raise NotImplementedError
