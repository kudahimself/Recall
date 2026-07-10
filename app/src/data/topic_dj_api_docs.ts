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
      question: 'Set up drf-spectacular for automatic OpenAPI/Swagger docs. Show the INSTALLED_APPS addition, DEFAULT_SCHEMA_CLASS configuration in REST_FRAMEWORK settings, and URL patterns for the schema endpoint and Swagger UI.',
      starterCode: `# settings.py additions\n\n\n# urls.py\n`,
      testCases: [
        {
          input: 'drf-spectacular configuration',
          expectedOutput: 'INSTALLED_APPS, DEFAULT_SCHEMA_CLASS, SpectacularAPIView, SpectacularSwaggerView URLs',
          description: 'Should configure drf-spectacular with schema and Swagger UI endpoints',
        },
      ],
      solution: `# settings.py\nINSTALLED_APPS = [\n    # ... other apps\n    \"drf_spectacular\",\n]\n\nREST_FRAMEWORK = {\n    \"DEFAULT_SCHEMA_CLASS\": \"drf_spectacular.openapi.AutoSchema\",\n}\n\nSPECTACULAR_SETTINGS = {\n    \"TITLE\": \"My Project API\",\n    \"DESCRIPTION\": \"API documentation for My Project\",\n    \"VERSION\": \"1.0.0\",\n}\n\n\n# urls.py\nfrom django.urls import path\nfrom drf_spectacular.views import (\n    SpectacularAPIView,\n    SpectacularSwaggerView,\n    SpectacularRedocView,\n)\n\nurlpatterns = [\n    # Schema endpoint (raw OpenAPI JSON/YAML)\n    path(\"api/schema/\", SpectacularAPIView.as_view(), name=\"schema\"),\n    # Swagger UI (interactive)\n    path(\"api/docs/\", SpectacularSwaggerView.as_view(url_name=\"schema\"), name=\"swagger-ui\"),\n    # Redoc (read-only, clean)\n    path(\"api/redoc/\", SpectacularRedocView.as_view(url_name=\"schema\"), name=\"redoc\"),\n]`,
      explanation: 'drf-spectacular auto-generates an OpenAPI 3.0 schema by inspecting your serializers, views, and URL patterns. DEFAULT_SCHEMA_CLASS tells DRF to use drf-spectacular instead of the built-in schema generator. SpectacularAPIView serves the raw schema (used by tools and client generators). SpectacularSwaggerView renders an interactive UI where you can try API calls. SpectacularRedocView renders clean, read-only documentation. The schema updates automatically as you change your code -- no manual docs to maintain.',
      hints: [
        'Add drf_spectacular to INSTALLED_APPS',
        'Set DEFAULT_SCHEMA_CLASS to use drf-spectacular AutoSchema',
        'SpectacularSwaggerView needs url_name="schema" to find the schema endpoint',
      ],
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
    // 3. Coding: @extend_schema decorator
  {
      id: 'celery-drf-20',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_API_DOCS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use the @extend_schema decorator from drf-spectacular to customize endpoint documentation. Add a description, specify request/response types, provide examples, and add tags. Show it on a ViewSet action method.',
      starterCode: `# views.py\nfrom rest_framework import viewsets, status\nfrom rest_framework.decorators import action\nfrom rest_framework.response import Response\n\n# Add @extend_schema to customize docs\n`,
      testCases: [
        {
          input: '@extend_schema decorator on a ViewSet action',
          expectedOutput: 'extend_schema with description, request, responses, examples, tags',
          description: 'Should customize API documentation with extend_schema',
        },
      ],
      solution: `# views.py\nfrom rest_framework import viewsets, status\nfrom rest_framework.decorators import action\nfrom rest_framework.response import Response\nfrom drf_spectacular.utils import extend_schema, OpenApiExample\nfrom .models import Article\nfrom .serializers import ArticleSerializer\n\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n\n    @extend_schema(\n        description=\"Publish an article. Changes status from 'draft' to 'published' and sets publish_date.\",\n        request=None,  # No request body needed\n        responses={200: ArticleSerializer},\n        examples=[\n            OpenApiExample(\n                \"Published article\",\n                value={\"id\": 1, \"title\": \"My Post\", \"status\": \"published\"},\n                response_only=True,\n            ),\n        ],\n        tags=[\"articles\"],\n    )\n    @action(detail=True, methods=[\"post\"])\n    def publish(self, request, pk=None):\n        \"\"\"Publish a draft article.\"\"\"\n        article = self.get_object()\n        article.status = \"published\"\n        article.save()\n        return Response(ArticleSerializer(article).data)`,
      explanation: '@extend_schema gives you fine-grained control over how an endpoint appears in the generated docs. description overrides the docstring. request=None tells the schema this endpoint has no request body. responses={200: Serializer} documents the response shape. OpenApiExample provides concrete examples that show up in Swagger UI. tags group endpoints into sections. This is essential for custom actions because drf-spectacular cannot always infer the correct schema from @action methods -- the decorator fills in the gaps.',
      hints: [
        'Import extend_schema and OpenApiExample from drf_spectacular.utils',
        'request=None means no request body is expected',
        'responses={status_code: Serializer} documents what the endpoint returns',
      ],
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
];
