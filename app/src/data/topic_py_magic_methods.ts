/**
 * Topic.PY_MAGIC_METHODS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pyMagicMethodsCloze.ts (10), pyMagicMethodsParsons.ts (10), pyMagicMethodsPredictOutput.ts (10), pythonAdvancedQuestions.ts (3), pythonAdvOopQuestions.ts (3), pythonBatchBExpansionQuestions.ts (8), pythonGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_magic_methods_questions: Question[] = [
  {
      id: 'py-magic-methods-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the dunder that hooks the built-in len().',
      template: `class Bag:
      def __init__(self, items):
          self.items = items
      def ___(self):
          return len(self.items)`,
      blanks: ['__len__'],
      solution:
        'class Bag:\n    def __init__(self, items):\n        self.items = items\n    def __len__(self):\n        return len(self.items)',
      explanation:
        'len(obj) calls obj.__len__(). The method must return a non-negative int.',
      hints: ['Same name as the built-in, with double underscores.'],
      tags: ['magic-methods', '__len__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dunders that produce the developer string (repr) and the user string (str).',
      template: `class P:
      def ___(self):
          return f"P()"
      def ___(self):
          return "a P instance"`,
      blanks: ['__repr__', '__str__'],
      solution:
        'class P:\n    def __repr__(self):\n        return f"P()"\n    def __str__(self):\n        return "a P instance"',
      explanation:
        '__repr__ is for developers (debug, REPL, repr()). __str__ is for end users (print, str()). When __str__ is missing, str() falls back to __repr__ — but never the reverse. Always implement at least __repr__.',
      hints: ['Repr is for repr(); str is for str().'],
      tags: ['magic-methods', '__repr__', '__str__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dunder pair that lets two equal objects also share a hash.',
      template: `class Point:
      def __init__(self, x, y):
          self.x, self.y = x, y
      def ___(self, other):
          return (self.x, self.y) == (other.x, other.y)
      def ___(self):
          return hash((self.x, self.y))`,
      blanks: ['__eq__', '__hash__'],
      solution:
        'class Point:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __eq__(self, other):\n        return (self.x, self.y) == (other.x, other.y)\n    def __hash__(self):\n        return hash((self.x, self.y))',
      explanation:
        'The contract: equal objects must hash equal. Defining __eq__ alone makes the class unhashable (Python sets __hash__ to None) — you need both for set/dict usage.',
      hints: ['Equality and hashing are linked; both dunders use __ on both sides.'],
      tags: ['magic-methods', '__eq__', '__hash__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dunder that hooks the `in` operator.',
      template: `class Bag:
      def __init__(self, items):
          self.items = items
      def ___(self, item):
          return item in self.items`,
      blanks: ['__contains__'],
      solution:
        'class Bag:\n    def __init__(self, items):\n        self.items = items\n    def __contains__(self, item):\n        return item in self.items',
      explanation:
        '`x in obj` calls obj.__contains__(x). Without it, Python falls back to iterating via __iter__ — slower and only works if iterable.',
      hints: ['Containment dunder: same word as Python\'s `in` semantics.'],
      tags: ['magic-methods', '__contains__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dunder that supports indexed access obj[i].',
      template: `class List:
      def __init__(self, data):
          self.data = data
      def ___(self, index):
          return self.data[index]`,
      blanks: ['__getitem__'],
      solution:
        'class List:\n    def __init__(self, data):\n        self.data = data\n    def __getitem__(self, index):\n        return self.data[index]',
      explanation:
        'obj[i] calls __getitem__(i). __get__ is a different protocol (descriptors) and doesn\'t hook brackets.',
      hints: ['Bracket access: "get" + "item".'],
      tags: ['magic-methods', '__getitem__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dunder that implements + so two Vectors add component-wise.',
      template: `class Vector:
      def __init__(self, x, y):
          self.x, self.y = x, y
      def ___(self, other):
          return Vector(self.x + other.x, self.y + other.y)`,
      blanks: ['__add__'],
      solution:
        'class Vector:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __add__(self, other):\n        return Vector(self.x + other.x, self.y + other.y)',
      explanation:
        '__add__ implements `self + other`. Should return a new instance, not mutate self (mutation is __iadd__, used by +=).',
      hints: ['Same name as the operator.'],
      tags: ['magic-methods', '__add__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the comparison dunder that sorted() needs to order objects.',
      template: `class Item:
      def __init__(self, p):
          self.p = p
      def ___(self, other):
          return self.p < other.p`,
      blanks: ['__lt__'],
      solution:
        'class Item:\n    def __init__(self, p):\n        self.p = p\n    def __lt__(self, other):\n        return self.p < other.p',
      explanation:
        'sorted() and list.sort() use __lt__ exclusively. You don\'t need the full comparison protocol — defining __lt__ alone is sufficient for sorting.',
      hints: ['Less-than dunder: l + t.'],
      tags: ['magic-methods', '__lt__', 'sorting'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dunder that makes an instance callable like a function.',
      template: `class Counter:
      def __init__(self):
          self.n = 0
      def ___(self):
          self.n += 1
          return self.n`,
      blanks: ['__call__'],
      solution:
        'class Counter:\n    def __init__(self):\n        self.n = 0\n    def __call__(self):\n        self.n += 1\n        return self.n',
      explanation:
        '__call__ is invoked when you write instance(). Without it, calling an instance raises TypeError. This is what enables stateful "function-like" objects and class-based decorators.',
      hints: ['Same word as Python\'s "call" semantics.'],
      tags: ['magic-methods', '__call__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dunder pair that makes Resource a context manager.',
      template: `class Resource:
      def ___(self):
          return self
      def ___(self, exc_type, exc, tb):
          pass`,
      blanks: ['__enter__', '__exit__'],
      solution:
        'class Resource:\n    def __enter__(self):\n        return self\n    def __exit__(self, exc_type, exc, tb):\n        pass',
      explanation:
        '`with` calls __enter__ at the top of the block and __exit__ at the bottom (always — even on exception). __exit__ takes 3 exception args; returning True suppresses the exception.',
      hints: ['enter / exit, both dunders.'],
      tags: ['magic-methods', '__enter__', '__exit__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dunder that controls truthiness in Python 3 (the modern name).',
      template: `class Inventory:
      def __init__(self, items):
          self.items = items
      def ___(self):
          return bool(self.items)`,
      blanks: ['__bool__'],
      solution:
        'class Inventory:\n    def __init__(self, items):\n        self.items = items\n    def __bool__(self):\n        return bool(self.items)',
      explanation:
        '__bool__ is the Python 3 name. Python 2 used __nonzero__ — that name is ignored in Python 3. If __bool__ is undefined, Python falls back to __len__ (zero is falsy).',
      hints: ['Modern name; Python 2 used __nonzero__.'],
      tags: ['magic-methods', '__bool__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Implement __repr__ on Point to return Point(x, y) for debugging.',
      correctOrder: [
        'class Point:',
        '    def __init__(self, x, y):',
        '        self.x = x',
        '        self.y = y',
        '    def __repr__(self):',
        '        return f"Point({self.x}, {self.y})"',
      ],
      distractorLines: [
        '    def __str__(self):',
        '        print(f"Point({self.x}, {self.y})")',
      ],
      solution:
        'class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    def __repr__(self):\n        return f"Point({self.x}, {self.y})"',
      explanation:
        '__repr__ is the developer-facing representation, called by repr() and shown when a value is the result of an expression in the REPL. It must RETURN a string — printing it would discard the return value. __str__ is the user-facing version that falls back to __repr__ when not defined.',
      hints: ['__repr__ returns; print would discard the return.'],
      tags: ['magic-methods', '__repr__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Make Point hashable by defining __eq__ and __hash__ so two Points with the same coords compare equal and hash the same.',
      correctOrder: [
        'class Point:',
        '    def __init__(self, x, y):',
        '        self.x = x',
        '        self.y = y',
        '    def __eq__(self, other):',
        '        return (self.x, self.y) == (other.x, other.y)',
        '    def __hash__(self):',
        '        return hash((self.x, self.y))',
      ],
      distractorLines: [
        '    def __eq__(self, other):',
        '        return self == other',
        '    def __hash__(self):',
        '        return id(self)',
      ],
      solution:
        'class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    def __eq__(self, other):\n        return (self.x, self.y) == (other.x, other.y)\n    def __hash__(self):\n        return hash((self.x, self.y))',
      explanation:
        'When you define __eq__, Python sets __hash__ to None unless you also define __hash__. The contract: equal objects MUST hash equal. Hashing the underlying tuple is the canonical pattern. `return self == other` would infinite-recurse, and `return id(self)` breaks the equality/hash contract.',
      hints: ['Equal objects must hash equal — hash the same tuple of fields.'],
      tags: ['magic-methods', '__eq__', '__hash__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a Bag class that supports len() and `in` membership tests using __len__ and __contains__.',
      correctOrder: [
        'class Bag:',
        '    def __init__(self, items):',
        '        self.items = items',
        '    def __len__(self):',
        '        return len(self.items)',
        '    def __contains__(self, item):',
        '        return item in self.items',
      ],
      distractorLines: [
        '    def length(self):',
        '    def has(self, item):',
      ],
      solution:
        'class Bag:\n    def __init__(self, items):\n        self.items = items\n    def __len__(self):\n        return len(self.items)\n    def __contains__(self, item):\n        return item in self.items',
      explanation:
        'len(bag) calls bag.__len__(); `x in bag` calls bag.__contains__(x). Methods named .length() or .has() would be plain methods — they don\'t hook into the built-in operators. Implementing the dunders gives you the natural Python syntax for free.',
      hints: ['len() → __len__; `in` → __contains__. The dunders are how the built-ins hook in.'],
      tags: ['magic-methods', '__len__', '__contains__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define __add__ on Vector so v1 + v2 returns a new Vector with summed components.',
      correctOrder: [
        'class Vector:',
        '    def __init__(self, x, y):',
        '        self.x = x',
        '        self.y = y',
        '    def __add__(self, other):',
        '        return Vector(self.x + other.x, self.y + other.y)',
      ],
      distractorLines: [
        '    def __add__(self, other):',
        '        self.x += other.x',
        '        self.y += other.y',
      ],
      solution:
        'class Vector:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    def __add__(self, other):\n        return Vector(self.x + other.x, self.y + other.y)',
      explanation:
        '__add__ should RETURN a NEW instance — like int and tuple, it should NOT mutate self. The mutating version implements `+=` semantics (which is __iadd__) and breaks the convention that v1 + v2 doesn\'t modify either operand.',
      hints: ['__add__ creates a new object; mutation would be __iadd__ (in-place).'],
      tags: ['magic-methods', '__add__', 'arithmetic'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Make Counter iterable: __iter__ yields each count value via a generator.',
      correctOrder: [
        'class Counter:',
        '    def __init__(self):',
        '        self.values = [10, 20, 30]',
        '    def __iter__(self):',
        '        for v in self.values:',
        '            yield v',
      ],
      distractorLines: [
        '    def __next__(self):',
        '    def iter(self):',
      ],
      solution:
        'class Counter:\n    def __init__(self):\n        self.values = [10, 20, 30]\n    def __iter__(self):\n        for v in self.values:\n            yield v',
      explanation:
        'A generator-based __iter__ is the simplest way to make a class iterable — Python sees the yield and treats __iter__ as returning an iterator. The alternative is to also define __next__, but with yield you don\'t need it. Method named iter (no dunders) doesn\'t hook into iter()/for.',
      hints: ['yield inside __iter__ makes it a generator-iterator automatically.'],
      tags: ['magic-methods', '__iter__', 'generator'],
      concepts: ['py-magic-methods', 'py-generator-yield'],
    },
  {
      id: 'py-magic-methods-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define __getitem__ so List supports indexed access lst[i].',
      correctOrder: [
        'class List:',
        '    def __init__(self, data):',
        '        self.data = data',
        '    def __getitem__(self, index):',
        '        return self.data[index]',
      ],
      distractorLines: [
        '    def __get__(self, index):',
        '    def get(self, index):',
      ],
      solution:
        'class List:\n    def __init__(self, data):\n        self.data = data\n    def __getitem__(self, index):\n        return self.data[index]',
      explanation:
        '__getitem__ implements the [] operator. __get__ is something completely different (the descriptor protocol). Defining .get() as a regular method does NOT enable bracket access — only the dunder hooks the operator.',
      hints: ['Bracket access [] hooks via __getitem__. __get__ is a different protocol.'],
      tags: ['magic-methods', '__getitem__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Implement __lt__ on Item so a list of Items can be sorted by .priority.',
      correctOrder: [
        'class Item:',
        '    def __init__(self, priority):',
        '        self.priority = priority',
        '    def __lt__(self, other):',
        '        return self.priority < other.priority',
      ],
      distractorLines: [
        '    def __cmp__(self, other):',
        '        return self.priority < other.priority',
      ],
      solution:
        'class Item:\n    def __init__(self, priority):\n        self.priority = priority\n    def __lt__(self, other):\n        return self.priority < other.priority',
      explanation:
        'sorted() and list.sort() use __lt__ to compare elements. Implementing just __lt__ is sufficient for sorting (you don\'t need the full comparison protocol). __cmp__ is Python 2 only and is ignored in Python 3 — use functools.total_ordering for full comparisons.',
      hints: ['Sorting uses __lt__ only. __cmp__ is Python 2.'],
      tags: ['magic-methods', '__lt__', 'sorting'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Make Money instances callable: instance() returns the formatted amount string.',
      correctOrder: [
        'class Money:',
        '    def __init__(self, amount, currency):',
        '        self.amount = amount',
        '        self.currency = currency',
        '    def __call__(self):',
        '        return f"{self.amount} {self.currency}"',
      ],
      distractorLines: [
        '    def call(self):',
        '    def __init__(self):',
      ],
      solution:
        'class Money:\n    def __init__(self, amount, currency):\n        self.amount = amount\n        self.currency = currency\n    def __call__(self):\n        return f"{self.amount} {self.currency}"',
      explanation:
        '__call__ makes any instance callable with parentheses — m() invokes __call__. Without it, calling an instance raises TypeError: object is not callable. This is what enables class-as-decorator and stateful "function-like" objects.',
      hints: ['__call__ is what makes instances behave like functions.'],
      tags: ['magic-methods', '__call__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Make Resource a context manager: __enter__ returns self, __exit__ prints "closed".',
      correctOrder: [
        'class Resource:',
        '    def __enter__(self):',
        '        return self',
        '    def __exit__(self, exc_type, exc, tb):',
        '        print("closed")',
      ],
      distractorLines: [
        '    def open(self):',
        '    def close(self):',
      ],
      solution:
        'class Resource:\n    def __enter__(self):\n        return self\n    def __exit__(self, exc_type, exc, tb):\n        print("closed")',
      explanation:
        'A context manager defines __enter__ (called by `with`) and __exit__ (called on block exit, even on exception). __exit__ takes 3 exception args; returning True suppresses the exception. open()/close() are NOT a context manager — they\'re just methods.',
      hints: ['__enter__ runs at the with; __exit__ runs at block exit (also on errors).'],
      tags: ['magic-methods', '__enter__', '__exit__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Implement __bool__ on Inventory so empty inventories are falsy and non-empty are truthy.',
      correctOrder: [
        'class Inventory:',
        '    def __init__(self, items):',
        '        self.items = items',
        '    def __bool__(self):',
        '        return len(self.items) > 0',
      ],
      distractorLines: [
        '    def __nonzero__(self):',
        '    def is_empty(self):',
      ],
      solution:
        'class Inventory:\n    def __init__(self, items):\n        self.items = items\n    def __bool__(self):\n        return len(self.items) > 0',
      explanation:
        '__bool__ controls truthiness — used by `if obj:`, `bool(obj)`, etc. Without it, Python falls back to __len__ (zero is false). __nonzero__ is the Python 2 name and is ignored in Python 3.',
      hints: ['__bool__ is the Python 3 name; __nonzero__ is Python 2.'],
      tags: ['magic-methods', '__bool__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class P:
    def __repr__(self):
        return "REPR"

p = P()
print(p)
print(str(p))`,
      expectedOutput: `REPR
REPR`,
      explanation:
        'When __str__ is not defined, str() falls back to __repr__. print() always uses str(), so both lines route through __repr__ — printing "REPR" twice. Defining __str__ would override str(); print(repr(p)) would always use __repr__.',
      hints: ['What does str() do when __str__ is missing?'],
      tags: ['magic-methods', '__repr__', '__str__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class P:
    def __init__(self, x):
        self.x = x
    def __eq__(self, other):
        return self.x == other.x

a = P(1)
b = P(1)
print(a == b)
try:
    {a, b}
except TypeError as e:
    print("unhashable")`,
      expectedOutput: `True
unhashable`,
      explanation:
        'Defining __eq__ implicitly sets __hash__ to None — so the object becomes unhashable. The set construction raises TypeError. Equality works as defined, but you can\'t put these in sets/dicts unless you also define __hash__.',
      hints: ['What happens to __hash__ when only __eq__ is defined?'],
      tags: ['magic-methods', '__eq__', '__hash__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class V:
    def __init__(self, x):
        self.x = x
    def __add__(self, other):
        return V(self.x + other.x)

v1 = V(1)
v2 = V(2)
v3 = v1 + v2
print(v3.x)
print(v1.x)`,
      expectedOutput: `3
1`,
      explanation:
        '__add__ returns a NEW V — v3 has x=3. v1 is not mutated, so v1.x is still 1. This is the standard immutable-add convention; mutating self would be __iadd__ (in-place +=).',
      hints: ['Does __add__ mutate self or return a new object?'],
      tags: ['magic-methods', '__add__', 'immutability'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class Bag:
    def __init__(self, items):
        self.items = items
    def __len__(self):
        return len(self.items)

b = Bag([])
if b:
    print("truthy")
else:
    print("falsy")`,
      expectedOutput: `falsy`,
      explanation:
        'Without __bool__, Python falls back to __len__ for truthiness — len 0 is falsy. So an empty Bag tests false. Defining __bool__ would override this fallback.',
      hints: ['Truthiness fallback: __bool__ then __len__ then default True.'],
      tags: ['magic-methods', '__len__', '__bool__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class It:
    def __iter__(self):
        for n in [1, 2, 3]:
            yield n

it = It()
print(list(it))
print(list(it))`,
      expectedOutput: `[1, 2, 3]
[1, 2, 3]`,
      explanation:
        'Each iter(it) call invokes __iter__, which returns a FRESH generator. So each list(it) gets a new iteration — both produce the full sequence. If __iter__ returned `self` (i.e., the class is also the iterator), the second pass would be empty.',
      hints: ['Does __iter__ create a new generator each call, or return self?'],
      tags: ['magic-methods', '__iter__', 'iterator-vs-iterable'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class C:
    def __init__(self):
        self.values = [1, 2, 3]
        self.i = 0
    def __iter__(self):
        return self
    def __next__(self):
        if self.i >= len(self.values):
            raise StopIteration
        v = self.values[self.i]
        self.i += 1
        return v

c = C()
print(list(c))
print(list(c))`,
      expectedOutput: `[1, 2, 3]
[]`,
      explanation:
        'When __iter__ returns self, the class IS the iterator — and there\'s only one. After the first list() exhausts it (self.i is now 3), the second list() immediately hits StopIteration. To support multi-pass iteration, __iter__ should return a fresh iterator each call.',
      hints: ['Self-as-iterator gets exhausted after one pass.'],
      tags: ['magic-methods', '__iter__', '__next__', 'exhaustion'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class Item:
    def __init__(self, p):
        self.p = p
    def __lt__(self, other):
        return self.p < other.p

items = [Item(3), Item(1), Item(2)]
sorted_items = sorted(items)
print([i.p for i in sorted_items])`,
      expectedOutput: `[1, 2, 3]`,
      explanation:
        'sorted() uses __lt__ to compare elements. With Item.__lt__ defined to compare priorities, the items sort ascending by priority — yielding the priority list [1, 2, 3].',
      hints: ['sorted() needs __lt__; what does it compare on?'],
      tags: ['magic-methods', '__lt__', 'sorting'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class Bag:
    def __init__(self, items):
        self.items = items
    def __contains__(self, item):
        return item in self.items

b = Bag([1, 2, 3])
print(2 in b)
print(99 in b)`,
      expectedOutput: `True
False`,
      explanation:
        '`x in obj` calls obj.__contains__(x). With Bag.__contains__ delegating to the underlying list, membership tests work directly. Without __contains__, Python would fall back to iterating via __iter__.',
      hints: ['`in` hooks via __contains__.'],
      tags: ['magic-methods', '__contains__'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class Counter:
    def __init__(self):
        self.n = 0
    def __call__(self):
        self.n += 1
        return self.n

c = Counter()
print(c())
print(c())
print(c())`,
      expectedOutput: `1
2
3`,
      explanation:
        '__call__ makes the instance callable. Each c() invokes __call__, which increments self.n and returns the new value. The state persists across calls because it lives on the instance.',
      hints: ['__call__ runs each time c() is invoked; state is on self.'],
      tags: ['magic-methods', '__call__', 'state'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-methods-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class R:
    def __enter__(self):
        print("enter")
        return self
    def __exit__(self, exc_type, exc, tb):
        print("exit")
        return True

with R():
    print("inside")
    raise ValueError("boom")
print("after")`,
      expectedOutput: `enter
inside
exit
after`,
      explanation:
        '__exit__ returns True — which SUPPRESSES the exception. Flow: enter → inside → ValueError raised → __exit__ called with exception info → __exit__ returns True so exception is swallowed → execution continues with "after". If __exit__ returned False (or None), the exception would propagate and "after" wouldn\'t print.',
      hints: ['What does __exit__ returning True do to the exception?'],
      tags: ['magic-methods', '__exit__', 'exception-suppression'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'pcpp-magic-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      question: 'What is the difference between `__str__` and `__repr__`?',
      options: [
        { id: 'a', text: '`__str__` is for classes; `__repr__` is for instances', isCorrect: false },
        { id: 'b', text: '`__str__` is the human-readable string for end users; `__repr__` is the unambiguous developer representation', isCorrect: true },
        { id: 'c', text: '`__repr__` is called by `print()`; `__str__` is called by the REPL', isCorrect: false },
        { id: 'd', text: 'They are identical — Python uses whichever is defined', isCorrect: false },
      ],
      explanation: '`__str__` is called by `str(obj)` and `print()` — it should be readable for end users: `"Alice (age 30)"`. `__repr__` is called in the REPL, by `repr()`, and in containers — it should be unambiguous and ideally valid Python: `"Person(name=\'Alice\', age=30)"`. If only `__repr__` is defined, `str()` falls back to it. Always define `__repr__` at minimum.',
      hints: [
        '`__repr__` = developer-friendly, ideally `eval(repr(obj)) == obj`',
        '`print()` calls `__str__`; the REPL calls `__repr__`',
      ],
      tags: ['magic-methods', '__str__', '__repr__', 'oop', 'dunder'],
      concepts: ['py-magic-methods', 'py-class-instance-distinction'],
    },
  {
      id: 'pcpp-magic-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a 2D `Vector(x, y)` class with four magic methods: `__repr__` returns the string `Vector(<x>, <y>)`; `__add__` returns a new vector with summed components; `__mul__` accepts a scalar and returns a new vector scaled component-wise; `__eq__` returns True when both components match.',
      starterCode: `# Define Vector(x, y) with __init__ storing self.x and self.y
# Implement __repr__ → f"Vector({x}, {y})"
# Implement __add__, __mul__ (scalar), __eq__


# Build v1=Vector(1,2), v2=Vector(3,4); print v1+v2, v1*3, two equality checks
`,
      testCases: [
        { input: 'repr(Vector(1, 2) + Vector(3, 4))', expectedOutput: 'Vector(4, 6)', description: 'Vector addition' },
        { input: 'repr(Vector(1, 2) * 3)', expectedOutput: 'Vector(3, 6)', description: 'Scalar multiplication' },
        { input: 'Vector(1, 2) == Vector(1, 2)', expectedOutput: 'True', description: 'Equality check' },
      ],
      solution: `class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1 + v2)
print(v1 * 3)
print(Vector(1, 2) == Vector(1, 2))
print(v1 == v2)`,
      explanation: 'Magic methods let you define how your objects respond to operators. `__add__` handles `+`, `__mul__` handles `*`, `__eq__` handles `==`. Each returns a new `Vector` (or bool for `__eq__`). Without these, using `+` on two Vectors would raise `TypeError`. Python calls `v1.__add__(v2)` when it sees `v1 + v2`.',
      hints: [
        '`__add__` receives `self` and `other` — both Vectors',
        'Return a new `Vector(...)` from `__add__` and `__mul__`',
      ],
      tags: ['magic-methods', '__add__', '__mul__', '__eq__', '__repr__', 'Vector'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'pcpp-magic-3a',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a `Stack` class backed by `self._items` with `push(item)` and `pop()`. Add `__len__` (so `len(s)` works) and `__contains__` (so `x in s` works) — both delegate to the underlying list. Push 1, 2, 3, then print `len(s)` and `2 in s`.',
      starterCode: `# Stack with self._items list; push/pop; __len__ for len(s); __contains__ for x in s


# Push 1, 2, 3; print len(s), (2 in s)
`,
      testCases: [
        { input: '', expectedOutput: '3\nTrue', description: 'len(s) and (2 in s)' },
      ],
      solution: `class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        return self._items.pop()

    def __len__(self):
        return len(self._items)

    def __contains__(self, item):
        return item in self._items

s = Stack()
s.push(1)
s.push(2)
s.push(3)
print(len(s))
print(2 in s)`,
      explanation: '`__len__` enables `len(s)`, `__contains__` enables `x in s`. Both can just delegate to the underlying list. Defining these makes your class participate in the built-in container protocols.',
      hints: [
        '`__len__` returns `len(self._items)`',
        '`__contains__` returns `item in self._items`',
      ],
      tags: ['magic-methods', '__len__', '__contains__', 'Stack', 'protocols'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'pcpp-magic-3b',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a `Stack` class backed by `self._items` with `push(item)` and `pop()`. Add `__iter__` so iteration yields items TOP-FIRST — the reverse of insertion order — so `list(s)` after pushing 1, 2, 3 is `[3, 2, 1]`.',
      starterCode: `# Stack with self._items list; push/pop; __iter__ yielding top-first


# Push 1, 2, 3; print list(s)
`,
      testCases: [
        { input: '', expectedOutput: '[3, 2, 1]', description: 'list(s) reflects top-first iteration' },
      ],
      solution: `class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        return self._items.pop()

    def __iter__(self):
        return iter(reversed(self._items))

s = Stack()
s.push(1)
s.push(2)
s.push(3)
print(list(s))`,
      explanation: '`__iter__` must return an iterator. `reversed(self._items)` gives a top-first traversal of the underlying list. `for x in s`, `list(s)`, and unpacking all route through `__iter__`, so defining it once fixes every iteration syntax at the same time.',
      hints: [
        '`__iter__` returns an iterator (not the iterable itself)',
        '`iter(reversed(self._items))` traverses top-first',
      ],
      tags: ['magic-methods', '__iter__', 'Stack', 'protocols', 'reversed'],
      concepts: ['py-magic-methods', 'py-iterator-protocol'],
    },
  {
      id: 'py-adv-magic-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a `Money` value-object class representing an amount in a currency. The constructor takes a float `amount` and a string `currency` — store the amount as-given, but normalise the currency to UPPERCASE so a lowercase `"usd"` and uppercase `"USD"` behave identically downstream.\n\nBehaviour requirements:\n\n- Two `Money` instances compare equal iff BOTH their amount and currency match. Comparing a `Money` to a non-`Money` must let Python fall back to the other operand\'s comparison (return the singleton that signals "not implemented for this type") — do NOT raise.\n- `Money` instances must be usable as dict keys and set members. Two instances that compare equal MUST hash equal.\n- Addition of two `Money` instances in the SAME currency returns a new `Money` with the summed amount and that currency. In DIFFERENT currencies, raise `ValueError` whose message is `"Cannot add "` + left currency + `" and "` + right currency. Adding a non-`Money` must again defer to the other operand — do NOT raise.\n- The developer-representation hook returns the string `"Money(<amount>, \'<CURRENCY>\')"` so the REPL shows something unambiguous.\n\nExamples: two `Money` with the same amount and currency compare equal; summing `5 USD` and `3 USD` yields `Money(8, \'USD\')`; summing USD with EUR raises `ValueError`.',
      starterCode: `class Money:
      ...
  `,
      testCases: [
        {
          input: 'Money(10, "USD") == Money(10, "USD"), used as dict key',
          expectedOutput: 'True, works as dict key, add same currency',
          description: 'Should implement equality, hashing, and addition',
        },
      ],
      solution: `class Money:
      """Value object representing a monetary amount."""
  
      def __init__(self, amount: float, currency: str):
          self.amount = amount
          self.currency = currency.upper()
  
      def __eq__(self, other):
          if not isinstance(other, Money):
              return NotImplemented
          return self.amount == other.amount and self.currency == other.currency
  
      def __hash__(self):
          return hash((self.amount, self.currency))
  
      def __add__(self, other):
          if not isinstance(other, Money):
              return NotImplemented
          if self.currency != other.currency:
              raise ValueError(f"Cannot add {self.currency} and {other.currency}")
          return Money(self.amount + other.amount, self.currency)
  
      def __repr__(self):
          return f"Money({self.amount}, '{self.currency}')"
  `,
      explanation: 'If you override __eq__, Python makes the class unhashable by default (sets __hash__ to None). You must explicitly implement __hash__ for objects to work as dict keys or set members. The rule is: objects that are equal MUST have the same hash (but objects with the same hash don\'t have to be equal). Returning NotImplemented (not raising NotImplementedError) from __eq__ and __add__ tells Python to try the other operand\'s method — this enables interoperability. __repr__ should return a string that ideally could recreate the object.',
      hints: [
        'Return NotImplemented (not raise) for unsupported types',
        'Equal objects must have equal hashes',
        'hash((field1, field2)) for multi-field hashing',
      ],
      tags: ['magic-methods', 'eq', 'hash', 'add', 'value-object'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-adv-magic-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a `Task` class that sorts like a priority queue. The constructor takes a string `name`, an integer `priority`, and an optional `datetime` `created_at` defaulting to "now" when omitted.\n\nRequired ordering behaviour: sorting a list of tasks must produce the HIGHEST-priority task FIRST, with OLDER `created_at` breaking ties between equal priorities. Two tasks are equal iff both priority and created_at match. Comparisons against a non-`Task` must defer to the other operand (return the singleton that signals "not implemented") — do NOT raise.\n\nDo NOT write all six comparison dunders yourself — use the `functools` decorator that derives the missing comparison methods from just the equality and less-than implementations.\n\nThe developer-representation hook returns `"Task("` + `repr` of name + `", priority="` + priority + `")"`.\n\nExample: sorting three tasks with priorities 1, 3, 2 (named A, B, C) must yield them in priority-descending order: B (3), C (2), A (1).',
      starterCode: `from datetime import datetime

class Task:
    ...
`,
      testCases: [
        {
          input: 'sorted([Task("A",1), Task("B",3), Task("C",2)])',
          expectedOutput: '[Task("B",3), Task("C",2), Task("A",1)]',
          description: 'Should sort by priority descending, then created_at ascending',
        },
      ],
      solution: `from datetime import datetime
from functools import total_ordering

@total_ordering
class Task:
    """A task that supports natural sorting."""

    def __init__(self, name: str, priority: int, created_at: datetime = None):
        self.name = name
        self.priority = priority
        self.created_at = created_at or datetime.now()

    def __eq__(self, other):
        if not isinstance(other, Task):
            return NotImplemented
        return self.priority == other.priority and self.created_at == other.created_at

    def __lt__(self, other):
        if not isinstance(other, Task):
            return NotImplemented
        # Negate priority so higher priority sorts first (ascending sort)
        if self.priority != other.priority:
            return self.priority > other.priority  # Higher priority = "less than" = first
        return self.created_at < other.created_at  # Earlier = first (tiebreaker)

    def __repr__(self):
        return f"Task({self.name!r}, priority={self.priority})"
`,
      explanation: '@total_ordering fills in __le__, __gt__, and __ge__ from just __eq__ and __lt__, saving you from implementing all four comparison methods. Python\'s sorted() and min() use __lt__ internally. The trick for "higher priority first" is inverting the comparison in __lt__: self.priority > other.priority makes higher-priority tasks sort earlier. The tiebreaker (created_at) uses normal ascending order. This is the same pattern used by heapq — defining __lt__ makes your objects work with heaps, sorted(), min(), max(), and bisect.',
      hints: [
        '@total_ordering generates missing comparison methods',
        'sorted() calls __lt__ — "less than" means "comes first"',
        'Invert the comparison to sort descending',
      ],
      tags: ['magic-methods', 'lt', 'total_ordering', 'sorting', 'comparison'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-adv-magic-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      question: 'What is the difference between `__repr__` and `__str__`, and what are `__call__`, `__len__`, and `__iter__` used for?',
      options: [
        { id: 'a', text: '__repr__ is the unambiguous developer representation (used in REPL, debug); __str__ is the human-readable display (used by print, str()). __call__ lets obj() work like a function, __len__ enables len(obj), __iter__ enables for x in obj.', isCorrect: true },
        { id: 'b', text: '__repr__ is for end users (print), __str__ is for developers (debug). __call__ makes objects deletable, __len__ enables iteration, __iter__ enables indexing.', isCorrect: false },
        { id: 'c', text: 'They are identical — Python uses whichever one is defined. __call__, __len__, and __iter__ are deprecated in Python 3.', isCorrect: false },
        { id: 'd', text: '__str__ must return a valid Python expression. __call__ is only for decorators, __len__ only for strings, __iter__ only for lists.', isCorrect: false },
      ],
      explanation: '__repr__ should return an unambiguous string, ideally valid Python that could recreate the object (e.g., "Money(10, \'USD\')"). It\'s what you see in the REPL and debugger. __str__ returns a human-friendly string for print() and str(). If only __repr__ is defined, Python uses it as a fallback for str() too. __call__ turns objects into callable functions (great for stateful functions, decorators). __len__ integrates with len() and truthiness testing. __iter__ makes objects work with for loops, unpacking, and list/set/dict comprehensions.',
      hints: [
        '__repr__ for devs, __str__ for users',
        '__repr__ is the fallback if __str__ is not defined',
      ],
      tags: ['magic-methods', 'repr', 'str', 'call', 'len', 'iter', 'protocol'],
      concepts: ['py-magic-methods', 'py-iterator-protocol'],
    },
  {
      id: 'py-magic-str-vs-repr',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a `Point` class that takes `x` and `y` on construction and distinguishes its two string representations. The developer representation (used by the REPL and `repr()`) must render as `Point(3, 4)` for a point with x=3, y=4 — an unambiguous form that could recreate the object. The human-friendly representation (used by `print()` and `str()`) must render as `(3, 4)`. Build `p = Point(3, 4)`, then print `repr(p)` (expect `Point(3, 4)`) and `str(p)` (expect `(3, 4)`).',
      starterCode: ``,
      testCases: [
        {
          input: '__str__ vs __repr__',
          expectedOutput: 'Point(3, 4)\n(3, 4)',
          description: 'repr for devs, str for humans',
        },
      ],
      solution: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    def __str__(self):
        return f"({self.x}, {self.y})"

p = Point(3, 4)
print(repr(p))
print(str(p))`,
      explanation: '`__repr__` is the developer-facing representation — shown in REPLs, debuggers, and default `print(list_of_objects)`. Ideally it returns something that would rebuild the object: `Point(3, 4)`. `__str__` is the user-facing display — used by `print()` and `str()`. If you only define `__repr__`, `str()` falls back to it. Rule of thumb: always define `__repr__`; define `__str__` only when the human format differs.',
      hints: [
        'repr(x) — unambiguous dev representation',
        'str(x) / print(x) — human-friendly',
        'If only __repr__ is defined, str() falls back to it',
      ],
      tags: ['magic-methods', 'str', 'repr'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-eq-hash',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a `Coord` class taking `x` and `y` on construction. Implement value-based equality and hashing so two `Coord` instances with the same `x` and `y` compare equal AND produce the same hash — equality should only match other `Coord` instances (not other types), and equal objects MUST hash equal so sets/dicts work correctly. Build two instances `a` and `b`, both with coords (1, 2). Print whether they compare equal (expect `True`), print whether their hashes match (expect `True`), then put both in a set and print its length (expect `1` — they collapse into a single set entry).',
      starterCode: ``,
      testCases: [
        {
          input: '__eq__ + __hash__ for set/dict compatibility',
          expectedOutput: 'True\nTrue\n1',
          description: 'Equal objects must hash equal — law of __hash__',
        },
      ],
      solution: `class Coord:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return isinstance(other, Coord) and (self.x, self.y) == (other.x, other.y)

    def __hash__(self):
        return hash((self.x, self.y))

a = Coord(1, 2)
b = Coord(1, 2)
print(a == b)
print(hash(a) == hash(b))
print(len({a, b}))`,
      explanation: 'Python\'s hash contract: if `a == b`, then `hash(a) == hash(b)`. The reverse does NOT have to hold. If you define `__eq__` without `__hash__`, Python sets `__hash__ = None` (unhashable — cannot be used as dict key or set member) because the default hash (identity-based) would break the contract. Always define both together — a common mistake is defining only `__eq__` and wondering why sets misbehave.',
      hints: [
        'Contract: a == b implies hash(a) == hash(b)',
        'Defining __eq__ without __hash__ → unhashable',
        'hash(tuple_of_fields) is the easy implementation',
      ],
      tags: ['magic-methods', 'eq', 'hash'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-container-protocol',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a `Deck` class that wraps a list stored as `_cards`. Make the instance behave like a sequence by implementing the three container protocol dunders so that `len(deck)` returns the number of cards, `deck[0]` returns the first card, and `x in deck` tests membership. Build `d = Deck(["A", "K", "Q"])` and print `len(d)` (expect `3`), `d[0]` (expect `A`), and `"K" in d` (expect `True`).',
      starterCode: ``,
      testCases: [
        {
          input: 'container protocol',
          expectedOutput: '3\nA\nTrue',
          description: 'len(), [], in work via magic methods',
        },
      ],
      solution: `class Deck:
    def __init__(self, cards):
        self._cards = cards

    def __len__(self):
        return len(self._cards)

    def __getitem__(self, idx):
        return self._cards[idx]

    def __contains__(self, item):
        return item in self._cards

d = Deck(["A", "K", "Q"])
print(len(d))
print(d[0])
print("K" in d)`,
      explanation: 'Defining these protocol methods makes your class a first-class container: `len(d)`, `d[i]`, `for x in d`, `if x in d`, slicing, unpacking — all just work. Bonus: `__getitem__` alone enables iteration (Python falls back to calling `__getitem__(0)`, `__getitem__(1)`, ...) for integer indices. For finer control, add `__iter__`. Truly container-like? Inherit from `collections.abc.Sequence` for free mixins (count, index, __reversed__) and ABC checking.',
      hints: [
        '__len__, __getitem__, __contains__ — the sequence protocol',
        '__getitem__ alone gives you iteration for free',
        'Inherit collections.abc.Sequence for free mixins',
      ],
      tags: ['magic-methods', 'container', 'protocol'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-add-iadd',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a `Bag` class that takes a list of `items` on construction (stored as `_items`). Implement two operator dunders so that `a + b` returns a NEW `Bag` containing the concatenation of both `_items` (leaving both operands unchanged), while `a += b` MUTATES the left-hand `Bag` in place by extending `_items` with the right operand\'s `_items` (and returns self). Build two bags: `a` containing one string `"x"` and `b` containing one string `"y"`. First, combine them with `+` into a new bag `c` and print its items (expect `[\'x\', \'y\']`), then print `a`\'s items to confirm it\'s unchanged (expect `[\'x\']`). Then apply the compound-assignment operator `+=` from `a` to `b` and print `a`\'s items again (expect `[\'x\', \'y\']` — now mutated).',
      starterCode: ``,
      testCases: [
        {
          input: '__add__ vs __iadd__',
          expectedOutput: "['x', 'y']\n['x']\n['x', 'y']",
          description: '+ builds new; += mutates',
        },
      ],
      solution: `class Bag:
    def __init__(self, items):
        self._items = items

    def __add__(self, other):
        return Bag(self._items + other._items)

    def __iadd__(self, other):
        self._items.extend(other._items)
        return self

a = Bag(["x"])
b = Bag(["y"])

c = a + b
print(c._items)
print(a._items)

a += b
print(a._items)`,
      explanation: '`__add__` is called for `a + b` and should return a NEW object. `__iadd__` is called for `a += b` and should return `self` after mutating. If you define only `__add__`, `+=` falls back to `a = a + b` — which creates a new object and rebinds the name, often surprising. For immutable-feeling value objects (Point, Money), skip `__iadd__`. For accumulator-style containers (Bag, Counter), define both.',
      hints: [
        '__add__ → new object (immutable style)',
        '__iadd__ → mutate self, return self (accumulator style)',
        'Without __iadd__, += falls back to __add__ + rebind',
      ],
      tags: ['magic-methods', 'add', 'iadd', 'operator-overloading'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-call',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a `Multiplier` class that takes a `factor` on construction and can then be INVOKED like a function via the dunder that makes instances callable. Calling an instance with an argument `x` must return `x * factor`. Build `double = Multiplier(2)` — an INSTANCE, not a function — then call it as if it were one. Print `double(5)` (expect `10`) and `double(7)` (expect `14`).',
      starterCode: ``,
      testCases: [
        {
          input: '__call__ makes an instance callable',
          expectedOutput: '10\n14',
          description: 'Instance behaves like a function',
        },
      ],
      solution: `class Multiplier:
    def __init__(self, factor):
        self.factor = factor

    def __call__(self, x):
        return x * self.factor

double = Multiplier(2)
print(double(5))
print(double(7))`,
      explanation: '`__call__` turns an instance into a callable — useful for stateful functions (a callback object that counts its calls), parameterised decorators, or configurable strategies (a `Sampler(rate=0.1)` you can pass to `map`). Also why classes themselves are callable (`MyClass()` invokes `type.__call__` which runs `__init__`).',
      hints: [
        '__call__ makes instance() work',
        'Great for parameterised decorators, stateful callbacks',
        'Classes are callable because `type` defines __call__',
      ],
      tags: ['magic-methods', 'call', 'callable'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-hash-mutable',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      question: 'When should you NOT implement `__hash__` on a class?',
      options: [
        { id: 'a', text: 'Always implement it — never skip', isCorrect: false },
        { id: 'b', text: 'When instances are MUTABLE in ways that would affect equality. If `a == b` today and someone mutates `a`, they may no longer be equal — but if `a` is in a set/dict using its original hash, lookups break silently. Either make the class frozen, or omit `__hash__` to mark it unhashable.', isCorrect: true },
        { id: 'c', text: 'Only when the class has more than 10 fields', isCorrect: false },
        { id: 'd', text: 'Only for classes named after animals', isCorrect: false },
      ],
      explanation: 'This is why `list`, `dict`, `set` are unhashable — they\'re mutable. If Python allowed hashing them, modifying a list after it was used as a dict key would corrupt the dict silently. Rule: immutable types (tuple, str, frozenset, frozen dataclass) are hashable. Mutable containers aren\'t. If you define `__eq__` on a mutable class and NEED to put it in a set, carefully decide whether identity-based hash is acceptable (inherit default) or make the class frozen.',
      hints: [
        'Mutable + hash = silent corruption when mutated after insertion',
        'list/dict/set are unhashable on purpose',
        'If __eq__ considers mutable state → skip __hash__ or make frozen',
      ],
      tags: ['magic-methods', 'hash', 'mutability'],
      concepts: ['py-magic-methods', 'py-mutable-vs-immutable'],
    },
  {
      id: 'py-magic-aenter-vs-enter',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      question: 'What is the relationship between `__enter__`/`__exit__` and `__aenter__`/`__aexit__`?',
      options: [
        { id: 'a', text: 'They are identical', isCorrect: false },
        { id: 'b', text: '`__enter__`/`__exit__` are for sync `with` blocks; `__aenter__`/`__aexit__` are COROUTINE versions for `async with` blocks. They exist so setup/teardown can themselves await (DB connect, lock acquire, network handshake) without freezing the event loop. A class can define both to work in sync and async code.', isCorrect: true },
        { id: 'c', text: '__aenter__ is deprecated', isCorrect: false },
        { id: 'd', text: 'Only libraries can define them; user code cannot', isCorrect: false },
      ],
      explanation: 'In async code, regular `__enter__` would block the event loop — you can\'t `await` inside it. `__aenter__` and `__aexit__` are coroutines, so they can await (`await self.connect()`). Used by `aiohttp.ClientSession`, `asyncpg.Connection`, `aiofiles`. Consume with `async with X() as y:`. A class can implement both pairs so it works in sync AND async contexts; pick based on how callers need to use it.',
      hints: [
        'async with needs __aenter__ / __aexit__ (coroutines)',
        'sync with needs __enter__ / __exit__',
        'Both pairs can coexist on one class',
      ],
      tags: ['magic-methods', 'aenter', 'async-with'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-magic-iter',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a `Countdown` class that implements the two-method iterator protocol. Its constructor takes an integer `start` and stores it as `self.n`. Make the instance its OWN iterator — when iterated, each step must decrement `self.n` by 1 and yield the new value; once `self.n` would reach 0 or below, iteration must stop by raising the standard sentinel exception. In usage, `for v in Countdown(3): print(v)` should produce `2`, `1`, `0` on three separate lines.',
      starterCode: ``,
      testCases: [
        {
          input: 'for v in Countdown(3): print(v)',
          expectedOutput: '2\n1\n0',
          description: 'Custom iterator yields 3 values then stops',
        },
      ],
      solution: `class Countdown:
    def __init__(self, start: int):
        self.n = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n

for v in Countdown(3):
    print(v)`,
      explanation:
        'Python\'s iteration protocol is two methods: `__iter__` returns "the thing that gets iterated" (often `self`), and `__next__` returns the next value or raises `StopIteration` to signal the end. `for` loops, comprehensions, `list()`, `sum()`, `*unpacking` — everything iterable goes through this protocol. When `__iter__` returns `self`, the object is both iterable AND an iterator — convenient but single-use (it remembers its position). For multi-pass iteration, return a fresh iterator object each time. Generators (`yield`) are the shortcut: one function replaces the whole class.',
      hints: [
        '__iter__ returns the iterator (often self)',
        '__next__ returns the next item or raises StopIteration',
        'yield in a generator function is the shortcut for this protocol',
      ],
      tags: ['magic-methods', 'iter', 'next', 'iterator-protocol'],
      concepts: ['py-magic-methods', 'py-iterator-protocol'],
    },
  {
      id: 'py-gap-magic-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      question: 'What are magic (dunder) methods in Python?',
      options: [
        { id: 'a', text: 'Methods that are automatically optimized by the Python interpreter for faster execution', isCorrect: false },
        { id: 'b', text: 'Private methods that can only be called from within the class itself', isCorrect: false },
        { id: 'c', text: 'Deprecated methods from Python 2 that should not be used in modern Python', isCorrect: false },
        { id: 'd', text: 'Special methods with double underscores (like `__init__`, `__str__`, `__len__`) that Python calls automatically in certain situations — e.g., `print(obj)` calls `__str__`, `len(obj)` calls `__len__`', isCorrect: true },
      ],
      explanation: 'Magic methods (also called "dunder" methods for "double underscore") let you define how your objects interact with Python\'s built-in operations. `__init__` runs when creating an object, `__str__` defines what `print()` shows, `__repr__` defines the developer-friendly representation, `__eq__` handles `==` comparison, `__len__` handles `len()`, `__add__` handles `+`, and many more. They make your custom classes work naturally with Python syntax.',
      hints: [
        '"Dunder" = double underscore: `__method__`',
        'Python calls them for you — you rarely call them directly',
      ],
      tags: ['magic-methods', 'dunder', 'special-methods', 'basics'],
      concepts: ['py-magic-methods'],
    },
  {
      id: 'py-gap-magic-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MAGIC_METHODS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a class `Book` with `title` (str) and `pages` (int) attributes. Add a `__str__` method that returns "Title (N pages)" and a `__len__` method that returns the page count. Demonstrate that `print(book)` and `len(book)` work correctly.',
      starterCode: `class Book:
    # Define __init__, __str__, and __len__
    pass


# Create a book and test print() and len()
`,
      testCases: [
        {
          input: 'str(Book("Python Crash Course", 544))',
          expectedOutput: 'Python Crash Course (544 pages)',
          description: '__str__ should format as "Title (N pages)"',
        },
        {
          input: 'len(Book("Python Crash Course", 544))',
          expectedOutput: '544',
          description: '__len__ should return the page count',
        },
      ],
      solution: `class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

    def __str__(self):
        return f"{self.title} ({self.pages} pages)"

    def __len__(self):
        return self.pages

book = Book("Python Crash Course", 544)
print(book)       # Python Crash Course (544 pages)  — uses __str__
print(len(book))  # 544  — uses __len__`,
      explanation: '`__str__` is called by `print()` and `str()` to get a human-readable string representation. `__len__` is called by `len()` to get the "length" of an object (here, the page count). By implementing these magic methods, your `Book` class integrates naturally with Python\'s built-in functions. Without `__str__`, printing would show something like `<__main__.Book object at 0x...>`.',
      hints: [
        '`__str__` should return a string (not print it)',
        '`__len__` should return an integer',
        'Use f-strings for clean formatting in `__str__`',
      ],
      tags: ['magic-methods', '__str__', '__len__', 'basics'],
      concepts: ['py-magic-methods'],
    },
];
