/**
 * Topic.PY_PACKAGING — all question types for this topic.
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

export const py_packaging_questions: Question[] = [
  {
      id: 'py-packaging-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PACKAGING,
      course: Course.BACKEND,
      question: 'Why use a virtual environment (venv) per project instead of installing everything into the system Python?',
      options: [
        { id: 'a', text: 'A venv compiles the installed packages for your machine, so code inside it runs faster', isCorrect: false },
        { id: 'b', text: 'Each venv has its own installed packages, so two projects can use different Django versions', isCorrect: true },
        { id: 'c', text: 'A venv is a full copy of Python and the OS libraries, so it works like a small container', isCorrect: false },
        { id: 'd', text: 'A package installed in one venv is shared by every project, so each is downloaded only once', isCorrect: false },
      ],
      explanation: 'A venv is just a folder with its own `site-packages` (and a link to an existing interpreter), so Project A can depend on `django==3.2` while Project B uses `django==5.0`, and the system Python that OS tools rely on stays untouched. It does not make code faster, it is not a container (the OS and the interpreter are shared), and packages installed in it are visible only to that environment. Every modern Python workflow uses isolated environments: `python -m venv .venv && source .venv/bin/activate` at minimum, or a tool that manages them for you (`poetry env use`, `uv venv`, `pipenv`, conda). Never `pip install` into system Python on macOS/Linux - PEP 668 now actively refuses on many distros. On Windows the conflict is less visible but just as real.',
      hints: [
        'python -m venv .venv; source .venv/bin/activate',
        'Per-project isolation of dependencies',
        'Modern distros block system pip installs (PEP 668)',
      ],
      tags: ['packaging', 'venv', 'virtualenv'],
      concepts: ['py-packaging-tools'],
    },
  {
      id: 'py-packaging-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PACKAGING,
      course: Course.BACKEND,
      question: 'What is `pyproject.toml` and why has it replaced `setup.py` and `requirements.txt` in modern Python projects?',
      options: [
        { id: 'a', text: 'A settings file for `venv` that lists which folders and interpreter the environment uses', isCorrect: false },
        { id: 'b', text: 'One standard, declarative file for metadata, dependencies, build backend and tool settings', isCorrect: true },
        { id: 'c', text: 'A lockfile that freezes the exact version of every installed package for repeatable installs', isCorrect: false },
        { id: 'd', text: 'A file needed only to publish on PyPI; applications still list dependencies in `setup.py`', isCorrect: false },
      ],
      explanation: '`pyproject.toml` (PEP 518/517/621) replaces `setup.py` (executable code, with security and reproducibility issues), `setup.cfg` and scattered `requirements*.txt` files; Poetry, Hatch, uv, Flit and setuptools all read it. It is not a lockfile (it holds the ranges you accept, while `uv.lock` or `poetry.lock` holds exact versions), it does not configure `venv`, and applications use it too, not only published libraries. PEP 621 standardised the `[project]` table: `name`, `version`, `dependencies`, `requires-python`, `authors`, `scripts` (entry points). PEP 517/518 standardised the build backend declaration. Benefits: one file, declarative, tool-agnostic, no executable setup.py. Put tool config (ruff, mypy, pytest, coverage) in `[tool.*]` sections. The `requirements.txt` pattern is still fine for Docker layers, but not for source-of-truth.',
      hints: [
        '[project] table - PEP 621 metadata',
        '[build-system] - PEP 517 backend declaration',
        '[tool.<name>] - per-tool config (ruff, mypy, etc.)',
      ],
      tags: ['packaging', 'pyproject', 'PEP-621'],
      concepts: ['py-packaging-tools'],
    },
  {
      id: 'py-packaging-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PACKAGING,
      course: Course.BACKEND,
      question: 'You want to develop a library while another project uses it. How do you set it up so that changes to the library are picked up immediately in the consumer without reinstalling?',
      options: [
        { id: 'a', text: 'Copy the library\'s source folder into the consumer project, so imports read it from there', isCorrect: false },
        { id: 'b', text: 'Run `pip install -e path/to/library`, so the consumer imports the library\'s source files directly', isCorrect: true },
        { id: 'c', text: 'Run `pip install path/to/library` once; pip links to the folder, so later edits show up', isCorrect: false },
        { id: 'd', text: 'Run `pip install --upgrade path/to/library`, which watches the folder and reinstalls on save', isCorrect: false },
      ],
      explanation: '`pip install -e .` (inside the library) or `pip install -e ../mylib` (inside the consumer) does an editable install: pip adds a `.pth` file pointing at the library source, so imports load the live files. A plain `pip install` copies the files into `site-packages` at that moment, so later edits are not seen, and `--upgrade` only reinstalls when you run it again; it watches nothing. Copying the folder into the consumer makes a second copy that drifts from the real library. The library must have a valid `pyproject.toml` (or `setup.py`). Changes to `.py` files are live; changes to metadata, entry_points, or package layout still need `pip install -e .` again. This is the standard monorepo / multi-repo local-dev pattern.',
      hints: [
        'pip install -e path/to/library',
        'Editable = live-reload Python source, no reinstall per change',
        'Still need reinstall for metadata / entry_point changes',
      ],
      tags: ['packaging', 'pip', 'editable-install'],
      concepts: ['py-packaging-tools'],
    },
  {
      id: 'py-packaging-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PACKAGING,
      course: Course.BACKEND,
      question: 'What is `uv` and why is it getting adopted quickly?',
      options: [
        { id: 'a', text: 'A Python interpreter rewritten in Rust that runs your code much faster than CPython', isCorrect: false },
        { id: 'b', text: 'One very fast tool that installs packages and manages venvs, lockfiles and Python versions', isCorrect: true },
        { id: 'c', text: 'An async web server that runs FastAPI and other ASGI apps in production', isCorrect: false },
        { id: 'd', text: 'A linter and formatter that replaces black and flake8 with a single fast command', isCorrect: false },
      ],
      explanation: '`uv` (from Astral, makers of Ruff) is written in Rust and is often 10-100x faster than pip at resolving and installing. It replaces most of the ecosystem\'s fragmented tooling (pip, pip-tools, virtualenv, much of poetry) with one fast binary, but it does not run your code faster: your program still runs on CPython. Do not confuse it with uvicorn (the ASGI web server) or Ruff (Astral\'s linter and formatter). Commands: `uv venv`, `uv pip install`, `uv sync`, `uv add`, `uv run`, `uv python install 3.13`. Lockfile is `uv.lock`. Still interoperates with `pyproject.toml`. If you\'re starting a new project in 2024/2025, `uv` is the low-risk default. Poetry is still fine if you\'re on it already.',
      hints: [
        'uv pip install, uv venv, uv sync - one binary replaces most tools',
        'Lockfile: uv.lock; manages interpreter versions too',
        'Rust-based → 10-100× faster than pip',
      ],
      tags: ['packaging', 'uv', 'pip', 'modern'],
      concepts: ['py-modern-syntax'],
    },
  {
      id: 'py-packaging-5',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PACKAGING,
      course: Course.BACKEND,
      question: 'What is the difference between pinning dependencies in `pyproject.toml` vs in a lockfile (`poetry.lock` / `uv.lock` / `requirements.txt` with hashes)?',
      options: [
        { id: 'a', text: 'Both pin exact versions; the lockfile is a cached copy that pip reads faster on install', isCorrect: false },
        { id: 'b', text: '`pyproject.toml` states accepted ranges; the lockfile records the exact version of every dependency', isCorrect: true },
        { id: 'c', text: '`pyproject.toml` pins exact direct versions; the lockfile lists the ranges sub-dependencies accept', isCorrect: false },
        { id: 'd', text: 'The lockfile holds only test and dev tools, while `pyproject.toml` holds runtime dependencies', isCorrect: false },
      ],
      explanation: '`pyproject.toml` declares ranges ("works with `django>=4.2,<5.0`"), the contract for anyone installing your code. The lockfile pins the EXACT resolved version of every dependency, including transitive ones, usually with hashes, so every install gets the same set; it is not a faster copy, it does not hold ranges, and it covers runtime dependencies, not just dev tools. App: you want the EXACT same versions in CI as in prod - commit the lockfile. Library: you want callers to have flexibility - declare ranges, don\'t ship a lockfile (it can still exist locally to aid your own development). `pip install -r requirements.txt` is fine but can drift if you don\'t freeze transitive deps; modern lockfiles (`poetry.lock`, `uv.lock`) always capture the full graph with hashes.',
      hints: [
        'pyproject = ranges (contract); lockfile = exact versions (install plan)',
        'Commit lockfile for apps; often not for libs',
        'Lockfiles include transitive deps and hashes for reproducibility',
      ],
      tags: ['packaging', 'lockfile', 'versioning'],
      concepts: ['py-packaging-tools'],
    },
  {
      id: 'py-packaging-6',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_PACKAGING,
      course: Course.BACKEND,
      question: 'Your `pyproject.toml` has `[project.scripts]` with `mytool = "mytool.cli:main"`. What does this give you after `pip install`?',
      options: [
        { id: 'a', text: 'Nothing on its own; `python -m mytool` reads the table to find which `main` to call', isCorrect: false },
        { id: 'b', text: 'A `mytool` command that imports `mytool.cli` and calls its `main()` function', isCorrect: true },
        { id: 'c', text: 'A `mytool` command that runs `mytool/cli.py` as a script, so its `__main__` block runs', isCorrect: false },
        { id: 'd', text: 'A `mytool` command that works only while the project folder is the current directory', isCorrect: false },
      ],
      explanation: 'Entry points are how Python packaging creates shell commands; every pip-installable CLI (ruff, black, mypy, django-admin) declares one. When pip installs your package, it generates a thin launcher script in the environment\'s `bin/` (or `Scripts\\`) directory, which is on PATH while that environment is active, from any folder. That launcher imports `mytool.cli` as a module and calls `main()` directly, so an `if __name__ == "__main__":` block in cli.py does not run. `python -m mytool` is a separate mechanism that runs the package\'s `__main__.py` and ignores `[project.scripts]`. Also used for plugin discovery (e.g. pytest plugins register under `[project.entry-points."pytest11"]`). No `__main__.py` hackery needed.',
      hints: [
        '[project.scripts] key-name = "module.submod:callable"',
        'pip install creates the shell-callable script',
        'Also enables plugin systems via entry_points groups',
      ],
      tags: ['packaging', 'entry-points', 'scripts', 'CLI'],
      concepts: ['py-packaging-tools', 'py-cli-tools'],
    },
{
      id: 'py-packaging-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_PACKAGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print? Type the two printed lines.',
      code: `import tomllib

text = """
[project]
name = "recall-tool"
dependencies = ["requests>=2.31"]

[project.scripts]
rt = "recall_tool.cli:main"
"""
cfg = tomllib.loads(text)
print(list(cfg["project"]))
print(cfg["project"]["scripts"]["rt"])`,
      expectedOutput: `['name', 'dependencies', 'scripts']
recall_tool.cli:main`,
      explanation:
        '`[project.scripts]` is a table nested inside `[project]`, so `scripts` shows up as a key of `cfg["project"]`, after the plain keys written above it. Its entry `rt` maps the command name to the `module:function` that the installed command runs.',
      hints: ['A dotted table header nests inside its parent table.'],
      tags: ['packaging', 'pyproject', 'toml', 'entry-points'],
      concepts: ['py-packaging-tools'],
    },
];
