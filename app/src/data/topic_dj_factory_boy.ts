/**
 * Topic.DJ_FACTORY_BOY — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendAdvancedPedagogyQuestions.ts (1), backendInfraQuestions.ts (4), djangoBatchDExpansionQuestions.ts (6)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_factory_boy_questions: Question[] = [
  {
      id: 'dj-factoryboy-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FACTORY_BOY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the blanks to finish a factory_boy factory for `Article`. It saves articles to the database, numbers each title from a counter ("Article 0", "Article 1", ...), fills `body` with a random paragraph from Faker, and builds the `author` foreign key with `UserFactory`, which is defined earlier in the same file.',
      template: `import factory
from articles.models import Article

class ArticleFactory(factory.django.___):
    class Meta:
        model = Article

    title = factory.___(lambda n: f"Article {n}")
    body = factory.Faker("paragraph")
    author = factory.___(UserFactory)`,
      blanks: ['DjangoModelFactory', 'Sequence', 'SubFactory'],
      solution: 'import factory\nfrom articles.models import Article\n\nclass ArticleFactory(factory.django.DjangoModelFactory):\n    class Meta:\n        model = Article\n\n    title = factory.Sequence(lambda n: f"Article {n}")\n    body = factory.Faker("paragraph")\n    author = factory.SubFactory(UserFactory)',
      explanation: '`DjangoModelFactory` reads the model from `Meta.model` and saves each object to the database when the factory is called. `Sequence` passes a counter `n` (0, 1, 2, ...) to its function, so every title is unique and predictable. `Faker` generates a realistic random value. `SubFactory(UserFactory)` builds a new author for each article, so a test never has to create the user by hand; pass `author=...` to reuse one.',
      hints: ['The base class for a factory of a Django model lives in `factory.django`.', 'The declaration that hands its function a counter `n` gives each title a unique number.', 'The declaration that calls another factory to build the related object fills a foreign key.'],
      tags: ['django', 'factory_boy', 'testing', 'cloze', 'Sequence', 'Faker', 'SubFactory'],
      concepts: ['py-test-isolation'],
    },

  {
      id: 'py-dj-factory-what',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FACTORY_BOY,
      course: Course.BACKEND,
      question: 'What problem does factory_boy solve in Django tests?',
      options: [
        { id: 'a', text: 'Isolating tests from each other: it wraps every test in a transaction and rolls it back, so one test never sees rows another test created', isCorrect: false },
        { id: 'b', text: 'Mocking HTTP calls to external services so tests never hit real APIs: it records the responses once and replays them on later runs', isCorrect: false },
        { id: 'c', text: 'Avoiding the database: factory objects live only in memory, so a test can use model instances without a test database being set up', isCorrect: false },
        { id: 'd', text: 'Writing test data in one place: `UserFactory()` fills in the defaults the factory declares, so each test sets only the fields it cares about', isCorrect: true },
      ],
      explanation: 'Without factories, every test repeats the full model-creation code, and adding a required field to `User` breaks every test that creates a user. A factory declares a default for each field once (a `Sequence` for unique usernames, a `Faker` value for an email), so a new required field means one change to `UserFactory`. Rolling back each test is what Django\'s `TestCase` does, not factory_boy. Calling a factory saves the object to the test database; only `build()` keeps it in memory. Recording and replaying HTTP calls is a mocking tool\'s job.',
      hints: [
        'Generates realistic test data with sensible defaults',
        'Tests override only the fields they care about',
        'Adding required model fields → update the factory once',
      ],
      tags: ['django', 'testing', 'factory_boy'],
      concepts: ['py-test-isolation'],
    },
  {
      id: 'py-dj-factory-userfactory',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FACTORY_BOY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a simple `UserFactory`. Import `factory` and the Django `User` model. Define a `UserFactory` class that subclasses `factory.django.DjangoModelFactory`. Give it an inner `Meta` class whose `model` attribute is `User`. Add a `username` field generated with `factory.Sequence` that produces unique strings of the form `"user_0"`, `"user_1"`, and so on, and an `email` field generated with `factory.Faker` using the `"email"` provider for realistic addresses. Callers will either invoke it with no arguments or override fields like `username="alice"`.',
      starterCode: `# Write UserFactory(factory.django.DjangoModelFactory): inner Meta with
# model = User; a username generated by factory.Sequence as "user_0",
# "user_1", ...; an email generated by factory.Faker("email").
`,
      testCases: [
        {
          input: 'basic DjangoModelFactory',
          expectedOutput: 'UserFactory() creates a User with unique username + fake email',
          description: 'Meta.model + field generators',
        },
      ],
      solution: `import factory
from django.contrib.auth.models import User

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user_{n}")
    email = factory.Faker("email")`,
      explanation: 'Generators: `Sequence` increments `n` per call (unique strings), `Faker("email")` / `Faker("name")` / `Faker("sentence")` produce realistic fake data, `LazyAttribute(lambda o: f"{o.first_name.lower()}@example.com")` derives from other fields, `factory.fuzzy.FuzzyChoice([...])` picks one value from a list at random. `User.username` is unique, so a fixed string would fail on the second user; the `Sequence` keeps every username different. `.build()` creates UNsaved, `.create()` (default) calls `.objects.create()`. Bulk: `UserFactory.create_batch(10)`.',
      requires: [/Sequence\(/, /Faker\(\s*["']email["']/],
      tieredHints: {
        apiSignature: 'factory.Sequence(func) -> Any',
        skeleton: 'import factory\nfrom django.contrib.auth.models import ____\n\nclass ____(factory.django.____):\n    class ____:\n        ____ = ____\n\n    ____ = factory.____(lambda n: f"user_{n}")\n    ____ = factory.____("email")',
      },
      hints: [
        'Sequence for unique integers / strings',
        'Faker for realistic names / emails / addresses',
        '.build() without save(), .create() with save(), .create_batch(N) for bulk',
      ],
      tags: ['django', 'factory_boy', 'Sequence', 'Faker'],
      concepts: ['dj-test-fixtures'],
    },
  {
      id: 'py-dj-factory-subfactory',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FACTORY_BOY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use `SubFactory` for foreign-key relations. `Post.author` is a `ForeignKey` to `User`, and `UserFactory` is already defined earlier in the same `factories.py` file. Import `factory` and the `Post` model from `.models`, then define a `PostFactory` class that subclasses `factory.django.DjangoModelFactory` and has an inner `Meta` pointing at the `Post` model. Give it a `title` field generated via `factory.Faker` with the `"sentence"` provider, and an `author` field generated via `factory.SubFactory` referencing `UserFactory`. Now a caller invoking the factory with no arguments gets a Post AND its author; passing `author=existing_user` reuses an existing user.',
      starterCode: `# Write PostFactory(factory.django.DjangoModelFactory): inner Meta with
# model = Post; a title via factory.Faker("sentence"); an author via
# factory.SubFactory(UserFactory) so each Post brings its own User.
`,
      testCases: [
        {
          input: 'SubFactory for FK',
          expectedOutput: 'PostFactory() creates Post + cascading User',
          description: 'SubFactory nests factories for relations',
        },
      ],
      solution: `import factory
from .models import Post

class PostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Post

    title = factory.Faker("sentence")
    author = factory.SubFactory(UserFactory)`,
      explanation: 'SubFactory runs the referenced factory for each new Post with the same strategy: `PostFactory()` saves a new User, `PostFactory.build()` builds one in memory. Writing `author = UserFactory()` instead would create one User when the class is defined and share it with every Post. Factories nest to any depth (Comment → Post → Author). For a reverse relation (objects that point back at this one, made after it is saved) use `factory.RelatedFactory`. For M2M: `@factory.post_generation def tags(self, create, extracted, **kwargs): if extracted: self.tags.set(extracted)`. Now `PostFactory(tags=[tag1, tag2])` sets the M2M after the Post is saved.',
      tieredHints: {
        apiSignature: 'factory.SubFactory(factory_class, **kwargs)',
        skeleton: 'import factory\nfrom .models import ____\n\nclass ____(factory.django.____):\n    class ____:\n        ____ = ____\n\n    ____ = factory.____("sentence")\n    ____ = factory.____(____)',
      },
      hints: [
        'SubFactory for FK / OneToOne relations',
        'RelatedFactory for reverse relations',
        'post_generation hook for M2M',
      ],
      requires: [/SubFactory\(/],
      tags: ['django', 'factory_boy', 'SubFactory', 'foreign-key'],
      concepts: ['dj-test-fixtures'],
    },
  {
      id: 'dj-factoryboy-trait-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FACTORY_BOY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the blanks so that `UserFactory(admin=True)` makes a staff superuser and `UserFactory()` makes a normal user: the first blank is the inner class that holds named variations, the second the helper that bundles field values under one name.',
      template: `class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    class ___:
        admin = factory.___(is_staff=True, is_superuser=True)`,
      blanks: ['Params', 'Trait'],
      solution: 'class UserFactory(factory.django.DjangoModelFactory):\n    class Meta:\n        model = User\n\n    class Params:\n        admin = factory.Trait(is_staff=True, is_superuser=True)',
      explanation: '`class Params:` holds declarations that are flags for the factory rather than model fields. `factory.Trait(...)` inside it bundles a set of field values under one name: `UserFactory(admin=True)` turns them all on, and without the flag the model\'s own defaults (`is_staff=False`, `is_superuser=False`) apply.',
      hints: ['Inner class name for trait declarations', 'Helper that bundles field overrides'],
      tags: ['django', 'factory_boy', 'Trait', 'cloze'],
      concepts: ['dj-test-fixtures'],
    },
  {
      id: 'py-dj-factory-traits',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FACTORY_BOY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use `Trait` for named variations. Write the whole `UserFactory` (import `factory` and the Django `User` model): it subclasses `factory.django.DjangoModelFactory`, its `Meta.model` is `User`, `username` comes from `factory.Sequence` as `"user_0"`, `"user_1"`, ..., and `email` from `factory.Faker("email")`. Then add an inner `Params` class declaring a trait named `admin`, built with `factory.Trait`, that sets `is_staff` and `is_superuser` to True. Callers passing `admin=True` get a staff superuser; without it they get a normal user.',
      starterCode: `# Write UserFactory for User (username "user_0", "user_1", ... and a
# Faker email), then an inner Params class declaring an \`admin\` trait
# (factory.Trait) that sets is_staff and is_superuser to True.
`,
      testCases: [
        {
          input: 'Trait for named variation',
          expectedOutput: 'UserFactory(admin=True) → is_staff=True, is_superuser=True',
          description: 'Traits bundle field overrides under a name',
        },
      ],
      solution: `import factory
from django.contrib.auth.models import User

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user_{n}")
    email = factory.Faker("email")

    class Params:
        admin = factory.Trait(is_staff=True, is_superuser=True)`,
      explanation: 'A trait keeps one factory instead of a subclass for every variation. Setting `is_staff = True` as a plain field would make every user an admin, and a `Trait` declared outside `Params` is not a flag at all. Traits combine: with a second trait `verified` declared in `Params`, `UserFactory(admin=True, verified=True)` turns on both. A subclass still suits a factory whose declarations differ in structure, such as a different `SubFactory` for the same foreign key. The `username` sequence matters too: `User.username` is unique, so without it the second user would fail to save.',
      tieredHints: {
        apiSignature: 'factory.Trait(**kwargs)',
        skeleton: 'import factory\nfrom django.contrib.auth.models import ____\n\nclass ____(factory.django.____):\n    class ____:\n        ____ = ____\n\n    ____ = factory.____(lambda n: f"user_{n}")\n    ____ = factory.____("email")\n\n    class ____:\n        ____ = factory.____(is_staff=True, is_superuser=True)',
      },
      hints: [
        'class Params: trait_name = Trait(field_overrides)',
        'Activate: Factory(trait_name=True)',
        'Subclass when the structure differs, not just field values',
      ],
      requires: [/class\s+Params\s*:\s*\n(?:[ \t]+.*\n|[ \t]*\n)*?[ \t]+admin\s*=\s*(?:factory\.)?Trait\(/],
      tags: ['django', 'factory_boy', 'Trait'],
      concepts: ['dj-test-fixtures'],
    },
  {
      id: 'dj-factoryboy-batch-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FACTORY_BOY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the factory method (the same one in both blanks) that saves several posts to the database in one call, giving every post in that call the same field values.',
      template: `published = PostFactory.___(3, is_published=True)
drafts = PostFactory.___(2, is_published=False)`,
      blanks: ['create_batch', 'create_batch'],
      solution: 'published = PostFactory.create_batch(3, is_published=True)\ndrafts = PostFactory.create_batch(2, is_published=False)',
      explanation: '`create_batch(N, **overrides)` calls `.create()` N times, applying the same overrides to each. Different calls can pass different overrides, letting one arrange step build several distinct groups of test data.',
      hints: ['Calling the factory once saves one object; this method does the same for a whole group.', 'Its in-memory twin, which saves nothing, is `build_batch`.'],
      tags: ['django', 'factory_boy', 'create_batch', 'cloze'],
      concepts: ['dj-test-fixtures'],
    },
  {
      id: 'py-dj-factory-usage-test',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FACTORY_BOY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use a factory in a Django test. The view at `"/posts/"` puts a queryset of the published posts in its template context under `"posts"`. Import `TestCase` from `django.test` and `PostFactory` from `.factories`. Define a `PostListTest` class that subclasses `TestCase`, with a test method `test_lists_only_published`. Arrange: use `PostFactory.create_batch` twice: three posts with `is_published=True`, and two posts with `is_published=False`. Act: issue a GET to the path `"/posts/"` via `self.client`. Assert that the `posts` entry in the response context holds 3 posts. Factories make the "arrange" step of AAA tests readable.',
      starterCode: `# Write PostListTest(TestCase).test_lists_only_published: create_batch 3
# posts is_published=True and 2 is_published=False, GET "/posts/" via
# self.client, and assert response.context["posts"] holds 3 posts.
`,
      testCases: [
        {
          input: 'factory_boy inside a TestCase',
          expectedOutput: 'Arrange 5 posts, assert only 3 shown',
          description: 'create_batch for bulk + kwarg overrides per batch',
        },
      ],
      solution: `from django.test import TestCase
from .factories import PostFactory

class PostListTest(TestCase):
    def test_lists_only_published(self):
        PostFactory.create_batch(3, is_published=True)
        PostFactory.create_batch(2, is_published=False)
        response = self.client.get("/posts/")
        self.assertEqual(response.context["posts"].count(), 3)
# OR
from django.test import TestCase
from .factories import PostFactory

class PostListTest(TestCase):
    def test_lists_only_published(self):
        PostFactory.create_batch(3, is_published=True)
        PostFactory.create_batch(2, is_published=False)
        response = self.client.get("/posts/")
        self.assertEqual(len(response.context["posts"]), 3)
# OR
from django.test import TestCase
from .factories import PostFactory

class PostListTest(TestCase):
    def test_lists_only_published(self):
        PostFactory.create_batch(3, is_published=True)
        PostFactory.create_batch(2, is_published=False)
        response = self.client.get("/posts/")
        assert response.context["posts"].count() == 3`,
      requires: [/is_published\s*=\s*False/, /assert\w*\(\s*3\s*,|,\s*3\s*\)\s*$|==\s*3\b/m],
      explanation: '`create_batch(N, **kwargs)` calls `.create()` N times with the overrides. `Post.objects.count()` would be 5, but the view lists only published posts, so the drafts are what prove the filter works: without them the test would pass even if the view listed everything. `.count()` and `len(...)` both give 3 here, and a plain `assert` works as well as `assertEqual`. Factories make tests self-documenting: the first two lines read as "given 3 published and 2 draft posts". `pytest-django` + `pytest-factoryboy` lets you use factories as pytest fixtures directly.',
      tieredHints: {
        apiSignature: 'Factory.create_batch(size, **kwargs)',
        skeleton: 'from django.test import TestCase\nfrom .factories import ____\n\nclass ____(____):\n    def ____(self):\n        ____.____(3, is_published=True)\n        ____.____(2, is_published=False)\n        response = self.client.____("/posts/")\n        self.____(response.context["posts"].____(), 3)',
      },
      hints: [
        'create_batch(N, **overrides) for bulk',
        'Each batch can have different overrides',
        'pytest-factoryboy auto-generates fixtures from factories',
      ],
      tags: ['django', 'factory_boy', 'TestCase', 'create_batch'],
      concepts: ['dj-test-fixtures'],
    },
  {
      id: 'py-dj-factory-vs-fixture',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FACTORY_BOY,
      course: Course.BACKEND,
      question: 'Why prefer factories over Django\'s JSON fixtures or per-test `setUp()` for test data?',
      options: [
        { id: 'a', text: 'Each test builds only the rows it needs, with defaults kept in one factory per model, so a new field means one change, not edits to every JSON file', isCorrect: true },
        { id: 'b', text: 'JSON fixtures cannot hold foreign keys, so any test that needs related rows, such as a post and its author, has to build them with factories', isCorrect: false },
        { id: 'c', text: 'Fixtures are always slower, because every fixture row is inserted again before each test method, while factory rows are inserted once per class', isCorrect: false },
        { id: 'd', text: '`setUp()` runs only once per test class, so rows it creates leak between the tests, while factory calls inside each test start from a clean table', isCorrect: false },
      ],
      explanation: 'Three ways to get test data: (1) JSON fixtures are files of fixed rows loaded for a whole test class; every file must be edited when a model gains a required field, and the values say nothing about why a test needs them. (2) `setUp()` runs before each test and is readable, but its creation code is copied between test files. (3) A factory declares the defaults once and each test overrides only what it is about. Fixtures can hold foreign keys (by primary key). In a Django `TestCase`, fixtures are loaded once per class, not before every test. `setUp()` runs before every test, and `TestCase` rolls each test back, so nothing leaks either way; `setUpTestData()` is the once-per-class hook.',
      hints: [
        'Think about what happens to a folder of JSON fixtures when a model gains a required field.',
        'A factory keeps each default in one place; a test names only the fields it cares about.',
      ],
      tags: ['django', 'factory_boy', 'fixtures', 'testing'],
      concepts: ['py-test-isolation'],
    },
  {
      id: 'dj-factoryboy-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FACTORY_BOY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: '`PostFactory` gives each post a Faker title and `author = factory.SubFactory(UserFactory)`. These lines run inside a Django `TestCase` test method, starting from an empty test database. What do the three `print` calls output? The answer is three lines, each two values separated by a space.',
      code: `# PostFactory: title = factory.Faker("sentence"), author = factory.SubFactory(UserFactory)
posts = PostFactory.create_batch(2)
print(User.objects.count(), Post.objects.count())

shared = UserFactory()
PostFactory.create_batch(3, author=shared)
print(User.objects.count(), Post.objects.count())

draft = PostFactory.build(author=shared)
print(draft.pk, Post.objects.count())`,
      expectedOutput: `2 2
3 5
None 5`,
      explanation: 'A `SubFactory` runs the related factory once for every object it builds, so `create_batch(2)` saves two posts and two new users. Passing `author=shared` overrides the SubFactory, so the next three posts reuse one user: one more user (the `UserFactory()` call) and three more posts make 3 users and 5 posts. `build()` makes the instance without saving it, so it has no primary key yet (`None`) and the post count stays at 5.',
      hints: ['Each post a SubFactory builds gets its own new author, unless an author is passed in.', 'build() does not save to the database.'],
      tags: ['django', 'factory_boy', 'SubFactory', 'build', 'predict'],
      concepts: ['dj-test-fixtures'],
    },
];
