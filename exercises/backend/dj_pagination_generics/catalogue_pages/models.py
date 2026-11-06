"""Books and loans: written for you, nothing to change here."""
from django.conf import settings
from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=200)
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title


class Loan(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="loans")
    reader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="loans")
    lent_on = models.DateField()

    def __str__(self):
        return f"{self.book} to {self.reader} on {self.lent_on}"
