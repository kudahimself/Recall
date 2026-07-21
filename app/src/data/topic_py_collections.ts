/**
 * Topic.PY_COLLECTIONS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pyCollectionsCloze.ts (10), pyCollectionsParsons.ts (10), pyCollectionsPredictOutput.ts (10), pythonAdvancedQuestions.ts (3), pythonBatchAExpansionQuestions.ts (11), pythonGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_collections_questions: Question[] = [
  {
      id: 'py-collections-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the collections class for counting hashable items.',
      template: `from collections import ___

c = ___("hello")
print(c.most_common(2))`,
      blanks: ['Counter', 'Counter'],
      solution: 'from collections import Counter\n\nc = Counter("hello")\nprint(c.most_common(2))',
      explanation:
        'Counter is a dict subclass that tallies hashables. .most_common(n) returns the top n.',
      hints: ['Capitalized; "Count" + "er".'],
      tags: ['collections', 'Counter'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the class that auto-creates a default for missing keys.',
      template: `from collections import ___

d = ___(int)
d["x"] += 1`,
      blanks: ['defaultdict', 'defaultdict'],
      solution: 'from collections import defaultdict\n\nd = defaultdict(int)\nd["x"] += 1',
      explanation:
        'defaultdict takes a factory callable; missing keys auto-materialize with factory().',
      hints: ['Lowercase; "default" + "dict".'],
      tags: ['collections', 'defaultdict'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the kwarg that caps a deque\'s size, auto-evicting oldest.',
      template: `from collections import deque

buf = deque(___=3)`,
      blanks: ['maxlen'],
      solution: 'from collections import deque\n\nbuf = deque(maxlen=3)',
      explanation:
        'maxlen caps the deque\'s size. Appending past it silently drops from the opposite end. Foundation for ring buffers.',
      hints: ['Six letters; "max" + "len".'],
      tags: ['collections', 'deque', 'maxlen'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the deque method that pops from the LEFT in O(1).',
      template: `from collections import deque

q = deque(["a", "b", "c"])
first = q.___()`,
      blanks: ['popleft'],
      solution: 'from collections import deque\n\nq = deque(["a", "b", "c"])\nfirst = q.popleft()',
      explanation:
        'popleft is O(1). list.pop(0) is O(n). Use deque whenever you need an efficient FIFO queue.',
      hints: ['Single word: "pop" + "left".'],
      tags: ['collections', 'deque', 'popleft'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the factory function for a tuple subclass with named fields.',
      template: `from collections import ___

Point = ___("Point", ["x", "y"])
p = Point(1, 2)`,
      blanks: ['namedtuple', 'namedtuple'],
      solution:
        'from collections import namedtuple\n\nPoint = namedtuple("Point", ["x", "y"])\np = Point(1, 2)',
      explanation:
        'namedtuple is a CLASS FACTORY — call it to get a class. Fields can be a list of strings or one space-separated string. Modern alternative: typing.NamedTuple class form.',
      hints: ['One word: "named" + "tuple".'],
      tags: ['collections', 'namedtuple'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the class that overlays multiple dicts as a layered view.',
      template: `from collections import ___

config = ___(overrides, defaults)`,
      blanks: ['ChainMap', 'ChainMap'],
      solution:
        'from collections import ChainMap\n\nconfig = ChainMap(overrides, defaults)',
      explanation:
        'ChainMap searches its layers left-to-right. Unlike dict | merge, it\'s a live view: changes to underlying dicts show through.',
      hints: ['CamelCase: "Chain" + "Map".'],
      tags: ['collections', 'ChainMap'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the OrderedDict method that promotes a key to the back (newest position).',
      template: `from collections import OrderedDict

cache = OrderedDict([("a", 1), ("b", 2)])
cache.___("a")`,
      blanks: ['move_to_end'],
      solution:
        'from collections import OrderedDict\n\ncache = OrderedDict([("a", 1), ("b", 2)])\ncache.move_to_end("a")',
      explanation:
        'move_to_end shifts a key to the right end. Pass last=False to move to the front. Foundation for an LRU cache implementation.',
      hints: ['Snake-case: "move" + "_to_" + "end".'],
      tags: ['collections', 'OrderedDict', 'move_to_end'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the deque method that prepends to the front.',
      template: `from collections import deque

q = deque([2, 3])
q.___(1)`,
      blanks: ['appendleft'],
      solution: 'from collections import deque\n\nq = deque([2, 3])\nq.appendleft(1)',
      explanation:
        'appendleft is the symmetric counterpart to append: O(1) at the front. list.insert(0, x) is O(n).',
      hints: ['Single word: "append" + "left".'],
      tags: ['collections', 'deque', 'appendleft'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the namedtuple method that converts to a regular dict.',
      template: `from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(1, 2)
print(p.___())`,
      blanks: ['_asdict'],
      solution:
        'from collections import namedtuple\n\nPoint = namedtuple("Point", ["x", "y"])\np = Point(1, 2)\nprint(p._asdict())',
      explanation:
        'Leading underscore avoids clashing with user field names. Returns a regular dict. Other private methods: _replace (returns a copy with overrides), _fields (tuple of field names), _make (alternative ctor from iterable).',
      hints: ['Leading underscore + "as" + "dict".'],
      tags: ['collections', 'namedtuple', '_asdict'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the Counter method that returns the top n most common items.',
      template: `from collections import Counter

c = Counter("mississippi")
print(c.___(2))`,
      blanks: ['most_common'],
      solution: 'from collections import Counter\n\nc = Counter("mississippi")\nprint(c.most_common(2))',
      explanation:
        'most_common(n) returns a list of (element, count) tuples sorted by count descending. Without n, returns all entries sorted.',
      hints: ['Snake-case: "most" + "_common".'],
      tags: ['collections', 'Counter', 'most_common'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a Point namedtuple with fields x and y, then create one and access by attribute.',
      correctOrder: [
        'from collections import namedtuple',
        '',
        'Point = namedtuple("Point", ["x", "y"])',
        'p = Point(1, 2)',
        'print(p.x, p.y)',
      ],
      distractorLines: [
        'Point = namedtuple("Point", "x,y")',
        'Point = namedtuple("Point", x, y)',
      ],
      solution:
        'from collections import namedtuple\n\nPoint = namedtuple("Point", ["x", "y"])\np = Point(1, 2)\nprint(p.x, p.y)',
      explanation:
        'namedtuple takes the type name and a list of field names. A space-separated or list-of-strings field spec works; "x,y" with a comma fails because namedtuple\'s string mode splits on whitespace. Bare names without quotes is a NameError.',
      hints: ['Fields as a list of strings, or a space-separated string.'],
      tags: ['collections', 'namedtuple'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use defaultdict(int) to count word frequencies in a sentence.',
      correctOrder: [
        'from collections import defaultdict',
        '',
        'counts = defaultdict(int)',
        'for word in "a b a c a b".split():',
        '    counts[word] += 1',
        'print(dict(counts))',
      ],
      distractorLines: [
        'counts = defaultdict(0)',
        'counts = {}',
        '    counts[word] += 1',
      ],
      solution:
        'from collections import defaultdict\n\ncounts = defaultdict(int)\nfor word in "a b a c a b".split():\n    counts[word] += 1\nprint(dict(counts))',
      explanation:
        'defaultdict takes a FACTORY (a callable). int() returns 0, so int as the factory auto-creates 0 for missing keys. Passing 0 directly fails because 0 isn\'t callable. With a plain dict, the increment would raise KeyError on the first occurrence of each word.',
      hints: ['defaultdict takes a callable; int() returns 0.'],
      tags: ['collections', 'defaultdict'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a fixed-capacity ring buffer using deque(maxlen=3) so it auto-drops oldest when full.',
      correctOrder: [
        'from collections import deque',
        '',
        'buf = deque(maxlen=3)',
        'buf.append(1)',
        'buf.append(2)',
        'buf.append(3)',
        'buf.append(4)',
        'print(list(buf))',
      ],
      distractorLines: [
        'buf = deque()',
        'buf = deque(3)',
      ],
      solution:
        'from collections import deque\n\nbuf = deque(maxlen=3)\nbuf.append(1)\nbuf.append(2)\nbuf.append(3)\nbuf.append(4)\nprint(list(buf))',
      explanation:
        'deque(maxlen=N) caps the size — appending past N silently drops from the OPPOSITE end. So pushing 1,2,3,4 keeps [2,3,4]. deque(3) treats 3 as the iterable to initialize from (TypeError because int isn\'t iterable).',
      hints: ['maxlen kwarg; auto-evicts oldest when full.'],
      tags: ['collections', 'deque', 'maxlen'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use ChainMap to layer overrides on top of defaults, with overrides taking priority. Build `defaults = {"host": "localhost", "port": 80}` and `overrides = {"port": 8080}`, combine them so overrides win, then print `config["port"]` first and `config["host"]` second (port first to show the override winning).',
      correctOrder: [
        'from collections import ChainMap',
        '',
        'defaults = {"host": "localhost", "port": 80}',
        'overrides = {"port": 8080}',
        'config = ChainMap(overrides, defaults)',
        'print(config["port"])',
        'print(config["host"])',
      ],
      distractorLines: [
        'config = ChainMap(defaults, overrides)',
        'config = defaults | overrides',
      ],
      solution:
        'from collections import ChainMap\n\ndefaults = {"host": "localhost", "port": 80}\noverrides = {"port": 8080}\nconfig = ChainMap(overrides, defaults)\nprint(config["port"])\nprint(config["host"])',
      explanation:
        'ChainMap searches LEFT-TO-RIGHT for keys — so the FIRST argument has highest priority. Overrides go first. Unlike dict | merge, ChainMap is a live view: mutating defaults shows up in lookups.',
      hints: ['ChainMap: leftmost wins. Overrides first.'],
      tags: ['collections', 'ChainMap'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Group records by their type field using defaultdict(list).',
      correctOrder: [
        'from collections import defaultdict',
        '',
        'records = [("a", 1), ("b", 2), ("a", 3)]',
        'groups = defaultdict(list)',
        'for k, v in records:',
        '    groups[k].append(v)',
        'print(dict(groups))',
      ],
      distractorLines: [
        'groups = defaultdict([])',
        '    groups[k] = v',
      ],
      solution:
        'from collections import defaultdict\n\nrecords = [("a", 1), ("b", 2), ("a", 3)]\ngroups = defaultdict(list)\nfor k, v in records:\n    groups[k].append(v)\nprint(dict(groups))',
      explanation:
        'defaultdict(list) — pass list (the type, no parens) as the factory. Each missing key gets a fresh empty list. Passing [] would share ONE list across all keys (similar to mutable-default-arg trap).',
      hints: ['list (no parens) — the type itself is the factory.'],
      tags: ['collections', 'defaultdict', 'grouping'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Find the 3 most common letters in a string using Counter.most_common.',
      correctOrder: [
        'from collections import Counter',
        '',
        'top = Counter("mississippi").most_common(3)',
        'print(top)',
      ],
      distractorLines: [
        'top = Counter("mississippi").top(3)',
        'top = Counter("mississippi")[:3]',
      ],
      solution:
        'from collections import Counter\n\ntop = Counter("mississippi").most_common(3)\nprint(top)',
      explanation:
        '.most_common(n) returns the top n as (element, count) tuples sorted by count descending. There\'s no .top method. Counter doesn\'t support [:3] slicing — you\'d need most_common() then list-slice, but most_common(n) is the direct path.',
      hints: ['most_common takes the top n.'],
      tags: ['collections', 'Counter', 'most_common'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use OrderedDict.move_to_end to promote a key to the back, modeling LRU access.',
      correctOrder: [
        'from collections import OrderedDict',
        '',
        'cache = OrderedDict()',
        'cache["a"] = 1',
        'cache["b"] = 2',
        'cache["c"] = 3',
        'cache.move_to_end("a")',
        'print(list(cache))',
      ],
      distractorLines: [
        'cache.move("a")',
        'cache.move_to_back("a")',
      ],
      solution:
        'from collections import OrderedDict\n\ncache = OrderedDict()\ncache["a"] = 1\ncache["b"] = 2\ncache["c"] = 3\ncache.move_to_end("a")\nprint(list(cache))',
      explanation:
        'move_to_end shifts a key to the right (newest position). Pass last=False to move to the front. The method is named "move_to_end", not "move_to_back" or "move". Foundation for an LRU cache.',
      hints: ['move_to_end is the actual method name.'],
      tags: ['collections', 'OrderedDict', 'LRU'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use Counter arithmetic to find the difference between two letter counts.',
      correctOrder: [
        'from collections import Counter',
        '',
        'a = Counter("aaabb")',
        'b = Counter("aab")',
        'print(a - b)',
      ],
      distractorLines: [
        'print(a.diff(b))',
        'print(a.subtract(b))',
      ],
      solution:
        'from collections import Counter\n\na = Counter("aaabb")\nb = Counter("aab")\nprint(a - b)',
      explanation:
        'Counter supports +, -, &, | as multiset operations. - subtracts counts and DROPS non-positive results — gives Counter({"a": 1, "b": 1}). .subtract() mutates in place AND keeps negatives, different semantics.',
      hints: ['Counter has + - & | operators for multiset math.'],
      tags: ['collections', 'Counter', 'arithmetic'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build an O(1)-extend-on-both-ends queue with deque.appendleft for prepending.',
      correctOrder: [
        'from collections import deque',
        '',
        'q = deque([2, 3])',
        'q.appendleft(1)',
        'q.append(4)',
        'print(list(q))',
      ],
      distractorLines: [
        'q.prepend(1)',
        'q.insert(0, 1)',
      ],
      solution:
        'from collections import deque\n\nq = deque([2, 3])\nq.appendleft(1)\nq.append(4)\nprint(list(q))',
      explanation:
        'deque.appendleft is O(1) — same as append at the right end. list.insert(0, x) is O(n) (shifts everything). There\'s no .prepend method. Both ends of a deque are cheap; both ends of a list are not.',
      hints: ['appendleft for the front; both ends are O(1).'],
      tags: ['collections', 'deque', 'appendleft'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a nested defaultdict `tree` of shape str → (str → list) using a lambda factory so each outer key gets its OWN inner defaultdict(list). Then append `"apple"` to `tree["fruit"]["red"]`, append `"banana"` to `tree["fruit"]["yellow"]`, and finally print `tree["fruit"]["red"]`.',
      correctOrder: [
        'from collections import defaultdict',
        '',
        'tree = defaultdict(lambda: defaultdict(list))',
        'tree["fruit"]["red"].append("apple")',
        'tree["fruit"]["yellow"].append("banana")',
        'print(tree["fruit"]["red"])',
      ],
      distractorLines: [
        'tree = defaultdict(defaultdict(list))',
        'tree = defaultdict(defaultdict)',
      ],
      solution:
        'from collections import defaultdict\n\ntree = defaultdict(lambda: defaultdict(list))\ntree["fruit"]["red"].append("apple")\ntree["fruit"]["yellow"].append("banana")\nprint(tree["fruit"]["red"])',
      explanation:
        'For nested defaultdicts, the OUTER factory must produce a NEW defaultdict per call — that\'s why you need the lambda. Passing `defaultdict(list)` directly evaluates ONCE — every outer key would share the same inner defaultdict.',
      hints: ['Outer factory must be a lambda that creates a fresh inner defaultdict.'],
      tags: ['collections', 'defaultdict', 'nested'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from collections import deque
buf = deque(maxlen=3)
for n in [1, 2, 3, 4, 5]:
    buf.append(n)
print(list(buf))`,
      expectedOutput: `[3, 4, 5]`,
      explanation:
        'A deque with maxlen=3 evicts from the OPPOSITE end when full. Appending past 3 items drops the leftmost. After pushing 1..5, only the last 3 (3, 4, 5) remain.',
      hints: ['maxlen evicts oldest when full.'],
      tags: ['collections', 'deque', 'maxlen'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from collections import Counter
a = Counter("abc")
b = Counter("bcd")
print(a + b)`,
      expectedOutput: `Counter({'b': 2, 'c': 2, 'a': 1, 'd': 1})`,
      explanation:
        'Counter + adds counts element-wise: a=1, b=1, c=1 plus b=1, c=1, d=1. Note Counter.__repr__ orders by count descending, then insertion order for ties.',
      hints: ['Counter + adds counts; output sorted by count.'],
      tags: ['collections', 'Counter', 'arithmetic'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from collections import ChainMap
defaults = {"x": 1, "y": 2}
overrides = {"y": 99}
m = ChainMap(overrides, defaults)
print(m["x"])
print(m["y"])`,
      expectedOutput: `1
99`,
      explanation:
        'ChainMap searches LEFT-TO-RIGHT. m["x"]: not in overrides, falls through to defaults → 1. m["y"]: found in overrides → 99. Leftmost wins on conflict; later layers act as fallback.',
      hints: ['Leftmost wins in ChainMap.'],
      tags: ['collections', 'ChainMap'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from collections import namedtuple
Point = namedtuple("Point", ["x", "y"])
p = Point(1, 2)
print(p == (1, 2))`,
      expectedOutput: `True`,
      explanation:
        'A namedtuple IS a tuple — it compares equal to a regular tuple with the same values. Useful interop, but means namedtuples don\'t carry "type identity" the way classes do.',
      hints: ['namedtuple inherits from tuple; equality uses tuple semantics.'],
      tags: ['collections', 'namedtuple', 'equality'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from collections import defaultdict
d = defaultdict(list)
_ = d["a"]
_ = d["b"]
print(sorted(d.keys()))`,
      expectedOutput: `['a', 'b']`,
      explanation:
        'Just READING from a defaultdict creates the entry with the default factory value. Two reads of "a" and "b" both materialize empty lists in the dict, so both keys exist after.',
      hints: ['defaultdict reads materialize the entry.'],
      tags: ['collections', 'defaultdict', 'side-effect'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from collections import Counter
c = Counter("aabbbc")
print(c["d"])`,
      expectedOutput: `0`,
      explanation:
        'Counter is a dict subclass with one twist: missing keys return 0 instead of raising KeyError. So c["d"] returns 0 (not present, count = 0). Note: this does NOT add "d" to the counter — unlike defaultdict, Counter doesn\'t materialize on read.',
      hints: ['Counter returns 0 for missing keys; no materialization.'],
      tags: ['collections', 'Counter', 'missing'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from collections import OrderedDict
a = OrderedDict([("x", 1), ("y", 2)])
b = OrderedDict([("y", 2), ("x", 1)])
print(a == b)`,
      expectedOutput: `False`,
      explanation:
        'OrderedDict equality is ORDER-SENSITIVE — same keys/values but different insertion order = not equal. Regular dicts (3.7+) compare by content only, regardless of insertion order. This is the main reason to still use OrderedDict despite dict being insertion-ordered.',
      hints: ['OrderedDict equality is order-sensitive; dict equality is not.'],
      tags: ['collections', 'OrderedDict', 'equality'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from collections import deque
q = deque([1, 2, 3, 4, 5])
q.rotate(2)
print(list(q))`,
      expectedOutput: `[4, 5, 1, 2, 3]`,
      explanation:
        'deque.rotate(n) shifts elements n steps to the RIGHT (positive n). The last 2 elements wrap to the front. Negative n rotates left. O(k) where k is the rotation amount.',
      hints: ['Positive rotate = elements move right (last wraps to front).'],
      tags: ['collections', 'deque', 'rotate'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from collections import Counter
c = Counter("hello")
print(sum(c.values()))`,
      expectedOutput: `5`,
      explanation:
        'sum of all counts gives the total number of items counted. "hello" has 5 chars, so sum is 5. Useful for "total items processed" metrics.',
      hints: ['Sum of counts = total items.'],
      tags: ['collections', 'Counter', 'sum'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-collections-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from collections import namedtuple
Point = namedtuple("Point", ["x", "y"])
p = Point(1, 2)
print(p._asdict())`,
      expectedOutput: `{'x': 1, 'y': 2}`,
      explanation:
        '_asdict() converts a namedtuple to a regular dict. The leading underscore is to avoid clashing with user field names (you might want a field called "asdict"). Other underscored methods: _replace, _make, _fields.',
      hints: ['_asdict — leading underscore avoids field-name conflicts.'],
      tags: ['collections', 'namedtuple', '_asdict'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-adv-coll-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write `analyze_text` taking a `text` string and optional integer `top_n` defaulting to 5. Return a summary dict of the word-frequency shape. Tokenise the text into LOWERCASE word tokens — a "word" is a run of ASCII letters, so punctuation and whitespace should be stripped and case ignored. From those tokens build a dict with three keys:\n\n- `"total_unique"` — the number of DISTINCT word tokens.\n- `"top_words"` — the top-N most frequent tokens as `(word, count)` pairs, ranked count-descending.\n- `"hapax"` — a list of every word that occurs EXACTLY ONCE, in first-seen order.\n\nExample input `("the cat sat on the mat the cat", top_n=3)` → `{"total_unique": 4, "top_words": [("the", 3), ("cat", 2), ("sat", 1)], "hapax": ["sat", "on", "mat"]}`.',
      starterCode: `def analyze_text(text: str, top_n: int = 5) -> dict:
      ...
  `,
      testCases: [
        {
          input: '"the cat sat on the mat the cat", top_n=3',
          expectedOutput: '{"total_unique": 4, "top_words": [("the", 3), ("cat", 2), ("sat", 1)], "hapax": ["sat", "on", "mat"]}',
          description: 'Should use Counter for text analysis',
        },
      ],
      solution: `from collections import Counter
import re

def analyze_text(text: str, top_n: int = 5) -> dict:
    """Analyze word frequencies in text."""
    words = re.findall(r'[a-z]+', text.lower())
    counter = Counter(words)
    return {
        "total_unique": len(counter),
        "top_words": counter.most_common(top_n),
        "hapax": [word for word, count in counter.items() if count == 1],
    }
`,
      tieredHints: {
        apiSignature: 'Counter(iterable); counter.most_common(n)',
        skeleton: `from collections import ____
import ____

def ____(text: ____, top_n: ____ = ____) -> ____:
    """Analyze word frequencies in text."""
    ____ = ____.____(r'____', text.____())  # words = re.findall, r'[a-z]+'
    counter = ____(____)
    return {
        ____: ____(counter),  # "total_unique"
        ____: counter.____(top_n),  # "top_words"
        ____: [word for word, count in counter.____() if count == ____],  # "hapax"
    }`,
      },
      explanation: 'Counter is a dict subclass designed for counting hashable objects. Counter(iterable) counts occurrences of each element. most_common(n) returns the n highest counts as (element, count) tuples, sorted by count descending. Counter also supports arithmetic: Counter("aab") - Counter("ab") == Counter({"a": 1}). Using re.findall(r"[a-z]+", text.lower()) is a robust way to extract words while stripping punctuation and normalizing case.',
      hints: [
        'Tokenize with re.findall(r\'[a-z]+\', text.lower()) to strip punctuation and normalize case',
        'Counter(list) counts occurrences of each element',
        'counter.most_common(n) returns top n as (elem, count) pairs',
        'Iterate counter.items() to find hapax (count == 1)',
      ],
      tags: ['Counter', 'collections', 'text-analysis', 'most_common'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-adv-coll-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write two helpers that use the `collections` dict-subclass which auto-creates missing entries from a factory.\n\n(1) `group_records` — takes a list of `(category, item)` string pairs, groups each `item` under its `category`, returns a plain dict. Example input `[("fruit","apple"),("veg","carrot"),("fruit","banana")]` → `{"fruit": ["apple","banana"], "veg": ["carrot"]}`.\n\n(2) `build_index` — takes a list of `(word, page)` pairs, collects unique page numbers per word (duplicates must collapse), returns a dict mapping each word to the SORTED list of pages. Example input `[("python",1),("java",2),("python",3),("python",1)]` → `{"python": [1, 3], "java": [2]}`.\n\nUse the factory variant that fits each case — list for grouping, set for uniqueness.',
      starterCode: `from collections import defaultdict
  `,
      testCases: [
        {
          input: '[("fruit", "apple"), ("veg", "carrot"), ("fruit", "banana")]',
          expectedOutput: '{"fruit": ["apple", "banana"], "veg": ["carrot"]}',
          description: 'Should group and build index with defaultdict',
        },
      ],
      solution: `from collections import defaultdict

def group_records(records: list[tuple[str, str]]) -> dict[str, list[str]]:
    """Group items by category."""
    groups = defaultdict(list)
    for category, item in records:
        groups[category].append(item)
    return dict(groups)

def build_index(entries: list[tuple[str, int]]) -> dict[str, list[int]]:
    """Build inverted index: word -> sorted unique page numbers."""
    index = defaultdict(set)
    for word, page in entries:
        index[word].add(page)
    return {word: sorted(pages) for word, pages in index.items()}
`,
      tieredHints: {
        apiSignature: 'defaultdict(default_factory)',
        skeleton: `from collections import ____

def ____(records: ____) -> ____:
    """Group items by category."""
    groups = ____(____)  # list
    for category, item in records:
        groups[category].____(item)
    return ____(groups)

def ____(entries: ____) -> ____:
    """Build inverted index: word -> sorted unique page numbers."""
    index = ____(____)  # set
    for word, page in entries:
        index[word].____(page)
    return {word: ____(pages) for word, pages in index.____()}`,
      },
      explanation: 'defaultdict(list) auto-creates an empty list for any new key, eliminating the need for `if key not in dict: dict[key] = []` checks. defaultdict(set) similarly creates empty sets, perfect for collecting unique values. The factory function (list, set, int, etc.) is called with no arguments whenever a missing key is accessed. This pattern is central to grouping, indexing, and counting operations. Converting back to dict() at the end ensures the return type matches the annotation.',
      hints: [
        'defaultdict(list) creates a new list for each missing key',
        'defaultdict(set) for unique value collection',
        'Convert back to dict() for clean return types',
      ],
      tags: ['defaultdict', 'collections', 'grouping', 'index'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-adv-coll-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      question: 'Why would you use `collections.deque` instead of a regular `list` for a queue?',
      options: [
        { id: 'a', text: 'deque uses less memory than list for the same number of elements', isCorrect: false },
        { id: 'b', text: 'deque supports O(1) append and pop from both ends, while list.pop(0) is O(n) because it shifts all remaining elements', isCorrect: true },
        { id: 'c', text: 'deque supports indexing and slicing while list does not', isCorrect: false },
        { id: 'd', text: 'deque is thread-safe while list is not — deque should always replace list', isCorrect: false },
      ],
      explanation: 'A Python list is backed by a dynamic array. Appending to the end is O(1) amortized, but inserting or removing from the front is O(n) because every element must shift. deque (double-ended queue) is backed by a doubly-linked block list, giving O(1) append/pop from both ends. This makes deque ideal for queues (FIFO), sliding windows, and BFS algorithms. Trade-off: deque has O(n) access by index, while list has O(1). deque also supports maxlen for fixed-size buffers that automatically discard old items.',
      hints: [
        'list.pop(0) shifts all elements left — O(n)',
        'deque.popleft() is O(1)',
        'deque(maxlen=N) creates a bounded buffer',
      ],
      tags: ['deque', 'collections', 'performance', 'queue', 'big-O'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-coll-types-overview',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      question: 'Which `collections` helper matches each use case: counting occurrences, grouping by key with auto-default, fast popleft queue, fixed-field record?',
      options: [
        { id: 'a', text: 'All four are the same class', isCorrect: false },
        { id: 'b', text: '`Counter` for counting, `defaultdict` for group-by with auto-default values, `deque` for fast appends/pops at both ends (O(1) popleft), `namedtuple` for a lightweight immutable record with fixed field names.', isCorrect: true },
        { id: 'c', text: '`OrderedDict` for everything', isCorrect: false },
        { id: 'd', text: '`list` and `dict` are the only ones you need', isCorrect: false },
      ],
      explanation: 'Reach for the right tool: `Counter({"a": 3, "b": 1})` beats `{"a": 3, "b": 1}` for frequency with `.most_common()`. `defaultdict(list)` beats `dict` for "group these by key". `deque` beats `list` when popping from the front (`list.pop(0)` is O(n), `deque.popleft()` is O(1)). `namedtuple` beats `tuple` when you want `p.x`, `p.y` instead of `p[0]`, `p[1]`. These four cover 90% of real usage.',
      hints: [
        'Counter: frequency + most_common',
        'defaultdict(list/set/int): auto-init on first access',
        'deque: O(1) at both ends',
        'namedtuple: fixed fields, immutable, tuple-compatible',
      ],
      tags: ['collections', 'Counter', 'defaultdict', 'deque', 'namedtuple'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-coll-defaultdict-group',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `words = ["apple", "ant", "banana", "berry", "cherry"]`, group the words by their first letter into a `groups` dict-subclass that auto-creates empty lists for missing keys (no explicit `if key not in groups` check needed). Iterate the words and append each to the list at its first-letter key. Print the result as a plain `dict` (expect `{\'a\': [\'apple\', \'ant\'], \'b\': [\'banana\', \'berry\'], \'c\': [\'cherry\']}`).',
      starterCode: `from collections import defaultdict
  `,
      testCases: [
        {
          input: 'defaultdict(list) group-by',
          expectedOutput: "{'a': ['apple', 'ant'], 'b': ['banana', 'berry'], 'c': ['cherry']}",
          description: 'defaultdict(list) auto-creates empty list on missing key',
        },
      ],
      solution: `from collections import defaultdict

words = ["apple", "ant", "banana", "berry", "cherry"]
groups = defaultdict(list)
for w in words:
    groups[w[0]].append(w)

print(dict(groups))`,
      tieredHints: {
        apiSignature: 'defaultdict(default_factory)',
        skeleton: `from collections import ____

words = ____  # ["apple", "ant", "banana", "berry", "cherry"]
groups = ____(____)  # list
for w in words:
    groups[w[____]].____(w)  # 0, append

print(____(groups))`,
      },
      explanation: 'Without `defaultdict`, you\'d need `if w[0] not in groups: groups[w[0]] = []; groups[w[0]].append(w)` or use `.setdefault()`. Factory can be any callable: `defaultdict(int)` for a counter, `defaultdict(set)` for unique grouping, `defaultdict(lambda: [0, 0])` for multi-counter. Print as `dict(...)` to strip the default_factory from the repr.',
      hints: [
        'defaultdict(factory) auto-inits missing keys',
        'Common factories: list, set, int, dict',
        'dict(d) for clean print output',
      ],
      tags: ['collections', 'defaultdict', 'group-by'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-coll-deque-queue',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use `collections.deque` as a FIFO queue (O(1) append on the right, O(1) remove from the left). Create an empty deque `q`, then append `"a"`, `"b"`, `"c"` in that order. Then do this two times: remove the leftmost element and print it (so the output is `a` on one line, then `b` on the next). Finally print the remaining contents as a list (expect `[\'c\']`).',
      starterCode: `from collections import deque
  `,
      testCases: [
        {
          input: 'deque FIFO',
          expectedOutput: 'a\nb\n[\'c\']',
          description: 'append + popleft = FIFO',
        },
      ],
      solution: `from collections import deque

q = deque()
q.append("a")
q.append("b")
q.append("c")

print(q.popleft())
print(q.popleft())
print(list(q))`,
      tieredHints: {
        apiSignature: 'deque().append(x); deque().popleft() -> x',
        skeleton: `from collections import deque

q = ____()
q.____(____)  # "a"
q.____(____)  # "b"
q.____(____)  # "c"

print(q.____())
print(q.____())
print(____(q))`,
      },
      explanation: '`deque` (double-ended queue) gives O(1) inserts and removes at BOTH ends. `list.pop(0)` is O(n) because it shifts every remaining element. Use `deque` for breadth-first search, sliding windows, producer/consumer buffers, and any fair-order processing queue. Also supports `appendleft` / `pop` (from right) for LIFO.',
      hints: [
        'append + popleft = FIFO queue',
        'appendleft + pop = LIFO stack',
        'list.pop(0) is O(n); deque.popleft() is O(1)',
      ],
      tags: ['collections', 'deque', 'queue', 'FIFO'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-coll-deque-maxlen',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a fixed-size sliding-window collection `tail` using the `collections` double-ended queue type bounded to a max length of 3 — once full, appending more items automatically discards the oldest from the other end. Append the integers `1, 2, 3, 4, 5` in order, then print the final contents as a list (expect `[3, 4, 5]` — only the last three survived).',
      starterCode: `from collections import deque
  `,
      testCases: [
        {
          input: 'bounded deque',
          expectedOutput: '[3, 4, 5]',
          description: 'maxlen drops oldest on overflow',
        },
      ],
      solution: `from collections import deque

tail = deque(maxlen=3)
for n in range(1, 6):
    tail.append(n)

print(list(tail))`,
      tieredHints: {
        apiSignature: 'deque(maxlen=N)',
        skeleton: `from collections import ____

tail = ____(____=____)  # maxlen=3
for n in ____(____, ____):  # 1, 6
    tail.____(n)

print(____(tail))`,
      },
      explanation: 'A bounded deque is the cleanest way to "keep the last N items" — no manual slicing, no size checks. Common uses: keeping the last N log lines for a diagnostic endpoint, moving averages over fixed windows, last-N-events buffers. Appending to a full deque automatically discards the other end.',
      hints: [
        'deque(maxlen=N) — append to full deque drops from the other end',
        'Ideal for sliding windows, rolling buffers',
        'No manual length checks needed',
      ],
      tags: ['collections', 'deque', 'maxlen', 'sliding-window'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-coll-namedtuple',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a lightweight immutable 2D point type `Point` with two fields `x` and `y` using the `collections` factory function that creates a tuple subclass with named fields. Build an instance `p` with coordinates (3, 4). Print the `x` attribute (expect `3`), the `y` attribute (expect `4`), and the instance itself (expect `Point(x=3, y=4)`).',
      starterCode: `from collections import namedtuple
  `,
      testCases: [
        {
          input: 'namedtuple with field access',
          expectedOutput: '3\n4\nPoint(x=3, y=4)',
          description: 'namedtuple gives attribute access and nice repr',
        },
      ],
      solution: `from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(p.x)
print(p.y)
print(p)`,
      tieredHints: {
        apiSignature: 'namedtuple(typename, field_names)',
        skeleton: `from collections import ____

Point = ____(____, ____)  # "Point", ["x", "y"]
p = ____(____, ____)  # Point(3, 4)
print(p.____)
print(p.____)
print(p)`,
      },
      explanation: 'namedtuples are tuples with field names — `p.x` works alongside `p[0]`. Immutable, hashable, pickleable, tiny memory footprint. Since Python 3.6+ consider `typing.NamedTuple` for type-annotated fields, or `dataclasses.dataclass(frozen=True)` if you want methods. For purely structural records, `typing.NamedTuple` is the modern go-to.',
      hints: [
        'namedtuple("Name", ["field1", "field2"])',
        'Access by name (p.x) or index (p[0])',
        'Modern alt: typing.NamedTuple for type hints',
      ],
      tags: ['collections', 'namedtuple', 'record'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-coll-chainmap',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `defaults = {"debug": False, "port": 8000}` and `overrides = {"port": 9000}`, build a layered config view `cfg` using the `collections` class that chains multiple dicts with left-to-right lookup precedence — overrides must win over defaults. Print the value for `"debug"` (expect `False` — falls through to defaults since overrides doesn\'t have it) and the value for `"port"` (expect `9000` — overrides wins).',
      starterCode: `from collections import ChainMap
  `,
      testCases: [
        {
          input: 'ChainMap precedence',
          expectedOutput: 'False\n9000',
          description: 'Earlier maps shadow later ones',
        },
      ],
      solution: `from collections import ChainMap

defaults = {"debug": False, "port": 8000}
overrides = {"port": 9000}

cfg = ChainMap(overrides, defaults)
print(cfg["debug"])
print(cfg["port"])`,
      tieredHints: {
        apiSignature: 'ChainMap(*maps)',
        skeleton: `from collections import ChainMap

defaults = {____: ____, ____: ____}  # "debug": False, "port": 8000
overrides = {____: ____}  # "port": 9000

cfg = ____(____, ____)  # overrides, defaults
print(cfg[____])  # "debug"
print(cfg[____])  # "port"`,
      },
      explanation: '`ChainMap(*maps)` looks up keys left-to-right — first match wins. Great for layered config (CLI flags > env > file > defaults), scope resolution (locals → enclosing → globals → builtins — actually how Python resolves names), or diff-style overlays. `cfg.maps` exposes the underlying list. Mutations (`cfg["x"] = 1`) only ever touch `maps[0]` — the underlying dicts stay pristine.',
      hints: [
        'ChainMap(first, second, ...) — first wins',
        'Mutations only affect maps[0]',
        'Perfect for config layering',
      ],
      tags: ['collections', 'ChainMap', 'config'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-coll-counter-arithmetic',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build two inventory counters `a` (apple=5, banana=2) and `b` (apple=3, cherry=1) using the `collections` multiset class. Combine them with the `+` operator (counter arithmetic adds counts element-wise, keeping solo keys unchanged) and print the result (expect `Counter({\'apple\': 8, \'banana\': 2, \'cherry\': 1})`).',
      starterCode: `from collections import Counter
  `,
      testCases: [
        {
          input: 'Counter addition',
          expectedOutput: "Counter({'apple': 8, 'banana': 2, 'cherry': 1})",
          description: 'Counters support + - & |',
        },
      ],
      solution: `from collections import Counter

a = Counter({"apple": 5, "banana": 2})
b = Counter({"apple": 3, "cherry": 1})

print(a + b)
# OR
from collections import Counter

a = Counter(apple=5, banana=2)
b = Counter(apple=3, cherry=1)

print(a + b)`,
      tieredHints: {
        apiSignature: 'Counter(mapping); counter_a + counter_b',
        skeleton: `from collections import Counter

a = ____({____: 5, ____: 2})  # "apple", "banana"
b = ____({____: 3, ____: 1})  # "apple", "cherry"

print(a ____ b)  # +`,
      },
      explanation: 'Counters overload arithmetic: `a + b` sums counts, `a - b` subtracts (drops non-positive counts), `a & b` element-wise min (intersection of multisets), `a | b` element-wise max (union of multisets). Useful for bag-of-words math, voting / tallying systems, diffing event counts across time windows. `a - b` is especially handy — "what changed, and by how much".',
      hints: [
        'a + b adds counts',
        'a - b drops non-positive counts',
        'a & b = min, a | b = max',
      ],
      tags: ['collections', 'Counter', 'arithmetic'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-coll-ordered-vs-dict',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      question: 'Given that regular `dict` preserves insertion order since Python 3.7, when is `collections.OrderedDict` still useful?',
      options: [
        { id: 'a', text: 'Never — it\'s completely redundant', isCorrect: false },
        { id: 'b', text: 'When you need `.move_to_end(key, last=True/False)` to reorder, when equality should compare by insertion order (plain dict ignores order in `==`), or when you want `.popitem(last=False)` for FIFO eviction. Building LRU caches is the classic use case.', isCorrect: true },
        { id: 'c', text: 'Only in Python 2', isCorrect: false },
        { id: 'd', text: 'For any dict larger than 1 million items', isCorrect: false },
      ],
      explanation: 'Since 3.7, regular `dict` preserves insertion order — but `OrderedDict` still has ordering as part of its CONTRACT (3.7 guarantees it for dict, but the semantic meaning stays with OrderedDict). Key differences: `OrderedDict == OrderedDict` compares order too; `dict == dict` ignores order. `.move_to_end()` and `.popitem(last=False)` (O(1) either end) don\'t exist on `dict`. For LRU caches, `functools.lru_cache` usually beats hand-rolling.',
      hints: [
        'move_to_end + popitem(last=False) are OrderedDict-only',
        'Equality compares order in OrderedDict, not in dict',
        'Plain dict preserves insertion order (3.7+) but doesn\'t advertise it',
      ],
      tags: ['collections', 'OrderedDict', 'dict', 'ordering'],
      concepts: ['py-collections-stdlib', 'py-dict-key-hashability'],
    },
  {
      id: 'py-coll-deque-rotate',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a deque `d` containing `[1, 2, 3, 4, 5]`. Using the deque method that shifts elements CYCLICALLY in place, rotate right by 2 (the last 2 elements wrap to the front) and print the contents as a list (expect `[4, 5, 1, 2, 3]`). Then rotate left by 3 (negative argument = left) and print again (expect `[2, 3, 4, 5, 1]`).',
      starterCode: `from collections import deque
  `,
      testCases: [
        {
          input: 'deque rotation',
          expectedOutput: '[4, 5, 1, 2, 3]\n[2, 3, 4, 5, 1]',
          description: 'rotate(n>0) = right shift, rotate(n<0) = left shift',
        },
      ],
      solution: `from collections import deque

d = deque([1, 2, 3, 4, 5])
d.rotate(2)
print(list(d))
d.rotate(-3)
print(list(d))`,
      tieredHints: {
        apiSignature: 'deque.rotate(n)',
        skeleton: `from collections import ____

d = ____(____)  # [1, 2, 3, 4, 5]
d.____(____)  # 2
print(____(d))
d.____(____)  # -3
print(____(d))`,
      },
      explanation: '`rotate(n)` shifts elements circularly — positive n rotates right, negative n rotates left. O(n) in the number of steps. Much faster than slice-reassignment `d = d[-n:] + d[:-n]` which allocates two new slices. Use for circular buffers, round-robin dispatch, Caesar-cipher-style encodings.',
      hints: [
        'd.rotate(n) rotates right (positive) or left (negative)',
        'In-place — no new deque allocated',
        'O(n) where n is the step count',
      ],
      tags: ['collections', 'deque', 'rotate'],
      concepts: ['py-collections-stdlib'],
    },
  {
      id: 'py-coll-int-deque-counter',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_COLLECTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Combine a size-bounded deque with a frequency counter to find the most common item in a rolling window. Given the event stream `events = ["hit", "miss", "hit", "hit", "miss", "hit"]`, push each event onto a sliding window `window` capped to the last 3 items (oldest drops off automatically). After processing every event, build a frequency counter over the window contents and print the single most-common item using the counter method that returns top-N (expect `[(\'hit\', 2)]` — the final window is `["hit", "miss", "hit"]`).',
      starterCode: `from collections import deque, Counter
  `,
      testCases: [
        {
          input: 'deque(maxlen=3) + Counter over events',
          expectedOutput: "[('hit', 2)]",
          description: 'Only the last 3 events survive; Counter ranks them',
        },
      ],
      solution: `from collections import deque, Counter

events = ["hit", "miss", "hit", "hit", "miss", "hit"]
window = deque(maxlen=3)
for e in events:
    window.append(e)

counter = Counter(window)
print(counter.most_common(1))`,
      tieredHints: {
        apiSignature: 'deque(maxlen=N); Counter(iterable).most_common(n)',
        skeleton: `from collections import ____, ____

events = ____  # ["hit", "miss", "hit", "hit", "miss", "hit"]
window = ____(____=____)  # maxlen=3
for e in events:
    window.____(e)

counter = ____(window)
print(counter.____(____))  # 1`,
      },
      explanation:
        '`deque(maxlen=N)` auto-discards the oldest item once the cap is reached, giving you an O(1) sliding window without bookkeeping. Piping the window into `Counter` gives you frequency over "the recent past" — canonical shape for rate-limiting decisions, rolling dashboards, anomaly detection, or "most common recent request" style heuristics. For a true streaming version (update the counter on each push/pop instead of rebuilding), increment on append and decrement on the evicted item — the deque makes that easy because you can inspect `window[0]` before it falls off.',
      hints: [
        'deque(maxlen=N) discards the oldest item automatically',
        'Counter(iterable) tallies any iterable, including a deque',
        'For true streaming, update counts incrementally on each append/evict',
      ],
      tags: ['collections', 'deque', 'Counter', 'rolling-window', 'intermediate'],
      concepts: ['py-collections-stdlib'],
    },
];
