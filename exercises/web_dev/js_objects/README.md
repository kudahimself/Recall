# Shop records

Topic: Objects & Spread (Web Dev, JavaScript Fundamentals).
Time: about 25 minutes.

## Task

Write the shop's record helpers and a basket class in `records.js`.
None of the functions may change the object they are given: each returns a new one.

- `describeBook(book, keys)` reads each key held in the `keys` array and returns `"key: value"` pairs joined by `", "`.
- `restocked(book, copies)` returns a copy of the book with `copies` more in stock.
- `movedShop(shop, town)` returns a copy of the shop whose address is in another town, the rest of the address kept, and the original shop still in its old town.
- `townOf(shop)` reads the shop's town with one nested destructuring pattern.
- `copyOrder(order)` returns a full copy of an order, nested objects and arrays included.
- `class Basket`:
  - `new Basket(owner)` keeps `owner` and starts `lines` as an empty array of its own;
  - `add(book, quantity)` adds `quantity` copies (1 by default) as a new line `{ isbn, title, pence, quantity }`, or raises the quantity of the book's line when it has one, and returns the basket so calls chain;
  - `count()` is the number of books in the basket and `total()` what they cost in pence.

## Examples

```js
describeBook(emma, ["title", "stock"])  // "title: Emma, stock: 4"
restocked(emma, 3).stock                // 7, and emma.stock is still 4
const moved = movedShop(shop, "Alnwick");
moved.address.town                      // "Alnwick"
shop.address.town                       // still "Hexham"

const basket = new Basket("Ann");
basket.add(emma, 2).add(dune).add(emma);
basket.count()                          // 4
basket.total()                          // 2149
```

Watch for the lesson's pitfall: spread makes a shallow copy, so `{ ...shop }` still shares its `address` with the original; spread that level too, or deep copy with `structuredClone`.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/js_objects
npm test
```

Every test fails until you fill in the functions and the class.
When they all pass, tick the exercise done in Recall under Progress, Topics.
