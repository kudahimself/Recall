/**
 * Discounts: practise default parameters, arrow functions, callbacks,
 * functions that return functions (closures) and ...rest parameters.
 *
 * Fill in each function so the tests in discounts.test.js pass.
 * Run them from this folder with: npm test
 * Prices are whole pence: 999 is £9.99.
 */

/**
 * The fee in pence for a book returned `days` late; `perDay` defaults to 20.
 *
 * lateFee(3) -> 60     lateFee(3, 50) -> 150     lateFee(3, undefined) -> 60
 */
export function lateFee(days, perDay) {
  // TODO
  throw new Error('TODO: lateFee');
}

/**
 * A shelf tag for a book, as an arrow function with an expression body.
 *
 * toTag({ isbn: "978-0141439587", title: "Emma" }) -> { id: "978-0141439587", label: "EMMA" }
 */
export const toTag = (book) => {
  // TODO
  throw new Error('TODO: toTag');
};

/**
 * A discount: a function that takes a price and returns it `percent` lower, rounded to the penny.
 *
 * percentOff(10)(1000) -> 900     percentOff(25)(999) -> 749
 */
export function percentOff(percent) {
  // TODO
  throw new Error('TODO: percentOff');
}

/**
 * A discount: a function that takes a price and returns it `amount` lower, never below 0.
 *
 * minus(200)(999) -> 799     minus(200)(150) -> 0
 */
export function minus(amount) {
  // TODO
  throw new Error('TODO: minus');
}

/**
 * The price after every discount passed, applied in order. No discounts leaves it as it is.
 *
 * applyAll(1000, percentOff(10), minus(200)) -> 700
 * applyAll(1000, minus(200), percentOff(10)) -> 720
 */
export function applyAll(price, ...discounts) {
  // TODO
  throw new Error('TODO: applyAll');
}

/**
 * A ticket machine: a function that returns the next number each time it is called,
 * starting after `start` (0 by default). Each machine counts on its own.
 *
 * const next = makeCounter(); next() -> 1, next() -> 2
 * makeCounter(100)() -> 101
 */
export function makeCounter(start) {
  // TODO
  throw new Error('TODO: makeCounter');
}

/**
 * A wrapper that calls `fn` with its arguments the first time only, and returns that
 * first result on every later call without calling `fn` again.
 *
 * const welcome = once((name) => `Welcome, ${name}`);
 * welcome("Ann") -> "Welcome, Ann"     welcome("Bo") -> "Welcome, Ann"
 */
export function once(fn) {
  // TODO
  throw new Error('TODO: once');
}
