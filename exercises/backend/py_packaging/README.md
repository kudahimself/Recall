# Loan tool project

Topic: Packaging & Environments (venv, pyproject, uv) (Backend, Python Advanced).
Time: about 20 minutes.
Needs Python 3.11 or newer, for the standard library's `tomllib`.

## Task

`loan_tool/` is a small package that is not a project yet.
Describe it in `pyproject.toml`, then finish `loan_tool/cli.py`, which reads its own settings from that file:

- `[project]`: the name `loan-tool`, version `0.3.0`, `requires-python` of 3.11 or newer, and one dependency, `requests` version 2.31 or newer, written as a range.
- `[project.scripts]`: a `loans` command that runs `main` in `loan_tool/cli.py`.
- `[tool.loan_tool]`: the tool's own setting, `default_days = 14`.
- In `cli.py`, `default_days(path)` reads that setting (14 when the table or key is missing), `in_virtualenv()` tells whether Python runs inside a virtual environment, and `main()` prints the version and the loan period.

## Examples

```toml
[project]
name = "loan-tool"
...
```

```python
default_days()          # 14, read from pyproject.toml
in_virtualenv()         # True inside an activated .venv, False in the system Python
main([])                # prints "loan-tool 0.3.0: loans last 14 days", returns 0
```

Watch for the lesson's pitfall: `pyproject.toml` holds ranges such as `requests>=2.31`, so two installs on different days can get different versions.
A real project also commits a lockfile, such as `uv.lock`, and deploys from it.

## Run the tests

```bash
cd exercises/backend/py_packaging
pytest
```

Every test fails until you fill in `pyproject.toml` and `cli.py`.
When they all pass, tick the exercise done in Recall under Progress, Topics.

## Try it (optional)

With your `.venv` active, `pip install -e .` from this folder installs the project in editable mode and creates the `loans` command.
It also installs `requests`, the dependency you declared.
Run `loans`, then `pip uninstall loan-tool` to remove it again.
