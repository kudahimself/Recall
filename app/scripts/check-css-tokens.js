#!/usr/bin/env node
/**
 * Component stylesheets (the CSS Modules: components/ui and the screens built
 * on them) read the design tokens in src/styles/tokens.css and nothing else:
 * no colour literals (#hex, rgb()/rgba(), hsl()/hsla()), and no px or rem
 * lengths except 1px hairlines.
 * Media and container query preludes (CSS variables cannot go there) and
 * @keyframes blocks are exempt.
 *
 * Usage: node scripts/check-css-tokens.js
 * Exit code 1 if any declaration breaks a rule.
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');

function moduleCssFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'node_modules' ? [] : moduleCssFiles(full);
    return entry.name.endsWith('.module.css') ? [full] : [];
  });
}

function declarations(css) {
  const text = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/@keyframes[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const out = [];
  const re = /([a-z-]+)\s*:\s*([^;{}]+);/g;
  let m;
  while ((m = re.exec(text)) !== null) out.push({ prop: m[1], value: m[2].trim() });
  return out;
}

function problem(value) {
  if (/#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(/i.test(value)) return 'colour literal';
  const lengths = value.match(/-?\d*\.?\d+(px|rem)\b/g) || [];
  if (lengths.some(l => l !== '1px')) return 'px/rem length';
  return null;
}

const files = moduleCssFiles(SRC);
const violations = [];
for (const file of files) {
  const rel = path.relative(path.join(__dirname, '..'), file);
  for (const { prop, value } of declarations(fs.readFileSync(file, 'utf8'))) {
    const kind = problem(value);
    if (kind) violations.push({ rel, prop, value, kind });
  }
}

for (const v of violations) {
  console.log(`${v.rel}  ${v.prop}: ${v.value}  (${v.kind})`);
}
console.log(
  `check-css-tokens: ${violations.length} violation(s) in ${files.length} CSS Module file(s)`
);
process.exit(violations.length ? 1 : 0);
