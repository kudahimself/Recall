/**
 * Topic.DJ_AUTH — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendAdvancedQuestions.ts (4), djangoAdvancedRungQuestions.ts (3), djangoBatchCExpansionQuestions.ts (8)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_auth_questions: Question[] = [
{
      id: 'be-auth-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a Django view that requires authentication using the @login_required decorator. If the user is not logged in, redirect to "/login/".',
      starterCode: `# Import login_required and render; decorate a 'dashboard' view so\n# anonymous users are sent to /login/, and render 'dashboard.html'\n# with the current user in the context.\n`,
      testCases: [
        {
          input: 'protected view',
          expectedOutput: '@login_required(login_url="/login/")',
          description: 'Should protect view with login_required',
        },
      ],
      solution: `from django.contrib.auth.decorators import login_required\nfrom django.shortcuts import render\n\n@login_required(login_url="/login/")\ndef dashboard(request):\n    return render(request, "dashboard.html", {"user": request.user})`,
      explanation: '@login_required checks if request.user.is_authenticated. If not, redirects to login_url. The request.user object is automatically populated by Django\'s auth middleware. For class-based views, use LoginRequiredMixin.',
      hints: ['@login_required(login_url="...")  decorator', 'request.user has the authenticated user', 'LoginRequiredMixin for class-based views'],
      tags: ['auth', 'login_required', 'decorator', 'django'],
      concepts: ['dj-auth-token-vs-session', 'py-decorator-application'],
    },
{
      id: 'be-auth-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a DRF view that requires JWT authentication using IsAuthenticated permission and JWTAuthentication.',
      starterCode: `# Define ProtectedView(APIView): set its authentication to use
# JWTAuthentication and its permissions to require an authenticated
# user; get() returns a Response greeting request.user.username.
`,
      testCases: [
        {
          input: 'JWT protected API',
          expectedOutput: 'authentication_classes and permission_classes',
          description: 'Should require JWT auth',
        },
      ],
      solution: `from rest_framework.views import APIView\nfrom rest_framework.response import Response\nfrom rest_framework.permissions import IsAuthenticated\nfrom rest_framework_simplejwt.authentication import JWTAuthentication\n\nclass ProtectedView(APIView):\n    authentication_classes = [JWTAuthentication]\n    permission_classes = [IsAuthenticated]\n\n    def get(self, request):\n        return Response({"message": f"Hello, {request.user.username}!"})`,
      explanation: 'authentication_classes defines HOW to authenticate (JWT token in Authorization header). permission_classes defines WHO can access (IsAuthenticated = any logged-in user). DRF checks both: first authenticates, then checks permissions.',
      hints: ['authentication_classes = [JWTAuthentication]', 'permission_classes = [IsAuthenticated]', 'Client sends: Authorization: Bearer <token>'],
      tags: ['jwt', 'drf', 'authentication', 'permissions', 'django'],
      concepts: ['dj-auth-token-vs-session', 'dj-permission-class'],
    },
{
      id: 'be-auth-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      question: 'What are CORS, CSRF, and XSS?',
      options: [
        { id: 'a', text: 'CORS controls which origins may call your API; CSRF tricks a logged-in browser into sending unintended requests; XSS injects malicious scripts into pages', isCorrect: true },
        { id: 'b', text: 'They are three encryption layers in the TLS handshake that browsers negotiate before sending any request to another domain', isCorrect: false },
        { id: 'c', text: 'CORS blocks SQL injection at the API gateway; CSRF validates TLS certificates; XSS is the header that lets a page run third-party scripts', isCorrect: false },
        { id: 'd', text: 'They are database-level security features: CORS isolates schemas, CSRF signs transactions, and XSS sanitises stored queries', isCorrect: false },
      ],
      explanation: 'CORS = Cross-Origin Resource Sharing, CSRF = Cross-Site Request Forgery, XSS = Cross-Site Scripting. CORS: browser blocks requests to different origins by default. Your API must send Access-Control-Allow-Origin headers. CSRF: Django includes CSRF tokens in forms to prevent forged requests. XSS: always escape user input in templates (Django auto-escapes). These are the top web security concerns.',
      tags: ['cors', 'csrf', 'xss', 'security', 'web'],
      concepts: ['py-security-primitives'],
    },
{
      id: 'dj-auth-adv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Build a custom user model \`User\` extending \`AbstractBaseUser\` + \`PermissionsMixin\` (NOT \`AbstractUser\`) with email-based login:
  
  1. \`email\` is the unique identifier (USERNAME_FIELD), no separate username.
  2. \`is_staff\`, \`is_active\` flags.
  3. A custom \`UserManager\` with \`create_user(email, password)\` and \`create_superuser(email, password)\` that normalises the email and hashes the password.
  4. \`__str__\` returns the email.
  
  This is the canonical "email-only auth" pattern — the most commonly required customisation in production Django.`,
      starterCode: `from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
`,
      testCases: [
        {
          input: 'User.objects.create_user("a@b.com", "pw") and create_superuser("admin@b.com", "pw")',
          expectedOutput: 'AbstractBaseUser + PermissionsMixin + custom Manager + USERNAME_FIELD = email',
          description: 'Production-grade email-based custom user',
        },
      ],
      solution: `from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError("Email required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email`,
      explanation: '`AbstractBaseUser` gives you password handling and `last_login`; `PermissionsMixin` adds groups, permissions, `is_superuser`. Use these instead of `AbstractUser` when you need to *replace* the username — `AbstractUser` keeps a `username` field. The Manager methods MUST hash via `set_password()` (not `password=...`) — direct assignment stores plaintext. `normalize_email` lowercases the domain only (case is sometimes significant in the local part). `USERNAME_FIELD = "email"` tells Django this is the login key. `REQUIRED_FIELDS = []` because email is already required as USERNAME_FIELD; this list is for *additional* required prompts on `createsuperuser`.',
      hints: [
        'AbstractBaseUser + PermissionsMixin to fully replace username',
        'set_password() to hash; never assign password directly',
        'normalize_email lowercases domain (not local part)',
        'USERNAME_FIELD = "email" + REQUIRED_FIELDS = []',
        'Manager methods must hash and set _db',
      ],
      tags: ['django', 'auth', 'custom-user', 'AbstractBaseUser', 'BaseUserManager', 'advanced'],
      concepts: ['dj-auth-token-vs-session'],
    },
{
      id: 'dj-auth-adv-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Add row-level permissions to the project: an \`Article\` belongs to an \`organization\` (FK), and only members of that organization should be able to view/edit it. Build a CBV mixin \`OrgMemberRequiredMixin\` that:
  
  1. Reads the article via the URL pk.
  2. Verifies the request.user is in the article's \`organization.members\` (a M2M field on Organization to the user model).
  3. Returns 404 (not 403) when the check fails — to avoid leaking which articles exist.
  4. Uses \`select_related("organization")\` to avoid an extra query when checking membership.
  
  Apply it on top of \`LoginRequiredMixin\` to a \`DetailView\` for Article.`,
      starterCode: `from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import Http404
from django.views.generic import DetailView
from .models import Article
`,
      testCases: [
        {
          input: 'Org member: 200; non-member: 404; anonymous: redirect to login',
          expectedOutput: 'mixin + dispatch override + Http404 + select_related + correct mixin order',
          description: 'Tenant-scoped row-level access without leaking existence',
        },
      ],
      solution: `from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import Http404
from django.views.generic import DetailView
from .models import Article


class OrgMemberRequiredMixin:
    def get_object(self, queryset=None):
        qs = (queryset or self.get_queryset()).select_related("organization")
        obj = super().get_object(queryset=qs)
        if not obj.organization.members.filter(pk=self.request.user.pk).exists():
            raise Http404
        return obj


class ArticleDetailView(LoginRequiredMixin, OrgMemberRequiredMixin, DetailView):
    model = Article`,
      explanation: 'Mixin order: `LoginRequiredMixin` first (auth), then `OrgMemberRequiredMixin` (membership), then the generic view. Override `get_object` (not `dispatch`) — generic detail-style views call `get_object` to fetch the row, so this is the precise hook. Raise `Http404` instead of `PermissionDenied` to avoid leaking existence ("this article exists, you just can\'t see it" is itself information). `members.filter(pk=...).exists()` is a single COUNT query — much cheaper than `request.user in obj.organization.members.all()` which materialises every member into Python.',
      hints: [
        'Override get_object for DetailView-style row access',
        'Raise Http404 to hide existence; PermissionDenied to acknowledge it',
        '.filter(pk=...).exists() over `in qs.all()` — orders of magnitude cheaper',
        'select_related on the FK we are about to hit',
      ],
      tags: ['django', 'auth', 'mixin', 'multi-tenancy', 'Http404', 'select_related', 'advanced'],
      concepts: ['dj-auth-token-vs-session', 'dj-select-related-vs-prefetch'],
    },
{
      id: 'dj-auth-adv-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Implement a password-change endpoint that only authenticated users can hit and that only accepts POST. The view reads JSON \`{old_password, new_password}\` from the request body and must:
  
  1. Verify the supplied old password against the stored hash (use the auth backend's constant-time comparison — never compare with ==).
  2. Reject if the new password is identical to the old.
  3. Hash the new password and persist the user.
  4. Keep the user signed in across the change. (Django invalidates the session by default after a password is changed; you have to opt back in.)
  5. Return JSON \`{"ok": true}\` on success, or \`{"error": "..."}\` with status 400 on failure.
  
  This is the standard "change password without forcing re-login" flow.`,
      starterCode: `from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json
`,
      testCases: [
        {
          input: 'POST {old_password, new_password} as authenticated user',
          expectedOutput: 'check_password + set_password + update_session_auth_hash flow',
          description: 'Production password-change without forced re-login',
        },
      ],
      solution: `from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json


@login_required
@require_POST
def change_password(request):
    payload = json.loads(request.body)
    old = payload.get("old_password", "")
    new = payload.get("new_password", "")

    if not request.user.check_password(old):
        return JsonResponse({"error": "Wrong current password"}, status=400)
    if old == new:
        return JsonResponse({"error": "New password must differ"}, status=400)

    request.user.set_password(new)
    request.user.save()
    update_session_auth_hash(request, request.user)
    return JsonResponse({"ok": True})`,
      explanation: '`check_password(plain)` does a constant-time hash comparison — never compare passwords with `==`. After `set_password()` + `save()`, Django\'s default `SessionAuthenticationMiddleware` would invalidate the current session (because the session-auth hash baked into the cookie no longer matches). `update_session_auth_hash(request, user)` rotates the cookie hash so the user stays logged in — without it the very next request 401s. Decorator order: `@login_required` outermost so anonymous users redirect before the method check; `@require_POST` innermost so the auth check runs for any method, not just POST.',
      hints: [
        'check_password is constant-time; never use ==',
        'After set_password + save, sessions invalidate by default',
        'update_session_auth_hash rotates the auth hash to keep the session',
        'Decorator order: auth check outermost, method check innermost',
      ],
      tags: ['django', 'auth', 'password', 'session', 'update_session_auth_hash', 'advanced'],
      concepts: ['dj-auth-token-vs-session'],
    },
{
      id: 'py-dj-auth-user-model',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      question: 'Where does Django\'s default User model live, and what\'s the recommended way to reference it in a ForeignKey?',
      options: [
        { id: 'a', text: 'Import `User` from `django.contrib.auth.models` and pass it directly — `ForeignKey(User, ...)` is the reference style the docs recommend', isCorrect: false },
        { id: 'b', text: 'It lives in `django.db.models`; reference it as `ForeignKey(\'auth.User\')` so the model is lazily resolved at migration time', isCorrect: false },
        { id: 'c', text: 'In `django.contrib.auth.models`, but ForeignKeys should use the `settings.AUTH_USER_MODEL` string so a later swap to a custom user still resolves', isCorrect: true },
        { id: 'd', text: 'There is no default User model — every project must define its own and register it in settings before the first `migrate`', isCorrect: false },
      ],
      explanation: 'Classic pattern: `from django.conf import settings` then `author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)`. If the project later defines `AUTH_USER_MODEL = "accounts.CustomUser"` in settings, the FK auto-retargets. Direct imports of `User` hard-code the default and break when swapping. Do this from day one, even if you never plan to customise — plans change.',
      hints: [
        'settings.AUTH_USER_MODEL is the string; use in ForeignKey',
        'Direct User import breaks if the project swaps the user model',
        'Do this from day 1 — retrofitting is painful',
      ],
      tags: ['django', 'auth', 'User', 'AUTH_USER_MODEL'],
      concepts: ['dj-auth-token-vs-session'],
    },
{
      id: 'py-dj-auth-login-required',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      question: 'What\'s the difference between `@login_required` and `LoginRequiredMixin`?',
      options: [
        { id: 'a', text: 'They\'re interchangeable — the mixin is simply the decorator applied automatically to every handler method of the class', isCorrect: false },
        { id: 'b', text: '`@login_required` protects function-based views; `LoginRequiredMixin` goes FIRST in a CBV\'s base classes — both redirect anonymous users to `LOGIN_URL`', isCorrect: true },
        { id: 'c', text: '`LoginRequiredMixin` is deprecated — modern class-based views should wrap `dispatch` with `@login_required` via `method_decorator`', isCorrect: false },
        { id: 'd', text: 'Only the decorator checks authentication per request; the mixin just hides navigation links from anonymous users in templates', isCorrect: false },
      ],
      explanation: 'Use whichever matches your view style. For class-based views (`ListView`, `CreateView`, `DetailView`) always put `LoginRequiredMixin` FIRST — mixin order matters due to MRO. Both redirect with `?next=<current_url>` appended so the user bounces back after logging in. Customise redirect via `login_url = "/accounts/login/"` attribute or `LOGIN_URL` setting. For "must be admin / in group / have permission", use `PermissionRequiredMixin` + `permission_required = "app.perm"`.',
      hints: [
        'Decorator @login_required for FBVs',
        'LoginRequiredMixin FIRST in CBV bases',
        'Redirects to LOGIN_URL with ?next=<current>',
      ],
      tags: ['django', 'auth', 'login_required', 'LoginRequiredMixin'],
      concepts: ['dj-auth-token-vs-session'],
    },
{
      id: 'py-dj-auth-register-view',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a registration view using `UserCreationForm`. Import `UserCreationForm` from `django.contrib.auth.forms` and `render` / `redirect` from `django.shortcuts`. Define a view `register` that takes a request. On POST, bind a `UserCreationForm` to the submitted POST data; if it validates, save it and redirect to the URL named `"login"`. On GET, build an empty `UserCreationForm`. In either non-redirect path, render `"registration/register.html"` with the form supplied under the context key `"form"`.',
      starterCode: `# Write register(request) using UserCreationForm: on POST, bind the form
# to request.POST and if valid save it and redirect to "login"; on GET,
# build an empty form. Render "registration/register.html" with the form.
`,
      testCases: [
        {
          input: 'registration with UserCreationForm',
          expectedOutput: 'Valid POST → save user + redirect; else render form',
          description: 'UserCreationForm handles username + password1/password2',
        },
      ],
      solution: `from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect

def register(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("login")
    else:
        form = UserCreationForm()
    return render(request, "registration/register.html", {"form": form})`,
      explanation: '`UserCreationForm` handles `username`, `password1`, `password2` (confirmation), password validators from settings, and uniqueness. `form.save()` creates and persists the user. For extras (email, first_name) subclass: `class SignUpForm(UserCreationForm): class Meta: model = User; fields = ("username", "email", "password1", "password2")`. For custom User models (recommended even on day 1), subclass `UserCreationForm` and point `Meta.model` at your model.',
      hints: [
        'UserCreationForm: username + password1 + password2',
        'Subclass for extra fields (email, name)',
        'For custom User models, override Meta.model',
      ],
      tags: ['django', 'auth', 'registration', 'UserCreationForm'],
      concepts: ['dj-auth-token-vs-session'],
    },
{
      id: 'py-dj-auth-password-hashing',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Set and verify a password on a User correctly. Import `User` from `django.contrib.auth.models`, then fetch the user with primary key 1. Use the Django user method that hashes and stores the password `"new-secret"` (NOT a direct attribute assignment on `user.password` — that would store the value as plaintext!), then persist the change. Finally print the result of the matching verification method called with `"new-secret"` — it should return `True`.',
      starterCode: `# Fetch User pk=1; hash-and-store the password "new-secret" with the
# user's set-password method (NOT user.password = ...), save, then print
# the verify-password method called with "new-secret" (expect True).
`,
      testCases: [
        {
          input: 'set_password + check_password',
          expectedOutput: 'True',
          description: 'set_password hashes; check_password compares',
        },
      ],
      solution: `from django.contrib.auth.models import User

user = User.objects.get(pk=1)
user.set_password("new-secret")
user.save()
print(user.check_password("new-secret"))`,
      explanation: '`set_password` runs the configured password hasher (Argon2 / PBKDF2-SHA256 / bcrypt) and stores `algo$iterations$salt$hash` in `user.password`. `check_password` re-hashes the candidate with the same params and compares. Setting `user.password = "..."` directly stores plaintext — if you ever find that in code, it\'s a severity-1 bug. If you migrate users from an old system with weak hashes, set `PASSWORD_HASHERS` to include a legacy hasher so old hashes still validate until users log in and get upgraded.',
      hints: [
        'set_password(raw) hashes and stores',
        'check_password(raw) compares candidate',
        'user.password = "..." = plaintext = bug',
      ],
      tags: ['django', 'auth', 'password', 'hashing'],
      concepts: ['dj-auth-token-vs-session'],
    },
{
      id: 'py-dj-auth-authenticate-login',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Manually log a user in using `authenticate` and `login`. Import both from `django.contrib.auth`, plus `render` and `redirect` from `django.shortcuts`. Define a view `my_login` taking a request. On POST, pull the `"username"` and `"password"` values out of the submitted POST data and call `authenticate` with the request plus those two credentials as keyword args. If it returns a user (not `None`), call `login` with the request and user, then redirect to the URL named `"home"`. Otherwise render `"login.html"` with an `"error"` context value of `"Bad credentials"`.',
      starterCode: `# Write my_login(request): on POST, read "username"/"password" from
# request.POST and call authenticate(request, ...); if a user comes back,
# login(request, user) and redirect to "home"; otherwise render
# "login.html" with an "error" of "Bad credentials".
`,
      testCases: [
        {
          input: 'authenticate + login flow',
          expectedOutput: 'User session established on success',
          description: 'authenticate verifies; login attaches user to session',
        },
      ],
      solution: `from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect

def my_login(request):
    if request.method == "POST":
        user = authenticate(
            request,
            username=request.POST["username"],
            password=request.POST["password"],
        )
        if user is not None:
            login(request, user)
            return redirect("home")
    return render(request, "login.html", {"error": "Bad credentials"})`,
      explanation: '`authenticate(**creds)` walks AUTHENTICATION_BACKENDS (default: ModelBackend — matches username+hashed password). Returns the User or None. `login(request, user)` puts the user ID in the session; subsequent requests load `request.user` via AuthenticationMiddleware. Django ships `LoginView` CBV (`django.contrib.auth.views.LoginView`) that handles all of this — only write your own for truly custom flows. For logout: `from django.contrib.auth import logout; logout(request)`.',
      hints: [
        'authenticate(): verify creds, returns User or None',
        'login(): attach user to session',
        'Prefer django.contrib.auth.views.LoginView for standard flows',
      ],
      tags: ['django', 'auth', 'authenticate', 'login'],
      concepts: ['dj-auth-token-vs-session'],
    },
{
      id: 'py-dj-auth-permission-required',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Restrict a view to users with a specific permission. Import `permission_required` from `django.contrib.auth.decorators`. Define a view `archive_post` taking a request and a `pk`, and decorate it with `permission_required` requiring `"blog.change_post"` and configured to raise an exception on denial rather than redirect. Without the perm the user gets a 403 Forbidden — the default behaviour of redirecting to the login page is wrong for users who are already logged in.',
      starterCode: `# Write archive_post(request, pk) restricted to users holding the
# "blog.change_post" permission, configured to raise (403) on denial
# rather than redirect to login.
`,
      testCases: [
        {
          input: 'permission_required with raise_exception',
          expectedOutput: '403 if the user lacks blog.change_post',
          description: 'Use raise_exception=True for "logged in but no perm" case',
        },
      ],
      solution: `from django.contrib.auth.decorators import permission_required

@permission_required("blog.change_post", raise_exception=True)
def archive_post(request, pk):
    ...`,
      explanation: 'Django auto-creates CRUD permissions per model: `blog.add_post`, `blog.change_post`, `blog.delete_post`, `blog.view_post`. Groups bundle permissions. Assign a permission to a user with `user.user_permissions.add(perm)`, to a group with `group.permissions.add(perm)`. Custom permissions: `Meta.permissions = [("publish_post", "Can publish post")]`. For CBVs: `PermissionRequiredMixin` + `permission_required = "blog.change_post"`.',
      hints: [
        'raise_exception=True returns 403 instead of redirect',
        'CRUD perms auto-created: add_X, change_X, delete_X, view_X',
        'CBV alternative: PermissionRequiredMixin',
      ],
      tags: ['django', 'auth', 'permissions', 'permission_required'],
      concepts: ['dj-auth-token-vs-session', 'dj-permission-class'],
    },
{
      id: 'py-dj-auth-custom-user',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a custom User model inheriting from `AbstractUser` so you can add fields and use email for login later. In `accounts/models.py`, import `AbstractUser` from `django.contrib.auth.models` and `models` from `django.db`. Define a `User` class that subclasses `AbstractUser` and adds two optional fields: a `TextField` called `bio` and a `URLField` called `avatar_url`, both allowed to be blank. Then in `settings.py` point `AUTH_USER_MODEL` at the string `"accounts.User"`. This MUST be done before your first migration — it is not safe to swap mid-project.',
      starterCode: `# accounts/models.py: define User(AbstractUser) adding two optional
# blank fields — bio (TextField) and avatar_url (URLField).
# settings.py: point AUTH_USER_MODEL at "accounts.User" (before first migrate).
`,
      testCases: [
        {
          input: 'custom User extending AbstractUser',
          expectedOutput: 'New User with extra fields; AUTH_USER_MODEL points to it',
          description: 'AbstractUser keeps username + password + email; you add more',
        },
      ],
      solution: `# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)

# settings.py:  AUTH_USER_MODEL = "accounts.User"`,
      explanation: 'Two paths: `AbstractUser` (keeps username/email/password fields — add extras) or `AbstractBaseUser` (start from scratch — for email-login etc.; requires a custom manager and `USERNAME_FIELD`). **Critical**: set `AUTH_USER_MODEL` BEFORE the first migration. Swapping later is a multi-hour headache because every ForeignKey pointing to User needs re-pointing. Always start new projects with a custom user model even if empty — it costs nothing to have and saves the migration pain later.',
      hints: [
        'AbstractUser: keeps everything, you add fields',
        'AbstractBaseUser: from scratch (email login, custom username)',
        'Do it on day 1 — swapping later is extremely painful',
      ],
      tags: ['django', 'auth', 'custom-user', 'AbstractUser'],
      concepts: ['dj-auth-token-vs-session'],
    },
{
      id: 'py-dj-auth-session-vs-token',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      question: 'When should you use session authentication vs token/JWT authentication?',
      options: [
        { id: 'a', text: 'Session auth for same-origin browser clients (cookie + server-side state); token/JWT for mobile apps, separate SPA frontends, and third-party API consumers', isCorrect: true },
        { id: 'b', text: 'JWTs are encrypted, so the server pays a decryption cost on every request — choose them only when the payload itself must stay secret', isCorrect: false },
        { id: 'c', text: 'JWT is always the more secure choice because tokens are hashed before storage, so it should replace sessions in any new project', isCorrect: false },
        { id: 'd', text: 'DRF\'s TokenAuthentication is deprecated — new projects must use session auth for browsers and OAuth for every other client', isCorrect: false },
      ],
      explanation: 'Session: server keeps state (session store), client just holds a cookie. Token: client holds the credential, sends in `Authorization: Bearer <token>` header. JWT carries signed claims (server can verify without lookup); opaque tokens require a DB lookup. Rule: same-origin browser → session; everything else → token/JWT. For mobile apps, always token. For SPAs, either works; JWT wins if you want stateless scaling.',
      hints: [
        'Session: cookie + server session store — for same-origin browser',
        'Token/JWT: Authorization header — for mobile / cross-origin / SPA',
        'JWT is stateless; opaque tokens need a DB lookup',
      ],
      tags: ['django', 'auth', 'session', 'JWT', 'token'],
      concepts: ['dj-auth-token-vs-session'],
    },
{
      id: 'py-dj-auth-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a protected view: import the decorator and render, then apply @login_required (sending anonymous users to /login/) to a dashboard view that renders dashboard.html passing the current user.',
      correctOrder: [
        'from django.contrib.auth.decorators import login_required',
        'from django.shortcuts import render',
        '',
        '@login_required(login_url="/login/")',
        'def dashboard(request):',
        '    return render(request, "dashboard.html", {"user": request.user})',
      ],
      distractorLines: [
        'from django.contrib.auth import login_required',
        '    return render("dashboard.html", request)',
      ],
      solution:
        'from django.contrib.auth.decorators import login_required\nfrom django.shortcuts import render\n\n@login_required(login_url="/login/")\ndef dashboard(request):\n    return render(request, "dashboard.html", {"user": request.user})',
      explanation:
        'login_required lives in django.contrib.auth.decorators (not django.contrib.auth). It checks request.user.is_authenticated and redirects to login_url otherwise. render takes the request first, then the template name.',
      hints: ['login_required is in ...auth.decorators; render(request, template, context).'],
      tags: ['django', 'auth', 'login_required', 'decorator'],
      concepts: ['dj-auth-token-vs-session', 'py-decorator-application'],
    },
{
      id: 'py-dj-auth-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Log a user in manually: import authenticate and login, verify the credentials (getting back a User or None), and only if it is not None attach that user to the session.',
      correctOrder: [
        'from django.contrib.auth import authenticate, login',
        '',
        'user = authenticate(request, username=username, password=password)',
        'if user is not None:',
        '    login(request, user)',
      ],
      distractorLines: [
        'login(request, username, password)',
        'from django.contrib.auth.decorators import authenticate',
      ],
      solution:
        'from django.contrib.auth import authenticate, login\n\nuser = authenticate(request, username=username, password=password)\nif user is not None:\n    login(request, user)',
      explanation:
        'authenticate() verifies credentials and returns the User or None; login(request, user) writes the user id into the session. login takes the request and the User object — never raw credentials. Both import from django.contrib.auth (not .decorators).',
      hints: ['authenticate → returns User or None; login(request, user) attaches it.'],
      tags: ['django', 'auth', 'authenticate', 'login'],
      concepts: ['dj-auth-token-vs-session'],
    },
{
      id: 'py-dj-auth-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the decorator that restricts a function-based view to authenticated users, redirecting others to /login/.',
      template: `@___(login_url="/login/")
def dashboard(request):
    return render(request, "dashboard.html")`,
      blanks: ['login_required'],
      solution:
        '@login_required(login_url="/login/")\ndef dashboard(request):\n    return render(request, "dashboard.html")',
      explanation:
        'login_required wraps a view so anonymous users are redirected to login_url (with ?next=). For class-based views the equivalent is the LoginRequiredMixin.',
      hints: ['Decorator: "login" + "required".'],
      tags: ['django', 'auth', 'login_required'],
      concepts: ['dj-auth-token-vs-session', 'py-decorator-application'],
    },
{
      id: 'py-dj-auth-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the property on request.user that is True when the visitor is signed in.',
      template: `if request.user.___:
    return render(request, "dashboard.html")`,
      blanks: ['is_authenticated'],
      solution:
        'if request.user.is_authenticated:\n    return render(request, "dashboard.html")',
      explanation:
        'request.user is populated by AuthenticationMiddleware. For anonymous visitors it is an AnonymousUser whose is_authenticated is False; for logged-in users it is True. It is a property, not a method — no parentheses.',
      hints: ['Boolean property (no parens) meaning "logged in".'],
      tags: ['django', 'auth', 'request.user'],
      concepts: ['dj-auth-token-vs-session'],
    },
{
      id: 'py-dj-auth-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the function that ends the current user\'s session (the opposite of login).',
      template: `def sign_out(request):
    ___(request)
    return redirect("home")`,
      blanks: ['logout'],
      solution:
        'def sign_out(request):\n    logout(request)\n    return redirect("home")',
      explanation:
        'logout(request) flushes the session and resets request.user to AnonymousUser. Like login, it imports from django.contrib.auth and takes the request.',
      hints: ['Opposite of login; takes the request.'],
      tags: ['django', 'auth', 'logout'],
      concepts: ['dj-auth-token-vs-session'],
    },
  // --- re-homed from dj_views (view-level auth) ---
{
      id: 'py-dj-auth-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Restrict view to logged-in users AND POST-only requests. Get the order right.',
      template: `from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST

@___
@___
def create_article(request):
    ...`,
      blanks: ['login_required', 'require_POST'],
      solution: '@login_required\n@require_POST\ndef create_article(request):\n    ...',
      explanation: 'The OUTER decorator runs first. `@login_required` should be outermost so an anonymous request gets redirected before `@require_POST` returns 405. Reversed, you\'d leak the existence of the route via 405 responses to anonymous users.',
      hints: ['Outer decorator runs first', 'Auth check before method check'],
      tags: ['django', 'views', 'login_required', 'require_POST', 'decorator-order', 'cloze'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj4e-owned-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      question: 'What does "owned rows" mean in a Django web application?',
      options: [
        { id: 'a', text: 'Database rows that are locked and cannot be edited by anyone', isCorrect: false },
        { id: 'b', text: 'A database-level concept unrelated to Django', isCorrect: false },
        { id: 'c', text: 'Rows that have a primary key assigned by the owner', isCorrect: false },
        { id: 'd', text: 'Data rows that belong to a specific user — only that user (or admins) should be able to edit or delete them', isCorrect: true },
      ],
      explanation: 'Owned rows means tying data to a specific user — e.g. a blog post created by Alice should only be editable by Alice. This is enforced at the model level (`owner = ForeignKey(User, ...)`) and at the view level by checking `obj.owner == request.user` before allowing edits/deletes. Never trust the client — always verify ownership on the server.',
      hints: [
        'Store `owner = ForeignKey(settings.AUTH_USER_MODEL, ...)` on the model',
        'Check `obj.owner == request.user` in every edit/delete view',
      ],
      tags: ['django', 'owned-rows', 'authorisation', 'security', 'permissions'],
      concepts: ['py-security-primitives', 'dj-permission-class'],
    },
{
      id: 'dj4e-owned-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a Django model `Post` with three fields: a title as a CharField with max_length 200, a body as a TextField, and an owner as a ForeignKey to the built-in `User` model (imported from `django.contrib.auth.models`) with cascade delete behaviour. Then write a view `delete_post(request, pk)` that fetches the post using `get_object_or_404`; if the post\'s owner is not the current request user, return an `HttpResponseForbidden` with the message "You do not own this post"; otherwise delete the post and return an `HttpResponse` with the message "Deleted".',
      starterCode: `# Define Post(models.Model): title CharField(max_length=200), body
# TextField, owner ForeignKey to the built-in User with cascade delete.
# Write delete_post(request, pk): fetch the post with get_object_or_404;
# if its owner isn't request.user return HttpResponseForbidden("You do
# not own this post"); otherwise delete it and return HttpResponse("Deleted").
`,
      testCases: [
        { input: '', expectedOutput: 'ownership check enforced', description: 'Only owner can delete' },
      ],
      solution: `from django.db import models
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import get_object_or_404

class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

def delete_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if post.owner != request.user:
        return HttpResponseForbidden("You do not own this post")
    post.delete()
    return HttpResponse("Deleted")`,
      explanation: '`get_object_or_404` raises a 404 if the post doesn\'t exist — no manual check needed. Then `post.owner != request.user` checks ownership. `HttpResponseForbidden` returns a 403 status. Only after passing the ownership check do we call `post.delete()`. Always enforce ownership on the server — never rely on hiding UI elements.',
      hints: [
        'Use `get_object_or_404(Post, pk=pk)` to fetch or 404',
        'Compare `post.owner != request.user` and return `HttpResponseForbidden` if not the owner',
      ],
      tags: ['django', 'owned-rows', 'authorisation', 'views', 'security', 'HttpResponseForbidden'],
      concepts: ['dj-view-patterns', 'py-security-primitives'],
    },
{
      id: 'dj4e-owned-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write `my_posts(request)` decorated with `@login_required` (from `django.contrib.auth.decorators`). Filter `Post.objects` by `owner=request.user`, build a list of `post.title` strings, and return an `HttpResponse` with them joined by `\\n`.',
      starterCode: `# Write my_posts(request) decorated with @login_required: filter
# Post.objects by owner=request.user, collect each post.title, and
# return an HttpResponse with them joined by newlines.
`,
      testCases: [
        { input: '', expectedOutput: 'filtered by owner', description: 'Should only return current user posts' },
      ],
      solution: `from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

@login_required
def my_posts(request):
    posts = Post.objects.filter(owner=request.user)
    titles = [post.title for post in posts]
    return HttpResponse("\\n".join(titles))`,
      explanation: '`@login_required` redirects unauthenticated users to the login page automatically. `filter(owner=request.user)` is the key pattern — Django translates this to `WHERE owner_id = <user_id>`, so each user only sees their own data. This pattern combined with the edit/delete ownership check is the complete owned rows pattern.',
      hints: [
        '`Post.objects.filter(owner=request.user)` filters to the current user\'s posts',
        '`@login_required` ensures `request.user` is authenticated',
      ],
      tags: ['django', 'owned-rows', 'login_required', 'filter', 'views', 'authorisation'],
      concepts: ['dj-orm-query-construction', 'dj-view-patterns'],
    },
{
      id: 'py-dj-auth-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function-based view `create_article(request)` that requires login and only accepts POST. Save a new Article from the posted form data and redirect to the detail page.',
      correctOrder: [
        'from django.contrib.auth.decorators import login_required',
        'from django.views.decorators.http import require_POST',
        'from django.shortcuts import redirect',
        '',
        '@login_required',
        '@require_POST',
        'def create_article(request):',
        '    article = Article.objects.create(',
        '        title=request.POST["title"],',
        '        body=request.POST["body"],',
        '        author=request.user,',
        '    )',
        '    return redirect("article_detail", pk=article.pk)',
      ],
      distractorLines: [
        'from django.contrib.auth import login_required',
        '@requires_login',
        '    return HttpResponseRedirect(article)',
        '    article = Article(...).save()',
      ],
      solution: 'from django.contrib.auth.decorators import login_required\nfrom django.views.decorators.http import require_POST\nfrom django.shortcuts import redirect\n\n@login_required\n@require_POST\ndef create_article(request):\n    article = Article.objects.create(\n        title=request.POST["title"],\n        body=request.POST["body"],\n        author=request.user,\n    )\n    return redirect("article_detail", pk=article.pk)',
      explanation: 'Decorator order matters: closest to the function runs first. `@login_required` must be on top so unauthenticated requests bounce *before* hitting `@require_POST`\'s 405 check. `objects.create()` builds and saves in one call. `redirect("named_url", **kwargs)` reverses the URL by name.',
      hints: ['@login_required goes outermost (top)', 'objects.create() = build + save', 'redirect by URL name + kwargs'],
      tags: ['django', 'views', 'login_required', 'require_POST', 'redirect', 'parsons'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'py-dj-auth-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What\'s logged when an anonymous user requests GET /create/? (assume LOGIN_URL = "/login/")',
      code: `@login_required
@require_POST
def create(request):
    print("inside create")
    return HttpResponse("ok")

# Anonymous GET /create/
response = create(anonymous_request)
print(response.status_code)`,
      expectedOutput: `302`,
      explanation: '`@login_required` is the OUTER decorator (closest to the function call site). It runs first, sees an anonymous user, and immediately returns a 302 redirect to LOGIN_URL — never invoking the inner `@require_POST`. So "inside create" never prints. If decorator order were swapped, anonymous GET would get 405 first instead.',
      hints: ['Outer decorator runs first', '@login_required redirects anonymous users with 302', 'Decorator order matters'],
      tags: ['django', 'views', 'login_required', 'decorator-order', 'predict'],
      concepts: ['dj-view-patterns'],
    },
{
      id: 'dj-views-adv-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Stack three decorators on a mutating function-based view in the correct order: require login, require an "articles.publish_article" permission (return 403, not a login redirect, on failure), and require the request method to be POST. The body fetches the article by pk, flips status to published, saves, and redirects.',
      correctOrder: [
        'from django.contrib.auth.decorators import login_required, permission_required',
        'from django.views.decorators.http import require_POST',
        'from django.shortcuts import get_object_or_404, redirect',
        'from .models import Article',
        '',
        '@login_required',
        '@permission_required("articles.publish_article", raise_exception=True)',
        '@require_POST',
        'def publish_article(request, pk):',
        '    article = get_object_or_404(Article, pk=pk)',
        '    article.status = "published"',
        '    article.save()',
        '    return redirect("article_detail", pk=pk)',
      ],
      distractorLines: [
        '@permission_required("articles.publish_article")',
        '@require_GET',
        '@cache_page(300)',
        'def publish_article(request):',
        '    article.publish()',
      ],
      solution: '@login_required\n@permission_required("articles.publish_article", raise_exception=True)\n@require_POST\ndef publish_article(request, pk):\n    article = get_object_or_404(Article, pk=pk)\n    article.status = "published"\n    article.save()\n    return redirect("article_detail", pk=pk)',
      explanation: 'Decorator order is OUTSIDE-IN: the topmost wraps everything below. The right stack for a mutating endpoint is `@login_required` outermost (anonymous users redirect to login *before* anything else), then `@permission_required(..., raise_exception=True)` (logged-in but unauthorised users get 403 — `raise_exception=True` makes it 403 instead of a confusing redirect), then `@require_POST` innermost (rejects GET/PUT/DELETE with 405). Never put `@cache_page` on a mutating endpoint — it would cache the redirect/403 and replay it.',
      hints: [
        'Auth check outermost so anonymous users bounce first',
        'raise_exception=True on permission_required gives 403, not a login redirect',
        'Method check innermost (closest to the function)',
        'Never @cache_page a mutating endpoint',
      ],
      tags: ['django', 'views', 'decorators', 'login_required', 'permission_required', 'parsons', 'advanced'],
      concepts: ['dj-view-patterns', 'py-decorator-application'],
    },
  // ===== Layer A: in-place advanced single-skill primitives =====
  // --- groups + permission assignment ---
{
      id: 'dj-auth-groups-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      question: 'How can a permission reach a user, and what does `user.has_perm("app.codename")` consult?',
      options: [
        { id: 'a', text: 'A permission can be granted directly via `user.user_permissions` OR to a `Group` the user belongs to via `group.permissions`; `has_perm` returns True if EITHER path grants it (the union of both)', isCorrect: true },
        { id: 'b', text: 'Permissions can only be granted through groups; `user.user_permissions` is read-only and just reflects the permissions of whatever groups the user has joined', isCorrect: false },
        { id: 'c', text: '`has_perm` consults only `user.user_permissions`; group permissions require a separate `has_group_perm` call that you must invoke yourself', isCorrect: false },
        { id: 'd', text: 'A user inherits every permission of every group automatically, but `has_perm` ignores direct `user_permissions` entirely and only checks group membership', isCorrect: false },
      ],
      explanation: 'Permissions attach two ways: directly (`user.user_permissions.add(perm)`) or via a group (`group.permissions.add(perm)` + `user.groups.add(group)`). `has_perm` returns True if the permission is granted through EITHER — it evaluates the union. Groups are the scalable choice (assign roles, not individual perms). Note the result is cached on the user instance after the first check.',
      hints: [
        'Direct (user_permissions) OR via a group',
        'has_perm checks the union of both',
        'Groups = roles; prefer them at scale',
      ],
      tags: ['django', 'auth', 'groups', 'permissions', 'has_perm'],
      concepts: ['dj-permission-class'],
    },
{
      id: 'dj-auth-groups-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the two related-manager accessors: attach a permission to a group, then add the user to that group.',
      template: `perm = Permission.objects.get(codename="publish_post")
editors = Group.objects.create(name="Editors")
editors.___.add(perm)
user.___.add(editors)`,
      blanks: ['permissions', 'groups'],
      solution: `perm = Permission.objects.get(codename="publish_post")
editors = Group.objects.create(name="Editors")
editors.permissions.add(perm)
user.groups.add(editors)`,
      explanation: 'A `Group` has a `permissions` M2M to `Permission`; a `User` has a `groups` M2M to `Group`. Adding the permission to the group and the user to the group means the user gains the permission transitively — `user.has_perm("app.publish_post")` becomes True.',
      hints: [
        'Group.permissions ↔ Permission',
        'User.groups ↔ Group',
        'Both are .add() on a related manager',
      ],
      tags: ['django', 'auth', 'groups', 'permissions'],
      concepts: ['dj-permission-class'],
    },
{
      id: 'dj-auth-groups-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write `grant_publish(user)` that ensures there is a group named "Editors" holding the `publish_post` permission and adds the given user to it, then returns the group. Import `Group` and `Permission` from `django.contrib.auth.models`. Use `get_or_create` for the group so the function is idempotent, and fetch the permission by its `codename`.',
      starterCode: `from django.contrib.auth.models import Group, Permission
`,
      testCases: [
        {
          input: 'grant_publish(user) called twice',
          expectedOutput: 'idempotent: one Editors group, user in it, holds publish_post',
          description: 'Group get_or_create + permission attach + add user',
        },
      ],
      solution: `from django.contrib.auth.models import Group, Permission


def grant_publish(user):
    group, _ = Group.objects.get_or_create(name="Editors")
    perm = Permission.objects.get(codename="publish_post")
    group.permissions.add(perm)
    user.groups.add(group)
    return group`,
      explanation: '`get_or_create` makes the function safe to call repeatedly — it returns the existing "Editors" group instead of creating duplicates. `permissions.add`/`groups.add` are idempotent on an M2M (adding an existing member is a no-op). Granting via a group rather than `user.user_permissions` means every future editor just joins the group and inherits the permission.',
      hints: [
        'Group.objects.get_or_create(name=...) for idempotency',
        'Permission.objects.get(codename=...)',
        'group.permissions.add(perm); user.groups.add(group)',
      ],
      tags: ['django', 'auth', 'groups', 'permissions', 'get_or_create'],
      concepts: ['dj-permission-class'],
    },
  // --- get_user_model() vs AUTH_USER_MODEL ---
{
      id: 'dj-auth-getusermodel-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      question: 'You need to reference the active user model. When do you use `get_user_model()` versus `settings.AUTH_USER_MODEL`?',
      options: [
        { id: 'a', text: 'Use the string `settings.AUTH_USER_MODEL` in a `ForeignKey`/model definition (resolved lazily at migration time, avoiding import cycles); call `get_user_model()` in runtime code (views, forms, scripts) where you need the actual model class', isCorrect: true },
        { id: 'b', text: 'They are interchangeable aliases — `get_user_model()` simply returns `settings.AUTH_USER_MODEL` as a string, so either works in both model and runtime code', isCorrect: false },
        { id: 'c', text: 'Use `get_user_model()` inside model field definitions and `settings.AUTH_USER_MODEL` everywhere else; a `ForeignKey` needs the resolved class, not a string', isCorrect: false },
        { id: 'd', text: 'Both should be avoided in favour of importing `User` from `django.contrib.auth.models`, which always resolves to the configured custom model anyway', isCorrect: false },
      ],
      explanation: 'In a model file, importing the user model directly can cause an import cycle and pins you to whatever model is loaded — so a `ForeignKey` should take the STRING `settings.AUTH_USER_MODEL` (e.g. `"accounts.User"`), which Django resolves lazily. In ordinary runtime code you want the real class (to query, build, or `isinstance`), and `get_user_model()` returns it. Importing `User` directly breaks the moment the project swaps to a custom user model.',
      hints: [
        'FK / model definition → settings.AUTH_USER_MODEL (string, lazy)',
        'Runtime code → get_user_model() (actual class)',
        'Never hard-import User in a swappable project',
      ],
      tags: ['django', 'auth', 'get_user_model', 'AUTH_USER_MODEL'],
      concepts: ['dj-auth-token-vs-session'],
    },
{
      id: 'dj-auth-getusermodel-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the helper that returns the active user model class (use it in runtime code, not in a FK definition).',
      template: `from django.contrib.auth import ___

User = ___()
admins = User.objects.filter(is_staff=True)`,
      blanks: ['get_user_model', 'get_user_model'],
      solution: `from django.contrib.auth import get_user_model

User = get_user_model()
admins = User.objects.filter(is_staff=True)`,
      explanation: '`get_user_model()` returns the model class named by `settings.AUTH_USER_MODEL`, so your code keeps working if the project later swaps in a custom user. Use it in views/forms/scripts; in a `ForeignKey` use the `settings.AUTH_USER_MODEL` string instead (resolved lazily to avoid import cycles).',
      hints: ['One callable from django.contrib.auth', 'Returns the configured user class'],
      tags: ['django', 'auth', 'get_user_model'],
      concepts: ['dj-auth-token-vs-session'],
    },
  // --- custom model permissions (Meta.permissions) ---
{
      id: 'dj-auth-custperm-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      question: 'A model needs a "can_publish" permission that is not one of the auto-created add/change/delete/view perms. How do you define and check it?',
      options: [
        { id: 'a', text: 'Declare it in the model\'s `Meta.permissions = [("can_publish", "Can publish articles")]`; after migrating, check it with `user.has_perm("app_label.can_publish")`', isCorrect: true },
        { id: 'b', text: 'Add `can_publish = models.BooleanField()` to the model; Django turns boolean fields into permissions automatically and exposes them through `has_perm`', isCorrect: false },
        { id: 'c', text: 'Configure it in `settings.CUSTOM_PERMISSIONS` as a dict, then check it with `user.permissions.contains("can_publish")` at runtime', isCorrect: false },
        { id: 'd', text: 'Override the model\'s `has_perm` method to return True for "can_publish"; Django has no declarative way to add non-CRUD permissions', isCorrect: false },
      ],
      explanation: 'Custom (non-CRUD) permissions are declared on the model via `Meta.permissions`, a list of `(codename, human_label)` tuples. Running migrations creates the matching `Permission` rows. You then assign it like any permission (to a user or group) and check `user.has_perm("app_label.can_publish")`. Boolean fields are NOT permissions; there is no `settings.CUSTOM_PERMISSIONS`.',
      hints: [
        'Meta.permissions = [(codename, label), ...]',
        'Migrate to create the Permission rows',
        'Check has_perm("app_label.codename")',
      ],
      tags: ['django', 'auth', 'permissions', 'custom-permission', 'Meta'],
      concepts: ['dj-permission-class'],
    },
{
      id: 'dj-auth-custperm-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the Meta option that declares a custom (non-CRUD) permission on the model.',
      template: `class Article(models.Model):
    title = models.CharField(max_length=200)

    class Meta:
        ___ = [
            ("can_publish", "Can publish articles"),
        ]`,
      blanks: ['permissions'],
      solution: `class Article(models.Model):
    title = models.CharField(max_length=200)

    class Meta:
        permissions = [
            ("can_publish", "Can publish articles"),
        ]`,
      explanation: '`Meta.permissions` is a list of `(codename, display_name)` tuples. After migrating, a `Permission` row with codename `can_publish` exists for the `Article` model and can be assigned to users/groups and checked via `has_perm("app_label.can_publish")`.',
      hints: ['Meta option holding (codename, label) tuples', 'Plural noun'],
      tags: ['django', 'auth', 'custom-permission', 'Meta'],
      concepts: ['dj-permission-class'],
    },
  // --- CBV access mixins (Login / Permission / UserPasses) ---
{
      id: 'dj-auth-accessmixins-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      question: 'For class-based views, what do `LoginRequiredMixin`, `PermissionRequiredMixin`, and `UserPassesTestMixin` each enforce?',
      options: [
        { id: 'a', text: '`LoginRequiredMixin` requires an authenticated user; `PermissionRequiredMixin` requires a named permission via `permission_required`; `UserPassesTestMixin` requires your `test_func()` to return True — and all must precede the generic view in the MRO', isCorrect: true },
        { id: 'b', text: 'They are identical apart from the status code they emit — 401, 403, and 404 respectively — and may appear in any position among the base classes', isCorrect: false },
        { id: 'c', text: '`LoginRequiredMixin` checks a permission, `PermissionRequiredMixin` checks group membership, and `UserPassesTestMixin` checks the session age; their order is irrelevant', isCorrect: false },
        { id: 'd', text: 'They configure DRF permission classes and only work on `APIView` subclasses, not on Django\'s generic class-based views', isCorrect: false },
      ],
      explanation: 'Three escalating gates for CBVs: `LoginRequiredMixin` (just authenticated), `PermissionRequiredMixin` (holds `permission_required = "app.codename"`), `UserPassesTestMixin` (passes a custom `test_func(self)` returning a bool). Each must come BEFORE the generic view class in the base list so its `dispatch` runs first (MRO). By default a failed check redirects to login; set `raise_exception = True` to return 403 for a logged-in-but-unauthorized user.',
      hints: [
        'Login → authenticated; Permission → named perm; UserPasses → test_func',
        'Mixin goes before the generic view (MRO)',
        'raise_exception=True ⇒ 403 instead of redirect',
      ],
      tags: ['django', 'auth', 'LoginRequiredMixin', 'PermissionRequiredMixin', 'UserPassesTestMixin'],
      concepts: ['dj-permission-class'],
    },
{
      id: 'dj-auth-permmixin-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the attribute that tells `PermissionRequiredMixin` which permission to require.',
      template: `class ArticleUpdateView(PermissionRequiredMixin, UpdateView):
    model = Article
    ___ = "blog.change_article"`,
      blanks: ['permission_required'],
      solution: `class ArticleUpdateView(PermissionRequiredMixin, UpdateView):
    model = Article
    permission_required = "blog.change_article"`,
      explanation: '`PermissionRequiredMixin` reads the `permission_required` attribute (a string, or a tuple/list of strings — ALL required) and calls `request.user.has_perm(...)`. The mixin must be listed before `UpdateView` so its `dispatch` runs first. Set `raise_exception = True` to 403 a logged-in user who lacks the permission instead of redirecting them to login.',
      hints: ['Attribute name = the mixin\'s prefix + "_required"', 'Value is an "app.codename" string'],
      tags: ['django', 'auth', 'PermissionRequiredMixin'],
      concepts: ['dj-permission-class'],
    },
{
      id: 'dj-auth-userpasses-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the method `UserPassesTestMixin` calls — it returns True to allow access (here: staff only).',
      template: `class StaffDashboard(UserPassesTestMixin, TemplateView):
    template_name = "staff.html"

    def ___(self):
        return self.request.user.is_staff`,
      blanks: ['test_func'],
      solution: `class StaffDashboard(UserPassesTestMixin, TemplateView):
    template_name = "staff.html"

    def test_func(self):
        return self.request.user.is_staff`,
      explanation: '`UserPassesTestMixin` calls `test_func(self)`; return True to allow, False to deny (default: redirect to login, or 403 with `raise_exception = True`). It is the catch-all for access rules that aren\'t a single named permission — staff-only, owner-only, within-quota, etc. Access `self.request` for the user and `self.kwargs` for URL captures.',
      hints: ['Method returning a bool that gates the view', 'Reads self.request.user'],
      tags: ['django', 'auth', 'UserPassesTestMixin', 'user-passes-test', 'test_func'],
      concepts: ['dj-permission-class'],
    },
{
      id: 'dj-auth-userpasses-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `A reporting dashboard should be reachable ONLY by staff members. Anyone not logged in should be sent to login, but a logged-in NON-staff user should get a 403 (not a confusing login redirect).

  Build a class-based \`TemplateView\` for \`"reports/dashboard.html"\` that layers the login requirement and a staff-only test using the appropriate access mixins, and make the failed-test case raise (403) rather than redirect.`,
      starterCode: `from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import TemplateView
`,
      testCases: [
        {
          input: 'anonymous → login redirect; non-staff → 403; staff → 200',
          expectedOutput: 'LoginRequiredMixin + UserPassesTestMixin + test_func(is_staff) + raise_exception',
          description: 'Staff-only CBV with 403 (not redirect) for logged-in non-staff',
        },
      ],
      solution: `from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import TemplateView


class ReportDashboard(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    template_name = "reports/dashboard.html"
    raise_exception = True

    def test_func(self):
        return self.request.user.is_staff`,
      explanation: '`LoginRequiredMixin` first (anonymous users bounce to login), then `UserPassesTestMixin` whose `test_func` allows only staff. `raise_exception = True` makes the failed test a 403 — appropriate for an authenticated-but-unauthorized user, since a login redirect would loop them (they\'re already logged in). Mixin order before `TemplateView` matters: their `dispatch` overrides must run before the view renders.',
      hints: [
        'LoginRequiredMixin then UserPassesTestMixin then TemplateView',
        'test_func returns request.user.is_staff',
        'raise_exception = True ⇒ 403 not redirect',
      ],
      tags: ['django', 'auth', 'UserPassesTestMixin', 'user-passes-test', 'mixin', 'advanced'],
      concepts: ['dj-permission-class'],
    },
  // --- built-in auth views + urls ---
{
      id: 'dj-auth-authviews-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      question: 'What does `path("accounts/", include("django.contrib.auth.urls"))` give you, and how is the post-login destination chosen?',
      options: [
        { id: 'a', text: 'It wires up Django\'s built-in `LoginView`/`LogoutView`/password-reset/-change views (rendering templates under `registration/`); after login the user goes to the `?next=` URL if present, otherwise to `LOGIN_REDIRECT_URL`', isCorrect: true },
        { id: 'b', text: 'It generates REST endpoints that return JWT tokens; the redirect target is read from the `Authorization` header on each request', isCorrect: false },
        { id: 'c', text: 'It adds only a logout URL — login must always be hand-written — and the redirect is hard-coded to the site root `/`', isCorrect: false },
        { id: 'd', text: 'It registers the admin login form for the public site; the destination is whatever `LOGIN_URL` points at, ignoring any `next` parameter', isCorrect: false },
      ],
      explanation: '`django.contrib.auth.urls` ships ready-made class-based views for login, logout, and the password change/reset flow — you just provide templates under `registration/` (e.g. `registration/login.html`). On success `LoginView` honours a safe `?next=` parameter first, falling back to `settings.LOGIN_REDIRECT_URL`. (`LOGIN_URL` is the opposite direction — where `@login_required` sends anonymous users.) Only write custom auth views for genuinely non-standard flows.',
      hints: [
        'auth.urls = login/logout/password reset+change views',
        'Templates live under registration/',
        'next= wins, else LOGIN_REDIRECT_URL',
      ],
      tags: ['django', 'auth', 'auth-urls', 'LoginView', 'LOGIN_REDIRECT_URL'],
      concepts: ['dj-auth-token-vs-session'],
    },
{
      id: 'dj-auth-authviews-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the URLconf helper that mounts the built-in auth views, and the setting that names where users land after login.',
      template: `# urls.py
urlpatterns = [
    path("accounts/", ___("django.contrib.auth.urls")),
]

# settings.py
___ = "/dashboard/"`,
      blanks: ['include', 'LOGIN_REDIRECT_URL'],
      solution: `# urls.py
urlpatterns = [
    path("accounts/", include("django.contrib.auth.urls")),
]

# settings.py
LOGIN_REDIRECT_URL = "/dashboard/"`,
      explanation: '`include("django.contrib.auth.urls")` mounts login/logout/password views under `accounts/`. `LOGIN_REDIRECT_URL` is where `LoginView` sends a user after a successful login when there is no `?next=`. Its mirror, `LOGIN_URL`, is where `@login_required`/`LoginRequiredMixin` send anonymous users.',
      hints: ['URLconf helper that mounts another urls module', 'Setting: LOGIN_ + REDIRECT + _URL'],
      tags: ['django', 'auth', 'auth-urls', 'LOGIN_REDIRECT_URL'],
      concepts: ['dj-auth-token-vs-session'],
    },
];
