/**
 * Topic.DJ_URLS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendGapQuestions.ts (3), backendQuestions.ts (1), djangoBatchCExpansionQuestions.ts (6)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_urls_questions: Question[] = [
  {
      id: 'dj-url-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_URLS,
      course: Course.BACKEND,
      question: 'What is the purpose of the "name" parameter in Django URL patterns?',
      options: [
        { id: 'a', text: 'It sets the page title shown in the browser tab for that view', isCorrect: false },
        { id: 'b', text: 'It is purely documentation — Django ignores it at runtime', isCorrect: false },
        { id: 'c', text: 'It creates a redirect from the old URL to the new one', isCorrect: false },
        { id: 'd', text: 'It lets templates and code reference URLs by name instead of hardcoding paths', isCorrect: true },
      ],
      explanation: 'Named URLs decouple your code from URL paths — {% url "name" %} in templates and reverse("name") in code. If you change "/articles/" to "/posts/", you only change the path() call — all {% url "article-list" %} and reverse("article-list") references still work. Never hardcode URL paths.',
      tags: ['urls', 'named-urls', 'reverse', 'django'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'py-dj-urls-path-basic',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_URLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a basic `urlpatterns` with two routes: `""` (empty path) → `views.home` with name `"home"`, and `"about/"` → `views.about` with name `"about"`. Import `path` from `django.urls` and `views` from the current package.',
      starterCode: `# Import path and views, then build the urlpatterns list with
# two path() entries: empty route → views.home (name "home"),
# "about/" → views.about (name "about").
`,
      testCases: [
        {
          input: 'basic urlpatterns list',
          expectedOutput: 'path() calls with name= each',
          description: 'path(route, view, name=...)',
        },
      ],
      solution: `from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("about/", views.about, name="about"),
]`,
      explanation: '`path(route, view, name=...)` is the building block. Trailing slash is a Django convention — `APPEND_SLASH=True` in settings redirects `/about` to `/about/`. Naming URLs (`name="about"`) lets templates and code reference them symbolically via `{% url "about" %}` or `reverse("about")` — change the path without breaking anything.',
      hints: [
        'path(route, view, name=...) — name enables reverse lookups',
        'Trailing slash is the Django convention',
        'Reference by name: {% url "about" %} or reverse("about")',
      ],
      tags: ['django', 'urls', 'path'],
      concepts: ['dj-view-patterns', 'py-pathlib'],
    },
  {
      id: 'py-dj-urls-converters',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_URLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use path converters to capture typed URL parameters. Build a `urlpatterns` list with three routes: `"posts/<int:pk>/"` handled by `views.post_detail` named `"post-detail"`; `"posts/<slug:slug>/"` handled by `views.post_by_slug` named `"post-by-slug"`; and `"archive/<int:year>/<int:month>/"` handled by `views.archive` named `"archive"`. The captured params arrive as keyword args to the view.',
      starterCode: `# urlpatterns with three path() calls using:
#   <int:pk>
#   <slug:slug>
#   <int:year>/<int:month>
`,
      testCases: [
        {
          input: 'path converters',
          expectedOutput: 'Typed captures int/slug that are passed as kwargs',
          description: '<type:name> inside path()',
        },
      ],
      solution: `from django.urls import path
from . import views

urlpatterns = [
    path("posts/<int:pk>/", views.post_detail, name="post-detail"),
    path("posts/<slug:slug>/", views.post_by_slug, name="post-by-slug"),
    path("archive/<int:year>/<int:month>/", views.archive, name="archive"),
]`,
      explanation: 'Built-in converters: `int`, `str` (default — no slashes), `slug` (letters/numbers/hyphens), `uuid`, `path` (matches everything including slashes — use sparingly). Capture name after the colon becomes the kwarg passed to the view: `def post_detail(request, pk): ...`. For custom formats (e.g. YYYY-MM-DD) register a `register_converter()` class.',
      hints: [
        'Built-ins: int, str, slug, uuid, path',
        '<type:name> — the name becomes a kwarg to the view',
        'Custom formats: register_converter()',
      ],
      tags: ['django', 'urls', 'converters'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'py-dj-urls-include',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_URLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use `include()` to mount app-level URLs under a prefix. In the project `mysite/urls.py`, build `urlpatterns` with two routes: `"admin/"` serving the admin site (`admin.site.urls`), and `"blog/"` pulling in everything from `blog/urls.py` via `include()` so every blog URL is served under `/blog/...`. Import `admin` from `django.contrib` and `path` / `include` from `django.urls`.',
      starterCode: `# Build urlpatterns with two routes:
# "admin/" → the admin site, and
# "blog/" → all of blog/urls.py mounted via include().
`,
      testCases: [
        {
          input: 'project urlpatterns with include',
          expectedOutput: 'admin mounted at /admin/, blog app mounted at /blog/',
          description: 'include() delegates a URL tree to an app',
        },
      ],
      solution: `from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("blog/", include("blog.urls")),
]`,
      explanation: '`include()` mounts an entire URL tree under a prefix — keeps each app\'s URL config local to the app. If `blog/urls.py` has `path("<slug>/", ...)`, the final URL is `/blog/<slug>/`. You can also include an imported list directly: `include([path(...)])`. This is also where you set up API versioning: `path("api/v1/", include("myapp.api.v1.urls"))`.',
      hints: [
        'include("app.urls") mounts the entire tree',
        'Prefix in parent + route in child = final URL',
        'Also accepts a list directly for one-file composition',
      ],
      tags: ['django', 'urls', 'include'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'py-dj-urls-namespace',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_URLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Set `app_name` to namespace an app\'s URL names. In `blog/urls.py`, set the module-level `app_name` string to `"blog"` and build `urlpatterns` with two routes: the empty string path handled by `views.index` named `"index"`, and `"<int:pk>/"` handled by `views.detail` named `"detail"`. Templates then reference them as `{% url "blog:index" %}` and `{% url "blog:detail" post.pk %}` — no collision with other apps\' `index` / `detail` names.',
      starterCode: `# Set the module-level app_name, then build urlpatterns:
# empty route → views.index (name "index"),
# int pk route → views.detail (name "detail").
`,
      testCases: [
        {
          input: 'app_name namespacing',
          expectedOutput: 'URLs addressable as "blog:index" / "blog:detail"',
          description: 'app_name namespaces name= across the app',
        },
      ],
      solution: `from django.urls import path
from . import views

app_name = "blog"

urlpatterns = [
    path("", views.index, name="index"),
    path("<int:pk>/", views.detail, name="detail"),
]`,
      explanation: 'Without `app_name`, two apps both defining `name="index"` will clash — Django picks whichever was registered last, silently. `app_name = "blog"` scopes names to `blog:index`, `blog:detail`. Templates: `{% url "blog:detail" post.pk %}`. Code: `reverse("blog:detail", args=[pk])`. For nested includes, use `namespace="..."` on `include()` when including a third-party app you don\'t control.',
      hints: [
        'app_name namespaces URL names to avoid collisions',
        'Reference: "blog:detail" in templates and code',
        'Third-party: include(..., namespace="blog")',
      ],
      tags: ['django', 'urls', 'namespace', 'app_name'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'py-dj-urls-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_URLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the import for regex-based routing and the pattern that matches exactly four digits.',
      template: `from django.urls import ___

urlpatterns = [
    re_path(r"^year/(?P<year>___)/$", views.year_archive),
]`,
      blanks: ['re_path', '\\d{4}'],
      solution:
        'from django.urls import re_path\n\nurlpatterns = [\n    re_path(r"^year/(?P<year>\\d{4})/$", views.year_archive),\n]',
      explanation:
        '`re_path` is imported from `django.urls`, same place as `path`. `(?P<year>...)` is a named group; `\\d{4}` inside it matches exactly four digits — useful for fixed-length numeric segments that `path`\'s built-in converters can\'t express directly.',
      hints: ['Import re_path from django.urls, same place as path', '\\d{4} matches exactly four digits'],
      tags: ['django', 'urls', 're_path', 'regex', 'cloze'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-dj-urls-re-path',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_URLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use `re_path` when a URL needs regex matching that `path` converters don\'t support. Import `re_path` from `django.urls` and build `urlpatterns` with one route handled by `views.year_archive`: it should match URLs like `year/2024/` — anchored at both ends, with the 4-digit year captured into a named group called `year`. Useful when you need a specific character range, an alternation, or an optional segment that path converters can\'t express.',
      starterCode: `# One re_path route: anchored regex matching year/<4 digits>/,
# the digits captured into a named group "year", handled by views.year_archive.
`,
      testCases: [
        {
          input: 're_path with regex named group',
          expectedOutput: 'URL /year/<4 digits>/ captured as year kwarg',
          description: 're_path for when path converters are insufficient',
        },
      ],
      solution: `from django.urls import re_path
from . import views

urlpatterns = [
    re_path(r"^year/(?P<year>\\d{4})/$", views.year_archive),
]`,
      explanation: '`re_path` is Django\'s older URL router, using Python regex with named groups. Prefer `path` + built-in converters whenever possible — more readable, faster. Use `re_path` for: exact length constraints (`\\d{4}`), character alternations (`(v1|v2)`), optional segments, anything with `^`/`$` anchors. Avoid trying to be clever — overloaded regex URLs become unmaintainable.',
      hints: [
        'Prefer path() + converters when possible',
        're_path for fixed-length digits, alternations, optional segments',
        '(?P<name>...) named groups become view kwargs',
      ],
      tags: ['django', 'urls', 're_path', 'regex'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-dj-urls-reverse',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_URLS,
      course: Course.BACKEND,
      question: 'Why should you never hardcode URL strings in templates and views?',
      options: [
        { id: 'a', text: 'No real reason — hardcoded URL strings behave identically in practice', isCorrect: false },
        { id: 'b', text: 'Hardcoded paths break silently when routes change; `reverse()` / `{% url %}` update automatically', isCorrect: true },
        { id: 'c', text: 'Hardcoded URLs are slower because Django can\'t cache the route lookup', isCorrect: false },
        { id: 'd', text: 'URLs built with `reverse()` are signed, preventing tampering by clients', isCorrect: false },
      ],
      explanation: '`reverse()` / `{% url %}` are the inverse of URL routing: "given the name and args, build the URL". With `reverse("name", args=[...])` in Python and `{% url "name" arg %}` in templates, URL changes happen in ONE place (urls.py) and every reference follows — essential for refactors, API versioning, moving apps under a prefix. Also used: `HttpResponseRedirect(reverse("blog:detail", args=[pk]))`, `reverse_lazy` for class-level attributes that need URL resolution before app ready (`success_url = reverse_lazy("blog:index")`). Grep-check before shipping: `grep -r "/blog/" templates/` — any hits are bugs waiting to happen.',
      hints: [
        'reverse("name", args=[...]) builds URLs from names',
        '{% url "name" arg %} in templates',
        'reverse_lazy for class-level attributes',
      ],
      tags: ['django', 'urls', 'reverse', 'url-tag'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'py-dj-urls-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_URLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble a basic app urls.py: import path, import the app views, then a urlpatterns list with the home route ("" → views.home, name "home") FIRST and the about route ("about/" → views.about, name "about") second.',
      correctOrder: [
        'from django.urls import path',
        'from . import views',
        '',
        'urlpatterns = [',
        '    path("", views.home, name="home"),',
        '    path("about/", views.about, name="about"),',
        ']',
      ],
      distractorLines: [
        '    path(views.home, "", name="home"),',
        'urlpatterns = {',
      ],
      solution:
        'from django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path("", views.home, name="home"),\n    path("about/", views.about, name="about"),\n]',
      explanation:
        'path(route, view, name=...) — route string first, then the view callable, then the name. urlpatterns is a list. Swapping route and view (path(views.home, "")) is the classic mistake.',
      hints: ['path(route, view, name=...); urlpatterns is a list.'],
      tags: ['django', 'urls', 'path'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'py-dj-urls-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_URLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble a project urls.py that mounts the admin at "admin/" FIRST, then delegates "blog/" to the blog app with include(). Import admin from django.contrib and path, include from django.urls.',
      correctOrder: [
        'from django.contrib import admin',
        'from django.urls import path, include',
        '',
        'urlpatterns = [',
        '    path("admin/", admin.site.urls),',
        '    path("blog/", include("blog.urls")),',
        ']',
      ],
      distractorLines: [
        '    path("blog/", "blog.urls"),',
        'from django.urls import path',
      ],
      solution:
        'from django.contrib import admin\nfrom django.urls import path, include\n\nurlpatterns = [\n    path("admin/", admin.site.urls),\n    path("blog/", include("blog.urls")),\n]',
      explanation:
        'include("blog.urls") mounts the app\'s entire URL tree under the "blog/" prefix — you must call include(), not pass the dotted path as a bare string. include also has to be imported alongside path.',
      hints: ['include("app.urls") wraps the child urlconf; import path AND include.'],
      tags: ['django', 'urls', 'include'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'py-dj-urls-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_URLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the path converter that captures an integer primary key (passed to the view as the kwarg `pk`).',
      template: `urlpatterns = [
    path("posts/<___:pk>/", views.post_detail, name="post-detail"),
]`,
      blanks: ['int'],
      solution:
        'urlpatterns = [\n    path("posts/<int:pk>/", views.post_detail, name="post-detail"),\n]',
      explanation:
        'Built-in converters: int, str, slug, uuid, path. <int:pk> matches digits and passes pk as an int kwarg to the view. The name after the colon (pk) is the kwarg name.',
      hints: ['Converter for whole numbers.'],
      tags: ['django', 'urls', 'converters'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'py-dj-urls-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_URLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the call that mounts the blog app\'s URL tree under the "blog/" prefix.',
      template: `urlpatterns = [
    path("blog/", ___("blog.urls")),
]`,
      blanks: ['include'],
      solution:
        'urlpatterns = [\n    path("blog/", include("blog.urls")),\n]',
      explanation:
        'include() delegates a URL subtree to another urlconf module. Passing the dotted string without include() is a common error — Django expects a view or an include(), not a raw module path.',
      hints: ['The function that pulls in another urls.py.'],
      tags: ['django', 'urls', 'include'],
      concepts: ['dj-view-patterns'],
    },
  {
      id: 'py-dj-urls-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_URLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the module-level variable that namespaces this app\'s URL names so they are addressed as "blog:index", "blog:detail", etc.',
      template: `# blog/urls.py
___ = "blog"

urlpatterns = [
    path("", views.index, name="index"),
]`,
      blanks: ['app_name'],
      solution:
        '# blog/urls.py\napp_name = "blog"\n\nurlpatterns = [\n    path("", views.index, name="index"),\n]',
      explanation:
        'Setting app_name at the top of a urlconf namespaces every name in it, so two apps can both define name="index" without clashing. Reference as {% url "blog:index" %} or reverse("blog:index").',
      hints: ['Module-level string, two words joined by an underscore.'],
      tags: ['django', 'urls', 'namespace', 'app_name'],
      concepts: ['dj-view-patterns'],
    },
];
