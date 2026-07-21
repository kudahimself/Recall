/**
 * Topic.PY_FUNCTIONS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendQuestions.ts (3), pyFunctionsCloze.ts (10), pyFunctionsParsons.ts (10), pyFunctionsPredictOutput.ts (10), pythonAdvOopQuestions.ts (3), pythonEssentialsQuestions.ts (9), pythonGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_functions_questions: Question[] = [
  {
      id: 'py-fn-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function "apply_discount" that takes a price and an optional discount percentage (default 10%). Return the discounted price.',
      starterCode: `def apply_discount(price, discount=`,
      testCases: [
        {
          input: '100, 20',
          expectedOutput: 'price * (1 - discount / 100)',
          description: 'Should apply discount with default',
        },
      ],
      solution: `def apply_discount(price, discount=10):\n    return price * (1 - discount / 100)`,
      explanation: 'Default parameter values make arguments optional. apply_discount(100) uses 10%, apply_discount(100, 20) uses 20%. IMPORTANT: never use mutable defaults (like def f(items=[]) — use None instead).',
      hints: ['Use = for default values in parameters', 'Never use mutable objects as defaults'],
      tieredHints: {
        apiSignature: 'def func(pos_param, kw_param=default_value):',
        skeleton: `def apply_discount(price, discount=____):
    ____ price ____ (____ - discount ____ ____)`,
      },
      tags: ['functions', 'default-params', 'python'],
      concepts: ['py-default-arg-evaluation'],
    },
  {
      id: 'py-fn-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function "process_items" that accepts any number of positional arguments (*args) and any number of keyword arguments (**kwargs), and returns a dict with keys "items" (list of args) and "options" (dict of kwargs).',
      starterCode: `def process_items(*args, **kwargs):\n`,
      testCases: [
        {
          input: 'mixed args and kwargs',
          expectedOutput: '{"items": list(args), "options": kwargs}',
          description: 'Should handle *args and **kwargs',
        },
      ],
      solution: `def process_items(*args, **kwargs):\n    return {"items": list(args), "options": kwargs}`,
      explanation: '*args collects positional arguments into a tuple. **kwargs collects keyword arguments into a dict. process_items(1, 2, 3, color="red") returns {"items": [1, 2, 3], "options": {"color": "red"}}.',
      hints: ['*args is a tuple of positional args', '**kwargs is a dict of keyword args'],
      tieredHints: {
        apiSignature: 'list(iterable) -> list',
        skeleton: `def process_items(*args, **kwargs):
    ____ {"____": ____(args), "____": ____}`,
      },
      tags: ['args', 'kwargs', 'functions', 'python'],
      concepts: ['py-args-kwargs'],
    },
  {
      id: 'py-fn-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a lambda function that takes two numbers `x` and `y` and returns their sum. Assign it to variable `add`.',
      starterCode: `# Lambda function\nadd = `,
      testCases: [
        {
          input: '3, 5',
          expectedOutput: 'lambda x, y: x + y',
          description: 'Should create lambda for addition',
        },
      ],
      solution: `add = lambda x, y: x + y`,
      explanation: 'Lambda creates anonymous inline functions: lambda params: expression. Useful for short callbacks (sorted(items, key=lambda x: x.name)). For anything complex, use a regular def function.',
      hints: ['lambda parameters: expression', 'Can only contain a single expression'],
      tieredHints: {
        apiSignature: 'lambda param1, param2: expression',
        skeleton: `add = ____ x, y: ____ ____ ____`,
      },
      tags: ['lambda', 'functions', 'python'],
      concepts: ['py-function-as-value'],
    },
  {
      id: 'py-functions-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keyword that lets an inner function rebind a variable from the enclosing function scope.',
      template: `def make_counter():
      count = 0
      def inc():
          ___ count
          count += 1
          return count
      return inc`,
      blanks: ['nonlocal'],
      solution:
        'def make_counter():\n    count = 0\n    def inc():\n        nonlocal count\n        count += 1\n        return count\n    return inc',
      explanation:
        'nonlocal targets the nearest enclosing function scope (not module-level). Without it, count += 1 would create a new local in inc and raise UnboundLocalError on the read.',
      hints: ['Three syllables; "non" + "local".'],
      tags: ['functions', 'nonlocal', 'closure'],
      concepts: ['py-closure-capture'],
    },
  {
      id: 'py-functions-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the * and ** prefixes to accept variable positional and keyword args.',
      template: `def forward(___args, ___kwargs):
      print(args, kwargs)`,
      blanks: ['*', '**'],
      solution: 'def forward(*args, **kwargs):\n    print(args, kwargs)',
      explanation:
        '*args packs leftover positional args into a tuple; **kwargs packs leftover keyword args into a dict. The names args/kwargs are convention; the * and ** are required.',
      hints: ['One asterisk for positional, two for keyword.'],
      tags: ['functions', 'args-kwargs'],
      concepts: ['py-args-kwargs'],
    },
  {
      id: 'py-functions-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keyword that creates an anonymous inline function.',
      template: `pairs.sort(key=___ p: p[1])`,
      blanks: ['lambda'],
      solution: 'pairs.sort(key=lambda p: p[1])',
      explanation:
        'lambda creates an anonymous function. Syntax: `lambda parameters: expression`. Limited to a single expression — no statements. For multi-statement logic, use def.',
      hints: ['Six letters; same name as the Greek letter.'],
      tags: ['functions', 'lambda'],
      concepts: ['py-function-as-value'],
    },
  {
      id: 'py-functions-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the separator that marks the following parameters as keyword-only.',
      template: `def connect(host, ___, port=5432, ssl=True):
      pass`,
      blanks: ['*'],
      solution: 'def connect(host, *, port=5432, ssl=True):\n    pass',
      explanation:
        'A bare * in the parameter list separates positional-or-keyword params (left) from keyword-only params (right). Callers must use port=... and ssl=...; passing them positionally raises TypeError.',
      hints: ['Single character; same one used to pack args.'],
      tags: ['functions', 'keyword-only'],
      concepts: ['py-args-kwargs'],
    },
  {
      id: 'py-functions-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the separator (Python 3.8+) that marks preceding params as positional-only.',
      template: `def divide(a, b, ___):
      return a / b`,
      blanks: ['/'],
      solution: 'def divide(a, b, /):\n    return a / b',
      explanation:
        'A / in the parameter list marks all preceding params as positional-only. Callers can\'t use a=10, b=2 — they must pass positionally. PEP 570 (Python 3.8+).',
      hints: ['Single character; the division/path separator.'],
      tags: ['functions', 'positional-only'],
      concepts: ['py-args-kwargs'],
    },
  {
      id: 'py-functions-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keyword that turns a function into a generator.',
      template: `def squares(n):
      for i in range(n):
          ___ i * i`,
      blanks: ['yield'],
      solution: 'def squares(n):\n    for i in range(n):\n        yield i * i',
      explanation:
        'yield turns a function into a generator. Calling the function returns a generator object that produces values lazily. return ends iteration; yield suspends and resumes.',
      hints: ['Five letters; same word as the verb meaning "produce".'],
      tags: ['functions', 'generator', 'yield'],
      concepts: ['py-generator-yield'],
    },
  {
      id: 'py-functions-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the functools tool that pre-fills arguments to a function.',
      template: `from functools import ___

def power(base, exp):
    return base ** exp

square = ___(power, exp=2)`,
      blanks: ['partial', 'partial'],
      solution:
        'from functools import partial\n\ndef power(base, exp):\n    return base ** exp\n\nsquare = partial(power, exp=2)',
      explanation:
        'functools.partial returns a new callable with some arguments pre-bound. Pass the function (uncalled) plus the args/kwargs to fix.',
      hints: ['Seven letters; same as the adjective for "incomplete".'],
      tags: ['functions', 'partial'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functions-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the functools decorator that memoizes a function.',
      template: `from functools import ___

@___(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)`,
      blanks: ['lru_cache', 'lru_cache'],
      solution:
        'from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)',
      explanation:
        'lru_cache memoizes calls keyed by argument tuples. maxsize=None means unbounded. functools.cache (3.9+) is shorthand for lru_cache(maxsize=None).',
      hints: ['Three letters + underscore + word: "lru" + "_cache".'],
      tags: ['functions', 'lru_cache', 'memoization'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functions-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the safe sentinel pattern: avoid mutable default args by using ___ and creating the list inside.',
      template: `def add_item(item, items=___):
      if items is ___:
          items = []
      items.append(item)
      return items`,
      blanks: ['None', 'None'],
      solution:
        'def add_item(item, items=None):\n    if items is None:\n        items = []\n    items.append(item)\n    return items',
      explanation:
        'Using None as the default avoids the mutable-default-arg trap. Default args evaluate ONCE at definition time — a default of [] is shared across all calls. None is immutable, so the sentinel pattern is safe.',
      hints: ['The Python null/missing value.'],
      tags: ['functions', 'mutable-default', 'sentinel'],
      concepts: ['py-mutable-default-arg'],
    },
  {
      id: 'py-functions-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the default-arg trick that captures the loop var i at definition time, fixing the late-binding closure bug.',
      template: `fns = [lambda ___=___: print(i) for i in range(3)]`,
      blanks: ['i', 'i'],
      solution: 'fns = [lambda i=i: print(i) for i in range(3)]',
      explanation:
        'lambda i=i: ... binds the LEFT i (param) to the value of the RIGHT i (loop var) at definition time. This freezes each lambda\'s i to its iteration value, sidestepping closure late-binding.',
      hints: ['Same name as parameter and as the loop var.'],
      tags: ['functions', 'closure', 'late-binding'],
      concepts: ['py-closure-capture'],
    },
  {
      id: 'py-functions-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define an append function that uses None as a sentinel default to avoid the mutable-default-arg trap.',
      correctOrder: [
        'def add_item(item, items=None):',
        '    if items is None:',
        '        items = []',
        '    items.append(item)',
        '    return items',
      ],
      distractorLines: [
        'def add_item(item, items=[]):',
        '    items.append(item)',
        '    return items',
      ],
      solution:
        'def add_item(item, items=None):\n    if items is None:\n        items = []\n    items.append(item)\n    return items',
      explanation:
        'Default arg values are evaluated ONCE at function-definition time. Using items=[] shares ONE list across all calls — successive calls see the previous additions. The None-sentinel pattern lazily creates a fresh list per call.',
      hints: ['Mutable default args share state. Use None and check inside.'],
      tags: ['functions', 'default-args', 'mutable-default'],
      concepts: ['py-default-arg-evaluation', 'py-mutable-default-arg'],
    },
  {
      id: 'py-functions-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a function that accepts any positional and keyword args and forwards them to print.',
      correctOrder: [
        'def forward(*args, **kwargs):',
        '    print(*args, **kwargs)',
        '',
        'forward("a", "b", sep=", ")',
      ],
      distractorLines: [
        'def forward(args, kwargs):',
        '    print(args, kwargs)',
      ],
      solution:
        'def forward(*args, **kwargs):\n    print(*args, **kwargs)\n\nforward("a", "b", sep=", ")',
      explanation:
        '*args packs positional args into a tuple; **kwargs packs keyword args into a dict. To forward them, use the SAME * and ** when calling — this UNPACKS them back. Without unpacking, you\'d pass the tuple/dict as single arguments.',
      hints: ['*/** pack in the signature, unpack in the call.'],
      tags: ['functions', 'args-kwargs', 'forwarding'],
      concepts: ['py-args-kwargs'],
    },
  {
      id: 'py-functions-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use a closure to build a counter that increments on each call and remembers state.',
      correctOrder: [
        'def make_counter():',
        '    count = 0',
        '    def increment():',
        '        nonlocal count',
        '        count += 1',
        '        return count',
        '    return increment',
        '',
        'c = make_counter()',
        'print(c(), c(), c())',
      ],
      distractorLines: [
        '    global count',
        '    count = 0',
        '    def increment():',
        '        count += 1',
      ],
      solution:
        'def make_counter():\n    count = 0\n    def increment():\n        nonlocal count\n        count += 1\n        return count\n    return increment\n\nc = make_counter()\nprint(c(), c(), c())',
      explanation:
        'nonlocal lets the inner function REBIND a variable from the enclosing function scope. Without nonlocal, count += 1 would create a new local in increment and raise UnboundLocalError on the read. global wouldn\'t apply — count is in the enclosing function, not module-level.',
      hints: ['nonlocal for enclosing-function vars; global for module-level.'],
      tags: ['functions', 'closure', 'nonlocal'],
      concepts: ['py-closure-capture'],
    },
  {
      id: 'py-functions-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a connect function with keyword-only args using the * separator.',
      correctOrder: [
        'def connect(host, *, port=5432, ssl=True):',
        '    print(host, port, ssl)',
        '',
        'connect("localhost", port=80, ssl=False)',
      ],
      distractorLines: [
        'def connect(host, port=5432, ssl=True):',
        'connect("localhost", 80, False)',
      ],
      solution:
        'def connect(host, *, port=5432, ssl=True):\n    print(host, port, ssl)\n\nconnect("localhost", port=80, ssl=False)',
      explanation:
        'A bare * in the parameter list marks all following params as keyword-only — they can\'t be passed positionally. This makes call sites self-documenting and prevents accidental swaps when args have similar types.',
      hints: ['Bare * separator marks keyword-only parameters.'],
      tags: ['functions', 'keyword-only', 'PEP-3102'],
      concepts: ['py-args-kwargs'],
    },
  {
      id: 'py-functions-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a function that takes positional-only args using the / separator (Python 3.8+).',
      correctOrder: [
        'def divide(a, b, /):',
        '    return a / b',
        '',
        'print(divide(10, 2))',
      ],
      distractorLines: [
        'def divide(a, b):',
        'print(divide(a=10, b=2))',
        'def divide(/, a, b):',
      ],
      solution:
        'def divide(a, b, /):\n    return a / b\n\nprint(divide(10, 2))',
      explanation:
        'A / in the parameter list marks all PRECEDING params as positional-only. This is the inverse of * (keyword-only). Useful when you want to lock the param names as implementation detail (so renaming them is non-breaking).',
      hints: ['/ separator marks preceding params as positional-only.'],
      tags: ['functions', 'positional-only', 'PEP-570'],
      concepts: ['py-args-kwargs'],
    },
  {
      id: 'py-functions-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use a lambda as the key argument to sort tuples by their second element.',
      correctOrder: [
        'pairs = [("b", 2), ("a", 3), ("c", 1)]',
        'pairs.sort(key=lambda p: p[1])',
        'print(pairs)',
      ],
      distractorLines: [
        'pairs.sort(key=lambda p: p[0])',
        'pairs.sort(lambda p: p[1])',
      ],
      solution:
        'pairs = [("b", 2), ("a", 3), ("c", 1)]\npairs.sort(key=lambda p: p[1])\nprint(pairs)',
      explanation:
        'lambda creates an inline anonymous function. p[1] is the second element of each tuple. key= must be passed as a keyword (TypeError otherwise). For named-attribute access on objects, operator.itemgetter or attrgetter are faster than lambdas.',
      hints: ['key=lambda is the canonical pattern; the index picks the element.'],
      tags: ['functions', 'lambda', 'key'],
      concepts: ['py-function-as-value'],
    },
  {
      id: 'py-functions-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a generator function `squares(n)` that lazily yields `i * i` for each `i` in `0..n-1` using `yield` (no list built internally). Then drive it: loop over `squares(4)` and print each value on its own line.',
      correctOrder: [
        'def squares(n):',
        '    for i in range(n):',
        '        yield i * i',
        '',
        'for s in squares(4):',
        '    print(s)',
      ],
      distractorLines: [
        '    return i * i',
        'def squares(n):',
        '    return [i * i for i in range(n)]',
      ],
      solution:
        'def squares(n):\n    for i in range(n):\n        yield i * i\n\nfor s in squares(4):\n    print(s)',
      explanation:
        'A function with yield is a GENERATOR — calling it returns a generator object that lazily produces values. return inside a generator stops iteration (StopIteration); using return INSTEAD of yield makes it a regular function.',
      hints: ['yield makes it a generator; return ends iteration.'],
      tags: ['functions', 'generator', 'yield'],
      concepts: ['py-generator-yield'],
    },
  {
      id: 'py-functions-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use functools.partial to bind the first argument of a 2-arg function.',
      correctOrder: [
        'from functools import partial',
        '',
        'def power(base, exp):',
        '    return base ** exp',
        '',
        'square = partial(power, exp=2)',
        'print(square(5))',
      ],
      distractorLines: [
        'square = partial(power(exp=2))',
        'square = power.partial(exp=2)',
      ],
      solution:
        'from functools import partial\n\ndef power(base, exp):\n    return base ** exp\n\nsquare = partial(power, exp=2)\nprint(square(5))',
      explanation:
        'functools.partial pre-fills some arguments and returns a new callable. Pass the function FIRST (uncalled), then the args to fix. partial(power(exp=2)) would call power with no `base`, raising TypeError immediately.',
      hints: ['Pass the function uncalled, then the args to bind.'],
      tags: ['functions', 'partial', 'functools'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functions-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a list of 3 lambdas that capture i correctly using a default arg, so each prints its own number.',
      correctOrder: [
        'fns = [lambda i=i: print(i) for i in range(3)]',
        'for fn in fns:',
        '    fn()',
      ],
      distractorLines: [
        'fns = [lambda: print(i) for i in range(3)]',
        'fns = [lambda i: print(i) for i in range(3)]',
      ],
      solution:
        'fns = [lambda i=i: print(i) for i in range(3)]\nfor fn in fns:\n    fn()',
      explanation:
        'Closures capture variables by REFERENCE, not value. lambda: print(i) all see the SAME i (which ends at 2 after the loop), so all three print 2. The lambda i=i: trick captures the current value of i as a default arg at definition time, freezing it.',
      hints: ['Default args are bound at definition time — use that to freeze loop vars.'],
      tags: ['functions', 'closure', 'late-binding'],
      concepts: ['py-closure-capture'],
    },
  {
      id: 'py-functions-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use functools.lru_cache to memoize a recursive Fibonacci function.',
      correctOrder: [
        'from functools import lru_cache',
        '',
        '@lru_cache(maxsize=None)',
        'def fib(n):',
        '    if n < 2:',
        '        return n',
        '    return fib(n - 1) + fib(n - 2)',
        '',
        'print(fib(20))',
      ],
      distractorLines: [
        '@lru_cache',
        '    return fib(n - 1) + fib(n - 1)',
      ],
      solution:
        'from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(20))',
      explanation:
        'lru_cache memoizes calls keyed by argument tuples. Decorator must be CALLED — @lru_cache without parens is a Python 3.8+ shortcut, but @lru_cache(maxsize=None) is the explicit canonical form. functools.cache (3.9+) is a sugar for lru_cache(maxsize=None).',
      hints: ['Apply with parens for the explicit form: @lru_cache(maxsize=None).'],
      tags: ['functions', 'lru_cache', 'memoization'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functions-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def add(item, items=[]):
    items.append(item)
    return items

print(add(1))
print(add(2))
print(add(3))`,
      expectedOutput: `[1]
[1, 2]
[1, 2, 3]`,
      explanation:
        'The mutable-default-argument trap: the default list is created ONCE at function-definition time and is REUSED across all calls. So each call appends to the same shared list. Use items=None and check inside the function.',
      hints: ['Default args are evaluated once at definition time. What does that mean for a list?'],
      tags: ['functions', 'mutable-default', 'common-mistake'],
      concepts: ['py-mutable-default-arg'],
    },
  {
      id: 'py-functions-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `fns = [lambda: i for i in range(3)]
for fn in fns:
    print(fn())`,
      expectedOutput: `2
2
2`,
      explanation:
        'Late-binding closure: each lambda captures the VARIABLE i, not its current value. By the time the lambdas are called, the loop has finished and i is 2 — so all three lambdas see 2. Fix: lambda i=i to bind i at definition time.',
      hints: ['Closures capture variables by reference. What is i after the loop ends?'],
      tags: ['functions', 'closure', 'late-binding'],
      concepts: ['py-closure-capture'],
    },
  {
      id: 'py-functions-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def f(*args, **kwargs):
    print(args)
    print(kwargs)

f(1, 2, x=3, y=4)`,
      expectedOutput: `(1, 2)
{'x': 3, 'y': 4}`,
      explanation:
        '*args packs positional args into a TUPLE; **kwargs packs keyword args into a DICT. Note the parentheses around (1, 2) — it\'s a tuple, not a list.',
      hints: ['*args is a tuple; **kwargs is a dict.'],
      tags: ['functions', 'args-kwargs'],
      concepts: ['py-args-kwargs'],
    },
  {
      id: 'py-functions-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def make_counter():
    count = 0
    def inc():
        nonlocal count
        count += 1
        return count
    return inc

a = make_counter()
b = make_counter()
print(a(), a(), b())`,
      expectedOutput: `1 2 1`,
      explanation:
        'Each call to make_counter creates a NEW closure with its own count. So a and b are independent counters. a() runs twice → 1, 2. b() runs once → 1.',
      hints: ['Each call to the outer function creates a fresh closure.'],
      tags: ['functions', 'closure', 'state'],
      concepts: ['py-closure-capture'],
    },
  {
      id: 'py-functions-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def gen():
    print("start")
    yield 1
    print("middle")
    yield 2
    print("end")

g = gen()
print("before")
print(next(g))
print(next(g))`,
      expectedOutput: `before
start
1
middle
2`,
      explanation:
        'Generator functions don\'t run their body when called — they return a generator object. Each next() runs UP TO the next yield. So "before" prints first, then next() runs from start through the first yield (printing "start", then 1). Second next() resumes after the yield, prints "middle", yields 2.',
      hints: ['Generators run lazily; next() advances to the next yield.'],
      tags: ['functions', 'generator', 'yield'],
      concepts: ['py-generator-yield'],
    },
  {
      id: 'py-functions-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def f(a, b, c=10):
    return a + b + c

print(f(1, 2))
print(f(1, 2, 3))
print(f(c=5, a=1, b=2))`,
      expectedOutput: `13
6
8`,
      explanation:
        'First call uses default c=10: 1+2+10=13. Second overrides c=3: 1+2+3=6. Third call uses keyword args in any order: a=1, b=2, c=5 → 8. Keyword args are matched by name regardless of position.',
      hints: ['Default args fill gaps; keyword args bind by name.'],
      tags: ['functions', 'defaults', 'keyword-args'],
      concepts: ['py-default-arg-evaluation', 'py-args-kwargs'],
    },
  {
      id: 'py-functions-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from functools import partial

def greet(greeting, name):
    return f"{greeting}, {name}!"

hi = partial(greet, "Hi")
print(hi("Alice"))
print(hi("Bob"))`,
      expectedOutput: `Hi, Alice!
Hi, Bob!`,
      explanation:
        'partial pre-binds "Hi" as the first arg. Calling hi(name) is equivalent to greet("Hi", name). The resulting callable can be called multiple times with different remaining args.',
      hints: ['partial pre-fills leading args; remaining args go on the call site.'],
      tags: ['functions', 'partial'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functions-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def f():
    x = 10
    def inner():
        x = 20
    inner()
    print(x)

f()`,
      expectedOutput: `10`,
      explanation:
        'inner\'s `x = 20` creates a NEW LOCAL x in inner — it does NOT modify f\'s x. To modify the enclosing variable, inner would need `nonlocal x` first. Without that, inner\'s x is independent.',
      hints: ['Plain assignment in a nested function creates a new local.'],
      tags: ['functions', 'scope', 'nonlocal'],
      concepts: ['py-closure-capture'],
    },
  {
      id: 'py-functions-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def connect(host, *, port=80):
    print(host, port)

try:
    connect("localhost", 5432)
except TypeError:
    print("type error")`,
      expectedOutput: `type error`,
      explanation:
        'The bare * makes port keyword-only — passing it positionally raises TypeError. Calling with port=5432 would work. Keyword-only args force callers to be explicit.',
      hints: ['Bare * forces remaining args to be keyword-only.'],
      tags: ['functions', 'keyword-only'],
      concepts: ['py-args-kwargs'],
    },
  {
      id: 'py-functions-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def f(*args):
    return sum(args)

nums = [1, 2, 3, 4]
print(f(*nums))
try:
    print(f(nums))
except TypeError:
    print("type error")`,
      expectedOutput: `10
type error`,
      explanation:
        'f(*nums) UNPACKS the list into positional args — equivalent to f(1, 2, 3, 4). args is (1, 2, 3, 4), sum is 10. f(nums) passes the list AS a single arg — args is ([1, 2, 3, 4],), and sum tries to add lists, raising TypeError.',
      hints: ['*nums unpacks; passing nums passes the list as one arg.'],
      tags: ['functions', 'unpacking', 'common-mistake'],
      concepts: ['py-unpacking'],
    },
  {
      id: 'pcpp-args-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      question: 'What types does `*args` and `**kwargs` produce inside a function?',
      options: [
        { id: 'a', text: '`*args` → list, `**kwargs` → dict', isCorrect: false },
        { id: 'b', text: '`*args` → tuple, `**kwargs` → dict', isCorrect: true },
        { id: 'c', text: 'Both produce lists', isCorrect: false },
        { id: 'd', text: '`*args` → tuple, `**kwargs` → OrderedDict', isCorrect: false },
      ],
      explanation: 'Inside a function, `*args` is a **tuple** of all positional arguments beyond the named ones. `**kwargs` is a regular **dict** of all keyword arguments not matched by named parameters. The names `args` and `kwargs` are convention — you could use `*numbers` or `**options` — but stick to the convention for readability.',
      hints: [
        '`*args` = tuple (immutable), `**kwargs` = dict',
        'The `*` and `**` are the important parts, not the names',
      ],
      tags: ['functions', 'args', 'kwargs', 'tuple', 'dict'],
      concepts: ['py-dict-key-hashability'],
    },
  {
      id: 'pcpp-args-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function `describe_person(name, *hobbies, **details)` that prints the person\'s name, their hobbies (as a comma-separated list), and any extra keyword details as "key: value" pairs.',
      starterCode: `def describe_person(name, *hobbies, **details):
    # Print name, comma-separated hobbies, and key: value details
    pass


# Call: describe_person("Alice", "reading", "cycling", age=30, city="Dublin")
`,
      testCases: [
        { input: '', expectedOutput: 'Name: Alice\nHobbies: reading, cycling\nage: 30\ncity: Dublin', description: 'Should print name, hobbies, and details' },
      ],
      solution: `def describe_person(name, *hobbies, **details):
    print(f"Name: {name}")
    if hobbies:
        print(f"Hobbies: {', '.join(hobbies)}")
    else:
        print("Hobbies: none")
    for key, value in details.items():
        print(f"{key}: {value}")

describe_person("Alice", "reading", "cycling", age=30, city="Dublin")`,
      explanation: '`name` is a regular parameter. `*hobbies` captures all remaining positional args as a tuple. `**details` captures all keyword args as a dict. `", ".join(hobbies)` joins the tuple into a string. `details.items()` iterates key-value pairs.',
      hints: [
        '`*hobbies` is a tuple — use `", ".join(hobbies)` to format it',
        '`**details` is a dict — iterate with `.items()`',
      ],
      tieredHints: {
        apiSignature: 'sep.join(iterable) -> str',
        skeleton: `def describe_person(name, *hobbies, **details):
    ____(f"____: {name}")
    if hobbies:
        ____(f"____: {____.____(hobbies)}")
    else:
        ____("____: none")
    for ____, ____ in details.____():
        ____(f"____: {____}")

describe_person("____", "____", "____", age=____, city="____")`,
      },
      tags: ['functions', 'args', 'kwargs', 'join', 'unpacking'],
      concepts: ['py-unpacking'],
    },
  {
      id: 'pcpp-args-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      question: 'What does the `*` operator do when used in a function CALL (not definition)?',
      options: [
        { id: 'a', text: 'It multiplies the arguments', isCorrect: false },
        { id: 'b', text: 'It unpacks a sequence into positional arguments', isCorrect: true },
        { id: 'c', text: 'It marks the following arguments as keyword-only', isCorrect: false },
        { id: 'd', text: 'It creates a copy of the sequence before passing it', isCorrect: false },
      ],
      explanation: 'In a call, `*seq` unpacks a list or tuple into positional arguments: `func(*[1, 2, 3])` is equivalent to `func(1, 2, 3)`. Similarly, `**dict` unpacks a dictionary into keyword arguments. This lets you pass a dynamically-built argument list to any function.',
      hints: [
        'In definition: collects args; in call: unpacks args',
        '`func(*my_list)` = `func(my_list[0], my_list[1], ...)`',
      ],
      tags: ['functions', 'unpacking', 'args', 'kwargs', 'operator'],
      concepts: ['py-unpacking'],
    },
  {
      id: 'pe1-m4-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      question: 'What is the difference between a parameter and an argument in Python?',
      options: [
        { id: 'a', text: 'They are the same thing — both terms mean the same', isCorrect: false },
        { id: 'b', text: 'Parameters are in the function definition; arguments are the values passed when calling the function', isCorrect: true },
        { id: 'c', text: 'Arguments are in the function definition; parameters are passed when calling', isCorrect: false },
        { id: 'd', text: 'Parameters are only for built-in functions; arguments are for user-defined functions', isCorrect: false },
      ],
      explanation: 'A **parameter** is the variable listed in the function definition: `def greet(name):` — `name` is a parameter. An **argument** is the actual value passed when calling the function: `greet("Alice")` — `"Alice"` is an argument. Many people use these terms interchangeably in casual conversation, but knowing the distinction helps when reading documentation.',
      hints: [
        'Parameter = definition, Argument = call',
        'Think: Parameters are placeholders; Arguments fill those placeholders',
      ],
      tags: ['functions', 'parameters', 'arguments', 'basics'],
      concepts: ['py-args-kwargs'],
    },
  {
      id: 'pe1-m4-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      question: 'What does a function return if it has no `return` statement?',
      options: [
        { id: 'a', text: '`0`', isCorrect: false },
        { id: 'b', text: 'An empty string `""`', isCorrect: false },
        { id: 'c', text: '`None`', isCorrect: true },
        { id: 'd', text: 'An error', isCorrect: false },
      ],
      explanation: 'Every Python function returns a value. If there\'s no `return` statement (or just `return` with no value), the function returns `None`. `None` is Python\'s way of representing "nothing" or "no value". A common mistake is forgetting `return` and then wondering why the function\'s result is `None`.',
      hints: [
        'Python has a special value for "nothing"',
        'Check if you forgot the `return` keyword',
      ],
      tags: ['functions', 'return', 'None', 'basics'],
      concepts: ['py-function-as-value'],
    },
  {
      id: 'pe1-m4-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      question: 'What is a default parameter value in Python?',
      options: [
        { id: 'a', text: 'A parameter that can never be changed', isCorrect: false },
        { id: 'b', text: 'A fallback value used when the caller doesn\'t provide that argument', isCorrect: true },
        { id: 'c', text: 'The first parameter of any function', isCorrect: false },
        { id: 'd', text: 'A parameter that stores 0 or an empty string', isCorrect: false },
      ],
      explanation: 'Default parameters are defined with `=` in the function signature: `def greet(name, greeting="Hello"):`. If `greeting` is not passed, it defaults to `"Hello"`. Parameters with defaults must come after parameters without defaults. Calling `greet("Alice")` uses the default, while `greet("Alice", "Hi")` overrides it.',
      hints: [
        'Defined with `=` in the function signature',
        'Optional arguments that have a fallback value',
      ],
      tags: ['functions', 'default-parameters', 'arguments', 'basics'],
      concepts: ['py-default-arg-evaluation', 'py-args-kwargs'],
    },
  {
      id: 'pe1-m4-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function named `power` that takes a required `base` parameter and an optional `exponent` parameter defaulting to 2, and returns `base` raised to the `exponent` using the exponentiation operator. Then print the results of calling `power` with just 3 (expect 9), with 2 and 10 (expect 1024), and with 5 and 3 (expect 125).',
      starterCode: `# Define power(base, exponent=2) returning base ** exponent


# Print power(3), power(2, 10), power(5, 3)
`,
      testCases: [
        {
          input: 'power(3)',
          expectedOutput: '9',
          description: 'power(3) should return 9 (3 squared)',
        },
        {
          input: 'power(2, 10)',
          expectedOutput: '1024',
          description: 'power(2, 10) should return 1024',
        },
        {
          input: 'power(5, 3)',
          expectedOutput: '125',
          description: 'power(5, 3) should return 125',
        },
      ],
      solution: `def power(base, exponent=2):
    return base ** exponent

print(power(3))
print(power(2, 10))
print(power(5, 3))`,
      explanation: '`exponent=2` makes `exponent` optional with a default value of 2. When you call `power(3)`, it uses 2 as the exponent, giving 3² = 9. When you call `power(2, 10)`, it uses 10, giving 2¹⁰ = 1024. The `**` operator handles exponentiation.',
      hints: [
        'Use `exponent=2` in the function signature for the default',
        'Use `**` for exponentiation inside the function',
      ],
      tieredHints: {
        apiSignature: 'print(*values, sep=" ", end="\\n")',
        skeleton: `def power(base, exponent=____):
    ____ base ____ exponent

____(power(3))
____(power(2, 10))
____(power(5, 3))`,
      },
      tags: ['functions', 'default-parameters', 'exponentiation', 'basics'],
      concepts: ['py-default-arg-evaluation', 'py-arithmetic-ops'],
    },
  {
      id: 'pe1-m4-5',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      question: 'What is variable scope in Python? What does the LEGB rule describe?',
      options: [
        { id: 'a', text: 'How Python handles memory allocation for variables', isCorrect: false },
        { id: 'b', text: 'The order Python searches for variable names: Local → Enclosing → Global → Built-in', isCorrect: true },
        { id: 'c', text: 'The rule for naming variables (Letters, Extended, Global, Basic)', isCorrect: false },
        { id: 'd', text: 'How Python imports variables from other modules', isCorrect: false },
      ],
      explanation: 'LEGB is the order Python looks up variable names: **L**ocal (inside the current function), **E**nclosing (outer functions in nested functions), **G**lobal (module-level), **B**uilt-in (Python\'s built-in names like `print`, `len`). A variable defined inside a function is local — it doesn\'t exist outside the function.',
      hints: [
        'LEGB: Local → Enclosing → Global → Built-in',
        'Variables inside a function are "local" to that function',
      ],
      tags: ['functions', 'scope', 'LEGB', 'local', 'global', 'basics'],
      concepts: ['py-closure-capture'],
    },
  {
      id: 'pe1-closure-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      question: 'What is a closure in Python?',
      options: [
        { id: 'a', text: 'A function that has no parameters', isCorrect: false },
        { id: 'b', text: 'A function defined inside another function that remembers the outer function\'s variables', isCorrect: true },
        { id: 'c', text: 'A way to close (delete) a function after it runs', isCorrect: false },
        { id: 'd', text: 'A function that cannot be called from outside a class', isCorrect: false },
      ],
      explanation: 'A closure is an inner function that "captures" and remembers variables from its enclosing scope, even after the outer function has finished. This allows you to create functions with persistent private state. Closures are the foundation of decorators and many functional programming patterns.',
      hints: [
        'Inner functions that access outer variables = closures',
        'The inner function "closes over" the outer variables',
      ],
      tags: ['closures', 'scope', 'functions', 'enclosing', 'LEGB'],
      concepts: ['py-closure-capture'],
    },
  {
      id: 'pe1-closure-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function `make_multiplier(factor)` that defines an inner function taking a single argument `n` and returning `n` multiplied by `factor` (this captures `factor` in a closure), and returns that inner function itself (not the result of calling it). Then build `double` by calling `make_multiplier` with 2, build `triple` by calling it with 3, and print the results of calling `double` with 5 (expect 10), `triple` with 4 (expect 12), and `double` with 10 (expect 20).',
      starterCode: `# Define make_multiplier(factor):
#   define an inner function that multiplies its arg by factor
#   return the inner function (not its result)


# Build double and triple; print double(5), triple(4), double(10)
`,
      testCases: [
        {
          input: 'make_multiplier(2)(5)',
          expectedOutput: '10',
          description: 'double(5) should return 10',
        },
        {
          input: 'make_multiplier(3)(4)',
          expectedOutput: '12',
          description: 'triple(4) should return 12',
        },
      ],
      solution: `def make_multiplier(factor):
    def multiplier(n):
        return n * factor
    return multiplier

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))
print(triple(4))
print(double(10))`,
      explanation: 'The inner function `multiplier` "closes over" the `factor` variable from the outer function. Even after `make_multiplier(2)` finishes, `double` still remembers that `factor = 2`. Each call to `make_multiplier` creates a new closure with its own `factor`. This is a factory function pattern.',
      hints: [
        'Define an inner function inside `make_multiplier`',
        'The inner function can access `factor` from the outer scope',
        'Return the inner function (not the result of calling it)',
      ],
      tieredHints: {
        apiSignature: 'def outer(x):\n    def inner(y): ...\n    return inner',
        skeleton: `def make_multiplier(factor):
    def ____(n):
        ____ n ____ factor
    ____ ____

double = make_multiplier(____)
triple = make_multiplier(____)

____(double(5))
____(triple(4))
____(double(10))`,
      },
      tags: ['closures', 'factory-functions', 'scope', 'functions'],
      concepts: ['py-closure-capture'],
    },
  {
      id: 'py-gap-functions-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      question: 'What is a function in Python?',
      options: [
        { id: 'a', text: 'A reusable block of code defined with the `def` keyword that can take parameters and return values', isCorrect: true },
        { id: 'b', text: 'A built-in Python command that cannot be modified or created by the programmer', isCorrect: false },
        { id: 'c', text: 'A type of variable that stores multiple values at once', isCorrect: false },
        { id: 'd', text: 'A special file that Python runs before your main script', isCorrect: false },
      ],
      explanation: 'A function is a reusable block of code defined with the `def` keyword. Functions can accept parameters (inputs), perform operations, and return values. They help organize code, avoid repetition, and make programs easier to read and maintain. Example: `def greet(name): return f"Hello, {name}"`.',
      hints: [
        'Think about what `def` stands for — "define"',
        'Functions let you write code once and use it many times',
      ],
      tags: ['functions', 'def', 'basics'],
      concepts: ['py-function-as-value'],
    },
  {
      id: 'py-gap-functions-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function called `add` that takes two parameters `a` and `b` and returns their sum. Then call the function with the arguments 3 and 5, and print the result.',
      starterCode: `# Define a function called 'add' that takes two parameters
# and returns their sum


# Call the function with 3 and 5, and print the result
`,
      testCases: [
        {
          input: 'add(3, 5)',
          expectedOutput: '8',
          description: 'Should return the sum of 3 and 5',
        },
        {
          input: 'add(0, 0)',
          expectedOutput: '0',
          description: 'Should handle zero values',
        },
      ],
      solution: `def add(a, b):
    return a + b

result = add(3, 5)
print(result)  # 8`,
      explanation: 'Functions are defined with `def`, followed by the function name and parameters in parentheses. The `return` statement sends a value back to the caller. Without `return`, a function returns `None` by default. You call a function by using its name followed by arguments in parentheses.',
      hints: [
        'Start with `def add(a, b):`',
        'Use `return` to send the sum back to the caller',
      ],
      tieredHints: {
        apiSignature: 'print(*values, sep=" ", end="\\n")',
        skeleton: `def add(a, b):
    ____ a ____ b

result = ____(3, 5)
____(result)`,
      },
      tags: ['functions', 'def', 'return', 'basics'],
      concepts: ['py-function-as-value'],
    },
];
