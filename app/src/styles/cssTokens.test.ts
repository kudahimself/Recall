/**
 * Component stylesheets (the CSS Modules: components/ui and the screens built
 * on them) read the design tokens in styles/tokens.css and nothing else: no
 * colour literals, and no px or rem lengths. Media and container queries (CSS
 * variables cannot go there), 1px hairlines and animation keyframes are the
 * only exceptions.
 *
 * Run: npm test -- --testPathPattern=cssTokens --watchAll=false
 */
import fs from 'fs';
import path from 'path';

const SRC = path.resolve(__dirname, '..');

function moduleCssFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'node_modules' ? [] : moduleCssFiles(full);
    return entry.name.endsWith('.module.css') ? [full] : [];
  });
}

/** The declarations of a stylesheet outside @keyframes, as "selector-less" property: value pairs. */
function declarations(css: string): Array<{ prop: string; value: string }> {
  const text = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Drop keyframes blocks: two levels of braces.
    .replace(/@keyframes[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const out: Array<{ prop: string; value: string }> = [];
  const re = /([a-z-]+)\s*:\s*([^;{}]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) out.push({ prop: m[1], value: m[2].trim() });
  return out;
}

const files = moduleCssFiles(SRC);

it('finds the component stylesheets', () => {
  expect(files.length).toBeGreaterThan(10);
});

describe.each(files.map(f => [path.relative(SRC, f), f]))('%s', (_name, file) => {
  const css = fs.readFileSync(file, 'utf8');
  const decls = declarations(css);

  it('uses no colour literals', () => {
    const raw = decls.filter(d => /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(/i.test(d.value));
    expect(raw).toEqual([]);
  });

  it('uses no px or rem lengths besides 1px hairlines', () => {
    const raw = decls.filter(d => {
      const lengths = d.value.match(/-?\d*\.?\d+(px|rem)\b/g) ?? [];
      return lengths.some(l => l !== '1px');
    });
    expect(raw).toEqual([]);
  });
});
