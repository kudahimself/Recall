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
      question: 'Use enumerate, zip, any, and all in realistic scenarios. Write a function process_rows(rows) that takes a list of dicts (CSV-like data). Use enumerate for row numbers in error messages, any() to check if any row has an "error" key, all() to verify all rows have the required fields ["name", "email"]. Return a summary dict.',
      starterCode: `def process_rows(rows):
      """Process CSV-like rows using enumerate, zip, any, all."""
      required_fields = ["name", "email"]
      # Implement using enumerate, any, all
      pass
  `,
      testCases: [
        {
          input: 'List of row dicts',
          expectedOutput: 'Dict with has_errors, all_valid, error_rows using enumerate/any/all',
          description: 'Should use enumerate, any, all for row processing',
        },
      ],
      solution: `def process_rows(rows):
      """Process CSV-like rows using enumerate, zip, any, all."""
      required_fields = ["name", "email"]
  
      # any() — check if ANY row has an error flag
      has_errors = any(row.get("error") for row in rows)
  
      # all() — check if ALL rows have every required field
      all_fields_present = all(
          all(field in row for field in required_fields)
          for row in rows
      )
  
      # enumerate() — track row numbers for error reporting
      error_rows = []
      for row_num, row in enumerate(rows, start=1):
          missing = [f for f in required_fields if f not in row]
          if missing:
              error_rows.append(f"Row {row_num}: missing {', '.join(missing)}")
  
      # zip() — pair field names with counts of non-empty values
      field_names = required_fields
      field_counts = [
          sum(1 for row in rows if row.get(field)) for field in field_names
      ]
      field_summary = dict(zip(field_names, field_counts))
  
      return {
          "has_errors": has_errors,
          "all_fields_present": all_fields_present,
          "error_rows": error_rows,
          "field_summary": field_summary,
      }`,
      explanation: 'These four builtins appear in almost every Python codebase. enumerate() adds an index to any iterable — use it instead of range(len(...)). any() short-circuits on the first truthy value, making it efficient for "does at least one item match?" checks. all() short-circuits on the first falsy value for "do all items match?" checks. zip() pairs elements from multiple iterables — perfect for creating dicts from parallel lists. Together they eliminate most manual loop index tracking and boolean flag patterns.',
      hints: [
        'enumerate(rows, start=1) gives 1-based row numbers',
        'any(gen_expr) stops at the first True — efficient for large lists',
        'all() with nested all() checks all fields in all rows',
        'zip(names, values) creates pairs for dict()',
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
      question: 'Write a function clean_user_input(text) that demonstrates string method mastery: .strip() whitespace, .lower() for case-insensitive comparison, .split() and .join() to normalize multiple spaces, .replace() for character substitution, and .startswith()/.endswith() for validation. Return a dict with each transformation.',
      starterCode: `def clean_user_input(text):
      """Demonstrate all major string methods."""
      # Implement string cleaning pipeline
      pass
  `,
      testCases: [
        {
          input: '"  Hello   World!  "',
          expectedOutput: 'Dict with stripped, lowered, normalized, replaced, validation results',
          description: 'Should demonstrate strip, lower, split, join, replace, startswith, endswith',
        },
      ],
      solution: `def clean_user_input(text):
      """Demonstrate all major string methods."""
  
      # .strip() removes leading/trailing whitespace
      stripped = text.strip()
  
      # .lower() for case-insensitive comparison
      lowered = stripped.lower()
  
      # .split() + .join() normalizes multiple spaces to single
      normalized = " ".join(stripped.split())
  
      # .replace() for character substitution
      slug = normalized.lower().replace(" ", "-").replace("!", "")
  
      # .startswith() / .endswith() for validation
      is_greeting = lowered.startswith("hello")
      is_exclamation = stripped.endswith("!")
  
      # Chain methods for a full cleaning pipeline
      cleaned = (
          text
          .strip()
          .lower()
          .replace("\\t", " ")
          .replace("\\n", " ")
      )
      cleaned = " ".join(cleaned.split())  # normalize whitespace
  
      return {
          "stripped": stripped,
          "lowered": lowered,
          "normalized": normalized,
          "slug": slug,
          "is_greeting": is_greeting,
          "is_exclamation": is_exclamation,
          "cleaned": cleaned,
      }`,
      explanation: 'String methods are non-mutating — each returns a new string, so they chain naturally. .strip() is essential for user input that may have leading/trailing whitespace or newlines. The .split() without arguments splits on any whitespace and removes empty strings, so "  hello   world  ".split() gives ["hello", "world"]. Joining with " ".join() normalizes any amount of whitespace to a single space. .startswith() and .endswith() accept tuples for checking multiple prefixes/suffixes: name.endswith((".jpg", ".png")).',
      hints: [
        '.split() with no args splits on any whitespace and removes empties',
        '" ".join(text.split()) is the standard whitespace normalizer',
        '.startswith(("http", "https")) accepts a tuple of prefixes',
        'String methods never modify the original — always return new strings',
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
      question: 'What does any([]) return vs all([])?',
      options: [
        { id: 'a', text: 'Both return True for empty lists', isCorrect: false },
        { id: 'b', text: 'Both return False for empty lists', isCorrect: false },
        { id: 'c', text: 'any([]) returns False (no truthy elements exist). all([]) returns True (no falsy elements exist — vacuous truth). This is a common gotcha in validation logic.', isCorrect: true },
        { id: 'd', text: 'Both raise a ValueError for empty iterables', isCorrect: false },
      ],
      explanation: 'any() asks "is at least one element truthy?" — with zero elements, the answer is False because there are no truthy elements. all() asks "are all elements truthy?" — with zero elements, the answer is True because there are no falsy elements to violate the condition (vacuous truth from formal logic). This matters in validation: all(field in row for field in required_fields) returns True when required_fields is empty, which might not be what you expect. Always check for empty inputs separately when using all().',
      tags: ['any', 'all', 'python-builtins', 'gotchas'],
      concepts: ['py-iterator-protocol'],
    },
  {
      id: 'be-infra-patterns-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DAILY_PATTERNS,
      course: Course.BACKEND,
      question: 'What is the difference between sorted(data, key=...) and data.sort(key=...)?',
      options: [
        { id: 'a', text: 'They are identical — sorted() is just an alias for .sort()', isCorrect: false },
        { id: 'b', text: 'sorted() only works with numbers, .sort() works with any type', isCorrect: false },
        { id: 'c', text: '.sort() is faster because it creates a copy first', isCorrect: false },
        { id: 'd', text: 'sorted() returns a new list and works on any iterable. .sort() mutates the list in-place and only works on list objects. Use sorted() for functional style; .sort() when you do not need the original order.', isCorrect: true },
      ],
      explanation: 'sorted() is a built-in function that accepts any iterable (list, tuple, generator, dict) and always returns a new list. .sort() is a list method that modifies the list in-place and returns None. This means you cannot chain .sort(): data.sort().filter() fails because .sort() returns None. sorted() enables chaining: sorted(data, key=...)[:5]. Use .sort() when working with a list you own and want to save memory by avoiding a copy. Use sorted() everywhere else.',
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
      question: 'Use operator.itemgetter and operator.attrgetter for sorting. Sort a list of dicts by multiple keys (primary: department, secondary: salary descending). Sort a list of objects by attribute. Show both operator approaches and compare them to lambda equivalents.',
      starterCode: `# Import itemgetter and attrgetter from operator
# Build the employees list of dicts from the prompt
# Sort by department then salary (descending) using itemgetter;
# also demonstrate attrgetter on a list of namedtuple/object equivalents
# and a lambda version for comparison
`,
      testCases: [
        {
          input: 'List of employee dicts',
          expectedOutput: 'Sorted by department then salary using itemgetter and attrgetter',
          description: 'Should demonstrate itemgetter and attrgetter for sorting',
        },
      ],
      solution: `from operator import itemgetter, attrgetter


employees = [
    {"name": "Alice", "department": "Engineering", "salary": 95000},
    {"name": "Bob", "department": "Marketing", "salary": 72000},
    {"name": "Charlie", "department": "Engineering", "salary": 110000},
    {"name": "Diana", "department": "Marketing", "salary": 85000},
]

# --- itemgetter for dicts ---

# Sort by single key
by_salary = sorted(employees, key=itemgetter("salary"))

# Sort by department (asc), then by salary (asc)
by_dept_salary = sorted(employees, key=itemgetter("department", "salary"))

# Lambda equivalent (less readable for multiple keys)
by_dept_salary_lambda = sorted(employees, key=lambda e: (e["department"], e["salary"]))


# --- attrgetter for objects ---

class Employee:
    def __init__(self, name, department, salary):
        self.name = name
        self.department = department
        self.salary = salary

    def __repr__(self):
        return f"Employee({self.name}, {self.department}, {self.salary})"


team = [
    Employee("Alice", "Engineering", 95000),
    Employee("Bob", "Marketing", 72000),
    Employee("Charlie", "Engineering", 110000),
    Employee("Diana", "Marketing", 85000),
]

# Sort by attribute
by_name = sorted(team, key=attrgetter("name"))

# Sort by department, then salary
by_dept = sorted(team, key=attrgetter("department", "salary"))

# Lambda equivalent
by_dept_lambda = sorted(team, key=lambda e: (e.department, e.salary))

# For descending on one key: use reverse or negate numeric values
highest_paid = sorted(employees, key=itemgetter("salary"), reverse=True)`,
      explanation: 'operator.itemgetter and operator.attrgetter are faster than lambdas because they are implemented in C and avoid Python function call overhead. itemgetter("salary") creates a callable equivalent to lambda x: x["salary"]. With multiple arguments, itemgetter("department", "salary") returns a tuple, enabling multi-key sorting. attrgetter does the same for object attributes. The performance difference is small for short lists but significant when sorting thousands of items. They also improve readability — the intent "sort by these fields" is clearer than a lambda.',
      hints: [
        'itemgetter("a", "b") returns a tuple (x["a"], x["b"])',
        'attrgetter("department") is equivalent to lambda x: x.department',
        'Multiple keys in itemgetter sort by first key, then second on ties',
        'Use reverse=True for descending — works with both approaches',
      ],
      tags: ['itemgetter', 'attrgetter', 'sorting', 'operator', 'python'],
      concepts: ['py-itertools-combinators', 'py-iterator-protocol'],
    },
];
