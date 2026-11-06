"""The serializers: written for you, nothing to change here."""
from rest_framework import serializers

from catalogue_docs.models import Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "title", "copies"]


class LoanReceiptSerializer(serializers.Serializer):
    """What the lend action answers: not a book."""

    book = serializers.CharField()
    copies_left = serializers.IntegerField()


class StockStatsSerializer(serializers.Serializer):
    """What /stats/ answers."""

    titles = serializers.IntegerField()
    copies = serializers.IntegerField()
