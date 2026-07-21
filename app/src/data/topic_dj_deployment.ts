/**
 * Topic.DJ_DEPLOYMENT — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendAdvancedQuestions.ts (3), djangoAdvancedQuestions.ts (3), djangoBatchDExpansionQuestions.ts (6)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_deployment_questions: Question[] = [
  {
      id: 'be-docker-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_DEPLOYMENT,
      course: Course.BACKEND,
      question: 'What is Docker and why use it for development?',
      options: [
        { id: 'a', text: 'A programming language for writing deployment scripts that provision and configure servers', isCorrect: false },
        { id: 'b', text: 'A cloud hosting provider — you upload your code and it runs on Docker\'s own servers', isCorrect: false },
        { id: 'c', text: 'A full replacement for virtual machines that boots a separate OS kernel per application', isCorrect: false },
        { id: 'd', text: 'A tool that packages your app and its dependencies into containers that run identically on any machine', isCorrect: true },
      ],
      explanation: 'Docker containers bundle your code, runtime, libraries, and config into a portable image, eliminating "works on my machine" problems. A Dockerfile defines how to build it. docker-compose orchestrates multiple containers (app + database + Redis). Everyone on the team runs the exact same environment.',
      tags: ['docker', 'containers', 'deployment'],
      concepts: ['dj-deployment-cicd'],
    },
  {
      id: 'be-docker-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_DEPLOYMENT,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a Dockerfile for a Django app: use Python 3.11 slim image, set working directory to /app, copy requirements.txt and install dependencies, copy the project, expose port 8000, and run with gunicorn.\n\nA Dockerfile is a recipe for building a container image. Each line is an instruction:\n- FROM: base image to start from\n- WORKDIR: set the working directory inside the container\n- COPY: copy files from your machine into the container\n- RUN: execute a command during build (e.g. pip install)\n- EXPOSE: document which port the app listens on\n- CMD: the command to run when the container starts\n\nTip: copy requirements.txt BEFORE copying the full project — Docker caches layers, so dependencies only reinstall when requirements.txt changes.',
      starterCode: `# Dockerfile for Django\nFROM python:3.11-slim\n\nWORKDIR /app\n\n# Copy requirements first for Docker layer caching\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Copy the rest of the project\n`,
      testCases: [
        {
          input: 'Django Dockerfile',
          expectedOutput: 'FROM, WORKDIR, COPY, RUN pip install, EXPOSE, CMD gunicorn',
          description: 'Should create production Dockerfile',
        },
      ],
      solution: `FROM python:3.11-slim\n\nWORKDIR /app\n\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\nCOPY . .\n\nEXPOSE 8000\n\nCMD ["gunicorn", "mysite.wsgi:application", "--bind", "0.0.0.0:8000"]`,
      explanation: 'FROM sets the base image. WORKDIR sets the working directory. Copy requirements first (Docker caches this layer — dependencies only reinstall when requirements.txt changes). EXPOSE documents the port. CMD runs the production server (gunicorn, not manage.py runserver).',
      tieredHints: {
        apiSignature: 'CMD ["executable", "param1", "param2"]',
        skeleton: '____ ____\n\n____ ____\n\n____ ____ .\n____ ____ install ____ -r ____\n\n____ . .\n\n____ ____\n\nCMD [____, ____, ____, ____]',
      },
      hints: ['Copy requirements.txt BEFORE code for caching', 'Use slim image for smaller size', 'gunicorn for production, not runserver'],
      tags: ['docker', 'dockerfile', 'gunicorn', 'deployment'],
      concepts: ['dj-deployment-cicd'],
    },
  {
      id: 'dj-deploy-compose-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_DEPLOYMENT,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the two service-level keys: one builds the Django app from the local Dockerfile, one publishes host port 8000 to container port 8000.',
      template: `version: "3.8"

services:
  web:
    ___: .
    ___:
      - "8000:8000"`,
      blanks: ['build', 'ports'],
      solution: 'version: "3.8"\n\nservices:\n  web:\n    build: .\n    ports:\n      - "8000:8000"',
      explanation: '`build: .` tells Compose to build the image from the Dockerfile in the current directory (instead of pulling a pre-built `image:`). `ports:` is a YAML list — each entry maps `"host:container"`. Services can reference each other by their service name as a hostname (e.g. a `db` service is reachable at `db:5432`).',
      hints: ['Key that builds from a local Dockerfile', 'Key for a list of host:container port mappings'],
      tags: ['docker-compose', 'yaml', 'cloze'],
      concepts: ['dj-deployment-cicd'],
    },
  {
      id: 'be-docker-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_DEPLOYMENT,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a docker-compose.yml that runs a Django app and a PostgreSQL database together.\n\ndocker-compose.yml defines multiple services (containers) that work together. The structure is:\n\nversion: "3.8"\nservices:\n  service_name:\n    image: ...       # use a pre-built image (for databases)\n    build: .         # OR build from Dockerfile (for your app)\n    ports:\n      - "host:container"  # map host port to container port\n    environment:\n      KEY: value     # environment variables\n    depends_on:\n      - other_service  # start order\n    volumes:\n      - name:/path   # persistent storage\n\nYou need:\n- "db" service: postgres:15 image, POSTGRES_DB/USER/PASSWORD env vars, volume for data\n- "web" service: build from current dir, port 8000, depends on db, DATABASE_URL pointing to db\n- A named volume for postgres data persistence',
      starterCode: `# docker-compose.yml\nversion: "3.8"\n\nservices:\n  db:\n    image: postgres:15\n    environment:\n`,
      testCases: [
        {
          input: 'docker-compose',
          expectedOutput: 'services: web (build, ports) and db (image, environment)',
          description: 'Should define multi-container setup',
        },
      ],
      solution: `version: "3.8"\n\nservices:\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_DB: mydb\n      POSTGRES_USER: myuser\n      POSTGRES_PASSWORD: mypassword\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n\n  web:\n    build: .\n    ports:\n      - "8000:8000"\n    depends_on:\n      - db\n    environment:\n      DATABASE_URL: postgres://myuser:mypassword@db:5432/mydb\n\nvolumes:\n  postgres_data:`,
      explanation: 'docker-compose defines multiple services. db uses the official postgres image. web builds from the Dockerfile. depends_on ensures db starts first. volumes persist database data. Services communicate by service name (db as hostname).',
      tieredHints: {
        apiSignature: 'depends_on: [service_name]',
        skeleton: 'version: "3.8"\n\nservices:\n  db:\n    ____: postgres:15\n    ____:\n      POSTGRES_DB: mydb\n      POSTGRES_USER: myuser\n      POSTGRES_PASSWORD: mypassword\n    ____:\n      - postgres_data:/var/lib/postgresql/data\n\n  web:\n    ____: .\n    ____:\n      - "8000:8000"\n    ____:\n      - db\n    ____:\n      DATABASE_URL: postgres://myuser:mypassword@db:5432/mydb\n\nvolumes:\n  postgres_data:',
      },
      hints: ['depends_on controls startup order', 'Services reference each other by name', 'volumes persist data across restarts'],
      tags: ['docker-compose', 'postgres', 'multi-container', 'deployment'],
      concepts: ['dj-deployment-cicd', 'inf-postgres'],
    },
  {
      id: 'dj-deploy-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_DEPLOYMENT,
      course: Course.BACKEND,
      question: 'Which set of items represents Django\'s production deployment checklist?',
      options: [
        { id: 'a', text: 'DEBUG=True for error monitoring, SECRET_KEY hardcoded for consistency, runserver for production, static files served by Django views, ALLOWED_HOSTS=["*"].', isCorrect: false },
        { id: 'b', text: 'DEBUG=False, SECRET_KEY in settings.py, static files in the database, no ALLOWED_HOSTS needed when behind a proxy, SECURE_SSL_REDIRECT only for API servers.', isCorrect: false },
        { id: 'c', text: 'DEBUG=False, ALLOWED_HOSTS set, SECRET_KEY loaded from environment variable, SECURE_SSL_REDIRECT=True, static files served via whitenoise or collectstatic + web server, database connection pooling.', isCorrect: true },
        { id: 'd', text: 'DEBUG=False only affects logging output. The main concern is setting STATIC_ROOT. SECRET_KEY and ALLOWED_HOSTS are optional security enhancements.', isCorrect: false },
      ],
      explanation: 'Each item in the production checklist prevents a specific vulnerability or failure: DEBUG=False prevents stack traces and settings from being shown to attackers on error pages. ALLOWED_HOSTS prevents HTTP Host header attacks by whitelisting valid domain names. SECRET_KEY from an environment variable (not source code) prevents session hijacking if your repo is compromised — it\'s used for signing cookies, CSRF tokens, and password reset links. SECURE_SSL_REDIRECT=True forces HTTPS, preventing credentials from being transmitted in plain text. Static files must be collected (collectstatic) and served by a dedicated tool like whitenoise (adds to WSGI pipeline) or nginx/CDN because Django\'s development server is single-threaded and not designed for production file serving. Django even includes a `manage.py check --deploy` command that audits these settings.',
      hints: [
        'Think about what information DEBUG=True exposes to attackers',
        'SECRET_KEY in source code means anyone with repo access has it',
      ],
      tags: ['django', 'deployment', 'security', 'production', 'checklist'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'dj-deploy-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_DEPLOYMENT,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a production-ready gunicorn configuration. Create: (1) the gunicorn command to run a Django project called "myproject" with 4 workers, bound to 127.0.0.1:8000, with a 120-second timeout, and (2) a gunicorn.conf.py config file that sets workers based on CPU count, enables access logging, and sets the max requests per worker for memory leak prevention.',
      starterCode: ``,
      testCases: [
        {
          input: 'gunicorn config',
          expectedOutput: 'gunicorn command with workers, bind, timeout and gunicorn.conf.py with calculated workers, logging, max_requests',
          description: 'Should configure gunicorn for production Django deployment',
        },
      ],
      solution: `# 1. gunicorn command
# gunicorn myproject.wsgi:application --workers 4 --bind 127.0.0.1:8000 --timeout 120

# 2. gunicorn.conf.py
import multiprocessing

# Server socket
bind = '127.0.0.1:8000'

# Worker processes: 2-4x CPU cores is recommended
workers = multiprocessing.cpu_count() * 2 + 1

# Worker timeout (seconds) — increase for slow requests
timeout = 120

# Restart workers after this many requests to prevent memory leaks
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'`,
      explanation: 'Gunicorn (Green Unicorn) is a production WSGI HTTP server that replaces Django\'s runserver. The formula "2 * CPU cores + 1" for workers comes from the assumption that each worker will spend some time waiting on I/O (database, API calls), so having more workers than CPUs keeps the server busy. Binding to 127.0.0.1 (not 0.0.0.0) is important because nginx should be the public-facing server, proxying requests to gunicorn — exposing gunicorn directly bypasses nginx\'s static file serving, SSL termination, and DDoS protection. max_requests restarts each worker after N requests, which is a pragmatic defense against memory leaks: the OS reclaims all memory when the process exits. max_requests_jitter adds randomness so all workers don\'t restart simultaneously. The accesslog="-" sends logs to stdout, which is the standard practice for containerized deployments (Docker, Kubernetes) where a log aggregator captures stdout.',
      tieredHints: {
        apiSignature: 'multiprocessing.cpu_count() -> int',
        skeleton: '# 1. gunicorn command\n# gunicorn myproject.wsgi:application --workers 4 --bind 127.0.0.1:8000 --timeout 120\n\n# 2. gunicorn.conf.py\nimport multiprocessing\n\n# Server socket\nbind = \'127.0.0.1:8000\'\n\n# Worker processes: 2-4x CPU cores is recommended\nworkers = multiprocessing.____() * 2 + 1\n\n# Worker timeout (seconds) — increase for slow requests\ntimeout = 120\n\n# Restart workers after this many requests to prevent memory leaks\n____ = 1000\nmax_requests_jitter = 50\n\n# Logging\n____ = \'-\'\nerrorlog = \'-\'\nloglevel = \'info\'',
      },
      hints: [
        'The WSGI entry point is myproject.wsgi:application',
        'Workers = 2 * CPU cores + 1 is the recommended formula',
        'max_requests prevents memory leaks by recycling workers',
      ],
      tags: ['django', 'gunicorn', 'deployment', 'wsgi', 'production'],
      concepts: ['inf-wsgi-vs-asgi'],
    },
  {
      id: 'dj-deploy-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_DEPLOYMENT,
      course: Course.BACKEND,
      question: 'What is the difference between WSGI and ASGI, and when do you need ASGI for a Django project?',
      options: [
        { id: 'a', text: 'WSGI and ASGI are identical protocols with different names. ASGI is just the newer version. All Django projects should migrate to ASGI immediately.', isCorrect: false },
        { id: 'b', text: 'ASGI is only for Django Channels (chat apps). Regular Django views must always use WSGI, even if they use async def.', isCorrect: false },
        { id: 'c', text: 'WSGI handles WebSockets natively. ASGI is needed only for gRPC and GraphQL subscriptions. Standard REST APIs always use ASGI for better performance.', isCorrect: false },
        { id: 'd', text: 'WSGI is synchronous (one request per thread/worker). ASGI supports async — you need it for WebSockets, long-polling, server-sent events, or when using Django\'s async views/ORM for high-concurrency I/O-bound workloads.', isCorrect: true },
      ],
      explanation: 'WSGI (Web Server Gateway Interface) has been Python\'s standard since 2003. It\'s synchronous: each worker handles one request at a time, blocking until the response is ready. This is fine for traditional request/response web apps. ASGI (Asynchronous Server Gateway Interface) extends WSGI to support async Python (async/await). You need ASGI when your app requires: WebSockets (real-time chat, live dashboards), long-polling or server-sent events (push notifications), Django\'s async views that await external APIs or async ORM queries, or high concurrency with I/O-bound workloads where a single process can handle many simultaneous connections. ASGI servers include Daphne (Django Channels\' reference server) and Uvicorn (fast, based on uvloop). For a standard CRUD app with no real-time features, WSGI with gunicorn is simpler, more battle-tested, and perfectly adequate.',
      hints: [
        'Think about what happens when a request needs to keep a connection open (WebSocket)',
        'Synchronous = one request blocks a worker. Asynchronous = one worker handles many concurrent connections',
      ],
      tags: ['django', 'wsgi', 'asgi', 'deployment', 'async', 'websockets'],
      concepts: ['inf-wsgi-vs-asgi', 'py-async-coroutines'],
    },
  {
      id: 'py-dj-deploy-debug',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_DEPLOYMENT,
      course: Course.BACKEND,
      question: 'What happens if you deploy to production with `DEBUG = True`?',
      options: [
        { id: 'a', text: 'Nothing user-visible — DEBUG only raises log verbosity, so the cost is noisier log files', isCorrect: false },
        { id: 'b', text: 'Error pages expose stack traces, settings, and environment values — any crash leaks your app\'s internals and secrets', isCorrect: true },
        { id: 'c', text: 'The site runs faster, because debug mode disables the security middleware and its header checks', isCorrect: false },
        { id: 'd', text: 'Nothing in practice — Django detects production environments and forces DEBUG off automatically', isCorrect: false },
      ],
      explanation: 'DEBUG=True is a dev convenience that\'s a production nightmare. The yellow error page shows your SECRET_KEY, DB creds, and local variables. An attacker triggering any uncaught exception (often trivial) gets a full environment dump. It also relaxes `ALLOWED_HOSTS` checks and disables some caching — NEVER ship with DEBUG=True. Prod: `DEBUG = False`, set `ALLOWED_HOSTS`, wire up proper logging, show friendly 500 page. Check: `python manage.py check --deploy` flags common misconfigs.',
      hints: [
        'DEBUG=True leaks stack traces + env + settings',
        'Always DEBUG=False in prod; set ALLOWED_HOSTS',
        'python manage.py check --deploy catches common misconfigs',
      ],
      tags: ['django', 'deployment', 'DEBUG', 'security'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-dj-deploy-allowed-hosts',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_DEPLOYMENT,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Configure production security settings in `settings.py`. Disable `DEBUG`. Set `ALLOWED_HOSTS` to the list `["example.com", "www.example.com"]`. Turn on `SECURE_SSL_REDIRECT` (force HTTPS). Turn on `SESSION_COOKIE_SECURE` and `CSRF_COOKIE_SECURE` so cookies only ride over HTTPS. Set `SECURE_HSTS_SECONDS` to one year (`31536000`) and enable `SECURE_HSTS_INCLUDE_SUBDOMAINS`. Set `X_FRAME_OPTIONS` to the string `"DENY"` to block clickjacking.',
      starterCode: `# In settings.py, wire the production security settings described
# above with the exact values given in the prompt.
`,
      testCases: [
        {
          input: 'production security bundle',
          expectedOutput: '7 security settings wired in',
          description: 'Baseline secure defaults',
        },
      ],
      solution: `# settings.py
DEBUG = False
ALLOWED_HOSTS = ["example.com", "www.example.com"]
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
X_FRAME_OPTIONS = "DENY"`,
      explanation: '`ALLOWED_HOSTS` blocks Host-header injection attacks. `SECURE_SSL_REDIRECT` 301s HTTP → HTTPS (also set `SECURE_PROXY_SSL_HEADER` behind a TLS-terminating proxy). HSTS tells browsers "only HTTPS for this domain for N seconds" — test with small values before committing to a year. `_COOKIE_SECURE` means cookies only sent over HTTPS. `X_FRAME_OPTIONS = "DENY"` blocks clickjacking. `python manage.py check --deploy` catches missing items.',
      tieredHints: {
        apiSignature: 'SECURE_HSTS_SECONDS: int',
        skeleton: '# settings.py\nDEBUG = False\n____ = ["example.com", "www.example.com"]\nSECURE_SSL_REDIRECT = True\nSESSION_COOKIE_SECURE = True\nCSRF_COOKIE_SECURE = True\nSECURE_HSTS_SECONDS = 31536000\n____ = True\n____ = "DENY"',
      },
      hints: [
        'ALLOWED_HOSTS is non-negotiable in prod',
        'HSTS: start small (seconds) and ramp up',
        'python manage.py check --deploy flags gaps',
      ],
      tags: ['django', 'deployment', 'security', 'settings'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-dj-deploy-collectstatic',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_DEPLOYMENT,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Configure static files for production in `settings.py`: set the URL prefix static assets are served under (`/static/`) and the absolute directory `collectstatic` assembles them into — a `staticfiles/` folder under `BASE_DIR`. Then, as a trailing comment, give the deploy-time command that gathers the files.',
      starterCode: `# settings.py
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
`,
      testCases: [
        {
          input: 'static files config',
          expectedOutput: 'STATIC_URL + STATIC_ROOT set, collectstatic run',
          description: 'collectstatic copies static files to STATIC_ROOT',
        },
      ],
      solution: `from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# At deploy time:
# python manage.py collectstatic --noinput`,
      explanation: '`collectstatic` walks every app\'s `static/` dir plus anything in `STATICFILES_DIRS` and copies them all to `STATIC_ROOT`. That directory is what nginx / CDN / whitenoise serves. `MEDIA_URL` / `MEDIA_ROOT` are the analogous settings for user uploads (NEVER serve these through Django in prod either — S3 + signed URLs). Always include a content hash in static file names for cache-busting: `STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"`.',
      tieredHints: {
        apiSignature: 'STATIC_ROOT = BASE_DIR / "staticfiles"',
        skeleton: 'from pathlib import Path\n\n____ = Path(__file__).resolve().parent.parent\n\n____ = "/static/"\n____ = ____ / "staticfiles"\n\n# At deploy time run management command:\n# ____ ____ ____ --noinput',
      },
      hints: [
        'STATIC_ROOT = where collectstatic writes',
        'STATIC_URL = where it is served from',
        'Never serve static / media through Django in prod',
      ],
      tags: ['django', 'deployment', 'static-files', 'collectstatic'],
      concepts: ['dj-deployment-cicd'],
    },
  {
      id: 'py-dj-deploy-gunicorn',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_DEPLOYMENT,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the production gunicorn command that serves the Django WSGI app in `mysite/wsgi.py` with 4 workers and a 60s timeout. (Workers ≈ (2 × CPU) + 1; `-` log targets mean stdout/stderr.)',
      template: `gunicorn mysite.___:application \\
  --bind 0.0.0.0:8000 \\
  --___ 4 \\
  --timeout 60 \\
  --access-logfile - \\
  --error-logfile -`,
      blanks: ['wsgi', 'workers'],
      solution: 'gunicorn mysite.wsgi:application \\\n  --bind 0.0.0.0:8000 \\\n  --workers 4 \\\n  --timeout 60 \\\n  --access-logfile - \\\n  --error-logfile -',
      explanation: 'gunicorn is a prefork-worker WSGI server — stable, battle-tested, replaces `runserver` (which is dev-only). Behind an nginx reverse proxy for TLS termination + static files. For async views, use `gunicorn --worker-class uvicorn.workers.UvicornWorker mysite.asgi:application` (ASGI). Tune `--workers` based on memory (each worker loads the full Django app — ~100-200MB). For k8s, often `--workers 2` + horizontal pod scaling works better than `--workers 8` in one pod.',
      hints: [
        '--workers ~ (2 * CPU) + 1',
        '--timeout kills hung requests',
        'ASGI/async → --worker-class uvicorn.workers.UvicornWorker',
      ],
      tags: ['django', 'deployment', 'gunicorn', 'wsgi'],
      concepts: ['inf-wsgi-vs-asgi'],
    },
  {
      id: 'py-dj-deploy-whitenoise',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_DEPLOYMENT,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use `whitenoise` to serve static files without a separate web server. In `settings.py`: add `"whitenoise.middleware.WhiteNoiseMiddleware"` to `MIDDLEWARE` IMMEDIATELY after `SecurityMiddleware`, and set `STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"` for gzip+manifest hashing. Now gunicorn alone serves static files with compression and far-future cache headers.',
      starterCode: `# settings.py
# MIDDLEWARE = [
#   "django.middleware.security.SecurityMiddleware",
#   "whitenoise.middleware.WhiteNoiseMiddleware",  # immediately after SecurityMiddleware
#   ...
# ]
# STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
`,
      testCases: [
        {
          input: 'whitenoise middleware wiring',
          expectedOutput: 'Static files served by gunicorn with gzip + hashed filenames',
          description: 'Simplifies deployment — no separate nginx needed for static files',
        },
      ],
      solution: `# settings.py
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    # ... rest
]

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"`,
      explanation: 'whitenoise removes the need for a separate nginx just for static files — common for small deployments, Heroku, k8s where simplicity beats optimal split. `CompressedManifestStaticFilesStorage` gives you gzip + Brotli + per-file hash in the filename (`app.a7f82b.css`) so browsers cache forever and you bust by changing the hash. Middleware MUST be immediately after `SecurityMiddleware` so static requests skip sessions/auth for speed.',
      tieredHints: {
        apiSignature: 'STATICFILES_STORAGE: str',
        skeleton: '# settings.py\nMIDDLEWARE = [\n    "django.middleware.security.SecurityMiddleware",\n    "____.middleware.WhiteNoiseMiddleware",\n    "django.contrib.sessions.middleware.SessionMiddleware",\n    # ... rest\n]\n\n____ = "whitenoise.storage.____"',
      },
      hints: [
        'WhiteNoiseMiddleware right after SecurityMiddleware',
        'CompressedManifestStaticFilesStorage for hash + gzip',
        'Good for small / Heroku / k8s deploys; nginx better for scale',
      ],
      tags: ['django', 'deployment', 'whitenoise', 'static-files'],
      concepts: ['dj-deployment-cicd'],
    },
  {
      id: 'py-dj-deploy-12factor',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_DEPLOYMENT,
      course: Course.BACKEND,
      question: 'What does "12-factor config" mean in a Django context?',
      options: [
        { id: 'a', text: 'Splitting settings.py into exactly twelve environment-specific files, one per deployment target', isCorrect: false },
        { id: 'b', text: 'Config that varies per environment (DB URL, secrets, debug flag) goes in environment variables, never hardcoded or committed to git', isCorrect: true },
        { id: 'c', text: 'Sizing your deployment at exactly twelve gunicorn workers — the documented optimum for Django', isCorrect: false },
        { id: 'd', text: 'A migration-numbering scheme that keeps database schema versions consistent across environments', isCorrect: false },
      ],
      explanation: 'From "The Twelve-Factor App" — factor 3 ("Config"). Config lives in env vars, not in code. Benefits: same build across environments, secrets never in git, trivial to change without redeploy. `django-environ` / `python-decouple` / pydantic-settings provide typed parsing (`env.int("PORT", default=8000)`, `env.db()` parses `DATABASE_URL` into the nested settings dict). CI injects test vars; prod platform (k8s Secret, Heroku config vars, AWS Parameter Store) injects real values.',
      hints: [
        'Config from env vars, not in code',
        'Same artifact across dev/staging/prod — only env differs',
        'django-environ / python-decouple parses typed env vars',
      ],
      tags: ['django', 'deployment', '12-factor', 'config'],
      concepts: ['dj-deployment-cicd'],
    },
];
