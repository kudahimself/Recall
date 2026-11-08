# Stock lookups

Topic: Async/Await & Promises (Web Dev, JavaScript Fundamentals).
Time: about 25 minutes.

## Task

Write the shop's stock lookups in `stockLookups.js`.
Each lookup function is passed `fetchStock(title)`, the warehouse's lookup, which returns a Promise of the number of copies, or rejects with an Error when the title is not stocked.

- `wait(ms)` returns a Promise that is fulfilled after `ms` milliseconds; wrap `setTimeout` in `new Promise`.
- `bookTitle(url, fetchFn)` calls `fetchFn` (shaped like `fetch`) and returns the `title` from the response's JSON, throwing `Error("HTTP 404")` (with the real status) when the response is not ok.
- `stockLine(title, fetchStock)` returns `"Emma: 3 in stock"`, or `"Hamlet: unavailable (Hamlet is not stocked)"` with the error's message when the lookup rejects; it never rejects itself.
- `allStock(titles, fetchStock)` returns every count, in order, with all the lookups running at the same time, and rejects as soon as one does.
- `stockReport(titles, fetchStock)` runs all the lookups at once too, but waits for every one and reports each as `{ title, ok: true, stock }` or `{ title, ok: false, error }`.
- `firstInStock(titles, fetchStock)` looks titles up one at a time, in order, and returns the first with at least one copy, or `null`, without asking about the titles after it.

## Examples

With Emma 3, Dune 0, Piranesi 5 and Persuasion 2 in the warehouse, and no Hamlet:

```js
await stockLine("Hamlet", fetchStock)            // "Hamlet: unavailable (Hamlet is not stocked)"
await allStock(["Emma", "Dune"], fetchStock)     // [3, 0]
await stockReport(["Emma", "Hamlet"], fetchStock)
// [{ title: "Emma", ok: true, stock: 3 }, { title: "Hamlet", ok: false, error: "Hamlet is not stocked" }]
await firstInStock(["Dune", "Persuasion", "Emma"], fetchStock)  // "Persuasion", and Emma is never asked
```

The tests' fake warehouse counts how many lookups are in flight at once, so it can tell a loop of awaits from `Promise.all`.

Watch for the lesson's pitfall: a missing `await` does not fail where it is missing; the variable holds a pending Promise, and `response.json()` returns one too.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/js_async
npm test
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
