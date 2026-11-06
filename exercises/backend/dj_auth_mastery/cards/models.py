"""Library cards and loans: written for you, nothing to change here."""
from django.conf import settings
from django.db import models


class LibraryCard(models.Model):
    number = models.CharField(max_length=10, unique=True)
    reader = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="library_card")

    def __str__(self):
        return self.number


class Loan(models.Model):
    reader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="card_loans")
    title = models.CharField(max_length=200)
    renewals = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title
