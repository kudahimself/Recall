# Price tags

Topic: Basic Types & Functions (Web Dev, TypeScript).
Time: about 20 minutes.

## Task

Write small functions for the bookshop's labels in `priceTags.ts`, typing every parameter and every return.

- `Format` is a type that allows `"paperback"`, `"hardback"` and `"ebook"`, and no other string.
- `price(base, format, discount?)` takes a number, a `Format` and an optional number, and returns a number: the base price for a paperback, £5 more for a hardback, £3 less for an ebook (never below 0), then less the discount when there is one.
- `pageCount(raw)` takes a value from outside, typed `unknown` and not `any`, and returns a number: a number is the count itself, a string goes through `Number()` (0 when it is not a number), and anything else counts as 0.
- `label(title, tags)` takes a string and an array of strings that defaults to `[]`, and returns the title, then the tags in brackets when there are some.
- `shelfCode(id)` takes a string or a number and returns a string: a number becomes `B` and its digits padded to at least three, and a string is trimmed and upper-cased.
- `fail(message)` takes a string and throws an `Error` with it; its return type says it never returns.

## Examples

```ts
price(12, "hardback")                      // 17
price(12, "ebook", 2)                      // 7
price(12, "audio")                         // does not compile
pageCount("320")                           // 320
label("Emma", ["classic", "romance"])      // "Emma [classic, romance]"
shelfCode(7)                               // "B007"
```

The tests run your functions, and they also hand the TypeScript compiler a few lines that use them, through `typecheck.js`, with the strict settings of `exercises/web_dev/tsconfig.json`, which are the ones VS Code shows you.
A line under `// @ts-expect-error` must fail to compile, so a type that lets `price(12, "audio")` through fails its test; the comment says what should be rejected.
Types are erased when the code runs, so only these checks can tell whether they are right.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/ts_basic_types
npm test
```

Every test fails until you fill in the types and the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
