/**
 * The kinds of lesson worked example that cannot run where check-lessons.js
 * runs, and so may set `worked.runs: false` (their output is checked by hand).
 * Each test is narrow on purpose: any other example must run.
 * check-lessons.js refuses `runs: false` on code matching none of them, and
 * the rule card names what the matching kind needs to run.
 */
export interface NonRunnableKind {
  /** What the example is, as the checker's refusal names it. */
  kind: string;
  /** What it would need to run, as the rule card says it. */
  needs: string;
  test: (code: string) => boolean;
}

export const NON_RUNNABLE_KINDS: NonRunnableKind[] = [
  {
    kind: 'a Django / DRF example that imports the framework',
    needs: 'a Django project',
    test: code => /^\s*(from|import)\s+(django|rest_framework)\b/m.test(code),
  },
  {
    // Top-level `on:` and `jobs:`, and a job's `runs-on:`.
    kind: 'a GitHub Actions workflow',
    needs: 'a GitHub Actions runner',
    test: code => /^on:/m.test(code) && /^jobs:\s*$/m.test(code) && /^\s+runs-on:\s*\S/m.test(code),
  },
  {
    // A top-level `server {` block holding a `listen` directive and a `location ... {` block.
    kind: 'an Nginx config',
    needs: 'an Nginx server',
    test: code => /^server\s*\{/m.test(code) && /^\s+listen\s+\S/m.test(code) && /^\s+location\s+[^{\n]+\{/m.test(code),
  },
];

/** The non-runnable kind a worked example's code is, if any. */
export function nonRunnableKind(code: string): NonRunnableKind | undefined {
  return NON_RUNNABLE_KINDS.find(k => k.test(code));
}
