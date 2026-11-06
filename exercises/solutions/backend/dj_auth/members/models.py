"""Authentication & Permissions: reference solution, the model."""
from django.conf import settings
from django.db import models


class Loan(models.Model):
    """A book lent to a member."""

    borrower = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="member_loans",
    )
    title = models.CharField(max_length=200)
    renewals = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title
