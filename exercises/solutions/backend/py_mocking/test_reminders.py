"""Mocking & Patching: reference solution."""
import datetime
from unittest.mock import Mock, patch

import pytest

from reminders import remind

TODAY = datetime.date(2025, 3, 10)
LOAN = {"member": "ada@example.org", "isbn": "9780441013593", "due": datetime.date(2025, 3, 7)}


def catalogue_with(title):
    catalogue = Mock()
    catalogue.lookup.return_value = {"title": title}
    return catalogue


def test_overdue_loan_sends_one_reminder():
    catalogue = catalogue_with("Dune")
    with patch("reminders.today", return_value=TODAY), patch("reminders.send_email") as send:
        assert remind(LOAN, catalogue) is True
    catalogue.lookup.assert_called_once_with("9780441013593")
    send.assert_called_once_with("ada@example.org", "Dune is 3 days overdue")


def test_loan_due_today_sends_nothing():
    catalogue = catalogue_with("Dune")
    with patch("reminders.today", return_value=LOAN["due"]), patch("reminders.send_email") as send:
        assert remind(LOAN, catalogue) is False
    catalogue.lookup.assert_not_called()
    send.assert_not_called()


def test_one_timeout_is_retried():
    catalogue = Mock()
    catalogue.lookup.side_effect = [TimeoutError(), {"title": "Dune"}]
    with patch("reminders.today", return_value=TODAY), patch("reminders.send_email") as send:
        assert remind(LOAN, catalogue) is True
    assert catalogue.lookup.call_count == 2
    send.assert_called_once_with("ada@example.org", "Dune is 3 days overdue")


def test_second_timeout_reaches_the_caller():
    catalogue = Mock()
    catalogue.lookup.side_effect = [TimeoutError(), TimeoutError()]
    with patch("reminders.today", return_value=TODAY), patch("reminders.send_email") as send:
        with pytest.raises(TimeoutError):
            remind(LOAN, catalogue)
    send.assert_not_called()
