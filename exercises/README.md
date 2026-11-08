# Exercises

Small coding exercises to do in your own editor, one per topic: Python for the Backend course, PySpark for Databricks, Python with DuckDB for Data Engineering, and HTML, CSS, JavaScript, React and TypeScript for Web Dev.
Each one follows a topic's lesson and questions in Recall: the app shows the task and the folder to open, and you tick it done yourself.
Nothing runs in the browser.

## Setup (once)

From the repository root:

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r exercises/requirements.txt
```

`requirements.txt` pins pytest, which every exercise uses, and Django, pytest-django, Django REST Framework, drf-spectacular, Celery, redis-py, fakeredis, factory_boy, Faker and Channels (with Daphne), which only the Django exercises (`exercises/backend/dj_*`) need, pyspark and delta-spark, which only the Databricks exercises need, with pandas and pyarrow for their pandas UDFs, and DuckDB, which the Data Engineering exercises that run SQL need.
Python 3.10 or newer runs the Backend and Data Engineering ones, and 3.10 to 3.12 is the safe range for the Spark ones.
In VS Code, pick the `.venv` interpreter so its test runner finds pytest too.

The Web Dev exercises need Node instead (24.15 or newer, or 22.22 or newer) and are set up on their own: `cd exercises/web_dev && npm ci`.

## Databricks exercises

The exercises under `exercises/databricks/` run PySpark and Delta Lake locally, so they also need Java 17 or newer.
See `exercises/databricks/README.md` for the setup and for what differs from a Databricks workspace.

## Data Engineering exercises

The exercises under `exercises/data_engineering/` practise the decisions of the Data Engineering course's lessons on small tables.
Some are plain Python; the rest run SQL on DuckDB, an in-process database the tests open in memory, so there is no server or warehouse to start.
DuckDB's SQL is close to the lessons' T-SQL: parameters are written `?`, and a transaction is `BEGIN TRANSACTION` then `COMMIT` or `ROLLBACK`.
Not every topic has one: the course outline gives an exercise to the topics where writing the load or the plan yourself teaches more than another card.

## Web Dev exercises

The exercises under `exercises/web_dev/` are HTML, CSS, JavaScript, React components and TypeScript, tested with Vitest on Node, with jsdom standing in for the browser, React Testing Library rendering the components, and the TypeScript compiler checking the types.
Each one runs with `npm test` from its folder instead of `pytest`.
See `exercises/web_dev/README.md` for the setup and for how the tests read a page, a component and your types.

## Django exercises

Each Django exercise folder holds one Django app and a `conftest.py` that sets Django up from the shared settings in `exercises/backend/exercise_settings.py`; leave `conftest.py` and the settings as they are.
The exceptions are `dj_cicd`, which holds a GitHub Actions workflow instead of an app, and `dj_nginx`, which holds an Nginx config: their tests read the file as YAML or as text and need no Django.
`dj_settings` holds a settings package rather than an app, which its tests import under environment variables they set.
The tests run on an SQLite database that lives in memory for the test run, so there is no server or database to start, and Django's test client sends the requests.
`dj_channels` opens its WebSockets with Channels' `WebsocketCommunicator` on the in-memory channel layer, in the test process, so there is no ASGI server or Redis to start either.
Run from inside an exercise folder, only that folder's app is installed, so a half-finished exercise elsewhere cannot break the one you are on.

## Doing an exercise

```bash
cd exercises/backend/py_basics
pytest
```

1. Read the folder's `README.md` for the task and examples.
2. Fill in the starter file: it has the function signatures, docstrings and `TODO`s.
3. Run `pytest` from that folder (`npm test` for a Web Dev exercise).
   Every test fails on the untouched starter, and they all pass once your answer is right.
4. Tick the exercise done in Recall, under Progress, Topics.

To start an exercise again, restore its folder: `git checkout -- exercises/backend/py_basics`.

## Layout

```
exercises/
  <course>/<topic>/          one exercise per topic (topic = the app's topic key)
    README.md                task, examples, how to run
    <module>.py              the starter you fill in
    test_<module>.py         the pytest tests
    <module>.test.js         or, for Web Dev, the Vitest tests (.test.jsx for React, .test.ts for TypeScript)
  backend/exercise_settings.py  the Django settings every Django exercise shares
  databricks/spark_setup.py  the local Spark session every Databricks exercise shares
  web_dev/package.json       the Node packages the Web Dev exercises need, with their lock file
  web_dev/page.js            loads a Web Dev exercise's page into jsdom for its tests
  web_dev/typecheck.js       runs the TypeScript compiler over a TypeScript exercise for its tests
  web_dev/tsconfig.json      the strict TypeScript settings, shared by VS Code and typecheck.js
  solutions/<course>/<topic>/  reference solutions, laid over the starter files
  check_exercises.py         checks every exercise (see below)
  requirements.txt           the packages to install, pinned
```

The reference solutions sit apart from the exercises so that opening an exercise folder never shows the answer.
Look at one only once your own answer passes, or when you are stuck for good.

## Checking the exercises (for authors)

```bash
python exercises/check_exercises.py
```

For every exercise it runs the tests on a copy of the starter, where each test must fail, and on a copy with the reference solution laid over it, where each test must pass.
It works on copies, so your own answers are left alone, and it skips the starter check for an exercise you have already edited.
Name a course or an exercise to check just that: `python exercises/check_exercises.py databricks`, `data_engineering` or `databricks/delta_lake_basics`.
The Databricks exercises are checked together in one Spark session, all starters and then all solutions, because starting Spark is slow.
The Web Dev exercises are checked together the same way, in one Vitest run each, which needs Node and `npm ci` done in `exercises/web_dev`.
The app's `npm test` runs it too (`src/data/exercises/exercises.test.ts`), so an exercise cannot drift from its solution unnoticed.
