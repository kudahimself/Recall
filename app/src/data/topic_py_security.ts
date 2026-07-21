/**
 * Topic.PY_SECURITY — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pySecurityCloze.ts (10), pySecurityParsons.ts (10), pySecurityPredictOutput.ts (10), pythonMasteryTier2Questions.ts (6)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_security_questions: Question[] = [
  {
      id: 'py-security-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the secure module name for generating tokens.',
      template: `import ___

token = ___.token_urlsafe(32)`,
      blanks: ['secrets', 'secrets'],
      solution:
        'import secrets\n\ntoken = secrets.token_urlsafe(32)',
      explanation:
        'secrets is the security-grade RNG module. random is predictable from a seed and never appropriate for tokens, passwords, or session IDs.',
      hints: ['Eight-letter module — not random.'],
      tags: ['security', 'secrets'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the hashlib algorithm name (modern, secure default) and the method that returns a hex string.',
      template: `import hashlib

h = hashlib.___(b"hello")
print(h.___())`,
      blanks: ['sha256', 'hexdigest'],
      solution:
        'import hashlib\n\nh = hashlib.sha256(b"hello")\nprint(h.hexdigest())',
      explanation:
        'sha256 is the modern default. .hexdigest() returns the hex string; .digest() returns raw bytes. MD5 and SHA-1 are broken for security.',
      hints: ['SHA-2 family, 256-bit; "hex" + "digest".'],
      tags: ['security', 'hashlib', 'sha256'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the constant-time comparison function for HMAC signatures.',
      template: `import hmac

if hmac.___(expected, received):
    print("ok")`,
      blanks: ['compare_digest'],
      solution: 'import hmac\n\nif hmac.compare_digest(expected, received):\n    print("ok")',
      explanation:
        'hmac.compare_digest runs in constant time regardless of where the first byte mismatches. Plain == short-circuits and leaks matching prefix length to a timing attacker.',
      hints: ['Snake-case: "compare" + "_digest".'],
      tags: ['security', 'hmac', 'timing-attack'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the password-hashing function name.',
      template: `import hashlib

digest = hashlib.___("sha256", password.encode(), salt, 200000)`,
      blanks: ['pbkdf2_hmac'],
      solution:
        'import hashlib\n\ndigest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 200000)',
      explanation:
        'pbkdf2_hmac is a key-derivation function with built-in iteration count — slows brute force. Plain sha256 is too fast for password hashing. For new code, prefer scrypt/argon2; pbkdf2 is the stdlib option.',
      hints: ['Snake-case: "pbkdf2" + "_hmac".'],
      tags: ['security', 'pbkdf2', 'password-hashing'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the secrets function that returns N raw random bytes (suitable as a salt).',
      template: `import secrets

salt = secrets.___(16)`,
      blanks: ['token_bytes'],
      solution: 'import secrets\n\nsalt = secrets.token_bytes(16)',
      explanation:
        'token_bytes(n) returns n raw bytes. token_hex(n) returns hex-encoded chars (str), token_urlsafe(n) returns base64url-encoded chars. PBKDF2 wants bytes for salt.',
      hints: ['Snake-case: "token" + "_bytes".'],
      tags: ['security', 'secrets', 'token_bytes'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the hmac call to sign a message — note the digestmod argument.',
      template: `import hmac
import hashlib

sig = hmac.new(key, message, ___).hexdigest()`,
      blanks: ['hashlib.sha256'],
      solution:
        'import hmac\nimport hashlib\n\nsig = hmac.new(key, message, hashlib.sha256).hexdigest()',
      explanation:
        'hmac.new requires a digestmod (the underlying hash). Passing the hashlib factory is canonical. Omitting it triggers a deprecation warning and uses an insecure default.',
      hints: ['hashlib.<algorithm>'],
      tags: ['security', 'hmac', 'digestmod'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the SQL placeholder for sqlite3 to prevent SQL injection.',
      template: `cur = conn.execute(
    "SELECT * FROM users WHERE name = ___",
    (user_input,),
)`,
      blanks: ['?'],
      solution:
        'cur = conn.execute(\n    "SELECT * FROM users WHERE name = ?",\n    (user_input,),\n)',
      explanation:
        'sqlite3 uses ? for positional placeholders. psycopg2/MySQLdb use %s. NEVER f-string user input into SQL — that is the canonical SQL injection vulnerability.',
      hints: ['Single character — sqlite\'s placeholder.'],
      tags: ['security', 'sql-injection', 'parameterized-query'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the secrets function that picks a random element from a sequence.',
      template: `import secrets

pick = secrets.___(["red", "green", "blue"])`,
      blanks: ['choice'],
      solution: 'import secrets\n\npick = secrets.choice(["red", "green", "blue"])',
      explanation:
        'secrets.choice mirrors random.choice but uses os.urandom-backed entropy. Use it for any pick that an attacker should not be able to predict.',
      hints: ['Same name as the random module\'s function.'],
      tags: ['security', 'secrets', 'choice'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the safe way to read a secret from an environment variable that returns None if missing (so you can raise a custom error).',
      template: `import os

api_key = os.environ.___("API_KEY")
if not api_key:
    raise RuntimeError("API_KEY is not set")`,
      blanks: ['get'],
      solution:
        'import os\n\napi_key = os.environ.get("API_KEY")\nif not api_key:\n    raise RuntimeError("API_KEY is not set")',
      explanation:
        'os.environ.get returns None on missing; os.environ["X"] raises KeyError. The .get-then-check pattern lets you produce a clearer, app-specific error message.',
      hints: ['Same name as dict.get.'],
      tags: ['security', 'env', 'secrets-management'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the secrets function that returns a random integer in [0, n).',
      template: `import secrets

n = secrets.___(1_000_000)`,
      blanks: ['randbelow'],
      solution: 'import secrets\n\nn = secrets.randbelow(1_000_000)',
      explanation:
        'secrets.randbelow(n) returns 0..n-1. Use it for OTP codes, secure random indices, etc. The random module\'s randint is NOT secure; secrets.randbelow is.',
      hints: ['Snake-case: "rand" + "below".'],
      tags: ['security', 'secrets', 'randbelow'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Generate a cryptographically-secure 32-byte URL-safe token.',
      correctOrder: [
        'import secrets',
        '',
        'token = secrets.token_urlsafe(32)',
        'print(token)',
      ],
      distractorLines: [
        'import random',
        'token = random.random()',
        'token = str(random.randint(0, 10**32))',
      ],
      solution:
        'import secrets\n\ntoken = secrets.token_urlsafe(32)\nprint(token)',
      explanation:
        'secrets is the stdlib module for security-grade randomness — backed by os.urandom. random is seeded from system time and predictable; never use it for tokens, passwords, or session IDs.',
      hints: ['Use the secrets module, not random.'],
      tags: ['security', 'secrets', 'tokens'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Compute the SHA-256 hex digest of a UTF-8 string.',
      correctOrder: [
        'import hashlib',
        '',
        'data = "hello"',
        'h = hashlib.sha256(data.encode("utf-8"))',
        'print(h.hexdigest())',
      ],
      distractorLines: [
        'h = hashlib.sha256(data)',
        'h = hashlib.md5(data.encode("utf-8"))',
        'print(h.digest())',
      ],
      solution:
        'import hashlib\n\ndata = "hello"\nh = hashlib.sha256(data.encode("utf-8"))\nprint(h.hexdigest())',
      explanation:
        'hashlib.sha256 takes BYTES, not a str — encode first. .hexdigest() returns the hex string; .digest() returns raw bytes. MD5 is broken for security but fine for non-crypto fingerprints.',
      hints: ['Encode str to bytes before hashing.'],
      tags: ['security', 'hashlib', 'sha256'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Compare two HMAC signatures in constant time to prevent timing attacks. Define the `expected` signature first, then the `received` one, then compare them and print `"ok"` on a match.',
      correctOrder: [
        'import hmac',
        '',
        'expected = "abc123"',
        'received = "abc123"',
        'if hmac.compare_digest(expected, received):',
        '    print("ok")',
      ],
      distractorLines: [
        'if expected == received:',
        'if hmac.equal(expected, received):',
        'if hash(expected) == hash(received):',
      ],
      solution:
        'import hmac\n\nexpected = "abc123"\nreceived = "abc123"\nif hmac.compare_digest(expected, received):\n    print("ok")',
      explanation:
        'hmac.compare_digest runs in constant time — the comparison takes the same time whether the first byte mismatches or the last byte does. Plain == short-circuits, leaking signature length and matching prefix length to a timing attacker.',
      hints: ['hmac.compare_digest, not ==.'],
      tags: ['security', 'hmac', 'timing-attack'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Hash a password with PBKDF2-HMAC-SHA256, using a fresh random 16-byte salt and 200000 iterations.',
      correctOrder: [
        'import hashlib',
        'import secrets',
        '',
        'password = "p@ssw0rd"',
        'salt = secrets.token_bytes(16)',
        'digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 200000)',
        'print(digest.hex())',
      ],
      distractorLines: [
        'salt = b"static-salt"',
        'digest = hashlib.sha256(password.encode()).digest()',
        'salt = secrets.token_urlsafe(16)',
      ],
      solution:
        'import hashlib\nimport secrets\n\npassword = "p@ssw0rd"\nsalt = secrets.token_bytes(16)\ndigest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 200000)\nprint(digest.hex())',
      explanation:
        'Password hashing needs three properties: per-user salt (defeats rainbow tables), key-stretching with high iteration count (defeats brute force), and a slow KDF. Plain SHA-256 is too fast. token_urlsafe returns str — pbkdf2_hmac needs bytes for salt.',
      hints: ['pbkdf2_hmac with bytes salt + high iteration count.'],
      tags: ['security', 'pbkdf2', 'password-hashing', 'salt'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Generate an HMAC-SHA256 signature of a message using a shared secret key.',
      correctOrder: [
        'import hmac',
        'import hashlib',
        '',
        'key = b"secret-key"',
        'message = b"order-42"',
        'sig = hmac.new(key, message, hashlib.sha256).hexdigest()',
        'print(sig)',
      ],
      distractorLines: [
        'sig = hashlib.sha256(message).hexdigest()',
        'sig = hmac.new(key, message).hexdigest()',
        'sig = hmac.sha256(key, message)',
      ],
      solution:
        'import hmac\nimport hashlib\n\nkey = b"secret-key"\nmessage = b"order-42"\nsig = hmac.new(key, message, hashlib.sha256).hexdigest()\nprint(sig)',
      explanation:
        'HMAC binds a message to a secret key. hmac.new requires the digestmod (hashlib.sha256) — omit it and you get a deprecation warning + insecure default. Plain sha256 of the message has no secret and provides no authentication.',
      hints: ['hmac.new(key, msg, hashlib.sha256).'],
      tags: ['security', 'hmac', 'sha256'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Pick a cryptographically-secure random element from a list of choices.',
      correctOrder: [
        'import secrets',
        '',
        'colors = ["red", "green", "blue"]',
        'pick = secrets.choice(colors)',
        'print(pick)',
      ],
      distractorLines: [
        'import random',
        'pick = random.choice(colors)',
        'pick = colors[secrets.token_bytes(1)[0] % len(colors)]',
      ],
      solution:
        'import secrets\n\ncolors = ["red", "green", "blue"]\npick = secrets.choice(colors)\nprint(pick)',
      explanation:
        'secrets.choice is the security-grade analogue of random.choice. Use it for security-relevant picks (challenge tokens, password chars, A/B-test salts that must not be guessable).',
      hints: ['secrets.choice mirrors random.choice but is secure.'],
      tags: ['security', 'secrets', 'choice'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Verify a stored salted password hash against a provided password.',
      correctOrder: [
        'import hashlib',
        'import hmac',
        '',
        'def verify(password: str, salt: bytes, expected: bytes) -> bool:',
        '    candidate = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 200000)',
        '    return hmac.compare_digest(candidate, expected)',
      ],
      distractorLines: [
        '    return candidate == expected',
        '    candidate = hashlib.sha256(password.encode()).digest()',
        '    return hmac.compare_digest(password, expected)',
      ],
      solution:
        'import hashlib\nimport hmac\n\ndef verify(password: str, salt: bytes, expected: bytes) -> bool:\n    candidate = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 200000)\n    return hmac.compare_digest(candidate, expected)',
      explanation:
        'Re-derive the candidate hash with the SAME salt + iteration count, then compare in constant time. Plain == leaks how many leading bytes match through timing.',
      hints: ['Same salt + iterations, then compare_digest.'],
      tags: ['security', 'pbkdf2', 'compare_digest'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Generate a 6-digit numeric one-time code for SMS auth (no leading-zero loss).',
      correctOrder: [
        'import secrets',
        '',
        'code = f"{secrets.randbelow(1_000_000):06d}"',
        'print(code)',
      ],
      distractorLines: [
        'code = str(secrets.randbelow(1_000_000))',
        'code = secrets.token_hex(3)',
        'code = str(random.randint(0, 999999))',
      ],
      solution:
        'import secrets\n\ncode = f"{secrets.randbelow(1_000_000):06d}"\nprint(code)',
      explanation:
        'secrets.randbelow(n) returns 0..n-1 securely. Without :06d formatting, codes like 42 lose leading zeros. token_hex returns hex chars (0-9, a-f) — not pure digits.',
      hints: [':06d preserves leading zeros for display.'],
      tags: ['security', 'secrets', 'otp'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a parameterized SQL query — never f-string user input into SQL.',
      correctOrder: [
        'import sqlite3',
        '',
        'conn = sqlite3.connect(":memory:")',
        'user_input = "alice"',
        'cur = conn.execute("SELECT * FROM users WHERE name = ?", (user_input,))',
        'print(cur.fetchall())',
      ],
      distractorLines: [
        'cur = conn.execute(f"SELECT * FROM users WHERE name = \'{user_input}\'")',
        'cur = conn.execute("SELECT * FROM users WHERE name = " + user_input)',
        'cur = conn.execute("SELECT * FROM users WHERE name = %s" % user_input)',
      ],
      solution:
        'import sqlite3\n\nconn = sqlite3.connect(":memory:")\nuser_input = "alice"\ncur = conn.execute("SELECT * FROM users WHERE name = ?", (user_input,))\nprint(cur.fetchall())',
      explanation:
        'Parameter binding (?) sends the value separately from the SQL — the database never parses it as SQL. f-string / + / % concatenation produces classic SQL injection. The trailing comma makes (user_input,) a 1-tuple.',
      hints: ['Pass values via the params tuple, not into the SQL string.'],
      tags: ['security', 'sql-injection', 'parameterized-query'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Read a secret from an environment variable, raising clearly if it is missing.',
      correctOrder: [
        'import os',
        '',
        'api_key = os.environ.get("API_KEY")',
        'if not api_key:',
        '    raise RuntimeError("API_KEY is not set")',
      ],
      distractorLines: [
        'api_key = "sk-live-12345"',
        'api_key = os.environ["API_KEY"]',
        'api_key = open(".env").read()',
      ],
      solution:
        'import os\n\napi_key = os.environ.get("API_KEY")\nif not api_key:\n    raise RuntimeError("API_KEY is not set")',
      explanation:
        'Hard-coded secrets leak via git/logs. os.environ.get returns None on missing — explicit None-check produces a clearer error than a KeyError. Reading raw .env files bypasses python-dotenv\'s expansion and quoting rules.',
      hints: ['os.environ.get + explicit check beats hard-coded.'],
      tags: ['security', 'secrets', 'env'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-mcq-digest-sizes',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      question: 'You call `.hexdigest()` on a `hashlib.sha256(...)` hash. How long is the returned hex string, and how do the common algorithms compare?',
      options: [
        { id: 'a', text: 'SHA-256 → 64 hex chars (256 bits = 32 bytes, ×2 for hex). For reference MD5 → 32, SHA-1 → 40, SHA-512 → 128; HMAC matches its underlying hash, so HMAC-SHA256 is also 64.', isCorrect: true },
        { id: 'b', text: 'SHA-256 → 32 hex chars (one hex character per byte of the 32-byte digest). For reference MD5 → 16, SHA-1 → 20, SHA-512 → 64; HMAC returns half of its underlying hash size.', isCorrect: false },
        { id: 'c', text: 'SHA-256 → 256 hex chars (one character per bit of the digest). For reference MD5 → 128, SHA-1 → 160, SHA-512 → 512; HMAC doubles its underlying hash size to fit the key.', isCorrect: false },
        { id: 'd', text: 'It varies with the input: a longer message produces a longer hex digest, so len(h) grows with the size of the data you hash — short strings give short digests, big files give big ones.', isCorrect: false },
      ],
      explanation:
        'A hash has a FIXED output size regardless of input length. SHA-256 is 256 bits = 32 bytes; .hexdigest() encodes each byte as 2 hex characters → 64 chars (.digest() returns the 32 raw bytes). Hex lengths: MD5 32, SHA-1 40, SHA-256 64, SHA-512 128. HMAC produces the same size as its underlying hash, so HMAC-SHA256 is 64 too. (MD5/SHA-1 are broken for security — fine only for non-crypto checksums.)',
      hints: [
        'Hash output is fixed-length, independent of input size',
        'hexdigest = 2 hex chars per byte; sha256 = 32 bytes',
        'HMAC matches its underlying hash size',
      ],
      tags: ['security', 'hashlib', 'sha256', 'hmac'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import hashlib

a = hashlib.sha256(b"hello").hexdigest()
b = hashlib.sha256(b"hello").hexdigest()
print(a == b)`,
      expectedOutput: `True`,
      explanation:
        'Hash functions are deterministic — same input always produces the same output. That is what makes them useful for integrity checks, but also why password hashing requires a salt (otherwise two users with the same password get the same hash).',
      hints: ['Hashes are deterministic.'],
      tags: ['security', 'hashlib', 'determinism'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import hmac

a = hmac.compare_digest("abc", "abc")
b = hmac.compare_digest("abc", "abd")
c = hmac.compare_digest("abc", "abcd")
print(a, b, c)`,
      expectedOutput: `True False False`,
      explanation:
        'compare_digest returns True only on exact match, False otherwise (including on length mismatch). The point is not the return value — it is that the comparison takes constant time, defeating timing attacks that infer matching prefix length.',
      hints: ['Length mismatch → False, just like value mismatch.'],
      tags: ['security', 'hmac', 'compare_digest'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import secrets

t = secrets.token_hex(16)
print(len(t))`,
      expectedOutput: `32`,
      explanation:
        'token_hex(n) returns n random BYTES encoded as hex → 2n characters. token_urlsafe(n) returns n bytes base64-encoded → roughly 4n/3 characters. token_bytes(n) returns raw bytes (length n).',
      hints: ['Hex doubles the byte count.'],
      tags: ['security', 'secrets', 'token_hex'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import hashlib

salt1 = b"saltA"
salt2 = b"saltB"
d1 = hashlib.pbkdf2_hmac("sha256", b"pw", salt1, 1000)
d2 = hashlib.pbkdf2_hmac("sha256", b"pw", salt2, 1000)
print(d1 == d2)`,
      expectedOutput: `False`,
      explanation:
        'PBKDF2 mixes the salt into the derivation, so the same password with different salts yields different hashes. This is the entire defense against rainbow tables — an attacker cannot precompute hashes without your per-user salt.',
      hints: ['Different salt → different output, even with same password.'],
      tags: ['security', 'pbkdf2', 'salt'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import secrets

n = secrets.randbelow(10)
print(0 <= n < 10)`,
      expectedOutput: `True`,
      explanation:
        'secrets.randbelow(n) returns a value in [0, n) — half-open interval, same convention as range(n). It NEVER returns n itself.',
      hints: ['randbelow(n) is half-open: 0..n-1.'],
      tags: ['security', 'secrets', 'randbelow'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import hashlib

m = hashlib.sha256()
m.update(b"hel")
m.update(b"lo")
a = m.hexdigest()
b = hashlib.sha256(b"hello").hexdigest()
print(a == b)`,
      expectedOutput: `True`,
      explanation:
        'Hash objects accept incremental updates. The result is identical to hashing the concatenation in one shot — useful for streaming large files without loading them all into memory.',
      hints: ['Incremental update is equivalent to one-shot.'],
      tags: ['security', 'hashlib', 'streaming'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import hashlib

h = hashlib.sha256(b"hi").digest()
print(type(h).__name__, len(h))`,
      expectedOutput: `bytes 32`,
      explanation:
        '.digest() returns raw bytes (length = digest size in bytes). .hexdigest() returns the hex-encoded str (twice as long). For storage/transmission, hex or base64 are typical; raw bytes are useful when feeding another crypto function.',
      hints: ['digest() = bytes; hexdigest() = str.'],
      tags: ['security', 'hashlib', 'digest'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import secrets

a = secrets.token_bytes(8)
b = secrets.token_bytes(8)
print(a == b)`,
      expectedOutput: `False`,
      explanation:
        'token_bytes returns fresh randomness on each call — overwhelmingly unlikely (probability 1 in 2^64) to repeat. Two consecutive calls almost certainly differ. This is the property that makes secrets safe for tokens.',
      hints: ['Two random 8-byte values almost certainly differ.'],
      tags: ['security', 'secrets', 'randomness'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      question: 'Why should you use `secrets.token_hex(32)` instead of `random.randint` when generating a session token or password-reset code?',
      options: [
        { id: 'a', text: 'No reason — they are equivalent', isCorrect: false },
        { id: 'b', text: '`random` is a pseudo-random generator seeded from system time and is predictable — fine for games, fatal for security. `secrets` draws from the OS cryptographic RNG (`/dev/urandom` / `CryptGenRandom`), which is the standard source for unguessable tokens.', isCorrect: true },
        { id: 'c', text: '`secrets` is faster', isCorrect: false },
        { id: 'd', text: '`random` is deprecated', isCorrect: false },
      ],
      explanation: 'Use `secrets` for ANYTHING an attacker could benefit from guessing: session IDs, CSRF tokens, password reset links, API keys, nonces. The `random` module is a Mersenne Twister — its internal state can be reconstructed from ~624 consecutive outputs. `secrets.token_hex(n)` returns 2n hex chars (n random bytes); `secrets.token_urlsafe(n)` returns URL-safe base64. Both are cryptographically strong.',
      hints: [
        '`secrets` uses the OS CSPRNG; `random` uses Mersenne Twister',
        'Rule: any token an attacker gains from guessing → `secrets`',
        '`token_urlsafe(32)` is the standard session-token recipe',
      ],
      tags: ['security', 'secrets', 'random', 'CSPRNG'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Compute the SHA-256 hex digest of the string `"hello world"` using `hashlib`. Hash the string\'s UTF-8 bytes with `hashlib.sha256` and print the resulting hex digest. Expected output: `b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9`.',
      starterCode: `# Compute the SHA-256 hex digest of "hello world" using hashlib:
# hash its UTF-8 bytes and print the resulting hex digest.
`,
      testCases: [
        {
          input: 'hashlib.sha256 hex digest',
          expectedOutput: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
          description: 'SHA-256 produces 64 hex chars',
        },
      ],
      solution: `import hashlib

digest = hashlib.sha256("hello world".encode("utf-8")).hexdigest()
print(digest)`,
      explanation: 'hashlib wraps the OS/OpenSSL hash primitives: `md5`, `sha1`, `sha256`, `sha512`, `blake2b/s`. `.hexdigest()` returns the familiar hex string; `.digest()` returns raw bytes. Use SHA-256+ for anything where collision resistance matters; MD5 and SHA1 are broken for security (fine for checksums, not for signatures). NEVER hash passwords with SHA-256 — use `bcrypt`, `argon2-cffi`, or `scrypt`. Plain hashes are instant to brute-force.',
      hints: [
        '.encode("utf-8") to get bytes from str',
        '.hexdigest() for the hex string; .digest() for raw bytes',
        'For passwords: bcrypt/argon2, NOT sha256',
      ],
      tieredHints: {
        apiSignature: 'hashlib.sha256(string=b"", *, usedforsecurity=True) -> hash object',
        skeleton: `import hashlib

digest = hashlib.____("hello world".____("utf-8")).____()
print(digest)`,
      },
      tags: ['hashlib', 'sha256', 'hashing'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Generate cryptographically-secure random values using the `secrets` stdlib module (never use `random` for security). First produce a URL-safe session token with 32 random bytes and print it — you\'ll get a ~43-character URL-safe base64 string. Then produce a 6-digit numeric verification code by picking a secure integer below `1_000_000` and print it formatted as a zero-padded 6-digit string.',
      starterCode: `import secrets
  `,
      testCases: [
        {
          input: 'token + 6-digit code',
          expectedOutput: '<43-char urlsafe token>\n<6-digit zero-padded code>',
          description: 'token_urlsafe + randbelow',
        },
      ],
      solution: `import secrets

token = secrets.token_urlsafe(32)
print(token)

code = secrets.randbelow(1_000_000)
print(f"{code:06d}")`,
      explanation: 'Use-case recipes: `token_urlsafe(n)` → session tokens, password-reset URLs (URL-safe base64). `token_hex(n)` → opaque tokens for headers (hex). `token_bytes(n)` → raw bytes. `randbelow(n)` → integer in `[0, n)` — perfect for short codes (6-digit SMS OTPs). Never build these with `random` or a millisecond timestamp.',
      hints: [
        'token_urlsafe(n) → base64 URL-safe',
        'token_hex(n) → hex',
        'randbelow(n) → secure integer in [0, n)',
      ],
      tieredHints: {
        apiSignature: 'secrets.token_urlsafe(nbytes=None) -> str',
        skeleton: `import secrets

token = ____.____(32)
print(token)

code = secrets.____(1_000_000)
print(f"{code:06d}")`,
      },
      tags: ['secrets', 'token_urlsafe', 'randbelow', 'tokens'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Sign and verify a webhook payload with HMAC-SHA256 using the `hmac` and `hashlib` stdlib modules. Declare a bytes secret `b"shared-secret"` and a bytes payload `b\'{"order":1}\'`. Compute an HMAC signature using SHA-256 as the digest algorithm, render it as a hex string, and print it. Then verify: compute the same HMAC a second time (simulating the receiver), and compare it against the first using the `hmac` CONSTANT-TIME comparison function (never use `==` on secrets — it leaks information through timing). Print the verification result (expect `True`).',
      starterCode: `import hmac
import hashlib
`,
      testCases: [
        {
          input: 'hmac-sha256 sign and verify',
          expectedOutput: '<64-char sha256 hex>\nTrue',
          description: 'HMAC sign + constant-time compare',
        },
      ],
      solution: `import hmac
import hashlib

secret = b"shared-secret"
payload = b'{"order":1}'

signature = hmac.new(secret, payload, hashlib.sha256).hexdigest()
print(signature)

# Verification (both sides compute HMAC over the same payload with the shared secret)
expected = hmac.new(secret, payload, hashlib.sha256).hexdigest()
print(hmac.compare_digest(expected, signature))`,
      explanation: 'HMAC lets you prove a message was produced by someone who knows the shared secret. Use it for webhook signatures (GitHub, Stripe, Slack all ship `X-Hub-Signature`-style headers), cookie integrity, API request signing. Two gotchas: (1) both payload and secret must be bytes; (2) ALWAYS use `hmac.compare_digest` — `==` on hex strings is vulnerable to timing attacks where an attacker can infer the signature byte-by-byte from response timing.',
      hints: [
        'hmac.new(secret_bytes, message_bytes, hashlib.sha256)',
        'Always hmac.compare_digest for the comparison (timing-safe)',
        'Shared secret → both sides can sign/verify; use asymmetric (RSA/ECDSA) for non-repudiation',
      ],
      tieredHints: {
        apiSignature: 'hmac.new(key, msg=None, digestmod="") -> hmac object',
        skeleton: `import hmac
import hashlib

secret = b"shared-secret"
payload = b'{"order":1}'

signature = ____.____(secret, ____, hashlib.____).____()
print(signature)

expected = ____.____(secret, payload, ____.sha256).____()
print(____.____(expected, ____))`,
      },
      tags: ['security', 'hmac', 'webhooks', 'timing-attack'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-5',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Generate two kinds of UUID with the `uuid` stdlib module. First produce a RANDOM UUID (v4) and print it as a string. Then produce a DETERMINISTIC UUID (v5 — SHA-1 over a namespace + name, so the same inputs always yield the same output) using the built-in DNS namespace constant and the name `"example.com"`, and print it as a string. The second value should always be `cfbff0d1-9375-5685-968a-48ce8b50e3e4` regardless of when or where you run it.',
      starterCode: `import uuid
  `,
      testCases: [
        {
          input: 'uuid4 random + uuid5 deterministic',
          expectedOutput: '<random uuid>\ncfbff0d1-9375-5685-968a-48ce8b50e3e4',
          description: 'uuid5 for the given namespace+name is always the same',
        },
      ],
      solution: `import uuid

print(str(uuid.uuid4()))

ns = uuid.NAMESPACE_DNS
print(str(uuid.uuid5(ns, "example.com")))`,
      explanation: 'UUID4 = random, unique with overwhelming probability — standard for database primary keys, request IDs, correlation IDs. UUID5 (SHA-1-based) + NAMESPACE = deterministic: the same inputs always produce the same UUID, useful for idempotent keys derived from external IDs. Prefer UUID over incrementing integers for external-facing IDs (doesn\'t leak row count, globally unique). Note: UUIDs are not ordered — for time-sortable IDs look at ULID or UUIDv7 (PEP draft).',
      hints: [
        'uuid.uuid4() → random',
        'uuid.uuid5(ns, name) → deterministic from (ns, name)',
        'NAMESPACE_DNS / NAMESPACE_URL / NAMESPACE_OID / NAMESPACE_X500',
      ],
      tieredHints: {
        apiSignature: 'uuid.uuid4() -> UUID',
        skeleton: `import uuid

print(str(uuid.____()))

ns = uuid.____
print(str(uuid.____(ns, "example.com")))`,
      },
      tags: ['uuid', 'identifiers', 'namespace'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-6',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Round-trip a binary blob through base64 so it is safe to put in JSON. Declare `data = b"\\x00\\x01\\x02hello"`. Using the `base64` stdlib module, encode the bytes to their base64 form, then decode the result from bytes to an ASCII string and print it (expect `AAECaGVsbG8=`). Decode the base64 string back to raw bytes and print whether it equals the original (expect `True`). Note: base64 is an ENCODING, not encryption — anyone can reverse it.',
      starterCode: `import base64
  `,
      testCases: [
        {
          input: 'b64encode + b64decode round-trip',
          expectedOutput: 'AAECaGVsbG8=\nTrue',
          description: 'base64 round-trips bytes through an ASCII string',
        },
      ],
      solution: `import base64

data = b"\\x00\\x01\\x02hello"
encoded = base64.b64encode(data).decode("ascii")
print(encoded)

decoded = base64.b64decode(encoded)
print(decoded == data)`,
      explanation: 'base64 turns bytes into ASCII text so you can put binary in JSON, environment variables, URLs, or email. Output is ~4/3 the input size. `b64encode` returns bytes — `.decode("ascii")` gets a str. `urlsafe_b64encode` / `urlsafe_b64decode` use `-` and `_` instead of `+` and `/` (safe in URLs and filenames). Common pitfall: base64 is NOT encryption — anyone can decode it instantly. It only encodes.',
      hints: [
        'b64encode → bytes; .decode("ascii") to get a str',
        'urlsafe_b64encode avoids `+` and `/`',
        'Base64 is encoding, not encryption — anyone can decode it',
      ],
      tieredHints: {
        apiSignature: 'base64.b64encode(s, altchars=None) -> bytes',
        skeleton: `import base64

data = b"\\x00\\x01\\x02hello"
encoded = ____.____(____).____("ascii")
print(encoded)

decoded = ____.____(____)
____(____ == data)`,
      },
      tags: ['base64', 'encoding', 'binary'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-parsons-11',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Generate a random (version 4) UUID and print it.',
      correctOrder: [
        'import uuid',
        '',
        'new_id = uuid.uuid4()',
        'print(new_id)',
      ],
      distractorLines: [
        'new_id = uuid.uuid4',
        'new_id = uuid.uuid5("example.com")',
        'import uuid4',
      ],
      solution:
        'import uuid\n\nnew_id = uuid.uuid4()\nprint(new_id)',
      explanation:
        'uuid.uuid4() returns a random UUID — the standard choice for primary keys, request IDs, and correlation IDs. Note the parentheses: uuid.uuid4 without the call is the function object, not an ID. uuid5 needs a namespace AND a name (it is deterministic, not random).',
      hints: ['uuid.uuid4() — note the call parentheses.'],
      tags: ['security', 'uuid', 'uuid4'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-cloze-11',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the uuid function that returns a random (version 4) UUID.',
      template: `import uuid

request_id = uuid.___()
print(request_id)`,
      blanks: ['uuid4'],
      solution: 'import uuid\n\nrequest_id = uuid.uuid4()\nprint(request_id)',
      explanation:
        'uuid4 is the random variant — unique with overwhelming probability and the usual pick for IDs. uuid1 leaks the host MAC + timestamp; uuid5/uuid3 are deterministic (derived from a namespace + name).',
      hints: ['Random variant — the version number is 4.'],
      tags: ['security', 'uuid', 'uuid4'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-predict-11',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import uuid

a = uuid.uuid5(uuid.NAMESPACE_DNS, "example.com")
b = uuid.uuid5(uuid.NAMESPACE_DNS, "example.com")
print(a == b)`,
      expectedOutput: `True`,
      explanation:
        'uuid5 is DETERMINISTIC — it hashes (namespace, name), so the same inputs always yield the same UUID (great for idempotent keys). uuid4, by contrast, is random and two calls would almost never be equal.',
      hints: ['uuid5 is deterministic from its (namespace, name) inputs.'],
      tags: ['security', 'uuid', 'uuid5'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-parsons-12',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Base64-encode some bytes and print the result as an ASCII string.',
      correctOrder: [
        'import base64',
        '',
        'data = b"hello"',
        'encoded = base64.b64encode(data)',
        'print(encoded.decode("ascii"))',
      ],
      distractorLines: [
        'encoded = base64.b64decode(data)',
        'encoded = data.encode("base64")',
        'print(encoded)',
      ],
      solution:
        'import base64\n\ndata = b"hello"\nencoded = base64.b64encode(data)\nprint(encoded.decode("ascii"))',
      explanation:
        'b64encode takes bytes and returns bytes — .decode("ascii") gives a clean str (printing the raw bytes would show the b\'...\' wrapper). b64decode is the reverse direction; "encode(\'base64\')" is Python-2-only and raises in Python 3.',
      hints: ['b64encode returns bytes — decode to ascii for a clean string.'],
      tags: ['security', 'base64', 'encoding'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-cloze-12',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the base64 functions to encode bytes and then decode them back.',
      template: `import base64

encoded = base64.___(b"hi")
decoded = base64.___(encoded)
print(decoded)`,
      blanks: ['b64encode', 'b64decode'],
      solution:
        'import base64\n\nencoded = base64.b64encode(b"hi")\ndecoded = base64.b64decode(encoded)\nprint(decoded)',
      explanation:
        'b64encode turns bytes into ASCII-safe base64 (for JSON/URLs/env vars); b64decode reverses it exactly. Base64 is an encoding, not encryption — anyone can decode it.',
      hints: ['"b64" + encode / decode.'],
      tags: ['security', 'base64', 'encoding'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-security-predict-12',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SECURITY,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import base64

data = b"hi there"
restored = base64.b64decode(base64.b64encode(data))
print(restored == data)`,
      expectedOutput: `True`,
      explanation:
        'Base64 is a lossless, reversible encoding: decoding what you encoded returns the exact original bytes. It is NOT encryption — it provides no secrecy, only a text-safe representation of binary.',
      hints: ['Encode then decode round-trips to the original bytes.'],
      tags: ['security', 'base64', 'round-trip'],
      concepts: ['py-security-primitives'],
    },
];
