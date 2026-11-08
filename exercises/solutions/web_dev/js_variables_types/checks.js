/**
 * Stock checks: practise const and let, typeof, truthy and falsy values,
 * strict equality and destructuring with defaults.
 *
 * Fill in each function so the tests in checks.test.js pass.
 * Run them from this folder with: npm test
 */

export function kindOf(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

export function countFalsy(values) {
  let count = 0;
  for (const value of values) {
    if (!value) count += 1;
  }
  return count;
}

export function parseCount(text) {
  const trimmed = text.trim();
  // Number("") is 0, so an empty box has to be turned away before converting.
  if (!/^\d+$/.test(trimmed)) return null;
  return Number(trimmed);
}

export function matchesShelf(text, shelfCount) {
  return parseCount(text) === shelfCount;
}

export function shelfLabel(book) {
  const { title, author = 'Unknown', pages = 300 } = book;
  return `${title} by ${author}, ${pages} pages`;
}

export function locate(code) {
  const [aisle, shelf] = code.split('-');
  return { aisle, shelf: Number(shelf) };
}
