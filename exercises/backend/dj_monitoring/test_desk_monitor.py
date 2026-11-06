"""Check the loan desk's logging, error capture and health check.

Django's test client sends the requests and pytest's caplog fixture collects the log
records, so no server, log store or error tracker is needed.
"""
import json
import logging
import logging.config
import sys

import pytest
from django.db import OperationalError, connections
from django.test import Client

from desk_monitor import views
from desk_monitor.log_format import LOGGING, JsonFormatter
from desk_monitor.services import CatalogueDown

pytestmark = [pytest.mark.django_db, pytest.mark.urls("desk_monitor.urls")]

CAPTURE = "desk_monitor.middleware.ErrorCaptureMiddleware"


@pytest.fixture(autouse=True)
def restore_logging():
    """Put every logger back as it was once a test has run dictConfig."""
    loggers = logging.root.manager.loggerDict
    disabled = {n: lg.disabled for n, lg in loggers.items() if isinstance(lg, logging.Logger)}
    yield
    for name in ("desk_monitor", "desk_monitor.views", "desk_monitor.errors"):
        logger = logging.getLogger(name)
        logger.handlers.clear()
        logger.setLevel(logging.NOTSET)
        logger.propagate = True
    for name, was in disabled.items():
        loggers[name].disabled = was


@pytest.fixture
def info(caplog):
    caplog.set_level(logging.INFO, logger="desk_monitor")
    return caplog


def desk_records(caplog, logger="desk_monitor.views"):
    return [r for r in caplog.records if r.name == logger]


def make_record(msg, *args, extra=None, exc=None):
    return logging.getLogger("desk_monitor.views").makeRecord(
        "desk_monitor.views", logging.INFO, __file__, 1, msg, args, exc, extra=extra)


# Structured logging -----------------------------------------------------------

def test_json_formatter_writes_level_logger_message_and_extra_fields():
    line = JsonFormatter().format(make_record("lent %s", "Dune", extra={"book_id": 1, "member": "ana"}))
    assert json.loads(line) == {
        "level": "INFO", "logger": "desk_monitor.views", "msg": "lent Dune", "book_id": 1, "member": "ana",
    }
    assert "\n" not in line, "one record, one line"


def test_json_formatter_names_the_exception_and_keeps_the_traceback():
    try:
        {"Dune": 1}["Emma"]
    except KeyError:
        record = make_record("due date missing", exc=sys.exc_info())
    entry = json.loads(JsonFormatter().format(record))
    assert entry["error"] == "KeyError"
    assert "Traceback" in entry["traceback"] and "KeyError" in entry["traceback"]


def test_logging_setting_writes_json_to_standard_output(capsys):
    logging.config.dictConfig(LOGGING)
    views.log.debug("noise")
    views.log.info("book lent", extra={"book_id": 1, "loan_id": 101})
    out = capsys.readouterr().out.strip().splitlines()
    assert [json.loads(line) for line in out] == [
        {"level": "INFO", "logger": "desk_monitor.views", "msg": "book lent", "book_id": 1, "loan_id": 101},
    ]


def test_logging_setting_keeps_existing_loggers_switched_on():
    logging.config.dictConfig(LOGGING)
    assert not views.log.disabled, "set disable_existing_loggers to False, or every logger made before is silenced"
    assert views.log.name == "desk_monitor.views"


# The checkout view ---------------------------------------------------------------

def test_checkout_logs_each_step_with_its_context(info):
    response = Client().post("/checkout/1/", {"member": "ana"})
    assert response.status_code == 201
    assert response.json() == {"loan_id": 101}
    records = desk_records(info)
    assert [(r.levelname, r.getMessage()) for r in records] == [
        ("INFO", "checkout started"), ("INFO", "book lent"),
    ]
    assert (records[0].book_id, records[0].member) == (1, "ana")
    assert (records[1].book_id, records[1].loan_id) == (1, 101)


def test_checkout_keeps_the_context_out_of_the_message(info):
    Client().post("/checkout/1/", {"member": "ana"})
    for record in desk_records(info):
        assert record.args in ((), None) and "ana" not in record.msg and "1" not in record.msg, (
            "pass the context in extra=, not in an f-string"
        )


def test_a_refused_checkout_is_a_warning_not_an_error(info):
    response = Client().post("/checkout/2/", {"member": "ana"})
    assert response.status_code == 409
    assert response.json() == {"error": "already on loan"}
    refused = desk_records(info)[-1]
    assert (refused.levelname, refused.getMessage()) == ("WARNING", "checkout refused")
    assert (refused.book_id, refused.reason) == (2, "already on loan")
    assert refused.exc_info is None


def test_an_unreachable_catalogue_is_logged_with_its_traceback(info, monkeypatch):
    def down(book_id, member):
        raise CatalogueDown("catalogue timed out")

    monkeypatch.setattr(views, "lend_book", down)
    response = Client().post("/checkout/3/", {"member": "ana"})
    assert response.status_code == 503
    assert response.json() == {"error": "try again later"}
    failed = desk_records(info)[-1]
    assert (failed.levelname, failed.getMessage(), failed.book_id) == ("ERROR", "catalogue unreachable", 3)
    assert failed.exc_info and failed.exc_info[0] is CatalogueDown, "use log.exception to keep the traceback"


# Error capture ------------------------------------------------------------------

def test_an_unexpected_error_is_captured_with_its_request_and_still_a_500(info, settings, monkeypatch):
    settings.MIDDLEWARE = [*settings.MIDDLEWARE, CAPTURE]

    def broken(book_id, member):
        raise RuntimeError("loan table locked")

    monkeypatch.setattr(views, "lend_book", broken)
    response = Client(raise_request_exception=False).post("/checkout/4/", {"member": "ana"})
    assert response.status_code == 500
    assert not any(r.levelname == "ERROR" for r in desk_records(info)), (
        "let an unexpected error rise from the view; the error capture logs it"
    )
    captured = desk_records(info, "desk_monitor.errors")
    assert [(r.levelname, r.getMessage()) for r in captured] == [("ERROR", "unhandled error")]
    assert (captured[0].path, captured[0].method) == ("/checkout/4/", "POST")
    assert captured[0].exc_info and captured[0].exc_info[0] is RuntimeError


# Health check ---------------------------------------------------------------------

def test_health_answers_ok_when_the_database_answers():
    response = Client().get("/health/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "checks": {"database": "ok"}}
    assert Client().post("/health/").status_code == 405, "a health check only answers GET"


def test_health_answers_503_when_the_database_is_down(info, monkeypatch):
    def refuse(self, *args, **kwargs):
        raise OperationalError("could not connect to server")

    monkeypatch.setattr(type(connections["default"]), "cursor", refuse)
    response = Client().get("/health/")
    assert response.status_code == 503
    assert response.json() == {"status": "error", "checks": {"database": "error"}}
    failed = desk_records(info)[-1]
    assert (failed.levelname, failed.getMessage(), failed.check) == ("ERROR", "health check failed", "database")
    assert failed.exc_info and failed.exc_info[0] is OperationalError
