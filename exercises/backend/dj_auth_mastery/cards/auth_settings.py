"""Auth Mastery: the auth settings this app needs, as they would sit in settings.py.

The tests apply each name below over the shared exercise settings.
Each starts at Django's default: change them so the tests in test_card_auth.py pass.
"""

# TODO: try CardBackend first, then Django's username-and-password ModelBackend.
AUTHENTICATION_BACKENDS = ["django.contrib.auth.backends.ModelBackend"]

# TODO: hash new passwords with PBKDF2, and still accept the MD5 hashes that readers
# imported from the old library system have, so they can sign in and be upgraded.
PASSWORD_HASHERS = ["django.contrib.auth.hashers.PBKDF2PasswordHasher"]

# TODO: the session cookie travels over HTTPS only, is hidden from JavaScript and is
# not sent on cross-site requests, except top-level links ("Lax").
SESSION_COOKIE_SECURE = False
SESSION_COOKIE_HTTPONLY = False
SESSION_COOKIE_SAMESITE = None
