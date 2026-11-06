/**
 * scripts/check-outcomes.js runs as part of `npm test`: every predict-the-outcome
 * answer must come out of running its check (SQL on sql.js, or python3). The
 * checker runs in its own Node process, as check-lessons.js does.
 */
import { spawnSync } from 'child_process';
import path from 'path';

const APP = path.join(__dirname, '..', '..');
const SCRIPT = path.join(APP, 'scripts', 'check-outcomes.js');

jest.setTimeout(120000);

test('every predict-the-outcome answer is what running its check gives', () => {
  const r = spawnSync('node', [SCRIPT], { cwd: APP, encoding: 'utf8', timeout: 120000 });
  if (r.status !== 0) throw new Error(`check-outcomes.js failed:\n${r.stdout}\n${r.stderr}`);
  expect(r.stdout).toMatch(/outcome checks: \d+ pass, 0 problems/);
});
