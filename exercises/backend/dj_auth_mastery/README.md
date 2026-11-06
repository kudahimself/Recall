# Card sign-in

Topic: Auth Mastery (deep revisit) (Backend, Django Advanced & Deployment).
Time: about 30 minutes.

## Task

Readers sign in with their library card number and a PIN, which is their password, stored hashed like any other.
The `LibraryCard` and `Loan` models and the URLconf (`cards/urls.py`) are written for you.

In `cards/backends.py`, write `CardBackend`, an authentication backend:

- `authenticate(self, request, card=None, pin=None)` returns the card's reader when the card exists, the reader is active and the PIN is right, checked with `check_password()`.
  In every other case it returns `None`, never an exception, so the next backend can try.
- `get_user(self, user_id)` returns that user, or `None`; Django calls it on every request to reload the signed-in user from the session.

In `cards/auth_settings.py`, set what `settings.py` would hold (the tests apply it over the shared settings):

- `AUTHENTICATION_BACKENDS`: `CardBackend` first, then Django's `ModelBackend` for username and password.
- `PASSWORD_HASHERS`: PBKDF2 first, for new passwords, then MD5, so readers imported from the old system with MD5 hashes can still sign in, and are upgraded to PBKDF2 when they do.
- The session cookie's flags: HTTPS only, hidden from JavaScript, and `SameSite` `"Lax"`.

In `cards/views.py`:

- `issue_card(username, number, pin)` runs the PIN through `validate_password()` first, since `create_user()` validates nothing, then creates the reader and their card.
- `card_login` reads the POSTed `card` and `pin`: wrong ones answer `"Unknown card or wrong PIN."` with status 401; right ones `login()` the reader and answer `{"reader": ..., "backend": ...}`, naming the backend that signed them in.
- `can_renew(user, loan)`: an active user may renew their own loan, or any loan with the `cards.change_loan` permission; an inactive user nothing.
- `renew` (signed in, POST only) adds one to the loan's `renewals` and answers `{"title": ..., "renewals": ...}`, a 404 for a missing loan and a 403 when `can_renew()` says no.

## Examples

```python
authenticate(None, card="1042", pin="773105").backend           # "cards.backends.CardBackend"
authenticate(None, username="ann", password="773105").backend  # "django.contrib.auth.backends.ModelBackend"
authenticate(None, card="9999", pin="773105")                   # None
issue_card("cat", "2001", "77310")                              # ValidationError: too short
```

```text
POST /card-login/  card=1042 pin=000000   401  Unknown card or wrong PIN.
POST /card-login/  card=1042 pin=773105   200  {"reader": "ann", "backend": "cards.backends.CardBackend"}
                                               Set-Cookie: sessionid=...; HttpOnly; SameSite=Lax; Secure
POST /loans/3/renew/  (ann's own loan)    200  {"title": "Dune", "renewals": 1}
POST /loans/4/renew/  (ben's loan)        403
```

Watch for the lesson's pitfall: a backend that lets `DoesNotExist` escape crashes the sign-in, and one that compares the typed PIN with `==` against the stored hash never matches.
Look the card up with `.filter(...).first()` and return `None` on a miss, and check the PIN with `user.check_password(pin)`, which also upgrades an old hash.
And `has_perm("cards.change_loan", loan)` is always `False` with the default backend, which keeps no per-object permissions, so check the loan's owner yourself.

## Run the tests

```bash
cd exercises/backend/dj_auth_mastery
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
The tests apply `auth_settings.py` and a password validator that wants at least 6 characters.
PBKDF2 is slow on purpose, so the tests take a few seconds.
Every test fails until you write the backend, the settings and the views.
When they all pass, tick the exercise done in Recall under Progress, Topics.
