"""Which channel layer the bookshop's sockets talk through."""


def channel_layers(production):
    """The CHANNEL_LAYERS setting: Redis in production, in memory for development and tests."""
    if production:
        return {"default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {"hosts": [("redis", 6379)]},
        }}
    return {"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}}
