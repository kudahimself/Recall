import hashlib
import hmac
import random
import re

import security
from security import ITERATIONS, check_password, fingerprint, hash_password, reset_token, sign, verify

KEY = b"library-secret-key"


def test_fingerprint_is_sha256():
    assert fingerprint(b"abc") == "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    assert fingerprint(b"Dune") != fingerprint(b"dune")


def test_hash_password_uses_a_fresh_random_salt_and_pbkdf2():
    salt1, digest1 = hash_password("open sesame")
    salt2, digest2 = hash_password("open sesame")
    assert isinstance(salt1, bytes) and len(salt1) == 16
    assert salt1 != salt2
    assert digest1 != digest2
    assert digest1 == hashlib.pbkdf2_hmac("sha256", b"open sesame", salt1, ITERATIONS)


def test_hash_password_with_a_given_salt_repeats():
    salt = bytes(range(16))
    assert hash_password("pw", salt) == hash_password("pw", salt)
    assert hash_password("pw", salt)[0] == salt


def test_check_password():
    salt, digest = hash_password("open sesame")
    assert check_password("open sesame", salt, digest) is True
    assert check_password("open sesame!", salt, digest) is False


def test_sign_is_an_hmac_under_the_key():
    tag = sign(KEY, b"member=7;books=3")
    assert tag == hmac.new(KEY, b"member=7;books=3", hashlib.sha256).hexdigest()
    assert sign(b"another key", b"member=7;books=3") != tag


def test_verify_compares_in_constant_time(monkeypatch):
    real = hmac.compare_digest
    seen = []

    def spy(a, b):
        seen.append((a, b))
        return real(a, b)

    monkeypatch.setattr(hmac, "compare_digest", spy)
    if hasattr(security, "compare_digest"):
        monkeypatch.setattr(security, "compare_digest", spy)
    tag = sign(KEY, b"member=7")
    assert verify(KEY, b"member=7", tag) is True
    assert verify(KEY, b"member=8", tag) is False
    assert len(seen) == 2


def test_reset_token_is_unpredictable():
    random.seed(2024)
    first = reset_token()
    random.seed(2024)
    second = reset_token()
    assert first != second
    assert len(first) >= 43
    assert re.fullmatch(r"[A-Za-z0-9_-]+", first)
