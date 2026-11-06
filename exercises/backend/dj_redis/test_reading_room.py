import copy
from importlib import import_module

import fakeredis
import pytest
from django.core.cache import cache, caches

from reading_room import redis_settings, stats
from reading_room.models import Book

pytestmark = pytest.mark.django_db


@pytest.fixture
def server():
    """An in-process stand-in for the Redis server, empty for each test: no real server is needed."""
    return fakeredis.FakeServer()


@pytest.fixture(autouse=True)
def apply_redis_settings(settings, server):
    """Apply reading_room/redis_settings.py, as if it were part of settings.py.

    Each cache's connections go to the stand-in server instead of a real one.
    """
    if "default" not in redis_settings.CACHES:
        pytest.fail("redis_settings.py has no default cache yet: start with the settings")
    caches_setting = copy.deepcopy(redis_settings.CACHES)
    for alias in caches_setting.values():
        alias.setdefault("OPTIONS", {}).update(connection_class=fakeredis.FakeRedisConnection, server=server)
    settings.CACHES = caches_setting
    settings.SESSION_ENGINE = redis_settings.SESSION_ENGINE
    settings.CELERY_BROKER_URL = redis_settings.CELERY_BROKER_URL
    cache.clear()


@pytest.fixture
def raw(server):
    """A redis-py client on the cache's database (1) of the stand-in server, to look inside."""
    return fakeredis.FakeRedis(server=server, db=1)


@pytest.fixture
def r():
    """The redis-py client the leaderboard functions are handed, with str values."""
    return fakeredis.FakeRedis(server=fakeredis.FakeServer(), decode_responses=True)


@pytest.fixture
def shelves():
    for title, genre in [("Dune", "scifi"), ("Ubik", "scifi"), ("Kindred", "scifi"), ("Odes", "poetry")]:
        Book.objects.create(title=title, genre=genre)


def test_one_redis_server_plays_three_parts(raw):
    assert redis_settings.CACHES["default"]["BACKEND"] == "django.core.cache.backends.redis.RedisCache"
    assert redis_settings.CACHES["default"]["LOCATION"] == "redis://localhost:6379/1"
    assert redis_settings.CELERY_BROKER_URL == "redis://localhost:6379/0"
    assert redis_settings.SESSION_ENGINE == "django.contrib.sessions.backends.cache"
    cache.set("probe", "here", timeout=60)
    assert raw.exists(":1:probe")


def test_sessions_are_kept_in_the_cache():
    engine = import_module(redis_settings.SESSION_ENGINE)
    session = engine.SessionStore()
    session["reader"] = "ann"
    session.save()
    assert cache.get(session.cache_key) == {"reader": "ann"}
    assert engine.SessionStore(session.session_key).load() == {"reader": "ann"}


def test_genre_count_reads_through_the_cache(shelves, raw, django_assert_num_queries):
    with django_assert_num_queries(1):
        assert stats.genre_count("scifi") == 3
    with django_assert_num_queries(0):
        assert stats.genre_count("scifi") == 3
    assert cache.get(stats.genre_key("scifi")) == 3
    assert 590 <= raw.ttl(":1:genre-count:scifi") <= 600


def test_a_cached_zero_is_a_hit(shelves, django_assert_num_queries):
    with django_assert_num_queries(1):
        assert stats.genre_count("drama") == 0
    with django_assert_num_queries(0):
        assert stats.genre_count("drama") == 0


def test_a_missing_key_is_counted_again(shelves):
    assert stats.genre_count("scifi") == 3
    Book.objects.create(title="Solaris", genre="scifi")
    assert stats.genre_count("scifi") == 3
    cache.delete(stats.genre_key("scifi"))
    assert stats.genre_count("scifi") == 4


def test_add_book_forgets_the_stale_count(shelves):
    assert stats.genre_count("poetry") == 1
    assert stats.genre_count("scifi") == 3
    book = stats.add_book("Ariel", "poetry")
    assert isinstance(book, Book) and book.pk is not None
    assert cache.get(stats.genre_key("poetry")) is None
    assert cache.get(stats.genre_key("scifi")) == 3
    assert stats.genre_count("poetry") == 2


def test_count_view_adds_up_inside_redis(raw, monkeypatch):
    backend = caches["default"]

    def read_modify_write(*args, **kwargs):
        raise AssertionError("get() then set() loses a view when two requests interleave: let Redis add")

    monkeypatch.setattr(backend, "get", read_modify_write)
    monkeypatch.setattr(backend, "set", read_modify_write)
    assert [stats.count_view(7) for _ in range(3)] == [1, 2, 3]
    assert stats.count_view(8) == 1
    assert int(raw.get(":1:views:7")) == 3
    assert raw.ttl(":1:views:7") == -1


def test_finish_book_counts_each_book_once(r):
    assert stats.finish_book(r, "ann", "Dune", 412) is True
    assert stats.finish_book(r, "ann", "Emma", 300) is True
    assert stats.finish_book(r, "ann", "Dune", 412) is False
    assert r.smembers("finished:ann") == {"Dune", "Emma"}
    assert r.zscore("leaderboard", "ann") == 712


def test_top_readers_ranks_by_pages(r):
    for reader, title, pages in [
        ("ann", "Dune", 412), ("ben", "Odes", 90), ("cy", "Ubik", 230),
        ("cy", "Kindred", 264), ("di", "Emma", 300), ("ben", "Odes", 90),
    ]:
        stats.finish_book(r, reader, title, pages)
    assert stats.top_readers(r) == [("cy", 494), ("ann", 412), ("di", 300)]
    assert stats.top_readers(r, n=1) == [("cy", 494)]
    assert stats.top_readers(r, n=10)[-1] == ("ben", 90)
