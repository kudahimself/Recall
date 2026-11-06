"""Settings for the live site: everything in base, then only what differs.

TODO: keep DEBUG off whatever the environment says, turn on the security settings
the lesson lists, and trust the scheme Nginx passes on (see README.md).
"""
from .base import *  # noqa: F401,F403
