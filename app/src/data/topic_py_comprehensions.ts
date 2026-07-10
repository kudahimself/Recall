/**
 * Topic.PY_COMPREHENSIONS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pyComprehensionsCloze.ts (10), pyComprehensionsParsons.ts (10), pyComprehensionsPredictOutput.ts (10), pythonAdvancedQuestions.ts (3), pythonBatchAExpansionQuestions.ts (11), pythonGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_comprehensions_questions: Question[] = [
  {
      id: 'py-comprehensions-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the keywords for a filtering list comprehension.',
      template: `nums = [1, 2, 3, 4, 5]
evens = [n ___ n ___ nums ___ n % 2 == 0]
print(evens)`,
      blanks: ['for', 'in', 'if'],
      solution: 'nums = [1, 2, 3, 4, 5]\nevens = [n for n in nums if n % 2 == 0]\nprint(evens)',
      explanation:
        'List comprehension shape: [expr for var in iter if cond]. The if-clause filters; expr is what gets produced. The order is fixed: for/in come first, if comes last.',
      hints: ['Three keywords; same order as a for-loop with a conditional inside.'],
      tags: ['comprehension', 'filter'],
      concepts: ['py-comprehension', 'dj-orm-query-construction'],
    },
  {
      id: 'py-comprehensions-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dict-comprehension brace and separator.',
      template: `words = ["a", "bb", "ccc"]
lengths = ___w: len(w) for w in words___
print(lengths)`,
      blanks: ['{', '}'],
      solution: 'words = ["a", "bb", "ccc"]\nlengths = {w: len(w) for w in words}\nprint(lengths)',
      explanation:
        'Dict and set comprehensions both use braces. Dict comprehensions have a colon between key and value; set comprehensions have a single expression. Square brackets here would be a SyntaxError.',
      hints: ['Same brace pair for dict literals and dict comprehensions.'],
      tags: ['comprehension', 'dict'],
      concepts: ['py-comprehension', 'py-dict-key-hashability'],
    },
  {
      id: 'py-comprehensions-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the conditional expression so each n becomes "even" or "odd".',
      template: `labels = ["even" ___ n % 2 == 0 ___ "odd" for n in range(4)]
print(labels)`,
      blanks: ['if', 'else'],
      solution: 'labels = ["even" if n % 2 == 0 else "odd" for n in range(4)]\nprint(labels)',
      explanation:
        'A conditional expression is `value_if_true if cond else value_if_false`. It goes in the VALUE position (left of `for`). Filtering ifs (no else) go AFTER the for-clause.',
      hints: ['Conditional expression: TRUE_value if cond else FALSE_value.'],
      tags: ['comprehension', 'conditional-expression'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comprehensions-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the brace pair to make squares a generator (lazy) instead of a list.',
      template: `squares = ___n * n for n in range(1, 1_000_001)___
first = next(squares)
print(first)`,
      blanks: ['(', ')'],
      solution:
        'squares = (n * n for n in range(1, 1_000_001))\nfirst = next(squares)\nprint(first)',
      explanation:
        'Round parens around a comprehension produce a generator expression — lazy, single-pass, never materialized in memory. Square brackets would build a one-million-element list eagerly.',
      hints: ['Round parens for laziness, square brackets for eager list.'],
      tags: ['comprehension', 'generator', 'lazy'],
      concepts: ['py-comprehension', 'py-generator-yield'],
    },
  {
      id: 'py-comprehensions-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dict method that yields (key, value) pairs for the inversion.',
      template: `m = {"a": 1, "b": 2}
inverted = {v: k for k, v in m.___()}
print(inverted)`,
      blanks: ['items'],
      solution: 'm = {"a": 1, "b": 2}\ninverted = {v: k for k, v in m.items()}\nprint(inverted)',
      explanation:
        '.items() yields (key, value) tuples. .keys() gives only keys, .values() only values, and iterating the dict directly is equivalent to .keys(). Without .items(), the (k, v) unpacking would fail.',
      hints: ['One method gives both — keys AND values together.'],
      tags: ['comprehension', 'dict', 'items'],
      concepts: ['py-comprehension', 'py-dict-key-hashability'],
    },
  {
      id: 'py-comprehensions-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the for-clauses to flatten matrix in the right order (outer first).',
      template: `matrix = [[1, 2], [3, 4]]
flat = [n ___ row in matrix ___ n in row]
print(flat)`,
      blanks: ['for', 'for'],
      solution: 'matrix = [[1, 2], [3, 4]]\nflat = [n for row in matrix for n in row]\nprint(flat)',
      explanation:
        'Nested for-clauses read in the SAME order as nested loops: the leftmost for is the outer loop. Flipping the order references `row` before it\'s defined.',
      hints: ['Outer loop first, inner loop second — same as `for row: for n in row`.'],
      tags: ['comprehension', 'nested', 'flatten'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comprehensions-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the walrus operator so each length is computed once and tested.',
      template: `words = ["a", "ab", "abc", "abcd"]
long = [n for w in words if (n ___ len(w)) > 2]
print(long)`,
      blanks: [':='],
      solution:
        'words = ["a", "ab", "abc", "abcd"]\nlong = [n for w in words if (n := len(w)) > 2]\nprint(long)',
      explanation:
        'The walrus `:=` (PEP 572) assigns within an expression. It computes len(w) once per iteration, binds it to n, and yields n in the test result. Without walrus you\'d compute len(w) twice or refactor entirely.',
      hints: ['Two-character operator that means "assign and yield value".'],
      tags: ['comprehension', 'walrus', 'PEP 572'],
      concepts: ['py-comprehension', 'py-modern-syntax'],
    },
  {
      id: 'py-comprehensions-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the brace and the implied operator-keyword to deduplicate words into a set.',
      template: `words = ["hi", "yo", "hi", "hey"]
unique = ___w for w in words___
print(len(unique))`,
      blanks: ['{', '}'],
      solution:
        'words = ["hi", "yo", "hi", "hey"]\nunique = {w for w in words}\nprint(len(unique))',
      explanation:
        'Set comprehension uses braces with a SINGLE expression and no colon — the absence of the colon is what distinguishes it from a dict comprehension. Sets dedupe automatically.',
      hints: ['Same braces as dict, but no key:value separator.'],
      tags: ['comprehension', 'set'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comprehensions-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the discarded loop-variable convention used when you don\'t need the iteration value.',
      template: `zeros = [0 for ___ in range(5)]
print(zeros)`,
      blanks: ['_'],
      solution: 'zeros = [0 for _ in range(5)]\nprint(zeros)',
      explanation:
        'Underscore is the convention for "I need to iterate but I don\'t care about the value". Tools like linters treat it as intentionally unused. Functionally any name works, but `_` signals intent.',
      hints: ['Convention for "throwaway loop variable".'],
      tags: ['comprehension', 'convention', 'underscore'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comprehensions-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the comprehension form that creates a 3x3 matrix of independent zero rows (not aliased).',
      template: `matrix = [___ for _ in range(3)]
matrix[0][0] = 99
print(matrix)`,
      blanks: ['[0] * 3'],
      solution:
        'matrix = [[0] * 3 for _ in range(3)]\nmatrix[0][0] = 99\nprint(matrix)',
      explanation:
        'Each iteration of the comprehension creates a FRESH inner list — so rows are independent. Writing `[[0]*3]*3` would alias all three rows to the same list and mutating one would mutate all.',
      hints: ['Each iteration creates a new inner list — multiply within the comprehension.'],
      tags: ['comprehension', 'aliasing', 'matrix'],
      concepts: ['py-comprehension', 'py-list-aliasing'],
    },
  {
      id: 'py-comprehensions-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a list of squares for the even numbers in nums = [1, 2, 3, 4, 5].',
      correctOrder: [
        'nums = [1, 2, 3, 4, 5]',
        'evens_squared = [n * n for n in nums if n % 2 == 0]',
        'print(evens_squared)',
      ],
      distractorLines: [
        'evens_squared = [n * n if n % 2 == 0 for n in nums]',
        'evens_squared = [for n in nums if n % 2 == 0 n * n]',
      ],
      solution:
        'nums = [1, 2, 3, 4, 5]\nevens_squared = [n * n for n in nums if n % 2 == 0]\nprint(evens_squared)',
      explanation:
        'A filtering comprehension is `[expr for x in iter if cond]` — the if comes AFTER the for. The form `[expr if cond for ...]` is a SyntaxError; that pattern (without else) is only legal at the start as a conditional expression.',
      hints: ['Filter clauses (if without else) come AFTER the for, not before.'],
      tags: ['comprehension', 'filter', 'list'],
      concepts: ['py-comprehension', 'dj-orm-query-construction'],
    },
  {
      id: 'py-comprehensions-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a list of "even" or "odd" labels — one per number in [1, 2, 3, 4] — using a conditional expression inside the comprehension.',
      correctOrder: [
        'labels = ["even" if n % 2 == 0 else "odd" for n in [1, 2, 3, 4]]',
        'print(labels)',
      ],
      distractorLines: [
        'labels = [n for n in [1, 2, 3, 4] if "even" else "odd"]',
        'labels = ["even" for n in [1, 2, 3, 4] if n % 2 == 0 else "odd"]',
      ],
      solution:
        'labels = ["even" if n % 2 == 0 else "odd" for n in [1, 2, 3, 4]]\nprint(labels)',
      explanation:
        'When you need to TRANSFORM each element conditionally (no filtering), use a conditional expression in the value position: `expr_if_true if cond else expr_if_false`. The `if/else` belongs at the front, not at the end where filters live.',
      hints: ['Transform-conditionally: if/else at the FRONT. Filter: if at the END.'],
      tags: ['comprehension', 'conditional-expression'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comprehensions-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a dict mapping each word in words = ["a", "bb", "ccc"] to its length.',
      correctOrder: [
        'words = ["a", "bb", "ccc"]',
        'lengths = {w: len(w) for w in words}',
        'print(lengths)',
      ],
      distractorLines: [
        'lengths = [w: len(w) for w in words]',
        'lengths = {len(w) for w in words}',
      ],
      solution:
        'words = ["a", "bb", "ccc"]\nlengths = {w: len(w) for w in words}\nprint(lengths)',
      explanation:
        'Dict comprehensions use {key: value for ...} — note both braces and the colon. Square brackets give a list of (k, v) syntax errors; braces with a single expression give a set, not a dict.',
      hints: ['Dict comprehension uses braces AND a colon between key and value.'],
      tags: ['comprehension', 'dict'],
      concepts: ['py-comprehension', 'py-dict-key-hashability'],
    },
  {
      id: 'py-comprehensions-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Flatten a 2D list matrix = [[1, 2], [3, 4], [5, 6]] into a single list using a nested comprehension.',
      correctOrder: [
        'matrix = [[1, 2], [3, 4], [5, 6]]',
        'flat = [n for row in matrix for n in row]',
        'print(flat)',
      ],
      distractorLines: [
        'flat = [n for n in row for row in matrix]',
        'flat = [[n for n in row] for row in matrix]',
      ],
      solution:
        'matrix = [[1, 2], [3, 4], [5, 6]]\nflat = [n for row in matrix for n in row]\nprint(flat)',
      explanation:
        'Nested for-clauses in a comprehension read LEFT-TO-RIGHT in the same order as nested loops. The outer loop comes first: `for row in matrix` then `for n in row`. Reversing them references `row` before it\'s defined.',
      hints: ['Outer loop first, inner loop second — same order as nested for/in statements.'],
      tags: ['comprehension', 'nested', 'flatten'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comprehensions-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a generator expression for squares of 1..1_000_000 (lazy) and consume only the first 3 values.',
      correctOrder: [
        'from itertools import islice',
        '',
        'squares = (n * n for n in range(1, 1_000_001))',
        'first_three = list(islice(squares, 3))',
        'print(first_three)',
      ],
      distractorLines: [
        'squares = [n * n for n in range(1, 1_000_001)]',
        'first_three = squares[:3]',
      ],
      solution:
        'from itertools import islice\n\nsquares = (n * n for n in range(1, 1_000_001))\nfirst_three = list(islice(squares, 3))\nprint(first_three)',
      explanation:
        'Round parens create a generator — values are produced lazily, never materializing all million in memory. Generators don\'t support [:3] slicing; use itertools.islice to take a prefix.',
      hints: ['Round parens for laziness; islice for slicing a generator.'],
      tags: ['comprehension', 'generator', 'lazy'],
      concepts: ['py-comprehension', 'py-generator-yield'],
    },
  {
      id: 'py-comprehensions-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a set of unique lowercased words from text = "Hello hello WORLD world".',
      correctOrder: [
        'text = "Hello hello WORLD world"',
        'unique = {w.lower() for w in text.split()}',
        'print(unique)',
      ],
      distractorLines: [
        'unique = [w.lower() for w in text.split()]',
        'unique = {w.lower() for w in text}',
      ],
      solution:
        'text = "Hello hello WORLD world"\nunique = {w.lower() for w in text.split()}\nprint(unique)',
      explanation:
        'Set comprehension uses braces with a single expression (no colon). Iterating a string yields characters, not words — `text.split()` produces the words. Lowercasing first ensures "Hello" and "hello" deduplicate.',
      hints: ['Set comprehension: {expr for ...}. Don\'t iterate the raw string — split first.'],
      tags: ['comprehension', 'set', 'split'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comprehensions-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Invert a dict mapping = {"a": 1, "b": 2, "c": 3} so values become keys.',
      correctOrder: [
        'mapping = {"a": 1, "b": 2, "c": 3}',
        'inverted = {v: k for k, v in mapping.items()}',
        'print(inverted)',
      ],
      distractorLines: [
        'inverted = {v: k for k, v in mapping}',
        'inverted = {v: k for v, k in mapping.items()}',
      ],
      solution:
        'mapping = {"a": 1, "b": 2, "c": 3}\ninverted = {v: k for k, v in mapping.items()}\nprint(inverted)',
      explanation:
        '.items() yields (key, value) tuples that unpack into k, v. Iterating the dict directly yields only KEYS, so unpacking `k, v` would fail or give wrong results. The order in `for k, v` reflects the order .items() yields.',
      hints: ['Use .items() to iterate (key, value) pairs — not the dict directly.'],
      tags: ['comprehension', 'dict', 'invert'],
      concepts: ['py-comprehension', 'py-dict-key-hashability'],
    },
  {
      id: 'py-comprehensions-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a list of (i, j) coordinate pairs for a 3x3 grid where i != j.',
      correctOrder: [
        'pairs = [(i, j) for i in range(3) for j in range(3) if i != j]',
        'print(pairs)',
      ],
      distractorLines: [
        'pairs = [(i, j) for i in range(3) if i != j for j in range(3)]',
        'pairs = [(i, j) for j in range(3) for i in range(3) if i != j]',
      ],
      solution:
        'pairs = [(i, j) for i in range(3) for j in range(3) if i != j]\nprint(pairs)',
      explanation:
        'Multiple for-clauses act as nested loops; the if filter applies to the INNER loop\'s context. The form `for i in range(3) if i != j for j in range(3)` references j before it exists. Putting i\'s loop first gives the natural outer-then-inner ordering.',
      hints: ['Outer loop first, inner loop second; the if comes after both fors when it depends on both vars.'],
      tags: ['comprehension', 'nested', 'product'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comprehensions-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use a walrus operator inside a comprehension to keep only computed values where len > 3, avoiding double computation.',
      correctOrder: [
        'words = ["hi", "hello", "yo", "python"]',
        'long_lengths = [n for w in words if (n := len(w)) > 3]',
        'print(long_lengths)',
      ],
      distractorLines: [
        'long_lengths = [len(w) for w in words if len(w) > 3]',
        'long_lengths = [n := len(w) for w in words if n > 3]',
      ],
      solution:
        'words = ["hi", "hello", "yo", "python"]\nlong_lengths = [n for w in words if (n := len(w)) > 3]\nprint(long_lengths)',
      explanation:
        'The walrus operator `:=` assigns inside an expression. Here it computes len(w) once per iteration AND tests it. Without walrus, you\'d either compute len(w) twice or refactor to a generator/loop. Using `n := len(w)` in the value position before defining n via `if` is a NameError.',
      hints: ['Walrus must compute the value before it can be tested or used.'],
      tags: ['comprehension', 'walrus', 'optimization'],
      concepts: ['py-comprehension', 'py-modern-syntax'],
    },
  {
      id: 'py-comprehensions-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a 3x3 zero-initialized 2D matrix using a nested list comprehension.',
      correctOrder: [
        'matrix = [[0 for _ in range(3)] for _ in range(3)]',
        'print(matrix)',
      ],
      distractorLines: [
        'matrix = [[0] * 3] * 3',
        'matrix = [0 for _ in range(3) for _ in range(3)]',
      ],
      solution: 'matrix = [[0 for _ in range(3)] for _ in range(3)]\nprint(matrix)',
      explanation:
        '[[0]*3]*3 looks identical but creates THREE references to the SAME inner list — mutating one row mutates them all. The nested comprehension creates a fresh list each iteration. The flat form `[0 for _ in ... for _ in ...]` produces a 1D list of 9 zeros, not a 2D shape.',
      hints: ['*-replication shares references; nested comprehension creates fresh inner lists.'],
      tags: ['comprehension', 'nested', 'aliasing'],
      concepts: ['py-comprehension', 'py-list-aliasing'],
    },
  {
      id: 'py-comprehensions-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `print([n * n for n in range(1, 6) if n % 2 == 0])`,
      expectedOutput: `[4, 16]`,
      explanation:
        'range(1, 6) yields 1, 2, 3, 4, 5. Filtering for even numbers leaves 2 and 4. Squaring gives [4, 16].',
      hints: ['Filter first, then square. Which numbers in 1..5 are even?'],
      tags: ['comprehension', 'filter'],
      concepts: ['py-comprehension', 'dj-orm-query-construction'],
    },
  {
      id: 'py-comprehensions-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `pairs = [(i, j) for i in range(2) for j in range(3)]
print(pairs)`,
      expectedOutput: `[(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2)]`,
      explanation:
        'Nested for-clauses iterate left-to-right as outer-then-inner. For each i in 0..1, j sweeps 0..2 — giving 6 pairs in the order shown.',
      hints: ['Outer loop changes slowest; inner loop completes fully before outer advances.'],
      tags: ['comprehension', 'nested', 'iteration-order'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comprehensions-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `gen = (n * n for n in range(3))
print(type(gen).__name__)
print(list(gen))
print(list(gen))`,
      expectedOutput: `generator
[0, 1, 4]
[]`,
      explanation:
        'Round parens create a generator, not a list. The first list(gen) consumes the generator, leaving it exhausted. The second list(gen) iterates a now-empty generator — yielding [].',
      hints: ['Generators are single-use — once consumed, they\'re exhausted.'],
      tags: ['comprehension', 'generator', 'exhaustion'],
      concepts: ['py-comprehension', 'py-generator-yield'],
    },
  {
      id: 'py-comprehensions-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `pairs = [("a", 1), ("b", 2), ("a", 3)]
d = {k: v for k, v in pairs}
print(d)`,
      expectedOutput: `{'a': 3, 'b': 2}`,
      explanation:
        'Dict comprehensions iterate left-to-right. The first ("a", 1) sets d["a"] = 1, then ("b", 2) sets d["b"] = 2, then ("a", 3) OVERWRITES d["a"] = 3. Last write wins — there\'s no merging or warning on duplicate keys.',
      hints: ['What happens on duplicate keys in a dict comprehension?'],
      tags: ['comprehension', 'dict', 'duplicate-keys'],
      concepts: ['py-comprehension', 'py-dict-key-hashability'],
    },
  {
      id: 'py-comprehensions-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `matrix = [[0] * 3] * 3
matrix[0][0] = 99
print(matrix)`,
      expectedOutput: `[[99, 0, 0], [99, 0, 0], [99, 0, 0]]`,
      explanation:
        '[[0]*3]*3 creates ONE inner list, then duplicates the REFERENCE three times. All three rows point to the same list object, so mutating matrix[0][0] mutates all rows. Use a comprehension `[[0]*3 for _ in range(3)]` to get independent rows.',
      hints: ['Does *-replication on a list create copies or references?'],
      tags: ['comprehension', 'aliasing', 'mutation'],
      concepts: ['py-comprehension', 'py-list-aliasing'],
    },
  {
      id: 'py-comprehensions-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `gen = (print(n) or n for n in range(3))
print("before consume")
result = list(gen)
print(result)`,
      expectedOutput: `before consume
0
1
2
[0, 1, 2]`,
      explanation:
        'A generator does NOT execute its body at creation time. The print()s only happen when the generator is consumed by list(). So "before consume" prints first, then list() drives execution which prints 0, 1, 2, then the result list is shown.',
      hints: ['When does a generator actually run its code?'],
      tags: ['comprehension', 'generator', 'lazy'],
      concepts: ['py-comprehension', 'py-generator-yield'],
    },
  {
      id: 'py-comprehensions-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `words = ["a", "ab", "abc", "abcd"]
result = [n for w in words if (n := len(w)) > 1]
print(result)
print(n)`,
      expectedOutput: `[2, 3, 4]
4`,
      explanation:
        'The walrus binds n in the enclosing scope (PEP 572). Inside the comprehension, n is len(w) for each kept item. After the comprehension finishes, n leaks out with its LAST assigned value — len("abcd") = 4. Regular comprehension variables (w) do NOT leak; walrus assignments DO.',
      hints: ['Walrus assignments leak out of comprehensions; regular for-vars don\'t.'],
      tags: ['comprehension', 'walrus', 'scope-leak'],
      concepts: ['py-comprehension', 'py-modern-syntax'],
    },
  {
      id: 'py-comprehensions-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `s = {n % 3 for n in range(10)}
print(sorted(s))`,
      expectedOutput: `[0, 1, 2]`,
      explanation:
        'A set comprehension dedupes automatically. range(10) yields 0..9; n%3 gives 0,1,2,0,1,2,0,1,2,0. The set holds {0, 1, 2}. sorted() returns a list view in ascending order.',
      hints: ['Set comprehension dedupes; what unique values does n%3 produce?'],
      tags: ['comprehension', 'set'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comprehensions-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `data = [{"name": "a", "age": 30}, {"name": "b", "age": 17}, {"name": "c", "age": 22}]
adult_names = [d["name"] for d in data if d["age"] >= 18]
print(adult_names)`,
      expectedOutput: `['a', 'c']`,
      explanation:
        'Filter keeps dicts where age >= 18 — that\'s "a" (30) and "c" (22), excluding "b" (17). Then we extract the name from each.',
      hints: ['Filter then transform — which entries pass the age check?'],
      tags: ['comprehension', 'filter', 'dict-access'],
      concepts: ['py-comprehension', 'dj-orm-query-construction'],
    },
  {
      id: 'py-comprehensions-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `labels = ["+" if n > 0 else "-" if n < 0 else "0" for n in [3, -2, 0, 5, -1]]
print(labels)`,
      expectedOutput: `['+', '-', '0', '+', '-']`,
      explanation:
        'A chained conditional expression evaluates left to right: first check n > 0, otherwise check n < 0, otherwise default to "0". This handles three categories without nested if/else statements.',
      hints: ['Read the conditional left-to-right: positive, negative, otherwise zero.'],
      tags: ['comprehension', 'conditional-expression', 'nested-ternary'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-adv-comp-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write `flatten_and_transform(nested: list[list[int]]) -> list[int]` as a single comprehension. Flatten the input, square each element, and keep only squares strictly greater than 10 (preserving input order). Example: `flatten_and_transform([[1, 2, 3], [4, 5], [6]])` → `[16, 25, 36]`.',
      starterCode: ``,
      testCases: [
        {
          input: '[[1, 2, 3], [4, 5], [6]]',
          expectedOutput: '[16, 25, 36]',
          description: 'Should flatten, square, and filter in one comprehension',
        },
      ],
      solution: `def flatten_and_transform(nested: list[list[int]]) -> list[int]:
      """Flatten, square, and filter in one comprehension."""
      return [x * x for sublist in nested for x in sublist if x * x > 10]
  `,
      explanation: 'Nested list comprehensions read left-to-right in the same order as equivalent nested for loops. `for sublist in nested` is the outer loop, `for x in sublist` is the inner loop. The `if` clause filters after each element. A common mistake is writing `for x in sublist for sublist in nested` (wrong order). This is more concise than itertools.chain + filter, but for deeply nested structures or complex logic, explicit loops are more readable.',
      hints: [
        'Outer for clause comes first: for sublist in nested',
        'Inner for clause next: for x in sublist',
        'if clause at the end for filtering',
      ],
      tags: ['comprehension', 'nested', 'flatten', 'filter'],
      concepts: ['py-comprehension', 'dj-orm-query-construction'],
    },
  {
      id: 'py-adv-comp-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write `word_lengths(sentences: list[str]) -> dict[str, int]` as a single dict comprehension. Map distinct words (lowercased) appearing across all sentences to their lengths, keeping only words longer than 3 characters. Example: `word_lengths(["Hello World", "hello Python"])` → `{"hello": 5, "world": 5, "python": 6}`.',
      starterCode: ``,
      testCases: [
        {
          input: '["Hello World", "hello Python"]',
          expectedOutput: '{"hello": 5, "world": 5, "python": 6}',
          description: 'Should create filtered dict comprehension over nested for-clauses',
        },
      ],
      solution: `def word_lengths(sentences: list[str]) -> dict[str, int]:
    return {
        word.lower(): len(word)
        for sentence in sentences
        for word in sentence.split()
        if len(word) > 3
    }
`,
      explanation: 'Dict comprehensions use {key_expr: value_expr for item in iterable if condition}. They can nest for-clauses just like list comprehensions — here, one iterates sentences and the next splits each into words. Duplicate keys naturally deduplicate (last one wins).',
      hints: [
        '{key: value for item in iterable if condition}',
        'Nested for-clauses work in dict comprehensions too',
        'word.lower() gives the case-folded key; duplicate keys collapse',
      ],
      tags: ['comprehension', 'dict', 'filter', 'nested-for'],
      concepts: ['py-comprehension', 'dj-orm-query-construction'],
    },
  {
      id: 'py-adv-comp-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      question: 'What is the key difference between `[x*2 for x in range(1000000)]` and `(x*2 for x in range(1000000))`?',
      options: [
        { id: 'a', text: 'The bracket version creates a full list in memory (~8MB); the parentheses version creates a lazy generator that produces values one at a time, using almost no memory', isCorrect: true },
        { id: 'b', text: 'They are identical — parentheses and brackets are interchangeable for comprehensions', isCorrect: false },
        { id: 'c', text: 'The parentheses version creates a tuple of 1 million elements', isCorrect: false },
        { id: 'd', text: 'The bracket version is lazy and the parentheses version is eager', isCorrect: false },
      ],
      explanation: 'Square brackets [...] create a list comprehension — it evaluates immediately and stores all values in memory. Parentheses (...) create a generator expression — it evaluates lazily, computing each value only when requested. For 1M integers, the list uses ~8MB of memory while the generator uses nearly zero. Generators are ideal when you only need to iterate once (e.g., passing to sum(), any(), or a for loop). Use lists when you need indexing, len(), or multiple iterations.',
      hints: [
        'Generator expressions are lazy — they compute on demand',
        'You can pass generators directly to sum(), any(), all()',
      ],
      tags: ['comprehension', 'generator', 'memory', 'lazy-evaluation'],
      concepts: ['py-comprehension', 'py-generator-yield'],
    },
  {
      id: 'py-comp-what-is',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      question: 'What does `[x * 2 for x in range(5)]` evaluate to?',
      options: [
        { id: 'a', text: '`[0, 1, 2, 3, 4]`', isCorrect: false },
        { id: 'b', text: '`[0, 2, 4, 6, 8]` — a list comprehension that applies `x * 2` to each x from 0..4', isCorrect: true },
        { id: 'c', text: 'An error', isCorrect: false },
        { id: 'd', text: '`range(10)`', isCorrect: false },
      ],
      explanation: 'A list comprehension `[expr for item in iterable]` is shorthand for building a list via a loop. Often replaces `result = []; for x in range(5): result.append(x * 2)` with a one-liner. Dict and set comprehensions follow the same pattern with `{}` and a `k: v` expression or a bare one. Generator expressions use `()` and don\'t materialise the whole list — memory-friendly.',
      hints: [
        '[expr for item in iterable]',
        'Equivalent to a loop that appends expr',
        'Also dict: {k: v for ...}, set: {expr for ...}, gen: (expr for ...)',
      ],
      tags: ['comprehensions', 'list', 'basics'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comp-squared-evens',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a list of the squares of the even numbers in the range `0..9` using a SINGLE list comprehension that combines iteration, filtering, and transformation. Print the resulting list (expect `[0, 4, 16, 36, 64]`).',
      starterCode: ``,
      testCases: [
        {
          input: 'list comprehension with filter',
          expectedOutput: '[0, 4, 16, 36, 64]',
          description: 'if clause filters before the expression',
        },
      ],
      solution: `print([x * x for x in range(10) if x % 2 == 0])`,
      explanation: 'The `if` clause at the end filters which items reach the expression. Order: iterate `range(10)`, keep only where `x % 2 == 0`, then apply `x * x`. Equivalent to `filter` + `map` but usually more readable: `list(map(lambda x: x*x, filter(lambda x: x % 2 == 0, range(10))))` is the same result, less fun.',
      hints: [
        '[expr for x in iter if cond]',
        'if filters before the expression is applied',
        'Equivalent to filter() + map() but more readable',
      ],
      tags: ['comprehensions', 'list', 'filter'],
      concepts: ['py-comprehension', 'dj-orm-query-construction'],
    },
  {
      id: 'py-comp-dict-doubled',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `prices = {"apple": 1, "banana": 2, "cherry": 3}`, build a new dict `doubled` where every value is twice the original but keys are unchanged — use a DICT comprehension that iterates over the source dict\'s key-value pairs. Print `doubled` (expect `{\'apple\': 2, \'banana\': 4, \'cherry\': 6}`).',
      starterCode: ``,
      testCases: [
        {
          input: 'dict comprehension over items()',
          expectedOutput: "{'apple': 2, 'banana': 4, 'cherry': 6}",
          description: 'dict comp unpacks (k, v) from items()',
        },
      ],
      solution: `prices = {"apple": 1, "banana": 2, "cherry": 3}
doubled = {k: v * 2 for k, v in prices.items()}
print(doubled)`,
      explanation: 'Dict comprehensions: `{key_expr: value_expr for ... in ...}`. Use `.items()` to unpack both key and value in one loop. Filter with `if`: `{k: v for k, v in prices.items() if v > 1}`. Great for renaming keys, filtering, applying transformations at the boundary between data sources.',
      hints: [
        '{key: value for k, v in source.items()}',
        'Works like list comprehension but builds a dict',
        'Filter with trailing if',
      ],
      tags: ['comprehensions', 'dict', 'items'],
      concepts: ['py-comprehension', 'py-dict-key-hashability'],
    },
  {
      id: 'py-comp-set-unique-words',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `sentence = "the quick brown fox jumps over the lazy dog the fox"`, build a `words` collection containing every DISTINCT lowercased word that appears in the sentence — use a SET comprehension (so duplicates auto-collapse) after splitting on whitespace and lowercasing. Print the number of unique words (expect `8` — duplicates of "the" and "fox" collapse).',
      starterCode: ``,
      testCases: [
        {
          input: 'set comprehension deduplicates',
          expectedOutput: '8',
          description: 'Braces with a single expression = set comprehension',
        },
      ],
      solution: `sentence = "the quick brown fox jumps over the lazy dog the fox"
words = {w.lower() for w in sentence.split()}
print(len(words))`,
      explanation: 'Set comprehensions use `{expr for ...}` — single expression, not `k: v`. Ideal for deduplication during a transformation. For "just unique things" without a transformation, `set(sentence.split())` is shorter. Compare dict vs set literal disambiguation: `{}` is an empty dict, `set()` is an empty set — comprehensions have expressions so the parser knows which to build.',
      hints: [
        '{expr for x in iter} = set comprehension',
        'Single expression, no colon (that would be a dict)',
        'Deduplicates automatically — no extra set() call needed',
      ],
      tags: ['comprehensions', 'set', 'deduplication'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comp-nested-matrix',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `matrix = [[1, 2, 3], [4, 5, 6]]`, build its transpose `transposed` (3×2) using a nested list comprehension: outer loop iterates column indices `0..2`, inner pulls that column from each row. Print the result (expect `[[1, 4], [2, 5], [3, 6]]`).',
      starterCode: ``,
      testCases: [
        {
          input: 'nested comprehension for matrix transpose',
          expectedOutput: '[[1, 4], [2, 5], [3, 6]]',
          description: 'Outer builds rows of the transpose, inner collects column values',
        },
      ],
      solution: `matrix = [[1, 2, 3], [4, 5, 6]]
transposed = [[row[i] for row in matrix] for i in range(3)]
print(transposed)`,
      explanation: 'Nested comprehensions read OUTER-first: `[[inner] for i in range(3)]` builds 3 outer lists; each inner `[row[i] for row in matrix]` collects column `i` from every row. The equivalent using `zip`: `list(map(list, zip(*matrix)))` — shorter but less explicit. Go with whichever is clearer to the reader; both are idiomatic.',
      hints: [
        'Read outer loop first, inner loop second',
        'Alternative: list(map(list, zip(*matrix))) via unpacking',
        'Good for matrix ops, image processing, cartesian-product-style builds',
      ],
      tags: ['comprehensions', 'nested', 'matrix', 'transpose'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comp-genexp-sum',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Sum the squares of the integers `0..999` without materialising an intermediate list — pass a generator expression directly to `sum`. Print the total (expect `332833500`).',
      starterCode: ``,
      testCases: [
        {
          input: 'generator expression inside sum()',
          expectedOutput: '332833500',
          description: 'Genexp avoids building an intermediate list',
        },
      ],
      solution: `total = sum(x * x for x in range(1000))
print(total)`,
      explanation: 'Generator expressions use `(expr for ...)` — produce values lazily instead of building the whole list in memory. When passed directly as the only argument to a function, the parentheses can be dropped: `sum(x * x for x in range(1000))` works without the outer `()`. Use them with `sum`, `max`, `min`, `any`, `all` whenever intermediate materialisation is wasteful. For tiny collections it doesn\'t matter — but becomes important over millions of items.',
      hints: [
        '(expr for x in iter) = generator expression',
        'Omit outer parens when it is the sole function argument',
        'Memory O(1) vs O(n) for the list comprehension equivalent',
      ],
      tags: ['comprehensions', 'generator-expression', 'lazy', 'sum'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comp-flatten',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `nested = [[1, 2], [3, 4, 5], [6]]`, flatten it into a single list `flat` using a list comprehension with TWO `for` clauses (they read left-to-right like outer/inner loops). Print the flattened list (expect `[1, 2, 3, 4, 5, 6]`).',
      starterCode: ``,
      testCases: [
        {
          input: 'flatten list of lists in one comprehension',
          expectedOutput: '[1, 2, 3, 4, 5, 6]',
          description: 'Multiple for clauses read left-to-right',
        },
      ],
      solution: `nested = [[1, 2], [3, 4, 5], [6]]
flat = [item for sub in nested for item in sub]
print(flat)`,
      explanation: 'Two `for` clauses in a single comprehension read left-to-right, same as nested loops: `for sub in nested → for item in sub → item`. Equivalent to `result = []; for sub in nested: for item in sub: result.append(item)`. Shorter alternatives: `itertools.chain.from_iterable(nested)`, `sum(nested, [])` (quadratic — avoid on large inputs), or `functools.reduce(lambda a, b: a + b, nested)`.',
      hints: [
        'Multiple `for` clauses read left-to-right (outer to inner)',
        'itertools.chain.from_iterable is the explicit alternative',
        'Avoid sum(nested, []) — O(n²)',
      ],
      tags: ['comprehensions', 'flatten', 'nested-for'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comp-ternary',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `nums = [1, -2, 3, -4, 5]`, build `signs` — a list with `"+"` for non-negative elements, `"-"` otherwise. Use a list comprehension with a ternary expression in the value position. Print the result (expect `[\'+\', \'-\', \'+\', \'-\', \'+\']`).',
      starterCode: ``,
      testCases: [
        {
          input: 'conditional expression in list comp',
          expectedOutput: "['+', '-', '+', '-', '+']",
          description: 'if/else in the value position, not the filter position',
        },
      ],
      solution: `nums = [1, -2, 3, -4, 5]
signs = ["+" if n >= 0 else "-" for n in nums]
print(signs)`,
      explanation: 'Two uses of `if` in comprehensions: (1) FILTER at the end — `[x for x in nums if x >= 0]` drops items; (2) VALUE selection via ternary expression — `["+" if x >= 0 else "-" for x in nums]` transforms every item. Common confusion: putting both is fine — `[x*2 for x in nums if x > 0]` filters then transforms. Readability rule: if it needs more than one ternary inside a comprehension, switch to a regular loop.',
      hints: [
        '"expr_if_true if cond else expr_if_false" is the ternary value',
        'if at the end filters; if up-front with else transforms',
        'Don\'t nest multiple ternaries — use a real loop or helper',
      ],
      tags: ['comprehensions', 'ternary', 'conditional-expression'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comp-genexp-vs-list',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      question: 'When is a generator expression preferable to a list comprehension?',
      options: [
        { id: 'a', text: 'Never — list comprehensions are always faster', isCorrect: false },
        { id: 'b', text: 'When you only need to iterate the result ONCE and don\'t need random access. Generators produce values lazily (O(1) memory), so they\'re ideal as arguments to `sum`, `max`, `any`, `all`, or in streaming pipelines over large inputs. They cannot be re-iterated or indexed.', isCorrect: true },
        { id: 'c', text: 'When the output needs to be sortable', isCorrect: false },
        { id: 'd', text: 'Only when the iterable has more than 100 items', isCorrect: false },
      ],
      explanation: 'Key trade-offs: generators are O(1) memory but single-use — once iterated, they\'re exhausted; can\'t do `len()`, can\'t index, can\'t re-iterate. Lists are O(n) memory but fully re-playable. Rule of thumb: if you pipe the result into a reducer (`sum`, `max`, `any`, `all`, `next`) or into another generator, use `(...)`. If you need to use the collection multiple times or index into it, use `[...]`.',
      hints: [
        'Generator: O(1) memory, one-shot iteration',
        'List: O(n) memory, re-iterable and indexable',
        'Reducers (sum/max/any/all) pair perfectly with generators',
      ],
      tags: ['comprehensions', 'generator-expression', 'memory'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comp-invert-dict',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `colors = {"apple": "red", "strawberry": "red", "banana": "yellow"}`, use a dict comprehension to build `inverted` — original values become keys, original keys become values. When two source keys share a value, the last iterated pair wins. Print the result (expect `{\'red\': \'strawberry\', \'yellow\': \'banana\'}`).',
      starterCode: ``,
      testCases: [
        {
          input: 'dict comprehension inverting with duplicate values',
          expectedOutput: "{'red': 'strawberry', 'yellow': 'banana'}",
          description: 'Later key overwrites earlier for duplicate values',
        },
      ],
      solution: `colors = {"apple": "red", "strawberry": "red", "banana": "yellow"}
inverted = {v: k for k, v in colors.items()}
print(inverted)`,
      explanation: 'Dict comprehension assignments overwrite existing keys — last one wins. For duplicate values, iteration order determines the surviving pair (3.7+: insertion order). If you need ALL keys that share a value, build a `defaultdict(list)` instead: `inverted[v].append(k)`. If you need the FIRST winner, reverse iteration or check membership first.',
      hints: [
        'Dict comp with duplicate keys → last assignment wins',
        'To keep ALL duplicates: defaultdict(list)',
        'Insertion order is guaranteed on 3.7+',
      ],
      tags: ['comprehensions', 'dict-comp', 'invert', 'last-wins'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-comp-int-dict-filter',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Given `scores = {"alice": 85, "bob": 60, "carol": 92, "dan": 55}`, build `passing` — a filtered dict containing only the entries where the score is at least 80. Use a DICT comprehension with a filter clause. Insertion order of the kept entries must be preserved. Print the result (expect `{\'alice\': 85, \'carol\': 92}`).',
      starterCode: ``,
      testCases: [
        {
          input: 'dict comprehension with if filter',
          expectedOutput: "{'alice': 85, 'carol': 92}",
          description: 'if clause drops entries before they enter the new dict',
        },
      ],
      solution: `scores = {"alice": 85, "bob": 60, "carol": 92, "dan": 55}
passing = {name: score for name, score in scores.items() if score >= 80}
print(passing)`,
      explanation:
        'Dict comprehensions accept an `if` filter just like list comps. The filter runs BEFORE the key/value expressions, so rejected entries never reach the new dict — no need for a second pass. This is one of the most common real-world dict-comp shapes: "take this source dict, project a subset based on a predicate". Combine with value transformation for the canonical ETL line: `{k: transform(v) for k, v in src.items() if keep(k, v)}`.',
      hints: [
        '{k: v for k, v in src.items() if cond}',
        'Filter evaluates before the key/value expressions',
        'Insertion order of kept entries is preserved (3.7+)',
      ],
      tags: ['comprehensions', 'dict-comp', 'filter', 'intermediate'],
      concepts: ['py-comprehension', 'dj-orm-query-construction'],
    },
  {
      id: 'py-gap-comprehensions-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      question: 'What is a list comprehension in Python?',
      options: [
        { id: 'a', text: 'A concise way to create lists using the syntax `[expression for item in iterable]`. Equivalent to a for loop that appends. Example: `[x*2 for x in range(5)]` produces `[0, 2, 4, 6, 8]`.', isCorrect: true },
        { id: 'b', text: 'A method that lists all the attributes and methods of a Python object', isCorrect: false },
        { id: 'c', text: 'A special import statement that loads list-related utilities', isCorrect: false },
        { id: 'd', text: 'A debugging tool that prints each element of a list on a separate line', isCorrect: false },
      ],
      explanation: 'A list comprehension is a compact syntax for creating a new list by transforming and/or filtering elements from an iterable. The basic form is `[expression for item in iterable]`. You can add a condition: `[expression for item in iterable if condition]`. It\'s equivalent to building a list with a for loop and `.append()`, but more concise and often faster.',
      hints: [
        'Square brackets `[]` with a `for` inside = list comprehension',
        'You can add `if` at the end to filter elements',
      ],
      tags: ['comprehensions', 'list', 'basics'],
      concepts: ['py-comprehension'],
    },
  {
      id: 'py-gap-comprehensions-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COMPREHENSIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Convert this loop to a list comprehension:\n```python\nresult = []\nfor n in range(10):\n    if n % 2 == 0:\n        result.append(n**2)\n```\nThe result should be the squares of even numbers from 0 to 9: `[0, 4, 16, 36, 64]`.',
      starterCode: `# Original loop version (for reference):
# result = []
# for n in range(10):
#     if n % 2 == 0:
#         result.append(n**2)

# Rewrite as a list comprehension:
result = # your comprehension here

print(result)
`,
      testCases: [
        {
          input: '[n**2 for n in range(10) if n % 2 == 0]',
          expectedOutput: '[0, 4, 16, 36, 64]',
          description: 'Should produce squares of even numbers 0-9',
        },
      ],
      solution: `result = [n**2 for n in range(10) if n % 2 == 0]

print(result)  # [0, 4, 16, 36, 64]`,
      explanation: 'The comprehension `[n**2 for n in range(10) if n % 2 == 0]` reads almost like English: "square of n, for each n in 0-9, if n is even." The structure maps directly from the loop: the `append(n**2)` becomes the expression, the `for` stays, and the `if` condition moves to the end. This is more concise and typically faster than the loop version.',
      hints: [
        'The expression (`n**2`) comes first, before the `for`',
        'The `if` filter goes at the end of the comprehension',
      ],
      tags: ['comprehensions', 'list', 'filter', 'basics'],
      concepts: ['py-comprehension', 'dj-orm-query-construction'],
    },
];
