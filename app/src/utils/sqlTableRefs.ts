/**
 * Which tables a piece of SQL reads from or writes to, for the sample-data
 * grids on SQL questions. Deliberately small: it knows the clause keywords
 * that introduce a table name and the names a query defines for itself (CTEs
 * and table aliases), which is all the Querying Foundations questions use.
 */

const TABLE_INTRO = /\b(?:FROM|JOIN|INTO|UPDATE|TABLE)\s+(#?[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)?)/gi;
const CTE_NAME = /(?:\bWITH|,)\s*([A-Za-z_]\w*)\s*(?:\([^)]*\))?\s+AS\s*\(/gi;
// `FROM dbo.DimProduct AS tgt`, `JOIN stg.Product src`, `UPDATE tgt` targets
const ALIAS = /\b(?:FROM|JOIN)\s+#?[A-Za-z_][\w.]*\s+(?:AS\s+)?([A-Za-z_]\w*)/gi;

const KEYWORDS = new Set([
  'where', 'on', 'join', 'inner', 'left', 'right', 'full', 'cross', 'outer', 'group', 'order',
  'having', 'union', 'except', 'intersect', 'set', 'values', 'select', 'as', 'with', 'when',
  'offset', 'fetch', 'top', 'and', 'or', 'not', 'is', 'in', 'exists', 'output', 'cross',
]);

function stripComments(sql: string): string {
  return sql.replace(/--[^\n]*/g, '');
}

/** Names the SQL defines itself: CTE names and table aliases. */
export function definedNames(sql: string): Set<string> {
  const code = stripComments(sql);
  const names = new Set<string>();
  for (const m of Array.from(code.matchAll(CTE_NAME))) names.add(m[1].toLowerCase());
  for (const m of Array.from(code.matchAll(ALIAS))) {
    const alias = m[1].toLowerCase();
    if (!KEYWORDS.has(alias)) names.add(alias);
  }
  return names;
}

/**
 * Table names the SQL references, lowercased, excluding its own CTEs and
 * aliases (so `UPDATE tgt ... FROM dbo.DimProduct AS tgt` yields only
 * `dbo.dimproduct`).
 */
export function referencedTables(sql: string): string[] {
  const code = stripComments(sql);
  const own = definedNames(code);
  const found: string[] = [];
  for (const m of Array.from(code.matchAll(TABLE_INTRO))) {
    const t = m[1].toLowerCase();
    if (own.has(t) || KEYWORDS.has(t) || found.includes(t)) continue;
    found.push(t);
  }
  return found;
}
