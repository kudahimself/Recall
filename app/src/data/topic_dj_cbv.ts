import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_cbv_questions: Question[] = [
{
      id: 'be-dj-cbv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a class-based view "ArticleListView" using Django\'s ListView that displays all articles ordered by published_date descending, with a template "articles/list.html" and 10 items per page.',
      starterCode: `# Define ArticleListView(ListView): set the model, template
# "articles/list.html", a context name of "articles", newest-published
# ordering, and 10 per page (use the standard ListView attributes).
`,
      testCases: [
        {
          input: 'ArticleListView',
          expectedOutput: 'ListView with model, template_name, ordering, paginate_by',
          description: 'Should create ListView with pagination',
        },
      ],
      solution: `from django.views.generic import ListView\nfrom .models import Article\n\nclass ArticleListView(ListView):\n    model = Article\n    template_name = "articles/list.html"\n    context_object_name = "articles"\n    ordering = ["-published_date"]\n    paginate_by = 10`,
      explanation: 'ListView handles: querying the model, paginating results, rendering a template. model = what to query. ordering = ORDER BY. paginate_by = items per page. context_object_name = template variable name. Much less boilerplate than function-based views.',
      hints: ['model for automatic queryset', 'ordering with - prefix for descending', 'paginate_by for automatic pagination'],
      tags: ['listview', 'cbv', 'pagination', 'django'],
      concepts: ['dj-view-patterns', 'dj-pagination-strategy'],
    },
{
      id: 'dj-views-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Configure a generic ListView for Article with paginate_by 20 and a custom context name.',
      template: `from django.views.generic import ListView

class ArticleListView(___):
    model = Article
    template_name = "articles/list.html"
    ___ = "articles"
    ___ = 20`,
      blanks: ['ListView', 'context_object_name', 'paginate_by'],
      solution: 'from django.views.generic import ListView\n\nclass ArticleListView(ListView):\n    model = Article\n    template_name = "articles/list.html"\n    context_object_name = "articles"\n    paginate_by = 20',
      explanation: 'Django\'s generic CBVs use specific class attribute names: `context_object_name` renames the default `object_list` and `paginate_by` enables pagination (with `is_paginated`, `page_obj` available in the template).',
      hints: ['Inherit from ListView', 'context_object_name renames object_list', 'paginate_by triggers pagination'],
      tags: ['django', 'views', 'ListView', 'paginate_by', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj4e-cbv-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      question: 'What are Django\'s generic class-based views (CBVs), and why use them over function-based views?',
      options: [
        { id: 'a', text: 'CBVs run faster at request time, while FBVs are merely easier to write', isCorrect: false },
        { id: 'b', text: 'CBVs are required for REST APIs, while FBVs only serve HTML pages', isCorrect: false },
        { id: 'c', text: 'Generic CBVs give you pre-built CRUD behaviour; FBVs are simpler for one-off custom logic', isCorrect: true },
        { id: 'd', text: 'CBVs cannot be customised at all, so FBVs are the only flexible option', isCorrect: false },
      ],
      explanation: 'Generic CBVs (`ListView`, `DetailView`, `CreateView`, `UpdateView`, `DeleteView`) implement common patterns with minimal code — just set `model` and `template_name`. They handle queryset, pagination, form handling, and redirects automatically. FBVs are simpler for custom or one-off logic. CBVs shine for standard CRUD — less repetition, more consistent.',
      hints: [
        'CBVs = less boilerplate for standard CRUD; FBVs = more control for custom logic',
        '`ListView`, `DetailView`, `CreateView`, `UpdateView`, `DeleteView` are the main ones',
      ],
      tags: ['django', 'CBV', 'generic-views', 'CRUD', 'ListView', 'class-based-views'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj4e-cbv-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Convert this function-based view into a `ListView` CBV. The FBV lists all `Article` objects. Set `model`, `template_name`, and `context_object_name`.',
      starterCode: `# Convert the FBV into ArticleListView(ListView): set model, template_name
# "articles/list.html", and context_object_name "articles". Wire it in
# urls.py with ArticleListView.as_view().
`,
      testCases: [
        { input: 'ArticleListView.model.__name__', expectedOutput: 'Article', description: 'model should be Article' },
      ],
      solution: `from django.views.generic import ListView

class ArticleListView(ListView):
    model = Article
    template_name = 'articles/list.html'
    context_object_name = 'articles'

# In urls.py:
# path('articles/', ArticleListView.as_view(), name='article-list')`,
      explanation: '`ListView` automatically calls `Article.objects.all()` and passes it to the template. `context_object_name = "articles"` names the variable in the template (default would be `article_list`). Note `as_view()` in urls.py — CBVs must be converted to a callable. You can override `get_queryset()` to customise filtering.',
      hints: [
        'Set `model`, `template_name`, and `context_object_name` as class attributes',
        'Use `as_view()` in urls.py: `ArticleListView.as_view()`',
      ],
      tags: ['django', 'CBV', 'ListView', 'generic-views', 'class-based-views'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj4e-cbv-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a `CreateView` for an `Article` model with fields `title` and `body`. Set `success_url` to redirect to `/articles/` after creation. Add `login_required` using `LoginRequiredMixin`.',
      starterCode: `# Define ArticleCreateView(LoginRequiredMixin, CreateView): model Article,
# form fields title and body, template "articles/create.html", and a
# success_url that reverse_lazy-resolves the "article-list" URL.
`,
      testCases: [
        { input: 'ArticleCreateView.fields', expectedOutput: "['title', 'body']", description: 'fields should include title and body' },
      ],
      solution: `from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import CreateView
from django.urls import reverse_lazy

class ArticleCreateView(LoginRequiredMixin, CreateView):
    model = Article
    fields = ['title', 'body']
    template_name = 'articles/create.html'
    success_url = reverse_lazy('article-list')`,
      explanation: '`CreateView` handles GET (render empty form) and POST (validate, save, redirect) automatically. `fields` lists which model fields appear in the form. `LoginRequiredMixin` (always first in MRO) redirects unauthenticated users. `reverse_lazy` is needed because URLs aren\'t loaded at class definition time. Override `form_valid()` to set the owner: `form.instance.owner = self.request.user`.',
      hints: [
        '`LoginRequiredMixin` must be first in the inheritance list',
        'Use `reverse_lazy("url-name")` not `reverse()` for class-level attributes',
      ],
      tags: ['django', 'CBV', 'CreateView', 'LoginRequiredMixin', 'generic-views', 'forms'],
      concepts: ['dj-view-patterns', 'dj-form-validation'],
    },
{
      id: 'dj4e-cbv-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create `UpdateView` and `DeleteView` for `Article`. The update view should only update `title` and `body`. The delete view should redirect to `/articles/` on success.',
      starterCode: `# Define ArticleUpdateView(UpdateView) (fields title, body) and
# ArticleDeleteView(DeleteView), each with its own template and a
# success_url of reverse_lazy("article-list").
`,
      testCases: [
        { input: 'ArticleUpdateView.fields', expectedOutput: "['title', 'body']", description: 'UpdateView should have correct fields' },
      ],
      solution: `from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy

class ArticleUpdateView(UpdateView):
    model = Article
    fields = ['title', 'body']
    template_name = 'articles/update.html'
    success_url = reverse_lazy('article-list')

class ArticleDeleteView(DeleteView):
    model = Article
    template_name = 'articles/confirm_delete.html'
    success_url = reverse_lazy('article-list')`,
      explanation: '`UpdateView` is like `CreateView` but pre-populates the form with existing data and calls `.save()` on the existing instance. `DeleteView` shows a confirmation page (GET) and deletes on POST — always use a confirmation template to prevent accidental deletion. In urls.py: `path("articles/<int:pk>/edit/", ArticleUpdateView.as_view())`.',
      hints: [
        'Both views need `model`, `template_name`, and `success_url`',
        '`UpdateView` also needs `fields`; `DeleteView` does not',
      ],
      tags: ['django', 'CBV', 'UpdateView', 'DeleteView', 'generic-views', 'CRUD'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj4e-cbv-5',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      question: 'How do you restrict a CBV so only the owner of an object can update or delete it?',
      options: [
        { id: 'a', text: 'Add `owner_required = True` as a class attribute', isCorrect: false },
        { id: 'b', text: 'Use the `@login_required` decorator on the CBV class', isCorrect: false },
        { id: 'c', text: 'Add `permission_classes = [IsOwner]` to the view class', isCorrect: false },
        { id: 'd', text: 'Override `get_queryset()` to filter by `owner=self.request.user`', isCorrect: true },
      ],
      explanation: 'Override `get_queryset()` to filter to the user\'s own objects: `return super().get_queryset().filter(owner=self.request.user)`. If someone accesses `/articles/5/edit/` and article 5 belongs to another user, `get_object()` calls `get_queryset()` first — the object won\'t be found and Django raises a 404. Clean, no explicit ownership check needed.',
      hints: [
        'Override `get_queryset()` to filter by `owner=self.request.user`',
        'Non-owners get a 404 because the object isn\'t in their queryset',
      ],
      tags: ['django', 'CBV', 'ownership', 'get_queryset', 'authorisation', 'security'],
      concepts: ['dj-view-patterns', 'py-security-primitives'],
    },
{
      id: 'dj4e-cbv-6',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a class-based view `ArticleUpdateView` that inherits from both `LoginRequiredMixin` and `UpdateView`. Set its `model` class attribute to `Article`, its `fields` attribute to a list containing "title" and "body", and its `success_url` to a `reverse_lazy` call on the URL name "article-list". Override `get_queryset` so that it calls the parent implementation and then filters the queryset down to objects whose `owner` equals `self.request.user`. Non-owners hitting the edit URL get a 404 automatically because the object is not in their queryset.',
      starterCode: `# Define ArticleUpdateView(LoginRequiredMixin, UpdateView): model Article,
# fields title and body, success_url reverse_lazy("article-list"), and an
# overridden get_queryset that filters the parent queryset to objects
# owned by self.request.user (non-owners then 404).
`,
      testCases: [
        { input: '', expectedOutput: 'get_queryset filters by owner', description: 'Only owner can access update view' },
      ],
      solution: `from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import UpdateView
from django.urls import reverse_lazy

class ArticleUpdateView(LoginRequiredMixin, UpdateView):
    model = Article
    fields = ['title', 'body']
    success_url = reverse_lazy('article-list')

    def get_queryset(self):
        return super().get_queryset().filter(owner=self.request.user)`,
      explanation: 'Overriding `get_queryset()` is the cleanest ownership enforcement pattern for CBVs. `super().get_queryset()` returns `Article.objects.all()` by default — we further filter it to the current user\'s articles. If a non-owner requests `/articles/5/edit/`, the object lookup fails with 404. No explicit `if obj.owner != request.user` check needed.',
      hints: [
        '`super().get_queryset().filter(owner=self.request.user)`',
        'The 404 is automatic — if it\'s not in the queryset, it can\'t be found',
      ],
      tags: ['django', 'CBV', 'get_queryset', 'ownership', 'LoginRequiredMixin', 'UpdateView'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj4e-cbv-7',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      question: 'What is `DetailView` used for, and what context variable does it provide to the template by default?',
      options: [
        { id: 'a', text: 'It shows a list of objects; the template variable is `object_list`', isCorrect: false },
        { id: 'b', text: 'It shows a single object looked up by `pk` or `slug`; the template variable is `object` (or the lowercased model name)', isCorrect: true },
        { id: 'c', text: 'It shows details about the database schema', isCorrect: false },
        { id: 'd', text: 'It is only for the Django admin interface', isCorrect: false },
      ],
      explanation: '`DetailView` fetches a single object using `pk` or `slug` from the URL. It provides two template context variables: `object` (always available) and the lowercased model name (e.g. `article` for an `Article` model). In urls.py: `path("articles/<int:pk>/", ArticleDetailView.as_view())`. Use `context_object_name` to customise the variable name.',
      hints: [
        '`DetailView` needs `<int:pk>` or `<slug:slug>` in the URL pattern',
        'Template variable: `object` or `article` (lowercased model name)',
      ],
      tags: ['django', 'CBV', 'DetailView', 'generic-views', 'template-context'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj4e-cbv-8',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a complete set of CRUD CBVs for an `Article` model: `ArticleListView`, `ArticleDetailView`, `ArticleCreateView`. Show the corresponding `urlpatterns` for each.',
      starterCode: `# Define ArticleListView (ListView), ArticleDetailView (DetailView), and
# ArticleCreateView (LoginRequiredMixin, CreateView) for Article with the
# usual attributes, then the three urlpatterns wiring each via as_view().
`,
      testCases: [
        { input: 'ArticleListView.model.__name__', expectedOutput: 'Article', description: 'ListView uses Article model' },
      ],
      solution: `from django.views.generic import ListView, DetailView
from django.views.generic.edit import CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import path, reverse_lazy

class ArticleListView(ListView):
    model = Article
    template_name = 'articles/list.html'
    context_object_name = 'articles'

class ArticleDetailView(DetailView):
    model = Article
    template_name = 'articles/detail.html'

class ArticleCreateView(LoginRequiredMixin, CreateView):
    model = Article
    fields = ['title', 'body']
    success_url = reverse_lazy('article-list')

urlpatterns = [
    path('articles/', ArticleListView.as_view(), name='article-list'),
    path('articles/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),
    path('articles/new/', ArticleCreateView.as_view(), name='article-create'),
]`,
      explanation: 'All CBVs use `.as_view()` in urlpatterns. `DetailView` and `UpdateView`/`DeleteView` need `<int:pk>` to identify the object. `reverse_lazy` is used instead of `reverse` for class-level `success_url` attributes. `LoginRequiredMixin` on `CreateView` ensures only logged-in users can create articles.',
      hints: [
        'Remember `.as_view()` in urlpatterns — CBVs are classes, not callables',
        '`<int:pk>` in the URL pattern for single-object views',
      ],
      tags: ['django', 'CBV', 'CRUD', 'urls', 'ListView', 'DetailView', 'CreateView'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a class-based ListView for `Article` that uses template `articles/list.html`, paginates by 20, and exposes the queryset as `articles` in the template.',
      correctOrder: [
        'from django.views.generic import ListView',
        'from .models import Article',
        '',
        'class ArticleListView(ListView):',
        '    model = Article',
        '    template_name = "articles/list.html"',
        '    context_object_name = "articles"',
        '    paginate_by = 20',
      ],
      distractorLines: [
        '    template = "articles/list.html"',
        '    queryset = Article',
        '    context_name = "articles"',
        '    pagination = 20',
        'class ArticleListView(View):',
      ],
      solution: 'from django.views.generic import ListView\nfrom .models import Article\n\nclass ArticleListView(ListView):\n    model = Article\n    template_name = "articles/list.html"\n    context_object_name = "articles"\n    paginate_by = 20',
      explanation: 'Generic CBVs use specific class attributes: `template_name` (not `template`), `context_object_name` (default is `object_list`), and `paginate_by` for pagination. Setting `model = Article` lets the view derive the queryset and default template name. Use `as_view()` in `urls.py` to mount it.',
      hints: ['template_name, not template', 'context_object_name renames object_list', 'paginate_by enables pagination'],
      tags: ['django', 'views', 'ListView', 'class-based-view', 'parsons'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-adv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Build a class-based ListView \`PublishedArticlesView\` for the \`Article\` model that combines four primitives:
  
  1. Requires login (use the modern mixin, not the decorator).
  2. Filters \`Article.objects\` to only \`status="published"\`, ordered by \`-created_at\`.
  3. Eager-loads each article's \`author\` (ForeignKey) to avoid N+1.
  4. Paginates by 20 with \`context_object_name="articles"\` and template \`articles/list.html\`.
  
  Override \`get_queryset\` (do not just set \`queryset\`) so the filter is request-aware.`,
      starterCode: `from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView
from .models import Article
`,
      testCases: [
        {
          input: 'GET /articles/ as authenticated user',
          expectedOutput: 'LoginRequiredMixin + ListView + select_related + get_queryset override',
          description: 'Auth + queryset + N+1 avoidance + pagination',
        },
      ],
      solution: `from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView
from .models import Article


class PublishedArticlesView(LoginRequiredMixin, ListView):
    model = Article
    template_name = "articles/list.html"
    context_object_name = "articles"
    paginate_by = 20

    def get_queryset(self):
        return (
            Article.objects
            .filter(status="published")
            .select_related("author")
            .order_by("-created_at")
        )`,
      explanation: 'Mixin order matters: LoginRequiredMixin must come BEFORE ListView (left-to-right MRO) so its `dispatch()` override runs first and bounces unauthenticated users. `get_queryset()` is overridden (not the class-level `queryset`) so the queryset is reconstructed per-request — important if you later filter by `self.request.user`. `select_related("author")` does the JOIN at the SQL level, eliminating one query per article in templates that read `article.author.username`.',
      hints: [
        'LoginRequiredMixin must come BEFORE ListView (MRO order)',
        'Override get_queryset, not class-level queryset, for request-awareness',
        'select_related on FK eliminates N+1 in template loops',
        'paginate_by + context_object_name on the class',
      ],
      tags: ['django', 'views', 'CBV', 'LoginRequiredMixin', 'select_related', 'pagination', 'advanced'],
      concepts: ['dj-view-patterns', 'dj-select-related-vs-prefetch', 'dj-pagination-strategy'],
    },
{
      id: 'dj-views-adv-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Build a CreateView \`ArticleCreateView\` that combines four primitives:
  
  1. Requires login.
  2. Uses \`ArticleForm\` (a ModelForm exposing \`title\` and \`body\`).
  3. Sets the new Article's \`author\` to \`request.user\` automatically — the user does NOT submit the author field. Override \`form_valid\`, attach \`request.user\`, then defer to super().
  4. On success, redirect to the article's detail page using the URL name \`"article_detail"\` and the new article's \`pk\`. Implement via \`get_success_url\`.
  
  The \`Article.author\` field is a ForeignKey to the user model.`,
      starterCode: `from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse
from django.views.generic.edit import CreateView
from .forms import ArticleForm
from .models import Article
`,
      testCases: [
        {
          input: 'authenticated POST with title + body (no author field)',
          expectedOutput: 'form_valid sets author = request.user before super().form_valid()',
          description: 'Set FK from request.user + redirect to detail page',
        },
      ],
      solution: `from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse
from django.views.generic.edit import CreateView
from .forms import ArticleForm
from .models import Article


class ArticleCreateView(LoginRequiredMixin, CreateView):
    model = Article
    form_class = ArticleForm
    template_name = "articles/form.html"

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

    def get_success_url(self):
        return reverse("article_detail", kwargs={"pk": self.object.pk})`,
      explanation: 'The pattern of setting an attribute on `form.instance` before calling `super().form_valid()` is canonical for "the request user owns this row" scenarios — the form never sees the field, so it can\'t be tampered with. `super().form_valid(form)` saves the instance and returns an HttpResponseRedirect to `get_success_url()`. `self.object` is set by `super().form_valid()` so it\'s available in `get_success_url`.',
      hints: [
        'Set form.instance.<field> BEFORE super().form_valid()',
        'super().form_valid() saves and returns the redirect',
        'self.object is set after super().form_valid()',
        'reverse("name", kwargs={...}) builds the URL',
      ],
      tags: ['django', 'views', 'CreateView', 'form_valid', 'reverse', 'advanced'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-cbv-int-userpasses',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      question: 'A logged-in user must only be able to edit articles they authored. Which mixin enforces this per-object rule on a class-based view, and how?',
      options: [
        { id: 'a', text: 'PermissionRequiredMixin — set permission_required = "articles.change_article" and Django checks row ownership automatically', isCorrect: false },
        { id: 'b', text: 'LoginRequiredMixin — once users are authenticated, Django already scopes querysets to rows they own', isCorrect: false },
        { id: 'c', text: 'UserPassesTestMixin — define test_func(self) returning whether self.request.user is the object\'s author', isCorrect: true },
        { id: 'd', text: 'AccessMixin — override its has_access(request, pk) hook to compare the author field against the user', isCorrect: false },
      ],
      explanation: 'UserPassesTestMixin runs your `test_func` before the view dispatches; returning False yields a redirect to login (or 403 with `raise_exception = True`). Model permissions (`PermissionRequiredMixin`) are table-wide — having `change_article` lets you edit EVERY article, so they can\'t express row ownership. LoginRequiredMixin only checks authentication; it never filters rows. AccessMixin is the shared base class the other mixins build on — it has no `has_access` hook. In the class declaration the order is auth mixin → test mixin → generic view.',
      tags: ['django', 'views', 'UserPassesTestMixin', 'mixins', 'ownership'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-adv-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Assemble an UpdateView for Article that requires login, only lets the author edit their own article (404 otherwise), and redirects to the article detail on success.',
      correctOrder: [
        'from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin',
        'from django.urls import reverse',
        'from django.views.generic.edit import UpdateView',
        'from .forms import ArticleForm',
        'from .models import Article',
        '',
        'class ArticleUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):',
        '    model = Article',
        '    form_class = ArticleForm',
        '    template_name = "articles/form.html"',
        '    raise_exception = True',
        '',
        '    def test_func(self):',
        '        return self.get_object().author == self.request.user',
        '',
        '    def get_success_url(self):',
        '        return reverse("article_detail", kwargs={"pk": self.object.pk})',
      ],
      distractorLines: [
        'class ArticleUpdateView(UpdateView, LoginRequiredMixin, UserPassesTestMixin):',
        '    def test_func(self, request):',
        '        return self.object.author == self.request.user',
        '    permission_required = "articles.change_article"',
        '    success_url = "/articles/"',
      ],
      solution: 'from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin\nfrom django.urls import reverse\nfrom django.views.generic.edit import UpdateView\nfrom .forms import ArticleForm\nfrom .models import Article\n\nclass ArticleUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):\n    model = Article\n    form_class = ArticleForm\n    template_name = "articles/form.html"\n    raise_exception = True\n\n    def test_func(self):\n        return self.get_object().author == self.request.user\n\n    def get_success_url(self):\n        return reverse("article_detail", kwargs={"pk": self.object.pk})',
      explanation: 'Mixin order is left-to-right: `LoginRequiredMixin` first (auth check), then `UserPassesTestMixin` (ownership check), THEN the generic view. `test_func` takes only `self` — read the user via `self.request.user` and the object via `self.get_object()`. `raise_exception = True` makes a failing test raise `PermissionDenied` (403) instead of redirecting to login (the default — confusing here since the user IS logged in). Don\'t use `permission_required` — that checks Django permissions, not row ownership.',
      hints: [
        'Mixin order: auth → permission → generic view',
        'test_func() takes only self',
        'raise_exception=True returns 403 on failed test',
        'permission_required is for Django permissions, not ownership',
      ],
      tags: ['django', 'views', 'UserPassesTestMixin', 'UpdateView', 'ownership', 'parsons', 'advanced'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-adv-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'A class-based view dispatches through three mixins. What\'s logged when an authenticated user lacking the permission requests it?',
      code: `class LogMixin:
    def dispatch(self, request, *args, **kwargs):
        print("LogMixin")
        return super().dispatch(request, *args, **kwargs)

class AuthMixin:
    def dispatch(self, request, *args, **kwargs):
        print("AuthMixin")
        if not request.user.is_authenticated:
            return HttpResponse("401", status=401)
        return super().dispatch(request, *args, **kwargs)

class PermMixin:
    def dispatch(self, request, *args, **kwargs):
        print("PermMixin")
        if not request.user.has_perm("articles.edit"):
            return HttpResponse("403", status=403)
        return super().dispatch(request, *args, **kwargs)

class MyView(LogMixin, AuthMixin, PermMixin, View):
    def get(self, request):
        print("Body")
        return HttpResponse("ok")

# Authenticated user WITHOUT articles.edit permission, GET request
response = MyView.as_view()(authed_request_no_perm)
print(response.status_code)`,
      expectedOutput: `LogMixin
AuthMixin
PermMixin
403`,
      explanation: 'MRO is left-to-right for the class declaration, so `dispatch` chains: LogMixin → AuthMixin → PermMixin → View. Each prints, calls `super().dispatch()`, and only then either short-circuits (returning a Response) or descends further. The user IS authenticated so AuthMixin passes through; PermMixin sees the missing permission and returns the 403 — `View.dispatch` (which would route to `get`) never runs, so "Body" is not printed.',
      hints: [
        'Mixin dispatch chains via super() left-to-right',
        'A mixin returning early skips everything below',
        'MRO is left-to-right in the class declaration',
      ],
      tags: ['django', 'views', 'mixin', 'dispatch', 'mro', 'predict', 'advanced'],
      concepts: ['dj-view-patterns', 'py-mro-resolution'],
    },
{
      id: 'dj-cbv-beg-whatis',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      question: 'What is a Django class-based view (CBV)?',
      options: [
        { id: 'a', text: 'A view written as a class, where HTTP methods map to methods like get() and post().', isCorrect: true },
        { id: 'b', text: 'A view that can only render a single template and never touches the database.', isCorrect: false },
        { id: 'c', text: 'A view that runs entirely in the browser instead of on the Django server.', isCorrect: false },
        { id: 'd', text: 'A model method that returns its rows formatted as an HTTP response automatically.', isCorrect: false },
      ],
      explanation: 'A CBV is a view implemented as a class instead of a function. Django routes each HTTP verb to a same-named method — a GET request calls `get()`, a POST calls `post()`. Generic CBVs (ListView, DetailView, …) build on this to supply common behaviour for free.',
      tags: ['django', 'CBV', 'class-based-views', 'beginner'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-cbv-beg-generic',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      question: 'What do Django\'s generic views like `ListView` and `DetailView` provide?',
      options: [
        { id: 'a', text: 'A faster database engine that replaces the ORM for large query results.', isCorrect: false },
        { id: 'b', text: 'Prebuilt CRUD behaviour, so you set a few attributes instead of writing the logic.', isCorrect: true },
        { id: 'c', text: 'Automatic REST API endpoints with JSON serialization for every model.', isCorrect: false },
        { id: 'd', text: 'A way to define URL patterns without ever editing the urls.py file.', isCorrect: false },
      ],
      explanation: 'Generic CBVs implement the common list/detail/create/update/delete patterns. You usually just set `model`, `template_name`, and a couple of other attributes; the view handles querying, pagination, form handling, and redirects. That is the main payoff over hand-writing a function-based view.',
      tags: ['django', 'CBV', 'generic-views', 'beginner'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-cbv-beg-asview',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      question: 'Why do class-based views use `.as_view()` in urls.py, e.g. `path("articles/", ArticleListView.as_view())`?',
      options: [
        { id: 'a', text: 'It caches the view\'s output so the same HTML is served on every later request.', isCorrect: false },
        { id: 'b', text: 'It permanently converts the class into a function-based view when the module is imported.', isCorrect: false },
        { id: 'c', text: 'URL patterns need a callable; `.as_view()` returns a function that builds and runs the view.', isCorrect: true },
        { id: 'd', text: 'It registers the view with the admin site so it shows up on the dashboard.', isCorrect: false },
      ],
      explanation: '`path()` expects a callable that takes a request and returns a response. A class is not that, so `.as_view()` returns a small function that, per request, instantiates the class and dispatches to the right method. Forgetting `.as_view()` (passing the class itself) is a common error.',
      tags: ['django', 'CBV', 'as_view', 'urls', 'beginner'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-cbv-beg-which',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      question: 'You want one page listing all articles and another showing a single article. Which generic views fit?',
      options: [
        { id: 'a', text: 'ListView for the list page; DetailView for the single-article page.', isCorrect: true },
        { id: 'b', text: 'DetailView for the list page; ListView for the single-article page.', isCorrect: false },
        { id: 'c', text: 'CreateView for both pages, since it is the only read-capable generic view.', isCorrect: false },
        { id: 'd', text: 'ListView for both pages, switching behaviour based on the URL query string.', isCorrect: false },
      ],
      explanation: '`ListView` renders a collection (it calls `Model.objects.all()` and exposes `object_list`). `DetailView` renders one object looked up by `pk` or `slug` from the URL. They are the two read-only generic views; `CreateView`/`UpdateView`/`DeleteView` handle writes.',
      tags: ['django', 'CBV', 'ListView', 'DetailView', 'beginner'],
      concepts: ['dj-view-patterns'],
    },
// ===== Layer A: in-place generic-view machinery (depth) =====
// get_context_data() override
{
      id: 'dj-cbv-context-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      question: 'A `DetailView` for `Article` should also pass the article\'s related comments to the template. What is the correct way to add extra context to a generic CBV?',
      options: [
        { id: 'a', text: 'Override `get_context_data()`, call `super().get_context_data(**kwargs)` for the base dict, add your keys, and return it', isCorrect: true },
        { id: 'b', text: 'Override `get_context_data()` and return a fresh dict of only your extra keys — Django merges it with the defaults', isCorrect: false },
        { id: 'c', text: 'Set a `context = {...}` class attribute on the view; the generic view merges it into the template context', isCorrect: false },
        { id: 'd', text: 'Override `get()` and pass a second dict of your extra keys positionally to `render()` alongside the object', isCorrect: false },
      ],
      explanation: 'The hook is `get_context_data()`. You MUST call `super().get_context_data(**kwargs)` first — that base dict contains `object`/`object_list`, `view`, pagination data, etc. — then add your keys and return the merged dict. Returning only your own keys (b) drops the object the template needs. There is no auto-merged `context` class attribute (c), and you should not bypass the machinery by re-implementing `get()` (d).',
      hints: [
        'Override get_context_data(self, **kwargs)',
        'Start from super().get_context_data(**kwargs)',
        'Add keys, then return the whole dict',
      ],
      tags: ['django', 'CBV', 'get_context_data', 'context'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-cbv-context-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Add the related comments to a DetailView\'s template context. Fill the parent call and the returned variable.',
      template: `class ArticleDetailView(DetailView):
    model = Article

    def get_context_data(self, **kwargs):
        context = ___.get_context_data(**kwargs)
        context["comments"] = self.object.comments.all()
        return ___`,
      blanks: ['super()', 'context'],
      solution: 'class ArticleDetailView(DetailView):\n    model = Article\n\n    def get_context_data(self, **kwargs):\n        context = super().get_context_data(**kwargs)\n        context["comments"] = self.object.comments.all()\n        return context',
      explanation: '`super().get_context_data(**kwargs)` returns the base context (including `object`/`article`); you mutate that dict and return it. `self.object` is the looked-up article, set before `get_context_data` runs.',
      hints: ['Call the parent get_context_data first', 'Return the dict you added to'],
      tags: ['django', 'CBV', 'get_context_data', 'super', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-cbv-context-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a class-based view `ArticleDetailView` extending Django\'s generic detail view for the `Article` model. Besides the article, the template needs the number of related comments under the context key `"comment_count"`. Override the context-building hook: take the base context from the parent, add the count (the article is available as `self.object`, with a reverse relation `comments`), and return the context.',
      starterCode: `from django.views.generic import DetailView
from .models import Article
`,
      testCases: [
        {
          input: 'GET /articles/5/',
          expectedOutput: 'context includes comment_count = self.object.comments.count()',
          description: 'super context → inject count → return',
        },
      ],
      solution: `from django.views.generic import DetailView
from .models import Article

class ArticleDetailView(DetailView):
    model = Article

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["comment_count"] = self.object.comments.count()
        return context`,
      explanation: 'Override `get_context_data`, seed it from `super()` (so `object`/`article` survive), add `comment_count`, and return the dict. `self.object` is the article DetailView already fetched; `.comments.count()` issues a `COUNT(*)` rather than loading rows.',
      hints: [
        'context = super().get_context_data(**kwargs)',
        'self.object is the fetched article',
        'Return the augmented context dict',
      ],
      tags: ['django', 'CBV', 'get_context_data', 'DetailView'],
      concepts: ['dj-view-patterns'],
    },
// TemplateView
{
      id: 'dj-cbv-template-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      question: 'You need a simple "About" page that renders a template with a little static context but touches no model. Which generic view fits, and what do you configure?',
      options: [
        { id: 'a', text: '`TemplateView` — set `template_name`, and override `get_context_data()` if you need to pass extra values', isCorrect: true },
        { id: 'b', text: '`DetailView` — set `template_name` and `model = None`, since there is no object to look up', isCorrect: false },
        { id: 'c', text: '`ListView` — set `template_name` and `queryset = []` so it renders an empty collection page', isCorrect: false },
        { id: 'd', text: '`RedirectView` — set `template_name`; it renders the page after issuing a 302 back to itself', isCorrect: false },
      ],
      explanation: '`TemplateView` is the generic view for "render this template, no object required." You set `template_name` and optionally override `get_context_data()`. `DetailView`/`ListView` are built around a model lookup/queryset and would need awkward stubs; `RedirectView` issues a redirect and renders nothing.',
      hints: [
        'TemplateView = render a template, no model',
        'Set template_name; add get_context_data for extras',
      ],
      tags: ['django', 'CBV', 'TemplateView', 'generic-views'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-cbv-template-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Render a static About page with a generic view. Fill the base class and the template attribute.',
      template: `from django.views.generic import TemplateView

class AboutView(___):
    ___ = "about.html"`,
      blanks: ['TemplateView', 'template_name'],
      solution: 'from django.views.generic import TemplateView\n\nclass AboutView(TemplateView):\n    template_name = "about.html"',
      explanation: '`TemplateView` only needs `template_name`. Mount it with `AboutView.as_view()` in `urls.py`. Extra context comes from overriding `get_context_data`.',
      hints: ['Inherit from TemplateView', 'The attribute is template_name'],
      tags: ['django', 'CBV', 'TemplateView', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
// FormView
{
      id: 'dj-cbv-formview-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      question: 'You have a contact form that emails the site owner but saves nothing to the database. Which generic view fits best, and how does it differ from `CreateView`?',
      options: [
        { id: 'a', text: '`FormView` — it wires up `form_class`/`success_url` and calls `form_valid()`, but unlike `CreateView` it saves no model instance', isCorrect: true },
        { id: 'b', text: '`CreateView` — it is the only generic view that can process a form; you just leave `model` unset to skip saving', isCorrect: false },
        { id: 'c', text: '`FormView` — it renders the form but cannot validate it, so you call `form.is_valid()` yourself inside `get()`', isCorrect: false },
        { id: 'd', text: '`TemplateView` — set `form_class` on it and override `post()` to validate, since it is the lightest base to use', isCorrect: false },
      ],
      explanation: '`FormView` handles GET (render the form) and POST (bind, validate, call `form_valid()` / `form_invalid()`) — exactly like `CreateView`, but without a model instance to save. You override `form_valid(self, form)` to do the side effect (send the email) and then `return super().form_valid(form)` for the redirect to `success_url`. `CreateView` always tries to `.save()` a model.',
      hints: [
        'FormView = form processing without a model save',
        'Override form_valid for the side effect, then super()',
        'CreateView always saves a model instance',
      ],
      tags: ['django', 'CBV', 'FormView', 'form_valid'],
      concepts: ['dj-view-patterns', 'dj-form-validation'],
    },
{
      id: 'dj-cbv-formview-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Wire a FormView that emails on success. Fill the form attribute, the lazy URL resolver, and the parent call.',
      template: `from django.views.generic.edit import FormView
from django.urls import reverse_lazy
from .forms import ContactForm

class ContactView(FormView):
    ___ = ContactForm
    template_name = "contact.html"
    success_url = ___("home")

    def form_valid(self, form):
        form.send_email()
        return ___.form_valid(form)`,
      blanks: ['form_class', 'reverse_lazy', 'super()'],
      solution: 'from django.views.generic.edit import FormView\nfrom django.urls import reverse_lazy\nfrom .forms import ContactForm\n\nclass ContactView(FormView):\n    form_class = ContactForm\n    template_name = "contact.html"\n    success_url = reverse_lazy("home")\n\n    def form_valid(self, form):\n        form.send_email()\n        return super().form_valid(form)',
      explanation: '`form_class` names the form; `reverse_lazy` is required for `success_url` at class-definition time (URLConf is not loaded yet); `super().form_valid(form)` performs the redirect after your side effect.',
      hints: ['Attribute that names the form', 'Lazy URL resolver for class attributes', 'Defer to the parent for the redirect'],
      tags: ['django', 'CBV', 'FormView', 'reverse_lazy', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-cbv-formview-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a class-based view `ContactView` using Django\'s generic form-processing view — the one that handles a form without saving a model. Use `ContactForm` as the form, template `"contact.html"`, and redirect to the URL named `"contact-done"` on success. When the submitted form validates, call the form\'s `send_email()` method, then defer to the parent implementation so the normal valid-form redirect happens.',
      starterCode: `from django.views.generic.edit import FormView
from django.urls import reverse_lazy
from .forms import ContactForm
`,
      testCases: [
        {
          input: 'valid POST to ContactView',
          expectedOutput: 'form_valid calls send_email then super().form_valid(form); redirects to contact-done',
          description: 'FormView + form_valid side effect + reverse_lazy success_url',
        },
      ],
      solution: `from django.views.generic.edit import FormView
from django.urls import reverse_lazy
from .forms import ContactForm

class ContactView(FormView):
    form_class = ContactForm
    template_name = "contact.html"
    success_url = reverse_lazy("contact-done")

    def form_valid(self, form):
        form.send_email()
        return super().form_valid(form)`,
      explanation: '`FormView` gives you the GET/POST form lifecycle for free. The side effect (`form.send_email()`) goes in `form_valid`, before `super().form_valid(form)` issues the redirect to `success_url`. `reverse_lazy` defers URL resolution until request time, which is necessary for a class-level attribute.',
      hints: [
        'form_class, template_name, success_url = reverse_lazy("contact-done")',
        'Do the side effect in form_valid, then super().form_valid(form)',
      ],
      tags: ['django', 'CBV', 'FormView', 'form_valid', 'reverse_lazy', 'advanced'],
      concepts: ['dj-view-patterns'],
    },
// DetailView by slug / get_object
{
      id: 'dj-cbv-slug-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      question: 'A `DetailView` should look up an `Article` by a URL slug like `/articles/my-title/` instead of a numeric pk. What is the idiomatic configuration?',
      options: [
        { id: 'a', text: 'Capture `<slug:slug>` in the URL and set `slug_field` / `slug_url_kwarg` on the view (both default to `"slug"`), or override `get_object()`', isCorrect: true },
        { id: 'b', text: 'Capture `<slug:slug>` in the URL and set `lookup_field = "slug"`; DetailView reads that attribute to build the query', isCorrect: false },
        { id: 'c', text: 'Capture `<int:pk>` and override `get_queryset()` to `.filter(slug=...)`, because DetailView cannot do non-pk lookups', isCorrect: false },
        { id: 'd', text: 'Capture `<slug:slug>` and set `pk_url_kwarg = "slug"`, which tells DetailView to treat the slug as the primary key', isCorrect: false },
      ],
      explanation: '`SingleObjectMixin` looks up by slug when the URL captures a `slug` kwarg: `slug_url_kwarg` (which URL kwarg holds the value, default `"slug"`) and `slug_field` (which model field to match, default `"slug"`). For anything more complex you override `get_object()`. `lookup_field` is a DRF concept, not Django\'s generic views; `pk_url_kwarg` is for the primary key, not a slug.',
      hints: [
        'slug_field = model field; slug_url_kwarg = the URL capture name',
        'Both default to "slug"',
        'Override get_object() for custom lookups',
      ],
      tags: ['django', 'CBV', 'DetailView', 'slug_field', 'get_object'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-cbv-slug-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Configure a DetailView to fetch by slug (URL pattern: `<slug:slug>`). Fill the two lookup attributes.',
      template: `class ArticleDetailView(DetailView):
    model = Article
    ___ = "slug"        # which model field to match
    ___ = "slug"        # which URL kwarg holds the value`,
      blanks: ['slug_field', 'slug_url_kwarg'],
      solution: 'class ArticleDetailView(DetailView):\n    model = Article\n    slug_field = "slug"\n    slug_url_kwarg = "slug"',
      explanation: '`slug_field` names the model column; `slug_url_kwarg` names the captured URL parameter. Both happen to be `"slug"` here, which is why they are also the defaults — set them explicitly when either differs (e.g. URL `<slug:title_slug>` → `slug_url_kwarg = "title_slug"`).',
      hints: ['One names the model field, one names the URL kwarg', 'Both default to "slug"'],
      tags: ['django', 'CBV', 'DetailView', 'slug_field', 'slug_url_kwarg', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
// http_method_names restriction
{
      id: 'dj-cbv-httpmethods-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CBV,
      course: Course.BACKEND,
      question: 'You want a class-based view to accept only GET and HEAD, returning 405 for any other verb. What is the simplest switch on the view class?',
      options: [
        { id: 'a', text: 'Set `http_method_names = ["get", "head"]`; the base `dispatch()` returns 405 for any verb not in that list', isCorrect: true },
        { id: 'b', text: 'Set `allowed_methods = ["GET", "HEAD"]`; `dispatch()` reads it and raises `PermissionDenied` for other verbs', isCorrect: false },
        { id: 'c', text: 'Decorate the class with `@require_http_methods(["GET", "HEAD"])`, which overrides `http_method_names` internally', isCorrect: false },
        { id: 'd', text: 'Override `get()` to call `self.http_method_not_allowed()` whenever `request.method` is not GET or HEAD', isCorrect: false },
      ],
      explanation: 'The base `View` class has `http_method_names` (lowercase verb strings). `dispatch()` checks the incoming verb against it and calls `http_method_not_allowed()` (→ 405) when it is absent. Setting `http_method_names = ["get", "head"]` is the one-line switch. `allowed_methods` is not a Django attribute; the FBV `require_http_methods` decorator is for function views; and re-checking inside `get()` is redundant work the base class already does.',
      hints: [
        'http_method_names holds lowercase verb strings',
        'dispatch() enforces it → 405 for others',
      ],
      tags: ['django', 'CBV', 'http_method_names', 'dispatch', '405'],
      concepts: ['dj-view-patterns'],
    },
];
