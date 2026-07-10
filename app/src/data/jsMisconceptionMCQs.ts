import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
} from '../types';

// JavaScript MCQs whose distractors encode documented student misconceptions
// (loose-equality coercion, hoisting, this-binding, mutation-vs-return, etc.).
// Tags must come from src/data/misconceptions.ts.
//
// Authoring rules (same as the Python set):
// - The CORRECT option has no tag.
// - Distractors should be *plausibly true under the misconception*, not "import banana".
// - One misconception per question is the cleanest signal; two is fine when they're
//   distinct named errors against the same primitive.

export const jsMisconceptionMCQs: Question[] = [
  {
    id: 'js-misc-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    question: 'What is the result of `0 == ""` in JavaScript?',
    options: [
      { id: 'a', text: 'true — both sides coerce to the same primitive (the number 0)', isCorrect: true },
      { id: 'b', text: 'false — 0 is a number and "" is a string, so they are different', isCorrect: false, misconceptionTag: 'js-equals-coercion' },
      { id: 'c', text: 'TypeError — you cannot compare a number to a string', isCorrect: false, misconceptionTag: 'js-equals-coercion' },
      { id: 'd', text: 'NaN', isCorrect: false },
    ],
    explanation:
      '`==` performs type coercion before comparing. The string "" is coerced to the number 0, so the comparison becomes `0 == 0` → true. This is exactly why most style guides ban `==`: use `===` (which would return false here without coercing).',
    tags: ['equality', 'coercion', 'fundamentals'],
    concepts: ['js-equality-coercion'],
  },
  {
    id: 'js-misc-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    question: 'What does this snippet log?\n\n```\nconsole.log(x);\nvar x = 5;\n```',
    options: [
      { id: 'a', text: 'undefined', isCorrect: true },
      { id: 'b', text: 'ReferenceError: x is not defined', isCorrect: false, misconceptionTag: 'js-var-hoisting' },
      { id: 'c', text: '5', isCorrect: false, misconceptionTag: 'js-var-hoisting' },
      { id: 'd', text: 'null', isCorrect: false },
    ],
    explanation:
      '`var` declarations are hoisted to the top of the enclosing function (or module) and initialised to `undefined` until the assignment line runs. So `console.log(x)` reads the hoisted-but-unassigned `x`. With `let` or `const`, the same code throws a ReferenceError (temporal dead zone).',
    tags: ['var', 'hoisting', 'fundamentals'],
    concepts: ['js-var-let-const'],
  },
  {
    id: 'js-misc-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    question: 'After this snippet runs, what is the value of `count` outside the if-block?\n\n```\nlet count = 1;\nif (true) {\n  let count = 99;\n}\nconsole.log(count);\n```',
    options: [
      { id: 'a', text: '1 — the inner `let count` is a separate block-scoped variable', isCorrect: true },
      { id: 'b', text: '99 — the inner declaration overwrites the outer one', isCorrect: false, misconceptionTag: 'js-let-vs-var-scope' },
      { id: 'c', text: 'undefined', isCorrect: false },
      { id: 'd', text: 'SyntaxError: count is already declared', isCorrect: false, misconceptionTag: 'js-let-vs-var-scope' },
    ],
    explanation:
      '`let` is block-scoped, so the `count` inside the `if` block is a brand-new variable that shadows the outer one only within that block. The outer `count` is unchanged. Replacing both `let`s with `var` would log 99, because `var` is function-scoped.',
    tags: ['let', 'scope', 'block-scoping'],
    concepts: ['js-var-let-const', 'js-closures'],
  },
  {
    id: 'js-misc-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    question: 'What does this snippet log?\n\n```\nconst user = {\n  name: "Ada",\n  greet() { return `Hi, ${this.name}`; }\n};\nconst fn = user.greet;\nconsole.log(fn());\n```',
    options: [
      { id: 'a', text: '"Hi, undefined" (or TypeError in strict mode) — the method was detached from `user`, losing its `this`', isCorrect: true },
      { id: 'b', text: '"Hi, Ada" — `this` was bound when the method was defined inside the object', isCorrect: false, misconceptionTag: 'js-this-binding' },
      { id: 'c', text: '"Hi, fn"', isCorrect: false },
      { id: 'd', text: 'ReferenceError', isCorrect: false },
    ],
    explanation:
      'In a regular function, `this` is determined by HOW the function is called, not where it was defined. `user.greet()` would set `this` to `user`, but `fn()` is a bare call — `this` becomes `undefined` (strict mode) or the global object (sloppy). Use `.bind(user)` or an arrow to preserve `this`.',
    tags: ['this', 'methods', 'binding'],
    concepts: ['js-this-binding'],
  },
  {
    id: 'js-misc-mcq-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    question: 'What does this class snippet log?\n\n```\nclass Counter {\n  constructor() { this.n = 0; }\n  tick = () => this.n++;\n}\nconst c = new Counter();\nconst t = c.tick;\nt(); t(); t();\nconsole.log(c.n);\n```',
    options: [
      { id: 'a', text: '3 — `tick` is an arrow property, so its `this` is permanently bound to the instance', isCorrect: true },
      { id: 'b', text: '0 — `this` was lost when `tick` was assigned to `t`', isCorrect: false, misconceptionTag: 'js-arrow-this' },
      { id: 'c', text: 'TypeError: cannot read property `n` of undefined', isCorrect: false, misconceptionTag: 'js-arrow-this' },
      { id: 'd', text: 'NaN', isCorrect: false },
    ],
    explanation:
      'Arrow functions don\'t have their own `this` — they inherit it from the enclosing lexical scope, which here is the constructor where `this` is the new instance. So `tick` always refers to that instance, even when detached. (This is the trick that makes class-property arrow methods auto-bind.)',
    tags: ['arrow', 'this', 'class', 'binding'],
    concepts: ['js-this-binding'],
  },
  {
    id: 'js-misc-mcq-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    question: 'What does this snippet log?\n\n```\nconst nums = [3, 1, 2];\nconst sorted = nums.sort();\nconsole.log(nums === sorted);\n```',
    options: [
      { id: 'a', text: 'true — `.sort()` mutates `nums` in place AND returns the same array', isCorrect: true },
      { id: 'b', text: 'false — `.sort()` returns a new sorted array, leaving `nums` untouched', isCorrect: false, misconceptionTag: 'js-array-mutation-return' },
      { id: 'c', text: 'TypeError', isCorrect: false },
      { id: 'd', text: 'undefined', isCorrect: false, misconceptionTag: 'js-array-mutation-return' },
    ],
    explanation:
      '`.sort()` and `.reverse()` are mutating methods — they sort/reverse the array in place AND return that same array. So `nums` and `sorted` are the same reference. Compare with `.map()`, `.filter()`, `.slice()`, `.toSorted()` (ES2023), which all return a new array.',
    tags: ['arrays', 'mutation', 'sort'],
    concepts: ['js-array-methods', 'js-object-mutation'],
  },
  {
    id: 'js-misc-mcq-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    question: 'What does this snippet log?\n\n```\nconst a = { x: 1 };\nconst b = a;\nb.x = 99;\nconsole.log(a.x);\n```',
    options: [
      { id: 'a', text: '99 — `b = a` copies the reference, so both names point to the same object', isCorrect: true },
      { id: 'b', text: '1 — `b = a` made an independent copy of the object', isCorrect: false, misconceptionTag: 'js-reference-vs-value' },
      { id: 'c', text: 'undefined', isCorrect: false },
      { id: 'd', text: 'TypeError: Cannot reassign const', isCorrect: false },
    ],
    explanation:
      'Object/array assignment copies the REFERENCE, not the contents. `a` and `b` are two names for the same object, so mutating through one is visible through the other. Use `{ ...a }` (shallow) or `structuredClone(a)` (deep) to actually copy.',
    tags: ['objects', 'reference', 'aliasing'],
    concepts: ['js-object-mutation'],
  },
  {
    id: 'js-misc-mcq-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    question: 'Which expression correctly tests whether `x` is the special value `NaN`?',
    options: [
      { id: 'a', text: 'Number.isNaN(x)', isCorrect: true },
      { id: 'b', text: 'x === NaN', isCorrect: false, misconceptionTag: 'js-nan-comparison' },
      { id: 'c', text: 'x == NaN', isCorrect: false, misconceptionTag: 'js-nan-comparison' },
      { id: 'd', text: 'typeof x === "NaN"', isCorrect: false },
    ],
    explanation:
      'NaN is the only JavaScript value not equal to itself — `NaN === NaN` is false, so direct comparison never matches. `Number.isNaN(x)` is the dedicated test. The legacy global `isNaN(x)` also works but coerces first (so `isNaN("hello")` is true).',
    tags: ['NaN', 'comparison', 'numbers'],
    concepts: ['js-equality-coercion'],
  },
  {
    id: 'js-misc-mcq-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    question: 'In a `if (...)` condition, which of these values evaluates as TRUTHY?',
    options: [
      { id: 'a', text: '[] (an empty array)', isCorrect: true },
      { id: 'b', text: '0', isCorrect: false },
      { id: 'c', text: '""', isCorrect: false },
      { id: 'd', text: 'null', isCorrect: false },
    ],
    explanation:
      'Unlike Python, empty arrays and empty objects are TRUTHY in JavaScript — `if ([]) { ... }` enters the block. To test "is this array empty?", use `arr.length === 0` (or `!arr.length`). The misconception that `[]` is falsy bites people coming from Python.',
    tags: ['truthy', 'falsy', 'arrays'],
    concepts: ['js-array-methods'],
  },
  {
    id: 'js-misc-mcq-10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    question: 'What does this snippet log?\n\n```\nasync function getValue() { return 42; }\nconsole.log(getValue());\n```',
    options: [
      { id: 'a', text: 'Promise { 42 } — async functions always return a Promise', isCorrect: true },
      { id: 'b', text: '42 — the function returns the resolved value directly', isCorrect: false, misconceptionTag: 'js-async-await-missing' },
      { id: 'c', text: 'undefined — the value isn\'t available until the function completes', isCorrect: false, misconceptionTag: 'js-async-await-missing' },
      { id: 'd', text: 'A SyntaxError because there is no `await` inside the body', isCorrect: false },
    ],
    explanation:
      'Every `async` function returns a Promise wrapping the return value. To get the underlying value, you must `await getValue()` (inside another async function) or chain `.then(v => ...)`. Logging the bare call gives you the Promise object, which is almost never what the author intended.',
    tags: ['async', 'await', 'promise'],
    concepts: ['js-promises-async'],
  },
];
