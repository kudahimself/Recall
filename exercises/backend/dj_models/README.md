# Catalogue models

Topic: Models & Migrations (Backend, Django).
Time: about 20 minutes.

## Task

The library's catalogue needs four tables.
Write the models in `catalog/models.py`:

- `Branch` has a `name` of up to 50 characters, and `Author` a `full_name` of up to 100; each prints as that text.
- `Tag` has a `name` of up to 30 characters that no two tags share (`unique=True`).
- `Book` has a `title` of up to 200 characters, a `summary` that is long text and may be blank, `on_loan` that starts `False`, and `added_at`, set once when the row is inserted.
- Each book has one author, and deleting an author deletes their books.
- Each book sits at one branch, and a branch that still has books cannot be deleted.
- A book has any number of tags, and may have none.
- Every link can be followed back from the other side: `author.books`, `branch.books` and `tag.books`.
- Books come back in title order, and a book prints as `"Dune by Frank Herbert"`.

There are no migrations to make here: the tests build their tables straight from your models.
In a real project every model change needs `python manage.py makemigrations`, then `migrate`.

## Examples

```python
herbert = Author.objects.create(full_name="Frank Herbert")
central = Branch.objects.create(name="Central")
dune = Book.objects.create(author=herbert, branch=central, title="Dune")
dune.tags.add(Tag.objects.create(name="sci-fi"))
str(dune), dune.on_loan            # ("Dune by Frank Herbert", False)
herbert.books.count()              # 1
central.delete()                   # ProtectedError: Dune still sits there
herbert.delete()                   # deletes Dune too
```

Watch for the lesson's pitfall: the `ForeignKey` goes on the many side, so `Book` holds `author`, never the other way round.
`on_delete` is required: `CASCADE` deletes the books with their author, `PROTECT` refuses the delete.

## Run the tests

```bash
cd exercises/backend/dj_models
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
Every test fails until you write the models.
When they all pass, tick the exercise done in Recall under Progress, Topics.
