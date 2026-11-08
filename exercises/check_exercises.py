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

A course in BATCHED (databricks) is checked in one pytest run per step instead of one per exercise,
because every run starts a Spark JVM that takes 10 to 20 seconds: all the starters run together,
then all the reference solutions, and each test result is matched back to its exercise folder.

Usage, from anywhere: python exercises/check_exercises.py [course or course/topic ...]
With no argument it checks every course; with names (backend, databricks) or course/topic
folders (databricks/delta_lake_basics) only those.
Needs Python 3 and the packages in exercises/requirements.txt (the databricks exercises also need Java 17+).
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
# Courses whose exercises share one slow-to-start process (a Spark JVM), checked together.
BATCHED = {"databricks"}


def exercise_dirs(courses=()):
    """Every exercises/<course>/<topic>/ folder that holds a README.md (of the named courses, if any)."""
    found = []
    for course in sorted(p for p in ROOT.iterdir() if p.is_dir() and p != SOLUTIONS):
        if courses and course.name not in courses and not any(c.startswith(course.name + "/") for c in courses):
            continue
        for topic in sorted(p for p in course.iterdir() if p.is_dir()):
            wanted = not courses or course.name in courses or f"{course.name}/{topic.name}" in courses
            if wanted and (topic / "README.md").exists():
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
                problems.append(f"on the starter every test should fail, got exit {code}, {passed} passed, {failed} failed\n{out[-3000:]}")
            shutil.rmtree(work)

        shutil.copytree(folder, work, ignore=IGNORE)
        shutil.copytree(solution, work, ignore=IGNORE, dirs_exist_ok=True)
        code, passed, failed, out = run_pytest(work)
        if code != 0 or failed > 0 or passed == 0:
            problems.append(f"on the reference solution every test should pass, got exit {code}, {passed} passed, {failed} failed\n{out[-3000:]}")
    return problems


def run_pytest_batch(course_dir):
    """Run every test under `course_dir` in one pytest run; return {topic: (passed, failed)} and the output."""
    env = dict(os.environ, PYTHONDONTWRITEBYTECODE="1")
    result = subprocess.run(
        [sys.executable, "-m", "pytest", "-q", "-p", "no:cacheprovider", "--color=no", "--tb=short", "-rA", "--continue-on-collection-errors", course_dir.name],
        cwd=course_dir.parent, capture_output=True, text=True, env=env, timeout=900,
    )
    out = result.stdout + result.stderr
    counts = {}
    for kind, node in re.findall(r"^(PASSED|FAILED|ERROR) (\S+)", out, re.M):
        parts = node.split("/")
        if len(parts) < 3:
            continue
        passed, failed = counts.get(parts[1], (0, 0))
        counts[parts[1]] = (passed + 1, failed) if kind == "PASSED" else (passed, failed + 1)
    return counts, out


def output_for(out, course, folder):
    """The failure sections and result lines of a batched run's output that name this exercise folder."""
    marker = f"{course}/{folder.name}/"
    sections = re.split(r"^(?=_{3,} .* _{3,}$|={3,} .* ={3,}$)", out, flags=re.M)
    kept = [s.strip() for s in sections if marker in s and not s.startswith("=")]
    if not kept:
        return out[-3000:]
    kept += [line for line in out.splitlines() if line.startswith(("PASSED", "FAILED", "ERROR")) and marker in line]
    return "\n".join(kept)[-3000:]


def check_batch(course, folders):
    """Problems found with each exercise of a batched course: {folder: [problems]}."""
    problems = {folder: [] for folder in folders}
    runnable = []
    for folder in folders:
        rel = folder.relative_to(ROOT)
        solution = SOLUTIONS / rel
        if not solution.is_dir():
            problems[folder].append(f"no reference solution at {solution.relative_to(ROOT.parent)}")
        elif not list(folder.glob("test_*.py")):
            problems[folder].append("no test_*.py file")
        else:
            runnable.append(folder)
            for path in (p for p in solution.rglob("*.py") if "__pycache__" not in p.parts):
                if not (folder / path.relative_to(solution)).exists():
                    problems[folder].append(f"solution file {path.relative_to(solution)} has no starter file to replace")

    def stage(tmp, with_solutions, only):
        course_dir = Path(tmp) / course
        course_dir.mkdir()
        for shared in (ROOT / course).glob("*.py"):
            shutil.copy2(shared, course_dir)
        for folder in only:
            shutil.copytree(folder, course_dir / folder.name, ignore=IGNORE)
            if with_solutions:
                shutil.copytree(SOLUTIONS / folder.relative_to(ROOT), course_dir / folder.name, ignore=IGNORE, dirs_exist_ok=True)
        return course_dir

    fresh = [f for f in runnable if not edited_locally(f)]
    for folder in runnable:
        if folder not in fresh:
            print(f"  {folder.relative_to(ROOT)}: starter edited locally, skipping the starter check")
    if fresh:
        with tempfile.TemporaryDirectory() as tmp:
            counts, out = run_pytest_batch(stage(tmp, False, fresh))
        for folder in fresh:
            passed, failed = counts.get(folder.name, (0, 0))
            if passed > 0 or failed == 0:
                problems[folder].append(f"on the starter every test should fail, got {passed} passed, {failed} failed\n{output_for(out, course, folder)}")
    if runnable:
        with tempfile.TemporaryDirectory() as tmp:
            counts, out = run_pytest_batch(stage(tmp, True, runnable))
        for folder in runnable:
            passed, failed = counts.get(folder.name, (0, 0))
            if failed > 0 or passed == 0:
                problems[folder].append(f"on the reference solution every test should pass, got {passed} passed, {failed} failed\n{output_for(out, course, folder)}")
    return problems


def main():
    try:
        import pytest  # noqa: F401
    except ImportError:
        print("pytest is not installed for this Python: pip install -r exercises/requirements.txt")
        return 1
    courses = set(sys.argv[1:])
    folders = exercise_dirs(courses)
    failures = 0
    results = {}
    for course in sorted({f.parent.name for f in folders} & BATCHED):
        results.update(check_batch(course, [f for f in folders if f.parent.name == course]))
    for folder in folders:
        problems = results[folder] if folder in results else check(folder)
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
