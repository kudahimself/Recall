"""The loan desk's book model: written for you, nothing to change here."""
from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=200)
    on_loan = models.BooleanField(default=False)
    note = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.title
