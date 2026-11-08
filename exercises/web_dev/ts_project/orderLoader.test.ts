import { describe, expect, test, vi } from 'vitest';
import { fileTypeErrors, typeErrors } from '../typecheck.js';
import { arrayOf, copiesOrdered, fetchJson, isOrder, parseJson } from './orderLoader';

/**
 * The type errors in `code`, a few lines that use orderLoader.ts, as the compiler
 * reports them. A line after `// @ts-expect-error` must not compile.
 * Equals<A, B> is true only when A and B are exactly the same type.
 */
const check = (code: string) => typeErrors(`import { arrayOf, copiesOrdered, fetchJson, isOrder, parseJson } from "./orderLoader";
import type { FetchLike, Guard, Order, Result } from "./orderLoader";
type Equals<A, B> = (<X>() => X extends A ? 1 : 2) extends (<X>() => X extends B ? 1 : 2) ? true : false;
declare const fetchFn: FetchLike;
${code}`, import.meta.url);

describe('the types', () => {
  test('orderLoader.ts compiles with strict checks, every parameter typed', () => {
    expect(fileTypeErrors(new URL('./orderLoader.ts', import.meta.url))).toEqual([]);
  });

  test('a Result is either ok with data of its type, or an error', () => {
    expect(check(`
      const good: Result<number> = { ok: true, data: 1 };
      const bad: Result<number> = { ok: false, error: "out of stock" };
      // @ts-expect-error an ok result carries data, not an error
      const mixed: Result<number> = { ok: true, error: "x" };
      // @ts-expect-error a Result<number> carries a number
      const text: Result<number> = { ok: true, data: "1" };
    `)).toEqual([]);
  });

  test('checking ok narrows a Result, and only then is there data', () => {
    expect(check(`
      function describe(r: Result<Order>): string {
        // @ts-expect-error check ok before reading data
        r.data;
        if (r.ok) return r.data.title;
        return r.error;
      }
    `)).toEqual([]);
  });

  test('a Guard is a type guard, and isOrder is one for orders', () => {
    expect(check(`
      const same: Equals<Guard<string>, (x: unknown) => x is string> = true;
      const guard: Guard<Order> = isOrder;
      const order: Order = { id: 7, title: "Emma", copies: 2 };
      const x: unknown = JSON.parse("{}");
      if (isOrder(x)) { const copies: number = x.copies; }
      // @ts-expect-error an order's copies are a number
      const wrong: Order = { id: 7, title: "Emma", copies: "2" };
    `)).toEqual([]);
  });

  test("parseJson and arrayOf carry the guard's type through to the Result", () => {
    expect(check(`
      const one = parseJson('{"id":7}', isOrder);
      const exactOne: Equals<typeof one, Result<Order>> = true;
      const exactGuard: Equals<ReturnType<typeof arrayOf<Order>>, Guard<Order[]>> = true;
      const many = parseJson("[]", arrayOf(isOrder));
      const exactMany: Equals<typeof many, Result<Order[]>> = true;
    `)).toEqual([]);
  });

  test('fetchJson gives a Promise of a Result, and copiesOrdered takes Results', () => {
    expect(check(`
      const pending = fetchJson("/orders/7", isOrder, fetchFn);
      const exact: Equals<typeof pending, Promise<Result<Order>>> = true;
      const n: number = copiesOrdered([{ ok: false, error: "x" }]);
      // @ts-expect-error copiesOrdered takes Results, not orders
      copiesOrdered([{ id: 7, title: "Emma", copies: 2 }]);
    `)).toEqual([]);
  });
});

const emma = { id: 7, title: 'Emma', copies: 2 };
const dune = { id: 9, title: 'Dune', copies: 1 };

test('isOrder checks every field the code will read', () => {
  expect(isOrder(emma)).toBe(true);
  expect(isOrder({ ...emma, note: 'gift' })).toBe(true);
  expect(isOrder({ ...emma, id: '7' })).toBe(false);
  expect(isOrder({ id: 7, title: 'Emma' })).toBe(false);
  expect(isOrder({ id: 7, copies: 2 })).toBe(false);
  expect(isOrder(null)).toBe(false);
  expect(isOrder('Emma')).toBe(false);
});

test('arrayOf makes a guard for a whole array', () => {
  const areOrders = arrayOf(isOrder);
  expect(areOrders([emma, dune])).toBe(true);
  expect(areOrders([])).toBe(true);
  expect(areOrders([emma, { id: 9 }])).toBe(false);
  expect(areOrders(emma)).toBe(false);
});

describe('parseJson', () => {
  test('gives the data when the JSON has the right shape', () => {
    expect(parseJson('{"id":7,"title":"Emma","copies":2}', isOrder)).toEqual({ ok: true, data: emma });
    expect(parseJson(JSON.stringify([emma, dune]), arrayOf(isOrder))).toEqual({ ok: true, data: [emma, dune] });
  });

  test('gives an error, never throwing, for the wrong shape or text that is not JSON', () => {
    expect(parseJson('{"id":"7"}', isOrder)).toEqual({ ok: false, error: 'wrong shape' });
    expect(parseJson('x=2', isOrder)).toEqual({ ok: false, error: 'not JSON' });
  });
});

/** A fetch whose response the test chooses; `body` may be a function that throws, as json() does on bad JSON. */
function fakeFetch({ ok = true, status = 200, body = undefined as unknown, offline = false } = {}) {
  return vi.fn(async (url: string) => {
    if (offline) throw new TypeError('Failed to fetch');
    return {
      ok,
      status,
      json: async () => (typeof body === 'function' ? body() : body),
    };
  });
}

describe('fetchJson', () => {
  test('fetches the URL and gives the checked data', async () => {
    const fetchFn = fakeFetch({ body: emma });
    expect(await fetchJson('/orders/7', isOrder, fetchFn)).toEqual({ ok: true, data: emma });
    expect(fetchFn).toHaveBeenCalledWith('/orders/7');
  });

  test('turns each failure into an error, and never rejects', async () => {
    expect(await fetchJson('/orders/7', isOrder, fakeFetch({ offline: true })))
      .toEqual({ ok: false, error: 'network error' });
    expect(await fetchJson('/orders/8', isOrder, fakeFetch({ ok: false, status: 404, body: { message: 'gone' } })))
      .toEqual({ ok: false, error: 'HTTP 404' });
    expect(await fetchJson('/orders/9', isOrder, fakeFetch({ ok: false, status: 500 })))
      .toEqual({ ok: false, error: 'HTTP 500' });
    const notJson = () => { throw new SyntaxError('Unexpected token <'); };
    expect(await fetchJson('/orders/7', isOrder, fakeFetch({ body: notJson })))
      .toEqual({ ok: false, error: 'not JSON' });
    expect(await fetchJson('/orders/7', isOrder, fakeFetch({ body: { id: '7' } })))
      .toEqual({ ok: false, error: 'wrong shape' });
  });
});

test('copiesOrdered adds up the ok results only', () => {
  expect(copiesOrdered([{ ok: true, data: emma }, { ok: false, error: 'HTTP 404' }, { ok: true, data: dune }])).toBe(3);
  expect(copiesOrdered([])).toBe(0);
});
