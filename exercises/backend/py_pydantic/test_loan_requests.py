import pytest

from loan_requests import LoanRequest, ValidationError

ISBN = "9780441013593"


def test_valid_request_converts_days_text():
    request = LoanRequest("ada@example.org", ISBN, days="21")
    assert request.days == 21
    assert request.to_dict() == {"member": "ada@example.org", "isbn": ISBN, "days": 21, "tags": []}


def test_defaults_and_a_fresh_tags_list_per_request():
    a = LoanRequest("ada@example.org", ISBN)
    b = LoanRequest("bo@example.org", ISBN)
    a.tags.append("holiday")
    assert a.days == 14
    assert b.tags == []


def test_one_bad_field():
    with pytest.raises(ValidationError) as e:
        LoanRequest("ada@example.org", ISBN, days=40)
    assert e.value.errors() == [{"field": "days", "message": "days must be between 1 and 28"}]


def test_every_problem_is_reported_at_once():
    with pytest.raises(ValidationError) as e:
        LoanRequest("bob", "123", days="lots")
    assert e.value.errors() == [
        {"field": "member", "message": "member must be an email address"},
        {"field": "isbn", "message": "isbn must be 13 digits"},
        {"field": "days", "message": "days must be a whole number"},
    ]


def test_strict_refuses_text_instead_of_converting():
    with pytest.raises(ValidationError) as e:
        LoanRequest("ada@example.org", ISBN, days="21", strict=True)
    assert e.value.errors() == [{"field": "days", "message": "days must be an int, not str"}]
    assert LoanRequest("ada@example.org", ISBN, days=21, strict=True).days == 21


def test_from_dict_builds_and_ignores_unknown_keys():
    request = LoanRequest.from_dict({"member": "ada@example.org", "isbn": ISBN, "days": " 7 ", "colour": "red"})
    assert request == LoanRequest("ada@example.org", ISBN, days=7)
    assert request.to_dict()["days"] == 7


def test_from_dict_reports_missing_fields():
    with pytest.raises(ValidationError) as e:
        LoanRequest.from_dict({"days": 7})
    assert e.value.errors() == [
        {"field": "member", "message": "field required"},
        {"field": "isbn", "message": "field required"},
    ]


def test_from_dict_strict():
    with pytest.raises(ValidationError):
        LoanRequest.from_dict({"member": "ada@example.org", "isbn": ISBN, "days": "7"}, strict=True)
