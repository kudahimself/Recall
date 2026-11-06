# Settings from the environment

Topic: Django Settings & Environment (Backend, Production Infrastructure).
Time: about 30 minutes.

## Task

The bookshop's settings were committed with the secret key in them, `DEBUG` on and every host allowed.
Move what differs between machines into the environment, and give the live site its own settings file.

Start with `bookshop_config/env.py`, a small stand-in for django-environ's `Env` with the same calls, so the lesson's code reads the same here.
`Env(DEBUG=(bool, False))` declares a variable's cast and default once:

- `env(name, cast=None, default=NOTSET)` returns the variable cast with `cast`, else with the cast declared for it, else as text.
  When it is not set, it returns the default given, else the declared one; with neither, it raises `ImproperlyConfigured("Set the NAME environment variable")`.
  The casts are `bool`, `int` and `list`.
  A bool is `True` for `1`, `true`, `yes` and `on`, in any case, and `False` for anything else.
  A list splits the text on commas, strips each item and drops empty ones.
- `env.bool(name, default)` and `env.list(name, default)` are `env(name, cast=bool, ...)` and `env(name, cast=list, ...)`.
- `env.db(name="DATABASE_URL", default)` turns a database URL into a `DATABASES` entry: `postgres://` or `postgresql://` gives the PostgreSQL engine with `NAME`, `USER`, `PASSWORD`, `HOST` and `PORT` (a number), `sqlite:///db.sqlite3` gives the SQLite engine with `NAME` `db.sqlite3`, and any other scheme raises `ImproperlyConfigured`.
  `urllib.parse.urlsplit` takes a URL apart for you.
- `Env.read_env(path)` loads the `KEY=VALUE` lines of a `.env` file into `os.environ`, skipping blank lines and `#` comments and dropping quotes around a value.
  A variable the environment already has keeps its value, and a missing file loads nothing.

Then `bookshop_config/settings/base.py`: load `.env` from the folder the server runs in (`Env.read_env(".env")`), then read `SECRET_KEY` (no default, so the site refuses to start without one), `DEBUG` (off unless set), `ALLOWED_HOSTS` (none unless set) and the database (`DATABASE_URL`, else `sqlite:///db.sqlite3`).
The committed key must go.

Last, `bookshop_config/settings/production.py` keeps everything from base and changes only what differs: `DEBUG` off whatever the environment says, `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE` and `CSRF_COOKIE_SECURE` on, HSTS for a year (`SECURE_HSTS_SECONDS = 31536000`), and `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")`, so Django believes Nginx when it says the request came over HTTPS.
Set that header only behind a proxy that always sets it, as the `dj_nginx` exercise's config does.

## Examples

```python
# DEBUG=off  ALLOWED_HOSTS=books.example.org,www.books.example.org
env = Env(DEBUG=(bool, False))
env("DEBUG")                         # False
env.list("ALLOWED_HOSTS")            # ["books.example.org", "www.books.example.org"]
env("SECRET_KEY")                    # ImproperlyConfigured: Set the SECRET_KEY environment variable
Env().db("DATABASE_URL")             # with postgres://shop:s3cret@db.internal:5432/bookshop:
# {"ENGINE": "django.db.backends.postgresql", "NAME": "bookshop", "USER": "shop",
#  "PASSWORD": "s3cret", "HOST": "db.internal", "PORT": 5432}
```

Watch for the lesson's pitfall: every environment variable is a string, so `os.environ.get("DEBUG", False)` gives `"False"` on a server that sets it, and any non-empty string is true.
Cast it to a bool.

## Run the tests

```bash
cd exercises/backend/dj_settings
pytest
```

`conftest.py` sets Django up for you; leave it as it is.
Each settings test runs in an empty temporary folder with only the variables it names set, then imports the settings module afresh, so a `.env` of your own does not change the results.
The last test runs the security checks of `python manage.py check --deploy` against the production settings.
In your own project, `pip install django-environ` and `import environ` give you the real `Env`, which these calls match, and `DJANGO_SETTINGS_MODULE=bookshop_config.settings.production` picks the production file.
When they all pass, tick the exercise done in Recall under Progress, Topics.
