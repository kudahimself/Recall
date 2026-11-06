"""ORM: reference solution."""
from django.db.models import Q

from holdings.models import Author, Book


def short_titles(max_pages):
    books = Book.objects.filter(pages__lt=max_pages).order_by("-pages")
    return [b.title for b in books]


def count_by(author_name):
    return Book.objects.filter(author__full_name=author_name).count()


def old_or_short(year, pages):
    return Book.objects.filter(Q(year__lt=year) | Q(pages__lt=pages)).order_by("title", "year")


def search(text):
    return Book.objects.filter(title__icontains=text).order_by("title").first()


def oldest_titled(title):
    return Book.objects.filter(title=title).order_by("year").first()


def on_shelf(n):
    return Book.objects.exclude(on_loan=True).order_by("-year")[:n]


def has_loans_by(author_name):
    return Book.objects.filter(author__full_name=author_name, on_loan=True).exists()


def add_book(author_name, title, pages, year):
    author = Author.objects.filter(full_name=author_name).first()
    if author is None:
        author = Author.objects.create(full_name=author_name)
    return Book.objects.create(author=author, title=title, pages=pages, year=year)
