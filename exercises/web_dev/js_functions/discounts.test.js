import { describe, expect, test, vi } from 'vitest';
import { applyAll, lateFee, makeCounter, minus, once, percentOff, toTag } from './discounts.js';

test('lateFee charges 20p a day unless another rate is passed', () => {
  expect(lateFee(3)).toBe(60);
  expect(lateFee(0)).toBe(0);
  expect(lateFee(3, 50)).toBe(150);
  expect(lateFee(3, undefined)).toBe(60);
});

test('toTag is an arrow function that returns the tag object', () => {
  expect(toTag({ isbn: '978-0141439587', title: 'Emma' })).toEqual({ id: '978-0141439587', label: 'EMMA' });
  expect(toTag({ title: 'Dune', isbn: '978-0441013593', pages: 412 })).toEqual({ id: '978-0441013593', label: 'DUNE' });
  expect(toTag.prototype, 'an arrow function has no prototype: write toTag as one').toBeUndefined();
});

describe('discounts made by functions', () => {
  test('percentOff returns a function that takes a percentage off, rounded to the penny', () => {
    const tenOff = percentOff(10);
    expect(typeof tenOff).toBe('function');
    expect(tenOff(1000)).toBe(900);
    expect(tenOff(500)).toBe(450);
    expect(percentOff(25)(999)).toBe(749);
  });

  test('minus returns a function that takes an amount off, never below zero', () => {
    const twoPounds = minus(200);
    expect(typeof twoPounds).toBe('function');
    expect(twoPounds(999)).toBe(799);
    expect(twoPounds(150)).toBe(0);
  });

  test('applyAll applies any number of discounts, in order', () => {
    expect(applyAll(1000, percentOff(10), minus(200))).toBe(700);
    expect(applyAll(1000, minus(200), percentOff(10))).toBe(720);
    expect(applyAll(1000)).toBe(1000);
    expect(applyAll(1000, minus(100), minus(100), minus(100))).toBe(700);
    expect(applyAll(1000, (price) => price * 2)).toBe(2000);
  });
});

test('makeCounter makes machines that each remember their own count', () => {
  const next = makeCounter();
  expect(next()).toBe(1);
  expect(next()).toBe(2);
  const fromHundred = makeCounter(100);
  expect(fromHundred()).toBe(101);
  expect(next()).toBe(3);
  expect(fromHundred()).toBe(102);
});

test('once calls the function the first time only, with the arguments, and keeps its result', () => {
  const greet = vi.fn((name, shop) => `Welcome to ${shop}, ${name}`);
  const welcome = once(greet);
  expect(greet).not.toHaveBeenCalled();
  expect(welcome('Ann', 'Corner Books')).toBe('Welcome to Corner Books, Ann');
  expect(welcome('Bo', 'Elsewhere')).toBe('Welcome to Corner Books, Ann');
  expect(greet).toHaveBeenCalledTimes(1);
  expect(greet).toHaveBeenCalledWith('Ann', 'Corner Books');
  // A first result of undefined still counts as called.
  const log = vi.fn(() => undefined);
  const logOnce = once(log);
  logOnce();
  logOnce();
  expect(log).toHaveBeenCalledTimes(1);
});
