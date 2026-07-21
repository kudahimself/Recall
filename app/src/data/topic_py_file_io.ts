/**
 * Topic.PY_FILE_IO — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendGapQuestions.ts (6), pyFileIOPredictOutput.ts (7), pythonEssentialsQuestions.ts (3)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_file_io_questions: Question[] = [
  {
      id: 'py-io-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Read the entire contents of "data.txt" into a variable "content" using a context manager.',
      starterCode: `# Read file\n`,
      testCases: [{ input: 'data.txt', expectedOutput: 'with open("data.txt") as f: content = f.read()', description: 'Should read file with context manager' }],
      solution: `with open("data.txt", "r") as f:\n    content = f.read()`,
      explanation: 'with open() is the Pythonic way — it auto-closes the file. "r" is the default mode (read text). Other modes: "w" (write, truncates), "a" (append), "rb"/"wb" (binary). f.read() returns the entire file as a string.',
      hints: ['with open() auto-closes', '"r" for read (default)', 'f.read() gets entire content'],
      tieredHints: {
        apiSignature: 'open(file, mode="r") -> TextIOWrapper',
        skeleton: `____ open("data.txt", "____") as f:
    content = f.____()`,
      },
      tags: ['file', 'read', 'context-manager', 'python'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-io-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write the string "Hello, World!" to a file "output.txt". If the file exists, overwrite it.',
      starterCode: `# Write to file\n`,
      testCases: [{ input: 'write string', expectedOutput: 'with open("output.txt", "w") as f: f.write(...)', description: 'Should write to file' }],
      solution: `with open("output.txt", "w") as f:\n    f.write("Hello, World!")`,
      explanation: '"w" mode creates the file if it doesn\'t exist, or truncates (empties) it if it does. Use "a" mode to append without truncating. f.write() writes a string. f.writelines() writes a list of strings.',
      hints: ['"w" overwrites, "a" appends', 'f.write() for strings', 'f.writelines() for lists'],
      tieredHints: {
        apiSignature: 'open(file, mode="r") -> TextIOWrapper',
        skeleton: `____ open("output.txt", "____") as f:
    f.____("____")`,
      },
      tags: ['file', 'write', 'context-manager', 'python'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-io-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Read a CSV file "employees.csv" and print each row as a dictionary using the csv module (DictReader).',
      starterCode: `import csv\n\n`,
      testCases: [{ input: 'CSV file', expectedOutput: 'csv.DictReader with context manager', description: 'Should read CSV as dicts' }],
      solution: `import csv\n\nwith open("employees.csv", "r") as f:\n    reader = csv.DictReader(f)\n    for row in reader:\n        print(row)`,
      explanation: 'csv.DictReader uses the first row as headers and returns each row as an OrderedDict. row["name"] accesses fields by column name. csv.reader returns lists instead. csv.DictWriter writes dicts to CSV.',
      hints: ['DictReader uses header row as keys', 'Iterate over reader for rows', 'Each row is a dictionary'],
      tieredHints: {
        apiSignature: 'csv.DictReader(f, fieldnames=None, restkey=None, restval=None)',
        skeleton: `import csv

with open("employees.csv", "____") as f:
    reader = csv.____(f)
    ____ row ____ reader:
        print(____)`,
      },
      tags: ['csv', 'DictReader', 'file', 'python'],
      concepts: ['py-file-io-modes'],
    },
  {
      id: 'py-io-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Read a JSON file "config.json" into a Python dict, modify the "debug" key to True, and write it back to the file with 2-space indentation.',
      starterCode: `import json\n\n`,
      testCases: [{ input: 'JSON file', expectedOutput: 'json.load, modify, json.dump with indent', description: 'Should read/modify/write JSON' }],
      solution: `import json\n\nwith open("config.json", "r") as f:\n    config = json.load(f)\n\nconfig["debug"] = True\n\nwith open("config.json", "w") as f:\n    json.dump(config, f, indent=2)`,
      explanation: 'json.load(file) reads JSON into Python objects (dict/list). json.dump(data, file) writes Python objects as JSON. indent=2 formats with 2-space indentation. json.loads/json.dumps work with strings instead of files.',
      hints: ['json.load(file) reads, json.dump(data, file) writes', 'indent=2 for pretty printing', 'loads/dumps for strings, load/dump for files'],
      tieredHints: {
        apiSignature: 'json.dump(obj, fp, indent=None, sort_keys=False)',
        skeleton: `import json

with open("config.json", "r") as f:
    config = json.____(f)

config["____"] = ____

with open("config.json", "____") as f:
    json.____(config, f, ____=2)`,
      },
      tags: ['json', 'load', 'dump', 'file', 'python'],
      concepts: ['py-json-serialization'],
    },
  {
      id: 'py-io-5',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use pathlib to: create a Path to "data/reports", check if it exists, create it if not (including parents), and list all .csv files in it.',
      starterCode: `from pathlib import Path\n\n`,
      testCases: [{ input: 'pathlib operations', expectedOutput: 'Path(), exists(), mkdir(parents=True), glob("*.csv")', description: 'Should use pathlib' }],
      solution: `from pathlib import Path\n\nreports_dir = Path("data/reports")\n\nif not reports_dir.exists():\n    reports_dir.mkdir(parents=True, exist_ok=True)\n\ncsv_files = list(reports_dir.glob("*.csv"))`,
      explanation: 'pathlib is the modern way to handle file paths (replaces os.path). Path objects support / operator: Path("data") / "file.txt". mkdir(parents=True) creates parent dirs. glob() finds files matching a pattern. exist_ok=True prevents errors if dir exists.',
      hints: ['Path() creates path objects', 'mkdir(parents=True) creates parent dirs', 'glob("*.csv") finds matching files'],
      tieredHints: {
        apiSignature: 'Path.mkdir(mode=0o777, parents=False, exist_ok=False)',
        skeleton: `from pathlib import Path

reports_dir = ____("data/reports")

if not reports_dir.____():
    reports_dir.____(parents=____, exist_ok=____)

csv_files = list(reports_dir.____("*.csv"))`,
      },
      tags: ['pathlib', 'file', 'directory', 'python'],
      concepts: ['py-pathlib', 'py-file-io-modes'],
    },
  {
      id: 'py-io-6',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Read a file "log.txt" line by line and print only lines that contain the word "ERROR".',
      starterCode: `# Filter lines\n`,
      testCases: [{ input: 'log file', expectedOutput: 'iterate over file, check "ERROR" in line', description: 'Should filter lines' }],
      solution: `with open("log.txt", "r") as f:\n    for line in f:\n        if "ERROR" in line:\n            print(line.strip())`,
      explanation: 'Iterating over a file object reads one line at a time — memory efficient for large files (unlike f.read() which loads everything). strip() removes trailing newline. "in" checks for substring presence.',
      hints: ['for line in file iterates line by line', 'Memory efficient for large files', 'strip() removes trailing whitespace/newlines'],
      tieredHints: {
        apiSignature: 'str.strip(chars=None) -> str',
        skeleton: `with open("log.txt", "r") as f:
    ____ line ____ f:
        ____ "ERROR" ____ line:
            print(line.____())`,
      },
      tags: ['file', 'iterate', 'filter', 'python'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'py-file-io-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assume "data.txt" contains "line1\\nline2\\nline3". What does this code print?',
      code: `with open("data.txt") as f:
      print(f.read())`,
      expectedOutput: `line1
line2
line3`,
      explanation:
        'f.read() reads the ENTIRE file as a single string, including embedded newlines. The newlines render as line breaks when printed.',
      hints: ['read() reads everything; newlines are preserved.'],
      tags: ['file-io', 'read'],
      concepts: ['py-file-io-modes'],
    },
  {
      id: 'py-file-io-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assume "data.txt" contains "line1\\nline2\\n". What does this code print?',
      code: `with open("data.txt") as f:
      print(repr(f.readline()))
      print(repr(f.readline()))
      print(repr(f.readline()))`,
      expectedOutput: `'line1\\n'
'line2\\n'
''`,
      explanation:
        'readline() returns ONE line including the trailing \\n. After consuming both lines, the next readline returns "" (empty string) — the EOF signal. Use repr() to see whitespace clearly.',
      hints: ['readline includes \\n; empty string at EOF.'],
      tags: ['file-io', 'readline', 'EOF'],
      concepts: ['py-file-io-modes'],
    },
  {
      id: 'py-file-io-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assume "data.txt" contains "a\\nb\\nc\\n". What does this code print?',
      code: `with open("data.txt") as f:
      print(f.readlines())`,
      expectedOutput: `['a\\n', 'b\\n', 'c\\n']`,
      explanation:
        'readlines() returns a LIST of strings, each ending in \\n (the trailing newline is preserved). For large files, iterating the file directly (`for line in f`) is more memory-efficient.',
      hints: ['readlines = list of lines; each keeps its \\n.'],
      tags: ['file-io', 'readlines'],
      concepts: ['py-file-io-modes'],
    },
  {
      id: 'py-file-io-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assume "data.txt" contains "AAA". What does the FILE contain after this code runs?',
      code: `with open("data.txt", "w") as f:
    f.write("BBB")
with open("data.txt") as f:
    print(f.read())`,
      expectedOutput: `BBB`,
      explanation:
        'Mode "w" TRUNCATES the file to zero bytes BEFORE writing. So opening with "w" wipes "AAA"; only "BBB" remains. Use mode "a" (append) to preserve existing content.',
      hints: ['"w" truncates; "a" appends.'],
      tags: ['file-io', 'write-mode', 'truncate'],
      concepts: ['py-file-io-modes', 'dj-templates'],
    },
  {
      id: 'py-file-io-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assume "data.txt" contains "AAA". What does the FILE contain after this code runs?',
      code: `with open("data.txt", "a") as f:
    f.write("BBB")
with open("data.txt") as f:
    print(f.read())`,
      expectedOutput: `AAABBB`,
      explanation:
        'Mode "a" appends — file pointer starts at the end. Writes go after the existing content. No newline is automatically inserted between the old and new content.',
      hints: ['append mode preserves existing content.'],
      tags: ['file-io', 'append-mode'],
      concepts: ['py-file-io-modes'],
    },
  {
      id: 'py-file-io-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assume "data.txt" contains "hello". What does this code print?',
      code: `with open("data.txt") as f:
    a = f.read()
    b = f.read()
print(repr(a))
print(repr(b))`,
      expectedOutput: `'hello'
''`,
      explanation:
        'A file has a position cursor. The first read() consumes everything and moves the cursor to EOF. The second read() returns "" because there\'s nothing left. To re-read, use f.seek(0) to reset the cursor.',
      hints: ['File has a position cursor; read() consumes from there to EOF.'],
      tags: ['file-io', 'cursor', 'seek'],
      concepts: ['py-file-io-modes'],
    },
  {
      id: 'py-file-io-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assume "data.txt" contains "alpha\\nbeta\\ngamma\\n". What does this code print?',
      code: `with open("data.txt") as f:
    for i, line in enumerate(f):
        if i == 1:
            break
    rest = f.read()
print(repr(rest))`,
      expectedOutput: `'gamma\\n'`,
      explanation:
        'Iterating a file is incremental — each `for line in f` reads up to the next \\n. After breaking at i=1 (the second line, "beta"), the cursor is at the start of "gamma". f.read() then reads from there to EOF — just "gamma\\n".',
      hints: ['File iteration leaves the cursor where you stopped; read() picks up there.'],
      tags: ['file-io', 'iteration', 'cursor'],
      concepts: ['py-file-io-modes', 'py-control-flow'],
    },
  {
      id: 'pe1-fileio-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      question: 'What is the safest way to open a file in Python?',
      options: [
        { id: 'a', text: '`f = open("file.txt")` — always works fine', isCorrect: false },
        { id: 'b', text: '`with open("file.txt") as f:` — using a context manager', isCorrect: true },
        { id: 'c', text: '`f = file.open("file.txt")` — using the file object', isCorrect: false },
        { id: 'd', text: '`import file; file.read("file.txt")`', isCorrect: false },
      ],
      explanation: 'Using `with open(...) as f:` is the safest way. The `with` statement (context manager) automatically closes the file when the block ends — even if an error occurs. Without `with`, you must manually call `f.close()`, and forgetting it can cause resource leaks or data corruption.',
      hints: [
        'The `with` statement handles cleanup automatically',
        'It closes the file even if an exception occurs',
      ],
      tags: ['file-io', 'with', 'context-manager', 'open', 'basics'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'pe1-fileio-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      question: 'What do the file open modes `"r"`, `"w"`, and `"a"` mean?',
      options: [
        { id: 'a', text: '`"r"` = read, `"w"` = write (overwrites), `"a"` = append (adds to end)', isCorrect: true },
        { id: 'b', text: '`"r"` = read, `"w"` = write (appends), `"a"` = all modes combined', isCorrect: false },
        { id: 'c', text: '`"r"` = remove, `"w"` = write, `"a"` = append', isCorrect: false },
        { id: 'd', text: '`"r"` = read-only, `"w"` = write-only, `"a"` = admin mode', isCorrect: false },
      ],
      explanation: 'File modes: `"r"` = read only (default, file must exist), `"w"` = write (creates or **overwrites** the file), `"a"` = append (adds to end, creates if doesn\'t exist), `"r+"` = read and write. For binary files, add `"b"`: `"rb"`, `"wb"`. If you open with `"w"` and the file has content, it\'s deleted!',
      hints: [
        '`"w"` is destructive — it overwrites existing content',
        '`"a"` is safe for adding to existing files',
      ],
      tags: ['file-io', 'open', 'modes', 'read', 'write', 'append'],
      concepts: ['py-file-io-modes', 'py-list-aliasing'],
    },
  {
      id: 'pe1-fileio-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FILE_IO,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write code that: (1) writes three lines to a file called `notes.txt`, (2) reads the file back and prints its contents. Use `with open(...)` for both operations.',
      starterCode: `# Step 1: Open "notes.txt" in write mode using a context manager
# Write three lines ("Line one\\n", "Line two\\n", "Line three\\n") to the file

# Step 2: Open "notes.txt" in read mode using a context manager
# Read the file contents and print them
`,
      testCases: [
        {
          input: '',
          expectedOutput: 'Line one\nLine two\nLine three\n',
          description: 'Should write then read the file contents',
        },
      ],
      solution: `lines = ["Line one\\n", "Line two\\n", "Line three\\n"]

with open("notes.txt", "w") as f:
    f.writelines(lines)

with open("notes.txt", "r") as f:
    print(f.read())`,
      explanation: 'Two separate `with` blocks handle writing then reading. `f.writelines(lines)` writes a list of strings. `f.read()` reads the entire file as one string. Alternative: `f.write("text")` for single strings, `f.readlines()` for a list of lines, or `for line in f:` to iterate line by line.',
      hints: [
        'Open with `"w"` mode to write, `"r"` mode to read',
        'Use `f.writelines(lines)` to write a list of strings',
      ],
      tieredHints: {
        apiSignature: 'file.writelines(lines) -> None',
        skeleton: `____ = ["____", "____", "____"]

with ____("notes.txt", "____") as f:
    f.____(lines)

with open("notes.txt", "____") as f:
    print(f.____())`,
      },
      tags: ['file-io', 'write', 'read', 'with', 'writelines'],
      concepts: ['py-file-io-modes', 'py-context-manager-protocol'],
    },
];
