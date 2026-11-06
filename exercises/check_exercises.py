"""Check every exercise against its starter and its reference solution.

For each exercise folder, exercises/<course>/<topic>/, this script:

1. copies the folder to a temporary directory and runs its tests on the starter,
   where every test must fail (a starter that already passes teaches nothing);
2. copies it again, lays the reference solution from exercises/solutions/<course>/<topic>/
   over the starter files, and runs the tests, where every test must pass.

Each copy keeps the <course>/<topic> layout and takes the course folder's shared
modules along (such as exercises/backend/exercise_settings.py, the Django settings).

Working on copies means the learner's own edits are never changed.
A starter the learner has already edited (it differs from git's committed copy)
skips step 1 for that exercise, since a solved starter is meant to pass.

Usage, from anywhere: python exercises/check_exercises.py
Needs Python 3 and the packages in exercises/requirements.txt.
Exits 0 when every exercise checks out, 1 otherwise.
"""
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOLUTIONS = ROOT / "solutions"
IGNORE = shutil.ignore_patterns("__pycache__", ".pytest_cache", "*.pyc")


def exercise_dirs():
    """Every exercises/<course>/<topic>/ folder that holds a README.md."""
    found = []
    for course in sorted(p for p in ROOT.iterdir() if p.is_dir() and p != SOLUTIONS):
        for topic in sorted(p for p in course.iterdir() if p.is_dir()):
            if (topic / "README.md").exists():
                found.append(topic)
    return found


def run_pytest(folder):
    """Run pytest in `folder`; return (exit code, passed count, failed count, output)."""
    env = dict(os.environ, PYTHONDONTWRITEBYTECODE="1")
    result = subprocess.run(
        [sys.executable, "-m", "pytest", "-q", "-p", "no:cacheprovider", "--color=no"],
        cwd=folder, capture_output=True, text=True, env=env, timeout=300,
    )
    out = result.stdout + result.stderr
    summary = out.strip().splitlines()[-1] if out.strip() else ""
    counts = {kind: int(n) for n, kind in re.findall(r"(\d+) (passed|failed|error|errors)", summary)}
    failed = counts.get("failed", 0) + counts.get("error", 0) + counts.get("errors", 0)
    return result.returncode, counts.get("passed", 0), failed, out


def edited_locally(folder):
    """True when a tracked file in the folder differs from git's committed copy."""
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain", "--untracked-files=no", "--", str(folder)],
            cwd=ROOT, capture_output=True, text=True, timeout=60,
        )
    except (OSError, subprocess.SubprocessError):
        return False
    return result.returncode == 0 and result.stdout.strip() != ""


def check(folder):
    """Problems found with one exercise (empty when it checks out)."""
    rel = folder.relative_to(ROOT)
    problems = []
    solution = SOLUTIONS / rel
    if not solution.is_dir():
        return [f"no reference solution at {solution.relative_to(ROOT.parent)}"]
    if not list(folder.glob("test_*.py")):
        return ["no test_*.py file"]
    solution_files = [p for p in solution.rglob("*.py") if "__pycache__" not in p.parts]
    for path in solution_files:
        # A solution may add Django migrations, which the learner makes with makemigrations.
        if "migrations" in path.parts:
            continue
        if not (folder / path.relative_to(solution)).exists():
            problems.append(f"solution file {path.relative_to(solution)} has no starter file to replace")

    with tempfile.TemporaryDirectory() as tmp:
        course = Path(tmp) / folder.parent.name
        course.mkdir()
        for shared in folder.parent.glob("*.py"):
            shutil.copy2(shared, course)
        work = course / folder.name
        if edited_locally(folder):
            print(f"  {rel}: starter edited locally, skipping the starter check")
        else:
            shutil.copytree(folder, work, ignore=IGNORE)
            code, passed, failed, out = run_pytest(work)
            if code != 1 or passed > 0 or failed == 0:
                problems.append(f"on the starter every test should fail, got exit {code}, {passed} passed, {failed} failed\n{out}")
            shutil.rmtree(work)

        shutil.copytree(folder, work, ignore=IGNORE)
        shutil.copytree(solution, work, ignore=IGNORE, dirs_exist_ok=True)
        code, passed, failed, out = run_pytest(work)
        if code != 0 or failed > 0 or passed == 0:
            problems.append(f"on the reference solution every test should pass, got exit {code}, {passed} passed, {failed} failed\n{out}")
    return problems


def main():
    try:
        import pytest  # noqa: F401
    except ImportError:
        print("pytest is not installed for this Python: pip install -r exercises/requirements.txt")
        return 1
    folders = exercise_dirs()
    failures = 0
    for folder in folders:
        problems = check(folder)
        rel = folder.relative_to(ROOT)
        if problems:
            failures += 1
            print(f"FAIL {rel}")
            for p in problems:
                print("  " + p.replace("\n", "\n    "))
        else:
            print(f"ok   {rel}")
    print(f"exercises checked: {len(folders) - failures} pass, {failures} fail")
    return 1 if failures or not folders else 0


if __name__ == "__main__":
    sys.exit(main())
