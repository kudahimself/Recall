"""Grades your tests in test_reminders.py. Do not change this file.

Each check copies your test file into a fresh temporary folder next to clock.py,
mailer.py and a version of reminders.py, and runs pytest there.
On the real reminders.py your tests must pass; on a copy with one bug planted they must fail.
"""
import ast
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
YOUR_TESTS = HERE / "test_reminders.py"
REAL = (HERE / "reminders.py").read_text()

# Each bug: (text in the real reminders.py, what replaces it, what the bug does).
BUGS = {
    "wrong_recipient": ('send_email(loan["member"],', 'send_email("desk@library.org",', "emails the front desk, not the member"),
    "no_due_check": ('if today() <= loan["due"]:', 'if loan["due"] is None:', "reminds about loans that are not overdue"),
    "no_retry": (
        '    try:\n        book = catalogue.lookup(loan["isbn"])\n'
        '    except TimeoutError:\n        book = catalogue.lookup(loan["isbn"])\n',
        '    book = catalogue.lookup(loan["isbn"])\n',
        "gives up after the first TimeoutError",
    ),
    "days_off": ('.days\n', '.days + 1\n', "counts one day too many in the email"),
}

_runs = {}


def with_bug(bug):
    old, new, _ = BUGS[bug]
    assert old in REAL, "reminders.py has changed; restore it with: git checkout -- reminders.py"
    return REAL.replace(old, new, 1)


def run_your_tests(reminders_source):
    """Run pytest on a copy of your tests beside `reminders_source`; return (exit code, output)."""
    key = (reminders_source, YOUR_TESTS.read_text())
    if key not in _runs:
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "reminders.py").write_text(reminders_source)
            for helper in ("clock.py", "mailer.py"):
                shutil.copy(HERE / helper, Path(tmp) / helper)
            shutil.copy(YOUR_TESTS, Path(tmp) / "test_reminders.py")
            result = subprocess.run(
                [sys.executable, "-m", "pytest", "-q", "-p", "no:cacheprovider", "--color=no"],
                cwd=tmp, capture_output=True, text=True, timeout=120,
                env=dict(os.environ, PYTHONDONTWRITEBYTECODE="1"),
            )
        _runs[key] = (result.returncode, result.stdout + result.stderr)
    return _runs[key]


def assert_pass_on_real_code():
    code, out = run_your_tests(REAL)
    assert code != 5, "pytest found no tests in test_reminders.py: is each name test_...?"
    assert code == 0, "your tests must pass on the real reminders.py:\n" + out


def assert_catches(bug):
    assert_pass_on_real_code()
    code, out = run_your_tests(with_bug(bug))
    assert code == 1, f"no test failed when remind {BUGS[bug][2]}:\n{out}"


def names_used():
    """Every name, attribute and keyword argument your test code uses (comments do not count)."""
    tree = ast.parse(YOUR_TESTS.read_text())
    found = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Name):
            found.add(node.id)
        elif isinstance(node, ast.Attribute):
            found.add(node.attr)
        elif isinstance(node, ast.keyword) and node.arg:
            found.add(node.arg)
    return found


def test_your_tests_pass_on_the_real_reminders():
    assert_pass_on_real_code()


def test_your_tests_catch_the_wrong_recipient():
    assert_catches("wrong_recipient")


def test_your_tests_catch_a_missing_due_date_check():
    assert_catches("no_due_check")


def test_your_tests_catch_a_missing_retry():
    assert_catches("no_retry")


def test_your_tests_catch_a_wrong_day_count():
    assert_catches("days_off")


def test_you_use_patch_return_value_side_effect_and_call_checks():
    assert_pass_on_real_code()
    missing = {"patch", "return_value", "side_effect", "assert_called_once_with"} - names_used()
    assert not missing, f"your tests never use: {', '.join(sorted(missing))}"
