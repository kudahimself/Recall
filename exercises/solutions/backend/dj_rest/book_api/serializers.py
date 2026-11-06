"""Django REST Framework: reference solution, the serializer."""
from rest_framework import serializers

from book_api.models import Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "title", "pages", "on_loan"]
