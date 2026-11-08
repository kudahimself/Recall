# Order loader

Topic: TS Project (Web Dev, TypeScript).
Time: about 30 minutes.

## Task

Write the edge of the shop's order screen in `orderLoader.ts`, where orders come in from outside, as text or from a fetch.
A function that can fail returns a typed result envelope instead of throwing, and data from outside becomes a typed value only after a type guard has checked it at runtime.
`FetchLike`, the part of `fetch` the file uses, is written for you: a real `fetch` fits it, and the tests pass a fake one.

- `Result<T>` is a generic discriminated union on `ok`: `{ ok: true; data: T }` or `{ ok: false; error: string }`.
- `Guard<T>` is the type of a type guard function: `(x: unknown) => x is T`.
- `Order` is an interface: an `id` number, a `title` string and `copies`, a number.
- `isOrder(x)` is a `Guard<Order>`: true only for an object whose `id` and `copies` are numbers and whose `title` is a string.
- `arrayOf(isT)` makes a guard for an array whose every item passes `isT`, so `arrayOf(isOrder)` is a `Guard<Order[]>`.
- `parseJson(text, isT)` parses the text and checks it with the guard, returning the value as `data` when it passes, the error `"wrong shape"` when it does not, and `"not JSON"` when the text does not parse; it never throws.
  It is generic, so `parseJson(text, isOrder)` is a `Result<Order>`.
- `fetchJson(url, isT, fetchFn)` fetches the URL with `fetchFn`, then checks the JSON body with the guard, returning a `Promise` of a `Result` that never rejects.
  Its errors are `"network error"` when `fetchFn` rejects, `"HTTP 404"` (with the real status) when the response is not ok, `"not JSON"` when `json()` rejects, and `"wrong shape"` when the guard fails.
- `copiesOrdered(results)` adds up the copies of the results that are ok, counting the failed ones as nothing.

## Examples

```ts
parseJson('{"id":7,"title":"Emma","copies":2}', isOrder)   // { ok: true, data: { id: 7, ... } }
parseJson('{"id":"7"}', isOrder)                            // { ok: false, error: "wrong shape" }
await fetchJson("/orders/8", isOrder, fetch)                // { ok: false, error: "HTTP 404" } when it is gone

const r = parseJson(text, isOrder);
r.data                       // does not compile: check r.ok first
if (r.ok) r.data.copies      // a number
```

`fetch` rejects only when the network fails, so an HTTP error such as a 404 needs its own check of `response.ok`.
Never cast the parsed value with `as Order`: the guard is what makes the envelope's type true when the code runs.

The tests run your functions, and they also hand the TypeScript compiler a few lines that use your types, through `typecheck.js`, with the strict settings VS Code uses.
A line under `// @ts-expect-error` must fail to compile, and its comment says what should be rejected.
`Equals<A, B>` in those lines is true only when the two types are exactly the same.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/ts_project
npm test
```

Every test fails until you fill in the types and the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
