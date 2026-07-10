/**
 * Topic.DJ_ORM_MASTERY — ORM "deep revisit" (spiral mastery topic, Step 4).
 * Cross-cutting ORM mastery that only lands once the whole stack is in view:
 * window-function analytics, row-locking concurrency (select_for_update + atomic),
 * N+1 forensics across view -> serializer -> template, and query-performance reasoning.
 * Single-skill ORM depth lives in topic_dj_orm.ts; this topic is the second turn of the spiral.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_orm_mastery_questions: Question[] = [
  // ===== Window functions (keep every row; rank / number / look back) =====
  {
      id: 'dj-orm-mastery-window-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      question: 'How does a window-function annotation (`Window(...)`) differ from a GROUP BY aggregate like `annotate(Count(...))`?',
      options: [
        { id: 'a', text: 'A window function computes across a set of rows but KEEPS every row (each row gets its own rank/running total), while a GROUP BY aggregate collapses each group into a single summary row', isCorrect: true },
        { id: 'b', text: 'They produce identical SQL and result sets; `Window` is simply newer syntax that Django now recommends over `annotate` for readability in modern code', isCorrect: false },
        { id: 'c', text: 'A window function may only appear inside an `.aggregate()` call, while GROUP BY aggregates work in `.annotate()` — but their row output is otherwise the same', isCorrect: false },
        { id: 'd', text: 'A window function also collapses rows like GROUP BY, but first sorts the output by the partition key before returning the grouped totals to the caller', isCorrect: false },
      ],
      explanation: 'The defining property of a window function is that it does NOT collapse rows: `Window(expression=..., partition_by=..., order_by=...)` annotates each row with a value computed over its window (its partition), so you keep all rows AND get the per-row rank, row number, running total, or prior-row value. `GROUP BY` aggregation reduces each group to one row. Use windows when you need both the detail rows and a cross-row computation.',
      hints: [
        'Window keeps rows; GROUP BY collapses them',
        'partition_by defines each row\'s window',
        'Rank / RowNumber / running totals need the detail rows kept',
      ],
      tags: ['django', 'orm', 'window', 'aggregate'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-mastery-window-lag-mcq-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      question: 'Each monthly revenue row should also show the PREVIOUS month\'s revenue (for a month-over-month delta). Which window function fits?',
      options: [
        { id: 'a', text: '`Lag("revenue")` over an ordering by month — it reads the value from the prior row in the window directly, with no self-join', isCorrect: true },
        { id: 'b', text: '`Rank()` over an ordering by month — it returns each month\'s ordinal position, from which the previous month\'s value can be divided back out', isCorrect: false },
        { id: 'c', text: '`RowNumber()` over an ordering by revenue — it numbers the rows so you can subtract row N-1 from row N in Python afterward', isCorrect: false },
        { id: 'd', text: '`Sum("revenue")` with a `filter=` for the prior month — window frames cannot read other rows, so an aggregate is the only option here', isCorrect: false },
      ],
      explanation: '`Lag(expr, offset=1)` returns the expression\'s value from the row `offset` positions before the current one within the window\'s ordering — exactly "the previous month". (`Lead` looks forward.) That\'s the whole point of window functions: a row can see its neighbours. `Rank`/`RowNumber` give positions, not prior values, and a filtered `Sum` still can\'t reference another row relative to the current one.',
      hints: [
        'Lag reads a prior row; Lead reads a following row',
        'Order the window by month so "prior" is well-defined',
        'Rank/RowNumber give positions, not neighbouring values',
      ],
      tags: ['django', 'orm', 'window', 'Lag', 'advanced'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-mastery-window-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in (1) the window-expression wrapper and (2) the function that numbers rows 1, 2, 3… within each partition.',
      template: `ranked = Article.objects.annotate(
    rn=___(
        expression=___(),
        partition_by=[F("author_id")],
        order_by=F("created_at").desc(),
    ),
)`,
      blanks: ['Window', 'RowNumber'],
      solution: 'ranked = Article.objects.annotate(\n    rn=Window(\n        expression=RowNumber(),\n        partition_by=[F("author_id")],\n        order_by=F("created_at").desc(),\n    ),\n)',
      explanation: '`Window(expression=..., partition_by=..., order_by=...)` turns an ordinary function into a windowed one. `RowNumber()` assigns 1, 2, 3… within each partition following the window\'s `order_by`. Here every author is a partition and rows are numbered newest-first, so each author\'s latest article gets `rn=1`. `RowNumber` lives in `django.db.models.functions`; `Window`/`F` in `django.db.models`.',
      hints: ['The windowing wrapper, then the 1-2-3 numbering function'],
      tags: ['django', 'orm', 'window', 'RowNumber', 'cloze'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-mastery-window-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Annotate each Article with its row number `rn` within its author\'s articles, newest first. Import the helpers, then build the windowed annotation.',
      correctOrder: [
        'from django.db.models import Window, F',
        'from django.db.models.functions import RowNumber',
        '',
        'ranked = Article.objects.annotate(',
        '    rn=Window(',
        '        expression=RowNumber(),',
        '        partition_by=[F("author_id")],',
        '        order_by=F("created_at").desc(),',
        '    ),',
        ')',
      ],
      distractorLines: [
        '    rn=RowNumber(',
        '        partition_by=Window(F("author_id")),',
        'ranked = Article.objects.aggregate(',
      ],
      solution: 'from django.db.models import Window, F\nfrom django.db.models.functions import RowNumber\n\nranked = Article.objects.annotate(\n    rn=Window(\n        expression=RowNumber(),\n        partition_by=[F("author_id")],\n        order_by=F("created_at").desc(),\n    ),\n)',
      explanation: '`Window` is the wrapper; the function (`RowNumber`) goes in `expression`. `partition_by` defines the groups (per author) and `order_by` defines the numbering order (newest first). It stays an `annotate` (rows kept), never `aggregate` (which would collapse them). `RowNumber` is imported from `django.db.models.functions`.',
      hints: ['Window wraps the function via expression=', 'annotate (keeps rows), not aggregate'],
      tags: ['django', 'orm', 'window', 'RowNumber', 'parsons'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-mastery-window-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Annotate every Article with its position `rn` among that author\'s articles, newest first — so each author\'s newest article gets `rn=1`, the next `rn=2`, and so on. Use a window function partitioned per author; no Python loops and no subqueries. `Article` has `author` (ForeignKey) and `created_at`.',
      starterCode: `# Annotate each Article with rn = its position within its author's articles, newest first.
`,
      testCases: [
        {
          input: 'per-author row numbering',
          expectedOutput: 'Window(RowNumber(), partition_by=author, order_by=-created_at)',
          description: 'Window function keeps rows, numbers within each partition',
        },
      ],
      solution: `from django.db.models import Window, F
from django.db.models.functions import RowNumber
from .models import Article

ranked = Article.objects.annotate(
    rn=Window(
        expression=RowNumber(),
        partition_by=[F("author_id")],
        order_by=F("created_at").desc(),
    )
)`,
      explanation: 'A window function keeps every row while computing across the partition. `partition_by=[F("author_id")]` makes each author a window; `order_by=F("created_at").desc()` numbers newest-first; `RowNumber()` yields 1, 2, 3… per partition. The result is one query returning all articles, each carrying its per-author rank — impossible with a collapsing aggregate and far cheaper than a correlated count subquery per row.',
      hints: [
        'Window(expression=RowNumber(), partition_by=[...], order_by=...)',
        'partition_by per author; order_by created_at descending',
        'Stays annotate — every row is kept, each gets its rn',
      ],
      tags: ['django', 'orm', 'window', 'RowNumber', 'advanced'],
      concepts: ['dj-orm-query-construction'],
    },
  // ===== Row-locking concurrency (select_for_update + atomic) =====
  {
      id: 'dj-orm-mastery-lock-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      question: 'What does `select_for_update()` do, and what is required to use it?',
      options: [
        { id: 'a', text: 'It emits `SELECT ... FOR UPDATE`, row-locking the selected rows until the surrounding transaction commits — so it must run inside a `transaction.atomic()` block', isCorrect: true },
        { id: 'b', text: 'It upgrades the queryset to a write connection and caches the rows in Redis, so concurrent readers see a consistent snapshot without any transaction at all', isCorrect: false },
        { id: 'c', text: 'It marks the selected rows read-only for other transactions but still lets them be updated, which is why no explicit `atomic()` wrapper is ever needed', isCorrect: false },
        { id: 'd', text: 'It locks the entire table for the duration of the request, so it should be called OUTSIDE `atomic()` to release the lock as early as possible', isCorrect: false },
      ],
      explanation: '`select_for_update()` adds `FOR UPDATE` to the SELECT, taking a row-level write lock on the matched rows. Other transactions that try to `select_for_update` the same rows block until yours commits or rolls back. Because locks are scoped to a transaction, Django requires it to run inside `transaction.atomic()` (it raises `TransactionManagementError` otherwise). This is the standard fix for read-modify-write races (stock counters, balances).',
      hints: [
        'SELECT ... FOR UPDATE = row-level write lock',
        'Lock lives until the transaction ends',
        'Must be inside transaction.atomic()',
      ],
      tags: ['django', 'orm', 'select_for_update', 'concurrency'],
      concepts: ['dj-orm-query-construction', 'dj-transaction-atomic'],
    },
  {
      id: 'dj-orm-mastery-lock-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in (1) the transaction context manager and (2) the queryset method that row-locks the fetched row, so two concurrent callers can\'t both decrement the same stock.',
      template: `with transaction.___():
    product = Product.objects.___().get(pk=pk)
    product.stock -= 1
    product.save()`,
      blanks: ['atomic', 'select_for_update'],
      solution: 'with transaction.atomic():\n    product = Product.objects.select_for_update().get(pk=pk)\n    product.stock -= 1\n    product.save()',
      explanation: '`transaction.atomic()` opens the transaction the lock lives in; `select_for_update()` takes a `FOR UPDATE` row lock on the fetched `Product`, so a second caller blocks on its own `select_for_update` until this block commits. Without the lock, both callers could read the same stock and each write `stock - 1`, losing one decrement (the lost-update race).',
      hints: ['The transaction wrapper, then the row-locking queryset method'],
      tags: ['django', 'orm', 'select_for_update', 'atomic', 'cloze'],
      concepts: ['dj-orm-query-construction', 'dj-transaction-atomic'],
    },
  {
      id: 'dj-orm-mastery-lock-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write `reserve_one(pk)` that decrements the `stock` of the `Product` with that pk by 1, but never lets two concurrent callers oversell (drive stock below zero). Lock the row for the duration of a transaction: if stock is already 0, return False without changing it; otherwise decrement, save, and return True. `Product` has an integer `stock`.',
      starterCode: `# def reserve_one(pk): row-lock the product in a transaction; guard stock; return created flag.
`,
      testCases: [
        {
          input: 'concurrent reservation under a row lock',
          expectedOutput: 'transaction.atomic + select_for_update + stock guard',
          description: 'Race-safe read-modify-write',
        },
      ],
      solution: `from django.db import transaction
from .models import Product

def reserve_one(pk):
    with transaction.atomic():
        product = Product.objects.select_for_update().get(pk=pk)
        if product.stock <= 0:
            return False
        product.stock -= 1
        product.save()
        return True`,
      explanation: 'The `select_for_update()` inside `transaction.atomic()` locks the product row, so a concurrent caller blocks until this transaction commits — serialising the read-modify-write and making the `stock <= 0` guard reliable. Without the lock, two callers could both read `stock == 1`, both pass the guard, and both save `0`/`-1` (oversell). A lock-free alternative is a conditional `update(stock=F("stock") - 1)` filtered on `stock__gt=0`, but the prompt asks for the explicit row-lock pattern.',
      hints: [
        'Open transaction.atomic(), then select_for_update().get(pk=pk)',
        'Guard stock <= 0 before decrementing',
        'The lock serialises concurrent callers',
      ],
      tags: ['django', 'orm', 'select_for_update', 'atomic', 'concurrency', 'advanced'],
      concepts: ['dj-orm-query-construction', 'dj-transaction-atomic'],
    },
  // ===== N+1 forensics across the stack (view -> serializer -> template) =====
  {
      id: 'dj-orm-mastery-nplus1-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      question: 'A template loops `{% for c in comments %}{{ c.article.title }}{% endfor %}` over `Comment.objects.all()`. Why is it slow, and what fixes it?',
      options: [
        { id: 'a', text: 'Each `c.article` access fires a fresh query — one per comment (the N+1 problem); `Comment.objects.select_related("article")` JOINs the article into the first query', isCorrect: true },
        { id: 'b', text: 'Templates can\'t reach related objects, so Django silently issues a COUNT per row; wrapping the body in a `{% with %}` block caches the title and removes the queries', isCorrect: false },
        { id: 'c', text: 'The cost is template rendering, not the database; moving the loop into the view and passing a pre-rendered string avoids re-evaluating `c.article` each pass', isCorrect: false },
        { id: 'd', text: '`Comment.objects.all()` eagerly loads every column, so the rows are huge; adding `.only("article")` trims them enough that the per-comment lookups become free', isCorrect: false },
      ],
      explanation: 'The queryset loads comments in one query, but `c.article` is a ForeignKey that wasn\'t fetched — so the first time each comment\'s `article` is accessed in the loop, Django runs another SELECT. N comments → N extra queries. `select_related("article")` performs a JOIN so the article rows arrive with the comments in a single query. The N+1 lives in the data access, regardless of whether the loop is in a template or a view.',
      hints: [
        'One query per related-object access = N+1',
        'select_related JOINs the FK into the first query',
        'It\'s a query problem, not a rendering problem',
      ],
      tags: ['django', 'orm', 'n-plus-one', 'select_related'],
      concepts: ['dj-orm-query-construction', 'dj-n-plus-one', 'dj-select-related-vs-prefetch'],
    },
  {
      id: 'dj-orm-mastery-nplus1-mcq-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      question: 'A DRF `ArticleSerializer` nests an `author` (ForeignKey) and a `tags` (ManyToMany) field. To avoid N+1 when listing articles, what should the view\'s `get_queryset` return?',
      options: [
        { id: 'a', text: '`select_related("author")` for the FK and `prefetch_related("tags")` for the M2M — the serializer then reads both from the loaded data with no per-row queries', isCorrect: true },
        { id: 'b', text: '`prefetch_related("author", "tags")` for both — serializers always read related data in Python, so prefetch is the only form DRF is able to consume', isCorrect: false },
        { id: 'c', text: 'Nothing — DRF inspects the serializer\'s fields and automatically attaches the right `select_related`/`prefetch_related` to any `ModelViewSet` queryset', isCorrect: false },
        { id: 'd', text: '`select_related("author", "tags")` for both — DRF serializes synchronously, so one JOIN spanning every relation is always the most efficient choice', isCorrect: false },
      ],
      explanation: 'Cardinality decides the tool: the `author` FK is "one", so `select_related` (a JOIN, same query); `tags` is "many", so `prefetch_related` (a second query merged in Python — JOINing it would multiply article rows). DRF does NOT auto-optimise the queryset, so a naive serializer triggers N+1 across both nested fields. Set them explicitly in `get_queryset`. This is the single most common DRF list-endpoint performance bug.',
      hints: [
        'FK → select_related (JOIN); M2M → prefetch_related (2nd query)',
        'DRF won\'t add these for you',
        'JOINing a M2M multiplies the parent rows',
      ],
      tags: ['django', 'orm', 'n-plus-one', 'drf', 'advanced'],
      concepts: ['dj-orm-query-construction', 'dj-n-plus-one', 'dj-select-related-vs-prefetch'],
    },
  {
      id: 'dj-orm-mastery-nplus1-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build the queryset for an article list page so that, for every article, reading `article.author.username` and iterating `article.tags.all()` costs a CONSTANT number of queries (not one per article). Eager-load the `author` ForeignKey in the same query, prefetch the `tags` ManyToMany in one extra query, and load only the `title` column (plus the author\'s username) — the model also has a large `body` TextField you do not need here.',
      starterCode: `# Return the optimised Article queryset (constant query count, trimmed columns).
`,
      testCases: [
        {
          input: 'list page without N+1',
          expectedOutput: 'select_related(author) + prefetch_related(tags) + only(...)',
          description: 'Constant-query, trimmed-row queryset',
        },
      ],
      solution: `from .models import Article

articles = (
    Article.objects
    .select_related("author")
    .prefetch_related("tags")
    .only("title", "author__username")
)`,
      explanation: 'Three optimisations compose: `select_related("author")` JOINs the FK so `article.author` is free; `prefetch_related("tags")` loads all tags in one extra query merged in Python (a JOIN would multiply article rows); `only("title", "author__username")` trims the wide `body` column from the SELECT. Total cost is 2 queries regardless of how many articles — the canonical list-endpoint shape.',
      hints: [
        'select_related for the author FK (JOIN)',
        'prefetch_related for the tags M2M (one extra query)',
        'only() to drop the unused wide column',
      ],
      tags: ['django', 'orm', 'n-plus-one', 'select_related', 'prefetch_related', 'only', 'advanced'],
      concepts: ['dj-orm-query-construction', 'dj-n-plus-one', 'dj-select-related-vs-prefetch'],
    },
  // ===== Query-performance reasoning =====
  {
      id: 'dj-orm-mastery-perf-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      question: 'When should you use `qs.count()` versus `len(qs)`?',
      options: [
        { id: 'a', text: '`qs.count()` runs `SELECT COUNT(*)` and returns a number without loading rows; `len(qs)` evaluates the whole queryset into memory — so use `count()` unless you already need the objects', isCorrect: true },
        { id: 'b', text: '`len(qs)` runs `SELECT COUNT(*)` while `qs.count()` loads every row first; prefer `len()` on large tables where you only want the total', isCorrect: false },
        { id: 'c', text: 'They are aliases that compile to the very same `COUNT(*)` query, so the choice is purely stylistic and has no performance consequence at all', isCorrect: false },
        { id: 'd', text: '`qs.count()` caches its result permanently after the first call while `len(qs)` always re-queries, so `count()` should be avoided when rows change often', isCorrect: false },
      ],
      explanation: '`count()` pushes the work to the database (`SELECT COUNT(*)`) and returns an int — no model instances built. `len(qs)` forces the queryset to evaluate, pulling every matching row into Python just to measure the list. If you already need to iterate the objects anyway, `len()` (or letting the cached queryset report its length) is fine; if you only need the number, `count()` is far cheaper.',
      hints: [
        'count() = COUNT(*), no rows loaded',
        'len() materialises the whole queryset',
        'Already iterating? len() is fine; else count()',
      ],
      tags: ['django', 'orm', 'count', 'performance'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-mastery-perf-mcq-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      question: 'To check whether a queryset has ANY rows, why prefer `qs.exists()` over `qs.count() > 0` or `if qs:`?',
      options: [
        { id: 'a', text: '`exists()` runs `SELECT 1 ... LIMIT 1` and stops at the first matching row, while `count()` tallies every match and `if qs:` loads and caches the entire queryset', isCorrect: true },
        { id: 'b', text: '`exists()` and `count()` issue the identical query, but `exists()` additionally caches the rows so a later loop over the same queryset runs for free', isCorrect: false },
        { id: 'c', text: '`count() > 0` is fine for small tables, but `exists()` is required because `count()` raises an error whenever the queryset matches zero rows', isCorrect: false },
        { id: 'd', text: '`if qs:` is actually the cheapest because it short-circuits in Python; `exists()` always executes the full SELECT before returning its boolean result', isCorrect: false },
      ],
      explanation: '`exists()` compiles to `SELECT (1) AS a ... LIMIT 1`: the database can stop at the first hit and no rows are shipped to Python. `count()` must tally every matching row, and `if qs:` (or `bool(qs)`) evaluates and caches the whole queryset. When the only question is "is there at least one?", `exists()` is the cheapest by a wide margin — especially on large or unindexed result sets.',
      hints: [
        'exists() = SELECT 1 ... LIMIT 1',
        'count() tallies all matches; if qs: caches them all',
        'Any-row check → exists()',
      ],
      tags: ['django', 'orm', 'exists', 'performance'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-mastery-perf-mcq-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      question: 'When does `.only()` / `.defer()` genuinely help, and when can it backfire?',
      options: [
        { id: 'a', text: 'They help when rows are wide and you read few columns; they backfire when you later touch a deferred field in a loop — each access fires its own query (a fresh N+1)', isCorrect: true },
        { id: 'b', text: 'They always help because fewer columns means less data; the only risk is forgetting to include the primary key, which Django then refuses to defer', isCorrect: false },
        { id: 'c', text: 'They help only on writes by skipping unchanged columns in the UPDATE; on reads Django ignores them and loads the complete row every time anyway', isCorrect: false },
        { id: 'd', text: 'They backfire only on PostgreSQL, where partial column loads disable the query cache; on every other backend they are always a net performance win', isCorrect: false },
      ],
      explanation: '`only`/`defer` shrink the SELECT to the columns you need — a real win when a table has wide columns (large TEXT/JSON) you won\'t read. The trap: they return real model instances, so touching a *deferred* column later triggers a separate per-instance query. Do that inside a loop and you\'ve traded one wide query for an N+1. Profile the actual access pattern before reaching for them.',
      hints: [
        'Win: wide rows, few columns needed',
        'Trap: touching a deferred field per row = N+1',
        'They still return model instances',
      ],
      tags: ['django', 'orm', 'only', 'defer', 'performance', 'advanced'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-mastery-perf-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this print? Assume DEBUG=True, 3 Articles each with an author, and that `connection.queries` is reset before each block.',
      code: `from django.db import connection, reset_queries

reset_queries()
for a in Article.objects.all():
    _ = a.author.username
print(len(connection.queries))

reset_queries()
for a in Article.objects.select_related("author"):
    _ = a.author.username
print(len(connection.queries))`,
      expectedOutput: `4
1`,
      explanation: 'First block: one query loads the 3 articles, then each `a.author` access (the FK wasn\'t fetched) fires its own SELECT — 1 + 3 = 4 queries (the N+1). Second block: `select_related("author")` JOINs the author into the initial query, so all three usernames are already present — 1 query total. This is N+1 made literal in the query counter.',
      hints: [
        'Base query + one per FK access = 1 + N',
        'select_related folds the FK into a single JOIN',
        '3 articles → 4 vs 1',
      ],
      tags: ['django', 'orm', 'n-plus-one', 'select_related', 'predict'],
      concepts: ['dj-orm-query-construction', 'dj-n-plus-one'],
    },
];
