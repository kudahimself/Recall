/**
 * Every exercise, in course order: one per topic, done in the learner's own
 * editor after the topic's lesson and ramp. The files live in the repo's
 * exercises/ folder (see exercises/README.md); this list is what the app shows.
 * Written one section per PR, like the lessons: Backend (Python) Fundamentals so far.
 *
 * exercises.test.ts keeps it in step with the folders (title, starter, tests)
 * and runs exercises/check_exercises.py, so every exercise's tests fail on its
 * starter and pass on its reference solution.
 */
import { Topic, TopicExercise } from '../../types';

/** One paragraph from its sentences, one per source line. */
const lines = (...sentences: string[]) => sentences.join('\n');

export const EXERCISES: TopicExercise[] = [
  {
    id: 'py_basics',
    topicKeys: [Topic.PY_BASICS],
    title: 'Shelf labels',
    folder: 'exercises/backend/py_basics',
    starter: ['labels.py'],
    tests: 'test_labels.py',
    minutes: 15,
    task: lines(
      'Turn messy catalogue text into shelf labels with five small functions.',
      'Clean a title, build a shelf code from its first letters, parse `"310 pages"` into a number, show a reading time in hours and minutes with `//` and `%`, and average page counts as a float.',
    ),
  },
  {
    id: 'py_data_structures',
    topicKeys: [Topic.PY_DATA_STRUCTURES],
    title: 'Loan lists',
    folder: 'exercises/backend/py_data_structures',
    starter: ['loans.py'],
    tests: 'test_loans.py',
    minutes: 20,
    task: lines(
      'Answer questions about a list of loans, picking the structure that fits each one.',
      'Sort the unique titles without changing the list, count loans per title in a dict, add up fines with `.get`, find titles two lists share with a set, unpack an `(aisle, shelf)` tuple and take the last three loans newest first.',
    ),
  },
  {
    id: 'py_functions',
    topicKeys: [Topic.PY_FUNCTIONS],
    title: 'Late fees',
    folder: 'exercises/backend/py_functions',
    starter: ['fees.py'],
    tests: 'test_fees.py',
    minutes: 20,
    task: lines(
      'Write the library\'s fee helpers.',
      'A fee with a default rate a caller can override by name, a total over any number of loans with `*args`, a description built from `**kwargs`, and a holds list that does not fall into the shared-default trap.',
    ),
  },
  {
    id: 'py_oop',
    topicKeys: [Topic.PY_OOP],
    title: 'Library items',
    folder: 'exercises/backend/py_oop',
    starter: ['items.py'],
    tests: 'test_items.py',
    minutes: 20,
    task: lines(
      'Model what the library lends with two classes.',
      'An `Item` with its own holds list, a `label()` method and a class variable for the loan period, then a `Dvd` subclass that reuses `Item` through `super()` and overrides both.',
    ),
  },
  {
    id: 'py_modules',
    topicKeys: [Topic.PY_MODULES],
    title: 'Library package',
    folder: 'exercises/backend/py_modules',
    starter: ['library/__init__.py', 'library/fees.py', 'library/report.py'],
    tests: 'test_library.py',
    minutes: 20,
    task: lines(
      'Finish a small package of two modules.',
      'Import `ceil` from `math`, re-export the fee functions from the package\'s `__init__.py`, and fix the report module so importing it prints nothing while `python -m library.report` still prints the report.',
    ),
  },
  {
    id: 'py_file_io',
    topicKeys: [Topic.PY_FILE_IO],
    title: 'Loan log',
    folder: 'exercises/backend/py_file_io',
    starter: ['loan_log.py'],
    tests: 'test_loan_log.py',
    minutes: 20,
    task: lines(
      'Keep a log of loans in a text file, one title per line.',
      'Save a list with `"w"`, add a line with `"a"`, read the titles back without newlines, read only the first line, and walk the file line by line for the longest title.',
    ),
  },
  {
    id: 'py_error_handling',
    topicKeys: [Topic.PY_ERROR_HANDLING],
    title: 'Renewals',
    folder: 'exercises/backend/py_error_handling',
    starter: ['renewals.py'],
    tests: 'test_renewals.py',
    minutes: 20,
    task: lines(
      'Renew loans up to a limit, with an exception type of your own.',
      'Parse a number of days and raise `ValueError` with a clear message, raise `RenewalError` for a refused renewal, and renew a batch that catches only `RenewalError`, so real bugs still surface.',
    ),
  },
  {
    id: 'py_decorators',
    topicKeys: [Topic.PY_DECORATORS],
    title: 'Checked and logged',
    folder: 'exercises/backend/py_decorators',
    starter: ['decorators.py'],
    tests: 'test_decorators.py',
    minutes: 25,
    task: lines(
      'Write two decorators and stack them.',
      '`logged` records every call before making it, `require_positive` refuses arguments of 0 or less, both keep the function\'s name with `functools.wraps`, and the stacking order must keep refused calls out of the log.',
    ),
  },
];
