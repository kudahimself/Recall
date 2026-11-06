"""The stacks' book model: written for you, nothing to change here."""
from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=200)
    pages = models.PositiveIntegerField(default=100)
    on_loan = models.BooleanField(default=False)
    renewals = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title
