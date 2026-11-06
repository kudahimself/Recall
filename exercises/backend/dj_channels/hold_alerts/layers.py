"""Which channel layer the bookshop's sockets talk through."""


def channel_layers(production):
    """The CHANNEL_LAYERS setting: Redis in production, in memory for development and tests.

    Production: channels_redis's RedisChannelLayer on the host "redis", port 6379.
    Otherwise: Channels' InMemoryChannelLayer.
    """
    # TODO
    raise NotImplementedError
