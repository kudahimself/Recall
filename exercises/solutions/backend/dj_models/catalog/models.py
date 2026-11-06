"""Models & Migrations: reference solution."""
from django.db import models


class Branch(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Author(models.Model):
    full_name = models.CharField(max_length=100)

    def __str__(self):
        return self.full_name


class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name


class Book(models.Model):
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT, related_name="books")
    tags = models.ManyToManyField(Tag, related_name="books", blank=True)
    title = models.CharField(max_length=200)
    summary = models.TextField(blank=True)
    on_loan = models.BooleanField(default=False)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return f"{self.title} by {self.author}"
