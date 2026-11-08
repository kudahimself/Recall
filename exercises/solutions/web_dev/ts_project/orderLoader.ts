/**
 * Order loader: reads the shop's orders from outside and hands them on in a
 * typed result envelope, checked at runtime by type guards.
 * Reference solution.
 */

export type FetchLike = (url: string) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type Guard<T> = (x: unknown) => x is T;

export interface Order {
  id: number;
  title: string;
  copies: number;
}

export function isOrder(x: unknown): x is Order {
  return typeof x === 'object' && x !== null
    && 'id' in x && typeof x.id === 'number'
    && 'title' in x && typeof x.title === 'string'
    && 'copies' in x && typeof x.copies === 'number';
}

export function arrayOf<T>(isT: Guard<T>): Guard<T[]> {
  return (x: unknown): x is T[] => Array.isArray(x) && x.every(isT);
}

export function parseJson<T>(text: string, isT: Guard<T>): Result<T> {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { ok: false, error: 'not JSON' };
  }
  // The guard, not a cast, is what makes `data` a T.
  return isT(value) ? { ok: true, data: value } : { ok: false, error: 'wrong shape' };
}

export async function fetchJson<T>(url: string, isT: Guard<T>, fetchFn: FetchLike): Promise<Result<T>> {
  let response;
  try {
    response = await fetchFn(url);
  } catch {
    return { ok: false, error: 'network error' };
  }
  // fetch only rejects when the network fails, so an HTTP error is checked here.
  if (!response.ok) return { ok: false, error: `HTTP ${response.status}` };
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return { ok: false, error: 'not JSON' };
  }
  return isT(body) ? { ok: true, data: body } : { ok: false, error: 'wrong shape' };
}

export function copiesOrdered(results: Result<Order>[]): number {
  return results.reduce((sum, r) => (r.ok ? sum + r.data.copies : sum), 0);
}
