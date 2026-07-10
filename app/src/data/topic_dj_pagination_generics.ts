/**
 * Topic.DJ_PAGINATION_GENERICS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   celeryDrfQuestions.ts (6), djangoGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_pagination_generics_questions: Question[] = [
    // 1. Coding: Set up DRF pagination
    // 2. Coding: ListCreateAPIView and RetrieveUpdateDestroyAPIView
  {
      id: 'celery-drf-13',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_PAGINATION_GENERICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use ListCreateAPIView and RetrieveUpdateDestroyAPIView instead of ModelViewSet. Show both views with queryset and serializer_class, and the URL patterns that map them. Explain when you would choose these over ModelViewSet.',
      starterCode: `# views.py\nfrom rest_framework import generics\n\n# Define two generic views for Article\n\n\n# urls.py\n`,
      testCases: [
        {
          input: 'Generic views and URL patterns',
          expectedOutput: 'ListCreateAPIView, RetrieveUpdateDestroyAPIView, urlpatterns',
          description: 'Should define generic views and map them to URLs',
        },
      ],
      solution: `# views.py\nfrom rest_framework import generics\nfrom .models import Article\nfrom .serializers import ArticleSerializer\n\n\nclass ArticleListCreateView(generics.ListCreateAPIView):\n    \"\"\"GET /articles/ (list) and POST /articles/ (create).\"\"\"\n    queryset = Article.objects.all().order_by(\"-created_at\")\n    serializer_class = ArticleSerializer\n\n\nclass ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):\n    \"\"\"GET/PUT/PATCH/DELETE /articles/<pk>/.\"\"\"\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n\n\n# urls.py\nfrom django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path(\"articles/\", views.ArticleListCreateView.as_view(), name=\"article-list\"),\n    path(\"articles/<int:pk>/\", views.ArticleDetailView.as_view(), name=\"article-detail\"),\n]`,
      explanation: 'Generic views are more explicit than ModelViewSet -- each class handles specific HTTP methods, making the code easier to reason about. ListCreateAPIView = GET (list) + POST (create). RetrieveUpdateDestroyAPIView = GET (detail) + PUT/PATCH (update) + DELETE. Use generics when: (1) You need different permissions/serializers for list vs detail. (2) You want explicit URL patterns instead of router magic. (3) You only need partial CRUD (e.g., read-only list + create, no update/delete). Use ModelViewSet when you need full CRUD with minimal code.',
      hints: [
        'ListCreateAPIView = list + create (collection endpoint)',
        'RetrieveUpdateDestroyAPIView = get + update + delete (detail endpoint)',
        'Generic views use path() in urls.py instead of router.register()',
      ],
      tags: ['drf', 'generic-views', 'urls', 'rest-framework', 'api-design'],
      concepts: ['dj-view-patterns'],
    },
    // 3. MC: PageNumberPagination vs CursorPagination
  {
      id: 'celery-drf-14',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_PAGINATION_GENERICS,
      course: Course.BACKEND,
      question: 'What is the difference between PageNumberPagination and CursorPagination in DRF?',
      options: [
        { id: 'a', text: 'PageNumberPagination only works on SQL databases, while CursorPagination was designed for NoSQL stores without OFFSET support', isCorrect: false },
        { id: 'b', text: 'Page numbers use SQL OFFSET -- simple but slow for deep pages; cursors use an opaque token with O(1) seeks but cannot jump to an arbitrary page', isCorrect: true },
        { id: 'c', text: 'CursorPagination is always faster, so DRF uses it by default and PageNumberPagination exists only for backwards compatibility', isCorrect: false },
        { id: 'd', text: 'They generate identical SQL queries -- the only difference is the JSON shape of the next and previous links in the response body', isCorrect: false },
      ],
      explanation: 'PageNumberPagination uses SQL OFFSET which means the database must scan and discard all previous rows -- page 1000 with PAGE_SIZE=20 scans 20,000 rows. CursorPagination uses WHERE id > last_seen_id LIMIT 20 which is O(1) regardless of position because it uses an index seek. The trade-off: cursor pagination only supports next/previous navigation (no random page access), and it requires a stable, unique ordering field. Use page numbers for admin interfaces where dataset is small. Use cursors for public APIs with large datasets (social feeds, logs).',
      tags: ['drf', 'pagination', 'cursor', 'performance', 'offset'],
      concepts: ['dj-pagination-strategy'],
    },
    // 4. MC: Generic views vs ModelViewSet vs APIView
    // 5. Coding: Custom pagination class
  {
      id: 'celery-drf-16',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_PAGINATION_GENERICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a custom pagination class that returns total_pages and has_next/has_previous in the response. Extend PageNumberPagination and override get_paginated_response to include these fields.',
      starterCode: `# pagination.py\nfrom rest_framework.pagination import PageNumberPagination\nfrom rest_framework.response import Response\n\n# Create a custom pagination class\n`,
      testCases: [
        {
          input: 'Custom pagination class',
          expectedOutput: 'Extends PageNumberPagination, get_paginated_response with total_pages, has_next, has_previous',
          description: 'Should create custom pagination with extra metadata',
        },
      ],
      solution: `# pagination.py\nimport math\nfrom rest_framework.pagination import PageNumberPagination\nfrom rest_framework.response import Response\n\n\nclass CustomPagination(PageNumberPagination):\n    page_size = 20\n    page_size_query_param = \"page_size\"  # Allow client to set ?page_size=50\n    max_page_size = 100\n\n    def get_paginated_response(self, data):\n        total_pages = math.ceil(self.page.paginator.count / self.get_page_size(self.request))\n        return Response({\n            \"count\": self.page.paginator.count,\n            \"total_pages\": total_pages,\n            \"current_page\": self.page.number,\n            \"has_next\": self.page.has_next(),\n            \"has_previous\": self.page.has_previous(),\n            \"next\": self.get_next_link(),\n            \"previous\": self.get_previous_link(),\n            \"results\": data,\n        })\n\n\n# Usage in a view:\n# class ArticleViewSet(viewsets.ModelViewSet):\n#     pagination_class = CustomPagination`,
      explanation: 'Extending PageNumberPagination lets you customize the response format while keeping all the pagination logic. self.page is a Django Page object with .paginator.count (total items), .number (current page), .has_next()/.has_previous(). page_size_query_param lets clients request different page sizes (?page_size=50), and max_page_size prevents abuse. This is useful because frontend pagination components typically need total_pages to render page numbers, and has_next/has_previous for enabling/disabling navigation buttons.',
      hints: [
        'self.page.paginator.count gives total number of items',
        'self.page.has_next() and self.page.has_previous() are boolean methods',
        'math.ceil(total / page_size) calculates total pages',
      ],
      tags: ['drf', 'pagination', 'custom-pagination', 'rest-framework'],
      concepts: ['dj-pagination-strategy'],
    },
    // 6. MC: get_queryset() vs queryset attribute
  {
      id: 'celery-drf-17',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_PAGINATION_GENERICS,
      course: Course.BACKEND,
      question: 'What is the difference between get_queryset() method and queryset attribute in a DRF generic view?',
      options: [
        { id: 'a', text: 'They are interchangeable -- get_queryset() simply returns the queryset attribute, so overriding either one has the same effect', isCorrect: false },
        { id: 'b', text: 'The queryset attribute is used for read operations while get_queryset() is only called for create, update, and delete requests', isCorrect: false },
        { id: 'c', text: 'Only ModelViewSet reads the queryset attribute -- generic views like ListAPIView require you to override get_queryset() instead', isCorrect: false },
        { id: 'd', text: 'queryset is static, evaluated once at class load; get_queryset() runs per request -- use it for dynamic filtering like self.request.user', isCorrect: true },
      ],
      explanation: 'queryset = Article.objects.all() is evaluated when the class is loaded (server start). This is fine for static querysets. But if you need to filter by the current user (self.request.user.articles.all()), URL parameters (self.kwargs["category_id"]), or query params (self.request.query_params["status"]), you must override get_queryset() because self.request is only available per-request. Common pattern: def get_queryset(self): return Article.objects.filter(author=self.request.user) -- this ensures each user only sees their own articles.',
      tags: ['drf', 'queryset', 'get_queryset', 'dynamic-filtering', 'generic-views'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'dj-pagination-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_PAGINATION_GENERICS,
      course: Course.BACKEND,
      question: 'What is API pagination and why is it needed?\n\nImagine your database has 1 million products. A client requests GET /api/products/ and your server tries to serialize and return all 1 million rows at once.',
      options: [
        {
          id: 'a',
          text: 'A security feature that limits which authenticated users can access which pages or routes of the application',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'A database indexing technique that partitions large tables so queries scan fewer rows and return results faster',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'A caching strategy that pre-loads the next page of results into memory before the user actually requests it',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Splitting large result sets into smaller pages so clients fetch one chunk at a time instead of one huge, slow response',
          isCorrect: true,
        },
      ],
      explanation: 'Without pagination, returning 1 million rows would: (1) make the database query very slow, (2) use huge amounts of server memory to serialize the data, (3) send a massive JSON response over the network, and (4) likely crash the client trying to parse it. Pagination solves this by returning small chunks (e.g., 20 items per page) with metadata like "next page" links. The client requests additional pages as needed.',
      hints: [
        'Think about what happens when you send 1 million JSON objects in one response',
        'Most APIs default to 10-100 items per page',
      ],
      tags: ['django', 'drf', 'pagination', 'api-design', 'basics'],
      concepts: ['dj-pagination-strategy'],
    },
  {
      id: 'dj-pagination-gap-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_PAGINATION_GENERICS,
      course: Course.BACKEND,
      question: 'What are DRF generic views?\n\nWhen building a REST API, you write the same patterns repeatedly: get all objects, create one, retrieve one by ID, update, delete. DRF provides shortcuts.',
      options: [
        {
          id: 'a',
          text: 'Pre-built view classes (ListAPIView, CreateAPIView, RetrieveAPIView...) that combine queryset + serializer + method handling for standard CRUD',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'A code generator that scans models.py and writes the matching views.py and serializers.py files when you run a management command',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Abstract base classes that cannot be used directly — every project must subclass them and override each HTTP method handler by hand',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Django\'s template-based class views repurposed to return JSON instead of HTML by swapping the template engine for a serializer',
          isCorrect: false,
        },
      ],
      explanation: 'DRF generic views are pre-built classes that handle common API patterns. For example, ListAPIView only needs queryset and serializer_class — it handles GET requests, serialization, pagination, and filtering automatically. CreateAPIView handles POST with validation. You can combine them: ListCreateAPIView handles both GET (list) and POST (create). This reduces a 20-line APIView to 3-4 lines while keeping the same functionality.',
      hints: [
        'Generic views need just queryset and serializer_class to work',
        'ListCreateAPIView = ListAPIView + CreateAPIView in one class',
      ],
      tags: ['django', 'drf', 'generic-views', 'crud', 'basics'],
      concepts: ['dj-view-patterns'],
    },
  {
    id: 'dj-pagination-generics-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DJ_PAGINATION_GENERICS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Complete this generic API view to list all articles, ordered by created_at, using DRF generic views.',
    template: `from rest_framework import generics
from .models import Article
from .serializers import ArticleSerializer

class ArticleListView(generics.___):
    queryset = Article.objects.all().order_by("-created_at")
    serializer_class = ___`,
    blanks: ['ListAPIView', 'ArticleSerializer'],
    solution: `from rest_framework import generics
from .models import Article
from .serializers import ArticleSerializer

class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.all().order_by("-created_at")
    serializer_class = ArticleSerializer`,
    explanation: '`generics.ListAPIView` is the standard generic view for a read-only list endpoint. You only need to define `queryset` and `serializer_class` attributes.',
    hints: [
      'Use ListAPIView for listing models',
      'Assign the serializer class to serializer_class',
    ],
    tags: ['drf', 'generic-views', 'queryset', 'cloze'],
    concepts: ['dj-view-patterns'],
  },
];
