"""The library's holdings: written for you, nothing to change here."""
from django.db import models


class Author(models.Model):
    full_name = models.CharField(max_length=100)

    def __str__(self):
        return self.full_name


class Book(models.Model):
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
    title = models.CharField(max_length=200)
    pages = models.PositiveIntegerField()
    year = models.PositiveIntegerField()
    on_loan = models.BooleanField(default=False)

    def __str__(self):
        return self.title
