"""Redis (Caching, Queues, Sessions): the settings that put one Redis server to work,
as they would sit in settings.py.

The tests apply each name below over the shared exercise settings.
Change them so the tests in test_reading_room.py pass.
The server is redis://localhost:6379; give each role its own database number.
"""

# TODO: Django's cache on Redis (Django's own RedisCache backend), database 1.
CACHES = {}

# TODO: Celery's broker on the same server, database 0.
CELERY_BROKER_URL = ""

# TODO: keep sessions in the cache.
SESSION_ENGINE = ""
