"""Testing Basics: practise writing pytest tests, for late_fee in fees.py.

Write your tests in this file; README.md lists what they must pin down.
test_grader.py then runs them on the real fees.py, where they must pass,
and on copies of fees.py with a bug planted, where they must fail.
Run everything from this folder with: pytest
"""
import pytest

from fees import late_fee

# TODO: a test that a book returned on time costs nothing.

# TODO: one parametrized test that checks at least three (days_late, fee) cases.

# TODO: a test that the fee never goes above the cap.

# TODO: a test that a different per_day rate is used when one is given.

# TODO: a test that a negative days_late raises ValueError, checking the message too.
