"""Caching & Transactions: reference solution."""
from django.core.cache import cache
from django.db import IntegrityError, transaction
from django.db.models import Sum

from stockroom.models import Book, Branch, Loan


class NoCopies(Exception):
    """Raised when a loan is asked for a book with no copy left."""


def branch_key(branch_id):
    return f"stockroom:branch:{branch_id}"


def catalogue_size():
    return cache.get_or_set("stockroom:size", Book.objects.count, 300)


def branch_stock(branch_id):
    key = branch_key(branch_id)
    stock = cache.get(key)
    if stock is None:
        stock = Book.objects.filter(branch_id=branch_id).aggregate(total=Sum("copies"))["total"] or 0
        cache.set(key, stock, 60)
    return stock


@transaction.atomic
def import_books(rows):
    for title, copies, branch_name in rows:
        branch, _ = Branch.objects.get_or_create(name=branch_name)
        Book.objects.create(title=title, copies=copies, branch=branch)
    return len(rows)


def import_titles(titles, branch):
    added, skipped = [], []
    with transaction.atomic():
        for title in titles:
            try:
                with transaction.atomic():
                    Book.objects.create(title=title, branch=branch)
            except IntegrityError:
                skipped.append(title)
            else:
                added.append(title)
    return added, skipped


def record_loan(book_id, reader, notify):
    with transaction.atomic():
        book = Book.objects.select_for_update().get(pk=book_id)
        if book.copies == 0:
            raise NoCopies(book.title)
        book.copies -= 1
        book.save(update_fields=["copies"])
        Loan.objects.create(book=book, reader=reader)
        transaction.on_commit(lambda: cache.delete(branch_key(book.branch_id)))
        transaction.on_commit(lambda: notify(reader, book.title))
