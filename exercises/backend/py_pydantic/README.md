# Loan requests

Topic: Pydantic Data Validation (Backend, Python Advanced).
Time: about 25 minutes.

## Task

A loan request arrives as outside data, so check it at the edge before the rest of the program trusts it.
pydantic does this for you; here you write its core by hand, with a dataclass, so nothing needs installing.
Fill in `LoanRequest` in `loan_requests.py`:

- `__post_init__` checks every field when a request is created, converting where it may: days given as text such as `"21"` become `21`.
- It collects every problem, then raises one `ValidationError` whose `.errors()` lists them in field order, as `{"field": ..., "message": ...}`.
- With `strict=True`, text for `days` is refused instead of converted.
- `from_dict(data, strict=False)` builds a request from a dict like pydantic's `model_validate`, reporting a missing `member` or `isbn` as `"field required"` and ignoring keys it does not know.
- `to_dict()` returns the fields as a plain dict, like `model_dump()`.

The rules and their messages are in the `__post_init__` docstring.

## Examples

```python
LoanRequest("ada@example.org", "9780441013593", days="21").days    # 21

LoanRequest("bob", "123", days="lots")
# ValidationError, and .errors() gives:
# [{"field": "member", "message": "member must be an email address"},
#  {"field": "isbn", "message": "isbn must be 13 digits"},
#  {"field": "days", "message": "days must be a whole number"}]

LoanRequest("ada@example.org", "9780441013593", days="21", strict=True)
# ValidationError: [{"field": "days", "message": "days must be an int, not str"}]

LoanRequest.from_dict({"days": 7})
# ValidationError: member and isbn are "field required"
```

Watch for the lesson's pitfall: by default validation converts rather than rejects, so `"21"` quietly becomes `21`.
Use strict mode when a wrong type should be an error.

## Run the tests

```bash
cd exercises/backend/py_pydantic
pytest
```

Every test fails until you fill in the class.
When they all pass, tick the exercise done in Recall under Progress, Topics.
