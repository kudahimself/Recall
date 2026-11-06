# Loan ledger

Topic: Models Mastery (deep revisit) (Backend, Django Advanced & Deployment).
Time: about 25 minutes.

## Task

Write the ledger's five models in `ledger/models.py`, using each of the three kinds of model inheritance once and putting each rule where it belongs.

- `Stamped` is an abstract base with no table: `created`, set once when a row is inserted, and `updated`, set again on every save.
- `Item` builds on `Stamped`: a `title` of up to 200 characters, a `shelf_mark` whose validator only accepts the pattern `^[A-Z]{3}-\d{3}$` (such as `SCI-042`), and `copies`, a whole number with a validator that needs at least 1.
  It prints as its title.
- `Periodical` is an `Item` with a table of its own, joined to `Item`'s by the one-to-one Django adds, with an `issue` number.
- `Loan` builds on `Stamped`: its `item` (deleting the item deletes its loans, followed back as `item.loans`), a `reader` of up to 50 characters, the `lent` and `due` dates, and `returned`, which starts `False`.
  - Its `clean()` keeps a loan to at most `LOAN_LIMIT`, 28 days from `lent` to `due`, failing with `"A loan runs at most 28 days."`.
  - Two rules the database itself enforces, in `Meta.constraints`: a `CheckConstraint` named `ledger_due_after_lent` that keeps `due` on or after `lent`, and a `UniqueConstraint` named `ledger_one_open_loan` that lets a reader hold only one open (not returned) loan of an item, through its `condition`.
    Give them the `violation_error_message`s `"Due date is before the loan date."` and `"This reader already has this item on loan."`.
- `OverdueLoan` is a proxy of `Loan`: the same table and rows, ordered by due date, with a `days_late(today)` method that never goes below 0.

## Examples

```python
Item(title="Dune", shelf_mark="sci-42", copies=0).full_clean()
# ValidationError: {"copies": [...], "shelf_mark": [...]}
Loan(item=dune, reader="ann", lent=date(2026, 3, 9), due=date(2026, 3, 1)).full_clean()
# ValidationError: {"__all__": ["Due date is before the loan date."]}
Loan.objects.create(item=dune, reader="ann", lent=date(2026, 3, 9), due=date(2026, 3, 1))
# IntegrityError: the database refuses it too
Item.objects.get(title="Vogue").periodical.issue    # 12, read from Periodical's own table
[loan.reader for loan in OverdueLoan.objects.all()] # earliest due date first
```

Watch for the lesson's pitfall: `save()` does not validate.
A field's `validators` and the model's `clean()` run only in `full_clean()`, which forms and serializers call for you, so `objects.create()` stores a bad value as it is.
A rule that must never break, even under two requests at once, belongs in the database as a constraint.

## Run the tests

```bash
cd exercises/backend/dj_models_mastery
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
There are no migrations to make here: the tests build the tables straight from your models, constraints included.
Every test fails until you write the models.
When they all pass, tick the exercise done in Recall under Progress, Topics.
