/**
 * The desktop launcher is Windows script glue that nothing else exercises.
 * These checks catch the mistakes that shipped once: a bare Environment() call in the .vbs
 * and a start script that cannot find node under the minimal PATH of a non-interactive wsl.exe.
 */
import { execFileSync, spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const LAUNCHER = path.resolve(__dirname, '..', '..', 'launcher');
const read = (f: string) => fs.readFileSync(path.join(LAUNCHER, f), 'utf8');

describe('recall-launch.vbs', () => {
  const code = read('recall-launch.vbs').split('\n').filter((l) => !l.trim().startsWith("'")).join('\n');

  it('does not call the bare Environment(...) object, which is not defined in VBScript', () => {
    expect(code).not.toMatch(/(^|[^.\w])Environment\s*\(/i);
  });

  it('reads LOCALAPPDATA through WScript.Shell', () => {
    expect(code).toMatch(/WScript\.Shell"\)\.ExpandEnvironmentStrings\("%LOCALAPPDATA%"\)/i);
  });
});

describe('recall-launch.ps1', () => {
  it('starts the server in the foreground, since WSL kills servers that outlive their wsl.exe session', () => {
    expect(read('recall-launch.ps1')).toMatch(/\$StartScript,\s*'--foreground'/);
  });
});

describe('find-node.sh', () => {
  it('finds node when PATH is minimal and no shell rc files run', () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'recall-home-'));
    try {
      const bin = path.join(home, '.nix-profile', 'bin');
      fs.mkdirSync(bin, { recursive: true });
      fs.writeFileSync(path.join(bin, 'node'), '#!/bin/sh\necho fake\n', { mode: 0o755 });
      const out = execFileSync('bash', ['-c', '. "$1"; recall_find_node && command -v node', 'x', path.join(LAUNCHER, 'find-node.sh')], {
        env: { HOME: home, PATH: '/usr/bin:/bin' } as NodeJS.ProcessEnv, encoding: 'utf8',
      });
      expect(out.trim()).toBe(path.join(bin, 'node'));
    } finally {
      fs.rmSync(home, { recursive: true, force: true });
    }
  });

  it('fails cleanly when node is nowhere to be found', () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'recall-home-'));
    try {
      const r = spawnSync('bash', ['-c', '. "$1"; recall_find_node', 'x', path.join(LAUNCHER, 'find-node.sh')], {
        env: { HOME: home, PATH: '/nonexistent' } as NodeJS.ProcessEnv, encoding: 'utf8',
      });
      // Only skip the negative case on machines that keep a node in /usr/local/bin.
      if (!fs.existsSync('/usr/local/bin/node')) expect(r.status).not.toBe(0);
    } finally {
      fs.rmSync(home, { recursive: true, force: true });
    }
  });
});
