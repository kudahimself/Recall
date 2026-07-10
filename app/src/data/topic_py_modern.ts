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
      question: 'What is structural pattern matching (match/case) in Python 3.10+?',
      options: [
        { id: 'a', text: 'It is identical to a switch statement found in C or JavaScript', isCorrect: false },
        { id: 'b', text: 'Like switch but with destructuring. match command: case {"action": "create", "data": data} destructures dicts. case Point(x, y) if x > 0: matches class instances with guards. It replaces complex if/elif chains with readable patterns.', isCorrect: true },
        { id: 'c', text: 'It only works with integers and strings', isCorrect: false },
        { id: 'd', text: 'It is a third-party library that must be installed separately', isCorrect: false },
      ],
      explanation: 'Pattern matching goes beyond simple value comparison. Sequence patterns match and unpack lists: case [first, *rest]:. Mapping patterns match dict subsets: case {"type": "error", "msg": msg}: extracts msg while ignoring other keys. Class patterns match attributes: case Point(x=0, y=y): matches points where x is 0. Guard clauses add conditions: case x if x > 0:. The wildcard case _: is the default. This replaces chains of isinstance() checks, dict key lookups, and tuple unpacking that would otherwise require nested if/elif blocks.',
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
      question: 'Use Enum for type-safe constants. Define an OrderStatus enum with states PENDING, PROCESSING, SHIPPED, and DELIVERED. Use it in a Django model with the choices parameter, and write a function that uses pattern matching (match/case) to determine the next valid status transition.',
      starterCode: `from enum import Enum

# Define OrderStatus enum, use in a model, and add transition logic
`,
      testCases: [
        {
          input: 'OrderStatus enum with Django model and transitions',
          expectedOutput: 'Enum definition, model with choices, transition function',
          description: 'Should define Enum and use in Django model with match/case',
        },
      ],
      solution: `from enum import Enum
from django.db import models


class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Order(models.Model):
    status = models.CharField(
        max_length=20,
        choices=[(s.value, s.name.title()) for s in OrderStatus],
        default=OrderStatus.PENDING.value,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.status}"


class InvalidTransitionError(Exception):
    pass


def get_next_status(current: OrderStatus) -> OrderStatus:
    """Determine the next valid status using pattern matching."""
    match current:
        case OrderStatus.PENDING:
            return OrderStatus.PROCESSING
        case OrderStatus.PROCESSING:
            return OrderStatus.SHIPPED
        case OrderStatus.SHIPPED:
            return OrderStatus.DELIVERED
        case OrderStatus.DELIVERED:
            raise InvalidTransitionError("Order already delivered")
        case OrderStatus.CANCELLED:
            raise InvalidTransitionError("Cannot transition from cancelled")
        case _:
            raise ValueError(f"Unknown status: {current}")


def transition_order(order, target_status):
    """Validate and apply a status transition."""
    current = OrderStatus(order.status)
    valid_next = get_next_status(current)

    if target_status != valid_next:
        raise InvalidTransitionError(
            f"Cannot go from {current.value} to {target_status.value}. "
            f"Next valid status is {valid_next.value}."
        )

    order.status = target_status.value
    order.save(update_fields=["status", "updated_at"])
    return order`,
      explanation: 'Enums prevent invalid values — OrderStatus.INVALID would raise an error, unlike a plain string. Inheriting from str makes the enum JSON-serializable and compatible with Django\'s CharField choices. The match/case on enum values is exhaustive and readable — each status maps clearly to its successor. The transition function enforces valid state changes, preventing an order from jumping from PENDING to DELIVERED. Using Enum instead of string constants means typos are caught at definition time, not at runtime in production.',
      hints: [
        'class OrderStatus(str, Enum) makes values string-compatible',
        'choices=[(s.value, s.name.title()) for s in OrderStatus] auto-generates choices',
        'match/case on Enum values is cleaner than if/elif chains',
        'OrderStatus("pending") converts a string back to the enum member',
      ],
      tags: ['enum', 'pattern-matching', 'django-model', 'type-safety'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'be-infra-modern-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODERN,
      course: Course.BACKEND,
      question: 'What are Abstract Base Classes (ABC) in Python and when should you use them?',
      options: [
        { id: 'a', text: 'ABCs are a performance optimization for class inheritance', isCorrect: false },
        { id: 'b', text: 'ABCs are only used in type checking with mypy and have no runtime effect', isCorrect: false },
        { id: 'c', text: 'ABCs define an interface that subclasses MUST implement — instantiating a subclass that skips an @abstractmethod raises TypeError at instantiation time. Use them to enforce a contract. Python\'s Protocol is the structural (duck-typing) alternative.', isCorrect: true },
        { id: 'd', text: 'ABCs replace regular classes entirely in modern Python', isCorrect: false },
      ],
      explanation: 'ABCs catch missing method implementations immediately when you create an instance, not later when you call the missing method. If PaymentProcessor has @abstractmethod def process(self, amount), then StripeProcessor() without a process() method raises TypeError: Can\'t instantiate abstract class StripeProcessor with abstract method process. This is a contract — every payment processor MUST implement process(). Python\'s Protocol (from typing) provides a similar guarantee but through structural typing (duck typing) — a class matches if it has the right methods, without explicitly inheriting from the Protocol.',
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
      explanation:
        'match introduces the pattern-matching block. case introduces each pattern. The wildcard pattern is `_` (single underscore) — there\'s no `default` keyword.',
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
      question:
        'Fill in the wildcard pattern that matches anything in match/case.',
      template: `match status:
      case "ok":
          return "good"
      case ___:
          return "other"`,
      blanks: ['_'],
      solution: 'match status:\n    case "ok":\n        return "good"\n    case _:\n        return "other"',
      explanation:
        'Single underscore is the wildcard pattern. Matches anything; the bound name is intentionally unused. There\'s no `default` or `else` in match/case.',
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
      explanation:
        'Walrus `:=` (PEP 572, 3.8+) — assigns and returns the value. Use parens to control precedence. Plain `=` is invalid in expression context.',
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
      question:
        'Fill in the PEP 604 union operator for "either str or None".',
      template: `def find(name: str) -> str ___ None:
      ...`,
      blanks: ['|'],
      solution: 'def find(name: str) -> str | None:\n    ...',
      explanation:
        'PEP 604 (3.10+) — single | for union types. Same character used for set union and dict merge. Legacy form: typing.Optional[str] or Union[str, None].',
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
      question:
        'Fill in the lowercase PEP 585 generic for a list of ints.',
      template: `def total(nums: ___[int]) -> int:
      return sum(nums)`,
      blanks: ['list'],
      solution: 'def total(nums: list[int]) -> int:\n    return sum(nums)',
      explanation:
        'PEP 585 (3.9+) — built-in containers can be subscripted directly. list[int], dict[str, int], tuple[int, ...]. No typing.List/typing.Dict needed.',
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
      explanation:
        'PEP 584 (3.9+) — | merges two dicts. Right side wins on conflicts. + does not work on dicts.',
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
      question:
        'Fill in the keyword for guarded match/case patterns.',
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
      question:
        'Fill in the (3.11+) syntax for handling exceptions inside an ExceptionGroup.',
      template: `try:
    raise ExceptionGroup("multi", [ValueError("a")])
___ ValueError as eg:
    print(eg.exceptions)`,
      blanks: ['except*'],
      solution:
        'try:\n    raise ExceptionGroup("multi", [ValueError("a")])\nexcept* ValueError as eg:\n    print(eg.exceptions)',
      explanation:
        'PEP 654 (3.11+) — except* with the asterisk splits an ExceptionGroup. Each except* handles only the matching subexceptions; non-matching ones re-form into a smaller ExceptionGroup that propagates.',
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
      question:
        'Fill in the inline generic syntax (PEP 695, 3.12+) for a generic function.',
      template: `def first___T___(items: list[T]) -> T:
      return items[0]`,
      blanks: ['[', ']'],
      solution: 'def first[T](items: list[T]) -> T:\n    return items[0]',
      explanation:
        'PEP 695 (3.12+) — declare type parameters inline as `[T]` after the function/class name. No TypeVar needed.',
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
      question:
        'Fill in the OR pattern in match/case for "int or float".',
      template: `match value:
      case int() ___ float():
          return "number"
      case _:
          return "other"`,
      blanks: ['|'],
      solution:
        'match value:\n    case int() | float():\n        return "number"\n    case _:\n        return "other"',
      explanation:
        '| in match/case combines patterns: matches if EITHER pattern matches. Same character used for unions and dict merge — Python overloads | heavily.',
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
      question:
        'Use match/case to dispatch on a status string with a default case.',
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
      explanation:
        'match/case (3.10+, PEP 634) is structural pattern matching, not a C-style switch. The wildcard pattern is `_` (single underscore) — there\'s no `default` keyword. Cases match top-to-bottom; first match wins.',
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
        'Use match/case with class patterns to destructure a Point.',
      correctOrder: [
        'from dataclasses import dataclass',
        '',
        '@dataclass',
        'class Point:',
        '    x: int',
        '    y: int',
        '',
        'def describe(p):',
        '    match p:',
        '        case Point(x=0, y=0):',
        '            return "origin"',
        '        case Point(x=0, y=y):',
        '            return f"y-axis at {y}"',
        '        case Point():',
        '            return "elsewhere"',
      ],
      distractorLines: [
        '        case Point(0, 0):',
        '        case Point.origin:',
      ],
      solution:
        'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\ndef describe(p):\n    match p:\n        case Point(x=0, y=0):\n            return "origin"\n        case Point(x=0, y=y):\n            return f"y-axis at {y}"\n        case Point():\n            return "elsewhere"',
      explanation:
        'Class patterns destructure objects by attribute. Use Point(x=0, y=y) to match on x=0 and bind y to the y attribute. Positional class patterns require __match_args__ (auto-generated for dataclasses).',
      hints: ['Class patterns: ClassName(attr=pattern, attr2=name).'],
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
      question:
        'Use the walrus operator to compute and test a value in a single if expression.',
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
      explanation:
        'Walrus `:=` (PEP 572, 3.8+) assigns inside an expression. Wrap in parens when used in larger expressions to control precedence — without parens, `n := len(data) > 3` would assign True/False to n. Plain `=` is invalid in expression context.',
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
      question:
        'Annotate a function using PEP 604 union syntax for "str or None" return.',
      correctOrder: [
        'def lookup(name: str) -> str | None:',
        '    return None',
      ],
      distractorLines: [
        'def lookup(name: str) -> str || None:',
        'def lookup(name: str) -> Union[str, None]:',
      ],
      solution: 'def lookup(name: str) -> str | None:\n    return None',
      explanation:
        'PEP 604 (3.10+) lets you write `T | U` for unions. Single | (not ||). Legacy form `Union[str, None]` (and `Optional[str]`) still works — but the | form is the modern preference and doesn\'t require a typing import.',
      hints: ['Single |, not double. No typing import needed in 3.10+.'],
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
      question:
        'Use PEP 585 lowercase generics for a function that takes a list of ints and returns a dict mapping str to int.',
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
      explanation:
        'PEP 585 (3.9+) supports lowercase generics on built-in containers — list[int], dict[str, int], tuple[int, ...]. The legacy typing.List/Dict still works but is no longer preferred for new code.',
      hints: ['Lowercase: list/dict/tuple/set. No typing import needed.'],
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
        'Use match/case with a list pattern to destructure a sequence into head and rest.',
      correctOrder: [
        'def first_and_rest(seq):',
        '    match seq:',
        '        case []:',
        '            return None',
        '        case [head, *rest]:',
        '            return (head, rest)',
      ],
      distractorLines: [
        '        case [head, rest]:',
        '        case head, *rest:',
      ],
      solution:
        'def first_and_rest(seq):\n    match seq:\n        case []:\n            return None\n        case [head, *rest]:\n            return (head, rest)',
      explanation:
        'Sequence patterns use [head, *rest] for "head then variable-length tail". The brackets are required — bare `head, *rest` is not a valid match pattern. [head, rest] matches a 2-element sequence specifically.',
      hints: ['Sequence patterns need brackets; *rest absorbs variable tail.'],
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
      question:
        'Use a guard clause with `if` in match/case to add a condition to a pattern.',
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
      explanation:
        'Guard clauses use `if` after the pattern. `case x if x < 0:` binds x then tests the guard. The pattern matches but the case is skipped if the guard fails. Don\'t use `where` (SQL) or `and` here.',
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
        'Use Python 3.12+ generic syntax for a function: `def first[T](items: list[T]) -> T:` (PEP 695).',
      correctOrder: [
        'def first[T](items: list[T]) -> T:',
        '    return items[0]',
      ],
      distractorLines: [
        'from typing import TypeVar',
        'T = TypeVar("T")',
      ],
      solution: 'def first[T](items: list[T]) -> T:\n    return items[0]',
      explanation:
        'PEP 695 (3.12+) introduces inline generic syntax — no TypeVar import needed. The `[T]` after the function name declares the type parameter. This is the modern preferred form for new code.',
      hints: ['No TypeVar; the [T] after the name declares it inline.'],
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
      question:
        'Use except* (3.11+) to handle exceptions inside an ExceptionGroup.',
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
      explanation:
        'except* (3.11+, PEP 654) handles ExceptionGroups by SPLITTING — each except* block runs for matching subexceptions. Plain except would only catch the entire group. The bound `eg` is itself an ExceptionGroup containing only the matched subset.',
      hints: ['except* with the asterisk splits the ExceptionGroup.'],
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
      question:
        'Use the | operator on dicts to merge two dicts into a new one (Python 3.9+).',
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
      explanation:
        'PEP 584 (3.9+) — | merges two dicts into a new one. Right side wins on duplicate keys. + does not work on dicts. dict(a, b) raises TypeError (only accepts kwargs or one mapping).',
      hints: ['| for dict merge (right wins). + does not work.'],
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
      question: 'What does this code print?',
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
      hints: ['First match wins; literal patterns try before guards.'],
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
      question: 'What does this code print?',
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
      question: 'What does this code print?',
      code: `a = {"x": 1, "y": 2}
b = {"y": 99, "z": 3}
print(a | b)`,
      expectedOutput: `{'x': 1, 'y': 99, 'z': 3}`,
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
      question: 'What does this code print?',
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
      hints: ['Patterns match by length first; fixed before variadic.'],
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
      question: 'What does this code print?',
      code: `def f(x: int | None) -> str:
    if x is None:
        return "none"
    return str(x * 2)

print(f(5))
print(f(None))`,
      expectedOutput: `10
none`,
      explanation:
        'PEP 604 union `int | None` is checked at runtime via isinstance/None comparison the same as before — no behavior change vs Optional[int]. Just nicer syntax. f(5) doubles to 10. f(None) takes the early return.',
      hints: ['Union types behave the same at runtime; just modern syntax.'],
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
      question: 'What does this code print?',
      code: `nums = [1, 2, 3, 4, 5, 6]
print([y for x in nums if (y := x * 2) > 6])`,
      expectedOutput: `[8, 10, 12]`,
      explanation:
        'The walrus binds y = x*2 and the if filters where y > 6. So we double each then keep ones > 6: 4 (no), 8 (yes), 10 (yes), 12 (yes). Result: [8, 10, 12].',
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
      question: 'What does this code print?',
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
      question: 'What does this code print?',
      code: `import sys

if (line := "hello") and len(line) > 3:
    print(line)`,
      expectedOutput: `hello`,
      explanation:
        'Walrus binds line = "hello" (truthy non-empty string). Then the and short-circuits to len("hello") = 5 > 3 = True. The if-body runs, printing "hello".',
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
      question: 'What does this code print?',
      code: `def to_label(value):
    match value:
        case str() if len(value) > 0:
            return f"non-empty str"
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
      question: 'What does this code print?',
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
