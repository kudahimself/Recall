/**
 * Topic.DJ_SETTINGS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendInfraQuestions.ts (3)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_settings_questions: Question[] = [
  {
      id: 'be-infra-settings-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SETTINGS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Set up split Django settings: base.py with shared configuration, development.py with DEBUG=True and SQLite, production.py with DEBUG=False, PostgreSQL, and security settings. Use django-environ to read environment variables from a .env file.',
      starterCode: `# settings/base.py
import environ

env = environ.Env()

# Write base, development, and production settings
`,
      testCases: [
        {
          input: 'Split settings with django-environ',
          expectedOutput: 'base.py, development.py, production.py with env() calls',
          description: 'Should define split settings with environment variable support',
        },
      ],
      solution: `# settings/base.py
import environ
from pathlib import Path

env = environ.Env(
    DEBUG=(bool, False),
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "myapp",
]

ROOT_URLCONF = "myproject.urls"
STATIC_URL = "/static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# settings/development.py
from .base import *  # noqa

DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# settings/production.py
from .base import *  # noqa

DEBUG = False
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")

DATABASES = {
    "default": env.db("DATABASE_URL"),
}

# Security settings — all required in production
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True`,
      explanation: 'Split settings solve the "one settings file for all environments" problem. base.py contains everything shared (installed apps, middleware, templates). development.py adds DEBUG and SQLite for fast local work. production.py adds security hardening and reads the database URL from an environment variable. django-environ parses .env files and converts types automatically — env.db() parses a DATABASE_URL into Django\'s DATABASES dict, env.list() splits comma-separated strings into lists. The .env file is never committed to git.',
      hints: [
        'environ.Env.read_env() loads the .env file',
        'env.db("DATABASE_URL") parses postgres://user:pass@host/db',
        'DJANGO_SETTINGS_MODULE=myproject.settings.production selects the file',
        'from .base import * brings in all shared settings',
      ],
      tags: ['settings', 'django-environ', 'configuration', 'security'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'be-infra-settings-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SETTINGS,
      course: Course.BACKEND,
      question: 'What should NEVER be committed to git in your Django settings?',
      options: [
        { id: 'a', text: 'SECRET_KEY, database credentials, API keys, and email passwords — load them from environment variables instead', isCorrect: true },
        { id: 'b', text: 'INSTALLED_APPS and MIDDLEWARE, since they reveal which packages and security layers your project depends on', isCorrect: false },
        { id: 'c', text: 'The DEBUG flag and ALLOWED_HOSTS, because attackers can use them to discover which domains serve the app', isCorrect: false },
        { id: 'd', text: 'ROOT_URLCONF and template settings, because they expose the URL structure attackers need for enumeration', isCorrect: false },
      ],
      explanation: 'Secrets in git are permanently exposed — even if you remove them later, they exist in git history. SECRET_KEY is used for signing sessions, CSRF tokens, and password reset links — if leaked, an attacker can forge any of these. Database credentials give direct access to your data. API keys can incur charges or access private services. Always use environment variables: set them in your shell, .env file (gitignored), or your hosting platform\'s config dashboard.',
      tags: ['security', 'settings', 'secrets', 'environment-variables'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'be-infra-settings-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SETTINGS,
      course: Course.BACKEND,
      question: 'Which Django security settings must be enabled in production?',
      options: [
        { id: 'a', text: 'Only ALLOWED_HOSTS needs to be set — SecurityMiddleware enables every other protection automatically', isCorrect: false },
        { id: 'b', text: 'DEBUG=True together with ADMINS, so full tracebacks reach operators while users see friendly error pages', isCorrect: false },
        { id: 'c', text: 'Only the SSL settings — session and CSRF cookies are already marked Secure by default in production', isCorrect: false },
        { id: 'd', text: 'SECURE_SSL_REDIRECT, SECURE_HSTS_SECONDS, SESSION_COOKIE_SECURE, CSRF_COOKIE_SECURE, and ALLOWED_HOSTS', isCorrect: true },
      ],
      explanation: 'Each setting closes a specific attack vector. SECURE_SSL_REDIRECT forces HTTPS (prevents sniffing). HSTS tells browsers to always use HTTPS for your domain (prevents SSL stripping). SESSION_COOKIE_SECURE and CSRF_COOKIE_SECURE prevent cookies from being sent over HTTP. ALLOWED_HOSTS prevents Host header attacks that can poison password reset emails. SecurityMiddleware must be first in MIDDLEWARE to enforce these before any other processing. Running manage.py check --deploy lists all missing security settings.',
      tags: ['security', 'settings', 'production', 'ssl', 'hsts'],
      concepts: ['py-security-primitives'],
    },
];
