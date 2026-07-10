/**
 * Topic.PY_CONTEXT_MANAGERS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pyContextManagersCloze.ts (10), pyContextManagersParsons.ts (10), pyContextManagersPredictOutput.ts (10), pythonAdvancedQuestions.ts (3), pythonBatchBExpansionQuestions.ts (10), pythonGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_context_managers_questions: Question[] = [
  {
      id: 'py-context-managers-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keyword that opens a context-managed block and the keyword that binds the value.',
      template: `___ open("data.txt") ___ f:
      print(f.read())`,
      blanks: ['with', 'as'],
      solution: 'with open("data.txt") as f:\n    print(f.read())',
      explanation:
        '`with` invokes the context-manager protocol; `as` binds the value returned by __enter__ (or yielded by a @contextmanager generator).',
      hints: ['Two keywords: opens the block, binds the value.'],
      tags: ['context-manager', 'with', 'as'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dunder pair that makes Block a context manager.',
      template: `class Block:
      def ___(self):
          return self
      def ___(self, exc_type, exc, tb):
          pass`,
      blanks: ['__enter__', '__exit__'],
      solution:
        'class Block:\n    def __enter__(self):\n        return self\n    def __exit__(self, exc_type, exc, tb):\n        pass',
      explanation:
        '__enter__ runs at the with line; __exit__ runs on block exit (also on exception). __exit__ takes 3 exception args; returning True suppresses.',
      hints: ['One dunder for entry, one for exit. Both have __ on each side.'],
      tags: ['context-manager', '__enter__', '__exit__'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the contextlib decorator that converts a generator into a context manager.',
      template: `from contextlib import ___

@___
def block():
    print("setup")
    yield
    print("teardown")`,
      blanks: ['contextmanager', 'contextmanager'],
      solution:
        'from contextlib import contextmanager\n\n@contextmanager\ndef block():\n    print("setup")\n    yield\n    print("teardown")',
      explanation:
        '@contextmanager turns a single-yield generator into a context-manager class. Code before yield is __enter__; the yielded value is what `as` captures; code after yield is __exit__.',
      hints: ['Same name imported and applied as a decorator.'],
      tags: ['context-manager', 'contextmanager-decorator'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keyword inside a @contextmanager generator that suspends and produces the value bound by `as`.',
      template: `from contextlib import contextmanager

@contextmanager
def make():
    setup_resource()
    ___ "ctx"
    cleanup_resource()`,
      blanks: ['yield'],
      solution:
        'from contextlib import contextmanager\n\n@contextmanager\ndef make():\n    setup_resource()\n    yield "ctx"\n    cleanup_resource()',
      explanation:
        'yield inside a @contextmanager generator is the suspension point that separates setup (before) from teardown (after). The yielded value is what the with-as binding captures.',
      hints: ['One keyword — the same one used in regular generators.'],
      tags: ['context-manager', 'yield'],
      concepts: ['py-context-manager-protocol', 'py-generator-yield'],
    },
  {
      id: 'py-context-managers-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the construct that guarantees teardown even when the body raises.',
      template: `from contextlib import contextmanager

@contextmanager
def session():
    open_db()
    ___:
        yield
    ___:
        close_db()`,
      blanks: ['try', 'finally'],
      solution:
        'from contextlib import contextmanager\n\n@contextmanager\ndef session():\n    open_db()\n    try:\n        yield\n    finally:\n        close_db()',
      explanation:
        'try/finally around yield ensures close_db() runs whether the body completes normally or raises. Without it, an exception in the body would skip cleanup — the production-version of the @contextmanager pattern.',
      hints: ['Two keywords for "always run cleanup".'],
      tags: ['context-manager', 'try-finally', 'cleanup'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the contextlib helper that swallows specific exception types.',
      template: `from contextlib import ___

with ___(KeyError):
    d = {}
    d["missing"]`,
      blanks: ['suppress', 'suppress'],
      solution:
        'from contextlib import suppress\n\nwith suppress(KeyError):\n    d = {}\n    d["missing"]',
      explanation:
        'contextlib.suppress is the clean replacement for `try: ...; except FooError: pass`. Pass one or more exception types; matches are silently swallowed.',
      hints: ['Single word; same as the verb meaning "silence".'],
      tags: ['context-manager', 'contextlib.suppress'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the return value that suppresses a caught exception in __exit__.',
      template: `class Swallow:
      def __enter__(self):
          return self
      def __exit__(self, exc_type, exc, tb):
          return ___`,
      blanks: ['True'],
      solution:
        'class Swallow:\n    def __enter__(self):\n        return self\n    def __exit__(self, exc_type, exc, tb):\n        return True',
      explanation:
        '__exit__ returning True (truthy) suppresses any exception that triggered the exit. Returning False, None, or omitting the return lets the exception propagate normally.',
      hints: ['Boolean truthy value for "swallow the exception".'],
      tags: ['context-manager', '__exit__', 'suppression'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the punctuation that separates two context managers in a single with-statement.',
      template: `with open("a.txt") as fa___ open("b.txt") as fb:
      print(fa.read(), fb.read())`,
      blanks: [','],
      solution:
        'with open("a.txt") as fa, open("b.txt") as fb:\n    print(fa.read(), fb.read())',
      explanation:
        'Comma separates multiple context managers in one with-statement. Equivalent to nested with-blocks. Don\'t use `and` (boolean operator, not a separator).',
      hints: ['Single punctuation character — same as in tuples and arg lists.'],
      tags: ['context-manager', 'multiple-managers'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the parameters __exit__ receives when an exception triggers the exit.',
      template: `def __exit__(self, ___, ___, ___):
      pass`,
      blanks: ['exc_type', 'exc', 'tb'],
      solution: 'def __exit__(self, exc_type, exc, tb):\n    pass',
      explanation:
        '__exit__ receives the exception type, the exception instance, and the traceback. On normal exit (no exception) all three are None. The names are conventional — Python passes them positionally.',
      hints: ['Three positional args: type, instance, traceback.'],
      tags: ['context-manager', '__exit__', 'parameters'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the contextlib helper that lets you stack a dynamic number of context managers.',
      template: `from contextlib import ___

with ___() as stack:
    for path in paths:
        f = stack.enter_context(open(path))`,
      blanks: ['ExitStack', 'ExitStack'],
      solution:
        'from contextlib import ExitStack\n\nwith ExitStack() as stack:\n    for path in paths:\n        f = stack.enter_context(open(path))',
      explanation:
        'ExitStack is for when the number of context managers isn\'t known at write time — e.g., opening N files chosen at runtime. enter_context() registers each manager; all get exited (in LIFO order) when the ExitStack exits.',
      hints: ['CamelCase: "Exit" + "Stack".'],
      tags: ['context-manager', 'ExitStack', 'dynamic'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a class-based context manager that prints "open" on enter and "close" on exit.',
      correctOrder: [
        'class Block:',
        '    def __enter__(self):',
        '        print("open")',
        '        return self',
        '    def __exit__(self, exc_type, exc, tb):',
        '        print("close")',
        '',
        'with Block():',
        '    print("inside")',
      ],
      distractorLines: [
        '    def open(self):',
        '    def close(self):',
      ],
      solution:
        'class Block:\n    def __enter__(self):\n        print("open")\n        return self\n    def __exit__(self, exc_type, exc, tb):\n        print("close")\n\nwith Block():\n    print("inside")',
      explanation:
        'A context manager defines __enter__ and __exit__ — these are the dunders `with` invokes. open()/close() are NOT a context manager — they\'re just methods. __exit__ takes three exception args (type, value, traceback).',
      hints: ['__enter__ runs at the with line; __exit__ runs at block exit.'],
      tags: ['context-manager', '__enter__', '__exit__'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build the same context manager using @contextlib.contextmanager and a generator.',
      correctOrder: [
        'from contextlib import contextmanager',
        '',
        '@contextmanager',
        'def block():',
        '    print("open")',
        '    yield',
        '    print("close")',
        '',
        'with block():',
        '    print("inside")',
      ],
      distractorLines: [
        '    return',
        '@contextmanager',
        'def block(self):',
      ],
      solution:
        'from contextlib import contextmanager\n\n@contextmanager\ndef block():\n    print("open")\n    yield\n    print("close")\n\nwith block():\n    print("inside")',
      explanation:
        'The decorator-based form: code BEFORE yield runs in __enter__, code AFTER yield runs in __exit__. The yield itself can produce a value bound by `as`. Returning instead of yielding makes it a regular function.',
      hints: ['Setup → yield → teardown. yield is the suspension point.'],
      tags: ['context-manager', 'contextmanager-decorator', 'generator'],
      concepts: ['py-context-manager-protocol', 'py-generator-yield'],
    },
  {
      id: 'py-context-managers-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a contextmanager-decorator version that performs cleanup even when the body raises, using try/finally around yield.',
      correctOrder: [
        'from contextlib import contextmanager',
        '',
        '@contextmanager',
        'def session():',
        '    print("open")',
        '    try:',
        '        yield',
        '    finally:',
        '        print("close")',
      ],
      distractorLines: [
        '    except:',
        '    yield',
      ],
      solution:
        'from contextlib import contextmanager\n\n@contextmanager\ndef session():\n    print("open")\n    try:\n        yield\n    finally:\n        print("close")',
      explanation:
        'Without try/finally, an exception in the body skips the cleanup code AFTER yield. try/finally guarantees the close runs on both normal exit and exception. This is the production-ready pattern.',
      hints: ['try/finally around yield is the production pattern.'],
      tags: ['context-manager', 'cleanup', 'try-finally'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Bind the context manager\'s value with `as`. block() yields the string "ctx"; bind it to v inside the with.',
      correctOrder: [
        'from contextlib import contextmanager',
        '',
        '@contextmanager',
        'def block():',
        '    yield "ctx"',
        '',
        'with block() as v:',
        '    print(v)',
      ],
      distractorLines: [
        'with block() = v:',
        '    yield ctx',
      ],
      solution:
        'from contextlib import contextmanager\n\n@contextmanager\ndef block():\n    yield "ctx"\n\nwith block() as v:\n    print(v)',
      explanation:
        'The value yielded by the generator (or returned by __enter__) is what `as` captures. `with block() as v` binds v to "ctx" for the duration of the block.',
      hints: ['as binds the yielded value.'],
      tags: ['context-manager', 'as-clause'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Make __exit__ swallow ValueError but propagate other exceptions.',
      correctOrder: [
        'class SwallowVE:',
        '    def __enter__(self):',
        '        return self',
        '    def __exit__(self, exc_type, exc, tb):',
        '        if exc_type is ValueError:',
        '            return True',
        '        return False',
      ],
      distractorLines: [
        '        return exc_type is ValueError',
        '        return None',
      ],
      solution:
        'class SwallowVE:\n    def __enter__(self):\n        return self\n    def __exit__(self, exc_type, exc, tb):\n        if exc_type is ValueError:\n            return True\n        return False',
      explanation:
        '__exit__ returning True suppresses the exception. Returning False (or None) lets it propagate. Returning the boolean condition directly (`return exc_type is ValueError`) also works, but the explicit form is clearer about the intent.',
      hints: ['True suppresses, False/None propagates.'],
      tags: ['context-manager', '__exit__', 'exception-suppression'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use multiple context managers in a single with statement: open two files, in and out.',
      correctOrder: [
        'with open("in.txt") as fin, open("out.txt", "w") as fout:',
        '    fout.write(fin.read())',
      ],
      distractorLines: [
        'with open("in.txt") as fin and open("out.txt", "w") as fout:',
        'with open("in.txt"), open("out.txt", "w") as fin, fout:',
      ],
      solution:
        'with open("in.txt") as fin, open("out.txt", "w") as fout:\n    fout.write(fin.read())',
      explanation:
        'Multiple context managers separated by commas in one `with` statement. Each gets its own `as` binding. They\'re entered left-to-right and exited right-to-left, regardless of nesting.',
      hints: ['Comma-separated context managers in a single with statement.'],
      tags: ['context-manager', 'multiple-managers'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a contextlib.suppress-style context manager: ignore FileNotFoundError raised inside the block.',
      correctOrder: [
        'from contextlib import suppress',
        '',
        'with suppress(FileNotFoundError):',
        '    open("missing.txt")',
      ],
      distractorLines: [
        'with FileNotFoundError as suppress:',
        '    try:',
        '        open("missing.txt")',
      ],
      solution:
        'from contextlib import suppress\n\nwith suppress(FileNotFoundError):\n    open("missing.txt")',
      explanation:
        'contextlib.suppress is the cleaner replacement for `try: ...; except FooError: pass`. It accepts one or more exception types and silently swallows them when raised inside the with-block.',
      hints: ['Drop-in replacement for try/except/pass.'],
      tags: ['context-manager', 'contextlib.suppress'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a "reentrant" context manager class that tracks how many times it\'s been entered.',
      correctOrder: [
        'class Reentrant:',
        '    def __init__(self):',
        '        self.depth = 0',
        '    def __enter__(self):',
        '        self.depth += 1',
        '        return self',
        '    def __exit__(self, exc_type, exc, tb):',
        '        self.depth -= 1',
      ],
      distractorLines: [
        '        self.depth = 1',
        '    def __enter__(self):',
        '        return Reentrant()',
      ],
      solution:
        'class Reentrant:\n    def __init__(self):\n        self.depth = 0\n    def __enter__(self):\n        self.depth += 1\n        return self\n    def __exit__(self, exc_type, exc, tb):\n        self.depth -= 1',
      explanation:
        'Increment on enter, decrement on exit, return self so `as` binds to the same instance. Setting depth to 1 (instead of incrementing) breaks reentrancy. Returning a new Reentrant from __enter__ would make `as v` bind to a different object than self.',
      hints: ['Increment/decrement around the body; return self for binding.'],
      tags: ['context-manager', 'reentrant', 'state'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a contextmanager that temporarily changes a config dict and restores it on exit.',
      correctOrder: [
        'from contextlib import contextmanager',
        '',
        '@contextmanager',
        'def temp_config(config, **overrides):',
        '    old = {k: config.get(k) for k in overrides}',
        '    config.update(overrides)',
        '    try:',
        '        yield config',
        '    finally:',
        '        config.update(old)',
      ],
      distractorLines: [
        '    config = overrides',
        '    yield',
      ],
      solution:
        'from contextlib import contextmanager\n\n@contextmanager\ndef temp_config(config, **overrides):\n    old = {k: config.get(k) for k in overrides}\n    config.update(overrides)\n    try:\n        yield config\n    finally:\n        config.update(old)',
      explanation:
        'Save the old values for the keys we\'re overriding, apply overrides, yield the live config, then restore via update(old). try/finally ensures restoration even on exceptions. Reassigning config locally would lose the caller\'s reference.',
      hints: ['Save old, apply, yield, restore in finally.'],
      tags: ['context-manager', 'temp-state', 'restore'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a context manager that times the wrapped block using `time.perf_counter` and prints the elapsed time on exit. Imports come first in this order: `import time`, then `from contextlib import contextmanager`.',
      correctOrder: [
        'import time',
        'from contextlib import contextmanager',
        '',
        '@contextmanager',
        'def timing():',
        '    start = time.perf_counter()',
        '    yield',
        '    print(time.perf_counter() - start)',
      ],
      distractorLines: [
        '    yield start',
        '    print(time.perf_counter())',
      ],
      solution:
        'import time\nfrom contextlib import contextmanager\n\n@contextmanager\ndef timing():\n    start = time.perf_counter()\n    yield\n    print(time.perf_counter() - start)',
      explanation:
        'Capture start before yield (setup); compute and print the delta after yield (teardown). time.perf_counter() alone (without subtraction) prints the absolute timestamp — meaningless without comparison.',
      hints: ['Capture start before yield; compute delta after.'],
      tags: ['context-manager', 'timing'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class Block:
    def __enter__(self):
        print("enter")
        return self
    def __exit__(self, *args):
        print("exit")

with Block():
    print("body")`,
      expectedOutput: `enter
body
exit`,
      explanation:
        '__enter__ runs at the top of the with, then the block body, then __exit__ at the end. This is the canonical setup/use/teardown shape.',
      hints: ['Setup, body, teardown.'],
      tags: ['context-manager', 'ordering'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class A:
    def __enter__(self):
        print("A in")
        return self
    def __exit__(self, *args):
        print("A out")

class B:
    def __enter__(self):
        print("B in")
        return self
    def __exit__(self, *args):
        print("B out")

with A() as a, B() as b:
    print("body")`,
      expectedOutput: `A in
B in
body
B out
A out`,
      explanation:
        'Multiple context managers in a single `with` enter LEFT-TO-RIGHT and exit RIGHT-TO-LEFT. Equivalent to nested `with` blocks. Innermost (B) exits first, then outermost (A).',
      hints: ['Multiple context managers: enter left to right, exit right to left.'],
      tags: ['context-manager', 'multiple-managers', 'ordering'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from contextlib import contextmanager

@contextmanager
def block():
    print("setup")
    yield 42
    print("teardown")

with block() as v:
    print(v)`,
      expectedOutput: `setup
42
teardown`,
      explanation:
        'In the @contextmanager pattern, code BEFORE yield runs in __enter__, the yielded value (42) is bound to v, and code AFTER yield runs in __exit__. So setup, then v=42 prints, then teardown.',
      hints: ['Before yield → setup; yielded value → as binding; after yield → teardown.'],
      tags: ['context-manager', 'contextmanager-decorator'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class Block:
    def __enter__(self):
        print("enter")
        return self
    def __exit__(self, exc_type, exc, tb):
        print("exit")
        return True

with Block():
    print("before raise")
    raise ValueError("boom")
print("after")`,
      expectedOutput: `enter
before raise
exit
after`,
      explanation:
        '__exit__ returning True suppresses the exception. Flow: enter, body runs until raise, __exit__ called with exception info, returns True so the ValueError is swallowed, "after" prints. Without the True return, ValueError would propagate and "after" wouldn\'t print.',
      hints: ['__exit__ returning True suppresses the exception.'],
      tags: ['context-manager', '__exit__', 'suppression'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from contextlib import contextmanager

@contextmanager
def block():
    print("setup")
    yield
    print("teardown")

try:
    with block():
        raise ValueError("boom")
except ValueError:
    print("caught")`,
      expectedOutput: `setup
caught`,
      explanation:
        'Without try/finally around yield, when an exception is raised in the body, the contextmanager generator gets the exception thrown into it at the yield point — and since there\'s no try/except inside the generator, the exception propagates and "teardown" never runs. The outer `except ValueError` then catches it.',
      hints: ['Missing try/finally around yield — what happens to teardown on exception?'],
      tags: ['context-manager', 'cleanup-bug', 'try-finally'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from contextlib import contextmanager

@contextmanager
def block():
    print("setup")
    try:
        yield
    finally:
        print("teardown")

try:
    with block():
        raise ValueError("boom")
except ValueError:
    print("caught")`,
      expectedOutput: `setup
teardown
caught`,
      explanation:
        'With try/finally around yield, the teardown ALWAYS runs — even on exception. The exception then propagates out of the with-block to the outer except. Order: setup, exception in body, finally runs teardown, exception bubbles up, caught.',
      hints: ['try/finally around yield guarantees cleanup even on exceptions.'],
      tags: ['context-manager', 'cleanup', 'try-finally'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from contextlib import suppress

with suppress(KeyError):
    d = {}
    print(d["missing"])
print("done")`,
      expectedOutput: `done`,
      explanation:
        'suppress(KeyError) silently swallows KeyError raised inside the block. The KeyError happens before print() can run on the missing key access, so nothing prints from inside the block. Then "done" prints normally.',
      hints: ['suppress eats the listed exception types.'],
      tags: ['context-manager', 'suppress'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class Block:
    def __enter__(self):
        return "value"
    def __exit__(self, *args):
        pass

with Block() as v:
    print(v)`,
      expectedOutput: `value`,
      explanation:
        '`as` binds whatever __enter__ returns. __enter__ returns the string "value", so v = "value" inside the block. (Note: returning self is just one common convention, not a requirement.)',
      hints: ['as captures the return value of __enter__.'],
      tags: ['context-manager', 'as-clause'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class Outer:
    def __enter__(self):
        print("Outer in")
        return self
    def __exit__(self, *args):
        print("Outer out")

class Inner:
    def __enter__(self):
        print("Inner in")
        return self
    def __exit__(self, *args):
        print("Inner out")

with Outer():
    with Inner():
        print("body")`,
      expectedOutput: `Outer in
Inner in
body
Inner out
Outer out`,
      explanation:
        'Nested `with` statements enter outer→inner and exit inner→outer. The order matches LIFO: most-recently-entered exits first. Same as comma-separated form, just visually different.',
      hints: ['Nested: outer enters first, exits last (LIFO).'],
      tags: ['context-manager', 'nested', 'ordering'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-context-managers-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from contextlib import contextmanager

@contextmanager
def double_yield():
    yield 1
    yield 2

with double_yield() as v:
    print(v)`,
      expectedOutput: `1`,
      explanation:
        'A @contextmanager generator must yield EXACTLY ONCE. The first yield runs as setup (binding v=1) and the body runs. On exit, the generator resumes and hits the second yield — at which point @contextmanager raises RuntimeError. But the body completes first, so "1" prints before the RuntimeError on exit.',
      hints: ['How many times must a @contextmanager generator yield?'],
      tags: ['context-manager', 'contextmanager-decorator', 'common-mistake'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-adv-ctx-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'You\'re profiling a slow request path and want a reusable `Timer` any block can wrap. Build it as a class-based context manager. The caller writes:\n\n```\nwith Timer("database query") as t:\n    run_the_query()\n\nprint(t.elapsed)  # 0.0123  (seconds, float)\n```\n\nContract:\n\n- `Timer(label: str = "block")` — before the block runs, `self.elapsed` is `0.0`.\n- On block exit (success OR exception), set `self.elapsed` to the block\'s duration in seconds (float) and print a single line of the form `f"[Timer] {label}: {elapsed:.4f}s"`.\n- Exceptions raised inside the block must propagate to the caller. The timer records and prints; it does NOT swallow the error.\n- The measurement must stay correct even if the system clock is adjusted mid-block (NTP step, DST change) — choose a clock with that guarantee.',
      starterCode: `import time

class Timer:
    ...
`,
      testCases: [
        {
          input: 'with Timer("test") as t: time.sleep(0.1)',
          expectedOutput: 't.elapsed approximately 0.1',
          description: 'Should measure elapsed time accurately',
        },
      ],
      solution: `import time

class Timer:
    """Context manager that times a code block."""

    def __init__(self, label: str = "block"):
        self.label = label
        self.elapsed: float = 0.0
        self._start: float = 0.0

    def __enter__(self):
        self._start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.elapsed = time.perf_counter() - self._start
        print(f"[Timer] {self.label}: {self.elapsed:.4f}s")
        return False  # Don't suppress exceptions
`,
      explanation: '__enter__ is called when entering the `with` block — it must return the value bound to the `as` variable (typically self). __exit__ is called when leaving the block, even if an exception occurred. It receives exception info (all None if no exception). Returning False (or None) lets exceptions propagate; returning True suppresses them. time.perf_counter() is preferred over time.time() for measuring durations because it uses the highest-resolution clock available and isn\'t affected by system clock adjustments.',
      hints: [
        '__enter__ returns self (the `as` variable)',
        '__exit__ receives exception info — return False to propagate',
        'time.perf_counter() for high-precision timing',
      ],
      tags: ['context-manager', 'enter', 'exit', 'timing', 'protocol'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-adv-ctx-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      question: 'Why are context managers important, and what problem do they solve compared to try/finally?',
      options: [
        { id: 'a', text: 'Context managers are faster than try/finally because they use C-level optimizations', isCorrect: false },
        { id: 'b', text: 'Context managers prevent all exceptions from propagating, making code crash-proof', isCorrect: false },
        { id: 'c', text: 'Context managers are only used for file I/O — try/finally is better for all other cleanup', isCorrect: false },
        { id: 'd', text: 'Context managers encapsulate resource setup/teardown into a reusable protocol, guaranteeing cleanup runs even on exceptions — eliminating the repetitive try/finally pattern', isCorrect: true },
      ],
      explanation: 'Context managers solve the resource management problem: ensuring cleanup (closing files, releasing locks, restoring state, deleting temp files) happens regardless of how a code block exits. While try/finally also guarantees cleanup, it requires manually writing setup and teardown code at every usage site. Context managers encapsulate this into a reusable object — `with open(f) as file` is shorter and less error-prone than `f = open(); try: ... finally: f.close()`. They work for any resource: database connections, network sockets, locks, temporary state changes, and more.',
      hints: [
        'Context managers guarantee __exit__ runs, like finally',
        'The key benefit is reusability and encapsulation',
      ],
      tags: ['context-manager', 'resource-management', 'cleanup', 'with'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-ctx-what',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      question: 'What does the `with` statement guarantee?',
      options: [
        { id: 'a', text: 'It catches every exception automatically', isCorrect: false },
        { id: 'b', text: 'That a paired setup / teardown runs regardless of HOW the block exits — normal completion OR exception. `__enter__` runs on entry, and `__exit__` ALWAYS runs on exit. Idiomatic for files, locks, DB connections, temp dirs, database transactions, anywhere resources need deterministic cleanup.', isCorrect: true },
        { id: 'c', text: 'That the block runs faster', isCorrect: false },
        { id: 'd', text: 'That variables inside the block are local', isCorrect: false },
      ],
      explanation: '`with X as y: BODY` is syntactic sugar for `y = X.__enter__(); try: BODY; finally: X.__exit__(exc_type, exc_val, tb)`. The `__exit__` method runs even if BODY raises. This is critical for not leaking file descriptors, sockets, locks, or open transactions. Cleanest alternative to nested try/finally blocks and the #1 way to write leak-free resource code.',
      hints: [
        'Equivalent to try/finally with __enter__ / __exit__',
        '__exit__ ALWAYS runs — on success AND on exception',
        'Resource guarantees = no leaked files, locks, connections',
      ],
      tags: ['context-manager', 'with', 'basics'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-ctx-file',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write the string `"hello"` to the file `/tmp/ctx.txt` inside a `with` block (opened in write mode) so the file is closed as soon as the block exits. Then, in a second `with` block, reopen the same path for reading and print its contents (expect `hello`). Both operations MUST use `with` — never call bare `open(...)` in new code.',
      starterCode: ``,
      testCases: [
        {
          input: 'with open context manager',
          expectedOutput: 'hello',
          description: 'File auto-closed on __exit__',
        },
      ],
      solution: `with open("/tmp/ctx.txt", "w") as f:
    f.write("hello")

with open("/tmp/ctx.txt") as f:
    print(f.read())`,
      explanation: 'File objects are the most-used context manager in Python. Without `with`, you\'d need `f = open(...); try: ... finally: f.close()`. Inside a `with`, the descriptor closes automatically even if the block raises. On Linux, leaked descriptors eventually hit the ulimit; on Windows they hold a lock preventing deletes. Always `with open` — never bare `open` in new code.',
      hints: [
        'with open(...) as f: closes f automatically',
        'Works on success and on exception',
        'Prevents file descriptor / lock leaks',
      ],
      tags: ['context-manager', 'with', 'file', 'open'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-ctx-custom-class',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a class-based context manager `Traced` by implementing the two dunder methods that make `with` work. The entry hook should print `"enter"` and return the instance (so the `as` variable is bound to it); the exit hook should print `"exit"`. In usage, write `with Traced() as t: print("inside")`. Expected output on three lines: `enter`, `inside`, `exit`.',
      starterCode: ``,
      testCases: [
        {
          input: 'class-based context manager',
          expectedOutput: 'enter\ninside\nexit',
          description: '__enter__ and __exit__ bracket the block',
        },
      ],
      solution: `class Traced:
    def __enter__(self):
        print("enter")
        return self

    def __exit__(self, exc_type, exc, tb):
        print("exit")

with Traced() as t:
    print("inside")`,
      explanation: '`__enter__` returns whatever the `as` binds to — usually `self`, sometimes a resource it manages. `__exit__` receives `(exc_type, exc_val, tb)` — all three are `None` on normal exit. Return `True` from `__exit__` to SUPPRESS the exception; return `False`/`None` to let it propagate. Use classes for stateful managers; use `@contextmanager` (next question) for most simple generator-based ones.',
      hints: [
        '__enter__ returns the "as" value',
        '__exit__ gets (exc_type, exc_val, tb); None on success',
        'Return True from __exit__ to suppress the exception',
      ],
      tags: ['context-manager', 'class-based', 'enter', 'exit'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-ctx-contextmanager-decorator',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a context manager called `timer` using the `contextlib` decorator that turns a generator into a context manager (much less boilerplate than the class form). The generator must print `"start"` on entry, `yield` control to the block, then print `"stop"` on exit. In usage, write `with timer(): print("work")`. Expected output on three lines: `start`, `work`, `stop`.',
      starterCode: `from contextlib import contextmanager
  `,
      testCases: [
        {
          input: 'generator-based context manager',
          expectedOutput: 'start\nwork\nstop',
          description: 'Code before yield = __enter__, after = __exit__',
        },
      ],
      solution: `from contextlib import contextmanager

@contextmanager
def timer():
    print("start")
    yield
    print("stop")

with timer():
    print("work")`,
      explanation: 'The `@contextmanager` decorator turns a generator function into a context manager. Everything before `yield` runs in `__enter__`; everything after runs in `__exit__`. To give a value to `with ... as`, `yield value`. To handle exceptions, wrap `yield` in try/except — the exception from the block propagates back through `yield`. Dramatically less ceremony than writing an `__enter__`/`__exit__` class.',
      hints: [
        'Exactly ONE yield per generator',
        'Before yield = enter; after yield = exit',
        'Use try/except around yield to handle block exceptions',
      ],
      tags: ['context-manager', 'contextmanager', 'generator', 'decorator'],
      concepts: ['py-context-manager-protocol', 'py-generator-yield', 'py-decorator-application'],
    },
  {
      id: 'py-ctx-multiple',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'First, seed two files using `with` blocks: write `"hello"` to `/tmp/a.txt` and `"world"` to `/tmp/b.txt` (each in its own `with open(..., "w")` block so the file closes on exit). Then open BOTH files for reading inside a SINGLE `with` statement using the comma-separated syntax `with open(A) as fa, open(B) as fb:` — Python treats that as nested `with` blocks, so both files are closed on exit even if either raises. Inside that `with`, print the two file contents joined by a single space (expect `hello world`).',
      starterCode: ``,
      testCases: [
        {
          input: 'multiple context managers in one with',
          expectedOutput: 'hello world',
          description: 'Comma-separated CMs are left-to-right setup, right-to-left teardown',
        },
      ],
      solution: `with open("/tmp/a.txt", "w") as f:
    f.write("hello")
with open("/tmp/b.txt", "w") as f:
    f.write("world")

with open("/tmp/a.txt") as fa, open("/tmp/b.txt") as fb:
    print(fa.read() + " " + fb.read())`,
      explanation: 'Comma syntax `with A as a, B as b:` is exactly equivalent to `with A as a: with B as b:` — both are entered, both are exited in reverse order. Clean way to manage two or three paired resources. For a DYNAMIC number of context managers (e.g. open N files determined at runtime), use `contextlib.ExitStack` (next question).',
      hints: [
        'Comma-separated CMs = nested with blocks (syntactic sugar)',
        'Python 3.10+ allows parenthesised form over multiple lines',
        'For a DYNAMIC number of CMs, use contextlib.ExitStack',
      ],
      tags: ['context-manager', 'multiple', 'with'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-ctx-suppress',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use the `contextlib` helper that swallows a specific exception class cleanly (cleaner than `try/except ...: pass`). Inside its `with` block, call `open("/tmp/does-not-exist.txt")` — scoped to `FileNotFoundError` so that specific exception is silently eaten. After the block, print `"done"` to prove execution continues past the swallowed error (expect `done`).',
      starterCode: `from contextlib import suppress
  `,
      testCases: [
        {
          input: 'contextlib.suppress swallows matching exception',
          expectedOutput: 'done',
          description: 'No try/except needed — cleaner one-liner',
        },
      ],
      solution: `from contextlib import suppress

with suppress(FileNotFoundError):
    open("/tmp/does-not-exist.txt")

print("done")`,
      explanation: '`suppress(*exceptions)` is a cleaner `try: ... except (X, Y): pass` for one-line skips. Use when you legitimately want to ignore a specific failure (e.g. "delete this file if it exists"). Don\'t use as a blanket `except Exception` silencer — you will miss real bugs. Pairs nicely with `contextlib.nullcontext()` when conditionally entering a context.',
      hints: [
        'suppress(A, B) = try/except (A, B): pass',
        'Only swallows matching exceptions — others propagate',
        'Clean one-liner for "if exists, ignore"-style logic',
      ],
      tags: ['contextlib', 'suppress', 'exception'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-ctx-exitstack',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'First, seed two files using `with` blocks: write `"A"` to `/tmp/ex1.txt` and `"B"` to `/tmp/ex2.txt` (each in its own `with open(..., "w")` block). Then use the `contextlib` helper that lets you enter a DYNAMIC number of context managers at runtime (not known at compile time). Inside its `with` block, open both files by registering each `open()` call with the stack so every file is closed at the block exit. Print the concatenation of both files\' contents (expect `AB`).',
      starterCode: `from contextlib import ExitStack
  `,
      testCases: [
        {
          input: 'ExitStack for N dynamic CMs',
          expectedOutput: 'AB',
          description: 'enter_context registers for cleanup',
        },
      ],
      solution: `with open("/tmp/ex1.txt", "w") as f:
    f.write("A")
with open("/tmp/ex2.txt", "w") as f:
    f.write("B")

from contextlib import ExitStack

with ExitStack() as stack:
    files = [stack.enter_context(open(p)) for p in ["/tmp/ex1.txt", "/tmp/ex2.txt"]]
    print("".join(f.read() for f in files))`,
      explanation: '`ExitStack` lets you enter arbitrary numbers of context managers at runtime and tears them all down at the end. `.enter_context(cm)` enters a CM and registers its `__exit__` on the stack; `.callback(fn)` registers an arbitrary teardown. Essential for composing CMs whose count isn\'t known at compile time — merging multiple files, opening N database connections, holding N locks.',
      hints: [
        'stack.enter_context(cm) enters cm and registers teardown',
        'stack.callback(fn) registers an arbitrary teardown',
        'All teardowns run on ExitStack exit in reverse order',
      ],
      tags: ['contextlib', 'ExitStack', 'dynamic'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-ctx-exitstack-parsons',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Open every path in `paths` with `ExitStack` so every file closes when the block exits. Collect the opened file objects into a list called `files`.',
      correctOrder: [
        'from contextlib import ExitStack',
        '',
        'paths = ["a.txt", "b.txt"]',
        'with ExitStack() as stack:',
        '    files = [stack.enter_context(open(p)) for p in paths]',
      ],
      distractorLines: [
        '    files = [stack.add(open(p)) for p in paths]',
        '    files = [open(p) for p in paths]',
      ],
      solution:
        'from contextlib import ExitStack\n\npaths = ["a.txt", "b.txt"]\nwith ExitStack() as stack:\n    files = [stack.enter_context(open(p)) for p in paths]',
      explanation:
        '`stack.enter_context(cm)` enters the context manager AND registers its `__exit__` on the stack — that registration is what makes the cleanup happen. Calling `open(p)` without `enter_context` would leak the descriptors. The method is `enter_context`, not `add` or `push`.',
      hints: ['Method is `enter_context`, not `add` or `push`.'],
      tags: ['contextlib', 'ExitStack', 'dynamic'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-ctx-exitstack-vs-comma',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      question:
        'When should you reach for `contextlib.ExitStack` instead of comma-syntax `with A as a, B as b:`?',
      options: [
        { id: 'a', text: 'When the NUMBER of context managers is not known until runtime — e.g. opening one file per path in a list whose length varies. Comma syntax fixes the count at the point the code is written.', isCorrect: true },
        { id: 'b', text: 'When you need faster setup, because ExitStack allocates the cleanup callbacks in a single contiguous list rather than nesting them, giving a measurable per-CM speedup over the comma form.', isCorrect: false },
        { id: 'c', text: 'When you want exceptions inside the block to be suppressed automatically — ExitStack swallows every exception, while comma syntax always lets them propagate to the caller above.', isCorrect: false },
        { id: 'd', text: 'When targeting Python 3.10 or newer, since the comma-syntax multi-manager form has been deprecated for new code in favour of ExitStack for ALL multi-CM scenarios.', isCorrect: false },
      ],
      explanation:
        'Comma syntax `with A as a, B as b:` only works when you know every context manager at the time you write the code. The moment the count or identity comes from runtime data — N files from a list, a configurable number of DB connections — you need `ExitStack`. `stack.enter_context(cm)` builds the teardown chain dynamically; all `__exit__`s run in LIFO order when the stack exits, the same guarantees as the comma form, just composed at runtime. Neither form is faster or more exception-suppressing than the other; comma syntax is not deprecated.',
      hints: [
        'Comma syntax needs the CM list known at write time',
        'ExitStack is for runtime-determined N',
        'Both compose teardown in LIFO order',
      ],
      tags: ['contextlib', 'ExitStack', 'multiple', 'design'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-ctx-exit-suppress-exc',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a class-based context manager `IgnoreValueError` whose entry hook returns `self`, and whose exit hook suppresses any `ValueError` raised inside the block by returning a truthy value (while letting other exceptions propagate). In usage, `with IgnoreValueError(): raise ValueError("oops")` should swallow the error; printing `"after"` afterwards must still execute. Expected output: `after`.',
      starterCode: ``,
      testCases: [
        {
          input: '__exit__ returning True to swallow',
          expectedOutput: 'after',
          description: 'Return True → exception suppressed',
        },
      ],
      solution: `class IgnoreValueError:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return exc_type is ValueError

with IgnoreValueError():
    raise ValueError("oops")

print("after")`,
      explanation: 'Return value from `__exit__` determines exception propagation: truthy → swallowed, falsy/None → propagates. Use sparingly — swallowing exceptions hides bugs. Legitimate cases: custom retry wrappers, domain-specific "not found is OK" semantics, test utilities. Never return `True` blindly — always gate on `exc_type`. The common `contextlib.suppress` is essentially this pattern generalised.',
      hints: [
        '__exit__ return True → swallow; return False/None → propagate',
        'Always gate on exc_type — never blanket True',
        'Use sparingly; prefer explicit except where possible',
      ],
      tags: ['context-manager', 'exit', 'exception-handling'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-ctx-vs-try-finally',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      question: 'Why reach for a context manager instead of a `try`/`finally`?',
      options: [
        { id: 'a', text: 'They are always equivalent — purely stylistic', isCorrect: false },
        { id: 'b', text: 'A context manager encapsulates the setup/teardown pair in ONE object you can name, reuse, and compose. Callers just write `with X():` — no risk of forgetting `finally`. A bare `try/finally` works, but every caller must rewrite the cleanup code and can skip it by accident.', isCorrect: true },
        { id: 'c', text: '`try/finally` is deprecated', isCorrect: false },
        { id: 'd', text: 'Context managers are ~10× faster at runtime', isCorrect: false },
      ],
      explanation: 'The core benefit is ENCAPSULATION. Once you write `timed_db_connection()` as a context manager, every caller gets guaranteed connect/disconnect with timing without the risk of forgetting the `finally` clause. This is why the Python standard library is full of them: `open`, `threading.Lock`, `tempfile.TemporaryDirectory`, `contextlib.suppress`, `asyncpg.Connection`. Libraries that skip this force every caller to rewrite cleanup logic.',
      hints: [
        'CM = named, reusable, composable setup/teardown pair',
        'try/finally works but gets repeated everywhere',
        'CMs compose (comma, ExitStack); try/finally nests uglily',
      ],
      tags: ['context-manager', 'try-finally', 'design'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-ctx-reentrant',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a generator-based context manager `safe_section(label)` using the `contextlib` decorator. On entry, print `f"[{label}] enter"`. The yielded body must run inside a try/except that catches any `Exception` and prints `f"[{label}] caught {type(e).__name__}"`, and a finally clause must print `f"[{label}] exit"` unconditionally. In usage, `with safe_section("A"): raise ValueError("x")` should produce three lines: `[A] enter`, `[A] caught ValueError`, `[A] exit`.',
      starterCode: `from contextlib import contextmanager
  `,
      testCases: [
        {
          input: 'CM that handles exceptions from the block',
          expectedOutput: '[A] enter\n[A] caught ValueError\n[A] exit',
          description: 'try/except around yield catches block exceptions',
        },
      ],
      solution: `from contextlib import contextmanager

@contextmanager
def safe_section(label):
    print(f"[{label}] enter")
    try:
        yield
    except Exception as e:
        print(f"[{label}] caught {type(e).__name__}")
    finally:
        print(f"[{label}] exit")

with safe_section("A"):
    raise ValueError("x")`,
      explanation: 'Inside a `@contextmanager` generator, exceptions from the `with` block resurface at the `yield` expression. A `try/except` around `yield` catches them; not re-raising (or re-raising something else) swallows / transforms the exception. `finally` runs the exit code regardless. Use for domain-specific error policies: "retry once on X", "log and continue on transient errors", "translate internal exceptions to a public API".',
      hints: [
        'Exception from the with-block resurfaces at yield',
        'try/except around yield to handle it',
        'finally for unconditional teardown',
      ],
      tags: ['context-manager', 'contextmanager', 'exception-handling'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-gap-contextmgr-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      question: 'What is a context manager in Python?',
      options: [
        { id: 'a', text: 'A design pattern for managing global variables across multiple modules', isCorrect: false },
        { id: 'b', text: 'An object that defines setup and cleanup actions using the `with` statement. It guarantees cleanup runs even if an error occurs. Most common example: `with open(file) as f:` — the file is always closed.', isCorrect: true },
        { id: 'c', text: 'A tool that manages the execution context of threads in multithreaded programs', isCorrect: false },
        { id: 'd', text: 'A Python IDE feature that tracks which variables are in scope at any point', isCorrect: false },
      ],
      explanation: 'A context manager handles setup and teardown of resources automatically. When you write `with open("file.txt") as f:`, Python calls the file\'s `__enter__` method (opens the file), gives you the file object as `f`, and guarantees `__exit__` runs when the `with` block ends (closes the file) — even if an exception occurs inside the block. This prevents resource leaks.',
      hints: [
        'The `with` keyword is the telltale sign of a context manager',
        'Think "automatic cleanup" — the resource is always properly released',
      ],
      tags: ['context-managers', 'with', 'resources', 'basics'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-gap-contextmgr-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CONTEXT_MANAGERS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Show two equivalent ways to read `example.txt` into a variable called `content`, both guaranteeing the file is closed even if the read raises:\n\n1. **WITHOUT a context manager** — using `try`/`finally`.\n2. **WITH a context manager**.\n\nWrite both approaches in the same file, one after the other.',
      starterCode: `# Approach 1: WITHOUT context manager (try/finally)


# Approach 2: WITH context manager
`,
      testCases: [
        {
          input: 'with open("example.txt") as f: content = f.read()',
          expectedOutput: 'File is opened, read, and automatically closed',
          description: 'Context manager version should be clean and safe',
        },
      ],
      solution: `# Approach 1: WITHOUT context manager (try/finally)
f = open("example.txt", "r")
try:
    content = f.read()
finally:
    f.close()

# Approach 2: WITH context manager
with open("example.txt", "r") as f:
    content = f.read()`,
      explanation: 'Both approaches guarantee the file is closed, but the `with` statement is cleaner and less error-prone. In Approach 1, if you forget the `finally` block, an exception would leave the file open (a resource leak). The `with` statement makes proper cleanup automatic. Context managers work with files, database connections, locks, network sockets, and many other resources.',
      hints: [
        'Approach 1 needs `try/finally` to guarantee `f.close()` runs',
        'Approach 2 uses `with open(...) as f:` — cleanup is automatic',
        'Both are equivalent, but `with` is the Pythonic way',
      ],
      tags: ['context-managers', 'with', 'files', 'try-finally', 'basics'],
      concepts: ['py-context-manager-protocol', 'py-try-finally-ordering'],
    },
];
