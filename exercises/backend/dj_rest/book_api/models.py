"""The book model the API serves: written for you, nothing to change here."""
from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=200)
    pages = models.PositiveIntegerField()
    on_loan = models.BooleanField(default=False)

    def __str__(self):
        return self.title
