/**
 * Topic.DJ_REST — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendGapQuestions.ts (3), backendQuestions.ts (2), djangoAdvancedRungQuestions.ts (2), djangoBatchCExpansionQuestions.ts (8), djangoClozeQuestions.ts (3), djangoGapFillQuestions.ts (2), djangoParsonsQuestions.ts (3), djangoPredictOutputQuestions.ts (3)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_rest_questions: Question[] = [
  {
      id: 'dj-rest-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a nested serializer: AuthorSerializer (id, name) and BookSerializer (id, title, author as nested AuthorSerializer). Handle creating a book with an existing author by accepting author_id on write.',
      starterCode: `from rest_framework import serializers\n\n`,
      testCases: [{ input: 'nested serializer', expectedOutput: 'nested read, PrimaryKeyRelatedField for write', description: 'Should handle nested serializer' }],
      solution: `from rest_framework import serializers\n\nclass AuthorSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Author\n        fields = ["id", "name"]\n\nclass BookSerializer(serializers.ModelSerializer):\n    author = AuthorSerializer(read_only=True)\n    author_id = serializers.PrimaryKeyRelatedField(\n        queryset=Author.objects.all(), source="author", write_only=True\n    )\n\n    class Meta:\n        model = Book\n        fields = ["id", "title", "author", "author_id"]`,
      explanation: 'Nested serializer (read_only=True) for detailed GET responses. PrimaryKeyRelatedField (write_only=True) for accepting an author_id on POST/PUT. source="author" maps author_id to the author field on the model. This is the standard read/write pattern.',
      hints: ['Nested serializer for read, PrimaryKeyRelatedField for write', 'read_only and write_only separate concerns', 'source= maps the field to the model attribute'],
      tags: ['drf', 'nested-serializer', 'relationships', 'django'],
      concepts: ['dj-serializer-validation'],
    },
  {
      id: 'dj-rest-5',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Add filtering and ordering to a DRF ViewSet: filter articles by is_published and author, and allow ordering by published_date and title. Use django-filter.',
      starterCode: `# Define ArticleViewSet(ModelViewSet): set queryset and serializer_class,
# enable DjangoFilterBackend + OrderingFilter, allow filtering on
# is_published and author, allow ordering by published_date and title,
# and default the ordering to newest published first.
`,
      testCases: [{ input: 'filtered ViewSet', expectedOutput: 'filter_backends, filterset_fields, ordering_fields', description: 'Should add filtering and ordering' }],
      solution: `from rest_framework import viewsets\nfrom django_filters.rest_framework import DjangoFilterBackend\nfrom rest_framework.filters import OrderingFilter\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n    filter_backends = [DjangoFilterBackend, OrderingFilter]\n    filterset_fields = ["is_published", "author"]\n    ordering_fields = ["published_date", "title"]\n    ordering = ["-published_date"]`,
      explanation: 'filter_backends enables filtering. filterset_fields auto-creates exact-match filters (?is_published=true&author=1). OrderingFilter adds ?ordering=title or ?ordering=-published_date. ordering sets the default sort. django-filter supports complex lookups too.',
      hints: ['filter_backends for filter engines', 'filterset_fields for auto filters', 'ordering_fields for sortable fields'],
      tags: ['drf', 'filtering', 'ordering', 'django-filter', 'django'],
      concepts: ['dj-orm-query-construction', 'dj-model-construction'],
    },
  {
      id: 'dj-rest-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a Django REST Framework serializer for an Article model (fields: id, title, body, author, published_date) using ModelSerializer.',
      starterCode: `# Import serializers from rest_framework and Article from .models
# Define ArticleSerializer(ModelSerializer) with a Meta class listing
# model = Article and the five fields from the prompt
`,
      testCases: [
        {
          input: 'Article model',
          expectedOutput: 'ModelSerializer with Meta class',
          description: 'Should create DRF serializer',
        },
      ],
      solution: `from rest_framework import serializers\nfrom .models import Article\n\nclass ArticleSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Article\n        fields = ["id", "title", "body", "author", "published_date"]`,
      explanation: 'ModelSerializer auto-generates serializer fields from the model. Meta.model specifies which model. Meta.fields lists which fields to include (use "__all__" for all fields). Serializers handle JSON conversion and validation.',
      hints: ['Inherit from serializers.ModelSerializer', 'Define model and fields in Meta class'],
      tags: ['drf', 'serializer', 'model-serializer', 'rest', 'django'],
      concepts: ['dj-serializer-validation'],
    },
  {
      id: 'dj-rest-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a DRF APIView that handles GET (return all articles) and POST (create a new article) requests.',
      starterCode: `# Imports: APIView from rest_framework.views; Response; status
# Define ArticleListView(APIView):
#   get(self, request) — serialize Article.objects.all() (many=True) and return Response(data)
#   post(self, request) — validate with is_valid(); save and return 201 on success,
#     return errors with 400 on failure
`,
      testCases: [
        {
          input: 'API endpoint',
          expectedOutput: 'APIView with get() and post() methods',
          description: 'Should handle GET and POST',
        },
      ],
      solution: `from rest_framework.views import APIView\nfrom rest_framework.response import Response\nfrom rest_framework import status\n\nclass ArticleListView(APIView):\n    def get(self, request):\n        articles = Article.objects.all()\n        serializer = ArticleSerializer(articles, many=True)\n        return Response(serializer.data)\n\n    def post(self, request):\n        serializer = ArticleSerializer(data=request.data)\n        if serializer.is_valid():\n            serializer.save()\n            return Response(serializer.data, status=status.HTTP_201_CREATED)\n        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)`,
      explanation: 'APIView maps HTTP methods to class methods. GET returns serialized data. POST validates input with is_valid(), saves on success, returns errors on failure. many=True serializes multiple objects. DRF handles JSON parsing automatically.',
      hints: ['Define get() and post() methods', 'Use many=True for querysets', 'is_valid() before save()'],
      tags: ['drf', 'apiview', 'get', 'post', 'rest', 'django'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'dj-drf-adv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Build a DRF ModelViewSet for \`Article\` that combines four production requirements:
  
  1. Authenticated users can read all published articles. Anonymous users are blocked.
  2. Authenticated users can only edit/delete articles they authored.
  3. Setting \`author\` from the API is forbidden — it must come from \`request.user\` on create.
  4. The \`@action\` \`publish\` flips an article's status to "published" — only the author may call it.
  
  Implement using a custom permission class plus an overridden \`perform_create\` and an action method. Use \`ArticleSerializer\`.`,
      starterCode: `from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Article
from .serializers import ArticleSerializer
`,
      testCases: [
        {
          input: 'GET as anonymous → 401; PATCH as non-author → 403; POST sets author from request.user',
          expectedOutput: 'IsAuthenticated + IsOwnerOrReadOnly + perform_create override + @action with detail=True',
          description: 'Auth + ownership + perform_create + custom action — full ViewSet pattern',
        },
      ],
      solution: `from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Article
from .serializers import ArticleSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Article.objects.filter(status="published")

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        article = self.get_object()
        article.status = "published"
        article.save()
        return Response({"status": article.status})`,
      explanation: 'Four-primitive combo. `permission_classes` is a list — DRF AND-s them together. Custom `BasePermission` overrides `has_object_permission` to enforce ownership; SAFE_METHODS (GET/HEAD/OPTIONS) bypass the ownership check. `perform_create(serializer)` is the DRF hook for "set fields server-side that the client should not control" — `serializer.save(author=...)` injects the FK without exposing it in the serializer. `@action(detail=True)` adds a per-instance custom endpoint at `/articles/{pk}/publish/`; `self.get_object()` runs `has_object_permission` so the ownership rule auto-applies to the action.',
      hints: [
        'permission_classes is a list — AND-ed together',
        'has_object_permission for per-row checks; has_permission for per-request',
        'perform_create(serializer) for server-set fields',
        '@action(detail=True) for /pk/method/; detail=False for /method/',
        'self.get_object() runs object-level permissions',
      ],
      tags: ['django', 'drf', 'ModelViewSet', 'BasePermission', 'perform_create', 'action', 'advanced'],
      concepts: ['dj-view-patterns', 'dj-permission-class'],
    },
  {
      id: 'dj-drf-adv-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Build a DRF serializer that handles a *writeable nested relation*: \`ArticleSerializer\` with a list of \`tags\` (an M2M relation to \`Tag\`). On POST/PATCH, accept a list of tag *names* (strings). Existing tags are reused; new tag names create new \`Tag\` rows. Override \`create\` and \`update\` to handle the M2M assignment cleanly.
  
  \`Tag\` has fields: \`name\` (CharField, unique=True). \`Article\` has a ManyToManyField to Tag named \`tags\`. Read should return the list of tag names — not full Tag objects.`,
      starterCode: `from rest_framework import serializers
from .models import Article, Tag
`,
      testCases: [
        {
          input: 'POST {"title": "...", "body": "...", "tags": ["python", "django"]}',
          expectedOutput: 'StringRelatedField for read + custom field for write + override create/update with get_or_create per name',
          description: 'Nested writeable M2M with name-based identification',
        },
      ],
      solution: `from rest_framework import serializers
from .models import Article, Tag


class ArticleSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(
        child=serializers.CharField(), allow_empty=True, required=False,
    )

    class Meta:
        model = Article
        fields = ["id", "title", "body", "tags"]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["tags"] = list(instance.tags.values_list("name", flat=True))
        return rep

    def create(self, validated_data):
        tag_names = validated_data.pop("tags", [])
        article = Article.objects.create(**validated_data)
        self._set_tags(article, tag_names)
        return article

    def update(self, instance, validated_data):
        tag_names = validated_data.pop("tags", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tag_names is not None:
            self._set_tags(instance, tag_names)
        return instance

    def _set_tags(self, article, names):
        tags = [Tag.objects.get_or_create(name=n)[0] for n in names]
        article.tags.set(tags)`,
      explanation: 'Three production patterns: (1) Read shape != write shape — `ListField(child=CharField)` accepts a list of strings on input; `to_representation` overrides the read side to project to names. (2) `create`/`update` must `pop("tags")` from `validated_data` because the field isn\'t a real model attribute — pass it through to a private helper. (3) `Tag.objects.get_or_create(name=n)[0]` makes tag creation idempotent; `article.tags.set(tags)` REPLACES the M2M (vs `.add()` which would APPEND duplicates). Treating `tag_names is None` differently from `[]` matters for PATCH — None means "don\'t touch", [] means "clear them".',
      hints: [
        'Different read vs write shape: override to_representation',
        'Pop M2M payload from validated_data before .create()',
        'get_or_create returns (instance, created) tuple — index [0]',
        '.tags.set(...) replaces; .add(...) appends',
        'PATCH semantics: None = leave alone, [] = clear',
      ],
      tags: ['django', 'drf', 'serializer', 'nested', 'M2M', 'create', 'update', 'advanced'],
      concepts: ['dj-serializer-validation'],
    },
  {
      id: 'py-drf-modelviewset',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a complete CRUD ViewSet for `Article`. Import `viewsets` from `rest_framework`, `Article` from `.models`, and `ArticleSerializer` from `.serializers`. Define an `ArticleViewSet` that subclasses `viewsets.ModelViewSet` and sets two class attributes: `queryset` to all `Article` rows, and `serializer_class` to `ArticleSerializer`. That is the whole CRUD surface — list, retrieve, create, update, partial_update, destroy. A router will wire them to URLs.',
      starterCode: `# Define ArticleViewSet(viewsets.ModelViewSet) with queryset = all
# Article rows and serializer_class = ArticleSerializer. That alone is
# the full CRUD surface; a router wires it to URLs.
`,
      testCases: [
        {
          input: 'ModelViewSet for Article',
          expectedOutput: 'CRUD surface generated from queryset + serializer_class',
          description: 'ModelViewSet = full CRUD REST',
        },
      ],
      solution: `from rest_framework import viewsets
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer`,
      explanation: '`ModelViewSet` = `mixins.CreateModelMixin + RetrieveModelMixin + UpdateModelMixin + DestroyModelMixin + ListModelMixin + GenericViewSet`. Override individual methods (`list`, `retrieve`, `create`, `perform_create`, `destroy`) as needed. For partial CRUD, pick a narrower base (e.g. `ReadOnlyModelViewSet` for list+retrieve only). For custom routes, `@action(detail=True, methods=["post"])` decorator on your method.',
      hints: [
        'ModelViewSet bundles mixins for full CRUD',
        'Override perform_create to inject fields (author=request.user)',
        '@action for non-standard routes',
      ],
      tags: ['drf', 'ViewSet', 'ModelViewSet', 'CRUD'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'py-drf-router',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Wire ViewSet URLs with a DRF `DefaultRouter`. Import `DefaultRouter` from `rest_framework.routers` and `ArticleViewSet` from `.views`. Build `router = DefaultRouter()`, register `router.register(r"articles", ArticleViewSet, basename="article")`. Set `urlpatterns = router.urls`. The router generates `/articles/`, `/articles/<pk>/`, plus a browsable-API root.',
      starterCode: `# Build a DefaultRouter, register ArticleViewSet under "articles" with
# basename "article", and expose router.urls as urlpatterns.
`,
      testCases: [
        {
          input: 'DefaultRouter wiring',
          expectedOutput: '/articles/ (list/create) + /articles/<pk>/ (RUD)',
          description: 'Router generates standard REST URLs',
        },
      ],
      solution: `from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet

router = DefaultRouter()
router.register(r"articles", ArticleViewSet, basename="article")

urlpatterns = router.urls`,
      explanation: '`DefaultRouter` generates: GET/POST `/articles/` (list/create), GET/PUT/PATCH/DELETE `/articles/<pk>/` (retrieve/update/partial_update/destroy), plus a root view (`/`) listing all registered ViewSets. Custom `@action` methods attach automatically: `@action(detail=True, methods=["post"]) def publish(...)` → `/articles/<pk>/publish/`. `basename=` is required if the ViewSet doesn\'t have a `queryset` attribute (e.g. you override `get_queryset`).',
      hints: [
        'router.register(prefix, ViewSet, basename=...)',
        'basename= required if ViewSet has no queryset attribute',
        '@action methods auto-attach to router URLs',
      ],
      tags: ['drf', 'router', 'DefaultRouter'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'py-drf-serializer-validator',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Add field-level validation to a serializer via the `validate_<field>` hook. Import `serializers` from `rest_framework`. Define `ArticleSerializer` as a `ModelSerializer` bound to `Article` exposing fields `title` and `body`. Add the field-level hook for `title` — it receives the candidate value, raises `serializers.ValidationError("Title too short")` if the value has fewer than 5 characters, and otherwise returns the value unchanged.',
      starterCode: `# Define ArticleSerializer(ModelSerializer) on Article exposing title
# and body. Add the field-level validate hook for title: raise
# serializers.ValidationError("Title too short") when under 5 chars,
# else return the value.
`,
      testCases: [
        {
          input: 'validate_title serializer method',
          expectedOutput: 'ValidationError surfaces as 400 response with field error',
          description: 'validate_<field> runs during is_valid()',
        },
      ],
      solution: `from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ["title", "body"]

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Title too short")
        return value`,
      explanation: 'Mirrors Django forms. `validate_<field>` for single-field checks, `validate(self, data)` for cross-field (receives the whole `data` dict, returns it). Raised `ValidationError` surfaces as a 400 response with `{"title": ["Title too short"]}`. For reusable logic, `serializers.Field(validators=[...])` with callables. For model-level uniqueness / constraints, DRF uses the existing `UniqueValidator` automatically on ModelSerializer.',
      hints: [
        'validate_<field>(self, value): return value or raise ValidationError',
        'validate(self, data): full dict, cross-field',
        'Surfaces as 400 with field-specific errors',
      ],
      tags: ['drf', 'serializer', 'validation'],
      concepts: ['dj-serializer-validation'],
    },
  {
      id: 'py-drf-method-field',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Add a computed field to a serializer with `SerializerMethodField`. Import `serializers` from `rest_framework`. Define `ArticleSerializer` as a `ModelSerializer` bound to `Article` whose exposed fields are `title`, `body`, and a read-only computed field `word_count` declared as a `SerializerMethodField`. Add the corresponding `get_word_count` method on the serializer that takes `self` and the article instance and returns the whitespace-split word count of its `body`.',
      starterCode: `# Define ArticleSerializer(ModelSerializer) on Article exposing title,
# body, and a read-only computed word_count via SerializerMethodField;
# add get_word_count(self, obj) returning the body's word count.
`,
      testCases: [
        {
          input: 'SerializerMethodField',
          expectedOutput: 'JSON output includes word_count integer',
          description: 'Computed fields via get_<name>(obj)',
        },
      ],
      solution: `from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    word_count = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ["title", "body", "word_count"]

    def get_word_count(self, obj):
        return len(obj.body.split())`,
      explanation: '`SerializerMethodField` is for READ-ONLY computed values — perfect for derived stats, formatted strings, related-object previews. Name the method `get_<field>(self, obj)` where `obj` is the model instance being serialised. For WRITE-time computed values, use `validate()` or override `create`/`update`. For M2M that needs a custom shape, use a nested serializer. Don\'t do expensive DB work in `get_*` — it\'s called per instance during serialization.',
      hints: [
        'SerializerMethodField = read-only computed',
        'Method name pattern: get_<field_name>(self, obj)',
        'Avoid heavy DB work — called per instance',
      ],
      tags: ['drf', 'serializer', 'SerializerMethodField'],
      concepts: ['dj-serializer-validation'],
    },
  {
      id: 'py-drf-permission-class',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Require authentication for writes, allow reads for anyone. Import `IsAuthenticatedOrReadOnly` from `rest_framework.permissions`. Add `permission_classes = [IsAuthenticatedOrReadOnly]` on an `ArticleViewSet(ModelViewSet)`. Reads (GET, HEAD, OPTIONS) work for anyone; writes (POST, PUT, PATCH, DELETE) require auth.',
      starterCode: `# On ArticleViewSet(ModelViewSet), set permission_classes to
# IsAuthenticatedOrReadOnly so reads are open to anyone but writes
# require authentication.
`,
      testCases: [
        {
          input: 'IsAuthenticatedOrReadOnly permission',
          expectedOutput: 'GET/HEAD/OPTIONS anyone; POST/PUT/PATCH/DELETE auth',
          description: 'Classic "public API, auth to write"',
        },
      ],
      solution: `from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]`,
      explanation: 'Permissions evaluated in order — ALL must pass. Built-ins: `AllowAny`, `IsAuthenticated`, `IsAdminUser`, `IsAuthenticatedOrReadOnly`, `DjangoModelPermissions` (per-model CRUD perms from Django auth), `DjangoObjectPermissions` (object-level). Write your own: subclass `BasePermission`, override `has_permission(self, request, view)` and/or `has_object_permission(self, request, view, obj)`. Set globally with `REST_FRAMEWORK = {"DEFAULT_PERMISSION_CLASSES": [...]}`.',
      hints: [
        'IsAuthenticatedOrReadOnly = anyone reads, auth writes',
        'Classes evaluated in order — all must pass',
        'Custom: subclass BasePermission with has_permission / has_object_permission',
      ],
      tags: ['drf', 'permissions'],
      concepts: ['dj-permission-class'],
    },
  {
      id: 'py-drf-pagination',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'In `settings.py`, configure global DRF pagination so list endpoints return 20 items per page using the simple `?page=N` style (responses wrapped with `count`/`next`/`previous`/`results`). Set the `REST_FRAMEWORK` dict.',
      starterCode: `# settings.py
REST_FRAMEWORK = {
}
`,
      testCases: [
        {
          input: 'default pagination',
          expectedOutput: 'List responses wrapped with count/next/previous/results',
          description: 'PageNumberPagination is the simplest default',
        },
      ],
      solution: `# settings.py
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}`,
      explanation: 'Options: `PageNumberPagination` (?page=N — simplest), `LimitOffsetPagination` (?limit=N&offset=N — SQL-style), `CursorPagination` (opaque cursor — stable under inserts, required for real-time feeds). Per-view override via `pagination_class = MyPagination`. Disable for a view by setting `pagination_class = None`. Always paginate list endpoints on collections that could grow unbounded — otherwise you ship a DoS vector.',
      hints: [
        'Page / Limit-Offset / Cursor — pick by the API shape',
        'Per-view override: pagination_class on the view',
        'Always paginate unbounded lists',
      ],
      tags: ['drf', 'pagination'],
      concepts: ['dj-pagination-strategy'],
    },
  {
      id: 'py-drf-apiview-vs-viewset',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      question: 'When do you pick `APIView` vs `GenericAPIView` vs a `ViewSet`?',
      options: [
        { id: 'a', text: 'They\'re fully interchangeable — all three expose the same hooks and methods, so the choice between them is purely team style', isCorrect: false },
        { id: 'b', text: '`APIView`: low-level one-off endpoints. `GenericAPIView` + mixins: single-purpose resource endpoints. `ViewSet`: a resource\'s whole CRUD in one class with Router URLs', isCorrect: true },
        { id: 'c', text: '`ViewSet` is deprecated in modern DRF — Routers now generate URL patterns for generic views like `ListCreateAPIView` instead', isCorrect: false },
        { id: 'd', text: '`APIView` cannot attach authentication or permission classes, so any protected endpoint must use `GenericAPIView` or above', isCorrect: false },
      ],
      explanation: 'Progression of abstraction: `APIView` → `GenericAPIView` (adds `queryset`, `serializer_class`, filtering hooks) → concrete generic views (`ListCreateAPIView`, `RetrieveUpdateDestroyAPIView` — combine mixins) → `ViewSet` (multi-endpoint resource) → `ModelViewSet` (full CRUD resource). Per endpoint: heavy custom logic → APIView. Standard resource CRUD → ModelViewSet + Router. In-between → generic view classes. Rule of thumb: pick the lowest level of abstraction that serves your needs.',
      hints: [
        'APIView = low-level, custom logic',
        'GenericAPIView + mixins = structured single-endpoint',
        'ViewSet/ModelViewSet = bundled resource CRUD with Router',
      ],
      tags: ['drf', 'APIView', 'ViewSet', 'design'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'py-drf-nested-serializer',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Nest an author serializer inside an article serializer so GETs return `{"id": 1, "title": "...", "author": {"username": "alice", "id": 7}}`. First build an `AuthorSerializer` as a `ModelSerializer` bound to `User` exposing just `id` and `username`. Then build an `ArticleSerializer` as a `ModelSerializer` bound to `Article` with fields `id`, `title`, and an `author` attribute that embeds the `AuthorSerializer` in read-only mode so the nested form does not need to handle writes.',
      starterCode: `# Build AuthorSerializer(ModelSerializer) on User exposing id and
# username, then ArticleSerializer(ModelSerializer) on Article with
# fields id, title, and a read-only nested author = AuthorSerializer.
`,
      testCases: [
        {
          input: 'nested serializer on GET',
          expectedOutput: 'article.author is a {id, username} dict',
          description: 'Nested ModelSerializer produces nested JSON',
        },
      ],
      solution: `from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Article

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]

class ArticleSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = Article
        fields = ["id", "title", "author"]`,
      explanation: 'Nested `read_only=True` is the 80% case: reads return nested JSON, writes accept an `author_id` (separately declared) or get it from `request.user` in `perform_create`. For nested WRITES (create article + author in one POST), override `create` / `update` on the serializer to unpack the nested dict. It gets hairy — prefer flat writes + a follow-up call, or use `drf-writable-nested` library.',
      hints: [
        'Nested read_only=True = easy case',
        'Nested writes need custom create/update or drf-writable-nested',
        'Separate author_id field for inbound writes',
      ],
      tags: ['drf', 'serializer', 'nested'],
      concepts: ['dj-serializer-validation'],
    },
  {
      id: 'dj-drf-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a DRF ModelSerializer for Article with id, title, body fields.',
      template: `from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.___):
    class Meta:
        ___ = Article
        ___ = ["id", "title", "body"]`,
      blanks: ['ModelSerializer', 'model', 'fields'],
      solution: 'from rest_framework import serializers\nfrom .models import Article\n\nclass ArticleSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Article\n        fields = ["id", "title", "body"]',
      explanation: '`ModelSerializer` auto-generates fields from the model — the same Meta pattern as Django\'s ModelForm. `fields` is a list of attribute names. List `id` explicitly when you want the client to see it.',
      hints: ['Mirrors ModelForm structure', 'Meta.model = class, Meta.fields = list'],
      tags: ['django', 'drf', 'ModelSerializer', 'Meta', 'cloze'],
      concepts: ['dj-serializer-validation', 'dj-model-construction'],
    },
  {
      id: 'dj-drf-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Add a per-field validator: reject titles shorter than 5 chars. Use DRF\'s naming and exception class.',
      template: `class ArticleSerializer(serializers.ModelSerializer):
      class Meta:
          model = Article
          fields = ["id", "title"]
  
      def ___(self, value):
          if len(value) < 5:
              raise serializers.___("too short")
          return value`,
      blanks: ['validate_title', 'ValidationError'],
      solution: 'class ArticleSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Article\n        fields = ["id", "title"]\n\n    def validate_title(self, value):\n        if len(value) < 5:\n            raise serializers.ValidationError("too short")\n        return value',
      explanation: 'DRF: `validate_<field>(self, value)` — note `value` is a parameter (Django Forms\' `clean_<field>` reads from `self.cleaned_data` instead). Use `serializers.ValidationError`, not Django\'s `core.exceptions.ValidationError`.',
      hints: ['DRF method takes (self, value)', 'serializers.ValidationError, not core'],
      tags: ['django', 'drf', 'validate_field', 'ValidationError', 'cloze'],
      concepts: ['dj-serializer-validation'],
    },
  {
      id: 'dj-drf-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a ListCreateAPIView that filters by status and uses ArticleSerializer.',
      template: `from rest_framework.generics import ListCreateAPIView

class ArticleListCreate(___):
    ___ = ArticleSerializer

    def ___(self):
        return Article.objects.filter(status="published")`,
      blanks: ['ListCreateAPIView', 'serializer_class', 'get_queryset'],
      solution: 'from rest_framework.generics import ListCreateAPIView\n\nclass ArticleListCreate(ListCreateAPIView):\n    serializer_class = ArticleSerializer\n\n    def get_queryset(self):\n        return Article.objects.filter(status="published")',
      explanation: 'Generic API views use `serializer_class` (singular, not `serializer`) and either a class-level `queryset` or an overridden `get_queryset()`. Override the method when the queryset depends on the request (e.g. filter by `self.request.user`).',
      hints: ['serializer_class is the attr name', 'get_queryset for request-aware filtering'],
      tags: ['django', 'drf', 'ListCreateAPIView', 'get_queryset', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'dj-rest-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      question: 'What is Django REST Framework (DRF)?\n\nWhen you want your Django app to serve JSON data to a frontend (React, mobile app, etc.) instead of HTML pages, you need an API. DRF makes building APIs much easier.',
      options: [
        {
          id: 'a',
          text: 'A frontend JavaScript framework that replaces React for building user interfaces',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'A built-in Django module that automatically converts every existing view to return JSON instead of HTML',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'A toolkit for building Web APIs on top of Django — serializers, views/viewsets, authentication, permissions, and a browsable API',
          isCorrect: true,
        },
        {
          id: 'd',
          text: 'A database migration tool that syncs your Django models with a REST API specification',
          isCorrect: false,
        },
      ],
      explanation: 'Django REST Framework (DRF) is a third-party package (pip install djangorestframework) that extends Django for building APIs. Its key components are: Serializers (translate between Python objects/models and JSON), APIViews/ViewSets (handle GET, POST, PUT, DELETE requests), Authentication (token, session, JWT), Permissions (who can access what), and a browsable API (an HTML interface for testing your API in the browser).',
      hints: [
        'DRF is installed separately: pip install djangorestframework',
        'Serializers are like forms, but for JSON instead of HTML',
      ],
      tags: ['django', 'drf', 'rest-api', 'serializers', 'basics'],
      concepts: ['dj-serializer-validation'],
    },
  {
      id: 'dj-rest-gap-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create the simplest possible DRF API for a Book model (title, author, price fields). Write:\n1. A BookSerializer that serializes all fields\n2. A BookListView (using APIView) that returns all books as JSON on a GET request\n\nAssume the Book model is already defined.',
      starterCode: `# serializers.py — BookSerializer: a ModelSerializer covering every
# field of Book.

# views.py — BookListView: an APIView whose GET handler fetches all
# books, serializes the queryset, and returns the data in a Response.
`,
      testCases: [
        {
          input: 'Serializer and APIView',
          expectedOutput: 'ModelSerializer for Book and APIView with get() returning serialized books',
          description: 'Should define a BookSerializer and BookListView',
        },
      ],
      solution: `# serializers.py
from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer

class BookListView(APIView):
    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)`,
      explanation: 'ModelSerializer automatically creates serializer fields matching the model fields — fields = \'__all__\' includes every field. The APIView\'s get() method handles GET requests: it queries all books, passes them to the serializer (many=True because it\'s a list), and returns Response(serializer.data) which automatically converts to JSON. The client receives something like [{"id": 1, "title": "Django for Beginners", "author": "William Vincent", "price": "29.99"}].',
      hints: [
        'ModelSerializer needs a Meta class with model and fields',
        'Use many=True when serializing a queryset (multiple objects)',
        'Response() from rest_framework automatically handles JSON conversion',
      ],
      tags: ['django', 'drf', 'serializer', 'apiview', 'basics'],
      concepts: ['dj-serializer-validation'],
    },
  {
      id: 'dj-drf-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a DRF ModelSerializer for Article that serializes id, title, and body.',
      correctOrder: [
        'from rest_framework import serializers',
        'from .models import Article',
        '',
        'class ArticleSerializer(serializers.ModelSerializer):',
        '    class Meta:',
        '        model = Article',
        '        fields = ["id", "title", "body"]',
      ],
      distractorLines: [
        'class ArticleSerializer(serializers.Serializer):',
        '        fields = "id, title, body"',
        '        model = "Article"',
        '    class Meta(serializers.ModelSerializer):',
      ],
      solution: 'from rest_framework import serializers\nfrom .models import Article\n\nclass ArticleSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Article\n        fields = ["id", "title", "body"]',
      explanation: '`ModelSerializer` auto-generates fields from the model — same Meta pattern as Django\'s `ModelForm`. `fields` is a list of attribute names. Always include `id` explicitly when you want clients to see it; some teams prefer `fields = "__all__"` but it leaks fields you might add later.',
      hints: ['Inherit from serializers.ModelSerializer', 'Meta.fields is a list', 'Always list id explicitly'],
      tags: ['django', 'drf', 'serializer', 'ModelSerializer', 'parsons'],
      concepts: ['dj-serializer-validation'],
    },
  {
      id: 'dj-drf-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a DRF ListCreateAPIView for Article using ArticleSerializer that returns published articles only. Connect via a URL.',
      correctOrder: [
        'from rest_framework.generics import ListCreateAPIView',
        'from .models import Article',
        'from .serializers import ArticleSerializer',
        '',
        'class ArticleListCreate(ListCreateAPIView):',
        '    serializer_class = ArticleSerializer',
        '',
        '    def get_queryset(self):',
        '        return Article.objects.filter(status="published")',
      ],
      distractorLines: [
        '    queryset = Article.objects.filter(status="published")',
        '    serializer = ArticleSerializer',
        'class ArticleListCreate(GenericAPIView):',
        '    def queryset(self):',
      ],
      solution: 'from rest_framework.generics import ListCreateAPIView\nfrom .models import Article\nfrom .serializers import ArticleSerializer\n\nclass ArticleListCreate(ListCreateAPIView):\n    serializer_class = ArticleSerializer\n\n    def get_queryset(self):\n        return Article.objects.filter(status="published")',
      explanation: 'Generic API views need `serializer_class` (not `serializer`) and either a class-level `queryset` or an overridden `get_queryset()`. Use `get_queryset` when the queryset depends on the request (filtering by status, user, etc.). `ListCreateAPIView` handles both `GET` (list) and `POST` (create) automatically.',
      hints: ['serializer_class, not serializer', 'Override get_queryset for dynamic filtering', 'ListCreate handles GET and POST'],
      tags: ['django', 'drf', 'ListCreateAPIView', 'get_queryset', 'parsons'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'dj-drf-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Add field-level validation to ArticleSerializer: `validate_title` rejects titles shorter than 5 chars.',
      correctOrder: [
        'from rest_framework import serializers',
        '',
        'class ArticleSerializer(serializers.ModelSerializer):',
        '    class Meta:',
        '        model = Article',
        '        fields = ["id", "title", "body"]',
        '',
        '    def validate_title(self, value):',
        '        if len(value) < 5:',
        '            raise serializers.ValidationError("Title too short")',
        '        return value',
      ],
      distractorLines: [
        '    def clean_title(self, value):',
        '        raise ValidationError("Title too short")',
        '    def validate_title(self):',
        '    def validate(self, value):',
      ],
      solution: 'from rest_framework import serializers\n\nclass ArticleSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Article\n        fields = ["id", "title", "body"]\n\n    def validate_title(self, value):\n        if len(value) < 5:\n            raise serializers.ValidationError("Title too short")\n        return value',
      explanation: 'DRF uses `validate_<fieldname>(self, value)` — note the `value` parameter (Django forms\' `clean_<fieldname>` reads `self.cleaned_data` instead). `serializers.ValidationError` is the right exception class. `validate(self, attrs)` is for cross-field validation; per-field validators take `value`.',
      hints: ['DRF: validate_<field>, not clean_<field>', 'Takes (self, value), returns value', 'serializers.ValidationError, not Django\'s'],
      tags: ['django', 'drf', 'validate_field', 'ValidationError', 'parsons'],
      concepts: ['dj-serializer-validation'],
    },
  {
      id: 'dj-drf-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What\'s printed for a serialized Article?',
      code: `class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ["id", "title"]

article = Article.objects.create(title="Hello")  # pk=1
serializer = ArticleSerializer(article)
print(serializer.data)`,
      expectedOutput: `{'id': 1, 'title': 'Hello'}`,
      explanation: '`serializer.data` is a dict-like (OrderedDict) of the fields declared in `Meta.fields`. For a single instance you pass it directly. For a queryset use `ArticleSerializer(qs, many=True)` and `.data` is then a list of dicts.',
      hints: ['serializer.data → dict for single, list for many=True', 'Only fields in Meta.fields appear'],
      tags: ['django', 'drf', 'serializer.data', 'predict'],
      concepts: ['dj-serializer-validation'],
    },
  {
      id: 'dj-drf-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this print when title is too short?',
      code: `class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ["id", "title"]

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("too short")
        return value

s = ArticleSerializer(data={"title": "hi"})
print(s.is_valid())
print(list(s.errors.keys()))`,
      expectedOutput: `False
['title']`,
      explanation: 'DRF mirrors Django Forms but with `validate_<field>(self, value)` and `serializers.ValidationError`. Errors land on `serializer.errors[field]`. `is_valid()` returns the bool, but `is_valid(raise_exception=True)` would instead throw a `ValidationError` to be caught by DRF\'s exception handler (returning a 400 response automatically).',
      hints: ['DRF: validate_<field> with (self, value)', 'errors land on the field name', 'raise_exception=True for auto-400'],
      tags: ['django', 'drf', 'validate_field', 'errors', 'predict'],
      concepts: ['dj-serializer-validation'],
    },
  {
      id: 'dj-drf-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_REST,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'A serializer with a nested SerializerMethodField. What does .data show?',
      code: `class ArticleSerializer(serializers.ModelSerializer):
    word_count = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ["id", "title", "word_count"]

    def get_word_count(self, obj):
        return len(obj.title.split())

article = Article.objects.create(title="Hello DRF World")  # pk=7
print(ArticleSerializer(article).data)`,
      expectedOutput: `{'id': 7, 'title': 'Hello DRF World', 'word_count': 3}`,
      explanation: '`SerializerMethodField` calls `get_<field_name>(self, obj)` on the serializer. Always read-only — the value is computed at serialization time from the instance, never read from input. Useful for derived/computed values that aren\'t stored on the model.',
      hints: ['SerializerMethodField → get_<field>(self, obj)', 'Always read-only', 'Returned value lands under the field name'],
      tags: ['django', 'drf', 'SerializerMethodField', 'predict'],
      concepts: ['dj-serializer-validation'],
    },
  // ===== LAYER A — in-place advanced DRF primitives (faded → cold) =====
  // @api_view function-based view
  {
    id: 'dj-drf-apiview-fbv-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    question: 'When would you reach for `@api_view` (function-based) instead of a class-based `APIView`?',
    options: [
      { id: 'a', text: 'It wraps a plain function so it receives DRF\'s Request/Response and content negotiation — handy for a one-off, non-CRUD endpoint where a whole class is overkill', isCorrect: true },
      { id: 'b', text: 'It is the only way to attach permissions to a function endpoint — a class-based `APIView` cannot declare `permission_classes` at all', isCorrect: false },
      { id: 'c', text: 'It auto-generates the full CRUD route set from a queryset, so the endpoint needs neither a serializer nor a router registration', isCorrect: false },
      { id: 'd', text: 'It runs the handler synchronously, whereas a class-based `APIView` is required for any async view or streaming response body', isCorrect: false },
    ],
    explanation: '`@api_view(["GET", "POST"])` decorates a normal function so the request becomes a DRF `Request` (parsing, `.data`, content negotiation) and you may return a DRF `Response`. Attach `@permission_classes([...])` / `@throttle_classes([...])` below it. It is the lightweight choice for a single custom endpoint; reach for `APIView`/`ViewSet` once you want method-dispatch, mixins, or router wiring.',
    hints: ['@api_view wraps a function with DRF request/response handling', '@permission_classes / @throttle_classes stack below it', 'Class views win once you want mixins or router wiring'],
    tags: ['django', 'drf', 'api-view', 'function-view'],
    concepts: ['dj-view-patterns'],
  },
  {
    id: 'dj-drf-apiview-fbv-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Turn a plain function into a DRF endpoint that handles GET and POST.',
    template: `from rest_framework.decorators import api_view
from rest_framework.response import Response

@___(["GET", "POST"])
def article_list(request):
    articles = Article.objects.all()
    return ___(ArticleSerializer(articles, many=True).data)`,
    blanks: ['api_view', 'Response'],
    solution: 'from rest_framework.decorators import api_view\nfrom rest_framework.response import Response\n\n@api_view(["GET", "POST"])\ndef article_list(request):\n    articles = Article.objects.all()\n    return Response(ArticleSerializer(articles, many=True).data)',
    explanation: '`@api_view(methods)` is the function-based equivalent of subclassing `APIView`: it upgrades the request to a DRF `Request` and lets the function return a DRF `Response`. The allowed methods are listed in the decorator; anything else returns 405 automatically.',
    hints: ['The decorator takes the list of allowed methods', 'Return a DRF Response, not a Django HttpResponse'],
    tags: ['django', 'drf', 'api-view', 'cloze'],
    concepts: ['dj-view-patterns'],
  },
  {
    id: 'dj-drf-apiview-fbv-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Build a function-based DRF endpoint (not a class) for `Article`. It answers GET with every article serialized, and POST to create one — returning 201 with the created data on success, or the validation errors with 400 on failure. Decorate the function so it receives a DRF request and can return a DRF Response.',
    starterCode: `from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Article
from .serializers import ArticleSerializer
`,
    testCases: [
      { input: 'GET → list; POST valid → 201; POST invalid → 400', expectedOutput: '@api_view(["GET","POST"]) + branch on request.method', description: 'Function-based list/create endpoint' },
    ],
    solution: `from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Article
from .serializers import ArticleSerializer


@api_view(["GET", "POST"])
def article_list(request):
    if request.method == "GET":
        articles = Article.objects.all()
        return Response(ArticleSerializer(articles, many=True).data)
    serializer = ArticleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)`,
    explanation: '`@api_view(["GET", "POST"])` is the function-based form of `APIView`. Branch on `request.method`: GET serializes the queryset (`many=True`); POST binds `request.data`, validates, and returns 201 on save or the serializer errors with 400. DRF returns 405 automatically for any method not in the decorator list.',
    hints: ['@api_view(["GET", "POST"]) above the function', 'request.method picks the branch', 'is_valid() before save(); 201 on success, 400 on errors'],
    tags: ['django', 'drf', 'api-view', 'function-view'],
    concepts: ['dj-view-patterns'],
  },
  // write_only / extra_kwargs (password pattern)
  {
    id: 'dj-drf-writeonly-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    question: 'A serializer exposes `password`. You must accept it on create but never include it in any response. Which mechanism does that?',
    options: [
      { id: 'a', text: 'Mark it `write_only=True` (e.g. via `Meta.extra_kwargs`) so it is accepted on input but omitted from the serialized `.data` output', isCorrect: true },
      { id: 'b', text: 'Add the field to `Meta.read_only_fields` so the value is validated on write but kept out of every inbound request payload', isCorrect: false },
      { id: 'c', text: 'Declare `password` as a `SerializerMethodField`, since method-backed fields are excluded from the serialized output by default', isCorrect: false },
      { id: 'd', text: 'Nothing special is required — `ModelSerializer` already strips any field literally named `password` from its responses automatically', isCorrect: false },
    ],
    explanation: '`write_only=True` means "accept on input, never serialize on output" — exactly the password case. Set it inline (`password = serializers.CharField(write_only=True)`) or in `Meta.extra_kwargs = {"password": {"write_only": True}}`. `read_only_fields` is the opposite (output only, ignored on write). `SerializerMethodField` is read-only and *does* appear in output. There is no magic name-based stripping.',
    hints: ['write_only = in on write, out of output', 'read_only_fields is the mirror image', 'extra_kwargs sets per-field options without redeclaring the field'],
    tags: ['django', 'drf', 'write-only', 'extra_kwargs'],
    concepts: ['dj-serializer-validation'],
  },
  {
    id: 'dj-drf-writeonly-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Configure the password field to be accepted on write but never serialized — without redeclaring the field, using the Meta option.',
    template: `class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        ___ = {"password": {"___": True}}`,
    blanks: ['extra_kwargs', 'write_only'],
    solution: 'class UserSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = User\n        fields = ["id", "username", "password"]\n        extra_kwargs = {"password": {"write_only": True}}',
    explanation: '`Meta.extra_kwargs` sets per-field keyword arguments without redeclaring the auto-generated field. `{"write_only": True}` keeps the password out of `.data` while still accepting it on input.',
    hints: ['Meta-level dict mapping field name → kwargs', 'write_only keeps it out of responses'],
    tags: ['django', 'drf', 'write-only', 'extra_kwargs', 'cloze'],
    concepts: ['dj-serializer-validation'],
  },
  {
    id: 'dj-drf-writeonly-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Build a `RegisterSerializer` (`ModelSerializer` on the `User` model) exposing `username`, `email`, and `password`. The password must be accepted on input but never appear in serialized output, and on create it must be stored hashed rather than as the raw value.',
    starterCode: `from rest_framework import serializers
from django.contrib.auth.models import User
`,
    testCases: [
      { input: 'POST {username, email, password}; password absent from response; stored hashed', expectedOutput: 'write_only password + create() using set_password / create_user', description: 'Registration serializer with hashed, write-only password' },
    ],
    solution: `from rest_framework import serializers
from django.contrib.auth.models import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User(
            username=validated_data["username"],
            email=validated_data["email"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user
# OR
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)`,
    explanation: 'Two requirements combine: `extra_kwargs={"password": {"write_only": True}}` keeps the hash out of responses, and overriding `create` ensures the raw password is hashed. `set_password` (or the `create_user` manager, which calls it internally) writes a salted hash — never assign `password=` directly through `objects.create`, which would store the plaintext.',
    hints: ['write_only via extra_kwargs', 'Override create — the default would store plaintext', 'set_password() or User.objects.create_user() hashes it'],
    tags: ['django', 'drf', 'write-only', 'serializer', 'create'],
    concepts: ['dj-serializer-validation'],
  },
  // serializer context
  {
    id: 'dj-drf-context-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    question: 'Inside a serializer you need the current `request` (to read `request.user` or build an absolute URL). How does DRF make it available?',
    options: [
      { id: 'a', text: 'Generic views and viewsets inject it into `self.context`; read it as `self.context["request"]` (or pass `context={"request": request}` when instantiating by hand)', isCorrect: true },
      { id: 'b', text: 'Import the active request from `rest_framework.request`, where DRF stashes the in-flight request as a thread-local global object', isCorrect: false },
      { id: 'c', text: 'DRF passes `request` as the second positional argument into every `validate_*`, `create`, and `update` method on the serializer', isCorrect: false },
      { id: 'd', text: 'Read `self.request` directly — every serializer inherits a `request` attribute populated from `BaseSerializer.__init__`', isCorrect: false },
    ],
    explanation: 'A serializer is request-agnostic by default. Generic views/viewsets call `get_serializer_context()` and pass `{"request", "view", "format"}` automatically, so `self.context["request"]` works inside any method (`validate`, `create`, `SerializerMethodField`). When you instantiate a serializer manually (e.g. in an `APIView`), you must pass `context={"request": request}` yourself, or hyperlinked/url-building fields will fail.',
    hints: ['self.context["request"] inside generic views/viewsets', 'Manual instantiation: pass context={"request": request}', 'No thread-local global, no self.request on the serializer'],
    tags: ['django', 'drf', 'serializer-context'],
    concepts: ['dj-serializer-validation'],
  },
  // relational field families
  {
    id: 'dj-drf-relational-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    question: 'How do DRF\'s relational serializer fields differ when representing a `Book.author` foreign key?',
    options: [
      { id: 'a', text: '`PrimaryKeyRelatedField` → the pk; `StringRelatedField` → `str(author)`; `SlugRelatedField` → a chosen unique field; `HyperlinkedRelatedField` → a URL to the author endpoint', isCorrect: true },
      { id: 'b', text: 'All four render the related object as its full nested dict; they differ only in which HTTP methods are permitted to write the field', isCorrect: false },
      { id: 'c', text: '`PrimaryKeyRelatedField` is read-only; the other three are write-only and therefore can never appear in a GET response body', isCorrect: false },
      { id: 'd', text: '`StringRelatedField` returns the pk cast to a string, while `SlugRelatedField` always returns the model\'s `slug` attribute specifically', isCorrect: false },
    ],
    explanation: 'Each field projects the relation differently: `PrimaryKeyRelatedField` (pk — writeable with a queryset), `StringRelatedField` (`str(obj)` — read-only), `SlugRelatedField(slug_field="name")` (any unique field — writeable), `HyperlinkedRelatedField` (a URL — needs `request` in context). Nested serializers give the full object. Pick by what the client needs and whether the field must accept writes.',
    hints: ['pk / str(obj) / chosen unique field / URL', 'StringRelatedField is read-only', 'SlugRelatedField\'s field is configurable, not literally "slug"'],
    tags: ['django', 'drf', 'relational-field', 'serializer'],
    concepts: ['dj-serializer-validation'],
  },
  {
    id: 'dj-drf-relational-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Represent each tag by its unique `name` (writeable, reusing existing Tag rows) instead of by pk.',
    template: `class ArticleSerializer(serializers.ModelSerializer):
    tags = serializers.___(
        slug_field="___", queryset=Tag.objects.all(), many=True,
    )`,
    blanks: ['SlugRelatedField', 'name'],
    solution: 'class ArticleSerializer(serializers.ModelSerializer):\n    tags = serializers.SlugRelatedField(\n        slug_field="name", queryset=Tag.objects.all(), many=True,\n    )',
    explanation: '`SlugRelatedField` represents a relation by one unique field instead of the pk. `slug_field` names that field; `queryset` lets it resolve an inbound value back to a row on write. `many=True` handles the M2M.',
    hints: ['The field that maps a relation to a unique non-pk column', 'slug_field names which column'],
    tags: ['django', 'drf', 'relational-field', 'SlugRelatedField', 'cloze'],
    concepts: ['dj-serializer-validation'],
  },
  // cross-field validate(attrs)
  {
    id: 'dj-drf-validate-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Reject a booking whose end is not strictly after its start. Use the hook that sees the whole validated payload, not a single field.',
    template: `class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["id", "start", "end"]

    def ___(self, attrs):
        if attrs["end"] <= attrs["start"]:
            raise serializers.ValidationError("end must be after start")
        return attrs`,
    blanks: ['validate'],
    solution: 'class BookingSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Booking\n        fields = ["id", "start", "end"]\n\n    def validate(self, attrs):\n        if attrs["end"] <= attrs["start"]:\n            raise serializers.ValidationError("end must be after start")\n        return attrs',
    explanation: 'Object-level `validate(self, attrs)` receives the whole validated dict, so it can compare two fields — unlike `validate_<field>(self, value)`, which sees one value. Always `return attrs` (or the mutated dict) on success.',
    hints: ['Object-level hook takes the whole attrs dict', 'Single-field hook is validate_<field> — different signature'],
    tags: ['django', 'drf', 'validate-crossfield', 'cloze'],
    concepts: ['dj-serializer-validation'],
  },
  {
    id: 'dj-drf-validate-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Add cross-field validation to an `EventSerializer` (`ModelSerializer` on `Event`, fields `id`, `start_date`, `end_date`): reject the payload when `end_date` is on or before `start_date`. Use the serializer hook that sees the whole payload (not a single-field one) and raise the DRF validation error.',
    starterCode: `from rest_framework import serializers
from .models import Event
`,
    testCases: [
      { input: 'end_date <= start_date → ValidationError; otherwise passes', expectedOutput: 'validate(self, attrs) comparing the two fields', description: 'Object-level cross-field validation' },
    ],
    solution: `from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "start_date", "end_date"]

    def validate(self, attrs):
        if attrs["end_date"] <= attrs["start_date"]:
            raise serializers.ValidationError("end_date must be after start_date")
        return attrs`,
    explanation: 'Cross-field rules need the object-level `validate(self, attrs)` hook because a `validate_<field>` method only sees its own value. Compare the two fields in `attrs`, raise `serializers.ValidationError` on conflict, and return `attrs` otherwise. The error surfaces as a 400 with a non-field-errors entry.',
    hints: ['validate(self, attrs) — whole payload', 'Compare attrs["end_date"] and attrs["start_date"]', 'Return attrs on success'],
    tags: ['django', 'drf', 'validate-crossfield', 'serializer'],
    concepts: ['dj-serializer-validation'],
  },
  // get_serializer_class
  {
    id: 'dj-drf-getserializer-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    question: 'A ViewSet should return a lightweight serializer for `list` but a detailed one for `retrieve` and writes. What is the idiomatic hook?',
    options: [
      { id: 'a', text: 'Override `get_serializer_class` and branch on `self.action` (or `self.request.method`), returning the serializer class appropriate to the action', isCorrect: true },
      { id: 'b', text: 'Set `serializer_class` to a list of both classes; DRF picks whichever one\'s declared fields match the current action automatically', isCorrect: false },
      { id: 'c', text: 'Override `get_serializer` to return two serializer instances; the router then renders whichever one the client asks for by name', isCorrect: false },
      { id: 'd', text: 'Declare `list_serializer_class` and `detail_serializer_class` attributes — DRF reads the matching one for each action by convention', isCorrect: false },
    ],
    explanation: '`get_serializer_class(self)` is the documented hook; it is called per request, so you can branch on `self.action` ("list"/"retrieve"/"create"/...) or `self.request.method`. `serializer_class` is a single class, not a list; `list_serializer_class`/`detail_serializer_class` are not real DRF attributes; `get_serializer` builds an instance from whatever `get_serializer_class` returns, so the dispatch belongs in the latter.',
    hints: ['Override get_serializer_class, return a class', 'Branch on self.action or self.request.method', 'serializer_class is one class, not a list'],
    tags: ['django', 'drf', 'get-serializer-class', 'viewset'],
    concepts: ['dj-view-patterns'],
  },
  {
    id: 'dj-drf-getserializer-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Return a compact serializer for the list action and a detailed one for everything else, via the per-request hook.',
    template: `class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()

    def ___(self):
        if self.___ == "list":
            return ArticleListSerializer
        return ArticleDetailSerializer`,
    blanks: ['get_serializer_class', 'action'],
    solution: 'class ArticleViewSet(viewsets.ModelViewSet):\n    queryset = Article.objects.all()\n\n    def get_serializer_class(self):\n        if self.action == "list":\n            return ArticleListSerializer\n        return ArticleDetailSerializer',
    explanation: '`get_serializer_class` is resolved per request, so `self.action` is set (router maps the URL+method to "list"/"retrieve"/"create"/...). Return the class — DRF instantiates it with the right context for you.',
    hints: ['The hook returns a class, not an instance', 'self.action holds the current viewset action'],
    tags: ['django', 'drf', 'get-serializer-class', 'cloze'],
    concepts: ['dj-view-patterns'],
  },
  {
    id: 'dj-drf-getserializer-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Build an `ArticleViewSet` (`ModelViewSet`) that serializes with a compact `ArticleListSerializer` on the list action and a richer `ArticleDetailSerializer` for every other action (retrieve, create, update, destroy). Assume both serializers already exist; choose per action via the documented hook.',
    starterCode: `from rest_framework import viewsets
from .models import Article
from .serializers import ArticleListSerializer, ArticleDetailSerializer
`,
    testCases: [
      { input: 'list action uses ArticleListSerializer; others use ArticleDetailSerializer', expectedOutput: 'get_serializer_class branching on self.action', description: 'Per-action serializer selection' },
    ],
    solution: `from rest_framework import viewsets
from .models import Article
from .serializers import ArticleListSerializer, ArticleDetailSerializer


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return ArticleListSerializer
        return ArticleDetailSerializer`,
    explanation: 'Override `get_serializer_class` (not `serializer_class`, which is a single static class) and branch on `self.action`. The router sets `self.action` to "list", "retrieve", "create", "update", "partial_update", or "destroy", so a compact list payload and a detailed single-object payload can coexist in one viewset.',
    hints: ['Override get_serializer_class, return the class', 'self.action == "list" is the cheap-payload branch', 'Everything else gets the detailed serializer'],
    tags: ['django', 'drf', 'get-serializer-class', 'viewset'],
    concepts: ['dj-view-patterns'],
  },
  // throttling
  {
    id: 'dj-drf-throttle-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    question: 'What do `AnonRateThrottle` and `UserRateThrottle` do, and where are their limits configured?',
    options: [
      { id: 'a', text: 'They cap request rate per anonymous IP and per authenticated user respectively; the limits come from `DEFAULT_THROTTLE_RATES` (e.g. `{"anon": "100/day", "user": "1000/day"}`)', isCorrect: true },
      { id: 'b', text: 'They reject requests once the database connection pool is exhausted; the ceiling is read from the `CONN_MAX_AGE` setting in the database config', isCorrect: false },
      { id: 'c', text: 'They cap the response payload size for anonymous versus authenticated clients; the byte limits are set per serializer via a `max_size` Meta option', isCorrect: false },
      { id: 'd', text: 'They transparently retry throttled requests after a backoff delay; the wait between retries is read from the `DEFAULT_THROTTLE_RATES` mapping', isCorrect: false },
    ],
    explanation: 'Throttles limit request *rate*. `AnonRateThrottle` keys on client IP (for unauthenticated requests); `UserRateThrottle` keys on the user id. Rates live in `REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]` as `"<scope>": "<num>/<period>"` and the counters are stored in the cache. Enable globally with `DEFAULT_THROTTLE_CLASSES` or per-view with `throttle_classes`. Over-limit requests get 429 Too Many Requests — there is no automatic retry.',
    hints: ['Per-IP (anon) vs per-user rate caps', 'Rates in DEFAULT_THROTTLE_RATES as "num/period"', 'Over-limit → 429, counters in the cache'],
    tags: ['django', 'drf', 'throttling'],
    concepts: ['dj-permission-class'],
  },
  {
    id: 'dj-drf-throttle-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_REST,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Apply anonymous + per-user rate limits to one viewset, with the rates set in settings.',
    template: `# settings.py
REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_RATES": {"anon": "100/day", "user": "1000/day"},
}

# views.py
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle

class ArticleViewSet(viewsets.ModelViewSet):
    ___ = [AnonRateThrottle, UserRateThrottle]`,
    blanks: ['throttle_classes'],
    solution: '# settings.py\nREST_FRAMEWORK = {\n    "DEFAULT_THROTTLE_RATES": {"anon": "100/day", "user": "1000/day"},\n}\n\n# views.py\nfrom rest_framework.throttling import AnonRateThrottle, UserRateThrottle\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    throttle_classes = [AnonRateThrottle, UserRateThrottle]',
    explanation: 'The view attribute that lists throttle classes mirrors `permission_classes`. The named scopes ("anon"/"user") resolve to entries in `DEFAULT_THROTTLE_RATES`. Set `DEFAULT_THROTTLE_CLASSES` in settings to apply the same limits project-wide.',
    hints: ['The view attribute mirrors permission_classes', 'Scopes map to DEFAULT_THROTTLE_RATES keys'],
    tags: ['django', 'drf', 'throttling', 'cloze'],
    concepts: ['dj-permission-class'],
  },
];
