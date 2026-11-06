"""Setup & Project Structure: the circulation app's one model."""
from django.db import models


class Loan(models.Model):
    """A book lent to a borrower."""

    borrower = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    # TODO: add renewals, a PositiveIntegerField that starts at 0,
    #       then make its migration and apply it (see README.md).
