#!/usr/bin/env node
// Dependency-light static server for app/build with SPA fallback.
// Usage: node serve-build.js [port]   (env: PORT, HOST)
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'app', 'build');
const port = Number(process.argv[2] || process.env.PORT || fs.readFileSync(path.join(__dirname, 'port'), 'utf8').trim());
const host = process.env.HOST || '127.0.0.1';

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.map': 'application/json',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};

http.createServer((req, res) => {
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
  .listen(port, host, () => console.log(`Recall serving ${root} on http://${host}:${port}`));
