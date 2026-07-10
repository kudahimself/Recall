/**
 * Topic.DJ_ADMIN — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendAdvancedPedagogyQuestions.ts (2), djangoAdvancedFinalQuestions.ts (1), djangoAdvancedQuestions.ts (3), djangoBatchDExpansionQuestions.ts (7)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_admin_questions: Question[] = [
  {
      id: 'dj-admin-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ADMIN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Register Article in admin with title and status shown in the changelist, and let admins filter by status.',
      template: `from django.contrib import admin
from .models import Article

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    ___ = ("title", "status", "created_at")
    ___ = ("status",)
    ___ = ("title",)`,
      blanks: ['list_display', 'list_filter', 'search_fields'],
      solution: 'from django.contrib import admin\nfrom .models import Article\n\n@admin.register(Article)\nclass ArticleAdmin(admin.ModelAdmin):\n    list_display = ("title", "status", "created_at")\n    list_filter = ("status",)\n    search_fields = ("title",)',
      explanation: '`list_display` controls the columns shown in the changelist. `list_filter` adds the right-side filter sidebar. `search_fields` powers the top search box (uses LIKE / icontains). Trailing comma on single-element tuples — `("status",)` is a tuple, `("status")` is just a string.',
      hints: ['list_display = columns', 'list_filter = sidebar filter', 'Trailing comma for single-element tuple'],
      tags: ['django', 'admin', 'ModelAdmin', 'cloze'],
      concepts: ['dj-admin'],
    },
  {
      id: 'dj-admin-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ADMIN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given the model has `__str__` returning `self.title`, what shows in the admin changelist column? (Article(title="Hello"))',
      code: `class Article(models.Model):
    title = models.CharField(max_length=200)

    def __str__(self):
        return self.title

class ArticleAdmin(admin.ModelAdmin):
    pass

# In the admin changelist, the row for Article(title="Hello") shows:
print(str(Article(title="Hello")))`,
      expectedOutput: `Hello`,
      explanation: 'Without `list_display`, the admin falls back to `str(instance)` for the row label — so `__str__` controls how every model appears throughout the admin (changelist links, ForeignKey dropdowns, etc.). Add `list_display = ("title", "status")` to show explicit columns instead.',
      hints: ['Default admin row uses __str__', 'list_display overrides that'],
      tags: ['django', 'admin', '__str__', 'predict'],
      concepts: ['dj-admin'],
    },
  {
      id: 'dj-admin-adv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_ADMIN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Build an \`ArticleAdmin\` that combines four production patterns:
  
  1. Inline editing of related \`Comment\` rows beneath each Article (use a TabularInline).
  2. A custom admin action \`mark_published\` that bulk-flips selected articles' status to "published". The action must surface a success message via \`self.message_user(request, ...)\`.
  3. \`get_queryset\` overridden so non-superusers only see articles they authored (multi-tenant safety).
  4. \`list_display\` showing title, author, and a custom method \`comment_count\` (annotated via the queryset, not computed in Python per row).
  
  \`Comment\` has a ForeignKey \`article\` to Article. \`Article\` has \`author\` (FK to User), \`title\`, \`status\`.`,
      starterCode: `from django.contrib import admin
from django.db.models import Count
from .models import Article, Comment
`,
      testCases: [
        {
          input: 'admin user lists articles → sees only theirs; runs action → flips status',
          expectedOutput: 'TabularInline + admin.action + get_queryset override + annotated count column',
          description: 'Production admin with row-level scoping + bulk action + inline + perf-aware count',
        },
      ],
      solution: `from django.contrib import admin
from django.db.models import Count
from .models import Article, Comment


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "status", "comment_count")
    inlines = [CommentInline]
    actions = ["mark_published"]

    def get_queryset(self, request):
        qs = super().get_queryset(request).annotate(_comment_count=Count("comment"))
        if request.user.is_superuser:
            return qs
        return qs.filter(author=request.user)

    @admin.display(description="Comments", ordering="_comment_count")
    def comment_count(self, obj):
        return obj._comment_count

    @admin.action(description="Mark selected as published")
    def mark_published(self, request, queryset):
        updated = queryset.update(status="published")
        self.message_user(request, f"Marked {updated} articles as published")`,
      explanation: 'Four primitives in one ModelAdmin. `TabularInline` shows related rows in a compact table beneath the parent; `extra=0` hides blank "create new" rows. The annotated count goes through `get_queryset` so the changelist column comes from the SQL aggregate (one query for all rows) — computing it in `comment_count(self, obj)` via `obj.comment_set.count()` would be N+1. `@admin.display(ordering=...)` lets the column header sort by the annotation. The `actions = [...]` list pairs with `@admin.action`-decorated methods. `get_queryset` filtered by `request.user` is the key multi-tenant guard — without it, every staff user sees every row.',
      hints: [
        'TabularInline.extra = 0 hides blank create-rows',
        'Annotate in get_queryset; surface via a display method',
        '@admin.display(ordering="...") makes the column sortable',
        '@admin.action decorator + actions list',
        'get_queryset filter for multi-tenant scoping',
      ],
      tags: ['django', 'admin', 'TabularInline', 'admin-action', 'get_queryset', 'advanced'],
      concepts: ['dj-admin', 'dj-view-patterns'],
    },
  {
      id: 'py-dj-admin-what',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ADMIN,
      course: Course.BACKEND,
      question: 'What does Django\'s admin site give you for free once you register a model?',
      options: [
        { id: 'a', text: 'A read-only list view of rows — creating, editing, or deleting records still requires writing your own views', isCorrect: false },
        { id: 'b', text: 'An auto-generated CRUD interface: list / add / change / delete views with forms derived from your model', isCorrect: true },
        { id: 'c', text: 'A GraphQL API for querying your registered models from the frontend, with no HTML interface included', isCorrect: false },
        { id: 'd', text: 'An HTTP API for each registered model; building an actual admin UI on top of it is left to you', isCorrect: false },
      ],
      explanation: 'The admin is Django\'s killer feature — in five lines you get a back-office UI any other framework needs weeks to build. One `admin.site.register(MyModel)` call also wires up permission checks, search, filters, pagination, and history tracking. Great for internal tools, data ops, support dashboards. Not intended as an end-user interface (privileged, trusts every input its users give, exposes schema). Lock behind internal auth, VPN, or IP allow-list.',
      hints: [
        'CRUD UI from admin.site.register(MyModel)',
        'Includes list/filter/search/history/perms',
        'Internal-only — not a user-facing interface',
      ],
      tags: ['django', 'admin', 'basics'],
      concepts: ['dj-admin'],
    },
  {
      id: 'py-dj-admin-register',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ADMIN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Register a `Post` model with the Django admin. Two options shown in the solution: the decorator form `@admin.register(Post)` on a `ModelAdmin` class, and the functional `admin.site.register(Post)`. Both make the model appear in `/admin/`. Use the decorator form.',
      starterCode: `# blog/admin.py
# Import admin and Post, then register a (bare) PostAdmin
# using the decorator form.
`,
      testCases: [
        {
          input: 'admin.register decorator',
          expectedOutput: 'Post appears in /admin/ with default CRUD',
          description: 'Decorator form is the idiomatic register',
        },
      ],
      solution: `# blog/admin.py
from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    pass`,
      explanation: 'Decorator form lets you declare the admin class AND register in one go. Alternative: `admin.site.register(Post)` without a ModelAdmin uses defaults. Bare `pass` body gives you the defaults; override below to customise. Register must happen at import time — putting admin code in `admin.py` (autoloaded by `django.contrib.admin`) ensures that.',
      hints: [
        '@admin.register(Model) decorator form',
        'Alternative: admin.site.register(Model, ModelAdmin)',
        'Must happen at import time — use admin.py',
      ],
      tags: ['django', 'admin', 'register'],
      concepts: ['dj-admin'],
    },
  {
      id: 'py-dj-admin-list-display',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ADMIN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Customise the list page on a `PostAdmin` that subclasses `ModelAdmin`. Set `list_display` to show the columns `title`, `author`, `created_at`, and `is_published`. Set `list_filter` so the sidebar offers filters for `is_published` and `author`. Set `search_fields` so the search box matches on `title` and `body`. Set `ordering` so results default to newest-first by `created_at` (descending). Combined, these turn the default list into a practical ops console.',
      starterCode: `# PostAdmin: set the four list-page options described in the prompt
# (columns, sidebar filters, search fields, default ordering).
`,
      testCases: [
        {
          input: 'ModelAdmin list customisation',
          expectedOutput: 'Columns / filters / search / default ordering configured',
          description: 'list_display / list_filter / search_fields / ordering',
        },
      ],
      solution: `from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "created_at", "is_published")
    list_filter = ("is_published", "author")
    search_fields = ("title", "body")
    ordering = ("-created_at",)`,
      explanation: 'These four attributes turn the admin from toy into tool. `list_display` items can be field names OR callables on the ModelAdmin (`def short_title(self, obj): return obj.title[:30]`). `list_filter` spawns a sidebar — supports nested fields (`author__is_staff`). `search_fields` is LIKE-matched across the listed fields. `ordering` is a tuple (prefix `-` for DESC).',
      hints: [
        'list_display = tuple of field names or methods',
        'list_filter = sidebar filters; supports FK traversal',
        'search_fields uses LIKE across listed columns',
      ],
      tags: ['django', 'admin', 'list_display', 'ModelAdmin'],
      concepts: ['dj-admin'],
    },
  {
      id: 'py-dj-admin-inline',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ADMIN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Show `Comment` rows inline on the `Post` edit page using `TabularInline`. Define a `CommentInline` class that subclasses `admin.TabularInline`, pointing it at the `Comment` model and configuring one empty form for new comments (via `extra`). On `PostAdmin` register the inline by adding `CommentInline` to its `inlines` list. Users can now edit a post AND its comments in one form.',
      starterCode: `# Define CommentInline as a TabularInline on Comment with one extra
# empty form, then register PostAdmin with the inline attached.
`,
      testCases: [
        {
          input: 'TabularInline on Post admin',
          expectedOutput: 'Post edit page shows Comment rows in a table',
          description: 'Inline for one-to-many relations',
        },
      ],
      solution: `from django.contrib import admin
from .models import Post, Comment

class CommentInline(admin.TabularInline):
    model = Comment
    extra = 1

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    inlines = [CommentInline]`,
      explanation: 'Two inline styles: `TabularInline` (rows) and `StackedInline` (one form per child — more vertical space). Requires a FK from child to parent (`Comment.post = FK(Post)`). `extra = N` controls how many blank rows appear for new records (0 = none — must click "add another"). Prevents the "edit parent, then navigate to children, then edit each" workflow for tightly coupled models.',
      hints: [
        'TabularInline for rows; StackedInline for forms',
        'Requires FK from child to parent',
        'extra = N blank rows for new children',
      ],
      tags: ['django', 'admin', 'inline', 'TabularInline'],
      concepts: ['dj-admin'],
    },
  {
      id: 'py-dj-admin-action',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ADMIN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Add a bulk "publish" action. Inside `PostAdmin`, define a method `publish` that takes `self`, `request`, and `queryset`, and bulk-updates the queryset so `is_published` is True. Decorate it with `@admin.action` setting `description="Mark selected as published"`. Register the action by adding its name to the `actions` list on the admin. Admins can then tick rows, pick "Mark selected as published" from the dropdown, and bulk-update.',
      starterCode: `# Inside PostAdmin: the decorated publish(self, request, queryset)
# method that bulk-updates is_published, plus the actions list
# entry that exposes it in the dropdown.
`,
      testCases: [
        {
          input: 'bulk admin action',
          expectedOutput: 'Dropdown on list page runs publish() on selected rows',
          description: 'Signature: (self, request, queryset)',
        },
      ],
      solution: `from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    actions = ["publish"]

    @admin.action(description="Mark selected as published")
    def publish(self, request, queryset):
        queryset.update(is_published=True)`,
      explanation: 'Actions are always `(self, request, queryset)`. Use `queryset.update(...)` for a single-query bulk update (no Python iteration, no `save()` per row, no signals fired). If you need signals per row (e.g. to rebuild a search index), iterate and `save()`. `@admin.action(description=...)` sets the dropdown label. For row-by-row confirmation, call `self.message_user(request, "...")` on failure.',
      hints: [
        'Signature: self, request, queryset',
        '.update() is bulk — no signals, no save() per row',
        '@admin.action(description="...") sets the label',
      ],
      tags: ['django', 'admin', 'actions', 'bulk'],
      concepts: ['dj-admin'],
    },
  {
      id: 'py-dj-admin-readonly-fieldsets',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_ADMIN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Group fields into fieldsets and mark some read-only. On `PostAdmin`, make `created_at` and `updated_at` read-only, and organise the edit form into two fieldsets: a "Content" group holding `title` and `body`, and a "Meta" group holding `author`, `is_published`, `created_at`, and `updated_at`. Read-only fields render as text, not inputs.',
      starterCode: `# PostAdmin: mark the two timestamp fields read-only and declare the
# "Content" and "Meta" fieldsets described in the prompt.
`,
      testCases: [
        {
          input: 'fieldsets + readonly_fields',
          expectedOutput: 'Edit page grouped into Content + Meta sections',
          description: 'Cleaner edit page for wide models',
        },
      ],
      solution: `from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    readonly_fields = ("created_at", "updated_at")
    fieldsets = [
        ("Content", {"fields": ("title", "body")}),
        ("Meta", {"fields": ("author", "is_published", "created_at", "updated_at")}),
    ]`,
      explanation: 'Wide models become cramped on the default edit page. Fieldsets group related fields under a heading and make the form navigable. Add `"classes": ("collapse",)` to start a section collapsed. `readonly_fields` applies anywhere in `fieldsets` — great for auto-managed timestamps, audit fields, computed values. For conditional read-only, override `get_readonly_fields(self, request, obj=None)`.',
      hints: [
        'fieldsets = [(label, {"fields": (...), "classes": (...)})]',
        'readonly_fields renders as text, not input',
        'get_readonly_fields for conditional logic',
      ],
      tags: ['django', 'admin', 'fieldsets', 'readonly_fields'],
      concepts: ['dj-admin'],
    },
  {
      id: 'py-dj-admin-prod-risk',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_ADMIN,
      course: Course.BACKEND,
      question: 'What should you consider before exposing `/admin/` on a public-facing URL?',
      options: [
        { id: 'a', text: 'Nothing special — the admin ships hardened by default, so exposing it publicly adds no extra risk', isCorrect: false },
        { id: 'b', text: 'It\'s a privileged, high-surface UI — keep it behind a VPN or IP allow-list, require MFA, and audit staff access', isCorrect: true },
        { id: 'c', text: 'Mainly performance — admin pages bypass the cache, so public traffic to them slows the whole app down', isCorrect: false },
        { id: 'd', text: 'Only the URL — rename `/admin/` to something non-guessable and public exposure becomes fully safe', isCorrect: false },
      ],
      explanation: 'Common exploits: brute-force `/admin/` login (rate-limit or hide the URL), session hijack, XSS via unescaped fields, CSRF on sensitive actions, leaked superuser creds. Defensive stance: internal-only network, enforce MFA, audit staff list regularly, log every admin action and failed login, never run with DEBUG=True, never reuse production dumps with real user emails in staging. The admin is for internal operators, not a public interface. "Admin" means admin — treat it like sudo.',
      hints: [
        'VPN / IP allow-list the admin URL',
        'MFA via django-otp or similar',
        'Audit staff / superuser list regularly',
      ],
      tags: ['django', 'admin', 'security', 'production'],
      concepts: ['py-security-primitives'],
    },
];
