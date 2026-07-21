/**
 * Topic.PY_DATA_STRUCTURES — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendQuestions.ts (4), pyDataStructuresCloze.ts (10), pyDataStructuresParsons.ts (10), pyDataStructuresPredictOutput.ts (10), pythonEssentialsQuestions.ts (17)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_data_structures_questions: Question[] = [
  {
      id: 'py-ds-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given numbers = [3, 1, 4, 1, 5, 9, 2, 6], use a list comprehension to create a new list containing only numbers greater than 4.',
      starterCode: `numbers = [3, 1, 4, 1, 5, 9, 2, 6]\n\nresult = `,
      testCases: [
        {
          input: 'numbers list',
          expectedOutput: '[x for x in numbers if x > 4]',
          description: 'Should filter with list comprehension',
        },
      ],
      solution: `numbers = [3, 1, 4, 1, 5, 9, 2, 6]\n\nresult = [x for x in numbers if x > 4]`,
      tieredHints: {
        apiSignature: '[expr for item in iterable if cond]',
        skeleton: `numbers = [____, ____, ____, ____, ____, ____, ____, ____]\n\nresult = [____ for x in numbers if ____ ____ ____]`,
      },
      explanation: 'List comprehensions are concise: [expression for item in iterable if condition]. Result: [5, 9, 6]. They are more Pythonic and faster than equivalent for loops with append.',
      hints: ['[expression for item in list if condition]', 'The if clause filters items'],
      tags: ['list-comprehension', 'list', 'filter', 'python'],
      concepts: ['py-comprehension', 'dj-orm-query-construction'],
    },
  {
      id: 'py-ds-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given a list of words = ["hello", "world", "hello", "python", "world", "hello"], create a dictionary that counts the frequency of each word.',
      starterCode: `# Declare words from the prompt, then build a freq dict of word -> count\n# (dict.get(word, 0) + 1, or collections.Counter)\n`,
      testCases: [
        {
          input: 'words list',
          expectedOutput: 'dict comprehension or Counter or loop',
          description: 'Should count word frequencies',
        },
      ],
      solution: `words = ["hello", "world", "hello", "python", "world", "hello"]\n\nfreq = {}\nfor word in words:\n    freq[word] = freq.get(word, 0) + 1\n# OR\nfrom collections import Counter\nfreq = Counter(words)`,
      tieredHints: {
        apiSignature: 'dict.get(key, default=None)',
        skeleton: `words = [____, ____, ____, ____, ____, ____]\n\nfreq = ____\nfor word in words:\n    freq[____] = freq.____(word, ____) ____ ____`,
      },
      explanation: 'dict.get(key, default) returns the value or default if missing — avoids KeyError. Counter is even simpler: Counter(words) returns {"hello": 3, "world": 2, "python": 1}. Both are common Python patterns.',
      hints: ['Use dict.get(key, 0) to handle missing keys', 'Or use collections.Counter for one-liner'],
      tags: ['dict', 'counter', 'frequency', 'python'],
      concepts: ['py-dict-key-hashability', 'py-collections-stdlib'],
    },
  {
      id: 'py-ds-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given two lists: keys = ["name", "age", "city"] and values = ["Alice", 30, "London"], create a dictionary by zipping them together.',
      starterCode: `# Declare keys and values from the prompt; assign result to a dict built from zip()\n`,
      testCases: [
        {
          input: 'keys and values lists',
          expectedOutput: 'dict(zip(keys, values))',
          description: 'Should zip into dictionary',
        },
      ],
      solution: `keys = ["name", "age", "city"]\nvalues = ["Alice", 30, "London"]\n\nresult = dict(zip(keys, values))`,
      tieredHints: {
        apiSignature: 'zip(*iterables) -> zip object',
        skeleton: `keys = ["name", "age", "city"]\nvalues = ["Alice", ____, "London"]\n\nresult = ____(____(____, ____))`,
      },
      explanation: 'zip() pairs elements from two iterables: zip(keys, values) = [("name","Alice"), ("age",30), ("city","London")]. dict() converts the pairs into a dictionary. Very Pythonic for parallel iteration.',
      hints: ['zip() pairs elements from two lists', 'dict() converts pairs to a dictionary'],
      tags: ['zip', 'dict', 'python'],
      concepts: ['py-dict-key-hashability'],
    },
  {
      id: 'py-ds-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use a dictionary comprehension to create a dict of {number: number_squared} for numbers 1 through 5.',
      starterCode: `# Dict comprehension\nsquares = `,
      testCases: [
        {
          input: 'numbers 1-5',
          expectedOutput: '{n: n**2 for n in range(1, 6)}',
          description: 'Should create squares dict',
        },
      ],
      solution: `squares = {n: n**2 for n in range(1, 6)}`,
      tieredHints: {
        apiSignature: 'range(start, stop, step=1) -> range',
        skeleton: `squares = {____: n ____ ____ for n in ____(____, ____)}`,
      },
      explanation: 'Dict comprehensions: {key_expr: val_expr for item in iterable}. Result: {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}. range(1, 6) gives [1, 2, 3, 4, 5]. Also supports if clauses for filtering.',
      hints: ['{key: value for item in iterable}', 'range(1, 6) gives 1 through 5'],
      tags: ['dict-comprehension', 'dict', 'python'],
      concepts: ['py-comprehension', 'py-dict-key-hashability'],
    },
  {
      id: 'py-data-structures-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the dict method that returns a default when a key is missing.',
      template: `config = {"host": "localhost"}
port = config.___("port", 5432)
print(port)`,
      blanks: ['get'],
      solution: 'config = {"host": "localhost"}\nport = config.get("port", 5432)\nprint(port)',
      explanation:
        '.get(key, default) returns the default when the key is missing — without raising KeyError. Bracket access raises; .get returns None or the supplied default.',
      hints: ['Three letters; same name as the verb "retrieve".'],
      tags: ['data-structures', 'dict', 'get'],
      concepts: ['py-dict-key-hashability'],
    },
  {
      id: 'py-data-structures-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the operator that merges two dicts (Python 3.9+).',
      template: `a = {"x": 1}
b = {"y": 2}
c = a ___ b
print(c)`,
      blanks: ['|'],
      solution: 'a = {"x": 1}\nb = {"y": 2}\nc = a | b\nprint(c)',
      explanation:
        'The | operator merges dicts — same as set union. Right side wins on key conflicts. Python 3.9+ feature; pre-3.9 used {**a, **b}.',
      hints: ['Same character used for set union; vertical bar.'],
      tags: ['data-structures', 'dict-merge'],
      concepts: ['py-dict-key-hashability'],
    },
  {
      id: 'py-data-structures-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the set operator for INTERSECTION.',
      template: `a = {1, 2, 3}
b = {2, 3, 4}
print(a ___ b)`,
      blanks: ['&'],
      solution: 'a = {1, 2, 3}\nb = {2, 3, 4}\nprint(a & b)',
      explanation:
        '& is set intersection. The mnemonic: bitwise AND keeps bits in both — set & keeps elements in both. Other operators: | union, - difference, ^ symmetric difference.',
      hints: ['Same character used for bitwise AND.'],
      tags: ['data-structures', 'set', 'intersection'],
      concepts: ['py-set-uniqueness'],
    },
  {
      id: 'py-data-structures-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the function from the copy module for full recursive copying.',
      template: `import copy

a = [[1, 2], [3, 4]]
b = copy.___(a)
b[0][0] = 99`,
      blanks: ['deepcopy'],
      solution: 'import copy\n\na = [[1, 2], [3, 4]]\nb = copy.deepcopy(a)\nb[0][0] = 99',
      explanation:
        'copy.deepcopy recursively copies nested mutable structures. copy.copy (or list.copy) is shallow — inner mutables are shared.',
      hints: ['Two words combined: "deep" + "copy".'],
      tags: ['data-structures', 'deepcopy'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'py-data-structures-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the collections type that auto-creates a default for missing keys.',
      template: `from collections import ___

d = ___(list)
d["a"].append(1)
d["a"].append(2)
print(dict(d))`,
      blanks: ['defaultdict', 'defaultdict'],
      solution:
        'from collections import defaultdict\n\nd = defaultdict(list)\nd["a"].append(1)\nd["a"].append(2)\nprint(dict(d))',
      explanation:
        'defaultdict takes a factory (callable that produces the default value). The factory is invoked for missing keys on access. Common factories: list, int, set, dict.',
      hints: ['Single word: "default" + "dict".'],
      tags: ['data-structures', 'defaultdict'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-data-structures-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the collections type that counts hashables and supports .most_common.',
      template: `from collections import ___

c = ___("mississippi")
print(c.most_common(2))`,
      blanks: ['Counter', 'Counter'],
      solution:
        'from collections import Counter\n\nc = Counter("mississippi")\nprint(c.most_common(2))',
      explanation:
        'Counter is a dict subclass for counting hashables. Pass any iterable on construction. .most_common(n) returns the top n as (item, count) tuples.',
      hints: ['Capitalized; "Count" + "er".'],
      tags: ['data-structures', 'Counter'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-data-structures-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the deque method that pops from the LEFT (front) in O(1).',
      template: `from collections import deque

q = deque(["a", "b", "c"])
first = q.___()
print(first)`,
      blanks: ['popleft'],
      solution:
        'from collections import deque\n\nq = deque(["a", "b", "c"])\nfirst = q.popleft()\nprint(first)',
      explanation:
        'deque.popleft() is O(1). list.pop(0) is O(n) because it shifts all remaining items. Use deque whenever you need an efficient FIFO queue.',
      hints: ['One word: "pop" + "left".'],
      tags: ['data-structures', 'deque', 'queue'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-data-structures-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keyword argument that reverses sort order.',
      template: `nums = [3, 1, 4, 1, 5, 9]
nums.sort(___=True)
print(nums)`,
      blanks: ['reverse'],
      solution: 'nums = [3, 1, 4, 1, 5, 9]\nnums.sort(reverse=True)\nprint(nums)',
      explanation:
        'sort/sorted accepts reverse=True for descending order. The other keyword arg you\'ll usually pair with this is key=callable for custom keys.',
      hints: ['Same name as the verb meaning "flip".'],
      tags: ['data-structures', 'sort', 'reverse'],
      concepts: ['py-iterator-protocol'],
    },
  {
      id: 'py-data-structures-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the builtin that yields (index, value) pairs for an iterable.',
      template: `for i, fruit in ___(["apple", "banana"], start=1):
      print(i, fruit)`,
      blanks: ['enumerate'],
      solution:
        'for i, fruit in enumerate(["apple", "banana"], start=1):\n    print(i, fruit)',
      explanation:
        'enumerate yields (index, value) tuples. The optional start= sets the starting index (default 0). Always use this over manual `i = 0; ... i += 1` patterns.',
      hints: ['Nine letters; verb meaning "to count off".'],
      tags: ['data-structures', 'enumerate'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'py-data-structures-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the list method that adds elements from an iterable (vs append, which adds one).',
      template: `nums = [1, 2, 3]
nums.___([4, 5])
print(nums)`,
      blanks: ['extend'],
      solution: 'nums = [1, 2, 3]\nnums.extend([4, 5])\nprint(nums)',
      explanation:
        'extend iterates the argument and adds each element. append would add [4, 5] AS A SINGLE NESTED ELEMENT, giving [1, 2, 3, [4, 5]].',
      hints: ['Same word as the verb meaning "make longer".'],
      tags: ['data-structures', 'list', 'extend'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'py-data-structures-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Make a deep copy of a nested list and confirm mutating the copy doesn\'t change the original.',
      correctOrder: [
        'import copy',
        '',
        'a = [[1, 2], [3, 4]]',
        'b = copy.deepcopy(a)',
        'b[0][0] = 99',
        'print(a)',
        'print(b)',
      ],
      distractorLines: [
        'b = a.copy()',
        'b = list(a)',
        'b = a[:]',
      ],
      solution:
        'import copy\n\na = [[1, 2], [3, 4]]\nb = copy.deepcopy(a)\nb[0][0] = 99\nprint(a)\nprint(b)',
      explanation:
        'list.copy(), list(a), and a[:] all do SHALLOW copies — they create a new outer list whose inner elements are still shared. copy.deepcopy recursively copies nested mutable structures, so mutations to b\'s inner lists won\'t affect a.',
      hints: ['Shallow copies share inner references; deepcopy doesn\'t.'],
      tags: ['data-structures', 'copy', 'deepcopy'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'py-data-structures-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Merge two dicts a = {"x": 1} and b = {"y": 2} into c using the modern | operator.',
      correctOrder: [
        'a = {"x": 1}',
        'b = {"y": 2}',
        'c = a | b',
        'print(c)',
      ],
      distractorLines: [
        'c = a + b',
        'c = a.merge(b)',
        'c = {**a, **b, **a}',
      ],
      solution: 'a = {"x": 1}\nb = {"y": 2}\nc = a | b\nprint(c)',
      explanation:
        'Python 3.9+ supports | for dict merge, returning a new dict. + does NOT work on dicts. Pre-3.9 the equivalent was {**a, **b}. Dicts have no .merge() method.',
      hints: ['| is the modern dict-merge operator (3.9+).'],
      tags: ['data-structures', 'dict', 'merge'],
      concepts: ['py-dict-key-hashability'],
    },
  {
      id: 'py-data-structures-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Find the elements common to two sets a = {1, 2, 3} and b = {2, 3, 4}.',
      correctOrder: [
        'a = {1, 2, 3}',
        'b = {2, 3, 4}',
        'common = a & b',
        'print(common)',
      ],
      distractorLines: [
        'common = a + b',
        'common = a | b',
        'common = a.intersect(b)',
      ],
      solution: 'a = {1, 2, 3}\nb = {2, 3, 4}\ncommon = a & b\nprint(common)',
      explanation:
        'Set intersection uses & (or .intersection()). | is union, - is difference, ^ is symmetric difference. + does NOT work on sets. The method is .intersection, not .intersect.',
      hints: ['& for intersection; | for union; - for difference.'],
      tags: ['data-structures', 'set', 'intersection'],
      concepts: ['py-set-uniqueness'],
    },
  {
      id: 'py-data-structures-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use dict.get to look up a key with a default fallback when the key is missing.',
      correctOrder: [
        'config = {"host": "localhost"}',
        'port = config.get("port", 5432)',
        'print(port)',
      ],
      distractorLines: [
        'port = config["port"]',
        'port = config["port"] or 5432',
      ],
      solution:
        'config = {"host": "localhost"}\nport = config.get("port", 5432)\nprint(port)',
      explanation:
        '.get(key, default) returns the value if present, otherwise the default — without raising KeyError. config["port"] would raise KeyError. The `or 5432` form is fragile: it also overrides falsy values like 0 or "".',
      hints: ['.get with two args: key and default.'],
      tags: ['data-structures', 'dict', 'get'],
      concepts: ['py-dict-key-hashability'],
    },
  {
      id: 'py-data-structures-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Group a list of (key, value) pairs into a dict-of-lists using collections.defaultdict.',
      correctOrder: [
        'from collections import defaultdict',
        '',
        'pairs = [("a", 1), ("b", 2), ("a", 3)]',
        'groups = defaultdict(list)',
        'for k, v in pairs:',
        '    groups[k].append(v)',
        'print(dict(groups))',
      ],
      distractorLines: [
        'groups = {}',
        '    groups[k] = v',
        'groups = defaultdict(list())',
      ],
      solution:
        'from collections import defaultdict\n\npairs = [("a", 1), ("b", 2), ("a", 3)]\ngroups = defaultdict(list)\nfor k, v in pairs:\n    groups[k].append(v)\nprint(dict(groups))',
      explanation:
        'defaultdict(list) auto-creates an empty list for missing keys. Pass the FACTORY (list, no parens), not a list instance. With a plain dict you\'d need `groups.setdefault(k, []).append(v)` or an `if k not in groups` guard.',
      hints: ['defaultdict takes a factory — list (no parens), not list().'],
      tags: ['data-structures', 'defaultdict', 'grouping'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-data-structures-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Unpack a tuple t = (1, 2, 3, 4, 5) into first, last, and a list called middle of the rest.',
      correctOrder: [
        't = (1, 2, 3, 4, 5)',
        'first, *middle, last = t',
        'print(first, middle, last)',
      ],
      distractorLines: [
        'first, middle, last = t',
        'first, *middle = t',
      ],
      solution: 't = (1, 2, 3, 4, 5)\nfirst, *middle, last = t\nprint(first, middle, last)',
      explanation:
        'Starred unpacking captures variable-length middle/end. first, *middle, last binds first=1, middle=[2,3,4], last=5. Without the star, Python tries to bind exactly 3 names to 5 values — ValueError.',
      hints: ['*name in unpacking absorbs the variable middle.'],
      tags: ['data-structures', 'tuple', 'unpacking'],
      concepts: ['py-unpacking'],
    },
  {
      id: 'py-data-structures-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Sort a list of dicts by the "age" key in descending order.',
      correctOrder: [
        'people = [{"name": "a", "age": 30}, {"name": "b", "age": 17}, {"name": "c", "age": 22}]',
        'people.sort(key=lambda p: p["age"], reverse=True)',
        'print(people)',
      ],
      distractorLines: [
        'people.sort(lambda p: p["age"], reverse=True)',
        'people = people.sort(key=lambda p: p["age"])',
      ],
      solution:
        'people = [{"name": "a", "age": 30}, {"name": "b", "age": 17}, {"name": "c", "age": 22}]\npeople.sort(key=lambda p: p["age"], reverse=True)\nprint(people)',
      explanation:
        'list.sort takes key as a KEYWORD argument; passing the lambda positionally raises TypeError. .sort mutates in place and returns None — assigning the return would set people to None. Use sorted() if you want a new list.',
      hints: ['key= is keyword-only; .sort returns None (mutates in place).'],
      tags: ['data-structures', 'sort', 'key'],
      concepts: ['py-iterator-protocol'],
    },
  {
      id: 'py-data-structures-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a Counter of letter frequencies for "mississippi" and print the top 2 most common.',
      correctOrder: [
        'from collections import Counter',
        '',
        'counts = Counter("mississippi")',
        'print(counts.most_common(2))',
      ],
      distractorLines: [
        'print(counts.top(2))',
        'counts = Counter()',
        '    counts["m"] += 1',
      ],
      solution:
        'from collections import Counter\n\ncounts = Counter("mississippi")\nprint(counts.most_common(2))',
      explanation:
        'Counter is a dict subclass that auto-counts hashables. Iterables (like strings) are counted by element on construction. .most_common(n) returns the top n as a list of (element, count) tuples. There\'s no .top method.',
      hints: ['Counter("hashable iterable"); .most_common(n) for the top n.'],
      tags: ['data-structures', 'Counter', 'collections'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-data-structures-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use a deque for an O(1) FIFO queue: append two items, popleft one.',
      correctOrder: [
        'from collections import deque',
        '',
        'q = deque()',
        'q.append("a")',
        'q.append("b")',
        'first = q.popleft()',
        'print(first, list(q))',
      ],
      distractorLines: [
        'q = []',
        'first = q.pop(0)',
        'first = q.dequeue()',
      ],
      solution:
        'from collections import deque\n\nq = deque()\nq.append("a")\nq.append("b")\nfirst = q.popleft()\nprint(first, list(q))',
      explanation:
        'deque has O(1) appends and pops at both ends. list.pop(0) is O(n) because it shifts all remaining items. Use deque for queues. There\'s no .dequeue method.',
      hints: ['deque.popleft() is O(1); list.pop(0) is O(n).'],
      tags: ['data-structures', 'deque', 'queue'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-data-structures-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Iterate a list AND its index using enumerate(starting from 1).',
      correctOrder: [
        'fruits = ["apple", "banana", "cherry"]',
        'for i, fruit in enumerate(fruits, start=1):',
        '    print(i, fruit)',
      ],
      distractorLines: [
        'for fruit, i in enumerate(fruits, 1):',
        'for i, fruit in enumerate(fruits)[1]:',
      ],
      solution:
        'fruits = ["apple", "banana", "cherry"]\nfor i, fruit in enumerate(fruits, start=1):\n    print(i, fruit)',
      explanation:
        'enumerate yields (index, value) — index FIRST. Reversing the unpacking would assign the index to fruit and vice versa. The optional second arg is the starting index (defaults to 0).',
      hints: ['enumerate yields (index, value) — index is first.'],
      tags: ['data-structures', 'enumerate', 'iteration'],
      concepts: ['py-control-flow'],
    },
  {
      id: 'py-data-structures-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `a = [[1, 2], [3, 4]]
b = a.copy()
b[0][0] = 99
print(a)
print(b)`,
      expectedOutput: `[[99, 2], [3, 4]]
[[99, 2], [3, 4]]`,
      explanation:
        'list.copy() is SHALLOW: it creates a new outer list, but the inner lists are still shared. Mutating b[0][0] mutates the same inner list that a[0] also references. Use copy.deepcopy for full independence.',
      hints: ['Shallow copy duplicates the outer list only; inner mutables are shared.'],
      tags: ['data-structures', 'shallow-copy', 'aliasing'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'py-data-structures-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `d = {"a": 1, "b": 2}
d["c"] = 3
d["a"] = 99
print(list(d))`,
      expectedOutput: `['a', 'b', 'c']`,
      explanation:
        'Python dicts (3.7+) preserve INSERTION order. Updating an existing key does NOT change its position — "a" stays first even after being overwritten. New keys are appended at the end.',
      hints: ['Dict order is insertion order; updates don\'t reorder.'],
      tags: ['data-structures', 'dict', 'ordering'],
      concepts: ['py-dict-key-hashability'],
    },
  {
      id: 'py-data-structures-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `t = ([1, 2], "x")
t[0].append(3)
print(t)`,
      expectedOutput: `([1, 2, 3], 'x')`,
      explanation:
        'Tuples are immutable — but only the BINDINGS are immutable. The list inside the tuple is mutable, so t[0].append works. The tuple still references the same list — which now has 3 elements.',
      hints: ['Tuple immutability: bindings, not contents.'],
      tags: ['data-structures', 'tuple', 'mutable-content'],
      concepts: ['py-mutable-vs-immutable'],
    },
  {
      id: 'py-data-structures-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `nums = [1, 2, 3, 4]
result = nums.sort()
print(result)
print(nums)`,
      expectedOutput: `None
[1, 2, 3, 4]`,
      explanation:
        'list.sort mutates in place and returns None. nums is sorted (already was, here), but the return value is None. To get a new sorted list back, use sorted(nums).',
      hints: ['What does .sort return? What does it do to the list?'],
      tags: ['data-structures', 'sort', 'mutation'],
      concepts: ['py-iterator-protocol'],
    },
  {
      id: 'py-data-structures-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `a = {"x": 1}
b = {"x": 2, "y": 3}
c = a | b
print(c)`,
      expectedOutput: `{'x': 2, 'y': 3}`,
      explanation:
        'The dict | operator (3.9+) merges, with the RIGHT-HAND side taking precedence on duplicate keys. So c["x"] is 2 (from b), not 1 (from a). a and b are unchanged.',
      hints: ['Right side wins on key conflicts.'],
      tags: ['data-structures', 'dict-merge', 'precedence'],
      concepts: ['py-dict-key-hashability'],
    },
  {
      id: 'py-data-structures-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `s = {3, 1, 2}
s.add(2)
s.add(4)
print(sorted(s))`,
      expectedOutput: `[1, 2, 3, 4]`,
      explanation:
        'Sets dedupe automatically — adding 2 again is a no-op. add(4) inserts a new element. Sets are unordered, so sorted() gives a deterministic display: [1, 2, 3, 4].',
      hints: ['Sets dedupe; sorted() gives a deterministic display.'],
      tags: ['data-structures', 'set', 'dedup'],
      concepts: ['py-set-uniqueness'],
    },
  {
      id: 'py-data-structures-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `t = (1, 2, 3, 4, 5)
first, *rest = t
print(first)
print(rest)`,
      expectedOutput: `1
[2, 3, 4, 5]`,
      explanation:
        'Starred unpacking: first absorbs the head element, *rest absorbs everything else as a LIST (not a tuple, even though t is a tuple).',
      hints: ['*rest collects into a list, regardless of source.'],
      tags: ['data-structures', 'unpacking', 'starred'],
      concepts: ['py-unpacking'],
    },
  {
      id: 'py-data-structures-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from collections import defaultdict
d = defaultdict(int)
d["x"] += 1
d["y"]
print(dict(d))`,
      expectedOutput: `{'x': 1, 'y': 0}`,
      explanation:
        'defaultdict(int) auto-creates 0 (int()) for missing keys. d["x"] += 1 reads (gets 0) then sets to 1. Just READING d["y"] also creates the entry with value 0 — defaultdict materializes on access, not just on assignment.',
      hints: ['Read access on a defaultdict still creates the entry.'],
      tags: ['data-structures', 'defaultdict', 'side-effects'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-data-structures-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from collections import Counter
counts = Counter("aabbbccd")
print(counts.most_common(2))`,
      expectedOutput: `[('b', 3), ('a', 2)]`,
      explanation:
        'Counter("aabbbccd") tallies each char: a=2, b=3, c=2, d=1. .most_common(2) returns the top 2 as (element, count) tuples sorted by count descending. Ties are broken by insertion order — a came before c, both with count 2 — but a wins because it has count 2 vs c\'s count 2 still tie. Looking again: b=3 (top), a=2, c=2, d=1. Top 2: b and the first of the count-2 group, which is a (inserted before c).',
      hints: ['Top 2 by count; ties broken by insertion order.'],
      tags: ['data-structures', 'Counter', 'most_common'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-data-structures-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `nums = [1, 2, 3]
nums.extend([4, 5])
nums.append([6, 7])
print(nums)`,
      expectedOutput: `[1, 2, 3, 4, 5, [6, 7]]`,
      explanation:
        'extend ITERATES the argument and adds each element — adding 4 and 5. append adds the argument AS A SINGLE ELEMENT — so [6, 7] becomes a nested list. Common confusion: extend "splices" while append wraps.',
      hints: ['extend iterates; append takes one element (even if it\'s a list).'],
      tags: ['data-structures', 'list', 'extend', 'append'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'pe1-m3-15',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      question: 'How do you access the first element of a list `fruits = ["apple", "banana", "cherry"]`?',
      options: [
        { id: 'a', text: '`fruits[1]`', isCorrect: false },
        { id: 'b', text: '`fruits.first()`', isCorrect: false },
        { id: 'c', text: '`fruits[0]`', isCorrect: true },
        { id: 'd', text: '`fruits.get(0)`', isCorrect: false },
      ],
      explanation: 'Python lists use zero-based indexing — the first element is at index 0, the second at index 1, and so on. `fruits[0]` gives `"apple"`. Negative indices count from the end: `fruits[-1]` gives the last element `"cherry"`. Accessing an index that doesn\'t exist raises an `IndexError`.',
      hints: [
        'Python indexing starts at 0, not 1',
        '`list[0]` is the first element',
      ],
      tags: ['lists', 'indexing', 'basics', 'data-structures'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'pe1-m3-16',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      question: 'What does `fruits[-1]` return for `fruits = ["apple", "banana", "cherry"]`?',
      options: [
        { id: 'a', text: 'An IndexError', isCorrect: false },
        { id: 'b', text: '`"apple"` (the first item)', isCorrect: false },
        { id: 'c', text: '`"cherry"` (the last item)', isCorrect: true },
        { id: 'd', text: '`-1`', isCorrect: false },
      ],
      explanation: 'Negative indices count from the end of the list. `-1` is the last element, `-2` is the second-to-last, and so on. `fruits[-1]` gives `"cherry"`. This is very convenient for accessing the end of a list without knowing its length.',
      hints: [
        'Negative indices count backwards from the end',
        '`-1` = last, `-2` = second to last',
      ],
      tags: ['lists', 'indexing', 'negative-indexing', 'basics'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'pe1-m3-17',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      question: 'What is list slicing in Python?',
      options: [
        { id: 'a', text: 'Removing an element from a list', isCorrect: false },
        { id: 'b', text: 'Extracting a sub-list using `[start:stop]` notation', isCorrect: true },
        { id: 'c', text: 'Sorting a list by value', isCorrect: false },
        { id: 'd', text: 'Splitting a list into two equal halves', isCorrect: false },
      ],
      explanation: 'Slicing extracts a portion of a list using `[start:stop]` syntax. The `start` index is included, `stop` is excluded. `nums[1:4]` returns elements at index 1, 2, 3. You can omit start (`[:3]` = from beginning) or stop (`[2:]` = to the end). Slicing creates a new list and doesn\'t modify the original.',
      hints: [
        '`list[start:stop]` — start is included, stop is excluded',
        'Omit start or stop to slice from the beginning or to the end',
      ],
      tags: ['lists', 'slicing', 'basics', 'data-structures'],
      concepts: ['py-list-aliasing', 'py-slice-bounds'],
    },
  {
      id: 'pe1-m3-18',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `numbers = [10, 20, 30, 40, 50]`, write code to: (1) print the third element, (2) print the last element using negative indexing, (3) print a slice of the first three elements.',
      starterCode: `numbers = [10, 20, 30, 40, 50]

# 1. Print the third element (index 2)

# 2. Print the last element using negative indexing

# 3. Print a slice containing only the first three elements
`,
      testCases: [
        {
          input: '',
          expectedOutput: '30\n50\n[10, 20, 30]',
          description: 'Should print 30, 50, and [10, 20, 30]',
        },
      ],
      solution: `numbers = [10, 20, 30, 40, 50]

print(numbers[2])
print(numbers[-1])
print(numbers[:3])`,
      tieredHints: {
        apiSignature: 'list[start:stop:step]',
        skeleton: `numbers = [____, ____, ____, ____, ____]

____(numbers[____])
____(numbers[____])
____(numbers[____])`,
      },
      explanation: '`numbers[2]` accesses index 2 (the third element, 30). `numbers[-1]` accesses the last element (50). `numbers[:3]` slices from the beginning up to (not including) index 3, giving `[10, 20, 30]`.',
      hints: [
        'Index 2 is the third element (0-based)',
        '`[-1]` is the last element, `[:3]` is the first three',
      ],
      tags: ['lists', 'indexing', 'slicing', 'negative-indexing'],
      concepts: ['py-list-aliasing', 'py-slice-bounds'],
    },
  {
      id: 'pe1-m3-19',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      question: 'Which list method adds an element to the END of a list?',
      options: [
        { id: 'a', text: '`.add()`', isCorrect: false },
        { id: 'b', text: '`.insert()`', isCorrect: false },
        { id: 'c', text: '`.push()`', isCorrect: false },
        { id: 'd', text: '`.append()`', isCorrect: true },
      ],
      explanation: '`.append(item)` adds a single item to the end of a list, modifying it in place. For example: `fruits.append("mango")`. Other useful methods: `.insert(index, item)` inserts at a specific position, `.extend(other_list)` adds all items from another list, `.remove(item)` removes the first occurrence, `.pop()` removes and returns the last item.',
      hints: [
        'The most common way to add to a list',
        'It modifies the list in place and returns None',
      ],
      tags: ['lists', 'append', 'methods', 'basics'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'pe1-m3-20',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Start with an empty list. Use a `for` loop with `range()` to append the squares of numbers 1 through 5 (i.e., 1, 4, 9, 16, 25). Then print the list.',
      starterCode: `squares = []

# Use a for loop to append squares of 1 through 5

print(squares)
`,
      testCases: [
        {
          input: '',
          expectedOutput: '[1, 4, 9, 16, 25]',
          description: 'Should print [1, 4, 9, 16, 25]',
        },
      ],
      solution: `squares = []
for i in range(1, 6):
    squares.append(i ** 2)
print(squares)`,
      tieredHints: {
        apiSignature: 'list.append(object) -> None',
        skeleton: `squares = []
for i in ____(____, ____):
    squares.____(i ____ ____)
____(squares)`,
      },
      explanation: 'Start with an empty list `[]`. In each iteration, `i ** 2` calculates the square and `.append()` adds it to the list. After the loop, the list contains all squares. This pattern (build up a list with a loop and append) is common — though list comprehensions are a more Pythonic alternative.',
      hints: [
        'Start with `squares = []`',
        'Use `i ** 2` for squaring and `.append()` to add to the list',
      ],
      tags: ['lists', 'append', 'for-loop', 'range', 'squares'],
      concepts: ['py-list-aliasing', 'py-range-bounds'],
    },
  {
      id: 'pe1-m3-21',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      question: 'How do you iterate over every item in a list `colors = ["red", "green", "blue"]`?',
      options: [
        { id: 'a', text: '`for i in range(colors):`', isCorrect: false, misconceptionTag: 'py-iteration-vs-range' },
        { id: 'b', text: '`for color in colors:`', isCorrect: true },
        { id: 'c', text: '`foreach color in colors:`', isCorrect: false },
        { id: 'd', text: '`while color in colors:`', isCorrect: false },
      ],
      explanation: 'The `for item in sequence:` syntax iterates over every element in a sequence (list, tuple, string, etc.). The loop variable (`color`) takes each value in turn. This is the most Pythonic way to iterate — prefer it over `for i in range(len(colors)):` when you only need the values, not the indices.',
      hints: [
        '`for item in list:` is the Pythonic way',
        'No need for `range()` or index variables when you just want the values',
      ],
      tags: ['for-loop', 'lists', 'iteration', 'basics'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'pe1-m3-22',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `temperatures = [22, 35, 18, 29, 41, 15]`, write code to find and print the maximum and minimum temperatures using a `for` loop (do NOT use the built-in `max()` or `min()` functions).',
      starterCode: `# Declare temperatures = [22, 35, 18, 29, 41, 15]
# Track max_temp and min_temp through a for loop (no built-in max()/min())
# Print max_temp then min_temp
`,
      testCases: [
        {
          input: '',
          expectedOutput: '41\n15',
          description: 'Should print 41 (max) and 15 (min)',
        },
      ],
      solution: `temperatures = [22, 35, 18, 29, 41, 15]

max_temp = temperatures[0]
min_temp = temperatures[0]

for temp in temperatures:
    if temp > max_temp:
        max_temp = temp
    if temp < min_temp:
        min_temp = temp

print(max_temp)
print(min_temp)`,
      tieredHints: {
        apiSignature: 'for item in sequence:',
        skeleton: `temperatures = [____, ____, ____, ____, ____, ____]

max_temp = temperatures[____]
min_temp = temperatures[____]

for temp in temperatures:
    if temp ____ max_temp:
        ____ = temp
    if temp ____ min_temp:
        ____ = temp

print(____)
print(____)`,
      },
      explanation: 'Initialize max and min to the first element as a baseline. Then loop through all values: if a temperature is greater than the current max, update max; if it\'s less than current min, update min. This is the classic algorithm for finding extremes in a list.',
      hints: [
        'Start `max_temp` and `min_temp` at the first element',
        'Inside the loop, compare each temperature to the current max/min',
      ],
      tags: ['lists', 'for-loop', 'max', 'min', 'algorithms'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'pe1-m3-23',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      question: 'Given `matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]`, what does `matrix[1][2]` return?',
      options: [
        { id: 'a', text: '`2`', isCorrect: false },
        { id: 'b', text: '`4`', isCorrect: false },
        { id: 'c', text: '`6`', isCorrect: true },
        { id: 'd', text: '`8`', isCorrect: false },
      ],
      explanation: 'A 2D list is a list of lists. `matrix[1]` accesses the second row `[4, 5, 6]`. Then `[2]` accesses the third element of that row, which is `6`. Think of it as [row][column], both zero-indexed. `matrix[0][0]` would be `1` (top-left), `matrix[2][2]` would be `9` (bottom-right).',
      hints: [
        '`matrix[row][column]` — both zero-indexed',
        'First bracket selects the row, second selects the column',
      ],
      tags: ['lists', '2d-lists', 'matrix', 'indexing', 'basics'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'pe1-m3-24',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a 3×3 identity matrix as a 2D list (1s on the diagonal, 0s elsewhere), then print each row on a separate line.',
      starterCode: `# Create the 3x3 identity matrix
identity = [
    # Fill in the rows
]

# Print each row
`,
      testCases: [
        {
          input: '',
          expectedOutput: '[1, 0, 0]\n[0, 1, 0]\n[0, 0, 1]',
          description: 'Should print the 3x3 identity matrix row by row',
        },
      ],
      solution: `identity = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
]

for row in identity:
    print(row)`,
      tieredHints: {
        apiSignature: 'for item in sequence:',
        skeleton: `identity = [
    [____, ____, ____],
    [____, ____, ____],
    [____, ____, ____],
]

for row in identity:
    ____(row)`,
      },
      explanation: 'A 2D list is simply a list where each element is itself a list. Iterating with `for row in identity:` gives each inner list in turn. When you `print(row)`, Python displays it in list format `[1, 0, 0]`. The identity matrix has 1s on the main diagonal (top-left to bottom-right) and 0s elsewhere.',
      hints: [
        'Each row is a list inside the outer list',
        'Use `for row in identity:` to print each row',
      ],
      tags: ['lists', '2d-lists', 'matrix', 'for-loop'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'pe1-m4-6',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      question: 'What is the key difference between a list and a tuple in Python?',
      options: [
        { id: 'a', text: 'Lists can hold any type; tuples can only hold strings', isCorrect: false },
        { id: 'b', text: 'Lists are ordered; tuples are unordered', isCorrect: false },
        { id: 'c', text: 'Lists are mutable (can be changed); tuples are immutable (cannot be changed)', isCorrect: true },
        { id: 'd', text: 'Tuples are faster to create; lists are faster to access', isCorrect: false },
      ],
      explanation: 'The key difference: **lists** are mutable — you can add, remove, or change elements. **Tuples** are immutable — once created, you cannot change them. Lists use `[]`, tuples use `()`. Use tuples when data shouldn\'t change (coordinates, RGB colors, database rows). Tuples are also slightly faster and can be used as dictionary keys (lists cannot).',
      hints: [
        'Lists `[]` = mutable, Tuples `()` = immutable',
        'If it shouldn\'t change, use a tuple',
      ],
      tags: ['tuples', 'lists', 'mutable', 'immutable', 'data-structures'],
      concepts: ['py-list-aliasing', 'py-mutable-vs-immutable'],
    },
  {
      id: 'pe1-m4-7',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      question: 'What is tuple unpacking in Python?',
      options: [
        { id: 'a', text: 'Converting a tuple to a list', isCorrect: false },
        { id: 'b', text: 'Removing elements from a tuple', isCorrect: false },
        { id: 'c', text: 'Assigning tuple elements to individual variables in one line', isCorrect: true },
        { id: 'd', text: 'Checking if a tuple contains a value', isCorrect: false },
      ],
      explanation: 'Tuple unpacking (also called destructuring) assigns each element of a tuple to a separate variable: `x, y, z = (1, 2, 3)`. This also works with lists and any iterable. A classic use case is swapping variables: `a, b = b, a`. Functions can return multiple values as a tuple and you can unpack them directly.',
      hints: [
        '`a, b = (1, 2)` assigns 1 to a and 2 to b',
        'You can swap variables with `a, b = b, a`',
      ],
      tags: ['tuples', 'unpacking', 'destructuring', 'basics'],
      concepts: ['py-unpacking'],
    },
  {
      id: 'pe1-m4-8',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write `min_max(numbers)` that returns the tuple `(min(numbers), max(numbers))`. Call it with `[3, 1, 4, 1, 5, 9, 2, 6]`, unpack the result into `low, high`, and print `low` then `high` on separate lines (expected 1, then 9).',
      starterCode: `# Define min_max(numbers) returning (min(numbers), max(numbers))


# Call it on [3, 1, 4, 1, 5, 9, 2, 6], unpack into low, high, and print each
`,
      testCases: [
        {
          input: 'min_max([3, 1, 4, 1, 5, 9, 2, 6])',
          expectedOutput: '(1, 9)',
          description: 'Should return (1, 9)',
        },
      ],
      solution: `def min_max(numbers):
    return (min(numbers), max(numbers))

result = min_max([3, 1, 4, 1, 5, 9, 2, 6])
low, high = result
print(low)
print(high)`,
      tieredHints: {
        apiSignature: 'min(iterable) -> value / max(iterable) -> value',
        skeleton: `def min_max(numbers):
    return (____(numbers), ____(numbers))

result = min_max([____, ____, ____, ____, ____, ____, ____, ____])
____, ____ = result
____(low)
____(high)`,
      },
      explanation: 'A function can return multiple values as a tuple: `return (min_val, max_val)`. The caller can then unpack them: `low, high = min_max(...)`. This is a very Pythonic pattern. Here we use the built-in `min()` and `max()` functions — they work on any iterable.',
      hints: [
        'Use `return (min(numbers), max(numbers))`',
        'Unpack with `low, high = result`',
      ],
      tags: ['tuples', 'return', 'unpacking', 'min', 'max', 'functions'],
      concepts: ['py-unpacking'],
    },
  {
      id: 'pe1-m4-9',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      question: 'What is a Python dictionary?',
      options: [
        { id: 'a', text: 'An ordered sequence of items accessed by index', isCorrect: false },
        { id: 'b', text: 'A collection of key-value pairs where each key is unique', isCorrect: true },
        { id: 'c', text: 'A list of unique items with no duplicates', isCorrect: false },
        { id: 'd', text: 'A built-in word list for spell checking', isCorrect: false },
      ],
      explanation: 'A dictionary maps unique keys to values: `{"name": "Alice", "age": 30}`. Keys can be any immutable type (strings, numbers, tuples). Values can be anything. Dictionaries are unordered in older Python but maintain insertion order since Python 3.7+. Access values with `dict[key]` or safely with `dict.get(key)`.',
      hints: [
        'Key-value pairs, like a real dictionary (word: definition)',
        'Created with `{}` using `:` to separate keys and values',
      ],
      tags: ['dictionaries', 'key-value', 'basics', 'data-structures'],
      concepts: ['py-dict-key-hashability'],
    },
  {
      id: 'pe1-m4-10',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      question: 'What is the difference between `d["key"]` and `d.get("key")` for accessing dictionary values?',
      options: [
        { id: 'a', text: 'They are identical — both work exactly the same', isCorrect: false },
        { id: 'b', text: '`d["key"]` raises a `KeyError` if the key doesn\'t exist; `d.get("key")` returns `None` instead', isCorrect: true },
        { id: 'c', text: '`d.get()` is faster than `d["key"]`', isCorrect: false },
        { id: 'd', text: '`d["key"]` only works for string keys; `.get()` works for all types', isCorrect: false },
      ],
      explanation: '`d["key"]` raises a `KeyError` if the key doesn\'t exist — this can crash your program if you\'re not careful. `d.get("key")` returns `None` if the key is missing (or a default you specify: `d.get("key", "default")`). Use `.get()` when a key might not exist and you want to handle that gracefully.',
      hints: [
        '`d["key"]` can raise an error; `.get()` returns None safely',
        'Use `.get()` when you\'re not sure if the key exists',
      ],
      tags: ['dictionaries', 'get', 'KeyError', 'basics'],
      concepts: ['py-dict-key-hashability'],
    },
  {
      id: 'pe1-m4-11',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a dictionary `person` with keys `"name"`, `"age"`, and `"city"`. Then: (1) print the name, (2) add a key `"email"` with a value, (3) print all keys, (4) print all values.',
      starterCode: `# Create a 'person' dictionary with name="Alice", age=30, city="Dublin"
# Print the name, add email="alice@example.com", then print all keys and all values`,
      testCases: [
        {
          input: '',
          expectedOutput: 'Alice\ndict_keys([\'name\', \'age\', \'city\', \'email\'])\ndict_values([\'Alice\', 30, \'Dublin\', \'alice@example.com\'])',
          description: 'Should print name, then keys, then values',
        },
      ],
      solution: `person = {
    "name": "Alice",
    "age": 30,
    "city": "Dublin",
}

print(person["name"])
person["email"] = "alice@example.com"
print(person.keys())
print(person.values())`,
      tieredHints: {
        apiSignature: 'dict.keys() -> dict_keys / dict.values() -> dict_values',
        skeleton: `person = {
    ____: ____,
    ____: ____,
    ____: ____,
}

print(person[____])
person[____] = ____
print(person.____())
print(person.____())`,
      },
      explanation: 'Access values with `dict[key]`. Add new keys by assigning: `dict["new_key"] = value`. `.keys()` returns all keys as a `dict_keys` view, `.values()` returns all values as `dict_values`. To iterate: `for key in person:` or `for key, value in person.items():`.',
      hints: [
        'Access with `person["name"]`, add with `person["email"] = ...`',
        'Use `.keys()` and `.values()` to see all keys/values',
      ],
      tags: ['dictionaries', 'keys', 'values', 'methods', 'basics'],
      concepts: ['py-dict-key-hashability'],
    },
  {
      id: 'pe1-m4-12',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DATA_STRUCTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function `word_count(text)` that counts how many times each word appears in a string and returns a dictionary. Test with `"the cat sat on the mat the cat"`.',
      starterCode: `# Define word_count(text) returning a dict mapping each word to its frequency
# Print the result for "the cat sat on the mat the cat"`,
      testCases: [
        {
          input: 'word_count("the cat sat on the mat the cat")',
          expectedOutput: "{'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1}",
          description: 'Should count word frequencies correctly',
        },
      ],
      solution: `def word_count(text):
    counts = {}
    for word in text.split():
        counts[word] = counts.get(word, 0) + 1
    return counts

result = word_count("the cat sat on the mat the cat")
print(result)`,
      tieredHints: {
        apiSignature: 'str.split(sep=None) -> list[str]',
        skeleton: `def ____(text):
    ____ = {}
    for word in text.____():
        counts[word] = counts.____(word, ____) ____ ____
    return ____

result = ____("the cat sat on the mat the cat")
print(result)`,
      },
      explanation: '`text.split()` breaks the string into a list of words. For each word, `counts.get(word, 0)` gets the current count (or 0 if not yet seen), then adds 1. This is the classic word-frequency pattern. An alternative is using `collections.Counter(text.split())`.',
      hints: [
        'Split the text with `.split()`',
        'Use `counts.get(word, 0) + 1` to safely increment',
      ],
      tags: ['dictionaries', 'word-count', 'get', 'split', 'patterns'],
      concepts: ['py-dict-key-hashability'],
    },
];
