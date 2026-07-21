/**
 * Topic.PY_BASICS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendAdvancedQuestions.ts (4), backendQuestions.ts (4), pyBasicsClozeQuestions.ts (10), pyBasicsMisconceptionMCQs.ts (10), pyBasicsParsonsQuestions.ts (10), pyBasicsPredictOutputQuestions.ts (10), pythonEssentialsQuestions.ts (45)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_basics_questions: Question[] = [
  {
      id: 'be-sql-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.SQL,
      question: 'Create a PostgreSQL table "users" with columns: id (auto-incrementing primary key), username (varchar 50, not null, unique), email (varchar 100, not null), created_at (timestamp, default current timestamp).\n\nPostgreSQL uses SERIAL for auto-incrementing integers (MySQL uses AUTO_INCREMENT, SQLite uses AUTOINCREMENT). Django handles this automatically with AutoField, but you need to know the raw SQL for migrations and debugging.',
      starterCode: `-- Create users table (PostgreSQL syntax)\n`,
      testCases: [
        {
          input: 'users table',
          expectedOutput: 'CREATE TABLE users with PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT',
          description: 'Should create table with constraints',
        },
      ],
      solution: `CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  username VARCHAR(50) NOT NULL UNIQUE,\n  email VARCHAR(100) NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`,
      tieredHints: {
        apiSignature: 'CREATE TABLE name (col TYPE CONSTRAINTS, ...)',
        skeleton: `CREATE TABLE users (
  id ____ PRIMARY KEY,
  username VARCHAR(____) NOT NULL ____,
  email VARCHAR(____) NOT NULL,
  created_at TIMESTAMP DEFAULT ____
);`,
      },
      explanation: 'SERIAL auto-increments (PostgreSQL). PRIMARY KEY uniquely identifies rows. NOT NULL prevents empty values. UNIQUE prevents duplicates. DEFAULT sets a value when none is provided. These constraints enforce data integrity at the database level.',
      hints: ['SERIAL = auto-increment in PostgreSQL', 'PRIMARY KEY = unique + not null', 'DEFAULT CURRENT_TIMESTAMP for auto-dating'],
      tags: ['sql', 'create-table', 'constraints', 'database'],
      concepts: ['dj-orm-query-construction', 'dj-model-construction'],
    },
  {
      id: 'be-sql-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.SQL,
      question: 'Write a SQL query to find the top 5 users by order count using the "users" table (id, username) and "orders" table (id, user_id, total). Join them, group by user, and order by count descending.',
      starterCode: `-- Top 5 users by order count\n`,
      testCases: [
        {
          input: 'users and orders tables',
          expectedOutput: 'JOIN, GROUP BY, COUNT, ORDER BY DESC, LIMIT 5',
          description: 'Should find top users by orders',
        },
      ],
      solution: `SELECT u.username, COUNT(o.id) as order_count\nFROM users u\nJOIN orders o ON u.id = o.user_id\nGROUP BY u.username\nORDER BY order_count DESC\nLIMIT 5;`,
      tieredHints: {
        apiSignature: 'JOIN table alias ON left = right',
        skeleton: `SELECT u.username, ____(o.id) as order_count
FROM users u
____ orders o ON u.id = o.____
____ BY u.username
____ BY order_count ____
LIMIT ____;`,
      },
      explanation: 'JOIN connects users to their orders. GROUP BY aggregates per user. COUNT counts orders per user. ORDER BY DESC sorts highest first. LIMIT 5 returns only top 5. This is a fundamental analytics query pattern.',
      hints: ['JOIN to connect tables', 'GROUP BY + COUNT for aggregation', 'ORDER BY DESC LIMIT 5 for top N'],
      tags: ['sql', 'join', 'aggregation', 'group-by', 'database'],
      concepts: ['dj-orm-query-construction'],
    },
  {
      id: 'be-sql-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.SQL,
      question: 'Create an index on the "orders" table for the "user_id" column and a composite index on "status" and "created_at" for faster queries.',
      starterCode: `-- Create indexes\n`,
      testCases: [
        {
          input: 'orders table',
          expectedOutput: 'CREATE INDEX on user_id and composite on status, created_at',
          description: 'Should create indexes',
        },
      ],
      solution: `CREATE INDEX idx_orders_user_id ON orders(user_id);\nCREATE INDEX idx_orders_status_date ON orders(status, created_at);`,
      tieredHints: {
        apiSignature: 'CREATE INDEX name ON table(col1, col2, ...)',
        skeleton: `CREATE INDEX ____ ON orders(____);
CREATE INDEX ____ ON orders(____, ____);`,
      },
      explanation: 'Indexes speed up queries on indexed columns (like WHERE user_id = 1). Composite indexes help queries that filter on multiple columns (WHERE status = "active" AND created_at > ...). Trade-off: faster reads, slower writes, more storage.',
      hints: ['CREATE INDEX name ON table(column)', 'Composite: ON table(col1, col2)', 'Column order matters in composite indexes'],
      tags: ['sql', 'index', 'performance', 'database'],
      concepts: ['dj-orm-query-construction', 'inf-postgres'],
    },
  {
      id: 'be-sql-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What is the N+1 query problem in Django?',
      options: [
        { id: 'a', text: 'When accessing related objects in a loop causes 1 query for the list + N queries for each related object. Fix with select_related() or prefetch_related().', isCorrect: true },
        { id: 'b', text: 'When a query returns N+1 results', isCorrect: false },
        { id: 'c', text: 'When the database has too many indexes', isCorrect: false },
        { id: 'd', text: 'When N+1 tables are joined', isCorrect: false },
      ],
      explanation: 'Article.objects.all() then accessing article.author in a loop runs N extra queries. select_related("author") adds a JOIN (for ForeignKey). prefetch_related("tags") runs a second query with IN clause (for ManyToMany). Both eliminate the N+1 problem.',
      tags: ['n+1', 'select_related', 'prefetch_related', 'django', 'performance'],
      concepts: ['dj-n-plus-one', 'dj-select-related-vs-prefetch'],
    },
  {
      id: 'py-basic-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What is the difference between a mutable and immutable type in Python?',
      options: [
        { id: 'a', text: 'Mutable types (list, dict, set) can be changed after creation. Immutable types (str, int, tuple, frozenset) cannot.', isCorrect: true },
        { id: 'b', text: 'Mutable means faster', isCorrect: false },
        { id: 'c', text: 'Immutable types use less memory', isCorrect: false },
        { id: 'd', text: 'There is no difference', isCorrect: false },
      ],
      explanation: 'Lists, dicts, and sets can be modified in place (append, update, add). Strings, ints, tuples are immutable — operations create new objects. This matters for default arguments, dict keys (must be immutable), and thread safety.',
      tags: ['mutable', 'immutable', 'types', 'python'],
      concepts: ['py-mutable-vs-immutable'],
    },
  {
      id: 'py-basic-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function "is_palindrome" that takes a string and returns True if it reads the same forwards and backwards (case-insensitive). E.g., "Racecar" returns True.',
      starterCode: `def is_palindrome(s):\n`,
      testCases: [
        {
          input: '"Racecar"',
          expectedOutput: 's.lower() == s.lower()[::-1]',
          description: 'Should check palindrome case-insensitively',
        },
      ],
      solution: `def is_palindrome(s):\n    s = s.lower()\n    return s == s[::-1]`,
      tieredHints: {
        apiSignature: 's[start:stop:step] -> str',
        skeleton: `def ____(s):
    s = s.____()
    return s == s[____]`,
      },
      explanation: 's[::-1] reverses a string using slice notation [start:stop:step] with step=-1. .lower() normalises case. This is the Pythonic way to reverse sequences.',
      hints: ['Use s[::-1] to reverse a string', 'Convert to lowercase first with .lower()'],
      tags: ['string', 'slicing', 'palindrome', 'python'],
      concepts: ['py-slice-bounds'],
    },
  {
      id: 'py-basic-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function "fizzbuzz" that takes a number n and returns "FizzBuzz" if divisible by both 3 and 5, "Fizz" if divisible by 3, "Buzz" if divisible by 5, otherwise the number as a string.',
      starterCode: `def fizzbuzz(n):\n`,
      testCases: [
        {
          input: '15',
          expectedOutput: 'FizzBuzz, Fizz, Buzz, or str(n)',
          description: 'Should return correct fizzbuzz value',
        },
      ],
      solution: `def fizzbuzz(n):\n    if n % 15 == 0:\n        return "FizzBuzz"\n    elif n % 3 == 0:\n        return "Fizz"\n    elif n % 5 == 0:\n        return "Buzz"\n    else:\n        return str(n)`,
      tieredHints: {
        apiSignature: 'str(obj) -> str',
        skeleton: `def ____(n):
    if n % ____ ____ 0:
        return "FizzBuzz"
    elif n % ____ ____ 0:
        return "Fizz"
    elif n % ____ ____ 0:
        return "Buzz"
    else:
        return ____(n)`,
      },
      explanation: 'Check divisibility by 15 first (both 3 and 5), then 3, then 5. Order matters — if you check 3 first, 15 would match "Fizz" instead of "FizzBuzz". The modulo operator % returns the remainder.',
      hints: ['Check n % 15 first (both 3 and 5)', 'Order of conditions matters', '% is the modulo operator'],
      tags: ['conditionals', 'modulo', 'classic', 'python'],
      concepts: ['py-control-flow', 'py-arithmetic-ops'],
    },
  {
      id: 'py-basic-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use an f-string to create the string "Hello, Alice! You are 30 years old." from variables name = "Alice" and age = 30.',
      starterCode: `name = "Alice"\nage = 30\n\ngreeting = `,
      testCases: [
        {
          input: 'name and age',
          expectedOutput: 'f"Hello, {name}! You are {age} years old."',
          description: 'Should use f-string formatting',
        },
      ],
      solution: `name = "Alice"\nage = 30\n\ngreeting = f"Hello, {name}! You are {age} years old."`,
      tieredHints: {
        apiSignature: 'f"...{expr}..." -> str',
        skeleton: `name = "Alice"
age = 30

greeting = ____"Hello, {____}! You are {____} years old."`,
      },
      explanation: 'f-strings (formatted string literals) embed expressions inside {} within a string prefixed with f. They support any Python expression: f"{name.upper()}", f"{age + 1}", f"{price:.2f}".',
      hints: ['Prefix string with f', 'Use {variable} for interpolation'],
      tags: ['f-string', 'formatting', 'string', 'python'],
      concepts: ['py-string-formatting'],
    },
  {
      id: 'py-basics-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keyword that defines a function and the keyword that sends a value back to the caller.',
      template: `___ square(n):
    ___ n * n

print(square(4))`,
      blanks: ['def', 'return'],
      solution: 'def square(n):\n    return n * n\n\nprint(square(4))',
      explanation:
        'def introduces a function definition; return sends a value back to the caller. Without return, the function would implicitly return None.',
      hints: ['One keyword starts a function; another sends a value out of it.'],
      tags: ['functions', 'keywords'],
      concepts: ['py-function-as-value'],
    },
  {
      id: 'py-basics-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the comparison operator and the conditional keyword so the program prints "yes" when score is 70 or above.',
      template: `score = 75
___ score ___ 70:
    print("yes")`,
      blanks: ['if', '>='],
      solution: 'score = 75\nif score >= 70:\n    print("yes")',
      explanation:
        'if introduces a conditional. >= means "greater than or equal to" — the standard test for "at least N". A single = would be assignment, which is a SyntaxError here.',
      hints: ['Comparison uses ==, >=, etc. — never a single =.'],
      tags: ['conditional', 'comparison'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'py-basics-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the loop construct and the function that yields the integers 0 through 4.',
      template: `___ i in ___(5):
      print(i)`,
      blanks: ['for', 'range'],
      solution: 'for i in range(5):\n    print(i)',
      explanation:
        'for ... in iterates over an iterable. range(5) yields 0, 1, 2, 3, 4 — five values, end-exclusive.',
      hints: ['One keyword for iteration, one builtin for "yield N integers from 0".'],
      tags: ['loops', 'range'],
      concepts: ['py-range-bounds'],
    },
  {
      id: 'py-basics-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the list method that adds an item to the end and the function that reports the list\'s length.',
      template: `nums = [1, 2, 3]
nums.___(4)
print(___(nums))`,
      blanks: ['append', 'len'],
      solution: 'nums = [1, 2, 3]\nnums.append(4)\nprint(len(nums))',
      explanation:
        'list.append mutates the list in place to add an element at the end. len() is a builtin that reports the size of any sized container.',
      hints: ['One method to add at the end; one builtin for size.'],
      tags: ['lists', 'mutation'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'py-basics-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the prefix that enables string interpolation and the brace pair that wraps an interpolated variable.',
      template: `name = "Alice"
greeting = ___"Hello, ___name___!"
print(greeting)`,
      blanks: ['f', '{', '}'],
      solution: 'name = "Alice"\ngreeting = f"Hello, {name}!"\nprint(greeting)',
      explanation:
        'The f prefix marks the string as an f-string, enabling interpolation. Single curly braces around a variable name embed its value; doubled braces produce literal braces.',
      hints: ['One letter prefix enables interpolation; single braces wrap the variable.'],
      tags: ['fstring', 'interpolation'],
      concepts: ['py-string-formatting'],
    },
  {
      id: 'py-basics-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the slice that yields the first three letters of the list.',
      template: `letters = ["a", "b", "c", "d", "e"]
print(letters[___:___])`,
      blanks: ['0', '3'],
      solution: 'letters = ["a", "b", "c", "d", "e"]\nprint(letters[0:3])',
      explanation:
        'Slicing is end-exclusive, so [0:3] yields indices 0, 1, 2 — the first three elements. (Note: [:3] is also valid in real Python, but write the explicit start here.)',
      hints: ['Slice end indices are exclusive — to get 3 items starting at the front, end at index 3.'],
      tags: ['slicing', 'lists'],
      concepts: ['py-slice-bounds', 'py-list-aliasing'],
    },
  {
      id: 'py-basics-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dict literal punctuation: the brace pair that creates the dict, and the separator between key and value.',
      template: `person = ___"name": "Alice", "age": 30___
print(person["name"])`,
      blanks: ['{', '}'],
      solution: 'person = {"name": "Alice", "age": 30}\nprint(person["name"])',
      explanation:
        'Dicts use curly braces with key:value pairs separated by commas. Square brackets create lists; parentheses create tuples or grouping — only braces create a dict literal.',
      hints: ['Dict literals use {curly braces}, not [square] or (round).'],
      tags: ['dict', 'literals'],
      concepts: ['py-dict-key-hashability'],
    },
  {
      id: 'py-basics-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the comprehension keyword and the iteration source so squares contains [1, 4, 9, 16, 25].',
      template: `squares = [n * n ___ n ___ range(1, 6)]
print(squares)`,
      blanks: ['for', 'in'],
      solution: 'squares = [n * n for n in range(1, 6)]\nprint(squares)',
      explanation:
        'List comprehensions read as `[expression for variable in iterable]` — same shape as a for loop, but flattened into a single expression that produces a list.',
      hints: ['The two keywords mirror a for loop: `for x in iterable`.'],
      tags: ['comprehension'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-basics-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the boolean operator that connects two conditions both being true.',
      template: `age = 25
has_license = True
if age >= 18 ___ has_license:
    print("can drive")`,
      blanks: ['and'],
      solution: 'age = 25\nhas_license = True\nif age >= 18 and has_license:\n    print("can drive")',
      explanation:
        'Python\'s boolean operators are spelled out: and, or, not. The symbols && and || (used in C/JS/Java) are not valid Python.',
      hints: ['Python spells boolean operators as words, not symbols.'],
      tags: ['boolean', 'operators'],
      concepts: ['py-truthiness', 'py-arithmetic-ops'],
    },
  {
      id: 'py-basics-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the string method that returns an uppercase copy of a string.',
      template: `name = "alice"
print(name.___())`,
      blanks: ['upper'],
      solution: 'name = "alice"\nprint(name.upper())',
      explanation:
        'str.upper() returns a new string with all letters uppercased. Strings are immutable, so this method does not modify the original — it returns a new string.',
      hints: ['Method names for case conversion are the obvious words.'],
      tags: ['strings', 'methods'],
      concepts: ['py-string-formatting'],
    },
  {
      id: 'py-basics-misc-mcq-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'Which line correctly tests whether the variable score is at least 70?',
      options: [
        { id: 'a', text: 'if score >= 70:', isCorrect: true },
        { id: 'b', text: 'if score = 70:', isCorrect: false, misconceptionTag: 'py-assignment-vs-comparison' },
        { id: 'c', text: 'if score => 70:', isCorrect: false },
        { id: 'd', text: 'if score is >= 70:', isCorrect: false },
      ],
      explanation:
        '>= means "greater than or equal to". A single = is assignment (not comparison) and would be a SyntaxError inside an if. The "is" keyword tests object identity, not numeric comparison.',
      tags: ['conditional', 'comparison'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'py-basics-misc-mcq-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does range(5) yield when used in a for loop?',
      options: [
        { id: 'a', text: '0, 1, 2, 3, 4', isCorrect: true },
        { id: 'b', text: '1, 2, 3, 4, 5', isCorrect: false, misconceptionTag: 'py-off-by-one-range' },
        { id: 'c', text: '0, 1, 2, 3, 4, 5', isCorrect: false, misconceptionTag: 'py-off-by-one-range' },
        { id: 'd', text: '5, 4, 3, 2, 1', isCorrect: false },
      ],
      explanation:
        'range(n) yields n integers starting at 0 and ending at n-1 — end-exclusive. range(5) gives 0, 1, 2, 3, 4 (five values).',
      tags: ['range', 'loops'],
      concepts: ['py-range-bounds'],
    },
  {
      id: 'py-basics-misc-mcq-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'After running `nums = [1, 2, 3]; result = nums.append(4)`, what is the value of `result`?',
      options: [
        { id: 'a', text: 'None', isCorrect: true },
        { id: 'b', text: '[1, 2, 3, 4]', isCorrect: false, misconceptionTag: 'py-append-returns-none' },
        { id: 'c', text: '4', isCorrect: false, misconceptionTag: 'py-append-returns-none' },
        { id: 'd', text: '3', isCorrect: false },
      ],
      explanation:
        'list.append mutates the list in place and returns None. The list nums is correctly modified to [1, 2, 3, 4], but the return value (assigned to result) is None.',
      tags: ['lists', 'mutation'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'py-basics-misc-mcq-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'Given `a = [1, 2, 3]; b = a; b.append(4)`, what is the value of `a` afterwards?',
      options: [
        { id: 'a', text: '[1, 2, 3, 4]', isCorrect: true },
        { id: 'b', text: '[1, 2, 3]', isCorrect: false, misconceptionTag: 'py-list-aliasing' },
        { id: 'c', text: '[4]', isCorrect: false },
        { id: 'd', text: 'TypeError — cannot reassign list', isCorrect: false },
      ],
      explanation:
        '`b = a` does NOT copy the list — both names refer to the same list object. Mutating through b is visible through a. Use `b = a.copy()` or `b = list(a)` to get an independent list.',
      tags: ['references', 'aliasing'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'py-basics-misc-mcq-5',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'Given `s = "hello"`, what does `s.upper()` do to s?',
      options: [
        { id: 'a', text: 'Returns "HELLO"; s is unchanged', isCorrect: true },
        { id: 'b', text: 'Modifies s in place to "HELLO"', isCorrect: false, misconceptionTag: 'py-string-immutable' },
        { id: 'c', text: 'Returns "HELLO" and modifies s to "HELLO"', isCorrect: false, misconceptionTag: 'py-string-immutable' },
        { id: 'd', text: 'Raises an error — strings have no .upper() method', isCorrect: false },
      ],
      explanation:
        'Strings are immutable. str.upper() returns a NEW uppercased string and does not modify the original. To "change" s, you would have to reassign: s = s.upper().',
      tags: ['strings', 'immutable'],
      concepts: ['py-string-formatting'],
    },
  {
      id: 'py-basics-misc-mcq-6',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'Given `name = "Alice"`, which line prints "Hello, Alice!"?',
      options: [
        { id: 'a', text: 'print(f"Hello, {name}!")', isCorrect: true },
        { id: 'b', text: 'print("Hello, {name}!")', isCorrect: false, misconceptionTag: 'py-fstring-missing-prefix' },
        { id: 'c', text: 'print(f"Hello, {{name}}!")', isCorrect: false },
        { id: 'd', text: 'print("Hello, " + name + "!")', isCorrect: false },
      ],
      explanation:
        'The f prefix turns a string into an f-string, enabling {name} to interpolate. Without the f, the literal text "Hello, {name}!" is printed. Doubled braces {{name}} produce literal braces around the word "name". Option D works too but uses concatenation, not interpolation — read the question carefully.',
      tags: ['fstring', 'interpolation'],
      concepts: ['py-string-formatting'],
    },
  {
      id: 'py-basics-misc-mcq-7',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'Given `letters = ["a", "b", "c", "d"]`, what does `letters[1:3]` return?',
      options: [
        { id: 'a', text: '["b", "c"]', isCorrect: true },
        { id: 'b', text: '["b", "c", "d"]', isCorrect: false, misconceptionTag: 'py-slice-end-inclusive' },
        { id: 'c', text: '["a", "b", "c"]', isCorrect: false },
        { id: 'd', text: '["a", "b"]', isCorrect: false },
      ],
      explanation:
        'Slicing is end-EXCLUSIVE. letters[1:3] yields indices 1 and 2 — the element at index 3 ("d") is NOT included. This is the most common slicing mistake.',
      tags: ['slicing', 'lists'],
      concepts: ['py-slice-bounds', 'py-list-aliasing'],
    },
  {
      id: 'py-basics-misc-mcq-8',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does `type({})` return?',
      options: [
        { id: 'a', text: "<class 'dict'>", isCorrect: true },
        { id: 'b', text: "<class 'set'>", isCorrect: false, misconceptionTag: 'py-dict-vs-set-literal' },
        { id: 'c', text: "<class 'tuple'>", isCorrect: false },
        { id: 'd', text: "<class 'list'>", isCorrect: false },
      ],
      explanation:
        '{} is an empty dict, NOT an empty set. To create an empty set you must use set(). {1, 2, 3} is a set; {"a": 1} is a dict. Tuples use () (or just commas); lists use [].',
      tags: ['dict', 'set', 'literals'],
      concepts: ['py-dict-key-hashability'],
    },
  {
      id: 'py-basics-misc-mcq-9',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'Which line correctly tests "x is positive AND less than 10"?',
      options: [
        { id: 'a', text: 'if x > 0 and x < 10:', isCorrect: true },
        { id: 'b', text: 'if x > 0 && x < 10:', isCorrect: false, misconceptionTag: 'py-bool-operators-symbols' },
        { id: 'c', text: 'if (x > 0) AND (x < 10):', isCorrect: false, misconceptionTag: 'py-bool-operators-symbols' },
        { id: 'd', text: 'if x > 0 & x < 10:', isCorrect: false, misconceptionTag: 'py-bool-operators-symbols' },
      ],
      explanation:
        "Python's boolean operators are spelled out lowercase: and, or, not. && and || are C/JS syntax. & is the bitwise AND operator — different beast that works on integers/booleans but doesn't short-circuit and has surprising precedence.",
      tags: ['boolean', 'operators'],
      concepts: ['py-truthiness', 'py-arithmetic-ops'],
    },
  {
      id: 'py-basics-misc-mcq-10',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'In Python 3, what does `7 / 2` evaluate to?',
      options: [
        { id: 'a', text: '3.5', isCorrect: true },
        { id: 'b', text: '3', isCorrect: false, misconceptionTag: 'py-int-vs-float-division' },
        { id: 'c', text: '4', isCorrect: false, misconceptionTag: 'py-int-vs-float-division' },
        { id: 'd', text: '3.0', isCorrect: false },
      ],
      explanation:
        'In Python 3, / always returns a float — even when both operands are ints. 7 / 2 == 3.5. Use // for floor (integer) division: 7 // 2 == 3. Python 2 behaved differently, which is the source of much of the confusion.',
      tags: ['arithmetic', 'division'],
      concepts: ['py-arithmetic-ops'],
    },
  {
      id: 'py-basics-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Arrange the lines to assign the integer 30 to a variable called age, then print it.',
      correctOrder: ['age = 30', 'print(age)'],
      distractorLines: ['print("age")'],
      solution: 'age = 30\nprint(age)',
      explanation:
        'A variable must be assigned before it can be printed. Passing the bare name (age) prints the value; quoting it ("age") prints the literal string.',
      hints: ['Assign first, then print the variable — not the literal string.'],
      tags: ['variables', 'print'],
      concepts: ['py-builtin-io'],
    },
  {
      id: 'py-basics-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a greeting using an f-string. Set name to "Alice", then print "Hello, Alice!" using interpolation.',
      correctOrder: ['name = "Alice"', 'print(f"Hello, {name}!")'],
      distractorLines: [
        'print(f"Hello, {{name}}!")',
        'print("Hello, {name}!")',
      ],
      solution: 'name = "Alice"\nprint(f"Hello, {name}!")',
      explanation:
        'f-strings use single braces around variable names. Double braces ({{name}}) print literal braces; missing the f prefix prints the placeholder text instead of interpolating.',
      hints: ['The f prefix on the string is what enables interpolation.'],
      tags: ['fstring', 'interpolation'],
      concepts: ['py-string-formatting'],
    },
  {
      id: 'py-basics-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Write an if/else that checks whether score is at least 60. Print "pass" if yes, "fail" if no. Assume score is already defined.',
      correctOrder: [
        'if score >= 60:',
        '    print("pass")',
        'else:',
        '    print("fail")',
      ],
      distractorLines: ['if score = 60:', '    print "pass"'],
      solution: 'if score >= 60:\n    print("pass")\nelse:\n    print("fail")',
      explanation:
        'Comparison uses == or >=, not = (which is assignment). print is a function in Python 3, so its argument needs parentheses.',
      hints: ['One = means assign; two == means compare. >= means at least.'],
      tags: ['conditional', 'comparison'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'py-basics-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a for loop that prints each number in the list [1, 2, 3] on its own line.',
      correctOrder: ['for n in [1, 2, 3]:', '    print(n)'],
      distractorLines: [
        'for n in range(3):',
        'while n in [1, 2, 3]:',
      ],
      solution: 'for n in [1, 2, 3]:\n    print(n)',
      explanation:
        'for ... in iterates each element directly. range(3) yields 0, 1, 2 — different values. while is for repeating while a condition is true, not for iteration.',
      hints: ['Iterate over the list itself; you don\'t need range here.'],
      tags: ['loops', 'iteration'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'py-basics-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a function called square that takes a parameter n and returns n squared. Then call it with 5 and print the result.',
      correctOrder: [
        'def square(n):',
        '    return n * n',
        'print(square(5))',
      ],
      distractorLines: ['def square(n):', '    n * n', 'square(5)'],
      solution: 'def square(n):\n    return n * n\nprint(square(5))',
      explanation:
        'A function without an explicit return returns None — the body must use the return keyword to send a value back. Calling square(5) without print() computes the value but doesn\'t display it.',
      hints: ['return sends a value back; without it, the caller gets None.'],
      tags: ['functions', 'return'],
      concepts: ['py-function-as-value'],
    },
  {
      id: 'py-basics-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Append the number 4 to the list nums (already defined as [1, 2, 3]), then print the list.',
      correctOrder: ['nums.append(4)', 'print(nums)'],
      distractorLines: [
        'nums = nums.append(4)',
        'nums + 4',
        'nums.add(4)',
      ],
      solution: 'nums.append(4)\nprint(nums)',
      explanation:
        'list.append mutates in place and returns None — assigning its result to nums would set nums to None. Lists don\'t have an .add method (that\'s sets). nums + 4 fails because you can only concatenate lists with other lists.',
      hints: ['append mutates the list in place; don\'t reassign its return value.'],
      tags: ['lists', 'mutation'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'py-basics-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Create a dict mapping "name" to "Alice" and "age" to 30, then print the value associated with "name".',
      correctOrder: [
        'person = {"name": "Alice", "age": 30}',
        'print(person["name"])',
      ],
      distractorLines: [
        'person = ("name": "Alice", "age": 30)',
        'print(person.name)',
      ],
      solution: 'person = {"name": "Alice", "age": 30}\nprint(person["name"])',
      explanation:
        'Dicts use curly braces with key: value pairs. Access values with square brackets and the key — dot access works for object attributes, not dict keys.',
      hints: ['Dicts use {curly braces}; access values via dict[key].'],
      tags: ['dict', 'lookup'],
      concepts: ['py-dict-key-hashability'],
    },
  {
      id: 'py-basics-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Given the list letters = ["a", "b", "c", "d", "e"], print the slice containing the second and third elements ("b" and "c") on one line.',
      correctOrder: ['letters = ["a", "b", "c", "d", "e"]', 'print(letters[1:3])'],
      distractorLines: ['print(letters[2:3])', 'print(letters[1:2])'],
      solution: 'letters = ["a", "b", "c", "d", "e"]\nprint(letters[1:3])',
      explanation:
        'Indexing is zero-based, so "b" is at index 1 and "c" is at index 2. Slice end indices are exclusive, so [1:3] yields elements at 1 and 2.',
      hints: ['Indexing starts at 0; slice end indices are exclusive.'],
      tags: ['slicing', 'indexing'],
      concepts: ['py-slice-bounds'],
    },
  {
      id: 'py-basics-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a list called squares containing the squares of 1 through 5 using a list comprehension, then print it.',
      correctOrder: [
        'squares = [n * n for n in range(1, 6)]',
        'print(squares)',
      ],
      distractorLines: [
        'squares = [n * n for n in range(5)]',
        'squares = (n * n for n in range(1, 6))',
      ],
      solution: 'squares = [n * n for n in range(1, 6)]\nprint(squares)',
      explanation:
        'range(1, 6) yields 1, 2, 3, 4, 5 — range is end-exclusive. range(5) starts at 0. Using parentheses creates a generator, not a list, so printing it would show the generator object.',
      hints: ['range is end-exclusive: range(1, 6) gives 1..5.'],
      tags: ['comprehension', 'range'],
      concepts: ['py-comprehension', 'py-range-bounds'],
    },
  {
      id: 'py-basics-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Read user input with the prompt "Enter your name: ", then print "Hello, <name>!" using an f-string.',
      correctOrder: [
        'name = input("Enter your name: ")',
        'print(f"Hello, {name}!")',
      ],
      distractorLines: [
        'name = input()',
        'print("Hello, name!")',
      ],
      solution: 'name = input("Enter your name: ")\nprint(f"Hello, {name}!")',
      explanation:
        'input() takes an optional prompt argument that\'s shown to the user. Without the f prefix, the print would output the literal string "Hello, name!" instead of interpolating the variable.',
      hints: ['input takes a prompt string; the f prefix interpolates variables.'],
      tags: ['input', 'fstring'],
      concepts: ['py-builtin-io', 'py-string-formatting'],
    },
  {
      id: 'py-basics-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `x = 5
y = 2
print(x // y)
print(x / y)`,
      expectedOutput: `2
2.5`,
      explanation:
        '// is integer (floor) division and yields an int (2). / is true division and yields a float (2.5), even when both operands are ints.',
      hints: ['One operator floors, the other returns a float.'],
      tags: ['arithmetic', 'division'],
      concepts: ['py-arithmetic-ops'],
    },
  {
      id: 'py-basics-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `for i in range(3):
      print(i)`,
      expectedOutput: `0
1
2`,
      explanation:
        'range(3) yields 0, 1, 2 — it starts at 0 and is end-exclusive. The most common off-by-one mistake is expecting it to print up to 3.',
      hints: ['range starts at 0 and is end-exclusive.'],
      tags: ['loops', 'range'],
      concepts: ['py-range-bounds'],
    },
  {
      id: 'py-basics-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `nums = [1, 2, 3]
nums.append(4)
result = nums.append(5)
print(nums)
print(result)`,
      expectedOutput: `[1, 2, 3, 4, 5]
None`,
      explanation:
        'list.append mutates the list in place and returns None. The list is correctly modified to [1, 2, 3, 4, 5], but `result` captures the return value of append() — which is None.',
      hints: ['append mutates; what does it return?'],
      tags: ['lists', 'mutation', 'return-values'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'py-basics-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `letters = ["a", "b", "c", "d", "e"]
print(letters[1:4])
print(letters[:2])
print(letters[-2:])`,
      expectedOutput: `['b', 'c', 'd']
['a', 'b']
['d', 'e']`,
      explanation:
        'Slicing is end-exclusive: [1:4] yields indices 1, 2, 3. Omitting start/end means "from the beginning" or "to the end". Negative indices count from the end, so [-2:] is the last two elements.',
      hints: ['Slice end indices are exclusive; negative indices count from the end.'],
      tags: ['slicing', 'lists'],
      concepts: ['py-slice-bounds', 'py-list-aliasing'],
    },
  {
      id: 'py-basics-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `a = [1, 2, 3]
b = a
b.append(4)
print(a)
print(b)`,
      expectedOutput: `[1, 2, 3, 4]
[1, 2, 3, 4]`,
      explanation:
        'Assignment with `b = a` does not copy the list — both names refer to the same list object. Mutating through one name is visible through the other. To copy, use `b = a.copy()` or `b = list(a)`.',
      hints: ['Does `b = a` create a new list or another reference to the same list?'],
      tags: ['references', 'mutation', 'aliasing'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'py-basics-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def greet(name="world"):
    return f"Hello, {name}!"

print(greet())
print(greet("Alice"))`,
      expectedOutput: `Hello, world!
Hello, Alice!`,
      explanation:
        'Default argument values are used when the caller omits the argument. greet() uses the default "world"; greet("Alice") overrides it.',
      hints: ['What value does name take when no argument is passed?'],
      tags: ['functions', 'default-arguments'],
      concepts: ['py-default-arg-evaluation'],
    },
  {
      id: 'py-basics-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `s = "hello"
print(s.upper())
print(s)`,
      expectedOutput: `HELLO
hello`,
      explanation:
        'Strings are immutable. str.upper() returns a new uppercased string and does NOT modify the original. The original `s` still refers to "hello".',
      hints: ['Strings are immutable — does upper() change s in place or return a new string?'],
      tags: ['strings', 'immutable'],
      concepts: ['py-string-formatting'],
    },
  {
      id: 'py-basics-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `squares = [n * n for n in range(1, 5)]
print(squares)
print(sum(squares))`,
      expectedOutput: `[1, 4, 9, 16]
30`,
      explanation:
        'range(1, 5) yields 1, 2, 3, 4 — end-exclusive. Squaring each gives [1, 4, 9, 16]. sum() adds them: 1+4+9+16 = 30.',
      hints: ['range(1, 5) is end-exclusive — what numbers does it yield?'],
      tags: ['comprehension', 'sum', 'range'],
      concepts: ['py-comprehension', 'py-range-bounds'],
    },
  {
      id: 'py-basics-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `x = 10
if x > 5:
    print("big")
elif x > 8:
    print("bigger")
else:
    print("small")`,
      expectedOutput: `big`,
      explanation:
        'if/elif/else evaluates branches top to bottom and stops at the first true condition. x > 5 is true, so "big" is printed and the elif/else are skipped — even though x > 8 is also true.',
      hints: ['if/elif/else stops at the first true branch.'],
      tags: ['conditional', 'control-flow'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'py-basics-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `person = {"name": "Alice", "age": 30}
person["age"] = 31
person["city"] = "London"
print(person["name"])
print(len(person))`,
      expectedOutput: `Alice
3`,
      explanation:
        'Assigning to an existing key updates the value (age becomes 31). Assigning to a new key adds it (city). The dict now has 3 keys: name, age, city.',
      hints: ['How many keys does the dict have after both assignments?'],
      tags: ['dict', 'mutation'],
      concepts: ['py-dict-key-hashability'],
    },
  {
      id: 'pe1-m1-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'Python is an interpreted language. What does this mean?',
      options: [
        { id: 'a', text: 'Python source code is translated to machine code all at once before running', isCorrect: false },
        { id: 'b', text: 'Python source code is read and executed line-by-line by an interpreter at runtime', isCorrect: true },
        { id: 'c', text: 'Python code must be compiled into a `.exe` file before it can run', isCorrect: false },
        { id: 'd', text: 'Python only runs inside a web browser', isCorrect: false },
      ],
      explanation: 'Python is an interpreted language — the Python interpreter reads and executes your source code line by line at runtime. This contrasts with compiled languages like C, where the entire program is converted to machine code before running. Interpretation makes Python slower at runtime but much faster to develop with, since you don\'t need a separate compile step.',
      hints: [
        'Think about what happens when you run `python script.py`',
        'The opposite of "interpreted" is "compiled"',
      ],
      tags: ['interpreter', 'compilation', 'basics', 'how-python-works'],
      concepts: ['py-runtime'],
    },
  {
      id: 'pe1-m1-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What is CPython?',
      options: [
        { id: 'a', text: 'A Python library for working with C code', isCorrect: false },
        { id: 'b', text: 'A Python framework for building websites', isCorrect: false },
        { id: 'c', text: 'The reference implementation of Python, written in C', isCorrect: true },
        { id: 'd', text: 'A faster, compiled version of Python', isCorrect: false },
      ],
      explanation: 'CPython is the reference implementation of Python — the standard, most widely used version, written in the C programming language. When you download Python from python.org, you\'re getting CPython. Other implementations exist (PyPy, Jython, IronPython) but CPython is the default.',
      hints: [
        'The "C" refers to the programming language it was written in',
        'It\'s what you get when you install Python from python.org',
      ],
      tags: ['cpython', 'implementations', 'basics'],
      concepts: ['py-runtime'],
    },
  {
      id: 'pe1-m1-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does the `print()` function do in Python?',
      options: [
        { id: 'a', text: 'Saves text to a file', isCorrect: false },
        { id: 'b', text: 'Displays output to the screen (standard output)', isCorrect: true },
        { id: 'c', text: 'Creates a new variable with the given text', isCorrect: false },
        { id: 'd', text: 'Sends data to a printer device', isCorrect: false },
      ],
      explanation: '`print()` is Python\'s built-in function for displaying output. It writes to standard output (the terminal/console). You can pass multiple arguments separated by commas — `print("Hello", "World")` — and control the separator with `sep=` and the ending character with `end=`.',
      hints: [
        'Try `print("Hello, World!")` in a Python shell',
        'It\'s how you see what\'s happening inside your program',
      ],
      tags: ['print', 'output', 'basics', 'built-in'],
      concepts: ['py-builtin-io'],
    },
  {
      id: 'pe1-m1-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Your first Python program! Print the text `Hello, World!` to the screen.',
      starterCode: `# Print "Hello, World!" to the screen
  `,
      testCases: [
        {
          input: '',
          expectedOutput: 'Hello, World!',
          description: 'Should print Hello, World!',
        },
      ],
      solution: `print("Hello, World!")`,
      tieredHints: {
        apiSignature: 'print(*values, sep=" ", end="\\n")',
        skeleton: `____("____, ____!")`,
      },
      explanation: '`print()` is the most basic Python function. It takes any value and displays it in the terminal. String literals (text) are written inside quotes — either single `\'` or double `"` quotes work in Python.',
      hints: [
        'Use the `print()` function',
        'Put the text inside quotes inside the parentheses',
      ],
      tags: ['print', 'hello-world', 'basics'],
      concepts: ['py-builtin-io'],
    },
  {
      id: 'pe1-m2-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'Which of the following correctly creates a variable called `age` with the value 25 in Python?',
      options: [
        { id: 'a', text: '`var age = 25`', isCorrect: false },
        { id: 'b', text: '`int age = 25`', isCorrect: false },
        { id: 'c', text: '`age = 25`', isCorrect: true },
        { id: 'd', text: '`let age = 25`', isCorrect: false },
      ],
      explanation: 'In Python, you create a variable simply by assigning a value to a name using `=`. There is no `var`, `let`, `int`, or other declaration keyword needed. Python infers the type from the value. This is called dynamic typing.',
      hints: [
        'Python doesn\'t require type declarations',
        'Use the assignment operator `=`',
      ],
      tags: ['variables', 'assignment', 'basics', 'dynamic-typing'],
      concepts: ['py-builtin-io'],
    },
  {
      id: 'pe1-m2-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What are the four main basic data types in Python?',
      options: [
        { id: 'a', text: 'int, float, string, array', isCorrect: false },
        { id: 'b', text: 'int, float, str, bool', isCorrect: true },
        { id: 'c', text: 'number, decimal, text, boolean', isCorrect: false },
        { id: 'd', text: 'integer, double, char, boolean', isCorrect: false },
      ],
      explanation: 'Python\'s four fundamental data types are: `int` (whole numbers like 42), `float` (decimal numbers like 3.14), `str` (text like "hello"), and `bool` (True or False). Everything in Python is an object, and these types are all built-in classes.',
      hints: [
        'Think: whole numbers, decimals, text, and true/false',
        'Python uses `str` not `string`',
      ],
      tags: ['data-types', 'int', 'float', 'str', 'bool', 'basics'],
      concepts: ['py-builtin-io'],
    },
  {
      id: 'pe1-m2-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does `type(42)` return in Python?',
      options: [
        { id: 'a', text: '`"integer"`', isCorrect: false },
        { id: 'b', text: '`42`', isCorrect: false },
        { id: 'c', text: '`<class \'int\'>`', isCorrect: true },
        { id: 'd', text: '`True`', isCorrect: false },
      ],
      explanation: 'The `type()` built-in function returns the type (class) of any object. For the integer 42, it returns `<class \'int\'>`. This is useful for debugging and understanding what type of data you\'re working with. You can also use it in comparisons: `type(x) == int`.',
      hints: [
        '`type()` reveals the class of an object',
        'Python represents types as classes',
      ],
      tags: ['type', 'built-in', 'int', 'basics'],
      concepts: ['py-metaclass', 'py-builtin-io'],
    },
  {
      id: 'pe1-m2-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What is the result of `int("42")`?',
      options: [
        { id: 'a', text: 'An error — you cannot convert strings to integers', isCorrect: false },
        { id: 'b', text: 'The integer `42`', isCorrect: true },
        { id: 'c', text: 'The string `"42"`', isCorrect: false },
        { id: 'd', text: '`None`', isCorrect: false },
      ],
      explanation: '`int()` converts a value to an integer. If the string contains a valid whole number, it converts successfully. This is called type casting or type conversion. You can also use `float("3.14")` to convert to a float, and `str(42)` to convert an integer to a string.',
      hints: [
        'This is called "type casting" or "type conversion"',
        'Python provides built-in conversion functions: `int()`, `float()`, `str()`, `bool()`',
      ],
      tags: ['type-conversion', 'int', 'casting', 'basics'],
      concepts: ['py-builtin-io'],
    },
  {
      id: 'pe1-m2-5',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does the `input()` function do in Python?',
      options: [
        { id: 'a', text: 'It reads data from a file', isCorrect: false },
        { id: 'b', text: 'It reads a line of text from the user via the keyboard and returns it as a string', isCorrect: true },
        { id: 'c', text: 'It takes a number as input and converts it to an integer', isCorrect: false },
        { id: 'd', text: 'It validates user input for errors', isCorrect: false },
      ],
      explanation: '`input()` pauses the program and waits for the user to type something and press Enter. It always returns a **string**, even if the user types a number. If you need a number, you must convert it: `age = int(input("Enter your age: "))`.',
      hints: [
        '`input()` always returns a string',
        'You often combine it with `int()` or `float()` for numeric input',
      ],
      tags: ['input', 'user-input', 'basics', 'built-in'],
      concepts: ['py-builtin-io'],
    },
  {
      id: 'pe1-m2-6',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create three variables: `name` (a string), `age` (an integer), and `height` (a float). Then print them all on one line using an f-string in the format: `Name: Alice, Age: 30, Height: 1.75`',
      starterCode: `# Create three variables
name =
age =
height =

# Print them using an f-string
`,
      testCases: [
        {
          input: '',
          expectedOutput: 'Name: Alice, Age: 30, Height: 1.75',
          description: 'Should print the formatted string with the variable values',
        },
      ],
      solution: `name = "Alice"
age = 30
height = 1.75

print(f"Name: {name}, Age: {age}, Height: {height}")`,
      tieredHints: {
        apiSignature: 'f"...{expr}..." -> str',
        skeleton: `name = "Alice"
age = ____
height = ____

print(____"Name: {____}, Age: {____}, Height: {____}")`,
      },
      explanation: 'F-strings (formatted string literals) let you embed variable values directly in strings using `{variable_name}` syntax. They are prefixed with `f` before the opening quote. F-strings are the modern, recommended way to format strings in Python (Python 3.6+).',
      hints: [
        'Strings go in quotes, integers are plain numbers, floats have a decimal point',
        'F-strings start with `f"..."` and use `{variable}` placeholders',
      ],
      tags: ['variables', 'f-string', 'str', 'int', 'float', 'basics'],
      concepts: ['py-builtin-io', 'py-string-formatting'],
    },
  {
      id: 'pe1-m2-7',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Ask the user for their name using `input()`, then greet them. Since we can\'t use interactive input in tests, instead: set `name = "Bob"` directly, then print `Hello, Bob!`',
      starterCode: `# Set name directly (simulating user input)
name = "Bob"

# Print a greeting using the name variable
`,
      testCases: [
        {
          input: '',
          expectedOutput: 'Hello, Bob!',
          description: 'Should print a greeting with the name',
        },
      ],
      solution: `name = "Bob"
print(f"Hello, {name}!")`,
      tieredHints: {
        apiSignature: 'f"...{expr}..." -> str',
        skeleton: `name = "____"
print(____"Hello, {____}!")`,
      },
      explanation: 'In real programs you\'d use `name = input("What is your name? ")` to get user input. The result is always a string. Here we simulate it by assigning directly. The f-string `f"Hello, {name}!"` embeds the variable value into the output.',
      hints: [
        'Use an f-string to include the name variable in the output',
        'Don\'t forget the exclamation mark at the end',
      ],
      tags: ['input', 'f-string', 'variables', 'basics'],
      concepts: ['py-builtin-io', 'py-string-formatting'],
    },
  {
      id: 'pe1-m2-8',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What is the result of `17 // 5` in Python?',
      options: [
        { id: 'a', text: '3.4', isCorrect: false, misconceptionTag: 'py-int-vs-float-division' },
        { id: 'b', text: '2', isCorrect: false },
        { id: 'c', text: '3', isCorrect: true },
        { id: 'd', text: '17', isCorrect: false },
      ],
      explanation: '`//` is the floor division operator. It divides and rounds **down** to the nearest whole number. `17 // 5 = 3` because 5 goes into 17 three times (5×3=15) with a remainder. The regular division `/` would give `3.4`. Floor division is useful when you need a whole-number result.',
      hints: [
        '`//` is "floor division" — it rounds down',
        'Different from `/` which gives a decimal result',
      ],
      tags: ['operators', 'floor-division', 'arithmetic', 'basics'],
      concepts: ['py-arithmetic-ops'],
    },
  {
      id: 'pe1-m2-9',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does the `%` operator do in Python?',
      options: [
        { id: 'a', text: 'Calculates a percentage', isCorrect: false },
        { id: 'b', text: 'Returns the remainder after division (modulo)', isCorrect: true },
        { id: 'c', text: 'Formats a string', isCorrect: false },
        { id: 'd', text: 'Checks if a number is divisible', isCorrect: false },
      ],
      explanation: '`%` is the modulo operator — it returns the **remainder** after division. `17 % 5 = 2` because 17 = 5×3 + 2. Common uses: checking if a number is even (`n % 2 == 0`), cycling through values, or extracting the last digit of a number (`n % 10`).',
      hints: [
        'Think: what\'s left over after dividing?',
        '`10 % 3 = 1` because 10 = 3×3 + 1',
      ],
      tags: ['operators', 'modulo', 'remainder', 'arithmetic'],
      concepts: ['py-arithmetic-ops'],
    },
  {
      id: 'pe1-m2-10',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does `2 ** 8` evaluate to in Python?',
      options: [
        { id: 'a', text: '16', isCorrect: false },
        { id: 'b', text: '256', isCorrect: true },
        { id: 'c', text: '10', isCorrect: false },
        { id: 'd', text: '28', isCorrect: false },
      ],
      explanation: '`**` is Python\'s exponentiation operator (power). `2 ** 8` means 2 to the power of 8, which is 2×2×2×2×2×2×2×2 = 256. This is equivalent to `math.pow(2, 8)` but `**` is the native operator and works with integers too.',
      hints: [
        '`**` means "to the power of"',
        '2 to the 8th power is 256',
      ],
      tags: ['operators', 'exponentiation', 'power', 'arithmetic'],
      concepts: ['py-arithmetic-ops'],
    },
  {
      id: 'pe1-m2-11',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write code that uses all five arithmetic operators on two numbers `a = 20` and `b = 6`. Print each result on a separate line in this order: addition, subtraction, multiplication, floor division, modulo.',
      starterCode: `a = 20
b = 6

# Print: addition result
# Print: subtraction result
# Print: multiplication result
# Print: floor division result
# Print: modulo (remainder) result
`,
      testCases: [
        {
          input: '',
          expectedOutput: '26\n14\n120\n3\n2',
          description: 'Should print all five arithmetic results',
        },
      ],
      solution: `a = 20
b = 6

print(a + b)   # 26
print(a - b)   # 14
print(a * b)   # 120
print(a // b)  # 3
print(a % b)   # 2`,
      tieredHints: {
        apiSignature: 'print(*values, sep=" ", end="\\n")',
        skeleton: `a = ____
b = ____

____(a ____ b)
____(a ____ b)
____(a ____ b)
____(a ____ b)
____(a ____ b)`,
      },
      explanation: 'Python\'s arithmetic operators: `+` add, `-` subtract, `*` multiply, `//` floor divide (whole number result), `%` modulo (remainder). Note: regular division `/` would give `3.333...` while `//` gives `3`.',
      hints: [
        'Use `+`, `-`, `*`, `//`, `%` in order',
        '20 // 6 = 3 (floor division), 20 % 6 = 2 (remainder)',
      ],
      tags: ['operators', 'arithmetic', 'basics'],
      concepts: ['py-arithmetic-ops'],
    },
  {
      id: 'pe1-m2-12',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does string concatenation mean in Python?',
      options: [
        { id: 'a', text: 'Converting a string to uppercase', isCorrect: false },
        { id: 'b', text: 'Joining two or more strings together using the `+` operator', isCorrect: true },
        { id: 'c', text: 'Splitting a string into a list of characters', isCorrect: false },
        { id: 'd', text: 'Checking if a string contains a specific character', isCorrect: false },
      ],
      explanation: 'String concatenation joins strings together using `+`. For example: `"Hello" + " " + "World"` produces `"Hello World"`. You can only concatenate strings with strings — `"age: " + 25` would raise a `TypeError`. Use f-strings or `str()` to include numbers.',
      hints: [
        'Concatenation = joining end to end',
        '`"Hello" + "World"` gives `"HelloWorld"`',
      ],
      tags: ['strings', 'concatenation', 'operators', 'basics'],
      concepts: ['py-string-formatting', 'py-arithmetic-ops'],
    },
  {
      id: 'pe1-m2-13',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does `"ha" * 3` produce in Python?',
      options: [
        { id: 'a', text: 'An error — you cannot multiply a string', isCorrect: false },
        { id: 'b', text: '`"ha3"`', isCorrect: false },
        { id: 'c', text: '`"hahaha"`', isCorrect: true },
        { id: 'd', text: '`"ha ha ha"`', isCorrect: false },
      ],
      explanation: 'Python supports string repetition using `*`. `"ha" * 3` repeats the string 3 times, giving `"hahaha"`. This works with both `str * int` and `int * str`. It\'s useful for creating separators like `"-" * 40` or simple patterns.',
      hints: [
        'The `*` operator with strings means "repeat"',
        'Think of it as adding the string to itself 3 times',
      ],
      tags: ['strings', 'repetition', 'operators', 'basics'],
      concepts: ['py-string-formatting', 'py-arithmetic-ops'],
    },
  {
      id: 'pe1-m2-14',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'Which string method converts all characters to uppercase?',
      options: [
        { id: 'a', text: '`.toUpper()`', isCorrect: false },
        { id: 'b', text: '`.upper()`', isCorrect: true },
        { id: 'c', text: '`.uppercase()`', isCorrect: false },
        { id: 'd', text: '`.capitalize()`', isCorrect: false },
      ],
      explanation: '`.upper()` converts all characters in a string to uppercase. Its counterpart is `.lower()` for lowercase. Note that `.capitalize()` only capitalizes the first character. These methods return a **new** string — strings in Python are immutable (cannot be changed in place).',
      hints: [
        'String methods in Python are called with dot notation',
        '`.upper()` vs `.lower()` — both are common',
      ],
      tags: ['strings', 'methods', 'upper', 'lower', 'basics'],
      concepts: ['py-string-formatting'],
    },
  {
      id: 'pe1-m2-15',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does `"hello world".split()` return?',
      options: [
        { id: 'a', text: '`"hello", "world"` as two separate strings', isCorrect: false },
        { id: 'b', text: '`["hello", "world"]` — a list of words', isCorrect: true },
        { id: 'c', text: '`("hello", "world")` — a tuple of words', isCorrect: false },
        { id: 'd', text: '`{"hello", "world"}` — a set of words', isCorrect: false },
      ],
      explanation: '`.split()` without arguments splits a string on any whitespace (spaces, tabs, newlines) and returns a **list** of substrings. You can pass a delimiter: `"a,b,c".split(",")` gives `["a", "b", "c"]`. The reverse operation is `" ".join(["hello", "world"])` which gives `"hello world"`.',
      hints: [
        '`.split()` always returns a list',
        'No argument = split on whitespace',
      ],
      tags: ['strings', 'split', 'methods', 'basics'],
      concepts: ['py-string-formatting'],
    },
  {
      id: 'pe1-m2-16',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given the string `sentence = "the quick brown fox"`, use string methods to: (1) print it in all uppercase, (2) print the number of characters (length), (3) print it with "fox" replaced by "cat".',
      starterCode: `# Declare sentence from the prompt
# Print the uppercased string, then its length, then the string with "fox" swapped for "cat"
`,
      testCases: [
        {
          input: '',
          expectedOutput: 'THE QUICK BROWN FOX\n19\nthe quick brown cat',
          description: 'Should print uppercase, length, and replaced string',
        },
      ],
      solution: `sentence = "the quick brown fox"

print(sentence.upper())
print(len(sentence))
print(sentence.replace("fox", "cat"))`,
      tieredHints: {
        apiSignature: 'str.replace(old, new, count=-1) -> str',
        skeleton: `sentence = "the quick brown fox"

____(sentence.____())
____(____(sentence))
____(sentence.____("____", "____"))`,
      },
      explanation: '`.upper()` converts to uppercase. `len()` is a built-in function that returns the number of characters. `.replace(old, new)` returns a new string with all occurrences of `old` replaced by `new`. None of these modify the original string — strings are immutable.',
      hints: [
        'Use `.upper()`, `len()`, and `.replace()`',
        'Strings are immutable — methods return new strings',
      ],
      tags: ['strings', 'upper', 'len', 'replace', 'methods'],
      concepts: ['py-string-formatting'],
    },
  {
      id: 'pe1-m3-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What are the two boolean values in Python?',
      options: [
        { id: 'a', text: '`true` and `false`', isCorrect: false },
        { id: 'b', text: '`True` and `False`', isCorrect: true },
        { id: 'c', text: '`yes` and `no`', isCorrect: false },
        { id: 'd', text: '`1` and `0`', isCorrect: false },
      ],
      explanation: 'Python\'s boolean values are `True` and `False` — note the capital first letter. This is different from JavaScript (`true`/`false`) and other languages. Internally, `True == 1` and `False == 0`, so you can use booleans in arithmetic. The `bool` type is a subclass of `int` in Python.',
      hints: [
        'Python is case-sensitive',
        'Boolean values start with a capital letter in Python',
      ],
      tags: ['bool', 'boolean', 'True', 'False', 'basics'],
      concepts: ['py-builtin-io', 'py-truthiness'],
    },
  {
      id: 'pe1-m3-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What is the result of `5 > 3 and 2 < 1`?',
      options: [
        { id: 'a', text: '`True`', isCorrect: false },
        { id: 'b', text: '`False`', isCorrect: true },
        { id: 'c', text: '`None`', isCorrect: false },
        { id: 'd', text: 'An error', isCorrect: false },
      ],
      explanation: '`and` requires **both** conditions to be True. Here, `5 > 3` is `True` but `2 < 1` is `False`. Since one condition is False, the whole expression evaluates to `False`. Remember: `and` = both must be True; `or` = at least one must be True; `not` = reverses the boolean.',
      hints: [
        '`and` means both sides must be True',
        'Evaluate each comparison separately first',
      ],
      tags: ['bool', 'and', 'logical-operators', 'comparison', 'basics'],
      concepts: ['py-builtin-io', 'py-control-flow'],
    },
  {
      id: 'pe1-m3-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What is the difference between `==` and `=` in Python?',
      options: [
        { id: 'a', text: 'They are identical — both assign values', isCorrect: false, misconceptionTag: 'py-assignment-vs-comparison' },
        { id: 'b', text: '`=` assigns a value to a variable; `==` checks if two values are equal', isCorrect: true },
        { id: 'c', text: '`==` assigns a value; `=` checks equality', isCorrect: false, misconceptionTag: 'py-assignment-vs-comparison' },
        { id: 'd', text: '`==` is used for numbers; `=` is used for strings', isCorrect: false },
      ],
      explanation: '`=` is the **assignment** operator — it gives a variable a value: `x = 5`. `==` is the **equality comparison** operator — it checks if two values are equal and returns `True` or `False`: `x == 5` returns `True`. Mixing them up is a very common beginner mistake.',
      hints: [
        'Assignment vs comparison',
        '`=` stores, `==` compares',
      ],
      tags: ['operators', 'assignment', 'comparison', 'equality', 'basics'],
      concepts: ['py-arithmetic-ops', 'py-builtin-io', 'py-control-flow'],
    },
  {
      id: 'pe1-m3-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function `classify_number(n)` that returns `"positive"` if n > 0, `"negative"` if n < 0, and `"zero"` if n == 0.',
      starterCode: `# Define classify_number(n) returning "positive"/"negative"/"zero"
# Print the result for 5, -3, and 0
`,
      testCases: [
        {
          input: 'classify_number(5)',
          expectedOutput: 'positive',
          description: 'Should return "positive" for positive numbers',
        },
        {
          input: 'classify_number(-3)',
          expectedOutput: 'negative',
          description: 'Should return "negative" for negative numbers',
        },
        {
          input: 'classify_number(0)',
          expectedOutput: 'zero',
          description: 'Should return "zero" for zero',
        },
      ],
      solution: `def classify_number(n):
    if n > 0:
        return "positive"
    elif n < 0:
        return "negative"
    else:
        return "zero"

print(classify_number(5))
print(classify_number(-3))
print(classify_number(0))`,
      tieredHints: {
        apiSignature: 'if cond: ... elif cond: ... else: ...',
        skeleton: `def ____(n):
    if n ____ 0:
        return "positive"
    elif n ____ 0:
        return "negative"
    else:
        return "zero"

print(____(5))
print(____(-3))
print(____(0))`,
      },
      explanation: 'The `if/elif/else` chain tests conditions in order. The first condition that is `True` runs its block; the rest are skipped. `elif` is short for "else if" — use it for additional conditions. `else` is the catch-all that runs when no condition matched.',
      hints: [
        'Use `if`, `elif`, and `else`',
        'Test for positive first, then negative, else it must be zero',
      ],
      tags: ['if', 'elif', 'else', 'conditionals', 'comparison', 'basics'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'pe1-m3-5',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What is the purpose of indentation in Python?',
      options: [
        { id: 'a', text: 'It makes code look nicer but has no functional effect', isCorrect: false },
        { id: 'b', text: 'It defines code blocks — Python uses indentation instead of braces `{}`', isCorrect: true },
        { id: 'c', text: 'It is only required inside functions, not if statements', isCorrect: false },
        { id: 'd', text: 'It speeds up code execution', isCorrect: false },
      ],
      explanation: 'Python uses indentation (whitespace at the start of lines) to define code blocks instead of curly braces `{}`. The standard is 4 spaces per level. Code inside an `if`, `for`, `while`, `def`, or `class` must be indented consistently. An `IndentationError` means your spacing is inconsistent.',
      hints: [
        'Python is whitespace-sensitive',
        'Use 4 spaces per indentation level (not tabs)',
      ],
      tags: ['indentation', 'blocks', 'syntax', 'basics'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'pe1-m3-6',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'Which values are considered "falsy" in Python? (Select the best answer)',
      options: [
        { id: 'a', text: 'Only `False` and `0`', isCorrect: false },
        { id: 'b', text: '`False`, `0`, `""` (empty string), `[]` (empty list), `None`', isCorrect: true },
        { id: 'c', text: 'Only `False` and `None`', isCorrect: false },
        { id: 'd', text: 'Any negative number', isCorrect: false },
      ],
      explanation: 'In Python, these values are "falsy" (evaluate to False in boolean context): `False`, `0`, `0.0`, `""` (empty string), `[]` (empty list), `()` (empty tuple), `{}` (empty dict), `set()` (empty set), and `None`. Everything else is truthy. This lets you write `if my_list:` instead of `if len(my_list) > 0:`.',
      hints: [
        'Empty containers and zero values are falsy',
        '`None` is also falsy',
      ],
      tags: ['bool', 'falsy', 'truthy', 'conditionals', 'basics'],
      concepts: ['py-builtin-io', 'py-truthiness', 'py-control-flow'],
    },
  {
      id: 'pe1-m3-7',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function `grade(score)` that returns the letter grade: `"A"` for 90+, `"B"` for 80-89, `"C"` for 70-79, `"D"` for 60-69, and `"F"` for below 60.',
      starterCode: `# Define grade(score) mapping score ranges to letter grades
# Print grade(95), grade(83), grade(74), grade(61), grade(45)
`,
      testCases: [
        {
          input: 'grade(95)',
          expectedOutput: 'A',
          description: '95 should be an A',
        },
        {
          input: 'grade(83)',
          expectedOutput: 'B',
          description: '83 should be a B',
        },
        {
          input: 'grade(55)',
          expectedOutput: 'F',
          description: '55 should be an F',
        },
      ],
      solution: `def grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

print(grade(95))
print(grade(83))
print(grade(74))
print(grade(61))
print(grade(45))`,
      tieredHints: {
        apiSignature: 'if cond: ... elif cond: ... else: ...',
        skeleton: `def ____(score):
    if score >= ____:
        return "A"
    elif score >= ____:
        return "B"
    elif score >= ____:
        return "C"
    elif score >= ____:
        return "D"
    else:
        return "F"

____(____(95))
____(____(83))
____(____(74))
____(____(61))
____(____(45))`,
      },
      explanation: 'When conditions are ordered from highest to lowest, you only need `>=` checks — if you reach `elif score >= 80`, you already know the score is below 90. The `else` clause handles everything that didn\'t match any condition.',
      hints: [
        'Order conditions from highest score down',
        'Once the first matching `if/elif` runs, the rest are skipped',
      ],
      tags: ['if', 'elif', 'else', 'conditionals', 'grading'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'pe1-m3-8',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What is a `while` loop used for in Python?',
      options: [
        { id: 'a', text: 'Looping a fixed number of times', isCorrect: false },
        { id: 'b', text: 'Repeating a block of code as long as a condition remains True', isCorrect: true },
        { id: 'c', text: 'Iterating over items in a list', isCorrect: false },
        { id: 'd', text: 'Pausing program execution until user input', isCorrect: false },
      ],
      explanation: 'A `while` loop runs its body repeatedly as long as its condition is `True`. When the condition becomes `False`, the loop stops. Unlike `for` loops, `while` loops don\'t iterate over a sequence — they just keep going until a condition fails. Always make sure the condition can eventually become `False` to avoid an infinite loop.',
      hints: [
        '`while condition:` keeps running until condition is False',
        'Make sure the condition changes inside the loop!',
      ],
      tags: ['while', 'loops', 'control-flow', 'basics'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'pe1-m3-9',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use a `while` loop to print all numbers from 1 to 5 (inclusive), one per line.',
      starterCode: `# Use a while loop to print 1 through 5
count = 1

`,
      testCases: [
        {
          input: '',
          expectedOutput: '1\n2\n3\n4\n5',
          description: 'Should print numbers 1 to 5 on separate lines',
        },
      ],
      solution: `count = 1
while count <= 5:
    print(count)
    count += 1`,
      tieredHints: {
        apiSignature: 'while condition: ...',
        skeleton: `count = ____
while count ____ ____:
    ____(count)
    count ____ 1`,
      },
      explanation: 'The loop starts with `count = 1`. The condition `count <= 5` checks before each iteration. After printing, `count += 1` increments the counter (this is essential — without it, the loop would run forever). When `count` reaches 6, `6 <= 5` is False and the loop ends.',
      hints: [
        'Start with `count = 1` and loop while `count <= 5`',
        'Don\'t forget to increment `count` inside the loop with `count += 1`',
      ],
      tags: ['while', 'loops', 'basics', 'counting'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'pe1-m3-10',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does `break` do inside a loop?',
      options: [
        { id: 'a', text: 'Pauses the loop temporarily', isCorrect: false },
        { id: 'b', text: 'Skips the current iteration and moves to the next one', isCorrect: false },
        { id: 'c', text: 'Immediately exits the loop entirely', isCorrect: true },
        { id: 'd', text: 'Restarts the loop from the beginning', isCorrect: false },
      ],
      explanation: '`break` immediately terminates the nearest enclosing loop and continues with the code after the loop. It\'s useful when you find what you\'re looking for and don\'t need to keep iterating. Compare with `continue`, which skips the rest of the current iteration but continues the loop.',
      hints: [
        '`break` = exit the loop now',
        '`continue` = skip this iteration, keep going',
      ],
      tags: ['break', 'loops', 'control-flow', 'basics'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'pe1-m3-11',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does `continue` do inside a loop?',
      options: [
        { id: 'a', text: 'Exits the loop immediately', isCorrect: false },
        { id: 'b', text: 'Skips the rest of the current iteration and jumps to the next one', isCorrect: true },
        { id: 'c', text: 'Restarts the loop from the beginning', isCorrect: false },
        { id: 'd', text: 'Continues to the code after the loop', isCorrect: false },
      ],
      explanation: '`continue` skips the remaining code in the current loop iteration and jumps directly to the next iteration. For example, to print only odd numbers: `if n % 2 == 0: continue` skips even numbers. The loop itself continues running — only the current iteration is interrupted.',
      hints: [
        '`continue` = skip this round, keep looping',
        'The loop still runs — only the current iteration is cut short',
      ],
      tags: ['continue', 'loops', 'control-flow', 'basics'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'pe1-m3-12',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does `range(5)` produce in Python?',
      options: [
        { id: 'a', text: 'The numbers 1, 2, 3, 4, 5', isCorrect: false, misconceptionTag: 'py-off-by-one-range' },
        { id: 'b', text: 'The numbers 0, 1, 2, 3, 4', isCorrect: true },
        { id: 'c', text: 'A list `[0, 1, 2, 3, 4, 5]`', isCorrect: false },
        { id: 'd', text: 'The numbers 0, 1, 2, 3, 4, 5', isCorrect: false, misconceptionTag: 'py-off-by-one-range' },
      ],
      explanation: '`range(n)` generates numbers from 0 up to (but not including) n. So `range(5)` gives 0, 1, 2, 3, 4 — that\'s 5 numbers starting from 0. `range(start, stop)` gives numbers from start up to (not including) stop. `range(start, stop, step)` also controls the step size.',
      hints: [
        'range() starts at 0 by default',
        'The end value is **exclusive** (not included)',
      ],
      tags: ['range', 'for-loop', 'basics', 'iteration'],
      concepts: ['py-range-bounds'],
    },
  {
      id: 'pe1-m3-13',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use a `for` loop with `range()` to print the multiplication table for 3 (3×1 through 3×10), one result per line in the format `3 x 1 = 3`.',
      starterCode: `# Print the 3 times table using a for loop
  `,
      testCases: [
        {
          input: '',
          expectedOutput: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30',
          description: 'Should print 3 times table from 1 to 10',
        },
      ],
      solution: `for i in range(1, 11):
      print(f"3 x {i} = {3 * i}")`,
      tieredHints: {
        apiSignature: 'range(start, stop, step=1) -> range',
        skeleton: `for i in ____(1, ____):
      ____(____"3 x {i} = {____ * i}")`,
      },
      explanation: '`range(1, 11)` generates numbers 1 through 10. Inside the loop, `i` takes each value in turn. The f-string `f"3 x {i} = {3 * i}"` formats the output. Note: `range(1, 11)` not `range(1, 10)` because the stop value is exclusive.',
      hints: [
        'Use `range(1, 11)` to get 1 through 10',
        'Inside the loop, compute `3 * i` and format with an f-string',
      ],
      tags: ['for-loop', 'range', 'f-string', 'multiplication-table'],
      concepts: ['py-range-bounds'],
    },
  {
      id: 'pe1-m3-14',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use a `for` loop with `range()` to print only even numbers from 2 to 20 (inclusive). Use `range()` with a step argument, not an `if` statement.',
      starterCode: `# Print even numbers from 2 to 20 using range() with a step
  `,
      testCases: [
        {
          input: '',
          expectedOutput: '2\n4\n6\n8\n10\n12\n14\n16\n18\n20',
          description: 'Should print even numbers 2 through 20',
        },
      ],
      solution: `for n in range(2, 21, 2):
      print(n)`,
      tieredHints: {
        apiSignature: 'range(start, stop, step=1) -> range',
        skeleton: `for n in ____(____, ____, ____):
      ____(n)`,
      },
      explanation: '`range(start, stop, step)` takes three arguments. `range(2, 21, 2)` starts at 2, goes up to (not including) 21, in steps of 2 — giving 2, 4, 6, ..., 20. Using a step in `range()` is more Pythonic than checking `if n % 2 == 0` inside the loop.',
      hints: [
        '`range()` can take a step as the third argument',
        '`range(2, 21, 2)` starts at 2, ends before 21, counting by 2s',
      ],
      tags: ['for-loop', 'range', 'step', 'even-numbers'],
      concepts: ['py-range-bounds'],
    },
  {
      id: 'pe1-builtins-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does `enumerate(["a", "b", "c"])` give you when iterating?',
      options: [
        { id: 'a', text: 'Just the values: "a", "b", "c"', isCorrect: false },
        { id: 'b', text: 'Just the indices: 0, 1, 2', isCorrect: false },
        { id: 'c', text: 'Pairs of (index, value): (0, "a"), (1, "b"), (2, "c")', isCorrect: true },
        { id: 'd', text: 'A dictionary mapping indices to values', isCorrect: false },
      ],
      explanation: '`enumerate()` adds a counter to an iterable and returns pairs of `(index, value)`. Use it when you need both the index and value: `for i, item in enumerate(my_list):`. You can set the start value: `enumerate(items, start=1)`. It\'s more Pythonic than `for i in range(len(items)):` when you need indices.',
      hints: [
        '`enumerate` gives you both index and value',
        'Unpack with `for i, val in enumerate(list):`',
      ],
      tags: ['enumerate', 'built-in', 'loops', 'iteration', 'basics'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'pe1-builtins-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does `zip([1, 2, 3], ["a", "b", "c"])` produce?',
      options: [
        { id: 'a', text: '`[1, 2, 3, "a", "b", "c"]` — a merged list', isCorrect: false },
        { id: 'b', text: 'Pairs: `(1, "a")`, `(2, "b")`, `(3, "c")`', isCorrect: true },
        { id: 'c', text: 'A dictionary `{1: "a", 2: "b", 3: "c"}`', isCorrect: false },
        { id: 'd', text: 'An error — you can\'t zip different types', isCorrect: false },
      ],
      explanation: '`zip()` takes multiple iterables and returns an iterator of tuples, pairing up elements by position. `zip([1,2,3], ["a","b","c"])` gives `(1,"a")`, `(2,"b")`, `(3,"c")`. If lists have different lengths, zip stops at the shortest. Common use: `dict(zip(keys, values))` to create a dictionary from two lists.',
      hints: [
        '`zip` pairs up elements from multiple iterables',
        'Like a zipper on a jacket — pairs things up side by side',
      ],
      tags: ['zip', 'built-in', 'iteration', 'basics'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'pe1-builtins-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `names = ["Alice", "Bob", "Charlie"]` and `scores = [85, 92, 78]`, use `zip()` to print each person\'s name and score on one line, e.g. `Alice: 85`.',
      starterCode: `# Declare names and scores as shown in the prompt
# Use zip to iterate pairs; print each as "{name}: {score}"
`,
      testCases: [
        {
          input: '',
          expectedOutput: 'Alice: 85\nBob: 92\nCharlie: 78',
          description: 'Should print each name with its score',
        },
      ],
      solution: `names = ["Alice", "Bob", "Charlie"]
scores = [85, 92, 78]

for name, score in zip(names, scores):
    print(f"{name}: {score}")`,
      tieredHints: {
        apiSignature: 'zip(*iterables) -> zip',
        skeleton: `names = ["Alice", "Bob", "Charlie"]
scores = [____, ____, ____]

for name, score in ____(names, scores):
    print(____"{name}: {score}")`,
      },
      explanation: '`zip(names, scores)` creates pairs: `("Alice", 85)`, `("Bob", 92)`, etc. The `for name, score in zip(...)` unpacks each pair into two variables. This is clean and Pythonic — no index manipulation needed.',
      hints: [
        'Use `for name, score in zip(names, scores):`',
        'Unpack both variables directly in the for loop',
      ],
      tags: ['zip', 'for-loop', 'unpacking', 'f-string', 'basics'],
      concepts: ['py-unpacking'],
    },
  {
      id: 'pe1-builtins-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does `sorted([3, 1, 4, 1, 5, 9])` return?',
      options: [
        { id: 'a', text: 'Sorts the list in place and returns `None`', isCorrect: false, misconceptionTag: 'py-append-returns-none' },
        { id: 'b', text: '`[1, 1, 3, 4, 5, 9]` — a new sorted list', isCorrect: true },
        { id: 'c', text: '`[9, 5, 4, 3, 1, 1]` — sorted in descending order', isCorrect: false },
        { id: 'd', text: 'Removes duplicates and sorts: `[1, 3, 4, 5, 9]`', isCorrect: false },
      ],
      explanation: '`sorted()` returns a **new** sorted list without modifying the original. Compare with `.sort()` which sorts **in place** and returns `None`. `sorted()` also accepts `reverse=True` for descending order and `key=` to specify a sorting function. Use `sorted()` when you want to keep the original list unchanged.',
      hints: [
        '`sorted()` returns a new list; `.sort()` modifies in place',
        'Default is ascending order',
      ],
      tags: ['sorted', 'built-in', 'lists', 'sorting', 'basics'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'pe1-builtins-5',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `words = ["banana", "apple", "cherry", "date"]`, print them sorted alphabetically, then print them sorted by length (shortest first).',
      starterCode: `# Declare words as in the prompt
# Print the alphabetical sort, then the length-based sort (pass len as the key)
`,
      testCases: [
        {
          input: '',
          expectedOutput: "['apple', 'banana', 'cherry', 'date']\n['date', 'apple', 'banana', 'cherry']",
          description: 'Should print alphabetically then by length',
        },
      ],
      solution: `words = ["banana", "apple", "cherry", "date"]

print(sorted(words))
print(sorted(words, key=len))`,
      tieredHints: {
        apiSignature: 'sorted(iterable, key=None, reverse=False) -> list',
        skeleton: `words = ["banana", "apple", "cherry", "date"]

print(____(words))
print(____(words, ____=len))`,
      },
      explanation: '`sorted(words)` sorts alphabetically by default. `sorted(words, key=len)` sorts by string length using `len` as the sorting function. The `key` parameter accepts any function — you can sort by any attribute or transformation. The original `words` list is unchanged.',
      hints: [
        '`sorted(words)` for alphabetical',
        '`sorted(words, key=len)` for length — pass `len` as the key function',
      ],
      tags: ['sorted', 'key', 'len', 'lists', 'basics'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'pe1-format-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'How do you print a float to exactly 2 decimal places using an f-string?',
      options: [
        { id: 'a', text: '`f"{value.2f}"`', isCorrect: false },
        { id: 'b', text: '`f"{value:.2f}"`', isCorrect: true },
        { id: 'c', text: '`f"{value:2}"`', isCorrect: false },
        { id: 'd', text: '`f"{round(value, 2)}"`', isCorrect: false },
      ],
      explanation: 'F-string format specs use `:.2f` — the colon `:` starts the format spec, `.2` means 2 decimal places, `f` means fixed-point float. So `f"{3.14159:.2f}"` gives `"3.14"`. Other useful specs: `d` for integers, `e` for scientific notation, `>10` for right-align in 10 chars, `,` for thousands separator.',
      hints: [
        'Format specs go after `:` inside the braces',
        '`.2f` = 2 decimal places, fixed-point',
      ],
      tags: ['f-string', 'formatting', 'float', 'format-spec', 'basics'],
      concepts: ['py-string-formatting', 'py-builtin-io'],
    },
  {
      id: 'pe1-format-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `price = 19.9` and `quantity = 3`, calculate the total and print it formatted as: `Total: €59.70` (2 decimal places).',
      starterCode: `price = 19.9
quantity = 3

# Calculate total and print it formatted with 2 decimal places
`,
      testCases: [
        {
          input: '',
          expectedOutput: 'Total: €59.70',
          description: 'Should print Total: €59.70',
        },
      ],
      solution: `price = 19.9
quantity = 3
total = price * quantity
print(f"Total: €{total:.2f}")`,
      tieredHints: {
        apiSignature: 'f"{value:.2f}" -> str',
        skeleton: `price = ____
quantity = ____
total = price ____ quantity
print(____"Total: €{total:____}")`,
      },
      explanation: '`price * quantity` gives `59.7`. The f-string `f"Total: €{total:.2f}"` formats `59.7` as `59.70` with exactly 2 decimal places. The `:.2f` format spec ensures currency-style formatting. Note: for serious financial calculations, use Python\'s `decimal` module to avoid floating-point precision issues.',
      hints: [
        'Calculate `total = price * quantity` first',
        'Use `:.2f` in the f-string for 2 decimal places',
      ],
      tags: ['f-string', 'formatting', 'float', 'arithmetic', 'basics'],
      concepts: ['py-string-formatting', 'py-builtin-io', 'py-arithmetic-ops'],
    },
  {
      id: 'pe1-idioms-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What is the Pythonic way to check if a list is empty?',
      options: [
        { id: 'a', text: '`if len(my_list) == 0:`', isCorrect: false },
        { id: 'b', text: '`if my_list == []:`', isCorrect: false },
        { id: 'c', text: '`if not my_list:`', isCorrect: true },
        { id: 'd', text: '`if my_list.isEmpty():`', isCorrect: false },
      ],
      explanation: 'The Pythonic way is `if not my_list:` — empty containers are falsy, so `not []` is `True`. This works for any container (list, dict, set, string). While `len(my_list) == 0` works, it\'s more verbose than needed. Python style (PEP 8) recommends using truthiness directly: `if my_list:` means "if the list is not empty".',
      hints: [
        'Empty containers are falsy in Python',
        '`if not my_list:` is equivalent to `if len(my_list) == 0:`',
      ],
      tags: ['idioms', 'lists', 'falsy', 'pythonic', 'basics'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'pe1-idioms-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      question: 'What does the `in` operator do in Python?',
      options: [
        { id: 'a', text: 'It imports a module into the current namespace', isCorrect: false },
        { id: 'b', text: 'It checks if a value exists in a sequence (list, string, dict, etc.)', isCorrect: true },
        { id: 'c', text: 'It creates a new element inside a container', isCorrect: false },
        { id: 'd', text: 'It is only used in `for` loops', isCorrect: false },
      ],
      explanation: '`in` tests membership: `3 in [1, 2, 3]` returns `True`. Works with lists, tuples, strings, sets, and dictionary keys. For strings: `"hello" in "hello world"` returns `True`. For dicts: `"key" in my_dict` checks keys. `not in` is the opposite. Lists check all elements (O(n)), but sets check in O(1) — use a set for frequent membership tests.',
      hints: [
        '`value in container` checks if value is present',
        'Works on lists, strings, dicts (checks keys), and sets',
      ],
      tags: ['in', 'membership', 'operators', 'basics'],
      concepts: ['py-control-flow', 'py-arithmetic-ops'],
    },
  {
      id: 'pe1-idioms-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write `is_palindrome(word)` that lowercases the input then returns whether the lowercased string equals its reverse (use slice notation `[::-1]`). Print the results for `"racecar"` (True), `"hello"` (False), and `"Madam"` (True — case-insensitive).',
      starterCode: `# Define is_palindrome(word): lowercase it, return whether it equals its reverse


# Print the result for "racecar", "hello", and "Madam"
`,
      testCases: [
        {
          input: 'is_palindrome("racecar")',
          expectedOutput: 'True',
          description: 'racecar is a palindrome',
        },
        {
          input: 'is_palindrome("hello")',
          expectedOutput: 'False',
          description: 'hello is not a palindrome',
        },
        {
          input: 'is_palindrome("Madam")',
          expectedOutput: 'True',
          description: 'Madam is a palindrome (case-insensitive)',
        },
      ],
      solution: `def is_palindrome(word):
    cleaned = word.lower()
    return cleaned == cleaned[::-1]

print(is_palindrome("racecar"))
print(is_palindrome("hello"))
print(is_palindrome("Madam"))`,
      tieredHints: {
        apiSignature: 's[start:stop:step] -> str',
        skeleton: `def ____(word):
    cleaned = word.____()
    return cleaned == cleaned[____]

print(____("racecar"))
print(____("hello"))
print(____("Madam"))`,
      },
      explanation: '`.lower()` makes it case-insensitive. `cleaned[::-1]` uses slicing with step `-1` to reverse the string — `[::-1]` means "all characters, from end to start". Comparing the string to its reverse tells you if it\'s a palindrome. This is a classic Python idiom for reversing sequences.',
      hints: [
        'Use `.lower()` for case-insensitive comparison',
        '`word[::-1]` reverses a string in Python',
      ],
      tags: ['strings', 'slicing', 'palindrome', 'lower', 'idioms'],
      concepts: ['py-slice-bounds'],
    },
  {
      id: 'pe1-idioms-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_BASICS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function `flatten(nested)` that takes a list of lists and returns a single flat list. Example: `flatten([[1, 2], [3, 4], [5]])` → `[1, 2, 3, 4, 5]`.',
      starterCode: `# Define flatten(nested) returning a single flat list (use .extend or a comprehension)
# Print flatten([[1, 2], [3, 4], [5]]) and flatten([[10, 20], [], [30]])
`,
      testCases: [
        {
          input: 'flatten([[1, 2], [3, 4], [5]])',
          expectedOutput: '[1, 2, 3, 4, 5]',
          description: 'Should flatten nested list',
        },
        {
          input: 'flatten([[10, 20], [], [30]])',
          expectedOutput: '[10, 20, 30]',
          description: 'Should handle empty sub-lists',
        },
      ],
      solution: `def flatten(nested):
    result = []
    for sublist in nested:
        result.extend(sublist)
    return result

print(flatten([[1, 2], [3, 4], [5]]))
print(flatten([[10, 20], [], [30]]))`,
      tieredHints: {
        apiSignature: 'list.extend(iterable) -> None',
        skeleton: `def ____(nested):
    result = []
    for sublist in nested:
        result.____(sublist)
    return result

____(____([[1, 2], [3, 4], [5]]))
____(____([[10, 20], [], [30]]))`,
      },
      explanation: '`.extend()` adds all items from one list to another. For each sublist in the nested list, we extend the result. An alternative using list comprehension: `[item for sublist in nested for item in sublist]`. Both are valid — the comprehension is more compact, the loop version is more readable.',
      hints: [
        'Use `.extend()` to add all items from each sublist',
        'Loop through each sublist, then extend the result',
      ],
      tags: ['lists', 'extend', 'flatten', 'for-loop', 'patterns'],
      concepts: ['py-list-aliasing'],
    },
];
