"""Security primitives: practise hashing, password storage, signing and tokens.

Fill in each function so the tests in test_security.py pass.
Run them from this folder with: pytest
"""
import hashlib
import hmac
import secrets

# PBKDF2 rounds. Real systems use 600_000 or more; this is lower so the tests run fast.
ITERATIONS = 100_000


def fingerprint(data):
    """Return the SHA-256 hex digest of the bytes `data`."""
    # TODO
    raise NotImplementedError


def hash_password(password, salt=None):
    """Hash the text `password` for storage; return (salt, digest), both bytes.

    With no salt given, make a fresh random 16-byte one.
    Use hashlib.pbkdf2_hmac with "sha256", the password as UTF-8 bytes, the salt and ITERATIONS.
    """
    # TODO
    raise NotImplementedError


def check_password(password, salt, digest):
    """True when `password` hashed with `salt` gives `digest`; compare with hmac.compare_digest."""
    # TODO
    raise NotImplementedError


def sign(key, message):
    """Return the HMAC-SHA256 tag of the bytes `message` under the bytes `key`, as hex text."""
    # TODO
    raise NotImplementedError


def verify(key, message, tag):
    """True when `tag` is the right tag for `message` under `key`.

    Compare with hmac.compare_digest, never with ==.
    """
    # TODO
    raise NotImplementedError


def reset_token():
    """Return a new unguessable, URL-safe token for a password reset link (at least 32 random bytes)."""
    # TODO
    raise NotImplementedError
