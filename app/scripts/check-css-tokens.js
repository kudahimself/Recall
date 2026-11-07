#!/usr/bin/env node
/**
 * Every stylesheet under src reads the design tokens in src/styles/tokens.css
 * and nothing else:
 * - no colour literals (#hex, rgb()/rgba(), hsl()/hsla());
 * - no px or rem lengths except 1px hairlines (and -1px, their negative);
 * - every var(--name) is a token that exists: declared in a stylesheet under
 *   src, or set on an element from a component (a style={{ '--name': ... }});
 * - global CSS lives only in src/styles (tokens.css, base.css); every other
 *   stylesheet is a CSS Module beside its component.
 * tokens.css is where the raw values are defined, so the first two rules do not
 * apply to it. Media and container query preludes (CSS variables cannot go
 * there) and @keyframes blocks are exempt.
 *
 * Usage: node scripts/check-css-tokens.js
 * Exit code 1 if anything breaks a rule.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const STYLES = path.join(SRC, 'styles');
const TOKENS = path.join(STYLES, 'tokens.css');

function walk(dir, test) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'node_modules' ? [] : walk(full, test);
    return test(entry.name) ? [full] : [];
  });
}

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function declarations(css) {
  const text = stripComments(css).replace(/@keyframes[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const out = [];
  const re = /(--[\w-]+|[a-z-]+)\s*:\s*([^;{}]+);/g;
  let m;
  while ((m = re.exec(text)) !== null) out.push({ prop: m[1], value: m[2].trim() });
  return out;
}

function literalProblem(value) {
  if (/#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(/i.test(value)) return 'colour literal';
  const lengths = value.match(/-?\d*\.?\d+(px|rem)\b/g) || [];
  if (lengths.some(l => l !== '1px' && l !== '-1px')) return 'px/rem length';
  return null;
}

const cssFiles = walk(SRC, name => name.endsWith('.css'));
const codeFiles = walk(SRC, name => /\.(tsx?|jsx?)$/.test(name) && !/\.test\./.test(name));

// Every custom property a stylesheet declares, or a component sets inline.
const defined = new Set();
for (const file of cssFiles) {
  for (const { prop } of declarations(fs.readFileSync(file, 'utf8'))) if (prop.startsWith('--')) defined.add(prop);
}
for (const file of codeFiles) {
  for (const m of fs.readFileSync(file, 'utf8').matchAll(/['"`](--[a-z][\w-]*)['"`]\s*(?:as\s+\w+\s*\]?\s*)?[\]:]/g)) defined.add(m[1]);
}

const violations = [];
for (const file of cssFiles) {
  const rel = path.relative(ROOT, file);
  const isModule = file.endsWith('.module.css');
  if (!isModule && path.dirname(file) !== STYLES) {
    violations.push({ rel, prop: '(file)', value: 'global stylesheet', kind: 'global CSS outside src/styles; make it a CSS Module' });
  }
  for (const { prop, value } of declarations(fs.readFileSync(file, 'utf8'))) {
    if (file !== TOKENS) {
      const kind = literalProblem(value);
      if (kind) violations.push({ rel, prop, value, kind });
    }
    for (const m of value.matchAll(/var\(\s*(--[\w-]+)/g)) {
      if (!defined.has(m[1])) violations.push({ rel, prop, value, kind: `undefined token ${m[1]}` });
    }
  }
}

for (const v of violations) {
  console.log(`${v.rel}  ${v.prop}: ${v.value}  (${v.kind})`);
}
const modules = cssFiles.filter(f => f.endsWith('.module.css')).length;
console.log(
  `check-css-tokens: ${violations.length} violation(s) in ${cssFiles.length} stylesheet(s) (${modules} CSS Modules, ${cssFiles.length - modules} global)`
);
process.exit(violations.length ? 1 : 0);
