"""Loans: written for you, nothing to change here."""
from django.db import models


class Loan(models.Model):
    title = models.CharField(max_length=200)
    email = models.EmailField()
    due_on = models.DateField()
    reminded = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} to {self.email}"
