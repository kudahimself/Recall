/**
 * Topic.DJ_SIGNALS_MW — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendAdvancedPedagogyQuestions.ts (2), djangoAdvancedFinalQuestions.ts (1), djangoAdvancedQuestions.ts (3), djangoBatchDExpansionQuestions.ts (5), djangoGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_signals_mw_questions: Question[] = [
  {
      id: 'dj-signals-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SIGNALS_MW,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'After saving an Article, fire a Slack notification using a post_save signal handler. Filter to that one model with `sender=`.',
      template: `from django.db.models.signals import ___
from django.dispatch import ___
from .models import Article

@receiver(___, sender=Article)
def notify_slack(sender, instance, created, **kwargs):
    if created:
        send_slack(f"New article: {instance.title}")`,
      blanks: ['post_save', 'receiver', 'post_save'],
      solution: 'from django.db.models.signals import post_save\nfrom django.dispatch import receiver\nfrom .models import Article\n\n@receiver(post_save, sender=Article)\ndef notify_slack(sender, instance, created, **kwargs):\n    if created:\n        send_slack(f"New article: {instance.title}")',
      explanation: '`@receiver(signal, sender=Model)` connects a handler. `post_save` fires after every save — `created=True` only for inserts. Always include `**kwargs` because Django may add fields in future versions. Connect signal handlers in `apps.py`\'s `ready()` to ensure they\'re imported on startup.',
      hints: ['post_save signal', '@receiver decorator', 'created=True for inserts only'],
      tags: ['django', 'signals', 'post_save', 'receiver', 'cloze'],
      concepts: ['dj-signal-vs-override'],
    },
  {
      id: 'dj-middleware-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SIGNALS_MW,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a middleware that logs the request path before the view runs and the status code after.',
      correctOrder: [
        'class LoggingMiddleware:',
        '    def __init__(self, get_response):',
        '        self.get_response = get_response',
        '',
        '    def __call__(self, request):',
        '        log.info(f"{request.method} {request.path}")',
        '        response = self.get_response(request)',
        '        log.info(f"-> {response.status_code}")',
        '        return response',
      ],
      distractorLines: [
        '    def process_request(self, request):',
        '    def process_response(self, request, response):',
        '        return self.get_response()',
        '    def __init__(self):',
      ],
      solution: 'class LoggingMiddleware:\n    def __init__(self, get_response):\n        self.get_response = get_response\n\n    def __call__(self, request):\n        log.info(f"{request.method} {request.path}")\n        response = self.get_response(request)\n        log.info(f"-> {response.status_code}")\n        return response',
      explanation: 'Modern Django middleware is a callable class: `__init__(self, get_response)` is called once per process; `__call__(self, request)` runs per-request. Code before `self.get_response(request)` is "view going in"; code after is "response going out". Old `process_request`/`process_response` style is deprecated.',
      hints: ['__init__ takes get_response', '__call__ is per-request', 'Pre-view code → call get_response → post-view code'],
      tags: ['django', 'middleware', 'parsons'],
      concepts: ['dj-middleware-ordering'],
    },
  {
      id: 'dj-signals-mw-adv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_SIGNALS_MW,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Build a middleware \`RequestContextMiddleware\` that combines three observability primitives:
  
  1. Generate a UUID4 per request and attach it to the request as \`request.correlation_id\`.
  2. Time the request: measure the wall-clock duration of \`get_response(request)\`.
  3. On the way out, inject \`X-Correlation-ID\` and \`X-Response-Time-Ms\` headers on the response (the latter as an integer, milliseconds rounded).
  
  Use the modern callable-class middleware pattern.`,
      starterCode: `import time
import uuid
`,
      testCases: [
        {
          input: 'GET / through the middleware',
          expectedOutput: 'callable class with __init__/__call__, time.perf_counter around get_response, both headers set',
          description: 'Correlation ID + timing + header injection in one middleware',
        },
      ],
      solution: `import time
import uuid


class RequestContextMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.correlation_id = uuid.uuid4().hex
        start = time.perf_counter()
        response = self.get_response(request)
        elapsed_ms = int((time.perf_counter() - start) * 1000)
        response["X-Correlation-ID"] = request.correlation_id
        response["X-Response-Time-Ms"] = str(elapsed_ms)
        return response`,
      explanation: 'Three primitives in one pass: pre-view code attaches state to `request`, the view runs in between, post-view code reads timing and stamps the response. `time.perf_counter()` (not `time.time()`) is monotonic and meant for measuring intervals — `time.time()` can jump backward on NTP adjustments. Response headers must be strings — Django\'s `HttpResponse` rejects non-string values silently in some places. Setting `correlation_id` on `request` makes it readable from views and downstream middleware (logging filters, especially).',
      hints: [
        'Pre-view code → call get_response → post-view code',
        'time.perf_counter is monotonic; time.time can drift',
        'Response header values must be strings',
        'Attaching to request is the canonical way to share per-request state',
      ],
      tags: ['django', 'middleware', 'correlation-id', 'observability', 'advanced'],
      concepts: ['dj-middleware-ordering'],
    },
  {
      id: 'dj-models-adv-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_SIGNALS_MW,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `An \`Order\` model needs a denormalised \`total\` field that's the sum of its \`OrderLine\` rows' \`subtotal\`. Recompute the total on every line save AND every line delete using signals, so reading \`order.total\` never requires aggregating at query time.

  \`OrderLine\` has fields: \`order\` (ForeignKey to Order, on_delete=CASCADE), \`subtotal\` (DecimalField). Use \`Sum\` from django.db.models. The recomputed total should default to 0 when the order has no lines.`,
      starterCode: `from decimal import Decimal
from django.db.models import Sum
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Order, OrderLine
`,
      testCases: [
        {
          input: 'OrderLine.save() and .delete() update Order.total via signals',
          expectedOutput: 'aggregate Sum + .update() + signal handlers for post_save and post_delete',
          description: 'Signal-based denormalisation pattern',
        },
      ],
      solution: `from decimal import Decimal
from django.db.models import Sum
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Order, OrderLine


def _recompute_total(order_id):
    total = OrderLine.objects.filter(order_id=order_id).aggregate(
        s=Sum("subtotal"),
    )["s"] or Decimal("0")
    Order.objects.filter(pk=order_id).update(total=total)


@receiver(post_save, sender=OrderLine)
def line_saved(sender, instance, **kwargs):
    _recompute_total(instance.order_id)


@receiver(post_delete, sender=OrderLine)
def line_deleted(sender, instance, **kwargs):
    _recompute_total(instance.order_id)`,
      explanation: 'The denormalisation pattern: store the rolled-up value, recompute on every change to the source rows. `aggregate(s=Sum(...))` returns `{"s": value}` — `value` is `None` when no rows, hence `or Decimal("0")`. Use `Order.objects.filter(...).update(...)` (queryset update, single SQL) instead of `order.save()` — avoids triggering Order\'s own signals (which could cascade). Both `post_save` AND `post_delete` are needed: deleting a line otherwise leaves the cached total stale. `instance.order_id` (not `.order`) avoids one extra query to hydrate the FK.',
      hints: [
        'aggregate returns dict — extract by key',
        'Sum returns None if no rows — coalesce to 0',
        'queryset.update() avoids triggering parent signals',
        'Both post_save AND post_delete needed',
        'instance.order_id avoids hydrating the FK',
      ],
      tags: ['django', 'signals', 'aggregate', 'denormalisation', 'advanced'],
      concepts: ['dj-signal-vs-override', 'dj-model-construction'],
    },
  {
      id: 'dj-sigmw-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_SIGNALS_MW,
      course: Course.BACKEND,
      question: 'When should you use Django signals vs middleware?',
      options: [
        { id: 'a', text: 'Signals handle HTTP requests while middleware handles database events. Use signals for rate limiting and middleware for sending notification emails on model changes.', isCorrect: false },
        { id: 'b', text: 'They are interchangeable — both can intercept model saves and HTTP requests. Choose based on personal preference.', isCorrect: false },
        { id: 'c', text: 'Middleware is deprecated in favor of signals. Modern Django uses signals for everything including request processing.', isCorrect: false },
        { id: 'd', text: 'Signals are for reacting to model lifecycle events (save, delete, m2m changes) in a decoupled way. Middleware is for processing every HTTP request/response (authentication, CORS headers, logging).', isCorrect: true },
      ],
      explanation: 'Signals and middleware operate at completely different layers. Signals are Django\'s implementation of the observer pattern for model-level events — they fire when models are saved (pre_save, post_save), deleted (pre_delete, post_delete), or when many-to-many relationships change (m2m_changed). They\'re ideal for side effects like sending welcome emails after user creation or updating search indexes after a model changes, because the code sending the signal doesn\'t need to know about the receivers. Middleware operates at the HTTP layer — it wraps every request/response and is perfect for cross-cutting concerns like authentication checks, CORS headers, request logging, or security headers that apply regardless of which view handles the request.',
      hints: [
        'Think about what layer each operates at: HTTP vs ORM',
        'Signals are about model events, middleware is about request/response processing',
      ],
      tags: ['django', 'signals', 'middleware', 'architecture', 'design-patterns'],
      concepts: ['dj-signal-vs-override', 'dj-middleware-ordering'],
    },
  {
      id: 'dj-sigmw-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SIGNALS_MW,
      course: Course.BACKEND,
      question: 'Which description correctly matches common Django signals to their use cases?',
      options: [
        { id: 'a', text: 'pre_save: validate/modify data before DB write. post_save: trigger side effects (emails, cache invalidation) after DB write. pre_delete: cleanup related data. m2m_changed: react to many-to-many relationship adds/removes.', isCorrect: true },
        { id: 'b', text: 'pre_save: runs before the form is rendered. post_save: runs after the HTTP response is sent. pre_delete: prevents deletion by returning False. m2m_changed: fires when a model\'s CharField is modified.', isCorrect: false },
        { id: 'c', text: 'pre_save and post_save both fire after the database write — pre_save just fires first. pre_delete fires after deletion. m2m_changed only works with SQLite.', isCorrect: false },
        { id: 'd', text: 'All four signals are deprecated in Django 4+. Modern Django uses model methods like on_save() and on_delete() instead.', isCorrect: false },
      ],
      explanation: 'pre_save fires before Model.save() hits the database — it\'s your last chance to modify field values (e.g., auto-generating slugs, normalizing data). post_save fires after the row is written to the database, making it safe for side effects that depend on the object having a primary key (sending notifications, creating related objects). The "created" kwarg tells you if it\'s a new instance or an update. pre_delete fires before deletion, useful for cleaning up files or external resources that CASCADE won\'t handle. m2m_changed fires when items are added/removed/cleared from a ManyToManyField via .add(), .remove(), or .clear(). A common gotcha: signal handlers run in the same transaction as the trigger, so a failure in your handler can roll back the original operation.',
      hints: [
        'pre_ signals fire before the database operation, post_ signals fire after',
        'm2m_changed relates to ManyToManyField operations',
      ],
      tags: ['django', 'signals', 'pre-save', 'post-save', 'model-events'],
      concepts: ['dj-signal-vs-override'],
    },
  {
      id: 'py-dj-signal-post-save-profile',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SIGNALS_MW,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Auto-create a `Profile` whenever a `User` is created via the `post_save` signal. Import `post_save`, `receiver`, `settings`, and `Profile`. Define a receiver function `create_profile` that takes `sender`, `instance`, `created`, and `**kwargs`, bound to `post_save` with `settings.AUTH_USER_MODEL` as the sender. Guard on the `created` flag (True on first save, False on updates) and, when True, create a `Profile` whose `user` is the saved instance.',
      starterCode: `# Wire a post_save receiver on settings.AUTH_USER_MODEL
# (create_profile) that, when created is True, creates a Profile
# for the saved user instance.
`,
      testCases: [
        {
          input: 'post_save on User creation',
          expectedOutput: 'Profile auto-created when a new User is saved',
          description: '`created` kwarg distinguishes create vs update',
        },
      ],
      solution: `from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Profile

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)`,
      explanation: 'Classic pattern. `created` is `True` on the first save, `False` on updates — without the check you\'d try to re-create on every User save. IMPORTANT: Signals DON\'T fire for `bulk_create`, `update()`, raw SQL. For data integrity a DB-level default / trigger is stronger. Also: over-use of signals creates invisible action chains (save User → create Profile → signal X → ...) — reach for explicit code first, signals only when the trigger truly is "a model saved".',
      hints: [
        'receiver decorator binds handler to signal',
        '`created` kwarg is True on first save only',
        'Signals NOT fired by bulk_create/update/raw SQL',
      ],
      tags: ['django', 'signals', 'post_save'],
      concepts: ['dj-signal-vs-override'],
    },
  {
      id: 'py-dj-signal-register-ready',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SIGNALS_MW,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Register signals at app-startup time via `AppConfig.ready`. In `blog/apps.py`, define a `BlogConfig` class that subclasses `AppConfig`, with its `name` attribute set to `"blog"` and a `ready` method whose body imports the sibling `signals` module (a `noqa` comment suppresses the unused-import lint). Put the `@receiver` functions in `blog/signals.py`. This guarantees signals load at startup without needing import side-effects elsewhere.',
      starterCode: `# blog/apps.py: define BlogConfig(AppConfig) with name = "blog" and a
# ready() method that imports the sibling signals module.
# blog/signals.py holds the @receiver functions.
`,
      testCases: [
        {
          input: 'AppConfig.ready() registering signals',
          expectedOutput: 'Signals loaded at app startup without import gymnastics',
          description: 'Idiomatic signal registration',
        },
      ],
      solution: `# blog/apps.py
from django.apps import AppConfig

class BlogConfig(AppConfig):
    name = "blog"

    def ready(self):
        from . import signals  # noqa

# blog/signals.py
# @receiver(...) functions go here`,
      explanation: 'Signals only fire if their `@receiver` decorators have been evaluated. Putting them at the top of `models.py` works but couples models to signal logic. Better: separate `signals.py`, imported in `AppConfig.ready()` so Django loads it automatically. `INSTALLED_APPS` must use the `AppConfig` path (`"blog.apps.BlogConfig"`) for `ready()` to run.',
      hints: [
        'Signals must be imported at startup to be active',
        'Separate signals.py keeps models.py clean',
        'INSTALLED_APPS needs the AppConfig path for ready() to run',
      ],
      tags: ['django', 'signals', 'AppConfig', 'ready'],
      concepts: ['dj-signal-vs-override'],
    },
  {
      id: 'py-dj-mw-what',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SIGNALS_MW,
      course: Course.BACKEND,
      question: 'What is Django middleware?',
      options: [
        { id: 'a', text: 'The database driver layer that translates ORM queries into backend-specific SQL before execution', isCorrect: false },
        { id: 'b', text: 'A library of template tags that run before each render to inject shared context variables', isCorrect: false },
        { id: 'c', text: 'A pipeline of callables wrapping every request/response — each layer can modify the request going in and the response going out', isCorrect: true },
        { id: 'd', text: 'Another name for class-based views, since both take a request and return a response object', isCorrect: false },
      ],
      explanation: 'Middleware is a Russian-doll architecture around views. Request flows top-to-bottom through `MIDDLEWARE` list; response flows bottom-to-top. `SecurityMiddleware` adds security headers; `SessionMiddleware` loads session; `AuthenticationMiddleware` sets `request.user`; `CsrfViewMiddleware` validates CSRF tokens; `CommonMiddleware` handles `APPEND_SLASH`. Order matters — session must load before auth so auth can read it.',
      hints: [
        'Request flows down; response flows up',
        'Each MW sees request + response and can modify both',
        'Order in MIDDLEWARE list is critical',
      ],
      tags: ['django', 'middleware', 'basics'],
      concepts: ['dj-middleware-ordering'],
    },
  {
      id: 'py-dj-mw-custom',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SIGNALS_MW,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a custom middleware that adds an `X-Response-Time` header. Define a `TimingMiddleware` class with an `__init__` that accepts and stores the `get_response` callable, plus a `__call__` method that takes a request. In `__call__`, take a high-resolution timestamp with `time.perf_counter`, invoke the stored `get_response` with the request, then set the response header `X-Response-Time` to the elapsed time formatted as milliseconds with one decimal place (for example `"12.3ms"`), and return the response. Add the dotted path `"myapp.middleware.TimingMiddleware"` to `MIDDLEWARE` in settings.',
      starterCode: `# Write TimingMiddleware: __init__(get_response) stores it; __call__
# times get_response(request) with time.perf_counter and sets the
# X-Response-Time header to the elapsed ms (one decimal, e.g. "12.3ms").
# Register "myapp.middleware.TimingMiddleware" in MIDDLEWARE.
`,
      testCases: [
        {
          input: 'custom timing middleware',
          expectedOutput: 'Every response has X-Response-Time header',
          description: 'Callable-class middleware pattern',
        },
      ],
      solution: `import time

class TimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        t0 = time.perf_counter()
        response = self.get_response(request)
        response["X-Response-Time"] = f"{(time.perf_counter() - t0) * 1000:.1f}ms"
        return response`,
      explanation: 'Modern middleware shape: callable class with `__init__(self, get_response)` (run once at app start) and `__call__(self, request)` (run per request — wraps `get_response(request)`). Code before the `get_response` call runs on the way IN; code after runs on the way OUT. For view/template/exception-specific hooks, add `process_view`, `process_template_response`, `process_exception` methods. Keep middleware fast — it runs on EVERY request.',
      hints: [
        '__init__(get_response) runs once; __call__ runs per request',
        'Before get_response = request-side; after = response-side',
        'process_view / process_exception for extra hooks',
      ],
      tags: ['django', 'middleware', 'custom'],
      concepts: ['dj-middleware-ordering'],
    },
  {
      id: 'py-dj-mw-order',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_SIGNALS_MW,
      course: Course.BACKEND,
      question: 'Why is the order of middleware classes in `MIDDLEWARE` important?',
      options: [
        { id: 'a', text: 'It isn\'t — Django inspects each middleware\'s dependencies and sorts the list itself at startup', isCorrect: false },
        { id: 'b', text: 'Each middleware wraps the next — earlier entries see the request first and the response last, so auth must come after session', isCorrect: true },
        { id: 'c', text: 'Order changes only which response headers win when two middleware set the same header value', isCorrect: false },
        { id: 'd', text: 'Middleware run concurrently in separate threads; list order merely sets their thread priority', isCorrect: false },
      ],
      explanation: 'Think of middleware as nested layers of a Russian doll. `[A, B, C]` → request enters A, then B, then C, then the view; response returns C, then B, then A. If B depends on A\'s work (e.g. auth needs session), A must be ABOVE B. `SecurityMiddleware` typically goes first so its checks apply to everything; `CsrfViewMiddleware` must run before any view-calling middleware. Misordering breaks behaviour silently. The default `MIDDLEWARE` in `startproject` is correctly ordered — don\'t shuffle it without understanding why.',
      hints: [
        'Earlier entry sees request first, response last',
        'SessionMiddleware before AuthenticationMiddleware',
        'SecurityMiddleware first; CsrfViewMiddleware before view-layer',
      ],
      tags: ['django', 'middleware', 'order'],
      concepts: ['dj-middleware-ordering'],
    },
  {
      id: 'dj-signals-mw-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SIGNALS_MW,
      course: Course.BACKEND,
      question: 'What is Django middleware?\n\nEvery HTTP request your Django app receives passes through middleware before reaching a view, and every response passes through middleware again on the way out.',
      options: [
        {
          id: 'a',
          text: 'A database abstraction layer that sits between your models and the engine, translating ORM calls into SQL',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'The URL routing system that matches each incoming request\'s path and dispatches it to the correct view function',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Code that runs on EVERY request and response, before and after the view — used for authentication, CORS, logging, and security headers',
          isCorrect: true,
        },
        {
          id: 'd',
          text: 'A template preprocessing step that injects shared context variables into every template before rendering HTML',
          isCorrect: false,
        },
      ],
      explanation: 'Middleware is a framework of hooks that process requests and responses globally. The MIDDLEWARE setting in settings.py lists middleware classes in order. Each request passes through them top-to-bottom on the way in, hits the view, then passes through them bottom-to-top on the way out. Built-in examples: SecurityMiddleware (HTTPS redirects), SessionMiddleware (session handling), AuthenticationMiddleware (attaches request.user), CsrfViewMiddleware (CSRF protection).',
      hints: [
        'Think of middleware as layers of an onion — the request goes in through each layer, and the response comes back out through each layer',
        'The order of middleware in settings.py MATTERS',
      ],
      tags: ['django', 'middleware', 'request-response', 'pipeline', 'basics'],
      concepts: ['dj-middleware-ordering'],
    },
  {
      id: 'dj-signals-mw-gap-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SIGNALS_MW,
      course: Course.BACKEND,
      question: 'What are Django signals?\n\nSometimes, different parts of your application need to know when something happens. For example, when a new User is created, you want to automatically create a Profile for them.',
      options: [
        {
          id: 'a',
          text: 'A notification system where parts of your app get notified when something happens elsewhere — e.g. post_save fires after a model saves',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'WebSocket messages pushed from the server to the browser so connected clients receive real-time updates',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Error notifications that Django sends to the logging system whenever a view raises an unhandled exception',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'The HTTP status codes that views attach to responses to signal success or failure to the client',
          isCorrect: false,
        },
      ],
      explanation: 'Django signals allow decoupled applications to get notified when certain actions occur. The most common signals are: pre_save (before model.save()), post_save (after model.save()), pre_delete (before deletion), post_delete (after deletion), and request_started/request_finished (HTTP lifecycle). You connect a receiver function to a signal, and Django calls it automatically. This keeps your code decoupled — the User model does not need to know about the Profile model.',
      hints: [
        'Signals are the observer pattern — senders emit signals, receivers listen for them',
        'post_save is the most commonly used signal',
      ],
      tags: ['django', 'signals', 'post-save', 'pre-save', 'observer-pattern'],
      concepts: ['dj-signal-vs-override'],
    },
];
