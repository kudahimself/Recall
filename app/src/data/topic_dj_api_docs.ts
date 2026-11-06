/**
 * Topic.DJ_API_DOCS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   celeryDrfQuestions.ts (4)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_api_docs_questions: Question[] = [
    // 1. Coding: Set up drf-spectacular
  {
      id: 'celery-drf-18',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_API_DOCS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Set up drf-spectacular. In settings.py, add it to `INSTALLED_APPS` and make its `AutoSchema` the `DEFAULT_SCHEMA_CLASS` in `REST_FRAMEWORK`. In urls.py, serve the raw OpenAPI schema at `api/schema/` with the URL name `schema`, the Swagger UI page at `api/docs/` (named `swagger-ui`) and the Redoc page at `api/redoc/` (named `redoc`), both pages reading that schema.',
      starterCode: `# settings.py additions\n\n\n# urls.py\n`,
      testCases: [
        {
          input: 'drf-spectacular configuration',
          expectedOutput: 'INSTALLED_APPS, DEFAULT_SCHEMA_CLASS, SpectacularAPIView, SpectacularSwaggerView URLs',
          description: 'Should configure drf-spectacular with schema and Swagger UI endpoints',
        },
      ],
      solution: `# settings.py\nINSTALLED_APPS = [\n    # ... other apps\n    "drf_spectacular",\n]\n\nREST_FRAMEWORK = {\n    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",\n}\n\n\n# urls.py\nfrom django.urls import path\nfrom drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView\n\nurlpatterns = [\n    # Schema endpoint (raw OpenAPI JSON/YAML)\n    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),\n    # Swagger UI (interactive)\n    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),\n    # Redoc (read-only, clean)\n    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),\n]`,
      explanation: 'drf-spectacular auto-generates an OpenAPI 3.0 schema by inspecting your serializers, views, and URL patterns. DEFAULT_SCHEMA_CLASS tells DRF to use drf-spectacular instead of the built-in schema generator. SpectacularAPIView serves the raw schema (used by tools and client generators). SpectacularSwaggerView renders an interactive UI where you can try API calls. SpectacularRedocView renders clean, read-only documentation. Both pages take url_name="schema", the name of the schema route, so they know where to fetch the schema. The schema updates automatically as you change your code -- no manual docs to maintain. An optional SPECTACULAR_SETTINGS dict sets the title, description and version shown at the top of the docs.',
      hints: [
        'Add drf_spectacular to INSTALLED_APPS',
        'Set DEFAULT_SCHEMA_CLASS to use drf-spectacular AutoSchema',
        'SpectacularSwaggerView needs url_name="schema" to find the schema endpoint',
      ],
      tieredHints: {
        apiSignature: 'SpectacularSwaggerView.as_view(url_name="schema", **kwargs)',
        skeleton: `# settings.py
INSTALLED_APPS = [
    # ... other apps
    "____",
]

REST_FRAMEWORK = {
    "____": "drf_spectacular.openapi.AutoSchema",
}


# urls.py
from django.urls import path
from drf_spectacular.views import ____, ____, ____

urlpatterns = [
    path("api/schema/", ____.as_view(), name="schema"),
    path("api/docs/", ____.as_view(url_name="____"), name="swagger-ui"),
    path("api/redoc/", ____.as_view(url_name="____"), name="redoc"),
]`,
      },
      tags: ['drf-spectacular', 'openapi', 'swagger', 'api-docs', 'configuration'],
      concepts: ['dj-api-docs'],
    },
    // 2. MC: OpenAPI vs Swagger vs Redoc
  {
      id: 'celery-drf-19',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_API_DOCS,
      course: Course.BACKEND,
      question: 'What is the difference between OpenAPI, Swagger, and Redoc?',
      options: [
        { id: 'a', text: 'OpenAPI is the spec describing APIs; Swagger UI is an interactive explorer for that spec; Redoc renders the same spec as clean read-only docs', isCorrect: true },
        { id: 'b', text: 'Three competing documentation standards -- a project must pick one format because their schema files are mutually incompatible', isCorrect: false },
        { id: 'c', text: 'OpenAPI replaced both Swagger and Redoc -- modern DRF projects generate OpenAPI docs without needing either of the older tools', isCorrect: false },
        { id: 'd', text: 'Swagger documents REST APIs, Redoc documents GraphQL schemas, and OpenAPI is the umbrella format that covers both protocols', isCorrect: false },
      ],
      explanation: 'OpenAPI (formerly Swagger Spec) is a JSON/YAML specification that describes your API: endpoints, request/response schemas, authentication, etc. Swagger UI renders that spec as an interactive page where developers can send real requests. Redoc renders the same spec as clean, readable documentation (better for sharing with non-developers). drf-spectacular inspects your Django code and generates the OpenAPI schema automatically. Clients can also use the schema to auto-generate SDKs (e.g., openapi-generator creates TypeScript/Python clients from your schema).',
      tags: ['openapi', 'swagger', 'redoc', 'api-documentation', 'standards'],
      concepts: ['dj-api-docs'],
    },
  {
      id: 'dj-api-docs-extendschema-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_API_DOCS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the drf-spectacular decorator that customizes this action\'s generated docs, and its keyword argument that maps a status code to the response serializer (the decorator\'s import from `drf_spectacular.utils` is left out so it does not give the answer away).',
      template: `@___(
    description="Publish an article.",
    ___={200: ArticleSerializer},
)
@action(detail=True, methods=["post"])
def publish(self, request, pk=None):
    ...`,
      blanks: ['extend_schema', 'responses'],
      solution: '@extend_schema(\n    description="Publish an article.",\n    responses={200: ArticleSerializer},\n)\n@action(detail=True, methods=["post"])\ndef publish(self, request, pk=None):\n    ...',
      explanation: '`@extend_schema(...)` overrides what drf-spectacular infers for one endpoint. `description` overrides the docstring; `responses={status_code: Serializer}` documents the response shape per status code - essential for `@action` methods, which are otherwise documented with the viewset\'s own serializer even when they return something else. It is imported with `from drf_spectacular.utils import extend_schema`.',
      hints: ['It extends the schema drf-spectacular generates', 'The plural of the thing an endpoint sends back'],
      tags: ['drf-spectacular', 'extend_schema', 'cloze'],
      concepts: ['dj-api-docs'],
    },
    // 3. Coding: @extend_schema decorator
  {
      id: 'celery-drf-20',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_API_DOCS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: '`Article` has a `status` field, and `ArticleSerializer` in `.serializers` is its `ModelSerializer`. Write `ArticleViewSet`, a `ModelViewSet` over every article, with a `publish` action: a POST to `/articles/<pk>/publish/` sets that article\'s `status` to "published", saves it and returns the serialized article. Document `publish` with drf-spectacular\'s `@extend_schema`: the description "Publish a draft article.", no request body, a 200 response shaped by `ArticleSerializer`, one response-only example named "Published article" whose value is `{"id": 1, "status": "published"}`, and the tag "articles".',
      starterCode: `# views.py\nfrom rest_framework import viewsets\nfrom rest_framework.decorators import action\nfrom rest_framework.response import Response\n\n# Add @extend_schema to customize docs\n`,
      testCases: [
        {
          input: '@extend_schema decorator on a ViewSet action',
          expectedOutput: 'extend_schema with description, request, responses, examples, tags',
          description: 'Should customize API documentation with extend_schema',
        },
      ],
      solution: `# views.py\nfrom rest_framework import viewsets\nfrom rest_framework.decorators import action\nfrom rest_framework.response import Response\nfrom drf_spectacular.utils import extend_schema, OpenApiExample\nfrom .models import Article\nfrom .serializers import ArticleSerializer\n\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n\n    @extend_schema(\n        description="Publish a draft article.",\n        request=None,\n        responses={200: ArticleSerializer},\n        examples=[\n            OpenApiExample(\n                "Published article",\n                value={"id": 1, "status": "published"},\n                response_only=True,\n            ),\n        ],\n        tags=["articles"],\n    )\n    @action(detail=True, methods=["post"])\n    def publish(self, request, pk=None):\n        article = self.get_object()\n        article.status = "published"\n        article.save()\n        return Response(ArticleSerializer(article).data)\n# OR\n# views.py\nfrom rest_framework import viewsets\nfrom rest_framework.decorators import action\nfrom rest_framework.response import Response\nfrom drf_spectacular.utils import extend_schema, OpenApiExample\nfrom .models import Article\nfrom .serializers import ArticleSerializer\n\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n\n    @extend_schema(\n        description="Publish a draft article.",\n        request=None,\n        responses={200: ArticleSerializer},\n        examples=[\n            OpenApiExample(\n                "Published article",\n                value={"id": 1, "status": "published"},\n                response_only=True,\n            ),\n        ],\n        tags=["articles"],\n    )\n    @action(detail=True, methods=["post"])\n    def publish(self, request, pk=None):\n        article = self.get_object()\n        article.status = "published"\n        article.save()\n        return Response(self.get_serializer(article).data)`,
      requires: [/@extend_schema/],
      explanation: '@extend_schema gives you fine-grained control over how an endpoint appears in the generated docs. It goes above @action, so it decorates the finished action. description overrides the docstring. request=None tells the schema this endpoint has no request body. responses={200: Serializer} documents the response shape. OpenApiExample provides concrete examples that show up in Swagger UI. tags group endpoints into sections. This is essential for custom actions because drf-spectacular cannot always infer the correct schema from @action methods -- the decorator fills in the gaps.',
      hints: [
        'Import extend_schema and OpenApiExample from drf_spectacular.utils',
        'request=None means no request body is expected',
        'responses={status_code: Serializer} documents what the endpoint returns',
      ],
      tieredHints: {
        apiSignature: '@extend_schema(operation_id=None, request=None, responses=None, examples=None, tags=None)',
        skeleton: `# views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import ____, ____
from .models import Article
from .serializers import ArticleSerializer


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    @____(
        description="Publish a draft article.",
        request=____,
        responses={200: ArticleSerializer},
        examples=[
            ____(
                "Published article",
                value={"id": 1, "status": "published"},
                response_only=True,
            ),
        ],
        tags=[____],
    )
    @action(detail=True, methods=[____])
    def publish(self, request, pk=None):
        article = self.get_object()
        article.status = "published"
        article.save()
        return Response(ArticleSerializer(article).data)`,
      },
      tags: ['drf-spectacular', 'extend_schema', 'api-docs', 'openapi', 'swagger'],
      concepts: ['dj-api-docs'],
    },
    // 4. MC: Why auto-generated docs are better
  {
      id: 'celery-drf-21',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_API_DOCS,
      course: Course.BACKEND,
      question: 'Why are auto-generated API docs better than manually written documentation?',
      options: [
        { id: 'a', text: 'Auto-generated docs look more professional because Swagger UI ships polished themes that hand-written documentation rarely matches', isCorrect: false },
        { id: 'b', text: 'Manual docs are more accurate because a human reviews every endpoint, while generators guess at types and frequently get them wrong', isCorrect: false },
        { id: 'c', text: 'Auto-generated docs only pay off for small projects -- large APIs overwhelm the generator and the schema becomes unusably slow', isCorrect: false },
        { id: 'd', text: 'They stay in sync with code (types come from serializers) and clients can generate SDKs from the schema; manual docs go stale immediately', isCorrect: true },
      ],
    explanation: 'The biggest problem with manual API docs is drift -- code changes but docs do not get updated. Auto-generated docs solve this because the schema is derived from your actual serializers, views, and URL patterns. When you add a field to a serializer, the docs update automatically. Additionally, the OpenAPI schema enables tooling: frontend teams can generate TypeScript types, mobile teams can generate API clients, and QA can generate test cases -- all from the same source of truth. Use @extend_schema for the 20% of cases where auto-detection is not enough.',
      tags: ['api-docs', 'openapi', 'documentation', 'developer-experience'],
      concepts: ['dj-api-docs'],
    },
  {
    id: 'dj-api-docs-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DJ_API_DOCS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Configure Django settings to use drf-spectacular for OpenAPI generation.',
    template: `INSTALLED_APPS = [
    # ...
    "___",
]

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "___",
}`,
    blanks: ['drf_spectacular', 'drf_spectacular.openapi.AutoSchema'],
    solution: `INSTALLED_APPS = [
    # ...
    "drf_spectacular",
]

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}`,
    explanation: 'To set up `drf-spectacular`, you must register it in `INSTALLED_APPS` and configure the default schema class `drf_spectacular.openapi.AutoSchema` inside the `REST_FRAMEWORK` settings dictionary.',
    hints: [
      'Register drf_spectacular in installed apps',
      'The schema class is AutoSchema from drf_spectacular.openapi',
    ],
    tags: ['drf-spectacular', 'openapi', 'configuration', 'cloze'],
    concepts: ['dj-api-docs'],
  },
  {
    id: 'dj-api-docs-urls-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DJ_API_DOCS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the drf-spectacular views that serve the raw OpenAPI schema and the interactive Swagger UI page (their import from `drf_spectacular.views` is left out so it does not give the answer away).',
    template: `from django.urls import path

urlpatterns = [
    path("api/schema/", ___.as_view(), name="schema"),
    path("api/docs/", ___.as_view(url_name="schema"), name="swagger-ui"),
]`,
    blanks: ['SpectacularAPIView', 'SpectacularSwaggerView'],
    solution: `from django.urls import path\n\nurlpatterns = [\n    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),\n    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),\n]`,
    explanation: '`SpectacularAPIView` serves the raw OpenAPI schema (JSON/YAML) used by tooling and client generators. `SpectacularSwaggerView` renders it as an interactive page -- it needs `url_name="schema"`, the name of the schema route, to know where to fetch the schema from. Both come from `from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView`.',
    hints: ['Spectacular + the kind of view that serves raw data, as in APIView', 'Spectacular + the name of the interactive UI + View'],
    tags: ['drf-spectacular', 'SpectacularAPIView', 'SpectacularSwaggerView', 'urls', 'cloze'],
    concepts: ['dj-api-docs'],
  },
  {
      id: 'dj-api-docs-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_API_DOCS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'drf-spectacular is installed and set as `DEFAULT_SCHEMA_CLASS`, and `BookSerializer` is a `ModelSerializer` for `shop.Book`. The OpenAPI schema is generated straight from these two views and their URLs. What does the loop print? The answer is one line per path, in URL order: a Python list of the lowercase HTTP methods, as `sorted()` prints it.',
      code: `from django.urls import path
from drf_spectacular.generators import SchemaGenerator
from rest_framework import generics

class BookList(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class BookDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

urlpatterns = [
    path("books/", BookList.as_view()),
    path("books/<int:pk>/", BookDetail.as_view()),
]
schema = SchemaGenerator(patterns=urlpatterns).get_schema(request=None, public=True)
for operations in schema["paths"].values():
    print(sorted(operations))`,
      expectedOutput: `['get', 'post']
['delete', 'get', 'patch', 'put']`,
      acceptableOutputs: [`["get", "post"]
["delete", "get", "patch", "put"]`],
      explanation: 'drf-spectacular builds the schema by reading the views, so each path lists one operation per HTTP method its view actually handles. `ListCreateAPIView` handles GET (list) and POST (create). `RetrieveUpdateDestroyAPIView` handles GET (retrieve), PUT and PATCH (full and partial update) and DELETE, so the detail path has four operations. Because the schema comes from the code, adding or removing a method on a view changes the docs with no hand edit.',
      hints: ['The schema has one operation for each method the view class handles.', 'An update view handles both a full and a partial update.'],
      tags: ['django', 'drf', 'drf-spectacular', 'openapi', 'predict'],
      concepts: ['dj-api-docs'],
    },
];
