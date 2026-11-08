/**
 * scripts/check-lessons.js runs as part of `npm test`: every lesson must
 * pass it. The checker runs in its own Node process (it loads the bank with
 * sucrase and runs worked examples on sql.js, python3 and node), and the cases
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

test('ROLLUP, CUBE and GROUPING SETS run as the UNION ALL of their grouping sets, and other shapes are refused', () => {
  const r = probe(`
    const t = [{ name: 't', columns: ['a', 'b', 'n'], rows: [['x', 'p', 1], ['x', 'q', 2], ['y', 'p', 4]] }];
    const v = [{ name: 'v', columns: ['cat', 'amt'], rows: [['A', 10], ['B', 5], ['A', 20]] }];
    const rollup = await C.runSql("SELECT a, b, SUM(n) AS s, GROUPING(b) AS g FROM t GROUP BY ROLLUP(a, b) ORDER BY a, g, b;", t);
    const cube = await C.runSql("SELECT a, b, SUM(n) AS s FROM t GROUP BY CUBE(a, b) ORDER BY a, b;", t);
    const sets = await C.runSql("SELECT a, SUM(n) AS s FROM t WHERE n > 1 GROUP BY GROUPING SETS ((a), ()) ORDER BY a;", t);
    // tsql-gs-rollup-predict-1 on a table instead of VALUES, ordered by GROUPING's alias.
    const predict = await C.runSql("SELECT cat, SUM(amt) AS total, GROUPING(cat) AS g FROM v GROUP BY ROLLUP(cat) ORDER BY g, cat;", v);
    const inExpr = await C.runSql("SELECT a, COUNT(a) AS c FROM t GROUP BY ROLLUP(a) ORDER BY a;", t);
    const having = await C.runSql("SELECT a, SUM(n) AS s FROM t GROUP BY ROLLUP(a) HAVING SUM(n) > 1 ORDER BY a;", t);
    return { rollup, cube, sets, predict, inExpr, having };
  `);
  expect(r.rollup.output).toBe('a | b | s | g\nNULL | NULL | 7 | 1\nx | p | 1 | 0\nx | q | 2 | 0\nx | NULL | 3 | 1\ny | p | 4 | 0\ny | NULL | 4 | 1');
  expect(r.cube.output).toBe('a | b | s\nNULL | NULL | 7\nNULL | p | 5\nNULL | q | 2\nx | NULL | 3\nx | p | 1\nx | q | 2\ny | NULL | 4\ny | p | 4');
  expect(r.sets.output).toBe('a | s\nNULL | 6\nx | 2\ny | 4');
  expect(r.predict.output).toBe('cat | total | g\nA | 30 | 0\nB | 5 | 0\nNULL | 35 | 1');
  expect(r.inExpr.error).toMatch(/grouping column inside an expression/);
  expect(r.having.error).toMatch(/anything but ORDER BY/);
});

test('procedural T-SQL runs with SQL Server semantics: variables, control flow, transactions, TRY ... CATCH, procedures and functions', () => {
  const r = probe(`
    const T = [{ name: 't', columns: ['id', 'n'], rows: [[1, 5], [2, 0]] }];
    const run = code => C.runSql(code, T);
    return {
      flow: await run("DECLARE @i INT = 1, @s INT = 0;\\nWHILE @i <= 4\\nBEGIN\\n  SET @s += @i;\\n  SET @i = @i + 1;\\nEND\\nIF @s % 2 = 0 PRINT 'even'; ELSE PRINT 'odd';\\nPRINT @s;"),
      nested: await run("BEGIN TRAN; BEGIN TRAN; PRINT @@TRANCOUNT; COMMIT; PRINT @@TRANCOUNT; ROLLBACK; PRINT @@TRANCOUNT;"),
      save: await run("BEGIN TRAN;\\nUPDATE t SET n = n - 1 WHERE id = 1;\\nSAVE TRAN sp;\\nUPDATE t SET n = 99 WHERE id = 1;\\nROLLBACK TRAN sp;\\nCOMMIT;\\nSELECT n FROM t WHERE id = 1;"),
      doomed: await run("CREATE TABLE c (q INT CHECK (q >= 0)); INSERT INTO c VALUES (1);\\nSET XACT_ABORT ON;\\nBEGIN TRY BEGIN TRAN; UPDATE c SET q = q - 5; COMMIT; END TRY\\nBEGIN CATCH PRINT ERROR_NUMBER(); PRINT XACT_STATE(); IF XACT_STATE() <> 0 ROLLBACK; END CATCH\\nSELECT q FROM c;"),
      rethrow: await run("BEGIN TRY BEGIN TRY THROW 50002, 'inner', 1; PRINT 'skipped'; END TRY BEGIN CATCH PRINT 'cleanup'; THROW; END CATCH END TRY BEGIN CATCH PRINT CONCAT(ERROR_NUMBER(), ' ', ERROR_MESSAGE()); END CATCH"),
      proc: await run("CREATE PROCEDURE dbo.Total @min INT, @sum INT OUTPUT, @extra INT = 0 AS BEGIN IF @min < 0 RETURN 1; SELECT @sum = SUM(n) + @extra FROM t WHERE id >= @min; RETURN 0; END\\nGO\\nDECLARE @a INT = -1, @rc INT;\\nEXEC @rc = dbo.Total @min = 1, @sum = @a;\\nPRINT @a;\\nEXEC @rc = dbo.Total 1, @a OUTPUT, 10;\\nPRINT CONCAT(@rc, ' ', @a);\\nEXEC @rc = dbo.Total -1, @a OUTPUT;\\nPRINT CONCAT(@rc, ' ', @a);"),
      fn: await run("CREATE FUNCTION dbo.Fee (@d INT) RETURNS INT AS BEGIN IF @d <= 0 RETURN 0; RETURN @d * 5; END;\\nGO\\nSELECT id, dbo.Fee(n) AS fee FROM t ORDER BY id;\\nPRINT CONCAT('fee ', dbo.Fee(3));"),
      hint: await run("SELECT n FROM t WITH (UPDLOCK, HOLDLOCK) WHERE id = 1;"),
      uncaught: await run("THROW 50001, 'boom', 1;"),
      engineText: await run("CREATE TABLE c (q INT CHECK (q >= 0)); BEGIN TRY INSERT INTO c VALUES (-1); END TRY BEGIN CATCH PRINT ERROR_MESSAGE(); END CATCH"),
      leftOpen: await run("BEGIN TRAN; UPDATE t SET n = 1;"),
      batchScope: await run("DECLARE @a INT = 1;\\nGO\\nPRINT @a;"),
      stringPlus: await run("DECLARE @s VARCHAR(10) = 'a'; PRINT @s + 'b';"),
      decimalVar: await run("DECLARE @d DECIMAL(10, 2) = 1.5;"),
      mismatch: await run("CREATE PROC dbo.Leaky AS BEGIN BEGIN TRAN; END\\nGO\\nBEGIN TRY EXEC dbo.Leaky; END TRY BEGIN CATCH PRINT ERROR_NUMBER(); IF @@TRANCOUNT > 0 ROLLBACK; END CATCH"),
      noSemis: await run("BEGIN TRAN\\nUPDATE t SET n = n - 1 WHERE id = 1;\\nSAVE TRAN sp\\nUPDATE t SET n = 99 WHERE id = 1;\\nROLLBACK TRAN sp\\nCOMMIT\\nSELECT n FROM t WHERE id = 1;\\nDECLARE @i INT = 0;\\nWHILE 1 = 1 BEGIN SET @i += 1; IF @i >= 3 BREAK END\\nPRINT @i"),
      namedTran: await run("BEGIN TRANSACTION upd\\nUPDATE t SET n = 7 WHERE id = 2;\\nROLLBACK TRANSACTION upd\\nSELECT n FROM t WHERE id = 2"),
      brackets: await run("SELECT n AS [Left], id AS [Row Id] FROM [t] WHERE [id] = 1;"),
    };
  `);
  expect(r.flow.output).toBe('even\n10');
  expect(r.nested.output).toBe('2\n1\n0');
  expect(r.save.output).toBe('n\n4');
  expect(r.doomed.output).toBe('547\n-1\n\nq\n1');
  expect(r.rethrow.output).toBe('cleanup\n50002 inner');
  // No OUTPUT at the call: @a keeps -1. An early RETURN leaves the OUTPUT value as passed in.
  expect(r.proc.output).toBe('-1\n0 15\n1 15');
  expect(r.fn.output).toBe('id | fee\n1 | 25\n2 | 0\n\nfee 15');
  expect(r.hint.output).toBe('n\n5');
  expect(r.uncaught.error).toMatch(/uncaught error 50001/);
  expect(r.engineText.error).toMatch(/ERROR_MESSAGE\(\) of engine error 547/);
  expect(r.leftOpen.error).toMatch(/transaction still open/);
  expect(r.batchScope.error).toMatch(/@a is not declared/);
  expect(r.stringPlus.error).toMatch(/CONCAT/);
  expect(r.decimalVar.error).toMatch(/DECIMAL variable/);
  expect(r.mismatch.output).toBe('266');
  expect(r.noSemis.output).toBe('n\n4\n\n3');
  expect(r.namedTran.output).toBe('n\n0');
  expect(r.brackets.output).toBe('Left | Row Id\n5 | 1');
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

test('a JavaScript worked example runs on node, drains its promises and timers, and fails on an uncaught error', () => {
  const r = probe(`
    const ok = C.runJavaScript("setTimeout(() => console.log('timer'), 0);\\nPromise.resolve().then(() => console.log('then'));\\nconsole.log('sync');");
    const thrown = C.runJavaScript("null.x;");
    const rejected = C.runJavaScript("Promise.reject(new Error('no stock'));");
    return { ok, thrown, rejected };
  `);
  expect(r.ok.output).toBe('sync\nthen\ntimer');
  expect(r.thrown.error).toMatch(/^node exited 1: TypeError/);
  expect(r.rejected.error).toMatch(/^node exited 1: Error: no stock/);
});

test('a Django worked example, a GitHub Actions workflow, an Nginx config or a Databricks notebook cell with runs: false is not run, and runs: false elsewhere fails', () => {
  const r = probe(`
    const { LESSONS } = require('./src/data/lessons/index.ts');
    const base = LESSONS.find(l => l.id === 'tsql_select/1');
    const django = { ...base, worked: { ...base.worked, language: 'python', tables: undefined, runs: false, code: 'from django.urls import reverse\\nprint(reverse("home"))', output: '/' } };
    const workflow = { ...base, worked: { ...base.worked, language: 'python', tables: undefined, runs: false, code: 'on: push\\njobs:\\n  test:\\n    runs-on: ubuntu-latest\\n    steps:\\n      - run: echo ok', output: 'ok' } };
    const nginx = { ...base, worked: { ...base.worked, language: 'python', tables: undefined, runs: false, code: 'server {\\n    listen 80;\\n    location / {\\n        proxy_pass http://app;\\n    }\\n}', output: 'app' } };
    const locationOnly = { ...base, worked: { ...base.worked, language: 'python', tables: undefined, runs: false, code: 'location / {\\n    proxy_pass http://app;\\n}', output: 'app' } };
    const yamlOnly = { ...base, worked: { ...base.worked, language: 'python', tables: undefined, runs: false, code: 'steps:\\n  - run: echo ok', output: 'ok' } };
    const notebook = { ...base, worked: { ...base.worked, language: 'python', tables: undefined, runs: false, code: 'print(spark.table("main.s.t").count())', output: '3' } };
    const sdk = { ...base, worked: { ...base.worked, language: 'python', tables: undefined, runs: false, code: 'from databricks.sdk import WorkspaceClient\\nprint(WorkspaceClient().current_user.me().active)', output: 'True' } };
    const ownSession = { ...base, worked: { ...base.worked, language: 'python', tables: undefined, runs: false, code: 'from pyspark.sql import SparkSession\\nspark = SparkSession.builder.getOrCreate()\\nprint(spark.range(3).count())', output: '3' } };
    const plain = { ...base, worked: { ...base.worked, language: 'python', tables: undefined, runs: false, code: 'print(1)', output: '1' } };
    const errors = async l => (await C.checkLesson(l, new Set())).errors;
    return { django: await errors(django), workflow: await errors(workflow), nginx: await errors(nginx), locationOnly: await errors(locationOnly), yamlOnly: await errors(yamlOnly), notebook: await errors(notebook), sdk: await errors(sdk), ownSession: await errors(ownSession), plain: await errors(plain) };
  `);
  expect(r.django.join('\n')).not.toMatch(/does not run|prints something else|runs: false/);
  expect(r.workflow.join('\n')).not.toMatch(/does not run|prints something else|runs: false/);
  expect(r.nginx.join('\n')).not.toMatch(/does not run|prints something else|runs: false/);
  expect(r.locationOnly.join('\n')).toMatch(/runs: false is only for a Django/);
  expect(r.yamlOnly.join('\n')).toMatch(/runs: false is only for a Django/);
  expect(r.notebook.join('\n')).not.toMatch(/does not run|prints something else|runs: false/);
  expect(r.sdk.join('\n')).not.toMatch(/does not run|prints something else|runs: false/);
  // Code that builds its own SparkSession runs anywhere pyspark is installed, so it must run.
  expect(r.ownSession.join('\n')).toMatch(/runs: false is only for a Django/);
  expect(r.plain.join('\n')).toMatch(/runs: false is only for a Django/);
});

test('an HTML or CSS worked example with runs: false is not run, and the kind holds only for those languages', () => {
  const r = probe(`
    const { LESSONS } = require('./src/data/lessons/index.ts');
    const base = LESSONS.find(l => l.id === 'tsql_select/1');
    const worked = (language, code) => ({ ...base, worked: { ...base.worked, language, tables: undefined, runs: false, code, output: 'Hi' } });
    const html = worked('html', '<p class="sm:text-center">Hi</p>');
    const css = worked('css', '.card {\\n  padding: 20px;\\n}');
    const pythonHtml = worked('python', 'print("<p>Hi</p>")');
    const textOnly = worked('html', 'Hi');
    const errors = async l => (await C.checkLesson(l, new Set())).errors;
    return { html: await errors(html), css: await errors(css), pythonHtml: await errors(pythonHtml), textOnly: await errors(textOnly) };
  `);
  expect(r.html.join('\n')).not.toMatch(/does not run|prints something else|runs: false/);
  expect(r.css.join('\n')).not.toMatch(/does not run|prints something else|runs: false/);
  // Python that prints markup runs on python3, so it must run.
  expect(r.pythonHtml.join('\n')).toMatch(/runs: false is only for a Django/);
  expect(r.textOnly.join('\n')).toMatch(/runs: false is only for a Django/);
});
