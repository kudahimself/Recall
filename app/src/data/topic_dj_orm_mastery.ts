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
      question: 'Annotate each Article with its row number `rn` within its author\'s articles, newest first, and store the queryset in `ranked`. Import the helpers, then build the windowed annotation, passing `expression`, `partition_by` and `order_by` to `Window` in that order.',
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
      question: 'Annotate every Article with its position `rn` among that author\'s articles, newest first, so each author\'s newest article gets `rn=1`, the next `rn=2`, and so on. Use a window function partitioned per author; no Python loops and no subqueries. `Article` has `author` (ForeignKey) and `created_at`.',
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
)
# OR
from django.db.models import Window, F
from django.db.models.functions import RowNumber
from .models import Article

ranked = Article.objects.annotate(
    rn=Window(
        expression=RowNumber(),
        partition_by=F("author"),
        order_by="-created_at",
    )
)
# OR
from django.db.models import Window, F
from django.db.models.functions import RowNumber
from .models import Article

ranked = Article.objects.annotate(rn=Window(expression=RowNumber(), partition_by=[F("author_id")], order_by=F("created_at").desc()))`,
      explanation: 'A window function keeps every row while computing across the partition. `partition_by=[F("author_id")]` makes each author a window; `order_by=F("created_at").desc()` (or the string `"-created_at"`) numbers newest-first; `RowNumber()` yields 1, 2, 3… per partition. The result is one query returning all articles, each carrying its per-author rank - impossible with a collapsing aggregate and far cheaper than a correlated count subquery per row.',
      hints: [
        'Window(expression=RowNumber(), partition_by=[...], order_by=...)',
        'partition_by per author; order_by created_at descending',
        'Stays annotate - every row is kept, each gets its rn',
      ],
      tieredHints: {
        apiSignature: 'Window(expression, partition_by=None, order_by=None, frame=None)',
        skeleton: 'from django.db.models import ____, ____\nfrom django.db.models.functions import ____\nfrom .models import Article\n\nranked = Article.____.____(\n    rn=____(\n        ____=____(),\n        ____=[____("____")],\n        ____=____("____").____(),\n    )\n)',
      },
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
      starterCode: `# def reserve_one(pk): row-lock the product in a transaction; guard stock; return True or False.
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
      explanation: 'The `select_for_update()` inside `transaction.atomic()` locks the product row, so a concurrent caller blocks until this transaction commits - serialising the read-modify-write and making the `stock <= 0` guard reliable. Without the lock, two callers could both read `stock == 1`, both pass the guard, and both save `0`: two reservations come out of one unit (oversell). A lock-free alternative is a conditional `update(stock=F("stock") - 1)` filtered on `stock__gt=0`, but the prompt asks for the explicit row-lock pattern.',
      hints: [
        'Open transaction.atomic(), then select_for_update().get(pk=pk)',
        'Guard stock <= 0 before decrementing',
        'The lock serialises concurrent callers',
      ],
      tieredHints: {
        apiSignature: 'QuerySet.select_for_update(nowait=False, skip_locked=False, of=(), no_key=False)',
        skeleton: 'from django.db import ____\nfrom .models import Product\n\ndef reserve_one(pk):\n    with ____.____():\n        product = Product.____.____().____(pk=pk)\n        if product.____ <= 0:\n            return ____\n        product.____ -= 1\n        product.____()\n        return ____',
      },
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
      id: 'dj-orm-mastery-nplus1-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the two eager-loading calls and the double-underscore lookup that trims the loaded columns to just the title and the author\'s username.',
      template: `articles = (
    Article.objects
    .___("author")
    .___("tags")
    .only("title", "___")
)`,
      blanks: ['select_related', 'prefetch_related', 'author__username'],
      solution: 'articles = (\n    Article.objects\n    .select_related("author")\n    .prefetch_related("tags")\n    .only("title", "author__username")\n)',
      explanation: '`select_related` JOINs the FK; `prefetch_related` loads the M2M in a second query. `.only()` accepts double-underscore relation lookups too - `"author__username"` keeps just that column from the joined author row, alongside `"title"` from Article itself (the primary keys and the `author_id` link are always loaded). A dotted `"author.username"` is not a lookup and raises an error.',
      hints: ['FK eager-load, then M2M eager-load', 'only() accepts double-underscore relation paths, like a filter'],
      tags: ['django', 'orm', 'select_related', 'prefetch_related', 'only', 'cloze'],
      concepts: ['dj-orm-query-construction', 'dj-select-related-vs-prefetch'],
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
      tieredHints: {
        apiSignature: 'QuerySet.only(*fields)',
        skeleton: 'from .models import Article\n\narticles = (\n    ____.____\n    .____("____")\n    .____("____")\n    .____("____", "____")\n)',
      },
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
  {
      id: 'dj4e-fk-5',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      question: 'What is `select_related()` in Django and when should you use it?',
      options: [
        { id: 'a', text: 'It narrows the SELECT to the related fields you name, like `only()`, so wide rows load faster', isCorrect: false },
        { id: 'b', text: 'It keeps the related objects in a cache, so later querysets in other requests reuse them without a query', isCorrect: false },
        { id: 'c', text: 'It JOINs every related row into one query, many-to-many included, so use it on any relation', isCorrect: false },
        { id: 'd', text: 'It JOINs a ForeignKey (or one-to-one) into the same query, so reading it in a loop adds no queries', isCorrect: true },
      ],
      explanation: 'The N+1 problem: if you query 100 books and access `book.author.name` in a loop, Django makes 100 extra queries (one per book). `Book.objects.select_related("author")` does a single JOIN and fetches all authors at once. Use `select_related` for ForeignKey/OneToOne fields (forward relations); it raises an error on a many-to-many, which needs `prefetch_related` (as does a reverse FK). It does not choose columns (that is `only()`), and it caches nothing beyond the objects of this one queryset.',
      hints: [
        '`select_related` = one SQL JOIN; no extra queries per object',
        'Use for ForeignKey (forward). Use `prefetch_related` for M2M or reverse FK',
      ],
      tags: ['django', 'ORM', 'select_related', 'N+1', 'performance', 'JOIN'],
      concepts: ['dj-orm-query-construction', 'dj-select-related-vs-prefetch', 'dj-n-plus-one'],
    },
  {
      id: 'dj4e-m2m-5',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      question: 'What is `prefetch_related()` and how does it differ from `select_related()`?',
      options: [
        { id: 'a', text: 'Both JOIN in SQL; `prefetch_related` just adds DISTINCT so a many-to-many JOIN does not repeat the parent rows', isCorrect: false },
        { id: 'b', text: '`select_related` JOINs a FK/O2O into the query; `prefetch_related` runs a second query for M2M or reverse FK and joins in Python', isCorrect: true },
        { id: 'c', text: '`prefetch_related` is only for GenericForeignKey; `select_related` JOINs every other relation, many-to-many included', isCorrect: false },
        { id: 'd', text: '`prefetch_related` loads each object\'s related rows lazily on first access; `select_related` loads them all up front', isCorrect: false },
      ],
      explanation: '`select_related` does a SQL JOIN - efficient for FK/O2O (forward relations). `prefetch_related` does two separate queries and joins the results in Python - necessary for M2M and reverse FK relations, where a JOIN would repeat each parent row once per related row. For `Article.objects.prefetch_related("tags")`, Django does: 1) get all articles, 2) get all tags for those articles in one query, 3) Python-side join. Both load the related rows when the queryset is evaluated, not lazily per object, and `select_related` cannot follow a many-to-many at all.',
      hints: [
        'FK forward → `select_related` (JOIN); M2M or reverse FK → `prefetch_related` (2 queries)',
        'Both solve N+1 but with different SQL strategies',
      ],
      tags: ['django', 'ORM', 'prefetch_related', 'select_related', 'performance', 'M2M'],
      concepts: ['dj-orm-query-construction', 'dj-select-related-vs-prefetch'],
    },
  {
      id: 'be-sql-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      question: 'What is the N+1 query problem in Django?',
      options: [
        { id: 'a', text: 'One query loads N rows, then reading a related object inside the loop runs one more query per row', isCorrect: true },
        { id: 'b', text: 'A queryset is re-run from scratch every time you loop over it, so N loops cost N+1 queries', isCorrect: false },
        { id: 'c', text: 'A query with N filters is split into N+1 separate queries, one per filter plus a final join', isCorrect: false },
        { id: 'd', text: 'Slicing a queryset with [:N] fetches one extra row to check if more exist, so N+1 rows come back', isCorrect: false },
      ],
      explanation: 'Article.objects.all() runs one query for the list; then reading article.author inside the loop runs one extra query per article, N more in total. select_related("author") fetches the authors in the same query with a JOIN (for ForeignKey); prefetch_related("tags") runs one second query with an IN clause (for ManyToMany). Either removes the per-row queries. A queryset caches its rows after the first evaluation, filters combine into one WHERE clause, and slicing adds a LIMIT, so none of those cause it.',
      tags: ['n+1', 'select_related', 'prefetch_related', 'django', 'performance'],
      concepts: ['dj-n-plus-one', 'dj-select-related-vs-prefetch'],
    },
  {
      id: 'py-dj-orm-select-vs-prefetch',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      question: 'When do you use `select_related` vs `prefetch_related`?',
      options: [
        { id: 'a', text: 'They\'re interchangeable — both trigger a SQL JOIN, and Django simply uses whichever appears first in the queryset chain', isCorrect: false },
        { id: 'b', text: '`select_related` for "one" sides (FK, OneToOne): a SQL JOIN, one query. `prefetch_related` for "many" sides (M2M, reverse FK): a second query merged in Python', isCorrect: true },
        { id: 'c', text: '`select_related` is Postgres-only because it relies on JOIN optimisations; on SQLite and MySQL you must use `prefetch_related`', isCorrect: false },
        { id: 'd', text: '`prefetch_related` is deprecated — recent Django versions fold its behaviour into `select_related` automatically', isCorrect: false },
      ],
      explanation: 'Cardinality matters because JOINing a many-to-many would multiply rows. `select_related("author")` is a JOIN; `prefetch_related("tags")` is a second query. You can combine them: `Post.objects.select_related("author").prefetch_related("tags", "comments__user")`. The `__` traverses relations; `comments__user` prefetches comments AND their users, minimising queries. Watch the total query count with Django Debug Toolbar.',
      hints: [
        'select_related: FK / OneToOne → JOIN, one query',
        'prefetch_related: M2M / reverse FK → second query, merge in Python',
        'Combine them; use Debug Toolbar to verify',
      ],
      tags: ['django', 'orm', 'select_related', 'prefetch_related'],
      concepts: ['dj-orm-query-construction', 'dj-select-related-vs-prefetch'],
    },
  {
      id: 'dj-orm-prefetch-obj-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      question: 'Why pass a `Prefetch(...)` object to `prefetch_related` instead of just the relation name as a string?',
      options: [
        { id: 'a', text: 'The bare string prefetches ALL related rows; a `Prefetch` object lets you supply a filtered or ordered `queryset` and stash the result under a custom `to_attr`', isCorrect: true },
        { id: 'b', text: 'The string form has been deprecated; current Django only accepts `Prefetch` objects and emits a warning whenever a plain relation name is passed', isCorrect: false },
        { id: 'c', text: 'A `Prefetch` object converts the second query into a SQL JOIN, whereas the string form always issues a separate query that is merged back in Python', isCorrect: false },
        { id: 'd', text: 'It has no runtime effect at all — `Prefetch` is purely a typing helper that documents the relation\'s cardinality for IDEs and static type checkers', isCorrect: false },
      ],
      explanation: 'A bare `prefetch_related("comments")` pulls every related comment. `Prefetch("comments", queryset=Comment.objects.filter(approved=True), to_attr="approved_comments")` lets you control the inner queryset (filter, order, even `select_related` on it) and store it on a separate attribute so it doesn\'t clobber the default related manager. Both still run as a second query merged in Python — the object form just makes that query yours to shape.',
      hints: [
        'String form = all related rows; object form = your queryset',
        'to_attr stores the result on a custom attribute',
        'Still a second query, just shaped by you',
      ],
      tags: ['django', 'orm', 'Prefetch', 'prefetch_related'],
      concepts: ['dj-orm-query-construction', 'dj-select-related-vs-prefetch'],
    },
  {
      id: 'dj-orm-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Eager-load article authors (FK) AND their tags (M2M) in one access pattern.',
      template: `articles = (
    Article.objects
    .___("author")
    .___("tags")
    .all()
)`,
      blanks: ['select_related', 'prefetch_related'],
      solution: 'articles = (\n    Article.objects\n    .select_related("author")\n    .prefetch_related("tags")\n    .all()\n)',
      explanation: '`select_related` does a SQL JOIN — works for ForeignKey and OneToOne. `prefetch_related` issues a separate query and joins in Python — required for ManyToMany and reverse FK. Mixing them in one chain is the canonical fix for N+1.',
      hints: ['select_related for FK/OneToOne', 'prefetch_related for M2M / reverse FK'],
      tags: ['django', 'orm', 'select_related', 'prefetch_related', 'cloze'],
      concepts: ['dj-orm-query-construction', 'dj-select-related-vs-prefetch'],
    },
  {
      id: 'dj-orm-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Avoid the N+1 problem: fetch all comments and access `comment.article.title` for each without one query per comment. Use the queryset method that JOINs ForeignKey targets, and put it before `.all()`.',
      correctOrder: [
        'comments = (',
        '    Comment.objects',
        '    .select_related("article")',
        '    .all()',
        ')',
        'for c in comments:',
        '    print(c.article.title)',
      ],
      distractorLines: [
        '    .prefetch_related("article")',
        '    .join("article")',
        '    .include("article")',
      ],
      solution: 'comments = (\n    Comment.objects\n    .select_related("article")\n    .all()\n)\nfor c in comments:\n    print(c.article.title)',
      explanation: '`select_related` does an SQL JOIN and pulls related rows in the same query - for ForeignKey and OneToOne. `prefetch_related` issues a separate query and joins in Python - meant for ManyToMany and reverse FK; on this ForeignKey it would also avoid the N+1, but with two queries and no JOIN, so it is not the method the prompt asks for. Without either, accessing `c.article.title` triggers one extra SELECT per comment (the N+1 problem). Querysets have no `.join()` or `.include()` method.',
      hints: ['select_related for FK/OneToOne', 'prefetch_related for M2M / reverse FK', 'No JOIN method called .join'],
      tags: ['django', 'orm', 'select_related', 'n-plus-one', 'parsons'],
      concepts: ['dj-orm-query-construction', 'dj-select-related-vs-prefetch', 'dj-n-plus-one'],
    },
  {
      id: 'py-dj-orm-select-related',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use `select_related` to eliminate N+1 queries on a ForeignKey. Given a `Post` model with `author = ForeignKey(User, ...)`, write a `run()` function that iterates every post and prints `f"{post.title} by {post.author.username}"`, loading each post\'s author in a SINGLE JOIN query (not one query per post). Without eager-loading, every iteration fires a separate query for `post.author`; calling `select_related` on the `author` FK makes Django do ONE JOIN query and pre-populate `post.author`.',
      starterCode: `# Write run(): print one "<title> by <author username>" line per post,
# loading each post's author in a single JOIN instead of a query per post.
`,
      testCases: [
        {
          input: 'ForeignKey preloading',
          expectedOutput: 'Single SQL query including author columns via JOIN',
          description: 'select_related for FK and OneToOne',
        },
      ],
      solution: `from .models import Post

def run():
    qs = Post.objects.select_related("author").all()
    for post in qs:
        print(f"{post.title} by {post.author.username}")`,
      explanation: '`select_related(*fields)` adds SQL JOINs — one query for the whole list. Works for `ForeignKey` and `OneToOneField`. For 100 posts without it: 1 + 100 = 101 queries. With it: 1. Chain multiple: `.select_related("author", "category")`. Traverse relations: `.select_related("author__profile")`. Doesn\'t work for `ManyToMany` or reverse FK — use `prefetch_related` for those.',
      hints: [
        'select_related for FK / OneToOne — uses SQL JOIN',
        'Single query instead of N+1',
        'Traverse relations with __: "author__profile"',
      ],
      tieredHints: {
        apiSignature: 'QuerySet.select_related(*fields)',
        skeleton: 'from .models import Post\n\ndef run():\n    qs = Post.____.____("____").____()\n    for ____ in qs:\n        print(f"{____.____} by {____.____.____}")',
      },
      tags: ['django', 'orm', 'select_related', 'n-plus-1'],
      concepts: ['dj-orm-query-construction', 'dj-select-related-vs-prefetch'],
    },
  {
      id: 'py-dj-orm-prefetch',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use `prefetch_related` with `"tags"` for a many-to-many field. Given a `Post` model whose `tags` attribute is a `ManyToManyField` to `Tag`, fetch all posts with the tags prefetched - one additional query TOTAL, not per post. Iterate the queryset inside a `run` function and for each post print a line of the form `"<title>: <comma-separated tag names>"`; build the tag name list by joining the `name` of each tag in `post.tags.all()` with `", "`.',
      starterCode: `# Write run(): iterate all posts and print "<title>: <tag names>"
# (tag names comma-separated), prefetching the M2M tags so the
# whole tag set loads in one extra query, not one per post.
`,
      testCases: [
        {
          input: 'M2M preloading',
          expectedOutput: 'Two queries total: one for posts, one for ALL related tags',
          description: 'prefetch_related does a second query, merges in Python',
        },
      ],
      solution: `from .models import Post

def run():
    for p in Post.objects.prefetch_related("tags"):
        names = ", ".join(t.name for t in p.tags.all())
        print(f"{p.title}: {names}")`,
      explanation: '`prefetch_related` does two queries (one for the main model, one for the related table) and matches them in Python - meant for M2M, reverse FK and reverse OneToOne. Without it, `post.tags.all()` fires per iteration. Can be composed with `select_related` in the same queryset: `.select_related("author").prefetch_related("tags", "comments__user")`. For complex filtering of prefetches, use `Prefetch(...)` objects.',
      hints: [
        'prefetch_related for M2M and reverse FK',
        'Two queries total - not per parent',
        'Composable with select_related in the same queryset',
      ],
      tieredHints: {
        apiSignature: 'QuerySet.prefetch_related(*lookups)',
        skeleton: 'from .models import Post\n\ndef run():\n    for p in Post.____.____("____"):\n        names = ", ".join(t.____ for t in p.____.____())\n        print(f"{p.____}: {names}")',
      },
      tags: ['django', 'orm', 'prefetch_related', 'm2m'],
      concepts: ['dj-orm-query-construction', 'dj-select-related-vs-prefetch'],
    },
  {
      id: 'dj-orm-prefetch-obj-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in (1) the object wrapper that customises a prefetch, and (2) the keyword that stores the filtered result on a separate attribute.',
      template: `approved = Comment.objects.filter(approved=True)

articles = Article.objects.prefetch_related(
    ___("comments", queryset=approved, ___="approved_comments")
)`,
      blanks: ['Prefetch', 'to_attr'],
      solution: 'approved = Comment.objects.filter(approved=True)\n\narticles = Article.objects.prefetch_related(\n    Prefetch("comments", queryset=approved, to_attr="approved_comments")\n)',
      explanation: '`Prefetch(lookup, queryset=..., to_attr=...)` replaces the default "fetch all" prefetch with your own filtered/ordered queryset, and `to_attr` parks the result on `article.approved_comments` instead of overwriting the `article.comments` manager. Each article then exposes a plain Python list of just its approved comments — with no extra query per article.',
      hints: ['The prefetch-customising object, then the attribute-naming keyword'],
      tags: ['django', 'orm', 'Prefetch', 'to_attr', 'cloze'],
      concepts: ['dj-orm-query-construction', 'dj-select-related-vs-prefetch'],
    },
  {
      id: 'dj-orm-prefetch-obj-adv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fetch all Articles and attach to each one ONLY its approved comments, under the attribute `approved_comments`, using a single extra query for the comments (not one per article). `Comment` has a ForeignKey `article` (related_name "comments") and a boolean `approved`. Assign the queryset to `articles`.',
      starterCode: `# Prefetch only approved comments onto each article as .approved_comments
`,
      testCases: [
        {
          input: 'filtered prefetch onto a custom attribute',
          expectedOutput: 'Prefetch(queryset=..., to_attr=...) - one extra query',
          description: 'Per-article filtered related list without N+1',
        },
      ],
      solution: `from django.db.models import Prefetch
from .models import Article, Comment

approved = Comment.objects.filter(approved=True)
articles = Article.objects.prefetch_related(
    Prefetch("comments", queryset=approved, to_attr="approved_comments")
)`,
      explanation: 'A bare `prefetch_related("comments")` would load every comment; here we hand `Prefetch` a *filtered* queryset so only approved comments are fetched - in one batched query for all articles. `to_attr="approved_comments"` stores them as a plain list on each article (leaving the default `comments` manager untouched). Reading `article.approved_comments` then costs zero extra queries.',
      hints: [
        'Build the filtered Comment queryset first',
        'Wrap it in Prefetch("comments", queryset=..., to_attr=...)',
        'to_attr exposes a per-article list with no N+1',
      ],
      tieredHints: {
        apiSignature: 'Prefetch(lookup, queryset=None, to_attr=None)',
        skeleton: 'from django.db.models import ____\nfrom .models import Article, Comment\n\napproved = Comment.____.____(approved=True)\narticles = Article.____.____(\n    ____("____", queryset=approved, ____="approved_comments")\n)',
      },
      tags: ['django', 'orm', 'Prefetch', 'to_attr', 'n-plus-one', 'advanced'],
      concepts: ['dj-orm-query-construction', 'dj-select-related-vs-prefetch', 'dj-n-plus-one'],
    },
];
