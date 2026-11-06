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
      question: 'Give `Article` a JSON field `metadata` that defaults to an empty dict (PostgreSQL stores it as `jsonb`), and declare one composite index for the query that filters on `status` and sorts by `created_at`, newest first. Fill in the field class, the `Meta` option that lists indexes, and the index class.',
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
      explanation: '`models.JSONField` is stored as `jsonb` on PostgreSQL. `default=dict` passes the callable, so every new row gets its own empty dict; `default={}` would share one dict object between rows. `Meta.indexes` takes a list of `models.Index` objects, and `fields=["status", "-created_at"]` builds one index on `status` and then `created_at` descending, so a query that filters on `status` and orders by `-created_at` can read the matching rows already in that order. (The older `index_together` option was removed in Django 5.1.)',
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
      question: '`Article` has a JSONField `metadata`, and the table holds exactly one row, created with `Article.objects.create(metadata={"author": "ada", "tags": ["py", "db"]})`. What do the three `print` calls output? The answer is three lines, one number on each.',
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
      explanation: '`metadata__author="ada"` compares the value under the `author` key, so the one row matches, and `metadata__author="bob"` matches nothing. `metadata__tags__contains=["py"]` matches when the stored list holds every item of the given list, and `["py", "db"]` holds `"py"`. On PostgreSQL the key comparison uses the `->` operator and `__contains` uses `@>`, the operator a GIN index on the column speeds up.',
      hints: ['metadata__key compares the value stored under that key.', '__contains on a list matches when the stored list holds every item you pass.'],
      tags: ['django', 'postgres', 'JSONField', 'lookups', 'predict'],
      concepts: ['inf-postgres', 'dj-model-construction'],
    },
  {
      id: 'dj-postgres-keytexttransform-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: '`Product` has a JSONField `metadata`. List the products sorted by the text of their `brand` key. Fill in the queryset method that attaches a computed value to every row, and the helper that pulls one key out of a JSON field as text (its import is left out).',
      template: `products = Product.objects.___(
    brand=___("brand", "metadata")
).order_by("brand")`,
      blanks: ['annotate', 'KeyTextTransform'],
      blankAlternates: [['alias'], []],
      solution: 'products = Product.objects.annotate(\n    brand=KeyTextTransform("brand", "metadata")\n).order_by("brand")',
      explanation: '`annotate()` adds the expression to every row under the name `brand`, which `order_by("brand")` then sorts on. `KeyTextTransform("brand", "metadata")`, imported from `django.db.models.fields.json`, takes the key first and the field second and pulls the value out as text (PostgreSQL\'s `->>`), so the rows sort as strings and a product with no `brand` key gets NULL. `alias()` is also accepted: it works the same when the value is only used for sorting or filtering and not returned. `order_by("metadata__brand")` sorts too, but by the `jsonb` value rather than its text.',
      hints: ['The queryset method that attaches a named, computed value to each row.', 'The helper takes the key name first, then the JSON field name, and returns the value as text.'],
      tags: ['django', 'postgres', 'JSONField', 'KeyTextTransform', 'cloze'],
      concepts: ['inf-postgres'],
    },
  {
      id: 'be-infra-postgres-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Give a \`Product\` model a \`name\` (a \`CharField\` of up to 200 characters) and a JSON field \`metadata\` that defaults to an empty dict and may be left blank. Then write four querysets:

- \`red_products\`: products whose \`color\` key is \`"red"\`
- \`wide_products\`: products whose nested \`dimensions\` → \`width\` value is at least 10
- \`products_with_color\`: products that have a \`color\` key at all, whatever its value
- \`products_by_brand\`: every product, sorted by its \`brand\` key pulled out as text into an annotation named \`brand\``,
      starterCode: `from django.db import models
`,
      testCases: [
        {
          input: 'Product model with JSONField and queries',
          expectedOutput: 'JSONField, key and nested-key lookups, has_key, KeyTextTransform annotation',
          description: 'Should use JSONField with advanced lookups',
        },
      ],
      requires: [/JSONField/, /KeyTextTransform/],
      solution: `from django.db import models
from django.db.models.fields.json import KeyTextTransform


class Product(models.Model):
    name = models.CharField(max_length=200)
    metadata = models.JSONField(default=dict, blank=True)


red_products = Product.objects.filter(metadata__color="red")
wide_products = Product.objects.filter(metadata__dimensions__width__gte=10)
products_with_color = Product.objects.filter(metadata__has_key="color")
products_by_brand = Product.objects.annotate(
    brand=KeyTextTransform("brand", "metadata")
).order_by("brand")
# OR
from django.db import models
from django.db.models.fields.json import KeyTextTransform


class Product(models.Model):
    name = models.CharField(max_length=200)
    metadata = models.JSONField(default=dict, blank=True)


red_products = Product.objects.filter(metadata__color="red")
wide_products = Product.objects.filter(metadata__dimensions__width__gte=10)
products_with_color = Product.objects.filter(metadata__has_key="color")
products_by_brand = Product.objects.alias(
    brand=KeyTextTransform("brand", "metadata")
).order_by("brand")`,
      explanation: '`models.JSONField` is stored as `jsonb` on PostgreSQL, and `default=dict` gives each row its own empty dict. Lookups chain keys with `__` as relations do: `metadata__color="red"` compares one key, and `metadata__dimensions__width__gte=10` walks into the nested object and compares the number. `__has_key` tests only that the key exists. `KeyTextTransform("brand", "metadata")` pulls the key out as text for `annotate()`, so `order_by("brand")` sorts by it, and products with no brand come last. JSON suits attributes that differ from product to product; a value you filter or join on all the time belongs in its own column.',
      hints: [
        'metadata__key compares one key; metadata__key1__key2 walks into a nested object.',
        'A lookup added after the key path, such as __gte, compares the value.',
        '__has_key checks that a key exists without comparing its value.',
        'KeyTextTransform(key, field) pulls a key out as text for annotate().',
      ],
      tieredHints: {
        apiSignature: 'models.JSONField(default=dict, blank=True); KeyTextTransform(key_name, field_name)',
        skeleton: 'from django.db import models\nfrom django.db.models.fields.json import ____\n\n\nclass Product(models.Model):\n    name = models.CharField(max_length=200)\n    metadata = models.____(default=dict, blank=True)\n\n\nred_products = Product.objects.filter(____="red")\nwide_products = Product.objects.filter(____=10)\nproducts_with_color = Product.objects.filter(____="color")\nproducts_by_brand = Product.objects.____(\n    brand=____("brand", "metadata")\n).order_by("brand")',
      },
      tags: ['JSONField', 'postgres', 'django-orm', 'metadata'],
      concepts: ['dj-model-construction', 'inf-postgres'],
    },
  {
      id: 'be-infra-postgres-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      question: 'A team runs its tests on SQLite while production runs PostgreSQL. Which of these lines in a model works only on PostgreSQL, so the test database cannot even create the table?',
      options: [
        { id: 'a', text: '`details = models.JSONField(default=dict)`, because JSON columns are a PostgreSQL `jsonb` feature', isCorrect: false },
        { id: 'b', text: '`token = models.UUIDField()`, because only PostgreSQL has a column type that can hold a UUID', isCorrect: false },
        { id: 'c', text: '`indexes = [models.Index(fields=["kind", "-created"])]`, because descending index columns need PostgreSQL', isCorrect: false },
        { id: 'd', text: '`tags = ArrayField(models.CharField(max_length=30))`, with `ArrayField` from `django.contrib.postgres.fields`', isCorrect: true },
      ],
      explanation: '`ArrayField` comes from `django.contrib.postgres`, like the range fields and full-text search, and builds a PostgreSQL array column (`varchar(30)[]`) that SQLite cannot create. `models.JSONField` lives in `django.db.models` and works on every database Django supports: PostgreSQL stores it as `jsonb`, SQLite as text it reads with its JSON functions. `UUIDField` is a native `uuid` column on PostgreSQL and a 32-character text column on SQLite. Composite and descending indexes work on every backend. Tests on SQLite hide exactly this kind of difference, which is why a PostgreSQL project should run its tests on PostgreSQL too.',
      tags: ['postgres', 'django', 'jsonfield', 'arrayfield', 'full-text-search'],
      concepts: ['inf-postgres', 'dj-model-construction'],
    },
  {
      id: 'dj-postgres-fts-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the three full-text search classes from `django.contrib.postgres.search` (the import is left out): build the vector from the title, parse the user\'s search words, and score each row\'s relevance.',
      template: `vector = ___("title")
query = ___("django")
results = (
    Article.objects
    .annotate(search=vector, rank=___(vector, query))
    .filter(search=query)
    .order_by("-rank")
)`,
      blanks: ['SearchVector', 'SearchQuery', 'SearchRank'],
      solution: 'vector = SearchVector("title")\nquery = SearchQuery("django")\nresults = (\n    Article.objects\n    .annotate(search=vector, rank=SearchRank(vector, query))\n    .filter(search=query)\n    .order_by("-rank")\n)',
      explanation: '`SearchVector("title")` builds a tsvector, the column\'s words reduced to their stems; `SearchQuery("django")` parses the user\'s words into a tsquery, stemmed the same way; `SearchRank(vector, query)` scores how well each row matches. `.filter(search=query)` keeps only the rows whose `search` annotation matches the query, and `order_by("-rank")` puts the best match first. The filter needs the `search=vector` annotation: `Article` has no `search` field of its own.',
      hints: ['Builds the searchable vector from a field', 'Parses the user\'s search term', 'Scores relevance for ordering'],
      tags: ['django', 'postgres', 'full-text-search', 'SearchVector', 'cloze'],
      concepts: ['inf-postgres'],
    },
  {
      id: 'be-infra-postgres-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Build a search endpoint on PostgreSQL full-text search.

- An \`Article\` model with a \`title\` (a \`CharField\` of up to 300 characters) and a \`body\` (a \`TextField\`).
- An \`ArticleSearchView\` (\`APIView\`) whose GET reads the search words from the \`q\` query parameter. With no \`q\` it returns \`{"results": []}\`.
- Otherwise it searches the title with weight \`"A"\` and the body with weight \`"B"\`, keeps only the articles that match, best match first, and returns \`{"results": [...]}\` holding the \`id\`, \`title\` and \`rank\` of each.`,
      starterCode: `from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
`,
      testCases: [
        {
          input: 'Full-text search setup',
          expectedOutput: 'SearchVector, SearchQuery, SearchRank with annotate and filter',
          description: 'Should implement full-text search with relevance ranking',
        },
      ],
      requires: [/SearchRank/, /weight\s*=\s*["']A["']/, /\.filter\(\s*\w+\s*=\s*(?:[A-Za-z_]\w*\s*\)|SearchQuery\()/],
      solution: `from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.db import models
from rest_framework.response import Response
from rest_framework.views import APIView


class Article(models.Model):
    title = models.CharField(max_length=300)
    body = models.TextField()


class ArticleSearchView(APIView):
    def get(self, request):
        query_text = request.query_params.get("q", "")
        if not query_text:
            return Response({"results": []})

        vector = SearchVector("title", weight="A") + SearchVector("body", weight="B")
        query = SearchQuery(query_text)
        results = (
            Article.objects
            .annotate(search=vector, rank=SearchRank(vector, query))
            .filter(search=query)
            .order_by("-rank")
        )
        data = [{"id": a.id, "title": a.title, "rank": a.rank} for a in results]
        return Response({"results": data})
# OR
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.db import models
from rest_framework.response import Response
from rest_framework.views import APIView


class Article(models.Model):
    title = models.CharField(max_length=300)
    body = models.TextField()


class ArticleSearchView(APIView):
    def get(self, request):
        query_text = request.query_params.get("q", "")
        if not query_text:
            return Response({"results": []})

        vector = SearchVector("title", weight="A") + SearchVector("body", weight="B")
        query = SearchQuery(query_text)
        results = (
            Article.objects
            .annotate(search=vector, rank=SearchRank(vector, query))
            .filter(search=query)
            .order_by("-rank")
        )
        return Response({"results": list(results.values("id", "title", "rank"))})`,
      explanation: '`SearchVector` turns each column into a tsvector, its words reduced to stems, and adding two vectors searches both; weight `"A"` on the title makes a title match score higher than a body match with `"B"`. `SearchQuery` parses the user\'s words the same way, so `running` finds `run`. `.filter(search=query)` keeps only the rows whose combined vector matches, `SearchRank` scores each one, and `order_by("-rank")` puts the best first. Filter on the match, not on `rank__gt=0`: PostgreSQL gives non-matching rows a tiny positive rank, so a rank filter lets them through. Everything runs inside PostgreSQL, with no separate search service.',
      hints: [
        'request.query_params.get("q", "") reads the search words in DRF.',
        'SearchVector("title", weight="A") + SearchVector("body", weight="B") searches both columns.',
        'Annotate the vector and the rank, then filter the vector annotation against the SearchQuery.',
        'order_by("-rank") puts the best match first.',
      ],
      tieredHints: {
        apiSignature: 'SearchVector(*fields, weight=None); SearchQuery(value); SearchRank(vector, query)',
        skeleton: 'from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank\nfrom django.db import models\nfrom rest_framework.response import Response\nfrom rest_framework.views import APIView\n\n\nclass Article(models.Model):\n    title = models.CharField(max_length=300)\n    body = models.TextField()\n\n\nclass ArticleSearchView(APIView):\n    def get(self, request):\n        query_text = request.____.get("q", "")\n        if not query_text:\n            return Response({"results": []})\n\n        vector = ____("title", weight=____) + ____("body", weight=____)\n        query = ____(query_text)\n        results = (\n            Article.objects\n            .annotate(search=vector, rank=____(vector, query))\n            .____(____)\n            .____(____)\n        )\n        data = [{"id": a.id, "title": a.title, "rank": a.rank} for a in results]\n        return Response({"results": data})',
      },
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
      question: 'Write an `Order` model with these fields:\n\n- `customer`: a foreign key to `"Customer"`, deleted along with the customer\n- `reference`: a `CharField` of up to 20 characters\n- `order_status`: a `CharField` of up to 20 characters\n- `created_at`: a `DateTimeField` set when the row is created\n- `total_amount`: a `DecimalField` with 10 digits, 2 after the point\n\nOrders are looked up by `reference` alone, and listed by filtering on `order_status` together with a range of `created_at`. Give `reference` its own index with `db_index`, and declare a composite index named `idx_status_created` on `order_status` then `created_at` in `Meta.indexes`. The foreign key needs nothing extra.',
      starterCode: `from django.db import models
`,
      testCases: [
        {
          input: 'Order model',
          expectedOutput: 'db_index=True on reference + Meta.indexes with Index(fields=["order_status", "created_at"], name="idx_status_created")',
          description: 'Should add indexes for common queries',
        },
      ],
      requires: [/db_index\s*=\s*True/, /idx_status_created/, /\[\s*["']order_status["']\s*,\s*["']created_at["']\s*\]/],
      solution: `from django.db import models


class Order(models.Model):
    customer = models.ForeignKey("Customer", on_delete=models.CASCADE)
    reference = models.CharField(max_length=20, db_index=True)
    order_status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        indexes = [
            models.Index(fields=["order_status", "created_at"], name="idx_status_created"),
        ]`,
      explanation: '`db_index=True` gives one column its own B-tree index, here for lookups by `reference`. A `ForeignKey` is indexed on its own, so `customer` needs nothing extra. `Meta.indexes` declares indexes over several columns: for `WHERE order_status = \'active\' AND created_at > ...` the column compared with `=` goes first, so the index jumps to the `active` entries and reads only the date range inside them. The same index also serves a filter on `order_status` alone, but not one on `created_at` alone. `makemigrations` writes the migration that builds both indexes.',
      hints: ['db_index=True on a field gives it its own index.', 'Django already indexes every ForeignKey.', 'Meta.indexes takes models.Index(fields=[...], name="...").', 'Put the column compared with = first and the range column second.'],
      tieredHints: {
        apiSignature: 'field = models.CharField(..., db_index=True); class Meta: indexes = [models.Index(fields=[...], name="...")]',
        skeleton: 'from django.db import models\n\n\nclass Order(models.Model):\n    customer = models.____("Customer", on_delete=____)\n    reference = models.____(max_length=20, ____=True)\n    order_status = models.____(max_length=20)\n    created_at = models.____(____=True)\n    total_amount = models.____(max_digits=10, decimal_places=2)\n\n    class ____:\n        ____ = [\n            models.____(fields=[____, ____], name=____),\n        ]',
      },
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
      question: 'This query is slow on a large `orders` table:\n\nSELECT * FROM orders WHERE order_status = \'active\' AND created_at > \'2024-01-01\';\n\nWrite two statements: first run the query under EXPLAIN ANALYZE to see the plan PostgreSQL really used and its timings, then create the composite index `idx_orders_status_date` on `orders` (`order_status`, then `created_at`) so the query no longer reads the whole table.\n\nReading the plan:\n- Seq Scan = every row of the table is read\n- Index Scan or Bitmap Index Scan = an index is used\n- Rows Removed by Filter = rows read but not returned\n- Execution Time = the real time in milliseconds',
      starterCode: `-- 1. EXPLAIN ANALYZE the query\n\n-- 2. Create the index\n`,
      testCases: [
        {
          input: 'Slow query on orders table',
          expectedOutput: 'EXPLAIN ANALYZE SELECT ...; CREATE INDEX idx_orders_status_date ...',
          description: 'Should use EXPLAIN ANALYZE',
        },
      ],
      requires: [/EXPLAIN\s+ANALYZE/i, /CREATE\s+INDEX/i],
      solution: `EXPLAIN ANALYZE SELECT * FROM orders WHERE order_status = 'active' AND created_at > '2024-01-01';
CREATE INDEX idx_orders_status_date ON orders (order_status, created_at);`,
      explanation: 'EXPLAIN shows the plan PostgreSQL chose; EXPLAIN ANALYZE also runs the query and reports the real row counts and times. A Seq Scan with a large Rows Removed by Filter means the whole table was read to return a few rows. The index on (order_status, created_at) lets PostgreSQL jump to the \'active\' entries and read only the dates after 2024-01-01: the column compared with = goes first, the range column second. Run EXPLAIN ANALYZE again afterwards to confirm the plan changed; on a small table, or when most rows match, the planner may still choose a Seq Scan, because it is then the faster plan. EXPLAIN ANALYZE really executes the statement, so wrap an UPDATE or DELETE in a transaction you roll back.',
      hints: ['Put EXPLAIN ANALYZE in front of the SELECT.', 'CREATE INDEX name ON table (col1, col2);', 'The column compared with = goes first, the range column second.'],
      tieredHints: {
        apiSignature: 'EXPLAIN ANALYZE <sql_query>; CREATE INDEX <name> ON <table> (<columns>);',
        skeleton: '____ ____ ____;\n____ ____ ____ ____ ____ (____, ____);',
      },
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
        { id: 'c', text: 'Table statistics are stale: run VACUUM ANALYZE so the planner learns the index is selective enough to beat a Seq Scan', isCorrect: true },
        { id: 'd', text: 'B-tree indexes cannot be used on VARCHAR columns; text filters always need a separate GIN trigram index', isCorrect: false },
      ],
      explanation: 'PostgreSQL\'s query planner uses table statistics (row counts, value distribution) to decide whether an index scan or seq scan is faster. After adding an index, if stats are stale, the planner may still choose seq scan. Neither CREATE INDEX nor Django\'s migrate refreshes those statistics; autovacuum does so eventually, and ANALYZE events; (or VACUUM ANALYZE events;) does it at once. With fresh statistics the planner sees that only 50 rows hold \'click\' and switches to an Index Scan. Unlike MySQL, PostgreSQL has no FORCE INDEX: the planner always decides. If stats are current and it still uses seq scan, the index might not be selective enough.',
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
      question: `Write a function \`search(term)\` that returns the \`Article\` rows (fields \`title\` and \`body\`) matching \`term\`, best match first, using PostgreSQL full-text search:

1. One search vector over \`title\` with weight \`"A"\` and \`body\` with weight \`"B"\`.
2. \`term\` parsed in websearch mode (the query class takes \`search_type="websearch"\`), which understands quoted phrases, \`or\`, and a leading \`-\` that excludes a word.
3. Each row annotated with its \`rank\` from \`SearchRank\`, only the rows whose vector matches the query kept, ordered by rank, highest first.`,
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
      requires: [/websearch/, /\.filter\(\s*\w+\s*=\s*(?:[A-Za-z_]\w*\s*\)|SearchQuery\()/],
      solution: `from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from .models import Article


def search(term):
    vector = SearchVector("title", weight="A") + SearchVector("body", weight="B")
    query = SearchQuery(term, search_type="websearch")
    return (
        Article.objects
        .annotate(search=vector, rank=SearchRank(vector, query))
        .filter(search=query)
        .order_by("-rank")
    )
# OR
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from .models import Article


def search(term):
    vector = SearchVector("title", weight="A") + SearchVector("body", weight="B")
    query = SearchQuery(term, search_type="websearch")
    return Article.objects.annotate(search=vector, rank=SearchRank(vector, query)).filter(search=query).order_by("-rank")`,
      explanation: 'The two weighted vectors are added into one, so a match in the title (A) scores higher than one in the body (B). `search_type="websearch"` parses the words the way a search box does: `"exact phrase"`, `cats or dogs`, and `-dogs` to leave out rows with that word. Annotating the vector as `search` lets `.filter(search=query)` keep only the rows that really match, and `SearchRank` gives the score that `order_by("-rank")` sorts on. Filtering on `rank__gt=0` instead is a trap: PostgreSQL gives every non-matching row a tiny positive rank (1e-20), and the rank ignores the `-` exclusion, so that filter returns rows the query rejects. In production, store the vector in a `SearchVectorField` with a GIN index, so a search does not rebuild every row\'s vector.',
      hints: [
        'SearchVector weights: A ranks above B, then C and D.',
        'search_type="websearch" parses quoted phrases, or, and -word.',
        'Annotate the vector too, then filter that annotation against the query.',
        'order_by("-rank") puts the best match first.',
      ],
      tieredHints: {
        apiSignature: 'SearchQuery(value, search_type=\'plain\', config=None)',
        skeleton: 'from django.contrib.postgres.search import ____, ____, ____\nfrom .models import Article\n\n\ndef search(term):\n    vector = ____("title", weight="A") + ____("body", weight="B")\n    query = ____(term, ____="websearch")\n    return (\n        Article.objects\n        .____(search=vector, rank=____(vector, query))\n        .____(____)\n        .____("-rank")\n    )',
      },
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
      question: `An \`Event\` model has a JSONField \`payload\` and a \`created_at\` timestamp. Its payloads look like \`{"type": "order_created", "actor": {"id": 7, "role": "admin"}, "amount": 199}\`, with \`amount\` stored as a JSON number, not a string.

Write a function \`admin_big_order_events()\` that returns, newest first, the events where:

1. \`payload["type"]\` is \`"order_created"\`,
2. the nested \`payload["actor"]["role"]\` is \`"admin"\`, and
3. \`payload["amount"]\` is greater than 100.`,
      starterCode: `from .models import Event
`,
      testCases: [
        {
          input: 'admin order_created with amount > 100',
          expectedOutput: 'three chained JSONField __field / nested __ lookups + numeric comparison',
          description: 'Compound JSONB filtering with nested keys and numeric comparison',
        },
      ],
      requires: [/__gt\s*=\s*100\b/],
      solution: `from .models import Event


def admin_big_order_events():
    return (
        Event.objects
        .filter(payload__type="order_created")
        .filter(payload__actor__role="admin")
        .filter(payload__amount__gt=100)
        .order_by("-created_at")
    )
# OR
from .models import Event


def admin_big_order_events():
    return Event.objects.filter(
        payload__type="order_created",
        payload__actor__role="admin",
        payload__amount__gt=100,
    ).order_by("-created_at")`,
      explanation: 'JSON lookups chain keys with `__` as relations do, so `payload__actor__role` walks into the nested object. A lookup after the key path compares the value: `payload__amount__gt=100` compares the JSON number with 100 (verified: 199 matches, 99 does not), while a string such as `"150"` never matches, because PostgreSQL orders JSON values of different types by type first. Chained `.filter()` calls are joined with AND into one SQL query, the same as passing all three to one `filter()`. A GIN index on `payload` serves `__contains` (`@>`), not these `->` comparisons, so `payload__contains={"type": "order_created", "actor": {"role": "admin"}}` is the form that index can speed up.',
      hints: [
        'payload__key compares one key; payload__key1__key2 walks into a nested object.',
        'Lookups such as __gt after the key path compare the JSON number.',
        'Chained .filter() calls are joined with AND.',
        'order_by("-created_at") puts the newest first.',
      ],
      tieredHints: {
        apiSignature: 'QuerySet.filter(**kwargs).order_by(*fields)',
        skeleton: 'from .models import Event\n\n\ndef admin_big_order_events():\n    return (\n        Event.objects\n        .____(____="order_created")\n        .____(____="admin")\n        .____(____=100)\n        .____("-created_at")\n    )',
      },
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
          text: 'Django migrations only run against PostgreSQL; on SQLite, schema changes must be applied by hand',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'SQLite is a single-file database with one writer at a time; PostgreSQL is a server built for concurrent access and production scale',
          isCorrect: true,
        },
      ],
      explanation: 'SQLite is a library that reads and writes one file on the same machine, and only one writer at a time can change it, which suits development, tests and small single-server sites. PostgreSQL is a database server: many processes, on any number of web servers, connect to it at once and their writes run side by side, and it adds what Django can use beyond SQLite, such as array and range fields and full-text search. With several Gunicorn workers writing at once, SQLite makes them queue for its single write lock and can fail with `database is locked`, and web servers on other machines cannot share its file at all.',
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
          text: 'ArrayField for lists, HStoreField, range fields, and full-text search with SearchVector, SearchQuery and SearchRank',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Django only supports basic SELECT/INSERT/UPDATE/DELETE with PostgreSQL; all advanced features require raw SQL',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'The only PostgreSQL-specific feature is faster query execution; the API is identical to SQLite',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'PostgreSQL features are available through a separate package called django-postgres-extras, not built into Django',
          isCorrect: false,
        },
      ],
      explanation: '`django.contrib.postgres` provides `ArrayField` (a list in one column), `HStoreField` (string key-value pairs), range fields such as `DateRangeField`, full-text search (`SearchVector`, `SearchQuery`, `SearchRank`), trigram similarity, and PostgreSQL index types such as `GinIndex`. You use them like ordinary fields and lookups, but they only work on PostgreSQL. `JSONField` is not on the list: since Django 3.1 it is `models.JSONField` and works on every backend, stored as `jsonb` on PostgreSQL. The case-insensitive `CITextField` family was removed in Django 5.1; a case-insensitive collation replaces it.',
      hints: [
        'Look at django.contrib.postgres for these features',
        'JSONField is now available on all databases in Django 3.1+, but ArrayField and full-text search remain PostgreSQL-only',
      ],
      tags: ['django', 'postgresql', 'jsonfield', 'arrayfield', 'full-text-search'],
      concepts: ['inf-postgres', 'dj-model-construction'],
    },
  {
      id: 'be-sql-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      language: CodeLanguage.SQL,
      question: 'Create a PostgreSQL table "users" with columns: id (auto-incrementing primary key), username (varchar 50, not null, unique), email (varchar 100, not null), created_at (timestamp, default current timestamp).\n\nPostgreSQL makes an auto-incrementing integer with SERIAL or with an identity column (MySQL uses AUTO_INCREMENT, SQLite uses AUTOINCREMENT). Django does this for you with AutoField, but you need to know the raw SQL for migrations and debugging.',
      starterCode: `-- Create users table (PostgreSQL syntax)\n`,
      testCases: [
        {
          input: 'users table',
          expectedOutput: 'CREATE TABLE users with PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT',
          description: 'Should create table with constraints',
        },
      ],
      requires: [/\bUNIQUE\b/i],
      solution: `CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  username VARCHAR(50) NOT NULL UNIQUE,\n  email VARCHAR(100) NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n-- OR\nCREATE TABLE users (\n  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,\n  username VARCHAR(50) NOT NULL UNIQUE,\n  email VARCHAR(100) NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n-- OR\nCREATE TABLE users (\n  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  username VARCHAR(50) NOT NULL UNIQUE,\n  email VARCHAR(100) NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`,
      tieredHints: {
        apiSignature: 'CREATE TABLE name (col TYPE CONSTRAINTS, ...)',
        skeleton: `CREATE TABLE users (
  id ____ PRIMARY KEY,
  username VARCHAR(____) NOT NULL ____,
  email VARCHAR(____) NOT NULL,
  created_at TIMESTAMP DEFAULT ____
);`,
      },
      explanation: 'SERIAL makes an integer column that takes the next number from a sequence; `INTEGER GENERATED BY DEFAULT AS IDENTITY` is the SQL-standard form of the same thing, and it is what Django\'s `AutoField` creates on PostgreSQL since Django 4.1. PRIMARY KEY uniquely identifies rows. NOT NULL prevents empty values. UNIQUE prevents duplicates. DEFAULT sets a value when none is provided. These constraints enforce data integrity at the database level.',
      hints: ['SERIAL = auto-increment in PostgreSQL', 'PRIMARY KEY = unique + not null', 'DEFAULT CURRENT_TIMESTAMP for auto-dating'],
      tags: ['sql', 'create-table', 'constraints', 'database'],
      concepts: ['dj-orm-query-construction', 'dj-model-construction'],
    },
  {
      id: 'be-sql-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      language: CodeLanguage.SQL,
      question: 'Create two indexes on the `orders` table: `idx_orders_user_id` on the `user_id` column, and the composite `idx_orders_status_date` on `status` then `created_at`.',
      starterCode: `-- Create indexes\n`,
      testCases: [
        {
          input: 'orders table',
          expectedOutput: 'CREATE INDEX on user_id and composite on status, created_at',
          description: 'Should create indexes',
        },
      ],
      solution: `CREATE INDEX idx_orders_user_id ON orders(user_id);\nCREATE INDEX idx_orders_status_date ON orders(status, created_at);`,
      tieredHints: {
        apiSignature: 'CREATE INDEX name ON table(col1, col2, ...)',
        skeleton: `CREATE INDEX ____ ON orders(____);
CREATE INDEX ____ ON orders(____, ____);`,
      },
      explanation: 'Indexes speed up queries on indexed columns (like WHERE user_id = 1). Composite indexes help queries that filter on multiple columns (WHERE status = \'active\' AND created_at > ...), and their column order matters: this one also serves a filter on `status` alone, but not one on `created_at` alone. Trade-off: faster reads, slower writes, more storage.',
      hints: ['CREATE INDEX name ON table(column)', 'Composite: ON table(col1, col2)', 'Column order matters in composite indexes'],
      tags: ['sql', 'index', 'performance', 'database'],
      concepts: ['dj-orm-query-construction', 'inf-postgres'],
    },
  {
      id: 'be-sql-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_POSTGRES,
      course: Course.BACKEND,
      language: CodeLanguage.SQL,
      question: 'The `users` table has `id` and `username`, and the `orders` table has `id`, `user_id` and `total`. Write a query that returns the 5 users with the most orders, most first, as two columns: `username` and the number of orders, named `order_count`. Users with no orders can be left out.',
      starterCode: `-- Top 5 users by order count\n`,
      testCases: [
        {
          input: 'users and orders tables',
          expectedOutput: 'JOIN, GROUP BY, COUNT, ORDER BY DESC, LIMIT 5',
          description: 'Should find top users by orders',
        },
      ],
      requires: [/\bDESC\b/i, /\bLIMIT\s+5\b/i],
      solution: `SELECT u.username, COUNT(o.id) AS order_count\nFROM users u\nJOIN orders o ON u.id = o.user_id\nGROUP BY u.username\nORDER BY order_count DESC\nLIMIT 5;\n-- OR\nSELECT u.username, COUNT(o.id) AS order_count\nFROM users u\nJOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.username\nORDER BY order_count DESC\nLIMIT 5;\n-- OR\nSELECT u.username, COUNT(*) AS order_count\nFROM users u\nJOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.username\nORDER BY order_count DESC\nLIMIT 5;\n-- OR\nSELECT users.username, COUNT(orders.id) AS order_count\nFROM users\nJOIN orders ON users.id = orders.user_id\nGROUP BY users.username\nORDER BY order_count DESC\nLIMIT 5;`,
      tieredHints: {
        apiSignature: 'JOIN table alias ON left = right',
        skeleton: `SELECT u.username, ____(o.id) as order_count
FROM users u
____ orders o ON u.id = o.____
____ BY u.username
____ BY order_count ____
LIMIT ____;`,
      },
      explanation: 'JOIN connects users to their orders. GROUP BY aggregates per user. COUNT counts orders per user. ORDER BY DESC sorts highest first. LIMIT 5 returns only top 5. Grouping by `u.id, u.username` keeps two users who share a username apart. This is a fundamental analytics query pattern.',
      hints: ['JOIN to connect tables', 'GROUP BY + COUNT for aggregation', 'ORDER BY DESC LIMIT 5 for top N'],
      tags: ['sql', 'join', 'aggregation', 'group-by', 'database'],
      concepts: ['dj-orm-query-construction'],
    },
];
