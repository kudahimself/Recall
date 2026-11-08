// Runs the tests of the folder you start `npm test` from: an exercise folder runs
// that exercise, this folder runs every Web Dev exercise. Leave it as it is.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const here = path.dirname(fileURLToPath(import.meta.url));
// npm sets INIT_CWD to the folder `npm test` was typed in.
const from = path.resolve(process.env.INIT_CWD ?? here);
const dir = from.startsWith(here + path.sep) ? from : here;

export default defineConfig({
  test: {
    dir,
    include: ['**/*.test.{js,jsx,ts}'],
    environment: 'node',
    // A TypeScript exercise's first type check reads the compiler and its library, a few seconds on a busy machine.
    testTimeout: 30000,
  },
});
