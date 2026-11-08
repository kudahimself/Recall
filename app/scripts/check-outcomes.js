#!/usr/bin/env node
/**
 * Checks every predict-the-outcome answer by running it. Run by `npm test`
 * (src/data/outcomeChecks.test.ts) and on its own:
 *
 *   node scripts/check-outcomes.js
 *
 * Each predict-the-outcome card needs an entry in a checks registry
 * (src/data/dataEngineeringMovingDataChecks.ts, dataEngineeringStorageFilesChecks.ts,
 * dataEngineeringWarehousesLakesChecks.ts, dataEngineeringModelingAnalyticsChecks.ts,
 * dataEngineeringStreamingChecks.ts, dataEngineeringDistributedChecks.ts,
 * dataEngineeringOpsChecks.ts):
 * SQL run on SQLite (sql.js)
 * after the card's `tables` are created, each named by the first word of its
 * title, or Python run on python3 -I. The last result set (rows joined by
 * newlines, cells by `|`) or what Python prints must equal `expect`, or the
 * card's `answer` when there is none. A check may also cover another card
 * type (a spot-the-flaw result table, through `expect`).
 *
 * It fails when a predict-the-outcome card has no check, a check names no
 * card, a check does not run, or it gives something other than the answer.
 */
const path = require('path');
const { spawnSync } = require('child_process');

const APP = path.join(__dirname, '..');
require(require.resolve('sucrase/register/ts', { paths: [APP] }));

const { questions } = require(path.join(APP, 'src/data/questions.ts'));
const { MOVING_DATA_OUTCOME_CHECKS } = require(path.join(APP, 'src/data/dataEngineeringMovingDataChecks.ts'));

const { STORAGE_FILES_OUTCOME_CHECKS } = require(path.join(APP, 'src/data/dataEngineeringStorageFilesChecks.ts'));

const { WAREHOUSES_LAKES_OUTCOME_CHECKS } = require(path.join(APP, 'src/data/dataEngineeringWarehousesLakesChecks.ts'));

const { MODELING_ANALYTICS_OUTCOME_CHECKS } = require(path.join(APP, 'src/data/dataEngineeringModelingAnalyticsChecks.ts'));

const { STREAMING_OUTCOME_CHECKS } = require(path.join(APP, 'src/data/dataEngineeringStreamingChecks.ts'));

const { DISTRIBUTED_OUTCOME_CHECKS } = require(path.join(APP, 'src/data/dataEngineeringDistributedChecks.ts'));

const { OPS_OUTCOME_CHECKS } = require(path.join(APP, 'src/data/dataEngineeringOpsChecks.ts'));

const CHECKS = {
  ...MOVING_DATA_OUTCOME_CHECKS,
  ...STORAGE_FILES_OUTCOME_CHECKS,
  ...WAREHOUSES_LAKES_OUTCOME_CHECKS,
  ...MODELING_ANALYTICS_OUTCOME_CHECKS,
  ...STREAMING_OUTCOME_CHECKS,
  ...DISTRIBUTED_OUTCOME_CHECKS,
  ...OPS_OUTCOME_CHECKS,
};

/** The SQL name of a shown table: the first word of its title, e.g. `fact_orders (before)` -> fact_orders. */
function tableName(title) {
  const m = /^[A-Za-z_]\w*/.exec(title);
  if (!m) throw new Error(`table title has no SQL name: ${title}`);
  return m[0];
}

function columnType(values) {
  const present = values.filter(v => v !== null && v !== undefined);
  if (present.length > 0 && present.every(v => typeof v === 'number' && Number.isInteger(v))) return 'INTEGER';
  if (present.length > 0 && present.every(v => typeof v === 'number')) return 'REAL';
  return 'TEXT';
}

function format(rows) {
  return rows.map(r => r.map(v => (v === null ? 'NULL' : String(v))).join('|')).join('\n');
}

let sqlEngine = null;
async function runSql(script, tables) {
  if (!sqlEngine) sqlEngine = await require('sql.js')();
  const db = new sqlEngine.Database();
  try {
    for (const t of tables || []) {
      const name = tableName(t.name);
      const cols = t.columns.map((c, i) => `${c} ${columnType(t.rows.map(r => r[i]))}`);
      db.exec(`CREATE TABLE ${name} (${cols.join(', ')});`);
      const insert = db.prepare(`INSERT INTO ${name} VALUES (${t.columns.map(() => '?').join(', ')});`);
      for (const r of t.rows) insert.run(r);
      insert.free();
    }
    const results = db.exec(script);
    if (results.length === 0) return { error: 'the check returned no result set' };
    return { output: format(results[results.length - 1].values) };
  } catch (e) {
    return { error: String(e.message || e) };
  } finally {
    db.close();
  }
}

function runPython(script) {
  const r = spawnSync('python3', ['-I', '-c', script], { encoding: 'utf8', timeout: 10000 });
  if (r.error) return { error: `python3 could not run: ${r.error.message}` };
  if (r.status !== 0) return { error: `python3 exited ${r.status}: ${(r.stderr || '').trim().split('\n').slice(-1)[0]}` };
  return { output: r.stdout.replace(/\s+$/, '') };
}

async function main() {
  const byId = new Map(questions.map(q => [q.id, q]));
  const errors = [];
  let passed = 0;

  for (const q of questions) {
    if (q.type === 'predict_outcome' && !CHECKS[q.id]) errors.push(`${q.id}: predict-the-outcome card with no check`);
  }
  for (const [id, check] of Object.entries(CHECKS)) {
    const q = byId.get(id);
    if (!q) { errors.push(`${id}: check names no card in the bank`); continue; }
    const expected = check.expect !== undefined ? check.expect : q.answer;
    if (expected === undefined) { errors.push(`${id}: no answer and no expect`); continue; }
    let r;
    if (check.python) r = runPython(check.python);
    else if (check.sql) r = await runSql(typeof check.sql === 'function' ? check.sql(q) : check.sql, q.tables);
    else r = { error: 'the check has neither sql nor python' };
    if (r.error) errors.push(`${id}: the check does not run: ${r.error}`);
    else if (r.output.trim() !== String(expected).trim()) errors.push(`${id}: the check gives ${JSON.stringify(r.output)}, the card says ${JSON.stringify(expected)}`);
    else passed++;
  }

  for (const e of errors) console.log(`FAIL  ${e}`);
  console.log(`\n${Object.keys(CHECKS).length} outcome checks: ${passed} pass, ${errors.length} problems.`);
  process.exit(errors.length > 0 ? 1 : 0);
}

module.exports = { runSql, tableName };

if (require.main === module) {
  main().catch(e => {
    console.error(e);
    process.exit(1);
  });
}
