"""The serializers: written for you, nothing to change here."""
from rest_framework import serializers

from catalogue_pages.models import Book, Loan


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "title", "stock"]


class LoanSerializer(serializers.ModelSerializer):
    book = serializers.StringRelatedField()

    class Meta:
        model = Loan
        fields = ["id", "book", "lent_on"]
