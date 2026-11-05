"""Grades your tests in test_late_fees.py. Do not change this file.

Each check copies your test file into a fresh temporary folder next to a version
of late_fees.py and runs pytest there.
On the real late_fees.py your tests must pass; on a copy with one bug planted they must fail.
"""
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
YOUR_TESTS = HERE / "test_late_fees.py"
REAL = (HERE / "late_fees.py").read_text()

# Each bug: (text in the real late_fees.py, what replaces it, what the bug does).
BUGS = {
    "one_day_short": (
        "min(days_late * per_day, cap)", "min(max(days_late - 1, 0) * per_day, cap)",
        "charges one day too few",
    ),
    "no_cap": ("min(days_late * per_day, cap)", "days_late * per_day", "never stops at the cap"),
    "fixed_rate": ("min(days_late * per_day, cap)", "min(days_late * 20, cap)", "ignores the per_day argument"),
    "no_error": (
        'raise ValueError("days_late cannot be negative")', "return 0",
        "returns 0 for negative days instead of raising ValueError",
    ),
}

_runs = {}


def with_bug(bug):
    old, new, _ = BUGS[bug]
    assert old in REAL, "late_fees.py has changed; restore it with: git checkout -- late_fees.py"
    return REAL.replace(old, new, 1)


def run_your_tests(fees_source, *extra):
    """Run pytest on a copy of your tests beside `fees_source`; return (exit code, output)."""
    key = (fees_source, extra, YOUR_TESTS.read_text())
    if key not in _runs:
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "late_fees.py").write_text(fees_source)
            shutil.copy(YOUR_TESTS, Path(tmp) / "test_late_fees.py")
            result = subprocess.run(
                [sys.executable, "-m", "pytest", "-q", "-p", "no:cacheprovider", "--color=no", *extra],
                cwd=tmp, capture_output=True, text=True, timeout=120,
                env=dict(os.environ, PYTHONDONTWRITEBYTECODE="1"),
            )
        _runs[key] = (result.returncode, result.stdout + result.stderr)
    return _runs[key]


def assert_pass_on_real_code():
    code, out = run_your_tests(REAL)
    assert code != 5, "pytest found no tests in test_late_fees.py: is each name test_...?"
    assert code == 0, "your tests must pass on the real late_fees.py:\n" + out


def assert_catches(bug):
    assert_pass_on_real_code()
    code, out = run_your_tests(with_bug(bug))
    assert code == 1, f"no test failed when late_fee {BUGS[bug][2]}:\n{out}"


def test_your_tests_pass_on_the_real_fees():
    assert_pass_on_real_code()


def test_your_tests_catch_a_fee_one_day_short():
    assert_catches("one_day_short")


def test_your_tests_catch_a_missing_cap():
    assert_catches("no_cap")


def test_your_tests_catch_an_ignored_per_day_rate():
    assert_catches("fixed_rate")


def test_your_tests_catch_a_missing_error():
    assert_catches("no_error")


def test_you_parametrize_at_least_three_cases():
    assert_pass_on_real_code()
    code, out = run_your_tests(REAL, "--collect-only")
    cases = [line for line in out.splitlines() if "::" in line and "[" in line]
    assert len(cases) >= 3, "write a @pytest.mark.parametrize test with at least three rows:\n" + out
