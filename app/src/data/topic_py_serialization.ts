/**
 * Topic.PY_SERIALIZATION — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pySerializationCloze.ts (8), pySerializationPredictOutput.ts (8), pythonBatchBExpansionQuestions.ts (6), pythonMasteryTier1Questions.ts (4)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_serialization_questions: Question[] = [
  {
      id: 'py-serialization-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the json function that converts a Python object to a JSON string.',
      template: `import json

s = json.___({"x": 1})
print(s)`,
      blanks: ['dumps'],
      solution: 'import json\n\ns = json.dumps({"x": 1})\nprint(s)',
      explanation:
        'json.dumps returns a JSON STRING. The trailing s means "to string". For writing to a file, use json.dump (no s).',
      hints: ['Five letters; "dump" + "s" for "to string".'],
      tags: ['serialization', 'json', 'dumps'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the json function that parses a JSON string to a Python object.',
      template: `import json

obj = json.___('{"x": 1}')
print(obj)`,
      blanks: ['loads'],
      solution: 'import json\n\nobj = json.loads(\'{"x": 1}\')\nprint(obj)',
      explanation:
        'json.loads parses a JSON STRING. The s means "from string". For reading a file, use json.load (no s).',
      hints: ['Five letters; "load" + "s" for "from string".'],
      tags: ['serialization', 'json', 'loads'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the json functions that read/write directly to file objects (no s suffix).',
      template: `import json

with open("data.json", "w") as f:
    json.___({"x": 1}, f)

with open("data.json") as f:
    obj = json.___(f)`,
      blanks: ['dump', 'load'],
      solution:
        'import json\n\nwith open("data.json", "w") as f:\n    json.dump({"x": 1}, f)\n\nwith open("data.json") as f:\n    obj = json.load(f)',
      explanation:
        'json.dump/load take a file object as the second/first arg. The "s" in dumps/loads stands for "string". File-based versions skip the intermediate string in memory.',
      hints: ['Same names as dumps/loads, minus the trailing s.'],
      tags: ['serialization', 'json', 'file'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the kwarg that pretty-prints JSON with N-space indentation.',
      template: `import json
print(json.dumps({"a": 1, "b": 2}, ___=2))`,
      blanks: ['indent'],
      solution: 'import json\nprint(json.dumps({"a": 1, "b": 2}, indent=2))',
      explanation:
        'indent=N pretty-prints with N spaces of indentation per level. None (default) is compact.',
      hints: ['Same word as the noun for "leading whitespace".'],
      tags: ['serialization', 'json', 'indent'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the kwarg that sorts dict keys alphabetically in JSON output (deterministic output).',
      template: `import json
print(json.dumps({"b": 2, "a": 1}, ___=True))`,
      blanks: ['sort_keys'],
      solution: 'import json\nprint(json.dumps({"b": 2, "a": 1}, sort_keys=True))',
      explanation:
        'sort_keys=True sorts top-level (and nested) dict keys alphabetically. Useful for snapshot tests and hash-stable output.',
      hints: ['Snake-case: "sort" + "_keys".'],
      tags: ['serialization', 'json', 'sort_keys'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the kwarg that emits non-ASCII characters as-is instead of \\u-escapes.',
      template: `import json
print(json.dumps({"name": "café"}, ___=False))`,
      blanks: ['ensure_ascii'],
      solution: 'import json\nprint(json.dumps({"name": "café"}, ensure_ascii=False))',
      explanation:
        'ensure_ascii=True (default) escapes non-ASCII as \\uXXXX. False emits actual UTF-8 — needed for readable non-Latin output. Both produce valid JSON.',
      hints: ['Snake-case: "ensure" + "_ascii".'],
      tags: ['serialization', 'json', 'ensure_ascii'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the kwarg that provides a custom converter for non-default types.',
      template: `import json
from datetime import date

def to_iso(o):
    if isinstance(o, date):
        return o.isoformat()
    raise TypeError

print(json.dumps({"d": date(2024, 1, 1)}, ___=to_iso))`,
      blanks: ['default'],
      solution:
        'import json\nfrom datetime import date\n\ndef to_iso(o):\n    if isinstance(o, date):\n        return o.isoformat()\n    raise TypeError\n\nprint(json.dumps({"d": date(2024, 1, 1)}, default=to_iso))',
      explanation:
        'default= is a callable that runs for objects json.dumps doesn\'t know how to serialize. Return a serializable replacement, or raise TypeError to signal "still don\'t know".',
      hints: ['Same word as the kwarg name for "fallback".'],
      tags: ['serialization', 'json', 'default'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the exception type raised by json.loads when the input is malformed JSON.',
      template: `import json
try:
    json.loads("not json")
except json.___:
    print("invalid")`,
      blanks: ['JSONDecodeError'],
      solution:
        'import json\ntry:\n    json.loads("not json")\nexcept json.JSONDecodeError:\n    print("invalid")',
      explanation:
        'json.JSONDecodeError (subclass of ValueError) is raised on parse failure. Catch it specifically to handle malformed input gracefully.',
      hints: ['CamelCase: "JSON" + "Decode" + "Error".'],
      tags: ['serialization', 'json', 'JSONDecodeError'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import json
data = {"x": 1, "y": [1, 2, 3]}
s = json.dumps(data)
print(s)`,
      expectedOutput: `{"x": 1, "y": [1, 2, 3]}`,
      explanation:
        'json.dumps serializes dict → JSON object string. Default: compact format (no indent). Lists become JSON arrays; ints stay ints. Note: JSON output uses double quotes (Python\'s default repr would use single).',
      hints: ['JSON uses double quotes; dict → JSON object.'],
      tags: ['serialization', 'json'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import json
data = (1, 2, 3)
s = json.dumps(data)
back = json.loads(s)
print(s)
print(type(back).__name__)`,
      expectedOutput: `[1, 2, 3]
list`,
      explanation:
        'JSON has no tuple type — tuples serialize as JSON arrays. Round-tripping LOSES the tuple-ness: dump gives "[1, 2, 3]", load gives a list. Affects equality and isinstance checks downstream.',
      hints: ['JSON has no tuples — they become arrays/lists.'],
      tags: ['serialization', 'json', 'type-loss'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import json
from datetime import date

try:
    json.dumps({"d": date(2024, 1, 1)})
except TypeError as e:
    print("not serializable")`,
      expectedOutput: `not serializable`,
      explanation:
        'json.dumps raises TypeError for types it doesn\'t know — datetime/date/Decimal/sets/custom classes. Workaround: pass `default=` callable, use a custom JSONEncoder subclass, or pre-convert to str/dict.',
      hints: ['JSON only handles primitives by default; date is not one.'],
      tags: ['serialization', 'json', 'TypeError'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import json
data = {"b": 2, "a": 1, "c": 3}
print(json.dumps(data, sort_keys=True))`,
      expectedOutput: `{"a": 1, "b": 2, "c": 3}`,
      explanation:
        'sort_keys=True sorts dict keys alphabetically in the output. Useful for deterministic output (snapshot tests, hash-based deduplication).',
      hints: ['sort_keys=True for deterministic output.'],
      tags: ['serialization', 'json', 'sort_keys'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import json
print(json.dumps(None))
print(json.dumps(True))
print(type(json.loads("null")))`,
      expectedOutput: `null
true
<class 'NoneType'>`,
      explanation:
        'Python None ↔ JSON null. Python True/False ↔ JSON true/false (lowercase). Round-tripping null gives back None.',
      hints: ['null ↔ None; true/false ↔ True/False.'],
      tags: ['serialization', 'json', 'null'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import json
data = {1: "a", 2: "b"}
s = json.dumps(data)
back = json.loads(s)
print(s)
print(list(back.keys()))`,
      expectedOutput: `{"1": "a", "2": "b"}
['1', '2']`,
      explanation:
        'JSON object KEYS must be strings. json.dumps coerces int keys to strings. On load, keys come back as strings — NOT the original ints. Common subtle bug.',
      hints: ['JSON object keys are strings — int keys get stringified.'],
      tags: ['serialization', 'json', 'keys'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import json
print(json.dumps({"name": "café"}))
print(json.dumps({"name": "café"}, ensure_ascii=False))`,
      expectedOutput: `{"name": "caf\\u00e9"}
{"name": "café"}`,
      explanation:
        'Default ensure_ascii=True escapes non-ASCII as \\uXXXX. ensure_ascii=False emits the actual UTF-8 characters — necessary if you want readable non-Latin output.',
      hints: ['ensure_ascii=False keeps Unicode characters as-is.'],
      tags: ['serialization', 'json', 'ensure_ascii'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import json
data = {"a": 1, "nested": {"b": 2}}
print(json.dumps(data, indent=2))`,
      expectedOutput: `{
  "a": 1,
  "nested": {
    "b": 2
  }
}`,
      explanation:
        'indent=N pretty-prints with N spaces of indentation. Useful for human-readable config files. Default is no indent (compact form). indent=4 is also common.',
      hints: ['indent for pretty-print; default is compact.'],
      tags: ['serialization', 'json', 'indent'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-ser-json-dump-file',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `data = {"name": "Alice", "count": 3}`, round-trip it through a JSON file at `/tmp/dump.json` using the `json` stdlib functions that operate on file handles (NOT their string-based siblings). First open the path in write mode and serialise `data` to the handle; then reopen it in read mode and parse the handle back into a new dict called `loaded`. Print whether `loaded == data` (expect `True`).',
      starterCode: `import json
  `,
      testCases: [
        {
          input: 'json.dump / json.load file round-trip',
          expectedOutput: 'True',
          description: 'dump/load (no s) operate on file objects',
        },
      ],
      solution: `import json

data = {"name": "Alice", "count": 3}
with open("/tmp/dump.json", "w") as fh:
    json.dump(data, fh)
with open("/tmp/dump.json") as fh:
    loaded = json.load(fh)

print(loaded == data)`,
      explanation: '`json.dump(obj, fh)` writes JSON directly to a file handle (no intermediate string); `json.load(fh)` reads and parses. The "s" variants (`dumps`, `loads`) work on strings. Use the non-s variants for files — they stream, use less memory. Always open text mode (no "b") for JSON — the library handles the encoding.',
      hints: [
        'dump / load: file objects',
        'dumps / loads: strings',
        'Always text mode — JSON is UTF-8 text',
      ],
      tags: ['json', 'dump', 'load', 'file'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-objecthook-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the json.loads kwarg that runs a callback on every parsed dict.',
      template: `import json

obj = json.loads('{"x": 1}', ___=lambda d: {k.upper(): v for k, v in d.items()})
print(obj)`,
      blanks: ['object_hook'],
      solution:
        'import json\n\nobj = json.loads(\'{"x": 1}\', object_hook=lambda d: {k.upper(): v for k, v in d.items()})\nprint(obj)',
      explanation:
        'object_hook=fn is called with every dict the decoder parses — you can return anything (a transformed dict, a custom class instance, a namedtuple). Classic use: converting JSON objects into typed Python objects during parsing.',
      hints: ['Snake-case: "object" + "_hook".'],
      tags: ['json', 'loads', 'object_hook', 'decoder'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-ser-object-hook',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given the JSON string `s = \'{"x": 1, "y": 2}\'`, parse it with `json.loads`, passing the decoder callback that runs on every parsed dict so you can transform it — use it to uppercase each dict\'s keys. Assign the result and print it (expect `{\'X\': 1, \'Y\': 2}`).',
      starterCode: `import json
  `,
      testCases: [
        {
          input: 'json.loads with object_hook',
          expectedOutput: "{'X': 1, 'Y': 2}",
          description: 'object_hook transforms each parsed dict',
        },
      ],
      solution: `import json

def to_upper(d):
    return {k.upper(): v for k, v in d.items()}

s = '{"x": 1, "y": 2}'
result = json.loads(s, object_hook=to_upper)
print(result)`,
      explanation: '`object_hook=fn` is called with every parsed dict — you return anything (dict, custom class, namedtuple). Classic use: convert JSON dicts to typed objects. Sibling kwargs: `parse_float`, `parse_int`, `parse_constant` for low-level numeric customisation (e.g. `parse_float=Decimal` to avoid float rounding). For typed-object round-trips prefer pydantic — it does this + validation + schema export.',
      hints: [
        'object_hook(d) runs on every parsed dict',
        'Return a transformed dict or a custom instance',
        'parse_float=Decimal for exact numeric parsing',
      ],
      tags: ['json', 'loads', 'object_hook', 'decoder'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-ser-pickle',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `obj = {"numbers": [1, 2, 3], "meta": (7, "x")}`, round-trip it through `pickle`: serialise to bytes with the string-form API, then deserialise the bytes back to a Python object called `restored`. Print whether `restored == obj` (expect `True`), then print the type name of `restored["meta"]` (expect `tuple` — unlike JSON, pickle preserves Python types including tuples).',
      starterCode: `import pickle
  `,
      testCases: [
        {
          input: 'pickle round-trip preserves Python types',
          expectedOutput: 'True\ntuple',
          description: 'pickle keeps tuples as tuples, classes as classes',
        },
      ],
      solution: `import pickle

obj = {"numbers": [1, 2, 3], "meta": (7, "x")}
data = pickle.dumps(obj)
restored = pickle.loads(data)

print(restored == obj)
print(type(restored["meta"]).__name__)`,
      explanation: 'Pickle serializes almost any Python object: tuples stay tuples, sets stay sets, custom classes round-trip with their methods intact. Use pickle for Python-to-Python persistence (caches, inter-process queues, multiprocessing task dispatch). DO NOT use for cross-language data interchange (use JSON) and NEVER unpickle untrusted data — pickle can execute arbitrary code by design.',
      hints: [
        'pickle = Python-native serialization; keeps types',
        'JSON = cross-language; tuples → lists',
        'NEVER unpickle untrusted data — it can execute arbitrary code',
      ],
      tags: ['pickle', 'dumps', 'loads'],
      concepts: ['py-pickle-serialization'],
    },
  {
      id: 'py-ser-pickle-vs-json-mcq',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      question: 'When should you choose `pickle` over `json`, and what\'s the dealbreaker?',
      options: [
        { id: 'a', text: 'Always pickle — it is faster', isCorrect: false },
        { id: 'b', text: 'Pickle for Python-only internal persistence (multiprocessing, disk caches, worker queues) where you need full type fidelity. JSON for interop with other languages, humans, or any data that crosses a trust boundary. DEALBREAKER: pickle.loads on untrusted data is a remote code execution vulnerability — the format is Turing-complete.', isCorrect: true },
        { id: 'c', text: 'Pickle is deprecated', isCorrect: false },
        { id: 'd', text: 'They are functionally identical', isCorrect: false },
      ],
      explanation: 'Pickle is fast and preserves every Python type — sets, tuples, datetimes, custom classes, even functions. But it\'s a deserialization vector: crafted pickle bytes can run arbitrary Python on `loads`. Rule: pickle stays inside a trust boundary (your own processes, your own disk). JSON (or MessagePack / Protocol Buffers) crosses boundaries (network, user upload, API). Libraries like Celery default to JSON for this reason.',
      hints: [
        'pickle = Python types, internal only, never untrusted input',
        'JSON = text, universal, safe to deserialize',
        'Cross-language / cross-trust → JSON / protobuf / msgpack',
      ],
      tags: ['pickle', 'json', 'security'],
      concepts: ['py-json-serialization', 'py-security-primitives'],
    },
  {
      id: 'py-ser-dataclass-json',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define an `Item` dataclass with a string `name` and float `price`. Build `items = [Item("pen", 1.5), Item("pad", 2.0)]`. Use the `dataclasses` helper that converts a dataclass instance to a dict, combined with `json.dumps`, to serialise the list of items. Print the resulting JSON string (expect `[{"name": "pen", "price": 1.5}, {"name": "pad", "price": 2.0}]`).',
      starterCode: `from dataclasses import dataclass, asdict
import json
`,
      testCases: [
        {
          input: 'dataclass → dict → json',
          expectedOutput: '[{"name": "pen", "price": 1.5}, {"name": "pad", "price": 2.0}]',
          description: 'asdict + json.dumps is the standard pattern',
        },
      ],
      solution: `from dataclasses import dataclass, asdict
import json

@dataclass
class Item:
    name: str
    price: float

items = [Item("pen", 1.5), Item("pad", 2.0)]
print(json.dumps([asdict(x) for x in items]))`,
      explanation: 'Dataclasses don\'t ship with a `.to_json()` method — `asdict` is the bridge. For typed round-trips use pydantic (`model_dump_json` / `model_validate_json`). For very custom output, implement a `JSONEncoder` subclass or a `.to_dict()` method on the class. `asdict` recursively walks nested dataclasses/lists/dicts, so composite structures serialise cleanly.',
      hints: [
        'asdict(x) = dict representation of a dataclass',
        'For typed round-trips with validation → pydantic',
        'asdict walks nested dataclasses automatically',
      ],
      tags: ['json', 'dataclass', 'asdict', 'serialization'],
      concepts: ['py-json-serialization', 'py-dataclass-defaults'],
    },
  {
      id: 'py-json-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      question: 'Which Python types does `json.dumps` handle natively?',
      options: [
        { id: 'a', text: 'Only str and int', isCorrect: false },
        { id: 'b', text: 'dict, list, tuple (as array), str, int, float, bool, None. Sets, bytes, datetimes, Decimals, and custom classes are NOT serialisable without a custom encoder or conversion.', isCorrect: true },
        { id: 'c', text: 'Every Python object', isCorrect: false },
        { id: 'd', text: 'Only types that inherit from `json.Serializable`', isCorrect: false },
      ],
      explanation: 'JSON maps to a fixed set of primitives: object (dict with string keys), array (list/tuple), string, number, boolean, null. Python sets, datetimes, Decimals, UUIDs, and bytes all fail with `TypeError: Object of type X is not JSON serializable`. Fix with `default=` callback or a custom `JSONEncoder`. Dict keys MUST be strings in JSON — non-string keys get coerced via `str()`.',
      hints: [
        'Supported: dict, list, tuple, str, int, float, bool, None',
        'Not supported: set, bytes, datetime, Decimal, custom classes',
        'JSON dict keys are always strings',
      ],
      tags: ['json', 'serialization', 'basics'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-json-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Round-trip a Python dict through JSON. Start with `data = {"name": "Alice", "age": 30, "tags": ["admin", "beta"]}`. Serialise with `json.dumps(data)` and assign to `s`. Deserialise with `json.loads(s)` and assign to `back`. Print `s` and print `back == data` (expect `True`).',
      starterCode: `import json
  `,
      testCases: [
        {
          input: 'dumps then loads',
          expectedOutput: '{"name": "Alice", "age": 30, "tags": ["admin", "beta"]}\nTrue',
          description: 'round-trip preserves simple types',
        },
      ],
      solution: `import json

data = {"name": "Alice", "age": 30, "tags": ["admin", "beta"]}
s = json.dumps(data)
print(s)

back = json.loads(s)
print(back == data)`,
      explanation: '`dumps` → string, `loads` → Python object. The round-trip is lossy for tuples (become lists) and non-string dict keys (become strings). For pretty-printed output use `json.dumps(data, indent=2)`. For reading/writing files: `json.dump(obj, fh)` / `json.load(fh)` (without the "s").',
      hints: [
        'dumps / loads = string; dump / load = file',
        'Tuples become lists on round-trip',
        'Use indent=2 for pretty-printed output',
      ],
      tags: ['json', 'dumps', 'loads', 'round-trip'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-json-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Serialise a value containing a `datetime` using the `default=` callback of `json.dumps`. Build a dict bound to `data` with a single key "created" whose value is a `datetime.datetime` for 2025-01-15 at 14:30 in UTC (use `datetime.timezone.utc` for tzinfo). Call `json.dumps` on `data`, passing a `default=` callable that returns the ISO-format string when the input is a `datetime.datetime` and otherwise returns None. Print the resulting JSON string — expect `{"created": "2025-01-15T14:30:00+00:00"}`.',
      starterCode: `import json
import datetime
`,
      testCases: [
        {
          input: 'datetime via default callback',
          expectedOutput: '{"created": "2025-01-15T14:30:00+00:00"}',
          description: 'default= is called for unsupported types',
        },
      ],
      solution: `import json
import datetime

data = {"created": datetime.datetime(2025, 1, 15, 14, 30, tzinfo=datetime.timezone.utc)}
result = json.dumps(data, default=lambda o: o.isoformat() if isinstance(o, datetime.datetime) else None)
print(result)`,
      explanation: '`default=callback` is invoked for any value the encoder does not know how to serialise. Return a JSON-serialisable value (string, dict, number, etc.) or raise TypeError to fall through. For more types than one, subclass `json.JSONEncoder` and override `default(self, obj)`. The common pattern in APIs is a single encoder handling datetime, UUID, Decimal, dataclass, Path.',
      hints: [
        'default= runs for any type json does not handle',
        'Return a JSON-serialisable value (string / dict / number)',
        'For many types, subclass json.JSONEncoder and override default',
      ],
      tags: ['json', 'default', 'datetime', 'encoder'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-jsonencoder-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the class a custom encoder subclasses, the method it overrides, and the kwarg that applies it to dumps.',
      template: `import json

class UpperEncoder(json.___):
    def ___(self, obj):
        if isinstance(obj, set):
            return list(obj)
        return super().default(obj)

print(json.dumps({"tags": {"a"}}, ___=UpperEncoder))`,
      blanks: ['JSONEncoder', 'default', 'cls'],
      solution:
        'import json\n\nclass UpperEncoder(json.JSONEncoder):\n    def default(self, obj):\n        if isinstance(obj, set):\n            return list(obj)\n        return super().default(obj)\n\nprint(json.dumps({"tags": {"a"}}, cls=UpperEncoder))',
      explanation:
        'A custom encoder subclasses json.JSONEncoder and overrides default(self, obj) — called for any value the base encoder cannot handle. Apply it with json.dumps(data, cls=YourEncoder). Always fall back to super().default(obj) for the TypeError on genuinely unhandled types.',
      hints: ['Subclass JSONEncoder; override default(); pass cls= to dumps.'],
      tags: ['json', 'JSONEncoder', 'custom-encoder', 'subclass'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-json-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Subclass `json.JSONEncoder` as `SafeEncoder` to handle both `datetime` and `set` values. Override the `default` method so that when the incoming object is a `datetime.datetime` it returns that object\'s ISO-format string, when it is a `set` it returns the set converted to a list, and for anything else it delegates to the parent `default` (which raises TypeError). Build a dict whose "when" key holds a `datetime.datetime` for 2025-01-01 UTC and whose "tags" key holds the set of "a" and "b", then dump it via `json.dumps` using `cls=SafeEncoder` and print the output (tag order may vary — that is fine).',
      starterCode: `import json
import datetime
`,
      testCases: [
        {
          input: 'custom encoder',
          expectedOutput: '{"when": "2025-01-01T00:00:00+00:00", "tags": [...]}',
          description: 'Handles multiple extra types via cls=',
        },
      ],
      solution: `import json
import datetime

class SafeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        if isinstance(obj, set):
            return list(obj)
        return super().default(obj)

data = {"when": datetime.datetime(2025, 1, 1, tzinfo=datetime.timezone.utc), "tags": {"a", "b"}}
print(json.dumps(data, cls=SafeEncoder))`,
      explanation: 'A custom encoder is the scalable pattern when you have many non-JSON types. Register one per common need (datetime, Decimal, UUID, Path, dataclass, Enum). Calling `super().default(obj)` preserves the useful TypeError for anything you did not handle, which is better than silently returning None.',
      hints: [
        'Override default(self, obj); branch by isinstance',
        'Always end with super().default(obj) for the error path',
        'Use json.dumps(data, cls=YourEncoder) to apply it',
      ],
      tags: ['json', 'JSONEncoder', 'custom-encoder', 'subclass'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble a round-trip: serialize a dict to a JSON string, parse it back to a Python object, then print one value. Use the STRING functions (not the file ones).',
      correctOrder: [
        'import json',
        'data = {"name": "alice", "age": 30}',
        'text = json.dumps(data)',
        'restored = json.loads(text)',
        'print(restored["name"])',
      ],
      distractorLines: [
        'text = json.dump(data)',
        'restored = json.load(text)',
      ],
      solution:
        'import json\ndata = {"name": "alice", "age": 30}\ntext = json.dumps(data)\nrestored = json.loads(text)\nprint(restored["name"])',
      explanation:
        'The "s" suffix means string: dumps(obj) → str, loads(str) → obj. The no-"s" forms dump(obj, fp) / load(fp) work with file objects and take a file argument — calling them here would fail. Mnemonic: dumpS / loadS handle Strings.',
      hints: ['dumps → string out, loads → object in. The "s" = string.'],
      tags: ['serialization', 'json', 'dumps', 'loads'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble code that writes a dict straight to the file `data.json` as JSON, using the file-oriented json function inside a with-block.',
      correctOrder: [
        'import json',
        'with open("data.json", "w") as f:',
        '    json.dump({"x": 1}, f)',
      ],
      distractorLines: [
        '    json.dumps({"x": 1}, f)',
        '    f.write(json.dump({"x": 1}))',
      ],
      solution:
        'import json\nwith open("data.json", "w") as f:\n    json.dump({"x": 1}, f)',
      explanation:
        'json.dump(obj, fp) writes directly to an open file object — note no "s". json.dumps returns a string and takes no file argument, so json.dumps(obj, f) is wrong. The with-block guarantees the file is closed afterwards.',
      hints: ['dump (no "s") takes the object AND the file object.'],
      tags: ['serialization', 'json', 'dump', 'file'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-serialization-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SERIALIZATION,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble code that tries to parse an invalid JSON string and prints `invalid json` when parsing fails. Catch the specific json error class.',
      correctOrder: [
        'import json',
        'try:',
        '    json.loads("{bad}")',
        'except json.JSONDecodeError:',
        '    print("invalid json")',
      ],
      distractorLines: [
        'except json.DecodeError:',
        'except JSONDecodeError:',
      ],
      solution:
        'import json\ntry:\n    json.loads("{bad}")\nexcept json.JSONDecodeError:\n    print("invalid json")',
      explanation:
        'Malformed JSON raises json.JSONDecodeError (a subclass of ValueError). The name lives on the json module (json.JSONDecodeError) — there is no json.DecodeError, and the bare JSONDecodeError is not in scope unless separately imported.',
      hints: ['The exception is json.JSONDecodeError — full name, on the json module.'],
      tags: ['serialization', 'json', 'JSONDecodeError'],
      concepts: ['py-json-serialization'],
    },
];
