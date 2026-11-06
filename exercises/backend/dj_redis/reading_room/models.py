"""Books: written for you, nothing to change here."""
from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=200, unique=True)
    genre = models.CharField(max_length=50)

    def __str__(self):
        return self.title
