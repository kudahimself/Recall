/**
 * Topic.PY_DATACLASSES — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pyDataclassesCloze.ts (10), pyDataclassesParsons.ts (10), pyDataclassesPredictOutput.ts (10), pythonAdvancedQuestions.ts (3), pythonBatchBExpansionQuestions.ts (13), pythonGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_dataclasses_questions: Question[] = [
  {
      id: 'py-dataclasses-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the decorator that auto-generates __init__, __repr__, and __eq__ from annotated fields.',
      template: `from dataclasses import dataclass

@___
class Point:
    x: int
    y: int`,
      blanks: ['dataclass'],
      solution:
        'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int',
      explanation:
        '@dataclass decorates the class and synthesizes __init__/__repr__/__eq__ from the annotated attributes. Bare @dataclass is equivalent to @dataclass().',
      hints: ['Single word; same as the module name.'],
      tags: ['dataclasses'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the kwarg that makes the dataclass immutable.',
      template: `@dataclass(___=True)
class Point:
    x: int
    y: int`,
      blanks: ['frozen'],
      solution: '@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int',
      explanation:
        'frozen=True makes the dataclass immutable. Attribute assignment raises FrozenInstanceError. Frozen dataclasses are also hashable.',
      hints: ['Same as the verb meaning "fixed in place".'],
      tags: ['dataclasses', 'frozen'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the kwarg that auto-generates comparison methods (__lt__, __le__, etc.).',
      template: `@dataclass(___=True)
class Item:
    priority: int
    name: str`,
      blanks: ['order'],
      solution: '@dataclass(order=True)\nclass Item:\n    priority: int\n    name: str',
      explanation:
        'order=True generates __lt__, __le__, __gt__, __ge__ that compare field tuples in declaration order. Lets you sort and use comparison operators.',
      hints: ['Same name as the noun for sequence/sequencing.'],
      tags: ['dataclasses', 'order'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the field option that lazily creates a new mutable default per instance.',
      template: `from dataclasses import dataclass, field

@dataclass
class Item:
    tags: list = field(___=list)`,
      blanks: ['default_factory'],
      solution:
        'from dataclasses import dataclass, field\n\n@dataclass\nclass Item:\n    tags: list = field(default_factory=list)',
      explanation:
        'default_factory takes a callable that\'s called per instance. Required for any mutable default — using `tags: list = []` raises ValueError because it would share one list across all instances.',
      hints: ['Two words: "default" + "factory".'],
      tags: ['dataclasses', 'default_factory'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dunder method that runs after the auto-generated __init__.',
      template: `@dataclass
class Rect:
    w: int
    h: int
    area: int = field(init=False)
    def ___(self):
        self.area = self.w * self.h`,
      blanks: ['__post_init__'],
      solution:
        '@dataclass\nclass Rect:\n    w: int\n    h: int\n    area: int = field(init=False)\n    def __post_init__(self):\n        self.area = self.w * self.h',
      explanation:
        '__post_init__ is the hook for "do something after auto-init". Use it to compute derived attributes, run validation, or trigger side effects. Distinct from __init__ — defining __init__ would override the auto-generated one.',
      hints: ['Magic name; "post" + "init" with double underscores.'],
      tags: ['dataclasses', '__post_init__'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the function that converts a dataclass instance to a regular dict.',
      template: `from dataclasses import dataclass, ___

@dataclass
class P:
    x: int

p = P(1)
print(___(p))`,
      blanks: ['asdict', 'asdict'],
      solution:
        'from dataclasses import dataclass, asdict\n\n@dataclass\nclass P:\n    x: int\n\np = P(1)\nprint(asdict(p))',
      explanation:
        'asdict is a module-level function (not a method). Recursively converts nested dataclasses to nested dicts. Useful for JSON serialization or comparison-by-shape.',
      hints: ['Two words concatenated: "as" + "dict".'],
      tags: ['dataclasses', 'asdict'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the function that returns a copy of an instance with some fields overridden.',
      template: `from dataclasses import dataclass, ___

@dataclass
class Point:
    x: int
    y: int

p = Point(1, 2)
q = ___(p, x=99)`,
      blanks: ['replace', 'replace'],
      solution:
        'from dataclasses import dataclass, replace\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\nq = replace(p, x=99)',
      explanation:
        'replace creates a new instance with the named fields overridden. Module-level function, not a method. Works with frozen dataclasses for immutable update semantics.',
      hints: ['Same as the verb meaning "substitute".'],
      tags: ['dataclasses', 'replace'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the kwarg (Python 3.10+) that makes all fields keyword-only.',
      template: `@dataclass(___=True)
class Config:
    host: str
    port: int = 5432`,
      blanks: ['kw_only'],
      solution: '@dataclass(kw_only=True)\nclass Config:\n    host: str\n    port: int = 5432',
      explanation:
        'kw_only=True (3.10+) forces all fields to be keyword-only at construction. Helps documentation and removes order constraints on defaults vs non-defaults.',
      hints: ['Snake-case: "kw" + "_only".'],
      tags: ['dataclasses', 'kw_only'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the typing annotation that marks count as a class-level attribute (not a field).',
      template: `from dataclasses import dataclass
from typing import ___

@dataclass
class Widget:
    name: str
    count: ___[int] = 0`,
      blanks: ['ClassVar', 'ClassVar'],
      solution:
        'from dataclasses import dataclass\nfrom typing import ClassVar\n\n@dataclass\nclass Widget:\n    name: str\n    count: ClassVar[int] = 0',
      explanation:
        'ClassVar tells @dataclass to skip the annotation as a field — it stays as a regular class attribute, shared across instances and excluded from __init__/__repr__/__eq__.',
      hints: ['CamelCase: "Class" + "Var".'],
      tags: ['dataclasses', 'ClassVar'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the field option that excludes a sensitive field from auto-generated __repr__.',
      template: `@dataclass
class User:
    name: str
    password: str = field(___=False)`,
      blanks: ['repr'],
      solution:
        '@dataclass\nclass User:\n    name: str\n    password: str = field(repr=False)',
      explanation:
        'repr=False excludes the field from auto-generated __repr__. Useful for sensitive data or large/noisy fields. Other field options: init, compare, default, default_factory, metadata, hash, kw_only.',
      hints: ['Same word as the dunder being skipped.'],
      tags: ['dataclasses', 'field', 'repr'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a Point dataclass with int fields `x` then `y` using @dataclass.',
      correctOrder: [
        'from dataclasses import dataclass',
        '',
        '@dataclass',
        'class Point:',
        '    x: int',
        '    y: int',
      ],
      distractorLines: [
        'class Point:',
        '@dataclass()',
        '    def __init__(self, x: int, y: int):',
      ],
      solution:
        'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int',
      explanation:
        '@dataclass auto-generates __init__, __repr__, and __eq__ from the annotated class attributes. Type annotations are required (otherwise the class attribute is ignored). @dataclass with no parens works in 3.7+; @dataclass() with empty parens also works.',
      hints: ['@dataclass on top, annotated fields below — no manual __init__.'],
      tags: ['dataclasses', 'basic'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use field(default_factory=list) to give each instance its own empty list of tags.',
      correctOrder: [
        'from dataclasses import dataclass, field',
        '',
        '@dataclass',
        'class Item:',
        '    name: str',
        '    tags: list = field(default_factory=list)',
      ],
      distractorLines: [
        '    tags: list = []',
        '    tags: list = field(default=[])',
      ],
      solution:
        'from dataclasses import dataclass, field\n\n@dataclass\nclass Item:\n    name: str\n    tags: list = field(default_factory=list)',
      explanation:
        'Mutable default literals are forbidden in dataclasses — `tags: list = []` raises ValueError. Use field(default_factory=list) so each instance gets a fresh list. Same trap as mutable default args in regular functions.',
      hints: ['Forbidden: list/[]. Required: field(default_factory=list).'],
      tags: ['dataclasses', 'default_factory', 'mutable-default'],
      concepts: ['py-dataclass-defaults', 'py-mutable-default-arg'],
    },
  {
      id: 'py-dataclasses-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Make Point (int fields `x` then `y`) immutable using @dataclass(frozen=True).',
      correctOrder: [
        'from dataclasses import dataclass',
        '',
        '@dataclass(frozen=True)',
        'class Point:',
        '    x: int',
        '    y: int',
      ],
      distractorLines: [
        '@dataclass(immutable=True)',
        '@dataclass(read_only=True)',
      ],
      solution:
        'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int',
      explanation:
        'frozen=True makes the dataclass immutable: attribute assignment raises FrozenInstanceError. As a bonus, frozen dataclasses are hashable (so usable in sets/dicts).',
      hints: ['The kwarg name is "frozen", not immutable or read_only.'],
      tags: ['dataclasses', 'frozen', 'immutable'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Add ordering with @dataclass(order=True) so Items can be sorted by their natural field order. Declare `priority: int` as the FIRST attribute and `name: str` second, so comparison goes by priority first, then by name as the tiebreaker.',
      correctOrder: [
        'from dataclasses import dataclass',
        '',
        '@dataclass(order=True)',
        'class Item:',
        '    priority: int',
        '    name: str',
        '',
        'items = [Item(2, "b"), Item(1, "a")]',
        'items.sort()',
        'print(items)',
      ],
      distractorLines: [
        '@dataclass(sortable=True)',
        'items.sort(key=lambda i: i.priority)',
      ],
      solution:
        'from dataclasses import dataclass\n\n@dataclass(order=True)\nclass Item:\n    priority: int\n    name: str\n\nitems = [Item(2, "b"), Item(1, "a")]\nitems.sort()\nprint(items)',
      explanation:
        'order=True generates __lt__/__le__/__gt__/__ge__ that compare TUPLES OF FIELDS in declaration order. Items compare first by priority, then by name. Without order=True, sort would raise TypeError.',
      hints: ['Comparison is field-tuple-wise, in declaration order.'],
      tags: ['dataclasses', 'order', 'sorting'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use __post_init__ to compute a derived attribute after the auto-init runs. Declare fields in order `w`, `h`, then `area`.',
      correctOrder: [
        'from dataclasses import dataclass, field',
        '',
        '@dataclass',
        'class Rect:',
        '    w: int',
        '    h: int',
        '    area: int = field(init=False)',
        '    def __post_init__(self):',
        '        self.area = self.w * self.h',
      ],
      distractorLines: [
        '    def __init__(self):',
        '    def post_init(self):',
      ],
      solution:
        'from dataclasses import dataclass, field\n\n@dataclass\nclass Rect:\n    w: int\n    h: int\n    area: int = field(init=False)\n    def __post_init__(self):\n        self.area = self.w * self.h',
      explanation:
        '__post_init__ runs after the auto-generated __init__. field(init=False) excludes area from the __init__ signature so it can be set in __post_init__. Defining __init__ would overwrite the auto-generated one.',
      hints: ['__post_init__ for derived attrs; field(init=False) to exclude from __init__.'],
      tags: ['dataclasses', '__post_init__', 'derived'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use asdict to convert a Point (int fields `x` then `y`) to a regular dict.',
      correctOrder: [
        'from dataclasses import dataclass, asdict',
        '',
        '@dataclass',
        'class Point:',
        '    x: int',
        '    y: int',
        '',
        'p = Point(1, 2)',
        'print(asdict(p))',
      ],
      distractorLines: [
        'print(p.asdict())',
        'print(dict(p))',
      ],
      solution:
        'from dataclasses import dataclass, asdict\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\nprint(asdict(p))',
      explanation:
        'asdict is a module-level function — call it as asdict(instance), not instance.asdict(). It recursively converts nested dataclasses too. dict(p) doesn\'t work without a __iter__ that yields key-value pairs.',
      hints: ['asdict is a function from dataclasses, not a method.'],
      tags: ['dataclasses', 'asdict'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use kw_only=True (Python 3.10+) to force all fields to be keyword-only.',
      correctOrder: [
        'from dataclasses import dataclass',
        '',
        '@dataclass(kw_only=True)',
        'class Config:',
        '    host: str',
        '    port: int = 5432',
        '',
        'c = Config(host="localhost", port=80)',
      ],
      distractorLines: [
        '@dataclass(keyword_only=True)',
        'c = Config("localhost", 80)',
      ],
      solution:
        'from dataclasses import dataclass\n\n@dataclass(kw_only=True)\nclass Config:\n    host: str\n    port: int = 5432\n\nc = Config(host="localhost", port=80)',
      explanation:
        'kw_only=True (3.10+) makes all dataclass fields keyword-only. The keyword is `kw_only`, not `keyword_only`. Calling Config("localhost", 80) raises TypeError. Forces self-documenting calls and allows defaults to come before non-defaults.',
      hints: ['Two-letter abbreviation: "kw" + "_only".'],
      tags: ['dataclasses', 'kw_only'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use field(repr=False) to exclude a sensitive password field from the auto-generated __repr__.',
      correctOrder: [
        'from dataclasses import dataclass, field',
        '',
        '@dataclass',
        'class User:',
        '    name: str',
        '    password: str = field(repr=False)',
      ],
      distractorLines: [
        '    password: str = field(hidden=True)',
        '    password: str = field(show=False)',
      ],
      solution:
        'from dataclasses import dataclass, field\n\n@dataclass\nclass User:\n    name: str\n    password: str = field(repr=False)',
      explanation:
        'field(repr=False) excludes the field from the auto-generated __repr__. Useful for sensitive data, large objects, or noisy fields. Other field options: init, compare, default, default_factory, metadata, hash, kw_only.',
      hints: ['repr=False — same name as the dunder being skipped.'],
      tags: ['dataclasses', 'field', 'repr'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use replace() to make an updated copy of a Point dataclass instance (int fields `x` then `y`).',
      correctOrder: [
        'from dataclasses import dataclass, replace',
        '',
        '@dataclass',
        'class Point:',
        '    x: int',
        '    y: int',
        '',
        'p = Point(1, 2)',
        'q = replace(p, x=99)',
        'print(q)',
      ],
      distractorLines: [
        'q = p.replace(x=99)',
        'q = p.copy(x=99)',
      ],
      solution:
        'from dataclasses import dataclass, replace\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\nq = replace(p, x=99)\nprint(q)',
      explanation:
        'replace() is a module-level function (like asdict). It returns a new instance with the named fields overridden. Useful for "update" semantics on frozen dataclasses too.',
      hints: ['replace is a function from dataclasses, not a method.'],
      tags: ['dataclasses', 'replace'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use ClassVar to mark count as a class-level attribute (not a per-instance field).',
      correctOrder: [
        'from dataclasses import dataclass',
        'from typing import ClassVar',
        '',
        '@dataclass',
        'class Widget:',
        '    name: str',
        '    count: ClassVar[int] = 0',
      ],
      distractorLines: [
        '    count: int = 0',
        '    @classmethod',
        '    count: int',
      ],
      solution:
        'from dataclasses import dataclass\nfrom typing import ClassVar\n\n@dataclass\nclass Widget:\n    name: str\n    count: ClassVar[int] = 0',
      explanation:
        'ClassVar tells @dataclass to treat the annotation as a class-level attribute, not a per-instance field. So `count` is shared across instances — and excluded from __init__, __repr__, etc. Plain `count: int = 0` would create an instance field.',
      hints: ['ClassVar from typing — marks the annotation as a class-level attr.'],
      tags: ['dataclasses', 'ClassVar'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

p = Point(1, 2)
print(p)`,
      expectedOutput: `Point(x=1, y=2)`,
      explanation:
        '@dataclass auto-generates __repr__ as ClassName(field=value, ...). No manual code needed for the canonical "print this thing usefully" case.',
      hints: ['What does the auto-generated __repr__ look like?'],
      tags: ['dataclasses', '__repr__'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

a = Point(1, 2)
b = Point(1, 2)
print(a == b)
print(a is b)`,
      expectedOutput: `True
False`,
      explanation:
        '@dataclass auto-generates __eq__ that compares field values. So a == b is True (same data). is checks IDENTITY — they\'re different objects in memory, so False.',
      hints: ['== compares values; is compares identity.'],
      tags: ['dataclasses', '__eq__'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: int
    y: int

p = Point(1, 2)
try:
    p.x = 99
except Exception as e:
    print(type(e).__name__)`,
      expectedOutput: `FrozenInstanceError`,
      explanation:
        'frozen=True makes the dataclass immutable. Attempting to assign to a field raises dataclasses.FrozenInstanceError (a subclass of AttributeError).',
      hints: ['What error does assigning to a frozen field raise?'],
      tags: ['dataclasses', 'frozen', 'FrozenInstanceError'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from dataclasses import dataclass, field

@dataclass
class Item:
    tags: list = field(default_factory=list)

a = Item()
b = Item()
a.tags.append("x")
print(a.tags)
print(b.tags)`,
      expectedOutput: `['x']
[]`,
      explanation:
        'default_factory=list calls list() once per instance — so each Item has its OWN empty list. Mutating a.tags doesn\'t affect b.tags. Without default_factory, you couldn\'t even define this (mutable default is rejected).',
      hints: ['default_factory creates a new value per instance.'],
      tags: ['dataclasses', 'default_factory'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from dataclasses import dataclass

@dataclass(order=True)
class Item:
    priority: int
    name: str

a = Item(1, "z")
b = Item(2, "a")
print(a < b)`,
      expectedOutput: `True`,
      explanation:
        'order=True compares field tuples in declaration order. (1, "z") < (2, "a") is True because 1 < 2 — name is never reached. Field order in the dataclass dictates comparison precedence.',
      hints: ['Tuple-wise comparison; first differing field wins.'],
      tags: ['dataclasses', 'order'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from dataclasses import dataclass, asdict

@dataclass
class Inner:
    n: int

@dataclass
class Outer:
    name: str
    inner: Inner

o = Outer("x", Inner(5))
print(asdict(o))`,
      expectedOutput: `{'name': 'x', 'inner': {'n': 5}}`,
      explanation:
        'asdict recursively converts nested dataclasses to dicts. Inner becomes {"n": 5}, then Outer becomes {"name": "x", "inner": {...}}. Useful for serialization.',
      hints: ['asdict recurses into nested dataclasses.'],
      tags: ['dataclasses', 'asdict'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: int
    y: int

s = {Point(1, 2), Point(1, 2), Point(3, 4)}
print(len(s))`,
      expectedOutput: `2`,
      explanation:
        'frozen=True makes the dataclass HASHABLE (auto-generates __hash__ based on field tuple). Two Point(1, 2) instances are equal AND hash the same — so the set dedupes them. Result: {Point(1,2), Point(3,4)} = 2 items.',
      hints: ['frozen → hashable → dedupe in sets.'],
      tags: ['dataclasses', 'frozen', 'hashable'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from dataclasses import dataclass, field

@dataclass
class C:
    a: int
    b: int = field(default=10, repr=False)

c = C(1)
print(c)`,
      expectedOutput: `C(a=1)`,
      explanation:
        'field(repr=False) excludes b from the auto-generated __repr__. b is still set (to default 10) — but invisible in print. Useful for hiding sensitive or noisy fields.',
      hints: ['repr=False hides the field from print, not from the object.'],
      tags: ['dataclasses', 'field', 'repr'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from dataclasses import dataclass, replace

@dataclass
class Point:
    x: int
    y: int

p = Point(1, 2)
q = replace(p, x=99)
print(p)
print(q)`,
      expectedOutput: `Point(x=1, y=2)
Point(x=99, y=2)`,
      explanation:
        'replace() returns a NEW instance with the named fields overridden. Original p is unchanged. Common pattern for "update" semantics on dataclasses (especially frozen ones).',
      hints: ['replace creates a new instance; original is unchanged.'],
      tags: ['dataclasses', 'replace'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from dataclasses import dataclass, field

@dataclass
class Rect:
    w: int
    h: int
    area: int = field(init=False)
    def __post_init__(self):
        self.area = self.w * self.h

r = Rect(3, 4)
print(r)`,
      expectedOutput: `Rect(w=3, h=4, area=12)`,
      explanation:
        'field(init=False) excludes area from __init__\'s signature. __post_init__ runs after the auto-init and sets area = w*h. The field is still in __repr__ unless you also pass repr=False.',
      hints: ['init=False excludes from __init__; __post_init__ sets it.'],
      tags: ['dataclasses', '__post_init__', 'derived'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-slots-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the kwarg (Python 3.10+) that replaces the per-instance __dict__ with fixed slots.',
      template: `@dataclass(___=True)
class Point:
    x: int
    y: int`,
      blanks: ['slots'],
      solution: '@dataclass(slots=True)\nclass Point:\n    x: int\n    y: int',
      explanation:
        'slots=True (3.10+) allocates a fixed structure instead of a per-instance __dict__, cutting memory use and rejecting accidental attribute additions. On 3.9 and earlier you\'d write __slots__ = ("x", "y") manually.',
      hints: ['Same word as the class-level __slots__ attribute it generates.'],
      tags: ['dataclasses', 'slots', 'memory'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dataclasses-inheritance-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the base class a dataclass subclass extends, and the field it inherits.',
      template: `@dataclass
class Animal:
    name: str

@dataclass
class Dog(___):
    breed: str

d = Dog(name="Rex", breed="Labrador")
print(d.___)`,
      blanks: ['Animal', 'name'],
      solution: '@dataclass\nclass Animal:\n    name: str\n\n@dataclass\nclass Dog(Animal):\n    breed: str\n\nd = Dog(name="Rex", breed="Labrador")\nprint(d.name)',
      explanation:
        'A @dataclass subclass inherits fields normally — base-class fields come first in the generated __init__, subclass fields after. Dog(Animal) both applies @dataclass to Dog AND extends Animal, so d.name resolves to the inherited field.',
      hints: ['Standard Python subclassing syntax; both classes still need @dataclass.'],
      tags: ['dataclasses', 'inheritance'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-adv-dc-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      question: 'When should you use a dataclass vs a namedtuple vs a regular class?',
      options: [
        { id: 'a', text: 'Always use dataclass — namedtuple and regular classes are legacy patterns', isCorrect: false },
        { id: 'b', text: 'Namedtuple for all data, regular class for all behavior, dataclass never', isCorrect: false },
        { id: 'c', text: 'Dataclass and namedtuple are identical — use either one interchangeably', isCorrect: false },
        { id: 'd', text: 'Dataclass for mutable structured data with methods; namedtuple for lightweight immutable records; regular class when you need full control over __init__, inheritance, or metaclasses', isCorrect: true },
      ],
      explanation: 'Dataclasses are best for "data holder" objects that may need mutability, methods, and defaults — they generate boilerplate but remain regular classes. Namedtuples are more lightweight, immutable, iterable, and memory-efficient (no __dict__), ideal for simple records like coordinates or database rows. Regular classes give full control when you need custom __init__ logic, complex inheritance, descriptors, or metaclasses. Key difference: namedtuples can be unpacked (x, y = point) and indexed (point[0]), dataclasses cannot.',
      hints: [
        'namedtuple instances can be unpacked and indexed like tuples',
        'dataclasses have __dict__, namedtuples don\'t (less memory)',
      ],
      tags: ['dataclass', 'namedtuple', 'class', 'comparison'],
      concepts: ['py-dataclass-defaults', 'py-collections-stdlib'],
    },
  {
      id: 'py-dc-what',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      question: 'What does the `@dataclass` decorator generate automatically for your class?',
      options: [
        { id: 'a', text: 'Nothing — it\'s a type annotation', isCorrect: false },
        { id: 'b', text: '`__init__` (from the type-annotated fields in order), `__repr__` (readable representation), and `__eq__` (field-by-field equality). You can opt into `__lt__/__gt__/...` via `order=True`, `__hash__` via `frozen=True`, or into `slots=True` for memory-efficient instances (3.10+).', isCorrect: true },
        { id: 'c', text: 'A database table mapping', isCorrect: false },
        { id: 'd', text: 'Automatic validation of every field at runtime', isCorrect: false },
      ],
      explanation: '`@dataclass` exists so you stop writing the same `__init__(self, a, b, c): self.a = a; self.b = b; self.c = c` over and over. It\'s stdlib (no deps), fast (generates bytecode at class-creation time), and gives you value-object semantics for free. Unlike pydantic, it does NOT validate — types are documentation only.',
      hints: [
        '@dataclass = auto __init__ / __repr__ / __eq__',
        'Opt-ins: order=True, frozen=True, slots=True (3.10+)',
        'No runtime validation — use pydantic if you need that',
      ],
      tags: ['dataclasses', 'decorator', 'basics'],
      concepts: ['py-dataclass-defaults', 'py-decorator-application'],
    },
  {
      id: 'py-dc-simple',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a two-field record type `Point` with integer fields `x` and `y` using the stdlib decorator that auto-generates `__init__` and `__repr__`. Build a `Point` with coordinates (3, 4), print the instance (expect `Point(x=3, y=4)`), then print the sum of its fields (expect `7`).',
      starterCode: `from dataclasses import dataclass
  `,
      testCases: [
        {
          input: 'basic dataclass',
          expectedOutput: 'Point(x=3, y=4)\n7',
          description: '@dataclass auto-generates __init__ and __repr__',
        },
      ],
      solution: `from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

p = Point(3, 4)
print(p)
print(p.x + p.y)`,
      tieredHints: {
        apiSignature: '@dataclass(*, init=True, repr=True, eq=True, order=False, frozen=False)',
        skeleton: `from dataclasses import ____

@____
class Point:
    x: ____
    y: ____

p = ____(3, 4)
print(p)
print(p.x ____ p.y)`,
      },
      explanation: 'The decorator sees the type-annotated class attributes and generates `__init__(self, x: int, y: int)` plus `__repr__` and `__eq__`. Fields must be type-annotated — untyped class attributes are ignored. Order of args in `__init__` matches declaration order in the class body.',
      hints: [
        'Every field needs a type annotation',
        'Order of fields in class = order of positional __init__ args',
        'repr auto-includes field=value for every field',
      ],
      tags: ['dataclasses', 'basics'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dc-field-factory',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a `Cart` dataclass with a single `items` field holding a list of strings — each new `Cart` must start with its own independent empty list rather than sharing one across instances (the classic "mutable default" trap). Build two carts `a` and `b`, append `"apple"` to `a.items`, then print `a.items` (expect `[\'apple\']`) and `b.items` (expect `[]` — proving they are independent).',
      starterCode: `from dataclasses import dataclass, field
  `,
      testCases: [
        {
          input: 'default_factory avoids shared mutable',
          expectedOutput: "['apple']\n[]",
          description: 'factory is called per instance',
        },
      ],
      solution: `from dataclasses import dataclass, field

@dataclass
class Cart:
    items: list[str] = field(default_factory=list)

a = Cart()
b = Cart()
a.items.append("apple")
print(a.items)
print(b.items)`,
      tieredHints: {
        apiSignature: 'field(*, default_factory=MISSING, init=True, repr=True)',
        skeleton: `from dataclasses import ____, ____

@dataclass
class Cart:
    items: list[____] = ____(default_factory=____)

a = ____()
b = ____()
a.items.____("apple")
print(a.items)
print(b.items)`,
      },
      explanation: 'Never write `items: list = []` — the `[]` is evaluated ONCE at class-creation time, so every instance shares the same list. `field(default_factory=list)` calls `list()` per instance, giving each its own empty list. Same rule applies to `dict`, `set`, any mutable object. Plain `dataclass`/`@dataclass` actually raises `ValueError` if you try `items: list = []` — it guards you from the classic Python mutable-default footgun.',
      hints: [
        'mutable default → use field(default_factory=callable)',
        'factory is called per-instance, not once',
        'dataclass raises ValueError on `= []` to protect you',
      ],
      tags: ['dataclasses', 'field', 'default_factory', 'mutable-default'],
      concepts: ['py-dataclass-defaults', 'py-mutable-default-arg'],
    },
  {
      id: 'py-dc-init-false',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a `Rectangle` dataclass with float fields `width` and `height` that callers supply, plus a float field `area` that is NOT accepted by `__init__` — `area` must be derived from width × height after construction, using the dataclass post-construction hook. Build `r = Rectangle(3, 4)` and print `r.area` (expect `12.0`). Because `area` is excluded from `__init__`, a call like `Rectangle(3, 4, 999)` would fail.',
      starterCode: `from dataclasses import dataclass, field
  `,
      testCases: [
        {
          input: 'field(init=False) + __post_init__',
          expectedOutput: '12.0',
          description: 'Derived field computed after __init__',
        },
      ],
      solution: `from dataclasses import dataclass, field

@dataclass
class Rectangle:
    width: float
    height: float
    area: float = field(init=False)

    def __post_init__(self):
        self.area = self.width * self.height

r = Rectangle(3, 4)
print(r.area)`,
      tieredHints: {
        apiSignature: 'field(*, init=True, default=MISSING, repr=True)',
        skeleton: `from dataclasses import ____, ____

@dataclass
class Rectangle:
    width: ____
    height: ____
    area: ____ = ____(init=____)

    def ____(self):
        self.area = self.width ____ self.height

r = ____(3, 4)
print(r.area)`,
      },
      explanation: '`field(init=False)` excludes a field from `__init__` so callers cannot set it directly. `__post_init__` runs right after `__init__` and is the canonical place to compute derived state or validate combinations of fields. Also useful for any setup that needs the fully-initialized instance — opening a resource, precomputing an index, etc.',
      hints: [
        'field(init=False) removes it from __init__ signature',
        '__post_init__ runs after __init__ — compute derived state here',
        'Also useful for validating relationships between fields',
      ],
      tags: ['dataclasses', 'field', 'post_init', 'derived'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dc-repr-false',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a `Credentials` dataclass with two string fields — `user`, which should appear in the auto-generated `__repr__` as normal, and `password`, which must be HIDDEN from the repr (but still readable as an attribute). Build `c = Credentials(user="alice", password="s3cr3t")` and print `c` (expect `Credentials(user=\'alice\')` — password omitted). Then print `c.password` directly to confirm the value is still stored (expect `s3cr3t`).',
      starterCode: `from dataclasses import dataclass, field
  `,
      testCases: [
        {
          input: 'repr=False hides password from log-style repr',
          expectedOutput: "Credentials(user='alice')\ns3cr3t",
          description: 'Field is hidden from repr but stored normally',
        },
      ],
      solution: `from dataclasses import dataclass, field

@dataclass
class Credentials:
    user: str
    password: str = field(repr=False)

c = Credentials(user="alice", password="s3cr3t")
print(c)
print(c.password)`,
      tieredHints: {
        apiSignature: 'field(*, repr=True, compare=True, default=MISSING)',
        skeleton: `from dataclasses import ____, ____

@dataclass
class Credentials:
    user: ____
    password: ____ = ____(repr=____)

c = ____(user="alice", password="s3cr3t")
print(c)
print(c.____)`,
      },
      explanation: 'Accidental secret leakage through logs / tracebacks / error reports is a depressingly common cause of breach notifications. `field(repr=False)` is the lightweight mitigation: the field is present and works normally, but `repr()` (and therefore any `print`, `logger.info(obj)`, exception traceback) omits it. Combine with `field(compare=False)` to also exclude from `__eq__`. Pydantic has a similar `Field(repr=False)` and `SecretStr` type.',
      hints: [
        'field(repr=False) hides the field from __repr__',
        'Value is still stored and readable via attribute access',
        'Pair with compare=False to exclude from __eq__',
      ],
      tags: ['dataclasses', 'field', 'repr', 'secrets'],
      concepts: ['py-dataclass-defaults', 'py-security-primitives'],
    },
  {
      id: 'py-dc-order-sortable',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a `Version` dataclass with three integer fields `major`, `minor`, `patch` that supports `<` `<=` `>` `>=` comparisons (field-by-field in declaration order). Build `v1 = Version(1, 2, 3)` and `v2 = Version(1, 3, 0)`, then print `v1 < v2`.',
      starterCode: `from dataclasses import dataclass
  `,
      testCases: [
        {
          input: 'order=True enables < <= > >=',
          expectedOutput: 'True',
          description: 'Comparison follows field declaration order',
        },
      ],
      solution: `from dataclasses import dataclass

@dataclass(order=True)
class Version:
    major: int
    minor: int
    patch: int

v1 = Version(1, 2, 3)
v2 = Version(1, 3, 0)
print(v1 < v2)`,
      tieredHints: {
        apiSignature: '@dataclass(*, order=False, frozen=False, eq=True)',
        skeleton: `from dataclasses import ____

@____(____=True)
class Version:
    major: ____
    minor: ____
    patch: ____

v1 = ____(1, 2, 3)
v2 = ____(1, 3, 0)
print(v1 ____ v2)`,
      },
      explanation: '`order=True` generates `__lt__`, `__le__`, `__gt__`, `__ge__` that compare field-by-field in declaration order — exactly how you want semver to work. For more complex sort rules (e.g. case-insensitive string), define `__lt__` yourself. If you only want equality without ordering, leave `order=False` (the default).',
      hints: [
        'order=True generates __lt__/__le__/__gt__/__ge__',
        'Comparison is field-by-field in declaration order',
        'For custom ordering, override __lt__',
      ],
      tags: ['dataclasses', 'order', 'sorting'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dc-slots',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a linked-list `Node` dataclass with an integer `value` field and a `next` field typed as `Node | None`, using the 3.10+ option that replaces the per-instance `__dict__` with fixed slots. Build `n = Node(1, None)` and print `n.value`.',
      starterCode: `from dataclasses import dataclass
  `,
      testCases: [
        {
          input: 'slots=True',
          expectedOutput: '1',
          description: 'Slots replaces the instance __dict__ with fixed slots',
        },
      ],
      solution: `from dataclasses import dataclass

@dataclass(slots=True)
class Node:
    value: int
    next: "Node | None"

n = Node(1, None)
print(n.value)`,
      tieredHints: {
        apiSignature: '@dataclass(*, slots=False, frozen=False, order=False)',
        skeleton: `from dataclasses import ____

@____(____=True)
class Node:
    value: ____
    next: "Node | ____"

n = ____(1, None)
print(n.value)`,
      },
      explanation: '`slots=True` (3.10+) tells Python to allocate a fixed structure instead of a per-instance `__dict__`. Benefits: ~20-40% memory reduction (important for millions of instances), and typos or accidental attribute additions fail loudly. Tradeoff: you cannot add attributes dynamically, which is occasionally desired (e.g. duck-typing hacks, `__getattr__` tricks). On 3.9 and earlier you\'d write `__slots__ = ("value", "next")` manually.',
      hints: [
        'slots=True on 3.10+ (manual __slots__ on older Python)',
        'Memory win on many small instances; speed-up on attribute access',
        'Prevents ad-hoc attribute addition (a feature, not a bug)',
      ],
      tags: ['dataclasses', 'slots', 'memory', '3.10'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dc-vs-others',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      question: 'When would you pick a `dataclass` over `typing.NamedTuple` or `pydantic.BaseModel`?',
      options: [
        { id: 'a', text: 'Never — they are interchangeable', isCorrect: false },
        { id: 'b', text: 'Pick `dataclass` when you want a mutable value object with methods + no dependency. Pick `NamedTuple` for an IMMUTABLE tuple-compatible record (supports indexing, unpacking). Pick `pydantic.BaseModel` when you need runtime VALIDATION, coercion, and JSON serialization — especially for API boundaries.', isCorrect: true },
        { id: 'c', text: 'dataclass is deprecated — always use pydantic', isCorrect: false },
        { id: 'd', text: 'NamedTuple is always fastest', isCorrect: false },
      ],
      explanation: 'Picking rule: does untrusted data ever construct an instance? → pydantic. Does tuple indexing / unpacking matter (e.g. interop with an API expecting tuples)? → NamedTuple. Otherwise → dataclass. All three generate `__init__` / `__repr__` / `__eq__`. Dataclass is a stdlib middle ground — flexible, mutable by default (frozen=True if you want immutability), no dependency, no validation.',
      hints: [
        'dataclass: stdlib, mutable, no validation',
        'NamedTuple: immutable, tuple-compatible',
        'pydantic.BaseModel: runtime validation, coercion, JSON',
      ],
      tags: ['dataclasses', 'NamedTuple', 'pydantic', 'comparison'],
      concepts: ['py-dataclass-defaults', 'py-collections-stdlib', 'py-pydantic-validation'],
    },
  {
      id: 'py-dc-asdict',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a `User` dataclass with a string `name` and integer `age`. Build `u = User("Alice", 30)`. Using the `dataclasses` stdlib helpers, print the dict representation of `u` (expect `{\'name\': \'Alice\', \'age\': 30}`), then print its tuple representation (expect `(\'Alice\', 30)`).',
      starterCode: `from dataclasses import dataclass, asdict, astuple
  `,
      testCases: [
        {
          input: 'asdict and astuple',
          expectedOutput: "{'name': 'Alice', 'age': 30}\n('Alice', 30)",
          description: 'Both walk nested dataclasses recursively',
        },
      ],
      solution: `from dataclasses import dataclass, asdict, astuple

@dataclass
class User:
    name: str
    age: int

u = User("Alice", 30)
print(asdict(u))
print(astuple(u))`,
      tieredHints: {
        apiSignature: 'asdict(instance, *, dict_factory=dict) -> dict',
        skeleton: `from dataclasses import dataclass, ____, ____

@dataclass
class User:
    name: ____
    age: ____

u = ____("Alice", 30)
print(____(u))
print(____(u))`,
      },
      explanation: '`asdict` recursively converts nested dataclasses, lists, tuples, and dicts. Useful for JSON serialization: `json.dumps(asdict(user))`. `astuple` returns a flat tuple — handy for unpacking. Both are one-shot conversions; they don\'t "view" the instance. For round-tripping use pydantic or write a classmethod `from_dict`.',
      hints: [
        'asdict walks nested dataclasses recursively',
        'Combines nicely with json.dumps',
        'astuple returns a tuple — useful for DB row style APIs',
      ],
      tags: ['dataclasses', 'asdict', 'astuple', 'serialization'],
      concepts: ['py-dataclass-defaults', 'py-json-serialization'],
    },
  {
      id: 'py-dc-inheritance',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define an `Animal` dataclass with a string field `name`, then a `Dog` dataclass that inherits from `Animal` and adds a string field `breed`. Build `d = Dog(name="Rex", breed="Labrador")` and print `d`.',
      starterCode: `from dataclasses import dataclass
  `,
      testCases: [
        {
          input: 'dataclass inheritance',
          expectedOutput: "Dog(name='Rex', breed='Labrador')",
          description: 'Fields of base class come first in __init__',
        },
      ],
      solution: `from dataclasses import dataclass

@dataclass
class Animal:
    name: str

@dataclass
class Dog(Animal):
    breed: str

d = Dog(name="Rex", breed="Labrador")
print(d)`,
      tieredHints: {
        apiSignature: '@dataclass\nclass Sub(Base): ...',
        skeleton: `from dataclasses import ____

@____
class Animal:
    name: ____

@____
class Dog(____):
    breed: ____

d = ____(name="Rex", ____="Labrador")
print(d)`,
      },
      explanation: 'Inheritance works as expected: base fields come first in `__init__`, subclass fields after. Common gotcha: a subclass non-default field after a base default field is a positional-argument error (e.g. `Animal(name: str = "?")` + `Dog(breed: str)` — the generated `__init__(name="?", breed)` is invalid Python). Either give the subclass field a default too, or use `field(kw_only=True)` (3.10+) to sidestep the positional rule.',
      hints: [
        'Base fields appear first in the generated __init__',
        'Non-default subclass field after default base field → error',
        '3.10+: field(kw_only=True) sidesteps the positional rule',
      ],
      tags: ['dataclasses', 'inheritance'],
      concepts: ['py-dataclass-defaults', 'py-super-call'],
    },
  {
      id: 'py-dc-frozen-basic',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a `Config` dataclass with a string `host` field and integer `port` field, configured so instances are immutable. Build `c = Config("localhost", 5432)` and print it.',
      starterCode: `from dataclasses import dataclass
  `,
      testCases: [
        {
          input: 'frozen Config',
          expectedOutput: "Config(host='localhost', port=5432)",
          description: 'frozen=True makes instances immutable',
        },
      ],
      solution: `from dataclasses import dataclass

@dataclass(frozen=True)
class Config:
    host: str
    port: int

c = Config("localhost", 5432)
print(c)`,
      tieredHints: {
        apiSignature: '@dataclass(*, frozen=False, eq=True, order=False)',
        skeleton: `from dataclasses import ____

@dataclass(____=True)
class Config:
    host: ____
    port: ____

c = ____("localhost", 5432)
print(c)`,
      },
      explanation:
        '`@dataclass(frozen=True)` makes instances immutable — any attribute assignment after `__init__` raises `FrozenInstanceError`. Side benefits: the instance becomes hashable (works in sets and as dict keys) and `__eq__` still works by value. Pick frozen for configuration objects, domain value-types like `Money`, or anything you want to use as a cache key. To bypass the freeze inside `__post_init__` (rare), use `object.__setattr__(self, "field", value)`.',
      hints: [
        '@dataclass(frozen=True) blocks attribute assignment after __init__',
        'FrozenInstanceError inherits from AttributeError',
        'Frozen instances are hashable — usable as dict keys / in sets',
      ],
      tags: ['dataclasses', 'frozen', 'immutable', 'basics'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dc-post-init-basic',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define an `Age` dataclass with a single integer field `years`. Use `__post_init__` to validate: when `years` is negative, raise `ValueError("years must be non-negative")`. Build `a = Age(30)` and print `a.years`.',
      starterCode: `from dataclasses import dataclass
  `,
      testCases: [
        {
          input: 'Age(30)',
          expectedOutput: '30',
          description: '__post_init__ is the canonical place to validate fields',
        },
      ],
      solution: `from dataclasses import dataclass

@dataclass
class Age:
    years: int

    def __post_init__(self):
        if self.years < 0:
            raise ValueError("years must be non-negative")

a = Age(30)
print(a.years)`,
      tieredHints: {
        apiSignature: 'raise ValueError(message: str)',
        skeleton: `from dataclasses import ____

@dataclass
class Age:
    years: ____

    def ____(self):
        if self.years ____ 0:
            raise ____("years must be non-negative")

a = ____(30)
print(a.years)`,
      },
      explanation:
        '`__post_init__` runs immediately after the auto-generated `__init__` finishes assigning fields, so every field is available. It\'s the canonical place to validate inputs, normalize values (`self.email = self.email.lower()`), or compute derived state. If you also use `field(init=False)` this is where you\'d assign the derived field. For an immutable (`frozen=True`) dataclass you must use `object.__setattr__` to write — but for pure validation like this, no mutation is needed.',
      hints: [
        '__post_init__ runs after __init__ — all fields already assigned',
        'Raise ValueError/TypeError for bad inputs',
        'Also used for normalization and derived-field computation',
      ],
      tags: ['dataclasses', 'post_init', '__post_init__', 'validation', 'basics'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-dc-frozen-order',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a `Version` dataclass with integer fields `major`, `minor`, and `patch`. It must be both immutable and sortable. Create two instances representing versions 1.2.3 and 1.3.0, print whether the first is less than the second, and print the size of a set containing these instances and a duplicate of the first (demonstrating value-based hashability).',
      starterCode: `from dataclasses import dataclass
  `,
      testCases: [
        {
          input: 'frozen + order: comparable and hashable',
          expectedOutput: 'True\n2',
          description: 'Ordering works field-by-field; duplicates collapse in the set',
        },
      ],
      solution: `from dataclasses import dataclass

@dataclass(frozen=True, order=True)
class Version:
    major: int
    minor: int
    patch: int

v1 = Version(1, 2, 3)
v2 = Version(1, 3, 0)
print(v1 < v2)

s = {v1, v2, Version(1, 2, 3)}
print(len(s))`,
      tieredHints: {
        apiSignature: '@dataclass(*, frozen=False, order=False, eq=True)',
        skeleton: `from dataclasses import ____

@____(____=True, ____=True)
class Version:
    major: ____
    minor: ____
    patch: ____

v1 = ____(1, 2, 3)
v2 = ____(1, 3, 0)
print(v1 ____ v2)

s = {v1, v2, ____(1, 2, 3)}
print(____(s))`,
      },
      explanation:
        'Pairing `frozen=True` and `order=True` produces the shape you want for value-object identifiers: immutable, comparable, hashable. `order=True` on its own generates `__lt__/__le__/__gt__/__ge__` that compare field-by-field in declaration order — so semver sorts naturally. `frozen=True` alone generates `__hash__`. Together they give you a class whose instances behave like sortable, set-member-able, never-mutated domain values. Real use cases: version numbers, commit SHAs, event offsets, coordinate points.',
      hints: [
        'frozen=True → hashable by value; order=True → __lt__/__le__/__gt__/__ge__',
        'Field declaration order = sort key order',
        'Set de-duplicates by __hash__ + __eq__, both generated here',
      ],
      tags: ['dataclasses', 'frozen', 'order', 'value-object'],
      concepts: ['py-dataclass-defaults'],
    },
  {
      id: 'py-gap-dataclasses-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      question: 'What is a dataclass in Python?',
      options: [
        { id: 'a', text: 'A special database connection class provided by the `sqlite3` module', isCorrect: false },
        { id: 'b', text: 'A class that can only store data and cannot have any methods', isCorrect: false },
        { id: 'c', text: 'A class decorator (`@dataclass`) that auto-generates `__init__`, `__repr__`, and `__eq__` from field definitions, reducing boilerplate for data containers', isCorrect: true },
        { id: 'd', text: 'A way to validate data types at runtime using Python\'s type system', isCorrect: false },
      ],
      explanation: 'The `@dataclass` decorator (from the `dataclasses` module, Python 3.7+) automatically generates common special methods based on your field definitions. Instead of writing a full `__init__` to assign each attribute, a `__repr__` for string representation, and an `__eq__` for comparison, the decorator creates them for you. You just define the fields with type annotations and the decorator handles the rest.',
      hints: [
        'Dataclasses reduce boilerplate — you define fields, Python generates methods',
        'They still support custom methods, unlike plain tuples or dicts',
      ],
      tags: ['dataclasses', 'decorator', 'boilerplate', 'basics'],
      concepts: ['py-dataclass-defaults', 'py-decorator-application'],
    },
  {
      id: 'py-gap-dataclasses-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a dataclass called `Point` with two fields: `x: float` and `y: float`. Create two instances with the same coordinates and verify they are equal using `==`. Also create a third point with different coordinates and verify it is NOT equal.',
      starterCode: `from dataclasses import dataclass

# Define the Point dataclass


# Create two points with the same coordinates (1.0, 2.0)
# and one with different coordinates (3.0, 4.0)


# Test equality
`,
      testCases: [
        {
          input: 'Point(1.0, 2.0) == Point(1.0, 2.0)',
          expectedOutput: 'True',
          description: 'Points with same coordinates should be equal',
        },
        {
          input: 'Point(1.0, 2.0) == Point(3.0, 4.0)',
          expectedOutput: 'False',
          description: 'Points with different coordinates should not be equal',
        },
      ],
      solution: `from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

p1 = Point(1.0, 2.0)
p2 = Point(1.0, 2.0)
p3 = Point(3.0, 4.0)

print(p1 == p2)  # True  — auto-generated __eq__ compares fields
print(p1 == p3)  # False
print(p1)        # Point(x=1.0, y=2.0) — auto-generated __repr__`,
      tieredHints: {
        apiSignature: '@dataclass(*, init=True, repr=True, eq=True)',
        skeleton: `from dataclasses import ____

@____
class Point:
    x: ____
    y: ____

p1 = ____(1.0, 2.0)
p2 = ____(1.0, 2.0)
p3 = ____(3.0, 4.0)

print(p1 ____ p2)
print(p1 ____ p3)
print(p1)`,
      },
      explanation: 'The `@dataclass` decorator reads the type-annotated fields (`x: float`, `y: float`) and auto-generates: (1) `__init__` so you can write `Point(1.0, 2.0)`, (2) `__repr__` so printing shows `Point(x=1.0, y=2.0)`, and (3) `__eq__` so two Points with the same x and y are considered equal. Without `@dataclass`, a regular class would compare by identity (memory address), not by field values.',
      hints: [
        'Apply `@dataclass` above the class definition',
        'Just define fields with type annotations — no `__init__` needed',
        'The auto-generated `__eq__` compares all fields',
      ],
      tags: ['dataclasses', 'equality', 'basics'],
      concepts: ['py-dataclass-defaults'],
    },
];
