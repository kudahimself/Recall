"""Shelves and the books on them: written for you, nothing to change here."""
from django.conf import settings
from django.db import models


class Shelf(models.Model):
    code = models.SlugField(unique=True)
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Book(models.Model):
    shelf = models.ForeignKey(Shelf, on_delete=models.CASCADE, related_name="books")
    title = models.CharField(max_length=200)
    added = models.DateTimeField(auto_now_add=True)
    held_for = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="shelving_holds",
    )

    def __str__(self):
        return self.title
