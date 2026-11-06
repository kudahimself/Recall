"""Authentication & Permissions: a loan belongs to a user."""
from django.conf import settings
from django.db import models


class Loan(models.Model):
    """A book lent to a member.

    TODO: add borrower, the user who has the book: point the foreign key at
    the project's user model through settings, delete a user's loans with the user,
    and name the way back from a user "member_loans".
    """

    title = models.CharField(max_length=200)
    renewals = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title
