#!/usr/bin/env bash
# Build app/ into app/build.tmp and swap it into app/build only when the build succeeds.
# The last good build is never deleted. Does nothing when app/build is already newer than the sources.
# Only one build runs at a time (non-blocking lock). Writes "building" / "ok" / "failed" to $STATE/build.status.
set -u
ROOT="$(cd "$(dirname "$(readlink -f "$0")")/.." && pwd)"
STATE="${XDG_STATE_HOME:-$HOME/.local/state}/recall"
mkdir -p "$STATE"
LOG="$STATE/server.log"
APP="$ROOT/app"

exec 8>"$STATE/build.lock"
flock -n 8 || exit 0

# A previous swap interrupted between its two renames leaves the good build under build.old.
if [ ! -d "$APP/build" ] && [ -d "$APP/build.old" ]; then mv "$APP/build.old" "$APP/build"; fi
rm -rf "$APP/build.tmp" "$APP/build.old"

BUILD="$APP/build/index.html"
if [ -f "$BUILD" ] && [ -z "$(find "$APP/src" "$APP/public" "$APP/package.json" "$APP/package-lock.json" "$APP/tsconfig.json" -newer "$BUILD" -type f -print -quit 2>/dev/null)" ]; then
  echo ok > "$STATE/build.status"
  exit 0
fi

# A failed rebuild must not retry on every page load while a good (older) build is being served.
if [ -f "$BUILD" ] && [ "$(cat "$STATE/build.status" 2>/dev/null)" = failed ] && [ -n "$(find "$STATE/build.status" -mmin -30 -print 2>/dev/null)" ]; then exit 0; fi

. "$ROOT/launcher/find-node.sh"
recall_find_node
command -v node >/dev/null 2>&1 || { echo "node not found in WSL" >>"$LOG"; echo failed > "$STATE/build.status"; exit 1; }

echo building > "$STATE/build.status"
echo "$(date -Is) build started" >>"$LOG"
# The stamp is the build's start time: edits made while it runs stay newer than the result and trigger another build.
stamp="$STATE/build.stamp"
touch "$stamp"

fail() { echo "$(date -Is) build failed: $1" >>"$LOG"; rm -rf "$APP/build.tmp"; echo failed > "$STATE/build.status"; exit 1; }

[ -d "$APP/node_modules" ] || (cd "$APP" && npm install >>"$LOG" 2>&1) || fail "npm install"
(cd "$APP" && CI=false BUILD_PATH=build.tmp nice -n 10 npm run build >>"$LOG" 2>&1) || fail "npm run build"
[ -f "$APP/build.tmp/index.html" ] || fail "no index.html produced"

touch -r "$stamp" "$APP/build.tmp/index.html"
if [ -d "$APP/build" ]; then mv "$APP/build" "$APP/build.old" || fail "swap"; fi
mv "$APP/build.tmp" "$APP/build" || { [ -d "$APP/build.old" ] && mv "$APP/build.old" "$APP/build"; fail "swap"; }
rm -rf "$APP/build.old"
echo ok > "$STATE/build.status"
echo "$(date -Is) build finished" >>"$LOG"
