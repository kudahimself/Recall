"""File Uploads & Storage: practise FileField, upload_to and the storage's names and URLs.

Write sample_path and the two file fields below so the tests in test_book_samples.py pass.
There are no migrations in this exercise: the tests build the tables straight from your models.
Run them from the exercise folder with: pytest
"""
from django.db import models


def sample_path(book, filename):
    """Where a book's sample is stored, inside MEDIA_ROOT: samples/<the book's isbn>/<filename>."""
    # TODO
    raise NotImplementedError


class Book(models.Model):
    """A book in the shop.

    TODO:
    - sample: an optional file (blank=True), stored at sample_path.
    - cover: an optional file, stored in a covers/ folder per year and month, such as covers/2026/11/.
    """

    isbn = models.CharField(max_length=13)
    title = models.CharField(max_length=200)

    def __str__(self):
        return self.title
