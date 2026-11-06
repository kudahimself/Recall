"""Books, loans and the audit log: written for you, nothing to change here."""
from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=200)
    times_lent = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title


class Loan(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="loans")
    reader = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.book} to {self.reader}"


class AuditEntry(models.Model):
    message = models.CharField(max_length=200)

    def __str__(self):
        return self.message
