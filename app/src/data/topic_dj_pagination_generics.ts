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
      question: 'Build the article endpoints with two DRF generic views instead of a `ModelViewSet`. In views.py, `ArticleListCreateView` lists articles (GET) and creates one (POST), and `ArticleDetailView` reads, updates (PUT and PATCH) and deletes one article. Both work on every `Article` row with `ArticleSerializer` (import them from `.models` and `.serializers`). In urls.py, map `articles/` to the first view with the name `article-list`, and `articles/<int:pk>/` to the second with the name `article-detail`.',
      starterCode: `# views.py\nfrom rest_framework import generics\n\n# Define two generic views for Article\n\n\n# urls.py\n`,
      testCases: [
        {
          input: 'Generic views and URL patterns',
          expectedOutput: 'ListCreateAPIView, RetrieveUpdateDestroyAPIView, urlpatterns',
          description: 'Should define generic views and map them to URLs',
        },
      ],
      solution: `# views.py\nfrom rest_framework import generics\nfrom .models import Article\nfrom .serializers import ArticleSerializer\n\n\nclass ArticleListCreateView(generics.ListCreateAPIView):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n\n\nclass ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n\n\n# urls.py\nfrom django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path("articles/", views.ArticleListCreateView.as_view(), name="article-list"),\n    path("articles/<int:pk>/", views.ArticleDetailView.as_view(), name="article-detail"),\n]\n# OR\n# views.py\nfrom rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView\nfrom .models import Article\nfrom .serializers import ArticleSerializer\n\n\nclass ArticleListCreateView(ListCreateAPIView):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n\n\nclass ArticleDetailView(RetrieveUpdateDestroyAPIView):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n\n\n# urls.py\nfrom django.urls import path\nfrom .views import ArticleListCreateView, ArticleDetailView\n\nurlpatterns = [\n    path("articles/", ArticleListCreateView.as_view(), name="article-list"),\n    path("articles/<int:pk>/", ArticleDetailView.as_view(), name="article-detail"),\n]`,
      explanation: 'Generic views are more explicit than ModelViewSet -- each class handles specific HTTP methods, making the code easier to reason about. ListCreateAPIView = GET (list) + POST (create). RetrieveUpdateDestroyAPIView = GET (detail) + PUT/PATCH (update) + DELETE, finding the row by the `pk` the URL captures. Each class is wired with `path(..., View.as_view())` instead of a router. Use generics when: (1) You need different permissions/serializers for list vs detail. (2) You want explicit URL patterns instead of router magic. (3) You only need partial CRUD (e.g., read-only list + create, no update/delete). Use ModelViewSet when you need full CRUD with minimal code.',
      hints: [
        'ListCreateAPIView = list + create (collection endpoint)',
        'RetrieveUpdateDestroyAPIView = get + update + delete (detail endpoint)',
        'Generic views use path() in urls.py instead of router.register()',
      ],
      tieredHints: {
        apiSignature: 'generics.ListCreateAPIView; generics.RetrieveUpdateDestroyAPIView; GenericView.as_view()',
        skeleton: '# views.py\nfrom rest_framework import generics\nfrom .models import Article\nfrom .serializers import ArticleSerializer\n\n\nclass ArticleListCreateView(generics.____):\n    queryset = Article.objects.____()\n    serializer_class = ____\n\n\nclass ArticleDetailView(generics.____):\n    queryset = Article.objects.all()\n    serializer_class = ____\n\n\n# urls.py\nfrom django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path("articles/", views.ArticleListCreateView.____(), name="article-list"),\n    path("articles/<int:pk>/", views.ArticleDetailView.____(), name="article-detail"),\n]',
      },
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
        { id: 'b', text: 'Page numbers use SQL OFFSET -- simple but slow for deep pages; cursors seek past an opaque position, fast at any depth but unable to jump to page N', isCorrect: true },
        { id: 'c', text: 'CursorPagination is always faster, so DRF uses it by default and PageNumberPagination exists only for backwards compatibility', isCorrect: false },
        { id: 'd', text: 'They generate identical SQL queries -- the only difference is the JSON shape of the next and previous links in the response body', isCorrect: false },
      ],
      explanation: 'PageNumberPagination uses SQL OFFSET which means the database must scan and discard all previous rows -- page 1000 with PAGE_SIZE=20 scans 20,000 rows. CursorPagination encodes the position of the last row it sent into the cursor and asks for the next rows past it on the ordering field (by default `created`, newest first), something like WHERE created < last_seen LIMIT 20. With an index on that field the database seeks straight to the position, so page 1000 costs about the same as page 1. The trade-off: cursor pagination only supports next/previous navigation (no random page access), and it requires a stable, unique ordering field. Use page numbers for admin interfaces where dataset is small. Use cursors for public APIs with large datasets (social feeds, logs).',
      tags: ['drf', 'pagination', 'cursor', 'performance', 'offset'],
      concepts: ['dj-pagination-strategy'],
    },
    // 4. MC: Generic views vs ModelViewSet vs APIView
    // 5. Coding: Custom pagination class
  {
      id: 'dj-pagination-custom-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_PAGINATION_GENERICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the DRF pagination class that reads `?page=N`, which this class extends, and the hook it overrides to reshape the paginated response.',
      template: `from rest_framework import pagination
from rest_framework.response import Response

class CustomPagination(pagination.___):
    page_size = 20

    def ___(self, data):
        return Response({
            "count": self.page.paginator.count,
            "has_next": self.page.has_next(),
            "results": data,
        })`,
      blanks: ['PageNumberPagination', 'get_paginated_response'],
      solution: 'from rest_framework import pagination\nfrom rest_framework.response import Response\n\nclass CustomPagination(pagination.PageNumberPagination):\n    page_size = 20\n\n    def get_paginated_response(self, data):\n        return Response({\n            "count": self.page.paginator.count,\n            "has_next": self.page.has_next(),\n            "results": data,\n        })',
      explanation: 'Subclass `PageNumberPagination`, the style that reads `?page=N`, and override `get_paginated_response(self, data)` to control the exact shape of the paginated JSON. `data` is the serialized rows of the current page. `self.page` is the underlying Django `Page` object - `.paginator.count` is the total row count, `.has_next()`/`.has_previous()` are booleans. Attach the class to a view via `pagination_class = CustomPagination`.',
      hints: ['The page-number style, as opposed to LimitOffsetPagination or CursorPagination', 'Method that builds the final Response from the page of serialized rows'],
      tags: ['drf', 'pagination', 'PageNumberPagination', 'cloze'],
      concepts: ['dj-pagination-strategy'],
    },
  {
      id: 'celery-drf-16',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_PAGINATION_GENERICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'In pagination.py, write `CustomPagination`, a `PageNumberPagination` subclass that sends 20 rows per page and lets the client pick another size with `?page_size=N`, up to 100. Override `get_paginated_response` so the JSON has exactly these keys: `count` (all rows), `total_pages`, `current_page` (the page number), `has_next`, `has_previous`, `next` and `previous` (the two links), and `results`.',
      starterCode: `# pagination.py\nfrom rest_framework.pagination import PageNumberPagination\nfrom rest_framework.response import Response\n\n# Create a custom pagination class\n`,
      testCases: [
        {
          input: 'Custom pagination class',
          expectedOutput: 'Extends PageNumberPagination, get_paginated_response with total_pages, has_next, has_previous',
          description: 'Should create custom pagination with extra metadata',
        },
      ],
      solution: `# pagination.py\nfrom rest_framework.pagination import PageNumberPagination\nfrom rest_framework.response import Response\n\n\nclass CustomPagination(PageNumberPagination):\n    page_size = 20\n    page_size_query_param = "page_size"\n    max_page_size = 100\n\n    def get_paginated_response(self, data):\n        return Response({\n            "count": self.page.paginator.count,\n            "total_pages": self.page.paginator.num_pages,\n            "current_page": self.page.number,\n            "has_next": self.page.has_next(),\n            "has_previous": self.page.has_previous(),\n            "next": self.get_next_link(),\n            "previous": self.get_previous_link(),\n            "results": data,\n        })\n# OR\n# pagination.py\nimport math\nfrom rest_framework.pagination import PageNumberPagination\nfrom rest_framework.response import Response\n\n\nclass CustomPagination(PageNumberPagination):\n    page_size = 20\n    page_size_query_param = "page_size"\n    max_page_size = 100\n\n    def get_paginated_response(self, data):\n        total_pages = math.ceil(self.page.paginator.count / self.get_page_size(self.request))\n        return Response({\n            "count": self.page.paginator.count,\n            "total_pages": total_pages,\n            "current_page": self.page.number,\n            "has_next": self.page.has_next(),\n            "has_previous": self.page.has_previous(),\n            "next": self.get_next_link(),\n            "previous": self.get_previous_link(),\n            "results": data,\n        })`,
      explanation: 'Extending PageNumberPagination lets you customize the response format while keeping all the pagination logic. self.page is a Django Page object with .paginator.count (total items), .paginator.num_pages (total pages), .number (current page), .has_next()/.has_previous(). get_next_link()/get_previous_link() build the full links, or None at either end. page_size_query_param lets clients request different page sizes (?page_size=50), and max_page_size caps what they can ask for. Working out math.ceil(count / page size) yourself gives the same total_pages, except for an empty list, where num_pages still reports the one empty page 1. Frontend pagination components typically need total_pages to render page numbers, and has_next/has_previous for enabling/disabling navigation buttons. Attach the class to a view with pagination_class = CustomPagination.',
      hints: [
        'self.page.paginator.count gives total number of items',
        'self.page.has_next() and self.page.has_previous() are boolean methods',
        'The Page object\'s paginator also knows how many pages there are',
      ],
      tieredHints: {
        apiSignature: 'PageNumberPagination.get_paginated_response(data: list) -> Response',
        skeleton: '# pagination.py\nfrom rest_framework.pagination import ____\nfrom rest_framework.response import ____\n\n\nclass CustomPagination(____):\n    page_size = 20\n    ____ = "page_size"\n    ____ = 100\n\n    def ____(self, data):\n        return ____({\n            "count": self.page.paginator.count,\n            "total_pages": self.page.paginator.____,\n            "current_page": self.page.____,\n            "has_next": self.page.____(),\n            "has_previous": self.page.____(),\n            "next": self.____(),\n            "previous": self.____(),\n            "results": data,\n        })',
      },
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
        { id: 'd', text: 'queryset is built once, when the class is defined and no request exists; get_queryset() runs per request -- use it to filter by self.request.user', isCorrect: true },
      ],
      explanation: 'queryset = Article.objects.all() is built once, when Python runs the class body at import, and there is no request at that moment. It is not evaluated or cached there: the default get_queryset() returns a fresh copy of it (queryset.all()) on every request, so new rows still show up. That is fine when every caller sees the same rows. But if you need to filter by the current user (self.request.user.articles.all()), URL parameters (self.kwargs["category_id"]), or query params (self.request.query_params["status"]), you must override get_queryset() because self.request is only available per-request. Common pattern: def get_queryset(self): return Article.objects.filter(author=self.request.user) -- this ensures each user only sees their own articles.',
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
      explanation: 'DRF generic views are pre-built classes that handle common API patterns. For example, ListAPIView only needs queryset and serializer_class - it handles GET requests and serialization, and applies whatever pagination and filter backends are configured. CreateAPIView handles POST with validation. You can combine them: ListCreateAPIView handles both GET (list) and POST (create). This reduces a 20-line APIView to 3-4 lines while keeping the same functionality.',
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
    question: 'Complete this read-only endpoint that lists all articles, newest first. Fill in the DRF generic view that answers GET with a list, and the attribute that holds the rows it lists.',
    template: `from rest_framework import generics
from .models import Article
from .serializers import ArticleSerializer

class ArticleListView(generics.___):
    ___ = Article.objects.all().order_by("-created_at")
    serializer_class = ArticleSerializer`,
    blanks: ['ListAPIView', 'queryset'],
    solution: `from rest_framework import generics
from .models import Article
from .serializers import ArticleSerializer

class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.all().order_by("-created_at")
    serializer_class = ArticleSerializer`,
    explanation: '`generics.ListAPIView` is the standard generic view for a read-only list endpoint. You only need to define the `queryset` attribute (the rows, here newest first) and `serializer_class`. Its default `get_queryset()` returns that `queryset` for each request.',
    hints: [
      'The generic view named after the action it performs on a collection',
      'The class attribute the default get_queryset() returns',
    ],
    tags: ['drf', 'generic-views', 'queryset', 'cloze'],
    concepts: ['dj-view-patterns'],
  },
  {
      id: 'dj-pagination-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_PAGINATION_GENERICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: '`shop.Book` holds 5 rows and `BookSerializer` is a `ModelSerializer` for it. This list view is called from `python manage.py shell`, asking for page 2. What do the two `print` calls output? The answer is two lines: two numbers separated by a space, then the value of `next` as Python prints it.',
      code: `from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.test import APIRequestFactory

class ThreePerPage(PageNumberPagination):
    page_size = 3

class BookList(generics.ListAPIView):
    queryset = Book.objects.order_by("title")
    serializer_class = BookSerializer
    pagination_class = ThreePerPage

view = BookList.as_view()
data = view(APIRequestFactory(SERVER_NAME="localhost").get("/books/", {"page": 2})).data
print(data["count"], len(data["results"]))
print(data["next"])`,
      expectedOutput: `5 2
None`,
      explanation: '`ListAPIView` runs the queryset through `pagination_class`, so the response holds one page wrapped in metadata. `count` is the total number of rows the queryset matches, 5, not the size of the page. With 3 per page, page 1 holds 3 books and page 2 holds the last 2, so `results` has 2 items. Page 2 is the last page, so there is no next link and `next` is `None`, while `previous` would point back to page 1.',
      hints: ['count is the total across all pages, not the rows on this page.', 'Work out how many of the 5 rows are left for page 2 after page 1 takes 3.'],
      tags: ['django', 'drf', 'pagination', 'generics', 'predict'],
      concepts: ['dj-pagination-strategy'],
    },
  {
      id: 'dj-drf-pagination-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_PAGINATION_GENERICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the two REST_FRAMEWORK settings keys that configure global pagination.',
      template: `# settings.py
REST_FRAMEWORK = {
    "___": "rest_framework.pagination.PageNumberPagination",
    "___": 20,
}`,
      blanks: ['DEFAULT_PAGINATION_CLASS', 'PAGE_SIZE'],
      solution: '# settings.py\nREST_FRAMEWORK = {\n    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",\n    "PAGE_SIZE": 20,\n}',
      explanation: '`DEFAULT_PAGINATION_CLASS` sets the pagination style project-wide; `PageNumberPagination` is the simplest (`?page=N`). `PAGE_SIZE` sets how many items per page. List responses are then wrapped with `count`/`next`/`previous`/`results`.',
      hints: ['Key naming the pagination class', 'Key naming items per page'],
      tags: ['drf', 'pagination', 'cloze'],
      concepts: ['dj-pagination-strategy'],
    },
  {
      id: 'py-drf-pagination',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_PAGINATION_GENERICS,
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
      explanation: 'Options: `PageNumberPagination` (?page=N - simplest), `LimitOffsetPagination` (?limit=N&offset=N - SQL-style), `CursorPagination` (opaque cursor - stable under inserts and fast deep into a big table, so it suits feeds and logs). `PAGE_SIZE` is the number of rows per page; the class alone does not paginate without it. Per-view override via `pagination_class = MyPagination`. Disable for a view by setting `pagination_class = None`. Always paginate list endpoints on collections that could grow unbounded - otherwise one request can make the server load and serialize every row.',
      hints: [
        'Page / Limit-Offset / Cursor - pick by the API shape',
        'Per-view override: pagination_class on the view',
        'Always paginate unbounded lists',
      ],
      tieredHints: {
        apiSignature: 'REST_FRAMEWORK = {\'DEFAULT_PAGINATION_CLASS\': ..., \'PAGE_SIZE\': ...}',
        skeleton: '# settings.py\nREST_FRAMEWORK = {\n    "____": "____.PageNumberPagination",\n    "____": 20,\n}',
      },
      tags: ['drf', 'pagination'],
      concepts: ['dj-pagination-strategy'],
    },
  {
      id: 'dj-drf-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_PAGINATION_GENERICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: '`Article` has an `author` foreign key to the user. Build a DRF `ListCreateAPIView` named `ArticleListCreate`, using `ArticleSerializer`, that lists only the articles written by the user making the request. Set the serializer attribute first, then the code that picks the rows.',
      correctOrder: [
        'from rest_framework.generics import ListCreateAPIView',
        'from .models import Article',
        'from .serializers import ArticleSerializer',
        '',
        'class ArticleListCreate(ListCreateAPIView):',
        '    serializer_class = ArticleSerializer',
        '',
        '    def get_queryset(self):',
        '        return Article.objects.filter(author=self.request.user)',
      ],
      distractorLines: [
        '        return Article.objects.get(author=self.request.user)',
        '    serializer = ArticleSerializer',
        'class ArticleListCreate(GenericAPIView):',
        '    queryset = Article.objects.filter(author=self.request.user)',
      ],
      solution: 'from rest_framework.generics import ListCreateAPIView\nfrom .models import Article\nfrom .serializers import ArticleSerializer\n\nclass ArticleListCreate(ListCreateAPIView):\n    serializer_class = ArticleSerializer\n\n    def get_queryset(self):\n        return Article.objects.filter(author=self.request.user)',
      explanation: 'Generic API views need `serializer_class` (not `serializer`) and the rows, from a class-level `queryset` or an overridden `get_queryset()`. Here the rows depend on who is asking, so they must come from `get_queryset()`: DRF calls it for each request with `self.request` set. A class attribute `queryset = ...filter(author=self.request.user)` runs once when the class is defined, where there is no `self` and no request, so it cannot work. `get_queryset()` must return a queryset: `.filter(...)` gives all of the user\'s articles, while `.get(...)` returns one object (or raises when there are several). `ListCreateAPIView` handles both `GET` (list) and `POST` (create); `GenericAPIView` alone has no handlers.',
      hints: ['serializer_class, not serializer', 'The class body runs once, before any request exists', 'ListCreate handles GET and POST'],
      tags: ['django', 'drf', 'ListCreateAPIView', 'get_queryset', 'parsons'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'dj-drf-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_PAGINATION_GENERICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the generic view base class that both lists (GET) and creates (POST) articles, the attribute that names its serializer, and the method that returns only the published articles.',
      template: `from rest_framework import generics

class ArticleListCreate(generics.___):
    ___ = ArticleSerializer

    def ___(self):
        return Article.objects.filter(status="published")`,
      blanks: ['ListCreateAPIView', 'serializer_class', 'get_queryset'],
      solution: 'from rest_framework import generics\n\nclass ArticleListCreate(generics.ListCreateAPIView):\n    serializer_class = ArticleSerializer\n\n    def get_queryset(self):\n        return Article.objects.filter(status="published")',
      explanation: 'Generic API views use `serializer_class` (singular, not `serializer`) and either a class-level `queryset` or an overridden `get_queryset()`. Override the method when the queryset depends on the request (e.g. filter by `self.request.user`).',
      hints: ['serializer_class is the attr name', 'get_queryset for request-aware filtering'],
      tags: ['django', 'drf', 'ListCreateAPIView', 'get_queryset', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
];
