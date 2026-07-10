import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

// Views Mastery (deep revisit) — cross-cutting view-layer mastery: the CBV dispatch
// lifecycle, decorator<->mixin (method_decorator), response-type/HTTP-semantics
// decisions, streaming, PRG/idempotency, error->status mapping, and view-level caching.
// Stays out of the Auth / Forms / Middleware / DRF lanes — every item is about the
// request -> view -> response layer itself.
export const dj_views_mastery_questions: Question[] = [
// --- CBV dispatch lifecycle ---
{
      id: 'dj-views-mastery-dispatch-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS_MASTERY,
      course: Course.BACKEND,
      question: 'In a Django class-based view, a GET request passes through several methods before your `get()` runs. What is the order, and where do you put logic that must run for every verb?',
      options: [
        { id: 'a', text: '`as_view()` returns a function that, per request, instantiates the view, calls `setup()` then `dispatch()`, which routes to `get()`/`post()`; put cross-verb logic in `dispatch()`', isCorrect: true },
        { id: 'b', text: '`as_view()` calls `get()` directly, which then calls `dispatch()` afterwards to finalize the response; put cross-verb logic in `setup()`', isCorrect: false },
        { id: 'c', text: 'The URL resolver calls `dispatch()` first and `as_view()` instantiates the view afterwards; put cross-verb logic in `render_to_response()`', isCorrect: false },
        { id: 'd', text: 'Each request calls `get()` and `post()` in sequence and you return from whichever applies; put cross-verb logic in `__init__()`', isCorrect: false },
      ],
      explanation: '`as_view()` returns a closure. Per request it instantiates the class, runs `setup()` (attaches `self.request`, `args`, `kwargs`), then `dispatch()`. `dispatch()` looks at `request.method` and calls the same-named handler (`get`, `post`, …) or `http_method_not_allowed`. Logic that must run regardless of verb (timing, auth checks, feature flags) belongs in an overridden `dispatch()` — `__init__` runs too early (no request yet) and `render_to_response` runs too late (after the handler).',
      hints: [
        'as_view() → per-request instance → setup() → dispatch() → get()/post()',
        'dispatch() routes on request.method',
        'Override dispatch() for cross-verb logic',
      ],
      tags: ['django', 'views', 'CBV', 'dispatch', 'lifecycle', 'as_view'],
      concepts: ['dj-view-patterns', 'py-mro-resolution'],
    },
{
      id: 'dj-views-mastery-dispatch-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_VIEWS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'A GET request hits this view. What is printed, and what status is returned?',
      code: `from django.http import HttpResponse
from django.views import View

class TimedView(View):
    def dispatch(self, request, *args, **kwargs):
        print("before")
        response = super().dispatch(request, *args, **kwargs)
        print("after")
        return response

    def get(self, request):
        print("handling get")
        return HttpResponse("ok")

response = TimedView.as_view()(get_request)   # get_request.method == "GET"
print(response.status_code)`,
      expectedOutput: `before
handling get
after
200`,
      explanation: '`dispatch()` prints "before", then `super().dispatch()` routes the GET to `get()` ("handling get"), which returns a 200. Control unwinds back into the override, printing "after", and the 200 response is returned. Wrapping `super().dispatch()` is exactly how a timing/logging mixin brackets the whole handler.',
      hints: ['dispatch wraps the handler call', 'super().dispatch routes GET to get()'],
      tags: ['django', 'views', 'CBV', 'dispatch', 'predict'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-mastery-methodnotallowed-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_VIEWS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'A GET request hits this CBV, which only implements POST and restricts its verbs. What status does the client see?',
      code: `from django.http import HttpResponse
from django.views import View

class OnlyPost(View):
    http_method_names = ["post"]

    def post(self, request):
        return HttpResponse("created")

response = OnlyPost.as_view()(get_request)   # get_request.method == "GET"
print(response.status_code)`,
      expectedOutput: `405`,
      explanation: '`dispatch()` checks the verb against `http_method_names` *before* dispatching. "get" is not in the list, so it calls `http_method_not_allowed()`, which returns `HttpResponseNotAllowed` — status **405**, with an `Allow: POST` header. The absence of a `get()` method is moot: the verb is rejected at the gate.',
      hints: ['http_method_names is checked in dispatch()', 'Disallowed verb → 405'],
      tags: ['django', 'views', 'CBV', 'http_method_names', '405', 'predict'],
      concepts: ['dj-view-patterns'],
    },
// --- decorator <-> mixin / method_decorator ---
{
      id: 'dj-views-mastery-decorator-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS_MASTERY,
      course: Course.BACKEND,
      question: 'You have a function-based-view decorator you want to apply to a whole class-based view. Why can\'t you just put `@my_decorator` above the class, and what is the right approach?',
      options: [
        { id: 'a', text: 'A class is not the `(request) -> response` callable the decorator expects; wrap a method with `method_decorator`, e.g. `@method_decorator(my_decorator, name="dispatch")` on the class', isCorrect: true },
        { id: 'b', text: 'You actually can stack `@my_decorator` directly on the class; Django rewrites it into an equivalent mixin automatically at import time', isCorrect: false },
        { id: 'c', text: 'Decorators only work on `get()`, so move the logic into `get()` and decorate that method instead; `dispatch` itself cannot be decorated', isCorrect: false },
        { id: 'd', text: 'Class decorators must be registered in settings under `VIEW_DECORATORS`; once listed there, `@my_decorator` applies to every CBV', isCorrect: false },
      ],
      explanation: 'A view decorator expects a function taking `request` and returning a response. A class does not match that shape, so decorating the class directly breaks. `method_decorator` adapts a function decorator to wrap a *method*; applying it to `dispatch` (via `@method_decorator(my_decorator, name="dispatch")` on the class, or `@method_decorator(my_decorator)` directly above an overridden `dispatch`) makes it run for every verb. There is no automatic class-to-mixin rewrite and no `VIEW_DECORATORS` setting.',
      hints: [
        'A class is not a (request)->response callable',
        'method_decorator adapts a function decorator for a method',
        'name="dispatch" applies it to every verb',
      ],
      tags: ['django', 'views', 'CBV', 'method_decorator', 'decorator'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-mastery-decorator-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_VIEWS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Apply a function decorator (`cache_page`) to an entire CBV by wrapping its dispatch entry point. Fill the adapter helper.',
      template: `from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.generic import ListView

@___(cache_page(60), name="dispatch")
class ArticleListView(ListView):
    model = Article`,
      blanks: ['method_decorator'],
      solution: 'from django.utils.decorators import method_decorator\nfrom django.views.decorators.cache import cache_page\nfrom django.views.generic import ListView\n\n@method_decorator(cache_page(60), name="dispatch")\nclass ArticleListView(ListView):\n    model = Article',
      explanation: '`method_decorator(decorator, name="dispatch")` adapts the function decorator `cache_page(60)` so it wraps the view\'s `dispatch` method — caching every request the view handles.',
      hints: ['The helper that adapts a function decorator for a method', 'name="dispatch" targets every verb'],
      tags: ['django', 'views', 'CBV', 'method_decorator', 'cache_page', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-mastery-decorator-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_VIEWS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'You have a class-based `ReportView` (a subclass of Django\'s template-rendering generic view, template `"report.html"`). Apply view-level caching of 5 minutes (300 seconds) to the whole view by decorating its request-dispatch entry point with the cache decorator, using the helper that adapts a function decorator for use on a class. Show the class with the decorator applied.',
      starterCode: `from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.generic import TemplateView
`,
      testCases: [
        {
          input: 'GET /report/ twice within 5 minutes',
          expectedOutput: 'method_decorator(cache_page(300), name="dispatch") on ReportView(TemplateView)',
          description: 'function decorator adapted onto a CBV dispatch',
        },
      ],
      solution: `from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.generic import TemplateView

@method_decorator(cache_page(300), name="dispatch")
class ReportView(TemplateView):
    template_name = "report.html"`,
      explanation: '`cache_page` is a function-view decorator, so it cannot wrap a class directly. `method_decorator(cache_page(300), name="dispatch")` adapts it to wrap `dispatch`, caching the rendered response for 300 seconds across all verbs the view handles.',
      hints: [
        'cache_page(300) is the function decorator',
        'method_decorator(..., name="dispatch") adapts it for the class',
      ],
      tags: ['django', 'views', 'CBV', 'method_decorator', 'cache_page', 'advanced'],
      concepts: ['dj-view-patterns'],
    },
// --- response-type & HTTP-semantics decisions ---
{
      id: 'dj-views-mastery-response-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS_MASTERY,
      course: Course.BACKEND,
      question: 'Match each scenario to the right response: (1) a page that has permanently moved, (2) returning a top-level JSON array, (3) streaming a multi-GB CSV export.',
      options: [
        { id: 'a', text: '(1) `redirect(..., permanent=True)` / `HttpResponsePermanentRedirect` (301); (2) `JsonResponse(data, safe=False)`; (3) `StreamingHttpResponse`', isCorrect: true },
        { id: 'b', text: '(1) `HttpResponseRedirect` (302); (2) `JsonResponse(data)` with the default `safe=True`; (3) a normal `HttpResponse` holding the whole body', isCorrect: false },
        { id: 'c', text: '(1) `redirect()` (302); (2) `JsonResponse(data, safe=False)`; (3) `FileResponse` after loading the entire file into memory', isCorrect: false },
        { id: 'd', text: '(1) `HttpResponsePermanentRedirect` (301); (2) `HttpResponse(json.dumps(data))`; (3) a normal `HttpResponse` written in a `for` loop with `.write()`', isCorrect: false },
      ],
      explanation: 'A permanent move is **301** (`permanent=True` / `HttpResponsePermanentRedirect`) so clients update bookmarks; a temporary one is 302. A top-level JSON array needs `JsonResponse(data, safe=False)` (the default `safe=True` rejects non-dicts). A huge export must stream via `StreamingHttpResponse` (or `FileResponse` for an on-disk file) so the body is never fully buffered — building a normal `HttpResponse` would hold the whole multi-GB body in memory.',
      hints: [
        '301 permanent vs 302 temporary',
        'Top-level array → JsonResponse(safe=False)',
        'Huge body → stream, never buffer',
      ],
      tags: ['django', 'views', 'response', 'redirect', 'streaming', 'status-code'],
      concepts: ['dj-view-patterns', 'dj-http-cycle'],
    },
{
      id: 'dj-views-mastery-streaming-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_VIEWS_MASTERY,
      course: Course.BACKEND,
      question: 'You export a million-row CSV. Why prefer `StreamingHttpResponse` over a normal `HttpResponse`, and what is the tradeoff?',
      options: [
        { id: 'a', text: 'It sends rows from an iterator as they are produced, so the server never buffers the whole body; the tradeoff is no easy `Content-Length` and you can\'t modify the body once streaming starts', isCorrect: true },
        { id: 'b', text: 'It compresses the body automatically, roughly halving memory use; the tradeoff is it only works for `text/csv` and never for binary downloads', isCorrect: false },
        { id: 'c', text: 'It runs the view in a background thread so the request returns instantly; the tradeoff is the client must poll a second URL to fetch the finished file', isCorrect: false },
        { id: 'd', text: 'It caches each row in Redis as it streams; the tradeoff is you must configure a cache backend or it silently falls back to buffering everything', isCorrect: false },
      ],
      explanation: '`StreamingHttpResponse` takes an iterator and yields it to the client incrementally, so peak memory is one chunk, not the whole file — essential for large exports. The cost: the response is consumed lazily, so there is no upfront `Content-Length` (the client sees chunked transfer), and middleware/your code cannot rewrite `.content` after streaming begins. It does not compress, thread, or cache anything by itself.',
      hints: [
        'Iterator → incremental send → low peak memory',
        'Tradeoff: no Content-Length; body is fixed once streaming starts',
      ],
      tags: ['django', 'views', 'StreamingHttpResponse', 'streaming', 'memory'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-mastery-streaming-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_VIEWS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Stream a CSV from a generator so the whole file never sits in memory. Fill the response class.',
      template: `from django.http import StreamingHttpResponse
from .models import Item

def export(request):
    def rows():
        yield "id,label\\n"
        for obj in Item.objects.iterator():
            yield f"{obj.id},{obj.label}\\n"
    return ___(rows(), content_type="text/csv")`,
      blanks: ['StreamingHttpResponse'],
      solution: 'from django.http import StreamingHttpResponse\nfrom .models import Item\n\ndef export(request):\n    def rows():\n        yield "id,label\\n"\n        for obj in Item.objects.iterator():\n            yield f"{obj.id},{obj.label}\\n"\n    return StreamingHttpResponse(rows(), content_type="text/csv")',
      explanation: '`StreamingHttpResponse(iterator, content_type=...)` streams each yielded string as it is produced. Pairing it with `.iterator()` on the queryset keeps the ORM from caching all rows, so memory stays flat regardless of table size.',
      hints: ['The response class that takes an iterator', 'Pair with queryset .iterator() for low memory'],
      tags: ['django', 'views', 'StreamingHttpResponse', 'streaming', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-mastery-streaming-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_VIEWS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function-based view `export_items(request)` that streams a CSV of every `Item` so the server never buffers the whole file in memory. Yield a header row `"id,label"` first (newline-terminated), then one `"<id>,<label>"` line per item, iterating the queryset lazily so the ORM does not cache every row. Return the streaming response with content type `"text/csv"`. Use a generator for the rows.',
      starterCode: `from django.http import StreamingHttpResponse
from .models import Item
`,
      testCases: [
        {
          input: 'GET /export/',
          expectedOutput: 'StreamingHttpResponse over a generator using Item.objects.iterator(), content_type text/csv',
          description: 'lazy generator + streaming response',
        },
      ],
      solution: `from django.http import StreamingHttpResponse
from .models import Item

def export_items(request):
    def rows():
        yield "id,label\\n"
        for obj in Item.objects.iterator():
            yield f"{obj.id},{obj.label}\\n"
    return StreamingHttpResponse(rows(), content_type="text/csv")`,
      explanation: 'The nested generator `rows()` yields the header then one line per item. `Item.objects.iterator()` streams rows from the DB without filling the queryset cache, and `StreamingHttpResponse` forwards each yielded chunk to the client — so peak memory is one row, not the whole table.',
      hints: [
        'Define a generator yielding header then per-row lines',
        'Item.objects.iterator() avoids caching all rows',
        'StreamingHttpResponse(generator(), content_type="text/csv")',
      ],
      tags: ['django', 'views', 'StreamingHttpResponse', 'streaming', 'iterator', 'advanced'],
      concepts: ['dj-view-patterns'],
    },
// --- PRG / idempotency ---
{
      id: 'dj-views-mastery-prg-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS_MASTERY,
      course: Course.BACKEND,
      question: 'After a successful POST that creates a record, a view renders HTML directly with status 200. The user then refreshes the page. What problem does this cause, and what is the standard fix?',
      options: [
        { id: 'a', text: 'The refresh re-submits the POST and creates a duplicate; redirect after a successful POST (Post/Redirect/Get) so a refresh re-issues a harmless GET', isCorrect: true },
        { id: 'b', text: 'The refresh discards the form data and the record is rolled back; stash the data in the session and re-render it on the refreshed request', isCorrect: false },
        { id: 'c', text: 'The refresh triggers a CSRF failure because the token is single-use; disable CSRF on the success page so the refresh succeeds', isCorrect: false },
        { id: 'd', text: 'The refresh serves a stale cached copy of the page; add `Cache-Control: no-store` so the browser re-runs the POST cleanly', isCorrect: false },
      ],
      explanation: 'If a POST returns HTML directly, the browser remembers it was a POST; refreshing re-sends that POST and the "are you sure you want to resubmit?" prompt — leading to duplicate records. The Post/Redirect/Get pattern fixes it: on success, return a redirect (302) to a result page. The browser follows it with a GET, so refreshing that page just re-runs the safe, idempotent GET. CSRF tokens are not single-use, and the issue is resubmission, not caching.',
      hints: [
        'A returned-HTML POST is re-sent on refresh → duplicate',
        'Redirect after POST so refresh is a GET',
        'GET is safe/idempotent; POST is not',
      ],
      tags: ['django', 'views', 'post-redirect-get', 'idempotency', 'POST'],
      concepts: ['dj-view-patterns', 'dj-http-cycle'],
    },
// --- error -> status mapping ---
{
      id: 'dj-views-mastery-error-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS_MASTERY,
      course: Course.BACKEND,
      question: 'How does Django turn these view-raised exceptions into HTTP responses: `Http404`, `PermissionDenied`, `SuspiciousOperation`?',
      options: [
        { id: 'a', text: '`Http404` → 404, `PermissionDenied` → 403, `SuspiciousOperation` → 400; Django maps each to that status and renders the matching error handler', isCorrect: true },
        { id: 'b', text: 'All three surface as 500 Internal Server Error; only an explicitly returned `HttpResponse` can set a status other than 500', isCorrect: false },
        { id: 'c', text: '`Http404` → 404, `PermissionDenied` → 401, `SuspiciousOperation` → 500; each must first be registered in `urls.py` to map at all', isCorrect: false },
        { id: 'd', text: '`Http404` → 404, `PermissionDenied` → 403, `SuspiciousOperation` → 403; the last two share one handler because both are security errors', isCorrect: false },
      ],
      explanation: 'Django\'s exception-handling layer maps specific exceptions to statuses without you returning a response: `Http404` → 404, `PermissionDenied` → 403, `SuspiciousOperation` → 400. Each routes to a handler (`handler404`, `handler403`, `handler400`) you can override. This is why you `raise Http404`/`raise PermissionDenied` in view code rather than building the response yourself — the framework does the mapping.',
      hints: [
        'Http404 → 404, PermissionDenied → 403, SuspiciousOperation → 400',
        'Raising is enough — Django maps it',
        'Each has an overridable handler',
      ],
      tags: ['django', 'views', 'PermissionDenied', 'Http404', 'status-code', 'error-handling'],
      concepts: ['dj-view-patterns', 'dj-http-cycle'],
    },
// --- view-level caching ---
{
      id: 'dj-views-mastery-cache-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_VIEWS_MASTERY,
      course: Course.BACKEND,
      question: 'You apply `@cache_page(60)` to a view that renders the logged-in user\'s personal dashboard. What is the danger, and how should per-user pages be cached?',
      options: [
        { id: 'a', text: 'The first user\'s rendered page is served to everyone for 60s; per-user pages need `Vary: Cookie` / `vary_on_*` or per-user cache keys, not a blanket `cache_page`', isCorrect: true },
        { id: 'b', text: 'There is no danger — `cache_page` keys every entry by the user\'s session id automatically, so each user gets their own cached copy', isCorrect: false },
        { id: 'c', text: '`cache_page` only ever caches static files, so a dynamic dashboard is silently unaffected and the decorator is a no-op here', isCorrect: false },
        { id: 'd', text: 'The cache is invalidated on every request because the user differs each time, so caching has no effect and is harmless to leave on', isCorrect: false },
      ],
      explanation: '`cache_page` keys on the URL (and headers named in the response\'s `Vary`), NOT on the user. On a per-user page, whoever populates the cache first has their dashboard served to every other user until it expires — a real data-leak. Per-user pages should either skip `cache_page`, vary on the session cookie (`Vary: Cookie` via `vary_on_headers`/`vary_on_cookie`), or cache fragments under user-specific keys. It is not automatically session-keyed and is not a no-op.',
      hints: [
        'cache_page keys on URL + Vary, not on the user',
        'First user\'s page leaks to everyone',
        'Vary on cookie or use per-user keys for personal pages',
      ],
      tags: ['django', 'views', 'cache_page', 'caching', 'vary', 'advanced'],
      concepts: ['dj-view-patterns'],
    },
];
