/**
 * Book shapes: the catalogue's objects named with interfaces and type aliases.
 *
 * Fill in the types and the functions so the tests in bookShapes.test.ts pass.
 * Run them from this folder with: npm test
 * The tests also type-check this file with strict settings (tsconfig.json),
 * so type every parameter and return.
 */

/** TODO: an alias for the ISBN, a string. */
export type Isbn = unknown;

/**
 * TODO: a book has an isbn (an Isbn that cannot be changed once the book is
 * made), a title (a string), and may have pages (a number).
 */
export interface Book {}

/** TODO: an ebook is a Book, plus its size in megabytes, sizeMb (a number). */
export interface Ebook {}

/** TODO: how many copies are left of each book, keyed by any ISBN: an index signature. */
export interface Stock {}

/**
 * TODO: a shelf has a name (a string), its books (an array of Book), and a
 * method count() that returns a number.
 */
export interface Shelf {}

/**
 * The book's line on a stock card: its title, its pages ("?" when it has none)
 * and the copies left (0 when the stock has no entry for it).
 *
 * card(emma, { "111": 4 }) -> "Emma: 474 pages, 4 left"
 */
export function card(book, stock) {
  // TODO
  throw new Error('TODO: card');
}

/**
 * A new Stock with `copies` more of this ISBN; the stock passed in is not changed.
 */
export function restock(stock, isbn, copies) {
  // TODO
  throw new Error('TODO: restock');
}

/**
 * A plain Book copied from any book: its isbn, its title, and its pages when it
 * has them, and nothing else, so an ebook's sizeMb does not travel on.
 */
export function bookOnly(book) {
  // TODO
  throw new Error('TODO: bookOnly');
}

/**
 * A Shelf with this name and these books, whose count() is the number of books.
 */
export function makeShelf(name, books) {
  // TODO
  throw new Error('TODO: makeShelf');
}
