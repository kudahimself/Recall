/**
 * Price tags: small functions for the bookshop's labels, written in TypeScript.
 *
 * Fill in the type and the functions so the tests in priceTags.test.ts pass.
 * Run them from this folder with: npm test
 * The tests also type-check this file with strict settings (tsconfig.json), the
 * way VS Code does: give every parameter a type, and each function the return
 * type it says, so that no value is left as an `any` the compiler has to guess.
 */

/** TODO: the three formats a book comes in, "paperback", "hardback" and "ebook", and no other string. */
export type Format = unknown;

/**
 * The price of a book: the base price for a paperback, £5 more for a hardback,
 * £3 less for an ebook (never below 0), then less the discount when there is one.
 * TODO: base is a number, format a Format, discount an optional number; it returns a number.
 *
 * price(12, "ebook") -> 9      price(12, "ebook", 2) -> 7
 */
export function price(base, format, discount) {
  // TODO
  throw new Error('TODO: price');
}

/**
 * The page count of a value that came from outside, typed `unknown`, not `any`:
 * a number is the count itself, a string is converted with Number() (0 when it
 * is not a number), and anything else counts as 0.
 * TODO: raw is unknown; it returns a number.
 *
 * pageCount(328) -> 328   pageCount("320") -> 320   pageCount(null) -> 0
 */
export function pageCount(raw) {
  // TODO
  throw new Error('TODO: pageCount');
}

/**
 * The title, then its tags in brackets when it has some.
 * TODO: title is a string, tags an array of strings that defaults to []; it returns a string.
 *
 * label("Emma", ["classic", "romance"]) -> "Emma [classic, romance]"   label("Emma") -> "Emma"
 */
export function label(title, tags) {
  // TODO
  throw new Error('TODO: label');
}

/**
 * A shelf code from a number or a string: a number becomes "B" and its digits,
 * padded to at least three ("B007"); a string is trimmed and upper-cased.
 * TODO: id is a string or a number; it returns a string.
 *
 * shelfCode(7) -> "B007"   shelfCode(" b12 ") -> "B12"
 */
export function shelfCode(id) {
  // TODO
  throw new Error('TODO: shelfCode');
}

/**
 * Throws an Error with this message, and so never returns.
 * TODO: message is a string; write the return type that says it never returns.
 */
export function fail(message) {
  // TODO
}
