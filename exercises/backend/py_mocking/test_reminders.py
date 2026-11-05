"""Mocking & Patching: practise Mock, return_value, side_effect and patch, testing reminders.py.

Write your tests in this file; README.md lists what they must pin down.
test_grader.py then runs them on the real reminders.py, where they must pass,
and on copies of reminders.py with a bug planted, where they must fail.
Run everything from this folder with: pytest
"""
import datetime
from unittest.mock import Mock, patch

import pytest

from reminders import remind

# TODO: an overdue loan sends exactly one email, to the member, with the right text,
#       and remind returns True.

# TODO: a loan that is due today sends nothing, looks nothing up, and returns False.

# TODO: one TimeoutError from the catalogue is retried, and the email still goes out.

# TODO: a second TimeoutError reaches the caller, and no email is sent.
