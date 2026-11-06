"""Loans: written for you, nothing to change here."""
from django.db import models


class Loan(models.Model):
    title = models.CharField(max_length=200)
    reader = models.CharField(max_length=50)
    due = models.DateField()
    flagged = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} ({self.reader})"
