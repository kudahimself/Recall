# Delivery options

Topic: Advanced Types (unions, guards, narrowing) (Web Dev, TypeScript).
Time: about 25 minutes.

## Task

Model the shop's delivery options in `delivery.ts` as a discriminated union, then write the checks that narrow a value to one of them.

- `Delivery` is a union of three variants, each with a literal `kind`: `{ kind: "pickup"; store: string }`, `{ kind: "post"; days: number }` and `{ kind: "courier"; fee: number }`.
- `Tracked` is a `Delivery` with a `tracking` string as well: an intersection, `&`.
- `SHIPPING` is `{ post: 2.5, courier: 6 }`, checked against `Partial<Record<Delivery["kind"], number>>` with `satisfies`, which keeps the object's own type, so `SHIPPING.post` is known to be there and `SHIPPING.pickup` is not.
- `assertNever(value)` takes a `never` and throws ``Error(`Unexpected delivery: ${JSON.stringify(value)}`)``, so calling it where a variant was left unhandled does not compile.
- `eta(delivery)` says when it arrives, with a `switch` on `kind` that handles every variant and calls `assertNever` in its `default` case: `collect at Leeds`, `3 days by post`, `next day, 5 extra`.
- `shippingCost(delivery)` is 0 for a pickup, `SHIPPING.post` for the post, and `SHIPPING.courier` plus the courier's own fee for a courier.
- `isDelivery(x)` is a type guard, `x is Delivery`: true only for an object with one of the three kinds and that kind's field of the right type.
- `errorText(thrown)` takes something thrown, typed `unknown`, and returns an `Error`'s message, a string as it is, or `Unknown error`, narrowing with `instanceof` and `typeof`.
- `track(delivery, tracking)` returns a new `Tracked` delivery, leaving the one it is given unchanged.

## Examples

```ts
eta({ kind: "post", days: 3 })                  // "3 days by post"
shippingCost({ kind: "courier", fee: 5 })       // 11
isDelivery({ kind: "post", days: "3" })         // false: days must be a number
errorText(new Error("card declined"))           // "card declined"
const d: Delivery = { kind: "post", store: "Leeds" };   // does not compile
```

The tests run your functions, and they also hand the TypeScript compiler a few lines that use them, through `typecheck.js`, with the strict settings VS Code uses.
A line under `// @ts-expect-error` must fail to compile, and its comment says what should be rejected: one of them leaves the courier out of a `switch`, so `assertNever` must refuse what is left.
`Equals<A, B>` in those lines is true only when the two types are exactly the same.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/ts_advanced_types
npm test
```

Every test fails until you fill in the types and the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
