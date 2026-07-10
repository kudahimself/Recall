import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  CodeLanguage,
  Course,
} from '../types';

// Predict-the-output questions for JS basics — show a snippet, the user types
// the exact output console.log would produce. Forces mental model use.
//
// Authoring rules (same as the Python set):
// - Snippets stay short (3–8 lines).
// - Each question targets ONE misconception (== coercion, hoisting, mutation,
//   reference assignment, scope, async return, falsy/truthy edge cases).
// - The expected output is whatever console.log would write.
// - Use `acceptableOutputs` only when there's real ambiguity.

export const jsBasicsPredictOutputQuestions: Question[] = [
  {
    id: 'js-basics-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `console.log(0 == "");
console.log(0 === "");`,
    expectedOutput: `true
false`,
    explanation:
      '`==` coerces both sides to the same primitive before comparing — "" becomes 0, so 0 == 0 is true. `===` checks without coercion, and a number is never equal to a string under strict equality.',
    hints: ['One operator coerces; the other does not.'],
    tags: ['equality', 'coercion'],
    concepts: ['js-equality-coercion'],
  },
  {
    id: 'js-basics-predict-2',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `console.log(x);
var x = 5;
console.log(x);`,
    expectedOutput: `undefined
5`,
    explanation:
      '`var` declarations are hoisted to the top of the enclosing function and initialised to `undefined` until the assignment line runs. So the first log reads the hoisted-but-unassigned `x`. Replacing both with `let` would throw a ReferenceError on the first log.',
    hints: ['var is hoisted, but the value isn\'t assigned until the line runs.'],
    tags: ['var', 'hoisting'],
    concepts: ['js-var-let-const'],
  },
  {
    id: 'js-basics-predict-3',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `const nums = [3, 1, 2];
const sorted = nums.sort();
console.log(nums === sorted);
console.log(nums);`,
    expectedOutput: `true
[ 1, 2, 3 ]`,
    acceptableOutputs: [`true\n[1, 2, 3]`, `true\n[1,2,3]`],
    explanation:
      '.sort() mutates in place AND returns the same array reference. So `nums` and `sorted` point to the same (now-sorted) array — the strict-equality check is true, and the original `nums` is sorted too. Compare with .toSorted() (ES2023) which returns a new array and leaves the original alone.',
    hints: ['Does .sort() return a new array, or the same one mutated?'],
    tags: ['array', 'sort', 'mutation'],
    concepts: ['js-array-methods', 'js-object-mutation'],
  },
  {
    id: 'js-basics-predict-4',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `const a = { x: 1 };
const b = a;
b.x = 99;
console.log(a.x);
console.log(b.x);`,
    expectedOutput: `99
99`,
    explanation:
      'Object/array assignment copies the REFERENCE, not the contents. `a` and `b` are two names for the same object — mutating through one is visible through the other. Use `{ ...a }` or `structuredClone(a)` to actually copy.',
    hints: ['Does `b = a` make a copy or alias the same object?'],
    tags: ['objects', 'reference', 'aliasing'],
    concepts: ['js-object-mutation'],
  },
  {
    id: 'js-basics-predict-5',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `console.log(typeof null);
console.log(typeof undefined);
console.log(null === undefined);`,
    expectedOutput: `object
undefined
false`,
    explanation:
      '`typeof null === "object"` is a historical JavaScript bug that was kept for backward compatibility. `typeof undefined` correctly returns "undefined". And under strict equality, null and undefined are NOT equal — though under loose equality (`==`), they are.',
    hints: ['One of these typeof results is famously wrong.'],
    tags: ['typeof', 'null', 'undefined'],
    concepts: ['ts-narrowing'],
  },
  {
    id: 'js-basics-predict-6',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `if ([]) console.log("array truthy");
if ({}) console.log("object truthy");
if ("0") console.log("string truthy");
if (0) console.log("zero truthy");`,
    expectedOutput: `array truthy
object truthy
string truthy`,
    explanation:
      'Empty arrays and empty objects are TRUTHY in JS — unlike Python, where they\'re falsy. The non-empty string "0" is truthy (it\'s a non-empty string), even though the number 0 is falsy. To test "is this array empty", use `arr.length === 0`.',
    hints: ['Which one of [], {}, "0" is the falsy one?'],
    tags: ['truthy', 'falsy'],
    concepts: ['js-equality-coercion'],
  },
  {
    id: 'js-basics-predict-7',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `async function getValue() {
  return 42;
}
console.log(getValue());`,
    expectedOutput: `Promise { 42 }`,
    acceptableOutputs: [`Promise {42}`, `Promise{42}`, `Promise { <fulfilled>: 42 }`],
    explanation:
      'Every async function returns a Promise wrapping its return value, even when the body has no `await`. To get 42, the caller must `await getValue()` (inside another async function) or chain `.then(v => ...)`.',
    hints: ['Does `async` change what the function returns?'],
    tags: ['async', 'promise'],
    concepts: ['js-promises-async'],
  },
  {
    id: 'js-basics-predict-8',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `const a = { x: 1, y: 2 };
const b = { ...a };
b.x = 99;
console.log(a.x);
console.log(b.x);`,
    expectedOutput: `1
99`,
    explanation:
      'Object spread `{ ...a }` creates a SHALLOW COPY — `b` is a fresh object, independent of `a` at the top level. Mutating b.x doesn\'t touch a.x. Compare with Q4 (no spread): `b = a` aliases, but `b = { ...a }` copies.',
    hints: ['Does `{ ...a }` copy or alias?'],
    tags: ['spread', 'copy', 'objects'],
    concepts: ['js-spread-destructuring', 'js-object-mutation'],
  },
  {
    id: 'js-basics-predict-9',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `const a = null;
const b = 0;
console.log(a ?? "default");
console.log(b ?? "default");
console.log(b || "default");`,
    expectedOutput: `default
0
default`,
    explanation:
      '`??` (nullish coalescing) only falls back when the left side is null OR undefined — so `0 ?? "default"` keeps the 0. `||` (logical OR) falls back on ANY falsy value, including 0 and "" — so `0 || "default"` returns "default". Use `??` for "missing value" defaults; `||` will misfire on legitimate zeros and empty strings.',
    hints: ['?? only triggers on null/undefined; || triggers on every falsy value.'],
    tags: ['nullish-coalescing', 'logical-or', 'default'],
    concepts: ['js-equality-coercion'],
  },
  {
    id: 'js-basics-predict-10',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `const nums = [1, 2, 3];
const doubled = nums.map((n) => n * 2);
console.log(nums);
console.log(doubled);`,
    expectedOutput: `[ 1, 2, 3 ]
[ 2, 4, 6 ]`,
    acceptableOutputs: [
      `[1, 2, 3]\n[2, 4, 6]`,
      `[1,2,3]\n[2,4,6]`,
    ],
    explanation:
      '.map returns a NEW array of transformed values; the original `nums` is untouched. Pair this with the .sort() question (Q3) — knowing which array methods mutate vs return a new array is the core skill.',
    hints: ['.map mutates the original or returns a new array?'],
    tags: ['array', 'map', 'immutable'],
    concepts: ['js-array-methods', 'js-object-mutation'],
  },
  {
    id: 'js-basics-predict-11',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `function greet(name = "world") {
  return "Hi, " + name;
}
console.log(greet());
console.log(greet("Sam"));`,
    expectedOutput: `Hi, world
Hi, Sam`,
    explanation:
      'A default parameter (name = "world") is used only when the argument is omitted or passed as undefined. greet() falls back to "world"; greet("Sam") supplies its own value, so the default is ignored.',
    hints: ['When does a default parameter actually apply?'],
    tags: ['functions', 'default-params'],
    concepts: ['js-this-binding'],
  },
];
