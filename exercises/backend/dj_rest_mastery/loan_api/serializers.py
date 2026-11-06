"""DRF Mastery: practise nested and related serializer fields.

Write the two serializers so the tests in test_loan_api.py pass.
Run them from the exercise folder with: pytest
"""
from rest_framework import serializers

from loan_api.models import Author, Book, Tag


class AuthorSerializer(serializers.ModelSerializer):
    """TODO: an Author as {"id": ..., "name": ...}."""


class BookSerializer(serializers.ModelSerializer):
    """A Book as {"id", "title", "copies", "author", "tags"}.

    TODO:
    - author is read as a nested AuthorSerializer, read-only;
    - author_id is written as the author's primary key and saved to the author field,
      write-only, so it never shows in the output;
    - tags are read and written as a list of tag names, and may be left out.
    """
