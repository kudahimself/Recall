"""Signals & Middleware: reference solution."""

MIDDLEWARE = [
    "gatehouse.middleware.RequestIdMiddleware",
    "gatehouse.middleware.MaintenanceMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "gatehouse.middleware.ReaderMiddleware",
]
