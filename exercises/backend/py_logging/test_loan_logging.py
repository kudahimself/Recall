import logging

import pytest

import loan_logging as loans


@pytest.fixture(autouse=True)
def reset_levels():
    """Put the library loggers back to "no level of their own" around every test."""
    for logger_name in ("library", "library.loans", "library.fees"):
        logging.getLogger(logger_name).setLevel(logging.NOTSET)
    yield
    for logger_name in ("library", "library.loans", "library.fees"):
        logging.getLogger(logger_name).setLevel(logging.NOTSET)


def test_the_module_logger_is_a_child_of_library():
    assert loans.log.name == "library.loans"
    assert loans.log.parent is logging.getLogger("library")


def test_info_is_hidden_until_configured(caplog):
    assert loans.lend("Dune", "ana") == "Dune -> ana"
    assert caplog.records == []


def test_configure_shows_info_from_lend(caplog):
    loans.configure()
    loans.lend("Dune", "ana")
    assert [(r.name, r.levelname, r.getMessage()) for r in caplog.records] == [
        ("library.loans", "INFO", "lent Dune to ana"),
    ]


def test_lend_passes_values_as_arguments(caplog):
    loans.configure()
    loans.lend("Emma", "bo")
    record = caplog.records[0]
    assert record.msg == "lent %s to %s"
    assert record.args == ("Emma", "bo")


def test_configure_sets_the_parent_and_children_inherit():
    loans.configure()
    assert logging.getLogger("library").level == logging.INFO
    assert logging.getLogger("library.loans").level == logging.NOTSET
    assert logging.getLogger("library.fees").isEnabledFor(logging.INFO)
    assert not logging.getLogger("library.fees").isEnabledFor(logging.DEBUG)


def test_check_return_levels(caplog):
    loans.configure()
    loans.check_return("Emma", 3)
    loans.check_return("Dune", 0)
    assert [(r.levelname, r.getMessage()) for r in caplog.records] == [
        ("WARNING", "Emma returned 3 days late"),
    ]
    caplog.clear()
    logging.getLogger("library").setLevel(logging.DEBUG)
    loans.check_return("Dune", 0)
    assert [(r.levelname, r.getMessage()) for r in caplog.records] == [
        ("DEBUG", "Dune returned on time"),
    ]


def test_renew_all_logs_the_failure_and_carries_on(caplog):
    def renew(title):
        if title == "Emma":
            raise RuntimeError("card expired")

    assert loans.renew_all(["Dune", "Emma", "Ubik"], renew) == ["Dune", "Ubik"]
    errors = [r for r in caplog.records if r.levelname == "ERROR"]
    assert [r.getMessage() for r in errors] == ["renewal failed for Emma"]
    assert errors[0].exc_info is not None
