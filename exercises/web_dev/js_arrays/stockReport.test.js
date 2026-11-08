import { beforeEach, describe, expect, test } from 'vitest';
import { cheapestFirst, copiesBy, findByIsbn, inStockTitles, latestAdded, stockValue, withoutIsbn } from './stockReport.js';

const BOOKS = [
  { isbn: '978-0141439587', title: 'Emma', author: 'Jane Austen', pence: 350, stock: 4 },
  { isbn: '978-0441013593', title: 'Dune', author: 'Frank Herbert', pence: 1099, stock: 2 },
  { isbn: '978-0307744432', title: 'The Night Circus', author: 'Erin Morgenstern', pence: 999, stock: 0 },
  { isbn: '978-1526622426', title: 'Piranesi', author: 'Susanna Clarke', pence: 899, stock: 5 },
  { isbn: '978-0141439686', title: 'Persuasion', author: 'Jane Austen', pence: 350, stock: 3 },
];

let books;
let before;
beforeEach(() => {
  books = structuredClone(BOOKS);
  before = structuredClone(BOOKS);
});
const titles = list => list.map(b => b.title);

test('inStockTitles keeps the books in stock and gives their titles, in order', () => {
  expect(inStockTitles(books)).toEqual(['Emma', 'Dune', 'Piranesi', 'Persuasion']);
  expect(inStockTitles([])).toEqual([]);
  expect(books).toEqual(before);
});

test('stockValue adds up price times stock, starting from 0', () => {
  expect(stockValue(books)).toBe(350 * 4 + 1099 * 2 + 0 + 899 * 5 + 350 * 3);
  expect(stockValue([])).toBe(0);
  expect(books).toEqual(before);
});

test('findByIsbn returns the book itself, or undefined', () => {
  expect(findByIsbn(books, '978-1526622426')).toBe(books[3]);
  expect(findByIsbn(books, '000')).toBeUndefined();
});

describe('cheapestFirst', () => {
  test('sorts by price as numbers, so 999 comes before 1099', () => {
    expect(titles(cheapestFirst(books))).toEqual(['Emma', 'Persuasion', 'Piranesi', 'The Night Circus', 'Dune']);
  });

  test('returns a new array and leaves the original in its order', () => {
    const sorted = cheapestFirst(books);
    expect(sorted).not.toBe(books);
    expect(books).toEqual(before);
  });
});

test('withoutIsbn returns a new array without that book', () => {
  const left = withoutIsbn(books, '978-0441013593');
  expect(titles(left)).toEqual(['Emma', 'The Night Circus', 'Piranesi', 'Persuasion']);
  expect(left).not.toBe(books);
  expect(titles(withoutIsbn(books, '000'))).toEqual(titles(books));
  expect(books).toEqual(before);
});

test('latestAdded gives the last books added, newest first, without reversing the original', () => {
  expect(titles(latestAdded(books, 2))).toEqual(['Persuasion', 'Piranesi']);
  expect(titles(latestAdded(books, 1))).toEqual(['Persuasion']);
  expect(latestAdded(books, 10)).toHaveLength(5);
  expect(books).toEqual(before);
});

test('copiesBy totals the copies in stock of one author\'s books', () => {
  expect(copiesBy(books, 'Jane Austen')).toBe(7);
  expect(copiesBy(books, 'Erin Morgenstern')).toBe(0);
  expect(copiesBy(books, 'Nobody')).toBe(0);
  expect(copiesBy([], 'Jane Austen')).toBe(0);
  expect(books).toEqual(before);
});
