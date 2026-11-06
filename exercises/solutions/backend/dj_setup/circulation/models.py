"""Setup & Project Structure: reference solution."""
from django.db import models


class Loan(models.Model):
    """A book lent to a borrower."""

    borrower = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    renewals = models.PositiveIntegerField(default=0)
