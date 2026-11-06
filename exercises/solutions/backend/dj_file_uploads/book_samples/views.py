"""File Uploads & Storage: take a multipart upload and save it through the serializer.

Reference solution.
"""
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from book_samples.serializers import SampleSerializer


class SampleUpload(APIView):
    """POST /samples/ with a multipart form holding isbn, title and the sample file."""

    parser_classes = [MultiPartParser]

    def post(self, request):
        serializer = SampleSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        book = serializer.save()
        return Response(
            {"isbn": book.isbn, "name": book.sample.name, "url": book.sample.url},
            status=status.HTTP_201_CREATED,
        )
