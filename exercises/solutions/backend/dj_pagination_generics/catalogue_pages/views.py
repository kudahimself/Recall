"""Pagination & Generic Views: reference solution."""
from rest_framework import generics, permissions

from catalogue_pages.models import Book, Loan
from catalogue_pages.pagination import NewestLoansFirst, ShelfPages
from catalogue_pages.serializers import BookSerializer, LoanSerializer


class BookList(generics.ListCreateAPIView):
    serializer_class = BookSerializer
    pagination_class = ShelfPages

    def get_queryset(self):
        books = Book.objects.order_by("title")
        if self.request.query_params.get("in_stock") == "yes":
            books = books.filter(stock__gt=0)
        return books


class BookDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class MyLoans(generics.ListAPIView):
    serializer_class = LoanSerializer
    pagination_class = NewestLoansFirst
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Loan.objects.filter(reader=self.request.user).select_related("book")
