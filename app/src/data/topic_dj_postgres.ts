/**
 * Topic.DJ_POSTGRES — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendAdvancedPedagogyQuestions.ts (2), backendInfraQuestions.ts (8), djangoAdvancedFinalQuestions.ts (2), djangoGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_postgres_questions: Question[] = [
  {
      id: 'dj-postgres-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Add a Postgres-specific JSONB column to Article and a database index on (status, created_at) for the "recent published articles" query.',
      template: `from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    metadata = models.___(default=dict)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ___ = [
            models.___(fields=["status", "-created_at"]),
        ]`,
      blanks: ['JSONField', 'indexes', 'Index'],
      solution: 'from django.db import models\n\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n    metadata = models.JSONField(default=dict)\n    status = models.CharField(max_length=20)\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    class Meta:\n        indexes = [\n            models.Index(fields=["status", "-created_at"]),\n        ]',
      explanation: '`models.JSONField()` maps to Postgres JSONB. `default=dict` (the callable, not `{}`) avoids the mutable-default trap on the model. `Meta.indexes` is the modern way to declare composite indexes — replaces the older `index_together`. Index direction matches your sort: `-created_at` here means newest-first lookups can use the index in reverse.',
      hints: ['JSONField for JSONB', 'default=dict (callable, not {})', 'Meta.indexes with models.Index'],
      tags: ['django', 'postgres', 'JSONField', 'Index', 'cloze'],
      concepts: ['inf-postgres', 'dj-model-construction'],
    },
  {
      id: 'dj-postgres-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given Article has a JSONField `metadata`, what does this print? Article.objects.create(metadata={"author": "ada", "tags": ["py", "db"]})',
      code: `# Setup: an Article exists with metadata={"author": "ada", "tags": ["py", "db"]}
qs = Article.objects.filter(metadata__author="ada")
print(qs.count())

qs2 = Article.objects.filter(metadata__tags__contains=["py"])
print(qs2.count())

qs3 = Article.objects.filter(metadata__author="bob")
print(qs3.count())`,
      expectedOutput: `1
1
0`,
      explanation: 'JSONField supports lookups: `field__key` traverses object keys; `__contains` checks if a JSON value contains the given subset (works for both nested objects and arrays). All these compile to native Postgres JSONB operators (`->`, `->>`, `@>`) and benefit from a GIN index on the column.',
      hints: ['__key traverses object', '__contains checks subset', 'Compiles to JSONB operators'],
      tags: ['django', 'postgres', 'JSONField', 'lookups', 'predict'],
      concepts: ['inf-postgres', 'dj-model-construction'],
    },
  {
      id: 'be-infra-postgres-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use Django\'s JSONField to store flexible metadata on a Product model. Define the model with a JSONB metadata field, then write queries that filter by nested JSON keys (metadata__color="red") and annotate with JSON values.',
      starterCode: `from django.db import models

# Define Product model with JSONField and show queries
`,
      testCases: [
        {
          input: 'Product model with JSONField and queries',
          expectedOutput: 'JSONField, __contains lookup, KeyTextTransform annotation',
          description: 'Should use JSONField with advanced lookups',
        },
      ],
      solution: `from django.db import models
from django.db.models import F
from django.db.models.fields.json import KeyTextTransform


class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.name


# --- Example queries ---

# Filter by nested JSON key
red_products = Product.objects.filter(metadata__color="red")

# Filter by nested path: metadata = {"dimensions": {"width": 10}}
wide_products = Product.objects.filter(metadata__dimensions__width__gte=10)

# Check if a key exists
products_with_color = Product.objects.filter(metadata__has_key="color")

# Contains lookup — partial JSON match
organic = Product.objects.filter(
    metadata__contains={"organic": True, "origin": "USA"}
)

# Annotate with a JSON value for ordering/display
products_by_brand = Product.objects.annotate(
    brand=KeyTextTransform("brand", "metadata")
).filter(brand__isnull=False).order_by("brand")`,
      explanation: 'Django\'s JSONField maps to PostgreSQL\'s JSONB column, which stores JSON in an efficient binary format with indexing support. The double-underscore lookup syntax (metadata__color="red") translates to PostgreSQL\'s -> operator for navigating nested JSON. KeyTextTransform extracts a JSON value as text for use in annotations and ordering. The __contains lookup uses PostgreSQL\'s @> operator to check if the JSON contains a subset. JSONB is ideal for flexible, schema-less data that varies between rows — but use regular columns for data you frequently filter or join on.',
      hints: [
        'JSONField requires PostgreSQL — it does not work with SQLite',
        'metadata__key traverses one level, metadata__key1__key2 traverses nested',
        '__has_key checks for key existence without comparing values',
        'KeyTextTransform extracts values for annotation/ordering',
      ],
      tags: ['jsonfield', 'postgres', 'django-orm', 'metadata'],
      concepts: ['dj-model-construction', 'inf-postgres'],
    },
  {
      id: 'be-infra-postgres-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      question: 'What PostgreSQL-specific features does Django support natively?',
      options: [
        { id: 'a', text: 'Only basic CRUD operations — anything beyond simple SELECT/INSERT requires dropping to raw SQL with cursor.execute()', isCorrect: false },
        { id: 'b', text: 'All Django ORM features work identically across every backend, so the database choice never changes what is available', isCorrect: false },
        { id: 'c', text: 'Postgres-specific features exist but require installing pgAdmin alongside Django and registering it in INSTALLED_APPS', isCorrect: false },
        { id: 'd', text: 'JSONField/JSONB, ArrayField, full-text search (SearchVector/SearchRank), range fields, and CITextField — none work on SQLite', isCorrect: true },
      ],
      explanation: 'Django\'s django.contrib.postgres module provides Python-native access to PostgreSQL\'s most powerful features. JSONField stores and queries semi-structured data. ArrayField stores lists directly in a column. Full-text search with SearchVector, SearchQuery, and SearchRank provides relevance-ranked text search without Elasticsearch. Range fields enforce constraints like "available from date X to date Y" at the database level. CITextField provides case-insensitive uniqueness. These are why PostgreSQL is the recommended database for Django — SQLite lacks these features entirely.',
      tags: ['postgres', 'django', 'jsonfield', 'arrayfield', 'full-text-search'],
      concepts: ['inf-postgres', 'dj-model-construction'],
    },
  {
      id: 'be-infra-postgres-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Set up PostgreSQL full-text search in Django. Create an Article model with title and body, then write a search view that uses SearchVector on both fields, SearchQuery for user input, and SearchRank for relevance scoring. Return results ordered by relevance.',
      starterCode: `from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank

# Define the Article model and search view
`,
      testCases: [
        {
          input: 'Full-text search setup',
          expectedOutput: 'SearchVector, SearchQuery, SearchRank with annotate and filter',
          description: 'Should implement full-text search with relevance ranking',
        },
      ],
      solution: `from django.db import models
from django.contrib.postgres.search import (
    SearchVector,
    SearchQuery,
    SearchRank,
    SearchHeadline,
)
from rest_framework.views import APIView
from rest_framework.response import Response


class Article(models.Model):
    title = models.CharField(max_length=300)
    body = models.TextField()
    author = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    published_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ArticleSearchView(APIView):
    def get(self, request):
        query_text = request.query_params.get("q", "")
        if not query_text:
            return Response({"results": []})

        search_vector = SearchVector("title", weight="A") + SearchVector("body", weight="B")
        search_query = SearchQuery(query_text)

        results = (
            Article.objects
            .annotate(
                search=search_vector,
                rank=SearchRank(search_vector, search_query),
                headline=SearchHeadline("body", search_query, max_words=35, min_words=15),
            )
            .filter(search=search_query)
            .filter(rank__gte=0.1)
            .order_by("-rank")
        )

        data = [
            {
                "id": article.id,
                "title": article.title,
                "headline": article.headline,
                "rank": float(article.rank),
            }
            for article in results[:20]
        ]

        return Response({"results": data})`,
      explanation: 'PostgreSQL full-text search is a powerful alternative to Elasticsearch for many use cases. SearchVector converts text into a tsvector — a sorted list of normalized words (lexemes). SearchQuery parses user input into a tsquery with stemming (so "running" matches "run"). SearchRank scores relevance based on term frequency and weights — weight "A" on title means title matches rank higher than body matches (weight "B"). SearchHeadline generates a snippet with matching terms highlighted. This all runs inside PostgreSQL with no external search service needed.',
      hints: [
        'weight="A" is highest priority, "D" is lowest',
        'SearchVector("title", weight="A") + SearchVector("body", weight="B") combines fields',
        'SearchRank returns a float — filter with rank__gte to exclude weak matches',
        'SearchHeadline generates context snippets around matched terms',
      ],
      tags: ['full-text-search', 'postgres', 'search-vector', 'search-rank'],
      concepts: ['inf-postgres'],
    },
  {
      id: 'be-infra-postgres-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      question: 'When should you use PostgreSQL JSONB vs a related table for storing data?',
      options: [
        { id: 'a', text: 'JSONB for flexible, sparse data with no fixed schema; related tables for structured data needing constraints, joins, and frequent filtering', isCorrect: true },
        { id: 'b', text: 'Always prefer JSONB — its schemaless flexibility makes rigid relational tables with fixed columns obsolete in modern apps', isCorrect: false },
        { id: 'c', text: 'Always use related tables, since JSONB columns cannot be indexed and every JSONB lookup forces a full sequential scan', isCorrect: false },
        { id: 'd', text: 'Use JSONB whenever the data is small and switch to related tables once it grows large enough to need pagination', isCorrect: false },
      ],
      explanation: 'JSONB is excellent for product metadata (varying attributes per category), user preferences, or API response caching — data where the schema varies between rows and you rarely filter on it. A related table is better when data has a consistent structure, needs foreign key constraints, is frequently used in WHERE clauses or JOINs, or needs to be aggregated. For example, storing order line items in JSONB means you cannot JOIN them with product tables or enforce that product_id exists. Use JSONB as a complement to relational design, not a replacement.',
      tags: ['jsonb', 'postgres', 'data-modeling', 'architecture'],
      concepts: ['inf-postgres'],
    },
  {
      id: 'be-infra-dbperf-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Add database indexes to a Django model for performance. The "Order" model (order_id, customer_id, order_status, created_at, total_amount) is frequently queried by:\n- customer_id (foreign key lookups)\n- order_status + created_at together (filtering active orders by date)\n\nAdd indexes using the Meta.indexes option and db_index on the field.\n\nDjango supports two ways to add indexes:\n1. db_index=True on a field — simple single-column index\n2. Meta.indexes with models.Index — composite indexes, partial indexes, custom names',
      starterCode: `# Define Order(models.Model) with order_id (AutoField primary_key),
# customer = ForeignKey("Customer", on_delete=CASCADE, db_index=True),
# order_status CharField, created_at DateTimeField(auto_now_add=True),
# total_amount DecimalField
# In Meta, declare a composite index named "idx_status_created"
# covering order_status and created_at (in that order).
`,
      testCases: [
        {
          input: 'Order model',
          expectedOutput: 'db_index=True on customer + Meta.indexes with Index(fields=["order_status", "created_at"])',
          description: 'Should add indexes for common queries',
        },
      ],
      solution: `from django.db import models\n\nclass Order(models.Model):\n    order_id = models.AutoField(primary_key=True)\n    customer = models.ForeignKey("Customer", on_delete=models.CASCADE, db_index=True)\n    order_status = models.CharField(max_length=20)\n    created_at = models.DateTimeField(auto_now_add=True)\n    total_amount = models.DecimalField(max_digits=10, decimal_places=2)\n\n    class Meta:\n        indexes = [\n            models.Index(fields=["order_status", "created_at"], name="idx_status_created"),\n        ]`,
      explanation: 'db_index=True creates a B-tree index on a single column — use for foreign keys and frequently filtered fields. Meta.indexes allows composite indexes (multiple columns) which are essential when queries filter on two columns together (WHERE status = "active" AND created_at > ...). Column order matters: put the most selective column first. Django generates the migration automatically with makemigrations.',
      hints: ['db_index=True on the ForeignKey field', 'Meta.indexes for composite indexes', 'Column order in composite index matters — most selective first'],
      tags: ['django', 'index', 'performance', 'database', 'meta'],
      concepts: ['inf-postgres', 'dj-model-construction'],
    },
  {
      id: 'be-infra-dbperf-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      language: CodeLanguage.SQL,
      question: 'Use EXPLAIN ANALYZE in PostgreSQL to understand why a query is slow. Given the query below, run it with EXPLAIN ANALYZE and interpret the output.\n\nQuery: SELECT * FROM orders WHERE order_status = \'active\' AND created_at > \'2024-01-01\';\n\nEXPLAIN ANALYZE runs the query and shows the actual execution plan:\n- Seq Scan = full table scan (slow on large tables — needs an index)\n- Index Scan = using an index (fast)\n- Rows Removed by Filter = how many rows were scanned but didn\'t match\n- Execution Time = actual time in milliseconds',
      starterCode: `-- Run EXPLAIN ANALYZE on the slow query\n`,
      testCases: [
        {
          input: 'Slow query on orders table',
          expectedOutput: 'EXPLAIN ANALYZE SELECT ...',
          description: 'Should use EXPLAIN ANALYZE',
        },
      ],
      solution: `EXPLAIN ANALYZE SELECT * FROM orders WHERE order_status = 'active' AND created_at > '2024-01-01';\n\n-- If output shows "Seq Scan" → add a composite index:\nCREATE INDEX idx_orders_status_date ON orders(order_status, created_at);\n\n-- Re-run EXPLAIN ANALYZE to verify it now shows "Index Scan"`,
      explanation: 'EXPLAIN shows the planned execution. EXPLAIN ANALYZE actually runs the query and shows real timings. Look for: Seq Scan (bad on large tables), high "Rows Removed by Filter" (scanning too much), and nested loops (potential N+1). The fix is usually an index on the WHERE/JOIN columns. Always re-run EXPLAIN ANALYZE after adding an index to verify it\'s being used — PostgreSQL may ignore an index if it estimates a seq scan is faster (e.g., on small tables).',
      hints: ['EXPLAIN ANALYZE runs the query and shows actual execution plan', 'Seq Scan = no index, full table scan', 'Create a composite index on the columns in your WHERE clause'],
      tags: ['explain', 'analyze', 'postgres', 'performance', 'index', 'database'],
      concepts: ['inf-postgres'],
    },
  {
      id: 'be-infra-dbperf-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      question: 'You have a PostgreSQL table "events" with 10 million rows. A query filtering WHERE event_type = \'click\' returns 50 rows but takes 3 seconds. EXPLAIN ANALYZE shows "Seq Scan". You add an index on event_type but the query still uses Seq Scan. Why?',
      options: [
        { id: 'a', text: 'The index was created corrupt; until you rebuild it with REINDEX the planner silently refuses to consider it', isCorrect: false },
        { id: 'b', text: 'PostgreSQL never uses a new index until you add a FORCE INDEX hint to the query, the same way MySQL requires', isCorrect: false },
        { id: 'c', text: 'Table statistics are stale — run VACUUM ANALYZE so the planner learns the index is selective enough to beat a Seq Scan', isCorrect: true },
        { id: 'd', text: 'B-tree indexes cannot be used on VARCHAR columns — text filters always need a separate GIN trigram index', isCorrect: false },
      ],
      explanation: 'PostgreSQL\'s query planner uses table statistics (row counts, value distribution) to decide whether an index scan or seq scan is faster. After adding an index, if stats are stale, the planner may still choose seq scan. Run ANALYZE events; (or VACUUM ANALYZE events;) to update statistics. Django runs this automatically during migrate, but not after bulk inserts. Unlike MySQL, PostgreSQL has no FORCE INDEX — the planner always decides. If stats are current and it still uses seq scan, the index might not be selective enough.',
      tags: ['vacuum', 'analyze', 'postgres', 'statistics', 'performance', 'query-planner'],
      concepts: ['inf-postgres'],
    },
  {
      id: 'be-infra-dbperf-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      question: 'What is the Django Debug Toolbar and how does it help with database performance?',
      options: [
        { id: 'a', text: 'A VS Code extension that steps through Django template rendering with breakpoints and variable inspection', isCorrect: false },
        { id: 'b', text: 'A dev-only panel injected into your pages showing every SQL query, its execution time, and duplicates — the fastest way to spot N+1 problems', isCorrect: true },
        { id: 'c', text: 'A command-line profiler that wraps manage.py commands and prints per-function timing for each invocation', isCorrect: false },
        { id: 'd', text: 'A production monitoring service like Sentry that aggregates errors and query timings from live servers', isCorrect: false },
      ],
      explanation: 'django-debug-toolbar adds a collapsible panel to every page showing: SQL queries (count, time, duplicates), template rendering time, cache hits/misses, signal receivers, and more. It\'s the fastest way to spot N+1 queries — if you see 50 similar queries, you need select_related/prefetch_related. Install with pip, add to INSTALLED_APPS and MIDDLEWARE, and configure INTERNAL_IPS. NEVER enable in production — it exposes SQL queries and internal state.',
      tags: ['debug-toolbar', 'django', 'performance', 'profiling', 'n+1'],
      concepts: ['dj-n-plus-one'],
    },
  {
      id: 'dj-postgres-adv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Build a Postgres-backed full-text search queryset for \`Article\`. Combine three primitives:
  
  1. Build a search vector across \`title\` (weight A) and \`body\` (weight B).
  2. Build a search query from a user-supplied term, parsed as a "websearch"-style query (handles quoted phrases and OR/-).
  3. Annotate each row with the rank, filter to rows matching the query, and order by rank descending.
  
  Return a queryset of Article rows, with the rank annotation attached. Use \`SearchVector\`, \`SearchQuery\`, and \`SearchRank\` from \`django.contrib.postgres.search\`.`,
      starterCode: `from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from .models import Article
`,
      testCases: [
        {
          input: 'search("django postgres")',
          expectedOutput: 'SearchVector with weights + SearchQuery websearch + SearchRank annotation + filter + order_by',
          description: 'Production-grade Postgres FTS query',
        },
      ],
      solution: `from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from .models import Article


def search(term):
    vector = SearchVector("title", weight="A") + SearchVector("body", weight="B")
    query = SearchQuery(term, search_type="websearch")
    return (
        Article.objects
        .annotate(rank=SearchRank(vector, query))
        .filter(rank__gt=0)
        .order_by("-rank")
    )`,
      explanation: 'Three FTS primitives composed: weighted search vectors (A higher than B/C/D — title matches outrank body matches), `SearchQuery(..., search_type="websearch")` parses Google-style operators (`"exact phrase"`, `term1 OR term2`, `-exclude`), and `SearchRank` annotates a relevance score. `filter(rank__gt=0)` drops rows that didn\'t match at all (rank 0). For production, also add a GIN index on the search vector via a generated column or `SearchVectorField` — without it, every query rebuilds vectors from scratch (sequential scan).',
      hints: [
        'SearchVector weights: A > B > C > D',
        'search_type="websearch" parses Google-style operators',
        'SearchRank annotation enables order_by("-rank")',
        'filter(rank__gt=0) drops non-matches',
      ],
      tags: ['django', 'postgres', 'full-text-search', 'SearchVector', 'SearchRank', 'advanced'],
      concepts: ['inf-postgres'],
    },
  {
      id: 'dj-postgres-adv-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `An \`Event\` model has a JSONField \`payload\`. Production traffic stores objects shaped like \`{"type": "order_created", "actor": {"id": 7, "role": "admin"}, "amount": 199}\`.
  
  Combine three JSONB query patterns into a single Django queryset:
  
  1. Filter where \`payload["type"] == "order_created"\`.
  2. Filter where the nested \`payload["actor"]["role"] == "admin"\`.
  3. Filter where \`payload["amount"]\` is greater than 100. The amount is stored as a number, not a string, in the JSON.
  
  Return Events ordered by \`created_at\` descending.`,
      starterCode: `from .models import Event
  `,
      testCases: [
        {
          input: 'admin order_created with amount > 100',
          expectedOutput: 'three chained JSONField __field / nested __ lookups + numeric comparison',
          description: 'Compound JSONB filtering with nested keys and numeric comparison',
        },
      ],
      solution: `from .models import Event


def admin_big_order_events():
    return (
        Event.objects
        .filter(payload__type="order_created")
        .filter(payload__actor__role="admin")
        .filter(payload__amount__gt=100)
        .order_by("-created_at")
    )`,
      explanation: 'JSONField traversal uses the same `__` syntax as relations — each path segment is a key. Numeric lookups (`__gt`, `__lt`, `__gte`, `__lte`) work directly on JSON numbers; Django emits the right Postgres JSONB cast. Three chained `.filter()` calls are AND-ed and produce a single SQL query. For production scale, add a GIN index on `payload` (`Index(fields=["payload"], opclasses=["jsonb_path_ops"])`) — without it, JSONB lookups are sequential scans.',
      hints: [
        'JSONField: __key for nested traversal',
        'Numeric lookups (__gt, __lt) work on JSON numbers directly',
        'Chained .filter() is AND, single query',
        'GIN index for production speed',
      ],
      tags: ['django', 'postgres', 'JSONField', 'nested-lookups', 'advanced'],
      concepts: ['inf-postgres', 'dj-model-construction'],
    },
  {
      id: 'dj-postgres-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      question: 'Why use PostgreSQL with Django instead of the default SQLite?\n\nDjango ships with SQLite configured by default. It works great for getting started, but production applications need something more robust.',
      options: [
        {
          id: 'a',
          text: 'SQLite outperforms PostgreSQL in every scenario, so switching only adds operational overhead with no benefit',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'PostgreSQL only becomes necessary once your schema grows beyond a few dozen tables or several gigabytes',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Django migrations only run against PostgreSQL — on SQLite, schema changes must be applied by hand',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'SQLite is a single-file database with one writer at a time; PostgreSQL is a server built for concurrent access and production scale',
          isCorrect: true,
        },
      ],
      explanation: 'SQLite stores everything in a single file and handles one write at a time — perfect for development and prototyping. PostgreSQL is a full database server that supports concurrent reads/writes from multiple processes, advanced data types (JSONB for flexible data, arrays, ranges), full-text search, and scales to millions of rows. In production with multiple web servers hitting the database simultaneously, SQLite would corrupt or lock. PostgreSQL handles this seamlessly.',
      hints: [
        'SQLite = file-based, single writer. PostgreSQL = server-based, many concurrent connections',
        'PostgreSQL has features Django can use that SQLite simply does not support',
      ],
      tags: ['django', 'postgresql', 'sqlite', 'database', 'basics'],
      concepts: ['inf-postgres'],
    },
  {
      id: 'dj-postgres-gap-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      question: 'What PostgreSQL-specific features does Django support?\n\nDjango has a dedicated module, django.contrib.postgres, that provides fields and features only available with PostgreSQL.',
      options: [
        {
          id: 'a',
          text: 'JSONField for schemaless data, ArrayField for lists, full-text search (SearchVector/SearchQuery), range fields, and CITextField',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Django only supports basic SELECT/INSERT/UPDATE/DELETE with PostgreSQL — all advanced features require raw SQL',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'The only PostgreSQL-specific feature is faster query execution — the API is identical to SQLite',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'PostgreSQL features are available through a separate package called django-postgres-extras, not built into Django',
          isCorrect: false,
        },
      ],
      explanation: 'django.contrib.postgres provides: JSONField (store and query schemaless JSON data), ArrayField (store lists directly in a column), HStoreField (key-value pairs), full-text search (SearchVector, SearchQuery, SearchRank for relevance-ranked text search), range fields (integer ranges, date ranges), CITextField/CIEmailField (case-insensitive text), and trigram similarity for fuzzy matching. These are ORM-level features — you use them like regular Django fields but they only work with PostgreSQL.',
      hints: [
        'Look at django.contrib.postgres for these features',
        'JSONField is now available on all databases in Django 3.1+, but ArrayField and full-text search remain PostgreSQL-only',
      ],
      tags: ['django', 'postgresql', 'jsonfield', 'arrayfield', 'full-text-search'],
      concepts: ['inf-postgres', 'dj-model-construction'],
    },
];
