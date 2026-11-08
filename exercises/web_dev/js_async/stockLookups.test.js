import { afterEach, describe, expect, test, vi } from 'vitest';
import { allStock, bookTitle, firstInStock, stockLine, stockReport, wait } from './stockLookups.js';

const STOCK = { Emma: 3, Dune: 0, Piranesi: 5, Persuasion: 2 };

/** A fake warehouse: each lookup answers after a few ms, and it counts the lookups in flight. */
function warehouse(stock = STOCK, delay = 5) {
  const w = { asked: [], inFlight: 0, mostAtOnce: 0 };
  w.fetchStock = (title) => {
    w.asked.push(title);
    w.inFlight += 1;
    w.mostAtOnce = Math.max(w.mostAtOnce, w.inFlight);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        w.inFlight -= 1;
        if (title in stock) resolve(stock[title]);
        else reject(new Error(`${title} is not stocked`));
      }, delay);
    });
  };
  return w;
}

afterEach(() => {
  vi.useRealTimers();
});

test('wait fulfils its Promise after the given time, not before', async () => {
  vi.useFakeTimers();
  let done = false;
  const promise = wait(1000);
  expect(promise).toBeInstanceOf(Promise);
  promise.then(() => { done = true; });
  await vi.advanceTimersByTimeAsync(999);
  expect(done).toBe(false);
  await vi.advanceTimersByTimeAsync(1);
  expect(done).toBe(true);
  await expect(promise).resolves.toBeUndefined();
});

describe('bookTitle', () => {
  const respond = (status, body) => vi.fn(async () => ({ ok: status < 300, status, json: async () => body }));

  test('awaits the response and its JSON, then gives the title', async () => {
    const fetchFn = respond(200, { id: 1, title: 'Emma' });
    await expect(bookTitle('/api/books/1', fetchFn)).resolves.toBe('Emma');
    expect(fetchFn).toHaveBeenCalledWith('/api/books/1');
  });

  test('rejects with the status when the response is not ok', async () => {
    await expect(bookTitle('/api/books/9', respond(404, { error: 'missing' }))).rejects.toThrow('HTTP 404');
  });
});

test('stockLine reports the count, or why the lookup failed, without rejecting', async () => {
  const { fetchStock } = warehouse();
  await expect(stockLine('Emma', fetchStock)).resolves.toBe('Emma: 3 in stock');
  await expect(stockLine('Dune', fetchStock)).resolves.toBe('Dune: 0 in stock');
  await expect(stockLine('Hamlet', fetchStock)).resolves.toBe('Hamlet: unavailable (Hamlet is not stocked)');
});

describe('allStock', () => {
  test('gives every count, in order, with all the lookups running at once', async () => {
    const w = warehouse(STOCK, 20);
    await expect(allStock(['Emma', 'Dune', 'Piranesi'], w.fetchStock)).resolves.toEqual([3, 0, 5]);
    expect(w.mostAtOnce).toBe(3);
  });

  test('rejects when one lookup rejects', async () => {
    const w = warehouse();
    await expect(allStock(['Emma', 'Hamlet'], w.fetchStock)).rejects.toThrow('Hamlet is not stocked');
    await expect(allStock([], w.fetchStock)).resolves.toEqual([]);
  });
});

test('stockReport waits for every lookup at once and reports each outcome', async () => {
  const w = warehouse(STOCK, 20);
  await expect(stockReport(['Emma', 'Hamlet', 'Dune'], w.fetchStock)).resolves.toEqual([
    { title: 'Emma', ok: true, stock: 3 },
    { title: 'Hamlet', ok: false, error: 'Hamlet is not stocked' },
    { title: 'Dune', ok: true, stock: 0 },
  ]);
  expect(w.mostAtOnce).toBe(3);
});

describe('firstInStock', () => {
  test('asks one title at a time and stops at the first in stock', async () => {
    const w = warehouse();
    await expect(firstInStock(['Dune', 'Persuasion', 'Emma'], w.fetchStock)).resolves.toBe('Persuasion');
    expect(w.asked).toEqual(['Dune', 'Persuasion']);
    expect(w.mostAtOnce).toBe(1);
  });

  test('gives null when nothing is in stock, and rejects when a lookup does', async () => {
    const w = warehouse();
    await expect(firstInStock(['Dune'], w.fetchStock)).resolves.toBeNull();
    await expect(firstInStock([], w.fetchStock)).resolves.toBeNull();
    await expect(firstInStock(['Dune', 'Hamlet', 'Emma'], w.fetchStock)).rejects.toThrow('Hamlet is not stocked');
  });
});
