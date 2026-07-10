/**
 * Topic.PY_PYDANTIC — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pyPydanticCloze.ts (10), pyPydanticParsons.ts (10), pyPydanticPredictOutput.ts (10), pythonMasteryTier1Questions.ts (6)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_pydantic_questions: Question[] = [
  {
      id: 'py-pydantic-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the base class for Pydantic models.',
      template: `from pydantic import ___

class User(___):
    name: str
    age: int`,
      blanks: ['BaseModel', 'BaseModel'],
      solution: 'from pydantic import BaseModel\n\nclass User(BaseModel):\n    name: str\n    age: int',
      explanation:
        'BaseModel is the canonical base class for Pydantic models. Subclassing it auto-generates __init__, validation, and serialization.',
      hints: ['CamelCase: "Base" + "Model".'],
      tags: ['pydantic', 'BaseModel'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the Field kwargs for "greater than or equal to 0" and "less than or equal to 150".',
      template: `from pydantic import BaseModel, Field

class User(BaseModel):
    age: int = Field(___=0, ___=150)`,
      blanks: ['ge', 'le'],
      solution:
        'from pydantic import BaseModel, Field\n\nclass User(BaseModel):\n    age: int = Field(ge=0, le=150)',
      explanation:
        'ge = greater-or-equal, le = less-or-equal. Also gt (strict), lt (strict). Pydantic v1\'s min/max kwargs were renamed.',
      hints: ['Two-letter names matching the operator semantics.'],
      tags: ['pydantic', 'Field'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the Pydantic v2 decorator for per-field validators.',
      template: `from pydantic import BaseModel, ___

class User(BaseModel):
    name: str

    @___("name")
    @classmethod
    def upper(cls, v: str) -> str:
        return v.upper()`,
      blanks: ['field_validator', 'field_validator'],
      solution:
        'from pydantic import BaseModel, field_validator\n\nclass User(BaseModel):\n    name: str\n\n    @field_validator("name")\n    @classmethod\n    def upper(cls, v: str) -> str:\n        return v.upper()',
      explanation:
        'Pydantic v2 renamed @validator → @field_validator. Requires @classmethod stacked beneath. Receives cls and the value, returns cleaned value or raises ValueError.',
      hints: ['Snake-case: "field" + "_validator".'],
      tags: ['pydantic', 'field_validator'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the v2 decorator for cross-field validation at the model level.',
      template: `from pydantic import BaseModel, ___

class Range(BaseModel):
    start: int
    end: int

    @___(mode="after")
    def check_order(self) -> "Range":
        if self.end <= self.start:
            raise ValueError
        return self`,
      blanks: ['model_validator', 'model_validator'],
      solution:
        'from pydantic import BaseModel, model_validator\n\nclass Range(BaseModel):\n    start: int\n    end: int\n\n    @model_validator(mode="after")\n    def check_order(self) -> "Range":\n        if self.end <= self.start:\n            raise ValueError\n        return self',
      explanation:
        'model_validator runs at the whole-model level. mode="after" runs after individual field validation; mode="before" runs first on raw input.',
      hints: ['Snake-case: "model" + "_validator".'],
      tags: ['pydantic', 'model_validator'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the v2 method names for converting a model to a dict and to JSON.',
      template: `u = User(name="Alice", age=30)
print(u.___())
print(u.___())`,
      blanks: ['model_dump', 'model_dump_json'],
      solution: 'u = User(name="Alice", age=30)\nprint(u.model_dump())\nprint(u.model_dump_json())',
      explanation:
        'Pydantic v2 renamed .dict() → .model_dump() and .json() → .model_dump_json(). The "model_" prefix groups all serialization helpers.',
      hints: ['Both prefixed with "model_".'],
      tags: ['pydantic', 'model_dump'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the v2 classmethod that builds a model from a dict.',
      template: `data = {"name": "Alice", "age": 30}
u = User.___(data)`,
      blanks: ['model_validate'],
      solution: 'data = {"name": "Alice", "age": 30}\nu = User.model_validate(data)',
      explanation:
        'Pydantic v2: model_validate (replaces parse_obj). Works with dicts, JSON strings (via model_validate_json), or objects (via model_validate, with from_attributes=True for ORMs).',
      hints: ['Snake-case: "model" + "_validate".'],
      tags: ['pydantic', 'model_validate'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the v2 way to set model configuration.',
      template: `from pydantic import BaseModel, ___

class User(BaseModel):
    model_config = ___(extra="forbid")
    name: str`,
      blanks: ['ConfigDict', 'ConfigDict'],
      solution:
        'from pydantic import BaseModel, ConfigDict\n\nclass User(BaseModel):\n    model_config = ConfigDict(extra="forbid")\n    name: str',
      explanation:
        'Pydantic v2: model_config = ConfigDict(...). The v1 inner-class form (`class Config:`) is deprecated. Common keys: extra, frozen, validate_assignment, str_strip_whitespace.',
      hints: ['CamelCase: "Config" + "Dict".'],
      tags: ['pydantic', 'ConfigDict'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the exception type Pydantic raises on validation failure.',
      template: `from pydantic import BaseModel, ___

try:
    User(age="abc")
except ___ as e:
    print(e.errors())`,
      blanks: ['ValidationError', 'ValidationError'],
      solution:
        'from pydantic import BaseModel, ValidationError\n\ntry:\n    User(age="abc")\nexcept ValidationError as e:\n    print(e.errors())',
      explanation:
        'ValidationError (subclass of ValueError) is raised on validation failure. .errors() returns a list of {loc, msg, type, input} dicts — perfect for HTTP error responses.',
      hints: ['CamelCase: "Validation" + "Error".'],
      tags: ['pydantic', 'ValidationError'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the decorator that exposes a derived value in serialization.',
      template: `from pydantic import BaseModel, ___

class Rect(BaseModel):
    w: int
    h: int

    @___
    @property
    def area(self) -> int:
        return self.w * self.h`,
      blanks: ['computed_field', 'computed_field'],
      solution:
        'from pydantic import BaseModel, computed_field\n\nclass Rect(BaseModel):\n    w: int\n    h: int\n\n    @computed_field\n    @property\n    def area(self) -> int:\n        return self.w * self.h',
      explanation:
        'computed_field surfaces a derived value in model_dump. Stack with @property — order matters: @computed_field on top.',
      hints: ['Snake-case: "computed" + "_field".'],
      tags: ['pydantic', 'computed_field'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the Field kwarg used to give each instance a fresh empty list.',
      template: `from pydantic import BaseModel, Field

class Cart(BaseModel):
    items: list[str] = Field(___=list)`,
      blanks: ['default_factory'],
      solution:
        'from pydantic import BaseModel, Field\n\nclass Cart(BaseModel):\n    items: list[str] = Field(default_factory=list)',
      explanation:
        'Same name and semantics as dataclasses.field(default_factory=...). Required for mutable defaults — using a literal [] raises ValueError.',
      hints: ['Same name as the dataclasses kwarg.'],
      tags: ['pydantic', 'default_factory'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a User Pydantic model with name and age fields, then validate input data.',
      correctOrder: [
        'from pydantic import BaseModel',
        '',
        'class User(BaseModel):',
        '    name: str',
        '    age: int',
        '',
        'u = User(name="Alice", age=30)',
        'print(u.name)',
      ],
      distractorLines: [
        'class User:',
        '    def __init__(self, name, age):',
        'class User(BaseModel()):',
      ],
      solution:
        'from pydantic import BaseModel\n\nclass User(BaseModel):\n    name: str\n    age: int\n\nu = User(name="Alice", age=30)\nprint(u.name)',
      explanation:
        'A Pydantic model subclasses BaseModel directly. Annotated class attributes become validated fields — Pydantic generates __init__, validation, and serialization automatically. No explicit __init__ needed; class BaseModel() with parens is wrong.',
      hints: ['Subclass BaseModel; annotated fields are auto-validated.'],
      tags: ['pydantic', 'BaseModel'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use Field with constraints to require age between 0 and 150.',
      correctOrder: [
        'from pydantic import BaseModel, Field',
        '',
        'class User(BaseModel):',
        '    name: str',
        '    age: int = Field(ge=0, le=150)',
      ],
      distractorLines: [
        '    age: int = Field(min=0, max=150)',
        '    age: int = (Field, ge=0, le=150)',
      ],
      solution:
        'from pydantic import BaseModel, Field\n\nclass User(BaseModel):\n    name: str\n    age: int = Field(ge=0, le=150)',
      explanation:
        'Field(ge=, le=, gt=, lt=) sets numeric bounds. The kwarg names mirror operator names: ge=greater-or-equal, le=less-or-equal. Pydantic v2 dropped Field(min=, max=) — those were v1.',
      hints: ['Pydantic uses ge/le/gt/lt, not min/max.'],
      tags: ['pydantic', 'Field', 'constraints'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Add a field_validator (Pydantic v2) that uppercases the country field on input.',
      correctOrder: [
        'from pydantic import BaseModel, field_validator',
        '',
        'class Address(BaseModel):',
        '    country: str',
        '',
        '    @field_validator("country")',
        '    @classmethod',
        '    def upper(cls, v: str) -> str:',
        '        return v.upper()',
      ],
      distractorLines: [
        '    @validator("country")',
        '    def upper(self, v):',
      ],
      solution:
        'from pydantic import BaseModel, field_validator\n\nclass Address(BaseModel):\n    country: str\n\n    @field_validator("country")\n    @classmethod\n    def upper(cls, v: str) -> str:\n        return v.upper()',
      explanation:
        'Pydantic v2 uses field_validator (the v1 name was @validator). It receives cls (so @classmethod is required), the value, and returns the cleaned value. Raise ValueError to reject. Don\'t use self — these aren\'t instance methods.',
      hints: ['v2: @field_validator + @classmethod. Receives cls, returns cleaned value.'],
      tags: ['pydantic', 'field_validator'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Add a model_validator that ensures end > start across two fields.',
      correctOrder: [
        'from pydantic import BaseModel, model_validator',
        '',
        'class Range(BaseModel):',
        '    start: int',
        '    end: int',
        '',
        '    @model_validator(mode="after")',
        '    def check_order(self) -> "Range":',
        '        if self.end <= self.start:',
        '            raise ValueError("end must be > start")',
        '        return self',
      ],
      distractorLines: [
        '    @model_validator',
        '    @field_validator(mode="after")',
      ],
      solution:
        'from pydantic import BaseModel, model_validator\n\nclass Range(BaseModel):\n    start: int\n    end: int\n\n    @model_validator(mode="after")\n    def check_order(self) -> "Range":\n        if self.end <= self.start:\n            raise ValueError("end must be > start")\n        return self',
      explanation:
        'model_validator runs at the model level (sees ALL fields). mode="after" runs after individual field validation; mode="before" runs first on raw input. Must be CALLED with the mode kwarg. Returns self (or the validated model). Use for cross-field constraints.',
      hints: ['model_validator(mode="after") for cross-field checks. Returns self.'],
      tags: ['pydantic', 'model_validator'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Serialize a Pydantic model to a dict and to JSON.',
      correctOrder: [
        'from pydantic import BaseModel',
        '',
        'class User(BaseModel):',
        '    name: str',
        '    age: int',
        '',
        'u = User(name="Alice", age=30)',
        'print(u.model_dump())',
        'print(u.model_dump_json())',
      ],
      distractorLines: [
        'print(u.dict())',
        'print(u.json())',
      ],
      solution:
        'from pydantic import BaseModel\n\nclass User(BaseModel):\n    name: str\n    age: int\n\nu = User(name="Alice", age=30)\nprint(u.model_dump())\nprint(u.model_dump_json())',
      explanation:
        'Pydantic v2 renamed .dict() → .model_dump() and .json() → .model_dump_json(). The old names still work in v2 but are deprecated. Use the model_* prefix for new code.',
      hints: ['v2: model_dump / model_dump_json. v1 used dict() / json().'],
      tags: ['pydantic', 'serialization'],
      concepts: ['py-pydantic-validation', 'py-json-serialization'],
    },
  {
      id: 'py-pydantic-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Create a model from a dict using model_validate (v2 replacement for parse_obj).',
      correctOrder: [
        'from pydantic import BaseModel',
        '',
        'class User(BaseModel):',
        '    name: str',
        '    age: int',
        '',
        'data = {"name": "Alice", "age": 30}',
        'u = User.model_validate(data)',
      ],
      distractorLines: [
        'u = User.parse_obj(data)',
        'u = User(data)',
      ],
      solution:
        'from pydantic import BaseModel\n\nclass User(BaseModel):\n    name: str\n    age: int\n\ndata = {"name": "Alice", "age": 30}\nu = User.model_validate(data)',
      explanation:
        'Pydantic v2: model_validate (replaces parse_obj). Useful when data comes from an external source as a dict. User(data) would treat the dict as a single positional arg, which fails. User(**data) works too.',
      hints: ['v2: model_validate. v1 used parse_obj.'],
      tags: ['pydantic', 'model_validate'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use computed_field to expose a derived attribute in serialization.',
      correctOrder: [
        'from pydantic import BaseModel, computed_field',
        '',
        'class Rect(BaseModel):',
        '    width: int',
        '    height: int',
        '',
        '    @computed_field',
        '    @property',
        '    def area(self) -> int:',
        '        return self.width * self.height',
      ],
      distractorLines: [
        '    @computed_field()',
        '    area: int = property(...)',
      ],
      solution:
        'from pydantic import BaseModel, computed_field\n\nclass Rect(BaseModel):\n    width: int\n    height: int\n\n    @computed_field\n    @property\n    def area(self) -> int:\n        return self.width * self.height',
      explanation:
        'computed_field exposes a derived value in model_dump output. Stack with @property — order matters (@computed_field on top, @property below). Without computed_field, regular @property works but isn\'t serialized.',
      hints: ['Stack: @computed_field on top, @property below.'],
      tags: ['pydantic', 'computed_field'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Catch ValidationError and inspect the errors when validation fails.',
      correctOrder: [
        'from pydantic import BaseModel, ValidationError',
        '',
        'class User(BaseModel):',
        '    age: int',
        '',
        'try:',
        '    User(age="not a number")',
        'except ValidationError as e:',
        '    print(e.errors())',
      ],
      distractorLines: [
        'except TypeError as e:',
        'except ValueError as e:',
      ],
      solution:
        'from pydantic import BaseModel, ValidationError\n\nclass User(BaseModel):\n    age: int\n\ntry:\n    User(age="not a number")\nexcept ValidationError as e:\n    print(e.errors())',
      explanation:
        'Pydantic raises ValidationError (a subclass of ValueError but distinct from plain TypeError). .errors() returns a structured list of {loc, msg, type, input} dicts — easy to surface in HTTP responses.',
      hints: ['ValidationError, not TypeError. .errors() for structured output.'],
      tags: ['pydantic', 'ValidationError'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Configure a model to allow extra="forbid" so unknown fields raise.',
      correctOrder: [
        'from pydantic import BaseModel, ConfigDict',
        '',
        'class User(BaseModel):',
        '    model_config = ConfigDict(extra="forbid")',
        '    name: str',
      ],
      distractorLines: [
        '    class Config:',
        '        extra = "forbid"',
        '    config = {"extra": "forbid"}',
      ],
      solution:
        'from pydantic import BaseModel, ConfigDict\n\nclass User(BaseModel):\n    model_config = ConfigDict(extra="forbid")\n    name: str',
      explanation:
        'Pydantic v2: model_config = ConfigDict(...). The v1 inner-class form (`class Config:`) is deprecated. extra="forbid" rejects unknown fields; "ignore" silently drops them; "allow" adds them as attributes.',
      hints: ['v2: model_config = ConfigDict(...). v1: class Config:.'],
      tags: ['pydantic', 'ConfigDict'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a field with a default factory for a mutable default (avoiding the classic shared-state trap).',
      correctOrder: [
        'from pydantic import BaseModel, Field',
        '',
        'class Cart(BaseModel):',
        '    items: list[str] = Field(default_factory=list)',
      ],
      distractorLines: [
        '    items: list[str] = []',
        '    items: list[str] = Field(default=[])',
      ],
      solution:
        'from pydantic import BaseModel, Field\n\nclass Cart(BaseModel):\n    items: list[str] = Field(default_factory=list)',
      explanation:
        'Like dataclasses, Pydantic also forbids mutable default literals — `items: list[str] = []` raises ValueError. Use Field(default_factory=list) for fresh-per-instance lists. Same pattern as dataclasses.field(default_factory=...).',
      hints: ['Same trap as dataclasses; same fix: default_factory.'],
      tags: ['pydantic', 'default_factory'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from pydantic import BaseModel

class User(BaseModel):
    age: int

u = User(age="30")
print(u.age)
print(type(u.age).__name__)`,
      expectedOutput: `30
int`,
      explanation:
        'In default (lax) mode, Pydantic COERCES compatible types — string "30" becomes int 30. The result is an actual int (not a string). Use Field(strict=True) or model_config strict=True to disable coercion.',
      hints: ['Default Pydantic mode coerces "30" → 30.'],
      tags: ['pydantic', 'coercion'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from pydantic import BaseModel, ValidationError

class User(BaseModel):
    age: int

try:
    User(age="thirty")
except ValidationError as e:
    print(len(e.errors()))`,
      expectedOutput: `1`,
      explanation:
        '"thirty" cannot be coerced to int. Pydantic raises ValidationError. .errors() returns a list with one entry describing the field, error type, and input that failed. One field with one issue → list of length 1.',
      hints: ['ValidationError.errors() is a list — one entry per failed field/issue.'],
      tags: ['pydantic', 'ValidationError', 'errors'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int

u = User(name="Alice", age=30)
print(u.model_dump())`,
      expectedOutput: `{'name': 'Alice', 'age': 30}`,
      explanation:
        'model_dump returns a regular Python dict mirroring the model fields. Field order matches declaration order. For JSON output, use model_dump_json.',
      hints: ['model_dump → dict; field order = declaration order.'],
      tags: ['pydantic', 'model_dump'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from pydantic import BaseModel, computed_field

class Rect(BaseModel):
    w: int
    h: int

    @computed_field
    @property
    def area(self) -> int:
        return self.w * self.h

r = Rect(w=3, h=4)
print(r.model_dump())`,
      expectedOutput: `{'w': 3, 'h': 4, 'area': 12}`,
      explanation:
        'computed_field exposes the derived value in serialization. Without it, area would be a regular @property — accessible but NOT in model_dump output. Computed fields appear AFTER regular fields by default.',
      hints: ['computed_field → appears in model_dump.'],
      tags: ['pydantic', 'computed_field'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int = 0

u = User(name="Alice")
print(u.age)`,
      expectedOutput: `0`,
      explanation:
        'Default field values work like dataclass defaults — used when omitted from input. Required fields without defaults raise ValidationError if missing.',
      hints: ['Default value used when field omitted.'],
      tags: ['pydantic', 'defaults'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from pydantic import BaseModel, field_validator

class User(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def upper(cls, v: str) -> str:
        return v.upper()

u = User(name="alice")
print(u.name)`,
      expectedOutput: `ALICE`,
      explanation:
        'field_validator transforms the value during construction. The returned value replaces the input. So name="alice" becomes "ALICE" inside the model.',
      hints: ['field_validator can both validate AND transform.'],
      tags: ['pydantic', 'field_validator'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from pydantic import BaseModel, ConfigDict, ValidationError

class User(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str

try:
    User(name="Alice", unknown_field=1)
except ValidationError:
    print("rejected")`,
      expectedOutput: `rejected`,
      explanation:
        'extra="forbid" rejects unknown fields by raising ValidationError. Default (extra="ignore") would silently drop unknown_field. extra="allow" would add it as an attribute.',
      hints: ['extra="forbid" — unknown fields raise.'],
      tags: ['pydantic', 'extra'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int

u = User(name="Alice", age=30)
d = u.model_dump(exclude={"age"})
print(d)`,
      expectedOutput: `{'name': 'Alice'}`,
      explanation:
        'model_dump accepts exclude= (set of field names to omit) and include= (set of fields to keep). Useful for hiding sensitive fields or trimming for API responses.',
      hints: ['exclude={"field"} drops that field.'],
      tags: ['pydantic', 'model_dump', 'exclude'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int

a = User(name="Alice", age=30)
b = User(name="Alice", age=30)
print(a == b)`,
      expectedOutput: `True`,
      explanation:
        'Pydantic models auto-generate __eq__ comparing field values. Two instances with the same data are equal. Like dataclasses\' default behavior.',
      hints: ['Pydantic auto-generates __eq__ from fields.'],
      tags: ['pydantic', 'equality'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from pydantic import BaseModel

class User(BaseModel):
    name: str

u = User(name="Alice")
u.name = "Bob"
print(u.name)`,
      expectedOutput: `Bob`,
      explanation:
        'Pydantic v2 models are mutable by default (v1 was too). Field validation runs on assignment ONLY if model_config has validate_assignment=True. Use frozen=True in ConfigDict for immutability.',
      hints: ['Default Pydantic models are mutable.'],
      tags: ['pydantic', 'mutability'],
      concepts: ['py-pydantic-validation', 'py-mutable-vs-immutable'],
    },
  {
      id: 'py-pydantic-predict-11',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from pydantic import BaseModel

class Book(BaseModel):
    title: str
    pages: int

b = Book(title="Dune", pages=412)
print(b.title)
print(b.pages)`,
      expectedOutput: `Dune
412`,
      explanation:
        'Annotated class attributes become validated fields. Constructing with matching keyword arguments stores them as normal attributes, read back with dot access. No coercion is needed here — the inputs already match the declared types.',
      hints: ['Each field is set from its keyword argument and read with dot access.'],
      tags: ['pydantic', 'BaseModel'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-predict-12',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from pydantic import BaseModel

class Point(BaseModel):
    x: int
    y: int

p = Point(x=1, y=2)
print(p.model_dump())`,
      expectedOutput: `{'x': 1, 'y': 2}`,
      explanation:
        'model_dump() serializes a model back to a plain dict, with keys in field-declaration order. It is the v2 replacement for v1\'s .dict(). Use model_dump_json() to get a JSON string instead.',
      hints: ['model_dump() returns a plain dict in field order.'],
      tags: ['pydantic', 'model_dump'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-parsons-11',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble a Pydantic model. Declare a required `name` (str) field FIRST, then an `active` (bool) field defaulting to True. Then construct with only `name="Alice"` and print `active`.',
      correctOrder: [
        'from pydantic import BaseModel',
        '',
        'class Account(BaseModel):',
        '    name: str',
        '    active: bool = True',
        '',
        'a = Account(name="Alice")',
        'print(a.active)',
      ],
      distractorLines: [
        'class Account:',
        '    active = True',
        'a = Account("Alice")',
      ],
      solution:
        'from pydantic import BaseModel\n\nclass Account(BaseModel):\n    name: str\n    active: bool = True\n\na = Account(name="Alice")\nprint(a.active)',
      explanation:
        'A field with a default value is optional at construction — omit it and the default applies, so `active` is True. The default needs a type annotation (`active: bool = True`); `active = True` with no annotation is a plain class attribute, not a validated field. Pydantic constructors are keyword-only, so `Account("Alice")` fails.',
      hints: ['Annotated field with `= True` is an optional field; constructor args are keyword-only.'],
      tags: ['pydantic', 'BaseModel', 'defaults'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      question: 'What does pydantic give you that a plain `dataclass` does not?',
      options: [
        { id: 'a', text: 'Nothing — they are equivalent', isCorrect: false },
        { id: 'b', text: 'Runtime data validation and coercion based on type hints. `BaseModel` subclasses validate inputs on construction (raising `ValidationError` on bad data), coerce compatible types (e.g. "42" → int 42), and support nested models, custom validators, JSON schema export, and `.model_dump()` / `.model_validate_json()` round-trips.', isCorrect: true },
        { id: 'c', text: 'Faster attribute access only', isCorrect: false },
        { id: 'd', text: 'Database ORM capabilities', isCorrect: false },
      ],
      explanation: 'Dataclasses are static containers — type hints are documentation only. Pydantic enforces them at runtime: you cannot construct a `User(age="not a number")` without a `ValidationError`. Used by FastAPI, drf-spectacular, LangChain. In v2, use `.model_dump()`, `.model_validate(obj)`, `.model_validate_json(s)`, `.model_dump_json()`.',
      hints: [
        'pydantic validates + coerces at runtime',
        'Raises ValidationError on bad inputs',
        'Used by FastAPI for request/response validation',
      ],
      tags: ['pydantic', 'validation', 'basics'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a pydantic `User` model inheriting from `BaseModel` with three fields — `name` (string), `age` (int), and `email` (string). Build `u = User(name="Alice", age="30", email="alice@example.com")` — pydantic should coerce the string `"30"` to integer `30`. Print `u.age` (expect `30`) and the type name of `u.age` (expect `int`).',
      starterCode: `from pydantic import BaseModel
  `,
      testCases: [
        {
          input: 'coercion "30" -> 30',
          expectedOutput: '30\nint',
          description: 'pydantic coerces compatible types',
        },
      ],
      solution: `from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int
    email: str

u = User(name="Alice", age="30", email="alice@example.com")
print(u.age)
print(type(u.age).__name__)`,
      explanation: 'BaseModel coerces compatible inputs — numeric strings → ints, "true"/"false" → bool, etc. If coercion fails (e.g. `age="thirty"`), it raises `ValidationError` with a structured error list pointing at the bad field. Set `model_config = ConfigDict(strict=True)` to disable coercion and demand exact types.',
      hints: [
        'Inherit BaseModel; annotate fields with type hints',
        'pydantic coerces "30" to int 30 automatically',
        'Enable strict=True in model_config for no coercion',
      ],
      tags: ['pydantic', 'BaseModel', 'coercion'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a pydantic `User` model with a string `name` field and integer `age` field. Inside a `try/except` block that catches pydantic\'s validation error type, try to construct `User(name="Alice", age="not a number")` — this must fail because `"not a number"` cannot be coerced to an int. In the except branch, print `"validation failed"`.',
      starterCode: `from pydantic import BaseModel, ValidationError
  `,
      testCases: [
        {
          input: 'invalid age triggers ValidationError',
          expectedOutput: 'validation failed',
          description: 'pydantic raises ValidationError on bad input',
        },
      ],
      solution: `from pydantic import BaseModel, ValidationError

class User(BaseModel):
    name: str
    age: int

try:
    User(name="Alice", age="not a number")
except ValidationError:
    print("validation failed")`,
      explanation: '`ValidationError` is pydantic\'s one error type — you can call `e.errors()` for a structured list (`[{"loc": ("age",), "msg": "...", "type": "int_parsing"}, ...]`) or `str(e)` for a human-readable summary. Always catch it at the service boundary (e.g. FastAPI handlers do this automatically and return 422).',
      hints: [
        'Import ValidationError from pydantic',
        'e.errors() gives a structured list of field problems',
        'FastAPI auto-catches this and returns 422 Unprocessable Entity',
      ],
      tags: ['pydantic', 'ValidationError', 'error-handling'],
      concepts: ['py-pydantic-validation', 'py-exception-hierarchy'],
    },
  {
      id: 'py-pydantic-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a pydantic `Product` model with a string `name` field and float `price` field. Attach a field-level validator to `price` (using pydantic\'s v2 decorator for that purpose, applied to a classmethod) that raises `ValueError("price must be > 0")` whenever the value is non-positive, otherwise returns the value unchanged. Inside a `try/except` that catches pydantic\'s validation error, construct `Product(name="Widget", price=-1)` and in the except branch print `"invalid"`.',
      starterCode: `from pydantic import BaseModel, field_validator, ValidationError
  `,
      testCases: [
        {
          input: 'negative price',
          expectedOutput: 'invalid',
          description: 'field_validator converts ValueError to ValidationError',
        },
      ],
      solution: `from pydantic import BaseModel, field_validator, ValidationError

class Product(BaseModel):
    name: str
    price: float

    @field_validator("price")
    @classmethod
    def check_positive(cls, v):
        if v <= 0:
            raise ValueError("price must be > 0")
        return v

try:
    Product(name="Widget", price=-1)
except ValidationError:
    print("invalid")`,
      explanation: 'Field validators run AFTER type coercion. Raise `ValueError` (or `AssertionError`) from them — pydantic wraps it in a `ValidationError` automatically. Must be classmethods decorated with `@field_validator("field_name")`. For cross-field logic (e.g. `start_date < end_date`), use `@model_validator(mode="after")`.',
      hints: [
        '@field_validator("field_name") + @classmethod',
        'Raise ValueError inside the validator — pydantic rewraps it',
        'Return the (possibly transformed) value on success',
      ],
      tags: ['pydantic', 'field_validator', 'validation'],
      concepts: ['py-pydantic-validation'],
    },
  {
      id: 'py-pydantic-5',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a pydantic `Order` model with an integer field `order_id` and a list-of-string field `items`. Build `o = Order(order_id=1, items=["apple", "banana"])`. Serialise the model to a JSON string using pydantic v2\'s JSON dump method and assign to `s`; print `s` (expect `{"order_id":1,"items":["apple","banana"]}`). Then parse the JSON string back into an `Order` instance using pydantic v2\'s JSON validation classmethod, and print its `order_id` attribute (expect `1`).',
      starterCode: `from pydantic import BaseModel
  `,
      testCases: [
        {
          input: 'model_dump_json and model_validate_json',
          expectedOutput: '{"order_id":1,"items":["apple","banana"]}\n1',
          description: 'pydantic v2 JSON round-trip',
        },
      ],
      solution: `from pydantic import BaseModel

class Order(BaseModel):
    order_id: int
    items: list[str]

o = Order(order_id=1, items=["apple", "banana"])
s = o.model_dump_json()
print(s)

parsed = Order.model_validate_json(s)
print(parsed.order_id)`,
      explanation: 'v2 methods: `model_dump()` → dict, `model_dump_json()` → JSON string, `model_validate(obj)` → model from dict, `model_validate_json(s)` → model from JSON string. These replace v1\'s `.dict()`, `.json()`, `parse_obj`, `parse_raw`. Custom JSON encoding handled automatically for datetime, UUID, Decimal, Path, Enum.',
      hints: [
        'model_dump / model_dump_json to serialise',
        'model_validate / model_validate_json to deserialise',
        'v2 spelling — avoid old .dict() / .json() if possible',
      ],
      tags: ['pydantic', 'json', 'serialization', 'model_dump'],
      concepts: ['py-pydantic-validation', 'py-json-serialization'],
    },
  {
      id: 'py-pydantic-6',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PYDANTIC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define two nested pydantic models. `Address` has string fields `city` and `zip`. `User` has a string `name` and an `address` field typed as `Address`. Build a `User` by passing `name="Alice"` and `address={"city": "Dublin", "zip": "D04"}` — note that `address` is provided as a plain dict, and pydantic should auto-construct the nested `Address` model from it. Print `u.address.city` (expect `Dublin`) and the type name of `u.address` (expect `Address`).',
      starterCode: `from pydantic import BaseModel
  `,
      testCases: [
        {
          input: 'nested model from dict',
          expectedOutput: 'Dublin\nAddress',
          description: 'pydantic builds nested models from dicts',
        },
      ],
      solution: `from pydantic import BaseModel

class Address(BaseModel):
    city: str
    zip: str

class User(BaseModel):
    name: str
    address: Address

u = User(name="Alice", address={"city": "Dublin", "zip": "D04"})
print(u.address.city)
print(type(u.address).__name__)`,
      explanation: 'When a field type is another BaseModel, pydantic will accept either an instance or a dict and auto-construct the inner model, recursively validating. This makes nested API payloads trivial — one `User.model_validate_json(request_body)` gives you a fully typed, validated object graph with no manual `.from_dict()` code.',
      hints: [
        'Nested BaseModel fields accept dict OR instance',
        'Validation runs recursively',
        'Same trick works with list[InnerModel]',
      ],
      tags: ['pydantic', 'nested-models', 'composition'],
      concepts: ['py-pydantic-validation'],
    },
];
