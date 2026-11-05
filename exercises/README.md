# Exercises

Small coding exercises to do in your own editor, one per Python topic.
Each one follows a topic's lesson and questions in Recall: the app shows the task and the folder to open, and you tick it done yourself.
Nothing runs in the browser.

## Setup (once)

From the repository root:

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install pytest
```

Plain Python 3 and pytest are all you need.
In VS Code, pick the `.venv` interpreter so its test runner finds pytest too.

## Doing an exercise

```bash
cd exercises/backend/py_basics
pytest
```

1. Read the folder's `README.md` for the task and examples.
2. Fill in the starter file: it has the function signatures, docstrings and `TODO`s.
3. Run `pytest` from that folder.
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
  solutions/<course>/<topic>/  reference solutions, laid over the starter files
  check_exercises.py         checks every exercise (see below)
```

The reference solutions sit apart from the exercises so that opening an exercise folder never shows the answer.
Look at one only once your own answer passes, or when you are stuck for good.

## Checking the exercises (for authors)

```bash
python exercises/check_exercises.py
```

For every exercise it runs the tests on a copy of the starter, where each test must fail, and on a copy with the reference solution laid over it, where each test must pass.
It works on copies, so your own answers are left alone, and it skips the starter check for an exercise you have already edited.
The app's `npm test` runs it too (`src/data/exercises/exercises.test.ts`), so an exercise cannot drift from its solution unnoticed.
