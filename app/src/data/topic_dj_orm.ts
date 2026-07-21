/**
 * Topic.DJ_ORM — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendAdvancedQuestions.ts (1), backendGapQuestions.ts (4), backendQuestions.ts (2), djangoAdvancedRungQuestions.ts (2), djangoBatchCExpansionQuestions.ts (6), djangoClozeQuestions.ts (3), djangoGapFillQuestions.ts (2), djangoParsonsQuestions.ts (3), djangoPredictOutputQuestions.ts (3)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_orm_questions: Question[] = [
  {
      id: 'dj-orm-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given an `Employee` model with a `department` (CharField) and a `salary` (DecimalField), write a Django ORM query that groups employees by department, annotates each group with `total_budget` = the sum of salaries, keeps only departments whose `total_budget` exceeds 100000, and orders the results by `total_budget` descending.',
      starterCode: `from django.db.models import Sum\n\n`,
      testCases: [{ input: 'aggregate query', expectedOutput: 'annotate(Sum), filter, order_by', description: 'Should annotate and filter' }],
      solution: `from django.db.models import Sum\n\nresults = Employee.objects.values("department").annotate(\n    total_budget=Sum("salary")\n).filter(\n    total_budget__gt=100000\n).order_by("-total_budget")`,
      explanation: 'values("department") groups by department. annotate(Sum("salary")) adds a computed column. filter(total_budget__gt=100000) filters on the annotation. This is Django\'s equivalent of SELECT department, SUM(salary) GROUP BY department HAVING SUM > 100000.',
      hints: ['values() for GROUP BY', 'annotate() adds computed columns', 'Filter on annotations like regular fields'],
      tieredHints: {
        apiSignature: 'QuerySet.values(*fields).annotate(**aggregates).filter(**kwargs).order_by(*fields)',
        skeleton: 'from django.db.models import ____\n\nresults = Employee.objects.____("department").____(\n    total_budget=____("salary")\n).____(\n    ____=100000\n).____("-total_budget")',
      },
      tags: ['orm', 'annotate', 'aggregate', 'Sum', 'django'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-6',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      question: 'What is the difference between aggregate() and annotate() in Django ORM?',
      options: [
        { id: 'a', text: 'They\'re aliases — annotate() is simply the newer name for aggregate(), kept around for backwards compatibility', isCorrect: false },
        { id: 'b', text: 'aggregate() runs the math inside the database, while annotate() fetches the rows and computes the values in Python', isCorrect: false },
        { id: 'c', text: 'aggregate() collapses the whole queryset into one dict of totals; annotate() adds a computed field to every object in the queryset', isCorrect: true },
        { id: 'd', text: 'annotate() only supports Count, while aggregate() also accepts Sum, Avg, Max and the other aggregate functions', isCorrect: false },
      ],
      explanation: 'aggregate() collapses the entire queryset: Article.objects.aggregate(total=Count("id")) returns {"total": 42}. annotate() adds a field per row: Article.objects.values("author").annotate(count=Count("id")) returns [{author: "Alice", count: 5}, ...].',
      tags: ['orm', 'aggregate', 'annotate', 'django'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Using the Django ORM with an Article model (fields: title, author, is_published, published_date), write three separate queries. Assign each to a variable: `published` = all published articles; `alice_articles` = articles by author "Alice"; `recent` = all articles ordered by published_date descending (newest first).',
      starterCode: `# Django ORM queries\n`,
      testCases: [
        {
          input: 'Article model',
          expectedOutput: 'filter, order_by queries',
          description: 'Should write Django ORM queries',
        },
      ],
      solution: `published = Article.objects.filter(is_published=True)\nalice_articles = Article.objects.filter(author="Alice")\nrecent = Article.objects.order_by("-published_date")`,
      explanation: 'Django ORM: .filter() for WHERE clauses, .order_by() for sorting ("-" prefix for DESC). These return QuerySets which are lazy (not executed until needed). Chain them: Article.objects.filter(is_published=True).order_by("-published_date").',
      hints: ['filter(field=value) for WHERE', 'order_by("-field") for DESC', 'QuerySets are lazy and chainable'],
      tieredHints: {
        apiSignature: 'QuerySet.filter(*q_objects, **kwargs).order_by(*fields)',
        skeleton: '____ = Article.objects.____(is_published=____)\n____ = Article.objects.____(author="____")\n____ = Article.objects.____("____")',
      },
      tags: ['orm', 'queryset', 'filter', 'order_by', 'django'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Using the Django ORM, get articles with titles containing "python" (case-insensitive), exclude articles by author "admin", and get only the first 5.',
      starterCode: `# Advanced ORM queries\n`,
      testCases: [
        {
          input: 'Article model',
          expectedOutput: 'filter(title__icontains), exclude(), [:5]',
          description: 'Should chain ORM lookups',
        },
      ],
      solution: `results = Article.objects.filter(title__icontains="python").exclude(author="admin")[:5]`,
      explanation: 'Field lookups use double underscore: __icontains (case-insensitive contains), __startswith, __gte (>=), __lte (<=), __in, __isnull. exclude() is the opposite of filter(). Slicing [:5] adds LIMIT. All lazy until evaluated.',
      hints: ['__icontains for case-insensitive search', 'exclude() is opposite of filter()', 'Slice [:5] for LIMIT'],
      tieredHints: {
        apiSignature: 'QuerySet.filter(**kwargs).exclude(**kwargs)[start:stop]',
        skeleton: 'results = Article.objects.____(____="python").____(author="admin")[:5]',
      },
      tags: ['orm', 'lookups', 'icontains', 'exclude', 'django'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-adv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Build a \`top_contributors()\` queryset for a "top contributors" page.

  Model: \`Article\` has an \`author\` (ForeignKey to the User model) and a \`created_at\` timestamp. There is no \`related_name\`, so the reverse accessor from User is the default \`article\`.

  Return a queryset of *User* rows (not Article), where each user is annotated with:
  - \`article_count\` — the number of Articles they authored (Count over the reverse relation)
  - \`last_article_at\` — their most recent article's \`created_at\` (Max over the reverse relation)

  Then keep only users with \`article_count\` of at least 3, order by \`article_count\` descending with ties broken by \`last_article_at\` descending, and return only the first 10 rows (Django uses slicing for LIMIT — there is no \`.limit()\`).`,
      starterCode: `from django.contrib.auth import get_user_model
from django.db.models import Count, Max

User = get_user_model()
`,
      testCases: [
        {
          input: 'top contributors with >=3 articles',
          expectedOutput: 'annotate(Count + Max) + filter on annotation + order_by + slice',
          description: 'GROUP BY + HAVING + window-style aggregations',
        },
      ],
      solution: `from django.contrib.auth import get_user_model
from django.db.models import Count, Max

User = get_user_model()


def top_contributors():
    return (
        User.objects
        .annotate(
            article_count=Count("article"),
            last_article_at=Max("article__created_at"),
        )
        .filter(article_count__gte=3)
        .order_by("-article_count", "-last_article_at")
        [:10]
    )`,
      explanation: 'Annotating on the *reverse* relation (User → Article via the lowercased model name) groups by User and aggregates per group — equivalent to SQL `GROUP BY user.id`. `.filter()` AFTER `.annotate()` becomes a `HAVING` clause (filtering on the annotation). Multi-key sort is just multiple args to `order_by`. Slice `[:10]` translates to `LIMIT 10` — no `.limit()` method exists in Django\'s ORM.',
      hints: [
        'annotate then filter = SQL GROUP BY ... HAVING',
        'Reverse FK access: lowercase model name (or related_name)',
        'Max("article__created_at") spans the relation',
        'Slice [:N] for LIMIT, not .limit(N)',
      ],
      tieredHints: {
        apiSignature: 'QuerySet.annotate(**aggregates).filter(**kwargs).order_by(*fields)[start:stop]',
        skeleton: 'from django.contrib.auth import ____\nfrom django.db.models import ____, ____\n\nUser = ____()\n\n\ndef top_contributors():\n    return (\n        User.____\n        .____(\n            article_count=____("____"),\n            last_article_at=____("____"),\n        )\n        .____(____=3)\n        .____("____", "____")\n        [:10]\n    )',
      },
      tags: ['django', 'orm', 'annotate', 'aggregate', 'group-by', 'having', 'advanced'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-adv-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Build an \`above_average_articles()\` function that returns the Articles whose comment count is greater than the average comment count across all articles, ordered by comment count descending. Do the counting and comparison in SQL — no Python-side iteration or counting.

  Approach: first compute the global average per-article comment count with an \`aggregate\`, then annotate each Article with \`comment_count\` and \`filter\` to those above that average.

  \`Comment\` has a ForeignKey \`article\` to \`Article\` with no custom \`related_name\`, so aggregate over the reverse span \`"comment"\` (e.g. \`Count("comment")\`). Use \`Count\` and \`Avg\` from django.db.models. Coalesce the average to 0 when the table is empty.`,
      starterCode: `from django.db.models import Avg, Count
from .models import Article
`,
      testCases: [
        {
          input: 'articles with above-average comment counts',
          expectedOutput: 'annotate(Count) + filter against aggregated avg via single queryset',
          description: 'Subquery / annotation against a global aggregate',
        },
      ],
      solution: `from django.db.models import Avg, Count
from .models import Article


def above_average_articles():
    avg = Article.objects.annotate(c=Count("comment")).aggregate(a=Avg("c"))["a"] or 0
    return (
        Article.objects
        .annotate(comment_count=Count("comment"))
        .filter(comment_count__gt=avg)
        .order_by("-comment_count")
    )`,
      explanation: 'Two-step pattern: first compute the global average comment count with `aggregate` (single COUNT/AVG round-trip), then filter the per-article annotated queryset against it. `aggregate` returns a dict; pull the value out and coalesce to 0 when the table is empty (`avg` would be `None`). The result is one SQL query for the average, one for the filtered list — much cheaper than fetching all annotated rows into Python and filtering there. For a fully single-query version, you\'d use `Subquery(Article.objects...)` in a `filter` — but the two-query pattern reads cleaner and is plenty fast at typical table sizes.',
      hints: [
        'aggregate gives a single dict; annotate gives per-row values',
        'AVG over an empty set is None — coalesce to 0',
        'annotate then filter on the annotation works at SQL HAVING level',
      ],
      tieredHints: {
        apiSignature: 'QuerySet.annotate(**aggregates).aggregate(**aggregates)',
        skeleton: 'from django.db.models import ____, ____\nfrom .models import Article\n\n\ndef above_average_articles():\n    avg = Article.objects.____(c=____("comment")).____(a=____("c"))["a"] or 0\n    return (\n        Article.objects\n        .____(comment_count=____("comment"))\n        .____(____=avg)\n        .____("-comment_count")\n    )',
      },
      tags: ['django', 'orm', 'aggregate', 'annotate', 'subquery', 'advanced'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-queryset-manager-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Give `Product` a chainable custom filter: `Product.objects.in_stock().cheap()` should both work. Fill in the base class the custom QuerySet extends, and the classmethod call that turns it into the model\'s manager.',
      template: `class ProductQuerySet(models.___):
    def in_stock(self):
        return self.filter(in_stock=True)

    def cheap(self):
        return self.filter(price__lt=10)

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    in_stock = models.BooleanField(default=True)

    objects = ProductQuerySet.___()`,
      blanks: ['QuerySet', 'as_manager'],
      solution: 'class ProductQuerySet(models.QuerySet):\n    def in_stock(self):\n        return self.filter(in_stock=True)\n\n    def cheap(self):\n        return self.filter(price__lt=10)\n\nclass Product(models.Model):\n    name = models.CharField(max_length=200)\n    price = models.DecimalField(max_digits=6, decimal_places=2)\n    in_stock = models.BooleanField(default=True)\n\n    objects = ProductQuerySet.as_manager()',
      explanation: 'Subclassing `models.QuerySet` and exposing it via `SubclassedQuerySet.as_manager()` is what makes custom filter methods chainable: `Product.objects.in_stock().cheap()`. Defining the same methods on a `Manager` subclass instead would break chaining — a `Manager` method doesn\'t return another `Manager`, so `.in_stock()` would return a plain QuerySet with no `.cheap()` on it. `as_manager()` builds a manager class from the QuerySet automatically, keeping every method chainable all the way down.',
      hints: ['Custom QuerySets subclass models.QuerySet', 'as_manager() turns the QuerySet class into a chainable manager'],
      tags: ['django', 'orm', 'QuerySet', 'as_manager', 'cloze'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-adv-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Build an \`Article\` model that combines three production patterns:

  1. A custom QuerySet exposing two chainable filters: \`published()\` narrows to status="published", and \`recent(days=7)\` (the \`days\` keyword defaulting to 7) narrows to articles created within the last N days. Hook it up so the model's default manager exposes both as chainable on \`Article.objects\` (e.g. \`Article.objects.published().recent(days=7)\`).
  2. The primary key is a UUID (not the default auto-incrementing integer).
  3. A read-only \`is_recent\` attribute on each instance returns True iff the article was created within the last 24 hours, evaluated against the current time.

  The model also has \`title\` (CharField, max 200), \`status\` (CharField, max 20), and \`created_at\` (auto_now_add).`,
      starterCode: `import uuid
from datetime import timedelta
from django.db import models
from django.utils import timezone
`,
      testCases: [
        {
          input: 'Article.objects.published().recent(days=7)',
          expectedOutput: 'chainable QuerySet via as_manager() + UUID pk + computed property',
          description: '3 production patterns combined',
        },
      ],
      solution: `import uuid
from datetime import timedelta
from django.db import models
from django.utils import timezone


class ArticleQuerySet(models.QuerySet):
    def published(self):
        return self.filter(status="published")

    def recent(self, days=7):
        cutoff = timezone.now() - timedelta(days=days)
        return self.filter(created_at__gte=cutoff)


class Article(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = ArticleQuerySet.as_manager()

    @property
    def is_recent(self):
        return timezone.now() - self.created_at < timedelta(hours=24)`,
      explanation: 'Custom `QuerySet.as_manager()` is the modern way to make filter methods chainable — defining them on a `Manager` instead would break chaining (you can\'t call `Article.objects.published().recent()`). UUID primary keys hide row counts from clients and avoid integer-enumeration attacks; pass `default=uuid.uuid4` (the function itself, not a call). `@property` exposes computed values without storing them — useful for "derived from `created_at`" facts the DB doesn\'t need to know.',
      hints: [
        'Custom QuerySet + as_manager() = chainable filters',
        'UUID default takes the callable, not uuid.uuid4()',
        '@property for computed-from-other-fields values',
        'timezone.now(), not datetime.now()',
      ],
      tieredHints: {
        apiSignature: 'QuerySet.as_manager() -> Manager',
        skeleton: 'import uuid\nfrom datetime import ____\nfrom django.db import ____\nfrom django.utils import ____\n\n\nclass ArticleQuerySet(models.____):\n    def ____(self):\n        return self.____(____="____")\n\n    def ____(self, days=7):\n        cutoff = timezone.____() - ____(days=days)\n        return self.____(____=cutoff)\n\n\nclass Article(models.____):\n    id = models.____(primary_key=True, default=uuid.____, editable=False)\n    title = models.____(____=200)\n    status = models.____(____=20)\n    created_at = models.____(____=True)\n\n    objects = ArticleQuerySet.____()\n\n    @____\n    def ____(self):\n        return timezone.____() - self.____ < ____(hours=24)',
      },
      tags: ['django', 'orm', 'QuerySet', 'as_manager', 'UUIDField', 'property', 'advanced'],
      concepts: ['dj-model-construction', 'dj-orm-query-construction'],
    },
  {
      id: 'py-dj-orm-select-related',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
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
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use `prefetch_related` with `"tags"` for a many-to-many reverse lookup. Given a `Post` model whose `tags` attribute is a `ManyToManyField` to `Tag`, fetch all posts with the tags prefetched — one additional query TOTAL, not per post. Iterate the queryset inside a `run` function and for each post print a line of the form `"<title>: <comma-separated tag names>"` — build the tag name list by joining the `name` of each tag in `post.tags.all()` with `", "`.',
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
      explanation: '`prefetch_related` does two queries (one for the main model, one for the related table) and matches them in Python — works for M2M, reverse FK, reverse OneToOne. Without it, `post.tags.all()` fires per iteration. Can be composed with `select_related` in the same queryset: `.select_related("author").prefetch_related("tags", "comments__user")`. For complex filtering of prefetches, use `Prefetch(...)` objects.',
      hints: [
        'prefetch_related for M2M and reverse FK',
        'Two queries total — not per parent',
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
      id: 'py-dj-orm-f',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Increment a counter ATOMICALLY using an `F()` expression. Import `F` from `django.db.models`. Write `bump(pk)` that increments the `Product`\'s `view_count` by 1 so the increment runs in SQL (`UPDATE ... SET view_count = view_count + 1`) without a read-modify-write race. Without `F()`, two concurrent requests could both read 5, both compute 6, both save 6 — losing one increment.',
      starterCode: `# Write bump(pk): atomically increment the Product's view_count by 1
# in a single SQL UPDATE, with no Python-side read-modify-write.
`,
      testCases: [
        {
          input: 'F() atomic increment',
          expectedOutput: 'SQL: UPDATE SET view_count = view_count + 1 — no Python read',
          description: 'Race-safe increment without locking',
        },
      ],
      solution: `from django.db.models import F
from .models import Product

def bump(pk):
    Product.objects.filter(pk=pk).update(view_count=F("view_count") + 1)`,
      explanation: '`F("field")` refers to the current DB value in an expression that the ORM compiles into SQL. No read-modify-write round trip. Essential for: counters, timestamps, balance adjustments, any "increment by X" operation. Works in `.update()`, `.annotate()`, `.filter()` (`F("price") > F("cost")` — items where price > cost). Use `F() + F()` combinations for composite updates.',
      hints: [
        'F("field") = server-side reference to the field value',
        'Update runs in SQL — no Python-level race',
        'Also works in filter() and annotate()',
      ],
      tieredHints: {
        apiSignature: 'F(name) -> F',
        skeleton: 'from django.db.models import ____\nfrom .models import ____\n\ndef bump(pk):\n    Product.____.____(pk=pk).____(____=____("____") + 1)',
      },
      tags: ['django', 'orm', 'F-expression', 'atomic'],
      concepts: ['dj-orm-query-construction', 'dj-transaction-atomic'],
    },
  {
      id: 'py-dj-orm-q',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use `Q()` for OR queries. Import `Q` from `django.db.models`. Write a queryset that finds `Post` rows where `title` contains "django" OR `body` contains "django" (case-insensitive). `Q` objects compose with `|` (OR), `&` (AND), and `~` (NOT) — plain `filter()` kwargs can only AND.',
      starterCode: `# Build a queryset of Posts where title OR body contains "django"
# (case-insensitive), using Q objects to express the OR.
`,
      testCases: [
        {
          input: 'Q() for OR across fields',
          expectedOutput: 'qs matches posts where title OR body contains "django"',
          description: 'Q objects + | & ~ operators',
        },
      ],
      solution: `from django.db.models import Q
from .models import Post

qs = Post.objects.filter(
    Q(title__icontains="django") | Q(body__icontains="django")
)`,
      explanation: 'Normal `filter()` kwargs are AND-combined — there\'s no way to express OR that way. `Q()` objects are composable query atoms: `Q(a=1) | Q(b=2)` means `WHERE a=1 OR b=2`. Combine with `&`, negate with `~Q(...)`. Used heavily in search (multiple fields), permission checks (OR-ing rules), complex filters. Can be nested arbitrarily.',
      hints: [
        'Q objects are composable: | (OR), & (AND), ~ (NOT)',
        'Default kwargs filtering is AND-only — Q enables OR',
        'Parenthesise when mixing operators',
      ],
      tieredHints: {
        apiSignature: 'Q(*args, **kwargs)',
        skeleton: 'from django.db.models import ____\nfrom .models import Post\n\nqs = Post.____.____(\n    ____(____="____") ____ ____(____="____")\n)',
      },
      tags: ['django', 'orm', 'Q-object', 'filter'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'py-dj-orm-aggregate-annotate',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Compute the count of posts per author using `annotate`. Import `Count` from `django.db.models` and `User` from `django.contrib.auth.models`. Given a `Post` model with a `ForeignKey` to `User` named `author`, build a queryset over all users that annotates each row with a `post_count` derived from counting related `"post"` rows, ordered descending by that count. Grab the first user from the queryset and print a line of the form `"<username> (<post_count>)"`.',
      starterCode: `# Annotate every User with post_count (number of related posts),
# order by that count descending, take the first user, and print
# "<username> (<post_count>)".
`,
      testCases: [
        {
          input: 'annotate with Count',
          expectedOutput: 'Each user decorated with post_count; sorted desc',
          description: 'annotate adds a computed column; aggregate collapses to a single dict',
        },
      ],
      solution: `from django.db.models import Count
from django.contrib.auth.models import User

qs = User.objects.annotate(post_count=Count("post")).order_by("-post_count")
top = qs.first()
print(f"{top.username} ({top.post_count})")`,
      explanation: '`annotate(**kwargs)` decorates EACH row with computed values — perfect for per-group counts/sums/averages. `aggregate(**kwargs)` collapses the whole queryset to a single dict (overall stats). Other aggregates: `Sum`, `Avg`, `Min`, `Max`, `StdDev`. `Count("post")` uses the default reverse-FK name (`user.post_set`); `Count("post", filter=Q(published=True))` counts only matching rows.',
      hints: [
        'annotate: per-row computed column',
        'aggregate: single collapsed dict',
        'Count / Sum / Avg / Min / Max with optional filter=Q(...)',
      ],
      tieredHints: {
        apiSignature: 'QuerySet.annotate(**aggregates).order_by(*fields)',
        skeleton: 'from django.db.models import ____\nfrom django.contrib.auth.models import User\n\nqs = User.objects.____(post_count=____("post")).____("-post_count")\ntop = qs.____()\nprint(f"{top.____} ({top.____})")',
      },
      tags: ['django', 'orm', 'aggregate', 'annotate'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'py-dj-orm-select-vs-prefetch',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
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
      id: 'dj-orm-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fetch published Articles, newest first, only the first 10.',
      template: `articles = (
    Article.objects
    .___(status="published")
    .___("-created_at")
    [:___]
)`,
      blanks: ['filter', 'order_by', '10'],
      solution: 'articles = (\n    Article.objects\n    .filter(status="published")\n    .order_by("-created_at")\n    [:10]\n)',
      explanation: 'Querysets are built with `.filter()` (WHERE), `.order_by()` (ORDER BY), and Python slicing (LIMIT). There\'s no `.limit()` method — Pythonic slicing translates to SQL LIMIT/OFFSET.',
      hints: ['filter for WHERE, order_by for ORDER BY', 'Slice [:N] for LIMIT'],
      tags: ['django', 'orm', 'filter', 'order_by', 'slice', 'cloze'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
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
      id: 'dj-orm-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Increment Article.view_count by 1 atomically (no read-modify-write race).',
      template: `from django.db.models import ___

Article.objects.filter(pk=pk).update(view_count=___("view_count") + 1)`,
      blanks: ['F', 'F'],
      solution: 'from django.db.models import F\n\nArticle.objects.filter(pk=pk).update(view_count=F("view_count") + 1)',
      explanation: '`F("view_count")` references the column itself — the increment becomes a single `UPDATE ... SET view_count = view_count + 1` in SQL, atomic at the DB. Without F, you\'d read into Python (`a.view_count + 1`) and write back, losing increments under concurrent writes.',
      hints: ['F objects reference DB columns', 'Pushes the math down into SQL'],
      tags: ['django', 'orm', 'F', 'atomic-update', 'cloze'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      question: 'What is the Django ORM?\n\nORM stands for Object-Relational Mapping. It is the layer between your Python code and the database.',
      options: [
        {
          id: 'a',
          text: 'A separate database engine built into Django that replaces external servers like PostgreSQL or MySQL',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'A command-line tool bundled with manage.py for writing raw SQL queries directly against the database',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'A template engine that pulls rows out of the database and renders them straight into HTML pages',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Object-Relational Mapping — Python code talks to the database instead of raw SQL',
          isCorrect: true,
        },
      ],
      explanation: 'The Django ORM translates Python code into SQL behind the scenes. When you define a model class (e.g., class Article), Django creates a database table. Each instance of Article represents a row, and each attribute (title, content) maps to a column. You write Python like Article.objects.filter(title="Hello") and Django converts it to SELECT * FROM article WHERE title = \'Hello\'. This means you can switch databases (SQLite to PostgreSQL) without changing your code.',
      hints: [
        'ORM = Object-Relational Mapping: objects in Python map to relations (tables) in the database',
        'You write Python; Django writes the SQL for you',
      ],
      tags: ['django', 'orm', 'database', 'basics', 'models'],
      concepts: ['dj-orm-query-construction', 'dj-model-construction'],
    },
  {
      id: 'dj-orm-gap-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given an existing model `Article` with fields title (CharField), content (TextField), and published_date (DateField), write ORM queries to:\n1. Get all articles\n2. Get the article with id=5\n3. Create a new article with title="My Post", content="Hello world", published_date="2025-01-15"\n4. Delete the article with id=5\n\nAssume the Article model is already imported.',
      starterCode: `# The Article model is already imported
# Write 4 separate ORM queries below:

# 1. Get all articles

# 2. Get the article with id=5

# 3. Create a new article

# 4. Delete the article with id=5

`,
      testCases: [
        {
          input: 'Basic ORM queries',
          expectedOutput: 'Article.objects.all(), .get(id=5), .create(...), .delete()',
          description: 'Should demonstrate all(), get(), create(), and delete() ORM operations',
        },
      ],
      solution: `# The Article model is already imported
# Write 4 separate ORM queries below:

# 1. Get all articles
all_articles = Article.objects.all()

# 2. Get the article with id=5
article = Article.objects.get(id=5)

# 3. Create a new article
new_article = Article.objects.create(
    title="My Post",
    content="Hello world",
    published_date="2025-01-15"
)

# 4. Delete the article with id=5
article = Article.objects.get(id=5)
article.delete()`,
      explanation: 'These are the four fundamental ORM operations. objects.all() returns a QuerySet of every row. objects.get(id=5) returns exactly one object (raises DoesNotExist if missing, MultipleObjectsReturned if duplicates). objects.create() inserts a new row and returns the object. To delete, you first retrieve the object with get(), then call .delete() on the instance. You can also do Article.objects.filter(id=5).delete() to delete without fetching first.',
      hints: [
        'The manager "objects" is the entry point: Article.objects',
        'get() returns one object; all() and filter() return QuerySets',
        'To delete, you need the object instance first, then call .delete() on it',
      ],
      tieredHints: {
        apiSignature: 'Model.objects.create(**kwargs)',
        skeleton: '____ = Article.____.____()\n____ = Article.____.____(id=5)\n____ = Article.____.____(\n    title="My Post",\n    content="Hello world",\n    published_date="2025-01-15"\n)\n____ = Article.____.____(id=5)\n____.____()',
      },
      tags: ['django', 'orm', 'queryset', 'crud', 'basics'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `Article` model, fetch published articles ordered by newest first, limited to 10. Build a single chained queryset.',
      correctOrder: [
        'articles = (',
        '    Article.objects',
        '    .filter(status="published")',
        '    .order_by("-created_at")',
        '    [:10]',
        ')',
      ],
      distractorLines: [
        '    Article.filter(status="published")',
        '    .order_by("created_at")',
        '    .limit(10)',
        '    .first(10)',
      ],
      solution: 'articles = (\n    Article.objects\n    .filter(status="published")\n    .order_by("-created_at")\n    [:10]\n)',
      explanation: 'Querysets chain through the default manager `objects`. `.filter()` adds WHERE clauses; `.order_by("-x")` sorts descending; Python slice `[:10]` translates to SQL `LIMIT 10`. The ORM has no `.limit()` method — you slice. Querysets are lazy: no SQL runs until you iterate, slice in a way that evaluates, or call `list()`.',
      hints: ['Start with Model.objects', 'Slice [:N], not .limit(N)', 'order_by with - is descending'],
      tags: ['django', 'orm', 'filter', 'order_by', 'parsons'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Avoid the N+1 problem: fetch all comments and access `comment.article.title` for each without one query per comment. Use the queryset method that JOINs ForeignKey targets.',
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
      explanation: '`select_related` does an SQL JOIN and pulls related rows in the same query — for ForeignKey and OneToOne. `prefetch_related` issues a separate query and joins in Python — for ManyToMany and reverse FK. Without either, accessing `c.article.title` triggers one extra SELECT per comment (the N+1 problem).',
      hints: ['select_related for FK/OneToOne', 'prefetch_related for M2M / reverse FK', 'No JOIN method called .join'],
      tags: ['django', 'orm', 'select_related', 'n-plus-one', 'parsons'],
      concepts: ['dj-orm-query-construction', 'dj-select-related-vs-prefetch', 'dj-n-plus-one'],
    },
  {
      id: 'dj-orm-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Annotate each Article with its comment count and order by that count descending. Use Count from django.db.models.',
      correctOrder: [
        'from django.db.models import Count',
        '',
        'articles = (',
        '    Article.objects',
        '    .annotate(num_comments=Count("comment"))',
        '    .order_by("-num_comments")',
        ')',
      ],
      distractorLines: [
        'from django.db import Count',
        '    .aggregate(num_comments=Count("comment"))',
        '    .order_by("-Count(comment)")',
        '    .annotate(Count("comment"))',
      ],
      solution: 'from django.db.models import Count\n\narticles = (\n    Article.objects\n    .annotate(num_comments=Count("comment"))\n    .order_by("-num_comments")\n)',
      explanation: '`annotate` adds a per-row computed column you can filter/order by; `aggregate` collapses the whole queryset to a single dict. `Count("comment")` follows the reverse relation (lowercased model name by default). The annotation is named via the kwarg, so `.order_by("-num_comments")` works.',
      hints: ['Count comes from django.db.models', 'annotate adds a column; aggregate collapses', 'Lowercase model name follows reverse FK'],
      tags: ['django', 'orm', 'annotate', 'Count', 'parsons'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this print? (Assume 5 published articles in the DB.)',
      code: `qs = Article.objects.filter(status="published")
qs = qs.order_by("-created_at")
print("Built queryset")
articles = list(qs)
print("Materialized")`,
      expectedOutput: `Built queryset
Materialized`,
      explanation: 'Querysets are LAZY. `.filter()` and `.order_by()` build up the query object but issue zero SQL. The query runs only when iterated, sliced for length, or coerced (`list()`, `bool()`, `len()`). So this prints both lines with exactly one SELECT executed at `list(qs)`.',
      hints: ['Lazy evaluation: SQL fires on materialization', 'list() / for / bool() / len() trigger execution'],
      tags: ['django', 'orm', 'lazy', 'queryset', 'predict'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this print? The Article rows are shown in the comment table.',
      code: `# Article table:
#   id | status
#   ---+-----------
#    1 | published
#    2 | published
#    3 | published
#    4 | published
#    5 | draft
#    6 | draft
from django.db.models import Q

qs = Article.objects.filter(Q(status="published") | Q(status="draft"))
print(qs.count())

# Chaining .filter() ANDs the conditions: status == "published" AND status == "draft"
qs2 = Article.objects.filter(status="published").filter(status="draft")
print(qs2.count())`,
      expectedOutput: `6
0`,
      explanation: '`Q` objects with `|` build OR clauses, so `qs` matches all 6 published+draft rows. Chaining `.filter().filter()` ANDs the conditions — `status="published"` AND `status="draft"` is impossible for one row, so `qs2` returns 0. (Passing `status=` twice as kwargs in a single `.filter()` is a `SyntaxError`, not a query.) Use `Q()` for OR, `~Q()` for NOT, and `&` to combine explicitly.',
      hints: ['Q objects with | for OR', 'Multiple kwargs in filter() = AND', 'A row cannot match both statuses'],
      tags: ['django', 'orm', 'Q', 'OR-vs-AND', 'predict'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this print? Article has a reverse FK `comments` (from Comment, related_name="comments"). The Comment rows for the queried article are shown in the comment table.',
      code: `# Comment table (all have article_id = 1):
#   id | approved
#   ---+---------
#    1 | True
#    2 | True
#    3 | False
#    4 | False
#    5 | False
article = Article.objects.get(pk=1)
print(type(article.comments.all()).__name__)
print(article.comments.count())
print(article.comments.filter(approved=True).count())`,
      expectedOutput: `QuerySet
5
2`,
      explanation: 'Reverse FK accessors return *managers*, so `.all()`, `.filter()`, `.count()` all work. `count()` is a separate SQL `SELECT COUNT(*)`. The third line returns 2 because only 2 of the 5 comments have `approved=True`. Note: `article.comments` only works if the FK has `related_name="comments"`; otherwise it would be `article.comment_set`.',
      hints: ['Reverse FK gives a Manager-like API', 'count() always issues fresh SQL', 'related_name configures the accessor'],
      tags: ['django', 'orm', 'reverse-fk', 'related_name', 'predict'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Atomically increment the view_count of the Article with pk=5 by 1, doing the add in SQL (not a Python read-modify-write). Import the expression helper, then run the update.',
      correctOrder: [
        'from django.db.models import F',
        '',
        'Article.objects.filter(pk=5).update(view_count=F("view_count") + 1)',
      ],
      distractorLines: [
        'Article.objects.filter(pk=5).update(view_count=view_count + 1)',
        'from django.db import F',
      ],
      solution:
        'from django.db.models import F\n\nArticle.objects.filter(pk=5).update(view_count=F("view_count") + 1)',
      explanation:
        'F("view_count") refers to the column\'s current DB value, so the increment compiles to UPDATE ... SET view_count = view_count + 1 — one statement, no race. Plain `view_count + 1` would need a Python read first (lost-update bug). F lives in django.db.models, not django.db.',
      hints: ['F() comes from django.db.models; it references the live column value.'],
      tags: ['django', 'orm', 'F-expression', 'atomic'],
      concepts: ['dj-orm-query-construction', 'dj-transaction-atomic'],
    },
  {
      id: 'dj-orm-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Find Posts whose title OR body contains "django" (case-insensitive). Import the query-object helper, then build the filter.',
      correctOrder: [
        'from django.db.models import Q',
        '',
        'qs = Post.objects.filter(Q(title__icontains="django") | Q(body__icontains="django"))',
      ],
      distractorLines: [
        'qs = Post.objects.filter(title__icontains="django" | body__icontains="django")',
        'from django.db.models import F',
      ],
      solution:
        'from django.db.models import Q\n\nqs = Post.objects.filter(Q(title__icontains="django") | Q(body__icontains="django"))',
      explanation:
        'Plain filter() kwargs are AND-only; Q objects are composable atoms you combine with | (OR), & (AND), ~ (NOT). You must wrap each condition in Q(...) — you cannot | two bare keyword arguments.',
      hints: ['Wrap each condition in Q(...); combine with |.'],
      tags: ['django', 'orm', 'Q-object', 'filter'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the manager method that builds AND saves a new row in a single call.',
      template: `article = Article.objects.___(title="Hello", author="Alice")`,
      blanks: ['create'],
      solution:
        'article = Article.objects.create(title="Hello", author="Alice")',
      explanation:
        'objects.create(**fields) instantiates and saves in one step (it calls .save() for you). The two-step form is Article(title=...) then article.save().',
      hints: ['One call that constructs and persists.'],
      tags: ['django', 'orm', 'create'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the method that returns exactly ONE object by primary key (and raises DoesNotExist if there is no match).',
      template: `article = Article.objects.___(pk=5)`,
      blanks: ['get'],
      solution: 'article = Article.objects.get(pk=5)',
      explanation:
        'get() returns a single instance, raising DoesNotExist if none match or MultipleObjectsReturned if more than one. Use filter() when you expect zero-or-many (it returns a QuerySet, never raises for "not found").',
      hints: ['Single-object fetch, raises if missing.'],
      tags: ['django', 'orm', 'get'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in (1) the field lookup for a case-insensitive "contains" match on title, and (2) the method that is the opposite of filter() (drops matching rows).',
      template: `qs = Article.objects.filter(___="python").___(author="admin")`,
      blanks: ['title__icontains', 'exclude'],
      solution:
        'qs = Article.objects.filter(title__icontains="python").exclude(author="admin")',
      explanation:
        'Field lookups use the double-underscore suffix: title__icontains is a case-insensitive LIKE. exclude() is the inverse of filter() — it removes rows that match. They chain because each returns a QuerySet.',
      hints: ['field__<lookup> for case-insensitive contains; the inverse of filter().'],
      tags: ['django', 'orm', 'lookups', 'exclude'],
      concepts: ['dj-orm-query-construction'],
    },
  // ===== In-place advanced depth (single-skill ORM primitives) =====
  // Case/When — conditional expressions
  {
      id: 'dj-orm-case-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in (1) the conditional-expression constructor and (2) its per-branch keyword, to label each Order "big" or "small" by its total.',
      template: `orders = Order.objects.annotate(
    tier=___(
        ___(total__gte=100, then=Value("big")),
        default=Value("small"),
        output_field=CharField(),
    ),
)`,
      blanks: ['Case', 'When'],
      solution: 'orders = Order.objects.annotate(\n    tier=Case(\n        When(total__gte=100, then=Value("big")),\n        default=Value("small"),\n        output_field=CharField(),\n    ),\n)',
      explanation: '`Case` is an SQL CASE expression; each `When(condition, then=...)` is a WHEN branch, with `default=` as ELSE. It compiles to a single SQL expression evaluated per row — no Python loop. `output_field` is required when Django can\'t infer the result type. Use it to bucket, score, or relabel rows inside the database.',
      hints: ['CASE expression wrapper, then its branch constructor', 'When(condition, then=Value(...))'],
      tags: ['django', 'orm', 'Case', 'When', 'conditional', 'cloze'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-case-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Annotate each Order with a `tier` of "big" when total >= 100, else "small", using a single SQL conditional expression. Import the helpers, then build the annotation.',
      correctOrder: [
        'from django.db.models import Case, When, Value, CharField',
        '',
        'orders = Order.objects.annotate(',
        '    tier=Case(',
        '        When(total__gte=100, then=Value("big")),',
        '        default=Value("small"),',
        '        output_field=CharField(),',
        '    ),',
        ')',
      ],
      distractorLines: [
        '    tier=When(',
        '        Case(total__gte=100, then=Value("big")),',
        '        When(total__gte=100, then="big"),',
      ],
      solution: 'from django.db.models import Case, When, Value, CharField\n\norders = Order.objects.annotate(\n    tier=Case(\n        When(total__gte=100, then=Value("big")),\n        default=Value("small"),\n        output_field=CharField(),\n    ),\n)',
      explanation: '`Case` wraps the branches; `When(cond, then=...)` is each branch; `default=` is the ELSE. `then=Value("big")` wraps the literal so the ORM treats it as a value, not a column name. The whole thing is one SQL CASE expression evaluated server-side per row.',
      hints: ['Case is the outer wrapper, When is each branch', 'Wrap literal results in Value(...)'],
      tags: ['django', 'orm', 'Case', 'When', 'parsons'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-case-adv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'In a SINGLE aggregate query (one database round trip, no Python-side counting), compute both how many Articles have status "published" and how many have status "draft". Return the result as a dict with keys `published` and `draft`. `Article` has a `status` CharField.',
      starterCode: `# One aggregate() call that returns {"published": <n>, "draft": <n>}.
`,
      testCases: [
        {
          input: 'conditional aggregation in one pass',
          expectedOutput: 'single aggregate with per-status conditional counts',
          description: 'Count published vs draft without two queries',
        },
      ],
      solution: `from django.db.models import Count, Q

stats = Article.objects.aggregate(
    published=Count("id", filter=Q(status="published")),
    draft=Count("id", filter=Q(status="draft")),
)
# OR
from django.db.models import Sum, Case, When, IntegerField

stats = Article.objects.aggregate(
    published=Sum(Case(When(status="published", then=1), default=0, output_field=IntegerField())),
    draft=Sum(Case(When(status="draft", then=1), default=0, output_field=IntegerField())),
)`,
      explanation: 'Conditional aggregation collapses what looks like two queries into one. The modern form is `Count("id", filter=Q(...))` — a FILTER (WHERE) clause attached to the aggregate. The older, equally valid form sums a `Case/When` that yields 1 or 0 per row. Both run as one `SELECT` with two computed columns — far cheaper than two separate `COUNT` queries or any Python loop.',
      hints: [
        'aggregate() can take more than one keyed aggregate at once',
        'Count(..., filter=Q(...)) attaches a per-aggregate WHERE',
        'The Sum(Case(When(... then=1), default=0)) form is equivalent',
      ],
      tieredHints: {
        apiSignature: 'Count(expression, distinct=False, filter=None, **extra)',
        skeleton: 'from django.db.models import ____, ____\n\nstats = Article.objects.____(\n    published=____("id", filter=____(status="published")),\n    draft=____("id", filter=____(status="draft")),\n)',
      },
      tags: ['django', 'orm', 'aggregate', 'Case', 'conditional', 'advanced'],
      concepts: ['dj-orm-query-construction'],
    },
  // Subquery / OuterRef — correlated subqueries
  {
      id: 'dj-orm-subquery-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      question: 'When do you reach for `Subquery` / `OuterRef` instead of a plain `annotate(Count(...))` or a join?',
      options: [
        { id: 'a', text: 'When you need a scalar pulled from a specific related row chosen by ordering (e.g. each author\'s latest article title) — an aggregate can\'t pick one row and a join would multiply rows', isCorrect: true },
        { id: 'b', text: 'Never in modern Django — `Subquery` is a legacy API and every correlated query is now expressed with `annotate` and `aggregate` over related managers instead', isCorrect: false },
        { id: 'c', text: 'Only on PostgreSQL — `Subquery` and `OuterRef` compile to window functions that SQLite and MySQL backends are unable to execute at all', isCorrect: false },
        { id: 'd', text: 'Whenever you filter across a relation — `OuterRef` is required for any `__` lookup that spans a ForeignKey from the outer model to a related one', isCorrect: false },
      ],
      explanation: '`Subquery` + `OuterRef` express a *correlated* subquery: the inner query references a column of the outer row (`OuterRef("pk")`). That\'s what lets you pull "the latest related row\'s X" per outer row — something `Count`/`Sum` (which collapse to one number) and joins (which multiply rows for one-to-many) cannot do cleanly. Wrap `inner.values("field")[:1]` in `Subquery(...)` to return a single scalar.',
      hints: [
        'OuterRef references the outer row from inside the subquery',
        'Aggregates collapse; subqueries can pick a specific row',
        'inner.values("x")[:1] wrapped in Subquery() = one scalar',
      ],
      tags: ['django', 'orm', 'Subquery', 'OuterRef'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-subquery-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in (1) the helper that references the outer row\'s pk from inside the inner query, and (2) the wrapper that turns the inner query into a scalar annotation.',
      template: `latest = Comment.objects.filter(article=___("pk")).order_by("-created_at")

articles = Article.objects.annotate(
    latest_comment=___(latest.values("body")[:1])
)`,
      blanks: ['OuterRef', 'Subquery'],
      solution: 'latest = Comment.objects.filter(article=OuterRef("pk")).order_by("-created_at")\n\narticles = Article.objects.annotate(\n    latest_comment=Subquery(latest.values("body")[:1])\n)',
      explanation: '`OuterRef("pk")` defers to the outer `Article` row\'s primary key — it only resolves once nested inside a `Subquery`. The inner queryset is ordered and sliced to one row, then `.values("body")[:1]` projects a single column so `Subquery(...)` yields one scalar per outer row.',
      hints: ['Outer-row reference, then the scalar wrapper', 'inner.values("col")[:1] inside the wrapper'],
      tags: ['django', 'orm', 'Subquery', 'OuterRef', 'cloze'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-subquery-adv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Annotate every User with the title of their most recent Article, under a field named `latest_title`, using a correlated subquery — no Python loops and no extra query per user. `Article` has `author` (ForeignKey to User) and `created_at`.',
      starterCode: `# Annotate each User with latest_title = title of their newest Article.
`,
      testCases: [
        {
          input: 'per-row scalar from latest related row',
          expectedOutput: 'Subquery(OuterRef) annotation, no N+1',
          description: 'Correlated subquery picking one related row',
        },
      ],
      solution: `from django.db.models import OuterRef, Subquery
from django.contrib.auth.models import User
from .models import Article

newest = Article.objects.filter(author=OuterRef("pk")).order_by("-created_at")
users = User.objects.annotate(
    latest_title=Subquery(newest.values("title")[:1])
)`,
      explanation: 'The inner queryset filters Articles to the current user via `OuterRef("pk")`, orders newest-first, and projects a single column with `.values("title")[:1]`. Wrapped in `Subquery(...)`, it becomes one scalar per user, evaluated entirely in SQL. This is the canonical "latest related row" pattern that aggregates can\'t express and a join would duplicate rows for.',
      hints: [
        'OuterRef("pk") ties the inner query to each outer User',
        'order_by then values("title")[:1] selects the one title',
        'Subquery() turns that into a per-row scalar annotation',
      ],
      tieredHints: {
        apiSignature: 'Subquery(queryset, output_field=None)',
        skeleton: 'from django.db.models import ____, ____\nfrom django.contrib.auth.models import User\nfrom .models import Article\n\nnewest = Article.____.____(author=____("____")).____("-created_at")\nusers = User.____.____(\n    latest_title=____(newest.____("____")[:1])\n)',
      },
      tags: ['django', 'orm', 'Subquery', 'OuterRef', 'advanced'],
      concepts: ['dj-orm-query-construction', 'dj-n-plus-one'],
    },
  // exists() — efficient existence checks
  {
      id: 'dj-orm-exists-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the queryset method that returns a boolean for "does any matching row exist" without fetching the rows.',
      template: `if Article.objects.filter(slug="intro").___():
    print("taken")`,
      blanks: ['exists'],
      solution: 'if Article.objects.filter(slug="intro").exists():\n    print("taken")',
      explanation: '`.exists()` issues a cheap `SELECT 1 ... LIMIT 1` and returns True/False — it never pulls the rows into Python. Prefer it over `if qs:` (which evaluates and caches the whole queryset) or `qs.count() > 0` (which counts every row) when you only care whether *any* match exists.',
      hints: ['Boolean existence check, no rows fetched'],
      tags: ['django', 'orm', 'exists', 'cloze'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-exists-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this print? Assume there is at least one Article with status "published" and none with status "archived".',
      code: `pub = Article.objects.filter(status="published")
print(pub.exists())

arch = Article.objects.filter(status="archived")
print(arch.exists())`,
      expectedOutput: `True
False`,
      explanation: '`.exists()` returns a plain Python bool — True when at least one row matches, False otherwise. It compiles to `SELECT (1) ... LIMIT 1`, so it short-circuits at the first match instead of materializing the queryset. Cheapest way to ask "is there any?".',
      hints: ['exists() returns a bool, not a queryset', 'LIMIT 1 under the hood'],
      tags: ['django', 'orm', 'exists', 'predict'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-exists-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function `ensure_tag(label)` that creates a `Tag` with `name=label` only if no Tag with that name already exists, using an efficient existence check (not `count()`, not a try/except around `get()`). Return True if it created a new Tag, False if one already existed.',
      starterCode: `# def ensure_tag(label): ... return True if created else False
`,
      testCases: [
        {
          input: 'create-if-absent guard',
          expectedOutput: 'exists() check then create; returns created flag',
          description: 'Efficient existence guard before insert',
        },
      ],
      solution: `from .models import Tag

def ensure_tag(label):
    if Tag.objects.filter(name=label).exists():
        return False
    Tag.objects.create(name=label)
    return True`,
      explanation: '`.exists()` is the cheap "is there any?" probe — `SELECT 1 ... LIMIT 1`, no rows loaded. It beats `count() > 0` (counts everything) and a try/except `get()` (raises/catches on the common path). In real code `Tag.objects.get_or_create(name=label)` does this atomically and returns `(obj, created)`; the explicit form here is to drill `exists()`.',
      hints: [
        'filter(...).exists() returns the boolean you branch on',
        'create() inserts when the guard says it is absent',
        'get_or_create is the production shortcut',
      ],
      tieredHints: {
        apiSignature: 'QuerySet.exists() -> bool',
        skeleton: 'from .models import Tag\n\ndef ensure_tag(label):\n    if Tag.____.____(____=label).____():\n        return ____\n    Tag.____.____(____=label)\n    return ____',
      },
      tags: ['django', 'orm', 'exists', 'create'],
      concepts: ['dj-orm-query-construction'],
    },
  // only / defer — column deferral
  {
      id: 'dj-orm-only-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      question: 'How do `.only("title")`, `.defer("body")`, and `.values("title")` differ?',
      options: [
        { id: 'a', text: '`only` loads just those columns (the rest lazy-load on access), `defer` loads everything except those, and `values` returns dicts instead of model instances — and touching a deferred field fires an extra query', isCorrect: true },
        { id: 'b', text: 'All three return fully-populated model instances with every column loaded; they differ only in the order Django lists the columns in the generated SELECT statement', isCorrect: false },
        { id: 'c', text: '`only` and `defer` read from the cache while `values` hits the database; accessing a deferred field returns the cached copy and never triggers another query', isCorrect: false },
        { id: 'd', text: '`values` loads just those columns, `only` returns dicts, and `defer` is a backward-compatibility alias for `values_list` that flattens the result', isCorrect: false },
      ],
      explanation: '`only`/`defer` still return *model instances* — they just control which columns load up front. `only("title")` loads the pk + title; `defer("body")` loads everything but body. Either way, touching a column that wasn\'t loaded triggers a fresh per-instance SELECT (the classic deferred-field N+1). `values("title")` is different in kind: it returns dicts, not instances. Use `only`/`defer` to trim wide rows; use `values` when you want raw data, not objects.',
      hints: [
        'only/defer still give model instances; values gives dicts',
        'only = whitelist columns, defer = blacklist columns',
        'Touching a deferred field costs an extra query',
      ],
      tags: ['django', 'orm', 'only', 'defer', 'values'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-only-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the method that loads ONLY the listed columns up front (deferring the rest until accessed).',
      template: `qs = Article.objects.___("title", "created_at")`,
      blanks: ['only'],
      solution: 'qs = Article.objects.only("title", "created_at")',
      explanation: '`only(*fields)` whitelists the columns to load immediately (always including the primary key). Any other field lazy-loads with a separate query when first accessed. The inverse is `defer(*fields)`, which loads everything except the named columns. Both return real model instances.',
      hints: ['Whitelist the columns to load up front'],
      tags: ['django', 'orm', 'only', 'cloze'],
      concepts: ['dj-orm-query-construction'],
    },
  // bulk_create / bulk_update — batch writes
  {
      id: 'dj-orm-bulk-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      question: 'What are the key caveats of `bulk_create()`?',
      options: [
        { id: 'a', text: 'It does not call each model\'s `save()` or send `pre_save`/`post_save` signals, and on some databases the created objects come back without their primary keys populated', isCorrect: true },
        { id: 'b', text: 'It wraps each row in its own savepoint, so one invalid row rolls back only itself while every other row in the batch still commits successfully', isCorrect: false },
        { id: 'c', text: 'It calls `save()` once per object internally but batches the signals, so `post_save` fires exactly one consolidated time at the end of the run', isCorrect: false },
        { id: 'd', text: 'It runs `full_clean()` validation on every instance before inserting, which makes it slower than a plain loop of `create()` calls for large batches', isCorrect: false },
      ],
      explanation: '`bulk_create` issues one (or a few batched) INSERT statements and deliberately bypasses the per-object machinery: no `save()` override runs, no `pre_save`/`post_save` signals fire, and `auto_now`/custom `save()` logic is skipped. On older MySQL it also can\'t return PKs. That\'s the speed/semantics trade — use it for raw inserts where you don\'t need hooks; loop `save()` when you do.',
      hints: [
        'No save() override, no pre_save/post_save signals',
        'PKs may be missing on some backends',
        'Speed comes from skipping per-object machinery',
      ],
      tags: ['django', 'orm', 'bulk_create', 'signals'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-bulk-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Insert one Article per string in `titles` using a single batched INSERT (not one query per title). Build the list of unsaved instances, then batch-create them.',
      correctOrder: [
        'from .models import Article',
        '',
        'objs = [Article(title=t) for t in titles]',
        'Article.objects.bulk_create(objs)',
      ],
      distractorLines: [
        'for t in titles:',
        '    Article.objects.create(title=t)',
        'Article.objects.bulk_create(title=titles)',
      ],
      solution: 'from .models import Article\n\nobjs = [Article(title=t) for t in titles]\nArticle.objects.bulk_create(objs)',
      explanation: '`bulk_create` takes a LIST of unsaved model instances and writes them in one batched INSERT. Building `Article(title=t)` (not `objects.create`, which would save each immediately) is the key — you construct in Python, then hand the whole list to `bulk_create`. A `create()` loop would fire one INSERT per row.',
      hints: ['Construct unsaved instances first, then batch them', 'bulk_create takes a list, not keyword args'],
      tags: ['django', 'orm', 'bulk_create', 'parsons'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-bulk-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the method that writes changed field(s) for a list of already-fetched instances in one query. You pass the objects and the list of field names to update.',
      template: `Article.objects.___(articles, ["view_count"])`,
      blanks: ['bulk_update'],
      solution: 'Article.objects.bulk_update(articles, ["view_count"])',
      explanation: '`bulk_update(objs, fields)` writes the given fields for a list of existing instances in a single batched UPDATE (using SQL CASE under the hood). Like `bulk_create`, it skips `save()` and signals. You must list which fields to persist — anything not named is ignored.',
      hints: ['Batched UPDATE for existing rows; pass objects + field-name list'],
      tags: ['django', 'orm', 'bulk_update', 'cloze'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-bulk-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function `import_titles(titles)` that takes a list of title strings and inserts one `Article` per title in a single batched INSERT (not one query per row). Return the number of rows created. `Article` has a `title` CharField.',
      starterCode: `# def import_titles(titles): batch-insert one Article per title, return the count.
`,
      testCases: [
        {
          input: 'batch insert from a list',
          expectedOutput: 'bulk_create of constructed instances; returns count',
          description: 'Single batched INSERT for many rows',
        },
      ],
      solution: `from .models import Article

def import_titles(titles):
    created = Article.objects.bulk_create([Article(title=t) for t in titles])
    return len(created)`,
      explanation: 'Construct the unsaved `Article(title=t)` instances in a list comprehension, then hand the whole list to `bulk_create`, which writes them in one (batched) INSERT and returns the created list — so `len(...)` is the count. A loop of `Article.objects.create(...)` would issue one INSERT per title.',
      hints: [
        'Build [Article(title=t) for t in titles] first',
        'bulk_create returns the list of created objects',
        'len() of that list is the row count',
      ],
      tieredHints: {
        apiSignature: 'Model.objects.bulk_create(objs, batch_size=None, ignore_conflicts=False)',
        skeleton: 'from .models import Article\n\ndef import_titles(titles):\n    ____ = Article.____.____([____(title=t) for t in titles])\n    return ____(____)',
      },
      tags: ['django', 'orm', 'bulk_create'],
      concepts: ['dj-orm-query-construction'],
    },
  // values / values_list — projection
  {
      id: 'dj-orm-values-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      question: 'How do `.values()`, `.values_list()`, and `.values_list("x", flat=True)` differ in what they return?',
      options: [
        { id: 'a', text: '`values()` yields dicts, `values_list()` yields tuples, and `values_list("x", flat=True)` yields a flat sequence of single scalar values', isCorrect: true },
        { id: 'b', text: '`values()` yields tuples, `values_list()` yields dicts, and `flat=True` folds each related object into the parent row as nested keys', isCorrect: false },
        { id: 'c', text: 'All three yield full model instances; they differ only in whether Django defers the unselected columns or omits them from the query entirely', isCorrect: false },
        { id: 'd', text: '`values()` yields a flat list, `values_list()` yields dicts, and `flat=True` turns the queryset into a lazy Python generator object', isCorrect: false },
      ],
      explanation: '`values()` returns dict rows (`{"x": ...}`); `values_list()` returns tuple rows (`(...,)`); adding `flat=True` to a *single-field* `values_list` unwraps each one-tuple into the bare value, giving `[v1, v2, ...]`. All three skip building model instances, so they\'re lighter when you only need raw columns (e.g. a list of ids).',
      hints: [
        'values = dicts, values_list = tuples',
        'flat=True only works with exactly one field',
        'None of them build model instances',
      ],
      tags: ['django', 'orm', 'values', 'values_list'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-values-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this print? Assume exactly two Articles exist: (id=1, title="Hi") and (id=2, title="Yo").',
      code: `rows = Article.objects.values("title").order_by("id")
print(list(rows))

ids = Article.objects.values_list("id", flat=True).order_by("id")
print(list(ids))`,
      expectedOutput: `[{'title': 'Hi'}, {'title': 'Yo'}]
[1, 2]`,
      explanation: '`values("title")` produces one dict per row with just that key. `values_list("id", flat=True)` produces the bare ids because `flat=True` unwraps the single-field tuples. Both are evaluated to concrete lists by `list(...)`.',
      hints: ['values() -> list of dicts', 'values_list(flat=True) -> list of scalars'],
      tags: ['django', 'orm', 'values', 'values_list', 'predict'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-orm-values-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the keyword that unwraps a single-field `values_list` into a flat list of bare ids (instead of one-tuples).',
      template: `ids = Article.objects.values_list("id", ___=True)`,
      blanks: ['flat'],
      solution: 'ids = Article.objects.values_list("id", flat=True)',
      explanation: '`flat=True` is only valid when you select exactly one field. It turns `[(1,), (2,)]` into `[1, 2]`. With more than one field it raises an error — use plain `values_list` (tuples) or `named=True` (namedtuples) for multiple columns.',
      hints: ['Unwraps single-column tuples into scalars'],
      tags: ['django', 'orm', 'values_list', 'flat', 'cloze'],
      concepts: ['dj-orm-query-construction'],
    },
  // Prefetch object — filtered prefetch
  {
      id: 'dj-orm-prefetch-obj-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ORM,
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
      id: 'dj-orm-prefetch-obj-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ORM,
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
      topic: Topic.DJ_ORM,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fetch all Articles and attach to each one ONLY its approved comments, under the attribute `approved_comments`, using a single extra query for the comments (not one per article). `Comment` has a ForeignKey `article` (related_name "comments") and a boolean `approved`.',
      starterCode: `# Prefetch only approved comments onto each article as .approved_comments
`,
      testCases: [
        {
          input: 'filtered prefetch onto a custom attribute',
          expectedOutput: 'Prefetch(queryset=..., to_attr=...) — one extra query',
          description: 'Per-article filtered related list without N+1',
        },
      ],
      solution: `from django.db.models import Prefetch
from .models import Article, Comment

approved = Comment.objects.filter(approved=True)
articles = Article.objects.prefetch_related(
    Prefetch("comments", queryset=approved, to_attr="approved_comments")
)`,
      explanation: 'A bare `prefetch_related("comments")` would load every comment; here we hand `Prefetch` a *filtered* queryset so only approved comments are fetched — in one batched query for all articles. `to_attr="approved_comments"` stores them as a plain list on each article (leaving the default `comments` manager untouched). Reading `article.approved_comments` then costs zero extra queries.',
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
