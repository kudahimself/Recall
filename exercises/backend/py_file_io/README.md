# Loan log

Topic: File I/O (Backend, Python Fundamentals).
Time: about 20 minutes.

## Task

The library keeps a log of loans in a text file, one title per line.
Fill in the five functions in `loan_log.py`, each taking the file's path:

- `save_loans(path, titles)` writes the titles, replacing whatever the file held.
- `add_loan(path, title)` adds one title at the end and keeps the rest, creating the file if needed.
- `read_loans(path)` returns the titles without their newlines, skipping blank lines.
- `first_loan(path)` reads just the first line, and gives `""` for an empty file.
- `longest_title(path)` walks the file line by line and returns the longest title.

Open every file with `with`, so it is closed even when something fails.

## Examples

```python
save_loans("loans.txt", ["Dune", "Emma"])   # file: "Dune\nEmma\n"
add_loan("loans.txt", "Ubik")               # file: "Dune\nEmma\nUbik\n"
read_loans("loans.txt")                     # ["Dune", "Emma", "Ubik"]
first_loan("loans.txt")                     # "Dune"
longest_title("loans.txt")                  # "Dune" (the first of the four-letter titles)
```

Watch for the lesson's pitfall: opening an existing file with `"w"` empties it at once, so add lines with `"a"`.

## Run the tests

```bash
cd exercises/backend/py_file_io
pytest
```

The tests write their files into a temporary folder, so they never touch your own files.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
