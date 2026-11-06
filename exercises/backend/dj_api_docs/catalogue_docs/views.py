"""API Documentation: practise @extend_schema where drf-spectacular's guess falls short.

The views work already; do not change what they do. Add @extend_schema to the two
methods below so the tests in test_catalogue_docs.py pass.
"""
from django.db.models import Sum
from drf_spectacular.utils import OpenApiExample, extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from catalogue_docs.models import Book
from catalogue_docs.serializers import BookSerializer, LoanReceiptSerializer, StockStatsSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.order_by("title")
    serializer_class = BookSerializer

    # TODO: document this operation truthfully: the summary "Lend one copy", the tag
    # "loans", no request body, and a 200 response shaped by LoanReceiptSerializer.
    @action(detail=True, methods=["post"])
    def lend(self, request, pk=None):
        book = self.get_object()
        book.copies = max(book.copies - 1, 0)
        book.save(update_fields=["copies"])
        return Response(LoanReceiptSerializer({"book": book.title, "copies_left": book.copies}).data)


class StockStats(APIView):
    # TODO: document get: the summary "Stock totals", a 200 response shaped by
    # StockStatsSerializer, and one example named "A small branch" whose value is
    # {"titles": 2, "copies": 5}.
    def get(self, request):
        copies = Book.objects.aggregate(total=Sum("copies"))["total"] or 0
        return Response({"titles": Book.objects.count(), "copies": copies})
