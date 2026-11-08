/**
 * Delivery: the shop's delivery options as a discriminated union, and the
 * checks that narrow a value to one of them.
 * Reference solution.
 */

export type Delivery =
  | { kind: 'pickup'; store: string }
  | { kind: 'post'; days: number }
  | { kind: 'courier'; fee: number };

export type Tracked = Delivery & { tracking: string };

export const SHIPPING = { post: 2.5, courier: 6 } satisfies Partial<Record<Delivery['kind'], number>>;

export function assertNever(value: never): never {
  throw new Error(`Unexpected delivery: ${JSON.stringify(value)}`);
}

export function eta(delivery: Delivery): string {
  switch (delivery.kind) {
    case 'pickup': return `collect at ${delivery.store}`;
    case 'post': return `${delivery.days} days by post`;
    case 'courier': return `next day, ${delivery.fee} extra`;
    default: return assertNever(delivery);
  }
}

export function shippingCost(delivery: Delivery): number {
  switch (delivery.kind) {
    case 'pickup': return 0;
    case 'post': return SHIPPING.post;
    case 'courier': return SHIPPING.courier + delivery.fee;
    default: return assertNever(delivery);
  }
}

export function isDelivery(x: unknown): x is Delivery {
  if (typeof x !== 'object' || x === null || !('kind' in x)) return false;
  if (x.kind === 'pickup') return 'store' in x && typeof x.store === 'string';
  if (x.kind === 'post') return 'days' in x && typeof x.days === 'number';
  if (x.kind === 'courier') return 'fee' in x && typeof x.fee === 'number';
  return false;
}

export function errorText(thrown: unknown): string {
  if (thrown instanceof Error) return thrown.message;
  if (typeof thrown === 'string') return thrown;
  return 'Unknown error';
}

export function track(delivery: Delivery, tracking: string): Tracked {
  return { ...delivery, tracking };
}
