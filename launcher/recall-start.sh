#!/usr/bin/env bash
# Start the server for Recall's production build on the port in launcher/port in the background (idempotent).
# Runs inside WSL. Safe to run twice: if the port already answers it does nothing.
set -u
ROOT="$(cd "$(dirname "$(readlink -f "$0")")/.." && pwd)"
PORT="${PORT:-$(tr -d '[:space:]' < "$ROOT/launcher/port")}"
STATE="${XDG_STATE_HOME:-$HOME/.local/state}/recall"
mkdir -p "$STATE"
LOG="$STATE/server.log"

answers() { curl -fsS -o /dev/null --max-time 2 "http://127.0.0.1:$PORT/" 2>/dev/null; }
listening() { (exec 3<>"/dev/tcp/127.0.0.1/$PORT") 2>/dev/null; }

if listening; then exit 0; fi

exec 9>"$STATE/start.lock"
flock 9
if listening; then exit 0; fi

. "$ROOT/launcher/find-node.sh"
recall_find_node
command -v node >/dev/null 2>&1 || { echo "node not found in WSL" >>"$LOG"; exit 1; }

# The server never waits for a build: it serves app/build when there is one, a "building" page otherwise,
# and starts launcher/recall-build.sh itself (see serve-build.js), which swaps in a fresh build only on success.

# WSL kills everything a wsl.exe session started once that session ends, even setsid/nohup children.
# --foreground (used by recall-launch.ps1) keeps node as the hidden wsl.exe's own process so the server lives.
if [ "${1:-}" = "--foreground" ]; then
  echo $$ > "$STATE/server.pid"
  PORT="$PORT" exec node "$ROOT/launcher/serve-build.js" "$PORT" >>"$LOG" 2>&1 9>&- </dev/null
fi

# Detach fully so no terminal stays attached; lock fd is closed for the child.
PORT="$PORT" setsid nohup node "$ROOT/launcher/serve-build.js" "$PORT" >>"$LOG" 2>&1 9>&- </dev/null &
echo $! > "$STATE/server.pid"
exit 0
