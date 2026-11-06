"""PostgreSQL Features: practise JSONField, its default, and a composite index.

Reference solution.
"""
from django.db import models
from django.utils import timezone


class Edition(models.Model):
    """One edition of a book: details holds what differs from edition to edition."""

    title = models.CharField(max_length=200)
    kind = models.CharField(max_length=20)
    created = models.DateTimeField(default=timezone.now)
    details = models.JSONField(default=dict)  # the callable: a new dict for every edition

    class Meta:
        indexes = [
            models.Index(fields=["kind", "-created"], name="edition_kind_newest_idx"),
        ]

    def __str__(self):
        return self.title
