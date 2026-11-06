"""Readers' book suggestions: written for you, nothing to change here."""
from django.conf import settings
from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name


class Suggestion(models.Model):
    title = models.CharField(max_length=200)
    isbn = models.CharField("ISBN", max_length=13, unique=True)
    reason = models.TextField(blank=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name="suggestions")
    suggested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="book_suggestions",
    )
    approved = models.BooleanField(default=False)

    def __str__(self):
        return self.title
