// Copies monaco-editor's prebuilt AMD bundle (min/vs) into public/monaco/vs so the editor is served
// from the app itself (offline) without webpack compiling, source-mapping and minifying its ~2,200 ESM modules.
// Runs before `npm start` and `npm run build`; skips the copy when the installed version is already there.
const fs = require('fs');
const path = require('path');

const pkg = require('monaco-editor/package.json');
const src = path.join(path.dirname(require.resolve('monaco-editor/package.json')), 'min', 'vs');
const dest = path.join(__dirname, '..', 'public', 'monaco', 'vs');
const stamp = path.join(dest, '.version');

if (fs.existsSync(stamp) && fs.readFileSync(stamp, 'utf8') === pkg.version) process.exit(0);
fs.rmSync(dest, { recursive: true, force: true });
// Keep the installed files' timestamps so launcher/recall-build.sh does not see public/ as newer than the build.
fs.cpSync(src, dest, { recursive: true, preserveTimestamps: true });
fs.writeFileSync(stamp, pkg.version);
const { atime, mtime } = fs.statSync(path.join(src, '..', '..', 'package.json'));
fs.utimesSync(stamp, atime, mtime);
