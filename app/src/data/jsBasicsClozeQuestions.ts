import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  CodeLanguage,
  Course,
} from '../types';

// Cloze (faded worked example) questions for JS basics — show mostly-correct
// code with a few key tokens replaced by inputs.
//
// Authoring rules (same as the Python set):
// - Use `___` (3 underscores) as the blank marker in `template`.
// - Each blank is the most pedagogically meaningful token (operator, keyword,
//   method name) — not boilerplate (variable names, literals).
// - 1–3 blanks per question.
// - Surrounding code must be self-evidently correct so focus stays on the
//   missing primitive.

export const jsBasicsClozeQuestions: Question[] = [
  {
    id: 'js-basics-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Fill in the declaration keyword for a value that will never be reassigned, and the strict-equality operator.',
    template: `___ MAX_RETRIES = 3;
if (attempts ___ MAX_RETRIES) {
  console.log("done");
}`,
    blanks: ['const', '==='],
    solution:
      'const MAX_RETRIES = 3;\nif (attempts === MAX_RETRIES) {\n  console.log("done");\n}',
    explanation:
      'const declares a binding that cannot be reassigned. === is strict equality (no coercion); prefer it over == in nearly all cases.',
    hints: ['One keyword for "never reassigned", one operator for "equal without coercion".'],
    tags: ['const', 'strict-equality'],
    concepts: ['js-var-let-const'],
  },
  {
    id: 'js-basics-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Fill in the arrow that connects parameters to body, and the keyword that sends the result back.',
    template: `function square(n) {
  ___ n * n;
}

const cube = (n) ___ n * n * n;`,
    blanks: ['return', '=>'],
    solution:
      'function square(n) {\n  return n * n;\n}\n\nconst cube = (n) => n * n * n;',
    explanation:
      'A `function` body needs an explicit `return` to send a value out — without it the function returns undefined. Arrow functions with a single expression auto-return that expression; the syntax separator is `=>` (fat arrow), not `->`.',
    hints: ['One keyword for the function body, one symbol for arrow-function syntax.'],
    tags: ['functions', 'arrow', 'return'],
    concepts: ['js-this-binding'],
  },
  {
    id: 'js-basics-cloze-3',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Fill in the string-literal flavour and the placeholder syntax that interpolates a variable.',
    template: `const name = "Alice";
console.log(___Hello, ___{name}!___);`,
    blanks: ['`', '$', '`'],
    solution:
      'const name = "Alice";\nconsole.log(`Hello, ${name}!`);',
    explanation:
      'Template literals are wrapped in backticks (`), not regular quotes. Inside, ${expression} interpolates a value. With regular quotes, ${name} would print literally.',
    hints: ['Backticks enable interpolation; the placeholder needs a $ prefix.'],
    tags: ['template-literal', 'string', 'interpolation'],
    concepts: ['js-var-let-const'],
  },
  {
    id: 'js-basics-cloze-4',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Fill in the array methods: one to keep elements that pass a test, then one to transform what survives.',
    template: `const nums = [1, 2, 3, 4, 5, 6];
const result = nums.___((n) => n % 2 === 0).___((n) => n * 10);
console.log(result);`,
    blanks: ['filter', 'map'],
    solution:
      'const nums = [1, 2, 3, 4, 5, 6];\nconst result = nums.filter((n) => n % 2 === 0).map((n) => n * 10);\nconsole.log(result);',
    explanation:
      '.filter keeps elements where the callback returns truthy. .map transforms each element through the callback. Chaining works because both return new arrays. Order matters for performance — filter first to reduce work for map.',
    hints: ['One method for "keep matching", one for "transform each".'],
    tags: ['array', 'filter', 'map'],
    concepts: ['js-array-methods'],
  },
  {
    id: 'js-basics-cloze-5',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Fill in the spread operator that copies an object and the operator that adds a new key while overriding one existing key.',
    template: `const defaults = { theme: "dark", lang: "en" };
const user = { ___defaults, lang: "fr", fontSize: 14 };
console.log(user);`,
    blanks: ['...'],
    solution:
      'const defaults = { theme: "dark", lang: "en" };\nconst user = { ...defaults, lang: "fr", fontSize: 14 };\nconsole.log(user);',
    explanation:
      'The spread operator (...) copies the source object\'s properties into the new one. Properties listed AFTER the spread override matching keys from the source — so `lang: "fr"` wins over `lang: "en"`. New keys (fontSize) are simply added.',
    hints: ['Three dots before the source-object name.'],
    tags: ['spread', 'objects', 'override'],
    concepts: ['js-spread-destructuring', 'js-object-mutation'],
  },
  {
    id: 'js-basics-cloze-6',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Fill in the brackets used to destructure each side correctly: an OBJECT into named bindings, then an ARRAY into positional bindings.',
    template: `const user = { name: "Ada", age: 36 };
const ___ name, age ___ = user;

const colors = ["red", "green", "blue"];
const ___ first, second ___ = colors;`,
    blanks: ['{', '}', '[', ']'],
    solution:
      'const user = { name: "Ada", age: 36 };\nconst { name, age } = user;\n\nconst colors = ["red", "green", "blue"];\nconst [first, second] = colors;',
    explanation:
      'Object destructuring uses `{ }` and matches by key name. Array destructuring uses `[ ]` and matches by position. Mixing them up — `[name, age] = user` — would treat the object as iterable (TypeError) or assign undefined.',
    hints: ['Objects use one bracket type; arrays use the other.'],
    tags: ['destructuring', 'objects', 'arrays'],
    concepts: ['js-spread-destructuring', 'js-object-mutation', 'js-array-methods'],
  },
  {
    id: 'js-basics-cloze-7',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Fill in the operator that returns the right side ONLY when the left side is null or undefined (not on every falsy value).',
    template: `function getLimit(value) {
  return value ___ 100;
}

console.log(getLimit(0));
console.log(getLimit(null));`,
    blanks: ['??'],
    solution:
      'function getLimit(value) {\n  return value ?? 100;\n}\n\nconsole.log(getLimit(0));\nconsole.log(getLimit(null));',
    explanation:
      '?? (nullish coalescing) only triggers on null or undefined. Using || here would return 100 for getLimit(0) too, which is almost never the intent. Result: 0 from the first call, 100 from the second.',
    hints: ['?? for "missing value", || for "any falsy value".'],
    tags: ['nullish-coalescing', 'logical-or'],
    concepts: ['js-equality-coercion'],
  },
  {
    id: 'js-basics-cloze-8',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Fill in the DOM API that registers an event handler.',
    template: `const button = document.getElementById("save");
button.___("click", () => {
  console.log("Saved!");
});`,
    blanks: ['addEventListener'],
    solution:
      'const button = document.getElementById("save");\nbutton.addEventListener("click", () => {\n  console.log("Saved!");\n});',
    explanation:
      'addEventListener("event", handler) is the standard DOM API for registering listeners. The camelCase onClick is React-only — it does not exist on raw DOM nodes. The lowercase onclick property exists but allows only one handler per event.',
    hints: ['The standard DOM method takes the event name and a handler.'],
    tags: ['dom', 'event-listener'],
    concepts: ['js-dom-events'],
  },
  {
    id: 'js-basics-cloze-9',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Fill in the keywords that mark the function as a coroutine and pause it until each Promise settles.',
    template: `___ function fetchUser() {
  const response = ___ fetch("/api/user");
  const user = ___ response.json();
  return user;
}`,
    blanks: ['async', 'await', 'await'],
    solution:
      'async function fetchUser() {\n  const response = await fetch("/api/user");\n  const user = await response.json();\n  return user;\n}',
    explanation:
      'async marks the function as returning a Promise. Both fetch() and response.json() return Promises and need await to unwrap. Skipping await gives you the Promise object itself, not the resolved value.',
    hints: ['One keyword on the function, one before each Promise-returning call.'],
    tags: ['async', 'await', 'fetch'],
    concepts: ['js-promises-async'],
  },
  {
    id: 'js-basics-cloze-10',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Fill in the .reduce signature: the callback parameters and the initial accumulator value for summing.',
    template: `const nums = [1, 2, 3, 4];
const sum = nums.reduce((___, ___) => acc + n, ___);
console.log(sum);`,
    blanks: ['acc', 'n', '0'],
    solution:
      'const nums = [1, 2, 3, 4];\nconst sum = nums.reduce((acc, n) => acc + n, 0);\nconsole.log(sum);',
    explanation:
      'reduce((accumulator, currentValue) => newAccumulator, initialValue). The initial value (0) seeds the accumulator. Forgetting the initial value means the first element becomes the seed and the callback runs one fewer time — a classic source of "reduce of empty array with no initial value" errors.',
    hints: ['Two callback params (accumulator, current item) plus the seed value.'],
    tags: ['array', 'reduce'],
    concepts: ['js-array-methods'],
  },
  {
    id: 'js-basics-cloze-11',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Fill in the dot access for a static key and the bracket access for a dynamic key.',
    template: `const user = { name: "Ada", role: "admin" };
const field = "role";
console.log(user.___);
console.log(user[___]);`,
    blanks: ['name', 'field'],
    solution:
      'const user = { name: "Ada", role: "admin" };\nconst field = "role";\nconsole.log(user.name);\nconsole.log(user[field]);',
    explanation:
      'Dot access uses a literal property name (user.name). Bracket access evaluates the expression inside, so user[field] reads the property whose name is stored in field ("role"). user.field would instead look for a literal "field" property and return undefined.',
    hints: ['Dot for a known name, brackets for a name held in a variable.'],
    tags: ['objects', 'property-access'],
    concepts: ['js-object-mutation'],
  },
  {
    id: 'js-basics-cloze-12',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      "Fill in the method that selects by CSS selector, and the property that sets an element's text.",
    template: `const title = document.___(".title");
title.___ = "Updated";`,
    blanks: ['querySelector', 'textContent'],
    solution:
      'const title = document.querySelector(".title");\ntitle.textContent = "Updated";',
    explanation:
      'querySelector takes a CSS selector (".title" with the dot), unlike getElementById which takes a bare id. textContent sets the element\'s text safely; innerHTML would parse the string as HTML — an XSS risk for untrusted input.',
    hints: ['CSS-selector lookup, then the safe text-setting property.'],
    tags: ['dom', 'querySelector', 'textContent'],
    concepts: ['js-dom-events'],
  },
];
