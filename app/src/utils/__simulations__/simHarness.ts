/**
 * Shared plumbing for the selector simulations in this directory.
 *
 * Seeded PRNG so runs are reproducible: `selectNextQuestion` consumes
 * Math.random for the new-vs-review coin flip, the weighted candidate pick, and
 * concept-aware bucket sampling. Without pinning it, every invocation produces a
 * different stream and the reports cannot be diffed across a tuning change.
 */

/** mulberry32 - small, fast, good enough distribution for simulation work. */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Run `fn` with Math.random pinned to a seeded stream, restoring it after. */
export function withSeededRandom<T>(seed: number, fn: () => T): T {
  const original = Math.random;
  Math.random = seededRandom(seed);
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}
