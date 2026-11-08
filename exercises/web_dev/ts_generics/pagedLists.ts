/**
 * Paged lists: helpers that work for a list of anything and keep track of what
 * it holds, written with generics.
 *
 * Fill in the types and the functions so the tests in pagedLists.test.ts pass.
 * Run them from this folder with: npm test
 * The tests also type-check this file with strict settings (tsconfig.json):
 * type every parameter and return, and use type parameters, not `any`.
 */

/**
 * TODO: a generic interface Page<T>: one page of a list of T, with
 * items (the T on this page), page (its number, from 1), total (how many in
 * the whole list) and pages (how many pages there are), all numbers but items.
 */
export interface Page {}

/**
 * TODO: a generic interface Labelled<T>, whose T is string when it is not
 * given: a value (a T) and a label (a string).
 */
export interface Labelled {}

/**
 * Page `page` (1 when not given) of `all`, `size` items to a page.
 * Generic: what it is given is what the page holds.
 *
 * paginate(["a", "b", "c", "d", "e"], 2, 3) -> { items: ["e"], page: 3, total: 5, pages: 3 }
 */
export function paginate(all, size, page) {
  // TODO
  throw new Error('TODO: paginate');
}

/**
 * The longest of the items, the first of them on a tie, or undefined for none.
 * Any items that have a length, such as strings or arrays: write a constraint.
 *
 * longest(["Emma", "Ulysses", "Beowulf"]) -> "Ulysses"
 */
export function longest(items) {
  // TODO
  throw new Error('TODO: longest');
}

/**
 * The value at `key` of every row, in order. The key must be one the rows
 * have (keyof), and the result is an array of that key's type.
 *
 * pluck(books, "year") -> [1815, 1965]
 */
export function pluck(rows, key) {
  // TODO
  throw new Error('TODO: pluck');
}

/**
 * A Map from each row's id to the row. Any rows that have a numeric id.
 *
 * indexById([{ id: 4, title: "Dune" }]).get(4) -> { id: 4, title: "Dune" }
 */
export function indexById(rows) {
  // TODO
  throw new Error('TODO: indexById');
}
