# Signed and salted

Topic: Security Primitives (hashing, tokens, HMAC) (Backend, Python Advanced).
Time: about 20 minutes.

## Task

Fill in the library's security helpers in `security.py`, using only `hashlib`, `hmac` and `secrets`:

- `fingerprint(data)` returns the SHA-256 hex digest of some bytes.
- `hash_password(password, salt=None)` returns `(salt, digest)`: a fresh random 16-byte salt when none is given, and a slow salted `hashlib.pbkdf2_hmac("sha256", ...)` digest with `ITERATIONS` rounds.
- `check_password(password, salt, digest)` hashes the attempt with the stored salt and compares.
- `sign(key, message)` returns the HMAC-SHA256 tag of a message as hex, and `verify(key, message, tag)` checks one.
- `reset_token()` returns an unguessable URL-safe token for a password reset link.

Compare digests and tags with `hmac.compare_digest`, which takes the same time whatever the input, never with `==`.

## Examples

```python
fingerprint(b"abc")              # "ba7816bf8f01cfea..."
salt, digest = hash_password("open sesame")
check_password("open sesame", salt, digest)    # True
check_password("open sesame!", salt, digest)   # False
tag = sign(b"key", b"member=7")
verify(b"key", b"member=7", tag)               # True
verify(b"key", b"member=8", tag)               # False
reset_token()                    # "Qx3v...", 43 characters
```

Watch for the lesson's pitfall: `random` is predictable, so a token made with it can be guessed; use `secrets` for anything an attacker must not predict.

## Run the tests

```bash
cd exercises/backend/py_security
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
