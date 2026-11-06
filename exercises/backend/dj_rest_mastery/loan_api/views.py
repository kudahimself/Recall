"""DRF Mastery: practise a ModelViewSet, get_queryset, a custom action and throttling.

Write BookViewSet so the tests in test_loan_api.py pass.
loan_api/urls.py already registers it with a router.
"""
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from loan_api.errors import NoCopyFree
from loan_api.models import Book
from loan_api.serializers import BookSerializer


class BookViewSet(viewsets.ModelViewSet):
    """Every action on books: list, create, retrieve, update, partial_update, destroy.

    TODO:
    - serializer_class, and a get_queryset() of the books in title order that loads each
      book's author and tags up front, so listing any number of books takes two queries;
    - anyone may read, only a signed-in user may write;
    - a throttle with its own scope, "books", whose rate is in DEFAULT_THROTTLE_RATES;
    - lend, a POST action on one book at /books/<pk>/lend/: take one copy and answer
      the book, or raise NoCopyFree when none is left.
    """
