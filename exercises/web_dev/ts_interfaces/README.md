# Book shapes

Topic: Interfaces & Type Aliases (Web Dev, TypeScript).
Time: about 20 minutes.

## Task

Name the shapes of the catalogue's objects in `bookShapes.ts`, then write four functions that use them.

- `Isbn` is a type alias for `string`.
- `Book` is an interface: an `isbn`, an `Isbn` that cannot be changed once the book is made (`readonly`), a `title` string, and `pages`, a number a book may not have.
- `Ebook` extends `Book` with `sizeMb`, a number.
- `Stock` holds how many copies are left of each book, keyed by any ISBN: an index signature, `[isbn: string]: number`.
- `Shelf` has a `name` string, its `books`, an array of `Book`, and a method `count()` that returns a number.

Then, typing every parameter and return with those names:

- `card(book, stock)` returns the book's line on a stock card: `Emma: 474 pages, 4 left`, with `?` for the pages when it has none and 0 when the stock has no entry for it.
- `restock(stock, isbn, copies)` returns a new `Stock` with that many more copies of the ISBN, leaving the old one as it was.
- `bookOnly(book)` returns a plain `Book` copied from any book: its isbn, its title, and its pages when it has them, and nothing else.
- `makeShelf(name, books)` returns a `Shelf` whose `count()` is the number of books.

## Examples

```ts
const emma: Book = { isbn: "111", title: "Emma", pages: 474 };
const dune: Ebook = { isbn: "222", title: "Dune", sizeMb: 2 };
card(emma, { "111": 4 })     // "Emma: 474 pages, 4 left"
card(dune, { "111": 4 })     // "Dune: ? pages, 0 left": an Ebook fits a Book parameter
bookOnly(dune)               // { isbn: "222", title: "Dune" }, without sizeMb
emma.isbn = "999"            // does not compile
```

TypeScript compares shapes, so an `Ebook` passed as a `Book` still carries its `sizeMb` at runtime; `bookOnly` has to pick the fields it keeps.

The tests run your functions, and they also hand the TypeScript compiler a few lines that use your types, through `typecheck.js`, with the strict settings VS Code uses.
A line under `// @ts-expect-error` must fail to compile, and its comment says what should be rejected.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/ts_interfaces
npm test
```

Every test fails until you fill in the types and the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
