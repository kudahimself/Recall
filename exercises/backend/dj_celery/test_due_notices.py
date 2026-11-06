import datetime
from unittest import mock

import pytest
from celery.canvas import Signature
from django.utils import timezone

from due_notices import tasks
from due_notices.celery_app import app
from due_notices.models import Loan

pytestmark = [pytest.mark.django_db, pytest.mark.urls("due_notices.urls")]


@pytest.fixture(autouse=True)
def celery_runs_tasks_eagerly(settings):
    """The test settings: every task runs at once, in this process, so no broker or worker is needed.

    The app only sees them once celery_app.py reads the CELERY_* settings.
    """
    settings.CELERY_TASK_ALWAYS_EAGER = True
    settings.CELERY_BROKER_URL = "memory://"
    if not app.conf.task_always_eager:
        pytest.fail("the Celery app does not read the CELERY_* Django settings yet (celery_app.py)")


@pytest.fixture
def loans():
    today = timezone.localdate()
    day = datetime.timedelta(days=1)
    return {
        "dune": Loan.objects.create(title="Dune", email="ann@example.com", due_on=today - 3 * day),
        "emma": Loan.objects.create(title="Emma", email="ben@example.com", due_on=today),
        "ubik": Loan.objects.create(title="Ubik", email="cy@example.com", due_on=today + day),
        "kindred": Loan.objects.create(title="Kindred", email="di@example.com", due_on=today - day, reminded=True),
    }


class FlakyMail:
    """Stands in for send_mail: raises OSError, as an unreachable mail server does, `failures` times."""

    def __init__(self, failures):
        self.failures = failures
        self.calls = 0
        self.sent = []

    def __call__(self, subject, message, from_email, recipients):
        self.calls += 1
        if self.calls <= self.failures:
            raise OSError("mail server unreachable")
        self.sent.append((subject, message, recipients))
        return 1


class QueuedOnly:
    """Stands in for a task's apply_async: records the call, and the result must not be waited on."""

    def __init__(self):
        self.calls = []

    def __call__(self, args=None, kwargs=None, **options):
        self.calls.append((list(args or []), kwargs or {}, options))
        result = mock.Mock(id="1b4e28ba-2fa1-11d2-883f-0016d3cca427")
        result.get.side_effect = AssertionError("a view must not wait for the task with get()")
        return result


def test_the_app_reads_settings_and_schedules_the_reminders():
    assert app.main == "library"
    assert app.conf.task_always_eager is True
    entry = app.conf.beat_schedule["remind-due-loans"]
    assert list(app.conf.beat_schedule) == ["remind-due-loans"]
    assert entry["task"] == "due_notices.tasks.remind_all_due"
    assert entry["schedule"] in (3600, datetime.timedelta(hours=1))
    assert entry["task"] in app.tasks


def test_the_app_finds_each_installed_apps_tasks():
    with mock.patch.object(app.loader, "autodiscover_tasks") as discover:
        app.loader.import_default_modules()
    packages = [pkg for call in discover.call_args_list for pkg in call.args[0]]
    assert "due_notices" in packages


def test_send_notice_emails_the_reader_and_marks_the_loan(loans, mailoutbox):
    dune = loans["dune"]
    result = tasks.send_notice.delay(dune.pk)
    assert result.get() == "ann@example.com"
    assert [m.to for m in mailoutbox] == [["ann@example.com"]]
    assert mailoutbox[0].subject == "Book due"
    assert mailoutbox[0].body == f"Dune is due back on {dune.due_on}."
    dune.refresh_from_db()
    assert dune.reminded is True


def test_send_notice_retries_when_the_mail_server_is_down(loans, monkeypatch):
    assert tasks.send_notice.max_retries == 3
    mail = FlakyMail(failures=2)
    monkeypatch.setattr(tasks, "send_mail", mail)
    result = tasks.send_notice.delay(loans["emma"].pk)
    assert result.get() == "ben@example.com"
    assert mail.calls == 3
    assert len(mail.sent) == 1
    loans["emma"].refresh_from_db()
    assert loans["emma"].reminded is True


def test_send_notice_gives_up_after_three_retries(loans, monkeypatch):
    mail = FlakyMail(failures=10)
    monkeypatch.setattr(tasks, "send_mail", mail)
    with mock.patch.object(tasks.send_notice, "retry", wraps=tasks.send_notice.retry) as retry:
        result = tasks.send_notice.delay(loans["emma"].pk)
    assert result.status == "FAILURE"
    assert isinstance(result.result, OSError)
    assert mail.calls == 4
    assert all(call.kwargs.get("countdown") == 60 for call in retry.call_args_list)
    assert retry.call_count == 4
    loans["emma"].refresh_from_db()
    assert loans["emma"].reminded is False


def test_remind_all_due_queues_a_notice_per_due_loan(loans, mailoutbox):
    assert tasks.remind_all_due.name in app.tasks
    assert tasks.remind_all_due.delay().get() == 2
    assert sorted(m.to[0] for m in mailoutbox) == ["ann@example.com", "ben@example.com"]
    assert sorted(Loan.objects.filter(reminded=True).values_list("title", flat=True)) == ["Dune", "Emma", "Kindred"]
    assert tasks.remind_all_due.delay().get() == 0


def test_overdue_report_is_a_chain_built_without_running_it(loans, django_assert_num_queries):
    with django_assert_num_queries(0):
        report = tasks.overdue_report()
    assert isinstance(report, Signature)
    assert [step.task for step in report.tasks] == [tasks.count_overdue.name, tasks.format_report.name]
    assert report.delay().get() == "2 overdue"
    assert tasks.format_report.delay(1).get() == "1 overdue"


def test_remind_queues_the_task_with_the_id_and_answers_at_once(client, loans, monkeypatch):
    queued = QueuedOnly()
    monkeypatch.setattr(tasks.send_notice, "apply_async", queued)
    response = client.post(f"/loans/{loans['dune'].pk}/remind/")
    assert response.status_code == 202
    assert response.json() == {"task_id": "1b4e28ba-2fa1-11d2-883f-0016d3cca427"}
    assert len(queued.calls) == 1
    args, kwargs, options = queued.calls[0]
    assert args + list(kwargs.values()) == [loans["dune"].pk]
    assert options.get("countdown") is None


def test_remind_later_waits_an_hour(client, loans, monkeypatch):
    queued = QueuedOnly()
    monkeypatch.setattr(tasks.send_notice, "apply_async", queued)
    response = client.post(f"/loans/{loans['emma'].pk}/remind-later/")
    assert response.status_code == 202
    assert response.json() == {"task_id": "1b4e28ba-2fa1-11d2-883f-0016d3cca427"}
    args, kwargs, options = queued.calls[0]
    assert args + list(kwargs.values()) == [loans["emma"].pk]
    assert options["countdown"] == 3600


def test_remind_runs_the_notice_and_refuses_unknown_loans(client, loans, mailoutbox):
    response = client.post(f"/loans/{loans['dune'].pk}/remind/")
    assert response.status_code == 202
    assert len(response.json()["task_id"]) == 36
    assert [m.to for m in mailoutbox] == [["ann@example.com"]]
    assert client.post("/loans/999/remind/").status_code == 404
    assert client.get(f"/loans/{loans['dune'].pk}/remind/").status_code == 405
