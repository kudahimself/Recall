"""File Uploads & Storage: refuse a sample that is too large or not a PDF.

Reference solution.
"""
from rest_framework import serializers

from book_samples.models import Book

MAX_SAMPLE_BYTES = 2 * 1024 * 1024  # 2 MB


class SampleSerializer(serializers.ModelSerializer):
    """A new book with its sample: the fields isbn, title and sample."""

    class Meta:
        model = Book
        fields = ["isbn", "title", "sample"]

    def validate_sample(self, upload):
        if upload.size > MAX_SAMPLE_BYTES:
            raise serializers.ValidationError("A sample can be at most 2 MB.")
        if not upload.name.lower().endswith(".pdf"):
            raise serializers.ValidationError("A sample must be a PDF.")
        return upload
