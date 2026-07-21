/**
 * Topic.DJ_MANAGEMENT — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendAdvancedPedagogyQuestions.ts (2), djangoAdvancedQuestions.ts (2), djangoGapFillQuestions.ts (1)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_management_questions: Question[] = [
  {
      id: 'dj-management-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MANAGEMENT,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a management command `python manage.py cleanup_drafts --days 30` that deletes Articles older than N days with status="draft".',
      correctOrder: [
        'from django.core.management.base import BaseCommand',
        'from django.utils import timezone',
        'from datetime import timedelta',
        'from articles.models import Article',
        '',
        'class Command(BaseCommand):',
        '    def add_arguments(self, parser):',
        '        parser.add_argument("--days", type=int, default=30)',
        '',
        '    def handle(self, *args, **options):',
        '        cutoff = timezone.now() - timedelta(days=options["days"])',
        '        deleted, _ = Article.objects.filter(status="draft", created_at__lt=cutoff).delete()',
        '        self.stdout.write(f"Deleted {deleted} drafts")',
      ],
      distractorLines: [
        '    def run(self, *args, **options):',
        '    def execute(self, args):',
        '    parser.add_args("--days", type=int)',
        '        cutoff = datetime.now() - timedelta(days=options.days)',
      ],
      solution: 'from django.core.management.base import BaseCommand\nfrom django.utils import timezone\nfrom datetime import timedelta\nfrom articles.models import Article\n\nclass Command(BaseCommand):\n    def add_arguments(self, parser):\n        parser.add_argument("--days", type=int, default=30)\n\n    def handle(self, *args, **options):\n        cutoff = timezone.now() - timedelta(days=options["days"])\n        deleted, _ = Article.objects.filter(status="draft", created_at__lt=cutoff).delete()\n        self.stdout.write(f"Deleted {deleted} drafts")',
      explanation: 'A custom management command lives in `<app>/management/commands/<name>.py` and exports a `Command(BaseCommand)` class. Override `add_arguments(self, parser)` for argparse-style flags and `handle(self, *args, **options)` for the body. Always use `timezone.now()` (not `datetime.now()`) in Django — respects `USE_TZ`.',
      hints: ['Class is named Command, not the command name', 'handle() is the body', 'options is a dict, not an attribute'],
      tags: ['django', 'management-command', 'BaseCommand', 'parsons'],
      concepts: ['dj-management-commands'],
    },
  {
      id: 'dj-management-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MANAGEMENT,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Configure production settings: never DEBUG, restrict hostnames, secret from env.',
      template: `import os

DEBUG = ___
ALLOWED_HOSTS = ___("ALLOWED_HOSTS", "").split(",")
SECRET_KEY = os.environ[___]`,
      blanks: ['False', 'os.environ.get', '"SECRET_KEY"'],
      solution: 'import os\n\nDEBUG = False\nALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")\nSECRET_KEY = os.environ["SECRET_KEY"]',
      explanation: '`DEBUG = False` is non-negotiable in prod (leaks settings + tracebacks otherwise). `ALLOWED_HOSTS` blocks Host-header attacks — must include your real hostnames. `os.environ[KEY]` raises `KeyError` if missing — use this for required values; use `.get(KEY, default)` for optional ones.',
      hints: ['DEBUG must be False in prod', 'os.environ[K] raises KeyError if missing', 'os.environ.get(K, default) for optionals'],
      tags: ['django', 'deployment', 'settings', 'cloze'],
      concepts: ['dj-deployment-cicd'],
    },
  {
      id: 'dj-mgmt-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MANAGEMENT,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a custom Django management command called `import_products` that reads a CSV file and creates Product objects. The command should accept a required `--file` argument for the CSV path. The CSV has columns: name, category, price. Use bulk_create for efficiency and print how many products were imported. The file should be at: myapp/management/commands/import_products.py',
      starterCode: `# myapp/management/commands/import_products.py
# CSV format: name,category,price
# Example: "Widget,Electronics,29.99"

import csv
from django.core.management.base import BaseCommand
from myapp.models import Product

`,
      testCases: [
        {
          input: 'python manage.py import_products --file products.csv',
          expectedOutput: 'BaseCommand subclass with add_arguments, handle method, CSV reading, and bulk_create',
          description: 'Should import products from CSV via management command',
        },
      ],
      solution: `import csv
from django.core.management.base import BaseCommand
from myapp.models import Product

class Command(BaseCommand):
    help = 'Import products from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('--file', type=str, required=True, help='Path to CSV file')

    def handle(self, *args, **options):
        file_path = options['file']
        products = []

        with open(file_path, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                products.append(Product(
                    name=row['name'],
                    category=row['category'],
                    price=row['price'],
                ))

        Product.objects.bulk_create(products)
        self.stdout.write(self.style.SUCCESS(f'Successfully imported {len(products)} products'))`,
      explanation: 'Management commands are Python classes that extend BaseCommand and live in yourapp/management/commands/. Django discovers them automatically via the directory convention — the __init__.py files in management/ and commands/ directories are required. add_arguments() uses argparse under the hood, so you get built-in validation, help text, and type conversion. handle() is the entry point that Django calls when you run the command. bulk_create() is critical for performance: instead of N individual INSERT statements, it typically generates a single INSERT with multiple value sets, reducing database round-trips from hundreds/thousands to one. Use self.stdout.write() with self.style.SUCCESS/ERROR for colored terminal output that respects Django\'s verbosity settings.',
      tieredHints: {
        apiSignature: 'BaseCommand.add_arguments(parser)',
        skeleton: 'import csv\nfrom django.core.management.base import BaseCommand\nfrom myapp.models import Product\n\nclass Command(____):\n    help = \'Import products from a CSV file\'\n\n    def ____(self, parser):\n        parser.add_argument(\'--file\', type=str, required=True, help=\'Path to CSV file\')\n\n    def ____(self, *args, **options):\n        file_path = options[\'file\']\n        products = []\n\n        with open(file_path, \'r\') as f:\n            reader = csv.DictReader(f)\n            for row in reader:\n                products.append(Product(\n                    name=row[\'name\'],\n                    category=row[\'category\'],\n                    price=row[\'price\'],\n                ))\n\n        Product.objects.bulk_create(products)\n        self.stdout.write(self.style.SUCCESS(f\'Successfully imported {len(products)} products\'))',
      },
      hints: [
        'The class must be named Command and extend BaseCommand',
        'add_arguments receives an argparse parser',
        'handle() is the main method — access arguments via options dict',
      ],
      tags: ['django', 'management-command', 'csv', 'bulk-create', 'data-import'],
      concepts: ['dj-management-commands', 'py-file-io-modes', 'dj-orm-query-construction'],
    },
  {
      id: 'dj-mgmt-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MANAGEMENT,
      course: Course.BACKEND,
      question: 'When should you use Django management commands instead of admin actions?',
      options: [
        { id: 'a', text: 'Management commands are only for Django\'s built-in commands like migrate and createsuperuser. Custom automation should always use admin actions.', isCorrect: false },
        { id: 'b', text: 'Management commands for scheduled/cron jobs, data migrations, CLI scripts, and tasks that run without a browser. Admin actions for bulk operations a staff user performs interactively on selected objects in the admin UI.', isCorrect: true },
        { id: 'c', text: 'Admin actions can do everything management commands can. Management commands exist only for backward compatibility with older Django versions.', isCorrect: false },
        { id: 'd', text: 'Management commands require a running web server while admin actions run from the command line. Use management commands for user-facing features.', isCorrect: false },
      ],
      explanation: 'Management commands and admin actions serve fundamentally different execution contexts. Management commands run from the terminal (python manage.py <command>), making them perfect for: cron jobs (daily report generation), data migrations (importing legacy data), one-off scripts (cleaning up old records), CI/CD tasks (seeding test data), and any automation that doesn\'t need a web browser. Admin actions run through the web interface when a staff user selects objects and picks an action from the dropdown — ideal for interactive bulk operations like "approve selected comments" or "mark orders as shipped." The key distinction: management commands are for automated/scheduled/developer tasks, while admin actions are for staff users performing ad-hoc operations through the browser.',
      hints: [
        'Think about who/what triggers the operation: a person in a browser, or a cron job?',
        'Management commands work from the terminal with no web server needed',
      ],
      tags: ['django', 'management-commands', 'admin-actions', 'automation', 'best-practices'],
      concepts: ['dj-management-commands'],
    },
  {
      id: 'dj-management-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MANAGEMENT,
      course: Course.BACKEND,
      question: 'What are Django management commands?\n\nYou have already used several: `python manage.py runserver`, `python manage.py migrate`, `python manage.py createsuperuser`. But you can also create your own.',
      options: [
        {
          id: 'a',
          text: 'Admin panel bulk actions that staff users trigger by selecting rows and clicking buttons in the Django admin',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'REST API endpoints that Django exposes so the application can be managed remotely over HTTP',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Custom commands you run with `python manage.py your_command` — used for data imports, cleanup tasks, reports, and seeding test data',
          isCorrect: true,
        },
        {
          id: 'd',
          text: 'Shell scripts stored in an app\'s /management/ directory that must be executed with bash rather than Python',
          isCorrect: false,
        },
      ],
      explanation: 'Management commands are Python scripts you invoke via manage.py. Django discovers them in any app\'s management/commands/ directory. Built-in examples: migrate (apply database changes), createsuperuser (create admin user), collectstatic (gather static files for production), shell (interactive Python with Django loaded). Custom commands are perfect for: importing CSV data, sending scheduled emails, cleaning up old records, or seeding the database with test data. They have full access to Django models and settings.',
      hints: [
        'Custom commands go in: your_app/management/commands/your_command.py',
        'The command class extends BaseCommand and implements a handle() method',
      ],
      tags: ['django', 'management-commands', 'manage-py', 'cli', 'basics'],
      concepts: ['dj-management-commands', 'py-cli-tools'],
    },
  {
      id: 'dj-mgmt-runscript-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MANAGEMENT,
      course: Course.BACKEND,
      question: 'You write a plain `report.py` that does `from blog.models import Post` and run it with `python report.py`. It crashes with `ImproperlyConfigured: Requested setting... define DJANGO_SETTINGS_MODULE or call settings.configure()`. Why, and what is the fix?',
      options: [
        { id: 'a', text: 'Importing a model needs Django\'s app registry loaded, which only happens after settings are configured. Set `DJANGO_SETTINGS_MODULE` and call `django.setup()` at the top of the script — or run it via `manage.py shell < report.py` / a management command, which bootstraps Django for you.', isCorrect: true },
        { id: 'b', text: 'The model import is circular; split `report.py` into two modules so `Post` is imported lazily, after which `python report.py` runs with no Django bootstrapping required.', isCorrect: false },
        { id: 'c', text: 'Plain scripts cannot use the ORM at all — only views and management commands may touch models, so the logic has to move into a request handler served by `runserver`.', isCorrect: false },
        { id: 'd', text: 'The script is missing a `__main__` guard; wrap the body in `if __name__ == "__main__":` and Django auto-detects the project and configures settings on the first model import.', isCorrect: false },
      ],
      explanation: 'When you run a script through `manage.py`, Django sets `DJANGO_SETTINGS_MODULE` and calls `django.setup()` before your code — that is what populates `apps` and makes models importable. A bare `python report.py` skips all of that, so the first model import explodes. The fix is to do the bootstrap yourself (next two questions) or let `manage.py` (a custom command, or `shell`) do it. `django-extensions` packages this as `manage.py runscript`.',
      hints: ['Models need the app registry, which django.setup() builds', 'manage.py does the bootstrap; a bare python script must do it itself'],
      tags: ['django', 'management', 'django-setup', 'standalone-script', 'cli'],
      concepts: ['dj-management-commands', 'py-cli-tools'],
    },
  {
      id: 'dj-mgmt-django-setup-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MANAGEMENT,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Order a standalone `report.py` (run with `python report.py`, outside manage.py) so it can query models: point Django at the settings module, initialise the app registry, THEN import models and query. Put `import os` first, then `import django`.',
      correctOrder: [
        'import os',
        'import django',
        'os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")',
        'django.setup()',
        'from blog.models import Post',
        'print(Post.objects.count())',
      ],
      distractorLines: [
        'django.configure()',
        'os.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")',
        'import settings',
      ],
      solution: 'import os\nimport django\nos.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")\ndjango.setup()\nfrom blog.models import Post\nprint(Post.objects.count())',
      explanation: 'Two things must happen before any model import: `DJANGO_SETTINGS_MODULE` has to point at your settings, and `django.setup()` has to run to build the app registry. The model import comes AFTER both — importing it earlier is exactly what raises `ImproperlyConfigured`. Distractors encode real slips: `django.configure()` is not a function (it is `settings.configure()` or `django.setup()`), `os.setdefault` does not exist (it is `os.environ.setdefault`), and `import settings` does not configure Django.',
      hints: ['env var → django.setup() → import models → query', 'os.environ.setdefault, not os.setdefault; django.setup(), not django.configure()'],
      tags: ['django', 'management', 'django-setup', 'standalone-script', 'parsons'],
      concepts: ['dj-management-commands', 'py-cli-tools'],
    },
  {
      id: 'dj-mgmt-django-setup-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MANAGEMENT,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Complete the bootstrap of a standalone script: register the settings module on the environment, then initialise Django so models become importable.',
      template: `import os
import django

os.environ.___("DJANGO_SETTINGS_MODULE", "mysite.settings")
django.___()

from blog.models import Post
print(Post.objects.count())`,
      blanks: ['setdefault', 'setup'],
      solution: 'import os\nimport django\n\nos.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")\ndjango.setup()\n\nfrom blog.models import Post\nprint(Post.objects.count())',
      explanation: '`os.environ.setdefault(...)` sets the settings path only if it is not already exported (so an outer environment can override it); `django.setup()` then loads settings and populates the app registry. Only after that line is `from blog.models import Post` safe.',
      hints: ['environ.<method> sets the var if unset', 'django.<func>() builds the app registry'],
      tags: ['django', 'management', 'django-setup', 'standalone-script', 'cloze'],
      concepts: ['dj-management-commands', 'py-cli-tools'],
    },
  {
      id: 'dj-mgmt-call-command-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MANAGEMENT,
      course: Course.BACKEND,
      question: 'What does `django.core.management.call_command` do, and when would you use it instead of shelling out to a subprocess?',
      options: [
        { id: 'a', text: 'It runs a management command from Python in the same process — e.g. `call_command("migrate", verbosity=0)` or `call_command("loaddata", "seed.json")` — handy inside another command, a test\'s setup, or a script, with no new interpreter to spawn.', isCorrect: true },
        { id: 'b', text: 'It sends a command to a running `runserver` process over a local socket, so you can trigger tasks on the live development server without restarting it.', isCorrect: false },
        { id: 'c', text: 'It registers a management command to run later via the system cron table, returning a job id you can cancel any time before it fires.', isCorrect: false },
        { id: 'd', text: 'It compiles a management command into a standalone shell executable so it can run on machines that do not have Django installed at all.', isCorrect: false },
      ],
      explanation: '`call_command` invokes any command in-process, passing options as keyword arguments. It is the right tool when you are already inside Django: a test that needs `loaddata` in `setUp`, one command that chains another, or a deploy script that runs `migrate` then `collectstatic` without the cost and quoting headaches of `subprocess`. Use a subprocess only when you genuinely need process isolation or a different interpreter.',
      hints: ['Runs a command in the same Python process', 'Great for tests / chaining commands; avoids subprocess overhead'],
      tags: ['django', 'management', 'call_command', 'cli'],
      concepts: ['dj-management-commands'],
    },
  {
      id: 'dj-mgmt-call-command-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MANAGEMENT,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Inside a test or script, run the `loaddata` management command programmatically (quietly) — import the helper and invoke it.',
      template: `from django.core.management import ___
___("loaddata", "seed.json", verbosity=0)`,
      blanks: ['call_command', 'call_command'],
      solution: 'from django.core.management import call_command\ncall_command("loaddata", "seed.json", verbosity=0)',
      explanation: 'The first positional argument is the command name; further positionals are its arguments and keyword args map to its options (`verbosity=0` silences output). This runs in the current process, so it shares the same database connection and transaction as the surrounding test.',
      hints: ['Same name for the import and the call', 'Command name is the first string argument'],
      tags: ['django', 'management', 'call_command', 'cloze'],
      concepts: ['dj-management-commands'],
    },
  {
      id: 'dj-mgmt-check-deploy-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MANAGEMENT,
      course: Course.BACKEND,
      question: 'What does `python manage.py check --deploy` do?',
      options: [
        { id: 'a', text: 'It runs Django\'s system-check framework with the deployment-only checks enabled, flagging insecure production settings (DEBUG=True, missing SECURE_SSL_REDIRECT/HSTS, a weak SECRET_KEY, empty ALLOWED_HOSTS) — without touching the database.', isCorrect: true },
        { id: 'b', text: 'It deploys the project to the host named in settings, running `collectstatic`, applying `migrate`, and restarting gunicorn in a single step.', isCorrect: false },
        { id: 'c', text: 'It connects to the production server over SSH and refuses to continue if free disk or memory is below a configured safe threshold.', isCorrect: false },
        { id: 'd', text: 'It verifies that every migration has been applied on the production database and auto-applies any that are missing before serving traffic.', isCorrect: false },
      ],
      explanation: '`check` runs Django\'s static system checks; the `--deploy` flag turns on the security-focused subset meant for production. It is read-only — it inspects your settings and reports warnings (e.g. `security.W004` for missing HSTS), it does NOT deploy anything or migrate. Run it in CI before shipping so an insecure setting fails the build instead of reaching production.',
      hints: ['It audits settings, it does not deploy', 'Read-only security checks; great in CI'],
      tags: ['django', 'management', 'check', 'deployment', 'security'],
      concepts: ['dj-deployment-cicd'],
    },
];
