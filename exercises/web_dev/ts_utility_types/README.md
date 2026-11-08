# Book records

Topic: Utility Types (Partial, Pick, Omit, Record) (Web Dev, TypeScript).
Time: about 20 minutes.

## Task

Name the shapes a book takes on its way through the shop in `bookRecords.ts`, each made from `Book` with a utility type so it stays in step when `Book` changes, then write the functions that use them.
`Book` and `Format` are written for you.

- `NewBook` is a book before it is shelved: every `Book` field but `stock` (`Omit`).
- `BookCard` is what a card in the window shows: only the `title` and the `price` (`Pick`).
- `BookPatch` is a change to a book: any of its fields but the `isbn`, each one optional (`Partial` of an `Omit`).
- `StockByFormat` holds the copies in each format, with every `Format` as a key (`Record`).
- `Shelved` is the type `shelve` returns, read off the function itself (`ReturnType<typeof shelve>`).

Then:

- `shelve(book)` takes a `NewBook` and returns a `Book` with a stock of 0, leaving the `NewBook` unchanged.
- `toCard(book)` returns a `BookCard`: a new object holding only the title and the price, whatever else the book holds.
- `applyPatch(book, patch)` returns a new `Book` with the patch's fields laid over it.
  A field the patch leaves out keeps its value, and so does one it sets to `undefined`, which `Partial` allows, so the result is a whole `Book`.
- `freeze(book)` returns a frozen copy (`Object.freeze`), typed `Readonly<Book>`, without freezing the book itself.
- `totalStock(stock)` takes a `StockByFormat` and adds up its copies.

## Examples

```ts
shelve({ isbn: "222", title: "Dune", price: 9 })   // { isbn: "222", title: "Dune", price: 9, stock: 0 }
toCard({ ...emma, supplier: "Penguin" })           // { title: "Emma", price: 8 }
applyPatch(emma, { price: 6 })                     // Emma at 6, the rest unchanged
applyPatch(emma, { price: undefined })             // Emma still at 8
applyPatch(emma, { isbn: "999" })                  // does not compile
const s: StockByFormat = { paperback: 3 };         // does not compile: two formats missing
```

The utility types only shape the type: none of them removes a property from an actual object, so `toCard` has to copy the two fields it keeps.

The tests run your functions, and they also hand the TypeScript compiler a few lines that use your types, through `typecheck.js`, with the strict settings VS Code uses.
A line under `// @ts-expect-error` must fail to compile, and its comment says what should be rejected.
`Equals<A, B>` in those lines is true only when the two types are exactly the same, and `Flat<T>` lists a type's fields as one object, so `Omit<Book, "stock">` compares equal to the object type it stands for.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/ts_utility_types
npm test
```

Every test fails until you fill in the types and the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
