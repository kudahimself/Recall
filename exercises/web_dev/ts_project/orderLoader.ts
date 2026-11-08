/**
 * Order loader: reads the shop's orders from outside (text, or a fetch) and
 * hands them on in a typed result envelope, checked at runtime by type guards,
 * so a function that can fail returns its failure instead of throwing.
 *
 * Fill in the types and the functions so the tests in orderLoader.test.ts pass.
 * Run them from this folder with: npm test
 * The tests also type-check this file with strict settings (tsconfig.json),
 * so type every parameter and return, and never cast outside data with `as`.
 */

/**
 * The part of fetch this file uses: given a URL, a Promise of a response with
 * `ok`, `status` and `json()`. A real fetch fits it; the tests pass a fake one.
 */
export type FetchLike = (url: string) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

/**
 * TODO: a generic result envelope Result<T>, a discriminated union on `ok`:
 * { ok: true; data: T } or { ok: false; error: string }.
 */
export type Result = unknown;

/** TODO: a generic Guard<T>: a type guard function, taking an unknown and telling whether it is a T. */
export type Guard = unknown;

/** TODO: an order has an id (a number), a title (a string) and copies (a number). */
export interface Order {}

/**
 * A Guard<Order>: true only for an object whose id and copies are numbers and
 * whose title is a string.
 */
export function isOrder(x) {
  // TODO
  throw new Error('TODO: isOrder');
}

/**
 * A guard for an array whose every item passes `isT`, made from the guard for
 * one item: arrayOf(isOrder) is a Guard<Order[]>.
 */
export function arrayOf(isT) {
  // TODO
  throw new Error('TODO: arrayOf');
}

/**
 * The text parsed as JSON and checked with `isT`, in a Result: the value as
 * `data` when it passes, the error "wrong shape" when it does not, and
 * "not JSON" when the text does not parse. It never throws.
 * Generic: parseJson(text, isOrder) is a Result<Order>.
 */
export function parseJson(text, isT) {
  // TODO
  throw new Error('TODO: parseJson');
}

/**
 * The JSON at `url`, fetched with fetchFn and checked with `isT`, in a Result.
 * Its errors: "network error" when fetchFn rejects, "HTTP 404" (with the real
 * status) when the response is not ok, "not JSON" when json() rejects, and
 * "wrong shape" when the guard fails. Its Promise never rejects.
 */
export async function fetchJson(url, isT, fetchFn) {
  // TODO
  throw new Error('TODO: fetchJson');
}

/** The copies ordered across the results that are ok; the failed ones count for nothing. */
export function copiesOrdered(results) {
  // TODO
  throw new Error('TODO: copiesOrdered');
}
