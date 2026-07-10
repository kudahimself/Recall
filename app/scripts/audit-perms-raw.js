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

const filter = process.argv[2] || '';
const seen = new Map();

for (const file of top) {
  let content;
  try { content = fs.readFileSync(file, 'utf8'); } catch { continue; }
  for (const line of content.split('\n')) {
    if (!line.trim()) continue;
    let obj;
    try { obj = JSON.parse(line); } catch { continue; }
    if (!obj.message || obj.message.role !== 'assistant') continue;
    const blocks = obj.message.content;
    if (!Array.isArray(blocks)) continue;
    for (const b of blocks) {
      if (b.type !== 'tool_use' || b.name !== 'Bash') continue;
      const cmd = b.input && b.input.command;
      if (typeof cmd !== 'string') continue;
      if (filter && !cmd.includes(filter)) continue;
      // Trim to first 120 chars
      const key = cmd.trim().slice(0, 140);
      seen.set(key, (seen.get(key) || 0) + 1);
    }
  }
}

const sorted = [...seen.entries()].sort((a, b) => b[1] - a[1]);
for (const [k, v] of sorted.slice(0, 60)) {
  console.log(`${String(v).padStart(5)}  ${k}`);
}
