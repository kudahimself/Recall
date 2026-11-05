# Reminder mocks

Topic: Mocking & Patching (Backend, Python Advanced).
Time: about 25 minutes.

## Task

`reminders.py` emails a member when a loan is overdue; read it, but do not change it.
It looks up the title in a catalogue it is given, asks `clock.today()` for the date, and sends with `mailer.send_email`.
In tests the real mailer raises, since there is no mail server, and the real clock moves every day.
In `test_reminders.py`, write tests that replace all three with stand-ins:

- An overdue loan sends exactly one email, to the member, with the right text, and `remind` returns `True`.
- A loan due today sends nothing, looks nothing up, and returns `False`.
- One `TimeoutError` from the catalogue is retried, and the email still goes out.
- A second `TimeoutError` reaches the caller, and no email is sent.

Use a `Mock()` catalogue with `lookup.return_value` or `lookup.side_effect`, `patch` for `today` and `send_email`, and check the calls with `assert_called_once_with` (and `assert_not_called`).

## How it is graded

`test_grader.py` copies your test file into a temporary folder and runs it twice over:
on the real `reminders.py`, where every one of your tests must pass, and on copies with one bug planted, where at least one must fail.
The planted bugs email the wrong address, skip the due-date check, give up after one timeout, and count one day too many.

## Examples

```python
catalogue = Mock()
catalogue.lookup.return_value = {"title": "Dune"}
loan = {"member": "ada@example.org", "isbn": "9780441013593", "due": datetime.date(2025, 3, 7)}

with patch("reminders.today", return_value=datetime.date(2025, 3, 10)), patch("reminders.send_email") as send:
    remind(loan, catalogue)     # True, and send was called once: ("ada@example.org", "Dune is 3 days overdue")
```

Watch for the lesson's pitfall: `reminders.py` does `from mailer import send_email`, so it holds its own reference.
Patch `reminders.send_email`, where the name is looked up; patching `mailer.send_email` leaves the real one in place.

## Run the tests

```bash
cd exercises/backend/py_mocking
pytest
```

Every grader test fails until you write your tests.
When they all pass, tick the exercise done in Recall under Progress, Topics.
