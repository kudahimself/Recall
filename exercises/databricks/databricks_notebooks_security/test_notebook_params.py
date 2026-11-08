import pytest

import notebook_params as np_


def test_parse_params_converts_every_widget_value():
    raw = {"branch": "york", "days": "7", "dry_run": "TRUE"}
    assert np_.parse_params(raw) == {"branch": "york", "days": 7, "dry_run": True}


def test_parse_params_applies_defaults():
    assert np_.parse_params({"branch": "leeds"}) == {"branch": "leeds", "days": 14, "dry_run": False}


@pytest.mark.parametrize(
    "raw",
    [{"branch": "paris"}, {}, {"branch": "leeds", "days": "two weeks"}, {"branch": "leeds", "days": "1.5"}],
)
def test_parse_params_rejects_bad_values(raw):
    with pytest.raises(ValueError):
        np_.parse_params(raw)


def test_split_magic_reads_the_language_from_the_first_line():
    assert np_.split_magic("%sql\nSELECT 1\nFROM t") == ("sql", "SELECT 1\nFROM t")
    assert np_.split_magic("%md\n# Title") == ("md", "# Title")


def test_split_magic_falls_back_to_the_notebook_language():
    assert np_.split_magic("print(1)") == ("python", "print(1)")
    assert np_.split_magic("SELECT 1", default="sql") == ("sql", "SELECT 1")


def test_redact_hides_every_occurrence_of_each_secret():
    text = "token=abc123 retry with abc123 and key=k-99"
    assert np_.redact(text, ["abc123", "k-99"]) == "token=[REDACTED] retry with [REDACTED] and key=[REDACTED]"


def test_redact_hides_the_longer_secret_completely():
    assert np_.redact("pw=secret-long", ["secret", "secret-long"]) == "pw=[REDACTED]"


def test_redact_ignores_empty_secrets():
    assert np_.redact("plain text", [""]) == "plain text"


def test_load_config_reads_upper_cased_variables():
    env = {"LIBRARY_API_TOKEN": "t0k", "LIBRARY_DB_PASSWORD": "pw", "OTHER": "x"}
    assert np_.load_config(env, "library", ["api_token", "db_password"]) == {"api_token": "t0k", "db_password": "pw"}


def test_load_config_names_the_missing_secret_without_leaking_values():
    env = {"LIBRARY_API_TOKEN": "t0k-value"}
    with pytest.raises(KeyError) as error:
        np_.load_config(env, "library", ["api_token", "db_password"])
    message = str(error.value)
    assert "library" in message and "db_password" in message
    assert "t0k-value" not in message


def test_masked_config_hides_only_the_secret_keys_and_keeps_the_original():
    config = {"host": "db.example", "api_token": "t0k"}
    shown = np_.masked_config(config, {"api_token"})
    assert shown == {"host": "db.example", "api_token": "[REDACTED]"}
    assert config["api_token"] == "t0k"


def test_recent_loans_filters_by_branch_and_days(spark):
    loans = spark.createDataFrame(
        [("leeds", "Dune", 3), ("leeds", "Emma", 20), ("york", "Ubik", 2), ("leeds", "Kim", 14)],
        ["branch", "title", "days_out"],
    )
    params = np_.parse_params({"branch": "leeds", "days": "14"})
    rows = np_.recent_loans(loans, params).collect()
    assert sorted(r["title"] for r in rows) == ["Dune", "Kim"]
