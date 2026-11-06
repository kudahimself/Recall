/**
 * Topic.PY_MODERN — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendInfraQuestions.ts (3), pyModernCloze.ts (10), pyModernParsons.ts (10), pyModernPredictOutput.ts (10)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_modern_questions: Question[] = [
  {
      id: 'be-infra-modern-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      question: 'What is structural pattern matching (`match`/`case`, Python 3.10+)?',
      options: [
        { id: 'a', text: 'A C-style switch: each case compares with `==` and falls through to the next one unless you add `break`', isCorrect: false },
        { id: 'b', text: 'A statement that tries patterns in order and can unpack sequences, dicts and objects into names as it matches', isCorrect: true },
        { id: 'c', text: 'A regex-style matcher for strings: each `case` is a text pattern that the subject string must match', isCorrect: false },
        { id: 'd', text: 'A shorthand for `isinstance` checks: each `case` names a type, and the first type the value belongs to wins', isCorrect: false },
      ],
      explanation: 'Pattern matching goes beyond comparing values. Sequence patterns match and unpack lists: `case [first, *rest]:`. Mapping patterns match part of a dict: `case {"type": "error", "msg": msg}:` captures `msg` and ignores other keys. Class patterns check attributes: `case Point(x=0, y=y):` matches points whose x is 0. Guards add a condition: `case x if x > 0:`. Cases are tried top to bottom and only the first that fits runs, so there is no fall-through and no `break`; `case _:` catches anything left. A literal such as `case 0:` does compare with `==`, and a class pattern such as `case int():` does an isinstance check, but those are only two kinds of pattern among many, and none of them is a regex.',
      tags: ['match-case', 'pattern-matching', 'python-3.10', 'modern-python'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'be-infra-modern-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define `OrderStatus`, a string enum (bases `str` and `Enum`, or `StrEnum` on Python 3.11+) with five members, `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED` and `CANCELLED`, each valued as its own name in lowercase, so `OrderStatus.PENDING == "pending"`. Then write `get_next_status(current)`, which uses a `match` statement (Python 3.10+) to return the next status: `PENDING` goes to `PROCESSING`, `PROCESSING` to `SHIPPED` and `SHIPPED` to `DELIVERED`. For `DELIVERED` or `CANCELLED` it raises `InvalidTransitionError(current)`, the exception the starter defines, and for any other value it raises `ValueError(current)`.',
      starterCode: `from enum import Enum

class InvalidTransitionError(Exception):
    pass

# Define OrderStatus and get_next_status(current)
`,
      testCases: [
        {
          input: 'get_next_status(OrderStatus.PENDING), get_next_status(OrderStatus.CANCELLED), get_next_status("lost")',
          expectedOutput: 'OrderStatus.PROCESSING, raises InvalidTransitionError, raises ValueError',
          description: 'Moves each open status on, refuses the two end states and rejects anything else',
        },
      ],
      solution: `from enum import Enum


class InvalidTransitionError(Exception):
    pass


class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


def get_next_status(current):
    match current:
        case OrderStatus.PENDING:
            return OrderStatus.PROCESSING
        case OrderStatus.PROCESSING:
            return OrderStatus.SHIPPED
        case OrderStatus.SHIPPED:
            return OrderStatus.DELIVERED
        case OrderStatus.DELIVERED | OrderStatus.CANCELLED:
            raise InvalidTransitionError(current)
        case _:
            raise ValueError(current)
# OR
from enum import Enum


class InvalidTransitionError(Exception):
    pass


class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


def get_next_status(current):
    match current:
        case OrderStatus.PENDING:
            return OrderStatus.PROCESSING
        case OrderStatus.PROCESSING:
            return OrderStatus.SHIPPED
        case OrderStatus.SHIPPED:
            return OrderStatus.DELIVERED
        case OrderStatus.DELIVERED:
            raise InvalidTransitionError(current)
        case OrderStatus.CANCELLED:
            raise InvalidTransitionError(current)
        case _:
            raise ValueError(current)
# OR
from enum import StrEnum


class InvalidTransitionError(Exception):
    pass


class OrderStatus(StrEnum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


def get_next_status(current):
    match current:
        case OrderStatus.PENDING:
            return OrderStatus.PROCESSING
        case OrderStatus.PROCESSING:
            return OrderStatus.SHIPPED
        case OrderStatus.SHIPPED:
            return OrderStatus.DELIVERED
        case OrderStatus.DELIVERED | OrderStatus.CANCELLED:
            raise InvalidTransitionError(current)
        case _:
            raise ValueError(current)`,
      requires: [/\bmatch\s+\w+\s*:/, /\bcase\s+OrderStatus\./],
      explanation: 'A member of a `str` + `Enum` class is a real string, so `OrderStatus.PENDING == "pending"` is True and the value can be stored or sent as JSON as it is, while a typo such as `OrderStatus.PROCESIN` fails at once with AttributeError. In a `case`, a dotted name such as `OrderStatus.PENDING` is a value pattern: it compares with `==`. A bare name would capture every value instead, which is why the constants are written with the class prefix. Joining the two end states with `|` gives them one branch (two separate cases work too), and `case _:` catches everything else, including a plain string that is not a status. On Python 3.11+, `class OrderStatus(StrEnum)` gives the same string behaviour with one base.',
      hints: [
        'Inherit from `(str, Enum)` to make each member a string',
        'Write `match current:`, then one `case OrderStatus.NAME:` per status',
        '`case A | B:` handles two values in one branch',
        '`case _:` matches any value the cases above did not',
      ],
      tieredHints: {
        apiSignature: 'class OrderStatus(str, Enum): NAME = "value"',
        skeleton: `from enum import Enum

class InvalidTransitionError(Exception):
    pass

class OrderStatus(str, ____):
    PENDING = "pending"
    ____ = ____
    ...

def get_next_status(current):
    ____ current:
        ____ OrderStatus.PENDING:
            return ____
        ...
        ____ OrderStatus.DELIVERED ____ OrderStatus.CANCELLED:
            raise ____
        ____ _:
            raise ____`,
      },
      tags: ['enum', 'pattern-matching', 'type-safety', 'match-case'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'be-infra-modern-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      question: 'What does an abstract base class (`ABC` with `@abstractmethod`) do, and when should you use one?',
      options: [
        { id: 'a', text: 'It speeds up method lookup in its subclasses, so use it for base classes that many objects inherit from', isCorrect: false },
        { id: 'b', text: 'It only documents the interface for type checkers; Python never stops a subclass that skips a method', isCorrect: false },
        { id: 'c', text: 'It forces subclasses to implement the marked methods (one that skips any cannot be created), so use it to enforce a contract', isCorrect: true },
        { id: 'd', text: 'It raises an error the first time a missing method is called, so use it for clearer errors than AttributeError', isCorrect: false },
      ],
      explanation: 'An ABC catches a missing method when you create an instance, not later when you call it. If `PaymentProcessor(ABC)` marks `process(self, amount)` with `@abstractmethod`, then `StripeProcessor()` without a `process()` raises `TypeError: Can\'t instantiate abstract class StripeProcessor without an implementation for abstract method \'process\'` (the wording of Python 3.12+), and the ABC itself cannot be instantiated either. That is a contract: every payment processor must implement `process()`. It costs nothing in speed and is enforced by Python itself, not only by a type checker. `typing.Protocol` is the structural alternative: a class fits it by having the right methods, with no inheritance, and only a type checker enforces it.',
      tags: ['abc', 'abstract-class', 'protocol', 'interfaces', 'oop'],
      concepts: ['py-abstract-method', 'py-class-instance-distinction'],
    },
  {
      id: 'py-modern-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keywords for structural pattern matching.',
      template: `def describe(status):
    ___ status:
        ___ "ok":
            return "good"
        ___ _:
            return "other"`,
      blanks: ['match', 'case', 'case'],
      solution:
        'def describe(status):\n    match status:\n        case "ok":\n            return "good"\n        case _:\n            return "other"',
      explanation: '`match` opens the pattern-matching block and `case` starts each branch. The wildcard pattern is `_`, a single underscore; there is no `default` keyword.',
      hints: ['Two keywords; one for the block, one for each branch.'],
      tags: ['modern', 'match-case'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the wildcard pattern, which matches any value without binding a name.',
      template: `match status:
    case "ok":
        return "good"
    case ___:
        return "other"`,
      blanks: ['_'],
      solution: 'match status:\n    case "ok":\n        return "good"\n    case _:\n        return "other"',
      explanation: 'A single underscore is the wildcard: it matches anything and binds nothing. A bare name such as `other` would also match anything, but it captures the value into that name. There is no `default` or `else` in `match`/`case`.',
      hints: ['Single character; same convention as for "throwaway loop var".'],
      tags: ['modern', 'match-case', 'wildcard'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the walrus operator that assigns inside an expression.',
      template: `if (n ___ len(data)) > 3:
    print(n)`,
      blanks: [':='],
      solution: 'if (n := len(data)) > 3:\n    print(n)',
      explanation: 'The walrus `:=` (PEP 572, Python 3.8+) assigns a value and also returns it, so the comparison can use it. The parentheses make `n` hold the length, not the result of `> 3`. A plain `=` inside an expression is a SyntaxError.',
      hints: ['Two characters: colon then equals.'],
      tags: ['modern', 'walrus'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the operator that writes "str or None" as one type (Python 3.10+).',
      template: `def find(name: str) -> str ___ None:
    ...`,
      blanks: ['|'],
      solution: 'def find(name: str) -> str | None:\n    ...',
      explanation: 'Since Python 3.10 (PEP 604) a single `|` writes a union type, so `str | None` means a string or nothing. The older spellings are `typing.Optional[str]` and `Union[str, None]`.',
      hints: ['Single vertical bar.'],
      tags: ['modern', 'union'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the built-in type that annotates `nums` as a list of ints (Python 3.9+, no `typing` import).',
      template: `def total(nums: ___[int]) -> int:
    return sum(nums)`,
      blanks: ['list'],
      solution: 'def total(nums: list[int]) -> int:\n    return sum(nums)',
      explanation: 'Since Python 3.9 (PEP 585) built-in containers take type arguments directly: `list[int]`, `dict[str, int]`, `tuple[int, ...]`. No `typing.List` or `typing.Dict` import is needed.',
      hints: ['Lowercase; same name as the built-in.'],
      tags: ['modern', 'PEP-585'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dict-merge operator (Python 3.9+).',
      template: `merged = a ___ b`,
      blanks: ['|'],
      solution: 'merged = a | b',
      explanation: 'The `|` operator (PEP 584, Python 3.9+) merges two dicts into a new one, and the right side wins on a shared key. `+` does not work on dicts.',
      hints: ['Same character as set union and PEP 604 union.'],
      tags: ['modern', 'dict-merge'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the keyword that adds a guard condition to a `case`.',
      template: `match n:
    case x ___ x < 0:
        return "negative"
    case _:
        return "non-negative"`,
      blanks: ['if'],
      solution:
        'match n:\n    case x if x < 0:\n        return "negative"\n    case _:\n        return "non-negative"',
      explanation:
        'Guards in match/case use `if`. The pattern matches first, then the guard is tested; if false, that case is skipped. Don\'t use `where` (SQL).',
      hints: ['Two letters; same keyword as in conditionals.'],
      tags: ['modern', 'match-case', 'guard'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the clause that handles the ValueError inside this ExceptionGroup (Python 3.11+).',
      template: `try:
    raise ExceptionGroup("multi", [ValueError("a")])
___ ValueError as eg:
    print(eg.exceptions)`,
      blanks: ['except*'],
      solution:
        'try:\n    raise ExceptionGroup("multi", [ValueError("a")])\nexcept* ValueError as eg:\n    print(eg.exceptions)',
      explanation: '`except*` (PEP 654, Python 3.11+) splits an ExceptionGroup: each `except*` clause handles only the matching exceptions, and any that no clause matches are re-raised in a smaller ExceptionGroup. A plain `except ValueError` would not catch this, because the exception raised is the group, not a ValueError.',
      hints: ['except + a single character suffix.'],
      tags: ['modern', 'exception-group'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the brackets that declare `T` as a type parameter of `first`, inline (Python 3.12+, PEP 695).',
      template: `def first___T___(items: list[T]) -> T:
    return items[0]`,
      blanks: ['[', ']'],
      solution: 'def first[T](items: list[T]) -> T:\n    return items[0]',
      explanation: 'Since Python 3.12 (PEP 695) a function declares its type parameters in square brackets right after its name, as in `def first[T](...)`. No `TypeVar` is needed.',
      hints: ['Square bracket pair.'],
      tags: ['modern', 'PEP-695'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the symbol that lets one `case` match an int or a float.',
      template: `match value:
    case int() ___ float():
        return "number"
    case _:
        return "other"`,
      blanks: ['|'],
      solution:
        'match value:\n    case int() | float():\n        return "number"\n    case _:\n        return "other"',
      explanation: 'In a `case`, `|` joins patterns: the case matches if either pattern does. Python reuses the same character for union types (`int | float`) and for merging dicts.',
      hints: ['Single vertical bar.'],
      tags: ['modern', 'match-case', 'or-pattern'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Put the lines in order: `describe(status)` uses `match` to return "all good" for "ok", then "failed" for "error", then "unknown" for anything else, with the cases in that order.',
      correctOrder: [
        'def describe(status):',
        '    match status:',
        '        case "ok":',
        '            return "all good"',
        '        case "error":',
        '            return "failed"',
        '        case _:',
        '            return "unknown"',
      ],
      distractorLines: [
        '        default:',
        '        case else:',
      ],
      solution:
        'def describe(status):\n    match status:\n        case "ok":\n            return "all good"\n        case "error":\n            return "failed"\n        case _:\n            return "unknown"',
      explanation: '`match`/`case` (PEP 634, Python 3.10+) is structural pattern matching, not a C-style switch. A string literal such as `case "ok":` compares with `==`. The wildcard pattern is `_`, a single underscore: there is no `default` keyword and `case else:` is a SyntaxError. Cases are tried top to bottom and the first match wins, so `case _:` goes last.',
      hints: ['Wildcard is _, not "default". match/case uses pattern matching.'],
      tags: ['modern', 'match-case', 'PEP-634'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        '`Point` is a dataclass with the fields `x` and `y`. Put the lines in order: `describe(p)` uses keyword class patterns to return "origin" for the point (0, 0), "y-axis at N" for any other point whose x is 0 (capturing its y as `y`), and "elsewhere" for every other `Point`.',
      correctOrder: [
        'def describe(p):',
        '    match p:',
        '        case Point(x=0, y=0):',
        '            return "origin"',
        '        case Point(x=0, y=y):',
        '            return f"y-axis at {y}"',
        '        case Point():',
        '            return "elsewhere"',
      ],
      distractorLines: ['        case {"x": 0, "y": 0}:', '        case Point.origin:'],
      solution:
        'def describe(p):\n    match p:\n        case Point(x=0, y=0):\n            return "origin"\n        case Point(x=0, y=y):\n            return f"y-axis at {y}"\n        case Point():\n            return "elsewhere"',
      explanation: 'A class pattern such as `Point(x=0, y=0)` checks that the subject is a `Point` and compares each named attribute, while `Point(x=0, y=y)` compares `x` and captures the `y` attribute into the name `y`. Cases run top to bottom, so the origin case must come before the y-axis case, and `Point()` with no arguments matches any remaining `Point`. A dict pattern `{"x": 0, "y": 0}` never matches a dataclass, because a mapping pattern needs a mapping, and `Point.origin` is a value pattern that looks up an attribute `Point` does not have (AttributeError). Positional patterns such as `Point(0, 0)` would also work, because `@dataclass` writes `__match_args__`.',
      hints: ['Class patterns: `ClassName(attr=value, other=name)`.', 'The most specific case goes first.'],
      tags: ['modern', 'match-case', 'class-pattern'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Put the lines in order: store `len(data)` in `n` with the walrus operator and test `n > 3` in the same `if`, then print the message with the length.',
      correctOrder: [
        'data = "hello"',
        'if (n := len(data)) > 3:',
        '    print(f"length {n} is long enough")',
      ],
      distractorLines: [
        'if (n = len(data)) > 3:',
        'if n := len(data) > 3:',
      ],
      solution:
        'data = "hello"\nif (n := len(data)) > 3:\n    print(f"length {n} is long enough")',
      explanation: 'The walrus `:=` (PEP 572, Python 3.8+) assigns inside an expression. The parentheses matter: `if n := len(data) > 3:` is valid but binds `n` to the result of `len(data) > 3`, so it would print "length True is long enough". A plain `=` inside an expression is a SyntaxError.',
      hints: ['Two characters: `:=`. Parens clarify precedence.'],
      tags: ['modern', 'walrus', 'PEP-572'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Put the lines in order to annotate `lookup` as returning a `str` or `None`, using the `|` union syntax of Python 3.10+ (no `typing` import).',
      correctOrder: [
        'def lookup(name: str) -> str | None:',
        '    return None',
      ],
      distractorLines: [
        'def lookup(name: str) -> str || None:',
        'def lookup(name: str) -> Union[str, None]:',
      ],
      solution: 'def lookup(name: str) -> str | None:\n    return None',
      explanation: '`str | None` (PEP 604, Python 3.10+) means a string or nothing. The operator is a single `|`; `||` is not Python. `Union[str, None]` and `Optional[str]` mean the same thing but need `from typing import ...`, and the `|` form is the modern choice.',
      hints: ['A single `|`, not two. No `typing` import is needed on 3.10+.'],
      tags: ['modern', 'union', 'PEP-604'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Put the lines in order to annotate `categorize` as taking a list of ints and returning a dict from str to int, using the built-in `list` and `dict` types (Python 3.9+), with no `typing` import.',
      correctOrder: [
        'def categorize(nums: list[int]) -> dict[str, int]:',
        '    return {}',
      ],
      distractorLines: [
        'from typing import List, Dict',
        'def categorize(nums: List[int]) -> Dict[str, int]:',
      ],
      solution:
        'def categorize(nums: list[int]) -> dict[str, int]:\n    return {}',
      explanation: 'Since Python 3.9 (PEP 585) the built-in containers take type arguments directly: `list[int]`, `dict[str, int]`, `tuple[int, ...]`. The capitalized `typing.List` and `typing.Dict` still work, but they need an import and are deprecated aliases.',
      hints: ['Lowercase `list` and `dict`, the built-in names. No `typing` import.'],
      tags: ['modern', 'PEP-585', 'generics'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Put the lines in order: `first_and_rest(seq)` uses `match` to return None for an empty sequence (the first case) and otherwise a tuple of the first item and a list of the remaining items.',
      correctOrder: [
        'def first_and_rest(seq):',
        '    match seq:',
        '        case []:',
        '            return None',
        '        case [head, *rest]:',
        '            return (head, rest)',
      ],
      distractorLines: ['        case [head, rest]:', '        case [head, ...rest]:'],
      solution:
        'def first_and_rest(seq):\n    match seq:\n        case []:\n            return None\n        case [head, *rest]:\n            return (head, rest)',
      explanation: '`[head, *rest]` matches a sequence of one or more items: `head` takes the first and `*rest` collects the others into a list, which can be empty. `[head, rest]` matches only a sequence of exactly two items, so `[1, 2, 3]` would match no case and the function would return None. `...rest` is JavaScript spread syntax and a SyntaxError in Python. The brackets are optional at the top of a case (`case head, *rest:` is the same pattern), but the bracketed form reads more clearly.',
      hints: ['`*name` in a sequence pattern collects the remaining items into a list.'],
      tags: ['modern', 'match-case', 'sequence-pattern'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Put the lines in order: `classify(n)` uses `match` to return "negative" for a number below zero (a capture pattern with a guard, as the first case), then "zero" for 0, then "positive" for anything else.',
      correctOrder: [
        'def classify(n):',
        '    match n:',
        '        case x if x < 0:',
        '            return "negative"',
        '        case 0:',
        '            return "zero"',
        '        case _:',
        '            return "positive"',
      ],
      distractorLines: [
        '        case x where x < 0:',
        '        case x and x < 0:',
      ],
      solution:
        'def classify(n):\n    match n:\n        case x if x < 0:\n            return "negative"\n        case 0:\n            return "zero"\n        case _:\n            return "positive"',
      explanation: 'A guard is an `if` after the pattern: `case x if x < 0:` binds `x`, then tests the condition, and if the test fails Python moves on to the next case. `where` (from SQL) and `and` are SyntaxErrors in that position.',
      hints: ['if (not where, not and) for the guard.'],
      tags: ['modern', 'match-case', 'guard'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Put the lines in order: write `first`, a generic function that takes a list of items of one type `T` and returns its first item. Declare `T` inline with the type parameter syntax of Python 3.12+ (PEP 695), not with `TypeVar`.',
      correctOrder: ['def first[T](items: list[T]) -> T:', '    return items[0]'],
      distractorLines: ['from typing import TypeVar', 'T = TypeVar("T")'],
      solution: 'def first[T](items: list[T]) -> T:\n    return items[0]',
      explanation: 'Python 3.12 (PEP 695) lets a function declare its type parameters in square brackets right after its name, as in `def first[T](items: list[T]) -> T:`. `T` then exists only inside that function, and no `TypeVar` import or assignment is needed. Before 3.12 the same function needed `from typing import TypeVar` and `T = TypeVar("T")` at module level, which is what the two extra lines would build.',
      hints: ['The type parameter goes in square brackets right after the function name.'],
      tags: ['modern', 'PEP-695', 'generics'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Put the lines in order: raise an ExceptionGroup holding a ValueError and a TypeError, then handle each part with `except*` (Python 3.11+), the ValueError handler first.',
      correctOrder: [
        'try:',
        '    raise ExceptionGroup("multi", [ValueError("a"), TypeError("b")])',
        'except* ValueError as eg:',
        '    print("got values:", eg.exceptions)',
        'except* TypeError as eg:',
        '    print("got types:", eg.exceptions)',
      ],
      distractorLines: [
        'except ValueError as eg:',
        'except* (ValueError, TypeError):',
      ],
      solution:
        'try:\n    raise ExceptionGroup("multi", [ValueError("a"), TypeError("b")])\nexcept* ValueError as eg:\n    print("got values:", eg.exceptions)\nexcept* TypeError as eg:\n    print("got types:", eg.exceptions)',
      explanation: '`except*` (PEP 654, Python 3.11+) splits an ExceptionGroup: each `except*` clause runs for the part of the group that matches it, so here both handlers run, in order. The bound `eg` is itself an ExceptionGroup holding only the matched exceptions, so the first handler prints `got values: (ValueError(\'a\'),)`. A plain `except` cannot be mixed with `except*` on the same `try` (SyntaxError), and `except* (ValueError, TypeError):` would handle both kinds in one clause.',
      hints: ['`except*` with the asterisk handles part of an ExceptionGroup.'],
      tags: ['modern', 'exception-group', 'PEP-654'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Put the lines in order: create `a`, then `b`, merge them into a new dict `c` with the dict merge operator (Python 3.9+), and print `c`.',
      correctOrder: [
        'a = {"x": 1, "y": 2}',
        'b = {"y": 99, "z": 3}',
        'c = a | b',
        'print(c)',
      ],
      distractorLines: [
        'c = a + b',
        'c = dict(a, b)',
      ],
      solution: 'a = {"x": 1, "y": 2}\nb = {"y": 99, "z": 3}\nc = a | b\nprint(c)',
      explanation: 'The `|` operator (PEP 584, Python 3.9+) merges two dicts into a new one, and the right side wins on a shared key, so `c` is `{\'x\': 1, \'y\': 99, \'z\': 3}` and `a` and `b` are unchanged. `a + b` raises TypeError, since dicts do not support `+`, and `dict(a, b)` raises TypeError too, since `dict()` takes at most one positional mapping.',
      hints: ['`|` merges dicts and the right side wins; `+` does not work on dicts.'],
      tags: ['modern', 'dict-merge', 'PEP-584'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print? Type the three printed lines.',
      code: `def describe(n):
    match n:
        case 0:
            return "zero"
        case x if x < 10:
            return "small"
        case _:
            return "big"

print(describe(0))
print(describe(5))
print(describe(100))`,
      expectedOutput: `zero
small
big`,
      explanation:
        'match/case is top-down with first-match-wins. 0 hits the literal pattern. 5 falls through to the guarded "small" branch (0 didn\'t match, 5 < 10 passes the guard). 100 falls through to the wildcard.',
      hints: ['Cases are tried top to bottom, and the first one that fits wins.', 'A bare name such as `x` captures any value; the guard then decides.'],
      tags: ['modern', 'match-case'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print? Type the two printed lines.',
      code: `data = [1, 2, 3, 4, 5]
if (n := len(data)) > 3:
    print(f"long: {n}")
print(n)`,
      expectedOutput: `long: 5
5`,
      explanation:
        'len(data) = 5. The walrus binds n = 5 in the enclosing scope. n > 3 is True, so the if-body runs and prints "long: 5". n leaks out to module scope, so the final print(n) shows 5.',
      hints: ['Walrus binds in the enclosing scope; n leaks to the outer print.'],
      tags: ['modern', 'walrus'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print? Type the dict exactly as Python prints it.',
      code: `a = {"x": 1, "y": 2}
b = {"y": 99, "z": 3}
print(a | b)`,
      expectedOutput: `{'x': 1, 'y': 99, 'z': 3}`,
      acceptableOutputs: ['{"x": 1, "y": 99, "z": 3}'],
      explanation:
        'a | b creates a new dict. Right-hand side wins on conflicting keys, so y becomes 99. Both a and b are unchanged. Insertion order: keys from a first (in their original order), then b\'s new keys.',
      hints: ['Right side wins; insertion order preserved.'],
      tags: ['modern', 'dict-merge'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print? Type the three printed lines.',
      code: `def show(seq):
    match seq:
        case []:
            return "empty"
        case [x]:
            return f"single: {x}"
        case [x, y]:
            return f"pair: {x}, {y}"
        case [x, *rest]:
            return f"head: {x}, rest: {rest}"

print(show([1]))
print(show([1, 2]))
print(show([1, 2, 3, 4]))`,
      expectedOutput: `single: 1
pair: 1, 2
head: 1, rest: [2, 3, 4]`,
      explanation:
        'Sequence patterns match by length AND structure. [1] hits [x]. [1, 2] hits [x, y]. [1, 2, 3, 4] doesn\'t fit either fixed-length pattern, so falls through to [x, *rest] which captures the variable tail.',
      hints: ['Cases are tried in order; a list pattern without `*` fits only a list of exactly that length.'],
      tags: ['modern', 'match-case', 'sequence'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print? Type the two printed lines.',
      code: `def f(x: int | None) -> str:
    if x is None:
        return "none"
    return str(x * 2)

print(f(5))
print(f(None))`,
      expectedOutput: `10
none`,
      explanation: 'Python never checks annotations when a function runs: `int | None` only tells readers and type checkers what `x` may hold, exactly like the older `Optional[int]`. So `f(5)` returns `str(10)` and prints `10`, and `f(None)` takes the early return and prints `none`.',
      hints: ['Annotations are not checked at runtime; just follow the `if`.'],
      tags: ['modern', 'union'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print? Type the list exactly as Python prints it.',
      code: `nums = [1, 2, 3, 4, 5, 6]
print([y for x in nums if (y := x * 2) > 6])`,
      expectedOutput: `[8, 10, 12]`,
      explanation: 'For each `x`, the walrus stores `x * 2` in `y`, the filter keeps the item only if `y > 6`, and each kept `y` goes into the list. The doubles are 2, 4, 6, 8, 10 and 12; 2, 4 and 6 fail the test (6 is not greater than 6), so the result is `[8, 10, 12]`. Without the walrus you would compute `x * 2` twice, once in the filter and once as the item.',
      hints: ['Walrus computes once and tests; only kept items become y in the output.'],
      tags: ['modern', 'walrus', 'comprehension'],
      concepts: ['py-modern-syntax', 'py-comprehension'],
    },
  {
      id: 'py-modern-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print? Type the four printed lines.',
      code: `from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

def describe(p):
    match p:
        case Point(x=0, y=0):
            return "origin"
        case Point(x=0):
            return "on y-axis"
        case Point(y=0):
            return "on x-axis"
        case _:
            return "elsewhere"

print(describe(Point(0, 0)))
print(describe(Point(0, 5)))
print(describe(Point(3, 0)))
print(describe(Point(2, 2)))`,
      expectedOutput: `origin
on y-axis
on x-axis
elsewhere`,
      explanation:
        'Class patterns match by attribute. Point(0,0) matches the most specific case first. Point(0,5) matches "x=0" (y is unconstrained). Point(3,0) matches "y=0". Point(2,2) falls through to wildcard.',
      hints: ['Most specific patterns first; unconstrained attributes match anything.'],
      tags: ['modern', 'match-case', 'class-pattern'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print? Type the one printed line.',
      code: `if (line := "hello") and len(line) > 3:
    print(line)`,
      expectedOutput: `hello`,
      explanation: 'The walrus binds `line = "hello"`, and the parenthesized walrus has that value too, a non-empty and so truthy string. `and` then evaluates `len(line) > 3`, which is `5 > 3`, True, so the body prints `hello`. The parentheses matter: without them, `line := "hello" and len(line) > 3` would read `line` before it is assigned and raise NameError.',
      hints: ['Walrus + and: bind first, then test.'],
      tags: ['modern', 'walrus'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print? Type the four printed lines.',
      code: `def to_label(value):
    match value:
        case str() if len(value) > 0:
            return "non-empty str"
        case str():
            return "empty str"
        case int() | float():
            return "number"
        case _:
            return "other"

print(to_label("hi"))
print(to_label(""))
print(to_label(42))
print(to_label([1]))`,
      expectedOutput: `non-empty str
empty str
number
other`,
      explanation:
        'Type patterns: str() matches any string. The guard `if len(value) > 0` distinguishes non-empty. int() | float() is the OR pattern. Everything else (list here) hits the wildcard.',
      hints: ['Type pattern with parens; OR pattern with |.'],
      tags: ['modern', 'match-case', 'type-pattern'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-modern-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print? Type the printed number.',
      code: `chunks = [[1, 2], [3], [4, 5, 6]]
total = 0
for chunk in chunks:
    if (n := len(chunk)) > 1:
        total += n
print(total)`,
      expectedOutput: `5`,
      explanation:
        'For each chunk, walrus binds n = len(chunk). Filter to n > 1: [1,2]→n=2, [3]→n=1 (skip), [4,5,6]→n=3. Total: 2 + 3 = 5.',
      hints: ['Filter then sum lengths.'],
      tags: ['modern', 'walrus'],
      concepts: ['py-modern-syntax'],
    },
];
