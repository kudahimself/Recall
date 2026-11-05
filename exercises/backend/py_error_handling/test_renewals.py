import pytest

from renewals import MAX_RENEWALS, RenewalError, parse_days, renew, renew_all


def test_renewal_error_is_an_exception():
    assert issubclass(RenewalError, Exception)


def test_parse_days():
    assert parse_days("14") == 14
    assert parse_days(" 7 ") == 7


def test_parse_days_rejects_text():
    with pytest.raises(ValueError) as e:
        parse_days("two weeks")
    assert str(e.value) == "days must be a whole number"


def test_parse_days_rejects_zero_and_negatives():
    for text in ["0", "-3"]:
        with pytest.raises(ValueError) as e:
            parse_days(text)
        assert str(e.value) == "days must be positive"


def test_renew_counts_up():
    renewals = {"Dune": 0}
    assert renew(renewals, "Dune") == 1
    assert renewals == {"Dune": 1}


def test_renew_refuses_a_title_not_on_loan():
    with pytest.raises(RenewalError) as e:
        renew({"Dune": 0}, "Emma")
    assert str(e.value) == "Emma is not on loan"


def test_renew_refuses_past_the_limit():
    renewals = {"Dune": MAX_RENEWALS}
    with pytest.raises(RenewalError) as e:
        renew(renewals, "Dune")
    assert str(e.value) == "Dune renewed too often"
    assert renewals == {"Dune": MAX_RENEWALS}


def test_renew_all_splits_renewed_and_refused():
    renewals = {"Dune": 2, "Emma": 0, "Ubik": 1}
    renewed, refused = renew_all(renewals, ["Emma", "Dune", "Beloved", "Ubik"])
    assert renewed == ["Emma", "Ubik"]
    assert refused == {"Dune": "Dune renewed too often", "Beloved": "Beloved is not on loan"}
    assert renewals == {"Dune": 2, "Emma": 1, "Ubik": 2}


def test_renew_all_lets_other_errors_through():
    # None is not a dict: that is a bug in the caller, not a refused renewal.
    with pytest.raises(TypeError):
        renew_all(None, ["Dune"])
