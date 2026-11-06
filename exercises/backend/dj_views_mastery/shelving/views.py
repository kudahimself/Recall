"""Views Mastery: practise dispatch(), method_decorator, Http404 and PermissionDenied,
Post/Redirect/Get, JsonResponse(safe=False) and StreamingHttpResponse.

Write the views below so the tests in test_shelving_views.py pass.
shelving/urls.py already routes to each one.
Run them from the exercise folder with: pytest
"""
import csv

from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse, StreamingHttpResponse
from django.shortcuts import get_object_or_404, redirect
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.cache import cache_page

from shelving.models import Book, Shelf


class ShelfView(View):
    """One shelf, at /shelves/<code>/, for GET and POST only (anything else: 405).

    TODO:
    - dispatch(): for every verb, find the shelf by its code (a 404 when there is none)
      and keep it on self, then add an X-Shelf header with the code to every response,
      the 405 included.
    - get(): JSON, a list of the shelf's titles in title order.
    - post(): staff only (anyone else: 403, raised as PermissionDenied). Add a book with
      the posted title, then redirect to this shelf's page.
    """


class NewArrivalsView(View):
    """GET /new/: JSON, a list of the three newest titles, newest first.

    TODO: every visitor sees the same page, so cache the whole view for 60 seconds
    with cache_page.
    """


class MyHoldsView(View):
    """GET /my-holds/: JSON {"reader": <username>, "titles": [...]}, the titles held for
    the signed-in reader, in title order.

    TODO: send anyone not signed in to the login page with login_required.
    """


def export_shelf(request, code):
    """GET /shelves/<code>/export/: the shelf's books as CSV, streamed row by row.

    A header row "title,added", then one row per book in title order, with added as
    an ISO date (2026-03-09). Download it as "<code>.csv". A 404 for an unknown shelf.
    No book query may run until the rows are read.
    """
    # TODO
    raise NotImplementedError
