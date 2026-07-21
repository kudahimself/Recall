/**
 * Topic.DJ_FORMS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendGapQuestions.ts (4), djangoAdvancedRungQuestions.ts (2), djangoBatchCExpansionQuestions.ts (6), djangoClozeQuestions.ts (3), djangoGapDj4eQuestions.ts (2), djangoGapFillQuestions.ts (2), djangoParsonsQuestions.ts (3), djangoPredictOutputQuestions.ts (3)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_forms_questions: Question[] = [
  {
      id: 'dj-form-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.HTML,
      question: 'Write a Django template that renders an ArticleForm with CSRF protection, displays field errors, and has a submit button.',
      starterCode: `<!-- Form template -->\n<form method="post">\n`,
      testCases: [{ input: 'form template', expectedOutput: '{% csrf_token %}, {{ form.as_p }} or manual rendering', description: 'Should render form with CSRF' }],
      solution: `<form method="post">\n  {% csrf_token %}\n  {{ form.as_p }}\n  <button type="submit">Save</button>\n</form>\n\n{% if form.errors %}\n  <div class="errors">\n    {% for field, errors in form.errors.items %}\n      <p>{{ field }}: {{ errors|join:", " }}</p>\n    {% endfor %}\n  </div>\n{% endif %}`,
      explanation: '{% csrf_token %} is required for POST forms — it prevents cross-site request forgery. {{ form.as_p }} renders fields in <p> tags. form.errors contains validation errors after is_valid() fails. as_table and as_ul are alternatives.',
      tieredHints: {
        apiSignature: '{{ form.as_p }} | {{ form.as_table }} | {{ form.as_ul }}',
        skeleton: '<form method="post">\n  {% ____ %}\n  {{ ____.____ }}\n  <button type="submit">Save</button>\n</form>\n\n{% if ____.____ %}\n  <div class="errors">\n    {% for ____, ____ in ____.____.____ %}\n      <p>{{ ____ }}: {{ ____|join:", " }}</p>\n    {% endfor %}\n  </div>\n{% endif %}',
      },
      hints: ['{% csrf_token %} required for POST', '{{ form.as_p }} for quick rendering', 'form.errors for validation messages'],
      tags: ['form', 'template', 'csrf', 'errors', 'django'],
      concepts: ['dj-templates', 'dj-form-validation'],
    },
  {
      id: 'dj-forms-adv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Build a \`SignupForm\` (forms.Form, not ModelForm) with three production validations:
  
  1. \`username\` (CharField, 3-30 chars). Reject if a User already exists with that username (case-insensitive).
  2. \`email\` (EmailField). Reject if domain is in a static blocklist of \`{"tempmail.com", "throwaway.com"}\`.
  3. \`password\` and \`password_confirm\` must match — cross-field validation in \`clean()\`, attaching the error to \`password_confirm\`.
  
  Each rejection raises ValidationError with a clear message. Use \`User.objects\` for the username uniqueness check.`,
      starterCode: `from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()
BLOCKED_DOMAINS = {"tempmail.com", "throwaway.com"}
`,
      testCases: [
        {
          input: 'taken username, blocked email, mismatched passwords',
          expectedOutput: 'three distinct ValidationError paths covering field + cross-field',
          description: 'Field-level uniqueness check + domain blocklist + cross-field match',
        },
      ],
      solution: `from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()
BLOCKED_DOMAINS = {"tempmail.com", "throwaway.com"}


class SignupForm(forms.Form):
    username = forms.CharField(min_length=3, max_length=30)
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)
    password_confirm = forms.CharField(widget=forms.PasswordInput)

    def clean_username(self):
        username = self.cleaned_data["username"]
        if User.objects.filter(username__iexact=username).exists():
            raise ValidationError("Username already taken")
        return username

    def clean_email(self):
        email = self.cleaned_data["email"]
        domain = email.split("@", 1)[1].lower()
        if domain in BLOCKED_DOMAINS:
            raise ValidationError("This email domain is not allowed")
        return email

    def clean(self):
        cleaned = super().clean()
        pw = cleaned.get("password")
        confirm = cleaned.get("password_confirm")
        if pw and confirm and pw != confirm:
            self.add_error("password_confirm", "Passwords do not match")
        return cleaned`,
      explanation: 'Three validation layers in one form. `clean_<field>` runs after the field-level coercion and is the right place for "ask the database" checks — `User.objects.filter(...).exists()` is the canonical uniqueness check (cheaper than `.count() > 0`). Cross-field validation lives in the global `clean()` method; use `self.add_error(field, msg)` instead of `raise ValidationError` so the error attaches to a specific field instead of the form-level `__all__`. Always call `super().clean()` first so per-field validators run.',
      tieredHints: {
        apiSignature: 'Form.add_error(field, error)',
        skeleton: 'from django import forms\nfrom django.core.exceptions import ValidationError\nfrom django.contrib.auth import get_user_model\n\nUser = get_user_model()\nBLOCKED_DOMAINS = {"tempmail.com", "throwaway.com"}\n\n\nclass ____(forms.Form):\n    username = forms.____(min_length=3, max_length=30)\n    email = forms.____()\n    password = forms.____(widget=forms.____)\n    password_confirm = forms.____(widget=forms.____)\n\n    def ____(self):\n        ____ = self.____["username"]\n        if User.objects.____(username__iexact=____).____():\n            raise ____("Username already taken")\n        return ____\n\n    def ____(self):\n        ____ = self.____["email"]\n        domain = ____.____("@", 1)[1].____()\n        if domain in ____:\n            raise ____("This email domain is not allowed")\n        return ____\n\n    def ____(self):\n        cleaned = ____().clean()\n        pw = cleaned.____("password")\n        confirm = cleaned.____("password_confirm")\n        if pw and confirm and pw != confirm:\n            self.____("password_confirm", "Passwords do not match")\n        return ____',
      },
      hints: [
        'clean_<field> returns the value; clean() handles cross-field',
        'Use .exists() for uniqueness, not .count()',
        'Use self.add_error(field, msg) in clean() to attach to a field',
        'Call super().clean() in your clean() override',
      ],
      tags: ['django', 'forms', 'clean', 'add_error', 'cross-field', 'advanced'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-adv-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use a model formset to edit multiple Articles at once. Build the GET/POST view that renders the formset and saves only valid rows on POST. Skeleton: prevent unbound writes; redirect on success; re-render with errors otherwise.',
      correctOrder: [
        'from django.forms import modelformset_factory',
        'from django.shortcuts import render, redirect',
        'from .models import Article',
        '',
        'ArticleFormSet = modelformset_factory(Article, fields=["title", "status"], extra=0)',
        '',
        'def edit_articles(request):',
        '    qs = Article.objects.filter(author=request.user)',
        '    if request.method == "POST":',
        '        formset = ArticleFormSet(request.POST, queryset=qs)',
        '        if formset.is_valid():',
        '            formset.save()',
        '            return redirect("articles_list")',
        '    else:',
        '        formset = ArticleFormSet(queryset=qs)',
        '    return render(request, "articles/edit.html", {"formset": formset})',
      ],
      distractorLines: [
        '    formset = ArticleFormSet(queryset=qs, request.POST)',
        'ArticleFormSet = formset_factory(Article)',
        '            formset.save_all()',
        '    if formset.valid():',
      ],
      solution: 'from django.forms import modelformset_factory\nfrom django.shortcuts import render, redirect\nfrom .models import Article\n\nArticleFormSet = modelformset_factory(Article, fields=["title", "status"], extra=0)\n\ndef edit_articles(request):\n    qs = Article.objects.filter(author=request.user)\n    if request.method == "POST":\n        formset = ArticleFormSet(request.POST, queryset=qs)\n        if formset.is_valid():\n            formset.save()\n            return redirect("articles_list")\n    else:\n        formset = ArticleFormSet(queryset=qs)\n    return render(request, "articles/edit.html", {"formset": formset})',
      explanation: '`modelformset_factory(Model, fields=[...], extra=N)` is the modern factory for editing multiple model instances on one page. `extra=0` suppresses the "blank rows" you\'d use for *creating* new instances — here we only want to edit existing ones. Always scope `queryset` to the current user — without it, formsets default to ALL rows of the model, leaking other users\' data. Order matters: `request.POST` first, `queryset=` second on rebind.',
      hints: [
        'modelformset_factory for editing multiple instances',
        'extra=0 hides blank "create" rows',
        'queryset= scopes which rows are editable — security-critical',
        'POST: rebind with both request.POST and queryset',
      ],
      tags: ['django', 'forms', 'formset', 'modelformset_factory', 'parsons', 'advanced'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'py-dj-form-modelform',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a `ModelForm` for an `Article` model. Import `forms` from `django` and `Article` from `.models`. Create an `ArticleForm` that subclasses `forms.ModelForm` and contains an inner `Meta` class pointing its `model` attribute at `Article` and its `fields` list at `title` and `body`. That is it — Django generates widgets, labels, and validators from the model fields.',
      starterCode: `# Define ArticleForm as a ModelForm whose inner Meta binds it to the
# Article model and exposes the title and body fields.
`,
      testCases: [
        {
          input: 'ModelForm for Article with title and body',
          expectedOutput: 'class ArticleForm with Meta.model and fields',
          description: 'Meta.model + fields is the minimum ModelForm',
        },
      ],
      solution: `from django import forms
from .models import Article

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ["title", "body"]`,
      explanation: 'ModelForms skip the boilerplate of redeclaring every field — the model is the source of truth. Use `fields = "__all__"` in development (shows everything), but be explicit in production (new model fields get auto-exposed otherwise — a common data-leak path). Use `exclude = [...]` sparingly (same leak risk). Override individual fields in the form class body to customise widgets: `title = forms.CharField(widget=forms.TextInput(attrs={"class": "fancy"}))`.',
      tieredHints: {
        apiSignature: 'ModelForm.Meta: model, fields',
        skeleton: 'from django import forms\nfrom .models import ____\n\nclass ____(forms.____):\n    class ____:\n        ____ = ____\n        ____ = ["title", "body"]',
      },
      hints: [
        'Meta.model + Meta.fields is the minimum',
        'Avoid fields = "__all__" in production',
        'Override fields in class body to customise widgets',
      ],
      tags: ['django', 'forms', 'ModelForm'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'py-dj-form-clean-field',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Add field-level validation with the `clean_<field>` hook. Define `ArticleForm` as a `forms.ModelForm` bound to the `Article` model exposing fields `title` and `body`. Add the field-level hook for `title` — it should pull the submitted title out of the form\'s cleaned data, raise `forms.ValidationError("Title too short")` when it has fewer than 5 characters, and otherwise return the title unchanged. Django calls this hook automatically during validation.',
      starterCode: `# ArticleForm: a ModelForm on Article (title, body) plus the
# field-level validation hook for title described in the prompt —
# read the cleaned value, reject under-5-character titles, return it.
`,
      testCases: [
        {
          input: 'clean_title field-level validation',
          expectedOutput: 'ValidationError when title too short; returns value on success',
          description: 'Must return the cleaned value',
        },
      ],
      solution: `from django import forms
from .models import Article

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ["title", "body"]

    def clean_title(self):
        title = self.cleaned_data["title"]
        if len(title) < 5:
            raise forms.ValidationError("Title too short")
        return title`,
      explanation: 'Django\'s clean protocol: basic validators run first (type coercion, max_length, regex). Then `clean_<field>` for each field in declaration order. Then `clean()` for cross-field validation. ALWAYS return the cleaned value — if you forget, the field is silently `None`. Raise `ValidationError` to surface an error — it appears as `form.errors["title"]` and near the field in the rendered form.',
      tieredHints: {
        apiSignature: 'clean_<fieldname>(self) -> Any',
        skeleton: 'from django import forms\nfrom .models import ____\n\nclass ____(forms.ModelForm):\n    class Meta:\n        model = ____\n        fields = ["title", "body"]\n\n    def ____(self):\n        ____ = self.____["title"]\n        if len(____) < 5:\n            raise forms.____("Title too short")\n        return ____',
      },
      hints: [
        'Must return the (possibly modified) value',
        'Raise forms.ValidationError for errors',
        'Runs after basic validators (type, max_length)',
      ],
      tags: ['django', 'forms', 'clean', 'validation'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-clean-cross-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the cross-field check: reject when end is before start.',
      template: `class BookingForm(forms.Form):
    start = forms.DateField()
    end = forms.DateField()

    def clean(self):
        cleaned = ___.clean()
        s, e = cleaned.get("start"), cleaned.get("end")
        if s and e and e < s:
            raise forms.___("End date must be after start date")
        return cleaned`,
      blanks: ['super()', 'ValidationError'],
      solution: 'class BookingForm(forms.Form):\n    start = forms.DateField()\n    end = forms.DateField()\n\n    def clean(self):\n        cleaned = super().clean()\n        s, e = cleaned.get("start"), cleaned.get("end")\n        if s and e and e < s:\n            raise forms.ValidationError("End date must be after start date")\n        return cleaned',
      explanation: 'Cross-field checks belong in the global `clean()`, not `clean_<field>` (which only ever sees its own field). Call `super().clean()` first, guard with `.get()` since a field that already failed its own validation is absent from `cleaned_data`, and raise `ValidationError` for a form-level error — it lands in `form.non_field_errors()` rather than a specific field.',
      hints: ['Start from super().clean()', 'Guard with .get() before comparing', 'raise ValidationError() for a form-level error'],
      tags: ['django', 'forms', 'clean', 'cross-field', 'cloze'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'py-dj-form-clean-cross-field',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Add cross-field validation with `clean`. Define a `BookingForm` that subclasses `forms.Form` and declares two `DateField` members named `start` and `end`. Override the `clean` method: call the parent `clean` to get the cleaned data dict, then if both `start` and `end` entries are present (use safe dict access) and the `end` date is earlier than the `start` date, raise `forms.ValidationError("End date must be after start date")`. Return the cleaned data dict at the end.',
      starterCode: `# BookingForm: two DateFields (start, end) and an overridden clean()
# that gets the parent's cleaned data, rejects end-before-start when
# both dates are present, and returns the cleaned dict.
`,
      testCases: [
        {
          input: 'clean() cross-field check',
          expectedOutput: 'ValidationError when end < start',
          description: 'clean() runs after all clean_<field> methods',
        },
      ],
      solution: `from django import forms

class BookingForm(forms.Form):
    start = forms.DateField()
    end = forms.DateField()

    def clean(self):
        cleaned = super().clean()
        s, e = cleaned.get("start"), cleaned.get("end")
        if s and e and e < s:
            raise forms.ValidationError("End date must be after start date")
        return cleaned`,
      explanation: 'Field validators can\'t know about other fields — that\'s what `clean()` is for. Important: guard with `.get()` because a field may have failed its own `clean_<field>` and be missing from `cleaned_data`. Errors raised from `clean()` (without a field-specific key) appear in `form.non_field_errors()`. Return `cleaned` so the rest of the framework gets the dict.',
      tieredHints: {
        apiSignature: 'Form.clean(self) -> dict',
        skeleton: 'from django import forms\n\nclass ____(forms.Form):\n    start = forms.____()\n    end = forms.____()\n\n    def ____(self):\n        cleaned = ____().____()\n        s, e = cleaned.____("start"), cleaned.____("end")\n        if s and e and e < s:\n            raise forms.____("End date must be after start date")\n        return ____',
      },
      hints: [
        'Override clean() for cross-field validation',
        'Guard with .get() — a failed field won\'t be in cleaned_data',
        'Always call super().clean() and return the dict',
      ],
      tags: ['django', 'forms', 'clean', 'cross-field'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-widgets-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Give the body field a bigger textarea via Meta.widgets. Fill the Meta attribute and the widget class.',
      template: `class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ["title", "body"]
        ___ = {
            "body": forms.___(attrs={"rows": 10}),
        }`,
      blanks: ['widgets', 'Textarea'],
      solution: 'class ArticleForm(forms.ModelForm):\n    class Meta:\n        model = Article\n        fields = ["title", "body"]\n        widgets = {\n            "body": forms.Textarea(attrs={"rows": 10}),\n        }',
      explanation: '`Meta.widgets` maps field names to widget INSTANCES (not classes), so you can pass `attrs`. `forms.Textarea` renders a multi-line `<textarea>` instead of the default single-line `<input>`.',
      hints: ['The Meta attribute name is widgets', 'Textarea is the multi-line widget class'],
      tags: ['django', 'forms', 'widgets', 'Meta', 'cloze'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'py-dj-form-widgets',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Customise widgets on a ModelForm. Define `ArticleForm` as a `forms.ModelForm` bound to the `Article` model exposing fields `title` and `body`. On its `Meta` inner class, add a `widgets` mapping that pairs the `body` field with a `forms.Textarea` configured with the HTML attrs `rows=10` and `class="prose"` so the rendered textarea has 10 rows and the CSS class `prose`.',
      starterCode: `# ArticleForm: ModelForm on Article (title, body) whose Meta also
# carries a widgets mapping giving body a Textarea with the
# rows/class attrs described in the prompt.
`,
      testCases: [
        {
          input: 'Meta.widgets customisation',
          expectedOutput: 'Rendered <textarea rows="10" class="prose">',
          description: 'widgets dict maps field → widget instance',
        },
      ],
      solution: `from django import forms
from .models import Article

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ["title", "body"]
        widgets = {
            "body": forms.Textarea(attrs={"rows": 10, "class": "prose"}),
        }`,
      explanation: 'The `widgets` Meta attribute maps field names to widget INSTANCES — not classes, so you can configure them. `attrs` becomes HTML attributes: class, data-*, placeholder, maxlength. Other common widgets: `forms.PasswordInput` (type=password), `forms.DateInput(attrs={"type": "date"})` (HTML5 date picker), `forms.Select` (dropdown), `forms.CheckboxInput`. For cross-cutting style changes (every input needs `form-control`), a form package like `crispy-forms` or `django-widget-tweaks` saves repetition.',
      tieredHints: {
        apiSignature: 'forms.Widget(attrs=None)',
        skeleton: 'from django import forms\nfrom .models import ____\n\nclass ____(forms.____):\n    class ____:\n        ____ = ____\n        ____ = [____, ____]\n        ____ = {\n            ____: forms.____(attrs={____: 10, ____: ____}),\n        }',
      },
      hints: [
        'widgets = {"field": WidgetClass(attrs={...})}',
        'attrs become HTML attributes on the input',
        'forms.Textarea, PasswordInput, DateInput, Select, CheckboxInput',
      ],
      tags: ['django', 'forms', 'widgets'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'py-dj-form-cleaneddata',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Show the canonical view-side form flow. Import `render` and `redirect` from `django.shortcuts`, and `ArticleForm` from `.forms`. Define a view `create_article` that takes a request. On POST, bind an `ArticleForm` to the submitted POST data; if the form is valid, save it to get the new article, then redirect to the URL named `"blog:detail"` passing the saved article\'s primary key as `pk`. On GET (or an invalid POST), render `"blog/new.html"` with the form in the context under key `"form"` — invalid POSTs re-render the same template with error messages attached.',
      starterCode: `# create_article(request): on POST bind ArticleForm to the data,
# save when valid and redirect to "blog:detail" with the new pk;
# on GET (or invalid POST) render "blog/new.html" with the form.
`,
      testCases: [
        {
          input: 'POST/GET view for a form',
          expectedOutput: 'On valid POST → save + redirect; else re-render with errors',
          description: 'Canonical form-handling flow',
        },
      ],
      solution: `from django.shortcuts import render, redirect
from .forms import ArticleForm

def create_article(request):
    if request.method == "POST":
        form = ArticleForm(request.POST)
        if form.is_valid():
            article = form.save()
            return redirect("blog:detail", pk=article.pk)
    else:
        form = ArticleForm()
    return render(request, "blog/new.html", {"form": form})`,
      explanation: 'This is the Post/Redirect/Get (PRG) pattern: always redirect after a successful POST so refreshing the result page doesn\'t resubmit. `form = ArticleForm()` (empty) for GET, `ArticleForm(request.POST)` (bound) for POST. If you need extra data, `form.save(commit=False)` gives you the unsaved instance, let you mutate (`article.author = request.user`), then `article.save()`. File uploads also need `request.FILES`: `ArticleForm(request.POST, request.FILES)`.',
      tieredHints: {
        apiSignature: 'Form.is_valid() -> bool',
        skeleton: 'from django.shortcuts import render, redirect\nfrom .forms import ____\n\ndef ____(request):\n    if request.method == ____:\n        form = ____(request.POST)\n        if form.____():\n            article = form.____()\n            return ____("blog:detail", pk=article.pk)\n    else:\n        form = ____()\n    return ____(request, ____, {"form": form})',
      },
      hints: [
        'POST + valid → save + redirect (PRG pattern)',
        'POST + invalid OR GET → render the form',
        'form.save(commit=False) to mutate before saving',
      ],
      tags: ['django', 'forms', 'view', 'POST', 'PRG'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'py-dj-form-vs-modelform',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      question: 'When should you reach for `forms.Form` instead of `forms.ModelForm`?',
      options: [
        { id: 'a', text: 'Never — `ModelForm` is strictly a superset, so it always applies', isCorrect: false },
        { id: 'b', text: 'When the form doesn\'t map to a single model — login, search filters, contact pages, wizards', isCorrect: true },
        { id: 'c', text: 'When you want to skip validation, which `ModelForm` always enforces', isCorrect: false },
        { id: 'd', text: 'When you need custom widgets, which `ModelForm` doesn\'t support', isCorrect: false },
      ],
      explanation: '`Form` is about accepting input; `ModelForm` adds convenience when the input maps cleanly to one model. Classic `Form` use-cases: login (LoginForm has user+password; User.objects.create() is never called), contact forms (write an email, not a model row), filters ("show me orders from X to Y"), search boxes, wizards that collect data across several models before saving. For "this form IS a model row", ModelForm saves you time.',
      hints: [
        'Form: input without a 1-to-1 model mapping',
        'ModelForm: form IS a model row',
        'Login / filters / reports / wizards → Form',
      ],
      tags: ['django', 'forms', 'ModelForm', 'design'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a ModelForm exposing only the title and body fields of Article.',
      template: `from django import forms
from .models import Article

class ArticleForm(forms.___):
    class ___:
        ___ = Article
        ___ = ["title", "body"]`,
      blanks: ['ModelForm', 'Meta', 'model', 'fields'],
      solution: 'from django import forms\nfrom .models import Article\n\nclass ArticleForm(forms.ModelForm):\n    class Meta:\n        model = Article\n        fields = ["title", "body"]',
      explanation: '`ModelForm` auto-generates fields from the model. The `Meta` inner class declares which model and which fields to expose. `fields` must be a list of names — passing a string would silently break introspection.',
      hints: ['Inherit from forms.ModelForm', 'Meta.model is the class', 'Meta.fields is a list'],
      tags: ['django', 'forms', 'ModelForm', 'Meta', 'cloze'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Reject titles shorter than 5 chars at the field level. Read from cleaned_data and return the value.',
      template: `class ArticleForm(forms.ModelForm):
      class Meta:
          model = Article
          fields = ["title"]
  
      def ___(self):
          title = self.___["title"]
          if len(title) < 5:
              raise ___("too short")
          return ___`,
      blanks: ['clean_title', 'cleaned_data', 'ValidationError', 'title'],
      solution: 'class ArticleForm(forms.ModelForm):\n    class Meta:\n        model = Article\n        fields = ["title"]\n\n    def clean_title(self):\n        title = self.cleaned_data["title"]\n        if len(title) < 5:\n            raise ValidationError("too short")\n        return title',
      explanation: 'Per-field validators are named `clean_<fieldname>(self)` — no extra parameters. They read from `self.cleaned_data` (post-coercion), and must `return` the value. Raising `ValidationError` attaches the error to the matching field.',
      hints: ['Method name encodes the field', 'Read from cleaned_data', 'Must return the value'],
      tags: ['django', 'forms', 'clean_field', 'ValidationError', 'cloze'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Bind, validate, save, and redirect — the canonical POST handler with a ModelForm.',
      template: `def create_article(request):
      form = ArticleForm(request.___)
      if form.___():
          article = form.___()
          return redirect("article_detail", pk=article.pk)
      return render(request, "form.html", {"form": form})`,
      blanks: ['POST', 'is_valid', 'save'],
      solution: 'def create_article(request):\n    form = ArticleForm(request.POST)\n    if form.is_valid():\n        article = form.save()\n        return redirect("article_detail", pk=article.pk)\n    return render(request, "form.html", {"form": form})',
      explanation: 'Bind with `request.POST` (and optionally `request.FILES`). `is_valid()` is a method (parens required) — it triggers field cleaning. On success, `form.save()` returns the persisted instance. On failure, re-render with the bound form so errors render alongside fields.',
      hints: ['Bind with request.POST', 'is_valid() with parens', 'save() returns the instance'],
      tags: ['django', 'forms', 'is_valid', 'save', 'cloze'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj4e-forms-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      question: 'What is the difference between `Form` and `ModelForm` in Django?',
      options: [
        { id: 'a', text: '`ModelForm` can only be used in class-based views; `Form` works everywhere', isCorrect: false },
        { id: 'b', text: '`Form` is a standalone form; `ModelForm` auto-generates fields from a model and can save directly to the database', isCorrect: true },
        { id: 'c', text: '`Form` validates data; `ModelForm` only renders HTML', isCorrect: false },
        { id: 'd', text: 'They are identical — `ModelForm` is just a subclass alias', isCorrect: false },
      ],
      explanation: '`Form` is a general-purpose form where you define fields manually. `ModelForm` introspects a model and auto-generates form fields from model fields — massive time saver. `ModelForm` also has a `.save()` method that creates/updates the database record. Use `ModelForm` for CRUD forms tied to a model; use `Form` for login, search, or custom logic.',
      hints: [
        '`ModelForm` auto-generates fields from a model and has `.save()`',
        'Set `class Meta: model = ...; fields = [...]` in a `ModelForm`',
      ],
      tags: ['django', 'forms', 'ModelForm', 'Form', 'validation'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj4e-forms-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a `ModelForm` for `Article` (fields: title, body). Then write a function-based view that handles both GET (render empty form) and POST (validate, save, redirect).',
      starterCode: `# Imports: forms from django; render, redirect from django.shortcuts

# 1. ArticleForm — a ModelForm on Article exposing title and body.

# 2. create_article(request) — on POST bind the form, save when valid
#    and redirect to "article-list"; otherwise render
#    "articles/create.html" with the (empty or invalid) form.
`,
      testCases: [
        { input: '', expectedOutput: 'GET renders form, POST saves and redirects', description: 'View handles both GET and POST' },
      ],
      solution: `from django import forms
from django.shortcuts import render, redirect

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ['title', 'body']

def create_article(request):
    if request.method == 'POST':
        form = ArticleForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('article-list')
    else:
        form = ArticleForm()
    return render(request, 'articles/create.html', {'form': form})`,
      explanation: 'The GET branch creates an empty form. The POST branch binds `request.POST` data to the form and validates it. `form.is_valid()` runs all field validators and model validators. `form.save()` writes to the database. If validation fails, the form (with errors) is re-rendered — the `return render(...)` after the if/else handles both the initial GET and failed POST.',
      tieredHints: {
        apiSignature: 'ModelForm.save(commit=True) -> Model',
        skeleton: 'from django import forms\nfrom django.shortcuts import render, redirect\n\nclass ____(forms.____):\n    class ____:\n        ____ = Article\n        ____ = [____, ____]\n\ndef ____(request):\n    if request.method == ____:\n        form = ____(request.POST)\n        if form.____():\n            form.____()\n            return ____(____)\n    else:\n        form = ____()\n    return ____(request, ____, {____: form})',
      },
      hints: [
        'Pass `request.POST` to bind data: `ArticleForm(request.POST)`',
        'Call `form.is_valid()` before `form.save()`',
      ],
      tags: ['django', 'forms', 'ModelForm', 'views', 'POST', 'GET', 'validation'],
      concepts: ['dj-form-validation', 'dj-view-patterns'],
    },
  {
      id: 'dj-forms-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      question: 'What is a Django Form?\n\nWhen users submit data through HTML forms (login, registration, contact pages), you need to validate that data. Django provides a Form class to handle this.',
      options: [
        {
          id: 'a',
          text: 'A JavaScript library for building interactive form UIs in the browser',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'A class that renders form inputs, validates submitted data, and returns cleaned values or errors',
          isCorrect: true,
        },
        {
          id: 'c',
          text: 'A database model used specifically for storing user form submissions',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'A template tag that generates complete HTML `<form>` elements automatically',
          isCorrect: false,
        },
      ],
      explanation: 'A Django Form is a Python class that defines form fields and their validation rules. It does three things: (1) renders HTML input elements so you don\'t write raw HTML, (2) validates submitted data server-side (checking types, required fields, email format, etc.), and (3) provides cleaned_data — a dictionary of validated, type-converted values. If validation fails, it provides error messages you can display to the user.',
      hints: [
        'Django Forms handle both rendering HTML and validating data',
        'form.is_valid() checks all fields; form.cleaned_data gives you the validated values',
      ],
      tags: ['django', 'forms', 'validation', 'basics'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-plainform-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Declare a plain (non-model) form with a name field and an email field.',
      template: `from django import forms

class ContactForm(forms.___):
    name = forms.___(max_length=100)
    email = forms.___()`,
      blanks: ['Form', 'CharField', 'EmailField'],
      solution: 'from django import forms\n\nclass ContactForm(forms.Form):\n    name = forms.CharField(max_length=100)\n    email = forms.EmailField()',
      explanation: 'A plain `forms.Form` declares each field explicitly as a class attribute — unlike `ModelForm`, there is no `Meta`/model to infer fields from. `CharField` validates text input (with an optional `max_length`); `EmailField` additionally validates the email format.',
      hints: ['Base class for a form with no model', 'CharField for text, EmailField validates format'],
      tags: ['django', 'forms', 'CharField', 'EmailField', 'cloze'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-gap-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a simple ContactForm with three fields: name (CharField, max_length=100), email (EmailField), and message (CharField using a Textarea widget). Import the forms module and define the form class.',
      starterCode: `# forms.py
# Import Django forms and create a ContactForm

`,
      testCases: [
        {
          input: 'ContactForm class definition',
          expectedOutput: 'Form class with name (CharField), email (EmailField), message (CharField with Textarea widget)',
          description: 'Should define a ContactForm with three properly typed fields',
        },
      ],
      solution: `# forms.py
from django import forms

class ContactForm(forms.Form):
    name = forms.CharField(max_length=100)
    email = forms.EmailField()
    message = forms.CharField(widget=forms.Textarea)`,
      explanation: 'Django forms are defined by subclassing forms.Form and declaring fields as class attributes. CharField handles text input, EmailField validates email format automatically, and using widget=forms.Textarea renders a multi-line text area instead of a single-line input. When you call form.is_valid(), Django checks that name is under 100 characters, email is a valid email address, and all fields are filled in.',
      tieredHints: {
        apiSignature: 'forms.CharField(max_length=None, widget=None)',
        skeleton: '# forms.py\nfrom django import forms\n\nclass ContactForm(forms.Form):\n    name = forms.____(max_length=100)\n    email = forms.____()\n    message = forms.CharField(widget=forms.____)',
      },
      hints: [
        'Import forms from django, not from django.forms',
        'For a multi-line text input, use widget=forms.Textarea on a CharField',
      ],
      tags: ['django', 'forms', 'CharField', 'EmailField', 'textarea'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a ModelForm `ArticleForm` for the `Article` model exposing only the `title` and `body` fields.',
      correctOrder: [
        'from django import forms',
        'from .models import Article',
        '',
        'class ArticleForm(forms.ModelForm):',
        '    class Meta:',
        '        model = Article',
        '        fields = ["title", "body"]',
      ],
      distractorLines: [
        'class ArticleForm(forms.Form):',
        '        fields = "title, body"',
        '        model = "Article"',
        '    class Meta(forms.ModelForm):',
      ],
      solution: 'from django import forms\nfrom .models import Article\n\nclass ArticleForm(forms.ModelForm):\n    class Meta:\n        model = Article\n        fields = ["title", "body"]',
      explanation: '`ModelForm` auto-generates fields from the model. `Meta.fields` is a *list* of field names — passing a string would break introspection. `model` is the class itself, not its name. `fields = "__all__"` exposes everything but is generally discouraged for input forms (mass-assignment risk).',
      hints: ['Inherit from forms.ModelForm', 'Meta.fields is a list', 'model = Article (the class, not "Article")'],
      tags: ['django', 'forms', 'ModelForm', 'Meta', 'parsons'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Add a per-field validator to ArticleForm: `clean_title` rejects titles shorter than 5 chars by raising ValidationError, otherwise returns the cleaned value.',
      correctOrder: [
        'from django.core.exceptions import ValidationError',
        '',
        'class ArticleForm(forms.ModelForm):',
        '    class Meta:',
        '        model = Article',
        '        fields = ["title", "body"]',
        '',
        '    def clean_title(self):',
        '        title = self.cleaned_data["title"]',
        '        if len(title) < 5:',
        '            raise ValidationError("Title too short")',
        '        return title',
      ],
      distractorLines: [
        '    def clean(self, title):',
        '        return ValidationError("Title too short")',
        '        title = self.data["title"]',
        '    def clean_title(self, title):',
      ],
      solution: 'from django.core.exceptions import ValidationError\n\nclass ArticleForm(forms.ModelForm):\n    class Meta:\n        model = Article\n        fields = ["title", "body"]\n\n    def clean_title(self):\n        title = self.cleaned_data["title"]\n        if len(title) < 5:\n            raise ValidationError("Title too short")\n        return title',
      explanation: '`clean_<fieldname>(self)` is called automatically by Django after the field-level validators run. It must read from `self.cleaned_data["title"]` (NOT `self.data`, which is raw POST), and **return** the (possibly transformed) value. Raising `ValidationError` attaches the error to that field; returning normally signals success.',
      hints: ['No extra parameters — read self.cleaned_data', 'Must return the value', 'raise ValidationError to fail'],
      tags: ['django', 'forms', 'clean_field', 'ValidationError', 'parsons'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'In a view, instantiate ArticleForm from request.POST, validate it, save on success, and re-render with errors on failure. Skeleton for a POST-only handler.',
      correctOrder: [
        'def create_article(request):',
        '    form = ArticleForm(request.POST)',
        '    if form.is_valid():',
        '        article = form.save()',
        '        return redirect("article_detail", pk=article.pk)',
        '    return render(request, "form.html", {"form": form})',
      ],
      distractorLines: [
        '    form = ArticleForm(request)',
        '    if form.valid():',
        '        form.save_model()',
        '    if form.is_valid:',
      ],
      solution: 'def create_article(request):\n    form = ArticleForm(request.POST)\n    if form.is_valid():\n        article = form.save()\n        return redirect("article_detail", pk=article.pk)\n    return render(request, "form.html", {"form": form})',
      explanation: 'Pass `request.POST` (not `request`) when binding. `is_valid()` is a method (parentheses required). On failure, render the same template with the bound form so errors render alongside fields. `form.save()` returns the persisted instance.',
      hints: ['Bind with request.POST, not request', 'is_valid() — method call', 'form.save() returns the instance'],
      tags: ['django', 'forms', 'is_valid', 'save', 'parsons'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What\'s printed for an unbound form? (No POST data passed.)',
      code: `class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ["title"]

form = ArticleForm()  # unbound
print(form.is_bound)
print(form.is_valid())`,
      expectedOutput: `False
False`,
      explanation: 'A form is *bound* only if you pass data (`ArticleForm(request.POST)`). Unbound forms have `is_bound=False` and `is_valid()` returns False (there\'s nothing to validate). Calling `cleaned_data` on an unbound form raises AttributeError — always check `is_valid()` first.',
      hints: ['Bound = data was passed in', 'Unbound forms can\'t be valid'],
      tags: ['django', 'forms', 'bound', 'is_valid', 'predict'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this print, given the clean_title rejects strings shorter than 5 chars?',
      code: `class ArticleForm(forms.Form):
    title = forms.CharField()

    def clean_title(self):
        t = self.cleaned_data["title"]
        if len(t) < 5:
            raise ValidationError("too short")
        return t.upper()

form = ArticleForm({"title": "hello"})
form.is_valid()
print(form.cleaned_data["title"])`,
      expectedOutput: `HELLO`,
      explanation: 'A `clean_<field>` method can not only validate but also TRANSFORM the value — whatever it returns replaces `cleaned_data[field]`. Here `t.upper()` is returned, so `cleaned_data["title"]` is `"HELLO"` after `is_valid()` runs.',
      hints: ['clean_<field> can return a transformed value', 'is_valid() must run before cleaned_data is populated'],
      tags: ['django', 'forms', 'clean_field', 'transform', 'predict'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this print when title is too short?',
      code: `class ArticleForm(forms.Form):
    title = forms.CharField()

    def clean_title(self):
        t = self.cleaned_data["title"]
        if len(t) < 5:
            raise ValidationError("too short")
        return t

form = ArticleForm({"title": "hi"})
print(form.is_valid())
print(list(form.errors.keys()))`,
      expectedOutput: `False
['title']`,
      explanation: 'When `clean_<fieldname>` raises `ValidationError`, the error is attached to that specific field — `form.errors["title"]` will contain the message. `is_valid()` returns False. Cross-field errors (raised inside the global `clean()` method) attach to the special key `__all__` instead.',
      hints: ['Field-level errors land on form.errors[field]', 'is_valid() returns bool'],
      tags: ['django', 'forms', 'errors', 'ValidationError', 'predict'],
      concepts: ['dj-form-validation'],
    },
  // ===== Layer A: in-place advanced single-skill primitives (depth) =====
  // Built-in field validators
  {
      id: 'dj-forms-validators-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      question: 'You need every `slug` field across several forms to reject anything that is not lowercase letters and hyphens, reusing one rule. Is a `clean_slug` method or a field `validators=[...]` list the better fit, and why?',
      options: [
        { id: 'a', text: 'A `validators=[RegexValidator(...)]` list — a reusable callable you attach to many fields/forms; `clean_<field>` is for one-off logic specific to a single form', isCorrect: true },
        { id: 'b', text: 'A `clean_slug` method — it is the only place a regex check is allowed; `validators=` accepts only Django built-ins, never a regex pattern', isCorrect: false },
        { id: 'c', text: 'Either is identical; `validators=` is just an alias that Django rewrites into a `clean_<field>` method when the form class is imported', isCorrect: false },
        { id: 'd', text: 'A `validators=[RegexValidator(...)]` list — but it runs only on a `ModelForm`, so plain `Form` fields are stuck using `clean_slug`', isCorrect: false },
      ],
      explanation: 'A validator is a reusable callable (`RegexValidator`, `MinLengthValidator`, or any function raising `ValidationError`) attached via `validators=[...]`. Define it once, reuse it on any field of any form. `clean_<field>` is the right tool for validation logic unique to one form. Validators run during the field-cleaning phase on both `Form` and `ModelForm`.',
      hints: [
        'validators=[...] is a reusable list of callables',
        'clean_<field> is for one-off, form-specific logic',
        'Validators run on Form and ModelForm alike',
      ],
      tags: ['django', 'forms', 'validators', 'RegexValidator'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-validators-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Attach a reusable regex rule to a field. Fill the keyword that takes a list of validator callables.',
      template: `from django import forms
from django.core.validators import RegexValidator

slug_rule = RegexValidator(r"^[a-z-]+$", "lowercase and hyphens only")

class TagForm(forms.Form):
    slug = forms.CharField(___=[slug_rule])`,
      blanks: ['validators'],
      solution: 'from django import forms\nfrom django.core.validators import RegexValidator\n\nslug_rule = RegexValidator(r"^[a-z-]+$", "lowercase and hyphens only")\n\nclass TagForm(forms.Form):\n    slug = forms.CharField(validators=[slug_rule])',
      explanation: '`validators=[...]` accepts any callable that raises `ValidationError` on bad input. `RegexValidator(pattern, message)` is the common built-in; the same `slug_rule` object can be reused on every form that has a slug.',
      hints: ['The field kwarg takes a list of callables', 'RegexValidator(pattern, message)'],
      tags: ['django', 'forms', 'validators', 'RegexValidator', 'cloze'],
      concepts: ['dj-form-validation'],
    },
  // ChoiceField (static dropdown)
  {
      id: 'dj-forms-choicefield-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      question: 'A form needs a dropdown. When do you reach for `ChoiceField(choices=...)` versus `ModelChoiceField(queryset=...)`?',
      options: [
        { id: 'a', text: '`ChoiceField` for a fixed set of options known at code time; `ModelChoiceField` when options are database rows (and the selection should clean to a model instance)', isCorrect: true },
        { id: 'b', text: '`ChoiceField` when the options come from the database; `ModelChoiceField` for a fixed set of options hardcoded into the form class', isCorrect: false },
        { id: 'c', text: 'They are interchangeable; `ModelChoiceField` is simply the newer name and `ChoiceField` is now deprecated in current Django', isCorrect: false },
        { id: 'd', text: '`ChoiceField` cleans the chosen option to a model instance; `ModelChoiceField` cleans the selection only to its raw string value', isCorrect: false },
      ],
      explanation: '`ChoiceField(choices=[(value, label), ...])` is for a static, code-time list (sizes, priorities). `ModelChoiceField(queryset=...)` builds the options from the DB at render time and cleans the chosen pk back into the actual model instance — so `cleaned_data["category"]` is a `Category` object, ready to assign to a FK. `ModelMultipleChoiceField` does the same for a multi-select, cleaning to a queryset.',
      hints: [
        'ChoiceField = static options; ModelChoiceField = DB rows',
        'ModelChoiceField cleans to a model instance',
        'ModelMultipleChoiceField → a queryset',
      ],
      tags: ['django', 'forms', 'ChoiceField', 'ModelChoiceField'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-choicefield-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Render a static size dropdown. Fill the field class for a fixed list of options.',
      template: `from django import forms

class OrderForm(forms.Form):
    size = forms.___(choices=[("s", "Small"), ("m", "Medium"), ("l", "Large")])`,
      blanks: ['ChoiceField'],
      solution: 'from django import forms\n\nclass OrderForm(forms.Form):\n    size = forms.ChoiceField(choices=[("s", "Small"), ("m", "Medium"), ("l", "Large")])',
      explanation: '`ChoiceField(choices=[(stored_value, human_label), ...])` renders a `<select>`. The submitted value is validated against the first element of each tuple; `cleaned_data["size"]` is that stored string (`"s"`, `"m"`, `"l"`).',
      hints: ['The static-options field class', 'choices is a list of (value, label) tuples'],
      tags: ['django', 'forms', 'ChoiceField', 'cloze'],
      concepts: ['dj-form-validation'],
    },
  // ModelChoiceField / ModelMultipleChoiceField (queryset-backed)
  {
      id: 'dj-forms-modelchoice-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Render a dropdown of existing Category rows. Fill the queryset-backed field class.',
      template: `from django import forms
from .models import Category

class ArticleForm(forms.Form):
    category = forms.___(queryset=Category.objects.all())`,
      blanks: ['ModelChoiceField'],
      solution: 'from django import forms\nfrom .models import Category\n\nclass ArticleForm(forms.Form):\n    category = forms.ModelChoiceField(queryset=Category.objects.all())',
      explanation: '`ModelChoiceField(queryset=...)` builds `<option>`s from the queryset and cleans the chosen pk into the matching `Category` instance, so `cleaned_data["category"]` is ready to assign to a ForeignKey.',
      hints: ['The queryset-backed single-select field', 'Cleans to a model instance'],
      tags: ['django', 'forms', 'ModelChoiceField', 'queryset', 'cloze'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-modelchoice-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a plain `forms.Form` named `ArticleForm` with three fields: a `title` text field; a `category` dropdown of existing `Category` rows where selecting one cleans to a `Category` instance; and a `tags` field that lets the user pick several existing `Tag` rows at once (cleaning to a queryset of `Tag`). Use the queryset-backed form fields, each bound to every row of its model.',
      starterCode: `from django import forms
from .models import Category, Tag
`,
      testCases: [
        {
          input: 'ArticleForm() rendering',
          expectedOutput: 'ModelChoiceField(queryset=Category.objects.all()) + ModelMultipleChoiceField(queryset=Tag.objects.all())',
          description: 'single FK dropdown + multi-select M2M, both queryset-backed',
        },
      ],
      solution: `from django import forms
from .models import Category, Tag

class ArticleForm(forms.Form):
    title = forms.CharField()
    category = forms.ModelChoiceField(queryset=Category.objects.all())
    tags = forms.ModelMultipleChoiceField(queryset=Tag.objects.all())`,
      explanation: '`ModelChoiceField` is the single-select queryset field (cleans to one instance); `ModelMultipleChoiceField` is the multi-select (cleans to a queryset). Both take `queryset=` to source their options, so the dropdown always reflects the current DB rows.',
      tieredHints: {
        apiSignature: 'forms.ModelChoiceField(queryset, **kwargs)',
        skeleton: 'from django import forms\nfrom .models import Category, Tag\n\nclass ____(forms.Form):\n    title = forms.____()\n    category = forms.____(queryset=Category.objects.____())\n    tags = forms.____(queryset=Tag.objects.____())',
      },
      hints: [
        'ModelChoiceField(queryset=Category.objects.all()) for the single FK',
        'ModelMultipleChoiceField(queryset=Tag.objects.all()) for the multi-select',
      ],
      tags: ['django', 'forms', 'ModelChoiceField', 'ModelMultipleChoiceField', 'queryset'],
      concepts: ['dj-form-validation'],
    },
  // Field kwargs (required / initial / label / help_text)
  {
      id: 'dj-forms-kwargs-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      question: 'In `forms.CharField(required=False, initial="draft", label="Status", help_text="optional")`, what does each kwarg do — and what does `required=False` change about validation?',
      options: [
        { id: 'a', text: '`required=False` lets the field be left blank without error (it cleans to an empty value); `initial` pre-fills the unbound form; `label` is the displayed field name; `help_text` renders helper text by the field', isCorrect: true },
        { id: 'b', text: '`required=False` hides the field from the page; `initial` is the value used when validation fails; `label` becomes the HTML `name`; `help_text` is a tooltip shown only on error', isCorrect: false },
        { id: 'c', text: '`required=False` makes the field read-only; `initial` is a fallback applied when the user submits blank; `label` names the DB column; `help_text` is the placeholder inside the input', isCorrect: false },
        { id: 'd', text: '`required=False` skips the validators but still errors if blank; `initial` overrides submitted data; `label` sets the field `id`; `help_text` is the validation error message', isCorrect: false },
      ],
      explanation: '`required=False` is the validation switch: a blank submission is accepted and cleans to the field\'s empty value (`""` for text) instead of raising "this field is required". `initial` only pre-populate an *unbound* form (it never overrides submitted data). `label` is the human-readable name rendered next to the field; `help_text` is descriptive text shown beside it. None of them hide, disable, or rename the DB column.',
      hints: [
        'required=False → blank is allowed, cleans to empty',
        'initial pre-fills only the unbound form',
        'label = display name; help_text = helper text',
      ],
      tags: ['django', 'forms', 'required', 'initial', 'help_text', 'label'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-kwargs-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Declare an optional bio field that is pre-filled, has a friendly display name, and shows helper text. Fill the four kwargs in order.',
      template: `class ProfileForm(forms.Form):
    bio = forms.CharField(
        ___=False,
        ___="(none yet)",
        ___="About you",
        ___="Shown on your public profile",
    )`,
      blanks: ['required', 'initial', 'label', 'help_text'],
      solution: 'class ProfileForm(forms.Form):\n    bio = forms.CharField(\n        required=False,\n        initial="(none yet)",\n        label="About you",\n        help_text="Shown on your public profile",\n    )',
      explanation: '`required=False` makes the field optional; `initial` pre-fills the unbound form; `label` is the displayed name; `help_text` is the descriptive note rendered beside the input.',
      hints: ['The boolean optional-switch comes first', 'Pre-fill, then display name, then helper text'],
      tags: ['django', 'forms', 'required', 'initial', 'label', 'help_text', 'cloze'],
      concepts: ['dj-form-validation'],
    },
  // save(commit=False)
  {
      id: 'dj-forms-commit-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      question: 'A `ModelForm` for `Article` does not include an `author` field — the logged-in user sets it. How do you save the form while attaching the author?',
      options: [
        { id: 'a', text: '`obj = form.save(commit=False)`, set `obj.author = request.user`, then `obj.save()` — `commit=False` returns the unsaved instance so you can set extra attributes first', isCorrect: true },
        { id: 'b', text: '`form.save(author=request.user)` — pass any extra model attributes as keyword arguments straight through to the form\'s `save()` method', isCorrect: false },
        { id: 'c', text: '`form.cleaned_data["author"] = request.user`, then `form.save()` — inject the value into cleaned_data just before the form persists it', isCorrect: false },
        { id: 'd', text: 'Add `author` to `Meta.fields` and set `form.fields["author"].initial = request.user` so the field saves the user automatically', isCorrect: false },
      ],
      explanation: '`form.save(commit=False)` builds the model instance from `cleaned_data` but does NOT write to the DB, handing you the unsaved object. Set any attributes the form did not collect (`obj.author = request.user`), then call `obj.save()`. Passing kwargs to `save()` is not supported, mutating `cleaned_data` after validation does not flow into the instance, and you deliberately keep `author` OUT of `Meta.fields` so users cannot spoof it.',
      hints: [
        'commit=False → unsaved instance you can mutate',
        'Set obj.author, then obj.save()',
        'Keep server-set fields out of Meta.fields',
      ],
      tags: ['django', 'forms', 'commit-false', 'save', 'ModelForm'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-commit-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'A valid ModelForm is saved with commit=False. What does this print?',
      code: `# ArticleForm is a ModelForm for Article (fields: title, body)
form = ArticleForm({"title": "Hello", "body": "world"})
form.is_valid()
article = form.save(commit=False)
print(article.title)
print(article.pk)`,
      expectedOutput: `Hello
None`,
      explanation: '`save(commit=False)` populates the instance from `cleaned_data` (so `article.title` is `"Hello"`) but skips the database write — no `INSERT` runs, so the primary key is still unassigned and `article.pk` is `None`. The row exists only after you call `article.save()`.',
      hints: ['commit=False fills the instance but does not INSERT', 'No DB write → pk is still None'],
      tags: ['django', 'forms', 'commit-false', 'save', 'predict'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-commit-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function-based view `create_article(request)` that handles a POST of `ArticleForm` (a ModelForm with no `author` field). When the form validates, build the unsaved model instance from the form, set its `author` to the current request user, persist it, then redirect to the URL named `"article-detail"` with the new instance\'s `pk`. On GET or an invalid POST, render `"articles/new.html"` with the form in the context.',
      starterCode: `from django.shortcuts import render, redirect
from .forms import ArticleForm
`,
      testCases: [
        {
          input: 'valid POST',
          expectedOutput: 'save(commit=False) → set author → save() → redirect to article-detail',
          description: 'commit=False to inject the request user before persisting',
        },
      ],
      solution: `from django.shortcuts import render, redirect
from .forms import ArticleForm

def create_article(request):
    if request.method == "POST":
        form = ArticleForm(request.POST)
        if form.is_valid():
            article = form.save(commit=False)
            article.author = request.user
            article.save()
            return redirect("article-detail", pk=article.pk)
    else:
        form = ArticleForm()
    return render(request, "articles/new.html", {"form": form})`,
      explanation: '`save(commit=False)` returns the unsaved `Article` built from validated data; you attach the request user as `author` (a field the form never exposed, so it cannot be tampered with), then `article.save()` writes the complete row. The redirect after a successful POST is the Post/Redirect/Get pattern.',
      tieredHints: {
        apiSignature: 'ModelForm.save(commit=False) -> Model',
        skeleton: 'from django.shortcuts import render, redirect\nfrom .forms import ____\n\ndef ____(request):\n    if request.method == ____:\n        form = ____(request.POST)\n        if form.____():\n            article = form.____(____=False)\n            article.____ = request.user\n            article.____()\n            return ____("article-detail", pk=article.pk)\n    else:\n        form = ____()\n    return ____(request, ____, {"form": form})',
      },
      hints: [
        'Bind ArticleForm(request.POST); guard is_valid()',
        'article = form.save(commit=False); article.author = request.user; article.save()',
        'Redirect to "article-detail" with article.pk',
      ],
      tags: ['django', 'forms', 'commit-false', 'save', 'ModelForm', 'view'],
      concepts: ['dj-form-validation', 'dj-view-patterns'],
    },
  // Dynamic form via __init__
  {
      id: 'dj-forms-dynamic-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a ModelForm whose `__init__` accepts an extra `user` keyword and limits the `category` dropdown to that user\'s own categories. Remove the kwarg BEFORE calling super, then narrow the field\'s queryset.',
      correctOrder: [
        'class ArticleForm(forms.ModelForm):',
        '    class Meta:',
        '        model = Article',
        '        fields = ["title", "category"]',
        '',
        '    def __init__(self, *args, **kwargs):',
        '        user = kwargs.pop("user")',
        '        super().__init__(*args, **kwargs)',
        '        self.fields["category"].queryset = Category.objects.filter(owner=user)',
      ],
      distractorLines: [
        '    def __init__(self, user, *args, **kwargs):',
        '        user = kwargs["user"]',
        '        self.fields["category"].queryset = Category.objects.all()',
        '        super().__init__(user, *args, **kwargs)',
      ],
      solution: 'class ArticleForm(forms.ModelForm):\n    class Meta:\n        model = Article\n        fields = ["title", "category"]\n\n    def __init__(self, *args, **kwargs):\n        user = kwargs.pop("user")\n        super().__init__(*args, **kwargs)\n        self.fields["category"].queryset = Category.objects.filter(owner=user)',
      explanation: 'Per-request customization happens in `__init__`, not the class body (which runs once at import). `kwargs.pop("user")` MUST come before `super().__init__(...)` — otherwise the base constructor receives an unexpected `user` kwarg and raises `TypeError`. After super runs, `self.fields` exists and you can replace the `category` field\'s queryset.',
      hints: [
        'pop("user") before super().__init__',
        'After super(), self.fields is populated',
        'Reassign self.fields["category"].queryset',
      ],
      tags: ['django', 'forms', 'dynamic-form', '__init__', 'queryset', 'parsons', 'advanced'],
      concepts: ['dj-form-validation'],
    },
  {
      id: 'dj-forms-dynamic-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_FORMS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a `ModelForm` `ArticleForm` (model `Article`, fields `title` and `category`) whose constructor accepts an extra keyword argument `user`. Override `__init__` so it removes that `user` argument before delegating to the parent constructor, then restrict the `category` field\'s selectable options to only the `Category` rows whose `owner` is that user. This is how a form\'s dropdown is made request-aware.',
      starterCode: `from django import forms
from .models import Article, Category
`,
      testCases: [
        {
          input: 'ArticleForm(user=some_user)',
          expectedOutput: '__init__ pops user before super(); category queryset filtered to owner=user',
          description: 'per-request queryset narrowing in __init__',
        },
      ],
      solution: `from django import forms
from .models import Article, Category

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ["title", "category"]

    def __init__(self, *args, **kwargs):
        user = kwargs.pop("user")
        super().__init__(*args, **kwargs)
        self.fields["category"].queryset = Category.objects.filter(owner=user)`,
      explanation: 'The class body runs once at import, so it cannot see the request user — per-request changes belong in `__init__`. Pop the custom `user` kwarg first (the parent constructor would reject an unknown keyword), call `super().__init__`, then overwrite `self.fields["category"].queryset`. The view instantiates it as `ArticleForm(request.POST, user=request.user)`.',
      tieredHints: {
        apiSignature: 'Field.queryset: QuerySet',
        skeleton: 'from django import forms\nfrom .models import ____, ____\n\nclass ArticleForm(forms.____):\n    class ____:\n        ____ = ____\n        ____ = ["title", "category"]\n\n    def ____(self, *args, **kwargs):\n        user = kwargs.____("user")\n        ____().__init__(*args, **kwargs)\n        self.____["category"].____ = ____.objects.____(owner=user)',
      },
      hints: [
        'Pop "user" from kwargs BEFORE super().__init__',
        'Reassign self.fields["category"].queryset after super()',
        'Filter Category.objects.filter(owner=user)',
      ],
      tags: ['django', 'forms', 'dynamic-form', '__init__', 'queryset', 'advanced'],
      concepts: ['dj-form-validation'],
    },
];
