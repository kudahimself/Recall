"""Branches, members and loans: written for you, nothing to change here."""
from django.db import models


class Branch(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Member(models.Model):
    card_no = models.PositiveIntegerField(unique=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    is_librarian = models.BooleanField(default=False)
    loan_limit = models.PositiveSmallIntegerField(default=3)

    def __str__(self):
        return f"{self.card_no} {self.full_name}"


class Loan(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    book_title = models.CharField(max_length=200)
    returned = models.BooleanField(default=False)
    fine_pence = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.book_title
