/**
 * Topic.PY_ITERTOOLS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pyItertoolsCloze.ts (10), pyItertoolsParsons.ts (10), pyItertoolsPredictOutput.ts (10), pythonAdvancedQuestions.ts (3), pythonBatchAExpansionQuestions.ts (11), pythonGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_itertools_questions: Question[] = [
  {
      id: 'py-itertools-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the itertools function that concatenates iterables.',
      template: `from itertools import ___

print(list(___([1, 2], [3, 4])))`,
      blanks: ['chain', 'chain'],
      solution: 'from itertools import chain\n\nprint(list(chain([1, 2], [3, 4])))',
      explanation:
        'chain accepts multiple iterables and yields their elements in order. For an iterable-of-iterables, use chain.from_iterable.',
      hints: ['Five letters; same noun as a sequence of links.'],
      tags: ['itertools', 'chain'],
      concepts: ['py-itertools-combinators', 'ce-chord-vs-chain'],
    },
  {
      id: 'py-itertools-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the itertools function that groups consecutive equal items.',
      template: `from itertools import ___

for k, g in ___([1, 1, 2, 2, 3]):
    print(k, list(g))`,
      blanks: ['groupby', 'groupby'],
      solution:
        'from itertools import groupby\n\nfor k, g in groupby([1, 1, 2, 2, 3]):\n    print(k, list(g))',
      explanation:
        'groupby groups CONSECUTIVE equal items. Input must be sorted by the grouping key for a "real" groupby. The yielded g is a one-shot iterator.',
      hints: ['Single word: "group" + "by".'],
      tags: ['itertools', 'groupby'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the itertools function that pads the shorter iterable instead of cutting at the shortest.',
      template: `from itertools import ___

print(list(___([1, 2, 3], ["a"], fillvalue="-")))`,
      blanks: ['zip_longest', 'zip_longest'],
      solution:
        'from itertools import zip_longest\n\nprint(list(zip_longest([1, 2, 3], ["a"], fillvalue="-")))',
      explanation:
        'zip_longest goes to the longest iterable, padding shorter ones. zip stops at the shortest. Default fillvalue is None.',
      hints: ['Snake_case: "zip" + "_longest".'],
      tags: ['itertools', 'zip_longest'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the itertools function that yields running totals.',
      template: `from itertools import ___

print(list(___([1, 2, 3, 4])))`,
      blanks: ['accumulate', 'accumulate'],
      solution: 'from itertools import accumulate\n\nprint(list(accumulate([1, 2, 3, 4])))',
      explanation:
        'accumulate yields running totals. Default operation is addition; pass a binary function for other reductions.',
      hints: ['Verb meaning "build up gradually".'],
      tags: ['itertools', 'accumulate'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the itertools function that takes a prefix while a predicate is true.',
      template: `from itertools import ___

print(list(___(lambda n: n < 5, [1, 3, 5, 7, 2])))`,
      blanks: ['takewhile', 'takewhile'],
      solution:
        'from itertools import takewhile\n\nprint(list(takewhile(lambda n: n < 5, [1, 3, 5, 7, 2])))',
      explanation:
        'takewhile keeps the prefix and stops at the first false. dropwhile is the inverse — drops the prefix and keeps the rest.',
      hints: ['Snake-free single word: "take" + "while".'],
      tags: ['itertools', 'takewhile'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the itertools function that takes a finite slice of an iterator.',
      template: `from itertools import ___, count

print(list(___(count(), 5)))`,
      blanks: ['islice', 'islice'],
      solution:
        'from itertools import islice, count\n\nprint(list(islice(count(), 5)))',
      explanation:
        'islice gives [start:stop:step] semantics for ITERATORS. Generators don\'t support [] slicing — islice is the equivalent.',
      hints: ['Letter + word: "i" + "slice".'],
      tags: ['itertools', 'islice'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the itertools function for the Cartesian product of multiple iterables.',
      template: `from itertools import ___

for combo in ___(["A", "B"], [1, 2]):
    print(combo)`,
      blanks: ['product', 'product'],
      solution:
        'from itertools import product\n\nfor combo in product(["A", "B"], [1, 2]):\n    print(combo)',
      explanation:
        'product(a, b) yields all (x, y) pairs from a x b. Use repeat=n for the n-fold product of one iterable with itself.',
      hints: ['Same as the math noun for "result of multiplication".'],
      tags: ['itertools', 'product'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the itertools function that yields all r-element subsets (unordered, no repetition).',
      template: `from itertools import ___

print(list(___("ABC", 2)))`,
      blanks: ['combinations', 'combinations'],
      solution:
        'from itertools import combinations\n\nprint(list(combinations("ABC", 2)))',
      explanation:
        'combinations: unordered, no replacement. permutations: ordered, no replacement. product(repeat=...): ordered, with replacement.',
      hints: ['Same word as the math term for "unordered selections".'],
      tags: ['itertools', 'combinations'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the itertools infinite iterator that loops over a sequence forever.',
      template: `from itertools import ___, islice

print(list(islice(___(["R", "G", "B"]), 7)))`,
      blanks: ['cycle', 'cycle'],
      solution:
        'from itertools import cycle, islice\n\nprint(list(islice(cycle(["R", "G", "B"]), 7)))',
      explanation:
        'cycle wraps an iterable into an infinite loop. Always pair with islice or another stopping condition — direct list() would never terminate.',
      hints: ['Same as the noun for "repeating loop".'],
      tags: ['itertools', 'cycle'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the chain helper for flattening an iterable of iterables.',
      template: `from itertools import chain

print(list(chain.___([[1, 2], [3, 4]])))`,
      blanks: ['from_iterable'],
      solution: 'from itertools import chain\n\nprint(list(chain.from_iterable([[1, 2], [3, 4]])))',
      explanation:
        'chain.from_iterable takes ONE iterable-of-iterables and flattens. chain(iterables) requires unpacking — chain(*[[1,2],[3,4]]).',
      hints: ['Two snake-cased words: "from" + "_iterable".'],
      tags: ['itertools', 'chain', 'from_iterable'],
      concepts: ['py-itertools-combinators', 'ce-chord-vs-chain'],
    },
  {
      id: 'py-itertools-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use itertools.chain to flatten three lists into one iterator and materialize as a list.',
      correctOrder: [
        'from itertools import chain',
        '',
        'a = [1, 2]',
        'b = [3, 4]',
        'c = [5, 6]',
        'flat = list(chain(a, b, c))',
        'print(flat)',
      ],
      distractorLines: [
        'flat = list(chain([a, b, c]))',
        'flat = a + b + c',
      ],
      solution:
        'from itertools import chain\n\na = [1, 2]\nb = [3, 4]\nc = [5, 6]\nflat = list(chain(a, b, c))\nprint(flat)',
      explanation:
        'chain(a, b, c) iterates each iterable in sequence — pass them as separate args. chain([a, b, c]) would iterate the OUTER list, giving back [a, b, c] not flattened. chain.from_iterable([a, b, c]) is the form for an iterable-of-iterables.',
      hints: ['Pass iterables as separate args; chain.from_iterable for iterable-of-iterables.'],
      tags: ['itertools', 'chain'],
      concepts: ['py-itertools-combinators', 'ce-chord-vs-chain'],
    },
  {
      id: 'py-itertools-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Group consecutive equal items in [1, 1, 2, 2, 2, 3] using itertools.groupby.',
      correctOrder: [
        'from itertools import groupby',
        '',
        'data = [1, 1, 2, 2, 2, 3]',
        'for k, g in groupby(data):',
        '    print(k, list(g))',
      ],
      distractorLines: [
        'for k, g in data.groupby():',
        '    print(k, g)',
      ],
      solution:
        'from itertools import groupby\n\ndata = [1, 1, 2, 2, 2, 3]\nfor k, g in groupby(data):\n    print(k, list(g))',
      explanation:
        'groupby groups CONSECUTIVE equal items — input must be sorted by the grouping key for a "real" groupby. The yielded g is an iterator (one-shot) — materialize with list() before printing or iterating again.',
      hints: ['groupby groups CONSECUTIVE; g is a one-shot iterator.'],
      tags: ['itertools', 'groupby'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use zip_longest to zip [1,2,3] with ["a","b"], filling missing values with "-".',
      correctOrder: [
        'from itertools import zip_longest',
        '',
        'pairs = list(zip_longest([1, 2, 3], ["a", "b"], fillvalue="-"))',
        'print(pairs)',
      ],
      distractorLines: [
        'pairs = list(zip([1, 2, 3], ["a", "b"]))',
        'pairs = list(zip_longest([1, 2, 3], ["a", "b"]))',
      ],
      solution:
        'from itertools import zip_longest\n\npairs = list(zip_longest([1, 2, 3], ["a", "b"], fillvalue="-"))\nprint(pairs)',
      explanation:
        'zip stops at the SHORTEST iterable. zip_longest goes to the longest, filling missing values with fillvalue (default None). Without fillvalue, missing slots become None.',
      hints: ['zip cuts short; zip_longest pads to the longest.'],
      tags: ['itertools', 'zip_longest'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Compute running sums of [1, 2, 3, 4] using itertools.accumulate.',
      correctOrder: [
        'from itertools import accumulate',
        '',
        'print(list(accumulate([1, 2, 3, 4])))',
      ],
      distractorLines: [
        'print(sum([1, 2, 3, 4]))',
        'print(list(accumulate([1, 2, 3, 4], min)))',
      ],
      solution:
        'from itertools import accumulate\n\nprint(list(accumulate([1, 2, 3, 4])))',
      explanation:
        'accumulate yields RUNNING totals: [1, 3, 6, 10]. The default operation is addition; pass a 2-arg function for other reductions (e.g., min, max, operator.mul). sum returns ONLY the final total, not the running sequence.',
      hints: ['accumulate yields running totals; default is addition.'],
      tags: ['itertools', 'accumulate'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use takewhile to keep elements of [1, 2, 3, 100, 4, 5] until the first that fails the predicate (< 50).',
      correctOrder: [
        'from itertools import takewhile',
        '',
        'kept = list(takewhile(lambda n: n < 50, [1, 2, 3, 100, 4, 5]))',
        'print(kept)',
      ],
      distractorLines: [
        'kept = list(filter(lambda n: n < 50, [1, 2, 3, 100, 4, 5]))',
        'kept = list(dropwhile(lambda n: n < 50, [1, 2, 3, 100, 4, 5]))',
      ],
      solution:
        'from itertools import takewhile\n\nkept = list(takewhile(lambda n: n < 50, [1, 2, 3, 100, 4, 5]))\nprint(kept)',
      explanation:
        'takewhile keeps a PREFIX while the predicate is true and stops at the first false — so [1, 2, 3] (stops at 100). filter keeps ALL passing elements, even after a failure (= [1, 2, 3, 4, 5]). dropwhile is the inverse: skips the prefix.',
      hints: ['takewhile stops at the first false; filter visits everything.'],
      tags: ['itertools', 'takewhile'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Take the first 5 values of an infinite count() generator using itertools.islice.',
      correctOrder: [
        'from itertools import count, islice',
        '',
        'first_five = list(islice(count(), 5))',
        'print(first_five)',
      ],
      distractorLines: [
        'first_five = count()[:5]',
        'first_five = list(count(5))',
      ],
      solution:
        'from itertools import count, islice\n\nfirst_five = list(islice(count(), 5))\nprint(first_five)',
      explanation:
        'islice(iter, n) takes the first n values — works on any iterator (count is infinite!). Generators don\'t support [] slicing. count(5) starts COUNTING FROM 5 (still infinite) — different argument semantics.',
      hints: ['islice for prefix on iterators; [:n] doesn\'t work on generators.'],
      tags: ['itertools', 'islice', 'count'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use product to generate all pairs of letters [A, B] x sizes [S, M, L].',
      correctOrder: [
        'from itertools import product',
        '',
        'for combo in product(["A", "B"], ["S", "M", "L"]):',
        '    print(combo)',
      ],
      distractorLines: [
        'for combo in zip(["A", "B"], ["S", "M", "L"]):',
        'for combo in combinations(["A", "B"], ["S", "M", "L"]):',
      ],
      solution:
        'from itertools import product\n\nfor combo in product(["A", "B"], ["S", "M", "L"]):\n    print(combo)',
      explanation:
        'product is the Cartesian product — every pair from each iterable. zip pairs by INDEX (cuts at shortest). combinations picks subsets, not products.',
      hints: ['product = Cartesian product. zip = index-aligned pairs.'],
      tags: ['itertools', 'product'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use combinations to generate all 2-element subsets of [A, B, C].',
      correctOrder: [
        'from itertools import combinations',
        '',
        'for c in combinations(["A", "B", "C"], 2):',
        '    print(c)',
      ],
      distractorLines: [
        'for c in permutations(["A", "B", "C"], 2):',
        'for c in product(["A", "B", "C"], repeat=2):',
      ],
      solution:
        'from itertools import combinations\n\nfor c in combinations(["A", "B", "C"], 2):\n    print(c)',
      explanation:
        'combinations yields UNORDERED subsets. For [A, B, C] choose 2: (A,B), (A,C), (B,C) — three pairs. permutations would yield 6 (order matters). product with repeat=2 yields 9 (with replacement).',
      hints: ['combinations: unordered, no repetition. permutations: ordered. product: with replacement.'],
      tags: ['itertools', 'combinations'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Cycle through colors infinitely with cycle, take 7 values with islice.',
      correctOrder: [
        'from itertools import cycle, islice',
        '',
        'palette = ["R", "G", "B"]',
        'seven = list(islice(cycle(palette), 7))',
        'print(seven)',
      ],
      distractorLines: [
        'seven = palette * 7',
        'seven = list(cycle(palette)[:7])',
      ],
      solution:
        'from itertools import cycle, islice\n\npalette = ["R", "G", "B"]\nseven = list(islice(cycle(palette), 7))\nprint(seven)',
      explanation:
        'cycle wraps an iterable into an infinite iterator that loops forever. Take a finite prefix with islice. palette * 7 just repeats the LIST 7 times — different shape and not lazy.',
      hints: ['cycle is infinite; gate it with islice.'],
      tags: ['itertools', 'cycle', 'islice'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use chain.from_iterable to flatten a list of lists.',
      correctOrder: [
        'from itertools import chain',
        '',
        'nested = [[1, 2], [3, 4], [5]]',
        'flat = list(chain.from_iterable(nested))',
        'print(flat)',
      ],
      distractorLines: [
        'flat = list(chain(nested))',
        'flat = sum(nested, [])',
      ],
      solution:
        'from itertools import chain\n\nnested = [[1, 2], [3, 4], [5]]\nflat = list(chain.from_iterable(nested))\nprint(flat)',
      explanation:
        'chain.from_iterable takes ONE argument (an iterable of iterables) and flattens. chain(nested) would treat the outer list as a single iterable to chain — yielding [[1,2], [3,4], [5]] unchanged. sum(nested, []) works but is O(n²).',
      hints: ['chain takes args; chain.from_iterable takes one iterable-of-iterables.'],
      tags: ['itertools', 'chain', 'flatten'],
      concepts: ['py-itertools-combinators', 'ce-chord-vs-chain'],
    },
  {
      id: 'py-itertools-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from itertools import chain
print(list(chain([1, 2], [3], [4, 5])))`,
      expectedOutput: `[1, 2, 3, 4, 5]`,
      explanation:
        'chain iterates each iterable in sequence, producing a single flat output. Each iterable is passed as a separate arg.',
      hints: ['chain concatenates iterables in order.'],
      tags: ['itertools', 'chain'],
      concepts: ['py-itertools-combinators', 'ce-chord-vs-chain'],
    },
  {
      id: 'py-itertools-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from itertools import groupby
data = [1, 2, 1, 1, 3, 2]
for k, g in groupby(data):
    print(k, list(g))`,
      expectedOutput: `1 [1]
2 [2]
1 [1, 1]
3 [3]
2 [2]`,
      explanation:
        'groupby groups CONSECUTIVE equal elements. Since data is not sorted, the same value can appear in multiple groups (1 appears twice). For "real" grouping, sort first by the same key.',
      hints: ['Consecutive grouping; same value in multiple non-adjacent positions = multiple groups.'],
      tags: ['itertools', 'groupby', 'consecutive'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from itertools import zip_longest
print(list(zip_longest([1, 2, 3], ["a", "b"], fillvalue="-")))`,
      expectedOutput: `[(1, 'a'), (2, 'b'), (3, '-')]`,
      explanation:
        'zip_longest iterates to the LONGEST iterable, padding shorter ones with fillvalue. Without fillvalue, missing slots default to None.',
      hints: ['zip_longest pads to longest; default fill is None.'],
      tags: ['itertools', 'zip_longest'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from itertools import accumulate
print(list(accumulate([1, 2, 3, 4])))`,
      expectedOutput: `[1, 3, 6, 10]`,
      explanation:
        'accumulate yields running totals: [1, 1+2, 1+2+3, 1+2+3+4]. Default operation is addition; pass a different 2-arg function for max/min/multiplication etc.',
      hints: ['Running totals; cumulative sum.'],
      tags: ['itertools', 'accumulate'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from itertools import accumulate
print(list(accumulate([3, 1, 4, 1, 5, 9, 2, 6], max)))`,
      expectedOutput: `[3, 3, 4, 4, 5, 9, 9, 9]`,
      explanation:
        'accumulate with max yields running MAXIMUMS — at each step, the largest seen so far. Useful for "high-water mark" computations.',
      hints: ['Running max; the running value never decreases.'],
      tags: ['itertools', 'accumulate', 'max'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from itertools import takewhile
print(list(takewhile(lambda n: n < 5, [1, 3, 5, 7, 2, 1])))`,
      expectedOutput: `[1, 3]`,
      explanation:
        'takewhile keeps a PREFIX while the predicate is true. Stops at 5 (first false), and never returns to the later 2 and 1. filter would keep all <5.',
      hints: ['takewhile stops at the first false; later passing items are skipped.'],
      tags: ['itertools', 'takewhile'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from itertools import dropwhile
print(list(dropwhile(lambda n: n < 5, [1, 3, 5, 7, 2, 1])))`,
      expectedOutput: `[5, 7, 2, 1]`,
      explanation:
        'dropwhile is the inverse of takewhile — DROPS the prefix while predicate is true, then keeps EVERYTHING else (even later items that would fail the predicate). So it drops 1, 3, then keeps 5, 7, 2, 1.',
      hints: ['dropwhile drops the prefix only; later items pass through unchanged.'],
      tags: ['itertools', 'dropwhile'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from itertools import combinations
print(list(combinations("ABCD", 2)))`,
      expectedOutput: `[('A', 'B'), ('A', 'C'), ('A', 'D'), ('B', 'C'), ('B', 'D'), ('C', 'D')]`,
      explanation:
        'combinations yields UNORDERED subsets without replacement. C(4, 2) = 6 pairs. permutations would give 12 (ordered); product(repeat=2) would give 16 (ordered with replacement).',
      hints: ['Unordered, no repetition. C(4,2) = 6.'],
      tags: ['itertools', 'combinations'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from itertools import islice, count
print(list(islice(count(10, 2), 5)))`,
      expectedOutput: `[10, 12, 14, 16, 18]`,
      explanation:
        'count(10, 2) is an infinite iterator: 10, 12, 14, ... (start=10, step=2). islice takes the first 5. Without islice, count() would never terminate.',
      hints: ['count(start, step). islice takes a prefix.'],
      tags: ['itertools', 'count', 'islice'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-itertools-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from itertools import product
print(len(list(product([1, 2, 3], repeat=3))))`,
      expectedOutput: `27`,
      explanation:
        'product([1, 2, 3], repeat=3) is the 3-fold Cartesian product of {1, 2, 3} with itself: 3³ = 27 tuples. Each is a 3-tuple drawing from {1, 2, 3} with replacement.',
      hints: ['n^k where n is the iterable size and k is the repeat.'],
      tags: ['itertools', 'product'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-adv-iter-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write two helpers that process iterators efficiently without reading everything into memory upfront.\n\n(1) `merge_sorted_streams` — takes any number of already-SORTED integer lists (via `*streams`) and returns a single sorted list containing all elements merged. The merge must be efficient even when each stream is large — do NOT concatenate-then-sort; use the `heapq` stdlib helper that merges pre-sorted iterables lazily. Example input `[1, 4, 7], [2, 5, 8], [3, 6, 9]` → `[1, 2, 3, 4, 5, 6, 7, 8, 9]`.\n\n(2) `batch_process` — a generator taking an arbitrary iterable and an integer `batch_size`, yielding successive LISTS of up to `batch_size` consecutive items. The final batch may be shorter when input length isn\'t a multiple of `batch_size`; do NOT yield an empty trailing batch. Implementation must not materialise the full input — work on any iterator, one batch at a time (hint: `itertools.islice` on an iterator advances it). Example input `(range(10), 3)` → `[[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]`.',
      starterCode: `import itertools
import heapq
`,
      testCases: [
        {
          input: 'merge_sorted_streams([1,4,7],[2,5,8],[3,6,9])',
          expectedOutput: '[1, 2, 3, 4, 5, 6, 7, 8, 9]',
          description: 'Should merge sorted streams and batch process',
        },
      ],
      solution: `import itertools
import heapq

def merge_sorted_streams(*streams: list[int]) -> list[int]:
    """Merge multiple sorted lists into one sorted list."""
    return list(heapq.merge(*streams))

def batch_process(iterable, batch_size: int):
    """Yield successive batches from an iterable."""
    it = iter(iterable)
    while True:
        batch = list(itertools.islice(it, batch_size))
        if not batch:
            break
        yield batch
`,
      explanation: 'heapq.merge efficiently merges multiple sorted iterables using a heap, producing sorted output in O(n log k) time where k is the number of streams — without loading everything into memory. itertools.islice(iterator, n) lazily takes the next n elements from an iterator, making it perfect for batching. The key insight is that islice advances the iterator, so the next call picks up where the last left off. This batching pattern is essential for processing large datasets in chunks.',
      hints: [
        'heapq.merge(*iterables) for sorted merge',
        'itertools.islice(iter, n) takes next n items lazily',
        'Convert iterable to iterator with iter() so islice advances it',
      ],
      tags: ['itertools', 'heapq', 'merge', 'islice', 'batching'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-adv-iter-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write two helpers that use `itertools`.\n\n(1) `generate_test_combinations` takes three string lists — `browsers`, `operating_systems`, `resolutions` — and returns the full CARTESIAN PRODUCT as a list of 3-tuples. Example inputs `["chrome"], ["win","mac"], ["1080p"]` → `[("chrome","win","1080p"), ("chrome","mac","1080p")]`.\n\n(2) `unique_pairs` takes a list of names and returns all UNORDERED 2-element selections as a list of pairs. Example input `["Alice","Bob","Charlie"]` → `[("Alice","Bob"), ("Alice","Charlie"), ("Bob","Charlie")]`.',
      starterCode: `from itertools import product, combinations
  `,
      testCases: [
        {
          input: 'browsers=["chrome","firefox"], os=["win","mac"], res=["1080p","4k"]',
          expectedOutput: '8 test combinations, unique_pairs generates n*(n-1)/2 pairs',
          description: 'Should generate cartesian product and combinations',
        },
      ],
      solution: `from itertools import product, combinations

def generate_test_combinations(
    browsers: list[str],
    operating_systems: list[str],
    resolutions: list[str]
) -> list[tuple[str, str, str]]:
    """Generate all test case combinations."""
    return list(product(browsers, operating_systems, resolutions))

def unique_pairs(names: list[str]) -> list[tuple[str, str]]:
    """Generate all unique 2-person pairings."""
    return list(combinations(names, 2))
`,
      explanation: 'itertools.product computes the cartesian product — every possible combination of one element from each iterable. For 2 browsers x 2 OSes x 2 resolutions = 8 test cases. This is equivalent to nested for loops but more concise and functional. itertools.combinations(iterable, r) generates all unique r-length subsequences without repetition and without regard to order (so ("Alice","Bob") appears but not ("Bob","Alice")). Use permutations when order matters, combinations when it doesn\'t.',
      hints: [
        'product(A, B, C) = all (a, b, c) tuples',
        'combinations(items, 2) = all unique pairs',
        'len(product) = len(A) * len(B) * len(C)',
      ],
      tags: ['itertools', 'product', 'combinations', 'testing'],
      concepts: ['py-itertools-combinators', 'py-test-isolation'],
    },
  {
      id: 'py-adv-iter-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      question: 'What is the difference between `itertools.combinations("ABCD", 2)` and `itertools.permutations("ABCD", 2)`?',
      options: [
        { id: 'a', text: 'They produce identical output — both generate all 2-element subsets', isCorrect: false },
        { id: 'b', text: 'combinations allows repeated elements (AA, BB); permutations does not', isCorrect: false },
        { id: 'c', text: 'combinations produces 6 unordered pairs (AB, AC, AD, BC, BD, CD); permutations produces 12 ordered pairs (AB, BA, AC, CA, ...)', isCorrect: true },
        { id: 'd', text: 'permutations is lazy but combinations loads all results into memory', isCorrect: false },
      ],
      explanation: 'combinations treats items as a set — order doesn\'t matter, so (A,B) and (B,A) are the same pair, yielding C(n,r) = n!/(r!(n-r)!) results. permutations treats order as significant — (A,B) and (B,A) are different, yielding P(n,r) = n!/(n-r)! results. For "ABCD" with r=2: combinations gives 6 pairs, permutations gives 12. Use combinations_with_replacement if you also want (A,A), (B,B), etc. All three are lazy iterators that generate results on demand.',
      hints: [
        'combinations: order does NOT matter',
        'permutations: order DOES matter',
        'Both are lazy iterators',
      ],
      tags: ['itertools', 'combinations', 'permutations', 'combinatorics'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-iter-what',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      question: 'What is the `itertools` module?',
      options: [
        { id: 'a', text: 'A deprecated module replaced by comprehensions', isCorrect: false },
        { id: 'b', text: 'A stdlib module of fast, memory-efficient iterator building blocks — `chain`, `cycle`, `count`, `islice`, `groupby`, `product`, `permutations`, `combinations`, `accumulate`, `takewhile`, `dropwhile`, `tee`, `starmap`, `pairwise`. They compose and are lazy (generators) so you can compose pipelines over huge inputs.', isCorrect: true },
        { id: 'c', text: 'Tools for testing iterators', isCorrect: false },
        { id: 'd', text: 'A third-party data-science package', isCorrect: false },
      ],
      explanation: 'itertools is the "lego bricks" for iteration. Every function returns an iterator (lazy), so chains stay O(1) memory. Typical uses: `chain(a, b, c)` to concatenate, `islice(infinite, 10)` to take 10 from an infinite stream, `groupby(sorted_items, key=f)` for runs of same-key items, `combinations(items, 2)` for pair-ups. Read the docs examples — they are a masterclass.',
      hints: [
        'All functions return lazy iterators',
        'Read the `itertools` docs recipes — they are canonical patterns',
        'Pairs perfectly with generators and comprehensions',
      ],
      tags: ['itertools', 'stdlib', 'overview'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-iter-groupby',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `s = "aaabbcccdab"`, compute run-length encoding using the `itertools` helper that yields `(key, group_iterator)` pairs for each RUN of CONSECUTIVE identical items. For each run, collect a `(character, count)` pair and print the full list (expect `[(\'a\', 3), (\'b\', 2), (\'c\', 3), (\'d\', 1), (\'a\', 1), (\'b\', 1)]`). IMPORTANT: the helper only groups CONSECUTIVE matches — later runs of `a` and `b` stay separate from earlier ones. Each group is a single-use iterator — materialise before moving on.',
      starterCode: `from itertools import groupby
  `,
      testCases: [
        {
          input: 'groupby run-length encoding',
          expectedOutput: "[('a', 3), ('b', 2), ('c', 3), ('d', 1), ('a', 1), ('b', 1)]",
          description: 'groupby collapses CONSECUTIVE duplicates',
        },
      ],
      solution: `from itertools import groupby

s = "aaabbcccdab"
results = [(k, len(list(g))) for k, g in groupby(s)]
print(results)`,
      explanation: '`groupby` yields `(key, group_iterator)` — and note the key word: CONSECUTIVE. Last two `("a", 1), ("b", 1)` didn\'t merge with earlier `a` and `b` runs because they\'re separated by a `d`. For global grouping: `sorted(items, key=f)` first, then `groupby(sorted_items, key=f)`. Each group is a ONE-SHOT iterator — materialise to list before moving on or you\'ll lose it.',
      hints: [
        'groupby groups CONSECUTIVE equal keys',
        'Sort first for global grouping',
        'Group iterator is single-use — list(g) or you lose it',
      ],
      tags: ['itertools', 'groupby', 'run-length'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-iter-takewhile-dropwhile',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `nums = [1, 2, 3, 10, 2, 1]`, split the sequence at the first element that fails the predicate `x < 5`. First use the `itertools` helper that keeps elements WHILE the predicate holds (stops at the first failure and yields nothing further) and print the materialised list (expect `[1, 2, 3]`). Then use its sibling that DISCARDS elements while the predicate holds and then keeps everything once the predicate first fails — print that list too (expect `[10, 2, 1]`). Note these are DIFFERENT from `filter`, which tests every element independently.',
      starterCode: `from itertools import takewhile, dropwhile
  `,
      testCases: [
        {
          input: 'takewhile + dropwhile',
          expectedOutput: '[1, 2, 3]\n[10, 2, 1]',
          description: 'Both stop/start at the FIRST boundary crossing',
        },
      ],
      solution: `from itertools import takewhile, dropwhile

nums = [1, 2, 3, 10, 2, 1]
print(list(takewhile(lambda x: x < 5, nums)))
print(list(dropwhile(lambda x: x < 5, nums)))`,
      explanation: 'Different from `filter`: `filter(pred, nums)` keeps EVERY element matching the predicate. `takewhile(pred, nums)` stops at the first FAILURE; `dropwhile(pred, nums)` discards until the first failure, then keeps EVERYTHING. Useful for skipping headers, taking prefixes of sorted data, early-stopping scans.',
      hints: [
        'takewhile stops at first FAIL',
        'dropwhile keeps everything from first FAIL onward',
        'Different from filter which is element-by-element',
      ],
      tags: ['itertools', 'takewhile', 'dropwhile'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-iter-starmap',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `pairs = [(2, 3), (4, 5), (6, 7)]` — an iterable of pre-zipped argument tuples — apply multiplication to each pair using the `itertools` helper that UNPACKS each item as positional args to the callable (the `*`-prefixed cousin of `map`). Materialise the result to a list and print (expect `[6, 20, 42]`).',
      starterCode: `from itertools import starmap
  `,
      testCases: [
        {
          input: 'starmap over pre-zipped tuples',
          expectedOutput: '[6, 20, 42]',
          description: 'starmap unpacks each tuple as positional args',
        },
      ],
      solution: `from itertools import starmap

pairs = [(2, 3), (4, 5), (6, 7)]
print(list(starmap(lambda a, b: a * b, pairs)))`,
      explanation: '`map(fn, iter)` passes ONE arg at a time. `starmap(fn, iter)` UNPACKS each item as positional args. Use when your iterable is already pairs/tuples and you want to call a multi-arg function. Equivalent to `[fn(*t) for t in iter]` but lazy. `map(pow, [2,3], [8,4])` vs `starmap(pow, [(2,8), (3,4)])` — different shapes, same outcome.',
      hints: [
        'map(fn, iter) — one arg at a time',
        'starmap(fn, iter) — unpacks each item as positional args',
        'Lazy; materialise with list()',
      ],
      tags: ['itertools', 'starmap', 'unpack'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-iter-pairwise',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `timestamps = [10, 13, 20, 22, 30]`, compute the gaps between consecutive elements using the `itertools` helper (3.10+) that yields overlapping 2-windows `(x[0], x[1])`, `(x[1], x[2])`, ... — the classic sliding-window-of-size-2. Build a list `gaps` of `b - a` for each such `(a, b)` pair and print it (expect `[3, 7, 2, 8]`).',
      starterCode: `from itertools import pairwise
  `,
      testCases: [
        {
          input: 'pairwise window of size 2',
          expectedOutput: '[3, 7, 2, 8]',
          description: 'pairwise yields (x[i], x[i+1]) for every i',
        },
      ],
      solution: `from itertools import pairwise

timestamps = [10, 13, 20, 22, 30]
gaps = [b - a for a, b in pairwise(timestamps)]
print(gaps)`,
      explanation: '`pairwise(iter)` (3.10+) yields overlapping pairs `(s[0], s[1])`, `(s[1], s[2])`, ... — the classic "sliding window of size 2". Before 3.10 the recipe is `zip(it, it[1:])` for sequences or `tee(it); next(b, None)` for iterators. Used for diffs, monotonicity checks, graph edge lists from a path.',
      hints: [
        'pairwise is 3.10+; use zip(it, it[1:]) on older Pythons',
        'Yields overlapping 2-windows: (x0,x1), (x1,x2), ...',
        'Great for diffs, trend detection, path → edges',
      ],
      tags: ['itertools', 'pairwise', 'sliding-window'],
      concepts: ['py-itertools-combinators'],
    },
  {
      id: 'py-iter-int-product-islice',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ITERTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Cap an otherwise enormous search space at the first few candidates by composing two `itertools` helpers: one that lazily enumerates the cartesian product of `range(10)` with itself three times (1000 triples), and one that lazy-slices the first 5 from any iterator. Because both are lazy, composing them stays lazy — only the consumed portion is generated. Materialise the first 5 triples to a list and print (expect `[(0, 0, 0), (0, 0, 1), (0, 0, 2), (0, 0, 3), (0, 0, 4)]`). Nothing past the fifth triple should be computed.',
      starterCode: `from itertools import product, islice
  `,
      testCases: [
        {
          input: 'first 5 triples of product(range(10), repeat=3)',
          expectedOutput: '[(0, 0, 0), (0, 0, 1), (0, 0, 2), (0, 0, 3), (0, 0, 4)]',
          description: 'islice cuts off product before the full cartesian product is materialised',
        },
      ],
      solution: `from itertools import product, islice

first_five = list(islice(product(range(10), repeat=3), 5))
print(first_five)`,
      explanation:
        'Both `product` and `islice` return lazy iterators, so composing them stays lazy: only the consumed portion of the cartesian product is generated. This is the canonical pattern when the full product would explode — millions of combinations in a hyperparameter search, every pair of N items, every arrangement of a calendar — and you only want the first K. Same pattern works with any expensive generator source: `islice(permutations(...), 100)`, `islice(combinations(...), 50)`, etc.',
      hints: [
        'Both product and islice are lazy — composition stays lazy',
        'Nothing past the islice cutoff is ever computed',
        'Also works with permutations / combinations / any iterator',
      ],
      tags: ['itertools', 'product', 'islice', 'lazy', 'intermediate'],
      concepts: ['py-itertools-combinators'],
    },
];
