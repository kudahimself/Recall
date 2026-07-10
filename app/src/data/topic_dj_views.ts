import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_views_questions: Question[] = [
{
      id: 'dj-view-httpresponse',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write the simplest possible Django function-based view. Define `hello` taking a `request`, returning a plain-text HTTP response whose body is `"hello world"` and whose status is 200 (the default). Every Django view has the same shape — take `request`, return a response object.',
      starterCode: `from django.http import HttpResponse
  `,
      testCases: [
        {
          input: 'hello(request) returns HttpResponse',
          expectedOutput: 'HttpResponse with body "hello world"',
          description: 'Minimal FBV signature: request → response',
        },
      ],
      solution: `from django.http import HttpResponse

def hello(request):
    return HttpResponse("hello world")`,
      explanation: 'A Django view is just a callable that takes an `HttpRequest` and returns an `HttpResponse`. This is the whole contract — templates, ORM, and forms are optional layers on top. The `request` argument holds method, headers, GET/POST data, the authenticated user, and more. `HttpResponse` takes a body string (or bytes) and optional `status=` / `content_type=` kwargs.',
      hints: [
        'Import HttpResponse from django.http',
        'View signature: def view(request): return HttpResponse(...)',
        'Hook the view into urls.py with path("hello/", hello) to call it',
      ],
      tags: ['view', 'function-based', 'HttpResponse', 'django'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-view-render',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a Django view `greet(request)` that loads and renders a template named `"greet.html"`. Pass a context dict containing `name` set to `"Alice"` and `count` set to `3`.',
      starterCode: `from django.shortcuts import render
  `,
      testCases: [
        {
          input: 'greet(request) renders greet.html',
          expectedOutput: 'render(request, "greet.html", context_dict)',
          description: 'render() loads template, substitutes context, returns HttpResponse',
        },
      ],
      solution: `from django.shortcuts import render

def greet(request):
    return render(request, "greet.html", {"name": "Alice", "count": 3})`,
      explanation: '`render(request, template_name, context)` is the canonical shortcut. It finds the template in your `TEMPLATES["DIRS"]` or any app\'s `templates/` folder, renders it with the context, and returns an `HttpResponse` in one call. Alternatives: `render_to_string` if you just need the rendered text, or manually `get_template(name).render(context, request)` then wrap in `HttpResponse`.',
      hints: [
        'render(request, "template_name.html", context_dict)',
        'Context keys become template variables: {{ name }}',
        'Template path is resolved via TEMPLATES["DIRS"] and app templates/ folders',
      ],
      tags: ['view', 'render', 'template', 'django'],
      concepts: ['dj-view-patterns', 'dj-templates'],
    },
{
      id: 'dj-view-param',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a Django view `detail(request, pk)` that returns a plain-text response whose body is `"article "` followed by the `pk` value. Given a URL config entry like `path("articles/<int:pk>/", detail)`, a request to `/articles/42/` should produce the body `"article 42"`. Django automatically passes URL captures as keyword arguments matching the function signature.',
      starterCode: `from django.http import HttpResponse
  `,
      testCases: [
        {
          input: 'detail(request, pk=42)',
          expectedOutput: 'HttpResponse with body "article 42"',
          description: 'URL captures become keyword args on the view',
        },
      ],
      solution: `from django.http import HttpResponse

def detail(request, pk):
    return HttpResponse(f"article {pk}")`,
      explanation: 'Django matches the URL pattern, extracts captures, and passes them as kwargs. Path converters (`<int:pk>`, `<slug:name>`, `<uuid:id>`, `<str:name>`, `<path:rest>`) also validate and type-coerce — `<int:pk>` gives you `pk=42`, not `pk="42"`. Use descriptive names: `<int:article_id>` reads better in the view signature than `<int:pk>` when it\'s not actually the primary key.',
      hints: [
        'URL captures → view kwargs by name match',
        'Path converters: int, slug, uuid, str, path',
        'Integer converter gives you an int, not a string',
      ],
      tags: ['view', 'url-parameter', 'path-converter', 'django'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-view-404',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a Django view `article_detail(request, pk)` that uses the Django shortcut which fetches a single row by lookup OR raises `Http404` automatically when no match exists (so the view never needs to catch `DoesNotExist`). Fetch the `Article` with the matching `pk`, then render `"article_detail.html"` with that object in the context under key `"article"`.',
      starterCode: `from django.shortcuts import get_object_or_404, render
from .models import Article
`,
      testCases: [
        {
          input: 'article_detail with non-existent pk → 404',
          expectedOutput: 'get_object_or_404(Article, pk=pk) + render',
          description: 'Missing object → Http404 automatically',
        },
      ],
      solution: `from django.shortcuts import get_object_or_404, render
from .models import Article

def article_detail(request, pk):
    article = get_object_or_404(Article, pk=pk)
    return render(request, "article_detail.html", {"article": article})`,
      explanation: '`get_object_or_404(Model, **lookups)` wraps `Model.objects.get(**lookups)` and translates `DoesNotExist` into `Http404`. Django converts the 404 into a 404 response with the templates/`404.html` page in prod (or the yellow debug page in DEBUG mode). There\'s also `get_list_or_404` for querysets — raises 404 if the list is empty. Do NOT catch `Http404` in view code; let Django\'s middleware handle it.',
      hints: [
        'get_object_or_404(Model, **lookups) = .get() + 404 on DoesNotExist',
        'Cleaner than try/except DoesNotExist: return HttpResponseNotFound',
        'Also get_list_or_404 for queries that must return at least one row',
      ],
      tags: ['view', 'get_object_or_404', '404', 'django'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-view-post',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a Django view `submit(request)` that branches on the HTTP verb. When the request is a POST, read the form field `"name"` from the request\'s form-encoded body (default to empty string if missing) and return a plain-text response with body `"saved: "` followed by the name. Otherwise (any other method), return a plain-text response with body `"please POST a name field"`. This is the raw request-method-branch pattern — Django forms build on top of it.',
      starterCode: `from django.http import HttpResponse
  `,
      testCases: [
        {
          input: 'POST with name=Alice → "saved: Alice"; GET → "please POST..."',
          expectedOutput: 'Branches on request.method',
          description: 'request.POST.get for form body; request.GET.get for query string',
        },
      ],
      solution: `from django.http import HttpResponse

def submit(request):
    if request.method == "POST":
        name = request.POST.get("name", "")
        return HttpResponse(f"saved: {name}")
    return HttpResponse("please POST a name field")`,
      explanation: '`request.method` is the HTTP verb as a string. `request.POST` is a QueryDict of form-encoded body data; `request.GET` is the query string. For JSON bodies, use `json.loads(request.body)`. Django forms wrap this pattern with validation — but under the hood it\'s still `if request.method == "POST": form = MyForm(request.POST); if form.is_valid(): ...`. Views with only GET/POST handling don\'t usually need the `else` branch for PUT/DELETE; those arrive rarely except in APIs (where you\'d switch to DRF).',
      hints: [
        'request.method is the HTTP verb string',
        'request.POST for form-encoded body, request.GET for query string',
        'json.loads(request.body) for JSON bodies',
      ],
      tags: ['view', 'POST', 'request-method', 'django'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-view-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a Django function-based view "article_list" that queries all published articles and renders them using the template "articles/list.html".',
      starterCode: `# Import render from django.shortcuts and Article from .models
# Define article_list(request) querying published articles and rendering them
# through "articles/list.html" with {"articles": articles}
`,
      testCases: [
        {
          input: 'article_list view',
          expectedOutput: 'render(request, template, context)',
          description: 'Should query and render articles',
        },
      ],
      solution: `from django.shortcuts import render\nfrom .models import Article\n\ndef article_list(request):\n    articles = Article.objects.filter(is_published=True)\n    return render(request, "articles/list.html", {"articles": articles})`,
      explanation: 'Function-based views take a request and return a response. render() combines a template with context data. Article.objects.filter() queries the database. The context dict makes "articles" available in the template.',
      hints: ['Use Article.objects.filter() for querying', 'render(request, template, context_dict)', 'Pass data to template via context dict'],
      tags: ['view', 'function-based', 'render', 'django'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the canonical view shortcut: fetch by pk or 404, then render with context.',
      template: `from django.shortcuts import render, ___

def article_detail(request, pk):
    article = ___(Article, pk=pk)
    return render(___, "article_detail.html", {"article": article})`,
      blanks: ['get_object_or_404', 'get_object_or_404', 'request'],
      solution: 'from django.shortcuts import render, get_object_or_404\n\ndef article_detail(request, pk):\n    article = get_object_or_404(Article, pk=pk)\n    return render(request, "article_detail.html", {"article": article})',
      explanation: '`get_object_or_404` wraps `Model.objects.get()` and converts `DoesNotExist` to `Http404`. `render` always takes the request as its first argument — forgetting it is the most common rookie mistake.',
      hints: ['render(request, template, context)', 'get_object_or_404 converts DoesNotExist to 404'],
      tags: ['django', 'views', 'render', 'get_object_or_404', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj4e-http-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'What is the difference between an HTTP GET and an HTTP POST request?',
      options: [
        { id: 'a', text: 'GET is faster; POST is more secure', isCorrect: false },
        { id: 'b', text: 'GET retrieves data (parameters in URL); POST submits data (parameters in request body)', isCorrect: true },
        { id: 'c', text: 'GET is for HTML pages; POST is for JSON APIs only', isCorrect: false },
        { id: 'd', text: 'There is no practical difference — both send the same data', isCorrect: false },
      ],
      explanation: 'GET requests pass data in the URL query string (`?key=value`) — they are idempotent and safe (no side effects). POST requests send data in the request body — used for creating or changing data (form submissions, login, file uploads). In Django, `request.method == "GET"` or `"POST"` lets you handle both in the same view.',
      hints: [
        'GET = read data; POST = write/submit data',
        'GET parameters appear in the URL; POST parameters are hidden in the body',
      ],
      tags: ['http', 'GET', 'POST', 'fundamentals', 'request'],
      concepts: ['dj-http-cycle'],
    },
{
      id: 'dj4e-http-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'What do HTTP status codes tell you? Match: 200, 301, 404, 500.',
      options: [
        { id: 'a', text: '200 = error, 301 = success, 404 = redirect, 500 = not found', isCorrect: false },
        { id: 'b', text: '200 = created, 301 = moved, 404 = forbidden, 500 = timeout', isCorrect: false },
        { id: 'c', text: '200 = OK/success, 301 = permanent redirect, 404 = not found, 500 = server error', isCorrect: true },
        { id: 'd', text: 'All codes below 400 mean success; all above mean failure', isCorrect: false },
      ],
      explanation: 'HTTP status codes are grouped: 2xx = success (200 OK, 201 Created), 3xx = redirection (301 Moved Permanently, 302 Found), 4xx = client error (400 Bad Request, 403 Forbidden, 404 Not Found), 5xx = server error (500 Internal Server Error). In Django, `HttpResponse(status=404)` or `raise Http404` returns a 404.',
      hints: [
        '2xx = good, 3xx = redirect, 4xx = client mistake, 5xx = server broke',
        'Django\'s `Http404` exception automatically returns a 404 status',
      ],
      tags: ['http', 'status-codes', '200', '404', '500', 'fundamentals'],
      concepts: ['dj-http-cycle'],
    },
{
      id: 'dj4e-http-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'What is the HTTP request/response cycle in the context of a Django web app?',
      options: [
        { id: 'a', text: 'The browser sends SQL directly to the database; Django formats the result', isCorrect: false },
        { id: 'b', text: 'The browser and database communicate directly; Django only handles authentication', isCorrect: false },
        { id: 'c', text: 'Django generates all pages at build time; the browser just downloads them', isCorrect: false },
        { id: 'd', text: 'Browser sends HTTP request → Django URL router → view function → model → template → HTTP response back to browser', isCorrect: true },
      ],
      explanation: 'The cycle: (1) Browser sends HTTP request to server. (2) Django\'s URL router matches the path to a view. (3) The view queries the model (database). (4) The view renders a template with data. (5) Django returns an HTTP response with the HTML. This is the MVC/MVT pattern at work.',
      hints: [
        'Request → URL router → view → model → template → response',
        'Django follows MVT: Model, View, Template',
      ],
      tags: ['http', 'request-response', 'cycle', 'MVT', 'fundamentals'],
      concepts: ['dj-http-cycle'],
    },
{
      id: 'dj4e-http-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'In a Django view, how do you access data sent via a POST form submission?',
      options: [
        { id: 'a', text: '`request.POST["field_name"]`', isCorrect: true },
        { id: 'b', text: '`request.body["field_name"]`', isCorrect: false },
        { id: 'c', text: '`request.form["field_name"]`', isCorrect: false },
        { id: 'd', text: '`request.data["field_name"]`', isCorrect: false },
      ],
      explanation: '`request.POST` is a dict-like object containing all form data from a POST request. Use `request.POST["field"]` (raises `KeyError` if missing) or the safer `request.POST.get("field", "default")`. For GET parameters (query string), use `request.GET`. For JSON API requests (Django REST framework), use `request.data`.',
      hints: [
        '`request.POST` for form data, `request.GET` for URL query parameters',
        'Use `.get()` for safe access without KeyError',
      ],
      tags: ['django', 'views', 'POST', 'request', 'forms'],
      concepts: ['dj-view-patterns', 'dj-form-validation'],
    },
{
      id: 'dj4e-mvc-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'Django follows the MVT pattern. What does MVT stand for, and how does it map to the traditional MVC pattern?',
      options: [
        { id: 'a', text: 'Multiple View Types — Django\'s own unique architecture with no MVC equivalent', isCorrect: false },
        { id: 'b', text: 'Model-View-Template: all three map exactly to the same MVC components', isCorrect: false },
        { id: 'c', text: 'Model-View-Template: Model = Model, View = Controller, Template = View in MVC terms', isCorrect: true },
        { id: 'd', text: 'Managed-View-Transfer — only used in Django REST Framework', isCorrect: false },
      ],
      explanation: 'Django calls it MVT (Model-View-Template), but it maps to MVC like this: Django\'s **Model** = MVC Model (data layer, ORM), Django\'s **View** = MVC Controller (business logic, handles requests), Django\'s **Template** = MVC View (presentation layer, HTML). The naming can be confusing — Django\'s "view" is really a controller.',
      hints: [
        'Django\'s "View" is the controller — it handles requests and calls models',
        'Django\'s "Template" is the view — it renders HTML for the browser',
      ],
      tags: ['django', 'MVT', 'MVC', 'architecture', 'fundamentals'],
      concepts: ['dj-http-cycle'],
    },
{
      id: 'dj4e-mvc-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'What is the role of `urls.py` in Django\'s request handling?',
      options: [
        { id: 'a', text: 'It stores the database connection URL', isCorrect: false },
        { id: 'b', text: 'It maps URL patterns to view functions — the URL router/dispatcher', isCorrect: true },
        { id: 'c', text: 'It defines the HTML template for each page', isCorrect: false },
        { id: 'd', text: 'It handles HTTP redirects only', isCorrect: false },
      ],
      explanation: '`urls.py` is the URL configuration file — it maps URL patterns (using `path()` or `re_path()`) to view functions or class-based views. Django processes URLs top-to-bottom until one matches. Projects have a root `urls.py` that can `include()` app-level `urls.py` files, keeping each app\'s URLs self-contained.',
      hints: [
        'Think of `urls.py` as a switchboard routing requests to the right view',
        '`path("about/", views.about)` maps the `/about/` URL to the `about` view',
      ],
      tags: ['django', 'urls', 'routing', 'MVT', 'fundamentals'],
      concepts: ['dj-view-patterns', 'dj-http-cycle'],
    },
{
      id: 'dj4e-session-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'HTTP is stateless. What problem does this create for web apps, and how do cookies solve it?',
      options: [
        { id: 'a', text: 'Statelessness makes HTTP slower; cookies fix this by compressing repeated requests', isCorrect: false },
        { id: 'b', text: 'Stateless means every request must re-authenticate; cookies solve this by storing the password', isCorrect: false },
        { id: 'c', text: 'Each request is independent with no memory of previous ones; cookies store small data on the client to maintain state', isCorrect: true },
        { id: 'd', text: 'Statelessness only affects file downloads; cookies fix it by caching HTML pages locally', isCorrect: false },
      ],
      explanation: 'HTTP is stateless — the server treats every request as new, with no memory of past interactions. This is a problem for things like "who is logged in?" or "what\'s in my shopping cart?". Cookies solve this by storing small key-value pairs in the browser. The browser sends cookies automatically with every request to the same domain.',
      hints: [
        'Without cookies/sessions, logging in would reset on every page',
        'Cookies are stored in the browser and sent automatically',
      ],
      tags: ['http', 'cookies', 'stateless', 'sessions', 'fundamentals'],
      concepts: ['dj-http-cycle'],
    },
{
      id: 'dj4e-session-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'What is the difference between a cookie and a Django session?',
      options: [
        { id: 'a', text: 'Cookies handle login state, while sessions exist only to power shopping-cart features', isCorrect: false },
        { id: 'b', text: 'They are interchangeable terms — Django uses cookie and session to mean the same thing', isCorrect: false },
        { id: 'c', text: 'Sessions are more secure because Django encrypts their contents by default', isCorrect: false },
        { id: 'd', text: 'Cookies store data in the browser; sessions store it on the server, with only a session ID in a cookie', isCorrect: true },
      ],
      explanation: 'A cookie stores data directly in the browser (visible to the user, limited size). A session stores data on the server — the browser only holds a session ID cookie (`sessionid`). When the browser sends that ID, Django looks up the server-side data. Sessions are more secure for sensitive data since the actual data never leaves the server.',
      hints: [
        'Cookie = data in browser; Session = data on server, ID in browser',
        'Django\'s `request.session` is server-side storage',
      ],
      tags: ['cookies', 'sessions', 'django', 'security', 'state'],
      concepts: ['py-security-primitives'],
    },
{
      id: 'dj4e-session-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a Django view that uses the session to count how many times a user has visited the page. Display the count in the response. Use `request.session`.',
      starterCode: `# Write visit_counter(request): keep a per-session visit count in
# request.session (default 0), increment it on each visit, store it
# back, and return an HttpResponse stating how many times the page
# has been visited.
`,
      testCases: [
        { input: '', expectedOutput: 'You have visited this page 1 time(s)', description: 'First visit shows count of 1' },
      ],
      solution: `from django.http import HttpResponse

def visit_counter(request):
    count = request.session.get('visit_count', 0)
    count += 1
    request.session['visit_count'] = count
    return HttpResponse(f"You have visited this page {count} time(s)")`,
      explanation: '`request.session` behaves like a dictionary. `.get("key", default)` safely retrieves a value. Assigning back (`request.session["key"] = value`) marks the session as modified and Django saves it automatically. Sessions persist across requests for the same browser until cleared or expired.',
      hints: [
        'Use `request.session.get("visit_count", 0)` with a default of 0',
        'Assign back: `request.session["visit_count"] = count`',
      ],
      tags: ['django', 'sessions', 'views', 'request.session', 'counter'],
      concepts: ['dj-view-patterns', 'py-collections-stdlib'],
    },
{
      id: 'dj4e-session-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write two Django views that import `HttpResponse` from `django.http`. The first, `set_theme(request)`, should build an `HttpResponse` with body "Theme set to dark", call the response\'s `set_cookie` method to store a cookie named "theme" with value "dark" and a `max_age` of 7 days expressed in seconds (7*24*60*60), then return the response. The second, `get_theme(request)`, should read the "theme" cookie from `request.COOKIES` with a default of "light" and return an `HttpResponse` whose body is an f-string formatted as "Current theme: {theme}".',
      starterCode: `# Write set_theme(request): return an HttpResponse and set a "theme"
# cookie to "dark" lasting 7 days (max_age in seconds).
# Write get_theme(request): read the "theme" cookie from request.COOKIES
# (default "light") and return it in an HttpResponse.
`,
      testCases: [
        { input: '', expectedOutput: 'Theme set to dark', description: 'set_theme returns confirmation' },
      ],
      solution: `from django.http import HttpResponse

def set_theme(request):
    response = HttpResponse("Theme set to dark")
    response.set_cookie('theme', 'dark', max_age=7*24*60*60)
    return response

def get_theme(request):
    theme = request.COOKIES.get('theme', 'light')
    return HttpResponse(f"Current theme: {theme}")`,
      explanation: '`response.set_cookie(name, value, max_age=seconds)` sets a cookie. `max_age` is in seconds — 7 days = 7×24×60×60. Reading cookies uses `request.COOKIES` (a dict). Use `.get()` with a default since the cookie may not exist yet. You can also use `expires` instead of `max_age` for a specific datetime.',
      hints: [
        '`response.set_cookie("name", "value", max_age=seconds)` to set',
        '`request.COOKIES.get("name", "default")` to read',
      ],
      tags: ['django', 'cookies', 'set_cookie', 'request.COOKIES', 'views'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj4e-session-5',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'What does `request.session.flush()` do in Django?',
      options: [
        { id: 'a', text: 'Deletes the current session data and generates a new session key', isCorrect: true },
        { id: 'b', text: 'Saves any pending session changes to the database immediately', isCorrect: false },
        { id: 'c', text: 'Removes only expired entries from the session store', isCorrect: false },
        { id: 'd', text: 'Pushes the session\'s current data to the client as browser cookies', isCorrect: false },
      ],
      explanation: '`request.session.flush()` deletes the current session and generates a new session key. This is important for security — after logout or privilege changes, you should flush the session to prevent session fixation attacks where an attacker reuses a known session ID. Django\'s `logout()` function calls this automatically.',
      hints: [
        'Always flush/clear the session on logout',
        'Django\'s built-in `logout()` handles this for you',
      ],
      tags: ['django', 'sessions', 'security', 'flush', 'session-fixation'],
      concepts: ['py-security-primitives'],
    },
{
      id: 'dj4e-csrf-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'What is a CSRF attack, and how does Django protect against it?',
      options: [
        { id: 'a', text: 'Cross-Site Resource Sharing — Django protects you by rejecting every cross-origin request', isCorrect: false },
        { id: 'b', text: 'Cross-Site Request Forgery — Django prevents it by requiring HTTPS on every form submission', isCorrect: false },
        { id: 'c', text: 'Client-Side Routing Failure — Django\'s URL resolver rejects routes that don\'t match a pattern', isCorrect: false },
        { id: 'd', text: 'Cross-Site Request Forgery — another site submits requests using your logged-in cookies; Django blocks it with `{% csrf_token %}`', isCorrect: true },
      ],
      explanation: 'CSRF: a malicious site can submit a form to your site using a logged-in user\'s cookies. Django prevents this by including a secret token in forms (`{% csrf_token %}`). When the form is submitted, Django validates the token — requests without it are rejected. Always include `{% csrf_token %}` in POST forms. AJAX requests need the token in the `X-CSRFToken` header.',
      hints: [
        'Always add `{% csrf_token %}` inside HTML `<form>` tags',
        'CSRF tokens are unique per session — attackers can\'t guess them',
      ],
      tags: ['django', 'security', 'CSRF', 'csrf_token', 'forms', 'middleware'],
      concepts: ['py-security-primitives', 'dj-form-validation', 'dj-middleware-ordering'],
    },
{
      id: 'dj4e-urls-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'What is `{% url "name" %}` in a Django template and why is it better than hardcoding URLs?',
      options: [
        { id: 'a', text: 'It renders a complete `<a>` hyperlink element, not just the URL string', isCorrect: false },
        { id: 'b', text: 'It works only inside `<form>` tags to set the form\'s action attribute', isCorrect: false },
        { id: 'c', text: 'It generates the URL from a named pattern, so templates survive path changes', isCorrect: true },
        { id: 'd', text: 'It is just an alias for writing the URL path directly in the template', isCorrect: false },
      ],
      explanation: '`{% url "article-list" %}` uses the `name` parameter from `path()` in urls.py to generate the URL. If you change `/articles/` to `/posts/`, only urls.py needs updating — all `{% url %}` references update automatically. In Python code, use `reverse("article-list")` or `reverse_lazy("article-list")` for the same effect.',
      hints: [
        'Name your URL patterns: `path("...", view, name="my-name")`',
        'In templates: `{% url "my-name" %}`, in Python: `reverse("my-name")`',
      ],
      tags: ['django', 'urls', 'reverse', 'template-url', 'named-urls'],
      concepts: ['dj-view-patterns', 'py-iterator-protocol'],
    },
{
      id: 'dj4e-urls-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'How do you pass URL parameters to a view, and how does the view receive them?',
      options: [
        { id: 'a', text: 'URL parameters go in `request.GET`; no special URL pattern needed', isCorrect: false },
        { id: 'b', text: 'Capture groups in `path()` (e.g. `<int:pk>`) are passed as keyword arguments to the view function', isCorrect: true },
        { id: 'c', text: 'URL parameters must always be query strings (`?id=5`)', isCorrect: false },
        { id: 'd', text: 'The view reads them from `request.resolver_match.kwargs`', isCorrect: false },
      ],
      explanation: 'URL path converters like `<int:pk>`, `<str:username>`, `<slug:slug>` capture parts of the URL and pass them as **keyword arguments** to the view. `path("articles/<int:pk>/", views.article_detail)` means `article_detail(request, pk=5)` when `/articles/5/` is requested. Available converters: `int`, `str`, `slug`, `uuid`, `path`.',
      hints: [
        '`<int:pk>` in the URL captures a number and passes it as `pk` kwarg',
        'View signature: `def my_view(request, pk):` to receive it',
      ],
      tags: ['django', 'urls', 'path-converters', 'kwargs', 'URL-parameters'],
      concepts: ['dj-view-patterns', 'py-args-kwargs'],
    },
{
      id: 'dj-views-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'In Django, what is a "view"?\n\nA view is the core building block for handling web requests in Django. When a user visits a URL, Django calls a view to decide what to send back.',
      options: [
        {
          id: 'a',
          text: 'An HTML template that controls how data is displayed to the user',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'A function or class that takes an HttpRequest and returns an HttpResponse',
          isCorrect: true,
        },
        {
          id: 'c',
          text: 'A database table that stores the application\'s persistent data',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'A URL pattern entry that maps request paths to template files',
          isCorrect: false,
        },
      ],
      explanation: 'A Django view is a Python function (or class) that takes an HttpRequest object as its first argument and returns an HttpResponse object. Views contain the logic for what happens when a user visits a URL: querying the database, processing data, and deciding what response to send back (HTML page, JSON data, redirect, error, etc.).',
      hints: [
        'Think of views as the "controller" in MVC — they handle the request and produce the response',
        'Every view must return some kind of HttpResponse',
      ],
      tags: ['django', 'views', 'basics', 'http'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-gap-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write the simplest possible Django view: a function called `hello` that takes a request and returns an HttpResponse with the text "Hello, World!". Include the necessary import.',
      starterCode: `# views.py
# Import HttpResponse from the correct module, then write the view function

`,
      testCases: [
        {
          input: 'Simple view function',
          expectedOutput: 'Function that imports HttpResponse and returns HttpResponse("Hello, World!")',
          description: 'Should define a view function returning HttpResponse',
        },
      ],
      solution: `# views.py
from django.http import HttpResponse

def hello(request):
    return HttpResponse("Hello, World!")`,
      explanation: 'This is the minimal Django view. HttpResponse is imported from django.http. The function takes `request` (an HttpRequest object that Django passes automatically) and returns an HttpResponse containing the text "Hello, World!". In a real app, you would connect this view to a URL pattern in urls.py so Django knows when to call it.',
      hints: [
        'HttpResponse lives in django.http',
        'The first parameter of every view function is the request object',
      ],
      tags: ['django', 'views', 'http-response', 'basics'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a view `article_detail(request, pk)` that fetches an Article by pk OR returns 404, then renders `"article_detail.html"` with the article in context.',
      correctOrder: [
        'from django.shortcuts import render, get_object_or_404',
        'from .models import Article',
        '',
        'def article_detail(request, pk):',
        '    article = get_object_or_404(Article, pk=pk)',
        '    return render(request, "article_detail.html", {"article": article})',
      ],
      distractorLines: [
        '    article = Article.objects.get(pk=pk)',
        '    return HttpResponse(article)',
        '    return render("article_detail.html", {"article": article})',
        '    article = get_object_or_404(Article)',
      ],
      solution: 'from django.shortcuts import render, get_object_or_404\nfrom .models import Article\n\ndef article_detail(request, pk):\n    article = get_object_or_404(Article, pk=pk)\n    return render(request, "article_detail.html", {"article": article})',
      explanation: '`get_object_or_404(Model, **lookups)` is `Model.objects.get(**lookups)` plus auto-conversion of `DoesNotExist` to `Http404`. `render` always takes the request as its first arg. Using bare `.objects.get` would crash with a 500 instead of returning a clean 404.',
      hints: ['render takes request first', 'get_object_or_404 needs the lookup kwargs', 'Auto-404 beats try/except DoesNotExist'],
      tags: ['django', 'views', 'render', 'get_object_or_404', 'parsons'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'A view returns this. What status code does the client see?',
      code: `from django.http import HttpResponse, HttpResponseNotFound, HttpResponseRedirect

def view(request):
    return HttpResponseNotFound("missing")

# Client makes GET /
response = view(request)
print(response.status_code)`,
      expectedOutput: `404`,
      explanation: '`HttpResponseNotFound` is a subclass of `HttpResponse` with `status_code = 404` baked in. Other quick subclasses: `HttpResponseRedirect` (302), `HttpResponseForbidden` (403), `HttpResponseBadRequest` (400), `HttpResponseServerError` (500). For other codes, use `HttpResponse(..., status=418)`.',
      hints: ['HttpResponseNotFound = 404', 'Each subclass hard-codes a status_code'],
      tags: ['django', 'views', 'HttpResponse', 'status-code', 'predict'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given the URL conf and view, what does the request to GET /articles/ produce?',
      code: `# urls.py: path("articles/", articles)
def articles(request):
    if request.method == "GET":
        print("listing")
        return HttpResponse("list")
    elif request.method == "POST":
        print("creating")
        return HttpResponse("create")
    print("else")
    return HttpResponse("?")

# Simulated GET request runs:
response = articles(request)  # request.method == "GET"
print(response.content.decode())`,
      expectedOutput: `listing
list`,
      explanation: 'Function-based views typically dispatch on `request.method`. Django does not automatically reject methods — the `else` branch would handle PUT/DELETE/etc unless you add `@require_GET` or similar. `HttpResponse.content` is bytes; `.decode()` gives the string body.',
      hints: ['No auto method-restriction without @require_*', 'response.content is bytes'],
      tags: ['django', 'views', 'request.method', 'predict'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-adv-6',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Build a function-based JSON search endpoint for Article. The view accepts a search term and a page number from the query string (defaulting page to 1). It returns published articles whose title case-insensitively contains the search term, sorted newest-first, paginated 20 per page. Each result is a dict with the article's id, title, and the author's username — and the view must avoid issuing one query per article when reading the author. If the search term is missing or blank, respond 400.
  
  The response body has the shape:
  
      {"results": [...], "page": N, "total_pages": M}
  
  \`Article\` has a ForeignKey \`author\` to the user model, plus \`title\`, \`status\`, \`created_at\` fields.`,
      starterCode: `from django.core.paginator import Paginator
from django.http import JsonResponse, HttpResponseBadRequest
from .models import Article
`,
      testCases: [
        {
          input: 'GET /search?q=django&page=2',
          expectedOutput: 'JSON with results, page, total_pages; uses select_related; bad request when q missing',
          description: 'Filter + paginate + select_related + JSON shape',
        },
      ],
      solution: `from django.core.paginator import Paginator
from django.http import JsonResponse, HttpResponseBadRequest
from .models import Article


def article_search(request):
    q = request.GET.get("q", "").strip()
    if not q:
        return HttpResponseBadRequest("missing q")

    qs = (
        Article.objects
        .filter(title__icontains=q, status="published")
        .select_related("author")
        .order_by("-created_at")
    )
    paginator = Paginator(qs, 20)
    page_obj = paginator.get_page(request.GET.get("page", 1))

    return JsonResponse({
        "results": [
            {"id": a.id, "title": a.title, "author": a.author.username}
            for a in page_obj
        ],
        "page": page_obj.number,
        "total_pages": paginator.num_pages,
    })`,
      explanation: 'Four primitives in one realistic endpoint: input validation (`q` missing → 400), DB query (filter + select_related + order_by), pagination (`Paginator(qs, page_size).get_page(n)` — `get_page` is forgiving of bad page numbers, unlike `.page()`, so the raw query-string value can be passed straight in without an `int()` that would crash on `?page=abc`), and shaping (`JsonResponse` with a list comprehension). `select_related("author")` is critical — without it, the comprehension issues N additional queries (one per article) for `a.author.username`.',
      hints: [
        'Paginator.get_page is forgiving; .page() is strict',
        'select_related("author") for FK access in the loop',
        'JsonResponse takes a dict — auto-sets content type',
        'Validate input before hitting the DB',
      ],
      tags: ['django', 'views', 'JsonResponse', 'Paginator', 'select_related', 'advanced'],
      concepts: ['dj-view-patterns', 'dj-select-related-vs-prefetch'],
    },
// ===== Layer A: in-place advanced single-skill primitives (depth) =====
// redirect() shortcut
{
      id: 'dj-views-redirect-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'After handling a successful POST, you want the browser to navigate to a different view instead of rendering HTML inline. Which Django shortcut issues that navigation, and what does it accept?',
      options: [
        { id: 'a', text: '`redirect()` — returns a 302 to a URL string, a named URL pattern (with args/kwargs), or a model instance via its `get_absolute_url()`', isCorrect: true },
        { id: 'b', text: '`render()` — returns a 302 to a URL string, a named URL pattern (with args/kwargs), or a model instance via its `get_absolute_url()`', isCorrect: false },
        { id: 'c', text: '`reverse()` — returns a 302 response that points the browser at the resolved URL path for a named pattern', isCorrect: false },
        { id: 'd', text: '`HttpResponse()` — returns a 301 to a URL string, a named URL pattern, or a model instance with a `get_absolute_url()`', isCorrect: false },
      ],
      explanation: '`redirect(to, *args, **kwargs)` builds an `HttpResponseRedirect` (status 302). `to` can be a URL string, a view name (resolved with the extra args/kwargs, like `redirect("post-detail", pk=5)`), or a model instance (it calls the instance\'s `get_absolute_url()`). `reverse()` only builds the URL *string* — you would still have to wrap it in a redirect response. `render()` returns a 200 with HTML, not a navigation.',
      hints: [
        'redirect() builds an HttpResponseRedirect (302)',
        'It accepts a URL, a view name + args, or a model instance',
        'reverse() only returns the URL string, not a response',
      ],
      tags: ['django', 'views', 'redirect', 'HttpResponseRedirect', '302'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-redirect-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the shortcut that sends the browser to the named "post-detail" route after archiving.',
      template: `from django.shortcuts import get_object_or_404, redirect
from .models import Post

def archive(request, pk):
    post = get_object_or_404(Post, pk=pk)
    post.archived = True
    post.save()
    return ___("post-detail", pk=post.pk)`,
      blanks: ['redirect'],
      solution: 'from django.shortcuts import get_object_or_404, redirect\nfrom .models import Post\n\ndef archive(request, pk):\n    post = get_object_or_404(Post, pk=pk)\n    post.archived = True\n    post.save()\n    return redirect("post-detail", pk=post.pk)',
      explanation: '`redirect("post-detail", pk=post.pk)` resolves the named URL with the given kwargs and returns a 302. After a state-changing POST this is the canonical move (the Post/Redirect/Get pattern) — it prevents a browser refresh from re-submitting the form.',
      hints: ['redirect(view_name, **url_kwargs)', 'Returns a 302 to the resolved URL'],
      tags: ['django', 'views', 'redirect', 'named-url', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-redirect-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function-based view `publish(request, pk)` that fetches a `Post` by `pk` (raising 404 if it is missing), sets its `is_published` field to `True`, saves it, and then sends the browser to that post\'s detail page, whose URL is named `"post-detail"` and takes the post\'s `pk`. Use the fetch-or-404 shortcut and the redirect shortcut — do not render a template.',
      starterCode: `from django.shortcuts import get_object_or_404, redirect
from .models import Post
`,
      testCases: [
        {
          input: 'publish(request, pk=5) on an existing post',
          expectedOutput: 'sets is_published, saves, returns redirect("post-detail", pk=5)',
          description: 'fetch-or-404 → mutate → save → 302 to named detail URL',
        },
      ],
      solution: `from django.shortcuts import get_object_or_404, redirect
from .models import Post

def publish(request, pk):
    post = get_object_or_404(Post, pk=pk)
    post.is_published = True
    post.save()
    return redirect("post-detail", pk=post.pk)
# OR
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import get_object_or_404
from .models import Post

def publish(request, pk):
    post = get_object_or_404(Post, pk=pk)
    post.is_published = True
    post.save()
    return HttpResponseRedirect(reverse("post-detail", kwargs={"pk": post.pk}))`,
      explanation: '`redirect("post-detail", pk=post.pk)` is shorthand for `HttpResponseRedirect(reverse("post-detail", kwargs={"pk": post.pk}))`. Redirecting after a successful write (instead of rendering) is the Post/Redirect/Get pattern — refreshing the resulting page re-issues a harmless GET rather than re-POSTing.',
      hints: [
        'get_object_or_404(Post, pk=pk) first',
        'Mutate the field, then .save()',
        'redirect("post-detail", pk=post.pk) returns the 302',
      ],
      tags: ['django', 'views', 'redirect', 'get_object_or_404', 'post-redirect-get'],
      concepts: ['dj-view-patterns'],
    },
// HTTP-method restriction decorators (not auth)
{
      id: 'dj-views-require-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'You want a view to accept only POST and reject every other verb with the correct status automatically — without hand-writing `if request.method != "POST"`. Which tool does this, and what status do rejected verbs receive?',
      options: [
        { id: 'a', text: 'The `@require_POST` decorator (or `@require_http_methods(["POST"])`) — other verbs get an automatic 405 Method Not Allowed', isCorrect: true },
        { id: 'b', text: 'The `@require_POST` decorator (or `@require_http_methods(["POST"])`) — other verbs get an automatic 403 Forbidden response', isCorrect: false },
        { id: 'c', text: 'The `@csrf_protect` decorator — it inspects the verb and returns a 400 Bad Request for anything that is not POST', isCorrect: false },
        { id: 'd', text: 'The `@require_safe` decorator — it allows only POST and returns a 401 Unauthorized for other verbs', isCorrect: false },
      ],
      explanation: '`django.views.decorators.http` provides `require_http_methods(["POST"])` plus the shortcuts `require_POST`, `require_GET`, and `require_safe`. A disallowed verb yields `HttpResponseNotAllowed`, which is **405 Method Not Allowed** (with an `Allow` header listing permitted verbs). 403/401/400 are for authorization/auth/malformed-request cases, not wrong-verb. `csrf_protect`/`require_safe` are unrelated tools.',
      hints: [
        'require_POST / require_http_methods live in django.views.decorators.http',
        'Wrong verb → 405 Method Not Allowed, not 403/400',
        'The response carries an Allow header',
      ],
      tags: ['django', 'views', 'require_POST', 'require_http_methods', '405'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-require-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'A GET request hits this POST-only view. What status code does the client see?',
      code: `from django.views.decorators.http import require_POST
from django.http import HttpResponse

@require_POST
def create(request):
    return HttpResponse("created")

# Client sends GET /create
response = create(get_request)   # get_request.method == "GET"
print(response.status_code)`,
      expectedOutput: `405`,
      explanation: '`@require_POST` wraps the view so any non-POST verb short-circuits to `HttpResponseNotAllowed(["POST"])` — status **405 Method Not Allowed** — and the view body never runs. The response also carries an `Allow: POST` header so the client knows which verbs are accepted.',
      hints: ['require_POST rejects non-POST before the body runs', 'HttpResponseNotAllowed = 405'],
      tags: ['django', 'views', 'require_POST', 'status-code', 'predict'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-require-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Restrict this view to GET and POST only (any other verb → 405). Fill the decorator.',
      template: `from django.views.decorators.http import require_http_methods
from django.http import HttpResponse

@___(["GET", "POST"])
def submit(request):
    return HttpResponse("ok")`,
      blanks: ['require_http_methods'],
      solution: 'from django.views.decorators.http import require_http_methods\nfrom django.http import HttpResponse\n\n@require_http_methods(["GET", "POST"])\ndef submit(request):\n    return HttpResponse("ok")',
      explanation: '`@require_http_methods([...])` takes an explicit allow-list of verbs; anything outside it returns 405. `@require_GET` / `@require_POST` are the common single-verb shortcuts built on top of it.',
      hints: ['The decorator takes a list of allowed verb strings', 'Outside the list → 405'],
      tags: ['django', 'views', 'require_http_methods', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
// JsonResponse(safe=False) for a list
{
      id: 'dj-views-json-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: '`JsonResponse({"a": 1})` works, but `JsonResponse([1, 2, 3])` raises a `TypeError` by default. Why, and how do you serialize a top-level list?',
      options: [
        { id: 'a', text: 'It defaults to `safe=True`, which only allows a dict at the top level; pass `safe=False` to serialize a list', isCorrect: true },
        { id: 'b', text: 'It defaults to `safe=True`, which only allows a list at the top level; pass `safe=False` to serialize a dict', isCorrect: false },
        { id: 'c', text: 'It only accepts already-serialized strings, so call `json.dumps` on the list first and then pass it in', isCorrect: false },
        { id: 'd', text: 'It defaults to `safe=False`, which blocks lists for security; pass `safe=True` to opt back into allowing them', isCorrect: false },
      ],
      explanation: '`JsonResponse` defaults to `safe=True`, which **rejects anything that is not a dict** at the top level. This guards against a historical JSON-array CSRF exploit. To return a top-level array, pass `safe=False`: `JsonResponse([...], safe=False)`. You do not need to call `json.dumps` yourself — `JsonResponse` serializes the object and sets `Content-Type: application/json`.',
      hints: [
        'safe=True (default) only permits a dict at the top level',
        'safe=False to return a top-level list/array',
        'JsonResponse serializes for you — no manual json.dumps',
      ],
      tags: ['django', 'views', 'JsonResponse', 'safe', 'json'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-json-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Return a JSON array of tag dicts. Fill the keyword that lets a top-level list serialize.',
      template: `from django.http import JsonResponse
from .models import Tag

def api_tags(request):
    tags = Tag.objects.values("id", "label")
    return JsonResponse(list(tags), ___=False)`,
      blanks: ['safe'],
      solution: 'from django.http import JsonResponse\nfrom .models import Tag\n\ndef api_tags(request):\n    tags = Tag.objects.values("id", "label")\n    return JsonResponse(list(tags), safe=False)',
      explanation: '`.values(...)` yields a queryset of dicts; wrapping it in `list(...)` gives a top-level array, which `JsonResponse` only serializes when `safe=False` is passed.',
      hints: ['The keyword is the one that bypasses the dict-only guard', 'safe=False'],
      tags: ['django', 'views', 'JsonResponse', 'safe', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
// request.FILES upload
{
      id: 'dj-views-upload-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'A user submits an HTML form that includes a file input. In the view, where does the uploaded file appear, and what must the form specify for the upload to arrive?',
      options: [
        { id: 'a', text: 'In `request.FILES`; the `<form>` must set `enctype="multipart/form-data"`', isCorrect: true },
        { id: 'b', text: 'In `request.POST`; the `<form>` must set `enctype="multipart/form-data"`', isCorrect: false },
        { id: 'c', text: 'In `request.FILES`; the `<form>` must set `method="get"` so the bytes stream in the URL', isCorrect: false },
        { id: 'd', text: 'In `request.body`; the `<form>` needs no special encoding for file inputs', isCorrect: false },
      ],
      explanation: 'Uploaded files arrive in `request.FILES` (a `MultiValueDict` of `UploadedFile` objects), keyed by the input\'s `name`. Regular text fields stay in `request.POST`. The browser only includes the file bytes if the `<form>` declares `enctype="multipart/form-data"` and uses `method="post"` — without that encoding, only the filename string is sent.',
      hints: [
        'Files → request.FILES; text fields → request.POST',
        'The form needs enctype="multipart/form-data" and method="post"',
      ],
      tags: ['django', 'views', 'request.FILES', 'upload', 'multipart'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-upload-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Read an uploaded file and stream it to disk without loading it all into memory. Fill the request attribute and the streaming-iterator method.',
      template: `def upload(request):
    incoming = request.___["document"]
    with open(f"/media/{incoming.name}", "wb") as dest:
        for chunk in incoming.___():
            dest.write(chunk)`,
      blanks: ['FILES', 'chunks'],
      solution: 'def upload(request):\n    incoming = request.FILES["document"]\n    with open(f"/media/{incoming.name}", "wb") as dest:\n        for chunk in incoming.chunks():\n            dest.write(chunk)',
      explanation: '`request.FILES["document"]` is an `UploadedFile`. Iterating `.chunks()` yields the file in fixed-size pieces (default 64 KB) so a large upload never loads fully into RAM. Reading `.read()` instead would buffer the whole file.',
      hints: ['Uploaded files live on request.FILES', '.chunks() iterates fixed-size pieces'],
      tags: ['django', 'views', 'request.FILES', 'chunks', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-upload-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function-based view `upload_avatar(request)` that handles a file upload. If the request is not a POST, or no file was sent under the key `"avatar"`, respond with a 400. Otherwise take the uploaded file from the request\'s file mapping, write it under `"/media/avatars/"` joined with the uploaded file\'s name, streaming it to disk in chunks so large files do not load fully into memory, then return a plain-text response confirming the saved filename.',
      starterCode: `from django.http import HttpResponse, HttpResponseBadRequest
`,
      testCases: [
        {
          input: 'POST with an "avatar" file',
          expectedOutput: 'streams file to /media/avatars/<name> in chunks; 400 when missing/not POST',
          description: 'method+presence guard → chunked write → confirmation',
        },
      ],
      solution: `from django.http import HttpResponse, HttpResponseBadRequest

def upload_avatar(request):
    if request.method != "POST":
        return HttpResponseBadRequest("POST required")
    incoming = request.FILES.get("avatar")
    if not incoming:
        return HttpResponseBadRequest("no file")
    destination = "/media/avatars/" + incoming.name
    with open(destination, "wb") as out:
        for chunk in incoming.chunks():
            out.write(chunk)
    return HttpResponse(f"saved {incoming.name}")`,
      explanation: 'Two guards first: wrong verb and missing file both return `HttpResponseBadRequest` (400). `request.FILES.get("avatar")` is `None` when the field is absent, so `if not incoming` catches it. Writing with `.chunks()` streams the upload in 64 KB pieces — critical for large files, which would otherwise be buffered entirely in memory by `.read()`.',
      hints: [
        'Guard request.method != "POST" → 400',
        'request.FILES.get("avatar") is None when missing',
        'Iterate .chunks() to stream to disk',
      ],
      tags: ['django', 'views', 'request.FILES', 'chunks', 'upload', 'advanced'],
      concepts: ['dj-view-patterns'],
    },
// Custom headers / content_type
{
      id: 'dj-views-headers-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      question: 'You return CSV text from a view and want the browser to download it as a named file rather than display it. How do you set the content type and the download filename?',
      options: [
        { id: 'a', text: 'Pass `content_type="text/csv"` to `HttpResponse`, then set `response["Content-Disposition"] = \'attachment; filename="x.csv"\'`', isCorrect: true },
        { id: 'b', text: 'Pass `mimetype="text/csv"` to `HttpResponse`, then call `response.headers.add("Content-Disposition", ...)`', isCorrect: false },
        { id: 'c', text: 'Call `HttpResponse.as_download("text/csv")` and pass the desired filename as the second positional argument', isCorrect: false },
        { id: 'd', text: 'Set `request.content_type = "text/csv"` and add a `Content-Disposition` entry to `request.META`', isCorrect: false },
      ],
      explanation: 'An `HttpResponse` behaves like a dict for headers: `response["Header-Name"] = value`. Pass `content_type="text/csv"` to the constructor, then set `response["Content-Disposition"] = \'attachment; filename="x.csv"\'` to make the browser download it. The old `mimetype=` kwarg was removed years ago; there is no `as_download` helper; and you set headers on the *response*, never on `request.META` (which holds *incoming* metadata).',
      hints: [
        'Set headers via response["Header"] = value',
        'content_type= is a constructor kwarg (not mimetype=)',
        'Content-Disposition: attachment triggers a download',
      ],
      tags: ['django', 'views', 'content_type', 'Content-Disposition', 'headers'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-headers-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_VIEWS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Return CSV as a browser download. Fill the constructor keyword and the response header name.',
      template: `from django.http import HttpResponse

def export_csv(request, body):
    response = HttpResponse(body, ___="text/csv")
    response[___] = 'attachment; filename="report.csv"'
    return response`,
      blanks: ['content_type', '"Content-Disposition"'],
      solution: 'from django.http import HttpResponse\n\ndef export_csv(request, body):\n    response = HttpResponse(body, content_type="text/csv")\n    response["Content-Disposition"] = \'attachment; filename="report.csv"\'\n    return response',
      explanation: 'The `content_type=` constructor kwarg sets the MIME type; assigning `response["Content-Disposition"]` adds the header that tells the browser to download (`attachment`) under the given filename.',
      hints: ['Constructor kwarg for the MIME type', 'Header key is "Content-Disposition"'],
      tags: ['django', 'views', 'content_type', 'Content-Disposition', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
];
