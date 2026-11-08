import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import * as money from './money.js';
import * as order from './order.js';

const source = name => readFileSync(new URL(`./${name}`, import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');

describe('the modules', () => {
  test('money.js exports formatPrice as its default export', () => {
    expect(typeof money.default).toBe('function');
    expect(money.default(999)).toBe('£9.99');
    expect(money.default(50)).toBe('£0.50');
    expect(money.default(1200)).toBe('£12.00');
    expect(money.default(5)).toBe('£0.05');
  });

  test('order.js imports formatPrice from money.js, the ES module way', () => {
    expect(source('order.js')).toMatch(/import\s+\w+\s+from\s+['"]\.\/money\.js['"]/);
    expect(source('order.js') + source('money.js')).not.toMatch(/\brequire\s*\(|module\.exports/);
    expect(order.receiptLine({ title: 'Emma', pence: 350, quantity: 2 })).toBe('2 x Emma: £7.00');
    expect(order.receiptLine({ title: 'Dune', pence: 1099 })).toBe('1 x Dune: £10.99');
  });
});

test('deliveryTown reads the town safely, falling back to collection', () => {
  expect(order.deliveryTown({ customer: { address: { town: 'Hexham' } } })).toBe('Hexham');
  expect(order.deliveryTown({ customer: {} })).toBe('Collect in shop');
  expect(order.deliveryTown({})).toBe('Collect in shop');
  expect(order.deliveryTown(null)).toBe('Collect in shop');
  expect(order.deliveryTown(undefined)).toBe('Collect in shop');
  expect(order.deliveryTown({ customer: { address: { town: '' } } })).toBe('');
});

test('quantityOf defaults a missing quantity to 1 and keeps a 0', () => {
  expect(order.quantityOf({ quantity: 3 })).toBe(3);
  expect(order.quantityOf({})).toBe(1);
  expect(order.quantityOf({ quantity: null })).toBe(1);
  expect(order.quantityOf({ quantity: 0 })).toBe(0);
});

test('withDefaults fills in only the missing settings', () => {
  expect(order.withDefaults({ pageSize: 0 })).toEqual({ pageSize: 0, showSoldOut: true, label: 'Books' });
  expect(order.withDefaults({ showSoldOut: false, label: '' })).toEqual({ pageSize: 20, showSoldOut: false, label: '' });
  expect(order.withDefaults({ pageSize: 50, label: 'Maps' })).toEqual({ pageSize: 50, showSoldOut: true, label: 'Maps' });
  expect(order.withDefaults()).toEqual({ pageSize: 20, showSoldOut: true, label: 'Books' });
});

test('latest gives the last order, or undefined', () => {
  expect(order.latest([{ id: 1 }, { id: 2 }, { id: 3 }])).toEqual({ id: 3 });
  expect(order.latest([])).toBeUndefined();
});

test('firstAndRest splits off the first line and leaves the array alone', () => {
  const lines = ['Emma', 'Dune', 'Piranesi'];
  expect(order.firstAndRest(lines)).toEqual({ first: 'Emma', rest: ['Dune', 'Piranesi'] });
  expect(lines).toEqual(['Emma', 'Dune', 'Piranesi']);
  expect(order.firstAndRest(['Emma'])).toEqual({ first: 'Emma', rest: [] });
  expect(order.firstAndRest([])).toEqual({ first: undefined, rest: [] });
});

test('addLine returns a new order with a new lines array', () => {
  const original = { id: 7, lines: [{ title: 'Emma' }] };
  const bigger = order.addLine(original, { title: 'Dune' });
  expect(bigger).toEqual({ id: 7, lines: [{ title: 'Emma' }, { title: 'Dune' }] });
  expect(bigger.lines).not.toBe(original.lines);
  expect(original).toEqual({ id: 7, lines: [{ title: 'Emma' }] });
});
