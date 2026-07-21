/**
 * Topic.DJ_CACHING — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendAdvancedPedagogyQuestions.ts (3), djangoAdvancedQuestions.ts (2), djangoBatchDExpansionQuestions.ts (6), djangoGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_caching_questions: Question[] = [
  {
      id: 'dj-caching-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CACHING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Cache the result of an expensive get_top_articles() lookup for 5 minutes using Django\'s low-level cache API. On miss, compute and store; on hit, return the cached value.',
      correctOrder: [
        'from django.core.cache import cache',
        '',
        'def get_top_articles():',
        '    cached = cache.get("top_articles")',
        '    if cached is not None:',
        '        return cached',
        '    result = Article.objects.filter(featured=True).order_by("-views")[:10]',
        '    cache.set("top_articles", result, 300)',
        '    return result',
      ],
      distractorLines: [
        '    cache.put("top_articles", result, 300)',
        '    cache.set(result, "top_articles", 300)',
        '    if cached:',
        '    cached = cache.fetch("top_articles")',
      ],
      solution: 'from django.core.cache import cache\n\ndef get_top_articles():\n    cached = cache.get("top_articles")\n    if cached is not None:\n        return cached\n    result = Article.objects.filter(featured=True).order_by("-views")[:10]\n    cache.set("top_articles", result, 300)\n    return result',
      explanation: 'API is `cache.get(key)` / `cache.set(key, value, timeout_seconds)`. Use `if cached is not None` (not `if cached`) — an empty list, `0`, or `""` is a *valid cached value* and would be re-computed unnecessarily under truthy-check. Timeout is in seconds.',
      hints: ['cache.get / cache.set', 'Check `is not None`, not truthy', 'Timeout is seconds'],
      tags: ['django', 'caching', 'cache.get', 'parsons'],
      concepts: ['dj-caching'],
    },
  {
      id: 'dj-caching-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CACHING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Cache the entire view response for 60 seconds using a built-in decorator.',
      template: `from django.views.decorators.cache import ___

@___(60)
def article_list(request):
    return render(request, "articles.html", {"articles": Article.objects.all()})`,
      blanks: ['cache_page', 'cache_page'],
      solution: 'from django.views.decorators.cache import cache_page\n\n@cache_page(60)\ndef article_list(request):\n    return render(request, "articles.html", {"articles": Article.objects.all()})',
      explanation: '`@cache_page(N)` caches the rendered view response for N seconds, keyed by URL + query string + Vary headers. For per-user data use `@vary_on_cookie`/`@vary_on_headers` or skip view-level caching and reach for the low-level cache API.',
      hints: ['cache_page from django.views.decorators.cache', 'Argument is timeout in seconds'],
      tags: ['django', 'caching', 'cache_page', 'cloze'],
      concepts: ['dj-caching'],
    },
  {
      id: 'dj-caching-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CACHING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this print? (Assume LocMem cache and the key has never been set.)',
      code: `from django.core.cache import cache

print(cache.get("missing"))
print(cache.get("missing", "default"))
cache.set("missing", 0, 60)
print(cache.get("missing"))
print(cache.get("missing") or "fallback")`,
      expectedOutput: `None
default
0
fallback`,
      explanation: '`cache.get(key)` returns `None` for a missing key. `cache.get(key, default)` lets you supply a default. The 4th line shows the "is not None" pitfall — `cache.get("missing")` is `0` (a real cached value!), but `0 or "fallback"` evaluates to `"fallback"` because 0 is falsy. Always test cache hits with `is not None`.',
      hints: ['Default arg replaces None', '0 is a valid cached value but falsy in `or`'],
      tags: ['django', 'caching', 'cache.get', 'predict'],
      concepts: ['dj-caching'],
    },
  {
      id: 'dj-cache-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_CACHING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Implement two views: (1) a `product_list` view decorated with @cache_page to cache the entire response for 15 minutes, and (2) a `product_detail` view that uses low-level caching with cache.get/cache.set to cache individual product data for 10 minutes. If the cache misses, query the Product model and store the result.',
      starterCode: ``,
      testCases: [
        {
          input: 'Caching views',
          expectedOutput: '@cache_page(900) on product_list and cache.get/cache.set in product_detail',
          description: 'Should use per-view caching and low-level caching correctly',
        },
      ],
      solution: `from django.shortcuts import render, get_object_or_404
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from .models import Product

@cache_page(60 * 15)
def product_list(request):
    products = Product.objects.all()
    return render(request, 'products/list.html', {'products': products})

def product_detail(request, pk):
    cache_key = f'product_{pk}'
    product = cache.get(cache_key)
    if product is None:
        product = get_object_or_404(Product, pk=pk)
        cache.set(cache_key, product, 60 * 10)
    return render(request, 'products/detail.html', {'product': product})`,
      tieredHints: {
        apiSignature: 'cache.get(key, default=None)',
        skeleton: `@____(60 * 15)
def product_list(request):
    products = Product.objects.all()
    return render(request, 'products/list.html', {'products': products})

def product_detail(request, pk):
    cache_key = f'product_{pk}'
    product = cache.____(cache_key)
    if product is None:
        product = get_object_or_404(Product, pk=pk)
        cache.____(cache_key, product, 60 * 10)
    return render(request, 'products/detail.html', {'product': product})`,
      },
      explanation: '@cache_page(seconds) caches the entire HTTP response — both the rendered HTML and headers. It is best for pages that are identical for all users (anonymous views). The timeout of 60*15 = 900 seconds = 15 minutes. Low-level caching with cache.get()/cache.set() gives you control over what gets cached and for how long. The pattern "get from cache, if None query DB and set cache" is called cache-aside (or lazy-loading). This is preferred for detail views because you can cache individual objects with unique keys, invalidate specific entries when data changes, and avoid caching user-specific content accidentally.',
      hints: [
        '@cache_page takes seconds as argument: 60 * 15 = 15 minutes',
        'cache.get() returns None on cache miss',
        'cache.set(key, value, timeout) stores data with expiration',
      ],
      tags: ['django', 'caching', 'cache-page', 'low-level-cache', 'views'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'py-dj-cache-why',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CACHING,
      course: Course.BACKEND,
      question: 'When should you add caching to a Django app?',
      options: [
        { id: 'a', text: 'Never — caching is premature optimisation; a properly indexed database already makes every query fast', isCorrect: false },
        { id: 'b', text: 'Everywhere by default — cache each view from day one so the app never develops slow endpoints later', isCorrect: false },
        { id: 'c', text: 'When profiling shows an expensive operation repeats with the same inputs and staleness is acceptable — after fixing N+1s and indexes first', isCorrect: true },
        { id: 'd', text: 'Only in production — Django disables the cache framework in development, so adding it earlier does nothing', isCorrect: false },
      ],
      explanation: 'The caching tax: every cache layer adds complexity, invalidation bugs, debugging surprises. Order of optimisations: (1) profile (`django-debug-toolbar`, `silk`), (2) fix N+1 and missing indexes, (3) add page / fragment / low-level caching for what\'s left. Invalidation is genuinely hard ("there are only two hard things in CS..."). Rule: don\'t cache what you can just make fast.',
      hints: [
        'Profile first — fix N+1 and indexes before caching',
        'Acceptable staleness is a requirement for caching',
        'Cache invalidation is hard; avoid if possible',
      ],
      tags: ['django', 'caching', 'design', 'performance'],
      concepts: ['dj-caching'],
    },
  {
      id: 'dj-caching-getset-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CACHING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the two low-level cache methods: store a value with a TTL, then read it back with a default.',
      template: `from django.core.cache import cache

cache.___("greeting", "hello", timeout=60)
value = cache.___("greeting", "default")`,
      blanks: ['set', 'get'],
      solution: 'from django.core.cache import cache\n\ncache.set("greeting", "hello", timeout=60)\nvalue = cache.get("greeting", "default")',
      explanation: '`cache.set(key, value, timeout=...)` stores a value for the given number of seconds. `cache.get(key, default)` reads it back, returning `default` if the key is missing or expired.',
      hints: ['Store first, then read', 'get() takes an optional default as its second arg'],
      tags: ['django', 'caching', 'cache', 'low-level', 'cloze'],
      concepts: ['dj-caching'],
    },
  {
      id: 'py-dj-cache-get-set',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CACHING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use the low-level cache API directly. Import `cache` from `django.core.cache`. Store the value `42` under the key `"user_count"` with a 60-second TTL via `cache.set`. Read it back with `cache.get`, passing `0` as the default so missing/expired keys yield a numeric fallback instead of None, and print the result.',
      starterCode: `# Using the low-level cache API: store 42 under "user_count" with a
# 60-second TTL, then read it back with a default of 0 and print it.
`,
      testCases: [
        {
          input: 'cache.set + cache.get',
          expectedOutput: '42',
          description: 'Low-level cache is a key/value store with TTL',
        },
      ],
      solution: `from django.core.cache import cache

cache.set("user_count", 42, timeout=60)
value = cache.get("user_count", 0)
print(value)`,
      tieredHints: {
        apiSignature: 'cache.set(key, value, timeout=DEFAULT_TIMEOUT, version=None)',
        skeleton: `from django.core.cache import ____

____.____(____, 42, timeout=60)
____ = ____.____(____, 0)
print(____)`,
      },
      explanation: 'Low-level API: `set(key, value, timeout=...)`, `get(key, default=None)`, `delete(key)`, `get_or_set(key, callable_or_value, timeout)` (compute + store if missing — the "memoize" pattern), `incr(key)` / `decr(key)` atomic counters (Memcached / Redis). Timeout in seconds; `None` = forever; `0` = do not cache (handy for feature flags). Keys must be strings; values are pickled.',
      hints: [
        'set(key, value, timeout); get(key, default)',
        'get_or_set(key, callable, timeout) for compute-and-cache',
        'incr / decr for atomic counters on Memcached / Redis',
      ],
      tags: ['django', 'caching', 'cache', 'low-level'],
      concepts: ['dj-caching'],
    },
  {
      id: 'py-dj-cache-page',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CACHING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Cache a full view response with the `cache_page` decorator from `django.views.decorators.cache`. Define a view `popular_posts` taking a request, and wrap it in `cache_page` so the rendered response is cached for 15 minutes. Subsequent requests within the window skip the view entirely.',
      starterCode: `# Write popular_posts(request) wrapped in cache_page so the rendered
# response is cached for 15 minutes; hits within the window skip the view.
`,
      testCases: [
        {
          input: '@cache_page decorator',
          expectedOutput: 'Response cached for 15 minutes; hits skip the view',
          description: 'Whole-page HTTP-response caching',
        },
      ],
      solution: `from django.views.decorators.cache import cache_page
from django.http import HttpResponse

@cache_page(60 * 15)
def popular_posts(request):
    return HttpResponse("...")`,
      tieredHints: {
        apiSignature: 'cache_page(timeout, cache=None, key_prefix=None)',
        skeleton: `from django.views.decorators.cache import ____
from django.http import ____

@____(60 * 15)
def ____(request):
    return ____("...")`,
      },
      explanation: '`cache_page` caches the full rendered response keyed by URL + query string. Best for genuinely public pages (same response for every user). Do NOT use for personalised pages — every user would see the same cached content. Per-user options: `vary_on_cookie` decorator, or low-level caching keyed by `user.id`. Use `cache_control` for client-side browser caching headers (orthogonal to server-side).',
      hints: [
        'cache_page caches the full response per URL+query',
        'Only for non-personalised pages — leaks otherwise',
        'vary_on_cookie for per-user caching',
      ],
      tags: ['django', 'caching', 'cache_page'],
      concepts: ['dj-caching'],
    },
  {
      id: 'dj-caching-getorset-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CACHING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the method that computes-and-caches in one call, running the callable only on a miss.',
      template: `from django.core.cache import cache

def compute():
    return expensive_lookup()

value = cache.___("key", compute, timeout=60)`,
      blanks: ['get_or_set'],
      solution: 'from django.core.cache import cache\n\ndef compute():\n    return expensive_lookup()\n\nvalue = cache.get_or_set("key", compute, timeout=60)',
      explanation: '`get_or_set(key, callable_or_value, timeout)` collapses the "get, if None compute and set" dance into one call. Pass a CALLABLE (not the already-computed value) so it only runs on a cache miss.',
      hints: ['One method replaces the get/if-None/set pattern'],
      tags: ['django', 'caching', 'get_or_set', 'cloze'],
      concepts: ['dj-caching'],
    },
  {
      id: 'py-dj-cache-getorset',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CACHING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use `get_or_set` for the canonical "compute once, cache, reuse" pattern. Import `cache`. Write `get_site_stats()` that returns the value cached under `"site:stats"`, computing it via a `compute_stats` callable (called only on a cache miss) with a 300-second timeout. Subsequent calls within 5 min return the cached value.',
      starterCode: `# Write get_site_stats(): return the value cached under "site:stats",
# computing it via the compute_stats callable only on a cache miss,
# with a 5-minute TTL.
`,
      testCases: [
        {
          input: 'cache.get_or_set with callable',
          expectedOutput: 'compute_stats runs on first call; cached for 5 min',
          description: 'Lazy memoisation without manual if-get-else-set',
        },
      ],
      solution: `from django.core.cache import cache
from django.contrib.auth.models import User
from .models import Post

def compute_stats():
    return {"users": User.objects.count(), "posts": Post.objects.count()}

def get_site_stats():
    return cache.get_or_set("site:stats", compute_stats, timeout=300)`,
      tieredHints: {
        apiSignature: 'cache.get_or_set(key, default, timeout=DEFAULT_TIMEOUT, version=None)',
        skeleton: `from django.core.cache import ____
from django.contrib.auth.models import User
from .models import Post

def ____():
    return {"users": User.objects.____(), "posts": Post.objects.____()}

def ____():
    return ____.____("site:stats", ____, timeout=300)`,
      },
      explanation: '`get_or_set(key, callable_or_value, timeout)` replaces the `v = cache.get(k); if v is None: v = compute(); cache.set(k, v); return v` dance. Passing a CALLABLE (not the value) means compute only runs on miss. Naming convention: colon-separated keys (`"site:stats"`, `"user:42:profile"`) for grep-ability. Watch out for thundering-herd (many misses at the same instant hammering the source); use `cache.add()` + external lock or libraries like `django-cacheops` for advanced patterns.',
      hints: [
        'get_or_set(key, callable, timeout) — callable runs only on miss',
        'Colon-separated keys for grep-friendly debugging',
        'Thundering herd risk on popular keys — consider locking',
      ],
      tags: ['django', 'caching', 'get_or_set', 'memoisation'],
      concepts: ['dj-caching'],
    },
  {
      id: 'dj-caching-signal-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CACHING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the decorator that runs this function every time a Post is saved.',
      template: `from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Post

@___(post_save, sender=Post)
def on_post_saved(sender, instance, **kwargs):
    print(f"Saved: {instance}")`,
      blanks: ['receiver'],
      solution: 'from django.db.models.signals import post_save\nfrom django.dispatch import receiver\nfrom .models import Post\n\n@receiver(post_save, sender=Post)\ndef on_post_saved(sender, instance, **kwargs):\n    print(f"Saved: {instance}")',
      explanation: '`@receiver(signal, sender=Model)` connects a function to a Django signal — here `post_save`, which fires after every `.save()` on `Post`. The function always accepts `sender`, `instance`, and `**kwargs` (the extra kwargs vary by signal).',
      hints: ['Decorator that wires a function to a signal', 'sender= scopes it to one model'],
      tags: ['django', 'signals', 'post_save', 'receiver', 'cloze'],
      concepts: ['dj-signal-vs-override'],
    },
  {
      id: 'py-dj-cache-invalidate',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CACHING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Invalidate a cache entry when the underlying data changes. Connect a `post_save` signal on `Post`. Import `receiver`, `post_save`, `cache`, and `Post`. Define a receiver function `clear_list_cache` that takes `sender`, `instance`, and `**kwargs`, bound to `post_save` with `Post` as the sender, whose body deletes the cache entry under the key `"posts:list"`. Now saving any Post evicts that entry so the next read recomputes.',
      starterCode: `# Wire a post_save receiver on Post (clear_list_cache) that deletes
# the "posts:list" cache entry whenever a Post is saved.
`,
      testCases: [
        {
          input: 'cache invalidation via post_save',
          expectedOutput: 'cache.delete("posts:list") runs whenever a Post is saved',
          description: 'Signal-driven invalidation',
        },
      ],
      solution: `from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.cache import cache
from .models import Post

@receiver(post_save, sender=Post)
def clear_list_cache(sender, instance, **kwargs):
    cache.delete("posts:list")`,
      tieredHints: {
        apiSignature: 'cache.delete(key, version=None)',
        skeleton: `from django.db.models.signals import ____
from django.dispatch import ____
from django.core.cache import ____
from .models import Post

@____(____, sender=____)
def ____(sender, instance, **kwargs):
    ____.____("posts:list")`,
      },
      explanation: 'Works, but blunt — any post save clears the whole list. Smarter: version keys. Store a "generation counter" (`cache.incr("posts:gen")` on each save), embed it in every downstream key (`f"posts:list:gen={gen}"`). Old entries age out; readers always get fresh data. Signals aren\'t fired by bulk `update()` / raw SQL / `bulk_create` — either avoid bulk or invalidate explicitly. Third-party: `django-cacheops` handles a lot of this automatically.',
      hints: [
        'Signal blunt: clears on every save',
        'Refinement: generation counters (incr on save, embed in keys)',
        'Signals NOT fired by bulk update / bulk_create — invalidate manually',
      ],
      tags: ['django', 'caching', 'invalidation', 'signals'],
      concepts: ['dj-signal-vs-override'],
    },
  {
      id: 'py-dj-cache-backends',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CACHING,
      course: Course.BACKEND,
      question: 'Which cache backend should you use — `LocMemCache`, `Memcached`, or `Redis`?',
      options: [
        { id: 'a', text: '`LocMemCache` everywhere including production — being in-process makes it the fastest, and gunicorn workers share it', isCorrect: false },
        { id: 'b', text: '`DatabaseCache` for production — it reuses existing DB connections, making it faster than any network cache', isCorrect: false },
        { id: 'c', text: 'They are interchangeable — Django\'s cache API abstracts the backend, so the choice has no practical effect', isCorrect: false },
        { id: 'd', text: '`LocMemCache` for dev/tests (per-process, unshared), `Memcached` for simple shared caching, `Redis` for that plus counters, pub/sub, and Celery', isCorrect: true },
      ],
      explanation: 'Key differences: LocMemCache is per-gunicorn-worker — two requests hitting different workers see different cache state. Unacceptable in production. Memcached is shared, fast, LRU-evicting, no persistence. Redis is richer: data structures, persistence (AOF/RDB), pub/sub, Lua scripts, replication. Unless you have strong reasons, pick Redis — you\'ll want the extras eventually (Celery broker, rate limiting, session store).',
      hints: [
        'LocMemCache: dev only (per-process, not shared)',
        'Memcached: fast shared KV cache',
        'Redis: shared + data structures + Celery-ready',
      ],
      tags: ['django', 'caching', 'Redis', 'Memcached'],
      concepts: ['dj-caching'],
    },
  {
      id: 'dj-caching-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CACHING,
      course: Course.BACKEND,
      question: 'What is caching and why use it in a Django application?\n\nYour homepage runs a database query that takes 200ms. Every visitor triggers this same query, hundreds of times per minute, with the same result each time.',
      options: [
        {
          id: 'a',
          text: 'A technique for compressing database tables so frequently-read rows take less disk space and load faster',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'Storing results of expensive operations so repeated requests skip recomputation — the 200ms query becomes a ~1ms lookup',
          isCorrect: true,
        },
        {
          id: 'c',
          text: 'Pre-rendering all possible pages at build time so the server only ever serves static files to visitors',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'A browser feature that saves downloaded JavaScript and CSS files — Django has no control over caching',
          isCorrect: false,
        },
      ],
      explanation: 'Caching stores computed results in a fast storage layer (memory, Redis, Memcached) so repeated requests skip the expensive computation. Without caching: every request runs the same slow database query. With caching: the first request runs the query and stores the result; subsequent requests get the stored result instantly. Django provides a unified caching API that works with multiple backends — you can start with local memory cache in development and switch to Redis in production without changing your code.',
      hints: [
        'The idea is simple: compute once, serve many times from fast storage',
        'Redis is the most popular cache backend for production Django',
      ],
      tags: ['django', 'caching', 'performance', 'redis', 'basics'],
      concepts: ['dj-caching'],
    },
  {
      id: 'dj-caching-gap-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CACHING,
      course: Course.BACKEND,
      question: 'Django supports multiple levels of caching. What are the different caching strategies available, from broadest to most granular?',
      options: [
        {
          id: 'a',
          text: 'Django only supports one level: database query caching, which is handled automatically by the ORM',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'Browser caching (Cache-Control headers) and CDN caching — Django does not cache anything server-side',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Per-site caching, per-view caching (@cache_page), template fragment caching ({% cache %}), and the low-level cache.get/set API',
          isCorrect: true,
        },
        {
          id: 'd',
          text: 'Only per-view caching with @cache_page — all other caching must be implemented manually with Redis commands',
          isCorrect: false,
        },
      ],
      explanation: 'Django provides four levels of caching: (1) Per-site: add CacheMiddleware to cache every page — broadest but least flexible. (2) Per-view: decorate individual views with @cache_page(timeout) to cache specific pages. (3) Template fragment: use {% cache timeout fragment_name %} to cache expensive template sections (like a sidebar) while keeping the rest dynamic. (4) Low-level API: cache.set("key", value, timeout) and cache.get("key") for complete manual control — cache query results, API responses, computed values, anything.',
      hints: [
        'Per-site is the broadest; low-level cache.get/set is the most granular',
        '@cache_page(60) means the view result is cached for 60 seconds',
      ],
      tags: ['django', 'caching', 'cache-page', 'template-fragment', 'low-level-cache'],
      concepts: ['dj-caching'],
    },
];
