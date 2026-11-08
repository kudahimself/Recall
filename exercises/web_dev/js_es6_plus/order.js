/**
 * Orders: practise optional chaining, ??, .at(), rest and spread, and modules.
 *
 * Fill in each function, and money.js, so the tests in order.test.js pass.
 * Run them from this folder with: npm test
 * None of the functions may change the object or array they are given.
 */

// TODO: import formatPrice, money.js's default export, for receiptLine.

/**
 * The town to deliver an order to, or "Collect in shop" when the order, its customer
 * or the customer's address is missing.
 *
 * deliveryTown({ customer: { address: { town: "Hexham" } } }) -> "Hexham"
 * deliveryTown({ customer: {} }) -> "Collect in shop"
 */
export function deliveryTown(order) {
  // TODO
  throw new Error('TODO: deliveryTown');
}

/**
 * A line's quantity, 1 when it has none. A quantity of 0 stays 0.
 */
export function quantityOf(line) {
  // TODO
  throw new Error('TODO: quantityOf');
}

/**
 * The listing settings with defaults for the missing ones: pageSize 20, showSoldOut true, label "Books".
 * A setting given as 0, false or "" is kept. Called with nothing, it gives all three defaults.
 *
 * withDefaults({ pageSize: 0 }) -> { pageSize: 0, showSoldOut: true, label: "Books" }
 */
export function withDefaults(options) {
  // TODO
  throw new Error('TODO: withDefaults');
}

/**
 * The last order in the array, or undefined for none.
 */
export function latest(orders) {
  // TODO
  throw new Error('TODO: latest');
}

/**
 * The first line and the rest of them: { first, rest }.
 *
 * firstAndRest(["a", "b", "c"]) -> { first: "a", rest: ["b", "c"] }
 */
export function firstAndRest(lines) {
  // TODO
  throw new Error('TODO: firstAndRest');
}

/**
 * A copy of the order with one more line at the end of its lines.
 */
export function addLine(order, line) {
  // TODO
  throw new Error('TODO: addLine');
}

/**
 * One line of a receipt: "<quantity> x <title>: <price times quantity, formatted>".
 *
 * receiptLine({ title: "Emma", pence: 350, quantity: 2 }) -> "2 x Emma: £7.00"
 */
export function receiptLine(line) {
  // TODO
  throw new Error('TODO: receiptLine');
}
