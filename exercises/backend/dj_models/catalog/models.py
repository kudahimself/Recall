"""Models & Migrations: practise fields, ForeignKey, ManyToManyField, __str__ and Meta.

Write the four models below so the tests in test_catalog_models.py pass.
There are no migrations in this exercise: the tests build the tables straight from your models.
Run them from the exercise folder with: pytest
"""
from django.db import models


class Branch(models.Model):
    """A library branch.

    TODO: a name of up to 50 characters, and __str__ returning the name.
    """


class Author(models.Model):
    """Someone who writes books.

    TODO: a full_name of up to 100 characters, and __str__ returning it.
    """


class Tag(models.Model):
    """A subject label such as "sci-fi".

    TODO: a name of up to 30 characters that no two tags share (unique=True).
    """


class Book(models.Model):
    """One book in the catalogue.

    TODO:
    - author: each book has one author, and deleting the author deletes their books.
      An author's books are author.books.
    - branch: each book sits at one branch, and a branch that still has books
      cannot be deleted. A branch's books are branch.books.
    - tags: any number of tags, and a tag lists its books as tag.books.
      A book may have no tags (blank=True).
    - title (up to 200 characters), summary (long text, may be left blank),
      on_loan (False until lent) and added_at (set once, when the row is inserted).
    - Books come back in title order, and a book prints as "Dune by Frank Herbert".
    """
