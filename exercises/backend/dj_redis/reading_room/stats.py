"""Redis (Caching, Queues, Sessions): read through the cache, count in Redis, rank readers.

Write the functions below so the tests in test_reading_room.py pass.
The first three talk to Redis through Django's cache, django.core.cache.cache.
The last two take a redis-py client, r, as redis.Redis.from_url(...) would give
(the tests hand them one with decode_responses=True, so values come back as str).
"""
from django.core.cache import cache

from reading_room.models import Book


def genre_key(genre):
    """The cache key for one genre's book count."""
    return f"genre-count:{genre}"


def genre_count(genre):
    """How many books the genre has, read through the cache: on a miss, count them in the
    database and keep the answer under genre_key(genre) for 10 minutes.
    A cached 0 is a hit too: it must not query again."""
    # TODO
    raise NotImplementedError


def add_book(title, genre):
    """Create the book and return it; the genre's cached count is now wrong, so forget it."""
    # TODO
    raise NotImplementedError


def count_view(book_id):
    """Count one more view of the book under f"views:{book_id}", with no timeout, and return
    the new total. Two requests at once must not lose a view: let Redis do the adding."""
    # TODO
    raise NotImplementedError


def finish_book(r, reader, title, pages):
    """Record that the reader finished the book, in a set per reader, f"finished:{reader}".

    The first time only, add its pages to the reader's score in the "leaderboard" sorted set.
    Return True when the book was new for the reader, False when it was counted already.
    """
    # TODO
    raise NotImplementedError


def top_readers(r, n=3):
    """The n readers with the most pages, most first, as (reader, pages) pairs of str and int."""
    # TODO
    raise NotImplementedError
