/**
 * Topic.DJ_CELERY — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendAdvancedPedagogyQuestions.ts (3), celeryDrfQuestions.ts (8), djangoAdvancedFinalQuestions.ts (1), djangoGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_celery_questions: Question[] = [
  {
      id: 'dj-celery-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CELERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a shared Celery task that retries up to 3 times with 60-second backoff on any exception.',
      template: `from celery import ___

@___(bind=True, max_retries=3)
def send_email(self, to, subject):
    try:
        smtp.send(to, subject)
    except Exception as exc:
        raise self.___(exc=exc, countdown=60)`,
      blanks: ['shared_task', 'shared_task', 'retry'],
      solution: 'from celery import shared_task\n\n@shared_task(bind=True, max_retries=3)\ndef send_email(self, to, subject):\n    try:\n        smtp.send(to, subject)\n    except Exception as exc:\n        raise self.retry(exc=exc, countdown=60)',
      explanation: '`@shared_task` defines a task without coupling to a specific Celery app instance — the standard for Django apps. `bind=True` makes `self` (the Task instance) the first argument so you can call `self.retry()`. `countdown` is seconds; `eta` is an absolute datetime. Always `raise self.retry(...)` — calling without raise still re-raises the original.',
      hints: ['shared_task is the canonical decorator for Django', 'bind=True gives access to self', 'retry() must be raised'],
      tags: ['django', 'celery', 'shared_task', 'retry', 'cloze'],
      concepts: ['ce-task-idempotency'],
    },
  {
      id: 'dj-celery-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CELERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What\'s the type of the return value? (Worker is running.)',
      code: `@shared_task
def add(a, b):
    return a + b

# In Django view code:
result = add.delay(2, 3)
print(type(result).__name__)
print(result.ready())`,
      expectedOutput: `AsyncResult
False`,
      explanation: '`task.delay(args)` enqueues the task and returns an `AsyncResult` *immediately* — without waiting. `ready()` returns False until the worker actually completes it. Calling `result.get()` would block until done; in views you almost never do that — return the task id and poll.',
      hints: ['delay() enqueues and returns immediately', 'AsyncResult is async — get() blocks'],
      tags: ['django', 'celery', 'AsyncResult', 'delay', 'predict'],
      concepts: ['ce-task-idempotency'],
    },
  {
      id: 'dj-celery-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CELERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Schedule a periodic task to run every 60 seconds via Celery beat. Skeleton in celery.py.',
      correctOrder: [
        'from celery import Celery',
        'from celery.schedules import schedule',
        '',
        'app = Celery("myproj")',
        '',
        'app.conf.beat_schedule = {',
        '    "cleanup-every-minute": {',
        '        "task": "articles.tasks.cleanup_drafts",',
        '        "schedule": 60.0,',
        '    },',
        '}',
      ],
      distractorLines: [
        '    "cleanup-every-minute": cleanup_drafts',
        '        "task": cleanup_drafts,',
        '        "interval": 60.0,',
        '        "every": 60,',
      ],
      solution: 'from celery import Celery\nfrom celery.schedules import schedule\n\napp = Celery("myproj")\n\napp.conf.beat_schedule = {\n    "cleanup-every-minute": {\n        "task": "articles.tasks.cleanup_drafts",\n        "schedule": 60.0,\n    },\n}',
      explanation: '`beat_schedule` is a dict of named entries. The `task` value is a STRING (dotted import path), not the function — beat doesn\'t import your tasks at config time. `schedule: 60.0` is "every 60 seconds"; use `crontab(hour=3)` from `celery.schedules` for cron-style timing. Beat must be run as a separate process: `celery -A myproj beat`.',
      hints: ['task value is the dotted import path string', 'schedule: float = seconds; or crontab(...)', 'Beat is a separate process'],
      tags: ['django', 'celery', 'beat_schedule', 'parsons'],
      concepts: ['ce-task-idempotency'],
    },
    // 1. Coding: Define a Celery task with @shared_task
  {
      id: 'celery-drf-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CELERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a Celery task with @shared_task that sends a welcome email. Write the full tasks.py file with the decorator, function body (simulating email send with a print), and show how to call it asynchronously with .delay().',
      starterCode: `# myapp/tasks.py\nfrom celery import shared_task\n\n# Define a task that sends a welcome email\n# Then show how to call it with .delay()\n`,
      testCases: [
        {
          input: 'tasks.py with shared_task decorator',
          expectedOutput: '@shared_task decorator, function definition, .delay() call',
          description: 'Should define a Celery task and call it with .delay()',
        },
      ],
      solution: `# myapp/tasks.py\nfrom celery import shared_task\nfrom django.core.mail import send_mail\n\n\n@shared_task\ndef send_welcome_email(user_email, username):\n    \"\"\"Send a welcome email to a new user.\"\"\"\n    send_mail(\n        subject=\"Welcome!\",\n        message=f\"Hello {username}, welcome to our platform!\",\n        from_email=\"noreply@example.com\",\n        recipient_list=[user_email],\n    )\n    return f\"Email sent to {user_email}\"\n\n\n# Calling the task asynchronously (e.g., in a view):\n# send_welcome_email.delay(\"user@example.com\", \"Alice\")`,
      explanation: '@shared_task makes the function a Celery task without tying it to a specific Celery app instance -- this is why it works across Django apps. Calling .delay(args) pushes the task onto the message broker (Redis/RabbitMQ) and returns immediately, so the HTTP response is not blocked by the email send. The worker process picks it up and executes it in the background.',
      hints: [
        '@shared_task is preferred over @app.task in Django because it does not need a direct reference to the Celery app',
        '.delay() is shorthand for .apply_async() -- both push to the broker',
        'The task function must be importable by the worker process',
      ],
      tags: ['celery', 'shared_task', 'delay', 'async-tasks', 'django'],
      concepts: ['ce-task-idempotency'],
    },
    // 2. Coding: Configure Celery in a Django project
  {
      id: 'celery-drf-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CELERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Configure Celery in a Django project. Write the celery.py file in the project folder (create the Celery app, set config from Django settings, autodiscover tasks) AND the __init__.py import that ensures Celery loads when Django starts.',
      starterCode: `# myproject/celery.py\n\n\n# myproject/__init__.py\n`,
      testCases: [
        {
          input: 'celery.py and __init__.py configuration',
          expectedOutput: 'Celery app creation, config_from_object, autodiscover_tasks, __init__ import',
          description: 'Should configure Celery app and ensure it loads on Django startup',
        },
      ],
      solution: `# myproject/celery.py\nimport os\nfrom celery import Celery\n\n# Set default Django settings module\nos.environ.setdefault(\"DJANGO_SETTINGS_MODULE\", \"myproject.settings\")\n\napp = Celery(\"myproject\")\n\n# Read config from Django settings, namespace='CELERY' means\n# all celery settings must be prefixed with CELERY_ in settings.py\napp.config_from_object(\"django.conf:settings\", namespace=\"CELERY\")\n\n# Auto-discover tasks.py in all installed apps\napp.autodiscover_tasks()\n\n\n# myproject/__init__.py\nfrom .celery import app as celery_app\n\n__all__ = (\"celery_app\",)`,
      explanation: 'This two-file setup is the standard Celery-Django integration pattern. celery.py creates the app and configures it from Django settings (so you put CELERY_BROKER_URL in settings.py). autodiscover_tasks() finds tasks.py in each INSTALLED_APP automatically. The __init__.py import ensures the Celery app is created when Django starts, which is why workers can find your tasks.',
      hints: [
        'os.environ.setdefault ensures DJANGO_SETTINGS_MODULE is set before Celery loads',
        'namespace="CELERY" means settings like CELERY_BROKER_URL in settings.py',
        'The __init__.py import is critical -- without it, the app object is not created at startup',
      ],
      tags: ['celery', 'django-config', 'autodiscover', 'celery-setup'],
      concepts: ['ce-task-idempotency'],
    },
    // 3. MC: delay() vs apply_async()
  {
      id: 'celery-drf-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CELERY,
      course: Course.BACKEND,
      question: 'What is the difference between task.delay(args) and task.apply_async(args, kwargs) in Celery?',
      options: [
        { id: 'a', text: 'delay() runs the task synchronously in the current process, while apply_async() is the only way to push the task to the broker for background execution', isCorrect: false },
        { id: 'b', text: 'They are fully interchangeable -- delay() accepts the same scheduling options like countdown and queue, just under a shorter name', isCorrect: false },
        { id: 'c', text: 'delay() is shorthand for apply_async() with positional args only; apply_async() adds options like countdown, eta, retry policy, and queue routing', isCorrect: true },
        { id: 'd', text: 'apply_async() is the legacy API kept for backwards compatibility; new code should always use delay() because it supports more options', isCorrect: false },
      ],
      explanation: 'task.delay(arg1, arg2) is syntactic sugar for task.apply_async(args=[arg1, arg2]). Both send the task to the broker asynchronously. The reason apply_async() exists is for advanced control: countdown=60 (delay execution by 60s), eta=datetime (run at specific time), queue="high-priority" (route to specific queue), retry_policy={} (custom retry behavior). Use delay() for simple fire-and-forget, apply_async() when you need scheduling or routing.',
      tags: ['celery', 'delay', 'apply_async', 'task-execution'],
      concepts: ['ce-task-idempotency'],
    },
    // 4. MC: Celery beat
  {
      id: 'celery-drf-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CELERY,
      course: Course.BACKEND,
      question: 'What is Celery beat and when do you use it?',
      options: [
        { id: 'a', text: 'A monitoring dashboard that tracks worker health, task throughput, and queue depth so you can spot failing tasks in real time', isCorrect: false },
        { id: 'b', text: 'A periodic task scheduler that sends tasks to the queue on cron-like schedules, running as a separate beat process alongside the worker', isCorrect: true },
        { id: 'c', text: 'A load balancer that distributes queued tasks evenly across workers so no single worker process gets overloaded with long jobs', isCorrect: false },
        { id: 'd', text: 'A lightweight message broker bundled with Celery that replaces Redis or RabbitMQ for projects with low task volume', isCorrect: false },
      ],
      explanation: 'Celery beat is a scheduler that sends tasks to the queue at defined intervals. You configure it with CELERY_BEAT_SCHEDULE in settings.py using crontab() or timedelta(). It runs as a separate process (celery -A myproject beat) because it needs to be a single instance -- if you ran multiple beat processes, tasks would be scheduled multiple times. Common use cases: sending daily digest emails, cleaning up expired sessions, generating periodic reports.',
      tags: ['celery', 'celery-beat', 'periodic-tasks', 'scheduling'],
      concepts: ['ce-task-idempotency'],
    },
    // 5. Coding: Task with retry on failure
  {
      id: 'celery-drf-5',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CELERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a Celery task with retry on failure. Use bind=True so the task has access to self, catch exceptions, and call self.retry(exc=exc, countdown=60, max_retries=3). The task should call an external API to fetch user data.',
      starterCode: `# myapp/tasks.py\nfrom celery import shared_task\nimport requests\n\n# Define a task that fetches user data from an API\n# with retry logic on failure\n`,
      testCases: [
        {
          input: 'Task with bind=True and self.retry',
          expectedOutput: '@shared_task(bind=True), try/except, self.retry(exc=exc, countdown=60, max_retries=3)',
          description: 'Should implement task retry pattern',
        },
      ],
      solution: `# myapp/tasks.py\nfrom celery import shared_task\nimport requests\n\n\n@shared_task(bind=True, max_retries=3)\ndef fetch_user_data(self, user_id):\n    \"\"\"Fetch user data from external API with retry on failure.\"\"\"\n    try:\n        response = requests.get(\n            f\"https://api.example.com/users/{user_id}\",\n            timeout=10,\n        )\n        response.raise_for_status()\n        return response.json()\n    except requests.RequestException as exc:\n        # Retry in 60 seconds, up to 3 times\n        raise self.retry(exc=exc, countdown=60)\n\n\n# Usage:\n# fetch_user_data.delay(42)`,
      explanation: 'bind=True makes the task instance available as the first argument (self), which gives you access to self.retry(). When self.retry() is called, it raises a Retry exception that tells the worker to re-queue the task after the countdown period. max_retries=3 prevents infinite retry loops. This pattern is essential for tasks that depend on external services (APIs, email servers, payment gateways) because network failures are inevitable in production.',
      hints: [
        'bind=True passes the task instance as self -- required for self.retry()',
        'raise self.retry(exc=exc, countdown=60) re-queues the task after 60 seconds',
        'Always set max_retries to prevent infinite loops on permanent failures',
      ],
      tags: ['celery', 'retry', 'bind', 'error-handling', 'resilience'],
      concepts: ['ce-task-idempotency', 'py-exception-hierarchy'],
    },
    // 6. MC: Worker crash behavior
  {
      id: 'celery-drf-6',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CELERY,
      course: Course.BACKEND,
      question: 'What happens when a Celery worker crashes mid-task?',
      options: [
        { id: 'a', text: 'The broker detects the dead worker and automatically retries the task on another worker, up to the task\'s max_retries setting', isCorrect: false },
        { id: 'b', text: 'The result backend marks the task as FAILED and Celery re-sends it to a special dead-letter queue for manual inspection', isCorrect: false },
        { id: 'c', text: 'The task is always lost regardless of configuration -- Celery provides no redelivery, so you must re-trigger it manually', isCorrect: false },
        { id: 'd', text: 'It depends on acks_late: by default the task is lost, but with acks_late=True it returns to the queue -- safe only for idempotent tasks', isCorrect: true },
      ],
      explanation: 'By default, Celery acknowledges (removes from queue) a task as soon as a worker picks it up. If the worker crashes, the task is gone. Setting acks_late=True changes this: the task is acknowledged only after successful completion, so a crash returns it to the queue. The catch: this means the task might run twice (once partially, once fully), so the task must be idempotent -- running it twice should produce the same result as running it once. Example: "set balance to $100" is idempotent, "add $100 to balance" is not.',
      tags: ['celery', 'acks_late', 'reliability', 'idempotent', 'worker-crash'],
      concepts: ['ce-task-idempotency'],
    },
    // 7. MC: Result backend
  {
      id: 'celery-drf-7',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CELERY,
      course: Course.BACKEND,
      question: 'What is a Celery result backend and when do you need one?',
      options: [
        { id: 'a', text: 'It stores task results and states so you can call .get() or check task.status; skip it for fire-and-forget tasks to avoid overhead', isCorrect: true },
        { id: 'b', text: 'It is the same component as the message broker -- pointing CELERY_BROKER_URL at Redis automatically stores results there too', isCorrect: false },
        { id: 'c', text: 'It is required for every Celery installation because workers cannot acknowledge task completion without writing a result row', isCorrect: false },
        { id: 'd', text: 'It stores the registered task code so that workers on other machines can discover and import your tasks at runtime', isCorrect: false },
      ],
      explanation: 'The result backend is separate from the broker. The broker delivers task messages; the result backend stores return values and task states (PENDING, STARTED, SUCCESS, FAILURE). You need it when you call result = task.delay(); result.get() or check result.status. Common backends: Redis (fast, ephemeral), Django DB (persistent, queryable), or django-celery-results. If your tasks are fire-and-forget (send email, process webhook), skip the result backend entirely -- it adds overhead for every task.',
      tags: ['celery', 'result-backend', 'task-status', 'configuration'],
      concepts: ['ce-task-idempotency'],
    },
    // 8. Coding: Chain and group
  {
      id: 'celery-drf-8',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CELERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use Celery chain and group to compose tasks. Chain two tasks (fetch_data piped to process_data where the result of fetch flows into process) and run 3 tasks in parallel with group. Show the imports and execution.',
      starterCode: `# Task composition with chain and group\nfrom celery import shared_task\n\n# Define tasks, then compose them\n`,
      testCases: [
        {
          input: 'chain and group composition',
          expectedOutput: 'chain(fetch_data.s() | process_data.s()), group(task.s() for multiple)',
          description: 'Should use chain and group for task composition',
        },
      ],
      solution: `from celery import shared_task, chain, group\n\n\n@shared_task\ndef fetch_data(url):\n    \"\"\"Fetch data from a URL.\"\"\"\n    import requests\n    response = requests.get(url)\n    return response.json()\n\n\n@shared_task\ndef process_data(data):\n    \"\"\"Process the fetched data.\"\"\"\n    return {\"processed\": len(data), \"status\": \"done\"}\n\n\n@shared_task\ndef send_notification(user_id):\n    \"\"\"Send notification to a user.\"\"\"\n    return f\"Notified user {user_id}\"\n\n\n# Chain: fetch_data result flows into process_data\n# .s() creates a \"signature\" (serializable task reference)\nworkflow = chain(\n    fetch_data.s(\"https://api.example.com/data\"),\n    process_data.s(),\n)\nresult = workflow.apply_async()\n\n# Group: run 3 notifications in parallel\nnotifications = group(\n    send_notification.s(1),\n    send_notification.s(2),\n    send_notification.s(3),\n)\ngroup_result = notifications.apply_async()`,
      explanation: 'chain() executes tasks sequentially, passing each result to the next task. The .s() method creates a "signature" -- a serializable reference to a task call that can be sent to the broker. group() executes tasks in parallel across available workers and returns a GroupResult. These primitives let you build complex workflows: chain for pipelines, group for fan-out, and you can even combine them (e.g., chain(fetch.s(), group(process1.s(), process2.s())) for fan-out after fetching).',
      hints: [
        '.s() (signature) creates a serializable task reference -- required for composition',
        'chain passes the return value of each task as the first arg to the next',
        'group runs tasks in parallel and collects results',
      ],
      tags: ['celery', 'chain', 'group', 'task-composition', 'workflow'],
      concepts: ['ce-task-idempotency', 'ce-chord-vs-chain'],
    },
  {
      id: 'dj-celery-adv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_CELERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Process an uploaded image through a 3-stage pipeline using Celery primitives:
  
  1. Resize the image (\`resize_image\`).
  2. After resize completes, run two parallel jobs: extract metadata (\`extract_metadata\`) AND generate a thumbnail (\`make_thumbnail\`).
  3. Once BOTH parallels finish, finalise by writing a single record (\`save_to_db\`).
  
  This is the canonical chain → group → chord pattern. Use \`chain\`, \`group\`, and \`chord\` from \`celery\`. The functions are already defined as \`@shared_task\`s. Wire up a function \`process_image(path)\` that builds the workflow and calls \`.apply_async()\` on it.`,
      starterCode: `from celery import chain, group, chord
from .tasks import resize_image, extract_metadata, make_thumbnail, save_to_db
`,
      testCases: [
        {
          input: 'process_image("/uploads/photo.jpg")',
          expectedOutput: 'chain(resize, chord(group(metadata, thumbnail), save_to_db)) + apply_async',
          description: 'Compose chain + group + chord for a fan-out/fan-in workflow',
        },
      ],
      solution: `from celery import chain, group, chord
from .tasks import resize_image, extract_metadata, make_thumbnail, save_to_db


def process_image(path):
    workflow = chain(
        resize_image.s(path),
        chord(
            group(extract_metadata.s(), make_thumbnail.s()),
            save_to_db.s(),
        ),
    )
    return workflow.apply_async()`,
      explanation: 'Three Celery composition primitives layered: `chain` runs tasks sequentially (each gets the previous result as its first arg); `group` runs tasks in parallel with the same input; `chord` is `group + a finaliser` — the finaliser receives the list of group results as its first arg. `task.s(args)` is the "signature" form (a serialisable description of "call task with these args") — composing tasks always uses signatures, not direct calls. The `chain` here passes `resize_image`\'s result into BOTH `extract_metadata` and `make_thumbnail` (group fan-out), and once both finish, their list of results goes into `save_to_db`.',
      hints: [
        'task.s(args) creates a signature, not a call',
        'chain = sequential, group = parallel, chord = group + callback',
        'chord callback receives list of group results',
        'apply_async() kicks off the whole workflow',
      ],
      tags: ['django', 'celery', 'chain', 'group', 'chord', 'workflow', 'advanced'],
      concepts: ['ce-task-idempotency', 'ce-chord-vs-chain'],
    },
  {
      id: 'dj-celery-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CELERY,
      course: Course.BACKEND,
      question: 'What is Celery and why do you need it in a Django project?\n\nImagine a user clicks "Generate Report" and your server takes 30 seconds to create the PDF. Without Celery, the user stares at a loading spinner for 30 seconds.',
      options: [
        {
          id: 'a',
          text: 'A distributed task queue that runs slow work (emails, reports, uploads) in background workers outside the request/response cycle',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'A Django extension that manages database migrations across multiple servers so schema changes deploy without downtime',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'A JavaScript runtime that compiles Python views to browser code so report generation happens client-side instead of on the server',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'A caching framework that stores rendered pages and query results in memory so repeated requests skip the database entirely',
          isCorrect: false,
        },
      ],
      explanation: 'Celery is a distributed task queue. When your Django view needs to do something slow (send an email, generate a report, process an image, call an external API), instead of making the user wait, you hand the task to Celery. Celery runs the task in a separate worker process while your view immediately returns a response like "Your report is being generated." This keeps your web server responsive.',
      hints: [
        'The key word is "asynchronous" — the task runs outside the HTTP request/response cycle',
        'Common use cases: anything that takes more than a few seconds',
      ],
      tags: ['django', 'celery', 'async', 'task-queue', 'basics'],
      concepts: ['ce-task-idempotency', 'py-async-coroutines'],
    },
  {
      id: 'dj-celery-gap-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CELERY,
      course: Course.BACKEND,
      question: 'What is the relationship between Celery, a message broker, and a worker?\n\nCelery has three components that work together. Understanding their roles is essential before writing any Celery code.',
      options: [
        {
          id: 'a',
          text: 'The broker runs your Django code in a sandbox, Celery stores the task messages in your database, and workers serve the HTTP responses back to users',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'Celery is the worker process, the broker is just another name for the result database, and Django itself acts as the message queue between them',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Django sends task messages to the broker (Redis or RabbitMQ); workers are separate processes that pick them up and execute them while Django keeps serving requests',
          isCorrect: true,
        },
        {
          id: 'd',
          text: 'All three components run as threads inside the Django process, so no separate services are needed — you only install the celery package',
          isCorrect: false,
        },
      ],
      explanation: 'The flow is: (1) Your Django app calls task.delay() which sends a message to the broker. (2) The broker (Redis or RabbitMQ) holds the message in a queue. (3) A Celery worker process (running separately, started with `celery -A myproject worker`) picks up the message and executes the task function. The Django app never waits — it gets back to serving the next request immediately. You need at least three things running: your Django app, the broker (Redis), and the Celery worker.',
      hints: [
        'Think of it like a restaurant: Django is the waiter (takes orders), the broker is the order board, workers are the cooks',
        'Redis and RabbitMQ are the two most common broker choices',
      ],
      tags: ['django', 'celery', 'broker', 'worker', 'redis', 'architecture'],
      concepts: ['ce-task-idempotency'],
    },
];
