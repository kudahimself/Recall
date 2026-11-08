import { describe, expect, test } from 'vitest';
import { countFalsy, kindOf, locate, matchesShelf, parseCount, shelfLabel } from './checks.js';

describe('kindOf', () => {
  test('names primitives as typeof does', () => {
    expect(kindOf('Emma')).toBe('string');
    expect(kindOf(3)).toBe('number');
    expect(kindOf(true)).toBe('boolean');
    expect(kindOf(undefined)).toBe('undefined');
    expect(kindOf(10n)).toBe('bigint');
  });

  test('tells null and arrays apart from other objects', () => {
    expect(kindOf(null)).toBe('null');
    expect(kindOf([1, 2])).toBe('array');
    expect(kindOf([])).toBe('array');
    expect(kindOf({ title: 'Emma' })).toBe('object');
    expect(kindOf(() => 1)).toBe('function');
  });
});

test('countFalsy counts the six falsy values and nothing else', () => {
  expect(countFalsy([0, '', '0', [], null, 'Emma', NaN, undefined, false])).toBe(6);
  expect(countFalsy([{}, [], '0', 'false', -1])).toBe(0);
  expect(countFalsy([])).toBe(0);
});

describe('parseCount', () => {
  test('reads whole numbers, spaces allowed', () => {
    expect(parseCount('3')).toBe(3);
    expect(parseCount(' 12 ')).toBe(12);
    expect(parseCount('0')).toBe(0);
  });

  test('turns away an empty box and anything that is not a whole number', () => {
    expect(parseCount('')).toBeNull();
    expect(parseCount('   ')).toBeNull();
    expect(parseCount('two')).toBeNull();
    expect(parseCount('2.5')).toBeNull();
    expect(parseCount('-1')).toBeNull();
    expect(parseCount('3 books')).toBeNull();
  });
});

test('matchesShelf compares strictly, so an empty box never matches 0', () => {
  expect(matchesShelf('3', 3)).toBe(true);
  expect(matchesShelf(' 0', 0)).toBe(true);
  expect(matchesShelf('4', 3)).toBe(false);
  expect(matchesShelf('', 0)).toBe(false);
  expect(matchesShelf('3', '3')).toBe(false);
});

test('shelfLabel fills in a missing author and page count', () => {
  expect(shelfLabel({ title: 'Emma', author: 'Jane Austen', pages: 474 })).toBe('Emma by Jane Austen, 474 pages');
  expect(shelfLabel({ title: 'Beowulf' })).toBe('Beowulf by Unknown, 300 pages');
  expect(shelfLabel({ pages: 96, title: 'Animal Farm' })).toBe('Animal Farm by Unknown, 96 pages');
});

test('locate splits a location code into its aisle and a numeric shelf', () => {
  expect(locate('B-4')).toEqual({ aisle: 'B', shelf: 4 });
  expect(locate('AA-12')).toEqual({ aisle: 'AA', shelf: 12 });
});
