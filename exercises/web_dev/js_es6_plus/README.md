# Order module

Topic: ES6+ Features (Web Dev, JavaScript Fundamentals).
Time: about 20 minutes.

## Task

Write the shop's order helpers as two ES modules.

In `money.js`, write `formatPrice(pence)`, which shows pence as pounds with two digits of pence (`999` is `"£9.99"`), and make it the file's default export.

In `order.js`, fill in the named exports:

- `deliveryTown(order)` returns the customer's address's town, or `"Collect in shop"` when the order, its customer or the address is missing, without ever throwing.
- `quantityOf(line)` returns the line's quantity, or 1 when it has none, keeping a quantity of 0.
- `withDefaults(options)` returns `{ pageSize, showSoldOut, label }`, taking each from `options` and filling in 20, `true` and `"Books"` only for the missing ones; called with nothing, it gives all three defaults.
- `latest(orders)` returns the last order, or `undefined` for none.
- `firstAndRest(lines)` returns `{ first, rest }`: the first line and an array of the others.
- `addLine(order, line)` returns a copy of the order with the line added at the end of a new `lines` array.
- `receiptLine(line)` returns `"2 x Emma: £7.00"`: the quantity, the title, and the price times the quantity through `formatPrice`, imported from `money.js`.

Use `import` and `export`, not `require` and `module.exports`.

## Examples

```js
deliveryTown({ customer: {} })                     // "Collect in shop"
quantityOf({ quantity: 0 })                        // 0, not 1
withDefaults({ pageSize: 0, label: "" })           // { pageSize: 0, showSoldOut: true, label: "" }
latest([{ id: 1 }, { id: 2 }])                     // { id: 2 }
firstAndRest(["Emma", "Dune", "Piranesi"])         // { first: "Emma", rest: ["Dune", "Piranesi"] }
receiptLine({ title: "Dune", pence: 1099 })        // "1 x Dune: £10.99"
```

Watch for the lesson's pitfall: `||` replaces every falsy value, so `options.pageSize || 20` turns a real 0 into 20; use `??`.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/js_es6_plus
npm test
```

Every test fails until you fill in both files.
When they all pass, tick the exercise done in Recall under Progress, Topics.
