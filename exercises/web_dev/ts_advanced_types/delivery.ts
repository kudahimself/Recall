/**
 * Delivery: the shop's delivery options as a discriminated union, and the
 * checks that narrow a value to one of them.
 *
 * Fill in the types and the functions so the tests in delivery.test.ts pass.
 * Run them from this folder with: npm test
 * The tests also type-check this file with strict settings (tsconfig.json),
 * so type every parameter and return.
 */

/**
 * TODO: a discriminated union of three variants, each with a literal `kind`:
 * - { kind: "pickup", store: a string }
 * - { kind: "post", days: a number }
 * - { kind: "courier", fee: a number }
 */
export type Delivery = unknown;

/** TODO: a Delivery with a tracking code as well (a string): an intersection. */
export type Tracked = unknown;

/**
 * Shipping costs for the kinds that have one: post 2.5 and courier 6.
 * TODO: check it against Partial<Record<Delivery["kind"], number>> with
 * `satisfies`, which keeps its own type, so SHIPPING.post is known to be there.
 */
export const SHIPPING = {};

/**
 * Throws Error(`Unexpected delivery: ${JSON.stringify(value)}`). It takes a
 * `never`, so calling it where a variant was left unhandled does not compile.
 */
export function assertNever(value) {
  // TODO
  throw new Error('TODO: assertNever');
}

/**
 * When it arrives, with a switch on `kind` that handles every variant and
 * calls assertNever in its default case:
 * "collect at Leeds", "3 days by post", "next day, 5 extra".
 */
export function eta(delivery) {
  // TODO
  throw new Error('TODO: eta');
}

/**
 * The cost of shipping: 0 for a pickup, SHIPPING.post for the post, and
 * SHIPPING.courier plus the courier's own fee for a courier.
 */
export function shippingCost(delivery) {
  // TODO
  throw new Error('TODO: shippingCost');
}

/**
 * A type guard, `x is Delivery`: true only for an object with one of the three
 * kinds and its field of the right type, so { kind: "post", days: "3" } is not one.
 */
export function isDelivery(x) {
  // TODO
  throw new Error('TODO: isDelivery');
}

/**
 * The text of something thrown, which is `unknown`: an Error's message, a string
 * as it is, and "Unknown error" for anything else, narrowed with instanceof and typeof.
 */
export function errorText(thrown) {
  // TODO
  throw new Error('TODO: errorText');
}

/** A new Tracked delivery: the delivery's fields plus `tracking`; the delivery is not changed. */
export function track(delivery, tracking) {
  // TODO
  throw new Error('TODO: track');
}
