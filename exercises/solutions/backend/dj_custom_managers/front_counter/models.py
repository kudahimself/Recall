"""Custom Managers: reference solution."""
from django.db import models


class MemberManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)

    def counts(self):
        every = super().get_queryset()
        return {
            "active": every.filter(is_deleted=False).count(),
            "deleted": every.filter(is_deleted=True).count(),
        }


class BookQuerySet(models.QuerySet):
    def available(self):
        return self.filter(copies__gt=0)

    def by_author(self, author):
        return self.filter(author=author)


class Member(models.Model):
    full_name = models.CharField(max_length=100)
    is_deleted = models.BooleanField(default=False)
    objects = MemberManager()
    everyone = models.Manager()

    def __str__(self):
        return self.full_name


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    copies = models.PositiveIntegerField(default=0)
    objects = BookQuerySet.as_manager()

    def __str__(self):
        return self.title


class Loan(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="loans")
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="loans")
    returned = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.book} to {self.member}"
