/**
 * Topic.DJ_SETUP — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendQuestions.ts (2), djangoBatchCExpansionQuestions.ts (6), djangoGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_setup_questions: Question[] = [
  {
      id: 'dj-setup-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      question: 'What is the correct command to create a new Django project called "mysite"?',
      options: [
        { id: 'a', text: 'django create mysite', isCorrect: false },
        { id: 'b', text: 'python manage.py startproject mysite', isCorrect: false },
        { id: 'c', text: 'django-admin startproject mysite', isCorrect: true },
        { id: 'd', text: 'pip install mysite', isCorrect: false },
      ],
      explanation: 'django-admin startproject creates the project structure: manage.py, settings.py, urls.py, wsgi.py, asgi.py. After creation, use python manage.py to run commands. python manage.py startapp creates apps within the project.',
      tags: ['django', 'setup', 'startproject'],
      concepts: ['dj-setup'],
    },
  {
      id: 'py-dj-setup-what-is-app',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      question: 'In Django, what is a "project" vs an "app"?',
      options: [
        { id: 'a', text: 'They\'re interchangeable names for the same directory Django generates', isCorrect: false },
        { id: 'b', text: 'A project is pure configuration; apps hold everything else, including settings.py', isCorrect: false },
        { id: 'c', text: 'An app is only the built-in admin panel; everything else belongs to the project', isCorrect: false },
        { id: 'd', text: 'A project is the whole site (settings, root URLs); an app is a reusable feature module inside it', isCorrect: true },
      ],
      explanation: 'A PROJECT is the overall site (settings, URL root, WSGI/ASGI entrypoints); an APP is a focused, reusable module within it — e.g. `blog`, `accounts`, `payments`. One project has many apps; one app can be reused across projects. Apps own models, views, URLs, templates, migrations. Django\'s structure emphasises the "pluggable app" idea: drop `django.contrib.auth` into INSTALLED_APPS and you get users/permissions/groups. Your own features should be similarly scoped — one app per bounded domain (not per class or per model). Rule of thumb: if you had to extract this feature into a library, would it make sense on its own? If yes, it\'s its own app.',
      hints: [
        'Project = site config; App = reusable feature module',
        'One project → many apps',
        'Apps own models, views, URLs, templates, migrations',
      ],
      tags: ['django', 'setup', 'project', 'app'],
      concepts: ['dj-setup'],
    },
  {
      id: 'py-dj-setup-installed-apps',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'After `startapp blog`, register the app in settings. Show the `INSTALLED_APPS` list in `settings.py` with the default six Django apps (`admin`, `auth`, `contenttypes`, `sessions`, `messages`, `staticfiles`) PLUS `"blog.apps.BlogConfig"`. The AppConfig path is preferred over the bare `"blog"` string because it activates the app\'s `ready()` hook.',
      starterCode: `# Write the INSTALLED_APPS list: the six django.contrib defaults
# named in the prompt, plus the blog app's AppConfig dotted path.
`,
      testCases: [
        {
          input: 'INSTALLED_APPS with blog registered',
          expectedOutput: 'List of 7 app entries including blog.apps.BlogConfig',
          description: 'AppConfig path, not bare app name',
        },
      ],
      solution: `INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "blog.apps.BlogConfig",
]`,
      explanation: 'Until an app is in `INSTALLED_APPS`, Django doesn\'t see its models (no migrations), admin registrations, or signals. Use the full AppConfig path (`blog.apps.BlogConfig`) rather than `"blog"` because it guarantees the `ready()` method runs — that\'s where you register signals, override field types, etc. The bare string form still works but some third-party apps rely on `ready()`.',
      hints: [
        'AppConfig path activates ready() hook — prefer over bare name',
        'Models not migrated until app is in INSTALLED_APPS',
        'Signals registered in AppConfig.ready()',
      ],
      tags: ['django', 'setup', 'INSTALLED_APPS', 'AppConfig'],
      concepts: ['dj-setup'],
    },
  {
      id: 'py-dj-setup-settings-structure',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      question: 'What\'s the standard pattern for managing settings across environments (dev / staging / production)?',
      options: [
        { id: 'a', text: 'A single settings.py full of `if DEBUG:` branches that switch behaviour per environment', isCorrect: false },
        { id: 'b', text: 'A `settings/` package — `base.py` plus per-environment modules picked via `DJANGO_SETTINGS_MODULE`', isCorrect: true },
        { id: 'c', text: 'Hardcoding each environment\'s database credentials directly in settings.py', isCorrect: false },
        { id: 'd', text: 'A single YAML file that Django loads at runtime in place of settings.py', isCorrect: false },
      ],
      explanation: 'The split-settings pattern: `base.py` has everything shared (INSTALLED_APPS, MIDDLEWARE, templates). `development.py` has `DEBUG=True`, SQLite, toolbar. `production.py` has `DEBUG=False`, Postgres, secure cookies, allowed hosts from env. Deploy tools set `DJANGO_SETTINGS_MODULE` (e.g. `myapp.settings.production`). Secrets come from env vars (via `os.environ` or `python-decouple`) — never commit them. For larger projects, `django-environ` or `django-configurations` offers typed settings + dotenv integration.',
      hints: [
        'settings/base.py + settings/dev.py + settings/prod.py',
        'Pick via DJANGO_SETTINGS_MODULE env var',
        'Secrets from env vars — never commit',
      ],
      tags: ['django', 'setup', 'settings', '12-factor'],
      concepts: ['dj-setup', 'dj-deployment-cicd'],
    },
  {
      id: 'py-dj-setup-manage-commands',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      question: 'Which `manage.py` commands should every Django developer know cold?',
      options: [
        { id: 'a', text: '`runserver`, `migrate` / `makemigrations`, `shell`, `createsuperuser`, `test`, and `collectstatic`', isCorrect: true },
        { id: 'b', text: 'Only `runserver` — Django handles migrations and admin users automatically', isCorrect: false },
        { id: 'c', text: '`startproject`, `git push`, and `pip install` — manage.py wraps the whole toolchain', isCorrect: false },
        { id: 'd', text: 'None — they\'re all deprecated in favour of running `django-admin` directly', isCorrect: false },
      ],
      explanation: 'The core set: `runserver` (dev server), `migrate` / `makemigrations` (schema), `shell` (REPL with Django loaded), `createsuperuser` (admin user), `test` (run tests), `collectstatic` (deploy static assets), plus `startapp` (new app) and `showmigrations` (status). List them with `python manage.py help` (or `help <cmd>` for details). Bonus commands: `dbshell` drops into the DB CLI, `dumpdata` / `loaddata` for fixtures, `flush` wipes data preserving schema, `check` runs system checks, `inspectdb` reverse-engineers models from an existing DB. Write custom commands by subclassing `django.core.management.base.BaseCommand` in `myapp/management/commands/<name>.py`.',
      hints: [
        'runserver, migrate, makemigrations, shell, createsuperuser',
        'help / help <cmd> lists them',
        'Custom: BaseCommand subclass in management/commands/',
      ],
      tags: ['django', 'manage.py', 'commands'],
      concepts: ['dj-setup'],
    },
  {
      id: 'dj-setup-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      question: 'A newly created Django project contains several files: settings.py, urls.py, wsgi.py, and asgi.py. What is the purpose of each?',
      options: [
        {
          id: 'a',
          text: 'settings.py = project configuration (database, apps, middleware); urls.py = URL-to-view routing; wsgi.py = synchronous production server interface; asgi.py = async production server interface',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'settings.py = URL routing; urls.py = project configuration; wsgi.py = development server; asgi.py = testing server',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'settings.py = database schema; urls.py = API endpoints only; wsgi.py = WebSocket interface; asgi.py = admin panel configuration',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'All four files are optional and only needed for deployment — you can delete them during development',
          isCorrect: false,
        },
      ],
      explanation: 'settings.py is the central configuration file (database, installed apps, middleware, static files, etc.). urls.py maps URL patterns to views. wsgi.py provides the WSGI (Web Server Gateway Interface) entry point for synchronous servers like Gunicorn. asgi.py provides the ASGI (Asynchronous Server Gateway Interface) entry point for async servers like Daphne or Uvicorn, enabling WebSockets and async views.',
      hints: [
        'WSGI stands for Web Server Gateway Interface — the traditional Python web standard',
        'ASGI is the async successor to WSGI, needed for WebSockets and async views',
      ],
      tags: ['django', 'project-structure', 'settings', 'wsgi', 'asgi'],
      concepts: ['inf-wsgi-vs-asgi'],
    },
  {
      id: 'dj-setup-gap-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a new Django app called "blog" and add it to INSTALLED_APPS. Show: (1) the terminal command to create the app, and (2) the updated INSTALLED_APPS list in settings.py. The project already has django.contrib.admin, django.contrib.auth, django.contrib.contenttypes, django.contrib.sessions, django.contrib.messages, and django.contrib.staticfiles installed.',
      starterCode: `# Step 1: write the terminal command (as a '# $ ...' comment) that scaffolds the new Django app


# Step 2: write the full INSTALLED_APPS list for settings.py,
# including the six django.contrib.* apps from the prompt plus the new app
`,
      testCases: [
        {
          input: 'App creation and registration',
          expectedOutput: 'python manage.py startapp blog and blog added to INSTALLED_APPS',
          description: 'Should show the startapp command and add blog to INSTALLED_APPS',
        },
      ],
      solution: `# Step 1: Terminal command
# $ python manage.py startapp blog

# Step 2: settings.py — update INSTALLED_APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'blog',
]`,
      explanation: '`python manage.py startapp blog` creates a new directory called "blog" with models.py, views.py, admin.py, apps.py, tests.py, and a migrations folder. Adding \'blog\' (or \'blog.apps.BlogConfig\' for the full AppConfig path) to INSTALLED_APPS tells Django to include this app in migrations, template discovery, and other framework features. Apps not listed in INSTALLED_APPS are invisible to Django.',
      hints: [
        'The command to create an app is: python manage.py startapp <app_name>',
        'Add the app name as a string to the INSTALLED_APPS list',
      ],
      tags: ['django', 'startapp', 'installed-apps', 'project-setup'],
      concepts: ['dj-setup'],
    },
  {
      id: 'py-dj-setup-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Order the bootstrap commands: first create the project `mysite`, then move into it, then create an app `blog` inside the project.',
      correctOrder: [
        'django-admin startproject mysite',
        'cd mysite',
        'python manage.py startapp blog',
      ],
      distractorLines: [
        'python manage.py startproject mysite',
        'django-admin startapp blog',
      ],
      solution:
        'django-admin startproject mysite\ncd mysite\npython manage.py startapp blog',
      explanation:
        '`django-admin startproject` is the one-shot bootstrap that runs from anywhere and creates manage.py. Only after that does `python manage.py startapp` exist — startapp is scoped to a project and is NOT a django-admin command, and startproject is NOT a manage.py command (manage.py does not exist yet).',
      hints: ['startproject is django-admin; startapp is manage.py — and only after cd into the project.'],
      tags: ['django', 'setup', 'startproject', 'startapp'],
      concepts: ['dj-setup'],
    },
  {
      id: 'py-dj-setup-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Order the migration workflow after editing models.py — assume this is the `blog` app\'s first migration (numbered 0001): first generate the migration file for `blog`, then preview the SQL it will run, then apply all pending migrations.',
      correctOrder: [
        'python manage.py makemigrations blog',
        'python manage.py sqlmigrate blog 0001',
        'python manage.py migrate',
      ],
      distractorLines: [
        'django-admin makemigrations blog',
        'python manage.py sqlmigrate blog',
      ],
      solution:
        'python manage.py makemigrations blog\npython manage.py sqlmigrate blog 0001\npython manage.py migrate',
      explanation:
        'makemigrations writes a migration file from model changes; sqlmigrate prints the SQL without running it — it needs BOTH the app and the migration number (`sqlmigrate blog 0001`), so a bare `sqlmigrate blog` errors; migrate applies all pending migrations. All three are manage.py commands, not django-admin (which lacks the project settings here). Plain `migrate` applies everything pending — `migrate blog 0001` would also validly apply this specific migration, but you normally just run `migrate`.',
      hints: ['makemigrations → sqlmigrate blog 0001 (preview) → migrate (apply all pending); all via manage.py.'],
      tags: ['django', 'migrations', 'makemigrations', 'migrate'],
      concepts: ['dj-migration-dependency'],
    },
  {
      id: 'py-dj-setup-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the AppConfig class that completes the preferred registration path for the new "blog" app.',
      template: `# settings.py
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "blog.apps.___",
]`,
      blanks: ['BlogConfig'],
      solution:
        '# settings.py\nINSTALLED_APPS = [\n    "django.contrib.admin",\n    "django.contrib.auth",\n    "blog.apps.BlogConfig",\n]',
      explanation:
        'The AppConfig path "blog.apps.BlogConfig" is preferred over the bare "blog" because it guarantees the config class\'s ready() hook runs — that is where signals are registered. The class is named <App>Config by convention.',
      hints: ['<Appname>Config — the AppConfig subclass in blog/apps.py.'],
      tags: ['django', 'setup', 'INSTALLED_APPS', 'AppConfig'],
      concepts: ['dj-setup'],
    },
  {
      id: 'py-dj-setup-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the two manage.py subcommands: one writes a migration file from model changes, the other applies pending migrations to the database.',
      template: `# 1. write a migration file from models.py changes
python manage.py ___
# 2. apply pending migrations to the database
python manage.py ___`,
      blanks: ['makemigrations', 'migrate'],
      solution:
        '# 1. write a migration file from models.py changes\npython manage.py makemigrations\n# 2. apply pending migrations to the database\npython manage.py migrate',
      explanation:
        'makemigrations turns model changes into a migration file (committed to git); migrate runs the pending migration files against the database. Forgetting makemigrations is the classic "why is my column missing?" bug.',
      hints: ['"make..." writes the file; the other applies it.'],
      tags: ['django', 'migrations', 'makemigrations', 'migrate'],
      concepts: ['dj-migration-dependency'],
    },
  {
      id: 'dj-setup-shell-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      question: 'What does `python manage.py shell` give you that a plain `python` REPL does not?',
      options: [
        { id: 'a', text: 'It boots Django first (loads settings, populates the app registry), so you can import and query your models directly — `from blog.models import Post; Post.objects.count()` just works.', isCorrect: true },
        { id: 'b', text: 'It opens your database\'s native client connected with the configured credentials, where you type raw SQL instead of Python expressions.', isCorrect: false },
        { id: 'c', text: 'It starts the development web server in an interactive mode so you can inspect live HTTP requests as they arrive at your views.', isCorrect: false },
        { id: 'd', text: 'It loads an editor pre-populated with the project files so you can change models from the terminal without a separate IDE.', isCorrect: false },
      ],
      explanation: 'A bare `python` REPL has no `DJANGO_SETTINGS_MODULE` set and never calls `django.setup()`, so importing a model raises `ImproperlyConfigured`. `manage.py shell` does that bootstrapping for you, dropping you into a normal Python prompt with the whole project importable — ideal for poking at the ORM, trying a query, or reproducing a bug. (Opening the *database* CLI is `dbshell`, a different command.)',
      hints: ['shell = Python REPL with Django already configured', 'dbshell is the one that opens the database client'],
      tags: ['django', 'setup', 'shell', 'manage.py', 'cli'],
      concepts: ['dj-setup'],
    },
  {
      id: 'dj-setup-shell-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Run a one-off ORM query straight from the terminal — without opening the interactive prompt — by passing the code to the shell command inline.',
      template: `python manage.py ___ ___ "from blog.models import Post; print(Post.objects.count())"`,
      blanks: ['shell', '-c'],
      solution: 'python manage.py shell -c "from blog.models import Post; print(Post.objects.count())"',
      explanation: '`shell -c "<code>"` runs a snippet inside the Django-configured interpreter and exits — the same idea as `python -c`. It is the quick way to script a one-liner (counts, spot-checks, a quick `update()`) in CI or a shell pipeline without writing a whole management command.',
      hints: ['Same subcommand as the interactive prompt', 'Mirror of python\'s own inline-code flag'],
      tags: ['django', 'setup', 'shell', 'cli', 'cloze'],
      concepts: ['dj-setup'],
    },
  {
      id: 'dj-setup-fixtures-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      question: 'What do `dumpdata` and `loaddata` do, and what are fixtures used for?',
      options: [
        { id: 'a', text: '`dumpdata` serializes model rows to a fixture file (JSON/YAML); `loaddata` reads a fixture back into the database. Fixtures seed reference/test data or move records between environments.', isCorrect: true },
        { id: 'b', text: '`dumpdata` writes the schema to a migration file and `loaddata` replays it. Fixtures are an alternative to running `migrate` when setting up a fresh machine.', isCorrect: false },
        { id: 'c', text: '`dumpdata` exports the raw SQL schema to a `.sql` file and `loaddata` imports it. Fixtures are compressed database snapshots kept only for disaster recovery.', isCorrect: false },
        { id: 'd', text: '`dumpdata` streams the server access logs to disk and `loaddata` reloads them. Fixtures are rolling log archives a staff user can download from the admin.', isCorrect: false },
      ],
      explanation: 'Fixtures are serialized model *data*, not schema. `python manage.py dumpdata blog.Post` prints the rows as JSON; `python manage.py loaddata posts.json` inserts them. Common uses: seeding lookup tables, shipping demo data, and providing known data to tests (a `TestCase` lists `fixtures = ["posts.json"]`). Schema changes are the job of `makemigrations`/`migrate` — a different mechanism entirely.',
      hints: ['Fixtures = data (rows), not schema', 'Schema is makemigrations/migrate\'s job'],
      tags: ['django', 'setup', 'fixtures', 'dumpdata', 'loaddata'],
      concepts: ['dj-setup'],
    },
  {
      id: 'dj-setup-fixtures-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the two manage.py subcommands: one exports the Post rows to a pretty-printed fixture file, the other loads that fixture back into the database.',
      template: `# export every Post row to a fixture, indented for readability
python manage.py ___ blog.Post --indent 2 > posts.json
# load the fixture back into the database
python manage.py ___ posts.json`,
      blanks: ['dumpdata', 'loaddata'],
      solution: '# export every Post row to a fixture, indented for readability\npython manage.py dumpdata blog.Post --indent 2 > posts.json\n# load the fixture back into the database\npython manage.py loaddata posts.json',
      explanation: '`dumpdata <app.Model>` serializes just that model (omit the argument to dump everything); `--indent 2` makes the JSON diff-friendly. `loaddata` matches each record by primary key, so re-loading overwrites existing rows rather than duplicating them.',
      hints: ['"dump..." writes the rows out; "load..." reads them in', 'app-label.ModelName scopes the export'],
      tags: ['django', 'setup', 'fixtures', 'dumpdata', 'loaddata', 'cloze'],
      concepts: ['dj-setup'],
    },
  {
      id: 'dj-setup-showmigrations-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      question: 'The `blog` app is at migration 0003. How do you see which migrations have run, and how do you undo only 0003?',
      options: [
        { id: 'a', text: '`python manage.py showmigrations` lists each one as `[X]` (applied) or `[ ]` (pending); to roll back 0003 you migrate to the previous target with `python manage.py migrate blog 0002` (and `migrate blog zero` unapplies them all).', isCorrect: true },
        { id: 'b', text: '`python manage.py listmigrations` prints the applied ones; to undo 0003 you delete its file and run `migrate --rollback blog`, which reverses the most recent step automatically.', isCorrect: false },
        { id: 'c', text: '`python manage.py migrations --status` shows the table; to undo 0003 you run `migrate blog --undo 1`, reversing exactly one migration from the top of the list.', isCorrect: false },
        { id: 'd', text: '`python manage.py showmigrations` shows only the pending ones; to undo 0003 you run `unmigrate blog 0003`, the dedicated reverse-migration command.', isCorrect: false },
      ],
      explanation: 'There is no separate "undo" command — you reverse a migration by *migrating to an earlier state*. `migrate blog 0002` runs the `0003.backwards` operations, leaving you at 0002; `migrate blog zero` unapplies every migration in the app. `showmigrations` is the status view (`[X]`/`[ ]`). Note: reversing only works if 0003\'s operations are reversible (a raw `RunPython` with no reverse function will refuse).',
      hints: ['Undo = migrate to the previous number', 'migrate blog zero clears them all; showmigrations shows [X]/[ ]'],
      tags: ['django', 'setup', 'migrations', 'showmigrations', 'reverse-migration'],
      concepts: ['dj-migration-dependency'],
    },
  {
      id: 'dj-setup-reverse-migrate-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'The `blog` app is at migration 0003. Fill in the migrate targets: first roll back just 0003 (leaving 0002 applied), then unapply ALL of the app\'s migrations.',
      template: `# undo only 0003, staying at 0002
python manage.py migrate blog ___
# unapply every blog migration (back to an empty app)
python manage.py migrate blog ___`,
      blanks: ['0002', 'zero'],
      solution: '# undo only 0003, staying at 0002\npython manage.py migrate blog 0002\n# unapply every blog migration (back to an empty app)\npython manage.py migrate blog zero',
      explanation: 'Passing an app label plus a target to `migrate` moves that app to exactly that state, running forwards or backwards as needed. The special target `zero` means "before the first migration" — it reverses the whole app, which is how you cleanly reset one app\'s tables without touching the rest of the project.',
      hints: ['Target the migration you want to END at', '"zero" is the special all-the-way-back target'],
      tags: ['django', 'setup', 'migrations', 'reverse-migration', 'cloze'],
      concepts: ['dj-migration-dependency'],
    },
  {
      id: 'dj-setup-dbshell-flush-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_SETUP,
      course: Course.BACKEND,
      question: 'What is the difference between `python manage.py dbshell` and `python manage.py flush`?',
      options: [
        { id: 'a', text: '`dbshell` opens your database\'s own CLI (psql / sqlite3 / mysql) using the credentials in settings; `flush` deletes all rows from every table but keeps the schema and migration history intact.', isCorrect: true },
        { id: 'b', text: '`dbshell` opens the Django ORM REPL with your models pre-imported; `flush` drops every table and the migration history so the next `migrate` rebuilds from scratch.', isCorrect: false },
        { id: 'c', text: '`dbshell` connects read-only to the production database for inspection; `flush` clears the cache backend and session store but never touches table rows.', isCorrect: false },
        { id: 'd', text: '`dbshell` prints the SQL Django would run for pending migrations; `flush` truncates only the tables you pass as arguments, leaving every other table untouched.', isCorrect: false },
      ],
      explanation: '`dbshell` shells out to the native client for your configured `ENGINE`, so you can run raw SQL with the project\'s connection settings — no need to retype host/user/password. `flush` empties the data (every table\'s rows) and re-applies any post-migrate fixtures, but the *tables themselves* and the recorded migration state remain — so it is "reset the data, keep the structure," not a teardown. (The ORM REPL is `shell`, not `dbshell`.)',
      hints: ['dbshell = native DB client; flush = wipe rows, keep schema', 'shell is the Python REPL, dbshell is the SQL one'],
      tags: ['django', 'setup', 'dbshell', 'flush', 'cli'],
      concepts: ['dj-setup'],
    },
];
