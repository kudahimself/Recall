/**
 * Topic.PY_DATETIME_PATHS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pyDatetimePathsPredictOutput.ts (8), pythonMasteryTier1Questions.ts (7)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_datetime_paths_questions: Question[] = [
  {
      id: 'py-datetime-paths-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from datetime import date, timedelta

d = date(2024, 1, 31)
print(d + timedelta(days=1))`,
      expectedOutput: `2024-02-01`,
      explanation:
        'Adding a timedelta normalizes across month/year boundaries automatically. Jan 31 + 1 day = Feb 1. The default str (isoformat) prints YYYY-MM-DD.',
      hints: ['timedelta arithmetic handles month rollover.'],
      tags: ['datetime', 'timedelta'],
      concepts: ['py-datetime-handling'],
    },
  {
      id: 'py-datetime-paths-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from datetime import date

a = date(2024, 1, 1)
b = date(2024, 12, 31)
print((b - a).days)`,
      expectedOutput: `365`,
      explanation:
        'Subtracting two dates returns a timedelta. .days gives the day delta. 2024 is a leap year (Jan 1 → Dec 31 is 365 days; Dec 31 → Jan 1 next year would be 366).',
      hints: ['Date subtraction yields timedelta. 2024 is a leap year.'],
      tags: ['datetime', 'timedelta', 'leap-year'],
      concepts: ['py-datetime-handling'],
    },
  {
      id: 'py-datetime-paths-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from datetime import datetime, timezone

a = datetime(2024, 1, 1, tzinfo=timezone.utc)
b = datetime(2024, 1, 1)
try:
    print(a - b)
except TypeError:
    print("naive vs aware")`,
      expectedOutput: `naive vs aware`,
      explanation:
        'Subtracting an aware datetime (with tzinfo) from a naive datetime (without) raises TypeError — Python refuses to mix the two. Common bug source. Always use aware datetimes (UTC where possible).',
      hints: ['Naive + aware = TypeError; pick one and stick with it.'],
      tags: ['datetime', 'timezone'],
      concepts: ['py-datetime-handling'],
    },
  {
      id: 'py-datetime-paths-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from datetime import datetime

s = "2024-01-15T10:30:00"
dt = datetime.fromisoformat(s)
print(dt.year)
print(dt.hour)`,
      expectedOutput: `2024
10`,
      explanation:
        'fromisoformat parses an ISO 8601 string into a datetime. Components are accessible as attributes: .year, .month, .day, .hour, .minute, .second, .microsecond.',
      hints: ['fromisoformat parses; datetime exposes attributes for each component.'],
      tags: ['datetime', 'fromisoformat'],
      concepts: ['py-datetime-handling'],
    },
  {
      id: 'py-datetime-paths-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from pathlib import Path

p = Path("/home/user/data/file.txt")
print(p.name)
print(p.stem)
print(p.suffix)
print(p.parent)`,
      expectedOutput: `file.txt
file
.txt
/home/user/data`,
      explanation:
        'pathlib.Path attributes: .name (last component with extension), .stem (without extension), .suffix (the extension WITH leading dot), .parent (everything up to the last component).',
      hints: ['name vs stem: name has the extension; stem does not.'],
      tags: ['pathlib', 'attributes'],
      concepts: ['py-pathlib'],
    },
  {
      id: 'py-datetime-paths-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from pathlib import Path

p = Path("data") / "subdir" / "file.txt"
print(p)
print(p.parts)`,
      expectedOutput: `data/subdir/file.txt
('data', 'subdir', 'file.txt')`,
      explanation:
        'The / operator joins paths. .parts returns a tuple of components. Note: on Windows the printed path would use \\\\ instead of /, but the .parts tuple is the same.',
      hints: ['/ joins; .parts splits.'],
      tags: ['pathlib', 'joinpath'],
      concepts: ['py-pathlib'],
    },
  {
      id: 'py-datetime-paths-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from pathlib import Path

p = Path("file.txt")
new_p = p.with_suffix(".json")
print(new_p)
print(p)`,
      expectedOutput: `file.json
file.txt`,
      explanation:
        'with_suffix returns a NEW Path with the extension replaced. Path objects are immutable — original p is unchanged. Other "with_*" methods: with_name, with_stem.',
      hints: ['Paths are immutable; with_suffix returns a new Path.'],
      tags: ['pathlib', 'with_suffix'],
      concepts: ['py-pathlib'],
    },
  {
      id: 'py-datetime-paths-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from datetime import timedelta

td = timedelta(days=2, hours=5)
print(td.total_seconds())`,
      expectedOutput: `190800.0`,
      explanation:
        'total_seconds returns the timedelta in fractional seconds. 2 days = 172800s, 5 hours = 18000s. Total: 190800.0 (float — even when the answer is whole). The .seconds attribute is different — it returns ONLY the seconds component (0-86399), not the total.',
      hints: ['total_seconds() != .seconds. total_seconds is the full delta as float.'],
      tags: ['datetime', 'total_seconds'],
      concepts: ['py-datetime-handling'],
    },
  {
      id: 'py-datetime-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      question: 'What is the difference between a "naive" and an "aware" `datetime` object?',
      options: [
        { id: 'a', text: 'There is no difference', isCorrect: false },
        { id: 'b', text: 'A naive datetime has no `tzinfo` attached — it represents a wall-clock time with no timezone. An aware datetime carries a `tzinfo` (usually via `zoneinfo.ZoneInfo`) and represents a specific instant in UTC-anchored time.', isCorrect: true },
        { id: 'c', text: 'Naive is faster; aware is slower but more accurate', isCorrect: false },
        { id: 'd', text: 'Naive is for dates only; aware is for dates with times', isCorrect: false },
      ],
      explanation: 'Naive: `datetime.now()` → no tzinfo → ambiguous across timezones and DST. Aware: `datetime.now(ZoneInfo("Europe/Dublin"))` → unambiguous. In a backend you want ALL persisted datetimes to be aware (usually UTC). Mixing naive and aware in arithmetic raises `TypeError`. Use `zoneinfo.ZoneInfo` (3.9+) instead of `pytz`.',
      hints: [
        'Naive = no tzinfo; aware = has tzinfo',
        'In 3.9+, use zoneinfo.ZoneInfo (not pytz)',
        'Mixing naive + aware in arithmetic raises TypeError',
      ],
      tags: ['datetime', 'timezone', 'zoneinfo', 'basics'],
      concepts: ['py-datetime-handling'],
    },
  {
      id: 'py-datetime-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a timezone-AWARE `datetime` representing `2025-01-15 14:30:00` in UTC — use the built-in UTC tzinfo constant from the `datetime` module (no third-party dependencies needed). Print the instance formatted as an ISO-8601 string with offset (expect `2025-01-15T14:30:00+00:00`).',
      starterCode: `import datetime
  `,
      testCases: [
        {
          input: 'UTC datetime ISO format',
          expectedOutput: '2025-01-15T14:30:00+00:00',
          description: 'isoformat() on aware datetime includes offset',
        },
      ],
      solution: `import datetime

dt = datetime.datetime(2025, 1, 15, 14, 30, tzinfo=datetime.timezone.utc)
print(dt.isoformat())`,
      explanation: '`datetime.timezone.utc` is the simplest way to get a UTC tzinfo without needing `zoneinfo`. `.isoformat()` produces RFC 3339-compatible strings with offset — the standard format for APIs and databases. Parse back with `datetime.fromisoformat(s)` (3.11+ handles a wider variety of inputs).',
      hints: [
        'datetime.timezone.utc is a built-in tzinfo with no dependencies',
        '.isoformat() returns the ISO-8601 / RFC-3339 string',
        'Parse back with datetime.fromisoformat(s)',
      ],
      tieredHints: {
        apiSignature: 'datetime.datetime(year, month, day, hour=0, minute=0, second=0, tzinfo=None) -> datetime',
        skeleton: `import datetime

dt = datetime.____(2025, 1, 15, 14, 30, ____=datetime.____.____)
print(dt.____())`,
      },
      tags: ['datetime', 'timezone', 'isoformat', 'utc'],
      concepts: ['py-datetime-handling'],
    },
  {
      id: 'py-datetime-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a UTC-aware `datetime` `utc` for `2025-03-15 12:00:00`. Then convert the same instant to two different IANA time zones — `"Europe/Dublin"` and `"Asia/Tokyo"` — using the 3.9+ stdlib timezone database. Print each conversion as an ISO-8601 string. Dublin in March is UTC+0 (GMT); Tokyo is UTC+9 year-round. Expected output: `2025-03-15T12:00:00+00:00` then `2025-03-15T21:00:00+09:00`.',
      starterCode: `import datetime
from zoneinfo import ZoneInfo
`,
      testCases: [
        {
          input: 'zoneinfo conversion',
          expectedOutput: '2025-03-15T12:00:00+00:00\n2025-03-15T21:00:00+09:00',
          description: 'astimezone produces the same instant in a different zone',
        },
      ],
      solution: `import datetime
from zoneinfo import ZoneInfo

utc = datetime.datetime(2025, 3, 15, 12, 0, tzinfo=datetime.timezone.utc)
print(utc.astimezone(ZoneInfo("Europe/Dublin")).isoformat())
print(utc.astimezone(ZoneInfo("Asia/Tokyo")).isoformat())`,
      explanation: '`astimezone(tz)` returns the same absolute instant rendered in a new timezone — wall-clock changes, UTC moment does not. `zoneinfo.ZoneInfo` reads the IANA tz database (`America/New_York`, `Europe/London`, etc.) and handles DST automatically. This is the canonical way to handle timezones in modern Python — no `pytz` needed.',
      hints: [
        'ZoneInfo("Region/City") uses the IANA database names',
        'astimezone changes the representation, not the instant',
        'Always start from UTC and convert at display boundary',
      ],
      tieredHints: {
        apiSignature: 'datetime.astimezone(tz=None) -> datetime',
        skeleton: `import datetime
from zoneinfo import ZoneInfo

utc = datetime.____(2025, 3, 15, 12, 0, ____=datetime.____.____)
print(utc.____(ZoneInfo("____")).____())
print(utc.____(ZoneInfo("____")).____())`,
      },
      tags: ['datetime', 'zoneinfo', 'astimezone', 'timezone'],
      concepts: ['py-datetime-handling'],
    },
  {
      id: 'py-datetime-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build two naive datetimes: `start` at `2025-01-01 09:00` and `end` at `2025-01-01 17:30`. Compute the duration between them by subtracting one from the other (the result is a `timedelta`) and assign it to `delta`. Print `delta` (expect `8:30:00`), then print the duration in total seconds as a float (expect `30600.0`).',
      starterCode: `import datetime
  `,
      testCases: [
        {
          input: 'timedelta arithmetic',
          expectedOutput: '8:30:00\n30600.0',
          description: 'subtracting datetimes yields a timedelta',
        },
      ],
      solution: `import datetime

start = datetime.datetime(2025, 1, 1, 9, 0)
end = datetime.datetime(2025, 1, 1, 17, 30)

delta = end - start
print(delta)
print(delta.total_seconds())`,
      explanation: 'Subtracting two datetimes gives a `timedelta`. Useful attributes: `.days`, `.seconds`, `.microseconds`, and `.total_seconds()` (float). You can construct one directly: `timedelta(hours=2, minutes=30)`. Add/subtract timedeltas to/from datetimes to shift in time. Avoid mixing naive with aware — both sides must match.',
      hints: [
        'end - start returns a timedelta',
        '.total_seconds() gives float seconds',
        'timedelta(hours=2, minutes=30) to build one directly',
      ],
      tieredHints: {
        apiSignature: 'timedelta.total_seconds() -> float',
        skeleton: `import datetime

start = datetime.____(2025, 1, 1, 9, 0)
end = datetime.____(2025, 1, 1, 17, 30)

delta = end ____ start
print(delta)
print(delta.____())`,
      },
      tags: ['datetime', 'timedelta', 'arithmetic'],
      concepts: ['py-datetime-handling', 'py-arithmetic-ops'],
    },
  {
      id: 'py-datetime-strftime',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Parse the string `"2025-01-15 14:30"` into a `datetime` instance using the classmethod that takes a string + a format directive. Use the directive `"%Y-%m-%d %H:%M"` matching year-month-day followed by hour:minute. Bind the result to `dt` and print it (expect `2025-01-15 14:30:00`). Then format the SAME `dt` back into a DIFFERENT shape — day/month/year with slashes (directive `"%d/%m/%Y"`) — using the instance method that formats a datetime to a string. Print the result (expect `15/01/2025`).',
      starterCode: `import datetime
  `,
      testCases: [
        {
          input: 'strptime then strftime',
          expectedOutput: '2025-01-15 14:30:00\n15/01/2025',
          description: 'parse with strptime, reformat with strftime',
        },
      ],
      solution: `import datetime

dt = datetime.datetime.strptime("2025-01-15 14:30", "%Y-%m-%d %H:%M")
print(dt)
print(dt.strftime("%d/%m/%Y"))`,
      explanation:
        '`strptime` (string-parse time) and `strftime` (string-format time) are the two workhorses for datetime I/O. Directives: `%Y` = 4-digit year, `%m` = zero-padded month, `%d` = zero-padded day, `%H` = 24h hour, `%M` = minute, `%S` = second, `%z` = timezone offset like `+0000`. Mismatched format strings raise `ValueError` on parse. For the modern ISO-8601 case prefer `datetime.fromisoformat(s)` / `dt.isoformat()` — strftime shines when the format is non-standard.',
      hints: [
        'strptime parses, strftime formats — both use the same directive codes',
        'Common: %Y-%m-%d, %H:%M:%S, %z for timezone offset',
        'For ISO-8601 specifically, fromisoformat / isoformat are faster and cleaner',
      ],
      tieredHints: {
        apiSignature: 'datetime.strptime(date_string, format) -> datetime',
        skeleton: `import datetime

dt = datetime.____.____("2025-01-15 14:30", "____")
print(dt)
print(dt.____("____"))`,
      },
      tags: ['datetime', 'strftime', 'strptime', 'parsing', 'formatting'],
      concepts: ['py-datetime-handling'],
    },
  {
      id: 'py-paths-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a path `p` by combining the three segments `"/var/log"`, `"app"`, and `"server.log"` using `pathlib.Path`\'s `/` join operator. Print the string form of the path (expect `/var/log/app/server.log` on POSIX). Then print three attributes of the path: the final component (expect `server.log`), the file extension (expect `.log`), and the parent directory (expect `/var/log/app`).',
      starterCode: `from pathlib import Path
  `,
      testCases: [
        {
          input: 'pathlib joining and inspection',
          expectedOutput: '/var/log/app/server.log\nserver.log\n.log\n/var/log/app',
          description: 'Path attributes expose parts of the path',
        },
      ],
      solution: `from pathlib import Path

p = Path("/var/log") / "app" / "server.log"
print(str(p))
print(p.name)
print(p.suffix)
print(p.parent)`,
      explanation: '`pathlib.Path` treats the filesystem path as an object with operators. `/` joins segments (correct on any OS), `.name` is the final component, `.suffix` is the extension, `.parent` is everything above. Replaces the older `os.path.join` / `os.path.basename` / `os.path.dirname` combo with one consistent API. Always prefer `Path` over string manipulation.',
      hints: [
        'Path("...") / "sub" / "file" to compose',
        '.name / .suffix / .parent are attributes, not methods',
        'str(path) if you need a plain string',
      ],
      tieredHints: {
        apiSignature: 'pathlib.Path(*pathsegments) -> Path',
        skeleton: `from pathlib import Path

p = Path("/var/log") ____ "app" ____ "server.log"
print(____(p))
print(p.____)
print(p.____)
print(p.____)`,
      },
      tags: ['pathlib', 'Path', 'paths', 'basics'],
      concepts: ['py-pathlib'],
    },
  {
      id: 'py-paths-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a path `p` for the file `"greeting.txt"` using `pathlib.Path`. Using pathlib\'s one-shot writing helper, write the string `"hello world"` into the file. Then read the file back with pathlib\'s one-shot reading helper and print the result.',
      starterCode: `from pathlib import Path
  `,
      testCases: [
        {
          input: 'write_text and read_text',
          expectedOutput: 'hello world',
          description: 'pathlib has one-shot read/write helpers',
        },
      ],
      solution: `from pathlib import Path

p = Path("greeting.txt")
p.write_text("hello world")
print(p.read_text())`,
      explanation: '`Path.write_text(s)` and `Path.read_text()` (plus `.write_bytes` / `.read_bytes`) are the one-shot readers/writers for small files — they handle `open`/`close` internally. For large files or streaming, fall back to `with p.open("r") as f: ...`. `write_text` truncates by default; use `open("a")` to append.',
      hints: [
        '.write_text / .read_text handle open/close for you',
        '.write_bytes / .read_bytes for binary',
        'For large files use `with p.open("r") as f` streaming',
      ],
      tieredHints: {
        apiSignature: 'Path.write_text(data, encoding=None, errors=None, newline=None) -> int',
        skeleton: `from pathlib import Path

p = ____("greeting.txt")
p.____("____")
print(p.____())`,
      },
      tags: ['pathlib', 'read_text', 'write_text', 'io'],
      concepts: ['py-pathlib'],
    },
  {
      id: 'py-datetime-paths-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble code that parses the string `2024-01-15` into a datetime using the format `%Y-%m-%d`, then prints it reformatted as `%d/%m/%Y`.',
      correctOrder: [
        'from datetime import datetime',
        'dt = datetime.strptime("2024-01-15", "%Y-%m-%d")',
        'print(dt.strftime("%d/%m/%Y"))',
      ],
      distractorLines: [
        'dt = datetime.strftime("2024-01-15", "%Y-%m-%d")',
        'print(dt.strptime("%d/%m/%Y"))',
      ],
      solution:
        'from datetime import datetime\ndt = datetime.strptime("2024-01-15", "%Y-%m-%d")\nprint(dt.strftime("%d/%m/%Y"))',
      explanation:
        'strptime PARSES a string into a datetime (p = parse). strftime FORMATS a datetime into a string (f = format). They are easy to swap — remember "p for parse, f for format".',
      hints: ['parse first (strptime), then format (strftime).'],
      tags: ['datetime', 'strptime', 'strftime', 'parsing', 'formatting'],
      concepts: ['py-datetime-handling'],
    },
  {
      id: 'py-datetime-paths-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble code that builds a timezone-aware datetime for 2024-06-01 12:00 in `Europe/London`, then prints its tzinfo. Order the imports `datetime` first, then `zoneinfo`.',
      correctOrder: [
        'from datetime import datetime',
        'from zoneinfo import ZoneInfo',
        'dt = datetime(2024, 6, 1, 12, 0, tzinfo=ZoneInfo("Europe/London"))',
        'print(dt.tzinfo)',
      ],
      distractorLines: [
        'dt = datetime(2024, 6, 1, 12, 0, tz=ZoneInfo("Europe/London"))',
        'dt = datetime(2024, 6, 1, 12, 0).astimezone("Europe/London")',
      ],
      solution:
        'from datetime import datetime\nfrom zoneinfo import ZoneInfo\ndt = datetime(2024, 6, 1, 12, 0, tzinfo=ZoneInfo("Europe/London"))\nprint(dt.tzinfo)',
      explanation:
        'The constructor kwarg is tzinfo (not tz), and it takes a tzinfo object like ZoneInfo("Europe/London") — a naive datetime has tzinfo=None. astimezone CONVERTS an already-aware datetime to another zone and needs a tzinfo object, not a string.',
      hints: ['The keyword is tzinfo=, and it takes a ZoneInfo(...) object.'],
      tags: ['datetime', 'zoneinfo', 'timezone'],
      concepts: ['py-datetime-handling'],
    },
  {
      id: 'py-datetime-paths-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble code that builds the path `data/config.json` using the `/` operator on a Path, then prints the file contents using the one-shot text reader.',
      correctOrder: [
        'from pathlib import Path',
        'path = Path("data") / "config.json"',
        'print(path.read_text())',
      ],
      distractorLines: [
        'path = Path("data").join("config.json")',
        'print(path.read())',
      ],
      solution:
        'from pathlib import Path\npath = Path("data") / "config.json"\nprint(path.read_text())',
      explanation:
        'pathlib overloads the `/` operator to join path segments (Path("data") / "config.json"). There is no Path.join (that is os.path.join / str.join) — the method form is .joinpath(). Reading is .read_text(), not .read().',
      hints: ['/ joins Path segments; .read_text() reads the whole file.'],
      tags: ['pathlib', 'Path', 'read_text'],
      concepts: ['py-pathlib'],
    },
  {
      id: 'py-datetime-paths-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the classmethod that parses an ISO-8601 string into a datetime.',
      template: `from datetime import datetime

dt = datetime.___("2024-01-15T10:30:00")`,
      blanks: ['fromisoformat'],
      solution:
        'from datetime import datetime\n\ndt = datetime.fromisoformat("2024-01-15T10:30:00")',
      explanation:
        'fromisoformat parses the ISO-8601 layout (the same format isoformat() produces) without you spelling out a strptime format string. From Python 3.11 it also accepts a trailing "Z" and most offsets.',
      hints: ['"from" + "iso" + "format".'],
      tags: ['datetime', 'fromisoformat'],
      concepts: ['py-datetime-handling'],
    },
  {
      id: 'py-datetime-paths-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the timedelta method that returns the whole duration as a float number of seconds.',
      template: `from datetime import timedelta

td = timedelta(hours=2)
print(td.___())`,
      blanks: ['total_seconds'],
      solution:
        'from datetime import timedelta\n\ntd = timedelta(hours=2)\nprint(td.total_seconds())',
      explanation:
        'total_seconds() collapses days + seconds + microseconds into one float (7200.0 here). Do NOT use .seconds — that is only the seconds-within-the-day component and silently drops the days part.',
      hints: ['"total" + "_seconds"; not the .seconds attribute.'],
      tags: ['datetime', 'timedelta', 'total_seconds'],
      concepts: ['py-datetime-handling'],
    },
  {
      id: 'py-datetime-paths-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATETIME_PATHS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the Path method that returns a copy of the path with the file extension replaced.',
      template: `from pathlib import Path

p = Path("report.txt")
print(p.___(".csv"))`,
      blanks: ['with_suffix'],
      solution:
        'from pathlib import Path\n\np = Path("report.txt")\nprint(p.with_suffix(".csv"))',
      explanation:
        'with_suffix(".csv") returns a NEW Path with the suffix swapped (report.csv) — Path objects are immutable, so it does not mutate p. Sibling helpers: with_name (swap the whole filename) and with_stem (swap the name, keep the suffix).',
      hints: ['"with" + "_suffix"; the argument includes the leading dot.'],
      tags: ['pathlib', 'with_suffix'],
      concepts: ['py-pathlib'],
    },
];
