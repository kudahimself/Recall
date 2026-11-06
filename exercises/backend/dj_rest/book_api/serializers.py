"""Django REST Framework: the serializer.

TODO: make BookSerializer a ModelSerializer of Book with the fields
id, title, pages and on_loan, in that order.
"""
from rest_framework import serializers

from book_api.models import Book


class BookSerializer(serializers.Serializer):
    pass
