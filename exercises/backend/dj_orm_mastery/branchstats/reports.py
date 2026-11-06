"""ORM Mastery: practise select_related, prefetch_related, only, Window and select_for_update.

Write each function so the tests in test_branch_reports.py pass.
Most tests count the queries your code runs, so the number of queries is part of the answer.
Run them from the exercise folder with: pytest
"""
from django.db import transaction
from django.db.models import F, Prefetch, Window
from django.db.models.functions import Rank

from branchstats.models import Book


def shelf_labels():
    """A label for every book, in title order: "<title> - <author name> @ <branch name>".

    One query in all, however many books there are.
    """
    # TODO: bring the author and the branch into the same query.
    raise NotImplementedError


def tag_index():
    """{title: [tag names in alphabetical order]} for every book; a book with no tags maps to [].

    Two queries in all: one for the books and one for every book's tags.
    """
    # TODO
    raise NotImplementedError


def author_titles(authors):
    """{author name: [their titles in title order]} for the given authors QuerySet.

    An author with no books maps to []. Two queries in all.
    """
    # TODO: load the reverse relation already ordered, so no extra query sorts it.
    raise NotImplementedError


def catalogue_page():
    """A QuerySet of every book in title order that loads only the id and the title.

    The long summary column must stay out of the query.
    """
    # TODO
    raise NotImplementedError


def branch_ranking():
    """[(branch name, title, rank)] for every book, ranked within its branch by loans, most first.

    Books with the same loans in a branch share a rank, and the next rank skips (1, 1, 3).
    Order by branch name, then rank, then title, in one query.
    """
    # TODO: a Window annotation partitioned by branch.
    raise NotImplementedError


def lend_copy(book_id):
    """Lend one copy of the book: True when a copy was free, False when none was.

    Lock the book's row while you read and change copies_free, so two librarians
    lending the last copy at once cannot both succeed.
    """
    # TODO
    raise NotImplementedError
