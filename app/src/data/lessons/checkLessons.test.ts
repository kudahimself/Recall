/**
 * scripts/check-lessons.js runs as part of `npm test`: every lesson must
 * pass it. The checker runs in its own Node process (it loads the bank with
 * sucrase and runs worked examples on sql.js and python3), and the cases
 * below prove it fails what it should.
 */
import { execFileSync, spawnSync } from 'child_process';
import path from 'path';

const APP = path.join(__dirname, '..', '..', '..');
const SCRIPT = path.join(APP, 'scripts', 'check-lessons.js');

/** Run `body` in Node with the checker loaded as `C` and print its JSON result. */
function probe(body: string): any {
  const code = `const C = require(${JSON.stringify(SCRIPT)}); (async () => { const r = await (async () => { ${body} })(); console.log(JSON.stringify(r)); })().catch(e => { console.error(e); process.exit(1); });`;
  const out = execFileSync('node', ['-e', code], { cwd: APP, encoding: 'utf8', timeout: 60000 });
  return JSON.parse(out.trim().split('\n').pop() as string);
}

jest.setTimeout(120000);

test('every lesson passes check-lessons.js', () => {
  const r = spawnSync('node', [SCRIPT], { cwd: APP, encoding: 'utf8', timeout: 120000 });
  if (r.status !== 0) throw new Error(`check-lessons.js failed:\n${r.stdout}\n${r.stderr}`);
  expect(r.stdout).toMatch(/lessons checked: \d+ pass, 0 fail/);
});

test('the T-SQL layer covers TOP, OFFSET/FETCH and the date functions, and refuses what SQLite would run differently', () => {
  const r = probe(`
    const top = await C.runSql("SELECT TOP (2) n FROM t ORDER BY n DESC;", [{ name: 't', columns: ['n'], rows: [[1], [3], [2]] }]);
    const page = await C.runSql("SELECT n FROM t ORDER BY n OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY;", [{ name: 't', columns: ['n'], rows: [[1], [3], [2]] }]);
    const dates = await C.runSql("SELECT DATEDIFF(month, '2026-01-31', '2026-02-01') AS m, DATEDIFF(year, '2025-12-31', '2026-01-01') AS y, DATEADD(month, 1, '2026-01-31') AS a, EOMONTH('2024-02-10') AS e, LEN('ab  ') AS l, CHARINDEX('@', 'a@b') AS c;");
    const now = await C.runSql("SELECT GETDATE();");
    const plus = await C.runSql("SELECT 'a' + 'b';");
    const unordered = await C.runSql("SELECT n FROM t;", [{ name: 't', columns: ['n'], rows: [[1], [2]] }]);
    const batches = await C.runSql("CREATE VIEW v AS SELECT n FROM t WHERE n > 1\\nGO\\nSELECT n FROM v ORDER BY n;", [{ name: 't', columns: ['n'], rows: [[1], [3], [2]] }]);
    return { top, page, dates, now, plus, unordered, batches };
  `);
  expect(r.top.output).toBe('n\n3\n2');
  expect(r.page.output).toBe('n\n2');
  expect(r.dates.output).toBe('m | y | a | e | l | c\n1 | 1 | 2026-02-28 | 2024-02-29 | 2 | 2');
  expect(r.now.error).toMatch(/not supported/);
  expect(r.plus.error).toMatch(/CONCAT/);
  expect(r.unordered.error).toMatch(/without ORDER BY/);
  expect(r.batches.output).toBe('n\n2\n3');
});

test('a lesson fails on a wrong output, exercises out of ramp order, a repeated solution and broken prose', () => {
  const r = probe(`
    const { LESSONS } = require('./src/data/lessons/index.ts');
    const base = LESSONS.find(l => l.id === 'tsql_select/1');
    const solution = require('./src/data/questions.ts').questions.find(q => q.id === 'tsql-select-1').solution;
    const bad = {
      ...base,
      idea: ['One sentence. Two sentences on a line.', 'Fine \\u2014 but an em dash.'],
      exercises: ['tsql-select-1', 'tsql-select-mcq-1', 'tsql-select-predict-1'],
      worked: { ...base.worked, tables: [{ name: 'dbo.DimProduct', columns: ['ProductName', 'Category', 'Price'], rows: [['A', 'Books', 1]] }], code: solution, output: 'nope' },
    };
    return (await C.checkLesson(bad, new Set())).errors;
  `);
  const all = r.join('\n');
  expect(all).toMatch(/not in ramp order/);
  expect(all).toMatch(/first exercise is a cold write/);
  expect(all).toMatch(/prints something else/);
  expect(all).toMatch(/repeats tsql-select-1 verbatim/);
  expect(all).toMatch(/two sentences on one line/);
  expect(all).toMatch(/em dash/);
});

test('a Python worked example runs on python3', () => {
  const r = probe(`return C.runPython("def gen():\\n    yield 1\\n    yield 2\\nprint(list(gen()))");`);
  expect(r.output).toBe('[1, 2]');
});
