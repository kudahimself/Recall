/**
 * Stock lookups: practise Promises, async and await, try / catch,
 * Promise.all and Promise.allSettled, and waiting in turn.
 *
 * Fill in each function so the tests in stockLookups.test.js pass.
 * Run them from this folder with: npm test
 *
 * `fetchStock(title)` is the warehouse's lookup, passed in by the caller: it returns
 * a Promise of the number of copies, or rejects with an Error when the title is not stocked.
 */

/**
 * A Promise that is fulfilled (with undefined) after `ms` milliseconds.
 *
 * await wait(500)   // half a second later
 */
export function wait(ms) {
  // TODO
  throw new Error('TODO: wait');
}

/**
 * The title of the book a JSON endpoint describes, using `fetchFn` (shaped like fetch).
 * When the response is not ok, it throws an Error with the message "HTTP <status>".
 *
 * await bookTitle("/api/books/1", fetch) -> "Emma"
 */
export async function bookTitle(url, fetchFn) {
  // TODO
  throw new Error('TODO: bookTitle');
}

/**
 * One line of the stock report: "Emma: 3 in stock", or "Hamlet: unavailable (<the error's message>)"
 * when the lookup rejects. It never rejects itself.
 */
export async function stockLine(title, fetchStock) {
  // TODO
  throw new Error('TODO: stockLine');
}

/**
 * The stock of every title, in the same order, looked up all at once rather than one after another.
 * Rejects as soon as one lookup does.
 *
 * await allStock(["Emma", "Dune"], fetchStock) -> [3, 0]
 */
export async function allStock(titles, fetchStock) {
  // TODO
  throw new Error('TODO: allStock');
}

/**
 * Every lookup's outcome, all at once, waiting for all of them whatever happens:
 * { title, ok: true, stock } or { title, ok: false, error: <the error's message> } per title, in order.
 */
export async function stockReport(titles, fetchStock) {
  // TODO
  throw new Error('TODO: stockReport');
}

/**
 * The first title, in order, with at least one copy, or null when none has.
 * Looks titles up one at a time and stops at the first in stock, so later titles are never asked about.
 */
export async function firstInStock(titles, fetchStock) {
  // TODO
  throw new Error('TODO: firstInStock');
}
