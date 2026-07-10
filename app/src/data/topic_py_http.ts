/**
 * Topic.PY_HTTP — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pythonMasteryTier1Questions.ts (6)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_http_questions: Question[] = [
  {
      id: 'py-http-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      question: 'What does `response.raise_for_status()` do when using the `requests` library?',
      options: [
        { id: 'a', text: 'Prints the status code', isCorrect: false },
        { id: 'b', text: 'Raises `requests.HTTPError` if the status is 4xx or 5xx; does nothing on 2xx/3xx. Use it before `.json()` to turn silent API failures into loud exceptions.', isCorrect: true },
        { id: 'c', text: 'Logs the response body at ERROR level', isCorrect: false },
        { id: 'd', text: 'Retries the request automatically', isCorrect: false },
      ],
      explanation: 'By default `requests.get(...)` does NOT raise on a 500 — you get a Response object with `.status_code == 500`. Calling `.json()` on an error page may crash with a JSONDecodeError. `raise_for_status()` is the idiomatic gate: call it right after the request, then proceed safely. Pairs with `.json()` and `.text`.',
      hints: [
        'Call raise_for_status() right after the request',
        'Only raises on 4xx/5xx; 2xx/3xx pass through silently',
        'Catches an HTTPError you can except on',
      ],
      tags: ['requests', 'http', 'error-handling', 'basics'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-http-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Make a GET request with the `requests` library to `"https://httpbin.org/get"`, assign the response to `r`. Gate on HTTP errors by calling the response method that raises on 4xx/5xx status codes, then parse the body as JSON using the response\'s JSON method, and print the value at key `"url"` (expect the same URL back).',
      starterCode: `import requests
  `,
      testCases: [
        {
          input: 'GET + json parse',
          expectedOutput: 'https://httpbin.org/get',
          description: 'requests.get returns a Response with .json()',
        },
      ],
      solution: `import requests

r = requests.get("https://httpbin.org/get")
r.raise_for_status()
data = r.json()
print(data["url"])`,
      explanation: '`requests.get(url)` returns a `Response`. Always call `raise_for_status()` before trusting the body. `.json()` parses JSON content; `.text` is the raw string; `.content` is bytes. For production APIs use a `requests.Session()` for connection pooling and persistent cookies — building a new connection per call is wasteful.',
      hints: [
        'r = requests.get(url)',
        'r.raise_for_status() to surface HTTP errors',
        'r.json() parses JSON bodies',
      ],
      tags: ['requests', 'GET', 'json', 'basics'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-http-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Make a POST request with `requests` to `"https://httpbin.org/post"` carrying a JSON body with `name` `"Alice"` and `age` `30`, using a 10-second timeout. Pass the body via the kwarg that auto-serialises AND sets `Content-Type: application/json` (NOT the form-encoded kwarg). Gate on HTTP errors, then print the server\'s echo of the payload at key `"json"` (should match the dict you sent).',
      starterCode: `import requests
  `,
      testCases: [
        {
          input: 'POST with json= kwarg',
          expectedOutput: '{"name": "Alice", "age": 30}',
          description: 'json= auto-sets Content-Type and serialises',
        },
      ],
      solution: `import requests

r = requests.post(
    "https://httpbin.org/post",
    json={"name": "Alice", "age": 30},
    timeout=10,
)
r.raise_for_status()
print(r.json()["json"])`,
      explanation: '`json=payload` is the right way to send JSON — requests handles `dumps` and the header. `data=payload` sends form-encoded (`application/x-www-form-urlencoded`). Always pass `timeout=` — the default is None (wait forever), which will freeze your service on a flaky upstream.',
      hints: [
        'json= auto-serialises and sets Content-Type',
        'ALWAYS pass timeout — default is forever',
        'Use data= only for form-encoded bodies',
      ],
      tags: ['requests', 'POST', 'json', 'timeout'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-http-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use a `requests.Session` inside a `with` block to share a persistent `Authorization: Bearer TOKEN_123` header AND connection pooling across multiple calls. Inside the block, configure that auth header on the session once, then make two GETs to `"https://httpbin.org/headers"` and `"https://httpbin.org/bearer"` (gating on HTTP errors for each). Parse the second response\'s JSON and print the value at key `"token"` (expect `TOKEN_123`).',
      starterCode: `import requests
  `,
      testCases: [
        {
          input: 'Session with shared Authorization header',
          expectedOutput: 'TOKEN_123',
          description: 'headers persist across calls via Session',
        },
      ],
      solution: `import requests

with requests.Session() as session:
    session.headers.update({"Authorization": "Bearer TOKEN_123"})
    r1 = session.get("https://httpbin.org/headers")
    r1.raise_for_status()
    r2 = session.get("https://httpbin.org/bearer")
    r2.raise_for_status()
    print(r2.json()["token"])`,
      explanation: 'A `Session` reuses the underlying TCP connection (huge latency win on HTTPS), persists cookies, and lets you set headers once. Use it for any code that makes more than one request to the same host. The `with` block closes the pool cleanly. For async/HTTP2, use `httpx.AsyncClient` with the same shape.',
      hints: [
        'with requests.Session() as session: ...',
        'session.headers.update({...}) applies to every call',
        'Reuses connections and cookies',
      ],
      tags: ['requests', 'Session', 'auth', 'headers'],
      concepts: ['dj-auth-token-vs-session'],
    },
  {
      id: 'py-http-5',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Defensively handle HTTP failures. Attempt a GET to `"https://httpbin.org/status/500"` with a 5-second timeout, then gate on HTTP errors. Wrap the whole thing in `try/except` with THREE separate except clauses. Catch `requests.HTTPError as e` and print `"http error: "` followed by the response status code (expect `http error: 500` for this URL). Also catch `requests.Timeout` and print `"timeout"`, and `requests.ConnectionError` and print `"connection refused"` — even though this URL triggers the HTTPError path, show the full defensive structure.',
      starterCode: `import requests
  `,
      testCases: [
        {
          input: 'HTTPError 500 path',
          expectedOutput: 'http error: 500',
          description: 'HTTPError carries the Response with .status_code',
        },
      ],
      solution: `import requests

try:
    r = requests.get("https://httpbin.org/status/500", timeout=5)
    r.raise_for_status()
except requests.HTTPError as e:
    print(f"http error: {e.response.status_code}")
except requests.Timeout:
    print("timeout")
except requests.ConnectionError:
    print("connection refused")`,
      explanation: 'Three categories of requests failures: (1) network-level `ConnectionError` (host unreachable), (2) `Timeout` (took too long), (3) `HTTPError` (server answered, but with 4xx/5xx). All three inherit from `requests.RequestException` so you can catch that as a root. In production always handle at least Timeout + HTTPError — the other flows through to caller crashes.',
      hints: [
        'raise_for_status() raises HTTPError on 4xx/5xx',
        'Catch Timeout and ConnectionError for network-level failures',
        'All inherit from requests.RequestException',
      ],
      tags: ['requests', 'error-handling', 'HTTPError', 'Timeout'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-http-6',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      question: 'What does the `httpx` library offer that `requests` does not?',
      options: [
        { id: 'a', text: 'Nothing — they are identical', isCorrect: false },
        { id: 'b', text: 'A near-identical API to `requests` PLUS native `async`/`await` support via `AsyncClient`, HTTP/2 out of the box, and connection pooling by default. Ideal when an async codebase needs HTTP without bringing in aiohttp.', isCorrect: true },
        { id: 'c', text: 'Only works with REST APIs, not SOAP', isCorrect: false },
        { id: 'd', text: 'Auto-retries every request 3 times', isCorrect: false },
      ],
      explanation: '`httpx.Client()` ≈ `requests.Session()`. `httpx.AsyncClient()` gives you `await client.get(...)` — impossible with `requests` (sync-only). If your service is FastAPI or asyncio-based, httpx is the natural client. For sync-only scripts and tools, `requests` is still fine and has a larger ecosystem.',
      hints: [
        'Sync API mirrors requests almost 1:1',
        'AsyncClient gives `await` support',
        'HTTP/2 support is built in',
      ],
      tags: ['httpx', 'async', 'requests', 'comparison'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-http-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble a safe GET: fetch a URL with requests, gate on HTTP errors, then print the parsed JSON body.',
      correctOrder: [
        'import requests',
        'r = requests.get("https://api.example.com/data")',
        'r.raise_for_status()',
        'print(r.json())',
      ],
      distractorLines: [
        'r = requests.fetch("https://api.example.com/data")',
        'print(r.body())',
      ],
      solution:
        'import requests\nr = requests.get("https://api.example.com/data")\nr.raise_for_status()\nprint(r.json())',
      explanation:
        'requests.get returns a Response (there is no requests.fetch). raise_for_status() turns a 4xx/5xx into an exception before you trust the body. The parsed body is r.json() (there is no .body()); r.text is the raw string.',
      hints: ['get → raise_for_status → json(). No .fetch, no .body().'],
      tags: ['requests', 'GET', 'raise_for_status'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-http-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble a POST that sends a JSON body with a 10-second timeout, then gates on HTTP errors. Use the kwarg that serialises to JSON and sets the Content-Type header.',
      correctOrder: [
        'import requests',
        'r = requests.post("https://api.example.com/users", json={"name": "Alice"}, timeout=10)',
        'r.raise_for_status()',
      ],
      distractorLines: [
        'r = requests.post("https://api.example.com/users", data={"name": "Alice"}, timeout=10)',
        'r = requests.post("https://api.example.com/users", json={"name": "Alice"})',
      ],
      solution:
        'import requests\nr = requests.post("https://api.example.com/users", json={"name": "Alice"}, timeout=10)\nr.raise_for_status()',
      explanation:
        'json={...} serialises the dict and sets Content-Type: application/json; data={...} would send form-encoded instead. Always pass timeout= — the default is None (wait forever), which can hang your service on a slow upstream.',
      hints: ['json= (not data=) for JSON, and always set timeout=.'],
      tags: ['requests', 'POST', 'json', 'timeout'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-http-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble code that opens a requests Session in a with-block, sets a shared Authorization header on it, makes a GET THROUGH THE SESSION so the header is applied, then gates on HTTP errors by calling the response method that raises on a 4xx/5xx status.',
      correctOrder: [
        'import requests',
        'with requests.Session() as session:',
        '    session.headers.update({"Authorization": "Bearer TOK"})',
        '    r = session.get("https://api.example.com/me")',
        '    r.raise_for_status()',
      ],
      distractorLines: [
        '    session.headers.append({"Authorization": "Bearer TOK"})',
        '    r = requests.get("https://api.example.com/me")',
      ],
      solution:
        'import requests\nwith requests.Session() as session:\n    session.headers.update({"Authorization": "Bearer TOK"})\n    r = session.get("https://api.example.com/me")\n    r.raise_for_status()',
      explanation:
        'session.headers is a dict-like updated with .update (not .append). The request must go through session.get to inherit the shared header and connection pool — calling the module-level requests.get instead would send NO Authorization header.',
      hints: ['headers.update(...), then session.get (not requests.get).'],
      tags: ['requests', 'Session', 'headers', 'auth'],
      concepts: ['dj-auth-token-vs-session'],
    },
  {
      id: 'py-http-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the Response method that raises on a 4xx/5xx status code.',
      template: `import requests

r = requests.get("https://api.example.com")
r.___()`,
      blanks: ['raise_for_status'],
      solution:
        'import requests\n\nr = requests.get("https://api.example.com")\nr.raise_for_status()',
      explanation:
        'raise_for_status() raises requests.HTTPError on 4xx/5xx and does nothing on 2xx/3xx. Call it right after the request so server errors become loud exceptions instead of a Response you mistakenly treat as success.',
      hints: ['"raise" + "_for_" + "status".'],
      tags: ['requests', 'raise_for_status', 'error-handling'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-http-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the kwarg that sends the dict as a JSON body (auto-setting Content-Type), not as form data.',
      template: `import requests

r = requests.post("https://api.example.com", ___={"name": "Alice"})`,
      blanks: ['json'],
      solution:
        'import requests\n\nr = requests.post("https://api.example.com", json={"name": "Alice"})',
      explanation:
        'json={...} serialises the body to JSON and sets Content-Type: application/json. The data={...} kwarg instead sends application/x-www-form-urlencoded — a common mistake when an API expects JSON.',
      hints: ['The kwarg is the same word as the format: json=.'],
      tags: ['requests', 'POST', 'json'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-http-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the kwarg that caps how long the request waits before giving up.',
      template: `import requests

r = requests.get("https://api.example.com", ___=10)`,
      blanks: ['timeout'],
      solution:
        'import requests\n\nr = requests.get("https://api.example.com", timeout=10)',
      explanation:
        'timeout=10 raises requests.Timeout after 10 seconds. The default is None — wait forever — so omitting it lets one slow upstream freeze your whole service. Always set a timeout on outbound calls.',
      hints: ['Seven letters; the cap on how long to wait.'],
      tags: ['requests', 'timeout', 'reliability'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-http-7',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Make a GET request with `requests` to `"https://httpbin.org/get"`, passing the query parameters `q="recall"` and `page="2"` via the kwarg that builds the query string for you (NOT manual string concatenation). Gate on HTTP errors, parse the JSON body, and from the echoed `"args"` dict print the value at `"q"` then the value at `"page"` (expect `recall` then `2`, on separate lines).',
      starterCode: `import requests
  `,
      testCases: [
        {
          input: 'GET with params=',
          expectedOutput: 'recall\n2',
          description: 'params= builds the query string; httpbin echoes it under "args"',
        },
      ],
      solution: `import requests

r = requests.get("https://httpbin.org/get", params={"q": "recall", "page": "2"})
r.raise_for_status()
args = r.json()["args"]
print(args["q"])
print(args["page"])`,
      explanation: '`params={...}` URL-encodes and appends the query string (`?q=recall&page=2`) — never hand-build it (you would miss escaping of spaces, `&`, etc.). httpbin echoes the parsed query back under the `"args"` key. Values come back as strings.',
      hints: [
        'params={...} builds and encodes the query string',
        'httpbin echoes the parsed query under "args"',
        'No manual ?key=value concatenation',
      ],
      tags: ['requests', 'GET', 'params', 'query-string'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-http-8',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Make a GET request with `requests` to `"https://httpbin.org/status/200"`. WITHOUT calling `raise_for_status()`, inspect the response directly: print the response\'s integer status code, then on the next line print its boolean "was this a success" attribute (the one that is `True` for any 2xx/3xx and `False` for 4xx/5xx). Expect `200` then `True`.',
      starterCode: `import requests
  `,
      testCases: [
        {
          input: 'inspect status_code and ok',
          expectedOutput: '200\nTrue',
          description: '.status_code is the int; .ok is True when status_code < 400',
        },
      ],
      solution: `import requests

r = requests.get("https://httpbin.org/status/200")
print(r.status_code)
print(r.ok)`,
      explanation: '`r.status_code` is the integer code; `r.ok` is `True` when `status_code < 400` (so it stays `True` on 3xx redirects too, unlike `raise_for_status()` which only trips on 4xx/5xx). `r.ok` is a quick boolean gate for when you do not want an exception.',
      hints: [
        '.status_code → the int code',
        '.ok → True when status_code < 400',
        'Neither needs raise_for_status() to read',
      ],
      tags: ['requests', 'status_code', 'ok', 'response'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-http-9',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Send a PUT request with `requests` to `"https://httpbin.org/put"` carrying a JSON body with a single key `title` set to `"Draft"`, using the kwarg that serialises to JSON. Gate on HTTP errors, then print the server\'s echo of the body found under the `"json"` key (expect `{\'title\': \'Draft\'}`).',
      starterCode: `import requests
  `,
      testCases: [
        {
          input: 'PUT with json= body',
          expectedOutput: "{'title': 'Draft'}",
          description: 'requests.put issues PUT; httpbin echoes the body under "json"',
        },
      ],
      solution: `import requests

r = requests.put("https://httpbin.org/put", json={"title": "Draft"})
r.raise_for_status()
print(r.json()["json"])`,
      explanation: '`requests.put` maps to the HTTP PUT verb (replace the whole resource). The `json=` kwarg behaves exactly as on POST — it serialises the dict and sets `Content-Type: application/json`. httpbin echoes the parsed body under `"json"`, and printing that dict shows Python repr (single quotes). PUT is idempotent: sending it twice leaves the resource in the same state.',
      hints: [
        'requests.put for the PUT verb',
        'json= serialises the body (same as POST)',
        'httpbin echoes it under "json"',
      ],
      tags: ['requests', 'PUT', 'json', 'idempotent'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-http-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the `requests` function for a PARTIAL update (PATCH), and the kwarg that sends the dict as a JSON body.',
      template: `import requests

r = requests.___("https://httpbin.org/patch", ___={"title": "Edited"})
r.raise_for_status()`,
      blanks: ['patch', 'json'],
      solution:
        'import requests\n\nr = requests.patch("https://httpbin.org/patch", json={"title": "Edited"})\nr.raise_for_status()',
      explanation:
        '`requests.patch` issues an HTTP PATCH — a *partial* update (change some fields) versus PUT which replaces the whole resource. The `json=` kwarg serialises the body and sets `Content-Type: application/json`.',
      hints: ['PATCH = partial update; the method name matches the verb', 'json= for a JSON body'],
      tags: ['requests', 'PATCH', 'json'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-http-10',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Using the `httpx` library (NOT `requests`), open a synchronous client in a `with` block, make a GET request to `"https://httpbin.org/get"`, gate on HTTP errors with the same method name `requests` uses, parse the JSON body, and print the value at key `"url"` (expect the same URL back).',
      starterCode: `import httpx
  `,
      testCases: [
        {
          input: 'httpx.Client GET',
          expectedOutput: 'https://httpbin.org/get',
          description: 'httpx.Client mirrors requests.Session 1:1',
        },
      ],
      solution: `import httpx

with httpx.Client() as client:
    r = client.get("https://httpbin.org/get")
    r.raise_for_status()
    print(r.json()["url"])`,
      explanation: '`httpx.Client()` is httpx\'s synchronous client — it mirrors `requests.Session()` almost 1:1 (`get`/`post`, `raise_for_status()`, `.json()`), with connection pooling by default and HTTP/2 available. Use the `with` block so the connection pool closes cleanly. The async sibling is `httpx.AsyncClient`.',
      hints: [
        'httpx.Client() ≈ requests.Session()',
        'Same .get / .raise_for_status() / .json() API',
        'Use a with block to close the pool',
      ],
      tags: ['httpx', 'Client', 'GET', 'json'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-http-12',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Upload a file with `requests` via a multipart/form-data POST to `"https://httpbin.org/post"`. Use the kwarg for file uploads, passing one file under the form field `document` as the tuple `("notes.txt", b"hello")` (filename, bytes). Gate on HTTP errors, then print the echoed content of that field: `r.json()["files"]["document"]` (expect `hello`).',
      starterCode: `import requests
  `,
      testCases: [
        {
          input: 'multipart upload via files=',
          expectedOutput: 'hello',
          description: 'files= sends multipart/form-data; httpbin echoes under "files"',
        },
      ],
      solution: `import requests

r = requests.post(
    "https://httpbin.org/post",
    files={"document": ("notes.txt", b"hello")},
)
r.raise_for_status()
print(r.json()["files"]["document"])`,
      explanation: '`files={...}` switches the request to `multipart/form-data` and handles the encoding. Each value can be a bare bytes/file object or a `(filename, content)` tuple (optionally `(filename, content, content_type)`). Do NOT also pass `json=` — a multipart body and a JSON body are mutually exclusive. httpbin echoes uploaded files under the `"files"` key.',
      hints: [
        'files={...} → multipart/form-data',
        'Value tuple is (filename, content)',
        'httpbin echoes uploads under "files"',
      ],
      tags: ['requests', 'POST', 'files', 'multipart'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-http-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble a streaming download that never holds the whole body in memory. In this order: import requests; GET "https://httpbin.org/bytes/1024" with streaming enabled; gate on HTTP errors; initialise a running total to 0; loop over the body in 256-byte chunks adding each chunk\'s LENGTH to the total; then print the total. (Stream the bytes — do not download the whole body at once, and count each chunk\'s length, not the chunk itself.)',
      correctOrder: [
        'import requests',
        'r = requests.get("https://httpbin.org/bytes/1024", stream=True)',
        'r.raise_for_status()',
        'total = 0',
        'for chunk in r.iter_content(chunk_size=256):',
        '    total += len(chunk)',
        'print(total)',
      ],
      distractorLines: [
        'r = requests.get("https://httpbin.org/bytes/1024")',
        '    total += chunk',
      ],
      solution:
        'import requests\nr = requests.get("https://httpbin.org/bytes/1024", stream=True)\nr.raise_for_status()\ntotal = 0\nfor chunk in r.iter_content(chunk_size=256):\n    total += len(chunk)\nprint(total)',
      explanation:
        'stream=True defers downloading the body — you pull it lazily with iter_content(chunk_size=...), keeping memory flat no matter how large the response. Count len(chunk) (the bytes received), not the chunk object (adding bytes to an int would raise). Dropping stream=True (the distractor GET) would buffer the entire body up front.',
      hints: [
        'Order: get(stream=True) → raise_for_status → total=0 → loop → print',
        'Sum len(chunk), not chunk itself',
        'stream=True + iter_content keeps memory flat',
      ],
      tags: ['requests', 'stream', 'iter_content', 'download'],
    },
  {
      id: 'py-http-13',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Download bytes without loading the whole body into memory. GET `"https://httpbin.org/bytes/1024"` with `requests`, enabling streaming via the kwarg that defers downloading the body. Iterate the body in chunks of 256 bytes using the response\'s chunk-iteration method, summing the length of each chunk into a running total. Print the total number of bytes received (expect `1024`).',
      starterCode: `import requests
  `,
      testCases: [
        {
          input: 'streamed download chunk sum',
          expectedOutput: '1024',
          description: 'stream=True + iter_content(chunk_size=256)',
        },
      ],
      solution: `import requests

r = requests.get("https://httpbin.org/bytes/1024", stream=True)
r.raise_for_status()
total = 0
for chunk in r.iter_content(chunk_size=256):
    total += len(chunk)
print(total)`,
      explanation: '`stream=True` tells requests NOT to download the body immediately — you pull it lazily with `iter_content(chunk_size=...)`, keeping memory flat for large files (you never hold the whole response at once). Without `stream=True`, touching `.content` would buffer the entire body. Pair streaming with a `with` block (or `r.close()`) so the connection is released.',
      hints: [
        'stream=True defers the body download',
        'iter_content(chunk_size=N) yields bytes chunks',
        'Sum len(chunk) for the byte total',
      ],
      tags: ['requests', 'stream', 'iter_content', 'download'],
    },
  {
      id: 'py-http-14',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      question: 'In HTTP, an *idempotent* method leaves the server in the same state whether you send the request once or many times. Which statement is correct — and why does it matter for automatic retries?',
      options: [
        { id: 'a', text: 'GET, PUT and DELETE are idempotent but POST is not — so a client may safely auto-retry the first three after a timeout, while blindly retrying a POST risks creating duplicate resources.', isCorrect: true },
        { id: 'b', text: 'All of GET, POST, PUT and DELETE are idempotent, so any request can be retried any number of times without ever changing the final outcome on the server side.', isCorrect: false },
        { id: 'c', text: 'Only GET is idempotent because it is the one read method; PUT and DELETE mutate data, so retrying any of PUT, DELETE or POST after a failure is equally unsafe.', isCorrect: false },
        { id: 'd', text: 'Idempotency is purely a caching concern controlled by response headers and has no bearing on whether a client may retry a failed request after a timeout.', isCorrect: false },
      ],
      explanation: 'GET is safe (read-only); PUT replaces a resource and DELETE removes it — repeating either lands the server in the same final state, so both are idempotent. POST typically creates a NEW resource each time, so retrying after a timeout can duplicate it (make POST safe with an idempotency key). This is exactly why retry policies auto-retry idempotent methods by default and treat POST with caution.',
      hints: [
        'Read methods are always safe; think which writes land in the same final state',
        'Replacing/deleting twice = same result; creating twice = duplicates',
        'Retry policies key off idempotency',
      ],
      tags: ['http', 'idempotency', 'methods', 'retry'],
    },
  {
      id: 'py-http-15',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      question: 'A teammate "fixes" an SSL certificate-verification error from `requests` by passing `verify=False` on every call. Why is this dangerous, and what is the correct fix?',
      options: [
        { id: 'a', text: '`verify=False` disables TLS certificate validation, so the client trusts any certificate — including a man-in-the-middle\'s. The fix is to point `verify=` at the correct CA bundle (or repair the trust store), keeping verification on.', isCorrect: true },
        { id: 'b', text: '`verify=False` only turns off redirect following, so responses may be truncated. The fix is to re-enable redirects by also passing `allow_redirects=True` on each request you make.', isCorrect: false },
        { id: 'c', text: '`verify=False` makes requests skip response decompression, returning raw gzip bytes. The fix is to set the `Accept-Encoding` header so the server returns an uncompressed body.', isCorrect: false },
        { id: 'd', text: '`verify=False` is completely safe and is the documented production default. The only downside is a one-time warning that you silence with `urllib3.disable_warnings()`.', isCorrect: false },
      ],
      explanation: 'TLS verification is what proves you are actually talking to the host you dialed. `verify=False` turns that off, so anyone able to intercept traffic can present a forged certificate and you would never know — it defeats the point of HTTPS. The real cause is usually a missing or custom CA; fix it with `verify="/path/to/ca-bundle.pem"` (or install the CA into the system trust store), keeping verification ON.',
      hints: [
        'TLS verification proves host identity',
        'Turning it off enables man-in-the-middle attacks',
        'Point verify= at the right CA bundle instead',
      ],
      tags: ['requests', 'tls', 'security', 'verify'],
    },
  {
      id: 'py-http-16',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a resilient client that automatically retries transient failures (no hand-rolled retry loop). Configure a `Session` whose `HTTPAdapter` uses a urllib3 `Retry` policy — up to 3 retries, `backoff_factor=0.5`, retrying on status codes 429/500/502/503/504 and honouring the server\'s `Retry-After` header — mounted on both the `"http://"` and `"https://"` prefixes. Then make a GET through the session to `"https://httpbin.org/get"` with a 10-second timeout, gate on HTTP errors, and print the JSON body\'s `"url"`.',
      starterCode: `import requests
  `,
      testCases: [
        {
          input: 'resilient session with native retry',
          expectedOutput: 'https://httpbin.org/get',
          description: 'HTTPAdapter + urllib3 Retry mounted on a Session',
        },
      ],
      solution: `import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

session = requests.Session()
retry = Retry(
    total=3,
    backoff_factor=0.5,
    status_forcelist=[429, 500, 502, 503, 504],
    respect_retry_after_header=True,
)
adapter = HTTPAdapter(max_retries=retry)
session.mount("http://", adapter)
session.mount("https://", adapter)

r = session.get("https://httpbin.org/get", timeout=10)
r.raise_for_status()
print(r.json()["url"])`,
      explanation: 'This is the *declarative, transport-level* retry: a `urllib3.Retry` policy (`total` attempts, exponential `backoff_factor`, the `status_forcelist` to retry on, and `respect_retry_after_header` so a 429/503 `Retry-After` is obeyed) wrapped in an `HTTPAdapter` and mounted on the session. Every request through the session then retries automatically — no manual loop. Contrast the hand-rolled `for`-loop with `time.sleep` backoff in the capstone: same goal, but this version pushes the logic into the HTTP layer where it belongs. `backoff_factor=0.5` waits ~0s, 0.5s, 1s, 2s between tries. (`Retry` imports from `urllib3.util.retry`, or in modern requests is re-exported from `requests.adapters`.)',
      hints: [
        'Session + HTTPAdapter(max_retries=Retry(...)) + mount on both schemes',
        'Retry(total, backoff_factor, status_forcelist, respect_retry_after_header)',
        'Mount on "http://" and "https://" so all requests inherit it',
      ],
      tags: ['requests', 'Session', 'HTTPAdapter', 'Retry', 'backoff', 'resilience'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-http-retry-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the three pieces that wire automatic retries onto a requests Session: the urllib3 policy class, the adapter class that carries it, and the Session method that attaches the adapter to a URL prefix.',
      template: `import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

retry = ___(total=3, backoff_factor=0.5, status_forcelist=[429, 500, 502, 503, 504])
adapter = ___(max_retries=retry)
session = requests.Session()
session.___("https://", adapter)`,
      blanks: ['Retry', 'HTTPAdapter', 'mount'],
      solution:
        'import requests\nfrom requests.adapters import HTTPAdapter\nfrom urllib3.util.retry import Retry\n\nretry = Retry(total=3, backoff_factor=0.5, status_forcelist=[429, 500, 502, 503, 504])\nadapter = HTTPAdapter(max_retries=retry)\nsession = requests.Session()\nsession.mount("https://", adapter)',
      explanation:
        'A `Retry` policy (urllib3) describes WHEN/how often to retry; an `HTTPAdapter` is the transport that carries that policy; `session.mount(prefix, adapter)` attaches it so every request to a matching URL inherits the retries. Together they replace any manual retry loop. Mount on both `"http://"` and `"https://"` to cover all traffic.',
      hints: [
        'Policy = Retry, transport = HTTPAdapter, attach = mount',
        'mount(prefix, adapter) wires it to a URL scheme',
      ],
      tags: ['requests', 'Retry', 'HTTPAdapter', 'mount', 'resilience'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-http-retry-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      question: 'You want every request made through a `requests.Session` to retry automatically on transient errors (503, 429). How do the three moving pieces fit together?',
      options: [
        { id: 'a', text: 'A urllib3 `Retry` object holds the policy (how many tries, backoff, which status codes); an `HTTPAdapter(max_retries=retry)` carries that policy; `session.mount(prefix, adapter)` attaches it so every matching request inherits the retries.', isCorrect: true },
        { id: 'b', text: 'Pass `retries=3` straight to `session.get(url, retries=3)`; requests retries the call itself whenever that argument is supplied, so no adapter or policy object is needed at all.', isCorrect: false },
        { id: 'c', text: 'Assign `session.max_retries = 3` on the Session; it then applies that count to every outgoing request automatically, without any adapter or mounting step.', isCorrect: false },
        { id: 'd', text: 'Wrap each `session.get(...)` in a `try/except` and call it again on failure; `Retry` and `HTTPAdapter` exist only for connection pooling and have nothing to do with retrying.', isCorrect: false },
      ],
      explanation:
        'Transport-level retries are declarative: `Retry` (urllib3) = the policy, `HTTPAdapter(max_retries=retry)` = the transport that carries it, `session.mount("https://", adapter)` = attaching it to a URL scheme. Mount on both `"http://"` and `"https://"` to cover all traffic. `session.get` has no `retries=` kwarg and the Session has no `max_retries` attribute — and a hand-rolled try/except is exactly the manual loop this machinery replaces.',
      hints: [
        'Three roles: policy (Retry), transport (HTTPAdapter), attach (mount)',
        'session.get has no retries= kwarg; the Session has no max_retries attribute',
      ],
      tags: ['requests', 'Retry', 'HTTPAdapter', 'mount', 'resilience'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-http-retry-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the urllib3 retry-policy class and the parameter that lists which HTTP status codes should trigger a retry.',
      template: `from urllib3.util.retry import Retry

retry = ___(
    total=3,
    backoff_factor=0.5,
    ___=[429, 500, 502, 503, 504],
    respect_retry_after_header=True,
)`,
      blanks: ['Retry', 'status_forcelist'],
      solution:
        'from urllib3.util.retry import Retry\n\nretry = Retry(\n    total=3,\n    backoff_factor=0.5,\n    status_forcelist=[429, 500, 502, 503, 504],\n    respect_retry_after_header=True,\n)',
      explanation:
        '`Retry` is the urllib3 policy object. `total` caps the attempts, `backoff_factor` sets the exponential wait (0.5 → ~0s, 0.5s, 1s, 2s), `status_forcelist` is the list of response codes that count as retryable, and `respect_retry_after_header=True` honours a server\'s `Retry-After` header on 429/503. This is the policy ONLY — it still needs an adapter to take effect.',
      hints: ['The policy class is Retry; the code list is status_forcelist.'],
      tags: ['requests', 'Retry', 'status_forcelist', 'backoff', 'resilience'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-http-retry-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'The retry policy already exists. Fill in the adapter class that carries it and the Session method that attaches it to each URL scheme.',
      template: `import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

retry = Retry(total=3, backoff_factor=0.5, status_forcelist=[500, 502, 503, 504])
adapter = ___(max_retries=retry)
session = requests.Session()
session.___("https://", adapter)
session.___("http://", adapter)`,
      blanks: ['HTTPAdapter', 'mount', 'mount'],
      solution:
        'import requests\nfrom requests.adapters import HTTPAdapter\nfrom urllib3.util.retry import Retry\n\nretry = Retry(total=3, backoff_factor=0.5, status_forcelist=[500, 502, 503, 504])\nadapter = HTTPAdapter(max_retries=retry)\nsession = requests.Session()\nsession.mount("https://", adapter)\nsession.mount("http://", adapter)',
      explanation:
        '`HTTPAdapter` (from `requests.adapters`) is the transport that carries the `Retry` policy via `max_retries=`. `session.mount(prefix, adapter)` binds the adapter to every request whose URL starts with that prefix — mount on both `"https://"` and `"http://"` so all traffic is covered.',
      hints: ['Transport = HTTPAdapter; attach with mount(prefix, adapter).'],
      tags: ['requests', 'HTTPAdapter', 'mount', 'adapters', 'resilience'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-http-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_HTTP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the httpx SYNCHRONOUS client class, and the method that raises on a 4xx/5xx status.',
      template: `import httpx

with httpx.___() as client:
    r = client.get("https://api.example.com")
    r.___()
    print(r.json())`,
      blanks: ['Client', 'raise_for_status'],
      solution:
        'import httpx\n\nwith httpx.Client() as client:\n    r = client.get("https://api.example.com")\n    r.raise_for_status()\n    print(r.json())',
      explanation:
        'httpx.Client() is the synchronous client — a drop-in counterpart to requests.Session(), with the same .get / .raise_for_status() / .json() API and connection pooling by default. The async sibling is httpx.AsyncClient().',
      hints: ['The sync class is Client (AsyncClient is the async one)', 'Same raise_for_status() gate as requests'],
      tags: ['httpx', 'Client', 'raise_for_status'],
      concepts: ['py-json-serialization'],
    },
];
