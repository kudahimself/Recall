/**
 * Topic.PY_TESTING_BASICS — pytest core: assert, discovery/naming, AAA,
 * pytest.raises, approx, parametrize, markers (skip/xfail/skipif), pytest vs unittest.
 *
 * Split out of the former monolithic Topic.PY_TESTING so the pytest core ramps
 * beginner→intermediate→advanced independently of fixtures and mocking.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_testing_basics_questions: Question[] = [
  // ===================== BEGINNER =====================
  {
    id: 'py-gap-testing-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    question: 'What is unit testing and why should you do it?',
    options: [
      { id: 'a', text: 'A way to measure how fast your code runs, used to optimize performance under heavy production load', isCorrect: false },
      { id: 'b', text: 'Testing individual functions in isolation to catch bugs early, refactor safely, and document behaviour', isCorrect: true },
      { id: 'c', text: 'A process where real users manually click through the application to find visual and layout bugs', isCorrect: false },
      { id: 'd', text: 'A technique for checking that every Python module and package in a project can be imported without raising errors', isCorrect: false },
    ],
    explanation: 'Unit testing means testing small, isolated pieces of code (usually individual functions or methods) to verify they work correctly. Benefits include: catching bugs before they reach production, enabling safe refactoring (change code confidently knowing tests will catch regressions), and serving as living documentation of expected behavior. Python\'s most popular testing framework is pytest — it\'s simpler and more powerful than the built-in unittest module.',
    hints: [
      '"Unit" = a small piece of code, like one function',
      'Tests catch bugs early and make refactoring safe',
    ],
    tags: ['testing', 'pytest', 'unittest', 'basics'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-ptest-discovery-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    question: 'By default, which files and functions does pytest automatically collect as tests?',
    options: [
      { id: 'a', text: 'Files named test_*.py or *_test.py, and functions whose names start with test_', isCorrect: true },
      { id: 'b', text: 'Any file placed inside a folder named tests/, no matter what the files or the functions inside them are called', isCorrect: false },
      { id: 'c', text: 'Every function that contains at least one assert statement anywhere', isCorrect: false },
      { id: 'd', text: 'Only methods inside a class that subclasses unittest.TestCase', isCorrect: false },
    ],
    explanation: 'pytest\'s default discovery rules: it collects files matching test_*.py or *_test.py, test functions prefixed with test_, and Test-prefixed classes (with no __init__) whose methods start with test_. It does NOT require an assert, a tests/ folder, or a unittest.TestCase subclass. The patterns are configurable via python_files / python_functions in pytest.ini or pyproject.toml.',
    hints: [
      'Naming convention drives collection: test_*.py and test_ functions',
      'No assert required, no special folder required',
    ],
    tags: ['pytest', 'discovery', 'naming', 'basics'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-gap-testing-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Write pytest tests for a simple `add` function. Given:\n```python\ndef add(a, b):\n    return a + b\n```\nWrite a function `test_add()` that verifies: `add(2, 3) == 5`, `add(-1, 1) == 0`, and `add(0, 0) == 0`. Show the complete test file structure.',
    starterCode: `# Define add(a, b) returning a + b
# Write test_add() that asserts the three cases from the prompt
`,
    testCases: [
      {
        input: 'test_add()',
        expectedOutput: 'All assertions pass',
        description: 'All three test cases should pass',
      },
    ],
    solution: `# The function to test
def add(a, b):
    return a + b

# Test function — pytest discovers functions starting with "test_"
def test_add():
    assert add(2, 3) == 5       # positive numbers
    assert add(-1, 1) == 0      # negative + positive
    assert add(0, 0) == 0       # zeros

# Run with: pytest test_file.py -v`,
    explanation: 'In pytest, test functions start with `test_` and use Python\'s built-in `assert` statement. If any assertion fails, pytest reports exactly which one failed and shows the actual vs. expected values. No classes or special imports needed — just write functions with `assert`. Run with `pytest filename.py` from the terminal. The `-v` flag shows verbose output with each test listed.',
    hints: [
      'Test functions must start with `test_`',
      'Use `assert` followed by a boolean expression',
      'Each `assert` checks one condition',
    ],
    tags: ['testing', 'pytest', 'assert', 'basics'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-testing-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question:
      'Write a pytest test for an add() function using arrange/act/assert structure.',
    correctOrder: [
      'def test_add():',
      '    a, b = 2, 3',
      '    result = add(a, b)',
      '    assert result == 5',
    ],
    distractorLines: [
      '    self.assertEqual(result, 5)',
      'def test_add(self):',
    ],
    solution: 'def test_add():\n    a, b = 2, 3\n    result = add(a, b)\n    assert result == 5',
    explanation:
      'Pytest tests are plain functions starting with `test_`. Use the built-in `assert` statement — pytest rewrites the AST to give rich failure messages. unittest.TestCase methods (self.assertEqual) work but aren\'t the pytest idiom.',
    hints: ['Plain function; bare assert; no class needed.'],
    tags: ['testing', 'pytest', 'arrange-act-assert'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-testing-parsons-2',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question:
      'Use pytest.raises to assert that divide(1, 0) raises ZeroDivisionError.',
    correctOrder: [
      'import pytest',
      '',
      'def test_divide_by_zero():',
      '    with pytest.raises(ZeroDivisionError):',
      '        divide(1, 0)',
    ],
    distractorLines: [
      '    pytest.raises(ZeroDivisionError, divide(1, 0))',
      '    assert divide(1, 0) == ZeroDivisionError',
    ],
    solution:
      'import pytest\n\ndef test_divide_by_zero():\n    with pytest.raises(ZeroDivisionError):\n        divide(1, 0)',
    explanation:
      'pytest.raises is a context manager that asserts the wrapped block raises the listed exception. The function-call form `pytest.raises(ZeroDivisionError, divide(1, 0))` would call divide BEFORE pytest.raises sees it — the exception escapes.',
    hints: ['Context manager form; the exception must happen INSIDE the with-block.'],
    tags: ['testing', 'pytest.raises'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-testing-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question:
      'Fill in the pytest helper that asserts the block raises a given exception.',
    template: `import pytest

def test_divide_by_zero():
    with pytest.___(ZeroDivisionError):
        1 / 0`,
    blanks: ['raises'],
    solution:
      'import pytest\n\ndef test_divide_by_zero():\n    with pytest.raises(ZeroDivisionError):\n        1 / 0',
    explanation:
      'pytest.raises(ExcType) is a context manager — the test passes only if the body raises that exception (or a subclass). Add match="..." to also assert on the message. The test FAILS if no exception is raised.',
    hints: ['Five letters; the context manager that expects an exception.'],
    tags: ['testing', 'pytest.raises', 'exceptions'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-testing-parsons-6',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question:
      'Use pytest.approx for float equality with tolerance.',
    correctOrder: [
      'import pytest',
      '',
      'def test_compute():',
      '    result = compute()',
      '    assert result == pytest.approx(0.1 + 0.2)',
    ],
    distractorLines: [
      '    assert result == 0.1 + 0.2',
      '    assert pytest.approx(result, 0.1 + 0.2)',
    ],
    solution:
      'import pytest\n\ndef test_compute():\n    result = compute()\n    assert result == pytest.approx(0.1 + 0.2)',
    explanation:
      'Floating-point comparison should use approx — direct == fails because 0.1 + 0.2 != 0.3 exactly in IEEE 754. Use approx on the EXPECTED side (right of ==). Custom tolerance: pytest.approx(value, abs=0.001) or rel=...',
    hints: ['approx wraps the expected value; tolerances are kwargs (abs/rel).'],
    tags: ['testing', 'approx', 'float'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-testing-predict-3',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'What does this code print?',
    code: `import pytest

print(0.1 + 0.2 == 0.3)
print(0.1 + 0.2 == pytest.approx(0.3))`,
    expectedOutput: `False
True`,
    explanation:
      'Binary floating point makes 0.1 + 0.2 equal 0.30000000000000004, so the exact == is False. pytest.approx compares with a small tolerance, so it reports True. Always use approx (or math.isclose) when asserting on floats.',
    hints: ['Exact float == is False; approx tolerates the rounding error.'],
    tags: ['testing', 'approx', 'float'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-testing-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question:
      'Fill in the decorator that runs this test once per row of inputs.',
    template: `import pytest

@pytest.mark.___("value, expected", [(2, 4), (3, 9)])
def test_square(value, expected):
    assert value ** 2 == expected`,
    blanks: ['parametrize'],
    solution:
      'import pytest\n\n@pytest.mark.parametrize("value, expected", [(2, 4), (3, 9)])\ndef test_square(value, expected):\n    assert value ** 2 == expected',
    explanation:
      '@pytest.mark.parametrize(argnames, argvalues) runs the test once per tuple, reporting each row as its own test case. It replaces hand-written loops and gives clearer failure output (you see exactly which row failed).',
    hints: ['Note the spelling: parametrize (no extra "e" — not "parameterize").'],
    tags: ['testing', 'parametrize'],
    concepts: ['py-test-isolation'],
  },

  // ===================== INTERMEDIATE =====================
  {
    id: 'be-test-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Write a pytest test for a function calculate_tax(amount, rate=0.2) that returns amount * rate. Test: normal case, zero amount, custom rate.',
    starterCode: `# Import pytest; define calculate_tax(amount, rate=0.2) returning amount * rate
# Add three test_* functions: normal case (100 → 20.0), zero amount, custom rate (100, 0.1 → 10.0)
`,
    testCases: [
      {
        input: 'calculate_tax function',
        expectedOutput: 'def test_ functions with assert',
        description: 'Should write pytest tests',
      },
    ],
    solution: `import pytest\n\ndef calculate_tax(amount, rate=0.2):\n    return amount * rate\n\ndef test_normal_tax():\n    assert calculate_tax(100) == 20.0\n\ndef test_zero_amount():\n    assert calculate_tax(0) == 0.0\n\ndef test_custom_rate():\n    assert calculate_tax(100, 0.1) == 10.0`,
    explanation: 'pytest uses plain assert statements — no special assertion methods needed. Test functions must start with test_. Run with "pytest" command. pytest auto-discovers test files (test_*.py) and test functions. Simpler than unittest.',
    hints: ['Test functions start with test_', 'Use plain assert', 'pytest auto-discovers tests'],
    tags: ['pytest', 'testing', 'assert', 'python'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-gap-testing-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Write a test that verifies a function raises an exception. Given:\n```python\ndef divide(a, b):\n    if b == 0:\n        raise ValueError("Cannot divide by zero")\n    return a / b\n```\nWrite `test_divide_by_zero` that asserts calling `divide(10, 0)` raises `ValueError`, using pytest\'s exception-asserting context manager. Then write a second test that ALSO checks the error message contains the word "zero" — the same context manager takes a keyword argument that matches the message against a regex. Finally add a test for the normal case: `divide(10, 2) == 5.0`.',
    starterCode: `import pytest
# divide(a, b): raise ValueError("Cannot divide by zero") when b == 0, else a / b
# test_divide_by_zero(): assert the zero case raises ValueError
# second test: also assert the raised message contains "zero"
# third test: the normal case divide(10, 2) == 5.0
`,
    testCases: [
      {
        input: 'test_divide_by_zero()',
        expectedOutput: 'ValueError is raised with correct message',
        description: 'Should catch ValueError and verify message',
      },
    ],
    solution: `import pytest

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

def test_divide_by_zero():
    # Test that the exception is raised
    with pytest.raises(ValueError):
        divide(10, 0)

def test_divide_by_zero_message():
    # Test the exception AND its message
    with pytest.raises(ValueError, match="zero"):
        divide(10, 0)

def test_divide_normal():
    # Also test the happy path
    assert divide(10, 2) == 5.0`,
    explanation: '`pytest.raises(ExceptionType)` is a context manager that passes if the expected exception is raised inside the `with` block, and fails if no exception (or a different exception) is raised. The `match` parameter takes a regex pattern and checks it against the exception message. Always test both the error case AND the normal case — a function that always raises exceptions would pass the first test but fail the second.',
    hints: [
      'Use `with pytest.raises(ValueError):` as a context manager',
      'The `match` parameter accepts a regex pattern to check the error message',
      'Don\'t forget to test the normal (non-error) case too',
    ],
    tags: ['testing', 'pytest', 'exceptions', 'raises'],
    concepts: ['py-test-isolation', 'py-exception-hierarchy'],
  },
  {
    id: 'py-test-parametrize-ids',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Write a single test function `test_add` that exercises three cases — `(2, 3, 5)`, `(0, 0, 0)`, and `(-1, 1, 0)` — using the pytest decorator that turns one test into multiple. Provide custom IDs `"positive"`, `"zeros"`, `"negative"` (parallel to the rows) so verbose test output shows `test_add[positive]` instead of `test_add[2-3-5]`. The test body should assert that `a + b == expected`.',
    starterCode: `import pytest
  `,
    testCases: [
      {
        input: 'parametrize with ids for readable test names',
        expectedOutput: 'test_add[positive], test_add[zeros], test_add[negative]',
        description: 'ids= customises the displayed test ID',
      },
    ],
    solution: `import pytest

@pytest.mark.parametrize(
    "a,b,expected",
    [(2, 3, 5), (0, 0, 0), (-1, 1, 0)],
    ids=["positive", "zeros", "negative"],
)
def test_add(a, b, expected):
    assert a + b == expected`,
    explanation: 'Without `ids=`, pytest auto-generates names like `test_add[2-3-5]` — serviceable, not expressive. Custom IDs make failures self-documenting: `FAILED test_add[negative]` tells you instantly which case broke. Pair with `pytest.param(..., id="name", marks=pytest.mark.xfail)` for per-row markers (skip, xfail, slow). `pytest.mark.parametrize` is the single most powerful tool for turning one test function into dozens of specific cases.',
    hints: [
      'ids= takes a list parallel to the param values',
      'Or pass a callable id_func to derive ids from each row',
      'pytest.param(..., id=..., marks=...) for per-row markers',
    ],
    tags: ['pytest', 'parametrize', 'ids'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-ptest-markers-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Some tests must not run in every environment. Write two pytest tests. First, `test_unix_only`: decorate it so it is SKIPPED only when `sys.platform` starts with `"win"`, giving the reason "POSIX only" (its body can just `assert True`). Second, `test_wip`: decorate it so it is UNCONDITIONALLY skipped with the reason "not implemented yet". Import whatever you need.',
    starterCode: `# Import sys and pytest
# test_unix_only -> conditional skip when on Windows (reason "POSIX only")
# test_wip       -> unconditional skip (reason "not implemented yet")
`,
    testCases: [
      {
        input: 'skip and skipif markers',
        expectedOutput: 'test_wip always skipped; test_unix_only skipped on Windows',
        description: 'Should use @pytest.mark.skip and @pytest.mark.skipif',
      },
    ],
    solution: `import sys
import pytest

@pytest.mark.skipif(sys.platform.startswith("win"), reason="POSIX only")
def test_unix_only():
    assert True

@pytest.mark.skip(reason="not implemented yet")
def test_wip():
    assert True`,
    explanation: '`@pytest.mark.skip(reason=...)` always skips a test — use it for work-in-progress or temporarily broken tests. `@pytest.mark.skipif(condition, reason=...)` skips only when the condition is True at collection time — use it for environment- or version-specific tests (platform, Python version, optional dependency missing). The reason shows up in the report so future-you knows why it was skipped. A related marker, `@pytest.mark.xfail`, runs the test but tolerates a known failure.',
    hints: [
      'skip = always; skipif(condition) = conditional',
      'Always give a reason= so the skip is self-documenting',
      'sys.platform.startswith("win") detects Windows',
    ],
    tags: ['pytest', 'markers', 'skip', 'skipif'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-test-unittest-vs-pytest',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    question: 'Why do most modern Python projects prefer pytest over `unittest` (which is in the stdlib)?',
    options: [
      { id: 'a', text: 'unittest is effectively deprecated; the core team recommends against using it for newly written test code', isCorrect: false },
      { id: 'b', text: 'Plain `assert` with rich failure output, function-based tests without TestCase boilerplate, fixtures, parametrize, and plugins', isCorrect: true },
      { id: 'c', text: 'pytest runs every test in parallel across all available CPU cores by default, while unittest is strictly single-threaded and therefore slower', isCorrect: false },
      { id: 'd', text: 'unittest cannot test for raised exceptions and has no setup or teardown hooks, so pytest is required beyond trivial cases', isCorrect: false },
    ],
    explanation: 'Comparison: `unittest` → class-based `TestCase`, `self.assertEqual(a, b)`, `setUp/tearDown`, xunit-style. `pytest` → function-based, plain `assert a == b` (with detailed failure info), fixtures as parameters (`def test_x(db_connection):`), parametrize, marks, plugins (pytest-cov, pytest-asyncio, pytest-mock, pytest-bdd). pytest runs `unittest.TestCase` classes natively, so migration is incremental. For new code, pytest every time.',
    hints: [
      'pytest: function-based, assert-based, fixtures, parametrize, plugins',
      'unittest: class-based, self.assertX(), xunit-style',
      'pytest runs unittest tests — migrate incrementally',
    ],
    tags: ['pytest', 'unittest', 'testing'],
    concepts: ['py-test-isolation'],
  },

  // ===================== ADVANCED =====================
  {
    id: 'py-ptest-xfail-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Write a single parametrized `test_divide` over a `divide(a, b)` function (define it inline; it just returns `a / b`). Provide three rows: `(10, 2, 5)`, `(9, 3, 3)`, and a `(1, 0, None)` row that you EXPECT to fail because dividing by zero raises. Mark ONLY that third row as expected-to-fail using the per-row marking mechanism (so the suite still reports green overall). The test body asserts `divide(a, b) == expected`.',
    starterCode: `import pytest

# def divide(a, b): ...
# One parametrized test; mark ONLY the divide-by-zero row as expected-to-fail
`,
    testCases: [
      {
        input: 'parametrize with a per-row xfail marker',
        expectedOutput: 'two rows pass, the zero-division row xfails — suite is green',
        description: 'Should use pytest.param(..., marks=pytest.mark.xfail)',
      },
    ],
    solution: `import pytest

def divide(a, b):
    return a / b

@pytest.mark.parametrize("a, b, expected", [
    (10, 2, 5),
    (9, 3, 3),
    pytest.param(1, 0, None, marks=pytest.mark.xfail(raises=ZeroDivisionError)),
])
def test_divide(a, b, expected):
    assert divide(a, b) == expected`,
    explanation: 'A whole-function `@pytest.mark.xfail` would mark every case as expected-to-fail. To mark a SINGLE parametrize row, wrap that row in `pytest.param(*values, marks=pytest.mark.xfail(...))`. The `raises=` argument makes the xfail strict about WHICH exception is tolerated — any other error still fails the test. An xfail that unexpectedly passes is reported as XPASS (and, with `strict=True`, fails the suite — a guard against silently-fixed bugs).',
    hints: [
      'Per-row markers live in pytest.param(..., marks=...)',
      'pytest.mark.xfail(raises=ZeroDivisionError) scopes the tolerated error',
      'A whole-function marker would affect all rows — not what you want here',
    ],
    tags: ['pytest', 'parametrize', 'xfail', 'pytest.param'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-ptest-selection-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    question: 'You tagged some tests with `@pytest.mark.slow`. How do you run ONLY those, and avoid pytest warning that the marker is unknown?',
    options: [
      { id: 'a', text: 'Run `pytest -m slow`; register the marker under [pytest] markers in pytest.ini (or pyproject.toml)', isCorrect: true },
      { id: 'b', text: 'Run `pytest -k slow`; pytest never emits any warning about custom markers, so no registration step is ever needed', isCorrect: false },
      { id: 'c', text: 'Run `pytest --only=slow`; then add the marker name to a SLOW list inside conftest.py to silence the warnings', isCorrect: false },
      { id: 'd', text: 'Run `pytest slow`; markers are auto-registered the first time pytest happens to see them in a run', isCorrect: false },
    ],
    explanation: '`-m` selects by MARKER expression: `pytest -m slow`, or boolean expressions like `pytest -m "slow and not db"`. (`-k` is different — it matches substrings of test NAMES.) Unregistered custom markers trigger a PytestUnknownMarkWarning; register them under `[pytest] markers = slow: ...` in pytest.ini, or `[tool.pytest.ini_options]` in pyproject.toml. Add `--strict-markers` to turn unknown markers into hard errors.',
    hints: [
      '-m selects by marker; -k selects by test-name substring',
      'Register custom markers in pytest.ini / pyproject.toml',
      '--strict-markers makes unknown markers an error',
    ],
    tags: ['pytest', 'markers', 'selection', 'configuration'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-testing-parsons-3',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_TESTING_BASICS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question:
      'Use `@pytest.mark.parametrize` to run one `test_add` over an `add(a, b)` function with multiple input/expected rows. Use the param string `"a, b, expected"` and provide exactly these three rows, in this top-to-bottom order: `(1, 2, 3)`, then `(0, 0, 0)`, then `(-1, 1, 0)`. The test body asserts `add(a, b) == expected`.',
    correctOrder: [
      'import pytest',
      '',
      '@pytest.mark.parametrize("a, b, expected", [',
      '    (1, 2, 3),',
      '    (0, 0, 0),',
      '    (-1, 1, 0),',
      '])',
      'def test_add(a, b, expected):',
      '    assert add(a, b) == expected',
    ],
    distractorLines: [
      '@pytest.parametrize("a, b, expected", [',
      'def test_add(a, b, expected, params):',
    ],
    solution:
      'import pytest\n\n@pytest.mark.parametrize("a, b, expected", [\n    (1, 2, 3),\n    (0, 0, 0),\n    (-1, 1, 0),\n])\ndef test_add(a, b, expected):\n    assert add(a, b) == expected',
    explanation:
      'parametrize lives under pytest.mark — full path is @pytest.mark.parametrize. First arg is comma-separated param names; second is a list of value tuples. Pytest runs the test once per tuple, with descriptive names for failures.',
    hints: ['Full path: @pytest.mark.parametrize. First arg names, second arg cases.'],
    tags: ['testing', 'parametrize'],
    concepts: ['py-test-isolation'],
  },
];
