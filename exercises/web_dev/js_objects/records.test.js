import { describe, expect, test } from 'vitest';
import { Basket, copyOrder, describeBook, movedShop, restocked, townOf } from './records.js';

const EMMA = { isbn: '978-0141439587', title: 'Emma', pence: 350, stock: 4 };
const DUNE = { isbn: '978-0441013593', title: 'Dune', pence: 1099, stock: 2 };
const SHOP = { name: 'Corner Books', address: { street: '12 Mill Street', town: 'Hexham', postcode: 'NE46 1AA' } };

test('describeBook reads each key held in the array', () => {
  expect(describeBook(EMMA, ['title', 'stock'])).toBe('title: Emma, stock: 4');
  expect(describeBook(EMMA, ['pence'])).toBe('pence: 350');
  expect(describeBook(EMMA, [])).toBe('');
});

test('restocked returns a new book and leaves the old one alone', () => {
  const book = { ...EMMA };
  const more = restocked(book, 3);
  expect(more).toEqual({ ...EMMA, stock: 7 });
  expect(more).not.toBe(book);
  expect(book.stock).toBe(4);
});

describe('movedShop', () => {
  test('changes the town and keeps the rest of the shop and its address', () => {
    expect(movedShop(structuredClone(SHOP), 'Alnwick')).toEqual({
      name: 'Corner Books', address: { street: '12 Mill Street', town: 'Alnwick', postcode: 'NE46 1AA' },
    });
  });

  test('copies the address too, so the original shop keeps its town', () => {
    const shop = structuredClone(SHOP);
    const moved = movedShop(shop, 'Alnwick');
    expect(moved).not.toBe(shop);
    expect(moved.address).not.toBe(shop.address);
    expect(shop.address.town).toBe('Hexham');
  });
});

test('townOf reads the nested town', () => {
  expect(townOf(SHOP)).toBe('Hexham');
  expect(townOf({ address: { town: 'Alnwick' } })).toBe('Alnwick');
});

test('copyOrder makes a deep copy, so changing its lines leaves the original as it was', () => {
  const order = { id: 7, customer: { name: 'Ann' }, lines: [{ isbn: EMMA.isbn, quantity: 1 }] };
  const copy = copyOrder(order);
  expect(copy).toEqual(order);
  copy.lines[0].quantity = 5;
  copy.lines.push({ isbn: DUNE.isbn, quantity: 1 });
  copy.customer.name = 'Bo';
  expect(order).toEqual({ id: 7, customer: { name: 'Ann' }, lines: [{ isbn: EMMA.isbn, quantity: 1 }] });
});

describe('Basket', () => {
  test('starts empty for its owner', () => {
    const basket = new Basket('Ann');
    expect(basket.owner).toBe('Ann');
    expect(basket.lines).toEqual([]);
    expect(basket.count()).toBe(0);
    expect(basket.total()).toBe(0);
  });

  test('adds a line per book, merging repeats, and chains', () => {
    const basket = new Basket('Ann');
    expect(basket.add(EMMA, 2)).toBe(basket);
    basket.add(DUNE).add(EMMA);
    expect(basket.lines).toEqual([
      { isbn: EMMA.isbn, title: 'Emma', pence: 350, quantity: 3 },
      { isbn: DUNE.isbn, title: 'Dune', pence: 1099, quantity: 1 },
    ]);
    expect(basket.count()).toBe(4);
    expect(basket.total()).toBe(350 * 3 + 1099);
  });

  test('gives every basket its own lines but shares the methods', () => {
    const ann = new Basket('Ann').add(EMMA);
    const bo = new Basket('Bo');
    expect(bo.lines).toEqual([]);
    expect(ann.lines).not.toBe(bo.lines);
    expect(ann.add).toBe(bo.add);
    expect(Object.keys(ann).sort()).toEqual(['lines', 'owner']);
  });

  test('leaves the book objects it was given alone', () => {
    const emma = { ...EMMA };
    new Basket('Ann').add(emma, 2).add(emma);
    expect(emma).toEqual(EMMA);
  });
});
