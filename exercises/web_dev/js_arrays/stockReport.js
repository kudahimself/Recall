/**
 * Stockroom report: practise map, filter, find, reduce, slice and sorting
 * without changing the array you were given.
 *
 * Fill in each function so the tests in stockReport.test.js pass.
 * Run them from this folder with: npm test
 *
 * Every function takes an array of books shaped like
 *   { isbn: "978-0141439587", title: "Emma", author: "Jane Austen", pence: 350, stock: 4 }
 * in the order they were added, and must leave that array and its books as they were.
 */

/**
 * The titles of the books in stock (stock above 0), in their order.
 *
 * inStockTitles(books) -> ["Emma", "Dune", ...]
 */
export function inStockTitles(books) {
  // TODO
  throw new Error('TODO: inStockTitles');
}

/**
 * The value of the stock, in pence: each book's price times its stock, added up. 0 for no books.
 */
export function stockValue(books) {
  // TODO
  throw new Error('TODO: stockValue');
}

/**
 * The book with this isbn, or undefined when there is none.
 */
export function findByIsbn(books, isbn) {
  // TODO
  throw new Error('TODO: findByIsbn');
}

/**
 * The books from cheapest to dearest, as a new array; books of the same price keep their order.
 */
export function cheapestFirst(books) {
  // TODO
  throw new Error('TODO: cheapestFirst');
}

/**
 * The books without the one with this isbn, as a new array.
 */
export function withoutIsbn(books, isbn) {
  // TODO
  throw new Error('TODO: withoutIsbn');
}

/**
 * The last `count` books added, newest first, as a new array.
 *
 * latestAdded(books, 2) -> [the last book, the one before it]
 */
export function latestAdded(books, count) {
  // TODO
  throw new Error('TODO: latestAdded');
}

/**
 * How many copies of this author's books are in stock, added up. 0 when there are none.
 *
 * copiesBy(books, "Jane Austen") -> 7
 */
export function copiesBy(books, author) {
  // TODO
  throw new Error('TODO: copiesBy');
}
