# Lend command

Topic: CLI Tools & Config (argparse, click, dotenv) (Backend, Python Advanced).
Time: about 25 minutes.

## Task

Build the command line for lending a book, and read its settings from the environment.
Fill in `lend.py`:

- `build_parser()` returns an `argparse.ArgumentParser` with a required positional `title`, a `--days` option that is an `int` and defaults to 14, and a `-v` / `--verbose` flag.
- `main(argv)` parses `argv` with that parser and returns `"Lent <title> for <days> days"`, adding `" via <api url>"` when verbose.
- `api_url()` returns the `LIBRARY_API` environment variable, or `"http://localhost:8000"` when it is not set.
- `load_env_file(path)` is a small stand-in for `dotenv.load_dotenv()`: it reads `KEY=VALUE` lines into `os.environ`, skips blank lines and `#` comments, never overrides a variable that is already set, and returns a dict of the variables it set.

## Examples

```python
args = build_parser().parse_args(["Dune", "--days", "7", "-v"])
args.title, args.days, args.verbose      # ("Dune", 7, True)
build_parser().parse_args(["Dune", "--days", "seven"])   # prints usage, SystemExit(2)

main(["Dune"])                           # "Lent Dune for 14 days"
main(["Emma", "--days", "7", "-v"])      # "Lent Emma for 7 days via http://localhost:8000"

# .env holds: LIBRARY_API=https://books.example.org
load_env_file(".env")                    # {"LIBRARY_API": "https://books.example.org"}
api_url()                                # "https://books.example.org"
```

Try it from the shell too, once the tests pass:

```bash
python lend.py Dune --days 7 --verbose
python lend.py -h
```

Watch for the lesson's pitfall: everything on the command line is text, so `--days 7` without `type=int` gives `"7"`.
Read settings that may be missing with `os.environ.get`, not `os.environ[...]`.

## Run the tests

```bash
cd exercises/backend/py_cli
pytest
```

The tests restore the environment after each test and write their `.env` files into a temporary folder.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
