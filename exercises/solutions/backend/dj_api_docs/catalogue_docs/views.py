"""API Documentation: reference solution."""
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

    @extend_schema(summary="Lend one copy", tags=["loans"], request=None, responses={200: LoanReceiptSerializer})
    @action(detail=True, methods=["post"])
    def lend(self, request, pk=None):
        book = self.get_object()
        book.copies = max(book.copies - 1, 0)
        book.save(update_fields=["copies"])
        return Response(LoanReceiptSerializer({"book": book.title, "copies_left": book.copies}).data)


class StockStats(APIView):
    @extend_schema(
        summary="Stock totals",
        responses={200: StockStatsSerializer},
        examples=[OpenApiExample("A small branch", value={"titles": 2, "copies": 5})],
    )
    def get(self, request):
        copies = Book.objects.aggregate(total=Sum("copies"))["total"] or 0
        return Response({"titles": Book.objects.count(), "copies": copies})
