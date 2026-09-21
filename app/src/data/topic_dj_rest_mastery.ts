/**
 * Topic.DJ_REST_MASTERY — spiral "deep revisit" of Django REST Framework.
 * Cross-cutting API-design mastery: the request pipeline (authn → perm → throttle →
 * serialize → render), serializer performance (N+1), and REST correctness (status
 * codes, idempotency, PUT vs PATCH, versioning). MCQ-led per the spiral-topic rule.
 *
 * Lane discipline: pagination depth + generic-view CRUD → DJ_PAGINATION_GENERICS;
 * OpenAPI/drf-spectacular → DJ_API_DOCS; JWT/auth-model internals → DJ_AUTH(_MASTERY).
 * Authored against DJ_REST_MASTERY_ANALYSIS.md.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_rest_mastery_questions: Question[] = [
  {
    id: 'dj-rest-mastery-idempotency-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST_MASTERY,
    course: Course.BACKEND,
    question: 'Which HTTP methods are "safe" and/or "idempotent", and why does the distinction matter for an API client?',
    options: [
      { id: 'a', text: 'GET/HEAD/OPTIONS are safe and idempotent; PUT and DELETE are idempotent but not safe; POST is neither — so a proxy may retry GET/PUT/DELETE but must not blindly retry POST', isCorrect: true },
      { id: 'b', text: 'Every REST method is idempotent by definition, which is exactly why a load balancer may safely replay any request after a network timeout', isCorrect: false },
      { id: 'c', text: 'Only GET is idempotent; PUT and DELETE produce a new resource version on each call, so repeating either of them is inherently unsafe', isCorrect: false },
      { id: 'd', text: 'Idempotency is a per-model database property you configure in Meta; it has nothing to do with which HTTP method the client picks', isCorrect: false },
    ],
    explanation: 'Safe = no state change (GET/HEAD/OPTIONS). Idempotent = repeating yields the same end state (GET, PUT, DELETE — deleting twice still ends "deleted"). POST is neither: two POSTs create two rows. This drives retry policy: infrastructure may retry idempotent methods after a timeout, but a retried POST risks a duplicate, which is why "create" endpoints often need an idempotency key.',
    hints: ['Safe = no change; idempotent = same end state on repeat', 'POST is neither — retries can duplicate', 'PUT/DELETE are idempotent but still change state'],
    tags: ['django', 'drf', 'rest-semantics', 'idempotency'],
    concepts: ['dj-view-patterns'],
  },
  {
    id: 'dj-rest-mastery-status-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST_MASTERY,
    course: Course.BACKEND,
    question: 'For a standard DRF `ModelViewSet`, which default HTTP status codes does each operation return?',
    options: [
      { id: 'a', text: '201 on create, 200 on list/retrieve/update, 204 on destroy; validation failure → 400, unauthenticated → 401, forbidden → 403, missing object → 404', isCorrect: true },
      { id: 'b', text: '200 OK for every successful method including create and delete; DRF reserves 201 and 204 only for file downloads and streaming responses', isCorrect: false },
      { id: 'c', text: '201 Created for both POST and PUT, and 202 Accepted for DELETE, because deletions are queued and processed asynchronously by default', isCorrect: false },
      { id: 'd', text: 'A failed validation returns 422 Unprocessable Entity and a missing object returns 400 Bad Request; DRF does not use 404 for detail routes', isCorrect: false },
    ],
    explanation: 'Returning the right code is part of a correct REST API. DRF defaults: create → 201 (with the new representation), retrieve/list/update → 200, destroy → 204 (empty body). Errors: invalid payload → 400, no/!invalid credentials → 401, authenticated-but-not-allowed → 403, no such object → 404. DRF uses 400 (not 422) for validation by default. Overriding a code usually means returning `Response(data, status=...)` explicitly.',
    hints: ['create 201, destroy 204, the rest 200', '401 = who are you; 403 = not allowed', 'DRF uses 400 for validation, not 422'],
    tags: ['django', 'drf', 'status-codes', 'rest-semantics'],
    concepts: ['dj-view-patterns'],
  },
  {
    id: 'dj-rest-mastery-putpatch-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST_MASTERY,
    course: Course.BACKEND,
    question: 'On a DRF detail route, how do PUT and PATCH differ in how the serializer treats the payload?',
    options: [
      { id: 'a', text: 'PUT is a full replace — the serializer runs without partial, so omitted writable fields fall back to defaults or raise "required" errors; PATCH runs with `partial=True`, updating only the fields supplied', isCorrect: true },
      { id: 'b', text: 'PUT updates only the fields present in the request body, while PATCH demands that every writable field be re-sent in full on each call', isCorrect: false },
      { id: 'c', text: 'PUT and PATCH are identical in DRF; the router maps both verbs to the same `partial_update` handler with `partial=True` set', isCorrect: false },
      { id: 'd', text: 'PUT creates the object when the pk is absent, while PATCH always returns 404 whenever the target row does not already exist', isCorrect: false },
    ],
    explanation: 'PUT → `update` with `partial=False`: the body is treated as the full new representation, so a missing required field is an error (or resets to default). PATCH → `partial_update` with `partial=True`: only provided fields are validated/applied. Choosing PUT when you mean "tweak one field" silently blanks the others — a common bug. DRF wires both automatically in `ModelViewSet`/`UpdateModelMixin`.',
    hints: ['PUT = full replace (partial=False)', 'PATCH = partial=True, only sent fields', 'PUT with one field can blank the rest'],
    tags: ['django', 'drf', 'put-vs-patch', 'rest-semantics'],
    concepts: ['dj-view-patterns'],
  },
  {
    id: 'dj-rest-mastery-save-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST_MASTERY,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'A serializer is bound to an existing instance AND given data. What does this print?',
    code: `class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ["id", "title"]

article = Article.objects.create(title="Old")   # pk=3
s = ArticleSerializer(article, data={"title": "New"})
s.is_valid()
s.save()
print(article.title)
print(Article.objects.count())`,
    expectedOutput: `New
1`,
    explanation: '`serializer.save()` dispatches on whether an instance was passed at construction: instance present → it calls `update()` (in-place), instance absent → `create()` (new row). Here the article is passed, so `save()` updates it to "New" — no second row is created, so the count stays 1. Forgetting the instance argument is the classic "PATCH created a duplicate" bug.',
    hints: ['Instance + data → update(), not create()', 'No new row is inserted', 'save() picks create vs update by the instance arg'],
    tags: ['django', 'drf', 'serializer-save', 'predict'],
    concepts: ['dj-serializer-validation'],
  },
  {
    id: 'dj-rest-mastery-authclasses-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST_MASTERY,
    course: Course.BACKEND,
    question: 'How do `SessionAuthentication`, `TokenAuthentication`, and JWT differ as DRF authentication choices, and which one needs CSRF protection?',
    options: [
      { id: 'a', text: 'SessionAuthentication reuses Django\'s session cookie (so it needs CSRF on unsafe methods); Token and JWT send a credential in the Authorization header (no cookie → no CSRF), and JWT is self-contained where DRF\'s token is a DB row', isCorrect: true },
      { id: 'b', text: 'All three carry the credential in a cookie, so all three require a CSRF token on any POST, PUT, PATCH, or DELETE request to the API', isCorrect: false },
      { id: 'c', text: 'TokenAuthentication is stateless and stores nothing server-side, while JWT persists every issued token in a database table that must be queried per request', isCorrect: false },
      { id: 'd', text: 'Only SessionAuthentication can identify a user; Token and JWT auth must be combined with it before `request.user` is populated at all', isCorrect: false },
    ],
    explanation: 'Cookie-based session auth is vulnerable to CSRF (the browser attaches the cookie automatically), so DRF\'s `SessionAuthentication` enforces CSRF on unsafe methods. Header-based schemes (`Authorization: Token ...` or `Bearer <jwt>`) are immune because an attacker\'s site cannot set that header. DRF\'s `TokenAuthentication` looks up a DB-stored token (revocable, one query); a JWT is a signed, self-contained claim set (stateless, no lookup — but revocation is harder). Configure via `DEFAULT_AUTHENTICATION_CLASSES`.',
    hints: ['Cookie auth → CSRF; header auth → none', 'DRF token = DB row (revocable); JWT = stateless signed claims', 'DEFAULT_AUTHENTICATION_CLASSES sets the chain'],
    tags: ['django', 'drf', 'authentication', 'csrf'],
    concepts: ['dj-auth-token-vs-session', 'dj-permission-class'],
  },
  {
    id: 'dj-rest-mastery-lifecycle-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST_MASTERY,
    course: Course.BACKEND,
    question: 'For each incoming DRF request, in what order does the framework run authentication, permission checks, and throttling before the view handler?',
    options: [
      { id: 'a', text: 'Authentication first (it resolves `request.user`), then permission checks, then throttling — all before the handler; failing an earlier stage short-circuits with 401/403/429', isCorrect: true },
      { id: 'b', text: 'Throttling runs first because it is cheapest, then permissions, and authentication runs last and only if the view body actually reads `request.user`', isCorrect: false },
      { id: 'c', text: 'Permissions run first to drop anonymous callers, then authentication resolves the user, and throttling counts the call only after the view returns', isCorrect: false },
      { id: 'd', text: 'All three execute after the view returns, as response-phase middleware, so the handler body always runs at least once per request', isCorrect: false },
    ],
    explanation: 'DRF\'s `initial()` runs `perform_authentication` → `check_permissions` → `check_throttles` before dispatching to the handler. The order matters: permissions and per-user throttles depend on `request.user`, which authentication must set first. Each stage can short-circuit (401 unauthenticated, 403 forbidden, 429 throttled) so the view body never runs on failure.',
    hints: ['authn → permissions → throttle → handler', 'permissions/throttles need request.user set first', 'any stage can short-circuit before the view'],
    tags: ['django', 'drf', 'request-lifecycle'],
    concepts: ['dj-view-patterns', 'dj-permission-class'],
  },
  {
    id: 'dj-rest-mastery-negotiation-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST_MASTERY,
    course: Course.BACKEND,
    question: 'One client sends `Accept: application/json` and another opens the URL in a browser. How does DRF decide the response format?',
    options: [
      { id: 'a', text: 'Content negotiation selects a renderer from `DEFAULT_RENDERER_CLASSES` by matching the `Accept` header (or a `?format=`/URL suffix); parsers do the same for request bodies by `Content-Type`', isCorrect: true },
      { id: 'b', text: 'DRF always emits JSON; the browsable API is a separate Django app you must mount under its own URL prefix to ever see HTML', isCorrect: false },
      { id: 'c', text: 'The serializer\'s `Meta.format` attribute pins one output media type per model, so the inbound `Accept` header is ignored completely', isCorrect: false },
      { id: 'd', text: 'The router inspects only the URL file extension; a single endpoint can therefore never serve more than one media type to clients', isCorrect: false },
    ],
    explanation: 'DRF picks a renderer per request by matching the `Accept` header against `DEFAULT_RENDERER_CLASSES` (commonly `JSONRenderer` + `BrowsableAPIRenderer`), so a browser (`Accept: text/html`) gets the browsable UI while an API client gets JSON — same view, same code. `?format=json` or a `.json` suffix overrides the header. The mirror image, parsers, decode the request body by `Content-Type` (JSON, form, multipart).',
    hints: ['Renderers chosen by Accept header / ?format', 'Parsers chosen by Content-Type', 'Browsable API is just another renderer'],
    tags: ['django', 'drf', 'content-negotiation', 'renderers'],
    concepts: ['dj-view-patterns'],
  },
  {
    id: 'dj-rest-mastery-hyperlinked-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST_MASTERY,
    course: Course.BACKEND,
    question: 'A `HyperlinkedModelSerializer` raises an assertion about a missing `request` when instantiated inside a plain `APIView`. Why — and what fixes it?',
    options: [
      { id: 'a', text: 'Hyperlinked fields build absolute URLs and need `request` in the serializer context; generic views supply it automatically, but a hand-instantiated serializer must be passed `context={"request": request}`', isCorrect: true },
      { id: 'b', text: 'Hyperlinked serializers only work behind a `DefaultRouter`; they cannot be used with `path()` entries in a URLConf under any circumstances', isCorrect: false },
      { id: 'c', text: 'The model is missing a `get_absolute_url` method, which every hyperlinked serializer calls internally to render the value of its `url` field', isCorrect: false },
      { id: 'd', text: 'Hyperlinked relation fields are write-only by default, so they error unless the inbound request body already includes a fully-qualified URL', isCorrect: false },
    ],
    explanation: 'To turn a relation into an absolute URL (`http://host/articles/3/`), the field needs the request to know the scheme/host — DRF reads it from `self.context["request"]`. Generic views/viewsets populate the context via `get_serializer_context()`, so it "just works" there. In a bare `APIView` you build the serializer yourself, so you must pass `context={"request": request}` or hit the assertion. (Option (a) is the correct explanation.)',
    hints: ['Absolute URLs need request → from context', 'Generic views pass it; manual instantiation does not', 'Fix: context={"request": request}'],
    tags: ['django', 'drf', 'hyperlinked-serializer', 'serializer-context'],
    concepts: ['dj-serializer-validation'],
  },
  {
    id: 'dj-rest-mastery-nplus1-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST_MASTERY,
    course: Course.BACKEND,
    question: 'A list endpoint serializes each `Article` with a nested `author` (a forward FK). Response time grows linearly with the page size. What is the correct fix?',
    options: [
      { id: 'a', text: 'Override `get_queryset` to `select_related("author")` so the author joins in a single query instead of one extra query per row', isCorrect: true },
      { id: 'b', text: 'Switch the nested author to a `SerializerMethodField`, since method fields are cached and therefore fetch the author only once per request', isCorrect: false },
      { id: 'c', text: 'Set `pagination_class = None` so DRF loads the entire table in one query rather than issuing a separate query for every page', isCorrect: false },
      { id: 'd', text: 'Mark the author field `read_only=True`; read-only relations skip the database and read their value straight from the serializer cache', isCorrect: false },
    ],
    explanation: 'This is the serializer N+1: 1 query for the article page + 1 lazy query per row to load `article.author`. For a forward FK / one-to-one, `select_related("author")` pulls it in via a SQL JOIN (1 query total); for reverse FK / M2M you use `prefetch_related`. A `SerializerMethodField` would make it *worse* (still one query each, plus Python overhead). Disabling pagination or toggling `read_only` does nothing about the per-row queries.',
    hints: ['N+1 = 1 list query + 1 per row', 'Forward FK → select_related; reverse/M2M → prefetch_related', 'Do the optimization in get_queryset'],
    tags: ['django', 'drf', 'n-plus-one', 'performance'],
    concepts: ['dj-orm-query-construction'],
  },
  {
    id: 'dj-rest-mastery-nplus1-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DJ_REST_MASTERY,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'With DEBUG=True and no query optimization, how many queries does serializing this list take?',
    code: `# settings.DEBUG = True
# Article.author is a FK, rendered by a nested AuthorSerializer.
# Exactly 3 articles exist, each by a different author. No select_related.
from django.db import connection, reset_queries

reset_queries()
serializer = ArticleSerializer(Article.objects.all(), many=True)
_ = serializer.data
print(len(connection.queries))`,
    expectedOutput: `4`,
    explanation: 'One query fetches the 3 articles; then rendering each row\'s nested `author` triggers one lazy FK query per article (3 more). 1 + 3 = 4 — the N+1 pattern with N=3. Adding `Article.objects.select_related("author")` collapses it to a single JOIN query (the print would then read 1).',
    hints: ['1 query for the list + 1 per row for the FK', 'N+1 with N=3 → 4', 'select_related would make it 1'],
    tags: ['django', 'drf', 'n-plus-one', 'predict'],
    concepts: ['dj-orm-query-construction'],
  },
  {
    id: 'dj-rest-mastery-throttle-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DJ_REST_MASTERY,
    course: Course.BACKEND,
    question: 'You need a strict per-endpoint limit on an expensive "export" action on top of generous global per-user limits. Which throttling approach fits, and where do the counts live?',
    options: [
      { id: 'a', text: 'Give the action a `throttle_scope` and use `ScopedRateThrottle` with that scope\'s own rate in `DEFAULT_THROTTLE_RATES`, alongside the global Anon/User throttles; counters are kept in the cache backend', isCorrect: true },
      { id: 'b', text: 'Subclass `UserRateThrottle` once and hard-code two different rates inside its `allow_request`; the per-client counts are stored in the user\'s session', isCorrect: false },
      { id: 'c', text: 'Configure a second `PAGE_SIZE` for the export view, since DRF derives each endpoint\'s throttle ceiling directly from its configured page size', isCorrect: false },
      { id: 'd', text: 'Apply `@throttle_classes([])` to the export action to opt it out entirely, because expensive endpoints must never be rate-limited or they time out', isCorrect: false },
    ],
    explanation: '`ScopedRateThrottle` reads a per-view `throttle_scope` string and matches it to a rate in `DEFAULT_THROTTLE_RATES` (e.g. `{"exports": "5/day", "user": "1000/day"}`), letting one endpoint carry a tighter limit while the global `UserRateThrottle` still applies. Throttle state (timestamps per key) is stored in Django\'s cache — so a shared cache (Redis/Memcached) is required for it to work across multiple processes. Throttling protects expensive endpoints; opting them out is the opposite of what you want.',
    hints: ['ScopedRateThrottle + throttle_scope per view', 'Rates live in DEFAULT_THROTTLE_RATES by scope', 'State is in the cache — use a shared backend in prod'],
    tags: ['django', 'drf', 'throttling', 'scoped-throttle'],
    concepts: ['dj-permission-class'],
  },
  {
    id: 'dj-rest-mastery-versioning-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DJ_REST_MASTERY,
    course: Course.BACKEND,
    question: 'You must ship a breaking change to a public API without breaking existing clients. How do DRF\'s versioning schemes compare?',
    options: [
      { id: 'a', text: '`URLPathVersioning` puts the version in the path (`/v1/`, `/v2/` — visible, easy to cache and route); `AcceptHeaderVersioning` keeps one URL and selects via the `Accept` header; set one with `DEFAULT_VERSIONING_CLASS` and branch on `request.version`', isCorrect: true },
      { id: 'b', text: 'DRF has no built-in versioning, so you must deploy two entirely separate Django projects behind a proxy that routes requests by their URL prefix', isCorrect: false },
      { id: 'c', text: 'Versioning only adds a `version` field to each response body; the very same serializers and views are still required to serve every client unchanged', isCorrect: false },
      { id: 'd', text: '`AcceptHeaderVersioning` rejects any client that omits the version header, so it can never be retrofitted onto an API that is already deployed', isCorrect: false },
    ],
    explanation: 'DRF resolves a version per request and exposes it as `request.version`, which you branch on to pick a serializer or alter behaviour. `URLPathVersioning` (`/api/v2/articles/`) is explicit and cache/proxy-friendly but clutters URLs; `AcceptHeaderVersioning` (`Accept: application/json; version=2`) keeps clean URLs but is harder to test and discover. `NamespaceVersioning` uses URLconf namespaces. A `DEFAULT_VERSION`/`ALLOWED_VERSIONS` config lets header-less clients fall back, so versioning can be added without breaking old callers.',
    hints: ['request.version drives serializer/behaviour choice', 'URL path = visible/cacheable; Accept header = clean URLs', 'DEFAULT_VERSION gives a fallback for old clients'],
    tags: ['django', 'drf', 'versioning', 'api-design'],
    concepts: ['dj-view-patterns'],
  },
  {
    id: 'dj-rest-mastery-exception-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DJ_REST_MASTERY,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Wrap DRF\'s standard error response in a uniform envelope by delegating to the built-in handler first.',
    template: `from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    response = ___(exc, context)
    if response is not None:
        response.data = {"error": response.___}
    return response`,
    blanks: ['exception_handler', 'data'],
    solution: 'from rest_framework.views import exception_handler\n\ndef custom_exception_handler(exc, context):\n    response = exception_handler(exc, context)\n    if response is not None:\n        response.data = {"error": response.data}\n    return response',
    explanation: 'Always delegate to DRF\'s built-in `exception_handler` first — it produces the standard response (correct status + `detail`) for handled exceptions and returns `None` for ones it does not handle (which become a 500). Reshape `response.data` only when a response exists, so unhandled errors keep their default behaviour.',
    hints: ['Call the built-in handler before reshaping', 'It returns None for unhandled exceptions — leave those alone', 'The payload lives on response.data'],
    tags: ['django', 'drf', 'exception-handler', 'cloze'],
    concepts: ['dj-view-patterns'],
  },
  {
    id: 'dj-rest-mastery-exception-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DJ_REST_MASTERY,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Write a custom DRF exception handler that wraps every handled error response in a uniform envelope `{"error": <original detail>, "status_code": <code>}`. Delegate to DRF\'s built-in handler first, reshape its response only when one was produced (leave the unhandled case — where it returns None — untouched), and show the settings key that registers the handler.',
    starterCode: `from rest_framework.views import exception_handler
`,
    testCases: [
      { input: 'handled APIException → enveloped response; unhandled → None passthrough', expectedOutput: 'delegate to exception_handler, reshape response.data when not None, register via EXCEPTION_HANDLER', description: 'Uniform error envelope via custom handler' },
    ],
    solution: `# handlers.py
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        response.data = {
            "error": response.data,
            "status_code": response.status_code,
        }
    return response


# settings.py
REST_FRAMEWORK = {
    "EXCEPTION_HANDLER": "myapp.handlers.custom_exception_handler",
}`,
    explanation: 'DRF routes any `APIException` (plus `Http404`/`PermissionDenied`) through the configured `EXCEPTION_HANDLER`. Calling the built-in handler first yields the standard `Response` (status + `detail`); it returns `None` for exceptions DRF does not handle (e.g. a raw `KeyError`), which must bubble up as a 500 — so guard on `response is not None` before reshaping. Registering the dotted path in `REST_FRAMEWORK["EXCEPTION_HANDLER"]` makes it apply API-wide, giving every client one consistent error shape.',
    hints: ['Delegate to the built-in handler, then reshape', 'Guard: response is not None (None → unhandled 500)', 'Register via REST_FRAMEWORK["EXCEPTION_HANDLER"] dotted path'],
    tieredHints: {
      apiSignature: 'exception_handler(exc, context) -> Response; REST_FRAMEWORK = {\'EXCEPTION_HANDLER\': ...}',
      skeleton: '# handlers.py\nfrom rest_framework.views import ____\n\n\ndef custom_exception_handler(exc, context):\n    response = ____(exc, context)\n    if response is not None:\n        response.data = {\n            "error": response.data,\n            "status_code": response.status_code,\n        }\n    return response\n\n\n# settings.py\nREST_FRAMEWORK = {\n    "____": "myapp.handlers.custom_exception_handler",\n}',
    },
    tags: ['django', 'drf', 'exception-handler', 'error-handling'],
    concepts: ['dj-view-patterns'],
  },
];
