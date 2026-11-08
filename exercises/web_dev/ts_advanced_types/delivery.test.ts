import { describe, expect, test } from 'vitest';
import { fileTypeErrors, typeErrors } from '../typecheck.js';
import { SHIPPING, assertNever, errorText, eta, isDelivery, shippingCost, track } from './delivery';

/**
 * The type errors in `code`, a few lines that use delivery.ts, as the compiler
 * reports them. A line after `// @ts-expect-error` must not compile.
 * Equals<A, B> is true only when A and B are exactly the same type.
 */
const check = (code: string) => typeErrors(`import { SHIPPING, assertNever, errorText, eta, isDelivery, shippingCost, track } from "./delivery";
import type { Delivery, Tracked } from "./delivery";
type Equals<A, B> = (<X>() => X extends A ? 1 : 2) extends (<X>() => X extends B ? 1 : 2) ? true : false;
${code}`, import.meta.url);

describe('the types', () => {
  test('delivery.ts compiles with strict checks, every parameter typed', () => {
    expect(fileTypeErrors(new URL('./delivery.ts', import.meta.url))).toEqual([]);
  });

  test('a Delivery is one of the three variants, each with its own field', () => {
    expect(check(`
      const all: Delivery[] = [{ kind: "pickup", store: "Leeds" }, { kind: "post", days: 3 }, { kind: "courier", fee: 5 }];
      const kinds: Equals<Delivery["kind"], "pickup" | "post" | "courier"> = true;
      // @ts-expect-error the post has days, not a store
      const mixed: Delivery = { kind: "post", store: "Leeds" };
      // @ts-expect-error there is no drone delivery
      const drone: Delivery = { kind: "drone", fee: 1 };
    `)).toEqual([]);
  });

  test('checking kind narrows a Delivery to one variant', () => {
    expect(check(`
      function storeOf(d: Delivery): string {
        // @ts-expect-error only a pickup has a store, so check the kind first
        d.store;
        if (d.kind === "pickup") return d.store;
        return "none";
      }
    `)).toEqual([]);
  });

  test('assertNever takes only never, so a forgotten variant does not compile', () => {
    expect(check(`
      // returns never, so its result fits wherever a value is expected
      const cost = (d: never): number => assertNever(d);
      function handled(d: Delivery): string {
        switch (d.kind) {
          case "pickup": case "post": case "courier": return d.kind;
          default: return assertNever(d);
        }
      }
      function forgot(d: Delivery): string {
        switch (d.kind) {
          case "pickup": case "post": return d.kind;
          // @ts-expect-error the courier case is missing, so d is not never here
          default: return assertNever(d);
        }
      }
    `)).toEqual([]);
  });

  test('isDelivery is a type guard that narrows an unknown value', () => {
    expect(check(`
      const parsed: unknown = JSON.parse('{"kind":"post","days":3}');
      if (isDelivery(parsed)) {
        const kind: "pickup" | "post" | "courier" = parsed.kind;
      }
      // @ts-expect-error unknown until the guard has passed
      parsed.kind;
    `)).toEqual([]);
  });

  test('a Tracked delivery is a Delivery with a tracking code', () => {
    expect(check(`
      const t: Tracked = track({ kind: "post", days: 2 }, "RM1");
      const code: string = t.tracking;
      const asDelivery: Delivery = t;
      if (t.kind === "post") { const days: number = t.days; }
      // @ts-expect-error a Tracked delivery needs its tracking code
      const untracked: Tracked = { kind: "post", days: 2 };
    `)).toEqual([]);
  });

  test('SHIPPING keeps its own keys and number values', () => {
    expect(check(`
      const keys: Equals<keyof typeof SHIPPING, "post" | "courier"> = true;
      const post: number = SHIPPING.post;
      // @ts-expect-error a pickup has no shipping cost
      SHIPPING.pickup;
      const fromThrown: string = errorText(new Error("x"));
      const cost: number = shippingCost({ kind: "post", days: 1 });
    `)).toEqual([]);
  });
});

describe('eta', () => {
  test('says when each kind of delivery arrives', () => {
    expect(eta({ kind: 'pickup', store: 'Leeds' })).toBe('collect at Leeds');
    expect(eta({ kind: 'post', days: 3 })).toBe('3 days by post');
    expect(eta({ kind: 'courier', fee: 5 })).toBe('next day, 5 extra');
  });
});

test('assertNever throws with the value it was given', () => {
  expect(() => assertNever({ kind: 'drone' } as never)).toThrow(new Error('Unexpected delivery: {"kind":"drone"}'));
});

test('shippingCost is 0 to collect, the post rate, or the courier rate plus its fee', () => {
  expect(SHIPPING).toEqual({ post: 2.5, courier: 6 });
  expect(shippingCost({ kind: 'pickup', store: 'Leeds' })).toBe(0);
  expect(shippingCost({ kind: 'post', days: 3 })).toBe(2.5);
  expect(shippingCost({ kind: 'courier', fee: 5 })).toBe(11);
});

test('isDelivery accepts each variant and nothing else', () => {
  expect(isDelivery({ kind: 'pickup', store: 'Leeds' })).toBe(true);
  expect(isDelivery({ kind: 'post', days: 3 })).toBe(true);
  expect(isDelivery({ kind: 'courier', fee: 5 })).toBe(true);
  expect(isDelivery({ kind: 'post', days: '3' })).toBe(false);
  expect(isDelivery({ kind: 'pickup' })).toBe(false);
  expect(isDelivery({ kind: 'drone', fee: 1 })).toBe(false);
  expect(isDelivery({ days: 3 })).toBe(false);
  expect(isDelivery(null)).toBe(false);
  expect(isDelivery('post')).toBe(false);
});

test('errorText reads an Error, keeps a string, and names anything else', () => {
  expect(errorText(new Error('card declined'))).toBe('card declined');
  expect(errorText(new TypeError('bad input'))).toBe('bad input');
  expect(errorText('no stock')).toBe('no stock');
  expect(errorText(404)).toBe('Unknown error');
  expect(errorText(undefined)).toBe('Unknown error');
});

test('track adds the tracking code to a copy', () => {
  const post = { kind: 'post' as const, days: 2 };
  expect(track(post, 'RM1')).toEqual({ kind: 'post', days: 2, tracking: 'RM1' });
  expect(post).toEqual({ kind: 'post', days: 2 });
});
