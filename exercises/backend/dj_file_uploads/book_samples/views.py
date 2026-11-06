"""File Uploads & Storage: take a multipart upload and save it through the serializer.

Write SampleUpload so the tests in test_book_samples.py pass.
book_samples/urls.py already routes /samples/ to it.
"""
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from book_samples.serializers import SampleSerializer


class SampleUpload(APIView):
    """POST /samples/ with a multipart form holding isbn, title and the sample file.

    TODO:
    - accept multipart form data only, so a JSON body gets 415;
    - post(): validate with SampleSerializer; answer the errors with 400, or save the book
      and answer 201 with {"isbn": ..., "name": the sample's stored name, "url": its URL}.
    """
