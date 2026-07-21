import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

// Forms Mastery (deep revisit) — cross-cutting form-layer mastery: the validation
// lifecycle & error placement, mass-assignment security, ModelForm<->model validation
// (validate_unique / full_clean), save(commit=False) + save_m2m, formset internals
// (management form), add_error vs non_field_errors, file binding, and dynamic fields.
// Stays out of the DRF / Template / View / Auth lanes — every item is about the form
// validation/persistence layer itself.
export const dj_forms_mastery_questions: Question[] = [
// --- validation lifecycle & error placement ---
{
      id: 'dj-forms-mastery-lifecycle-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS_MASTERY,
      course: Course.BACKEND,
      question: 'A form has a field validator on `email`, a `clean_email` method, and a global `clean()`. In what order do they run, and where does each kind of error land?',
      options: [
        { id: 'a', text: 'Field validators → `clean_email` → `clean()`; an error in `clean_email` attaches to the `email` field, while an error raised in `clean()` without a field key lands in `non_field_errors()` (`__all__`)', isCorrect: true },
        { id: 'b', text: '`clean()` → `clean_email` → field validators; every error, wherever it is raised, attaches to the specific field that produced it', isCorrect: false },
        { id: 'c', text: '`clean_email` → field validators → `clean()`; all errors land in `non_field_errors()` regardless of where in the pipeline they were raised', isCorrect: false },
        { id: 'd', text: 'Field validators and `clean_email` run in parallel, then `clean()`; an error in `clean()` attaches to the first field declared on the form', isCorrect: false },
      ],
      explanation: 'The pipeline per field is: built-in/declared validators (type coercion, `validators=[...]`), then `clean_<field>`. After every field is processed, the global `clean()` runs for cross-field checks. A `ValidationError` raised in `clean_<field>` attaches to that field; one raised in `clean()` with no field key goes to the form-level `non_field_errors()` / `__all__`. Use `self.add_error(field, msg)` inside `clean()` to target a specific field instead.',
      hints: [
        'validators → clean_<field> → clean()',
        'clean_<field> error → that field',
        'clean() error → non_field_errors / __all__',
      ],
      tags: ['django', 'forms', 'validation-lifecycle', 'clean', 'non_field_errors'],
      concepts: ['dj-form-validation'],
    },
{
      id: 'dj-forms-mastery-lifecycle-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'A field-level validator fails. What does the global clean() see in cleaned_data?',
      code: `class SignupForm(forms.Form):
    email = forms.CharField()
    code = forms.CharField()

    def clean_email(self):
        raise ValidationError("bad email")

    def clean(self):
        cleaned = super().clean()
        print("email" in cleaned)
        print("code" in cleaned)
        return cleaned

form = SignupForm({"email": "x", "code": "123"})
form.is_valid()`,
      expectedOutput: `False
True`,
      explanation: 'When `clean_email` raises `ValidationError`, Django records the field error and REMOVES `email` from `cleaned_data`. So by the time the global `clean()` runs, `"email"` is absent (`False`) while `"code"` validated normally and is present (`True`). This is exactly why cross-field code in `clean()` must use `cleaned_data.get("email")` rather than `cleaned_data["email"]` — the key may be gone.',
      hints: ['A failed clean_<field> drops its key from cleaned_data', 'clean() must use .get()'],
      tags: ['django', 'forms', 'validation-lifecycle', 'cleaned_data', 'predict'],
      concepts: ['dj-form-validation'],
    },
// --- mass-assignment security ---
{
      id: 'dj-forms-mastery-security-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS_MASTERY,
      course: Course.BACKEND,
      question: 'Why is `fields = "__all__"` on a `ModelForm` considered a security risk for user-facing input forms?',
      options: [
        { id: 'a', text: 'It auto-exposes every model field — including ones added later like `is_staff` or `balance` — so a crafted POST can set fields you never meant users to edit (mass assignment)', isCorrect: true },
        { id: 'b', text: 'It disables CSRF protection on that form, because `"__all__"` instructs Django to accept the submission from any origin', isCorrect: false },
        { id: 'c', text: 'It makes every field required, so an attacker can trigger validation errors that leak the model\'s internal column names', isCorrect: false },
        { id: 'd', text: 'It stores the raw POST body directly in the database without validation, bypassing the form\'s `clean()` methods entirely', isCorrect: false },
      ],
      explanation: '`"__all__"` exposes every concrete model field as an editable form field — and crucially, fields ADDED to the model later are exposed automatically. If someone adds `is_staff` or `account_balance` to the model, a hand-crafted POST to the same form can now set them (a mass-assignment / over-posting vulnerability). The fix is an explicit allow-list: `fields = ["title", "body"]`. It does not touch CSRF, requiredness, or skip validation.',
      hints: [
        '"__all__" exposes every field, including future ones',
        'Crafted POST → over-posting protected fields',
        'Use an explicit fields allow-list',
      ],
      tags: ['django', 'forms', 'security', 'mass-assignment', 'fields'],
      concepts: ['dj-form-validation'],
    },
// --- ModelForm <-> model validation ---
{
      id: 'dj-forms-mastery-modelform-validate-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_FORMS_MASTERY,
      course: Course.BACKEND,
      question: 'A `ModelForm` is bound to a model whose `username` field is `unique=True`. A user submits an already-taken username. What happens when you call `form.is_valid()`?',
      options: [
        { id: 'a', text: 'It returns `False` and adds the clash to `form.errors` — `ModelForm` runs the model\'s `validate_unique()`, surfacing the conflict as a normal form error instead of a later DB `IntegrityError`', isCorrect: true },
        { id: 'b', text: 'It returns `True`; uniqueness is enforced only by the database, so the clash raises `IntegrityError` later when `form.save()` actually runs', isCorrect: false },
        { id: 'c', text: 'It returns `False` but raises `IntegrityError` right away, because `is_valid()` performs a trial `INSERT` inside a savepoint to test uniqueness', isCorrect: false },
        { id: 'd', text: 'It returns `True` and silently overwrites the existing row, because `ModelForm.save()` performs an upsert on any unique field', isCorrect: false },
      ],
      explanation: '`ModelForm` validation includes a `_post_clean` step that runs the model instance\'s `validate_unique()`. A duplicate value is caught there and added to `form.errors` (so `is_valid()` is `False`) — the user sees "username already exists" rather than the app crashing with an `IntegrityError` at save time. This is a key reason to persist user input through a `ModelForm` rather than building the instance by hand.',
      hints: [
        'ModelForm runs validate_unique during is_valid()',
        'The clash becomes a form error, not an IntegrityError',
      ],
      tags: ['django', 'forms', 'ModelForm', 'validate_unique', 'integrity'],
      concepts: ['dj-form-validation', 'dj-model-construction'],
    },
{
      id: 'dj-forms-mastery-modelform-clean-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_FORMS_MASTERY,
      course: Course.BACKEND,
      question: 'A model defines a `clean()` method enforcing a cross-field rule. You persist instances two ways: via a `ModelForm` (`is_valid()` then `save()`), and via `Model.objects.create(...)` directly. Which path runs the model\'s `clean()`?',
      options: [
        { id: 'a', text: 'Only the `ModelForm` path — its validation calls the instance\'s `full_clean()`, which runs the model `clean()`; a direct `create()`/`save()` skips model validation entirely', isCorrect: true },
        { id: 'b', text: 'Both paths — `Model.save()` always calls `full_clean()` first, so the model `clean()` runs no matter how the row is persisted', isCorrect: false },
        { id: 'c', text: 'Neither path — the model `clean()` runs only when you call `instance.full_clean()` by hand; forms and `create()` both ignore it', isCorrect: false },
        { id: 'd', text: 'Only the direct `create()` path — a `ModelForm` validates its own form fields but never invokes the model\'s `clean()`', isCorrect: false },
      ],
      explanation: '`ModelForm._post_clean()` calls the instance\'s `full_clean()` (excluding fields not on the form), which runs model-level `clean()` and surfaces any error on the form. A bare `Model.save()` / `objects.create()` does NOT call `full_clean()` — model validation is the caller\'s responsibility there. So model `clean()` is enforced for free through a ModelForm but silently skipped on direct ORM writes (and on `bulk_create`/`update`).',
      hints: [
        'ModelForm validation calls instance.full_clean()',
        'Model.save()/create() skip full_clean()',
        'Same gap as bulk_create / update',
      ],
      tags: ['django', 'forms', 'ModelForm', 'full_clean', 'model-clean'],
      concepts: ['dj-form-validation', 'dj-model-construction'],
    },
// --- save(commit=False) + save_m2m ---
{
      id: 'dj-forms-mastery-savem2m-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_FORMS_MASTERY,
      course: Course.BACKEND,
      question: 'A `ModelForm` has a ManyToMany `tags` field. You do `obj = form.save(commit=False)`, set `obj.author`, then `obj.save()`. The tags are not saved. Why, and what is the fix?',
      options: [
        { id: 'a', text: 'M2M rows need the instance to have a pk first, so `commit=False` defers them; after `obj.save()` you must call `form.save_m2m()` to write the deferred relations', isCorrect: true },
        { id: 'b', text: '`commit=False` strips M2M fields from the form entirely; re-add them by calling `form.full_clean()` again before `obj.save()` writes them', isCorrect: false },
        { id: 'c', text: 'The tags failed validation silently; call `form.is_valid()` a second time after `obj.save()` to flush the relations to the database', isCorrect: false },
        { id: 'd', text: 'ManyToMany fields are read-only on a `ModelForm`; you must update `obj.tags` by hand and `save_m2m()` does not exist', isCorrect: false },
      ],
      explanation: 'A through-table row needs both sides\' primary keys, so the instance must be saved before its M2M can be written. `save(commit=False)` therefore defers M2M entirely and attaches a `save_m2m()` method to the form. The full sequence is: `obj = form.save(commit=False)` → set extra attrs → `obj.save()` (now it has a pk) → `form.save_m2m()`. A plain `form.save()` (commit=True) does all of this for you.',
      hints: [
        'M2M needs a pk, so commit=False defers it',
        'Call form.save_m2m() after obj.save()',
        'Plain form.save() does both automatically',
      ],
      tags: ['django', 'forms', 'save_m2m', 'commit-false', 'ManyToMany'],
      concepts: ['dj-form-validation'],
    },
{
      id: 'dj-forms-mastery-savem2m-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_FORMS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Persist a ModelForm with a server-set field AND a ManyToMany field. Fill the call that writes the deferred relations.',
      template: `def create(request):
    form = ArticleForm(request.POST)
    if form.is_valid():
        article = form.save(commit=False)
        article.author = request.user
        article.save()
        form.___()        # write the deferred M2M (tags)
        return redirect("article-detail", pk=article.pk)`,
      blanks: ['save_m2m'],
      solution: 'def create(request):\n    form = ArticleForm(request.POST)\n    if form.is_valid():\n        article = form.save(commit=False)\n        article.author = request.user\n        article.save()\n        form.save_m2m()\n        return redirect("article-detail", pk=article.pk)',
      explanation: '`form.save_m2m()` writes the ManyToMany relations that `save(commit=False)` deferred. It only exists after a `commit=False` save and must run AFTER `article.save()` has given the row a primary key.',
      hints: ['The form method that writes deferred M2M', 'Only call it after obj.save()'],
      tags: ['django', 'forms', 'save_m2m', 'commit-false', 'cloze'],
      concepts: ['dj-form-validation'],
    },
{
      id: 'dj-forms-mastery-savem2m-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_FORMS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function-based view `create_article(request)` for `ArticleForm` (a ModelForm that includes a ManyToMany `tags` field but no `author`). On a valid POST: build the instance without committing, set `author` to the request user, persist the row, then write the deferred many-to-many relations, and redirect to `"article-detail"` with the new `pk`. On GET or an invalid POST, render `"articles/new.html"` with the form.',
      starterCode: `from django.shortcuts import render, redirect
from .forms import ArticleForm
`,
      testCases: [
        {
          input: 'valid POST with tags',
          expectedOutput: 'save(commit=False) → set author → save() → form.save_m2m() → redirect',
          description: 'deferred M2M written after the instance gets a pk',
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
            form.save_m2m()
            return redirect("article-detail", pk=article.pk)
    else:
        form = ArticleForm()
    return render(request, "articles/new.html", {"form": form})`,
      explanation: 'Because `commit=False` defers the M2M, the order is strict: build the instance, attach the server-set `author`, `article.save()` to get a pk, then `form.save_m2m()` to write the `tags` through-rows. Skipping `save_m2m()` silently drops the tags.',
      tieredHints: {
        apiSignature: 'ModelForm.save_m2m()',
        skeleton: 'from django.shortcuts import render, redirect\nfrom .forms import ____\n\ndef ____(request):\n    if request.method == ____:\n        form = ____(request.POST)\n        if form.____():\n            article = form.____(____=False)\n            article.____ = request.user\n            article.____()\n            form.____()\n            return ____("article-detail", pk=article.pk)\n    else:\n        form = ____()\n    return ____(request, ____, {"form": form})',
      },
      hints: [
        'article = form.save(commit=False); article.author = request.user; article.save()',
        'Then form.save_m2m() for the deferred tags',
        'Redirect after success (PRG)',
      ],
      tags: ['django', 'forms', 'save_m2m', 'commit-false', 'ManyToMany', 'advanced'],
      concepts: ['dj-form-validation'],
    },
// --- formset internals ---
{
      id: 'dj-forms-mastery-formset-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS_MASTERY,
      course: Course.BACKEND,
      question: 'A formset POST fails with "ManagementForm data is missing or has been tampered with." What is the management form, and why is it required?',
      options: [
        { id: 'a', text: 'A set of hidden fields (`TOTAL_FORMS`, `INITIAL_FORMS`, …) the formset renders to track how many forms are in play; without them Django can\'t know how many forms to parse and refuses to validate', isCorrect: true },
        { id: 'b', text: 'The admin-only form that controls formset permissions; the error means the current user lacks the `manage_formset` permission for this view', isCorrect: false },
        { id: 'c', text: 'The first form in the set, which manages the others; the error means you forgot to mark one of the forms with `is_manager = True`', isCorrect: false },
        { id: 'd', text: 'A CSRF wrapper specific to formsets; the error means `{% csrf_token %}` is missing from the surrounding `<form>` tag in the template', isCorrect: false },
      ],
      explanation: 'A formset renders a hidden "management form" — `TOTAL_FORMS`, `INITIAL_FORMS`, `MIN_NUM_FORMS`, `MAX_NUM_FORMS` — so the server knows how many forms the client submitted (including any added by JavaScript). It is emitted by `{{ formset.management_form }}` (or implicitly by `{{ formset }}`). Omitting it from the template, or tampering with the counts, makes Django unable to reconstruct the forms, hence the error. It is unrelated to permissions or CSRF.',
      hints: [
        'Hidden TOTAL_FORMS/INITIAL_FORMS counters',
        'Render {{ formset.management_form }}',
        'Without it Django can\'t parse the forms',
      ],
      tags: ['django', 'forms', 'formset', 'management-form', 'TOTAL_FORMS'],
      concepts: ['dj-form-validation'],
    },
{
      id: 'dj-forms-mastery-formset-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'How many forms does this formset render in total?',
      code: `from django.forms import formset_factory

PersonFormSet = formset_factory(PersonForm, extra=2)
formset = PersonFormSet(initial=[{"label": "Ann"}, {"label": "Bob"}])
print(formset.total_form_count())`,
      expectedOutput: `4`,
      explanation: '`total_form_count()` = number of initial-bound forms + `extra` blank forms = `len(initial)` (2) + `extra` (2) = **4**. The two initial forms are pre-filled for editing; the two extra forms are blank rows for adding new entries. Raising `extra` adds more blank rows; setting `extra=0` shows only the initial-bound forms.',
      hints: ['total = len(initial) + extra', '2 initial + 2 extra'],
      tags: ['django', 'forms', 'formset', 'total_form_count', 'extra', 'predict'],
      concepts: ['dj-form-validation'],
    },
// --- error placement helpers ---
{
      id: 'dj-forms-mastery-errors-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS_MASTERY,
      course: Course.BACKEND,
      question: 'Inside a global `clean()`, you detect that `password` and `password_confirm` differ. What is the difference between `raise ValidationError(...)` and `self.add_error("password_confirm", ...)`?',
      options: [
        { id: 'a', text: '`raise ValidationError(...)` attaches the message to `non_field_errors()` (form-level `__all__`); `add_error("password_confirm", ...)` attaches it to that field and drops the field from `cleaned_data`', isCorrect: true },
        { id: 'b', text: 'They are identical; `add_error` is just a helper that calls `raise ValidationError` with the field name prepended to the message string', isCorrect: false },
        { id: 'c', text: '`raise ValidationError` halts all remaining validation immediately; `add_error` is ignored unless you also `return False` at the end of `clean()`', isCorrect: false },
        { id: 'd', text: '`add_error` attaches to `non_field_errors()`; `raise ValidationError` attaches the message to whichever field was declared first on the form', isCorrect: false },
      ],
      explanation: 'A bare `raise ValidationError(msg)` from `clean()` (no field key) becomes a form-level error in `non_field_errors()` / `__all__` — it renders at the top of the form, not next to a field. `self.add_error("password_confirm", msg)` attaches the message to that specific field (so it renders inline) and removes the field from `cleaned_data`. `add_error` also lets you record multiple errors without aborting `clean()`.',
      hints: [
        'raise in clean() → non_field_errors (__all__)',
        'add_error(field, msg) → that field, inline',
        'add_error also drops the field from cleaned_data',
      ],
      tags: ['django', 'forms', 'add_error', 'non_field_errors', 'clean'],
      concepts: ['dj-form-validation'],
    },
// --- file binding ---
{
      id: 'dj-forms-mastery-file-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FORMS_MASTERY,
      course: Course.BACKEND,
      question: 'A form has a `forms.FileField`. In the view you bind it with `form = UploadForm(request.POST)` and it never validates the file. What is wrong?',
      options: [
        { id: 'a', text: 'File data lives in `request.FILES`, not `request.POST` — bind both: `UploadForm(request.POST, request.FILES)` (and `ImageField` additionally needs Pillow installed)', isCorrect: true },
        { id: 'b', text: '`FileField` can only be used on a `ModelForm`, never a plain `Form`; switch the base class and the upload will validate', isCorrect: false },
        { id: 'c', text: 'You must set `form.is_multipart = True` in the view before calling `is_valid()` so Django knows to read the upload', isCorrect: false },
        { id: 'd', text: '`FileField` validates lazily; you must call `form.cleaned_data["file"].validate()` by hand after `is_valid()` returns', isCorrect: false },
      ],
      explanation: 'Uploaded files arrive in `request.FILES`, separate from the text fields in `request.POST`. A bound form needs BOTH positional arguments: `UploadForm(request.POST, request.FILES)` — otherwise the file field sees no data and stays empty/invalid. The HTML `<form>` must also use `enctype="multipart/form-data"`, and `ImageField` requires the Pillow library to validate image content.',
      hints: [
        'Files are in request.FILES, not request.POST',
        'Bind UploadForm(request.POST, request.FILES)',
        'ImageField needs Pillow',
      ],
      tags: ['django', 'forms', 'FileField', 'request.FILES', 'multipart'],
      concepts: ['dj-form-validation'],
    },
// --- dynamic field per request ---
{
      id: 'dj-forms-mastery-dynamic-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_FORMS_MASTERY,
      course: Course.BACKEND,
      question: 'You want a form\'s `ModelChoiceField` to show only the current user\'s records — different per request. Why must this go in `__init__` rather than the field\'s class-body declaration?',
      options: [
        { id: 'a', text: 'The class body runs once when the module is imported, with no request in scope; `__init__` runs on every instantiation, so it is the only place to narrow the queryset using the per-request `user`', isCorrect: true },
        { id: 'b', text: 'Class-body fields are immutable, so a queryset set there can never change; `__init__` constructs a fresh mutable copy of each field on demand', isCorrect: false },
        { id: 'c', text: 'Django forbids querysets in the class body and raises `ImproperlyConfigured`; querysets are only permitted inside instance methods like `__init__`', isCorrect: false },
        { id: 'd', text: 'The class body executes after the view, which is too late to affect rendering; `__init__` runs before the view, exactly when the queryset is needed', isCorrect: false },
      ],
      explanation: 'A field declared in the class body is evaluated ONCE, at import time — there is no request and no user then, so its queryset is fixed for the life of the process. To make it request-aware you override `__init__(self, *args, **kwargs)`, pop the `user` the view passes in, call `super().__init__`, and reassign `self.fields["category"].queryset = Category.objects.filter(owner=user)`. `__init__` runs on every form instantiation, so each request gets the right rows.',
      hints: [
        'Class body runs once at import — no request yet',
        '__init__ runs per instantiation',
        'Pop user, super().__init__, then set self.fields[...].queryset',
      ],
      tags: ['django', 'forms', 'dynamic-form', '__init__', 'queryset'],
      concepts: ['dj-form-validation'],
    },
];
