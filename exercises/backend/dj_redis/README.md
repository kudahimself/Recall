# Reading room

Topic: Redis (Caching, Queues, Sessions) (Backend, Celery & Background Tasks).
Time: about 25 minutes.

## Task

Put one Redis server to work for the reading room: as Django's cache, as Celery's broker and as the session store, and directly, for a readers' leaderboard.
The `Book` model (`reading_room/models.py`) is written for you; a book's title is unique.

Start with `reading_room/redis_settings.py`, the lines that would sit in `settings.py`, since every test reads them.
The server is `redis://localhost:6379`, with a database number per role:

- `CACHES`: the `default` cache on Django's own `RedisCache` backend, database 1;
- `CELERY_BROKER_URL`: the same server, database 0;
- `SESSION_ENGINE`: sessions kept in the cache.

Then the functions in `reading_room/stats.py`.
The first three use `django.core.cache.cache`:

- `genre_count(genre)` reads through the cache: on a miss it counts the genre's books in the database and keeps the answer under `genre_key(genre)` for 10 minutes.
  A cached 0 is a hit too, so test the miss with `is None`.
- `add_book(title, genre)` creates the book and returns it, then deletes the genre's cached count, which is now wrong.
- `count_view(book_id)` counts one more view under `f"views:{book_id}"`, with no timeout, and returns the new total.
  Let Redis do the adding with `incr()`, which raises on a missing key, so create the key with `add()` first; `get()` then `set()` would lose a view when two requests interleave.

The last two take a redis-py client `r` and use Redis's own types:

- `finish_book(r, reader, title, pages)` adds the title to the reader's set, `f"finished:{reader}"`, and only when it was new, adds the pages to the reader's score in the `"leaderboard"` sorted set; it returns whether the book was new.
- `top_readers(r, n=3)` returns the `n` readers with the most pages, most first, as `(reader, pages)` pairs with `pages` an `int`.

## Examples

```python
genre_count("scifi")          # 3: one query, then none for 10 minutes
genre_count("drama")          # 0, and a second call runs no query
add_book("Ariel", "poetry")   # the cached poetry count is gone; the next call counts 2
count_view(7), count_view(7)  # 1, 2
finish_book(r, "ann", "Dune", 412)   # True
finish_book(r, "ann", "Dune", 412)   # False: Dune is counted once
top_readers(r, n=2)           # [("cy", 494), ("ann", 412)]
```

Watch for the lesson's pitfall: Redis is not the source of truth.
A key expires at its timeout and a full server evicts keys, so `cache.get()` can return `None` for anything at any time: compute the value from the database on a miss and set it again, and delete the key when the data behind it changes.

## Run the tests

```bash
cd exercises/backend/dj_redis
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
There is no Redis server to start: the tests apply your settings with each cache connection pointed at fakeredis, an in-process stand-in for Redis that starts empty for every test, and hand the leaderboard functions a fakeredis client with `decode_responses=True`, so values come back as `str`.
In a real project the client would come from `redis.Redis.from_url("redis://localhost:6379/2", decode_responses=True)`.
Until `CACHES` has a `default` cache every test stops with a message saying so.
When they all pass, tick the exercise done in Recall under Progress, Topics.
