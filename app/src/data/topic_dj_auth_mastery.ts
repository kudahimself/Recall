import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

// Auth Mastery (deep revisit) — cross-cutting auth/security mastery: session fixation &
// cookie flags, is_active/superuser permission resolution, password hashers & policy,
// timing attacks / user enumeration, the per-instance permission cache, object-level
// permission limits, CSRF vs token auth, JWT revocation tradeoffs, and custom auth
// backends. Stays out of the DRF-wiring / Deployment lanes — every item is about the
// authentication / authorization / session-security layer itself.
export const dj_auth_mastery_questions: Question[] = [
// --- session & cookie security ---
{
      id: 'dj-auth-mastery-session-fixation-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH_MASTERY,
      course: Course.BACKEND,
      question: 'Calling `login(request, user)` regenerates (cycles) the session key. What attack does that defend against?',
      options: [
        { id: 'a', text: 'Session fixation — an attacker who planted a known session id in the victim\'s browser before login would otherwise inherit the authenticated session; cycling the key on login makes the pre-auth id worthless', isCorrect: true },
        { id: 'b', text: 'CSRF — rotating the session key invalidates any CSRF token an attacker had captured from the login form, so the forged request is rejected', isCorrect: false },
        { id: 'c', text: 'Brute-force login — it forces the client to complete a fresh key-exchange handshake after each failed attempt, slowing down guessing', isCorrect: false },
        { id: 'd', text: 'Nothing security-related — it is a performance step that compacts the session store and can be disabled with no risk', isCorrect: false },
      ],
      explanation: 'Session fixation: the attacker fixes a session id in the victim\'s browser (e.g. via a crafted link) BEFORE they authenticate, hoping the same id stays valid after login so the attacker can ride it. Django defeats this by cycling the session key inside `login()` — the id the attacker knows is discarded and a fresh one is issued, so it never becomes an authenticated session. Unrelated to CSRF tokens, brute force, or store compaction.',
      hints: [
        'login() issues a NEW session key',
        'Defeats a pre-planted (fixed) session id',
        'Not CSRF, not brute force',
      ],
      tags: ['django', 'auth', 'session', 'session-fixation', 'security'],
      concepts: ['dj-auth-token-vs-session', 'py-security-primitives'],
    },
{
      id: 'dj-auth-mastery-cookie-flags-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH_MASTERY,
      course: Course.BACKEND,
      question: 'What do `SESSION_COOKIE_SECURE`, the cookie\'s `HttpOnly` flag, and `SESSION_COOKIE_SAMESITE` each protect the session cookie against?',
      options: [
        { id: 'a', text: '`Secure` stops it being sent over plain HTTP (network interception); `HttpOnly` hides it from JavaScript (limiting XSS theft); `SameSite` restricts cross-site sending (mitigating CSRF)', isCorrect: true },
        { id: 'b', text: 'They are all TLS-handshake settings that negotiate the cipher suite; once the cookie has been issued they have no further effect on it', isCorrect: false },
        { id: 'c', text: '`Secure` encrypts the cookie value, `HttpOnly` signs it, and `SameSite` compresses it — three independent transforms applied to the stored session data', isCorrect: false },
        { id: 'd', text: 'They are server-side session-store options controlling expiry, eviction, and replication; the browser itself never sees or enforces any of them', isCorrect: false },
      ],
      explanation: 'These are browser-enforced cookie attributes, not transforms of the value. `Secure` ⇒ the cookie is withheld on non-HTTPS requests, so a network attacker can\'t sniff it. `HttpOnly` ⇒ `document.cookie` can\'t read it, so an XSS payload can\'t exfiltrate the session. `SameSite=Lax/Strict` ⇒ the browser won\'t attach it to cross-site requests, cutting off the CSRF vector. They protect the cookie in transit and in the browser; they don\'t encrypt or sign the value.',
      hints: [
        'Secure → not over plain HTTP',
        'HttpOnly → not readable by JS (XSS)',
        'SameSite → not sent cross-site (CSRF)',
      ],
      tags: ['django', 'auth', 'session', 'cookies', 'security'],
      concepts: ['py-security-primitives'],
    },
// --- permission resolution ---
{
      id: 'dj-auth-mastery-inactive-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH_MASTERY,
      course: Course.BACKEND,
      question: 'A user has `is_active = False` but has been assigned every permission. Under the default `ModelBackend`, what can they do?',
      options: [
        { id: 'a', text: 'Nothing through auth — `authenticate()` rejects inactive users so they can\'t log in, and `has_perm()` returns False for all permissions no matter what is assigned', isCorrect: true },
        { id: 'b', text: 'Everything their permissions allow; `is_active` only hides them from the admin user list and has no effect on authentication or permission checks', isCorrect: false },
        { id: 'c', text: 'They can log in normally, but every `has_perm()` call returns False; `is_active` gates permissions yet leaves authentication untouched', isCorrect: false },
        { id: 'd', text: 'They can authenticate but are force-logged-out on the next request; their permissions are entirely unaffected by `is_active`', isCorrect: false },
      ],
      explanation: '`is_active=False` is the standard "soft-disable / ban" switch. The default `ModelBackend.authenticate()` returns `None` for inactive users (so login fails), and `ModelBackend` also returns no permissions for an inactive user, so `has_perm()` is uniformly False. Prefer flipping `is_active` over deleting a user — it preserves their rows and FK integrity while cutting off all access.',
      hints: [
        'is_active=False ⇒ can\'t authenticate',
        'ModelBackend grants inactive users no perms',
        'It is the soft-ban switch',
      ],
      tags: ['django', 'auth', 'is_active', 'permissions', 'ModelBackend'],
      concepts: ['dj-permission-class'],
    },
{
      id: 'dj-auth-mastery-superuser-perm-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH_MASTERY,
      course: Course.BACKEND,
      question: 'For a user with `is_superuser = True`, how does `user.has_perm("anything.at_all")` behave?',
      options: [
        { id: 'a', text: 'It returns True for every permission string without consulting groups or `user_permissions` — `ModelBackend` short-circuits superusers, so they implicitly pass all permission checks', isCorrect: true },
        { id: 'b', text: 'It returns True only for permissions explicitly granted to them; superuser status changes admin-site access but not `has_perm`', isCorrect: false },
        { id: 'c', text: 'It raises `PermissionDenied` unless the named permission actually exists as a row in the database', isCorrect: false },
        { id: 'd', text: 'It returns True only for the app the user most recently logged into, and False for permissions belonging to other apps', isCorrect: false },
      ],
      explanation: 'For an active superuser, `ModelBackend.has_perm` returns True unconditionally — it never looks at the permission tables. That is why a superuser sees every admin action and passes every `PermissionRequiredMixin`/`permission_required` gate. The flip side: a permission check passing in dev (where you\'re a superuser) proves nothing about a normal user — test authorization with a non-superuser account.',
      hints: [
        'Superuser ⇒ has_perm always True',
        'Tables are not consulted at all',
        'Test authz with a non-superuser',
      ],
      tags: ['django', 'auth', 'superuser', 'has_perm', 'permissions'],
      concepts: ['dj-permission-class'],
    },
{
      id: 'dj-auth-mastery-perm-cache-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_AUTH_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Permissions are assigned in the DB AFTER the first check, on the same in-memory user object. What prints?',
      code: `# u was just fetched; "blog.publish" is NOT yet assigned to u
print(u.has_perm("blog.publish"))
assign_publish_in_db(u)            # adds the perm row in the database
print(u.has_perm("blog.publish"))
u = User.objects.get(pk=u.pk)      # re-fetch a fresh instance
print(u.has_perm("blog.publish"))`,
      expectedOutput: `False
False
True`,
      explanation: 'The first `has_perm` call populates a permission cache on the user INSTANCE (`_perm_cache`) and reuses it for the instance\'s lifetime. Assigning the permission in the database afterwards does not invalidate that cache, so the second check still returns False. Only a freshly fetched instance (or deleting the cache attribute) rebuilds the set and sees the new permission — hence True. This bites long-lived request flows that grant a permission and re-check it on the same object.',
      hints: [
        'has_perm caches perms on the instance after first use',
        'A later DB grant does not refresh that cache',
        'Re-fetch (new instance) to see the change',
      ],
      tags: ['django', 'auth', 'permissions', 'permission-cache', 'predict', 'advanced'],
      concepts: ['dj-permission-class'],
    },
{
      id: 'dj-auth-mastery-objperm-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_AUTH_MASTERY,
      course: Course.BACKEND,
      question: 'A view calls `request.user.has_perm("blog.change_article", article_instance)`. With Django\'s default backend, what does passing the object argument do?',
      options: [
        { id: 'a', text: 'Nothing different — `ModelBackend` ignores the object and answers at the model level, so it returns the same as without it; true per-object permissions need a backend that implements object checks (e.g. django-guardian) or manual `obj.owner == request.user` logic', isCorrect: true },
        { id: 'b', text: 'It scopes the check to that one row, returning True only if the user was explicitly granted change rights on that specific article through the admin', isCorrect: false },
        { id: 'c', text: 'It raises `TypeError`, because `has_perm` accepts only a permission string and never a second positional argument', isCorrect: false },
        { id: 'd', text: 'It auto-creates a per-object permission row the first time it is called, so later checks on the same object become row-scoped', isCorrect: false },
      ],
      explanation: 'Django\'s built-in permissions are MODEL-level: "can change *any* article", not "can change *this* article". `ModelBackend` accepts the `obj` argument for API compatibility but ignores it, so `has_perm(perm, obj)` == `has_perm(perm)`. Genuine row-level authorization comes from either a custom/third-party backend (django-guardian, rules) or explicit ownership/tenant checks in the view — which is exactly what the advanced `OrgMemberRequiredMixin` in `dj_auth` does by hand.',
      hints: [
        'Default perms are model-level, not per-object',
        'ModelBackend ignores the obj argument',
        'Row-level ⇒ custom backend or manual ownership check',
      ],
      tags: ['django', 'auth', 'object-permissions', 'has_perm', 'advanced'],
      concepts: ['dj-permission-class'],
    },
// --- password storage & policy ---
{
      id: 'dj-auth-mastery-passwd-validators-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH_MASTERY,
      course: Course.BACKEND,
      question: 'When do the validators in `AUTH_PASSWORD_VALIDATORS` (minimum length, common-password, etc.) actually run?',
      options: [
        { id: 'a', text: 'Only when something calls `validate_password()` — e.g. `UserCreationForm`/`SetPasswordForm` or `createsuperuser`. A bare `user.set_password(raw)` hashes and stores WITHOUT running them, so programmatic password setting bypasses the policy unless you validate first', isCorrect: true },
        { id: 'b', text: 'On every `user.save()`, because Django re-validates the password field against the policy as part of model validation', isCorrect: false },
        { id: 'c', text: 'Inside `set_password()` itself, so any code path that changes a password is automatically policy-checked before hashing', isCorrect: false },
        { id: 'd', text: 'At login time inside `authenticate()`, rejecting users whose stored password no longer satisfies the current policy', isCorrect: false },
      ],
      explanation: '`AUTH_PASSWORD_VALIDATORS` are enforced by `django.contrib.auth.password_validation.validate_password()`, which the auth FORMS and the `createsuperuser` command call. `set_password()` only hashes — it does not validate. So a script or signal that does `user.set_password(weak); user.save()` silently stores a non-compliant password. If you set passwords outside a form, call `validate_password(raw, user)` yourself first.',
      hints: [
        'Validators run via validate_password(), not set_password()',
        'Forms / createsuperuser call it; raw set_password does not',
        'Validate yourself when setting passwords in code',
      ],
      tags: ['django', 'auth', 'password', 'validators', 'AUTH_PASSWORD_VALIDATORS'],
      concepts: ['py-security-primitives'],
    },
{
      id: 'dj-auth-mastery-hashers-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_AUTH_MASTERY,
      course: Course.BACKEND,
      question: 'How does Django store passwords, and what is the ordered `PASSWORD_HASHERS` list for?',
      options: [
        { id: 'a', text: 'Each password is stored as `algorithm$iterations$salt$hash` with a per-user random salt; the FIRST hasher is used for new/changed passwords, and when a user logs in with a hash from a weaker but still-listed algorithm Django transparently re-hashes it with the preferred one', isCorrect: true },
        { id: 'b', text: 'All passwords share one global salt derived from `SECRET_KEY`; `PASSWORD_HASHERS` merely records which algorithms are allowed, and old hashes must be migrated by hand with a data migration', isCorrect: false },
        { id: 'c', text: 'Passwords are encrypted (not hashed) with a key from `SECRET_KEY` so they can be decrypted for comparison; the list sets the cipher preference order', isCorrect: false },
        { id: 'd', text: 'Only the most recent hasher\'s output is ever valid; listing several hashers makes one password produce several hashes that are all checked in parallel at login', isCorrect: false },
      ],
      explanation: 'The stored string is `<algorithm>$<iterations>$<salt>$<hash>`, with a unique random salt per user (so identical passwords hash differently and rainbow tables don\'t apply). The first entry in `PASSWORD_HASHERS` is the preferred algorithm; the rest are kept so legacy hashes still verify. On a successful login whose stored hash used a non-preferred (or weaker-parameter) hasher, Django re-hashes the supplied password with the preferred one and updates the row — passwords upgrade silently as users log in. It is hashing, not reversible encryption.',
      hints: [
        'Format: algorithm$iterations$salt$hash, per-user salt',
        'First hasher = preferred for new passwords',
        'Upgrade-on-login re-hashes legacy entries',
      ],
      tags: ['django', 'auth', 'password', 'hashers', 'PASSWORD_HASHERS', 'advanced'],
      concepts: ['py-security-primitives'],
    },
{
      id: 'dj-auth-mastery-timing-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_AUTH_MASTERY,
      course: Course.BACKEND,
      question: 'Why does `ModelBackend.authenticate()` still run the password hasher even when no user matches the supplied username, and verify via `check_password` rather than `==`?',
      options: [
        { id: 'a', text: 'To resist timing attacks / user enumeration — hashing a dummy keeps the "no such user" response time close to "wrong password", and `check_password` is constant-time so attackers can\'t read the secret from how long the comparison takes', isCorrect: true },
        { id: 'b', text: 'To lazily create the missing user record so a later attempt with the same name succeeds without a separate registration step', isCorrect: false },
        { id: 'c', text: 'Because the hasher doubles as the audit-log writer; skipping it for missing users would drop those attempts from the security logs', isCorrect: false },
        { id: 'd', text: 'It does not — Django returns immediately when the username is absent, since running the hasher would just be wasted work', isCorrect: false },
      ],
      explanation: 'If "unknown username" returned instantly while "known username, wrong password" took a full hash cycle, an attacker could measure the difference and enumerate valid usernames. Django runs a throwaway hash (`set_password`/`make_password` on a dummy) so both paths cost about the same. And `check_password` uses a constant-time comparison so the time taken doesn\'t leak how many leading characters of the hash matched — both are deliberate anti-timing-attack measures.',
      hints: [
        'Equalize timing of "no user" vs "wrong password"',
        'Prevents username enumeration',
        'check_password is constant-time; == is not',
      ],
      tags: ['django', 'auth', 'timing-attack', 'user-enumeration', 'security', 'advanced'],
      concepts: ['py-security-primitives'],
    },
// --- backends & defense in depth ---
{
      id: 'dj-auth-mastery-backends-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH_MASTERY,
      course: Course.BACKEND,
      question: 'How does `authenticate(request, **credentials)` use the `AUTHENTICATION_BACKENDS` setting?',
      options: [
        { id: 'a', text: 'It tries each backend in order, calling its `authenticate()`; the first to return a user wins, and that backend\'s path is stored on the user so `login()` and later permission lookups use it. If all return None, authentication fails', isCorrect: true },
        { id: 'b', text: 'It calls every backend and requires them ALL to return the same user, failing if any disagree, to prevent backend spoofing', isCorrect: false },
        { id: 'c', text: 'It ignores the list and always uses `ModelBackend`; the setting only controls which backends the admin login page offers', isCorrect: false },
        { id: 'd', text: 'It picks one backend at random per request to balance load, recomputing the choice on every subsequent request', isCorrect: false },
      ],
      explanation: '`authenticate()` walks `AUTHENTICATION_BACKENDS` top-to-bottom, calling each backend\'s `authenticate()` with the credentials. The first backend to return a user short-circuits the rest; Django records `user.backend` (the dotted path) so `login()` and the permission machinery know which backend to use afterwards. If every backend returns `None`, the overall result is `None`. This is how you stack e.g. an LDAP/SSO backend before the default `ModelBackend`.',
      hints: [
        'Tried in order; first non-None user wins',
        'user.backend remembers which one succeeded',
        'All None ⇒ authentication fails',
      ],
      tags: ['django', 'auth', 'authentication-backends', 'authenticate'],
      concepts: ['dj-auth-token-vs-session'],
    },
{
      id: 'dj-auth-mastery-defense-depth-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_AUTH_MASTERY,
      course: Course.BACKEND,
      question: 'A list template hides the "Delete" button from non-owners with `{% if obj.owner == user %}`. Is the data now safe from non-owners?',
      options: [
        { id: 'a', text: 'No — hiding UI is not authorization. The delete view must re-check ownership/permission server-side (and ideally scope the queryset to the user), because anyone can POST to the URL directly regardless of what the template rendered', isCorrect: true },
        { id: 'b', text: 'Yes — once the button is gone from the rendered HTML there is no URL for a non-owner to submit, so no server-side check is needed', isCorrect: false },
        { id: 'c', text: 'Yes, as long as the template uses `{% if %}` rather than CSS; CSS-hidden controls stay reachable but template-removed ones do not', isCorrect: false },
        { id: 'd', text: 'No, but the right fix is JavaScript that disables the button client-side; a server check would only duplicate that logic', isCorrect: false },
      ],
      explanation: 'The template only controls what THIS render shows; the URL still exists and any client can issue the POST by hand (curl, devtools, a saved form). Authorization must live on the server: re-check `obj.owner == request.user` (or a permission) in the view before mutating, and scope `get_queryset()`/`get_object()` so a non-owner gets a 404/403 instead of the row. UI hiding is UX, not a security boundary — defense in depth means the server never trusts that the client hid the control.',
      hints: [
        'The URL is reachable even when the button is hidden',
        'Re-check ownership in the view, scope the queryset',
        'UI hiding is UX, not authorization',
      ],
      tags: ['django', 'auth', 'authorization', 'defense-in-depth', 'security'],
      concepts: ['py-security-primitives', 'dj-permission-class'],
    },
// --- CSRF & token tradeoffs ---
{
      id: 'dj-auth-mastery-csrf-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_AUTH_MASTERY,
      course: Course.BACKEND,
      question: 'How does Django\'s CSRF protection work, and why do session-authenticated endpoints need it while token/JWT-authenticated ones generally do not?',
      options: [
        { id: 'a', text: 'Unsafe requests (POST/PUT/DELETE) must echo a CSRF token an attacker\'s cross-site page can\'t read; safe methods (GET/HEAD) are exempt. The session cookie is sent automatically by the browser, so it needs CSRF; an `Authorization: Bearer` token is NOT auto-attached cross-site, so it isn\'t exposed to the same forgery', isCorrect: true },
        { id: 'b', text: 'CSRF works by encrypting the request body with the session key; token auth can skip it because a signed JWT already makes the body tamper-evident on its own', isCorrect: false },
        { id: 'c', text: 'Django rejects any request whose `Origin` header differs from the host; both session and token auth need CSRF, but DRF turns it off for tokens purely to raise throughput', isCorrect: false },
        { id: 'd', text: 'CSRF tokens are checked only on GET requests, to pre-authorize the POST that follows; stateless token auth has no GET step so the check is meaningless', isCorrect: false },
      ],
      explanation: 'CSRF abuses the browser\'s habit of auto-attaching cookies: a malicious site can make your browser POST to the app, and the session cookie rides along. Django blocks this by demanding a secret token (in a hidden field / header) that matches a value the attacker\'s page can\'t read due to the same-origin policy; safe methods are exempt because they shouldn\'t mutate. Token auth puts the credential in an `Authorization` header that the browser does NOT send automatically on a cross-site request, so the attacker can\'t forge an authenticated call — which is why DRF\'s `TokenAuthentication`/JWT classes are CSRF-exempt while `SessionAuthentication` enforces it.',
      hints: [
        'Unsafe methods must echo an unreadable-cross-site token',
        'Cookies auto-attach ⇒ session auth needs CSRF',
        'Bearer tokens don\'t auto-attach ⇒ token auth doesn\'t',
      ],
      tags: ['django', 'auth', 'csrf', 'security', 'advanced'],
      concepts: ['py-security-primitives', 'dj-auth-token-vs-session'],
    },
{
      id: 'dj-auth-mastery-jwt-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_AUTH_MASTERY,
      course: Course.BACKEND,
      question: 'What is the central tradeoff of stateless JWT access tokens, and the usual mitigation?',
      options: [
        { id: 'a', text: 'Because a JWT is self-contained and verified without a DB lookup, it can\'t be revoked before it expires — a leaked or logged-out token stays valid until then. The usual fix is short-lived access tokens plus a longer-lived refresh token (often with server-side rotation/denylist) so the exposure window stays small', isCorrect: true },
        { id: 'b', text: 'A JWT must hit the database on every request to verify its signature, so the tradeoff is latency; the mitigation is to cache the user row in Redis keyed by the token', isCorrect: false },
        { id: 'c', text: 'A JWT can carry only a username and nothing else, so the tradeoff is lost context; the mitigation is to keep the real claims server-side and put just an id in the token', isCorrect: false },
        { id: 'd', text: 'A JWT is encrypted, so the tradeoff is that the server can\'t read its claims without the user\'s password; the mitigation is to email the user a decryption key at login', isCorrect: false },
      ],
      explanation: 'The whole point of a JWT is stateless verification: the server checks the signature with no session/DB lookup. The cost is revocation — there\'s no server record to delete, so a stolen token (or one held after "logout") works until `exp`. The standard pattern is a short access-token lifetime (minutes) plus a longer refresh token that mints new access tokens; revoking the refresh token (rotation + a server-side denylist) bounds the damage. A typical JWT is signed, not encrypted, so the server reads the claims fine — they\'re just not secret.',
      hints: [
        'Stateless ⇒ no server record ⇒ can\'t revoke early',
        'Leaked token valid until exp',
        'Short access + refresh-token rotation',
      ],
      tags: ['django', 'auth', 'jwt', 'token', 'security', 'advanced'],
      concepts: ['dj-auth-token-vs-session'],
    },
// --- custom authentication backend (faded -> cold) ---
{
      id: 'dj-auth-mastery-backend-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_AUTH_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the two required methods of a custom authentication backend (one verifies credentials, one re-loads a user from the session by id).',
      template: `class EmailOrUsernameBackend:
    def ___(self, request, username=None, password=None):
        try:
            user = User.objects.get(Q(username=username) | Q(email=username))
        except User.DoesNotExist:
            return None
        return user if user.check_password(password) else None

    def ___(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None`,
      blanks: ['authenticate', 'get_user'],
      solution: `class EmailOrUsernameBackend:
    def authenticate(self, request, username=None, password=None):
        try:
            user = User.objects.get(Q(username=username) | Q(email=username))
        except User.DoesNotExist:
            return None
        return user if user.check_password(password) else None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None`,
      explanation: 'A backend must implement `authenticate(self, request, **credentials)` — return a user or `None` — and `get_user(self, user_id)` — re-hydrate the user from the id stored in the session on each request. The `Q(username=...) | Q(email=...)` OR query is what lets one login field accept either identifier; `check_password` does the constant-time hash comparison.',
      hints: [
        'Two methods: one verifies creds, one loads by id',
        'authenticate(request, **creds) → user or None',
        'get_user(user_id) → user or None',
      ],
      tags: ['django', 'auth', 'authentication-backend', 'auth-backend', 'check_password', 'advanced'],
      concepts: ['dj-auth-token-vs-session'],
    },
{
      id: 'dj-auth-mastery-backend-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_AUTH_MASTERY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Implement a custom authentication backend \`EmailOrUsernameBackend\` so users can log in with EITHER their username or their email typed into the same login field. Provide both methods a backend requires:

  1. One that looks the user up by username-or-email (use a \`Q\`-object OR query), verifies the supplied password with the user's constant-time check, and returns the user or \`None\` (also return \`None\` if no user matches).
  2. One that re-loads a user by primary key for the session, returning \`None\` if the id is unknown.

  Use \`get_user_model()\` for the user model. (In settings you'd then add this backend's dotted path to \`AUTHENTICATION_BACKENDS\`.)`,
      starterCode: `from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()
`,
      testCases: [
        {
          input: 'login with username OR email + correct password',
          expectedOutput: 'authenticate() returns the user; get_user() re-loads by pk; both return None on miss',
          description: 'Custom backend implementing authenticate + get_user with a Q OR lookup',
        },
      ],
      solution: `from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()


class EmailOrUsernameBackend:
    def authenticate(self, request, username=None, password=None):
        try:
            user = User.objects.get(Q(username=username) | Q(email=username))
        except User.DoesNotExist:
            return None
        if user.check_password(password):
            return user
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None`,
      tieredHints: {
        apiSignature: 'user.check_password(raw_password) -> bool',
        skeleton: `class EmailOrUsernameBackend:
    def ____(self, request, username=None, password=None):
        try:
            user = User.objects.____(Q(username=username) | Q(email=username))
        except User.DoesNotExist:
            return None
        if user.____(password):
            return user
        return None

    def ____(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None`,
      },
      explanation: 'A custom backend is just a class with `authenticate(self, request, **credentials)` and `get_user(self, user_id)`. The `Q(username=...) | Q(email=...)` lookup is the crux — it accepts either identifier from one field. Always finish with `check_password` (constant-time) rather than comparing hashes directly, and return `None` (never raise) on any miss so `authenticate()` can fall through to the next backend. Register it by listing its dotted path in `AUTHENTICATION_BACKENDS`; `get_user` is what rebuilds `request.user` from the session id on every later request.',
      hints: [
        'Class with authenticate(request, **creds) + get_user(user_id)',
        'Q(username=...) | Q(email=...) accepts either identifier',
        'check_password for the compare; return None (don\'t raise) on miss',
      ],
      tags: ['django', 'auth', 'authentication-backend', 'auth-backend', 'get_user_model', 'advanced'],
      concepts: ['dj-auth-token-vs-session'],
    },
];
