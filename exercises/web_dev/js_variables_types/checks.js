/**
 * Stock checks: practise const and let, typeof, truthy and falsy values,
 * strict equality and destructuring with defaults.
 *
 * Fill in each function so the tests in checks.test.js pass.
 * Run them from this folder with: npm test
 */

/**
 * The kind of a value, as typeof names it, except that null is "null" and an array is "array".
 *
 * kindOf("Emma") -> "string"     kindOf(3) -> "number"     kindOf(null) -> "null"
 * kindOf([1, 2]) -> "array"      kindOf({}) -> "object"    kindOf(undefined) -> "undefined"
 */
export function kindOf(value) {
  // TODO
  throw new Error('TODO: kindOf');
}

/**
 * How many of the values are falsy.
 *
 * countFalsy([0, "", "0", [], null, "Emma", NaN, undefined, false]) -> 6
 */
export function countFalsy(values) {
  // TODO
  throw new Error('TODO: countFalsy');
}

/**
 * The stock count typed into a form box, as a number: a whole number of 0 or more,
 * with spaces around it allowed. Anything else, an empty box included, is null.
 *
 * parseCount("3") -> 3     parseCount(" 12 ") -> 12     parseCount("0") -> 0
 * parseCount("") -> null   parseCount("two") -> null    parseCount("2.5") -> null
 */
export function parseCount(text) {
  // TODO
  throw new Error('TODO: parseCount');
}

/**
 * Whether the count typed into a box matches the count on the shelf, a number.
 *
 * matchesShelf("3", 3) -> true     matchesShelf("", 0) -> false     matchesShelf("4", 3) -> false
 */
export function matchesShelf(text, shelfCount) {
  // TODO
  throw new Error('TODO: matchesShelf');
}

/**
 * A shelf label for a book object; author defaults to "Unknown" and pages to 300.
 *
 * shelfLabel({ title: "Emma", author: "Jane Austen", pages: 474 }) -> "Emma by Jane Austen, 474 pages"
 * shelfLabel({ title: "Beowulf" }) -> "Beowulf by Unknown, 300 pages"
 */
export function shelfLabel(book) {
  // TODO
  throw new Error('TODO: shelfLabel');
}

/**
 * The aisle and shelf of a location code such as "B-4", as an object.
 *
 * locate("B-4") -> { aisle: "B", shelf: 4 }
 */
export function locate(code) {
  // TODO
  throw new Error('TODO: locate');
}
