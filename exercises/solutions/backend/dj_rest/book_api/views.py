"""Django REST Framework: reference solution, the views."""
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from book_api.models import Book
from book_api.serializers import BookSerializer


@api_view(["GET", "POST"])
def book_list(request):
    if request.method == "POST":
        serializer = BookSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(BookSerializer(Book.objects.order_by("title"), many=True).data)


class BookDetail(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        return Response(BookSerializer(get_object_or_404(Book, pk=pk)).data)

    def put(self, request, pk):
        serializer = BookSerializer(get_object_or_404(Book, pk=pk), data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        get_object_or_404(Book, pk=pk).delete()
        return Response(status=204)
