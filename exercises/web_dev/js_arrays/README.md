# Stockroom report

Topic: Arrays (map, filter, reduce, find) (Web Dev, JavaScript Fundamentals).
Time: about 20 minutes.

## Task

Write the stockroom's report functions in `stockReport.js`.
Each takes an array of books in the order they were added, shaped like this:

```js
{ isbn: "978-0141439587", title: "Emma", author: "Jane Austen", pence: 350, stock: 4 }
```

- `inStockTitles(books)` gives the titles of the books with stock above 0, in their order.
- `stockValue(books)` adds up each book's price times its stock, in pence, and is 0 for no books.
- `findByIsbn(books, isbn)` returns the book itself, or `undefined`.
- `cheapestFirst(books)` returns the books from cheapest to dearest.
- `withoutIsbn(books, isbn)` returns the books without that one.
- `latestAdded(books, count)` returns the last `count` books added, newest first.
- `copiesBy(books, author)` adds up the copies in stock of that author's books, and is 0 when there are none.

None of them may change the array they are given or its books: the shop's list is the truth, and a report only reads it.
Reach for `map`, `filter`, `find` and `reduce`, and for the methods that return a new array rather than those that change it in place.

## Examples

With the five books in `stockReport.test.js`:

```js
inStockTitles(books)          // ["Emma", "Dune", "Piranesi", "Persuasion"]
cheapestFirst(books)          // Emma, Persuasion, Piranesi, The Night Circus (999), Dune (1099)
latestAdded(books, 2)         // Persuasion, then Piranesi
copiesBy(books, "Jane Austen")  // 7: Emma 4 and Persuasion 3
```

Watch for the lesson's pitfall: `sort()` sorts in place and compares items as strings without a comparator, which puts 1099 before 999.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/js_arrays
npm test
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
