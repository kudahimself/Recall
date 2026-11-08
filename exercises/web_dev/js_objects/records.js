/**
 * Shop records: practise reading keys, copying with spread, nested updates,
 * nested destructuring, deep copies and a class.
 *
 * Fill in each function and the Basket class so the tests in records.test.js pass.
 * Run them from this folder with: npm test
 *
 * None of the functions may change the object they are given.
 */

/**
 * The values of the given keys of a book, as "key: value" pairs joined by ", ".
 *
 * describeBook({ title: "Emma", stock: 4, pence: 350 }, ["title", "stock"]) -> "title: Emma, stock: 4"
 */
export function describeBook(book, keys) {
  // TODO
  throw new Error('TODO: describeBook');
}

/**
 * A copy of the book with `copies` more in stock.
 *
 * restocked({ title: "Emma", stock: 4 }, 3) -> { title: "Emma", stock: 7 }
 */
export function restocked(book, copies) {
  // TODO
  throw new Error('TODO: restocked');
}

/**
 * A copy of the shop with its address in another town; the rest of the address stays.
 *
 * movedShop({ name: "Corner Books", address: { street: "12 Mill Street", town: "Hexham" } }, "Alnwick")
 *   -> { name: "Corner Books", address: { street: "12 Mill Street", town: "Alnwick" } }
 */
export function movedShop(shop, town) {
  // TODO
  throw new Error('TODO: movedShop');
}

/**
 * The shop's town, read with one nested destructuring pattern.
 */
export function townOf(shop) {
  // TODO
  throw new Error('TODO: townOf');
}

/**
 * A full copy of an order, nested lines and all, that can be changed without touching the original.
 */
export function copyOrder(order) {
  // TODO
  throw new Error('TODO: copyOrder');
}

/**
 * A customer's basket.
 *
 * const basket = new Basket("Ann");
 * basket.add({ isbn: "978-0141439587", title: "Emma", pence: 350 }, 2).add(dune);
 * basket.count() -> 3     basket.total() -> 1799
 */
export class Basket {
  /** Keeps the owner's name in `owner` and starts `lines` as an empty array of this basket's own. */
  constructor(owner) {
    // TODO
    throw new Error('TODO: Basket constructor');
  }

  /**
   * Adds `quantity` (1 by default) of a book: a new line { isbn, title, pence, quantity },
   * or a bigger quantity on the line the book already has. Returns the basket, so calls chain.
   */
  add(book, quantity) {
    // TODO
    throw new Error('TODO: Basket.add');
  }

  /** How many books are in the basket, all lines' quantities added up. */
  count() {
    // TODO
    throw new Error('TODO: Basket.count');
  }

  /** What the basket costs in pence: each line's price times its quantity, added up. */
  total() {
    // TODO
    throw new Error('TODO: Basket.total');
  }
}
