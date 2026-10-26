#!/usr/bin/env node
// Dependency-light static server for app/build with SPA fallback.
// Usage: node serve-build.js [port]   (env: PORT, HOST)
// Never waits for a build: with no app/build it answers with a self-refreshing "building" page, and it starts
// recall-build.sh (at most once a minute, which itself refuses to run twice) so a missing or stale build gets replaced.
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const root = path.resolve(__dirname, '..', 'app', 'build');
const port = Number(process.argv[2] || process.env.PORT || fs.readFileSync(path.join(__dirname, 'port'), 'utf8').trim());
const host = process.env.HOST || '127.0.0.1';

const stateDir = path.join(process.env.XDG_STATE_HOME || path.join(os.homedir(), '.local', 'state'), 'recall');
const buildScript = path.join(__dirname, 'recall-build.sh');
const KICK_EVERY_MS = 60 * 1000;
let lastKick = 0;

function kickBuild() {
  if (Date.now() - lastKick < KICK_EVERY_MS) return;
  lastKick = Date.now();
  try {
    fs.mkdirSync(stateDir, { recursive: true });
    const log = fs.openSync(path.join(stateDir, 'server.log'), 'a');
    spawn('bash', [buildScript], { detached: true, stdio: ['ignore', log, log] }).on('error', (e) => console.error(e.message)).unref();
  } catch (e) { console.error(e.message); }
}

function buildStatus() {
  try { return fs.readFileSync(path.join(stateDir, 'build.status'), 'utf8').trim(); } catch { return ''; }
}

function buildingPage() {
  const failed = buildStatus() === 'failed';
  const msg = failed
    ? 'Recall could not be built. It will try again shortly - see ~/.local/state/recall/server.log in WSL if this stays.'
    : 'Recall is building. This takes a few minutes the first time. This page refreshes by itself.';
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="5"><title>Recall</title>`
    + `<style>body{font:18px system-ui,sans-serif;background:#1a1030;color:#e8e0ff;display:grid;place-items:center;height:100vh;margin:0}`
    + `div{max-width:32em;padding:1em;text-align:center}</style></head><body><div><h1>Recall</h1><p>${msg}</p></div></body></html>`;
}

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.map': 'application/json',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};

http.createServer((req, res) => {
  if (!fs.existsSync(path.join(root, 'index.html'))) {
    kickBuild();
    res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Retry-After': '5' });
    return res.end(buildingPage());
  }
  if (req.url === '/' || req.url === '/index.html') kickBuild();
  let rel;
  try { rel = decodeURIComponent(new URL(req.url, 'http://x').pathname); }
  catch { res.writeHead(400); return res.end('Bad request'); }
  let file = path.join(root, path.normalize(rel));
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(file, (err, st) => {
    if (!err && st.isDirectory()) file = path.join(file, 'index.html');
    fs.stat(file, (err2, st2) => {
      // Unknown paths without an extension are client-side routes: serve the app shell.
      if (err2 || !st2.isFile()) {
        if (path.extname(rel)) { res.writeHead(404); return res.end('Not found'); }
        file = path.join(root, 'index.html');
      }
      const cache = file.includes(`${path.sep}static${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache';
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': cache });
      fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
    });
  });
}).on('error', (e) => { console.error(e.message); process.exit(e.code === 'EADDRINUSE' ? 0 : 1); })
  .listen(port, host, () => { console.log(`Recall serving ${root} on http://${host}:${port}`); kickBuild(); });
