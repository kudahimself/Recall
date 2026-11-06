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
      question: `Split a project's settings into three files in a \`settings/\` package, using django-environ.

- \`base.py\`: set \`BASE_DIR\` to the project root, three \`.parent\` steps up from the file; create \`env = environ.Env()\`; load the \`.env\` file in \`BASE_DIR\`; read \`SECRET_KEY\` from the environment with no default, and \`ALLOWED_HOSTS\` as a comma-separated list that defaults to empty.
- \`development.py\`: start from everything in \`base.py\`, turn \`DEBUG\` on, and use SQLite in the file \`BASE_DIR / "db.sqlite3"\`.
- \`production.py\`: start from everything in \`base.py\`, turn \`DEBUG\` off, read the database from the \`DATABASE_URL\` variable, turn on \`SECURE_SSL_REDIRECT\`, \`SESSION_COOKIE_SECURE\` and \`CSRF_COOKIE_SECURE\`, and set \`SECURE_HSTS_SECONDS\` to one year, 31536000.`,
      starterCode: `# settings/base.py
import environ


# settings/development.py


# settings/production.py
`,
      testCases: [
        {
          input: 'Split settings with django-environ',
          expectedOutput: 'base.py, development.py, production.py with env() calls',
          description: 'Should define split settings with environment variable support',
        },
      ],
      requires: [/from\s+[\w.]*base\s+import\s+\*/, /SECRET_KEY["']\s*\)/],
      solution: `# settings/base.py
import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])


# settings/development.py
from .base import *

DEBUG = True
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# settings/production.py
from .base import *

DEBUG = False
DATABASES = {"default": env.db("DATABASE_URL")}
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
# OR
# settings/base.py
import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])


# settings/development.py
from .base import *

DEBUG = True
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# settings/production.py
from .base import *

DEBUG = False
DATABASES = {"default": env.db_url("DATABASE_URL")}
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True`,
      explanation: 'Split settings keep what every environment shares in `base.py`; `development.py` and `production.py` start with `from .base import *` and change only what differs, and `DJANGO_SETTINGS_MODULE` (for example `myproject.settings.production`) picks the file. `read_env` loads the git-ignored `.env` file into the environment, `env("SECRET_KEY")` has no default, so a server without the key refuses to start, and `env.list` splits `a.com,b.com` into a list. `env.db("DATABASE_URL")` turns a URL such as `postgres://user:pass@host:5432/db` into a `DATABASES` entry, so production credentials never sit in the code. The four security settings send HTTP to HTTPS, tell browsers to use HTTPS for a year, and keep the session and CSRF cookies off plain HTTP; `python manage.py check --deploy` lists any that are missing.',
      hints: [
        'environ.Env.read_env(path) loads the .env file.',
        'env.list() splits a comma-separated value; env.db() parses a database URL.',
        'from .base import * brings every shared setting into the other two files.',
        'DEBUG = True in development and DEBUG = False in production.',
      ],
      tieredHints: {
        apiSignature: "environ.Env.read_env(path); env(name); env.list(name, default=[]); env.db(name)",
        skeleton: '# settings/base.py\nimport environ\nfrom pathlib import Path\n\nBASE_DIR = Path(__file__).resolve().parent.parent.parent\nenv = environ.Env()\nenviron.Env.____(BASE_DIR / ".env")\n\nSECRET_KEY = ____\nALLOWED_HOSTS = env.____("ALLOWED_HOSTS", default=[])\n\n\n# settings/development.py\n____\n\nDEBUG = True\nDATABASES = {\n    "default": {\n        "ENGINE": "django.db.backends.sqlite3",\n        "NAME": BASE_DIR / "db.sqlite3",\n    }\n}\n\n\n# settings/production.py\n____\n\nDEBUG = False\nDATABASES = {"default": env.____("DATABASE_URL")}\nSECURE_SSL_REDIRECT = ____\nSECURE_HSTS_SECONDS = 31536000\nSESSION_COOKIE_SECURE = ____\nCSRF_COOKIE_SECURE = ____',
      },
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
      explanation: 'Each setting closes a specific attack vector. SECURE_SSL_REDIRECT forces HTTPS (prevents sniffing). HSTS tells browsers to always use HTTPS for your domain (prevents SSL stripping). SESSION_COOKIE_SECURE and CSRF_COOKIE_SECURE prevent cookies from being sent over HTTP. ALLOWED_HOSTS prevents Host header attacks that can poison password reset emails. SecurityMiddleware, near the top of MIDDLEWARE, applies the HTTPS redirect and the HSTS header. Behind Nginx, Django only knows a request came over HTTPS once SECURE_PROXY_SSL_HEADER is set; without it, SECURE_SSL_REDIRECT redirects every request again and again. Running manage.py check --deploy lists all missing security settings.',
      tags: ['security', 'settings', 'production', 'ssl', 'hsts'],
      concepts: ['py-security-primitives'],
    },
  {
    id: 'dj-settings-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DJ_SETTINGS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Complete the setup of `django-environ` in settings.py to load `.env` file variables and read a database URL.',
    template: `import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
# Read the .env file
environ.Env.___(BASE_DIR / ".env")

# Parse database configuration from DATABASE_URL env var
DATABASES = {
    "default": env.___("DATABASE_URL")
}`,
    blanks: ['read_env', 'db'],
    blankAlternates: [[], ['db_url']],
    solution: `import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
# Read the .env file
environ.Env.read_env(BASE_DIR / ".env")

# Parse database configuration from DATABASE_URL env var
DATABASES = {
    "default": env.db("DATABASE_URL")
}`,
    explanation: '`environ.Env.read_env` loads environment variables from a `.env` file. `env.db("DATABASE_URL")` reads the variable and parses a URL such as `postgres://user:pass@host:5432/db` into the dictionary one `DATABASES` entry needs: the `postgres` scheme picks the PostgreSQL backend, and the user, password, host, port and name come from the URL. `env.db_url("DATABASE_URL")` is the same method under its longer name.',
    hints: [
      'A class method on environ.Env that reads a file named .env into the environment.',
      'A short env method named after what it builds: one database entry from a URL.',
    ],
    tags: ['django', 'settings', 'django-environ', 'cloze'],
    concepts: ['py-security-primitives'],
  },
  {
    id: 'dj-settings-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DJ_SETTINGS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'The server sets `DEBUG` in its environment, as the first line simulates, and sets no `PAGE_SIZE`. `environ` is django-environ. What do the two `print` calls output? The answer is two lines, each two values separated by a space.',
    code: `import os
import environ

os.environ["DEBUG"] = "False"
debug = os.environ.get("DEBUG", False)
print(debug == False, bool(debug))

env = environ.Env(DEBUG=(bool, True), PAGE_SIZE=(int, 20))
print(env("DEBUG"), env("PAGE_SIZE") + 5)`,
    expectedOutput: `False True
False 25`,
    explanation: 'Every environment variable is a string. `os.environ.get("DEBUG", False)` returns the string `"False"`, which is not equal to the boolean `False` and, being a non-empty string, is truthy: a settings file that does `DEBUG = os.environ.get("DEBUG", False)` runs production with DEBUG on. `environ.Env(DEBUG=(bool, True))` declares a type and a default for each variable, so `env("DEBUG")` casts the string to the boolean `False`, and `PAGE_SIZE`, which is not set, falls back to its default `20` as an int, so adding 5 gives 25.',
    hints: ['os.environ only holds strings, and a non-empty string is truthy.', 'environ.Env(NAME=(cast, default)) casts the value and supplies the default when the variable is missing.'],
    tags: ['django', 'settings', 'django-environ', 'environment-variables', 'predict'],
    concepts: ['py-security-primitives'],
  },
];
