/**
 * Procedural T-SQL for check-lessons.js: runs a script's batches on one sql.js
 * database, so a worked example with variables, control flow, transactions,
 * TRY ... CATCH and stored procedures prints what SQL Server would print.
 *
 * Covered, with SQL Server's meaning:
 *   - batches split by a line holding only GO; variables live for one batch;
 *   - DECLARE @v type [= expr] (INT family, BIT, VARCHAR / NVARCHAR (n | MAX),
 *     DATE), SET @v = expr (also +=, -=, *=), SELECT @v = expr ... (the last
 *     row wins, no row leaves @v unchanged), PRINT expr;
 *   - IF / ELSE, WHILE with BREAK / CONTINUE, BEGIN ... END blocks;
 *   - BEGIN TRAN, COMMIT, ROLLBACK, SAVE TRAN name, ROLLBACK TRAN name,
 *     @@TRANCOUNT (nested BEGIN TRAN only counts; only the outermost COMMIT
 *     commits; a bare ROLLBACK undoes everything), SET XACT_ABORT ON (an error
 *     inside TRY dooms the open transaction: XACT_STATE() is -1 and only
 *     ROLLBACK is allowed), XACT_STATE();
 *   - SET TRANSACTION ISOLATION LEVEL and table hints such as WITH (UPDLOCK):
 *     accepted, since one session sees the same rows under every level and
 *     hint (they change what other sessions see and wait for);
 *   - BEGIN TRY ... END TRY BEGIN CATCH ... END CATCH, THROW n, 'msg', state,
 *     a bare THROW in CATCH, ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_SEVERITY(),
 *     ERROR_STATE(); CHECK, NOT NULL, UNIQUE / PRIMARY KEY and FOREIGN KEY
 *     violations raise SQL Server's error numbers (547, 515, 2627, 547);
 *   - CREATE PROCEDURE (alone in its batch) with input, default and OUTPUT
 *     parameters, EXEC [@rc =] name args (OUTPUT is copied back only when the
 *     call site says OUTPUT too), RETURN [n];
 *   - CREATE FUNCTION scalar functions (alone in their batch), called as
 *     dbo.Name(args) inside any expression.
 *
 * Refused rather than run with a different meaning: an error nobody catches
 * (the check does not print SQL Server's Msg lines), ERROR_MESSAGE() of an
 * engine error (its SQL Server text is not reproduced; THROW your own),
 * a batch that ends with a transaction open, @@ROWCOUNT / @@ERROR /
 * SCOPE_IDENTITY, RAISERROR, table variables, DECIMAL / FLOAT / CHAR
 * variables (keep numbers integers), SNAPSHOT isolation, inline table-valued
 * functions, and `+` on a string variable (use CONCAT).
 */

class TsqlError extends Error {
  constructor(number, message, { state = 1, engine = false } = {}) {
    super(message);
    this.number = number;
    this.severity = 16;
    this.state = state;
    this.engine = engine;
  }
}

/** Something the check does not cover: the example fails with this message. */
class Unsupported extends Error {}

class Signal {
  constructor(kind, value) {
    this.kind = kind;
    this.value = value;
  }
}

const refuse = what => new Unsupported(`not supported by the SQLite check: ${what}`);

// ── Tokens ───────────────────────────────────────────────────────────────────

/** Words, @variables, @@system values, strings, numbers and symbols, with source offsets; comments dropped. */
function tokenize(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '-' && src[i + 1] === '-') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { const e = src.indexOf('*/', i + 2); i = e === -1 ? src.length : e + 2; continue; }
    const s = i;
    if (c === "'" || ((c === 'N' || c === 'n') && src[i + 1] === "'")) {
      i += c === "'" ? 1 : 2;
      while (i < src.length) {
        if (src[i] === "'" && src[i + 1] === "'") { i += 2; continue; }
        if (src[i] === "'") { i++; break; }
        i++;
      }
      out.push({ k: 'str', v: src.slice(s, i), s, e: i });
      continue;
    }
    if (c === '@') {
      const sys = src[i + 1] === '@';
      i += sys ? 2 : 1;
      while (i < src.length && /[\w#$]/.test(src[i])) i++;
      out.push({ k: sys ? 'sysvar' : 'var', v: src.slice(s, i), s, e: i });
      continue;
    }
    if (c === '[') {
      const e = src.indexOf(']', i);
      i = e === -1 ? src.length : e + 1;
      out.push({ k: 'word', v: src.slice(s + 1, i - 1), s, e: i });
      continue;
    }
    if (/[A-Za-z_#]/.test(c)) {
      while (i < src.length && /[\w#$]/.test(src[i])) i++;
      out.push({ k: 'word', v: src.slice(s, i), s, e: i });
      continue;
    }
    if (/\d/.test(c)) {
      while (i < src.length && /[\d.]/.test(src[i])) i++;
      out.push({ k: 'num', v: src.slice(s, i), s, e: i });
      continue;
    }
    const two = src.slice(i, i + 2);
    if (['<=', '>=', '<>', '!=', '+=', '-=', '*=', '/='].includes(two)) {
      i += 2;
      out.push({ k: 'sym', v: two, s, e: i });
      continue;
    }
    i++;
    out.push({ k: 'sym', v: c, s, e: i });
  }
  return out;
}

/** A possibly schema-qualified name at `i` (`dbo.Name` or `Name`): its last part and the index after it. */
function objectName(toks, i) {
  if (!toks[i] || toks[i].k !== 'word') return [null, i];
  let name = toks[i].v;
  i++;
  while (toks[i] && toks[i].k === 'sym' && toks[i].v === '.' && toks[i + 1] && toks[i + 1].k === 'word') {
    name = toks[i + 1].v;
    i += 2;
  }
  return [name, i];
}

const W = t => (t && t.k === 'word' ? t.v.toUpperCase() : null);
const isSym = (t, v) => !!t && t.k === 'sym' && t.v === v;

const STATEMENT_START = new Set([
  'BEGIN', 'PRINT', 'SET', 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'RETURN', 'THROW', 'EXEC', 'EXECUTE',
  'DECLARE', 'BREAK', 'CONTINUE', 'COMMIT', 'ROLLBACK', 'SAVE', 'IF', 'WHILE', 'RAISERROR', 'CREATE',
  'DROP', 'TRUNCATE', 'ALTER', 'WITH', 'MERGE',
]);

// ── Parser ───────────────────────────────────────────────────────────────────

/** One batch's statements as a tree; a simple statement keeps its token range [s, e). */
function parseBatch(toks) {
  let p = 0;
  const peekW = (o = 0) => W(toks[p + o]);
  const expectW = (...words) => {
    for (const w of words) {
      if (peekW() !== w) throw refuse(`expected ${words.join(' ')} near "${toks[p] ? toks[p].v : 'the end of the batch'}"`);
      p++;
    }
  };
  const skipSemis = () => { while (isSym(toks[p], ';')) p++; };
  const matching = open => {
    let depth = 0;
    for (let i = open; i < toks.length; i++) {
      if (isSym(toks[i], '(')) depth++;
      else if (isSym(toks[i], ')') && --depth === 0) return i;
    }
    throw refuse('a ( without its )');
  };

  function list(stop) {
    const out = [];
    for (;;) {
      skipSemis();
      if (p >= toks.length || stop()) return out;
      out.push(statement());
    }
  }

  /** Tokens up to the next statement start at depth 0: an IF or WHILE condition. */
  function condition() {
    const s = p;
    let depth = 0;
    let cases = 0;
    while (p < toks.length) {
      const t = toks[p];
      if (isSym(t, '(')) depth++;
      else if (isSym(t, ')')) depth--;
      else if (W(t) === 'CASE') cases++;
      else if (W(t) === 'END' && cases > 0) cases--;
      else if (depth === 0 && cases === 0 && STATEMENT_START.has(W(t))) break;
      p++;
    }
    if (p === s) throw refuse('an IF or WHILE without a condition');
    return { s, e: p };
  }

  /** Tokens up to `;`, or up to END / ELSE that close the enclosing block or IF. */
  function simple() {
    const s = p;
    let depth = 0;
    let cases = 0;
    while (p < toks.length) {
      const t = toks[p];
      if (depth === 0 && isSym(t, ';')) break;
      if (isSym(t, '(')) depth++;
      else if (isSym(t, ')')) depth--;
      else if (W(t) === 'CASE') cases++;
      else if (W(t) === 'END') { if (cases > 0) cases--; else if (depth === 0) break; }
      else if (W(t) === 'ELSE' && cases === 0 && depth === 0) break;
      p++;
    }
    return { type: 'simple', s, e: p };
  }

  function routine() {
    const s = p;
    p++;
    const kind = peekW() === 'FUNCTION' ? 'function' : 'procedure';
    p++;
    const [name, after] = objectName(toks, p);
    if (!name) throw refuse(`CREATE ${kind.toUpperCase()} without a name`);
    p = after;
    // Parameters: in parentheses, or (procedure) up to AS; commas at depth 0 split them.
    let ps;
    let pe;
    if (isSym(toks[p], '(')) {
      const close = matching(p);
      ps = p + 1;
      pe = close;
      p = close + 1;
    } else {
      ps = p;
      while (p < toks.length && W(toks[p]) !== 'AS' && W(toks[p]) !== 'RETURNS') p++;
      pe = p;
    }
    const params = [];
    let cur = [];
    let depth = 0;
    for (let i = ps; i < pe; i++) {
      const t = toks[i];
      if (isSym(t, '(')) depth++;
      else if (isSym(t, ')')) depth--;
      if (depth === 0 && isSym(t, ',')) { params.push(cur); cur = []; continue; }
      cur.push(t);
    }
    if (cur.length) params.push(cur);
    let returns = null;
    if (peekW() === 'RETURNS') {
      p++;
      const r = p;
      while (p < toks.length && peekW() !== 'AS') p++;
      returns = toks.slice(r, p);
      if (returns.length === 1 && W(returns[0]) === 'TABLE') throw refuse('an inline table-valued function (RETURNS TABLE)');
    }
    expectW('AS');
    const body = list(() => false);
    if (s !== 0) throw refuse(`CREATE ${kind.toUpperCase()} that is not the first statement of its batch (put GO before it)`);
    return { type: kind, name, params, returns, body };
  }

  function statement() {
    const w = peekW();
    if (w === 'BEGIN' && peekW(1) === 'TRY') {
      p += 2;
      const body = list(() => peekW() === 'END' && peekW(1) === 'TRY');
      expectW('END', 'TRY');
      skipSemis();
      expectW('BEGIN', 'CATCH');
      const handler = list(() => peekW() === 'END' && peekW(1) === 'CATCH');
      expectW('END', 'CATCH');
      return { type: 'try', body, handler };
    }
    if (w === 'BEGIN' && !['TRAN', 'TRANSACTION', 'DISTRIBUTED'].includes(peekW(1))) {
      p++;
      const body = list(() => peekW() === 'END');
      expectW('END');
      return { type: 'block', body };
    }
    if (w === 'IF' || w === 'WHILE') {
      p++;
      const cond = condition();
      const then = statement();
      skipSemisBeforeElse();
      let otherwise = null;
      if (w === 'IF' && peekW() === 'ELSE') { p++; otherwise = statement(); }
      return w === 'IF' ? { type: 'if', cond, then, otherwise } : { type: 'while', cond, body: then };
    }
    if (w === 'CREATE' && ['PROC', 'PROCEDURE', 'FUNCTION'].includes(peekW(1))) return routine();
    if (w === 'END' || w === 'ELSE') throw refuse(`${w} without a matching ${w === 'END' ? 'BEGIN' : 'IF'}`);
    return simple();
  }

  /** `IF c PRINT 'a'; ELSE ...`: the `;` before ELSE ends the THEN statement. */
  function skipSemisBeforeElse() {
    let q = p;
    while (isSym(toks[q], ';')) q++;
    if (W(toks[q]) === 'ELSE') p = q;
  }

  const body = list(() => false);
  if (p < toks.length) throw refuse(`unexpected "${toks[p].v}"`);
  return body;
}

// ── Values ───────────────────────────────────────────────────────────────────

/** A declared type as { kind, len }; refuses types whose values SQLite would print differently. */
function parseType(ts) {
  const base = W(ts[0]);
  if (!base) throw refuse('a variable without a type');
  const nums = ts.filter(t => t.k === 'num' || W(t) === 'MAX').map(t => t.v.toUpperCase());
  if (['INT', 'INTEGER', 'BIGINT', 'SMALLINT', 'TINYINT'].includes(base)) return { kind: 'int' };
  if (base === 'BIT') return { kind: 'bit' };
  if (['VARCHAR', 'NVARCHAR'].includes(base)) return { kind: 'str', len: nums[0] === 'MAX' ? Infinity : nums.length ? +nums[0] : 1 };
  if (base === 'DATE') return { kind: 'date' };
  if (base === 'TABLE') throw refuse('a table variable');
  throw refuse(`a ${base} variable (keep numbers integers; use INT, BIT, VARCHAR or DATE)`);
}

function coerce(v, type) {
  if (v === null || v === undefined) return null;
  switch (type.kind) {
    case 'int':
    case 'bit': {
      let n = v;
      if (typeof v === 'string') {
        if (!/^\s*-?\d+(\.\d+)?\s*$/.test(v)) throw new TsqlError(245, `Conversion failed when converting the varchar value '${v}' to data type int.`);
        n = Number(v);
      }
      n = Math.trunc(n);
      return type.kind === 'bit' ? (n !== 0 ? 1 : 0) : n;
    }
    case 'str': {
      if (typeof v === 'number' && !Number.isInteger(v)) throw refuse('a decimal number converted to text (keep numbers integers)');
      return String(v).slice(0, type.len);
    }
    case 'date': {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(v))) throw refuse(`a DATE value that is not 'YYYY-MM-DD' (${v})`);
      return String(v);
    }
    default: return v;
  }
}

function printable(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'number' && !Number.isInteger(v)) throw refuse('printing a decimal number (keep numbers integers)');
  return String(v);
}

function formatValue(v) {
  if (v === null || v === undefined) return 'NULL';
  return String(v);
}

const ENGINE_ERRORS = [
  [/CHECK constraint failed/i, 547],
  [/FOREIGN KEY constraint failed/i, 547],
  [/NOT NULL constraint failed/i, 515],
  [/UNIQUE constraint failed/i, 2627],
];

const DOOMED = 'The current transaction cannot be committed and cannot support operations that write to the log file. Roll back the transaction.';
const WRITES = new Set(['INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TRUNCATE']);
const MAX_LOOP = 10000;
const MAX_NESTING = 32;

// ── Interpreter ──────────────────────────────────────────────────────────────

/**
 * Run `code` on `db`. `translate(sql)` turns one plain T-SQL statement into
 * SQLite (check-lessons.js translateTsql) or returns { error }.
 * Returns { output } (result sets as `col | col` blocks, PRINT lines grouped
 * into blocks, a blank line between blocks) or { error }.
 */
function runBatches(db, code, translate) {
  const blocks = [];
  const ctx = {
    trancount: 0,
    savepoints: [],
    xactAbort: false,
    doomed: false,
    caught: [],
    routines: new Map(),
    nesting: 0,
    inFunction: 0,
    udfError: null,
  };
  let src = '';
  let toks = [];

  const firstLine = (s, e) => src.slice(toks[s].s, toks[Math.max(s, e - 1)].e).trim().split('\n')[0];
  const text = (s, e) => (e > s ? src.slice(toks[s].s, toks[e - 1].e) : '');

  function print(line) {
    const last = blocks[blocks.length - 1];
    if (last && last.print) last.lines.push(line);
    else blocks.push({ print: true, lines: [line] });
  }

  function lookup(scope, tok) {
    const key = tok.v.toLowerCase();
    if (!scope.has(key)) throw refuse(`${tok.v} is not declared in this batch (T-SQL: Must declare the scalar variable "${tok.v}")`);
    return key;
  }

  /** The SQLite text of tokens [s, e) with variables, system values and dbo.Function( calls bound or renamed. */
  function bind(s, e, scope) {
    const params = {};
    let out = '';
    let at = toks[s] ? toks[s].s : 0;
    const stringVars = [];
    const closeCast = new Set();
    for (let i = s; i < e; i++) {
      const t = toks[i];
      out += src.slice(at, t.s);
      at = t.e;
      if (t.k === 'var') {
        const key = lookup(scope, t);
        const name = `@v_${key.slice(1).replace(/[^\w]/g, '_')}`;
        params[name] = scope.get(key).value;
        if (scope.get(key).type.kind === 'str' || scope.get(key).type.kind === 'date') stringVars.push(i);
        out += name;
        continue;
      }
      if (t.k === 'sysvar') {
        const v = t.v.toUpperCase();
        if (v !== '@@TRANCOUNT') throw refuse(`${t.v} (its value depends on which statement ran last; use a variable)`);
        params['@s_trancount'] = ctx.trancount;
        out += '@s_trancount';
        continue;
      }
      const w = W(t);
      if (w && isSym(toks[i + 1], '(')) {
        const fn = ERROR_FUNCTIONS[w];
        if (fn !== undefined || w === 'XACT_STATE' || w === 'ERROR_LINE' || w === 'ERROR_PROCEDURE') {
          if (!isSym(toks[i + 2], ')')) throw refuse(`${t.v} with arguments`);
          if (w === 'ERROR_LINE' || w === 'ERROR_PROCEDURE') throw refuse(`${w}()`);
          const name = `@s_${w.toLowerCase()}`;
          params[name] = w === 'XACT_STATE' ? (ctx.doomed ? -1 : ctx.trancount > 0 ? 1 : 0) : fn();
          out += name;
          i += 2;
          at = toks[i].e;
          continue;
        }
      }
      // dbo.Name( -> udf_name( for a scalar function created in the script.
      // sql.js hands a function's number back as a REAL, so an integer
      // result is cast back to INTEGER (CONCAT would print 5 as 5.0).
      const [fname, after] = w ? objectName(toks, i) : [null, i];
      const fn = fname && isSym(toks[after], '(') ? ctx.routines.get(`f:${fname.toLowerCase()}`) : null;
      if (fn && after <= e) {
        const integer = fn.returnType && ['int', 'bit'].includes(fn.returnType.kind);
        out += `${integer ? 'CAST(' : ''}udf_${fname.toLowerCase()}`;
        if (integer) closeCast.add(matchingIn(after));
        i = after - 1;
        at = toks[i].e;
        continue;
      }
      out += t.v;
      if (closeCast.has(i)) out += ' AS INTEGER)';
    }
    for (const i of stringVars) {
      if (isSym(toks[i - 1], '+') || isSym(toks[i + 1], '+')) throw refuse('`+` on a string variable (use CONCAT)');
    }
    return { sql: out, params };
  }

  function currentCaught() {
    return ctx.caught.length ? ctx.caught[ctx.caught.length - 1] : null;
  }

  const ERROR_FUNCTIONS = {
    ERROR_NUMBER: () => (currentCaught() ? currentCaught().number : null),
    ERROR_SEVERITY: () => (currentCaught() ? currentCaught().severity : null),
    ERROR_STATE: () => (currentCaught() ? currentCaught().state : null),
    ERROR_MESSAGE: () => {
      const e = currentCaught();
      if (!e) return null;
      if (e.engine) throw refuse(`ERROR_MESSAGE() of engine error ${e.number} (SQL Server's text is not reproduced; print ERROR_NUMBER() or THROW your own message)`);
      return e.message;
    },
  };

  /** Run one SQLite statement; an engine error becomes a TsqlError with SQL Server's number. */
  function exec(sql, params) {
    try {
      return db.exec(sql, params);
    } catch (e) {
      if (ctx.udfError) { const u = ctx.udfError; ctx.udfError = null; throw u; }
      const hit = ENGINE_ERRORS.find(([re]) => re.test(e.message));
      if (hit) throw new TsqlError(hit[1], e.message, { engine: true });
      throw new Unsupported(`SQLite error: ${e.message}`);
    }
  }

  /** The value of expression tokens [s, e). */
  function value(s, e, scope) {
    if (e <= s) throw refuse('an empty expression');
    // `= (SELECT ...)` of more than one row is an error in SQL Server, not the first row.
    if (isSym(toks[s], '(') && W(toks[s + 1]) === 'SELECT' && isSym(toks[e - 1], ')') && closes(s) === e - 1) {
      const inner = bind(s + 1, e - 1, scope);
      const t = translate(inner.sql);
      if (t.error) throw new Unsupported(t.error);
      const r = exec(t.sql, inner.params);
      const rows = r.length ? r[0].values : [];
      if (rows.length > 1) throw new TsqlError(512, 'Subquery returned more than 1 value. This is not permitted when the subquery follows =, !=, <, <= , >, >= or when the subquery is used as an expression.');
      return rows.length ? rows[0][0] : null;
    }
    const b = bind(s, e, scope);
    const t = translate(`SELECT ${b.sql}`);
    if (t.error) throw new Unsupported(t.error);
    const r = exec(t.sql, b.params);
    return r.length && r[0].values.length ? r[0].values[0][0] : null;
  }

  function matchingIn(open) {
    const close = closes(open);
    if (close === -1) throw refuse('a ( without its )');
    return close;
  }

  function closes(open) {
    let depth = 0;
    for (let i = open; i < toks.length; i++) {
      if (isSym(toks[i], '(')) depth++;
      else if (isSym(toks[i], ')') && --depth === 0) return i;
    }
    return -1;
  }

  function truth(cond, scope) {
    const b = bind(cond.s, cond.e, scope);
    const t = translate(`SELECT CASE WHEN ${b.sql} THEN 1 ELSE 0 END`);
    if (t.error) throw new Unsupported(t.error);
    const r = exec(t.sql, b.params);
    return r[0].values[0][0] === 1;
  }

  /** Split tokens [s, e) on commas at depth 0 into [s, e) ranges. */
  function commaRanges(s, e) {
    const out = [];
    let depth = 0;
    let from = s;
    for (let i = s; i < e; i++) {
      if (isSym(toks[i], '(')) depth++;
      else if (isSym(toks[i], ')')) depth--;
      else if (depth === 0 && isSym(toks[i], ',')) { out.push([from, i]); from = i + 1; }
    }
    if (from < e) out.push([from, e]);
    return out;
  }

  function assign(scope, tok, v) {
    const key = lookup(scope, tok);
    const slot = scope.get(key);
    slot.value = coerce(v, slot.type);
  }

  /** Run `f` with the token stream of the batch that created `routine`. */
  function inSource(routine, f) {
    const saved = [src, toks];
    [src, toks] = [routine.src, routine.toks];
    try {
      return f();
    } finally {
      [src, toks] = saved;
    }
  }

  // ── Statements ──

  function run(list, scope) {
    for (const st of list) runOne(st, scope);
  }

  function runOne(st, scope) {
    switch (st.type) {
      case 'block': return run(st.body, scope);
      case 'if': {
        if (truth(st.cond, scope)) return runOne(st.then, scope);
        if (st.otherwise) return runOne(st.otherwise, scope);
        return undefined;
      }
      case 'while': {
        for (let n = 0; truth(st.cond, scope); n++) {
          if (n >= MAX_LOOP) throw new Unsupported(`a WHILE loop ran ${MAX_LOOP} times (does it ever end?)`);
          try {
            runOne(st.body, scope);
          } catch (e) {
            if (e instanceof Signal && e.kind === 'break') break;
            if (e instanceof Signal && e.kind === 'continue') continue;
            throw e;
          }
        }
        return undefined;
      }
      case 'try': {
        try {
          run(st.body, scope);
        } catch (e) {
          if (!(e instanceof TsqlError)) throw e;
          if (ctx.xactAbort && ctx.trancount > 0) ctx.doomed = true;
          ctx.caught.push(e);
          try {
            run(st.handler, scope);
          } finally {
            ctx.caught.pop();
          }
        }
        return undefined;
      }
      case 'procedure':
      case 'function': {
        const key = `${st.type === 'function' ? 'f' : 'p'}:${st.name.toLowerCase()}`;
        if (ctx.routines.has(key)) throw new TsqlError(2714, `There is already an object named '${st.name}' in the database.`);
        const params = st.params.map(ts => routineParam(ts, st));
        const routine = { ...st, params, returnType: st.returns ? parseType(st.returns) : null, src, toks };
        ctx.routines.set(key, routine);
        if (st.type === 'function') registerFunction(routine);
        return undefined;
      }
      default: return runSimple(st, scope);
    }
  }

  function routineParam(ts, st) {
    if (!ts[0] || ts[0].k !== 'var') throw refuse(`a ${st.type} parameter that does not start with @`);
    let rest = ts.slice(1);
    if (W(rest[0]) === 'AS') rest = rest.slice(1);
    let output = false;
    const last = W(rest[rest.length - 1]);
    if (last === 'OUTPUT' || last === 'OUT') { output = true; rest = rest.slice(0, -1); }
    let def;
    const eq = rest.findIndex(t => isSym(t, '='));
    if (eq !== -1) {
      const d = rest.slice(eq + 1);
      def = literal(d);
      rest = rest.slice(0, eq);
    }
    return { key: ts[0].v.toLowerCase(), name: ts[0].v, type: parseType(rest), output, def, hasDefault: eq !== -1 };
  }

  /** A constant: number (optionally negative), string or NULL. */
  function literal(ts) {
    if (ts.length === 1 && W(ts[0]) === 'NULL') return null;
    if (ts.length === 1 && ts[0].k === 'num') return Number(ts[0].v);
    if (ts.length === 2 && isSym(ts[0], '-') && ts[1].k === 'num') return -Number(ts[1].v);
    if (ts.length === 1 && ts[0].k === 'str') return ts[0].v.replace(/^N/i, '').slice(1, -1).replace(/''/g, "'");
    throw refuse('a default or argument that is not a constant or a variable');
  }

  function registerFunction(fn) {
    db.create_function(`udf_${fn.name.toLowerCase()}`, Object.defineProperty((...args) => {
      try {
        if (args.length !== fn.params.length) throw refuse(`${fn.name} called with ${args.length} arguments`);
        const scope = new Map(fn.params.map((p, i) => [p.key, { type: p.type, value: coerce(args[i], p.type) }]));
        ctx.inFunction++;
        try {
          inSource(fn, () => run(fn.body, scope));
        } catch (e) {
          if (e instanceof Signal && e.kind === 'return') return coerce(e.value, fn.returnType);
          throw e;
        } finally {
          ctx.inFunction--;
        }
        throw refuse(`function ${fn.name} ended without RETURN`);
      } catch (e) {
        ctx.udfError = e;
        throw e;
      }
    }, 'length', { value: fn.params.length }));
  }

  function runSimple(st, scope) {
    const { s, e } = st;
    ctx.last = firstLine(s, e);
    const w = W(toks[s]);
    const w1 = W(toks[s + 1]);
    if (ctx.inFunction && ['PRINT', 'INSERT', 'UPDATE', 'DELETE', 'EXEC', 'EXECUTE', 'BEGIN', 'COMMIT', 'ROLLBACK', 'SAVE', 'THROW', 'CREATE', 'DROP'].includes(w)) {
      throw new Unsupported(`${w} inside a function (T-SQL functions cannot change data or print)`);
    }
    switch (w) {
      case 'DECLARE': {
        for (const [a, b] of commaRanges(s + 1, e)) {
          const v = toks[a];
          if (!v || v.k !== 'var') throw refuse('DECLARE of something that is not an @variable');
          const eq = toks.slice(a, b).findIndex(t => isSym(t, '='));
          const typeEnd = eq === -1 ? b : a + eq;
          let ts = a + 1;
          if (W(toks[ts]) === 'AS') ts++;
          const type = parseType(toks.slice(ts, typeEnd));
          const key = v.v.toLowerCase();
          if (scope.has(key)) throw new Unsupported(`${v.v} is declared twice in one batch (T-SQL: The variable name has already been declared)`);
          const init = eq === -1 ? null : coerce(value(a + eq + 1, b, scope), type);
          scope.set(key, { type, value: init });
        }
        return;
      }
      case 'SET': {
        const t = toks[s + 1];
        if (t && t.k === 'var') {
          const op = toks[s + 2];
          if (!op || op.k !== 'sym' || !['=', '+=', '-=', '*=', '/='].includes(op.v)) throw refuse(`SET ${t.v} without =`);
          let v = value(s + 3, e, scope);
          if (op.v !== '=') {
            const cur = scope.get(lookup(scope, t));
            if (cur.type.kind !== 'int') throw refuse(`${op.v} on a ${cur.type.kind} variable`);
            if (cur.value === null || v === null) v = null;
            else v = op.v === '+=' ? cur.value + v : op.v === '-=' ? cur.value - v : op.v === '*=' ? cur.value * v : Math.trunc(cur.value / v);
          }
          assign(scope, t, v);
          return;
        }
        const words = toks.slice(s + 1, e).map(W).join(' ');
        if (/^(NOCOUNT|ANSI_NULLS|QUOTED_IDENTIFIER) (ON|OFF)$/.test(words)) return;
        if (/^XACT_ABORT (ON|OFF)$/.test(words)) { ctx.xactAbort = words.endsWith('ON'); return; }
        const iso = /^TRANSACTION ISOLATION LEVEL (READ UNCOMMITTED|READ COMMITTED|REPEATABLE READ|SERIALIZABLE|SNAPSHOT)$/.exec(words);
        if (iso) {
          if (iso[1] === 'SNAPSHOT') throw refuse('SNAPSHOT isolation (it needs ALLOW_SNAPSHOT_ISOLATION ON for the database)');
          return;
        }
        throw refuse(`SET ${words}`);
      }
      case 'PRINT':
        print(printable(value(s + 1, e, scope)));
        return;
      case 'BEGIN':
        if (w1 === 'DISTRIBUTED') throw refuse('BEGIN DISTRIBUTED TRAN');
        if (ctx.doomed) throw new TsqlError(3930, DOOMED);
        if (ctx.trancount === 0) exec('BEGIN');
        ctx.trancount++;
        if (ctx.trancount === 1 && s + 2 < e && toks[s + 2].k === 'word') ctx.tranName = toks[s + 2].v.toLowerCase();
        else if (ctx.trancount === 1) ctx.tranName = null;
        return;
      case 'COMMIT':
        if (ctx.trancount === 0) throw new TsqlError(3902, 'The COMMIT TRANSACTION request has no corresponding BEGIN TRANSACTION.');
        if (ctx.doomed) throw new TsqlError(3930, DOOMED);
        ctx.trancount--;
        if (ctx.trancount === 0) { exec('COMMIT'); ctx.savepoints = []; }
        return;
      case 'ROLLBACK': {
        if (ctx.trancount === 0) throw new TsqlError(3903, 'The ROLLBACK TRANSACTION request has no corresponding BEGIN TRANSACTION.');
        let n = s + 1;
        if (['TRAN', 'TRANSACTION', 'WORK'].includes(W(toks[n]))) n++;
        const target = n < e ? toks[n].v.toLowerCase() : null;
        if (target && target !== ctx.tranName) {
          if (!ctx.savepoints.includes(target)) throw new TsqlError(6401, `Cannot roll back ${toks[n].v}. No transaction or savepoint of that name was found.`);
          if (ctx.doomed) throw new TsqlError(3931, 'The current transaction cannot be committed and cannot be rolled back to a savepoint. Roll back the entire transaction.');
          exec(`ROLLBACK TO sp_${target}`);
          ctx.savepoints = ctx.savepoints.slice(0, ctx.savepoints.indexOf(target) + 1);
          return;
        }
        exec('ROLLBACK');
        ctx.trancount = 0;
        ctx.savepoints = [];
        ctx.doomed = false;
        return;
      }
      case 'SAVE': {
        if (ctx.trancount === 0) throw new TsqlError(628, 'Cannot issue SAVE TRANSACTION when there is no active transaction.');
        if (ctx.doomed) throw new TsqlError(3930, DOOMED);
        let n = s + 1;
        if (['TRAN', 'TRANSACTION'].includes(W(toks[n]))) n++;
        if (n >= e || toks[n].k !== 'word') throw refuse('SAVE TRAN without a savepoint name');
        const name = toks[n].v.toLowerCase();
        exec(`SAVEPOINT sp_${name}`);
        ctx.savepoints = ctx.savepoints.filter(x => x !== name).concat([name]);
        return;
      }
      case 'THROW': {
        if (s + 1 >= e) {
          const caught = currentCaught();
          if (!caught) throw new Unsupported('a bare THROW outside a CATCH block');
          throw caught;
        }
        const args = commaRanges(s + 1, e).map(([a, b]) => {
          const ts = toks.slice(a, b);
          if (ts.length === 1 && ts[0].k === 'var') return scope.get(lookup(scope, ts[0])).value;
          return literal(ts);
        });
        if (args.length !== 3) throw refuse('THROW without three arguments (number, message, state)');
        if (!(Number.isInteger(args[0]) && args[0] >= 50000)) throw refuse('a THROW error number below 50000');
        throw new TsqlError(args[0], String(args[1]), { state: args[2] });
      }
      case 'RETURN': {
        const v = s + 1 < e ? value(s + 1, e, scope) : null;
        throw new Signal('return', v);
      }
      case 'BREAK': throw new Signal('break');
      case 'CONTINUE': throw new Signal('continue');
      case 'EXEC':
      case 'EXECUTE': return runExec(s, e, scope);
      case 'RAISERROR': throw refuse('RAISERROR (use THROW)');
      default: return runPlain(s, e, scope, w);
    }
  }

  function runExec(s, e, scope) {
    let i = s + 1;
    let statusVar = null;
    if (toks[i] && toks[i].k === 'var' && isSym(toks[i + 1], '=')) { statusVar = toks[i]; i += 2; }
    const [procName, after] = objectName(toks, i);
    if (!procName) throw refuse('EXEC of a string or without a procedure name');
    i = after;
    const proc = ctx.routines.get(`p:${procName.toLowerCase()}`);
    if (!proc) throw new TsqlError(2812, `Could not find stored procedure '${procName}'.`);
    const given = new Map();
    let positional = 0;
    for (const [a0, b0] of commaRanges(i, e)) {
      let a = a0;
      let b = b0;
      let param;
      if (toks[a].k === 'var' && isSym(toks[a + 1], '=')) {
        param = proc.params.find(p => p.key === toks[a].v.toLowerCase());
        if (!param) throw new Unsupported(`${toks[a].v} is not a parameter of ${procName}`);
        a += 2;
      } else {
        param = proc.params[positional];
        if (!param) throw new Unsupported(`${procName} called with too many arguments`);
        positional++;
      }
      let out = false;
      if (['OUTPUT', 'OUT'].includes(W(toks[b - 1]))) { out = true; b--; }
      const ts = toks.slice(a, b);
      let v;
      let outVar = null;
      if (ts.length === 1 && ts[0].k === 'var') {
        v = scope.get(lookup(scope, ts[0])).value;
        outVar = ts[0];
      } else if (ts.length === 1 && W(ts[0]) === 'DEFAULT') {
        if (!param.hasDefault) throw new Unsupported(`DEFAULT for ${param.name}, which has no default`);
        v = param.def;
      } else {
        v = literal(ts);
      }
      if (out && !param.output) throw new Unsupported(`OUTPUT at the call for ${param.name}, which the procedure does not declare OUTPUT (T-SQL error 8162)`);
      if (out && !outVar) throw new Unsupported(`OUTPUT on ${param.name} without a variable to receive it`);
      given.set(param.key, { v, out, outVar });
    }
    if (ctx.nesting >= MAX_NESTING) throw new Unsupported('procedures nested more than 32 deep');
    const local = new Map();
    for (const p of proc.params) {
      const g = given.get(p.key);
      if (!g && !p.hasDefault) throw new Unsupported(`${procName} expects ${p.name}, which was not supplied`);
      local.set(p.key, { type: p.type, value: coerce(g ? g.v : p.def, p.type) });
    }
    const before = ctx.trancount;
    let rc = 0;
    ctx.nesting++;
    try {
      inSource(proc, () => run(proc.body, local));
    } catch (err) {
      if (!(err instanceof Signal && err.kind === 'return')) throw err;
      rc = err.value === null || err.value === undefined ? 0 : coerce(err.value, { kind: 'int' });
    } finally {
      ctx.nesting--;
    }
    for (const [key, g] of given) {
      if (g.out) assign(scope, g.outVar, local.get(key).value);
    }
    if (statusVar) assign(scope, statusVar, rc);
    if (ctx.trancount !== before) {
      throw new TsqlError(266, `Transaction count after EXECUTE indicates a mismatching number of BEGIN and COMMIT statements. Previous count = ${before}, current count = ${ctx.trancount}.`);
    }
  }

  function runPlain(s, e, scope, w) {
    if (ctx.doomed && WRITES.has(w)) throw new TsqlError(3930, DOOMED);
    if (ctx.inFunction && WRITES.has(w)) throw new Unsupported(`${w} inside a function (T-SQL functions cannot change data)`);
    // SELECT @a = expr, @b = expr FROM ...: assign from the last row.
    if (w === 'SELECT' && toks[s + 1] && toks[s + 1].k === 'var' && isSym(toks[s + 2], '=')) {
      let from = s + 1;
      let depth = 0;
      for (; from < e; from++) {
        if (isSym(toks[from], '(')) depth++;
        else if (isSym(toks[from], ')')) depth--;
        else if (depth === 0 && W(toks[from]) === 'FROM') break;
      }
      const items = commaRanges(s + 1, from).map(([a, b]) => {
        if (!(toks[a].k === 'var' && isSym(toks[a + 1], '='))) throw refuse('a SELECT that both assigns variables and returns columns');
        return { v: toks[a], s: a + 2, e: b };
      });
      const parts = items.map((it, n) => `${bind(it.s, it.e, scope).sql} AS c${n}`);
      const b = bind(s + 1, e, scope); // all params of the statement
      const t = translate(`SELECT ${parts.join(', ')} ${from < e ? bind(from, e, scope).sql : ''}`);
      if (t.error) throw new Unsupported(t.error);
      const r = exec(t.sql, b.params);
      const rows = r.length ? r[0].values : [];
      if (rows.length) items.forEach((it, n) => assign(scope, it.v, rows[rows.length - 1][n]));
      return;
    }
    const b = bind(s, e, scope);
    const t = translate(b.sql);
    if (t.error) throw new Unsupported(t.error);
    const results = exec(t.sql, b.params);
    if (ctx.inFunction && results.length) throw new Unsupported('a SELECT that returns rows inside a function');
    for (const r of results) {
      if (r.values.length > 1 && !/\bORDER\s+BY\b/i.test(text(s, e))) {
        throw new Unsupported(`a result of ${r.values.length} rows comes from a statement without ORDER BY, so its order is not fixed`);
      }
      blocks.push({ print: false, text: [r.columns.join(' | '), ...r.values.map(row => row.map(formatValue).join(' | '))].join('\n') });
    }
  }

  // ── Batches ──

  const batches = code.split(/^[ \t]*GO[ \t]*$/gim);
  for (const batch of batches) {
    src = batch;
    toks = tokenize(batch);
    if (toks.length === 0) continue;
    ctx.last = null;
    try {
      const tree = parseBatch(toks);
      const scope = new Map();
      for (const st of tree) {
        try {
          runOne(st, scope);
        } catch (e) {
          if (e instanceof Signal && e.kind === 'return') break;
          throw e;
        }
      }
      if (ctx.trancount > 0) {
        return { error: `the batch ends with a transaction still open (@@TRANCOUNT = ${ctx.trancount}); COMMIT or ROLLBACK it` };
      }
    } catch (e) {
      const where = ctx.last ? `\n    in: ${ctx.last}` : '';
      if (e instanceof TsqlError) return { error: `uncaught error ${e.number}: ${e.message} (catch it with TRY ... CATCH; the check does not print SQL Server's error lines)${where}` };
      if (e instanceof Signal) return { error: `${e.kind.toUpperCase()} outside a loop${where}` };
      if (e instanceof Unsupported) return { error: `${e.message}${where}` };
      throw e;
    }
  }
  return {
    output: blocks.map(b => (b.print ? b.lines.join('\n') : b.text)).join('\n\n'),
  };
}

module.exports = { runBatches, tokenize, parseBatch, TsqlError };
