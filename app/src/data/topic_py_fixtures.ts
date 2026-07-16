/**
 * Topic.PY_FIXTURES — pytest fixtures: what/why, request-by-name, return vs
 * yield/teardown, scope, autouse, built-ins (tmp_path, capsys), conftest,
 * parametrized fixtures, and a fixture+parametrize+raises capstone.
 *
 * Split out of the former monolithic Topic.PY_TESTING so fixtures ramp
 * beginner→intermediate→advanced independently of mocking and the pytest core.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_fixtures_questions: Question[] = [
  // ===================== BEGINNER =====================
  {
    id: 'py-fix-whatis-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    question: 'In pytest, what is a fixture and why would you use one?',
    options: [
      { id: 'a', text: 'A reusable setup function pytest injects into any test that names it as a parameter', isCorrect: true },
      { id: 'b', text: 'A special kind of assert statement that automatically retries a flaky test until it finally passes', isCorrect: false },
      { id: 'c', text: 'A configuration file that tells pytest which folders it should search for test modules', isCorrect: false },
      { id: 'd', text: 'A command-line flag that re-runs only the tests that failed on the previous run', isCorrect: false },
    ],
    explanation: 'A fixture provides reusable setup (and optional teardown) — a database connection, a temp directory, sample data, a configured object. You declare it with @pytest.fixture; a test then "requests" it by adding a parameter whose name matches the fixture. pytest calls the fixture and passes its return value in. Fixtures keep setup DRY and isolate each test.',
    hints: [
      'Reusable setup, injected by parameter name',
      'Declared with @pytest.fixture',
    ],
    tags: ['pytest', 'fixture', 'basics'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-fix-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the decorator that declares a fixture, and the test parameter that requests it.',
    template: `import pytest

@pytest.___
def sample_user():
    return {"key": "Ada"}

def test_name(___):
    assert sample_user["key"] == "Ada"`,
    blanks: ['fixture', 'sample_user'],
    solution:
      'import pytest\n\n@pytest.fixture\ndef sample_user():\n    return {"key": "Ada"}\n\ndef test_name(sample_user):\n    assert sample_user["key"] == "Ada"',
    explanation:
      'Declare a fixture with @pytest.fixture (no parentheses needed for the default scope). A test receives the fixture by declaring a parameter whose NAME matches the fixture function — pytest wires them together by name and passes in the return value.',
    hints: ['Decorator is `fixture`; the parameter name must equal the fixture name.'],
    tags: ['pytest', 'fixture', 'injection'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-testing-parsons-4',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question:
      'Define a pytest fixture that creates a fresh dict for each test.',
    correctOrder: [
      'import pytest',
      '',
      '@pytest.fixture',
      'def empty_dict():',
      '    return {}',
      '',
      'def test_uses_dict(empty_dict):',
      '    empty_dict["x"] = 1',
      '    assert empty_dict == {"x": 1}',
    ],
    distractorLines: [
      '@pytest.fixture()',
      'def test_uses_dict():',
      '    empty_dict = {}',
    ],
    solution:
      'import pytest\n\n@pytest.fixture\ndef empty_dict():\n    return {}\n\ndef test_uses_dict(empty_dict):\n    empty_dict["x"] = 1\n    assert empty_dict == {"x": 1}',
    explanation:
      'A fixture is declared with @pytest.fixture (no parens needed for default scope). Tests request fixtures by NAME via parameter — pytest matches fixture names to function parameters automatically. Each test gets a fresh result by default.',
    hints: ['@pytest.fixture; tests receive it by parameter name.'],
    tags: ['testing', 'fixture'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-fix-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'pytest runs the tests top-to-bottom (use `pytest -s` to see prints). What does this print?',
    code: `import pytest

@pytest.fixture
def items():
    return []

def test_a(items):
    items.append(1)
    print(items)

def test_b(items):
    items.append(2)
    print(items)`,
    expectedOutput: `[1]
[2]`,
    explanation:
      'The default fixture scope is "function", so pytest rebuilds the fixture for EVERY test. test_a gets a fresh empty list and prints [1]; test_b also gets a brand-new empty list (not test_a\'s) and prints [2]. If the fixture used a wider scope (e.g. scope="module"), both tests would share one list and you\'d see [1] then [1, 2].',
    hints: ['Function-scope fixtures are rebuilt per test — no shared state.'],
    tags: ['pytest', 'fixture', 'scope', 'isolation'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-fix-simple-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Write a pytest fixture named `greeting` that returns the string `"hello"`. Then write a test `test_greeting` that receives the fixture by parameter and asserts it equals `"hello"`.',
    starterCode: `import pytest
# Define a fixture greeting() returning "hello"
# Define test_greeting(greeting) asserting it equals "hello"
`,
    testCases: [
      {
        input: 'fixture + test',
        expectedOutput: 'test_greeting passes using the injected fixture',
        description: 'Fixture returns a value; test requests it by name',
      },
    ],
    solution: `import pytest

@pytest.fixture
def greeting():
    return "hello"

def test_greeting(greeting):
    assert greeting == "hello"`,
    explanation: 'The fixture function returns a value; any test that declares a parameter named `greeting` receives that value. This is dependency injection by name — no imports, no setUp method, no manual call. pytest builds the fixture fresh for each test by default.',
    hints: [
      '@pytest.fixture above a function that returns the value',
      'Request it by adding a parameter with the same name',
    ],
    tags: ['pytest', 'fixture', 'basics'],
    concepts: ['py-test-isolation'],
  },

  // ===================== INTERMEDIATE =====================
  {
    id: 'py-testing-parsons-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question:
      'Define a fixture with yield to add teardown after the test runs.',
    correctOrder: [
      'import pytest',
      '',
      '@pytest.fixture',
      'def db():',
      '    conn = open_connection()',
      '    yield conn',
      '    conn.close()',
    ],
    distractorLines: [
      '    return conn',
      '@pytest.fixture(autouse=True)',
      '    finally:',
    ],
    solution:
      'import pytest\n\n@pytest.fixture\ndef db():\n    conn = open_connection()\n    yield conn\n    conn.close()',
    explanation:
      'A fixture that yields acts as a generator: code BEFORE yield is setup, the yielded value is what the test receives, code AFTER yield is teardown. This is the canonical pattern for cleanup. With return, you have no place to put teardown.',
    hints: ['yield separates setup from teardown — like @contextmanager.'],
    tags: ['testing', 'fixture', 'teardown'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-fix-scope-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the kwarg that controls how often a fixture is rebuilt, and the value for "once per file".',
    template: `import pytest

@pytest.fixture(___="module")
def db_conn():
    return connect()`,
    blanks: ['scope'],
    solution: 'import pytest\n\n@pytest.fixture(scope="module")\ndef db_conn():\n    return connect()',
    explanation:
      'scope controls how often the fixture is rebuilt: "function" (default, once per test), "class", "module" (once per file), "package", "session" (once per run). Wider scopes save setup cost but risk sharing mutable state across tests.',
    hints: ['Kwarg name is the noun for "how wide a range applies".'],
    tags: ['pytest', 'fixture', 'scope'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-test-fixture-scope',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Define a pytest fixture named `expensive_setup` with a scope that causes it to run ONCE per module (not once per test). The fixture body should print `"SETUP"` and return `{"id": 1}`. Then define two tests, `test_a` and `test_b`, that each take the fixture as a parameter and assert the returned dict\'s `"id"` equals `1`. When the module runs, `SETUP` must print only ONCE across both tests.',
    starterCode: `import pytest
  `,
    testCases: [
      {
        input: 'module-scoped fixture runs once',
        expectedOutput: 'SETUP printed once, both tests pass',
        description: 'scope="module" = shared across tests in the same module',
      },
    ],
    solution: `import pytest

@pytest.fixture(scope="module")
def expensive_setup():
    print("SETUP")
    return {"id": 1}

def test_a(expensive_setup):
    assert expensive_setup["id"] == 1

def test_b(expensive_setup):
    assert expensive_setup["id"] == 1`,
    explanation: 'Fixture scopes: `"function"` (default — once per test), `"class"` (once per test class), `"module"` (once per file), `"package"` (once per package), `"session"` (once per pytest run). Use wider scopes for expensive setup (Docker containers, DB migrations, cached HTTP responses) — but beware of test isolation bleed: fixtures that return mutable state at a wider scope can let one test\'s mutation affect the next.',
    hints: [
      'scope="function" (default) / "class" / "module" / "session"',
      'Wider scope = less setup cost, more risk of test bleed',
      'Never mutate a wider-scoped fixture in one test that another test reads',
    ],
    tags: ['pytest', 'fixture', 'scope'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-fix-autouse-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the kwarg that applies a fixture to every test without it being requested by parameter.',
    template: `import pytest

@pytest.fixture(___=True)
def reset_state():
    state.clear()
    yield`,
    blanks: ['autouse'],
    solution: 'import pytest\n\n@pytest.fixture(autouse=True)\ndef reset_state():\n    state.clear()\n    yield',
    explanation:
      'autouse=True runs the fixture for every test in its scope automatically — tests do not need to name it as a parameter. Use sparingly since it makes setup implicit and harder to trace.',
    hints: ['Snake-case: "auto" + "use".'],
    tags: ['pytest', 'fixture', 'autouse'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-test-autouse',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Declare a module-level dict `counter = {"n": 0}`. Define a pytest fixture `reset_counter` marked so it applies to EVERY test in the module automatically (no need for tests to declare it as a parameter) — its body must reset `counter["n"] = 0` and then yield control. Define `test_increment` (taking no parameters) that increments `counter["n"]` by 1 and asserts it equals `1`. Re-running the test a second time must still pass because the fixture resets the counter before each invocation.',
    starterCode: `import pytest
  `,
    testCases: [
      {
        input: 'autouse=True applies to every test',
        expectedOutput: 'reset_counter runs before each test, no explicit injection',
        description: 'autouse fixtures need no arg mention',
      },
    ],
    solution: `import pytest

counter = {"n": 0}

@pytest.fixture(autouse=True)
def reset_counter():
    counter["n"] = 0
    yield

def test_increment():
    counter["n"] += 1
    assert counter["n"] == 1`,
    explanation: '`autouse=True` applies the fixture to every test in its scope without the test needing to declare it as a parameter. Use sparingly — implicit setup makes tests harder to read. Good cases: reset a global cache, rotate a log handler, clear a singleton, enter a global feature flag. Pair with `conftest.py` to make an autouse fixture apply to every test in a directory tree.',
    hints: [
      'autouse=True applies without explicit parameter injection',
      'Use sparingly — hidden setup hurts readability',
      'Put in conftest.py to apply across a directory',
    ],
    tags: ['pytest', 'fixture', 'autouse'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-fix-tmppath-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: "Fill in pytest's built-in fixture name for a unique per-test pathlib.Path temp directory.",
    template: `def test_writes(___):
    f = ___ / "out.txt"
    f.write_text("x")
    assert f.read_text() == "x"`,
    blanks: ['tmp_path', 'tmp_path'],
    solution: 'def test_writes(tmp_path):\n    f = tmp_path / "out.txt"\n    f.write_text("x")\n    assert f.read_text() == "x"',
    explanation:
      'tmp_path is a built-in fixture — no import or definition needed, just request it by parameter name. It is a pathlib.Path to a fresh temp directory created per test, so file-based tests never collide.',
    hints: ['Snake-case: "tmp" + "_path" — same name in both blanks.'],
    tags: ['pytest', 'fixture', 'tmp_path', 'builtin'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-fix-tmppath-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'pytest provides a built-in `tmp_path` fixture — a unique temporary `pathlib.Path` directory, fresh per test. Write `test_writes_file` that takes `tmp_path`, writes the text `"data"` to a file `report.txt` inside it, reads the file back, and asserts the contents equal `"data"`.',
    starterCode: `# test_writes_file(tmp_path): write "data" to report.txt under tmp_path, read it back, assert
`,
    testCases: [
      {
        input: 'tmp_path built-in fixture',
        expectedOutput: 'file written and read back equals "data"',
        description: 'tmp_path is a pathlib.Path unique to each test',
      },
    ],
    solution: `def test_writes_file(tmp_path):
    target = tmp_path / "report.txt"
    target.write_text("data")
    assert target.read_text() == "data"
# OR
def test_writes_file(tmp_path):
    p = tmp_path / "report.txt"
    with open(p, "w") as f:
        f.write("data")
    with open(p) as f:
        assert f.read() == "data"`,
    explanation: '`tmp_path` is one of pytest\'s built-in fixtures (no import, no definition needed). It is a `pathlib.Path` to a unique temporary directory created fresh for each test, so file tests never collide or leak. Build child paths with the `/` operator; `write_text`/`read_text` are pathlib conveniences. Related built-ins: `tmp_path_factory` (session-scoped temp dirs) and the older `tmpdir` (py.path).',
    hints: [
      'tmp_path is a pathlib.Path — use the / operator to build child paths',
      'No import needed; request it by parameter name',
      'write_text / read_text avoid open()',
    ],
    tags: ['pytest', 'fixture', 'tmp_path', 'builtin'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-fix-capsys-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: "Fill in pytest's built-in fixture for capturing stdout/stderr, and the method that returns what was captured.",
    template: `def test_prints(___):
    print("hi")
    captured = ___.readouterr()
    assert captured.out == "hi\\n"`,
    blanks: ['capsys', 'capsys'],
    solution: 'def test_prints(capsys):\n    print("hi")\n    captured = capsys.readouterr()\n    assert captured.out == "hi\\n"',
    explanation:
      'capsys is a built-in fixture; capsys.readouterr() returns an object with .out and .err holding everything printed since the last read, then clears the buffers.',
    hints: ['Blend of "cap" + "sys(tem)"; method name is "read" + "out" + "err".'],
    tags: ['pytest', 'fixture', 'capsys', 'builtin'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-fix-capsys-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'pytest\'s built-in `capsys` fixture captures text written to stdout/stderr. Write a function `announce(who)` that prints `f"hi {who}"`. Then write `test_announce` that takes `capsys`, calls `announce("ada")`, and asserts the captured standard output equals `"hi ada\\n"` (note the trailing newline `print` adds). Use the `capsys` method that returns the captured output.',
    starterCode: `# announce(who): print f"hi {who}"
# test_announce(capsys): call announce("ada"), then capture stdout via capsys and assert it equals "hi ada\\n"
`,
    testCases: [
      {
        input: 'capsys captures stdout',
        expectedOutput: 'captured.out == "hi ada\\n"',
        description: 'capsys.readouterr() returns captured out/err',
      },
    ],
    solution: `def announce(who):
    print(f"hi {who}")

def test_announce(capsys):
    announce("ada")
    captured = capsys.readouterr()
    assert captured.out == "hi ada\\n"`,
    explanation: '`capsys` is a built-in fixture for asserting on printed output. `capsys.readouterr()` returns an object with `.out` and `.err` (the captured stdout/stderr since the last read) and clears the buffers. Note the trailing newline that `print` adds. Variants: `capfd` captures at the file-descriptor level (catches C-level writes / subprocess output), and `caplog` captures logging records.',
    hints: [
      'capsys.readouterr() returns an object with .out and .err',
      'print adds a trailing newline — include it in the expected string',
      'capfd captures at fd level; caplog captures logging',
    ],
    tags: ['pytest', 'fixture', 'capsys', 'builtin'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-test-int-fixture-parametrize',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question:
      'Compose a pytest fixture WITH a parametrize decorator on the same test. Define a minimal `Calculator` class with a single method `add(self, a, b)` that returns their sum. Define a pytest fixture `calc` that returns a fresh `Calculator()`. Define `test_add` that takes `calc` (from the fixture) plus `a`, `b`, `expected` (from the parametrize rows) and asserts `calc.add(a, b) == expected`. Parametrize over three rows: `(2, 3, 5)`, `(0, 0, 0)`, `(-1, 1, 0)`. The test runs three times — once per row — each time receiving the same fixture-built calculator.',
    starterCode: `import pytest
  `,
    testCases: [
      {
        input: 'fixture + parametrize on one test',
        expectedOutput: '3 test cases pass using shared Calculator fixture',
        description: 'Fixture injects the instance; parametrize rotates the inputs',
      },
    ],
    solution: `import pytest

class Calculator:
    def add(self, a, b):
        return a + b

@pytest.fixture
def calc():
    return Calculator()

@pytest.mark.parametrize("a,b,expected", [
    (2, 3, 5),
    (0, 0, 0),
    (-1, 1, 0),
])
def test_add(calc, a, b, expected):
    assert calc.add(a, b) == expected`,
    explanation:
      'Fixtures and parametrize compose by position: the test receives the fixture-injected arg (`calc`) PLUS the parametrize-rotated args (`a`, `b`, `expected`). pytest builds the fixture fresh per test invocation by default (or reuses across the fixture\'s scope). The `ids=` kwarg on parametrize gives readable names in the output — "test_add[positive]" instead of "test_add[2-3-5]". This composition is the everyday pytest shape: one fixture for the system under test, parametrize for the input matrix.',
    hints: [
      'Fixture param name + parametrize param names share the function signature',
      'Fixture rebuilds per test invocation (default function scope)',
      'Use ids= on parametrize for readable names in the output',
    ],
    tags: ['pytest', 'fixture', 'parametrize', 'intermediate'],
    concepts: ['py-test-isolation'],
  },

  // ===================== ADVANCED =====================
  {
    id: 'py-fix-conftest-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    question: 'What is the purpose of a `conftest.py` file in pytest?',
    options: [
      { id: 'a', text: 'It holds fixtures and hooks shared automatically by every test in its directory and below', isCorrect: true },
      { id: 'b', text: 'It lists every test file in the project so pytest knows the exact order in which to execute them during a run', isCorrect: false },
      { id: 'c', text: 'It stores the recorded pass/fail history so pytest can re-run only the previously failing tests', isCorrect: false },
      { id: 'd', text: 'It is the config file where you set markers, addopts, and the minimum required pytest version', isCorrect: false },
    ],
    explanation: 'conftest.py supplies fixtures (and hooks/plugins) to all tests in its directory tree — pytest discovers it automatically, so tests use those fixtures WITHOUT importing anything. A conftest.py deeper in the tree extends or overrides one higher up. Project-wide configuration like markers, addopts, and minversion lives in pytest.ini / pyproject.toml (option D), not conftest.py.',
    hints: [
      'Shared fixtures/hooks, auto-discovered — no import',
      'Nearer conftest.py overrides ones higher up',
      'Config (markers/addopts) lives in pytest.ini / pyproject.toml',
    ],
    tags: ['pytest', 'fixture', 'conftest'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-fix-paramfixture-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the kwarg that parametrizes a fixture itself, and the attribute that exposes the current value.',
    template: `import pytest

@pytest.fixture(___=[1, 2, 3])
def n(request):
    return request.___`,
    blanks: ['params', 'param'],
    solution: 'import pytest\n\n@pytest.fixture(params=[1, 2, 3])\ndef n(request):\n    return request.param',
    explanation:
      'params=[...] on @pytest.fixture makes the fixture itself parametrized — every test that depends on it re-runs once per value. The built-in request fixture exposes the current value as request.param. Unlike @pytest.mark.parametrize (one test), this multiplies every dependent test.',
    hints: ['Fixture kwarg is plural "params"; the request attribute is singular "param".'],
    tags: ['pytest', 'fixture', 'parametrized-fixture', 'request'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-fix-param-fixture-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Write a PARAMETRIZED fixture. Define a fixture `number` decorated so pytest runs it once for each of the params `1`, `2`, and `3`, returning whichever param pytest is currently running — the built-in `request` fixture exposes it. Then write `test_is_positive` that takes `number` and asserts it is greater than `0`. The test should execute three times — once per fixture param.',
    starterCode: `import pytest
  `,
    testCases: [
      {
        input: 'parametrized fixture via request.param',
        expectedOutput: 'test runs 3 times (number = 1, 2, 3), all pass',
        description: 'params=[...] on the fixture; read request.param',
      },
    ],
    solution: `import pytest

@pytest.fixture(params=[1, 2, 3])
def number(request):
    return request.param

def test_is_positive(number):
    assert number > 0`,
    explanation: 'Passing `params=[...]` to @pytest.fixture makes the fixture itself parametrized: pytest re-runs every test that depends on it once per param, reading the current value from the special `request` fixture\'s `request.param`. Unlike @pytest.mark.parametrize (which parametrizes ONE test), a parametrized fixture multiplies ALL of its dependent tests — useful for running an entire suite against several backends/configs. Add `ids=[...]` for readable case names.',
    hints: [
      'params=[...] on @pytest.fixture; read request.param',
      'It multiplies every dependent test, not just one',
      'request is a built-in fixture exposing the current param',
    ],
    tags: ['pytest', 'fixture', 'parametrized-fixture', 'request'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-adv-test-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_FIXTURES,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Write pytest tests for a `Calculator` class (define it inline) with a `divide` method that raises `ZeroDivisionError` with message `"Cannot divide by zero"` on a zero divisor. Instantiate `Calculator` once via a shared fixture. Parametrize the normal-division test over (a, b, expected):\n\n(10, 2, 5.0)\n(7, 2, 3.5)\n(-9, 3, -3.0)\n(0, 5, 0.0)\n\nThen assert the zero-divisor case with `pytest.raises(ZeroDivisionError, match=...)`.',
    starterCode: `import pytest

class Calculator:
    ...
`,
    testCases: [
      {
        input: 'pytest runs all test functions',
        expectedOutput: 'All tests pass, including parametrized and exception tests',
        description: 'Should use a fixture, parametrize, and pytest.raises',
      },
    ],
    solution: `import pytest

class Calculator:
    def divide(self, a: float, b: float) -> float:
        if b == 0:
            raise ZeroDivisionError("Cannot divide by zero")
        return a / b

# --- Tests ---

@pytest.fixture
def calc():
    """Provide a Calculator instance for tests."""
    return Calculator()

@pytest.mark.parametrize("a, b, expected", [
    (10, 2, 5.0),
    (7, 2, 3.5),
    (-9, 3, -3.0),
    (0, 5, 0.0),
])
def test_divide(calc, a, b, expected):
    assert calc.divide(a, b) == expected

def test_divide_by_zero(calc):
    with pytest.raises(ZeroDivisionError, match="Cannot divide by zero"):
        calc.divide(1, 0)
`,
    explanation: 'Fixtures (@pytest.fixture) provide reusable test setup — when a test function has a parameter matching a fixture name, pytest automatically calls the fixture and passes the result. This eliminates setUp/tearDown boilerplate. @pytest.mark.parametrize runs the same test with different inputs, generating separate test cases that report independently. pytest.raises is a context manager that asserts an exception is raised — the `match` parameter checks the error message with a regex. This pattern catches both "exception not raised" and "wrong exception" errors.',
    hints: [
      'Fixtures inject dependencies by matching parameter names',
      '@pytest.mark.parametrize takes a string of param names and a list of tuples',
      'pytest.raises(ExcType, match="pattern") for exception testing',
    ],
    tags: ['pytest', 'fixture', 'parametrize', 'raises', 'testing'],
    concepts: ['py-test-isolation'],
  },
];
