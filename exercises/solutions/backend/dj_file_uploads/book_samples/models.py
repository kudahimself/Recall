"""File Uploads & Storage: practise FileField, upload_to and the storage's names and URLs.

Reference solution.
"""
from django.db import models


def sample_path(book, filename):
    """Where a book's sample is stored, inside MEDIA_ROOT: samples/<the book's isbn>/<filename>."""
    return f"samples/{book.isbn}/{filename}"


class Book(models.Model):
    """A book in the shop."""

    isbn = models.CharField(max_length=13)
    title = models.CharField(max_length=200)
    sample = models.FileField(upload_to=sample_path, blank=True)
    cover = models.FileField(upload_to="covers/%Y/%m/", blank=True)

    def __str__(self):
        return self.title
