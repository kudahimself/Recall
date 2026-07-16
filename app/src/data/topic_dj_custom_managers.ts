/**
 * Topic.DJ_CUSTOM_MANAGERS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   celeryDrfQuestions.ts (4), djangoGapFillQuestions.ts (1)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_custom_managers_questions: Question[] = [
    // 1. Coding: Custom model manager
  {
      id: 'celery-drf-22',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CUSTOM_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a custom model manager for Article. Article.objects.published() should return only articles with status="published", ordered by -publish_date. Show the Manager class with get_queryset() and the custom method, and attach it to the model.',
      starterCode: `# models.py\nfrom django.db import models\n\n# Create a custom manager and model\n`,
      testCases: [
        {
          input: 'Custom manager with published() method',
          expectedOutput: 'Manager class, get_queryset, published() method, model with objects = manager',
          description: 'Should create a custom manager with published() filter',
        },
      ],
      solution: `# models.py\nfrom django.db import models\n\n\nclass ArticleManager(models.Manager):\n    def published(self):\n        \"\"\"Return only published articles, newest first.\"\"\"\n        return self.get_queryset().filter(\n            status=\"published\"\n        ).order_by(\"-publish_date\")\n\n    def drafts(self):\n        \"\"\"Return only draft articles.\"\"\"\n        return self.get_queryset().filter(status=\"draft\")\n\n\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n    body = models.TextField()\n    status = models.CharField(\n        max_length=20,\n        choices=[(\"draft\", \"Draft\"), (\"published\", \"Published\")],\n        default=\"draft\",\n    )\n    publish_date = models.DateTimeField(null=True, blank=True)\n    author = models.ForeignKey(\"auth.User\", on_delete=models.CASCADE)\n\n    objects = ArticleManager()  # Replace default manager\n\n    def __str__(self):\n        return self.title\n\n\n# Usage:\n# Article.objects.published()      # Only published articles\n# Article.objects.drafts()          # Only drafts\n# Article.objects.all()             # Still works -- all articles`,
      explanation: 'Custom managers encapsulate common query patterns so you write Article.objects.published() instead of repeating Article.objects.filter(status="published").order_by("-publish_date") everywhere. This follows DRY and makes the API expressive. The manager methods call self.get_queryset() to start from the base queryset, then add filters. Setting objects = ArticleManager() replaces the default manager while keeping .all(), .filter(), etc. working because ArticleManager inherits from models.Manager.',
      hints: [
        'Inherit from models.Manager',
        'Use self.get_queryset().filter(...) in custom methods',
        'objects = YourManager() replaces the default manager on the model',
      ],
      tags: ['django', 'manager', 'custom-manager', 'orm', 'query-patterns'],
      concepts: ['dj-model-manager-vs-queryset', 'dj-orm-query-construction'],
    },
  {
      id: 'dj-custom-managers-queryset-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CUSTOM_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the base class for a chainable custom queryset and the method that converts it into a usable manager.',
      template: `from django.db import models

class ArticleQuerySet(models.___):
    def published(self):
        return self.filter(status="published")

class Article(models.Model):
    status = models.CharField(max_length=20, default="draft")

    objects = ArticleQuerySet.___()`,
      blanks: ['QuerySet', 'as_manager'],
      solution: 'from django.db import models\n\nclass ArticleQuerySet(models.QuerySet):\n    def published(self):\n        return self.filter(status="published")\n\nclass Article(models.Model):\n    status = models.CharField(max_length=20, default="draft")\n\n    objects = ArticleQuerySet.as_manager()',
      explanation: 'Subclassing `models.QuerySet` (not `models.Manager`) means every method must return `self.filter(...)` (or similar) so calls stay chainable — `Article.objects.published().recent()`. `as_manager()` converts the QuerySet class into a Manager so `objects = ArticleQuerySet.as_manager()` still works as the model\'s default manager.',
      hints: ['Base class for a chainable queryset (not Manager)', 'Classmethod that turns the QuerySet into a Manager'],
      tags: ['django', 'queryset', 'custom-queryset', 'as_manager', 'cloze'],
      concepts: ['dj-orm-query-construction'],
    },
    // 2. Coding: Chainable custom QuerySet
  {
      id: 'celery-drf-23',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_CUSTOM_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a chainable custom QuerySet for Article with .published(), .by_author(user), and .recent() methods that all return QuerySets so they can be chained. Attach it to the model using as_manager().',
      starterCode: `# models.py\nfrom django.db import models\nfrom django.utils import timezone\n\n# Create a custom QuerySet with chainable methods\n`,
      testCases: [
        {
          input: 'Custom QuerySet with chainable methods',
          expectedOutput: 'QuerySet class with published(), by_author(), recent(), as_manager()',
          description: 'Should create chainable QuerySet methods',
        },
      ],
      solution: `# models.py\nfrom django.db import models\nfrom django.utils import timezone\nfrom datetime import timedelta\n\n\nclass ArticleQuerySet(models.QuerySet):\n    def published(self):\n        \"\"\"Filter to published articles only.\"\"\"\n        return self.filter(status=\"published\")\n\n    def by_author(self, user):\n        \"\"\"Filter to articles by a specific author.\"\"\"\n        return self.filter(author=user)\n\n    def recent(self, days=7):\n        \"\"\"Filter to articles from the last N days.\"\"\"\n        cutoff = timezone.now() - timedelta(days=days)\n        return self.filter(publish_date__gte=cutoff)\n\n\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n    body = models.TextField()\n    status = models.CharField(max_length=20, default=\"draft\")\n    publish_date = models.DateTimeField(null=True, blank=True)\n    author = models.ForeignKey(\"auth.User\", on_delete=models.CASCADE)\n\n    objects = ArticleQuerySet.as_manager()\n\n    def __str__(self):\n        return self.title\n\n\n# Chainable usage:\n# Article.objects.published().by_author(user).recent()\n# Article.objects.published().recent(days=30).order_by(\"-publish_date\")\n# Article.objects.by_author(user).count()`,
      explanation: 'Custom QuerySet methods are chainable because each method returns a QuerySet. This is more powerful than Manager methods because you can compose filters: Article.objects.published().by_author(user).recent() builds a single SQL query with all three WHERE conditions. as_manager() converts the QuerySet into a Manager, so you still use Article.objects.published(). The key difference from a custom Manager: QuerySet methods MUST return QuerySets (enabling chaining), while Manager methods can return anything. Use QuerySet when you need composability.',
      hints: [
        'Inherit from models.QuerySet, not models.Manager',
        'Each method must return self.filter(...) to stay chainable',
        'as_manager() converts your QuerySet into a Manager for the model',
      ],
      tags: ['django', 'queryset', 'custom-queryset', 'chaining', 'orm'],
      concepts: ['dj-orm-query-construction'],
    },
    // 3. MC: Manager vs QuerySet
  {
      id: 'celery-drf-24',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CUSTOM_MANAGERS,
      course: Course.BACKEND,
      question: 'What is the difference between a custom Manager and a custom QuerySet in Django?',
      options: [
        { id: 'a', text: 'Manager methods can return anything (counts, booleans, etc.); QuerySet methods must return QuerySets so they chain -- as_manager() gives both', isCorrect: true },
        { id: 'b', text: 'Managers handle read operations while QuerySets handle writes -- Django routes each query type to the matching class automatically', isCorrect: false },
        { id: 'c', text: 'They are the same class under different names -- Django aliases Manager to QuerySet so older import paths continue to work', isCorrect: false },
        { id: 'd', text: 'Custom QuerySets are deprecated -- since Django 4.0 all reusable query logic is supposed to live in Manager subclasses instead', isCorrect: false },
      ],
      explanation: 'A Manager is the interface for database operations (Article.objects). A QuerySet is a lazy, chainable collection of database queries. Manager methods like objects.get_stats() can return dictionaries, integers, or anything. QuerySet methods like .published().recent() must return QuerySets so they chain into a single SQL query. The pattern objects = ArticleQuerySet.as_manager() gives you chainable filter methods available directly on objects. Use a separate Manager when you need methods that return non-QuerySet values (e.g., aggregate stats).',
      tags: ['django', 'manager', 'queryset', 'orm', 'design-patterns'],
      concepts: ['dj-model-manager-vs-queryset', 'dj-orm-query-construction'],
    },
    // 4. MC: Soft delete pattern
  {
      id: 'celery-drf-25',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CUSTOM_MANAGERS,
      course: Course.BACKEND,
      question: 'What is a "soft delete" pattern and how do you implement it in Django?',
      options: [
        { id: 'a', text: 'Use Django signals to copy every deleted row into a separate audit table, so the data survives even though the DELETE still runs', isCorrect: false },
        { id: 'b', text: 'Move deleted records into a separate archive database using database routers, keeping the primary database small and fast', isCorrect: false },
        { id: 'c', text: 'Add an is_deleted flag + deleted_at timestamp, filter them out in the default manager, and keep an all_objects manager -- never actually DELETE', isCorrect: true },
        { id: 'd', text: 'Install database-level triggers that reject DELETE statements, forcing all removals to go through a stored procedure instead', isCorrect: false },
      ],
      explanation: 'Soft delete keeps data recoverable and maintains referential integrity. Implementation: (1) Add is_deleted=BooleanField(default=False) and deleted_at=DateTimeField(null=True). (2) Override delete() on the model to set these fields instead of actually deleting. (3) Set the default manager to filter(is_deleted=False) so soft-deleted records are invisible by default. (4) Add all_objects=models.Manager() for admin views that need to see everything. (5) Optionally, add a restore() method. This is critical for compliance (GDPR audit trails), undo functionality, and debugging production issues where you need to see what was "deleted".',
      tags: ['django', 'soft-delete', 'manager', 'design-patterns', 'data-integrity'],
      concepts: ['dj-model-manager-vs-queryset'],
    },
  {
      id: 'dj-custom-managers-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CUSTOM_MANAGERS,
      course: Course.BACKEND,
      question: 'What is a Django model Manager?\n\nWhen you write Article.objects.all() or Article.objects.filter(status="published"), you are using the Manager. But what exactly is it?',
      options: [
        {
          id: 'a',
          text: 'A form class that validates and manages user input when creating or editing model instances through Django templates',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'A Django admin class that controls how the model appears in the admin panel, including list columns and search fields',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'A migration tool that tracks schema changes when you modify models and generates the SQL needed to apply them safely',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'The interface for database queries — .all(), .filter(), .create() come from the default manager (Article.objects), and you can add custom ones',
          isCorrect: true,
        },
      ],
      explanation: 'Every Django model has at least one Manager, and by default it is called "objects". The Manager is the gateway to database operations — all(), filter(), get(), create(), aggregate() etc. are Manager methods. You can create custom Managers to add domain-specific query methods. For example, Article.published.all() could return only published articles, keeping your views clean and your query logic reusable and DRY.',
      hints: [
        '"objects" is just the default name for the default Manager',
        'Custom managers let you encapsulate common queries like .published() or .active()',
      ],
      tags: ['django', 'managers', 'orm', 'queryset', 'basics'],
      concepts: ['dj-orm-query-construction'],
    },
  {
    id: 'dj-custom-managers-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DJ_CUSTOM_MANAGERS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Complete the definition of a custom manager that filters QuerySet results to only return objects with `active=True`.',
    template: `from django.db import models

class ActiveManager(models.Manager):
    def get_queryset(self):
        return super().___(active=True)

class Account(models.Model):
    active = models.BooleanField(default=True)
    ___ = ActiveManager()`,
    blanks: ['get_queryset().filter', 'objects'],
    solution: `from django.db import models

class ActiveManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(active=True)

class Account(models.Model):
    active = models.BooleanField(default=True)
    objects = ActiveManager()`,
    explanation: 'To filter the base query results of a custom manager, you override `get_queryset` and call `super().get_queryset().filter(...)`. Then, you assign the manager class instance to the model attribute `objects` to replace the default manager.',
    hints: [
      'Override get_queryset and call super() to obtain the base QuerySet, then chain filter()',
      'Assign the manager instance to objects on the model class to override the default manager',
    ],
    tags: ['django', 'managers', 'custom-manager', 'orm', 'cloze'],
    concepts: ['dj-model-manager-vs-queryset'],
  },
];
