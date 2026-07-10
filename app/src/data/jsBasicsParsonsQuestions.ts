import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  CodeLanguage,
  Course,
} from '../types';

// Parsons problems for JS basics — drag-the-line questions where the user
// reassembles a known-correct solution from shuffled lines.
//
// Authoring rules (same as the Python set):
// - One primitive per question, beginner tier.
// - One statement per line; never two statements joined by a semicolon.
// - Distractors encode documented misconceptions (== vs ===, var hoisting,
//   mutation-vs-return, missing await, etc.).
// - `solution` is the assembled answer shown on incorrect submission.

export const jsBasicsParsonsQuestions: Question[] = [
  {
    id: 'js-basics-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Declare a constant called age set to 30, then log it to the console.',
    correctOrder: ['const age = 30;', 'console.log(age);'],
    distractorLines: ['console.log("age");', 'const age == 30;'],
    solution: 'const age = 30;\nconsole.log(age);',
    explanation:
      'const declares a binding that cannot be reassigned. Logging the bare name prints the value; quoting it prints the literal string. `==` is comparison, never used in a declaration.',
    hints: ['Declare with `const ... =`, then log the variable name (no quotes).'],
    tags: ['variables', 'const', 'console'],
    concepts: ['js-var-let-const'],
  },
  {
    id: 'js-basics-parsons-2',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Build a greeting using a template literal. Set name to "Alice", then log "Hello, Alice!".',
    correctOrder: ['const name = "Alice";', 'console.log(`Hello, ${name}!`);'],
    distractorLines: [
      'console.log("Hello, ${name}!");',
      'console.log(`Hello, {name}!`);',
    ],
    solution: 'const name = "Alice";\nconsole.log(`Hello, ${name}!`);',
    explanation:
      'Template literals require backticks (not regular quotes) and use ${name} for interpolation. A regular "..." string treats ${name} as literal text. Curly braces alone (without the dollar sign) also print literally.',
    hints: ['Backticks enable interpolation; the placeholder is `${name}`.'],
    tags: ['template-literal', 'string', 'interpolation'],
    concepts: ['js-var-let-const'],
  },
  {
    id: 'js-basics-parsons-3',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Write an if/else that checks whether score is at least 60. Log "pass" if so, "fail" otherwise. Assume score is already declared.',
    correctOrder: [
      'if (score >= 60) {',
      '  console.log("pass");',
      '} else {',
      '  console.log("fail");',
      '}',
    ],
    distractorLines: [
      'if (score = 60) {',
      'if score >= 60:',
    ],
    solution:
      'if (score >= 60) {\n  console.log("pass");\n} else {\n  console.log("fail");\n}',
    explanation:
      'JS conditions go in parentheses and bodies in braces. A single `=` is assignment, not comparison — `if (score = 60)` would assign 60 to score and then test that as truthy. Python-style `if score >= 60:` is a syntax error in JS.',
    hints: ['Conditions in `(...)`, blocks in `{...}`. Compare with `>=`, not `=`.'],
    tags: ['conditional', 'comparison'],
    concepts: ['js-equality-coercion'],
  },
  {
    id: 'js-basics-parsons-4',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Define an arrow function called double that takes a number and returns it times two, then log double(5).',
    correctOrder: ['const double = (n) => n * 2;', 'console.log(double(5));'],
    distractorLines: [
      'const double = (n) -> n * 2;',
      'function double(n) => n * 2;',
    ],
    solution: 'const double = (n) => n * 2;\nconsole.log(double(5));',
    explanation:
      'Arrow syntax is `(params) => expression` — the fat arrow is `=>`, not `->`. The expression form auto-returns. The `function` keyword and `=>` cannot be combined.',
    hints: ['Fat-arrow syntax: `(params) => expression`.'],
    tags: ['arrow', 'functions'],
    concepts: ['js-this-binding'],
  },
  {
    id: 'js-basics-parsons-5',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Given const nums = [1, 2, 3], use map to build a new array of squares, store it in squares, and log squares.',
    correctOrder: [
      'const nums = [1, 2, 3];',
      'const squares = nums.map((n) => n * n);',
      'console.log(squares);',
    ],
    distractorLines: [
      'const squares = nums.forEach((n) => n * n);',
      'nums.map((n) => n * n);',
    ],
    solution:
      'const nums = [1, 2, 3];\nconst squares = nums.map((n) => n * n);\nconsole.log(squares);',
    explanation:
      '.map returns a new array of transformed values; .forEach returns undefined (it\'s for side-effects only). Calling .map without capturing the return value computes a new array and immediately discards it.',
    hints: ['.map returns the new array; .forEach returns undefined.'],
    tags: ['array', 'map'],
    concepts: ['js-array-methods'],
  },
  {
    id: 'js-basics-parsons-6',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Create an object literal user with name "Alice" and age 30, then log user.name.',
    correctOrder: [
      'const user = { name: "Alice", age: 30 };',
      'console.log(user.name);',
    ],
    distractorLines: [
      'const user = { name = "Alice", age = 30 };',
      'console.log(user["name"]);',
    ],
    solution:
      'const user = { name: "Alice", age: 30 };\nconsole.log(user.name);',
    explanation:
      'Object literals use `key: value` (colon, not equals). Both `user.name` and `user["name"]` work for access — the dropped distractor is included to highlight that they\'re equivalent, but the canonical form for static keys is dot notation.',
    hints: ['Object properties use `:` between key and value, not `=`.'],
    tags: ['objects', 'literal'],
    concepts: ['js-object-mutation'],
  },
  {
    id: 'js-basics-parsons-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Use destructuring to pull title and year out of book = { title: "Dune", year: 1965, author: "Herbert" }, then log title and year.',
    correctOrder: [
      'const book = { title: "Dune", year: 1965, author: "Herbert" };',
      'const { title, year } = book;',
      'console.log(title, year);',
    ],
    distractorLines: [
      'const [title, year] = book;',
      'const { title: t, year: y } = book;',
    ],
    solution:
      'const book = { title: "Dune", year: 1965, author: "Herbert" };\nconst { title, year } = book;\nconsole.log(title, year);',
    explanation:
      'Object destructuring uses `{ }` and matches by key name. Array destructuring uses `[ ]` and matches by position — applying it to an object would not work as intended. The colon-form `{ title: t }` renames the destructured binding to `t`, which the question didn\'t ask for.',
    hints: ['Object destructuring uses `{ }` and matches keys by name.'],
    tags: ['destructuring', 'objects'],
    concepts: ['js-spread-destructuring', 'js-object-mutation'],
  },
  {
    id: 'js-basics-parsons-8',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Merge two objects: defaults = { theme: "dark" } and overrides = { theme: "light", lang: "en" } into a single object called settings using spread, with overrides winning. Then log settings.',
    correctOrder: [
      'const defaults = { theme: "dark" };',
      'const overrides = { theme: "light", lang: "en" };',
      'const settings = { ...defaults, ...overrides };',
      'console.log(settings);',
    ],
    distractorLines: [
      'const settings = { ...overrides, ...defaults };',
      'const settings = defaults + overrides;',
    ],
    solution:
      'const defaults = { theme: "dark" };\nconst overrides = { theme: "light", lang: "en" };\nconst settings = { ...defaults, ...overrides };\nconsole.log(settings);',
    explanation:
      'Spread merges left-to-right: later keys overwrite earlier ones. With overrides spread last, its `theme: "light"` wins. The reversed order would give defaults priority. Objects can\'t be added with `+`.',
    hints: ['Whichever side is spread LAST wins on key collisions.'],
    tags: ['spread', 'objects', 'merge'],
    concepts: ['js-spread-destructuring', 'js-object-mutation'],
  },
  {
    id: 'js-basics-parsons-9',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Find the element with id "save" and attach a click listener that logs "Saved!".',
    correctOrder: [
      'const button = document.getElementById("save");',
      'button.addEventListener("click", () => {',
      '  console.log("Saved!");',
      '});',
    ],
    distractorLines: [
      'const button = document.getElementById("#save");',
      'button.onClick(() => {',
    ],
    solution:
      'const button = document.getElementById("save");\nbutton.addEventListener("click", () => {\n  console.log("Saved!");\n});',
    explanation:
      'getElementById takes the bare id ("save"), NOT a CSS selector ("#save") — that\'s querySelector\'s job. The DOM API uses addEventListener("click", fn), not the camelCase onClick which is a React-only convention.',
    hints: [
      '`getElementById` takes a plain id without "#". The handler is registered via `addEventListener`.',
    ],
    tags: ['dom', 'event-listener'],
    concepts: ['js-dom-events'],
  },
  {
    id: 'js-basics-parsons-10',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question:
      'Write an async function fetchUser that fetches "/api/user", parses the JSON body, and returns the parsed object.',
    correctOrder: [
      'async function fetchUser() {',
      '  const response = await fetch("/api/user");',
      '  const user = await response.json();',
      '  return user;',
      '}',
    ],
    distractorLines: [
      '  const response = fetch("/api/user");',
      '  const user = response.json();',
    ],
    solution:
      'async function fetchUser() {\n  const response = await fetch("/api/user");\n  const user = await response.json();\n  return user;\n}',
    explanation:
      'Both fetch() and response.json() return Promises and must be awaited. Skipping `await` yields the Promise object itself, not the resolved value — so `response.json` would be called on a Promise (TypeError) and `user` would be a Promise wrapping the parsed body.',
    hints: ['Both fetch and .json() are async — each one needs `await`.'],
    tags: ['async', 'await', 'fetch'],
    concepts: ['js-promises-async'],
  },
];
