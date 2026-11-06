"""Branches, books and loans: written for you, nothing to change here."""
from django.db import models


class Branch(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=200, unique=True)
    copies = models.PositiveIntegerField(default=1)
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT, related_name="books")

    def __str__(self):
        return self.title


class Loan(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="loans")
    reader = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.book} to {self.reader}"
