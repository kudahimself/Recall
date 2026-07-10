#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

const projectsDir = path.join(os.homedir(), '.claude', 'projects');
const dirs = fs.readdirSync(projectsDir).map(d => path.join(projectsDir, d));
const files = [];
for (const d of dirs) {
  if (!fs.statSync(d).isDirectory()) continue;
  for (const f of fs.readdirSync(d)) {
    if (f.endsWith('.jsonl')) files.push(path.join(d, f));
  }
}
files.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
const top = files.slice(0, 50);

const bashCounts = new Map();
const mcpCounts = new Map();

// Strip leading wrappers; return list of segments separated by &&/;/|/||
function splitSegments(s) {
  const segs = [];
  let depth = 0; // for parens
  let inSingle = false, inDouble = false;
  let cur = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    const next = s[i + 1];
    if (c === "\\" && next) { cur += c + next; i++; continue; }
    if (!inDouble && c === "'") { inSingle = !inSingle; cur += c; continue; }
    if (!inSingle && c === '"') { inDouble = !inDouble; cur += c; continue; }
    if (inSingle || inDouble) { cur += c; continue; }
    if (c === '(') { depth++; cur += c; continue; }
    if (c === ')') { depth--; cur += c; continue; }
    if (depth === 0) {
      if (c === '&' && next === '&') { segs.push(cur); cur = ''; i++; continue; }
      if (c === '|' && next === '|') { segs.push(cur); cur = ''; i++; continue; }
      if (c === ';') { segs.push(cur); cur = ''; continue; }
      if (c === '|') { segs.push(cur); cur = ''; continue; }
    }
    cur += c;
  }
  if (cur.trim()) segs.push(cur);
  return segs.map(s => s.trim()).filter(Boolean);
}

function leadingPair(seg) {
  let s = seg.trim();
  // Strip leading env-var assignments
  while (/^[A-Za-z_][A-Za-z0-9_]*=\S*\s+/.test(s)) {
    s = s.replace(/^[A-Za-z_][A-Za-z0-9_]*=\S*\s+/, '');
  }
  s = s.replace(/^sudo\s+(-[A-Za-z]+\s+)*/, '');
  s = s.replace(/^timeout\s+\S+\s+/, '');
  // First token (handles quoted paths as one token)
  let first = '';
  let rest = '';
  if (s.startsWith('"')) {
    const m = s.match(/^"([^"]*)"\s*(.*)/);
    if (m) { first = m[1]; rest = m[2]; }
  } else if (s.startsWith("'")) {
    const m = s.match(/^'([^']*)'\s*(.*)/);
    if (m) { first = m[1]; rest = m[2]; }
  } else {
    const idx = s.indexOf(' ');
    first = idx === -1 ? s : s.slice(0, idx);
    rest = idx === -1 ? '' : s.slice(idx + 1).trim();
  }
  // Take basename for command lookups (so `.venv/Scripts/python.exe` → `python`)
  let basename = first.split(/[\\/]/).pop() || '';
  basename = basename.replace(/\.exe$/i, '');
  // Subcommand: first whitespace-separated token of rest, ignoring flags
  const subTokens = rest.split(/\s+/).filter(t => t && !t.startsWith('-'));
  const sub = subTokens[0] || '';
  return [basename, sub, first];
}

for (const file of top) {
  let content;
  try { content = fs.readFileSync(file, 'utf8'); } catch { continue; }
  const lines = content.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    let obj;
    try { obj = JSON.parse(line); } catch { continue; }
    const role = obj.message && obj.message.role;
    if (role !== 'assistant') continue;
    const blocks = obj.message.content;
    if (!Array.isArray(blocks)) continue;
    for (const b of blocks) {
      if (b.type !== 'tool_use') continue;
      const name = b.name;
      if (name === 'Bash') {
        const cmd = b.input && b.input.command;
        if (typeof cmd !== 'string') continue;
        const segs = splitSegments(cmd);
        for (const seg of segs) {
          const [base, sub] = leadingPair(seg);
          if (!base) continue;
          if (base === 'cd') continue; // ignore navigation
          const key = sub ? `${base} ${sub}` : base;
          bashCounts.set(key, (bashCounts.get(key) || 0) + 1);
        }
      } else if (name && name.startsWith('mcp__')) {
        mcpCounts.set(name, (mcpCounts.get(name) || 0) + 1);
      }
    }
  }
}

const sortedBash = [...bashCounts.entries()].sort((a, b) => b[1] - a[1]);
const sortedMcp = [...mcpCounts.entries()].sort((a, b) => b[1] - a[1]);

console.log('=== Bash command pairs (top 80) ===');
for (const [k, v] of sortedBash.slice(0, 80)) {
  console.log(`${String(v).padStart(5)}  ${k}`);
}
console.log('\n=== MCP tools ===');
for (const [k, v] of sortedMcp) {
  console.log(`${String(v).padStart(5)}  ${k}`);
}
console.log(`\nScanned ${top.length} transcripts.`);
