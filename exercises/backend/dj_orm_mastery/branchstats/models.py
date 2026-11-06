"""The library's branches and books: written for you, nothing to change here."""
from django.db import models


class Branch(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Author(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=200)
    summary = models.TextField(blank=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT, related_name="books")
    tags = models.ManyToManyField(Tag, blank=True, related_name="books")
    loans = models.PositiveIntegerField(default=0)
    copies_free = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.title
