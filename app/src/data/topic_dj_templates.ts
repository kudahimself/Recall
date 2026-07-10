/**
 * Topic.DJ_TEMPLATES — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendGapQuestions.ts (5), djangoBatchCExpansionQuestions.ts (5), djangoGapDj4eQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_templates_questions: Question[] = [
  {
      id: 'dj-tmpl-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TEMPLATES,
      course: Course.BACKEND,
      language: CodeLanguage.HTML,
      question: 'Write a Django template that displays the variable "title" in an h1 tag and loops over a list "articles" showing each article\'s title and author.',
      starterCode: `<!-- Django template -->\n`,
      testCases: [{ input: 'template variables', expectedOutput: '{{ title }}, {% for article in articles %}', description: 'Should use template tags' }],
      solution: `<h1>{{ title }}</h1>\n\n{% for article in articles %}\n  <div>\n    <h2>{{ article.title }}</h2>\n    <p>By {{ article.author }}</p>\n  </div>\n{% empty %}\n  <p>No articles found.</p>\n{% endfor %}`,
      explanation: '{{ variable }} outputs a value. {% tag %} is a template tag for logic. {% for %} loops. {% empty %} renders when the list is empty. Django auto-escapes HTML in variables to prevent XSS.',
      hints: ['{{ var }} for output', '{% for item in list %}...{% endfor %} for loops', '{% empty %} for empty list fallback'],
      tags: ['template', 'for', 'variables', 'django'],
      concepts: ['dj-templates', 'py-builtin-io'],
    },
  {
      id: 'dj-tmpl-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TEMPLATES,
      course: Course.BACKEND,
      language: CodeLanguage.HTML,
      question: 'Write Django template code that: shows a "Welcome, username" if user is authenticated, otherwise shows a "Login" link. Use {% if %} tag.',
      starterCode: `<!-- Conditional -->\n`,
      testCases: [{ input: 'auth check', expectedOutput: '{% if user.is_authenticated %}', description: 'Should use conditional template tag' }],
      solution: `{% if user.is_authenticated %}\n  <p>Welcome, {{ user.username }}!</p>\n  <a href="{% url 'logout' %}">Logout</a>\n{% else %}\n  <a href="{% url 'login' %}">Login</a>\n{% endif %}`,
      explanation: '{% if condition %} for conditionals. user is automatically available in templates (from context processors). {% url "name" %} generates URLs from named URL patterns (reverse URL resolution). Always use {% url %} instead of hardcoded paths.',
      hints: ['{% if %}...{% else %}...{% endif %}', 'user.is_authenticated checks login', '{% url "name" %} for reverse URL'],
      tags: ['template', 'if', 'url', 'auth', 'django'],
      concepts: ['dj-auth-token-vs-session'],
    },
  {
      id: 'dj-tmpl-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TEMPLATES,
      course: Course.BACKEND,
      language: CodeLanguage.HTML,
      question: 'Use Django template filters to: display a date in "Jan 15, 2024" format, truncate a long text to 100 characters, and convert text to title case.',
      starterCode: `<!-- Template filters -->\n`,
      testCases: [{ input: 'filters', expectedOutput: '{{ date|date:"M d, Y" }}, {{ text|truncatechars:100 }}, {{ text|title }}', description: 'Should use template filters' }],
      solution: `<p>{{ article.published_date|date:"M d, Y" }}</p>\n<p>{{ article.body|truncatechars:100 }}</p>\n<h2>{{ article.title|title }}</h2>`,
      explanation: 'Filters modify variables: {{ var|filter:arg }}. date formats dates. truncatechars limits length (adds ...). title capitalises each word. Other useful filters: default, length, pluralize, linebreaks, safe (disable auto-escaping).',
      hints: ['{{ var|filter:arg }} syntax', 'date:"M d, Y" for formatting', 'truncatechars:N adds ... if longer'],
      tags: ['template', 'filters', 'date', 'truncate', 'django'],
      concepts: ['dj-templates'],
    },
  {
      id: 'py-dj-tpl-url-tag',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TEMPLATES,
      course: Course.BACKEND,
      language: CodeLanguage.HTML,
      question: 'Write a template that links to two named URLs. Include a `<nav>` with `<a href="{% url \'home\' %}">Home</a>` and `<a href="{% url \'blog:detail\' post.pk %}">{{ post.title }}</a>`. Use the Django template engine\'s `{% url %}` tag.',
      starterCode: `<!-- Build a <nav> with two anchors using {% url %} -->
<!-- 1. Link to "home" -->
<!-- 2. Link to "blog:detail" with post.pk as argument, text = post.title -->
`,
      testCases: [
        {
          input: 'template using {% url %} tag',
          expectedOutput: '<nav> with two anchors built from URL names',
          description: '{% url "name" arg %} generates the URL',
        },
      ],
      solution: `<nav>
  <a href="{% url 'home' %}">Home</a>
  <a href="{% url 'blog:detail' post.pk %}">{{ post.title }}</a>
</nav>`,
      explanation: 'Templates should NEVER hardcode paths — use `{% url %}` and rename URLs freely. Multiple args: `{% url "archive" year month %}`. Keyword args: `{% url "archive" year=2024 month=1 %}`. To save the result to a variable for reuse: `{% url "detail" post.pk as detail_url %}` then use `{{ detail_url }}` multiple times.',
      hints: [
        '{% url "name" positional_args %}',
        'Namespace form: "app:name"',
        '{% url ... as varname %} to save as template variable',
      ],
      tags: ['django', 'templates', 'url-tag'],
      concepts: ['dj-templates'],
    },
  {
      id: 'py-dj-tpl-inheritance',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TEMPLATES,
      course: Course.BACKEND,
      language: CodeLanguage.HTML,
      question: 'Set up template inheritance. `base.html` has a `<title>{% block title %}My Site{% endblock %}</title>` and a `<main>{% block content %}{% endblock %}</main>`. Write a child `article.html` that uses `{% extends "base.html" %}` and overrides `{% block title %}{{ article.title }}{% endblock %}` and `{% block content %}<article>{{ article.body }}</article>{% endblock %}`. Use `{{ block.super }}` to append to the parent\'s title instead of replacing, if desired.',
      starterCode: `<!-- base.html  (for reference — not needed in your answer) -->
<!-- <title>{% block title %}My Site{% endblock %}</title> -->
<!-- <main>{% block content %}{% endblock %}</main> -->

<!-- Write article.html below: -->
`,
      testCases: [
        {
          input: 'child template extends base',
          expectedOutput: '{% extends %} + {% block %} overrides',
          description: 'Inheritance is the backbone of Django templates',
        },
      ],
      solution: `{% extends "base.html" %}

{% block title %}{{ article.title }}{% endblock %}

{% block content %}
  <article>{{ article.body }}</article>
{% endblock %}`,
      explanation: '`{% extends %}` makes the child load the parent, then the `{% block %}` tags in the child override the corresponding blocks in the parent. Unnamed content (outside blocks) in the child is ignored. Use `{{ block.super }}` to insert the parent\'s block content and extend rather than replace. Typical hierarchy: `base.html` → `site_layout.html` → specific page templates. Keeps common chrome (nav, footer, scripts) in one place.',
      hints: [
        '{% extends "base.html" %} at the top',
        '{% block name %}content{% endblock %} to override',
        '{{ block.super }} to include parent content',
      ],
      tags: ['django', 'templates', 'inheritance', 'extends', 'block'],
      concepts: ['py-super-call'],
    },
  {
      id: 'py-dj-tpl-include',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TEMPLATES,
      course: Course.BACKEND,
      language: CodeLanguage.HTML,
      question: 'Use `{% include %}` for a partial/component template. Assume `_card.html` renders `<div class="card">{{ item.title }} – {{ item.price }}</div>`. In a parent template, loop a queryset and include the partial per item: `{% for item in items %}{% include "_card.html" with item=item %}{% endfor %}`.',
      starterCode: `<!-- Assume _card.html exists and uses {{ item }} -->
<!-- Loop items and {% include %} _card.html with item=item -->
`,
      testCases: [
        {
          input: '{% include %} inside a for loop',
          expectedOutput: 'Partial rendered once per item',
          description: 'with ... = ... passes a limited context',
        },
      ],
      solution: `{% for item in items %}
  {% include "_card.html" with item=item %}
{% endfor %}`,
      explanation: '`{% include %}` renders another template inline with access to the full context (or a restricted one via `with ... only`). Perfect for card grids, form rows, common header snippets. Alternative: custom template tags (more power, more ceremony). Prefix partials with `_` by convention to signal they\'re not standalone pages. For highly reusable components across Django projects consider `django-components` / template `cotton`.',
      hints: [
        '{% include "partial.html" with x=y z=w %}',
        'Add "only" to isolate context: `{% include ... with x=y only %}`',
        'Prefix partial filenames with _ by convention',
      ],
      tags: ['django', 'templates', 'include', 'partial'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-dj-tpl-custom-filter',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_TEMPLATES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Register a custom template filter \`currency\` that formats a number as \`"$12.34"\`. In \`blog/templatetags/blog_extras.py\`: import \`template\` from \`django\`, create the module-level \`register\` as a \`template.Library\` instance, and declare a \`currency\` filter function decorated with \`register.filter\` that takes a numeric value and returns it formatted as a dollar amount with a thousands separator and two decimal places (for example \`"$1,234.50"\`). In a template you would then \`{% load blog_extras %}\` and write \`{{ product.price|currency }}\`. The \`templatetags/\` directory must contain an \`__init__.py\`.`,
      starterCode: `# blog/templatetags/blog_extras.py
# Create the module-level register, then declare the currency filter
# function (decorated so Django picks it up) that formats its value
# per the prompt's examples.
`,
      testCases: [
        {
          input: 'custom template filter',
          expectedOutput: 'Usable via {% load blog_extras %} then {{ price|currency }}',
          description: 'template.Library() + @register.filter',
        },
      ],
      solution: `# blog/templatetags/blog_extras.py
from django import template

register = template.Library()

@register.filter
def currency(value):
    return f"\${value:,.2f}"`,
      explanation: 'Custom filters live in `<app>/templatetags/<name>.py`. Always add `__init__.py` (empty) to that directory. Load in a template with `{% load blog_extras %}` (no `.py` or directory prefix). Filter signature: `(value, arg=None)` — use as `{{ x|filter }}` or `{{ x|filter:arg }}`. For tags that render blocks or need template access, use `@register.simple_tag` or `@register.inclusion_tag`.',
      hints: [
        'Directory: app/templatetags/ with __init__.py',
        '@register.filter def my_filter(value, arg=None): ...',
        '{% load my_tags %} then {{ x|my_filter }}',
      ],
      tags: ['django', 'templates', 'custom-filter', 'template-tags'],
      concepts: ['dj-templates'],
    },
  {
      id: 'py-dj-tpl-context-processors',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TEMPLATES,
      course: Course.BACKEND,
      question: 'What is a Django template context processor?',
      options: [
        { id: 'a', text: 'A function that auto-escapes HTML in template output to prevent XSS', isCorrect: false },
        { id: 'b', text: 'A callable that takes `request` and returns a dict added to every template\'s context', isCorrect: true },
        { id: 'c', text: 'A hook that pre-compiles template files before Django renders them', isCorrect: false },
        { id: 'd', text: 'An alternative, older name for the `render()` view shortcut', isCorrect: false },
      ],
      explanation: 'Context processors run for every template rendered with `RequestContext`. Built-ins: `django.contrib.auth.context_processors.auth` adds `{{ user }}`; `django.contrib.messages.context_processors.messages` adds `{{ messages }}`. Write your own to expose site-wide values (current site, feature flags, nav items) without threading them through every view. Register them in `TEMPLATES[0]["OPTIONS"]["context_processors"]` in settings. Example: write `def site_settings(request): return {"SITE_NAME": "MyBlog"}` and every template can use `{{ SITE_NAME }}` without the view passing it in. Use sparingly — global context makes templates depend on implicit state. Prefer view-local context unless the value is truly site-wide.',
      hints: [
        'Callable: request → dict; registered in TEMPLATES settings',
        'Built-ins: auth (user), messages, request, csrf',
        'Use for truly site-wide values; avoid as a dumping ground',
      ],
      tags: ['django', 'templates', 'context-processor'],
      concepts: ['dj-templates'],
    },
  {
      id: 'dj4e-tmpl-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TEMPLATES,
      course: Course.BACKEND,
      question: 'What is template inheritance in Django and how do you use it?',
      options: [
        { id: 'a', text: 'Importing one template into another using the `{% import %}` tag', isCorrect: false },
        { id: 'b', text: '`base.html` defines `{% block %}` sections; children `{% extends %}` it and override them', isCorrect: true },
        { id: 'c', text: 'Django automatically copying shared HTML between template files', isCorrect: false },
        { id: 'd', text: 'Using Python class inheritance on the underlying Template classes', isCorrect: false },
      ],
      explanation: 'Template inheritance avoids repeating HTML. A `base.html` defines the page structure with `{% block content %}{% endblock %}` placeholders. Child templates `{% extends "base.html" %}` and fill in those blocks with specific content. Only the blocks are replaced — the rest of `base.html` is inherited automatically. This is how you share navbars, footers, and page structure.',
      hints: [
        '`base.html` uses `{% block name %}{% endblock %}`',
        'Child templates start with `{% extends "base.html" %}` then override blocks',
      ],
      tags: ['django', 'templates', 'inheritance', 'extends', 'block', 'base'],
      concepts: ['py-super-call'],
    },
  {
      id: 'dj4e-tmpl-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TEMPLATES,
      course: Course.BACKEND,
      question: 'What is the difference between `{{ variable }}` and `{% tag %}` in Django templates?',
      options: [
        { id: 'a', text: '`{{ }}` is for HTML; `{% %}` is for Python code', isCorrect: false },
        { id: 'b', text: '`{{ variable }}` outputs a value; `{% tag %}` performs logic (loops, conditions, blocks)', isCorrect: true },
        { id: 'c', text: '`{{ }}` is for strings; `{% %}` is for numbers', isCorrect: false },
        { id: 'd', text: 'They are interchangeable — both can do the same things', isCorrect: false },
      ],
      explanation: 'Django templates have three syntax elements: `{{ variable }}` outputs a value (variable, attribute, or filter result). `{% tag %}` performs logic — `{% if %}`, `{% for %}`, `{% block %}`, `{% url %}`, `{% csrf_token %}`. `{# comment #}` adds a comment. Unlike Python, Django templates deliberately limit logic to keep business logic in views.',
      hints: [
        '`{{ }}` = output; `{% %}` = logic/control; `{# #}` = comment',
        'Filters modify output: `{{ name|upper }}`, `{{ list|length }}`',
      ],
      tags: ['django', 'templates', 'variables', 'tags', 'syntax', 'fundamentals'],
      concepts: ['dj-templates', 'py-builtin-io', 'py-control-flow'],
    },
  {
      id: 'py-dj-tpl-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TEMPLATES,
      course: Course.BACKEND,
      language: CodeLanguage.HTML,
      question:
        'Assemble a child template. Put the extends tag FIRST, then override the "title" block, then override the "content" block (rendering the article body).',
      correctOrder: [
        '{% extends "base.html" %}',
        '{% block title %}{{ article.title }}{% endblock %}',
        '{% block content %}<article>{{ article.body }}</article>{% endblock %}',
      ],
      distractorLines: [
        '{% include "base.html" %}',
        '{% extends base.html %}',
      ],
      solution:
        '{% extends "base.html" %}\n{% block title %}{{ article.title }}{% endblock %}\n{% block content %}<article>{{ article.body }}</article>{% endblock %}',
      explanation:
        '{% extends %} must be the first tag in the template — it loads the parent, then matching {% block %} tags override the parent\'s blocks. The template name is a quoted string. {% include %} pastes another template inline; it does NOT set up inheritance.',
      hints: ['extends (quoted name) comes first, then the block overrides.'],
      tags: ['django', 'templates', 'inheritance', 'extends', 'block'],
      concepts: ['py-super-call'],
    },
  {
      id: 'py-dj-tpl-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TEMPLATES,
      course: Course.BACKEND,
      language: CodeLanguage.HTML,
      question:
        'Assemble a loop that renders the _card.html partial once per item, passing the loop variable in as item.',
      correctOrder: [
        '{% for item in items %}',
        '{% include "_card.html" with item=item %}',
        '{% endfor %}',
      ],
      distractorLines: [
        '{% include _card.html with item=item %}',
        '{% endeach %}',
      ],
      solution:
        '{% for item in items %}\n{% include "_card.html" with item=item %}\n{% endfor %}',
      explanation:
        '{% for %} ... {% endfor %} is the loop; {% include %} renders a partial inline, and "with item=item" passes that variable into it. The partial filename must be quoted, and the loop closes with {% endfor %} (not {% endeach %}).',
      hints: ['for ... / include "..." with ... / endfor.'],
      tags: ['django', 'templates', 'include', 'for'],
      concepts: ['dj-templates', 'py-functools-cache-partial'],
    },
  {
      id: 'py-dj-tpl-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TEMPLATES,
      course: Course.BACKEND,
      language: CodeLanguage.HTML,
      question:
        'Fill in the tag that makes this child template inherit from base.html.',
      template: `{% ___ "base.html" %}
{% block content %}<article>{{ article.body }}</article>{% endblock %}`,
      blanks: ['extends'],
      solution:
        '{% extends "base.html" %}\n{% block content %}<article>{{ article.body }}</article>{% endblock %}',
      explanation:
        'extends loads the parent template; the child\'s blocks then override the parent\'s. It must be the first tag in the file.',
      hints: ['Inheritance tag — "extends from".'],
      tags: ['django', 'templates', 'extends'],
      concepts: ['py-super-call'],
    },
  {
      id: 'py-dj-tpl-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TEMPLATES,
      course: Course.BACKEND,
      language: CodeLanguage.HTML,
      question:
        'Fill in the template tag that builds a link from the named URL "home" (instead of hardcoding the path).',
      template: `<a href="{% ___ 'home' %}">Home</a>`,
      blanks: ['url'],
      solution: `<a href="{% url 'home' %}">Home</a>`,
      explanation:
        'The {% url %} tag reverses a URL name into its path, so renaming routes in urls.py never breaks templates. Namespaced form: {% url "blog:detail" post.pk %}.',
      hints: ['Three-letter tag that reverses a URL name.'],
      tags: ['django', 'templates', 'url-tag'],
      concepts: ['dj-templates'],
    },
  {
      id: 'py-dj-tpl-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TEMPLATES,
      course: Course.BACKEND,
      language: CodeLanguage.HTML,
      question:
        'Fill in the delimiters that OUTPUT a variable\'s value as text (as opposed to {% %}, which runs logic).',
      template: `<h1>___ article.title ___</h1>`,
      blanks: ['{{', '}}'],
      solution: `<h1>{{ article.title }}</h1>`,
      explanation:
        '{{ variable }} prints a value; {% tag %} performs logic (loops, conditionals, blocks). Mixing them up — {% article.title %} — is the most common beginner template error.',
      hints: ['Double curly braces output a value.'],
      tags: ['django', 'templates', 'variables', 'syntax'],
      concepts: ['dj-templates'],
    },
  {
    id: 'dj-templates-custom-filter-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_TEMPLATES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Complete the definition of a custom template filter `lower_case` that registers a filter converting its value to lowercase.',
    template: `from django import template

___ = template.Library()

@register.___
def lower_case(value):
    return value.lower()`,
    blanks: ['register', 'filter'],
    solution: `from django import template

register = template.Library()

@register.filter
def lower_case(value):
    return value.lower()`,
    explanation: 'To define custom filters/tags in Django, you must instantiate `register = template.Library()` at the module level, and then decorate the filter function using `@register.filter`. The module must reside in a `templatetags` directory within a registered app.',
    hints: [
      'The module level library instance must be named register',
      'The decorator to register a filter is @register.filter',
    ],
    tags: ['django', 'templates', 'custom-filter', 'cloze'],
    concepts: ['dj-templates'],
  },
];
