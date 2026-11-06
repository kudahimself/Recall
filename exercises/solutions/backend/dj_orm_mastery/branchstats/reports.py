"""ORM Mastery: reference solution."""
from django.db import transaction
from django.db.models import F, Prefetch, Window
from django.db.models.functions import Rank

from branchstats.models import Book


def shelf_labels():
    books = Book.objects.select_related("author", "branch").order_by("title")
    return [f"{b.title} - {b.author.name} @ {b.branch.name}" for b in books]


def tag_index():
    books = Book.objects.prefetch_related("tags")
    return {b.title: sorted(t.name for t in b.tags.all()) for b in books}


def author_titles(authors):
    ordered = Prefetch("books", queryset=Book.objects.order_by("title"))
    return {a.name: [b.title for b in a.books.all()] for a in authors.prefetch_related(ordered)}


def catalogue_page():
    return Book.objects.only("title").order_by("title")


def branch_ranking():
    ranked = Book.objects.select_related("branch").annotate(
        rank=Window(expression=Rank(), partition_by=[F("branch")], order_by=F("loans").desc())
    ).order_by("branch__name", "rank", "title")
    return [(b.branch.name, b.title, b.rank) for b in ranked]


def lend_copy(book_id):
    with transaction.atomic():
        book = Book.objects.select_for_update().get(pk=book_id)
        if book.copies_free == 0:
            return False
        book.copies_free -= 1
        book.save(update_fields=["copies_free"])
        return True
