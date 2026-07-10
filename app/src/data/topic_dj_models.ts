/**
 * Topic.DJ_MODELS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendAdvancedQuestions.ts (1), backendQuestions.ts (5), djangoAdvancedRungQuestions.ts (2), djangoClozeQuestions.ts (3), djangoGapDj4eQuestions.ts (11), djangoParsonsQuestions.ts (3), djangoPredictOutputQuestions.ts (3)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_models_questions: Question[] = [
  {
      id: 'dj-model-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a Django model "Article" with fields: title (CharField max 200), body (TextField), author (CharField max 100), published_date (DateTimeField auto_now_add), and is_published (BooleanField default False).',
      starterCode: `from django.db import models\n\nclass Article(models.Model):\n`,
      testCases: [
        {
          input: 'Article model',
          expectedOutput: 'Model with CharField, TextField, DateTimeField, BooleanField',
          description: 'Should define Django model with correct fields',
        },
      ],
      solution: `from django.db import models\n\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n    body = models.TextField()\n    author = models.CharField(max_length=100)\n    published_date = models.DateTimeField(auto_now_add=True)\n    is_published = models.BooleanField(default=False)\n\n    def __str__(self):\n        return self.title`,
      explanation: 'Django models map to database tables. Each class attribute is a column. CharField needs max_length. auto_now_add=True sets the timestamp on creation. __str__ defines what appears in the admin panel and shell.',
      hints: ['Inherit from models.Model', 'CharField requires max_length', 'auto_now_add sets timestamp on creation'],
      tags: ['model', 'fields', 'django', 'orm'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-model-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a Django model "Comment" with a ForeignKey to "Article" (on_delete=CASCADE), author (CharField max 100), body (TextField), and created_at (DateTimeField auto_now_add).',
      starterCode: `from django.db import models\n\nclass Comment(models.Model):\n`,
      testCases: [
        {
          input: 'Comment model with ForeignKey',
          expectedOutput: 'ForeignKey to Article with on_delete=CASCADE',
          description: 'Should create model with ForeignKey',
        },
      ],
      solution: `from django.db import models\n\nclass Comment(models.Model):\n    article = models.ForeignKey("Article", on_delete=models.CASCADE)\n    author = models.CharField(max_length=100)\n    body = models.TextField()\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    def __str__(self):\n        return f"Comment by {self.author} on {self.article}"`,
      explanation: 'ForeignKey creates a many-to-one relationship (many comments per article). on_delete=CASCADE deletes comments when the article is deleted. Other options: PROTECT (prevent deletion), SET_NULL (set to null), SET_DEFAULT.',
      hints: ['models.ForeignKey(Model, on_delete=...)', 'CASCADE deletes children with parent', 'Access reverse: article.comment_set.all()'],
      tags: ['foreignkey', 'model', 'relationship', 'django'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-model-str',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a Django model `Book` with a 200-char `title` field and a 100-char `author` field (use Django\'s short-string field type for both). Add the dunder method that controls human-readable rendering (used by the admin list page, shell, and logs) so that `str(Book(title="Dune", author="Herbert"))` returns `"Dune by Herbert"`.',
      starterCode: `from django.db import models
  `,
      testCases: [
        {
          input: 'str(Book(title="Dune", author="Herbert"))',
          expectedOutput: 'Dune by Herbert',
          description: '__str__ overrides default "Book object (None)" repr',
        },
      ],
      solution: `from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.title} by {self.author}"`,
      explanation: 'Without `__str__`, Django falls back to `"Book object (None)"` — useless in the admin list view, the shell REPL, and tracebacks. Always define `__str__` on models. Keep it cheap: don\'t hit related objects, don\'t concatenate long text. The admin sidebar, change list, and inline forms all call it.',
      hints: [
        '__str__ returns the human-readable label',
        'Used by admin list page, shell, logs, tracebacks',
        'Keep it cheap — no DB hits, no long strings',
      ],
      tags: ['model', 'django', 'str', 'repr'],
      concepts: ['dj-model-construction', 'py-builtin-io'],
    },
  {
      id: 'dj-model-meta',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a Django model `Article` with a 200-char `title` field and a `created_at` timestamp field that auto-populates when rows are first inserted. Give the model class-level metadata (via Django\'s inner config class) that sets the default ordering to newest-first by `created_at`, and sets the admin sidebar plural label to `"Articles"`. After this, querying all `Article` rows should return newest-first without any explicit sort call.',
      starterCode: `from django.db import models
  `,
      testCases: [
        {
          input: 'Article with Meta ordering and verbose_name_plural',
          expectedOutput: 'Model with inner class Meta defining ordering and verbose_name_plural',
          description: 'class Meta provides class-level metadata',
        },
      ],
      solution: `from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Articles"`,
      explanation: '`class Meta` declares non-field class-level model options. Common entries: `ordering` (default sort — accepts `"-field"` for descending), `verbose_name` and `verbose_name_plural` (admin labels), `db_table` (override the auto-generated table name), `indexes` and `constraints` (DB-level indexes/CHECK constraints), `unique_together` (multi-column uniqueness), `abstract = True` (make it an abstract base class — won\'t create a table). Meta ordering is used by the admin list page and by any queryset that doesn\'t call `.order_by()`.',
      hints: [
        'class Meta: is an inner class inside the model',
        'ordering = ["-field"] — leading minus means DESC',
        'Other Meta options: verbose_name, db_table, indexes, constraints',
      ],
      tags: ['model', 'django', 'meta', 'ordering'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the field types: title is bounded text up to 200 chars; body is unbounded text; created_at stamps the row when created.',
      template: `class Article(models.Model):
      title = models.___(max_length=200)
      body = models.___()
      created_at = models.DateTimeField(auto_now_add=___)`,
      blanks: ['CharField', 'TextField', 'True'],
      solution: 'class Article(models.Model):\n    title = models.CharField(max_length=200)\n    body = models.TextField()\n    created_at = models.DateTimeField(auto_now_add=True)',
      explanation: '`CharField` for short bounded strings (requires `max_length`); `TextField` for unbounded text. `auto_now_add=True` sets the timestamp once at creation; `auto_now=True` updates it on every save (use for `updated_at`).',
      hints: ['Bounded vs unbounded text fields', 'auto_now_add stamps once at insert'],
      tags: ['django', 'models', 'CharField', 'TextField', 'cloze'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Comments belong to an Article and should be deleted when the parent Article is removed.',
      template: `class Comment(models.Model):
      article = models.___(Article, on_delete=models.___)
      body = models.TextField()`,
      blanks: ['ForeignKey', 'CASCADE'],
      solution: 'class Comment(models.Model):\n    article = models.ForeignKey(Article, on_delete=models.CASCADE)\n    body = models.TextField()',
      explanation: '`ForeignKey` is the many-to-one relation. `on_delete` has been mandatory since Django 2.0 — `CASCADE` is the most common choice for tightly-coupled child rows. Other options: `PROTECT` (raises on delete), `SET_NULL` (requires `null=True`), `SET_DEFAULT`, `DO_NOTHING`.',
      hints: ['Many-to-one is ForeignKey', 'CASCADE deletes children'],
      tags: ['django', 'models', 'ForeignKey', 'on_delete', 'cloze'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Make Article admin display use the title and order articles by newest-first by default.',
      template: `class Article(models.Model):
      title = models.CharField(max_length=200)
      created_at = models.DateTimeField(auto_now_add=True)
  
      class ___:
          ordering = ["___"]
  
      def ___(self):
          return self.title`,
      blanks: ['Meta', '-created_at', '__str__'],
      solution: 'class Article(models.Model):\n    title = models.CharField(max_length=200)\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    class Meta:\n        ordering = ["-created_at"]\n\n    def __str__(self):\n        return self.title',
      explanation: '`class Meta:` (capital M) is Django\'s convention for model options. `ordering` is a list; the `-` prefix makes it descending. `__str__` controls how the instance appears in the admin and `print()`.',
      hints: ['Inner class is "Meta"', '"-field" for descending', '__str__ returns the display name'],
      tags: ['django', 'models', 'Meta', 'ordering', '__str__', 'cloze'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj4e-fk-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      question: 'In a one-to-many relationship (e.g. one Author, many Books), which model holds the `ForeignKey` field?',
      options: [
        { id: 'a', text: 'The Book model — the "many" side holds the ForeignKey pointing to Author', isCorrect: true },
        { id: 'b', text: 'The Author model — each author references their books', isCorrect: false },
        { id: 'c', text: 'Both models hold a ForeignKey to each other', isCorrect: false },
        { id: 'd', text: 'A third junction model always holds the ForeignKey', isCorrect: false },
      ],
      explanation: 'In a one-to-many relationship, the **many** side holds the `ForeignKey`. A `Book` has one `Author`, so `Book` has `author = models.ForeignKey(Author, on_delete=models.CASCADE)`. Django automatically creates a reverse relation — `author.book_set.all()` gives all books for that author (or a custom name via `related_name`).',
      hints: [
        'The "many" side (Book) points to the "one" side (Author)',
        'Django creates a reverse accessor automatically: `author.book_set.all()`',
      ],
      tags: ['django', 'models', 'ForeignKey', 'one-to-many', 'relationships'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj4e-fk-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      question: 'What does `on_delete=models.CASCADE` mean in a ForeignKey definition?',
      options: [
        { id: 'a', text: 'When the child is deleted, the parent is also deleted', isCorrect: false },
        { id: 'b', text: 'When the parent is deleted, all related children are automatically deleted too', isCorrect: true },
        { id: 'c', text: 'The field cannot be deleted without manual intervention', isCorrect: false },
        { id: 'd', text: 'Changes cascade from child to parent automatically', isCorrect: false },
      ],
      explanation: '`on_delete` defines what happens to child rows when the parent is deleted. `CASCADE` = delete all children too. Other options: `PROTECT` = raise `ProtectedError` (prevent deletion), `SET_NULL` = set FK to null (requires `null=True`), `SET_DEFAULT` = set to default value, `DO_NOTHING` = database decides (risky). Always choose explicitly.',
      hints: [
        '`CASCADE` = delete children when parent is deleted',
        'Other options: `PROTECT`, `SET_NULL`, `SET_DEFAULT`',
      ],
      tags: ['django', 'models', 'ForeignKey', 'on_delete', 'CASCADE'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj4e-fk-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      question: 'What is `related_name` on a ForeignKey, and why would you use it?',
      options: [
        { id: 'a', text: 'It renames the ForeignKey field itself', isCorrect: false },
        { id: 'b', text: 'It makes the relationship bidirectional', isCorrect: false },
        { id: 'c', text: 'It customises the reverse accessor name on the related model (instead of the default `modelname_set`)', isCorrect: true },
        { id: 'd', text: 'It is required when the related model is in a different app', isCorrect: false },
      ],
      explanation: 'By default, Django creates a reverse accessor named `modelname_set` (e.g. `author.book_set.all()`). `related_name="books"` gives you a cleaner API: `author.books.all()`. You **must** set `related_name` when a model has two ForeignKeys to the same model, otherwise Django raises a `SystemCheckError` about clashing reverse accessors.',
      hints: [
        'Without `related_name`: `author.book_set.all()`; with it: `author.books.all()`',
        'Required when two FKs on the same model point to the same target',
      ],
      tags: ['django', 'models', 'ForeignKey', 'related_name', 'reverse-relation'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj4e-fk-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define `Author` and `Book` models with a one-to-many relationship. Book should have a `title`, `published_year`, and a ForeignKey to Author with `related_name="books"`. Then write a query to get all books by a specific author.',
      starterCode: `# Import models from django.db


# Define Author with name (CharField max_length=200) and __str__ returning self.name


# Define Book with:
#   title (CharField, max_length=300)
#   published_year (IntegerField)
#   author = ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
#   __str__ returning self.title
`,
      testCases: [
        { input: 'Book._meta.get_field("author").related_query_name()', expectedOutput: 'books', description: 'related_name should be "books"' },
      ],
      solution: `from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=300)
    published_year = models.IntegerField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")

    def __str__(self):
        return self.title

# Queries:
# author = Author.objects.get(name="Tolkien")
# all_books = author.books.all()
# recent_books = author.books.filter(published_year__gte=2000)`,
      explanation: '`related_name="books"` gives `author.books.all()` instead of the default `author.book_set.all()`. The `__gte` lookup (`>=`) filters by year. Django\'s ORM translates these to SQL JOINs automatically. `on_delete=models.CASCADE` means deleting an Author deletes all their Books.',
      hints: [
        'ForeignKey goes on Book: `author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")`',
        'Query via reverse relation: `author.books.all()`',
      ],
      tags: ['django', 'models', 'ForeignKey', 'related_name', 'ORM', 'one-to-many'],
      concepts: ['dj-model-construction', 'dj-orm-query-construction'],
    },
  {
      id: 'dj4e-fk-5',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      question: 'What is `select_related()` in Django and when should you use it?',
      options: [
        { id: 'a', text: 'It selects only specific fields from the database', isCorrect: false },
        { id: 'b', text: 'It caches query results for 5 minutes', isCorrect: false },
        { id: 'c', text: 'It selects related objects asynchronously in the background', isCorrect: false },
        { id: 'd', text: 'It performs a SQL JOIN to fetch related ForeignKey objects in a single query, avoiding N+1 queries', isCorrect: true },
      ],
      explanation: 'The N+1 problem: if you query 100 books and access `book.author.name` in a loop, Django makes 100 extra queries (one per book). `Book.objects.select_related("author")` does a single JOIN and fetches all authors at once. Use `select_related` for ForeignKey/OneToOne fields (forward relations). Use `prefetch_related` for ManyToMany or reverse FK relations.',
      hints: [
        '`select_related` = one SQL JOIN; no extra queries per object',
        'Use for ForeignKey (forward). Use `prefetch_related` for M2M or reverse FK',
      ],
      tags: ['django', 'ORM', 'select_related', 'N+1', 'performance', 'JOIN'],
      concepts: ['dj-orm-query-construction', 'dj-select-related-vs-prefetch', 'dj-n-plus-one'],
    },
  {
      id: 'dj4e-m2m-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      question: 'When do you use a ManyToManyField in Django? Give a real example.',
      options: [
        { id: 'a', text: 'When one object must belong to exactly two other objects at once', isCorrect: false },
        { id: 'b', text: 'When you need a nullable relationship that ForeignKey can\'t express', isCorrect: false },
        { id: 'c', text: 'When both sides can have many counterparts, like students and courses', isCorrect: true },
        { id: 'd', text: 'Only when a model relates to itself in a self-referential way', isCorrect: false },
      ],
      explanation: 'ManyToMany: both sides can have multiple related objects. Examples: students ↔ courses, posts ↔ tags, movies ↔ actors. Django creates a hidden junction table automatically to store the pairs. Unlike ForeignKey (which goes on the "many" side), `ManyToManyField` can go on either model — choose whichever makes more semantic sense.',
      hints: [
        'Many-to-many: "a student takes many courses AND a course has many students"',
        'Django creates the junction table automatically',
      ],
      tags: ['django', 'models', 'ManyToManyField', 'relationships', 'many-to-many'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj4e-m2m-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define two Django models, `Tag` and `Article`. A tag has a `name` (text, at most 50 chars) and no two tags may share the same name; printing a tag shows its name. An article has a `title` (text, at most 200 chars) and printing it shows its title. An article can carry many tags and a tag can belong to many articles. Wire the relationship from `Article` so you can call `article.tags.add(tag)`, and so the reverse side reads `tag.articles.all()`.',
      starterCode: `from django.db import models

# class Tag(models.Model):
#     ...

# class Article(models.Model):
#     ...
`,
      testCases: [
        { input: 'hasattr(Article, "tags")', expectedOutput: 'True', description: 'Article should have a tags attribute' },
      ],
      solution: `from django.db import models

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Article(models.Model):
    title = models.CharField(max_length=200)
    tags = models.ManyToManyField(Tag, related_name="articles")

    def __str__(self):
        return self.title

# article.tags.add(tag)         — add a tag
# article.tags.remove(tag)      — remove a tag
# article.tags.all()            — all tags on this article
# Tag.objects.get(name="python").articles.all()  — reverse lookup`,
      explanation: '`ManyToManyField` creates a hidden join table `article_tags`. `.add()`, `.remove()`, `.set()`, `.clear()` manage the relationships. The `related_name="articles"` gives `tag.articles.all()` on the Tag side. `prefetch_related("tags")` avoids N+1 when loading many articles with their tags.',
      hints: [
        '`tags = models.ManyToManyField(Tag, related_name="articles")`',
        'Use `.add()`, `.remove()`, `.all()` to manage the M2M relationship',
      ],
      tags: ['django', 'models', 'ManyToManyField', 'tags', 'many-to-many'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj4e-m2m-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      question: 'When should you use a `through` model for a ManyToMany relationship instead of the automatic junction table?',
      options: [
        { id: 'a', text: 'When you need to store extra data on the relationship itself (e.g. the date a student enrolled in a course)', isCorrect: true },
        { id: 'b', text: 'Always — the `through` model is always required for ManyToMany', isCorrect: false },
        { id: 'c', text: 'When the two related models are in different apps', isCorrect: false },
        { id: 'd', text: 'Only for self-referential many-to-many relationships', isCorrect: false },
      ],
      explanation: 'The automatic junction table only stores the two FK IDs. If you need extra fields on the relationship (e.g. `enrollment_date`, `role`, `grade`), create an explicit `through` model: `class Enrollment(models.Model): student = FK(Student); course = FK(Course); enrolled_date = DateField()`. Then `ManyToManyField(Course, through="Enrollment")`.',
      hints: [
        '`through` model = extra fields on the relationship',
        'The through model has ForeignKeys to both sides plus your extra fields',
      ],
      tags: ['django', 'models', 'ManyToManyField', 'through', 'junction-table', 'intermediate'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj4e-m2m-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create Student, Course, and Enrollment models. Enrollment is the `through` model storing `enrolled_date`. Show how to enrol a student and query a student\'s courses.',
      starterCode: `from django.db import models
from django.utils import timezone

# Student, Course, and Enrollment (the through model holding enrolled_date).
# Course reaches its students via the M2M; the reverse side reads student.courses.
`,
      testCases: [
        { input: 'hasattr(Enrollment, "enrolled_date")', expectedOutput: 'True', description: 'Enrollment should have enrolled_date' },
      ],
      solution: `from django.db import models
from django.utils import timezone

class Student(models.Model):
    name = models.CharField(max_length=100)

class Course(models.Model):
    title = models.CharField(max_length=200)
    students = models.ManyToManyField(
        Student,
        through='Enrollment',
        related_name='courses'
    )

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_date = models.DateField(default=timezone.now)

# Enrol: Enrollment.objects.create(student=student, course=course)
# Query: student.courses.all()
# With date: Enrollment.objects.filter(student=student).select_related("course")`,
      explanation: 'The `through` model has two ForeignKeys (to Student and Course) plus the extra field `enrolled_date`. You can no longer use `.add()` — instead create `Enrollment` objects directly. You can still use `student.courses.all()` for simple M2M queries, or query `Enrollment` directly when you need the extra fields.',
      hints: [
        'Enrollment needs FK to Student, FK to Course, and the date field',
        'Create enrollments with `Enrollment.objects.create(student=..., course=...)`',
      ],
      tags: ['django', 'models', 'ManyToManyField', 'through', 'Enrollment', 'intermediate'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj4e-m2m-5',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      question: 'What is `prefetch_related()` and how does it differ from `select_related()`?',
      options: [
        { id: 'a', text: 'They are identical — use either one for any relationship type', isCorrect: false },
        { id: 'b', text: '`select_related` uses SQL JOINs (for FK/O2O); `prefetch_related` makes separate queries and joins in Python (for M2M or reverse FK)', isCorrect: true },
        { id: 'c', text: '`prefetch_related` is only for GenericForeignKey; `select_related` is for everything else', isCorrect: false },
        { id: 'd', text: '`prefetch_related` caches the result; `select_related` always queries fresh', isCorrect: false },
      ],
      explanation: '`select_related` does a SQL JOIN — efficient for FK/O2O (forward relations). `prefetch_related` does two separate queries and joins the results in Python — necessary for M2M and reverse FK relations (where a JOIN would cause row duplication). For `Article.objects.prefetch_related("tags")`, Django does: 1) get all articles, 2) get all tags for those articles, 3) Python-side join.',
      hints: [
        'FK forward → `select_related` (JOIN); M2M or reverse FK → `prefetch_related` (2 queries)',
        'Both solve N+1 but with different SQL strategies',
      ],
      tags: ['django', 'ORM', 'prefetch_related', 'select_related', 'performance', 'M2M'],
      concepts: ['dj-orm-query-construction', 'dj-select-related-vs-prefetch'],
    },
  {
      id: 'dj-models-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Assemble an `Article` model with a 200-char title and a TextField body. Inherit from models.Model.',
      correctOrder: [
        'from django.db import models',
        '',
        'class Article(models.Model):',
        '    title = models.CharField(max_length=200)',
        '    body = models.TextField()',
      ],
      distractorLines: [
        'class Article:',
        '    title = models.CharField()',
        '    body = models.CharField(max_length=200)',
        'from django import models',
      ],
      solution: 'from django.db import models\n\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n    body = models.TextField()',
      explanation: 'Models inherit from `django.db.models.Model`. `CharField` requires `max_length`; `TextField` is for unbounded text and does not. The import is `from django.db import models`, not `from django import models`.',
      hints: ['Inherit from models.Model', 'CharField needs max_length; TextField does not', 'Import is from django.db'],
      tags: ['django', 'models', 'CharField', 'TextField', 'parsons'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Assemble a `Comment` model that links to `Article` via a ForeignKey, deletes when its parent Article is deleted, and orders newest comments first. Use a Meta inner class for ordering.',
      correctOrder: [
        'class Comment(models.Model):',
        '    article = models.ForeignKey(Article, on_delete=models.CASCADE)',
        '    body = models.TextField()',
        '    created_at = models.DateTimeField(auto_now_add=True)',
        '',
        '    class Meta:',
        '        ordering = ["-created_at"]',
      ],
      distractorLines: [
        '    article = models.ForeignKey(Article)',
        '    article = models.ForeignKey("Article", on_delete=models.SET_NULL)',
        '        ordering = "-created_at"',
        '    Meta:',
      ],
      solution: 'class Comment(models.Model):\n    article = models.ForeignKey(Article, on_delete=models.CASCADE)\n    body = models.TextField()\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    class Meta:\n        ordering = ["-created_at"]',
      explanation: '`on_delete` is mandatory on `ForeignKey` since Django 2.0. `CASCADE` deletes the Comment when its Article is deleted. `Meta.ordering` is a *list* (not a string); the `-` prefix means descending. `auto_now_add=True` sets the timestamp once on creation.',
      hints: ['ForeignKey requires on_delete', 'Meta.ordering must be a list', '-field for descending'],
      tags: ['django', 'models', 'ForeignKey', 'Meta', 'parsons'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Add a `__str__` method to `Article` that returns the title, plus a `STATUS_CHOICES` constant and a `status` field that uses it with default "draft".',
      correctOrder: [
        'class Article(models.Model):',
        '    STATUS_CHOICES = [("draft", "Draft"), ("published", "Published")]',
        '    title = models.CharField(max_length=200)',
        '    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")',
        '',
        '    def __str__(self):',
        '        return self.title',
      ],
      distractorLines: [
        '    STATUS_CHOICES = {"draft": "Draft", "published": "Published"}',
        '    status = models.CharField(choices=STATUS_CHOICES)',
        '    def __str__():',
        '        return title',
      ],
      solution: 'class Article(models.Model):\n    STATUS_CHOICES = [("draft", "Draft"), ("published", "Published")]\n    title = models.CharField(max_length=200)\n    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")\n\n    def __str__(self):\n        return self.title',
      explanation: '`choices` expects a list of `(stored_value, display_label)` tuples — not a dict. `__str__` takes `self` and returns a string; the admin and `print(article)` both use it. `default="draft"` means new instances get that value automatically.',
      hints: ['choices is a list of tuples', '__str__(self) returns self.title', 'default sets initial value'],
      tags: ['django', 'models', 'choices', '__str__', 'parsons'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this print? Assume Article(title="Hello") was created.',
      code: `class Article(models.Model):
    title = models.CharField(max_length=200)

    def __str__(self):
        return self.title

a = Article(title="Hello")
print(a)
print(str(a))`,
      expectedOutput: `Hello
Hello`,
      explanation: '`print(obj)` calls `str(obj)` which calls `obj.__str__()` — Django\'s admin and templates rely on this. Without `__str__`, both lines would print something like `Article object (None)`.',
      hints: ['print() calls str() calls __str__', '__str__ controls how the model shows up everywhere'],
      tags: ['django', 'models', '__str__', 'predict'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'An Article exists with 3 Comments via ForeignKey on_delete=CASCADE. After `article.delete()`, what does this print?',
      code: `# Setup: 3 comments exist linked to article (id=1)
print(Comment.objects.count())
article = Article.objects.get(pk=1)
article.delete()
print(Comment.objects.count())`,
      expectedOutput: `3
0`,
      explanation: '`on_delete=CASCADE` means deleting the parent Article cascades to its child Comments. Other options: `PROTECT` (raises ProtectedError), `SET_NULL` (requires `null=True`), `SET_DEFAULT`, `DO_NOTHING` (no FK enforcement at DB level).',
      hints: ['CASCADE deletes children', 'Count before vs after parent deletion'],
      tags: ['django', 'models', 'on_delete', 'CASCADE', 'predict'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this print? Assume the database is empty before the snippet.',
      code: `a = Article.objects.create(title="First")
print(a.pk)
print(a.id)
print(a.pk == a.id)`,
      expectedOutput: `1
1
True`,
      explanation: '`pk` is a Django alias for the primary key — by default an auto-incrementing integer named `id`. They\'re the same attribute under the hood. `objects.create()` saves immediately, so `pk` is populated. If you used `Article(title=...)` without `.save()`, `pk` would be `None`.',
      hints: ['pk is an alias for the primary key', 'objects.create() saves immediately'],
      tags: ['django', 'models', 'pk', 'create', 'predict'],
      concepts: ['dj-model-construction'],
    },

  // ===== LAYER A: in-place advanced single-skill model primitives =====
  // Database constraints (Meta.constraints) — UniqueConstraint (conditional/partial), CheckConstraint
  {
      id: 'dj-models-constraint-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      question: 'You need `email` to be unique only among rows where `is_active=True` — inactive (deactivated) rows may reuse an email. Which approach actually enforces this at the database level?',
      options: [
        { id: 'a', text: 'A `Meta.constraints` `UniqueConstraint(fields=["email"], condition=Q(is_active=True))` — only DB constraints express partial uniqueness', isCorrect: true },
        { id: 'b', text: 'Set `email = models.EmailField(unique=True)` — field-level `unique` already accepts a filter condition argument', isCorrect: false },
        { id: 'c', text: 'Use `Meta.unique_together = ["email", "is_active"]` to scope the uniqueness to the active flag', isCorrect: false },
        { id: 'd', text: 'Override `save()` to query for an existing active row and raise — the only way to express it', isCorrect: false },
      ],
      explanation: '`UniqueConstraint` supports a `condition` (a `Q` object), producing a *partial* unique index — uniqueness enforced only over the matching subset of rows. `unique=True` and `unique_together` are unconditional. An override in `save()` has a race window and is bypassed by `bulk_create`/`update()` — a real DB constraint cannot be bypassed.',
      hints: [
        'Partial/conditional uniqueness = `UniqueConstraint(condition=Q(...))`',
        'Field `unique=True` and `unique_together` are unconditional',
      ],
      tags: ['django', 'models', 'constraints', 'UniqueConstraint', 'condition'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-constraint-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'A user may have at most one ACTIVE subscription, but any number of inactive (expired) ones. Fill in the constraint class and the lookup wrapper that enforce this partial uniqueness.',
      template: `class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.___(
                fields=["user"],
                condition=___(is_active=True),
                name="one_active_subscription_per_user",
            )
        ]`,
      blanks: ['UniqueConstraint', 'Q'],
      solution: 'class Subscription(models.Model):\n    user = models.ForeignKey(User, on_delete=models.CASCADE)\n    is_active = models.BooleanField(default=True)\n\n    class Meta:\n        constraints = [\n            models.UniqueConstraint(\n                fields=["user"],\n                condition=Q(is_active=True),\n                name="one_active_subscription_per_user",\n            )\n        ]',
      explanation: '`UniqueConstraint` with a `condition` (a `Q` object) builds a partial unique index — the database enforces uniqueness of `user` only across rows where `is_active=True`. Expired rows are outside the index and may repeat. Every constraint needs a unique `name`.',
      hints: ['Conditional uniqueness lives in `Meta.constraints`', 'The `condition` takes a `Q(...)` object'],
      tags: ['django', 'models', 'constraints', 'UniqueConstraint', 'cloze'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-constraint-adv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a `Product` model with a `name` (≤200 chars), a `sku` code (≤50 chars), a `price` (decimal, up to 10 digits with 2 decimal places), and a boolean `is_active`. Enforce two rules at the DATABASE level (not field options): the price can never be negative, and the `sku` must be unique only among active products (inactive products may reuse a retired sku). Use the model\'s database-constraint mechanism.',
      starterCode: `from django.db import models
from django.db.models import Q

class Product(models.Model):
    ...
`,
      testCases: [
        { input: 'Product._meta.constraints', expectedOutput: 'CheckConstraint(price>=0) and conditional UniqueConstraint(sku)', description: 'Two Meta.constraints enforced at DB level' },
      ],
      solution: `from django.db import models
from django.db.models import Q

class Product(models.Model):
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.CheckConstraint(check=Q(price__gte=0), name="product_price_non_negative"),
            models.UniqueConstraint(fields=["sku"], condition=Q(is_active=True), name="unique_active_sku"),
        ]
# OR
from django.db import models
from django.db.models import Q

class Product(models.Model):
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.CheckConstraint(condition=Q(price__gte=0), name="product_price_non_negative"),
            models.UniqueConstraint(fields=["sku"], condition=Q(is_active=True), name="unique_active_sku"),
        ]`,
      explanation: '`CheckConstraint` emits a SQL `CHECK` (here `price >= 0`) the DB enforces on every write. `UniqueConstraint` with a `condition` is a partial unique index — `sku` unique only over `is_active=True` rows. Both live in `Meta.constraints`, can\'t be bypassed by `bulk_create`/`update()`, and each needs a unique `name`. (Django ≥5.1 renames `CheckConstraint`\'s `check=` kwarg to `condition=`; both shown.)',
      hints: [
        'Both rules go in `class Meta: constraints = [...]`',
        '`CheckConstraint(check=Q(price__gte=0), name=...)` for the price rule',
        '`UniqueConstraint(fields=["sku"], condition=Q(is_active=True), name=...)` for the scoped uniqueness',
      ],
      tags: ['django', 'models', 'constraints', 'CheckConstraint', 'UniqueConstraint'],
      concepts: ['dj-model-construction'],
    },
  // Database indexes (Meta.indexes) — composite, column order
  {
      id: 'dj-models-index-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      question: 'Queries filter `Order` by `customer` (equality) and then sort the matches by `created_at` descending. For ONE composite index to serve both the filter and the sort, how should its columns be ordered?',
      options: [
        { id: 'a', text: '`fields=["customer", "-created_at"]` — equality-filtered column first, then the sort column in its sort direction', isCorrect: true },
        { id: 'b', text: '`fields=["-created_at", "customer"]` — put the sorted column first so ordering resolves before the filter', isCorrect: false },
        { id: 'c', text: '`fields=["customer", "created_at"]` — index direction never matters; the planner sorts either way for free', isCorrect: false },
        { id: 'd', text: 'Two separate single-column indexes always beat one composite index for this access pattern', isCorrect: false },
      ],
      explanation: 'A composite index is ordered left-to-right. Put the equality-filtered column (`customer`) first so the index narrows to those rows, then the sort column (`-created_at`) so the already-filtered rows come out pre-sorted — no extra sort step. Leading with the sort column means the DB can\'t use the index to find `customer` efficiently.',
      hints: [
        'Equality columns first, then the ORDER BY column',
        'Index direction (`-`) matters when the query sorts descending',
      ],
      tags: ['django', 'models', 'indexes', 'Index', 'performance'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-index-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Add a composite database index covering `customer` plus newest-first `created_at`, to speed up "this customer\'s recent orders" lookups. Fill in the Meta option name and the index class.',
      template: `class Order(models.Model):
    customer = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ___ = [
            models.___(fields=["customer", "-created_at"]),
        ]`,
      blanks: ['indexes', 'Index'],
      solution: 'class Order(models.Model):\n    customer = models.CharField(max_length=200)\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    class Meta:\n        indexes = [\n            models.Index(fields=["customer", "-created_at"]),\n        ]',
      explanation: '`Meta.indexes` holds a list of `models.Index` objects; migrations create the matching DB index. The `fields` order mirrors the query: filter column first, sort column (with `-` for DESC) second. Prefer `Meta.indexes` over the older `db_index=True` when you need composite or directional indexes.',
      hints: ['The Meta option is a plural list', 'Each entry is a `models.Index(fields=[...])`'],
      tags: ['django', 'models', 'indexes', 'Index', 'cloze'],
      concepts: ['dj-model-construction'],
    },
  // Enumeration types — TextChoices / IntegerChoices
  {
      id: 'dj-models-choices-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      question: 'What does a `models.TextChoices` enum give you over a plain list-of-tuples passed to `choices=`?',
      options: [
        { id: 'a', text: 'Named members with `.value`/`.label`/`.choices`, referenced in code as `Status.PUBLISHED` instead of a bare string literal', isCorrect: true },
        { id: 'b', text: 'It stores the human-readable label in the database column instead of the short stored code', isCorrect: false },
        { id: 'c', text: 'It enforces the allowed choices at the database level via an automatic CHECK constraint', isCorrect: false },
        { id: 'd', text: 'It is mandatory since Django 3.0; a bare list-of-tuples `choices` no longer works at all', isCorrect: false },
      ],
      explanation: '`TextChoices` is an enum: each member has a stored `.value` and a human `.label`, the class exposes `.choices` for the field, and you reference `Status.PUBLISHED` in code instead of the magic string `"PB"`. It does NOT change what\'s stored (still the short code) and does NOT add a DB constraint — validation is form/`full_clean` level, exactly like list-of-tuples choices.',
      hints: [
        '`.value` / `.label` / `.choices` + named members',
        'Storage and DB-level enforcement are unchanged vs raw tuples',
      ],
      tags: ['django', 'models', 'TextChoices', 'enum', 'choices'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-choices-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this print?',
      code: `class Status(models.TextChoices):
    DRAFT = "DR", "Draft"
    PUBLISHED = "PB", "Published"

print(Status.PUBLISHED.value)
print(Status.PUBLISHED.label)
print(Status.PUBLISHED == "PB")`,
      expectedOutput: `PB
Published
True`,
      explanation: 'In `TextChoices`, each member is declared `STORED, "Label"`. `.value` is the stored code (`"PB"`), `.label` is the human string (`"Published"`). Because `TextChoices` subclasses `str`, a member compares equal to its stored value, so `Status.PUBLISHED == "PB"` is `True`.',
      hints: ['First element of the tuple is the stored value, second is the label', 'TextChoices members are str subclasses'],
      tags: ['django', 'models', 'TextChoices', 'predict'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-choices-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define the publication state as a string-backed enum and wire it into the field. Fill in the enum base class and the attribute that feeds the field\'s `choices`.',
      template: `class Article(models.Model):
    class Status(models.___):
        DRAFT = "DR", "Draft"
        PUBLISHED = "PB", "Published"

    title = models.CharField(max_length=200)
    state = models.CharField(max_length=2, choices=Status.___, default=Status.DRAFT)`,
      blanks: ['TextChoices', 'choices'],
      solution: 'class Article(models.Model):\n    class Status(models.TextChoices):\n        DRAFT = "DR", "Draft"\n        PUBLISHED = "PB", "Published"\n\n    title = models.CharField(max_length=200)\n    state = models.CharField(max_length=2, choices=Status.choices, default=Status.DRAFT)',
      explanation: '`models.TextChoices` is the string-backed enum base (use `IntegerChoices` for int-backed). The field takes `choices=Status.choices` (the auto-generated list of `(value, label)` tuples), and `default=Status.DRAFT` references a member directly.',
      hints: ['String-backed enum base = `TextChoices`', 'Feed the field with `Status.choices`'],
      tags: ['django', 'models', 'TextChoices', 'choices', 'cloze'],
      concepts: ['dj-model-construction'],
    },
  // OneToOneField
  {
      id: 'dj-models-o2o-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      question: 'How does `OneToOneField` differ from `ForeignKey(unique=True)`?',
      options: [
        { id: 'a', text: 'Mostly equivalent at the DB level, but the reverse accessor returns a single object (`user.profile`), not a manager/queryset', isCorrect: true },
        { id: 'b', text: '`OneToOneField` allows null on both sides, while a unique ForeignKey can never be made nullable', isCorrect: false },
        { id: 'c', text: '`OneToOneField` creates no database column; the link is held only in Python memory at runtime', isCorrect: false },
        { id: 'd', text: 'They are identical in every way; `OneToOneField` is a deprecated alias kept for back-compat', isCorrect: false },
      ],
      explanation: 'A `OneToOneField` is essentially a `ForeignKey` with `unique=True`, but it customises the REVERSE side: `user.profile` returns the single related object (raising `RelatedObjectDoesNotExist` if absent), whereas a unique FK\'s reverse accessor is still a manager (`user.profile_set.all()`). Use O2O for "extends/augments" relationships like a user profile.',
      hints: [
        'Forward side: nearly the same; reverse side differs',
        'O2O reverse = one object; unique-FK reverse = a manager',
      ],
      tags: ['django', 'models', 'OneToOneField', 'relationships'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-o2o-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Extend Django\'s built-in `User` with a `Profile`: each user has exactly one profile and each profile belongs to exactly one user, and deleting the user deletes the profile. Add a `bio` text field (optional) and a `website` URL (optional). The reverse side must read as `user.profile`.',
      starterCode: `from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    ...
`,
      testCases: [
        { input: 'Profile._meta.get_field("user")', expectedOutput: 'OneToOneField to User, CASCADE, reverse user.profile', description: 'One-to-one extension of User' },
      ],
      solution: `from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True)
    website = models.URLField(blank=True)`,
      explanation: '`OneToOneField` enforces a strict 1:1 link. `on_delete=models.CASCADE` removes the profile with its user. `related_name="profile"` makes the reverse accessor `user.profile` (it would default to `profile` here anyway, but being explicit documents intent). `blank=True` makes the optional fields skippable in forms; `URLField` validates URL shape.',
      hints: [
        '`models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")`',
        '`blank=True` for the optional `bio`/`website`',
      ],
      tags: ['django', 'models', 'OneToOneField', 'User', 'profile'],
      concepts: ['dj-model-construction'],
    },
  // Self-referential ForeignKey
  {
      id: 'dj-models-selffk-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      question: 'In a self-referential `ForeignKey("self")` modelling a category tree, why is `null=True` typically set on the `parent` field?',
      options: [
        { id: 'a', text: 'So top-level (root) categories, which have no parent, can store NULL instead of pointing at another row', isCorrect: true },
        { id: 'b', text: 'Because self-referential ForeignKeys are forbidden from being NOT NULL by Django\'s system checks', isCorrect: false },
        { id: 'c', text: 'To break the circular import that referencing the same model class would otherwise cause', isCorrect: false },
        { id: 'd', text: 'Because `null=True` is what makes the reverse `children` accessor appear on the instance', isCorrect: false },
      ],
      explanation: 'A category tree needs roots — categories with no parent. `null=True` lets `parent` be empty for those rows. The `"self"` string handles the self-reference (no circular import). The reverse accessor exists regardless of nullability; you name it with `related_name="children"`.',
      hints: [
        'Roots have no parent → parent must be nullable',
        '`"self"` (not `null=True`) is what resolves the self-reference',
      ],
      tags: ['django', 'models', 'ForeignKey', 'self-referential', 'tree'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-selffk-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Model a category tree: each category may have one parent (top-level categories have none), and you want to read a category\'s subcategories as `category.children.all()`. Fill in the self-reference target and the reverse name.',
      template: `class Category(models.Model):
    title = models.CharField(max_length=100)
    parent = models.ForeignKey(
        "___",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="___",
    )`,
      blanks: ['self', 'children'],
      solution: 'class Category(models.Model):\n    title = models.CharField(max_length=100)\n    parent = models.ForeignKey(\n        "self",\n        on_delete=models.CASCADE,\n        null=True,\n        blank=True,\n        related_name="children",\n    )',
      explanation: '`ForeignKey("self")` points a model at its own table. `null=True, blank=True` lets root categories have no parent. `related_name="children"` makes the reverse accessor `category.children.all()` return a category\'s direct subcategories.',
      hints: ['The target string for a self-reference is "self"', 'Reverse accessor name → `children`'],
      tags: ['django', 'models', 'ForeignKey', 'self-referential', 'cloze'],
      concepts: ['dj-model-construction'],
    },
  // Abstract base classes
  {
      id: 'dj-models-abstract-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      question: 'You factor shared `created_at`/`updated_at` fields into a base model and set `class Meta: abstract = True`. What tables does the database end up with?',
      options: [
        { id: 'a', text: 'One table per concrete child, each with its own copy of the timestamp columns; the abstract base gets no table', isCorrect: true },
        { id: 'b', text: 'One shared base table plus a child table per model, joined by an implicit one-to-one link', isCorrect: false },
        { id: 'c', text: 'A single table for the base with every child\'s fields merged into it (single-table inheritance)', isCorrect: false },
        { id: 'd', text: 'One table for the abstract base only; the children are pure Python views with no storage', isCorrect: false },
      ],
      explanation: 'Abstract inheritance is a code-reuse tool, not a DB relationship: the base creates NO table, and each concrete child gets the inherited fields copied into its own table. Option (b) describes multi-table inheritance (a real base table + per-child tables joined by an auto OneToOne) — the alternative you\'d get WITHOUT `abstract = True`.',
      hints: [
        'Abstract = fields copied down; no base table',
        'A real base table + joins is multi-table inheritance (non-abstract)',
      ],
      tags: ['django', 'models', 'abstract', 'inheritance'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-abstract-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Assemble an abstract `TimeStampedModel` base (no table of its own) with a created_at field listed before an updated_at field, then a concrete `Article` that inherits it. The base\'s Meta must mark it abstract.',
      correctOrder: [
        'class TimeStampedModel(models.Model):',
        '    created_at = models.DateTimeField(auto_now_add=True)',
        '    updated_at = models.DateTimeField(auto_now=True)',
        '',
        '    class Meta:',
        '        abstract = True',
        '',
        'class Article(TimeStampedModel):',
        '    title = models.CharField(max_length=200)',
      ],
      distractorLines: [
        'class TimeStampedModel:',
        '        abstract = "True"',
        'class Article(models.Model):',
        '    class Meta:',
      ],
      solution: 'class TimeStampedModel(models.Model):\n    created_at = models.DateTimeField(auto_now_add=True)\n    updated_at = models.DateTimeField(auto_now=True)\n\n    class Meta:\n        abstract = True\n\nclass Article(TimeStampedModel):\n    title = models.CharField(max_length=200)',
      explanation: 'The base must still inherit `models.Model`. `class Meta: abstract = True` (a boolean, not the string `"True"`) stops Django building a table for it. The child inherits FROM the base (`Article(TimeStampedModel)`), so the timestamp columns land in the `Article` table.',
      hints: ['Base inherits models.Model; child inherits the base', 'abstract = True is a boolean', 'created_at before updated_at'],
      tags: ['django', 'models', 'abstract', 'inheritance', 'parsons'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-abstract-adv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a reusable abstract base model that adds a `created_at` timestamp (set once on insert) and an `updated_at` timestamp (refreshed on every save), and produces no database table of its own. Then define two concrete models — `Article` (with a `title` ≤200 chars) and `Comment` (with a `body` text field) — that both inherit those timestamps.',
      starterCode: `from django.db import models

# Abstract base + two concrete models that inherit it.
`,
      testCases: [
        { input: 'Article._meta.get_field("created_at"); Comment._meta.get_field("updated_at")', expectedOutput: 'Both models inherit created_at/updated_at; base has no table', description: 'Abstract base copies timestamps into each child' },
      ],
      solution: `from django.db import models

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Article(TimeStampedModel):
    title = models.CharField(max_length=200)

class Comment(TimeStampedModel):
    body = models.TextField()`,
      explanation: '`auto_now_add=True` stamps once at insert; `auto_now=True` updates on every `save()`. `class Meta: abstract = True` makes the base table-less — its fields are copied into each concrete child (`Article`, `Comment`), so both tables carry their own timestamp columns. This is the canonical DRY pattern for shared model fields.',
      hints: [
        'Base inherits `models.Model` and sets `class Meta: abstract = True`',
        '`auto_now_add` for created, `auto_now` for updated',
        'Children inherit the base: `class Article(TimeStampedModel)`',
      ],
      tags: ['django', 'models', 'abstract', 'inheritance', 'timestamps'],
      concepts: ['dj-model-construction'],
    },
  // save() override
  {
      id: 'dj-models-save-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      question: 'When overriding a model\'s `save()` to populate a derived field, what must the override always do?',
      options: [
        { id: 'a', text: 'Call `super().save(*args, **kwargs)` so the row is actually persisted — setting attributes alone never writes to the DB', isCorrect: true },
        { id: 'b', text: 'Return the saved instance explicitly, because Django reads `save()`\'s return value to commit the row', isCorrect: false },
        { id: 'c', text: 'Avoid calling the parent `save()`, which would otherwise overwrite the field you just set', isCorrect: false },
        { id: 'd', text: 'Wrap the whole body in `transaction.atomic()`, or the derived field will silently not be saved', isCorrect: false },
      ],
      explanation: 'Assigning `self.slug = ...` only mutates the in-memory instance. The actual INSERT/UPDATE happens inside `models.Model.save()`, so your override must call `super().save(*args, **kwargs)` (forwarding the args). `save()` returns `None`; atomic blocks are about transactions, not persistence.',
      hints: [
        'Persistence happens in the parent `save()`',
        'Forward `*args, **kwargs` to `super().save()`',
      ],
      tags: ['django', 'models', 'save', 'override'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-save-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this print? Assume the database is empty and `slugify("Hello World") == "hello-world"`.',
      code: `class Article(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

a = Article(title="Hello World")
print(repr(a.slug))
a.save()
print(repr(a.slug))`,
      expectedOutput: `''
'hello-world'`,
      explanation: 'Before `save()`, `slug` holds its `blank=True` default — the empty string — so `repr` shows an empty pair of quotes. The overridden `save()` sees `not self.slug` is true and derives `"hello-world"` from the title, then `super().save()` writes the row. After the call the in-memory instance carries the generated slug.',
      hints: ['blank=True CharField/SlugField defaults to "" not None', 'The override fills slug only when empty'],
      tags: ['django', 'models', 'save', 'slug', 'predict'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-save-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Auto-populate the slug from the title when it is missing, then delegate to the real save so the row is written. Fill in the slug helper and the call that persists the row.',
      template: `from django.utils.text import slugify

class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = ___(self.title)
        ___().save(*args, **kwargs)`,
      blanks: ['slugify', 'super'],
      solution: 'from django.utils.text import slugify\n\nclass Post(models.Model):\n    title = models.CharField(max_length=200)\n    slug = models.SlugField(blank=True)\n\n    def save(self, *args, **kwargs):\n        if not self.slug:\n            self.slug = slugify(self.title)\n        super().save(*args, **kwargs)',
      explanation: '`slugify` turns "Hello World" into "hello-world". The critical line is `super().save(*args, **kwargs)` — without it the override mutates the instance but never writes the row. Forward `*args, **kwargs` so options like `using=`/`update_fields=` still work.',
      hints: ['Django\'s slug helper is `slugify`', 'Persist via `super().save(...)`'],
      tags: ['django', 'models', 'save', 'slugify', 'cloze'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-save-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define an `Article` model with a `title` (≤200 chars) and a `slug`. Override its save behavior so that whenever an article is saved WITHOUT a slug, the slug is auto-generated from the title; an explicitly-set slug must be left untouched. Make sure the row is still written to the database.',
      starterCode: `from django.db import models
from django.utils.text import slugify

class Article(models.Model):
    ...
`,
      testCases: [
        { input: 'Article(title="My First Post").save()', expectedOutput: 'slug == "my-first-post"', description: 'save() derives slug from title when blank' },
      ],
      solution: `from django.db import models
from django.utils.text import slugify

class Article(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)`,
      explanation: 'Guarding with `if not self.slug:` preserves a slug the caller set explicitly and only auto-fills a blank one. `slugify` normalises the title; `super().save(*args, **kwargs)` performs the real INSERT/UPDATE and forwards options like `update_fields`. `blank=True` keeps the field optional in forms.',
      hints: [
        'Override `def save(self, *args, **kwargs):`',
        'Only fill the slug when `not self.slug`',
        'End with `super().save(*args, **kwargs)`',
      ],
      tags: ['django', 'models', 'save', 'slug', 'override'],
      concepts: ['dj-model-construction'],
    },
  // Field-level validators
  {
      id: 'dj-models-validator-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      question: 'A field declared `rating = models.IntegerField(validators=[MinValueValidator(0)])` runs that validator during which operation?',
      options: [
        { id: 'a', text: 'During `full_clean()` — which `ModelForm`/serializer validation calls — but NOT during a plain `Model.save()`', isCorrect: true },
        { id: 'b', text: 'During every `Model.save()` call automatically, no matter how the instance was constructed', isCorrect: false },
        { id: 'c', text: 'Only at the database level, as a CHECK constraint emitted in the field\'s migration', isCorrect: false },
        { id: 'd', text: 'During queryset filtering, rejecting any `.filter()` that would match an invalid value', isCorrect: false },
      ],
      explanation: 'Field `validators` run inside `full_clean()`. Forms and DRF serializers call `full_clean`/`run_validators` for you, so invalid input is caught there. But `Model.save()` does NOT call `full_clean()` — `Model(rating=-5).save()` happily writes a negative value. For a guarantee at the DB level you need a `CheckConstraint`.',
      hints: [
        'validators fire in `full_clean()`, not `save()`',
        'DB-level enforcement needs a `CheckConstraint`',
      ],
      tags: ['django', 'models', 'validators', 'full_clean'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-validator-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Constrain a review `rating` to the range 1–5 using field-level validators (form / `full_clean` validation). Fill in the two validator classes.',
      template: `from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model):
    rating = models.IntegerField(
        validators=[___(1), ___(5)],
    )`,
      blanks: ['MinValueValidator', 'MaxValueValidator'],
      solution: 'from django.core.validators import MinValueValidator, MaxValueValidator\n\nclass Review(models.Model):\n    rating = models.IntegerField(\n        validators=[MinValueValidator(1), MaxValueValidator(5)],\n    )',
      explanation: '`MinValueValidator(1)` and `MaxValueValidator(5)` bound the field to 1–5 during `full_clean()` (so forms/serializers reject out-of-range input). Note these are NOT enforced by a bare `Model.save()` — pair with a `CheckConstraint` if you need a hard DB guarantee.',
      hints: ['Lower bound validator, then upper bound validator', 'They run during validation, not save()'],
      tags: ['django', 'models', 'validators', 'cloze'],
      concepts: ['dj-model-construction'],
    },
  // UUID primary key
  {
      id: 'dj-models-uuid-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Give `Payment` a non-sequential UUID primary key generated automatically. Fill in the generator callable (pass the function — do NOT call it).',
      template: `import uuid

class Payment(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.___,
        editable=False,
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)`,
      blanks: ['uuid4'],
      solution: 'import uuid\n\nclass Payment(models.Model):\n    id = models.UUIDField(\n        primary_key=True,\n        default=uuid.uuid4,\n        editable=False,\n    )\n    amount = models.DecimalField(max_digits=10, decimal_places=2)',
      explanation: '`default=uuid.uuid4` passes the FUNCTION (no parentheses) so Django calls it per row to mint a fresh UUID. Calling it (`uuid.uuid4()`) would freeze a single value as the default for every row. `primary_key=True` replaces the default auto-increment `id`; `editable=False` hides it from forms.',
      hints: ['UUID v4 generator is `uuid.uuid4`', 'Pass the callable, no parentheses'],
      tags: ['django', 'models', 'UUIDField', 'primary_key', 'cloze'],
      concepts: ['dj-model-construction'],
    },
  {
      id: 'dj-models-uuid-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_MODELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define an `Order` model whose primary key is a globally-unique, non-sequential identifier generated automatically on creation (so ids can\'t be guessed or enumerated), instead of the default auto-incrementing integer. Include a `total` decimal field (up to 10 digits, 2 decimal places). The id must not be editable in forms.',
      starterCode: `import uuid
from django.db import models

class Order(models.Model):
    ...
`,
      testCases: [
        { input: 'Order._meta.pk', expectedOutput: 'UUIDField(primary_key=True, default=uuid.uuid4, editable=False)', description: 'Non-sequential UUID primary key' },
      ],
      solution: `import uuid
from django.db import models

class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    total = models.DecimalField(max_digits=10, decimal_places=2)`,
      explanation: 'A `UUIDField` with `primary_key=True` replaces the integer `id`. `default=uuid.uuid4` (the function, uncalled) generates a random v4 UUID per row, so keys aren\'t sequential or enumerable. `editable=False` keeps it out of forms. UUID PKs trade a little index size/locality for unguessable, merge-friendly identifiers.',
      hints: [
        '`models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)`',
        'Pass `uuid.uuid4` without parentheses',
      ],
      tags: ['django', 'models', 'UUIDField', 'primary_key'],
      concepts: ['dj-model-construction'],
    },
];
