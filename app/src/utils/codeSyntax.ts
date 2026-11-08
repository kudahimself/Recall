import { CodeLanguage } from '../types';

const COMMENT_MARKER: Partial<Record<CodeLanguage, string>> = {
  [CodeLanguage.PYTHON]: '#',
  [CodeLanguage.SQL]: '--',
  [CodeLanguage.JAVASCRIPT]: '//',
  [CodeLanguage.TYPESCRIPT]: '//',
  [CodeLanguage.JSX]: '//',
};

/** Split a code line into its code and its trailing comment, ignoring markers inside quotes. */
export function splitComment(line: string, language?: CodeLanguage): [string, string] {
  const marker = language ? COMMENT_MARKER[language] : undefined;
  if (!marker) return [line, ''];
  let quote: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { quote = c; continue; }
    if (line.startsWith(marker, i)) return [line.slice(0, i), line.slice(i)];
  }
  return [line, ''];
}

/** What a piece of code is, for its colour: keyword, string, number, function or type, plain. */
export type TokenKind = 'kw' | 'str' | 'num' | 'fn' | null;

export interface CodeToken {
  text: string;
  kind: TokenKind;
}

const words = (list: string) => new Set(list.split(/\s+/).filter(Boolean));

const JS_KEYWORDS = words(`
  async await break case catch class const continue debugger default delete do else export extends
  false finally for from function if import in instanceof let new null of return static super switch
  this throw true try typeof undefined var void while with yield`);

const TS_KEYWORDS = new Set(Array.from(JS_KEYWORDS).concat(Array.from(words(`
  abstract as declare enum implements interface keyof namespace private protected public readonly
  satisfies type`))));

const KEYWORDS: Partial<Record<CodeLanguage, Set<string>>> = {
  [CodeLanguage.PYTHON]: words(`
    and as assert async await break class continue def del elif else except False finally for from
    global if import in is lambda None nonlocal not or pass raise return self True try while with yield`),
  [CodeLanguage.SQL]: words(`
    add all alter and as asc between by case cast create cross delete desc distinct drop else end exists
    false from full group having if in index inner insert intersect into is join key left like limit merge
    not null on or order outer over partition primary references right select set table then true union
    update using values view when where with`),
  [CodeLanguage.JAVASCRIPT]: JS_KEYWORDS,
  [CodeLanguage.JSX]: TS_KEYWORDS,
  [CodeLanguage.TYPESCRIPT]: TS_KEYWORDS,
};

const NUMBER = /^\d[\d_]*(\.\d+)?([eE][+-]?\d+)?[a-z%]*/;
const WORD = /^[A-Za-z_$][\w$]*/;

/** A quoted string from `start`, to its closing quote or the end of the line. */
function stringEnd(line: string, start: number): number {
  const quote = line[start];
  for (let i = start + 1; i < line.length; i++) {
    if (line[i] === '\\') { i++; continue; }
    if (line[i] === quote) return i + 1;
  }
  return line.length;
}

/** Markup: tag names as keywords, attribute names as functions, values as strings. */
function markupTokens(line: string): CodeToken[] {
  const out: CodeToken[] = [];
  const re = /(<\/?)([\w-]+)|([\w:@-]+)(?==)|("[^"]*"?|'[^']*'?)/g;
  let at = 0;
  for (let m = re.exec(line); m; m = re.exec(line)) {
    const i = m.index;
    if (i > at) out.push({ text: line.slice(at, i), kind: null });
    if (m[2]) {
      out.push({ text: m[1], kind: null }, { text: m[2], kind: 'kw' });
    } else if (m[3]) {
      out.push({ text: m[3], kind: 'fn' });
    } else {
      out.push({ text: m[4], kind: 'str' });
    }
    at = i + m[0].length;
  }
  if (at < line.length) out.push({ text: line.slice(at), kind: null });
  return out;
}

/** Stylesheets: at-rules as keywords, property names as functions, numbers with their units. */
function styleTokens(line: string): CodeToken[] {
  const out: CodeToken[] = [];
  const re = /(@[\w-]+)|([\w-]+)(?=\s*:(?!:))|("[^"]*"?|'[^']*'?)|(#[\da-fA-F]{3,8}\b|-?\d*\.?\d+[a-z%]*)/g;
  let at = 0;
  for (let m = re.exec(line); m; m = re.exec(line)) {
    const i = m.index;
    if (i > at) out.push({ text: line.slice(at, i), kind: null });
    out.push({ text: m[0], kind: m[1] ? 'kw' : m[2] ? 'fn' : m[3] ? 'str' : 'num' });
    at = i + m[0].length;
  }
  if (at < line.length) out.push({ text: line.slice(at), kind: null });
  return out;
}

/**
 * One line of code (without its trailing comment) as coloured pieces:
 * keywords, strings, numbers, and the names of called functions and types.
 * A light scan a line at a time, enough to read a solution by; a string that
 * runs past the line's end is coloured to the end of the line.
 */
export function highlightLine(line: string, language?: CodeLanguage): CodeToken[] {
  if (!language) return [{ text: line, kind: null }];
  if (language === CodeLanguage.HTML) return markupTokens(line);
  if (language === CodeLanguage.CSS) return styleTokens(line);
  const keywords = KEYWORDS[language] ?? new Set<string>();
  const caseless = language === CodeLanguage.SQL;
  const out: CodeToken[] = [];
  const push = (text: string, kind: TokenKind) => {
    const last = out[out.length - 1];
    if (last && last.kind === kind) last.text += text;
    else out.push({ text, kind });
  };
  let i = 0;
  while (i < line.length) {
    const c = line[i];
    const rest = line.slice(i);
    if (c === '"' || c === "'" || c === '`') {
      const end = stringEnd(line, i);
      push(line.slice(i, end), 'str');
      i = end;
      continue;
    }
    // Python's f"", r"", b"" strings: the prefix goes with the string.
    if (language === CodeLanguage.PYTHON && /^[fFrRbBuU]{1,2}["']/.test(rest)) {
      const q = rest.search(/["']/);
      const end = stringEnd(line, i + q);
      push(line.slice(i, end), 'str');
      i = end;
      continue;
    }
    if (c === '@' && language === CodeLanguage.PYTHON) {
      const m = rest.match(/^@[\w.]+/);
      if (m) { push(m[0], 'fn'); i += m[0].length; continue; }
    }
    const num = rest.match(NUMBER);
    if (num && !/[\w$]/.test(line[i - 1] ?? '')) {
      push(num[0], 'num');
      i += num[0].length;
      continue;
    }
    const word = rest.match(WORD);
    if (word) {
      const w = word[0];
      const after = line.slice(i + w.length);
      const kind: TokenKind = keywords.has(caseless ? w.toLowerCase() : w) ? 'kw'
        : /^\s*\(/.test(after) || (/^[A-Z]/.test(w) && !caseless) ? 'fn'
        : null;
      push(w, kind);
      i += w.length;
      continue;
    }
    push(c, null);
    i++;
  }
  return out;
}
