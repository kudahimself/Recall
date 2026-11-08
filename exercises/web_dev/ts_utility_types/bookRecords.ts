/**
 * Book records: the shapes a book takes on its way through the shop, each made
 * from Book with a utility type, so they stay in step when Book changes.
 *
 * Fill in the types and the functions so the tests in bookRecords.test.ts pass.
 * Run them from this folder with: npm test
 * The tests also type-check this file with strict settings (tsconfig.json),
 * so type every parameter and return.
 */

export interface Book {
  isbn: string;
  title: string;
  price: number;
  stock: number;
}

export type Format = 'paperback' | 'hardback' | 'ebook';

/** TODO: a book before it is shelved: every Book field but stock (Omit). */
export type NewBook = unknown;

/** TODO: what a card in the window shows: only the title and the price (Pick). */
export type BookCard = unknown;

/** TODO: a change to a book: any of its fields but the isbn, each one optional (Partial of Omit). */
export type BookPatch = unknown;

/** TODO: copies held in each format, with every Format as a key (Record). */
export type StockByFormat = unknown;

/** TODO: the type shelve returns, read off the function itself (ReturnType). */
export type Shelved = unknown;

/** A Book made from a NewBook, with a stock of 0; the NewBook is not changed. */
export function shelve(book) {
  // TODO
  throw new Error('TODO: shelve');
}

/** A BookCard: a new object with only the book's title and price, whatever else it holds. */
export function toCard(book) {
  // TODO
  throw new Error('TODO: toCard');
}

/**
 * A new Book with the patch's fields laid over it. A field the patch leaves out
 * keeps its value, and so does one the patch sets to undefined, so the result
 * is a whole Book. The book is not changed.
 */
export function applyPatch(book, patch) {
  // TODO
  throw new Error('TODO: applyPatch');
}

/** A frozen copy of the book (Object.freeze), typed Readonly<Book>; the book itself is not frozen. */
export function freeze(book) {
  // TODO
  throw new Error('TODO: freeze');
}

/** All the copies held, across the formats. */
export function totalStock(stock) {
  // TODO
  throw new Error('TODO: totalStock');
}
