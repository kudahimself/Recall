"""Signals & Middleware: the middleware list, as settings.MIDDLEWARE would hold it.

The tests apply it over the shared exercise settings.
TODO: add the three gatehouse middleware classes to Django's own four, so that:
- every response, the maintenance page included, carries its X-Request-ID;
- while the library is closed, no layer below the maintenance page runs at all;
- ReaderMiddleware runs where request.user already exists.
"""

MIDDLEWARE = [
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
]
