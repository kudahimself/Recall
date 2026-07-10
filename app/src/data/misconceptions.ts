// Registry of documented student misconceptions.
//
// Each entry is a stable tag (used in MultipleChoiceOption.misconceptionTag and
// in the localStorage event log) plus a short human-readable name and the
// underlying conceptual error. Sources: Caceffo et al. (SIGCSE 2016 concept
// inventory), Pea (1986), du Boulay's notional machine work, FCS1/SCS1.
//
// Authoring rule: only tag a distractor when the wrong answer corresponds to a
// SPECIFIC, NAMED misconception. Don't tag generic "obviously wrong" options —
// those are noise in the telemetry. Each tag should be diagnostic: when a
// learner picks this option, we know something specific is broken in their
// mental model.

export interface MisconceptionDef {
  // Stable tag used throughout the codebase. Convention: language-prefix-kebab.
  tag: string;
  // Short human-readable label (shown in UI).
  name: string;
  // One-sentence explanation of the underlying error.
  description: string;
  // Language scope (display only). null = generic.
  language?: 'python' | 'javascript' | 'sql' | 'general';
}

const ENTRIES: MisconceptionDef[] = [
  // ── Python ──
  {
    tag: 'py-assignment-vs-comparison',
    name: 'Assignment vs comparison',
    description: 'Using `=` (assignment) where `==` or `>=` (comparison) is needed. A single `=` does not test equality.',
    language: 'python',
  },
  {
    tag: 'py-off-by-one-range',
    name: 'Off-by-one in range()',
    description: '`range(n)` yields 0..n-1 (end-exclusive), not 0..n. The most common cause of one-too-many or one-too-few iterations.',
    language: 'python',
  },
  {
    tag: 'py-append-returns-none',
    name: 'list.append returns None',
    description: 'Mutating list methods (append, sort, reverse, extend) return None, not the modified list. Assigning their result overwrites the variable with None.',
    language: 'python',
  },
  {
    tag: 'py-list-aliasing',
    name: 'List aliasing on assignment',
    description: '`b = a` makes b point to the same list as a — it does not copy. Mutating through one name is visible through the other.',
    language: 'python',
  },
  {
    tag: 'py-string-immutable',
    name: 'String mutation',
    description: 'Strings are immutable. `s.upper()` returns a NEW string; it does not modify s in place.',
    language: 'python',
  },
  {
    tag: 'py-fstring-missing-prefix',
    name: 'Missing f-string prefix',
    description: 'Without the `f` prefix, `"Hello, {name}!"` is a literal string with braces — no interpolation happens.',
    language: 'python',
  },
  {
    tag: 'py-slice-end-inclusive',
    name: 'Slice end is exclusive',
    description: '`letters[1:3]` yields indices 1 and 2 — the end index is NOT included. Treating the end as inclusive is the most common slice mistake.',
    language: 'python',
  },
  {
    tag: 'py-dict-vs-set-literal',
    name: 'Dict vs set literal',
    description: '`{}` is an empty dict, not an empty set. `{1, 2, 3}` is a set; `{"a": 1}` is a dict. Tuples use `()`; lists use `[]`.',
    language: 'python',
  },
  {
    tag: 'py-bool-operators-symbols',
    name: 'Boolean operators as symbols',
    description: 'Python boolean operators are spelled out: `and`, `or`, `not`. The C/JS-style `&&`, `||`, `!` are not valid Python.',
    language: 'python',
  },
  {
    tag: 'py-mutable-default-arg',
    name: 'Mutable default arguments',
    description: 'Default argument values are evaluated ONCE at function definition. Using `def f(x=[])` shares the same list across all calls — the classic "growing default" gotcha.',
    language: 'python',
  },
  {
    tag: 'py-print-no-parens',
    name: 'print without parentheses',
    description: 'In Python 3, `print` is a function. `print "hi"` is a SyntaxError; you must call it with parentheses.',
    language: 'python',
  },
  {
    tag: 'py-int-vs-float-division',
    name: 'Integer vs float division',
    description: '`/` always returns a float in Python 3, even when both operands are ints. Use `//` for floor (integer) division.',
    language: 'python',
  },
  {
    tag: 'py-iteration-vs-range',
    name: 'Iterating with range when not needed',
    description: '`for x in [1,2,3]` iterates the list directly. Wrapping in `range(len(...))` to use indices is a code smell when you only need the values.',
    language: 'python',
  },
  {
    tag: 'py-return-vs-print',
    name: 'Return vs print',
    description: 'A function with no `return` statement implicitly returns None. `print` writes to stdout but does not produce a return value the caller can use.',
    language: 'python',
  },
  {
    tag: 'py-elif-vs-multiple-if',
    name: 'elif vs separate if',
    description: 'Multiple separate `if`s evaluate every branch. `if/elif/else` evaluates top-to-bottom and stops at the first true condition — different behavior when conditions overlap.',
    language: 'python',
  },

  // ── JavaScript ──
  {
    tag: 'js-equals-coercion',
    name: 'Loose equality coerces types',
    description: '`==` performs type coercion (`0 == ""` is true, `"1" == 1` is true). `===` compares without coercion and is what you almost always want.',
    language: 'javascript',
  },
  {
    tag: 'js-var-hoisting',
    name: 'var hoisting',
    description: '`var` declarations are hoisted to the top of their function scope and initialised to undefined. Reading a `var` before its assignment yields `undefined`, not a ReferenceError.',
    language: 'javascript',
  },
  {
    tag: 'js-let-vs-var-scope',
    name: 'var is function-scoped',
    description: '`var` is function-scoped (or global), so a `var` declared inside `{ }` leaks out. `let`/`const` are block-scoped — they exist only inside the nearest `{ }`.',
    language: 'javascript',
  },
  {
    tag: 'js-this-binding',
    name: 'this depends on call site',
    description: 'In non-arrow functions, `this` is determined by HOW the function is called (`obj.fn()` vs `fn()` vs `fn.call(...)`), not where it was defined. Detaching a method loses its `this`.',
    language: 'javascript',
  },
  {
    tag: 'js-arrow-this',
    name: 'Arrow functions inherit this',
    description: 'Arrow functions do NOT have their own `this` — they inherit it from the enclosing lexical scope. Defining a method as an arrow property captures the outer `this`, not the instance.',
    language: 'javascript',
  },
  {
    tag: 'js-array-mutation-return',
    name: 'Array method mutation vs return',
    description: '`.sort()`, `.reverse()`, `.splice()`, `.push()` mutate the original array. `.map()`, `.filter()`, `.slice()`, `.concat()` return a NEW array and leave the original untouched.',
    language: 'javascript',
  },
  {
    tag: 'js-typeof-null',
    name: 'typeof null is "object"',
    description: '`typeof null === "object"` is a historical JavaScript quirk. To check for null specifically, compare directly: `x === null`.',
    language: 'javascript',
  },
  {
    tag: 'js-nan-comparison',
    name: 'NaN is not equal to itself',
    description: '`NaN === NaN` is false. To detect NaN, use `Number.isNaN(x)` (preferred) or the loose global `isNaN` (which also coerces).',
    language: 'javascript',
  },
  {
    tag: 'js-empty-collections-truthy',
    name: 'Empty arrays/objects are truthy',
    description: 'Unlike Python, `[]` and `{}` are TRUTHY in JavaScript. `if ([])` runs the block. To test emptiness, use `arr.length === 0` or `Object.keys(obj).length === 0`.',
    language: 'javascript',
  },
  {
    tag: 'js-reference-vs-value',
    name: 'Object/array reference assignment',
    description: '`b = a` for objects/arrays makes b point to the SAME reference as a — mutating through one is visible through the other. Use spread (`{...a}`, `[...a]`) or `structuredClone` to copy.',
    language: 'javascript',
  },
  {
    tag: 'js-async-await-missing',
    name: 'Forgetting await on a Promise',
    description: 'Calling an async function without `await` returns a Promise, not the resolved value. Logging or comparing the Promise object directly almost never does what the author intended.',
    language: 'javascript',
  },

  // ── SQL ──
  {
    tag: 'sql-null-equals',
    name: 'NULL = NULL is NULL',
    description: 'In SQL three-valued logic, `NULL = NULL` evaluates to NULL (treated as not-true), so `WHERE col = NULL` matches nothing. Use `IS NULL` / `IS NOT NULL`.',
    language: 'sql',
  },
  {
    tag: 'sql-null-in-aggregate',
    name: 'COUNT(col) skips NULLs',
    description: '`COUNT(col)` counts only non-NULL values; `COUNT(*)` counts every row regardless. The two return different numbers whenever the column has NULLs.',
    language: 'sql',
  },
  {
    tag: 'sql-group-by-non-aggregated',
    name: 'Non-aggregated SELECT must appear in GROUP BY',
    description: 'Every column in the SELECT list that isn\'t inside an aggregate function must appear in GROUP BY. Many engines error; some (older MySQL) silently pick an arbitrary row.',
    language: 'sql',
  },
  {
    tag: 'sql-where-vs-having',
    name: 'WHERE filters rows, HAVING filters groups',
    description: 'WHERE applies before grouping and cannot reference aggregate functions. HAVING applies after grouping and is the only place an aggregate filter (e.g. `COUNT(*) > 5`) can live.',
    language: 'sql',
  },
  {
    tag: 'sql-inner-vs-left-join',
    name: 'INNER JOIN drops unmatched rows',
    description: 'INNER JOIN returns only rows with a match in both tables — left-side rows with no right-side match disappear. LEFT JOIN keeps every left-side row and fills missing right-side columns with NULL.',
    language: 'sql',
  },
  {
    tag: 'sql-update-without-where',
    name: 'UPDATE/DELETE without WHERE hits every row',
    description: 'An UPDATE or DELETE without a WHERE clause applies to every row in the table. Forgetting WHERE is one of the most destructive SQL mistakes.',
    language: 'sql',
  },
  {
    tag: 'sql-quotes-identifier-vs-string',
    name: 'Single vs double quotes',
    description: 'Single quotes delimit string literals (`\'foo\'`); double quotes (or backticks in MySQL) delimit identifiers. Quoting a column name with single quotes turns it into a string literal.',
    language: 'sql',
  },
];

// Lookup as a plain object keyed by tag, for O(1) display.
export const MISCONCEPTIONS: Record<string, MisconceptionDef> = Object.fromEntries(
  ENTRIES.map(e => [e.tag, e]),
);

// Type-safe set of valid tags. Catches typos in question authoring at runtime
// (the validator below) — TypeScript can't enforce this from a string literal.
export const VALID_MISCONCEPTION_TAGS: Set<string> = new Set(ENTRIES.map(e => e.tag));
