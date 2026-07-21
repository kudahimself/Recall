/**
 * Topic.PY_SHELL_OS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pythonMasteryTier2Questions.ts (6)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_shell_os_questions: Question[] = [
  {
      id: 'py-shell-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      question: 'Why should you avoid `subprocess.run("ls " + user_input, shell=True)` and prefer a list-form invocation instead?',
      options: [
        { id: 'a', text: 'List form is faster', isCorrect: false },
        { id: 'b', text: '`shell=True` runs the command through a shell, so any metacharacter in `user_input` (e.g. `"; rm -rf ~"`) is interpreted — classic shell-injection. The list form (`["ls", user_input]`) passes arguments directly to the OS, so `user_input` is treated as a single argument, regardless of its contents.', isCorrect: true },
        { id: 'c', text: 'shell=True is deprecated', isCorrect: false },
        { id: 'd', text: 'List form captures stdout; string form does not', isCorrect: false },
      ],
      explanation: 'This is one of the most common CVEs in Python code. String + shell=True + any user-controlled input = remote code execution. Rules: (1) use a list, (2) avoid shell=True unless you actually need shell features (pipes, redirection, globs); (3) if you MUST use shell=True, use `shlex.quote(user_input)` on every interpolated piece. Modern advice: `subprocess.run(["ls", path], check=True, capture_output=True, text=True)` covers 95% of cases.',
      hints: [
        'shell=True + string interpolation = injection risk',
        'Use list args: subprocess.run(["cmd", "arg1", "arg2"])',
        'If you need shell features, shlex.quote each user input',
      ],
      tags: ['subprocess', 'security', 'shell-injection'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-shell-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Run the command `echo hello` using the `subprocess` module\'s one-shot run function. Pass the command as a LIST (never a string — injection-safe) of `["echo", "hello"]`. Configure four common kwargs: capture stdout/stderr, decode output as text (not bytes), and raise on non-zero exit. Bind the completed-process object to `result`. Print the stripped stdout (expect `hello`) and the return code (expect `0`).',
      starterCode: `import subprocess
  `,
      testCases: [
        {
          input: 'subprocess.run with capture_output=True, text=True',
          expectedOutput: 'hello\n0',
          description: 'capture_output gives .stdout; text=True decodes to str',
        },
      ],
      solution: `import subprocess

result = subprocess.run(
    ["echo", "hello"],
    capture_output=True,
    text=True,
    check=True,
)
print(result.stdout.strip())
print(result.returncode)`,
      explanation: 'The four keyword args you almost always want with `subprocess.run`: `capture_output=True` (keeps stdout/stderr), `text=True` (decode to str using default encoding — without it you get bytes), `check=True` (raise `CalledProcessError` on non-zero exit), `timeout=N` (seconds). `.stdout` always has a trailing newline from the command — strip it. For pipes and complex flows, use `Popen` directly; for one-shot calls, `run` is the answer.',
      hints: [
        'capture_output=True → access .stdout and .stderr',
        'text=True → get str instead of bytes',
        'check=True → raise CalledProcessError on failure',
      ],
      tieredHints: {
        apiSignature: 'subprocess.run(args, *, stdin=None, input=None, stdout=None, stderr=None, capture_output=False, shell=False, timeout=None, check=False, text=None) -> CompletedProcess',
        skeleton: `import subprocess

result = subprocess.____(
    ["echo", "hello"],
    ____=True,
    ____=True,
    check=True,
)
print(result.stdout.____())
print(result.____)`,
      },
      tags: ['subprocess', 'run', 'capture_output'],
      concepts: ['py-shell-os-interop'],
    },
  {
      id: 'py-shell-calledprocesserror-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the exception subprocess.run(check=True) raises on non-zero exit, and the attribute holding the exit code.',
      template: `import subprocess

try:
    subprocess.run(["false"], check=True)
except subprocess.___ as e:
    print(e.___)`,
      blanks: ['CalledProcessError', 'returncode'],
      solution:
        'import subprocess\n\ntry:\n    subprocess.run(["false"], check=True)\nexcept subprocess.CalledProcessError as e:\n    print(e.returncode)',
      explanation:
        'check=True makes subprocess.run raise CalledProcessError on non-zero exit. The exception carries returncode, cmd, stdout, and stderr — everything you need to report what failed.',
      hints: ['CamelCase exception name; the attribute is the exit code.'],
      tags: ['subprocess', 'CalledProcessError', 'error-handling'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-shell-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Handle a failing subprocess safely. Using the `subprocess` module, run the `false` binary (which always exits with status 1) with stdout/stderr captured, decoded as text, and with the raise-on-failure flag enabled. Wrap the call in a `try/except` that catches the specific exception raised on non-zero exit (not a bare `Exception`). In the except clause, bind the exception to `e` and print `"failed with "` + the exception\'s return-code attribute (expect `failed with 1`).',
      starterCode: `import subprocess
  `,
      testCases: [
        {
          input: 'CalledProcessError handling',
          expectedOutput: 'failed with 1',
          description: 'check=True raises on non-zero exit; exception carries returncode',
        },
      ],
      solution: `import subprocess

try:
    subprocess.run(["false"], check=True, capture_output=True, text=True)
except subprocess.CalledProcessError as e:
    print(f"failed with {e.returncode}")`,
      explanation: '`CalledProcessError` has `returncode`, `cmd`, `stdout`, and `stderr` — great for surfacing what failed. Pair with `timeout=N` in `subprocess.run` and handle `subprocess.TimeoutExpired`. In production, always either `check=True` with exception handling, or `result.check_returncode()` after the fact — silently ignoring exit codes means silently ignoring failure.',
      hints: [
        'check=True → raises subprocess.CalledProcessError on non-zero exit',
        'e.returncode / e.stdout / e.stderr available in the except',
        'Also handle TimeoutExpired when you pass timeout=',
      ],
      tieredHints: {
        apiSignature: 'subprocess.CalledProcessError(returncode, cmd, output=None, stderr=None)',
        skeleton: `import subprocess

try:
    subprocess.run(["false"], ____=True, capture_output=True, text=True)
____ subprocess.____ as e:
    print(f"failed with {e.____}")`,
      },
      tags: ['subprocess', 'CalledProcessError', 'error-handling'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-shell-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a guaranteed-cleaned-up temporary directory using the `tempfile` module\'s context-manager class (the `with`-block form — yields the path as a string, deletes the directory on exit even on exception). Inside the block, build a `pathlib.Path` pointing at a file named `"note.txt"` inside the temp directory, write `"temp data"` to that file using pathlib\'s one-shot write helper, then read it back with the matching read helper and print the result (expect `temp data`).',
      starterCode: `import tempfile
from pathlib import Path
`,
      testCases: [
        {
          input: 'tempfile + pathlib',
          expectedOutput: 'temp data',
          description: 'TemporaryDirectory auto-cleans on __exit__',
        },
      ],
      solution: `import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    p = Path(tmp) / "note.txt"
    p.write_text("temp data")
    print(p.read_text())`,
      explanation: '`tempfile.TemporaryDirectory()` gives you a secure, unique temp dir that is removed (including contents) when the `with` block exits — even on exception. Essential for tests that write to disk without leaking between runs, for download caches, for unpacking archives. Sibling: `tempfile.NamedTemporaryFile()` for a single file. Both pick directories based on `$TMPDIR` / platform defaults; no collision risk.',
      hints: [
        'with tempfile.TemporaryDirectory() as tmp: ...',
        'tmp is a str path; wrap with Path() for pathlib API',
        'Cleanup is guaranteed on __exit__, even on exception',
      ],
      tieredHints: {
        apiSignature: 'tempfile.TemporaryDirectory(suffix=None, prefix=None, dir=None, ignore_cleanup_errors=False)',
        skeleton: `import tempfile
from pathlib import Path

with tempfile.____() as tmp:
    p = Path(tmp) / "note.txt"
    p.____("temp data")
    print(p.____())`,
      },
      tags: ['tempfile', 'TemporaryDirectory', 'pathlib', 'cleanup'],
      concepts: ['py-shell-os-interop', 'py-pathlib'],
    },
  {
      id: 'py-shell-5',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Exercise the high-level filesystem helpers in `shutil`. Inside a temp-directory `with` block (cleaned up automatically), build two `pathlib.Path` objects — `src` pointing at `"a.txt"` inside the temp dir, and `dst` pointing at `"b.txt"` inside the same temp dir. Write the string `"hello"` to `src`. Then use the `shutil` function that copies a file from source to destination (preserving contents). Print the contents of `dst` (expect `hello`). After the block, print whether the total bytes from `shutil`\'s disk-usage helper called on `"/"` is greater than zero (expect `True`).',
      starterCode: `import shutil
import tempfile
from pathlib import Path
`,
      testCases: [
        {
          input: 'shutil.copy + disk_usage',
          expectedOutput: 'hello\nTrue',
          description: 'shutil.copy duplicates a file; disk_usage returns a namedtuple',
        },
      ],
      solution: `import shutil
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    src = Path(tmp) / "a.txt"
    src.write_text("hello")
    dst = Path(tmp) / "b.txt"
    shutil.copy(src, dst)
    print(dst.read_text())

print(shutil.disk_usage("/").total > 0)`,
      explanation: 'shutil is the "high-level file operations" module: `copy` / `copy2` (copy file + metadata), `copytree` (recursive dir copy), `move`, `rmtree` (recursive delete), `disk_usage(path)` (returns `usage(total, used, free)` namedtuple), `which(cmd)` (like shell `which`), `make_archive` / `unpack_archive`. Use it instead of shelling out to `cp`/`mv`/`rm` — safer and cross-platform.',
      hints: [
        'shutil.copy / copytree / move / rmtree for filesystem ops',
        'shutil.disk_usage returns (total, used, free) namedtuple',
        'shutil.which(cmd) finds executables in PATH — avoids shelling out',
      ],
      tieredHints: {
        apiSignature: 'shutil.copy(src, dst, *, follow_symlinks=True)',
        skeleton: `import shutil
import tempfile
from pathlib import Path

with tempfile.____() as tmp:
    src = Path(tmp) / "a.txt"
    src.write_text("hello")
    dst = Path(tmp) / "b.txt"
    ____.____(src, dst)
    print(dst.____())

print(shutil.____("/").____ > 0)`,
      },
      tags: ['shutil', 'filesystem', 'disk_usage'],
      concepts: ['py-shell-os-interop'],
    },
  {
      id: 'py-shell-6',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Read an environment variable with a fallback default and cast the result to int. Using the `os` module\'s environment mapping, read the variable named `"PORT"` with a default of the string `"8000"` (all env-var values are strings — always cast). Convert the result to int and bind it to `port`. Print `port` (expect `8000` when `PORT` is not set).',
      starterCode: `import os
  `,
      testCases: [
        {
          input: 'os.environ.get with default',
          expectedOutput: '8000',
          description: 'Default is a str; wrap with int()',
        },
      ],
      solution: `import os

port = int(os.environ.get("PORT", "8000"))
print(port)`,
      explanation: '`os.environ` is a dict of string → string. `[]` raises `KeyError` on missing; `.get(name, default)` returns the default — use it for optional config. All values are strings — cast to int/bool/float as needed, and beware `bool("False") is True`. For any real config beyond a couple of vars, use `python-dotenv` + pydantic `BaseSettings` (see next unit).',
      hints: [
        'os.environ.get(name, default) avoids KeyError',
        'All values are strings — always cast',
        'bool("False") == True — use an explicit comparison',
      ],
      tieredHints: {
        apiSignature: 'os.environ.get(key, default=None)',
        skeleton: `import os

port = ____(____.____.____("PORT", "8000"))
____(port)`,
      },
      tags: ['os', 'environ', 'env-vars', 'config'],
      concepts: ['py-shell-os-interop'],
    },
  {
      id: 'py-shell-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `print(bool("False"))
print(bool(""))
print(int("8000") + 1)`,
      expectedOutput: `True
False
8001`,
      explanation:
        'Any non-empty string is truthy, so bool("False") is True — the classic env-var trap (os.environ values are always strings). Only the empty string is falsy. To turn "8000" into a number you must cast with int(), which gives 8000, so + 1 is 8001.',
      hints: ['Non-empty strings are truthy; only "" is falsy. Cast strings with int().'],
      tags: ['os', 'env-vars', 'casting', 'bool'],
      concepts: ['py-shell-os-interop'],
    },
  {
      id: 'py-shell-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble an injection-safe subprocess call that runs `echo hi`, captures decoded output, raises on failure, and prints the stripped stdout. Pass the command as a list, not a shell string.',
      correctOrder: [
        'import subprocess',
        'result = subprocess.run(["echo", "hi"], capture_output=True, text=True, check=True)',
        'print(result.stdout.strip())',
      ],
      distractorLines: [
        'result = subprocess.run("echo hi", shell=True)',
        'print(result.output.strip())',
      ],
      solution:
        'import subprocess\nresult = subprocess.run(["echo", "hi"], capture_output=True, text=True, check=True)\nprint(result.stdout.strip())',
      explanation:
        'The list form ["echo", "hi"] passes args straight to the OS — no shell, no injection. A string + shell=True interprets metacharacters and is the classic shell-injection hole. The captured output is result.stdout (there is no .output); capture_output=True + text=True give it to you as a string.',
      hints: ['List args (no shell=True); read result.stdout.'],
      tags: ['subprocess', 'run', 'capture_output'],
      concepts: ['py-shell-os-interop'],
    },
  {
      id: 'py-shell-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble code that creates an auto-cleaned temporary directory, builds a path to `note.txt` inside it, and writes `data` to that file. Order the imports `tempfile` first, then `pathlib`.',
      correctOrder: [
        'import tempfile',
        'from pathlib import Path',
        'with tempfile.TemporaryDirectory() as tmp:',
        '    p = Path(tmp) / "note.txt"',
        '    p.write_text("data")',
      ],
      distractorLines: [
        'with tempfile.TemporaryFile() as tmp:',
        '    p = Path(tmp).join("note.txt")',
      ],
      solution:
        'import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as tmp:\n    p = Path(tmp) / "note.txt"\n    p.write_text("data")',
      explanation:
        'TemporaryDirectory() yields a directory PATH (a str) and deletes the whole tree on exit; TemporaryFile() yields an open file object, not a path, so you cannot build a child path under it. Join path segments with the / operator — Path has no .join method.',
      hints: ['TemporaryDirectory (not TemporaryFile); join with /.'],
      tags: ['tempfile', 'TemporaryDirectory', 'pathlib'],
      concepts: ['py-shell-os-interop'],
    },
  {
      id: 'py-shell-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble code that reads the `PORT` environment variable with a string default of `"8000"`, converts it to an int, and prints it. Use the lookup that does not raise when the variable is unset.',
      correctOrder: [
        'import os',
        'port = int(os.environ.get("PORT", "8000"))',
        'print(port)',
      ],
      distractorLines: [
        'port = int(os.environ["PORT"])',
        'port = int(os.environ.get("PORT"))',
      ],
      solution:
        'import os\nport = int(os.environ.get("PORT", "8000"))\nprint(port)',
      explanation:
        'os.environ.get(name, default) returns the default when the var is missing; os.environ["PORT"] raises KeyError, and .get("PORT") with no default returns None — int(None) then crashes. Env values are strings, so wrap with int() to get a number.',
      hints: ['.get(name, default) avoids KeyError; then int(...) to cast.'],
      tags: ['os', 'environ', 'env-vars'],
      concepts: ['py-shell-os-interop'],
    },
  {
      id: 'py-shell-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the subprocess.run kwarg that keeps stdout and stderr so you can read them off the result.',
      template: `import subprocess

result = subprocess.run(["ls"], ___=True, text=True)
print(result.stdout)`,
      blanks: ['capture_output'],
      solution:
        'import subprocess\n\nresult = subprocess.run(["ls"], capture_output=True, text=True)\nprint(result.stdout)',
      explanation:
        'capture_output=True captures both stdout and stderr onto the CompletedProcess (result.stdout / result.stderr). Without it they go straight to the terminal and result.stdout is None. text=True decodes them to str instead of bytes.',
      hints: ['"capture" + "_output".'],
      tags: ['subprocess', 'capture_output'],
      concepts: ['py-shell-os-interop'],
    },
  {
      id: 'py-shell-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the tempfile class that yields a directory path and deletes it (and its contents) on exit.',
      template: `import tempfile

with tempfile.___() as tmp:
    print(tmp)`,
      blanks: ['TemporaryDirectory'],
      solution:
        'import tempfile\n\nwith tempfile.TemporaryDirectory() as tmp:\n    print(tmp)',
      explanation:
        'TemporaryDirectory() yields a unique directory path (str) and recursively removes it when the with-block exits, even on exception. NamedTemporaryFile() is the single-file sibling; TemporaryFile() yields an open file object rather than a path.',
      hints: ['"Temporary" + "Directory".'],
      tags: ['tempfile', 'TemporaryDirectory'],
      concepts: ['py-shell-os-interop'],
    },
  {
      id: 'py-shell-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the os.environ method that returns a fallback instead of raising when the variable is missing.',
      template: `import os

value = os.environ.___("HOME", "/tmp")`,
      blanks: ['get'],
      solution:
        'import os\n\nvalue = os.environ.get("HOME", "/tmp")',
      explanation:
        'os.environ behaves like a dict: .get(name, default) returns the default for a missing key, while os.environ["X"] raises KeyError. Use .get for optional config. Remember every value is a string — cast as needed.',
      hints: ['The dict method that takes a default: "get".'],
      tags: ['os', 'environ', 'get'],
      concepts: ['py-shell-os-interop'],
    },
  {
      id: 'py-shell-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Copy a file to a new path with shutil, then print the copy\'s contents.',
      correctOrder: [
        'import shutil',
        'from pathlib import Path',
        '',
        'Path("a.txt").write_text("hello")',
        'shutil.copy("a.txt", "b.txt")',
        'print(Path("b.txt").read_text())',
      ],
      distractorLines: [
        'shutil.move("a.txt", "b.txt")',
        'shutil.copytree("a.txt", "b.txt")',
        'Path("a.txt").copy("b.txt")',
      ],
      solution:
        'import shutil\nfrom pathlib import Path\n\nPath("a.txt").write_text("hello")\nshutil.copy("a.txt", "b.txt")\nprint(Path("b.txt").read_text())',
      explanation:
        'shutil.copy(src, dst) duplicates a file, leaving the original in place. move would delete the source; copytree is for whole directory trees (and errors on a plain file); Path has no .copy method — copying lives in shutil, not pathlib.',
      hints: ['shutil.copy duplicates a file; move would remove the source.'],
      tags: ['shutil', 'filesystem', 'copy'],
      concepts: ['py-shell-os-interop'],
    },
  {
      id: 'py-shell-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_SHELL_OS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the shutil helper that copies a file, and the disk_usage field holding total bytes.',
      template: `import shutil

shutil.___("a.txt", "b.txt")
print(shutil.disk_usage("/").___ > 0)`,
      blanks: ['copy', 'total'],
      solution:
        'import shutil\n\nshutil.copy("a.txt", "b.txt")\nprint(shutil.disk_usage("/").total > 0)',
      explanation:
        'shutil.copy duplicates a file. shutil.disk_usage(path) returns a namedtuple usage(total, used, free) — access fields by name, e.g. .total. These high-level helpers replace shelling out to cp / df.',
      hints: ['"copy"; disk_usage returns (total, used, free).'],
      tags: ['shutil', 'filesystem', 'disk_usage'],
      concepts: ['py-shell-os-interop'],
    },
];
