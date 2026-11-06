"""DRF Mastery: reference solution."""
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from loan_api.errors import NoCopyFree
from loan_api.models import Book
from loan_api.serializers import BookSerializer


class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "books"

    def get_queryset(self):
        return Book.objects.select_related("author").prefetch_related("tags").order_by("title")

    @action(detail=True, methods=["post"])
    def lend(self, request, pk=None):
        book = self.get_object()
        if book.copies == 0:
            raise NoCopyFree
        book.copies -= 1
        book.save(update_fields=["copies"])
        return Response(self.get_serializer(book).data)
