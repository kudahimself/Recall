"""Django REST Framework: practise serializers, @api_view, APIView and permissions.

Write the two views below so the tests in test_book_api.py pass.
book_api/urls.py already routes /books/ and /books/<pk>/ to them.
Run them from the exercise folder with: pytest
"""
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from book_api.models import Book
from book_api.serializers import BookSerializer


# TODO: a function view that accepts GET and POST only.
def book_list(request):
    """GET: every book, in title order.
    POST: validate the incoming book; answer the errors with 400, or save it and answer it with 201.
    """
    # TODO
    raise NotImplementedError


class BookDetail(APIView):
    """One book: anyone may GET it, only signed-in users may PUT or DELETE it.

    TODO:
    - get(): the book, or 404;
    - put(): replace the book's fields from the request; 400 with the errors, or 200 with the saved book;
    - delete(): delete it and answer 204 with no body;
    - the permission class that lets anyone read but only signed-in users write.
    """
