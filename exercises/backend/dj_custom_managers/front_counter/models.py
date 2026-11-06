"""Custom Managers: practise a manager that hides rows and a QuerySet with named queries.

The fields are written for you. Write the manager and the QuerySet, and attach
them to the models, so the tests in test_front_counter.py pass.
Run them from the exercise folder with: pytest
"""
from django.db import models


class MemberManager(models.Manager):
    """The members still on the books.

    TODO:
    - every query through this manager leaves out the members marked is_deleted;
    - counts() returns {"active": <members not deleted>, "deleted": <members deleted>}.
    """


class BookQuerySet(models.QuerySet):
    """Named queries on books that chain in any order.

    TODO:
    - available(): the books with at least one copy;
    - by_author(author): the books whose author is exactly that string.
    """


class Member(models.Model):
    full_name = models.CharField(max_length=100)
    is_deleted = models.BooleanField(default=False)
    # TODO: objects, a MemberManager, is the default manager;
    # everyone, a plain manager, still reaches every member.

    def __str__(self):
        return self.full_name


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    copies = models.PositiveIntegerField(default=0)
    # TODO: objects is a manager made from BookQuerySet.

    def __str__(self):
        return self.title


class Loan(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="loans")
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="loans")
    returned = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.book} to {self.member}"
