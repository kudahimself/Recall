"""Pagination & Generic Views: practise generic views and get_queryset().

Write the three views so the tests in test_catalogue_pages.py pass.
catalogue_pages/urls.py already routes them; the serializers are written for you.
"""
from rest_framework import generics, permissions

from catalogue_pages.models import Book, Loan
from catalogue_pages.pagination import NewestLoansFirst, ShelfPages
from catalogue_pages.serializers import BookSerializer, LoanSerializer


class BookList(generics.GenericAPIView):
    """/books/: GET lists the books a page at a time, POST adds one.

    TODO:
    - swap GenericAPIView for the generic view that answers both GET with a list and POST;
    - BookSerializer, and ShelfPages for this view only;
    - the books in title order, only those with stock above 0 when the query string
      has ?in_stock=yes.
    """


class BookDetail(generics.GenericAPIView):
    """/books/<pk>/: GET, PUT, PATCH and DELETE on one book.

    TODO: swap GenericAPIView for the generic view that answers all four, over every book.
    """


class MyLoans(generics.GenericAPIView):
    """/loans/mine/: the signed-in reader's own loans, newest first.

    TODO:
    - swap GenericAPIView for the generic view that answers GET with a list;
    - LoanSerializer and NewestLoansFirst;
    - only a signed-in user may ask, and each sees only their own loans.
    """
