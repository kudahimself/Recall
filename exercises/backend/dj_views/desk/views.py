"""Views & Request/Response: practise function views, request data and responses.

Write the four views below so the tests in test_desk_views.py pass.
desk/urls.py already sends each path to its view, passing pk from the URL.
Run them from the exercise folder with: pytest
"""
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from desk.models import Book


def book_detail(request, pk):
    """JSON {"id": ..., "title": ..., "on_loan": ...} for the book, or a 404 page when it does not exist."""
    # TODO
    raise NotImplementedError


def search(request):
    """JSON {"q": q, "titles": [...]}: the query string's q, stripped of spaces ("" when missing),
    and the titles that contain it in any case, in title order."""
    # TODO
    raise NotImplementedError


def return_book(request, pk):
    """GET shows desk/return.html with the book as "book".
    POST marks the book returned (on_loan False), saves it and redirects to its book-detail page."""
    # TODO
    raise NotImplementedError


def add_note(request, pk):
    """POST with a "note" field: save the note on the book and answer "saved <note>" with status 201.

    A missing or blank note answers "note is required" with status 400 and changes nothing.
    """
    # TODO
    raise NotImplementedError
