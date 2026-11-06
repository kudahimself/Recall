"""PostgreSQL Features: practise JSONField, its default, and a composite index.

Fix the Edition model below so the tests in test_editions.py pass.
There are no migrations in this exercise: the tests build the tables straight from your models.
Run them from the exercise folder with: pytest
"""
from django.db import models
from django.utils import timezone


class Edition(models.Model):
    """One edition of a book: details holds what differs from edition to edition.

    TODO:
    - kind ("hardback", "paperback", "ebook") is filtered on all the time, so it gets
      its own column: up to 20 characters.
    - details must start as a new empty dict for every edition.
    - a composite index named "edition_kind_newest_idx" for the busiest query:
      editions of one kind, newest first.
    """

    title = models.CharField(max_length=200)
    created = models.DateTimeField(default=timezone.now)
    details = models.JSONField(default={})

    def __str__(self):
        return self.title
