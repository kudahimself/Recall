#!/usr/bin/env node
/**
 * Checks every lesson in src/data/lessons/ (TopicLesson). Run by `npm test`
 * (src/data/lessons/checkLessons.test.ts) and on its own:
 *
 *   node scripts/check-lessons.js            # all lessons
 *   node scripts/check-lessons.js tsql_joins # lessons of one topic
 *
 * A lesson fails when:
 *   - its id is not `${topicKeys[0]}/${step}`, is repeated, or its topicKeys
 *     are not exactly one courseConfig unit's keys;
 *   - it has fewer than 3 or more than 5 exercises, an exercise id is unknown,
 *     repeated, or of another topic, the exercises are not in ramp order
 *     (rampRank, ties in bank order), there is no multiple choice or no
 *     predict-output exercise, or the first exercise is a cold write;
 *   - its worked example does not run, or prints something other than
 *     `worked.output` (SQL on sql.js, Python on python3), or a SQL result of
 *     more than one row comes from a statement without ORDER BY (row order
 *     would then depend on the engine); an example of a kind that cannot run
 *     here (NON_RUNNABLE_KINDS in src/utils/workedKinds.ts: a Django / DRF
 *     example, a GitHub Actions workflow, an Nginx config) sets
 *     `worked.runs: false` and is not run (its output is verified by hand), and
 *     `runs: false` on any other example fails;
 *   - the worked example repeats an exercise's solution: the solution (or one
 *     of its `-- OR` / `# OR` forms) appears in it verbatim, or the worked code
 *     holds 80% or more of the solution's essential tokens (check-leaks.js
 *     token recall; 55% or more is printed as a warning);
 *   - its prose breaks the house rules: an em dash anywhere, or two sentences
 *     on one source line in idea, pitfall or steps.
 *
 * SQL worked examples are T-SQL, run on SQLite (sql.js) through a small,
 * explicit compatibility layer: TOP (n) and OFFSET ... FETCH become LIMIT,
 * ISNULL becomes IFNULL, and LEN, CHARINDEX, LEFT, RIGHT, YEAR, MONTH, DAY,
 * DATEPART, DATEADD, DATEDIFF, EOMONTH and DATEFROMPARTS are registered with
 * T-SQL semantics, GROUP BY ROLLUP / CUBE / GROUPING SETS becomes the UNION ALL
 * of its grouping sets, and a line holding only GO separates batches. Anything the
 * layer does not cover (GETDATE, CAST AS DATE, FORMAT, CONVERT, `+` on
 * strings, #temp tables, MERGE, UPDATE ... FROM) is refused with a message
 * rather than run with SQLite's different meaning, so an example that passes
 * prints what SQL Server prints. Table hints such as WITH (UPDLOCK) are
 * dropped, since they change locking, not what one session reads.
 * Procedural T-SQL (variables, PRINT, IF / WHILE, transactions and
 * savepoints, TRY ... CATCH and THROW, stored procedures and scalar functions)
 * runs through scripts/tsql-batch.js, which lists what it covers and refuses;
 * PRINT lines are printed in order with the result sets, consecutive lines
 * forming one block. Input tables come from `worked.tables`
 * (columns typed INTEGER, REAL or TEXT from their values).
 */
const path = require('path');
const { spawnSync } = require('child_process');

const APP = path.join(__dirname, '..');
require(require.resolve('sucrase/register/ts', { paths: [APP] }));
const { essentialTokens, splitAlternatives, stripNoise } = require('./check-leaks');
const { runBatches } = require('./tsql-batch');

const { questions } = require(path.join(APP, 'src/data/questions.ts'));
const { LESSONS } = require(path.join(APP, 'src/data/lessons/index.ts'));
const { rampRank } = require(path.join(APP, 'src/utils/spacedRepetition.ts'));
const { getSectionUnits, SQL_PATH_ORDER, BACKEND_PATH_ORDER, DATABRICKS_PATH_ORDER, WEBDEV_PATH_ORDER, DATA_ENG_PATH_ORDER } =
  require(path.join(APP, 'src/utils/courseConfig.ts'));
const { familyOf } = require(path.join(APP, 'src/utils/spacedRepetition.ts'));

const { NON_RUNNABLE_KINDS, nonRunnableKind } = require(path.join(APP, 'src/utils/workedKinds.ts'));

const MIN_EXERCISES = 3;
const MAX_EXERCISES = 5;
const LEAK_HIGH = 0.80;
const LEAK_MED = 0.55;

// ── Worked-example runners ──────────────────────────────────────────────────

/** Trailing whitespace per line and trailing blank lines are not output. */
function normalizeOutput(s) {
  return String(s).replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
}

function runPython(code) {
  const r = spawnSync('python3', ['-I', '-c', code], { encoding: 'utf8', timeout: 10000 });
  if (r.error) return { error: `python3 could not run: ${r.error.message}` };
  if (r.status !== 0) return { error: `python3 exited ${r.status}: ${(r.stderr || '').trim().split('\n').slice(-1)[0]}` };
  return { output: normalizeOutput(r.stdout) };
}

// T-SQL date helpers. Dates are 'YYYY-MM-DD' text (a time part is ignored).
function parseDate(v) {
  if (v === null || v === undefined) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v));
  if (!m) throw new Error(`not a date: ${v}`);
  return { y: +m[1], m: +m[2], d: +m[3] };
}
const daysInMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();
const pad = n => String(n).padStart(2, '0');
const fmtDate = ({ y, m, d }) => `${y}-${pad(m)}-${pad(d)}`;
const dayNumber = ({ y, m, d }) => Date.UTC(y, m - 1, d) / 86400000;
function addMonths(dt, n) {
  const total = dt.y * 12 + (dt.m - 1) + n;
  const y = Math.floor(total / 12);
  const m = (total % 12) + 1;
  return { y, m, d: Math.min(dt.d, daysInMonth(y, m)) };
}
const PARTS = {
  year: 'year', yy: 'year', yyyy: 'year',
  quarter: 'quarter', qq: 'quarter', q: 'quarter',
  month: 'month', mm: 'month', m: 'month',
  day: 'day', dd: 'day', d: 'day',
  dayofyear: 'dayofyear', dy: 'dayofyear', y: 'dayofyear',
  week: 'week', wk: 'week', ww: 'week',
};
function part(p) {
  const k = PARTS[String(p).toLowerCase()];
  if (!k) throw new Error(`date part not supported by the check: ${p}`);
  return k;
}

const TSQL_FUNCTIONS = {
  LEN: s => (s === null ? null : String(s).replace(/ +$/, '').length),
  CHARINDEX: (sub, s, start) => {
    if (sub === null || s === null) return null;
    const from = start === undefined || start === null || start < 1 ? 0 : start - 1;
    return String(s).indexOf(String(sub), from) + 1;
  },
  TSQL_LEFT: (s, n) => (s === null || n === null ? null : String(s).slice(0, Math.max(0, n))),
  TSQL_RIGHT: (s, n) => (s === null || n === null ? null : (n <= 0 ? '' : String(s).slice(-n))),
  YEAR: v => { const dt = parseDate(v); return dt && dt.y; },
  MONTH: v => { const dt = parseDate(v); return dt && dt.m; },
  DAY: v => { const dt = parseDate(v); return dt && dt.d; },
  DATEFROMPARTS: (y, m, d) => (y === null || m === null || d === null ? null : fmtDate({ y, m, d })),
  DATEPART: (p, v) => {
    const dt = parseDate(v);
    if (!dt) return null;
    switch (part(p)) {
      case 'year': return dt.y;
      case 'quarter': return Math.floor((dt.m - 1) / 3) + 1;
      case 'month': return dt.m;
      case 'day': return dt.d;
      case 'dayofyear': return dayNumber(dt) - dayNumber({ y: dt.y, m: 1, d: 1 }) + 1;
      default: throw new Error(`DATEPART ${p} not supported by the check`);
    }
  },
  DATEADD: (p, n, v) => {
    const dt = parseDate(v);
    if (!dt || n === null) return null;
    switch (part(p)) {
      case 'year': return fmtDate(addMonths(dt, 12 * n));
      case 'quarter': return fmtDate(addMonths(dt, 3 * n));
      case 'month': return fmtDate(addMonths(dt, n));
      case 'day': case 'dayofyear': {
        const t = new Date((dayNumber(dt) + n) * 86400000);
        return fmtDate({ y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() });
      }
      case 'week': return TSQL_FUNCTIONS.DATEADD('day', 7 * n, v);
      default: throw new Error(`DATEADD ${p} not supported by the check`);
    }
  },
  // DATEDIFF counts the part boundaries crossed between the two dates.
  DATEDIFF: (p, a, b) => {
    const x = parseDate(a);
    const y = parseDate(b);
    if (!x || !y) return null;
    switch (part(p)) {
      case 'year': return y.y - x.y;
      case 'quarter': return (y.y * 4 + Math.floor((y.m - 1) / 3)) - (x.y * 4 + Math.floor((x.m - 1) / 3));
      case 'month': return (y.y * 12 + y.m) - (x.y * 12 + x.m);
      case 'day': case 'dayofyear': return dayNumber(y) - dayNumber(x);
      default: throw new Error(`DATEDIFF ${p} not supported by the check`);
    }
  },
  EOMONTH: (v, n) => {
    const dt = parseDate(v);
    if (!dt) return null;
    const moved = addMonths({ ...dt, d: 1 }, n || 0);
    return fmtDate({ ...moved, d: daysInMonth(moved.y, moved.m) });
  },
};

const VARIADIC = new Set(['CHARINDEX', 'EOMONTH']);

// T-SQL the SQLite check would run with a different meaning, so it refuses it.
const UNSUPPORTED = [
  [/\b(GETDATE|SYSDATETIME|GETUTCDATE|NEWID|RAND)\s*\(|\bCURRENT_TIMESTAMP\b/i, 'a value that changes from run to run (GETDATE, NEWID, ...)'],
  [/#\w/, 'a #temp table'],
  [/\bTOP\s*\(?\s*\d+\s*\)?\s*(PERCENT|WITH\s+TIES)\b/i, 'TOP ... PERCENT / WITH TIES'],
  [/\bCAST\s*\([^)]*\bAS\s+(DATE|DATETIME2?|TIME|SMALLDATETIME)\b/i, 'CAST to a date or time type'],
  [/\b(FORMAT|CONVERT|TRY_CONVERT|STRING_AGG|STRING_SPLIT)\s*\(/i, 'FORMAT / CONVERT / STRING_AGG / STRING_SPLIT'],
  [/'\s*\+|\+\s*'/, '`+` on strings (use CONCAT)'],
  [/\b(MERGE|OUTPUT|PIVOT|UNPIVOT|APPLY)\b/i, 'MERGE / OUTPUT / PIVOT / APPLY'],
  [/\bUPDATE\b[\s\S]*\bSET\b[\s\S]*\bFROM\b/i, 'UPDATE ... FROM (its join semantics differ in SQLite)'],
  [/\bDELETE\s+\w+\s+FROM\b/i, 'DELETE alias FROM ... JOIN'],
];

const HINT = '(?:NOLOCK|UPDLOCK|HOLDLOCK|ROWLOCK|PAGLOCK|TABLOCKX?|XLOCK|READPAST|NOWAIT|SERIALIZABLE|REPEATABLEREAD|READCOMMITTED|READUNCOMMITTED)';
const TABLE_HINTS = new RegExp(`\\bWITH\\s*\\(\\s*${HINT}(?:\\s*,\\s*${HINT})*\\s*\\)`, 'gi');

/** `s` with everything inside quotes or parentheses blanked, so a regex on it only sees the top level. */
function topLevelMask(s) {
  let out = '';
  let depth = 0;
  let quote = null;
  for (const c of s) {
    if (quote) {
      out += ' ';
      if (c === quote) quote = null;
    } else if (c === "'" || c === '"') {
      quote = c;
      out += ' ';
    } else if (c === '(') {
      out += depth === 0 ? c : ' ';
      depth++;
    } else if (c === ')') {
      depth--;
      out += depth === 0 ? c : ' ';
    } else {
      out += depth === 0 ? c : ' ';
    }
  }
  return out;
}

/** Split on commas at the top level (outside quotes and parentheses). */
function splitTopLevel(s) {
  const m = topLevelMask(s);
  const parts = [];
  let from = 0;
  for (let i = 0; i < m.length; i++) {
    if (m[i] === ',') { parts.push(s.slice(from, i).trim()); from = i + 1; }
  }
  parts.push(s.slice(from).trim());
  return parts.filter(p => p.length > 0);
}

const lastPart = col => col.split('.').pop().replace(/^\[|\]$/g, '');
const normCol = col => col.replace(/\s+/g, '').toLowerCase();
const COLUMN_REF = /^[\w.[\]]+$/;

/**
 * GROUP BY ROLLUP / CUBE / GROUPING SETS (which SQLite lacks) as the UNION ALL
 * of one GROUP BY per grouping set, which is how SQL Server defines them: a
 * grouping column left out of a set is NULL on that set's rows, and
 * GROUPING(col) is 1 there and 0 elsewhere. Only the plain shape is covered
 * (column lists, bare grouping columns and aliased GROUPING(col) in the
 * select list, an ORDER BY on output columns); anything else is refused.
 */
function expandGroupingSets(s) {
  if (!/\b(ROLLUP|CUBE|GROUPING\s+SETS)\b/i.test(s)) return { sql: s };
  s = s.replace(/--[^\n]*/g, '');
  const gb = /\bGROUP\s+BY\s+(ROLLUP|CUBE|GROUPING\s+SETS)\s*\(/i.exec(topLevelMask(s));
  if (!gb) return { error: 'not supported by the SQLite check: ROLLUP / CUBE / GROUPING SETS outside a top-level GROUP BY' };
  const refuse = what => ({ error: `not supported by the SQLite check: ${what} with ROLLUP / CUBE / GROUPING SETS` });
  if (/\bGROUPING_ID\b/i.test(s)) return refuse('GROUPING_ID');
  const open = gb.index + gb[0].length - 1;
  const close = topLevelMask(s.slice(open)).indexOf(')') + open;
  const inner = s.slice(open + 1, close);
  const orderBy = s.slice(close + 1).trim();
  if (orderBy && !/^ORDER\s+BY\b/i.test(orderBy)) return refuse('anything but ORDER BY after the GROUP BY');
  if (/\bGROUPING\s*\(/i.test(orderBy)) return refuse('GROUPING() in ORDER BY (order by its alias)');

  const head = s.slice(0, gb.index);
  const sel = /^\s*SELECT\s+/i.exec(head);
  const from = /\bFROM\b/i.exec(topLevelMask(head));
  if (!sel || !from) return refuse('a statement that is not SELECT ... FROM');
  const selectList = head.slice(sel[0].length, from.index);
  const rest = head.slice(from.index).trim();
  if (/^DISTINCT\b/i.test(selectList.trim())) return refuse('SELECT DISTINCT');

  const columnsOf = e => {
    const t = e.trim();
    const cols = t.startsWith('(') && t.endsWith(')') ? splitTopLevel(t.slice(1, -1)) : [t];
    return cols.every(c => COLUMN_REF.test(c)) ? cols : null;
  };
  const kind = gb[1].toUpperCase().replace(/\s+/, ' ');
  const items = splitTopLevel(inner);
  let sets;
  if (kind === 'GROUPING SETS') {
    sets = items.map(columnsOf);
  } else {
    if (!items.every(c => COLUMN_REF.test(c))) return refuse(`${kind} of anything but columns`);
    sets = kind === 'ROLLUP'
      ? items.map((_c, i) => items.slice(0, items.length - i)).concat([[]])
      : Array.from({ length: 2 ** items.length }, (_v, m) => items.filter((_c, i) => !((m >> (items.length - 1 - i)) & 1)));
  }
  if (sets.some(set => set === null)) return refuse('a grouping set of anything but columns');
  const all = new Set(sets.flat().map(normCol));
  const allNames = new Set([...all].map(lastPart));

  const select = [];
  for (const item of splitTopLevel(selectList)) {
    const a = /^([\s\S]*?)\s+AS\s+(\[[^\]]+\]|\w+)$/i.exec(item);
    const expr = (a ? a[1] : item).trim();
    const alias = a ? a[2] : null;
    const g = /^GROUPING\s*\(\s*([\w.[\]]+)\s*\)$/i.exec(expr);
    if (g) {
      if (!all.has(normCol(g[1]))) return refuse(`GROUPING(${g[1]}) of a column that is not grouped`);
      if (!alias) return refuse('GROUPING() without an alias');
      select.push(set => `${set.some(c => normCol(c) === normCol(g[1])) ? 0 : 1} AS ${alias}`);
    } else if (all.has(normCol(expr))) {
      select.push(set => (set.some(c => normCol(c) === normCol(expr)) ? item : `NULL AS ${alias || lastPart(expr)}`));
    } else if ((expr.match(/[A-Za-z_]\w*/g) || []).some(t => allNames.has(t.toLowerCase()))) {
      return refuse(`a grouping column inside an expression (${item})`);
    } else {
      select.push(() => item);
    }
  }
  const branches = sets.map(set =>
    `SELECT ${select.map(f => f(set)).join(', ')} ${rest}${set.length > 0 ? ` GROUP BY ${set.join(', ')}` : ''}`);
  return { sql: `SELECT * FROM (${branches.join(' UNION ALL ')})${orderBy ? ` ${orderBy}` : ''}` };
}

/** One T-SQL statement as SQLite runs it, or an error naming what the check does not cover. */
function translateTsql(stmt) {
  for (const [re, what] of UNSUPPORTED) {
    if (re.test(stmt)) return { error: `not supported by the SQLite check: ${what}` };
  }
  let s = stmt.replace(/(^|[^\w'])N'/g, "$1'");
  // Table hints change what other sessions see and wait for, never what this one reads.
  s = s.replace(TABLE_HINTS, '');
  const tops = s.match(/\bTOP\b/gi) || [];
  if (tops.length > 1) return { error: 'not supported by the SQLite check: more than one TOP in a statement' };
  let limit = null;
  s = s.replace(/\bSELECT(\s+DISTINCT)?\s+TOP\s*(?:\(\s*(\d+)\s*\)|(\d+))\s*/i, (_m, distinct, a, b) => {
    limit = a || b;
    return `SELECT${distinct || ''} `;
  });
  if (tops.length === 1 && limit === null) return { error: 'not supported by the SQLite check: TOP outside SELECT [DISTINCT] TOP (n)' };
  if (limit !== null && /\bOFFSET\b/i.test(s)) return { error: 'not supported by the SQLite check: TOP with OFFSET' };
  const grouped = expandGroupingSets(s);
  if (grouped.error) return grouped;
  s = grouped.sql;
  s = s.replace(/\bOFFSET\s+(\d+)\s+ROWS?\s+FETCH\s+(?:NEXT|FIRST)\s+(\d+)\s+ROWS?\s+ONLY\b/gi, 'LIMIT $2 OFFSET $1');
  s = s.replace(/\bOFFSET\s+(\d+)\s+ROWS?\b/gi, 'LIMIT -1 OFFSET $1');
  s = s.replace(/\bISNULL\s*\(/gi, 'IFNULL(');
  s = s.replace(/\b(DATEADD|DATEDIFF|DATEPART)\s*\(\s*([A-Za-z]+)\s*,/gi, "$1('$2',");
  s = s.replace(/\b(LEFT|RIGHT)\s*\(/gi, 'TSQL_$1(');
  if (limit !== null) s = `${s.replace(/\s+$/, '')} LIMIT ${limit}`;
  return { sql: s };
}

function columnType(values) {
  const present = values.filter(v => v !== null && v !== undefined);
  if (present.length > 0 && present.every(v => typeof v === 'number' && Number.isInteger(v))) return 'INTEGER';
  if (present.length > 0 && present.every(v => typeof v === 'number')) return 'REAL';
  return 'TEXT';
}

let sqlEngine = null;
async function getSqlEngine() {
  if (!sqlEngine) sqlEngine = await require('sql.js')();
  return sqlEngine;
}

async function runSql(code, tables = []) {
  const SQL = await getSqlEngine();
  const db = new SQL.Database();
  try {
    db.exec("PRAGMA foreign_keys = ON; ATTACH DATABASE ':memory:' AS dbo; ATTACH DATABASE ':memory:' AS stg;");
    for (const [name, fn] of Object.entries(TSQL_FUNCTIONS)) {
      // sql.js registers a function for fn.length arguments; -1 takes any
      // number, for the optional ones (CHARINDEX start, EOMONTH offset).
      const variadic = Object.defineProperty((...args) => fn(...args), 'length', { value: -1 });
      db.create_function(name, VARIADIC.has(name) ? variadic : fn);
    }
    for (const t of tables) {
      if (t.rows.some(r => r.length !== t.columns.length)) return { error: `table ${t.name}: a row does not have ${t.columns.length} values` };
      const cols = t.columns.map((c, i) => `${c} ${columnType(t.rows.map(r => r[i]))}`);
      db.exec(`CREATE TABLE ${t.name} (${cols.join(', ')});`);
      const insert = db.prepare(`INSERT INTO ${t.name} VALUES (${t.columns.map(() => '?').join(', ')});`);
      for (const r of t.rows) insert.run(r);
      insert.free();
    }
    const r = runBatches(db, code, translateTsql);
    return r.error ? r : { output: normalizeOutput(r.output) };
  } catch (e) {
    return { error: String(e.message || e) };
  } finally {
    db.close();
  }
}

async function runWorked(worked) {
  if (worked.language === 'sql') return runSql(worked.code, worked.tables);
  if (worked.language === 'python') return runPython(worked.code);
  return { error: `no runner for language ${worked.language}` };
}

// ── Prose rules ─────────────────────────────────────────────────────────────

const ABBREVIATIONS = /\b(e\.g|i\.e|etc|vs|approx)\.$/i;

/** Lines of a prose field holding more than one sentence. */
function multiSentenceLines(text) {
  const bad = [];
  for (const line of String(text).split(/\r?\n/)) {
    const prose = line.replace(/`[^`]*`/g, 'CODE');
    const re = /[.!?]["')\]]?\s+(?=["'(`]?[A-Z0-9])/g;
    let m;
    while ((m = re.exec(prose))) {
      const before = prose.slice(0, m.index + 1);
      if (!ABBREVIATIONS.test(before)) { bad.push(line.trim()); break; }
    }
  }
  return bad;
}

function allStrings(v, out = []) {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach(x => allStrings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach(x => allStrings(x, out));
  return out;
}

// ── Checks ──────────────────────────────────────────────────────────────────

const BY_ID = new Map(questions.map(q => [q.id, q]));
const BANK_INDEX = new Map(questions.map((q, i) => [q.id, i]));
const UNITS = [SQL_PATH_ORDER, BACKEND_PATH_ORDER, DATABRICKS_PATH_ORDER, WEBDEV_PATH_ORDER, DATA_ENG_PATH_ORDER]
  .flat()
  .flatMap(section => getSectionUnits(section).map(([, keys]) => [...keys].sort().join('|')));

/** The answer-bearing code of an exercise: a solution and its alternatives, or a predict snippet. */
function exerciseCode(q) {
  if (q.type === 'predict_output') return q.code ? [q.code] : [];
  if (typeof q.solution === 'string') return splitAlternatives(q.solution);
  return [];
}

function leakFindings(lesson) {
  const findings = [];
  const workedNorm = stripNoise(lesson.worked.code).toLowerCase();
  const workedTokens = essentialTokens(lesson.worked.code);
  for (const id of lesson.exercises) {
    const q = BY_ID.get(id);
    if (!q) continue;
    for (const alt of exerciseCode(q)) {
      const altNorm = stripNoise(alt).toLowerCase();
      if (altNorm.length >= 40 && workedNorm.includes(altNorm)) {
        findings.push({ severity: 'HIGH', message: `worked example repeats ${id} verbatim` });
        continue;
      }
      if (q.type === 'predict_output') continue;
      const tokens = [...essentialTokens(alt)];
      if (tokens.length < 3) continue;
      const recall = tokens.filter(t => workedTokens.has(t)).length / tokens.length;
      if (recall >= LEAK_HIGH) findings.push({ severity: 'HIGH', message: `worked example holds ${Math.round(recall * 100)}% of ${id}'s solution tokens` });
      else if (recall >= LEAK_MED) findings.push({ severity: 'MED', message: `worked example holds ${Math.round(recall * 100)}% of ${id}'s solution tokens` });
    }
  }
  return findings;
}

async function checkLesson(lesson, seenIds) {
  const errors = [];
  const warnings = [];
  const err = m => errors.push(m);

  if (seenIds.has(lesson.id)) err('duplicate lesson id');
  seenIds.add(lesson.id);
  if (lesson.id !== `${lesson.topicKeys[0]}/${lesson.step}`) err(`id should be ${lesson.topicKeys[0]}/${lesson.step}`);
  if (!UNITS.includes([...lesson.topicKeys].sort().join('|'))) err(`topicKeys [${lesson.topicKeys.join(', ')}] are not one courseConfig unit`);
  if (!lesson.title || !lesson.idea || lesson.idea.length < 1 || !lesson.form || !lesson.form.code || !lesson.pitfall) err('missing title, idea, form or pitfall');
  if (lesson.idea && (lesson.idea.length < 2 || lesson.idea.length > 4)) err(`idea has ${lesson.idea.length} paragraphs (2-4)`);

  // Exercises
  const ex = lesson.exercises || [];
  if (ex.length < MIN_EXERCISES || ex.length > MAX_EXERCISES) err(`${ex.length} exercises (${MIN_EXERCISES}-${MAX_EXERCISES})`);
  if (new Set(ex).size !== ex.length) err('an exercise is listed twice');
  const qs = [];
  for (const id of ex) {
    const q = BY_ID.get(id);
    if (!q) { err(`unknown exercise id ${id}`); continue; }
    if (!lesson.topicKeys.includes(q.topic)) err(`${id} belongs to ${q.topic}, not this lesson's topic`);
    qs.push(q);
  }
  for (let i = 1; i < qs.length; i++) {
    const a = qs[i - 1];
    const b = qs[i];
    const ra = rampRank(a);
    const rb = rampRank(b);
    if (rb < ra || (rb === ra && BANK_INDEX.get(b.id) < BANK_INDEX.get(a.id))) {
      err(`exercises not in ramp order: ${b.id} (${b.difficulty} ${b.type}) comes after ${a.id} (${a.difficulty} ${a.type})`);
    }
  }
  if (qs.length > 0) {
    if (!qs.some(q => q.type === 'multiple_choice')) err('no multiple-choice exercise');
    if (!qs.some(q => q.type === 'predict_output')) err('no predict-output exercise');
    if (qs[0].type === 'coding') err('the first exercise is a cold write');
  }
  if (lesson.family && !qs.some(q => familyOf(q) === lesson.family)) err(`family ${lesson.family} is not the family of any exercise`);

  // Worked example
  const w = lesson.worked;
  if (!w || !w.code || !Array.isArray(w.steps) || w.steps.length === 0) {
    err('worked example needs code and steps');
  } else if (w.output === undefined) {
    err('worked example has no output to check');
  } else if (w.runs === false) {
    if (w.language !== 'python' || !nonRunnableKind(w.code)) {
      const kinds = NON_RUNNABLE_KINDS.map(k => k.kind);
      err(`runs: false is only for ${kinds.slice(0, -1).join(', ')} or ${kinds[kinds.length - 1]}`);
    }
  } else {
    const r = await runWorked(w);
    if (r.error) err(`worked example does not run: ${r.error}`);
    else if (r.output !== normalizeOutput(w.output)) {
      err(`worked example prints something else.\n    expected:\n${indent(normalizeOutput(w.output))}\n    printed:\n${indent(r.output)}`);
    }
  }
  if (w && w.code) {
    for (const f of leakFindings(lesson)) (f.severity === 'HIGH' ? errors : warnings).push(f.message);
  }

  // Prose
  for (const s of allStrings(lesson)) {
    if (s.includes('—')) { err(`em dash in: ${s.trim().split('\n')[0].slice(0, 80)}`); break; }
  }
  const prose = [...(lesson.idea || []), lesson.pitfall || '', ...((w && w.steps) || [])];
  for (const p of prose) {
    for (const line of multiSentenceLines(p)) err(`two sentences on one line: "${line.slice(0, 90)}"`);
  }

  return { errors, warnings };
}

function indent(s) {
  return s.split('\n').map(l => `      ${l}`).join('\n');
}

async function main() {
  const only = process.argv.slice(2);
  const lessons = only.length > 0 ? LESSONS.filter(l => l.topicKeys.some(t => only.includes(t))) : LESSONS;
  const seenIds = new Set();
  let failed = 0;
  let warned = 0;
  for (const lesson of lessons) {
    const { errors, warnings } = await checkLesson(lesson, seenIds);
    if (errors.length === 0 && warnings.length === 0) {
      console.log(`ok    ${lesson.id}`);
      continue;
    }
    if (errors.length > 0) failed++;
    if (warnings.length > 0) warned++;
    console.log(`${errors.length > 0 ? 'FAIL' : 'warn'}  ${lesson.id}`);
    for (const e of errors) console.log(`  x ${e}`);
    for (const wmsg of warnings) console.log(`  ! ${wmsg} (MED, review)`);
  }
  console.log(`\n${lessons.length} lessons checked: ${lessons.length - failed} pass, ${failed} fail, ${warned} with warnings.`);
  process.exit(failed > 0 ? 1 : 0);
}

module.exports = { checkLesson, runSql, runPython, translateTsql, expandGroupingSets, multiSentenceLines, TSQL_FUNCTIONS };

if (require.main === module) {
  main().catch(e => {
    console.error(e);
    process.exit(1);
  });
}
