"""File Uploads & Storage: refuse a sample that is too large or not a PDF.

Write SampleSerializer so the tests in test_book_samples.py pass.
"""
from rest_framework import serializers

from book_samples.models import Book

MAX_SAMPLE_BYTES = 2 * 1024 * 1024  # 2 MB


class SampleSerializer(serializers.ModelSerializer):
    """A new book with its sample: the fields isbn, title and sample.

    TODO:
    - the Meta that makes it a ModelSerializer of Book with those fields;
    - validate_sample: refuse a file over MAX_SAMPLE_BYTES, or one whose name
      does not end in .pdf (in any case), with a ValidationError; return the file otherwise.
    """
