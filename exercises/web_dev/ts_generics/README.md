# Paged lists

Topic: Generics (Web Dev, TypeScript).
Time: about 25 minutes.

## Task

Write list helpers in `pagedLists.ts` that work for a list of anything and keep track of what it holds, using type parameters instead of `any`.

- `Page<T>` is a generic interface for one page of a list of `T`: `items`, the `T`s on this page, then `page` (its number, from 1), `total` (how many in the whole list) and `pages` (how many pages there are), all numbers.
- `Labelled<T>` is a generic interface whose `T` is `string` when it is not given: a `value`, a `T`, and a `label` string.
- `paginate(all, size, page)` returns page `page` (1 when it is left out) of `all`, `size` items to a page, as a `Page` of whatever `all` holds.
- `longest(items)` returns the longest of the items, the first of them on a tie, or `undefined` for none.
  It takes anything with a length, such as strings or arrays, so its type parameter needs a constraint: `T extends { length: number }`.
- `pluck(rows, key)` returns the value at `key` of every row, in order.
  The key must be one the rows have, `K extends keyof T`, and the result is an array of that key's type, `T[K][]`.
- `indexById(rows)` returns a `Map` from each row's id to the row, for any rows that have a numeric `id`.

## Examples

```ts
const books = [{ id: 7, title: "Emma", year: 1815 }, { id: 4, title: "Dune", year: 1965 }];
paginate(["a", "b", "c", "d", "e"], 2, 3)   // { items: ["e"], page: 3, total: 5, pages: 3 }
paginate(books, 1).items[0].title           // "Emma", and TypeScript knows it is a string
longest(["Emma", "Ulysses", "Beowulf"])     // "Ulysses"
longest([1, 2])                             // does not compile: numbers have no length
pluck(books, "year")                        // [1815, 1965], a number[]
pluck(books, "author")                      // does not compile
indexById(books).get(4)                     // the Dune row
```

The tests run your functions, and they also hand the TypeScript compiler a few lines that use them, through `typecheck.js`, with the strict settings VS Code uses.
A line under `// @ts-expect-error` must fail to compile, and its comment says what should be rejected.
`Equals<A, B>` in those lines is true only when the two types are exactly the same, so a result typed `any` fails where `number[]` was expected.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/ts_generics
npm test
```

Every test fails until you fill in the types and the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
