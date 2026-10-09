#!/usr/bin/env bash
# Start Recall's production build on the port in launcher/port in the background (idempotent).
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

# NVM-style installs are not on PATH for non-interactive shells.
if ! command -v node >/dev/null 2>&1; then
  for f in "$HOME/.nvm/nvm.sh" "$HOME/.profile" "$HOME/.bashrc"; do
    [ -f "$f" ] && . "$f" >/dev/null 2>&1
    command -v node >/dev/null 2>&1 && break
  done
fi
command -v node >/dev/null 2>&1 || { echo "node not found in WSL" >>"$LOG"; exit 1; }

APP="$ROOT/app"
BUILD="$APP/build/index.html"
need_build=0
if [ ! -f "$BUILD" ]; then need_build=1
elif [ -n "$(find "$APP/src" "$APP/public" "$APP/package.json" "$APP/package-lock.json" "$APP/tsconfig.json" -newer "$BUILD" -type f -print -quit 2>/dev/null)" ]; then need_build=1
fi
if [ "$need_build" = 1 ]; then
  [ -d "$APP/node_modules" ] || (cd "$APP" && npm install >>"$LOG" 2>&1) || exit 1
  (cd "$APP" && CI=false npm run build >>"$LOG" 2>&1) || exit 1
fi

# Detach fully so no terminal stays attached; lock fd is closed for the child.
PORT="$PORT" setsid nohup node "$ROOT/launcher/serve-build.js" "$PORT" >>"$LOG" 2>&1 9>&- </dev/null &
echo $! > "$STATE/server.pid"
exit 0
