/**
 * Topic.PY_TYPE_HINTS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pythonAdvancedQuestions.ts (3), pythonBatchBExpansionQuestions.ts (4), pythonGapFillQuestions.ts (2), pythonMasteryTier1Questions.ts (6), pyTypeHintsCloze.ts (10)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_type_hints_questions: Question[] = [
  {
      id: 'py-type-hints-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the modern PEP 585 lowercase generic for a list of ints.',
      template: `def total(nums: ___[int]) -> int:
      return sum(nums)`,
      blanks: ['list'],
      solution: 'def total(nums: list[int]) -> int:\n    return sum(nums)',
      explanation:
        'Python 3.9+ supports lowercase built-in generics (PEP 585): list[int], dict[str, int], tuple[int, ...]. The capitalized typing.List form is now legacy — both work but lowercase is preferred for new code.',
      hints: ['Lowercase, same name as the built-in.'],
      tags: ['type-hints', 'PEP-585'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-type-hints-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the modern PEP 604 union for "either str or None" (Python 3.10+).',
      template: `def find(name: str) -> str ___ None:
      ...`,
      blanks: ['|'],
      solution: 'def find(name: str) -> str | None:\n    ...',
      explanation:
        'Python 3.10+ supports `T | U` for unions (PEP 604). The legacy form is Optional[str] or Union[str, None]. The | form is preferred — same character used for set union and dict merge.',
      hints: ['Single character; same as the union operator.'],
      tags: ['type-hints', 'PEP-604', 'union'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-type-hints-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the typing utility for "T or None" (legacy alternative to T | None).',
      template: `from typing import ___

def find(name: str) -> ___[str]:
    ...`,
      blanks: ['Optional', 'Optional'],
      solution: 'from typing import Optional\n\ndef find(name: str) -> Optional[str]:\n    ...',
      explanation:
        'Optional[T] is sugar for Union[T, None]. Useful for "may be missing" return types. Use the modern T | None form on Python 3.10+; Optional remains valid and is needed on older Python.',
      hints: ['Same word as the adjective for "may be present or absent".'],
      tags: ['type-hints', 'Optional'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-type-hints-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the typing tool to annotate a callable that takes (int, str) and returns bool.',
      template: `from typing import ___

handler: ___[[int, str], bool]`,
      blanks: ['Callable', 'Callable'],
      solution: 'from typing import Callable\n\nhandler: Callable[[int, str], bool]',
      explanation:
        'Callable[[arg_types], return_type]. Note the double brackets: outer for the Callable itself, inner for the list of argument types. For "any callable", use Callable without parameters.',
      hints: ['Capitalized; same as the noun for "something callable".'],
      tags: ['type-hints', 'Callable'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-type-hints-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the typing tool to declare a generic type variable.',
      template: `from typing import ___

T = ___("T")

def first(items: list[T]) -> T:
    return items[0]`,
      blanks: ['TypeVar', 'TypeVar'],
      solution:
        'from typing import TypeVar\n\nT = TypeVar("T")\n\ndef first(items: list[T]) -> T:\n    return items[0]',
      explanation:
        'TypeVar declares a generic type parameter. The string argument must match the variable name (so type checkers can detect mismatches). Python 3.12+ has new syntax `def first[T](items: list[T]) -> T:` (PEP 695) that doesn\'t need TypeVar.',
      hints: ['CamelCase: "Type" + "Var".'],
      tags: ['type-hints', 'TypeVar'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-type-hints-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the lowercase generic for a dict mapping str to int.',
      template: `def counts() -> ___[str, int]:
      return {"a": 1, "b": 2}`,
      blanks: ['dict'],
      solution: 'def counts() -> dict[str, int]:\n    return {"a": 1, "b": 2}',
      explanation:
        'Lowercase dict[K, V] (PEP 585, 3.9+). Two type params for key and value. Legacy: typing.Dict[K, V].',
      hints: ['Lowercase; same as the built-in container.'],
      tags: ['type-hints', 'dict'],
      concepts: ['py-type-hint-syntax', 'py-dict-key-hashability'],
    },
  {
      id: 'py-type-hints-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the typing tool that defines a structural protocol (duck typing with type checks).',
      template: `from typing import ___

class HasName(___):
    name: str`,
      blanks: ['Protocol', 'Protocol'],
      solution: 'from typing import Protocol\n\nclass HasName(Protocol):\n    name: str',
      explanation:
        'Protocol enables structural subtyping (PEP 544) — any class with the named attributes/methods is considered a subtype, no inheritance needed. The pythonic answer to "interfaces" with duck-typing semantics.',
      hints: ['Capitalized; same word as the noun for "communication agreement".'],
      tags: ['type-hints', 'Protocol', 'PEP-544'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-type-hints-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the typing tool for a fixed-length tuple of (int, str, bool).',
      template: `record: ___[int, str, bool]`,
      blanks: ['tuple'],
      solution: 'record: tuple[int, str, bool]',
      explanation:
        'tuple[T1, T2, T3] is a fixed-length tuple with positional types. For "tuple of any length of T", use tuple[T, ...] with the literal ellipsis. Don\'t confuse with List/Sequence semantics.',
      hints: ['Lowercase; same as the built-in.'],
      tags: ['type-hints', 'tuple'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-type-hints-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the typing tool for "exactly these literal values" (a string from a fixed set).',
      template: `from typing import ___

mode: ___["r", "w", "a"]`,
      blanks: ['Literal', 'Literal'],
      solution: 'from typing import Literal\n\nmode: Literal["r", "w", "a"]',
      explanation:
        'Literal[v1, v2, ...] restricts the type to the listed values. Useful for status enums, modes, named choices. Type checkers will flag any other string as an error.',
      hints: ['Same word as the adjective for "exact".'],
      tags: ['type-hints', 'Literal'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-type-hints-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the value used to mark a function that doesn\'t return anything.',
      template: `def log(msg: str) -> ___:
      print(msg)`,
      blanks: ['None'],
      solution: 'def log(msg: str) -> None:\n    print(msg)',
      explanation:
        'A function that returns nothing is annotated -> None. The actual return value (implicit None) matches. typing.NoReturn is for functions that NEVER return (raise unconditionally, run forever) — different concept.',
      hints: ['The Python null/missing value.'],
      tags: ['type-hints', 'None'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-adv-types-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      question: 'Which signature correctly annotates a function that takes a filename string and returns either a dict mapping string keys to either str or int values, OR `None` if the file is missing?',
      options: [
        { id: 'a', text: '`def parse_config(filename: str) -> dict[str, str | int] | None:`', isCorrect: true },
        { id: 'b', text: '`def parse_config(filename) -> Optional[dict]:`', isCorrect: false },
        { id: 'c', text: '`def parse_config(filename: str) -> Union[dict, None, str, int]:`', isCorrect: false },
        { id: 'd', text: '`def parse_config(filename: str) -> Optional[dict[str, Union(str, int)]]:`', isCorrect: false },
      ],
      explanation: '`Optional[X]` is shorthand for `Union[X, None]`. In 3.10+ the cleaner spelling is `X | None`. For a dict with mixed-type values, parametrise both the key and value types: `dict[str, str | int]` (or `dict[str, Union[str, int]]`). Option (b) is untyped (`dict` with no parameters loses info). (c) flattens everything into one union — the return is not a bare str or int, it is a dict of them. (d) uses `Union(...)` with parentheses — it must be subscripted with square brackets: `Union[str, int]`.',
      hints: [
        'Optional[X] = X | None = Union[X, None]',
        'dict[K, V] — parametrise keys and values',
        'Union uses square brackets: Union[A, B]',
      ],
      tags: ['type-hints', 'Optional', 'Union', 'annotations'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-adv-types-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      question: 'Which is the correct way to declare a generic `Repository` class parametrised by a type variable `T`, with an `add(item: T) -> None` method that appends to an internal `list[T]`?',
      options: [
        { id: 'a', text: '`T = TypeVar("T")` then `class Repository(Generic[T]):` with `self._items: list[T] = []` and `def add(self, item: T) -> None: self._items.append(item)`', isCorrect: true },
        { id: 'b', text: '`class Repository<T>:` with `def add(self, item: T) -> None:` — TypeScript-style angle brackets', isCorrect: false },
        { id: 'c', text: '`class Repository(Generic):` with `def add(self, item: Generic) -> None:` — no TypeVar needed', isCorrect: false },
        { id: 'd', text: '`T = "any"` then `class Repository[T]:` — strings become type variables', isCorrect: false },
      ],
      explanation: '`TypeVar("T")` names a type variable; `Generic[T]` makes the class parametrisable so `Repository[int]` and `Repository[str]` are distinct types to the checker. Inside the class, `T` refers to the concrete type the caller picks, keeping `_items`, `add`, and `get` all consistent. (b) is TypeScript syntax, not Python. (c) drops the variable entirely — `Generic` alone is not a type. (d) makes `T` a string, which is not how type variables work. PEP 695 (3.12+) adds a shorter form: `class Repository[T]: ...` — no `Generic`/`TypeVar` import — but the traditional spelling in (a) is what runs on most versions.',
      hints: [
        'TypeVar creates a placeholder type',
        'Generic[T] makes the class parameterizable',
        'PEP 695 (3.12+): class Repository[T]: ... is the newer sugar',
      ],
      tags: ['type-hints', 'generics', 'TypeVar', 'Callable'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-adv-types-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      question: 'What happens at runtime when Python encounters type hints like `def greet(name: str) -> str`?',
      options: [
        { id: 'a', text: 'Python enforces the types and raises TypeError if you pass an int instead of str', isCorrect: false },
        { id: 'b', text: 'Python compiles the function differently to optimize for the specified types', isCorrect: false },
        { id: 'c', text: 'Python stores the hints in __annotations__ but does NOT enforce them — you can pass any type without error', isCorrect: true },
        { id: 'd', text: 'Python converts the input to the specified type automatically (e.g., int to str)', isCorrect: false },
      ],
      explanation: 'Type hints in Python are purely informational at runtime. Python stores them in the function\'s __annotations__ attribute (e.g., greet.__annotations__ == {"name": str, "return": str}) but never checks them during execution. You can call greet(42) without any error. Enforcement comes from external tools like mypy (static analysis) or runtime libraries like pydantic/beartype that explicitly check annotations. This design keeps Python\'s dynamic nature intact while enabling optional static analysis.',
      hints: [
        'Python is dynamically typed — hints don\'t change that',
        'Check function.__annotations__ to see stored hints',
      ],
      tags: ['type-hints', 'runtime', 'annotations', 'mypy'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-types-callable',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      question: 'Which type hint describes a parameter that is a callable taking an `int` and a `str` and returning a `bool`?',
      options: [
        { id: 'a', text: '`Callable[[int, str], bool]`', isCorrect: true },
        { id: 'b', text: '`Callable[int, str, bool]`', isCorrect: false },
        { id: 'c', text: '`Callable[(int, str) -> bool]`', isCorrect: false },
        { id: 'd', text: '`Callable[bool, [int, str]]`', isCorrect: false },
      ],
      explanation: '`Callable[[Arg1, Arg2, ...], Return]` is the type-hint syntax. The argument types go in an inner list, then the return type. `Callable[..., T]` (with `...`) means "any args, returns T" — escape hatch when you do not care about arg types. For keyword-only signatures you need a `Protocol` with a `__call__` method — `Callable` cannot express `*args`/`**kwargs` names.',
      hints: [
        'Callable[[Arg1, Arg2], Return] — inner list of arg types, then return',
        'Callable[..., T] = "any args, returns T"',
        'For kwargs-aware signatures → Protocol with __call__',
      ],
      tags: ['type-hints', 'Callable', 'higher-order'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-types-generic-class',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      question: 'Using the pre-3.12 `typing` module, which snippet correctly declares a generic `Box` class parametrised by a type variable `T`?',
      options: [
        { id: 'a', text: '`T = TypeVar("T")` then `class Box(Generic[T]):` with `def __init__(self, item: T): self.item = item`', isCorrect: true },
        { id: 'b', text: '`class Box<T>:` then `def __init__(self, item: T): self.item = item` — Python supports angle-bracket generics', isCorrect: false },
        { id: 'c', text: '`class Box(Generic):` then use the string `"T"` as the type annotation — Generic infers the parameter', isCorrect: false },
        { id: 'd', text: '`T = type("T", (), {})` then `class Box(T):` — TypeVars are dynamically created classes', isCorrect: false },
      ],
      explanation: '`TypeVar("T")` names a type variable; `Generic[T]` parametrises the class so `Box[int]` and `Box[str]` are distinct types to a checker. At runtime the `[int]` subscription is a no-op — this is purely compile-time information. (b) uses TypeScript syntax. (c) misuses `Generic` (it needs the TypeVar in its subscript). (d) builds a runtime class, not a type variable. PEP 695 (3.12+) has the shorter `class Box[T]: ...` — no `Generic`/`TypeVar` imports — but (a) is the portable spelling.',
      hints: [
        'T = TypeVar("T"); class Box(Generic[T])',
        'Box[int], Box[str] — distinct types to the checker',
        '3.12+: `class Box[T]: ...` (PEP 695 simplified form)',
      ],
      tags: ['type-hints', 'Generic', 'TypeVar'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-types-runtime',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      question: 'What does Python do with type hints at runtime?',
      options: [
        { id: 'a', text: 'Validates them — raises TypeError on mismatch', isCorrect: false },
        { id: 'b', text: 'Stores them in `__annotations__` but does NO runtime enforcement. Hints are documentation for humans and input for type checkers (mypy, Pyright, Pyre). To get runtime validation you need pydantic, beartype, or manual `isinstance` checks.', isCorrect: true },
        { id: 'c', text: 'Compiles them to machine code', isCorrect: false },
        { id: 'd', text: 'Silently deletes them', isCorrect: false },
      ],
      explanation: 'This surprises beginners: `def add(a: int, b: int) -> int: return a + b` accepts `add("x", "y")` at runtime with no complaint (returns `"xy"`). Type hints are CHECKED by tools (mypy, Pyright) — at runtime they\'re inert metadata on `__annotations__`. For runtime enforcement: pydantic (validation + coercion), beartype (decorator that checks types per call), or the stricter `typing.get_type_hints()` introspection.',
      hints: [
        'Python stores hints in __annotations__; does not enforce',
        'For runtime checks: pydantic, beartype, or explicit isinstance',
        'Type hints exist to help tools (mypy, Pyright, IDE)',
      ],
      tags: ['type-hints', 'runtime', 'mypy'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-types-paramspec',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      question: 'Which signature correctly types a generic decorator that preserves the wrapped function\'s full argument signature and return type?',
      options: [
        { id: 'a', text: '`P = ParamSpec("P"); R = TypeVar("R")` then `def log_calls(fn: Callable[P, R]) -> Callable[P, R]:` with `def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:`', isCorrect: true },
        { id: 'b', text: '`def log_calls(fn: Callable[..., Any]) -> Callable[..., Any]:` — `...` is how you preserve any signature', isCorrect: false },
        { id: 'c', text: '`T = TypeVar("T")` then `def log_calls(fn: T) -> T:` — a TypeVar alone captures the whole callable', isCorrect: false },
        { id: 'd', text: '`def log_calls(fn: Callable) -> Callable:` — omit the type parameters so the decorator stays generic', isCorrect: false },
      ],
      explanation: '`ParamSpec` (PEP 612, 3.10+) is the only construct that captures the full `(*args, **kwargs)` shape of a callable. `Callable[P, R]` plus `*args: P.args, **kwargs: P.kwargs` passes the captured signature through the wrapper, so callers of the decorated function still get argument-name autocomplete and per-call type checking. (b) collapses everything to `Any` — callers lose all signature info. (c) binds `T` to the whole callable type; mypy will not relate input args to output args through `T`. (d) is a bare `Callable` with no parameters at all — also loses info.',
      hints: [
        'P = ParamSpec("P"); Callable[P, R] captures full signature',
        'Use P.args and P.kwargs in the wrapper signature',
        'Callable[..., R] loses per-call arg-name info',
      ],
      tags: ['type-hints', 'ParamSpec', 'decorator', 'PEP-612'],
      concepts: ['py-type-hint-syntax', 'py-decorator-application'],
    },
  {
      id: 'py-gap-typehints-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      question: 'What are type hints in Python?',
      options: [
        { id: 'a', text: 'Compiler directives that prevent code from running if the wrong type is passed', isCorrect: false },
        { id: 'b', text: 'Optional annotations that document expected types (e.g., `def greet(name: str) -> str`). They are NOT enforced at runtime — they exist for documentation, IDE support, and static analysis tools like mypy.', isCorrect: true },
        { id: 'c', text: 'A way to convert variables from one type to another, like `int("42")`', isCorrect: false },
        { id: 'd', text: 'Error messages that Python displays when you use the wrong data type', isCorrect: false },
      ],
      explanation: 'Type hints (added in Python 3.5+) let you annotate the expected types of function parameters, return values, and variables. They do NOT change how Python runs your code — you can still pass any type and Python won\'t stop you. Their value comes from: (1) documentation for other developers, (2) IDE autocompletion and error detection, (3) static analysis tools like mypy that can catch type errors before runtime.',
      hints: [
        'The key word is "optional" — Python doesn\'t enforce them',
        'They use colon syntax for parameters and `->` for return types',
      ],
      tags: ['type-hints', 'annotations', 'mypy', 'basics'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-gap-typehints-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function named `calculate_area` that takes two parameters, `width` and `height`, with full type hints — annotate each parameter as `float` and annotate the return type as `float` — and returns the product of the two. Then declare a module-level variable `names` annotated as a list of strings (use lowercase PEP 585 syntax) and initialise it to the list containing "Alice" and "Bob". Print the result of calling `calculate_area` with 5.0 and 3.0, then print `names`.',
      starterCode: `# Define calculate_area with float type hints on both params and the return type


# Declare names: list[str] = ["Alice", "Bob"]


# Print calculate_area(5.0, 3.0) and names
`,
      testCases: [
        {
          input: 'calculate_area(5.0, 3.0)',
          expectedOutput: '15.0',
          description: 'Should return the area with correct type hints',
        },
        {
          input: 'names',
          expectedOutput: '["Alice", "Bob"]',
          description: 'Should be a type-hinted list of strings',
        },
      ],
      solution: `def calculate_area(width: float, height: float) -> float:
    return width * height

names: list[str] = ["Alice", "Bob"]

print(calculate_area(5.0, 3.0))  # 15.0
print(names)  # ["Alice", "Bob"]`,
      explanation: 'Parameter type hints use colon syntax: `width: float`. Return type hints use arrow syntax: `-> float`. Variable type hints also use colons: `names: list[str]`. Since Python 3.9+ (PEP 585), you can parametrise the built-in `list`, `dict`, `tuple`, `set` directly — no `typing` import needed. In older versions you had to write `from typing import List` and use `List[str]`, but that form is now the legacy style. Remember: these hints don\'t change behavior — they\'re purely informational.',
      hints: [
        'Parameters: `width: float, height: float`',
        'Return type: `-> float` after the closing parenthesis',
        'Variable: `names: list[str] = [...]`',
      ],
      tieredHints: {
        apiSignature: 'def func(param: type, ...) -> return_type:',
        skeleton: `def calculate_area(width: ____, height: ____) -> ____:
    return width ____ height

names: ____[____] = ["Alice", "Bob"]

print(____(5.0, 3.0))
print(names)`,
      },
      tags: ['type-hints', 'annotations', 'basics'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-types-union-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      question: 'In Python 3.10+, what is the difference between `str | None` and `Optional[str]`?',
      options: [
        { id: 'a', text: 'They behave differently — one is stricter', isCorrect: false },
        { id: 'b', text: 'They are equivalent. PEP 604 added `X | Y` as native union syntax; `Optional[X]` from `typing` is exactly `X | None`. The `|` form is shorter and does not need a typing import — prefer it in new 3.10+ code.', isCorrect: true },
        { id: 'c', text: '`str | None` is a runtime error', isCorrect: false },
        { id: 'd', text: 'Optional only works on custom classes', isCorrect: false },
      ],
      explanation: 'PEP 604 (Python 3.10+) lets you write `str | None`, `int | float`, `list[int] | None` without importing from `typing`. It is exactly `Union[str, None]` / `Optional[str]` at the type-checker level. On 3.9 and below you still need `from __future__ import annotations` or `Optional[X]`. Mypy, Pyright, and IDE type checkers treat them identically.',
      hints: [
        '`X | Y` is PEP 604 native union syntax',
        'No typing import required on 3.10+',
        'Works the same as `Union[X, Y]` / `Optional[X]`',
      ],
      tags: ['type-hints', 'union', 'PEP-604', 'optional'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-types-protocol-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      question: 'You want a function `shut_it_down(resource)` to accept ANY object with a `.close() -> None` method — no inheritance required. Which declaration correctly expresses that requirement to the type checker?',
      options: [
        { id: 'a', text: '`class Closeable(Protocol): def close(self) -> None: ...` then `def shut_it_down(resource: Closeable) -> None:` — any class with a matching `close` satisfies the protocol structurally', isCorrect: true },
        { id: 'b', text: '`class Closeable(ABC): @abstractmethod def close(self) -> None: ...` — callers must inherit from Closeable', isCorrect: false },
        { id: 'c', text: '`def shut_it_down(resource: object) -> None:` — `object` accepts any value with any methods', isCorrect: false },
        { id: 'd', text: '`def shut_it_down(resource: Callable[[], None]) -> None:` — `Callable` is the standard way to describe "has a method"', isCorrect: false },
      ],
      explanation: '`Protocol` (PEP 544) gives you duck-typing with type-checker teeth: any class whose methods match the shape satisfies the protocol — no inheritance declaration needed. (b) uses an `ABC` which requires explicit inheritance — callers can\'t pass arbitrary third-party classes. (c) accepts any object but the type checker won\'t know `.close()` exists, so `resource.close()` becomes an attribute error in mypy. (d) types `resource` as a callable, not an object with a `.close()` method. Decorate a Protocol with `@runtime_checkable` if you want `isinstance()` to work on it too.',
      hints: [
        'Protocol is in typing (3.8+)',
        'Structural typing — shape match, no inheritance required',
        '@runtime_checkable makes isinstance() work against a Protocol',
      ],
      tags: ['type-hints', 'Protocol', 'structural-typing', 'duck-typing'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-types-typeddict-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      question: 'You have a JSON-shaped payload `{"id": 1, "name": "Alice", "email": "a@x.com"}` and you want to keep it as a plain `dict` at runtime but have a type checker enforce the key/value schema. Which declaration does that?',
      options: [
        { id: 'a', text: '`class User(TypedDict): id: int; name: str; email: str` — a `User` is still a `dict` at runtime, but mypy checks keys and value types', isCorrect: true },
        { id: 'b', text: '`class User: id: int; name: str; email: str` — a plain class with annotations gives mypy the same schema', isCorrect: false },
        { id: 'c', text: '`User = dict[str, str | int]` — a type alias for any dict with string keys and str/int values', isCorrect: false },
        { id: 'd', text: '`@dataclass class User: id: int; name: str; email: str` — dataclasses are the dict-schema primitive', isCorrect: false },
      ],
      explanation: '`TypedDict` is specifically for giving a dict schema without changing its runtime type — useful for API payloads and request bodies that must stay as dicts. (b) makes a plain class — instances are not dicts and do not subscript with `["name"]`. (c) is a type alias, but it cannot enforce that specific keys (`"id"`, `"name"`, `"email"`) are present — any `str`-keyed dict would pass. (d) creates a dataclass — instances are objects with attribute access, not dicts. Pair `TypedDict` with `total=False` or per-key `NotRequired` for optional fields.',
      hints: [
        'TypedDict gives type checkers a dict schema',
        'Runtime representation is still a plain dict',
        'Alternative to dataclass/pydantic when you need plain dicts',
      ],
      tags: ['type-hints', 'TypedDict', 'dict', 'schema'],
      concepts: ['py-type-hint-syntax', 'py-dict-key-hashability'],
    },
  {
      id: 'py-types-literal-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      question: 'You want `set_log_level(level)` to accept ONLY the four strings `"DEBUG"`, `"INFO"`, `"WARNING"`, `"ERROR"` — and have a type checker reject `set_log_level("FOO")`. Which annotation does that?',
      options: [
        { id: 'a', text: '`def set_log_level(level: Literal["DEBUG", "INFO", "WARNING", "ERROR"]) -> str:`', isCorrect: true },
        { id: 'b', text: '`def set_log_level(level: str in ["DEBUG", "INFO", "WARNING", "ERROR"]) -> str:`', isCorrect: false },
        { id: 'c', text: '`def set_log_level(level: Enum["DEBUG", "INFO", "WARNING", "ERROR"]) -> str:`', isCorrect: false },
        { id: 'd', text: '`def set_log_level(level: str) -> str:` — then add a runtime `assert level in {...}`', isCorrect: false },
      ],
      explanation: '`Literal[...]` narrows a type to a set of specific values — the type checker flags anything outside the set. Use for string enums, HTTP methods (`Literal["GET","POST","PUT","DELETE"]`), or two-state flags. (b) is not valid annotation syntax — Python annotations are types, not boolean expressions. (c) misuses `Enum` — `Enum` is a base class you subclass to create members, not a subscriptable type. (d) gives up static checking entirely and relies on runtime validation. Combine `Literal` with `@overload` when return types depend on the literal argument.',
      hints: [
        'Literal["a", "b"] restricts to exactly those values',
        'Type checker enforces; runtime does not validate',
        'Pairs well with @overload for flag-based return types',
      ],
      tags: ['type-hints', 'Literal', 'string-enums'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-types-final-overload-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      question: 'What do `typing.Final` and `typing.overload` do?',
      options: [
        { id: 'a', text: 'They are deprecated aliases for `const` and `def`', isCorrect: false },
        { id: 'b', text: '`Final` marks a variable as not-to-be-reassigned (constant) for type checkers. `@overload` lets you declare multiple type signatures for the same function so return types can depend on input types — the final non-decorated definition is the actual implementation.', isCorrect: true },
        { id: 'c', text: '`Final` makes attributes private; `overload` is the new dunder method', isCorrect: false },
        { id: 'd', text: 'Both are no-ops at runtime and do nothing useful', isCorrect: false },
      ],
      explanation: '`MAX_RETRIES: Final = 3` tells mypy that reassigning `MAX_RETRIES` later is an error — true constants in Python. `@overload` lets you write signatures like `def fetch(key: Literal["id"]) -> int` and `def fetch(key: Literal["name"]) -> str` above the real implementation, so callers get precise return types per key. Both are type-checker-only — at runtime they are no-ops.',
      hints: [
        'Final: "this name will never be reassigned"',
        '@overload: multiple signatures above one impl — type checker picks the matching one',
        'Both are compile-time (type-checker) only',
      ],
      tags: ['type-hints', 'Final', 'overload'],
      concepts: ['py-type-hint-syntax'],
    },
  {
      id: 'py-types-typeguard-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_TYPE_HINTS,
      course: Course.BACKEND,
      question: 'You have `mixed: list[object]` and a runtime check `all(isinstance(x, str) for x in items)`. Inside the `if` branch you want the type checker to treat `mixed` as `list[str]` (so `", ".join(mixed)` type-checks). How do you declare the predicate?',
      options: [
        { id: 'a', text: '`def is_list_of_str(items: list[object]) -> TypeGuard[list[str]]: return all(isinstance(x, str) for x in items)`', isCorrect: true },
        { id: 'b', text: '`def is_list_of_str(items: list[object]) -> bool: return all(isinstance(x, str) for x in items)` — a regular `bool` return narrows automatically', isCorrect: false },
        { id: 'c', text: '`def is_list_of_str(items: list[object]) -> list[str]: return items if all(isinstance(x, str) for x in items) else []`', isCorrect: false },
        { id: 'd', text: '`def is_list_of_str(items: list[object]) -> Narrow[list[str]]: ...` — `Narrow` is the narrowing construct in `typing`', isCorrect: false },
      ],
      explanation: '`TypeGuard[X]` (PEP 647, 3.10+) marks a function as a narrowing predicate: when it returns True, the checker treats the argument as `X` inside the true branch. (b) is a plain bool — the checker has no way to know what the True case implies about `items`, so `", ".join(mixed)` still errors. (c) returns the list itself, not a bool — the caller would then have to handle the empty-list-as-falsy pattern manually. (d) invents a name that does not exist in `typing`. `TypeIs` (PEP 742, 3.13+) is similar but also narrows the else branch.',
      hints: [
        'TypeGuard[X] marks a narrowing predicate',
        'Return True → checker narrows the arg to X in the if branch',
        '3.13+ has TypeIs for bidirectional narrowing',
      ],
      tags: ['type-hints', 'TypeGuard', 'narrowing', 'PEP-647'],
      concepts: ['py-type-hint-syntax'],
    },
];
