# Discounts

Topic: Functions (arrow, closures, higher-order) (Web Dev, JavaScript Fundamentals).
Time: about 20 minutes.

## Task

Write the till's pricing functions in `discounts.js`.
Prices are whole pence, so 999 is £9.99.

- `lateFee(days, perDay)` returns the fee for a book `days` late, with a default rate of 20p a day that a caller can pass instead.
- `toTag(book)` returns `{ id, label }`: the book's `isbn` and its title in capitals. Write it as an arrow function with an expression body.
- `percentOff(percent)` and `minus(amount)` each return a discount: a function that takes a price and returns the lower price, rounded to the penny for `percentOff` and never below 0 for `minus`.
- `applyAll(price, ...discounts)` applies any number of discounts in the order they are passed.
- `makeCounter(start)` returns a ticket machine, a function that returns the next number each time it is called, starting after `start` (0 if none is passed). Two machines count separately.
- `once(fn)` returns a wrapper that calls `fn` with its arguments the first time only and returns that first result on every later call.

## Examples

```js
lateFee(3)                                    // 60
lateFee(3, 50)                                // 150
toTag({ isbn: "978-0141439587", title: "Emma" })  // { id: "978-0141439587", label: "EMMA" }
percentOff(25)(999)                           // 749
applyAll(1000, percentOff(10), minus(200))    // 700
applyAll(1000, minus(200), percentOff(10))    // 720

const next = makeCounter();
next(); next();                               // 1, then 2

const welcome = once((name) => `Welcome, ${name}`);
welcome("Ann"); welcome("Bo");                // "Welcome, Ann" both times
```

Watch for the lesson's pitfall: an arrow with braces has a block body and returns `undefined` without a `return`, so wrap an object literal in parentheses to return it.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/js_functions
npm test
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
