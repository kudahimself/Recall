/**
 * Topic.PY_DAILY_PATTERNS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendInfraQuestions.ts (5)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_daily_patterns_questions: Question[] = [
  {
      id: 'be-infra-patterns-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DAILY_PATTERNS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write `process_rows(rows)`. `rows` is a list of dicts read from a CSV file, and every row should have the keys `"name"` and `"email"`. Return a dict with four keys: `"has_errors"`, True if any row has an `"error"` key (use `any`); `"all_fields_present"`, True if every row has both required keys (use `all`); `"error_rows"`, one message for each row that lacks a required key, numbered from 1 with `enumerate`, such as `"Row 2: missing email"` or `"Row 3: missing name, email"`; and `"field_summary"`, a dict built with `zip` that maps `"name"` and `"email"` to the number of rows with a non-empty value for that key.',
      starterCode: `def process_rows(rows):
    required_fields = ["name", "email"]
    # Build and return the summary dict
    pass
`,
      testCases: [
        {
          input: '[{"name": "Ada", "email": "a@x.io"}, {"name": "Bo", "error": "bad date"}, {}]',
          expectedOutput: "{'has_errors': True, 'all_fields_present': False, 'error_rows': ['Row 2: missing email', 'Row 3: missing name, email'], 'field_summary': {'name': 2, 'email': 1}}",
          description: 'Flags the error row, the two rows with missing keys and counts the non-empty values',
        },
      ],
      solution: `def process_rows(rows):
    required_fields = ["name", "email"]

    has_errors = any("error" in row for row in rows)

    all_fields_present = all(
        all(field in row for field in required_fields) for row in rows
    )

    error_rows = []
    for row_num, row in enumerate(rows, start=1):
        missing = [field for field in required_fields if field not in row]
        if missing:
            error_rows.append(f"Row {row_num}: missing {', '.join(missing)}")

    counts = [sum(1 for row in rows if row.get(field)) for field in required_fields]
    field_summary = dict(zip(required_fields, counts))

    return {
        "has_errors": has_errors,
        "all_fields_present": all_fields_present,
        "error_rows": error_rows,
        "field_summary": field_summary,
    }`,
      requires: ['any(', 'all(', 'enumerate(', 'zip('],
      tieredHints: {
        apiSignature: 'enumerate(iterable, start=0) -> enumerate',
        skeleton: `def process_rows(rows):
    required_fields = ["name", "email"]

    has_errors = ____

    all_fields_present = ____

    error_rows = []
    for row_num, row in ____:
        missing = ____
        if missing:
            error_rows.append(____)

    counts = ____
    field_summary = ____

    return {____}`,
      },
      explanation: 'These four builtins replace most hand-written loop bookkeeping. `any(...)` stops at the first true test, so `any("error" in row for row in rows)` is True as soon as one row has the key. `all(...)` stops at the first false test, and nesting it checks every field of every row. `enumerate(rows, start=1)` hands out a row number with each row, so there is no `range(len(rows))` and no counter to update. `zip(required_fields, counts)` pairs each field name with its count, and `dict()` turns the pairs into the summary. Note that `all()` of an empty list is True, so an empty file reports every field present.',
      hints: [
        '`enumerate(rows, start=1)` numbers the rows from 1',
        '`any(test for row in rows)` stops at the first True',
        'An `all()` inside another `all()` checks every field of every row',
        '`dict(zip(names, values))` pairs two lists into a dict',
      ],
      tags: ['enumerate', 'zip', 'any', 'all', 'python-builtins'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'be-infra-patterns-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DAILY_PATTERNS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write `clean_user_input(text)`, which cleans a line a user typed and returns a dict with six keys: `"stripped"`, the text without leading or trailing whitespace; `"lowered"`, the stripped text in lowercase; `"normalized"`, the stripped text with every run of whitespace turned into one space (use `split` and `join`); `"slug"`, the normalized text in lowercase with each space replaced by `-` and every `!` removed; `"is_greeting"`, True if the lowered text starts with `"hello"` (use `startswith`); and `"is_exclamation"`, True if the stripped text ends with `"!"` (use `endswith`). For example, `"  Hello   World!  "` gives `"Hello World!"` as `"normalized"` and `"hello-world"` as `"slug"`.',
      starterCode: `def clean_user_input(text):
    # Build and return the dict of cleaned forms
    pass
`,
      testCases: [
        {
          input: '"  Hello   World!  "',
          expectedOutput: "{'stripped': 'Hello   World!', 'lowered': 'hello   world!', 'normalized': 'Hello World!', 'slug': 'hello-world', 'is_greeting': True, 'is_exclamation': True}",
          description: 'Strips, lowercases, collapses spaces, builds the slug and runs both checks',
        },
      ],
      solution: `def clean_user_input(text):
    stripped = text.strip()
    lowered = stripped.lower()
    normalized = " ".join(stripped.split())
    slug = normalized.lower().replace(" ", "-").replace("!", "")
    is_greeting = lowered.startswith("hello")
    is_exclamation = stripped.endswith("!")
    return {
        "stripped": stripped,
        "lowered": lowered,
        "normalized": normalized,
        "slug": slug,
        "is_greeting": is_greeting,
        "is_exclamation": is_exclamation,
    }`,
      requires: ['.split(', '.join(', 'startswith(', 'endswith('],
      tieredHints: {
        apiSignature: 'str.split(sep=None, maxsplit=-1) -> list[str]',
        skeleton: `def clean_user_input(text):
    stripped = ____
    lowered = ____
    normalized = ____
    slug = ____
    is_greeting = ____
    is_exclamation = ____
    return {____}`,
      },
      explanation: 'String methods never change the string; each returns a new one, so they chain: `normalized.lower().replace(" ", "-")` lowercases first and then swaps the spaces. `.strip()` drops leading and trailing whitespace, newlines included. `.split()` with no argument splits on any run of whitespace and drops the empty pieces, so `"  hello   world  ".split()` is `["hello", "world"]`, and `" ".join(...)` puts exactly one space between the words. `.startswith()` and `.endswith()` return booleans and also accept a tuple of options, as in `name.endswith((".jpg", ".png"))`.',
      hints: [
        '`.split()` with no argument splits on any whitespace and drops the empty pieces',
        '`" ".join(words)` puts one space between the words',
        'Each `.replace()` call returns a new string, so two calls chain',
        'String methods never change the original string',
      ],
      tags: ['strings', 'strip', 'split', 'join', 'python-builtins'],
      concepts: ['py-string-formatting', 'dj-orm-query-construction'],
    },
  {
      id: 'be-infra-patterns-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DAILY_PATTERNS,
      course: Course.BACKEND,
      question: 'What do `any([])` and `all([])` return?',
      options: [
        { id: 'a', text: 'Both return True: with no elements, nothing can make either check fail', isCorrect: false },
        { id: 'b', text: 'Both return False: with no elements, neither check has anything to pass', isCorrect: false },
        { id: 'c', text: '`any([])` is False (no element is truthy) and `all([])` is True (no element is falsy)', isCorrect: true },
        { id: 'd', text: 'Both raise ValueError, the same way `max([])` does on an empty list', isCorrect: false },
      ],
      explanation: '`any()` asks "is at least one element truthy?"; with no elements the answer is False, because there is nothing to find. `all()` asks "is no element falsy?"; with no elements the answer is True, because nothing breaks the rule (vacuous truth). Neither raises, unlike `max([])`. This matters in validation: `all(field in row for field in required_fields)` is True when `required_fields` is empty, so when an empty input should not count as valid, check for it separately.',
      tags: ['any', 'all', 'python-builtins', 'gotchas'],
      concepts: ['py-iterator-protocol'],
    },
  {
      id: 'be-infra-patterns-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DAILY_PATTERNS,
      course: Course.BACKEND,
      question: 'What is the difference between `sorted(data, key=...)` and `data.sort(key=...)`?',
      options: [
        { id: 'a', text: 'None: both return a new sorted list and leave `data` in its original order', isCorrect: false },
        { id: 'b', text: '`sorted()` reorders `data` in place, while `.sort()` returns a sorted copy and leaves `data` alone', isCorrect: false },
        { id: 'c', text: '`sorted()` works only on lists, while `.sort()` is available on any iterable, tuples included', isCorrect: false },
        { id: 'd', text: '`sorted()` takes any iterable and returns a new list; `.sort()` reorders a list in place and returns `None`', isCorrect: true },
      ],
      explanation: '`sorted()` is a built-in function: it accepts any iterable (a list, tuple, string, generator, or a dict, whose keys it sorts) and always returns a new list. `.sort()` is a list method: it reorders that list in place and returns `None`, so `top = data.sort()` sets `top` to `None` and `data.sort()[0]` raises a TypeError, while `sorted(data)[:5]` works. Use `.sort()` as a statement on a list you own when you do not need the old order; use `sorted()` whenever you want the result as a value.',
      tags: ['sorted', 'sort', 'python-builtins', 'functional'],
      concepts: ['py-iterator-protocol'],
    },
  {
      id: 'be-infra-patterns-5',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DAILY_PATTERNS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: '`employees` is a list of dicts with the keys `"name"`, `"department"` and `"salary"`, and `team` is a list of `Employee` objects with the attributes `name`, `department` and `salary`; both already exist. Import what you need from `operator` and build three new sorted lists, leaving the originals unchanged: `by_dept_salary`, the employees sorted by department and then by salary, both ascending, using an `itemgetter` key; `by_dept_top_paid`, the employees sorted by department ascending and then by salary from highest to lowest, using a lambda that returns a tuple; and `team_by_name`, the `Employee` objects sorted by name, using an `attrgetter` key.',
      starterCode: `# employees (a list of dicts) and team (a list of Employee objects) already exist
`,
      testCases: [
        {
          input: 'Alice (Engineering, 95000), Bob (Marketing, 72000), Charlie (Engineering, 110000), Diana (Marketing, 85000)',
          expectedOutput: 'by_dept_salary: Alice, Charlie, Bob, Diana; by_dept_top_paid: Charlie, Alice, Diana, Bob; team_by_name: Alice, Bob, Charlie, Diana',
          description: 'Sorts by two keys with itemgetter, mixes descending and ascending with a tuple key, and sorts objects with attrgetter',
        },
      ],
      solution: `from operator import itemgetter, attrgetter

by_dept_salary = sorted(employees, key=itemgetter("department", "salary"))
by_dept_top_paid = sorted(employees, key=lambda e: (e["department"], -e["salary"]))
team_by_name = sorted(team, key=attrgetter("name"))
# OR
import operator

by_dept_salary = sorted(employees, key=operator.itemgetter("department", "salary"))
by_dept_top_paid = sorted(employees, key=lambda e: (e["department"], -e["salary"]))
team_by_name = sorted(team, key=operator.attrgetter("name"))`,
      requires: ['itemgetter(', 'attrgetter(', 'lambda'],
      tieredHints: {
        apiSignature: 'operator.itemgetter(*items)',
        skeleton: `from operator import ____, ____

by_dept_salary = sorted(employees, key=____)
by_dept_top_paid = sorted(employees, key=lambda e: (____, ____))
team_by_name = sorted(team, key=____)`,
      },
      explanation: '`itemgetter("department", "salary")` builds a key function that returns the tuple `(row["department"], row["salary"])`, and tuples compare field by field, so rows sort by department and break ties by salary. `attrgetter("name")` does the same for an attribute, like `lambda e: e.name`. Neither can sort one field down and another up, so the mixed order needs a lambda that negates the number: `(e["department"], -e["salary"])` keeps departments A to Z and puts the highest salary first inside each. `reverse=True` would flip both fields. The operator helpers run in C, so they are a little faster than the matching lambda, and they read as "sort by these fields".',
      hints: [
        '`itemgetter("a", "b")` returns the tuple `(x["a"], x["b"])` for each row',
        '`attrgetter("name")` works like `lambda e: e.name`',
        'Negating a number in a tuple key sorts that field from highest to lowest',
        '`sorted()` returns a new list and leaves the original alone',
      ],
      tags: ['itemgetter', 'attrgetter', 'sorting', 'operator', 'python'],
      concepts: ['py-itertools-combinators', 'py-iterator-protocol'],
    },
  {
      id: 'py-patterns-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DAILY_PATTERNS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print? Type the three printed lines, exactly as Python prints them.',
      code: `scores = [70, 95, 82]
ranked = scores.sort(reverse=True)
print(ranked)
print(scores)
print(sorted("cab"))`,
      expectedOutput: `None
[95, 82, 70]
['a', 'b', 'c']`,
      explanation: '`.sort()` sorts the list in place and returns `None`, so `ranked` is `None` while `scores` itself is now in descending order. `sorted()` takes any iterable, a string included, and always returns a new list, here of its characters. Writing `ranked = scores.sort()` and then using `ranked` is the usual bug: keep the list you sorted, or call `sorted()` when you want the result.',
      hints: ['`.sort()` changes the list and returns nothing.', '`sorted()` accepts any iterable and returns a new list.'],
      tags: ['sorted', 'sort', 'python-builtins', 'predict'],
      concepts: ['py-iterator-protocol'],
    },
];
