# Shelf labels

Topic: Variables, Types & Strings (Backend, Python Fundamentals).
Time: about 15 minutes.

## Task

The library prints a label for each book from messy catalogue text.
Fill in the five functions in `labels.py`:

- `clean_title(raw)` strips the surrounding spaces and capitalises each word.
- `shelf_code(title, shelf)` builds a code from the first three letters of the cleaned title, in capitals, and the shelf number.
- `parse_pages(text)` turns text such as `"310 pages"` into the number `310`.
- `reading_time(pages, pages_per_hour)` says how long a book takes, in whole minutes rounded down, as hours and minutes.
- `average_pages(total_pages, books)` gives the average as a float, even when it divides exactly.

## Examples

```python
clean_title("  the hobbit ")   # "The Hobbit"
shelf_code("  dune ", 4)       # "DUN-4"
parse_pages("310 pages")       # 310
reading_time(310, 40)          # "7 h 45 min"
average_pages(900, 3)          # 300.0
```

## Run the tests

```bash
cd exercises/backend/py_basics
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
