"""Redis (Caching, Queues, Sessions): reference solution."""
from django.core.cache import cache

from reading_room.models import Book


def genre_key(genre):
    return f"genre-count:{genre}"


def genre_count(genre):
    key = genre_key(genre)
    total = cache.get(key)
    if total is None:
        total = Book.objects.filter(genre=genre).count()
        cache.set(key, total, timeout=600)
    return total


def add_book(title, genre):
    book = Book.objects.create(title=title, genre=genre)
    cache.delete(genre_key(genre))
    return book


def count_view(book_id):
    key = f"views:{book_id}"
    cache.add(key, 0, timeout=None)
    return cache.incr(key)


def finish_book(r, reader, title, pages):
    if not r.sadd(f"finished:{reader}", title):
        return False
    r.zincrby("leaderboard", pages, reader)
    return True


def top_readers(r, n=3):
    return [(reader, int(pages)) for reader, pages in r.zrevrange("leaderboard", 0, n - 1, withscores=True)]
