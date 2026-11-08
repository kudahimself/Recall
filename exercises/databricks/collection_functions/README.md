# Tag lists

Topic: Collection Functions (Databricks, ELT with Spark SQL & Python).
Time: about 20 minutes.

## Task

An array column holds a list in each row and a map column holds key-value pairs, and `explode` turns an array into one row per element.
In `tag_lists.py` you work with a book catalogue whose `tags` column is an array of strings, sometimes empty:

- `add_tag_count(books)` adds `n_tags`, the number of tags per book.
- `add_sorted_tags(books)` adds `tags_sorted`, each book's tags sorted A to Z.
- `titles_with_tag(books, tag)` returns the titles that have the tag, sorted, as a Python list.
- `tag_rows(books)` returns `title` and `tag` columns with one row per tag, so a book with no tags disappears.
- `tag_rows_keep_all(books)` does the same but keeps a book with an empty or null list, giving it a null tag.
- `add_copies_map(stock)` takes `title`, `leeds` and `york` copy counts and adds `copies`, a map such as `{"leeds": 2, "york": 0}`.

## Examples

```python
# Dune has tags ["scifi", "classic"], Blank has []
tag_rows(books)             # (Dune, scifi), (Dune, classic) - no row for Blank
tag_rows_keep_all(books)    # also (Blank, None)
titles_with_tag(books, "scifi")   # ["Dune", ...]
```

Watch for the lesson's pitfall: `explode` makes no rows from an empty or null array, so those parent rows silently vanish.

## What differs on Databricks

Nothing about these functions: arrays, maps and `explode` work the same on a cluster.
In a notebook the tags would more often come from a JSON file or a Delta table with an array column than from tuples in the code.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/collection_functions
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
