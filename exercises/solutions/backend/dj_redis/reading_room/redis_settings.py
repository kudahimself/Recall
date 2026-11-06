"""Redis (Caching, Queues, Sessions): reference solution for the settings."""

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://localhost:6379/1",
    }
}

CELERY_BROKER_URL = "redis://localhost:6379/0"

SESSION_ENGINE = "django.contrib.sessions.backends.cache"
