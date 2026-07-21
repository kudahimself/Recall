/**
 * Topic.PY_CLI — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pyCLIParsons.ts (8), pythonMasteryTier2Questions.ts (6)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_cli_questions: Question[] = [
  {
      id: 'py-cli-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a CLI that takes a single required positional filename argument.',
      correctOrder: [
        'import argparse',
        '',
        'parser = argparse.ArgumentParser()',
        'parser.add_argument("filename")',
        'args = parser.parse_args()',
        'print(args.filename)',
      ],
      distractorLines: [
        'parser.add_argument("--filename")',
        'args = parser.parseArgs()',
        'parser = argparse.Parser()',
      ],
      solution:
        'import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("filename")\nargs = parser.parse_args()\nprint(args.filename)',
      explanation:
        'Names without leading dashes are positional arguments — required by default. With "--filename" the arg becomes optional and addressed via flag. parse_args (snake_case), and the class is ArgumentParser, not Parser.',
      hints: ['No leading dashes → positional.'],
      tags: ['cli', 'argparse', 'positional'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Constrain --mode to one of three valid values; argparse rejects everything else.',
      correctOrder: [
        'import argparse',
        '',
        'parser = argparse.ArgumentParser()',
        'parser.add_argument("--mode", choices=["dev", "staging", "prod"])',
        'args = parser.parse_args()',
        'print(args.mode)',
      ],
      distractorLines: [
        'parser.add_argument("--mode", choice=["dev", "staging", "prod"])',
        'parser.add_argument("--mode", values=["dev", "staging", "prod"])',
        'if args.mode not in ["dev", "staging", "prod"]: raise',
      ],
      solution:
        'import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("--mode", choices=["dev", "staging", "prod"])\nargs = parser.parse_args()\nprint(args.mode)',
      explanation:
        'choices= validates AND auto-formats the help text. The kwarg is `choices` (plural), not `choice` or `values`. Manual post-validation duplicates work argparse already does — and produces an uglier error.',
      hints: ['Plural: "choices".'],
      tags: ['cli', 'argparse', 'choices'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Accept a variable list of files via nargs="+".',
      correctOrder: [
        'import argparse',
        '',
        'parser = argparse.ArgumentParser()',
        'parser.add_argument("files", nargs="+")',
        'args = parser.parse_args()',
        'for f in args.files:',
        '    print(f)',
      ],
      distractorLines: [
        'parser.add_argument("files", nargs="*")',
        'parser.add_argument("files", nargs=1)',
        'parser.add_argument("files", multiple=True)',
      ],
      solution:
        'import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("files", nargs="+")\nargs = parser.parse_args()\nfor f in args.files:\n    print(f)',
      explanation:
        'nargs="+" requires AT LEAST one value (errors if zero). nargs="*" allows zero. nargs=1 forces exactly one BUT wraps it in a list — a common gotcha. Without nargs, a positional takes exactly one and unwraps it.',
      hints: ['nargs="+" — one or more.'],
      tags: ['cli', 'argparse', 'nargs'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Add subcommands "init" and "deploy", each with its own arguments.',
      correctOrder: [
        'import argparse',
        '',
        'parser = argparse.ArgumentParser()',
        'sub = parser.add_subparsers(dest="cmd")',
        '',
        'init = sub.add_parser("init")',
        'init.add_argument("--force", action="store_true")',
        '',
        'deploy = sub.add_parser("deploy")',
        'deploy.add_argument("--env")',
        '',
        'args = parser.parse_args()',
        'print(args.cmd)',
      ],
      distractorLines: [
        'sub = parser.subparsers()',
        'sub.add_command("init")',
        'parser.add_argument("cmd", choices=["init", "deploy"])',
      ],
      solution:
        'import argparse\n\nparser = argparse.ArgumentParser()\nsub = parser.add_subparsers(dest="cmd")\n\ninit = sub.add_parser("init")\ninit.add_argument("--force", action="store_true")\n\ndeploy = sub.add_parser("deploy")\ndeploy.add_argument("--env")\n\nargs = parser.parse_args()\nprint(args.cmd)',
      explanation:
        'add_subparsers returns a special action; .add_parser registers each subcommand. Without dest=, args.cmd is unset — you cannot tell which subcommand was used. Treating subcommands as plain choices forfeits per-subcommand args.',
      hints: ['add_subparsers(dest="...") then .add_parser per command.'],
      tags: ['cli', 'argparse', 'subcommands'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Add a -v / --verbose short+long alias pair.',
      correctOrder: [
        'import argparse',
        '',
        'parser = argparse.ArgumentParser()',
        'parser.add_argument("-v", "--verbose", action="store_true")',
        'args = parser.parse_args()',
        'print(args.verbose)',
      ],
      distractorLines: [
        'parser.add_argument("-v", action="store_true")',
        'parser.add_argument("--verbose", short="-v")',
        'parser.add_argument(["-v", "--verbose"])',
      ],
      solution:
        'import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("-v", "--verbose", action="store_true")\nargs = parser.parse_args()\nprint(args.verbose)',
      explanation:
        'Pass short and long forms as separate positional args to add_argument. The dest is derived from the LONG form (verbose), so args.verbose works regardless of which form the user typed.',
      hints: ['Short and long as separate positional args.'],
      tags: ['cli', 'argparse', 'short-flag'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      question: 'What is the canonical way to load `.env` file variables into `os.environ` in a Python app?',
      options: [
        { id: 'a', text: 'Parse the file manually with `open()` and `split("=")`', isCorrect: false },
        { id: 'b', text: '`python-dotenv` — `from dotenv import load_dotenv; load_dotenv()` at app startup reads `.env` from the working directory (or a specified path) and populates `os.environ` so `os.environ.get(...)` works throughout the app. Make sure `.env` is in `.gitignore`.', isCorrect: true },
        { id: 'c', text: 'There is no way to load them — set them manually in the shell', isCorrect: false },
        { id: 'd', text: 'Set them with `sys.env`', isCorrect: false },
      ],
      explanation: 'The 12-factor pattern: secrets and per-environment config live in `.env` (dev) or real OS env vars (prod/CI). `python-dotenv`\'s `load_dotenv()` bridges `.env` files into `os.environ` transparently. Production should never read a `.env` — it uses real env vars injected by the deployment platform. Pair with pydantic-settings for typed, validated config objects instead of scattering `os.environ.get` calls.',
      hints: [
        'pip install python-dotenv',
        'load_dotenv() at app startup',
        '.env goes in .gitignore — never commit secrets',
      ],
      tags: ['cli', 'dotenv', 'config', '12-factor'],
      concepts: ['py-cli-tools', 'dj-deployment-cicd'],
    },
  {
      id: 'py-cli-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a simple CLI using the `argparse` stdlib module. Create a parser with description `"Greet someone"`, add a required POSITIONAL string argument named `name`, and add an OPTIONAL integer argument with short form `-c` / long form `--count` defaulting to `1`. Instead of reading from `sys.argv`, call the parser\'s parse method with the test arg list `["alice", "-c", "3"]` and bind the namespace to `args`. Print the parsed name (expect `alice`) and count (expect `3`).',
      starterCode: `import argparse
  `,
      testCases: [
        {
          input: 'argparse with positional + optional',
          expectedOutput: 'alice\n3',
          description: 'argparse turns CLI strings into typed attributes',
        },
      ],
      solution: `import argparse

parser = argparse.ArgumentParser(description="Greet someone")
parser.add_argument("name", help="who to greet")
parser.add_argument("-c", "--count", type=int, default=1, help="number of greetings")

args = parser.parse_args(["alice", "-c", "3"])
print(args.name)
print(args.count)`,
      tieredHints: {
        apiSignature: 'parser.add_argument(name_or_flags, type=None, default=None, help=None)',
        skeleton: `import argparse

parser = argparse.____(____=____)  # description="Greet someone"
parser.____(____, ____=____)  # "name", help="who to greet"
parser.____(____, ____, ____=____, ____=____, ____=____)  # "-c", "--count", type=int, default=1, help="number of greetings"

args = parser.____(____)  # ["alice", "-c", "3"]
print(args.____)
print(args.____)`,
      },
      explanation: 'argparse is the stdlib CLI parser. Positional args (no dash prefix) are required by default; optional args (`-c`/`--count`) can have defaults and `type=` coercion. `parser.parse_args()` reads from `sys.argv` — pass a list to parse a specific arg vector (essential for tests). Free bonus: `--help` is auto-generated from your descriptions and help strings.',
      hints: [
        'Positional: `add_argument("name")`',
        'Optional: `add_argument("-c", "--count", type=int, default=1)`',
        'Pass a list to parse_args in tests — defaults to sys.argv',
      ],
      tags: ['cli', 'argparse', 'stdlib'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a git-style CLI with SUBCOMMANDS using `argparse`. Create a top-level parser, then add a subparser GROUP — configure it so the chosen subcommand name is stored in the namespace under the attribute `cmd`, and make selecting a subcommand required. Register two subcommands, `"create"` and `"delete"`, each with its own positional string argument `name`. Parse the test list `["create", "widget"]` and print the chosen command attribute (expect `create`) and the name attribute (expect `widget`).',
      starterCode: `import argparse
  `,
      testCases: [
        {
          input: 'argparse subcommands',
          expectedOutput: 'create\nwidget',
          description: 'Subparsers give git-style CLI structure',
        },
      ],
      solution: `import argparse

parser = argparse.ArgumentParser()
subparsers = parser.add_subparsers(dest="cmd", required=True)

create_p = subparsers.add_parser("create")
create_p.add_argument("name")

delete_p = subparsers.add_parser("delete")
delete_p.add_argument("name")

args = parser.parse_args(["create", "widget"])
print(args.cmd)
print(args.name)`,
      tieredHints: {
        apiSignature: 'parser.add_subparsers(dest=None, required=False); subparsers.add_parser(name)',
        skeleton: `import argparse

parser = argparse.____()
subparsers = parser.____(____=____, ____=____)  # dest="cmd", required=True

create_p = subparsers.____(____)  # "create"
create_p.____(____)  # "name"

delete_p = subparsers.____(____)  # "delete"
delete_p.____(____)  # "name"

args = parser.____(____)  # ["create", "widget"]
print(args.____)
print(args.____)`,
      },
      explanation: 'Subparsers give you "git-style" CLIs: `mytool create <name>`, `mytool delete <name>`. `dest="cmd"` stores the chosen subcommand name in `args.cmd` so you can dispatch on it. `required=True` (3.7+) forces the user to pick one. Each subparser can have its own arguments. For richer CLIs (types, auto-complete, colors) graduate to `click` or `typer`.',
      hints: [
        'parser.add_subparsers(dest="cmd", required=True)',
        'Each subparser has its own add_argument calls',
        'args.cmd holds the chosen subcommand name',
      ],
      tags: ['cli', 'argparse', 'subcommands'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      question: 'Why might you choose `typer` over `argparse` for a new CLI?',
      options: [
        { id: 'a', text: 'No reason — argparse is always better', isCorrect: false },
        { id: 'b', text: '`typer` (by the FastAPI author) builds the CLI from type-annotated Python functions: `def greet(name: str, count: int = 1)` → an auto-generated `--help`, type coercion, validation, shell auto-complete. Built on top of `click`. Ideal when you want a richer UX without the argparse boilerplate.', isCorrect: true },
        { id: 'c', text: 'typer replaces Python — it is a separate language', isCorrect: false },
        { id: 'd', text: 'typer can only run in FastAPI servers', isCorrect: false },
      ],
      explanation: 'typer is to CLIs what FastAPI is to HTTP APIs — generate the boilerplate from type hints. For small tools or repetitive subcommands, the savings are real. `click` (typer\'s foundation) is the old-guard rich CLI library with the same benefits via decorators (`@click.command() @click.option(...)`). `argparse` stays relevant for: small scripts, no-deps constraints, any Python with no third-party deps allowed.',
      hints: [
        'typer derives flags/options/types from your function signature',
        'Built on click; FastAPI-author\'s project',
        'argparse still fine when you cannot add a dependency',
      ],
      tags: ['cli', 'typer', 'click', 'argparse'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-5',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Parse a TOML config file using the Python 3.11+ stdlib `tomllib` module. Assume a file `config.toml` contains a `[app]` table with a string `name = "widget"` and an integer `port = 8080`. Open the file in BINARY mode (tomllib requires bytes, not text) inside a `with` block, parse the handle into a nested-dict `config`, and print the name (expect `widget`) then the port (expect `8080`).',
      starterCode: `import tomllib
  `,
      testCases: [
        {
          input: 'tomllib.load',
          expectedOutput: 'widget\n8080',
          description: 'tomllib parses TOML into nested dicts',
        },
      ],
      solution: `import tomllib

with open("config.toml", "rb") as fh:
    config = tomllib.load(fh)

print(config["app"]["name"])
print(config["app"]["port"])`,
      tieredHints: {
        apiSignature: 'tomllib.load(file_obj) -> dict',
        skeleton: `import ____

with ____(____, ____) as ____:  # "config.toml", "rb"
    config = ____.____(____)

print(config[____][____])  # "app", "name"
print(config[____][____])  # "app", "port"`,
      },
      explanation: 'TOML is the standard Python config format now — `pyproject.toml`, Poetry, Ruff, Pytest all use it. 3.11 ships `tomllib` in stdlib (read-only); for 3.10 and earlier, use `tomli`. For writing, use `tomli-w` or `tomlkit`. Open in BINARY mode (TOML spec requires UTF-8 bytes). Returns plain nested dicts — nothing special to learn.',
      hints: [
        'tomllib.load takes a binary file handle ("rb")',
        'Returns plain nested dicts',
        '3.10 and earlier: `tomli` is the same API',
      ],
      tags: ['cli', 'tomllib', 'config', 'pyproject'],
      concepts: ['py-cli-tools', 'py-packaging-tools'],
    },
  {
      id: 'py-cli-6',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      question: 'In a backend service, which config source should take precedence when multiple are available: env vars, `.env` file, CLI flags, defaults in code?',
      options: [
        { id: 'a', text: 'Defaults in code always win', isCorrect: false },
        { id: 'b', text: '`.env` always wins', isCorrect: false },
        { id: 'c', text: 'CLI flags > environment variables > `.env` file > defaults in code. CLI is the most explicit (user typed it right now), env vars override file values (deployment platforms set them), `.env` is a convenience for dev, defaults are the floor.', isCorrect: true },
        { id: 'd', text: 'Whichever is loaded first', isCorrect: false },
      ],
      explanation: 'This hierarchy is the 12-factor + pragmatic norm: (1) explicit CLI flags override everything for one-off overrides, (2) OS env vars are what your deployment platform (Kubernetes, Heroku, systemd) provides, (3) `.env` fills in the rest in dev, (4) defaults are the safety net. Libraries that get this right: `pydantic-settings`, `dynaconf`, `environs`. All produce a single typed, validated config object.',
      hints: [
        'CLI > ENV > .env > code defaults',
        'pydantic-settings + dotenv is the modern combo',
        'Production never reads .env — uses real env vars',
      ],
      tags: ['cli', 'config', '12-factor', 'precedence'],
      concepts: ['py-cli-tools', 'dj-deployment-cicd'],
    },
  {
      id: 'py-cli-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--verbose", action="store_true")
print(parser.parse_args([]).verbose)
print(parser.parse_args(["--verbose"]).verbose)`,
      expectedOutput: `False
True`,
      explanation:
        'action="store_true" makes a boolean flag: absent → False (the implicit default), present → True. No value is consumed from the command line. Parsing an explicit empty list [] simulates "no args"; ["--verbose"] simulates the flag being passed.',
      hints: ['store_true defaults to False and flips to True only when the flag appears.'],
      tags: ['cli', 'argparse', 'store_true'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--count", type=int, default=1)
args = parser.parse_args(["--count", "5"])
print(args.count + 1)`,
      expectedOutput: `6`,
      explanation:
        'type=int runs int() on the raw string "5", so args.count is the integer 5 and 5 + 1 = 6. Without type=int the value would stay the string "5" and "5" + 1 would raise a TypeError. argv values always arrive as strings until a converter is applied.',
      hints: ['type=int converts "5" to 5 before you use it.'],
      tags: ['cli', 'argparse', 'type'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-parsons-beg-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a CLI with a boolean `--verbose` flag (present → True, absent → False), parse the args, and print the flag. Use the action that stores True when the flag appears.',
      correctOrder: [
        'import argparse',
        'parser = argparse.ArgumentParser()',
        'parser.add_argument("--verbose", action="store_true")',
        'args = parser.parse_args()',
        'print(args.verbose)',
      ],
      distractorLines: [
        'parser.add_argument("--verbose", store_true=True)',
        'parser.add_argument("--verbose", action="store_value")',
      ],
      solution:
        'import argparse\nparser = argparse.ArgumentParser()\nparser.add_argument("--verbose", action="store_true")\nargs = parser.parse_args()\nprint(args.verbose)',
      explanation:
        'A boolean flag is declared with action="store_true" — there is no store_true= keyword, and "store_value" is not a real action. The flag needs no value on the command line; its presence alone sets the attribute to True.',
      hints: ['action="store_true" — it is the action, not a separate keyword.'],
      tags: ['cli', 'argparse', 'store_true'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-parsons-beg-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a CLI with an optional `--count` argument converted to an integer, parse the args, and print count × 2. Pass the int type as the converter.',
      correctOrder: [
        'import argparse',
        'parser = argparse.ArgumentParser()',
        'parser.add_argument("--count", type=int)',
        'args = parser.parse_args()',
        'print(args.count * 2)',
      ],
      distractorLines: [
        'parser.add_argument("--count", type="int")',
        'parser.add_argument("count", type=int)',
      ],
      solution:
        'import argparse\nparser = argparse.ArgumentParser()\nparser.add_argument("--count", type=int)\nargs = parser.parse_args()\nprint(args.count * 2)',
      explanation:
        'type=int passes the int callable (not the string "int") — argparse calls it on the raw value to convert. A name with leading dashes ("--count") is an OPTIONAL argument; dropping the dashes ("count") would make it a required positional, changing the CLI.',
      hints: ['type=int (the callable); "--count" keeps it optional.'],
      tags: ['cli', 'argparse', 'type'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-parsons-beg-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Wrap a CLI in a main() function that runs only when the file is executed directly. main() sets up a positional `name` argument and prints it. Define main() first, then guard the call with the standard entry-point check.',
      correctOrder: [
        'import argparse',
        'def main():',
        '    parser = argparse.ArgumentParser()',
        '    parser.add_argument("name")',
        '    args = parser.parse_args()',
        '    print(args.name)',
        'if __name__ == "__main__":',
        '    main()',
      ],
      distractorLines: [
        'if __name__ == "main":',
        'if __name__ = "__main__":',
      ],
      solution:
        'import argparse\ndef main():\n    parser = argparse.ArgumentParser()\n    parser.add_argument("name")\n    args = parser.parse_args()\n    print(args.name)\nif __name__ == "__main__":\n    main()',
      explanation:
        'The guard is `if __name__ == "__main__":` — the module name is the dunder "__main__" (with underscores), and it is a comparison (==), not an assignment (=). This lets the file be imported without running main(), but still run it when executed directly.',
      hints: ['Dunder "__main__", compared with ==, then call main().'],
      tags: ['cli', '__main__', 'entry-point'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the method that registers a new argument on the parser.',
      template: `import argparse

parser = argparse.ArgumentParser()
parser.___("--name")`,
      blanks: ['add_argument'],
      solution:
        'import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("--name")',
      explanation:
        'add_argument declares one argument (its name, type, default, action, help, etc.). You call it once per argument before parse_args reads the command line.',
      hints: ['"add" + "_argument".'],
      tags: ['cli', 'argparse', 'add_argument'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the action value that turns `--verbose` into a boolean flag (True when present).',
      template: `import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--verbose", action="___")`,
      blanks: ['store_true'],
      solution:
        'import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("--verbose", action="store_true")',
      explanation:
        'action="store_true" stores True when the flag is given and defaults to False otherwise — no value is consumed. Its mirror is "store_false" (default True). Both make the argument a pure on/off switch.',
      hints: ['"store" + "_true".'],
      tags: ['cli', 'argparse', 'store_true'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the method that reads sys.argv and returns the populated namespace.',
      template: `import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--name")
args = parser.___()`,
      blanks: ['parse_args'],
      solution:
        'import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("--name")\nargs = parser.parse_args()',
      explanation:
        'parse_args() (snake_case) reads sys.argv, validates against the declared arguments, and returns a Namespace whose attributes are your argument names (args.name). On bad input it prints usage and exits.',
      hints: ['"parse" + "_args"; snake_case, not parseArgs.'],
      tags: ['cli', 'argparse', 'parse_args'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Read config.toml with the stdlib tomllib (3.11+) and print the app name from the [app] table.',
      correctOrder: [
        'import tomllib',
        '',
        'with open("config.toml", "rb") as fh:',
        '    config = tomllib.load(fh)',
        '',
        'print(config["app"]["name"])',
      ],
      distractorLines: [
        'with open("config.toml") as fh:',
        '    config = tomllib.loads(fh)',
        'import toml',
      ],
      solution:
        'import tomllib\n\nwith open("config.toml", "rb") as fh:\n    config = tomllib.load(fh)\n\nprint(config["app"]["name"])',
      explanation:
        'tomllib.load reads a file handle opened in BINARY mode ("rb") — text mode raises a TypeError. loads (with an s) parses a string, not a handle. tomllib is the 3.11+ stdlib module; the old PyPI package was imported as `toml`.',
      hints: ['Open "rb"; tomllib.load takes the binary handle.'],
      tags: ['cli', 'tomllib', 'config'],
      concepts: ['py-cli-tools', 'py-packaging-tools'],
    },
  {
      id: 'py-cli-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the file mode tomllib requires and the function that parses an open handle.',
      template: `import tomllib

with open("config.toml", "___") as fh:
    config = tomllib.___(fh)

print(config["app"]["name"])`,
      blanks: ['rb', 'load'],
      solution:
        'import tomllib\n\nwith open("config.toml", "rb") as fh:\n    config = tomllib.load(fh)\n\nprint(config["app"]["name"])',
      explanation:
        'tomllib requires the file opened in binary mode ("rb"); text mode raises TypeError. tomllib.load reads a file handle (use tomllib.loads for an in-memory string). It returns plain nested dicts.',
      hints: ['Binary read mode; "load" takes the handle.'],
      tags: ['cli', 'tomllib', 'config'],
      concepts: ['py-cli-tools', 'py-packaging-tools'],
    },
  {
      id: 'py-cli-int-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Add an optional --env argument that is BOTH restricted to the values "dev", "staging", "prod" AND defaults to "dev" when omitted — combine the choices constraint with a default on one argument.',
      correctOrder: [
        'import argparse',
        '',
        'parser = argparse.ArgumentParser()',
        'parser.add_argument("--env", choices=["dev", "staging", "prod"], default="dev")',
        'args = parser.parse_args()',
        'print(args.env)',
      ],
      distractorLines: [
        'parser.add_argument("--env", choices=["dev", "staging", "prod"])',
        'parser.add_argument("--env", default="dev")',
        'parser.add_argument("--env", choices=["dev", "staging", "prod"], default="qa")',
      ],
      solution:
        'import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("--env", choices=["dev", "staging", "prod"], default="dev")\nargs = parser.parse_args()\nprint(args.env)',
      explanation:
        'choices= and default= compose on one argument: choices validates whatever the user passes, while default supplies the value when the flag is absent. The default MUST itself be a member of choices ("qa" raises at parse time). Drop default and an omitted --env yields None; drop choices and an invalid value slips through.',
      hints: ['One add_argument carrying BOTH choices=[...] and default="dev".'],
      tags: ['cli', 'argparse', 'choices', 'default'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-int-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a CLI that accepts ONE OR MORE port numbers as a positional argument, each converted to an integer. Combine nargs="+" (one or more) with type=int so argparse rejects a call with zero ports and hands back real integers. Call the parser\'s parse method with the test list ["8000", "8001", "9000"] and print the SUM of the ports (expect 25001).',
      starterCode: `import argparse
  `,
      testCases: [
        {
          input: 'nargs="+" with type=int',
          expectedOutput: '25001',
          description: 'nargs gathers a list; type=int converts each element',
        },
      ],
      solution: `import argparse

parser = argparse.ArgumentParser()
parser.add_argument("ports", nargs="+", type=int)
args = parser.parse_args(["8000", "8001", "9000"])
print(sum(args.ports))`,
      tieredHints: {
        apiSignature: 'parser.add_argument(name, nargs=None, type=None)',
        skeleton: `import argparse

parser = argparse.____()
parser.____(____, ____=____, ____=____)  # "ports", nargs="+", type=int
args = parser.____(____)  # ["8000", "8001", "9000"]
print(____(args.____))`,
      },
      explanation:
        'nargs="+" collects one or more values into a list (and errors if none are given); type=int is applied to EACH element, so args.ports is [8000, 8001, 9000] — real ints — and sum() works directly. Without type=int you would get ["8000", ...] and sum() would raise a TypeError.',
      hints: [
        'add_argument("ports", nargs="+", type=int)',
        'args.ports is a list of ints — sum() it',
        'Pass the list to parse_args for the test',
      ],
      tags: ['cli', 'argparse', 'nargs', 'type'],
      concepts: ['py-cli-tools'],
    },
  {
      id: 'py-cli-adv-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_CLI,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build the argument parser for a deployment tool with git-style subcommands. Store the chosen subcommand name in an attribute called "cmd" and require the user to pick one. Register a "deploy" subcommand that takes: a required positional service name; an --env option restricted to "staging" or "prod"; an integer --replicas option defaulting to 1; and a boolean --dry-run switch. Parse the test list ["deploy", "api", "--env", "prod", "--replicas", "3", "--dry-run"] and print, each on its own line, the command, the service, the env, the replicas, and the dry-run flag.',
      starterCode: `import argparse
  `,
      testCases: [
        {
          input: 'subcommands + choices + type + store_true',
          expectedOutput: 'deploy\napi\nprod\n3\nTrue',
          description: 'A realistic CLI composing four argparse primitives',
        },
      ],
      solution: `import argparse

parser = argparse.ArgumentParser()
sub = parser.add_subparsers(dest="cmd", required=True)

deploy = sub.add_parser("deploy")
deploy.add_argument("service")
deploy.add_argument("--env", choices=["staging", "prod"])
deploy.add_argument("--replicas", type=int, default=1)
deploy.add_argument("--dry-run", action="store_true")

args = parser.parse_args(["deploy", "api", "--env", "prod", "--replicas", "3", "--dry-run"])
print(args.cmd)
print(args.service)
print(args.env)
print(args.replicas)
print(args.dry_run)`,
      tieredHints: {
        apiSignature: 'subparser.add_argument(name_or_flags, choices=None, type=None, default=None, action=None)',
        skeleton: `import argparse

parser = argparse.____()
sub = parser.____(____=____, ____=____)  # dest="cmd", required=True

deploy = sub.____(____)  # "deploy"
deploy.____(____)  # "service"
deploy.____(____, ____=____)  # "--env", choices=["staging", "prod"]
deploy.____(____, ____=____, ____=____)  # "--replicas", type=int, default=1
deploy.____(____, ____=____)  # "--dry-run", action="store_true"

args = parser.____(____)  # ["deploy", "api", "--env", "prod", "--replicas", "3", "--dry-run"]
print(args.____)
print(args.____)
print(args.____)
print(args.____)
print(args.____)`,
      },
      explanation:
        'A production CLI composes the primitives: add_subparsers(dest="cmd", required=True) records which subcommand ran and forces a choice; the subparser owns its own positional (service) and options. choices validates --env, type=int coerces --replicas (with default 1), and store_true makes --dry-run a flag. Note argparse turns the --dry-run option name into the attribute args.dry_run (dash becomes underscore).',
      hints: [
        'add_subparsers(dest="cmd", required=True), then sub.add_parser("deploy")',
        'Each option reuses a primitive you know: choices=, type=int + default=, action="store_true"',
        '--dry-run is read back as args.dry_run (dash to underscore)',
      ],
      tags: ['cli', 'argparse', 'subcommands', 'choices', 'store_true'],
      concepts: ['py-cli-tools'],
    },
];
