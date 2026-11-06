"""Security primitives: reference solution."""
import hashlib
import hmac
import secrets

ITERATIONS = 100_000


def fingerprint(data):
    return hashlib.sha256(data).hexdigest()


def hash_password(password, salt=None):
    if salt is None:
        salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, ITERATIONS)
    return salt, digest


def check_password(password, salt, digest):
    _, candidate = hash_password(password, salt)
    return hmac.compare_digest(candidate, digest)


def sign(key, message):
    return hmac.new(key, message, hashlib.sha256).hexdigest()


def verify(key, message, tag):
    return hmac.compare_digest(sign(key, message), tag)


def reset_token():
    return secrets.token_urlsafe(32)
