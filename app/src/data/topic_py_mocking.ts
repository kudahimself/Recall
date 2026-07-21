/**
 * Topic.PY_MOCKING — mocking & patching: why mock, MagicMock (return_value,
 * side_effect, call assertions), patch (decorator + context manager),
 * patch-where-used, call_args_list / mock_calls, spec/autospec, monkeypatch.
 *
 * Final pass of the PY_TESTING split. Mocking ramps beginner→advanced on its
 * own — MagicMock now spans all three tiers (basics → call_args_list/precedence
 * → spec/autospec/mock_calls ordering).
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_mocking_questions: Question[] = [
  // ===================== BEGINNER =====================
  {
    id: 'py-mock-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    question: 'When would you use a mock (via `unittest.mock`) in a test?',
    options: [
      { id: 'a', text: 'Whenever you can — mocks replace all real code with fakes for speed', isCorrect: false },
      { id: 'b', text: 'To replace dependencies that are slow, unreliable, or have side effects (HTTP calls, DB writes, time, randomness, email sending) — so the unit under test can be exercised in isolation without hitting the real collaborator', isCorrect: true },
      { id: 'c', text: 'Only when testing classes — functions never need mocks', isCorrect: false },
      { id: 'd', text: 'Only for performance benchmarks', isCorrect: false },
    ],
    explanation: 'Mocks let you test code that depends on something you cannot or should not hit in tests — a paid API, a database, the clock, a random generator. You assert your code CALLED the collaborator the right way, without actually running it. Avoid over-mocking: if every dependency is a mock, you are only testing the test, not the behaviour. Prefer real instances for cheap/fast deps.',
    hints: [
      'Mock external collaborators: HTTP, DB, time, random, email',
      'Replace the dependency, not the code under test',
      'Over-mocking is a smell — you are testing the test',
    ],
    tags: ['mock', 'testing', 'isolation'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-mock-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the attribute that makes a mock method return a fixed value on every call.',
    template: `from unittest.mock import MagicMock

db = MagicMock()
db.get_count.___ = 42
assert db.get_count() == 42`,
    blanks: ['return_value'],
    solution:
      'from unittest.mock import MagicMock\n\ndb = MagicMock()\ndb.get_count.return_value = 42\nassert db.get_count() == 42',
    explanation:
      'Setting `.return_value` makes the mock return that fixed object on EVERY call, regardless of arguments. Each attribute access on a MagicMock (here `db.get_count`) is itself a child mock, so you configure its `.return_value` independently.',
    hints: ['Two words joined by an underscore; what the mock "returns".'],
    tags: ['mock', 'MagicMock', 'return_value'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-testing-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'What does this code print?',
    code: `from unittest.mock import MagicMock

m = MagicMock(return_value=5)
print(m(1, 2))
print(m())
print(m.call_count)`,
    expectedOutput: `5
5
2`,
    explanation:
      'return_value fixes what the mock returns on EVERY call, regardless of arguments — so both m(1, 2) and m() give 5. The mock records each call, so call_count is 2 after two invocations.',
    hints: ['return_value ignores the args; call_count counts every call.'],
    tags: ['mock', 'MagicMock', 'return_value', 'call_count'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-testing-predict-2',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'What does this code print?',
    code: `from unittest.mock import MagicMock

m = MagicMock(side_effect=[10, 20, 30])
print(m())
print(m())`,
    expectedOutput: `10
20`,
    explanation:
      'When side_effect is an iterable, each call returns the next item (10, then 20). A third call would return 30, and a fourth would raise StopIteration. side_effect can also be an exception class/instance (raised) or a function (called).',
    hints: ['An iterable side_effect yields successive values, one per call.'],
    tags: ['mock', 'MagicMock', 'side_effect'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-mock-predict-3',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'What does this code print?',
    code: `from unittest.mock import MagicMock

m = MagicMock(side_effect=ValueError("boom"))
try:
    m()
except ValueError as e:
    print("caught", e)`,
    expectedOutput: `caught boom`,
    explanation:
      'When side_effect is an exception class or instance, CALLING the mock raises it. (The three side_effect forms: an exception → raised; an iterable → next item per call; a function → called with the same args and its result returned.) return_value is ignored whenever side_effect raises.',
    hints: ['An exception side_effect is raised when the mock is called.'],
    tags: ['mock', 'MagicMock', 'side_effect', 'exception'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-mock-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Create a `MagicMock` named `fetcher` to stand in for a collaborator. First configure it so calling `fetcher.get_user(99)` returns the dict `{"id": 1, "name": "Alice"}` (use the mock attribute that sets a static return value) and assert that behaviour. Then reconfigure the same attribute path so subsequent calls raise `ValueError("not found")` instead (use the mock attribute that overrides with a side effect) and assert with `pytest.raises(ValueError)` that calling it now raises.',
    starterCode: `from unittest.mock import MagicMock
import pytest
`,
    testCases: [
      {
        input: 'return_value then side_effect',
        expectedOutput: 'first call returns the dict; second raises ValueError',
        description: 'side_effect overrides return_value',
      },
    ],
    solution: `from unittest.mock import MagicMock
import pytest

fetcher = MagicMock()
fetcher.get_user.return_value = {"id": 1, "name": "Alice"}
assert fetcher.get_user(99) == {"id": 1, "name": "Alice"}

fetcher.get_user.side_effect = ValueError("not found")
with pytest.raises(ValueError):
    fetcher.get_user(99)`,
    explanation: '`return_value` makes every call return a fixed value. `side_effect` is more flexible: an exception class/instance → raised; a callable → called with the args and its result returned; an iterable → each call returns the next item. side_effect takes priority over return_value. Great for simulating sequences ("first call succeeds, second call fails").',
    hints: [
      '.return_value for static fake responses',
      '.side_effect = Exception to raise on call',
      '.side_effect = [1, 2, 3] gives sequential return values',
    ],
    tieredHints: {
      apiSignature: 'pytest.raises(expected_exception, *, match=None)',
      skeleton: `from unittest.mock import MagicMock
import pytest

fetcher = ____()
fetcher.get_user.____ = {"id": 1, "name": "Alice"}
assert fetcher.____(99) == {"id": 1, "name": "Alice"}

fetcher.get_user.____ = ____("not found")
with pytest.____(____):
    fetcher.get_user(99)`,
    },
    tags: ['MagicMock', 'return_value', 'side_effect', 'mock'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-mock-assertcalled-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the assertions: one that checks the mock was called exactly once, one that checks the args of its last call.',
    template: `from unittest.mock import MagicMock

m = MagicMock()
m.send("hi")
m.send.___()
m.send.___("hi")`,
    blanks: ['assert_called_once', 'assert_called_with'],
    solution:
      'from unittest.mock import MagicMock\n\nm = MagicMock()\nm.send("hi")\nm.send.assert_called_once()\nm.send.assert_called_with("hi")',
    explanation:
      'assert_called_once() fails unless the mock was called exactly once. assert_called_with(*args, **kwargs) checks the LAST call\'s arguments matched. Both raise AssertionError with a clear diff on mismatch.',
    hints: ['Both start with "assert_called"; one adds "_once", the other adds "_with".'],
    tags: ['mock', 'assert_called', 'interaction-testing'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-mock-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Create a `MagicMock` named `notifier` and call `notifier.send("alice@example.com", subject="Welcome", body="Hi!")` exactly once. Then verify HOW it was called: use the assertion that checks it was called exactly once (no args), then the assertion that checks the last call\'s args match the positional string and the two kwargs, and finally print the mock\'s call-count attribute (expect `1`).',
    starterCode: `from unittest.mock import MagicMock
  `,
    testCases: [
      {
        input: 'interaction verification',
        expectedOutput: '1',
        description: 'call_count is 1 and the assert_* helpers pass',
      },
    ],
    solution: `from unittest.mock import MagicMock

notifier = MagicMock()
notifier.send("alice@example.com", subject="Welcome", body="Hi!")

notifier.send.assert_called_once()
notifier.send.assert_called_with("alice@example.com", subject="Welcome", body="Hi!")
print(notifier.send.call_count)`,
    explanation: 'Every mock records all calls. Common assertions: `assert_called()`, `assert_called_once()`, `assert_called_with(*args, **kwargs)` (last call), `assert_called_once_with(...)` (combined), `assert_any_call(...)` (any call matched), `assert_not_called()`. Data: `call_count` (int), `call_args` (last call as Call), `call_args_list` (every call). This is the "how" side of mocking — assert both that the dependency was touched and that it was touched correctly.',
    hints: [
      'assert_called_with verifies the LAST call arguments',
      'assert_called_once_with combines the count + args check',
      'call_args_list holds every call for "any of these" patterns',
    ],
    tieredHints: {
      apiSignature: 'mock.assert_called_with(*args, **kwargs) -> None',
      skeleton: `from unittest.mock import MagicMock

notifier = ____()
notifier.send("alice@example.com", subject="Welcome", body="Hi!")

notifier.send.____()
notifier.send.____("alice@example.com", subject="Welcome", body="Hi!")
print(notifier.send.____)`,
    },
    tags: ['mock', 'assert_called', 'interaction-testing'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-testing-cloze-3',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question:
      'Fill in the monkeypatch method that sets an environment variable for the duration of the test.',
    template: `import os

def test_reads_env(monkeypatch):
    monkeypatch.___("API_KEY", "secret")
    assert os.environ["API_KEY"] == "secret"`,
    blanks: ['setenv'],
    solution:
      'import os\n\ndef test_reads_env(monkeypatch):\n    monkeypatch.setenv("API_KEY", "secret")\n    assert os.environ["API_KEY"] == "secret"',
    explanation:
      'monkeypatch.setenv(name, value) sets an env var and automatically restores the previous state after the test — no leakage between tests. Use monkeypatch.delenv to remove one, and monkeypatch.setattr to patch attributes.',
    hints: ['Lowercase: "set" + "env".'],
    tags: ['testing', 'monkeypatch', 'env-vars'],
    concepts: ['py-test-isolation'],
  },

  // ===================== INTERMEDIATE =====================
  {
    id: 'py-mock-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Define a function `retry_once(action)` that calls `action()`, and on any exception calls `time.sleep(5)` then retries `action()` once. Then write a test `test_retry_does_not_really_sleep` decorated with the `unittest.mock.patch` decorator targeting `"time.sleep"` so the real sleep is replaced with a mock for the duration of the test — the decorator injects the mock as the test\'s first parameter (name it `mock_sleep`). Inside the test, call `retry_once(lambda: 1)` (which never raises), then assert the mock was NOT called.',
    starterCode: `import time
from unittest.mock import patch
`,
    testCases: [
      {
        input: 'patch time.sleep during test',
        expectedOutput: 'test runs instantly; mock_sleep.assert_not_called() passes',
        description: '@patch replaces the target for the test duration',
      },
    ],
    solution: `import time
from unittest.mock import patch

def retry_once(action):
    try:
        return action()
    except Exception:
        time.sleep(5)
        return action()

@patch("time.sleep")
def test_retry_does_not_really_sleep(mock_sleep):
    retry_once(lambda: 1)
    mock_sleep.assert_not_called()`,
    explanation: '`@patch("time.sleep")` replaces `time.sleep` with a `MagicMock` for the duration of the test, then restores it. The mock is passed as the first arg (after `self` in class tests). Without this, a test exercising the retry path would actually sleep 5 seconds. Patch where the object is LOOKED UP, not where it was DEFINED — see the patch-where-used question.',
    hints: [
      '@patch("target") as decorator — mock becomes the first argument',
      'Mock is restored to the real object after the test',
      'Use `mock.assert_not_called()` / `assert_called_once()` for verifications',
    ],
    tieredHints: {
      apiSignature: 'mock.assert_not_called() -> None',
      skeleton: `import time
from unittest.mock import patch

def retry_once(action):
    try:
        return action()
    except ____:
        time.____(5)
        return action()

@____("time.sleep")
def test_retry_does_not_really_sleep(____):
    retry_once(lambda: 1)
    mock_sleep.____()`,
    },
    tags: ['mock', 'patch', 'pytest', 'decorator'],
    concepts: ['py-test-isolation', 'py-decorator-application'],
  },
  {
    id: 'py-mock-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Use `unittest.mock.patch` as a CONTEXT MANAGER (not a decorator) to replace `time.time` for the duration of a `with` block. Assume `time` is imported with `import time`. Inside the block, bind the mock as `mock_time`, configure it so `time.time()` returns `1000.0`, then assert `time.time() == 1000.0`. Outside the block the real function is restored automatically.',
    starterCode: `import time
from unittest.mock import patch
`,
    testCases: [
      {
        input: 'patch as context manager',
        expectedOutput: 'time.time() == 1000.0 inside the with-block',
        description: 'with patch(target) as mock: ...',
      },
    ],
    solution: `import time
from unittest.mock import patch

with patch("time.time") as mock_time:
    mock_time.return_value = 1000.0
    assert time.time() == 1000.0`,
    explanation: '`patch()` works as a decorator OR a context manager. The `with patch(target) as m:` form activates the patch only inside the block and binds the MagicMock to `m`. Prefer it when you need the patch for just part of a test, want to configure the mock before the patched code runs, or want to patch several things in nested `with` statements. On block exit the original object is restored.',
    hints: [
      'with patch("target") as mock_name:',
      'Configure mock_name.return_value inside the block',
      'The patch is undone when the with-block exits',
    ],
    tieredHints: {
      apiSignature: 'patch(target, new=DEFAULT, spec=None, create=False) -> _patch',
      skeleton: `import time
from unittest.mock import patch

____ patch("time.time") ____ mock_time:
    mock_time.____ = 1000.0
    assert time.time() == ____`,
    },
    tags: ['mock', 'patch', 'context-manager'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-mock-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Assume a function `get_api_key()` returns the value of the environment variable `MY_API_KEY`. Write `test_api_key` that takes pytest\'s built-in environment-patching fixture as a parameter, uses its env-var setter to set `MY_API_KEY` to `"test-key-42"` for the duration of the test, then asserts `get_api_key() == "test-key-42"`. The value must be automatically restored after the test — no manual cleanup.',
    starterCode: `import os
  `,
    testCases: [
      {
        input: 'monkeypatch setenv',
        expectedOutput: 'test passes with isolated env var',
        description: 'monkeypatch auto-undoes changes after the test',
      },
    ],
    solution: `import os

def get_api_key():
    return os.environ["MY_API_KEY"]

def test_api_key(monkeypatch):
    monkeypatch.setenv("MY_API_KEY", "test-key-42")
    assert get_api_key() == "test-key-42"`,
    explanation: 'pytest\'s `monkeypatch` fixture is a lighter, pytest-native alternative to `unittest.mock.patch`. Methods: `setenv` / `delenv` (env vars), `setattr` / `delattr` (attributes), `setitem` / `delitem` (dict keys), `chdir` (working directory), `syspath_prepend`. All auto-reverted at test teardown. Use it when you\'re inside a pytest test — it is cleaner than `patch.dict(os.environ, {...})` and doesn\'t need a decorator.',
    hints: [
      'monkeypatch is a pytest fixture — take it as a test parameter',
      'Methods: setenv, setattr, setitem, chdir',
      'Changes auto-revert at test teardown',
    ],
    tieredHints: {
      apiSignature: 'monkeypatch.setenv(name, value, prepend=None) -> None',
      skeleton: `import os

def get_api_key():
    return os.____["MY_API_KEY"]

def test_api_key(____):
    monkeypatch.____("MY_API_KEY", "test-key-42")
    assert get_api_key() == ____`,
    },
    tags: ['pytest', 'monkeypatch', 'env-vars', 'fixture'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-mock-anycall-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the assertion that checks a call happened ANYWHERE in the history, and the attribute listing every recorded call.',
    template: `from unittest.mock import MagicMock

m = MagicMock()
m("a")
m("b")
m.___("a")
print(len(m.___))`,
    blanks: ['assert_any_call', 'call_args_list'],
    solution:
      'from unittest.mock import MagicMock\n\nm = MagicMock()\nm("a")\nm("b")\nm.assert_any_call("a")\nprint(len(m.call_args_list))',
    explanation:
      'assert_called_with only checks the LAST call. assert_any_call(*args) passes if ANY recorded call matches. call_args_list is the ordered list of every call the mock received — its length equals call_count.',
    hints: ['"assert_any_call" for anywhere-in-history; "call_args_list" for the full history.'],
    tags: ['mock', 'call_args_list', 'assert_any_call', 'interaction-testing'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-mock-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'A `MagicMock` named `log` is called three times — first with the string "a", then "b", then "c". Verify the interaction history: assert the total call-count attribute equals three, use the assertion that checks a SPECIFIC call occurred ANYWHERE among all calls to confirm it was called with "b", and finally print the length of the attribute that lists every recorded call.',
    starterCode: `from unittest.mock import MagicMock
  `,
    testCases: [
      {
        input: 'multi-call history verification',
        expectedOutput: '3',
        description: 'assert_any_call + call_args_list across multiple calls',
      },
    ],
    solution: `from unittest.mock import MagicMock

log = MagicMock()
log("a")
log("b")
log("c")

assert log.call_count == 3
log.assert_any_call("b")
print(len(log.call_args_list))`,
    explanation: '`assert_called_with(...)` only checks the LAST call — useless when a mock is called many times. To assert a particular call happened somewhere in the history, use `assert_any_call(...)`. `call_args_list` is the full ordered list of `Call` objects (its length equals `call_count`). To assert an EXACT sequence, compare `call_args_list == [call("a"), call("b"), call("c")]` (importing `call` from unittest.mock).',
    hints: [
      'assert_called_with = last call only; assert_any_call = anywhere',
      'call_args_list is the ordered list of all calls (len == call_count)',
      'Compare to [call(...), ...] for an exact sequence',
    ],
    tieredHints: {
      apiSignature: 'mock.assert_any_call(*args, **kwargs) -> None',
      skeleton: `from unittest.mock import MagicMock

log = ____()
log("a")
log("b")
log("c")

assert log.____ == 3
log.____("b")
print(len(log.____))`,
    },
    tags: ['mock', 'call_args_list', 'assert_any_call', 'interaction-testing'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-mock-precedence-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    question: 'On a MagicMock you set BOTH `m.return_value = 1` and `m.side_effect = lambda: 2`. What does `m()` return, and why?',
    options: [
      { id: 'a', text: 'It returns 2 — side_effect runs first, and because it returns a value other than mock.DEFAULT, that value is used', isCorrect: true },
      { id: 'b', text: 'It returns 1 — return_value always wins because it was assigned to the mock before side_effect was', isCorrect: false },
      { id: 'c', text: 'It raises an error, because configuring both return_value and side_effect on a single mock is not allowed', isCorrect: false },
      { id: 'd', text: 'It returns a brand-new auto-generated child MagicMock, ignoring both return_value and side_effect entirely', isCorrect: false },
    ],
    explanation: 'side_effect takes precedence. When side_effect is a function, the mock calls it with the same arguments; whatever it returns becomes the call result — UNLESS it returns the sentinel `mock.DEFAULT`, in which case `return_value` is used instead. (If side_effect is an exception it is raised; if an iterable, the next item is returned.) So here m() returns 2. Setting both is perfectly legal — a common pattern is a side_effect function that returns DEFAULT to fall back on return_value.',
    hints: [
      'side_effect is consulted before return_value',
      'A side_effect function returning mock.DEFAULT falls back to return_value',
      'Exception side_effect → raised; iterable → next item',
    ],
    tags: ['mock', 'MagicMock', 'side_effect', 'return_value'],
    concepts: ['py-test-isolation'],
  },

  // ===================== ADVANCED =====================
  {
    id: 'py-mock-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'The starter shows `myapp/api.py`: it did `from requests import get` at import time, and `fetch_json(url)` returns `get(url).json()`. Write a test that runs `fetch_json("http://x")` with no real HTTP call: open a `patch` context manager on the right target string, bind the mock as `mock_get`, configure the chained attribute so the mocked `get(url).json()` returns `{"ok": True}`, and assert the result equals `{"ok": True}`. Choose the patch target carefully: patch the name where it is looked up, not where it is defined.',
    starterCode: `from unittest.mock import patch

# myapp/api.py (already importable):
#   from requests import get
#
#   def fetch_json(url):
#       return get(url).json()

from myapp.api import fetch_json
`,
    testCases: [
      {
        input: 'patch where used',
        expectedOutput: 'fetch_json returns {"ok": True} with no real HTTP call',
        description: 'Must patch myapp.api.get, not requests.get',
      },
    ],
    solution: `from unittest.mock import patch

# myapp/api.py (already importable):
#   from requests import get
#
#   def fetch_json(url):
#       return get(url).json()

from myapp.api import fetch_json

with patch("myapp.api.get") as mock_get:
    mock_get.return_value.json.return_value = {"ok": True}
    result = fetch_json("http://x")
    assert result == {"ok": True}`,
    explanation: 'When `myapp.api` did `from requests import get`, it bound its own module-level name `get` to the function. Patching `requests.get` modifies the original — but `myapp.api.get` still points at the saved reference. Patch at the USE site: `myapp.api.get`. Same rule for `from ... import ...` anywhere. Using `import requests; requests.get(...)` avoids the issue — then patching `requests.get` works.',
    hints: [
      'Patch where the name is LOOKED UP, not where it is defined',
      '`from X import Y` creates a local name — patch the local one',
      'Chain attribute access on a MagicMock: mock.return_value.json.return_value',
    ],
    tieredHints: {
      apiSignature: 'patch(target, new=DEFAULT, spec=None, create=False) -> _patch',
      skeleton: `from unittest.mock import patch

from myapp.api import fetch_json

with ____("myapp.api.get") as mock_get:
    mock_get.____.____.____ = {"ok": True}
    result = fetch_json("http://x")
    assert result == {"ok": True}`,
    },
    tags: ['mock', 'patch', 'import', 'gotcha'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-testing-parsons-5',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question:
      'Use unittest.mock.patch to replace requests.get during the test.',
    correctOrder: [
      'from unittest.mock import patch',
      '',
      '@patch("module_under_test.requests.get")',
      'def test_fetch(mock_get):',
      '    mock_get.return_value.json.return_value = {"x": 1}',
      '    assert fetch_data() == {"x": 1}',
    ],
    distractorLines: [
      '@patch(requests.get)',
      'def test_fetch():',
      '    mock_get = patch("requests.get")',
    ],
    solution:
      'from unittest.mock import patch\n\n@patch("module_under_test.requests.get")\ndef test_fetch(mock_get):\n    mock_get.return_value.json.return_value = {"x": 1}\n    assert fetch_data() == {"x": 1}',
    explanation:
      '@patch takes a STRING with the import path of the symbol to replace — patch where it\'s LOOKED UP, not where it\'s defined. The decorator injects the Mock as the next param. Configure return values via .return_value for chained call results.',
    hints: ['@patch takes a string; the mock is injected as a parameter.'],
    tags: ['testing', 'mock', 'patch'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-mock-spec-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    question: 'Why pass `spec=` (or use `autospec=True`) when creating a mock or patching?',
    options: [
      { id: 'a', text: 'It restricts the mock to the real object\'s attributes, so calling a misspelled or nonexistent method raises AttributeError', isCorrect: true },
      { id: 'b', text: 'It makes the mock automatically return the real values from the original underlying object instead of MagicMock placeholder objects', isCorrect: false },
      { id: 'c', text: 'It permanently freezes the original object so that no other test in the session can patch or modify it again', isCorrect: false },
      { id: 'd', text: 'It speeds the mock up by pre-allocating every attribute the spec object could ever possibly need ahead of time', isCorrect: false },
    ],
    explanation: 'A plain MagicMock accepts ANY attribute and any call signature, so a typo like `client.serch()` silently returns another mock and the test passes against a real bug. `spec=SomeClass` (or `create_autospec(...)` / `patch(..., autospec=True)`) constrains the mock to the spec object\'s real API: accessing an attribute it does not have raises AttributeError, and autospec additionally enforces call signatures. This catches drift when the real API changes underneath your tests.',
    hints: [
      'Plain mocks accept any attribute/call — typos pass silently',
      'spec/autospec makes unknown attributes raise AttributeError',
      'autospec also checks call signatures',
    ],
    tags: ['mock', 'spec', 'autospec'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-mock-mockcalls-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the attribute that records calls to a mock AND its child methods in order, and the helper used to build expected entries.',
    template: `from unittest.mock import MagicMock, call

client = MagicMock()
client.connect()
client.close()

assert client.___ == [___.connect(), call.close()]`,
    blanks: ['mock_calls', 'call'],
    solution:
      'from unittest.mock import MagicMock, call\n\nclient = MagicMock()\nclient.connect()\nclient.close()\n\nassert client.mock_calls == [call.connect(), call.close()]',
    explanation:
      'mock_calls records every call to the mock AND its child attributes, in order — unlike call_args_list, which only tracks the mock\'s own direct calls. Build expected entries with call.method(args) for comparison.',
    hints: ['mock_calls tracks children too; call.method(...) builds one expected entry.'],
    tags: ['mock', 'mock_calls', 'call', 'ordering'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-mock-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'A single `MagicMock` named `client` records calls across its methods. Call `client.connect()`, then `client.send("hi")`, then `client.close()`. Assert that these three happened in EXACTLY this order by comparing the mock\'s combined call record (the attribute that tracks calls to the mock AND its child methods, in order) against a list of expected `call` objects. Import whatever you need from `unittest.mock`.',
    starterCode: `from unittest.mock import MagicMock, call
  `,
    testCases: [
      {
        input: 'ordered call sequence',
        expectedOutput: 'mock_calls equals the expected ordered list of call objects',
        description: 'mock_calls tracks child-method calls in order',
      },
    ],
    solution: `from unittest.mock import MagicMock, call

client = MagicMock()
client.connect()
client.send("hi")
client.close()

assert client.mock_calls == [
    call.connect(),
    call.send("hi"),
    call.close(),
]`,
    explanation: '`mock_calls` records ALL calls to the mock AND its child attributes/methods, in the order they happened — unlike `call_args_list`, which only tracks the mock\'s own direct calls. Express expected child-method calls with `call.method(args)`. Comparing `mock_calls` to an ordered list asserts the exact interaction sequence, which is invaluable for protocol-style collaborators (connect → send → close).',
    hints: [
      'mock_calls includes child-method calls; call_args_list does not',
      'Build expected entries with call.method(args)',
      'Equality on the list asserts exact order',
    ],
    tieredHints: {
      apiSignature: 'call.method_name(*args, **kwargs) -> _Call',
      skeleton: `from unittest.mock import ____, call

client = ____()
client.connect()
client.send("hi")
client.close()

assert client.____ == [
    ____.connect(),
    ____.send("hi"),
    ____.close(),
]`,
    },
    tags: ['mock', 'mock_calls', 'call', 'ordering'],
    concepts: ['py-test-isolation'],
  },
  {
    id: 'py-adv-test-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_MOCKING,
    course: Course.BACKEND,
    question: 'When and why should you use `unittest.mock.patch` in tests?',
    options: [
      { id: 'a', text: 'To speed up tests by replacing all functions with no-ops', isCorrect: false },
      { id: 'b', text: 'To skip tests that are too hard to write — patch makes them always pass', isCorrect: false },
      { id: 'c', text: 'To replace external dependencies (API calls, database queries, file I/O) with controlled fakes, so tests are fast, deterministic, and don\'t require real infrastructure', isCorrect: true },
      { id: 'd', text: 'To test private methods by making them public temporarily', isCorrect: false },
    ],
    explanation: 'Mocking replaces real objects with controlled substitutes during testing. Use mock.patch when your code calls external services (APIs, databases, file systems, email) that are slow, unreliable, or have side effects. The mock returns predefined responses, letting you test YOUR code\'s logic in isolation. Key principle: mock at the boundary, not deep inside. Patch the import location, not the definition location (e.g., patch("mymodule.requests.get"), not "requests.get"). Overuse of mocking is a code smell — if you mock everything, you\'re testing nothing.',
    hints: [
      'Mock external dependencies, not your own code',
      'Patch where it\'s imported, not where it\'s defined',
      'Over-mocking means you\'re testing the mocks, not your code',
    ],
    tags: ['mock', 'patch', 'testing', 'isolation', 'dependencies'],
    concepts: ['py-test-isolation'],
  },
];
