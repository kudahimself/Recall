/**
 * Topic.DJ_MODELS_MASTERY — spiral "deep revisit" of Django models (Step 4).
 *
 * Cross-cutting mastery that only makes sense after the whole stack is seen:
 * inheritance-strategy tradeoffs, the validation lifecycle (full_clean vs save),
 * DB-constraint-vs-app-validation integrity, and migration/persistence forensics
 * (bulk ops & queryset .update() bypassing save()/signals). MCQ-led by design —
 * these are decision/tradeoff primitives — with faded on-ramps before the two
 * cold-write codings (proxy model, cross-field clean()).
 *
 * Lane discipline: model definition/integrity/inheritance/validation only.
 * Custom managers → DJ_CUSTOM_MANAGERS; concurrency/select_for_update →
 * DJ_TRANSACTIONS + dj_orm_mastery; signals themselves → DJ_SIGNALS_MW.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_models_mastery_questions: Question[] = [
  // ===== Theme 1: inheritance strategy (abstract vs MTI vs proxy) =====
  {
      id: 'dj-models-mastery-inherit-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS_MASTERY,
      course: Course.BACKEND,
      question: 'Django offers abstract base classes, multi-table inheritance (MTI), and proxy models. Which option correctly pairs each style with what it does at the database level?',
      options: [
        { id: 'a', text: 'Abstract copies fields into each child (no base table); MTI gives the base its own table joined to each child; a proxy reuses the parent table unchanged', isCorrect: true },
        { id: 'b', text: 'Abstract gets its own table; MTI copies fields into children with no base table; a proxy adds new columns to the parent table', isCorrect: false },
        { id: 'c', text: 'All three create exactly one shared table; they differ only in the Python API surface they expose to you', isCorrect: false },
        { id: 'd', text: 'Proxy copies fields into children; abstract joins via an implicit OneToOne; MTI reuses the parent table unchanged', isCorrect: false },
      ],
      explanation: 'Abstract base = pure code reuse: no table for the base, fields copied into each concrete child. MTI = a real base table plus a child table per model, linked by an auto OneToOne (every cross-table access is a JOIN). Proxy = same table as the parent, only Python behaviour (methods, default ordering, managers) changes.',
      hints: [
        'Abstract = fields copied down, no base table',
        'MTI = base table + child tables joined; proxy = same table, new behaviour',
      ],
      tags: ['django', 'models', 'inheritance', 'abstract', 'mti', 'proxy'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-mastery-inherit-mcq-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS_MASTERY,
      course: Course.BACKEND,
      question: 'What is a proxy model (`class Meta: proxy = True`) for, and what can it NOT do?',
      options: [
        { id: 'a', text: 'It reuses the parent\'s table to add Python behaviour (methods, default `ordering`, a custom manager) but cannot add or remove database fields', isCorrect: true },
        { id: 'b', text: 'It creates a separate table with the same columns so you can store a second independent copy of each row', isCorrect: false },
        { id: 'c', text: 'It adds new fields to the parent\'s table without a migration, but cannot override methods or managers', isCorrect: false },
        { id: 'd', text: 'It is an abstract base under another name; it produces no table and cannot be queried directly at all', isCorrect: false },
      ],
      explanation: 'A proxy model operates on the parent\'s existing table — same rows, same columns. You use it to attach a different default manager, a different `Meta.ordering`, or extra methods, while sharing storage. The one hard limit: a proxy may NOT declare new model fields (that would need its own column → a different table).',
      hints: [
        'Proxy = behaviour change over the SAME table',
        'No new fields allowed on a proxy',
      ],
      tags: ['django', 'models', 'inheritance', 'proxy'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-mastery-inherit-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_MODELS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Multi-table inheritance: `Restaurant(Place)`. `place` (pk=1) is a Place row that is also a Restaurant with `serves_pizza=True`. With DEBUG=True, what does this print?',
      code: `from django.db import connection, reset_queries

reset_queries()
p = Place.objects.get(pk=1)
print(len(connection.queries))
print(p.restaurant.serves_pizza)
print(len(connection.queries))`,
      expectedOutput: `1
True
2`,
      explanation: 'Fetching the `Place` is one query. Under MTI, the `Restaurant` data lives in a SEPARATE table, so the downcast `p.restaurant` issues a SECOND query to fetch it — the query count goes 1 → 2. This hidden per-access JOIN/query is the classic cost of multi-table inheritance; abstract inheritance (fields copied into one table) avoids it.',
      hints: ['MTI stores child fields in their own table', 'Downcasting parent → child triggers an extra query'],
      tags: ['django', 'models', 'inheritance', 'mti', 'performance', 'predict'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-mastery-proxy-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_MODELS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'A `Customer` model already exists. Define `VipCustomer` reusing the exact same table, ordered by `-spent` (highest spender first). Fill in the two Meta options.',
      template: `class VipCustomer(Customer):
    class Meta:
        ___ = True
        ___ = ["-spent"]`,
      blanks: ['proxy', 'ordering'],
      solution: 'class VipCustomer(Customer):\n    class Meta:\n        proxy = True\n        ordering = ["-spent"]',
      explanation: '`proxy = True` tells Django this model reuses the parent\'s table — no migration, no new columns. `ordering` (or any other Python-level behaviour: managers, methods) can differ from the parent even though the rows are identical.',
      hints: ['The Meta flag meaning "same table as parent"', 'Meta option for default query ordering'],
      tags: ['django', 'models', 'inheritance', 'proxy', 'cloze'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-mastery-proxy-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_MODELS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'An `Order` model already exists and stores all its data (including a `created_at` field). Without adding any database table or column, define a `RecentOrder` variant that reads and writes the SAME rows as `Order` but whose default ordering is newest-first by `created_at`. Use the inheritance style that reuses the parent table unchanged.',
      starterCode: `from django.db import models

# Assume Order(models.Model) already exists with a created_at field.
# Define RecentOrder reusing Order's table.
`,
      testCases: [
        { input: 'RecentOrder._meta.proxy; RecentOrder._meta.ordering', expectedOutput: 'proxy=True, ordering=["-created_at"]', description: 'Proxy over Order with newest-first default ordering' },
      ],
      solution: `class RecentOrder(Order):
    class Meta:
        proxy = True
        ordering = ["-created_at"]`,
      explanation: 'A proxy model (`proxy = True`) shares the parent\'s table — no migration, no new columns — and only changes Python-level behaviour. Here it sets a different default `ordering`, so `RecentOrder.objects.all()` returns the same rows as `Order` but newest-first. A proxy can add managers/methods/ordering but never new fields.',
      hints: [
        'Inherit from `Order` and set `class Meta: proxy = True`',
        'Add `ordering = ["-created_at"]` in the same Meta',
      ],
      tieredHints: {
        apiSignature: 'class Meta: proxy = True; ordering = []',
        skeleton: 'class RecentOrder(____):\n    class ____:\n        ____ = ____\n        ____ = ["____"]',
      },
      tags: ['django', 'models', 'inheritance', 'proxy', 'ordering'],
      concepts: ['dj-model-construction'],
    },
  // ===== Theme 2: validation lifecycle (full_clean vs save) =====
  {
      id: 'dj-models-mastery-validate-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS_MASTERY,
      course: Course.BACKEND,
      question: 'A `rating` field is declared `validators=[MinValueValidator(0)]`. You run `Article(rating=-5).save()` directly. What happens?',
      options: [
        { id: 'a', text: 'The row is written with `-5` — `Model.save()` does NOT run field validators; only `full_clean()` does', isCorrect: true },
        { id: 'b', text: 'A `ValidationError` is raised before the row is written, because `save()` always validates first', isCorrect: false },
        { id: 'c', text: 'An `IntegrityError` is raised by the database, since a validator emits a CHECK constraint automatically', isCorrect: false },
        { id: 'd', text: 'The value is silently clamped to `0` — the validator\'s minimum — and then the row is written', isCorrect: false },
      ],
      explanation: 'Field `validators` (and the `clean()` hook) run inside `full_clean()`, which `save()` does NOT call. So a direct `.save()` with an invalid value writes it unchanged. Validators only protect you on paths that call `full_clean()` (forms, serializers) — or you add a real DB `CheckConstraint`.',
      hints: [
        'save() skips validation entirely',
        'Validators run in full_clean(), not save()',
      ],
      tags: ['django', 'models', 'validation', 'full_clean', 'save'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-mastery-validate-mcq-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS_MASTERY,
      course: Course.BACKEND,
      question: 'Given that `Model.save()` skips validation, how do field `validators` and `clean()` actually get enforced in a typical app?',
      options: [
        { id: 'a', text: 'Through `full_clean()`, which `ModelForm` and DRF serializers call inside `is_valid()` — so form/serializer-driven writes are validated', isCorrect: true },
        { id: 'b', text: 'Through `save()`, which calls `full_clean()` internally whenever `DEBUG=True` is set in settings', isCorrect: false },
        { id: 'c', text: 'Through the database, which re-runs each Python validator as a trigger on every INSERT/UPDATE', isCorrect: false },
        { id: 'd', text: 'Through `objects.create()`, the one write path that calls `full_clean()` before saving the row', isCorrect: false },
      ],
      explanation: 'The validation entry point is `full_clean()` (which runs `clean_fields()` → `clean()` → `validate_constraints()`). Forms and serializers call it for you during `is_valid()`. Plain ORM writes (`save()`, `create()`, `bulk_create`, `.update()`) do not — if you write through them, call `full_clean()` yourself or rely on DB constraints.',
      hints: [
        'full_clean() is the validation entry point',
        'Forms/serializers call it; raw ORM writes do not',
      ],
      tags: ['django', 'models', 'validation', 'full_clean'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-mastery-validate-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_MODELS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'The `Product.stock` field is declared `models.IntegerField(validators=[MinValueValidator(0)])`. The DB allows negative integers. What does this print?',
      code: `p = Product(stock=-10)
p.save()
print(Product.objects.get(pk=p.pk).stock)`,
      expectedOutput: `-10`,
      explanation: '`save()` never runs the field\'s `MinValueValidator`, so the invalid `-10` is written and read straight back. The validator would only have fired through `full_clean()` (a form/serializer). To make the database itself reject negatives you would add a `CheckConstraint(check=Q(stock__gte=0))`.',
      hints: ['Validators fire in full_clean(), which save() skips', 'The invalid value persists unchanged'],
      tags: ['django', 'models', 'validation', 'save', 'predict'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-mastery-clean-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_MODELS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Add cross-field model validation: an event\'s end date must not fall before its start date. Fill in the model hook that `full_clean()` invokes and the exception type to raise.',
      template: `from django.core.exceptions import ValidationError

class Event(models.Model):
    start = models.DateField()
    end = models.DateField()

    def ___(self):
        if self.end < self.start:
            raise ___("End date cannot be before start date.")`,
      blanks: ['clean', 'ValidationError'],
      solution: 'from django.core.exceptions import ValidationError\n\nclass Event(models.Model):\n    start = models.DateField()\n    end = models.DateField()\n\n    def clean(self):\n        if self.end < self.start:\n            raise ValidationError("End date cannot be before start date.")',
      explanation: 'Cross-field rules (those needing more than one field) go in `clean()`, called by `full_clean()` after per-field validation. Raise `django.core.exceptions.ValidationError` to signal failure — a `ModelForm`/serializer surfaces it as a form error. Remember `save()` won\'t call this on its own.',
      hints: ['Cross-field hook is `clean(self)`', 'Signal failure with `ValidationError`'],
      tags: ['django', 'models', 'validation', 'clean', 'cloze'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-mastery-clean-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_MODELS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define an `Event` model with a `start` date and an `end` date. Add cross-field validation — the model-level hook that `full_clean()` invokes — so that validating an event whose `end` precedes its `start` raises a `ValidationError`.',
      starterCode: `from django.core.exceptions import ValidationError
from django.db import models

class Event(models.Model):
    ...
`,
      testCases: [
        { input: 'Event(start=d2, end=d1).full_clean()  # end before start', expectedOutput: 'raises ValidationError', description: 'clean() enforces end >= start' },
      ],
      solution: `from django.core.exceptions import ValidationError
from django.db import models

class Event(models.Model):
    start = models.DateField()
    end = models.DateField()

    def clean(self):
        if self.end < self.start:
            raise ValidationError("End date cannot be before start date.")`,
      explanation: 'Validation spanning multiple fields belongs in `clean()`, which `full_clean()` runs after the per-field checks. Raising `ValidationError` makes `ModelForm`/serializer `is_valid()` fail with that message. Note `Model.save()` does not call `clean()` — forms/serializers (or an explicit `full_clean()`) do.',
      hints: [
        'Override `def clean(self):`',
        'Compare `self.end < self.start` and `raise ValidationError(...)`',
      ],
      tieredHints: {
        apiSignature: 'def clean(self) -> None',
        skeleton: 'from django.core.exceptions import ____\nfrom django.db import models\n\nclass Event(models.____):\n    start = models.____()\n    end = models.____()\n\n    def ____(self):\n        if self.____ ____ self.____:\n            ____ ____("End date cannot be before start date.")',
      },
      tags: ['django', 'models', 'validation', 'clean'],
      concepts: ['dj-model-construction'],
    },
  // ===== Theme 3: DB constraint vs app-level validation (integrity) =====
  {
      id: 'dj-models-mastery-integrity-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_MODELS_MASTERY,
      course: Course.BACKEND,
      question: 'You enforce "one active subscription per user" by querying for an existing active row inside `clean()` and raising if one is found. Under concurrent requests, duplicates still slip through. Why?',
      options: [
        { id: 'a', text: 'Two requests can both pass the `clean()` check before either commits — only a DB `UniqueConstraint` closes that race atomically', isCorrect: true },
        { id: 'b', text: '`clean()` runs only after the row is committed, so the check always sees stale data and blocks nothing', isCorrect: false },
        { id: 'c', text: '`clean()` validation is cached per user for the request, so the second request skips the check entirely', isCorrect: false },
        { id: 'd', text: 'Querying inside `clean()` opens a separate transaction that disables the app\'s row-level locking', isCorrect: false },
      ],
      explanation: 'A check-then-write in application code has a time-of-check/time-of-use gap: under concurrency, two requests each query, each see "no active row", each pass `clean()`, then both insert. Only the database can enforce this atomically — a partial `UniqueConstraint(condition=Q(is_active=True))` makes the second insert fail with `IntegrityError`. App validation is for UX/messages; the constraint is the real guarantee.',
      hints: [
        'Check-then-act has a race window across requests',
        'A DB UniqueConstraint enforces it atomically',
      ],
      tags: ['django', 'models', 'integrity', 'constraints', 'race-condition'],
      concepts: ['dj-model-construction'],
    },
  // ===== Theme 4: migration & persistence forensics =====
  {
      id: 'dj-models-mastery-migration-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS_MASTERY,
      course: Course.BACKEND,
      question: 'You add a new NON-nullable field to a model whose table already holds thousands of rows. What does `makemigrations` ask for, and what\'s the robust way to populate existing rows with real values?',
      options: [
        { id: 'a', text: 'It prompts for a one-off default for existing rows; for real values, add a `RunPython` data-migration step to backfill (then optionally tighten the field)', isCorrect: true },
        { id: 'b', text: 'Nothing extra — Django leaves existing rows NULL and only enforces non-null on rows inserted afterwards', isCorrect: false },
        { id: 'c', text: 'It refuses outright; you must drop and recreate the table, because NOT NULL can\'t be added once data exists', isCorrect: false },
        { id: 'd', text: 'It backfills every existing row with an empty string automatically, so no default or data migration is needed', isCorrect: false },
      ],
      explanation: 'A new NOT NULL column needs a value for rows that already exist, so `makemigrations` prompts for a one-off default (or you set `default=`). A static default is rarely the right per-row value — the robust pattern is a three-step migration: add the field nullable, a `RunPython` data migration to backfill computed values, then a third migration to enforce NOT NULL.',
      hints: [
        'Existing rows need a value → one-off default prompt',
        'Backfill real values with a RunPython data migration',
      ],
      tags: ['django', 'models', 'migrations', 'data-migration'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-mastery-bulk-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS_MASTERY,
      course: Course.BACKEND,
      question: 'Your model overrides `save()` to set a slug and relies on a `post_save` signal to update a cache. Which write paths BYPASS both the override and the signal?',
      options: [
        { id: 'a', text: '`bulk_create()`, `bulk_update()`, and queryset `.update()` — they hit the DB directly, calling neither `save()` nor `post_save`', isCorrect: true },
        { id: 'b', text: '`objects.create()` and instance `.save()` — these convenience helpers skip the override to stay fast', isCorrect: false },
        { id: 'c', text: 'Only raw SQL via `cursor.execute()` bypasses them; every ORM write path runs `save()` and its signals', isCorrect: false },
        { id: 'd', text: '`full_clean()` and form `is_valid()` — the validation paths skip `save()` and its signals by design', isCorrect: false },
      ],
      explanation: 'The bulk/queryset write paths (`bulk_create`, `bulk_update`, `QuerySet.update()`) translate to direct SQL and never instantiate-and-`save()` each row, so an overridden `save()` and `pre_save`/`post_save` signals are skipped. `objects.create()` and `.save()` DO run them. This is why a derived field (slug) or signal-maintained cache can silently go stale after a bulk operation.',
      hints: [
        'Bulk/`.update()` = direct SQL, no per-row save()',
        'create()/save() do run the override + signals',
      ],
      tags: ['django', 'models', 'bulk', 'save', 'signals'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-mastery-bulk-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_MODELS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'The `Article.save()` override sets `slug = slugify(title)`. A row exists (pk=1) with title `"Hello"`, slug `"hello"`. What does this print?',
      code: `Article.objects.filter(pk=1).update(title="Changed")
a = Article.objects.get(pk=1)
print(a.title)
print(a.slug)`,
      expectedOutput: `Changed
hello`,
      explanation: 'Queryset `.update()` issues a direct SQL UPDATE and never calls the overridden `save()`, so the slug-derivation logic does not run. The title changes to `"Changed"` but the slug stays the stale `"hello"`. To keep a derived field consistent through bulk paths, recompute it explicitly or enforce it in the database.',
      hints: ['.update() bypasses the overridden save()', 'The derived slug goes stale'],
      tags: ['django', 'models', 'bulk', 'save', 'predict'],
      concepts: ['dj-model-construction'],
    },
];
