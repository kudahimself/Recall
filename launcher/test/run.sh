#!/usr/bin/env bash
# Tests for the launcher build/serve scripts. Uses a throwaway copy of the launcher with a fake npm; no real build runs.
set -u
HERE="$(cd "$(dirname "$(readlink -f "$0")")" && pwd)"
SRC="$HERE/../.."
T="$(mktemp -d)"
PIDS=()
cleanup() { for p in "${PIDS[@]:-}"; do [ -n "$p" ] && kill "$p" 2>/dev/null; done; rm -rf "$T"; }
trap cleanup EXIT
fails=0
check() { if [ "$2" = "$3" ]; then echo "ok   - $1"; else echo "FAIL - $1 (got '$2', want '$3')"; fails=$((fails+1)); fi; }

setup() { # fresh tree; fake npm writes $BUILD_PATH/index.html unless FAKE_NPM_FAIL=1, sleeping FAKE_NPM_SLEEP seconds
  rm -rf "$T/tree" "$T/state"; mkdir -p "$T/tree/launcher" "$T/tree/app/src" "$T/tree/app/public" "$T/tree/app/node_modules" "$T/bin" "$T/state"
  cp "$SRC"/launcher/{find-node.sh,recall-build.sh,recall-start.sh,serve-build.js,port} "$T/tree/launcher/"
  echo src > "$T/tree/app/src/a.ts"; echo '{}' > "$T/tree/app/package.json"
  cat > "$T/bin/npm" <<'NPM'
#!/usr/bin/env bash
echo run >> "$FAKE_NPM_LOG"
sleep "${FAKE_NPM_SLEEP:-0}"
[ "${FAKE_NPM_FAIL:-0}" = 1 ] && { rm -rf "$BUILD_PATH"; exit 1; }
mkdir -p "$BUILD_PATH"; echo "<html>$FAKE_NPM_TAG</html>" > "$BUILD_PATH/index.html"
NPM
  chmod +x "$T/bin/npm"; : > "$T/npm.log"
  export PATH="$T/bin:$PATH" XDG_STATE_HOME="$T/state" FAKE_NPM_LOG="$T/npm.log" FAKE_NPM_TAG=new FAKE_NPM_FAIL=0 FAKE_NPM_SLEEP=0
}
build() { bash "$T/tree/launcher/recall-build.sh"; }
runs() { wc -l < "$T/npm.log" | tr -d ' '; }
status() { cat "$T/state/recall/build.status" 2>/dev/null; }
good() { mkdir -p "$T/tree/app/build"; echo "<html>old</html>" > "$T/tree/app/build/index.html"; touch -d '1 hour ago' "$T/tree/app/build/index.html"; }

setup; build
check "no build: builds and swaps in" "$(cat "$T/tree/app/build/index.html")" "<html>new</html>"
check "no build: status ok, no leftovers" "$(status)$(ls "$T/tree/app" | grep -c 'build\.')" "ok0"
build; check "fresh build: second run does not rebuild" "$(runs)" "1"

setup; good; touch "$T/tree/app/src/a.ts"; build
check "sources changed: rebuilt" "$(cat "$T/tree/app/build/index.html")" "<html>new</html>"

setup; good; touch -d '2 hours ago' "$T/tree/app/src/a.ts" "$T/tree/app/package.json"; build
check "sources unchanged: kept, no npm run" "$(runs)$(cat "$T/tree/app/build/index.html")" "0<html>old</html>"

setup; good; touch "$T/tree/app/src/a.ts"; FAKE_NPM_FAIL=1 build
check "failed rebuild: last good build kept" "$(cat "$T/tree/app/build/index.html")$(status)" "<html>old</html>failed"
check "failed rebuild: tmp cleaned" "$(ls "$T/tree/app" | grep -c 'build\.')" "0"
build; check "failed rebuild: not retried for 30 min while a good build exists" "$(runs)" "1"

setup; FAKE_NPM_FAIL=1 build
check "failed first build: no build, status failed" "$([ -e "$T/tree/app/build" ] && echo present || echo absent)$(status)" "absentfailed"
build; check "failed first build: retried" "$(runs)" "2"

setup; mkdir -p "$T/tree/app/build.old"; echo "<html>old</html>" > "$T/tree/app/build.old/index.html"; touch -d '2 hours ago' "$T/tree/app/src/a.ts" "$T/tree/app/package.json"; build
check "interrupted swap: build.old restored" "$(cat "$T/tree/app/build/index.html")$(runs)" "<html>old</html>0"

setup; good; touch "$T/tree/app/src/a.ts"; FAKE_NPM_SLEEP=2 build & p=$!; sleep 0.7
build; check "concurrent: second build exits at once" "$(runs)" "1"
wait $p; check "concurrent: first still finishes" "$(runs)$(status)" "1ok"

setup; touch "$T/tree/app/src/a.ts"; FAKE_NPM_SLEEP=2 build & p=$!; sleep 0.7
touch "$T/tree/app/src/a.ts"; wait $p
check "edit during build: build still counts as stale" "$(build; runs)" "2"

# server: building page, then the app once a build lands, with a build started by the server itself
setup; PORT=$((20000 + RANDOM % 20000)); FAKE_NPM_SLEEP=2 node "$T/tree/launcher/serve-build.js" "$PORT" >"$T/server.out" 2>&1 & PIDS+=($!)
sleep 0.7
check "server: no build -> 503 building page" "$(curl -s -o "$T/page" -w '%{http_code}' "http://127.0.0.1:$PORT/")$(grep -c 'Recall is building' "$T/page")$(grep -c 'http-equiv="refresh"' "$T/page")" "50311"
sleep 3
check "server: serves the app after the build lands" "$(curl -s "http://127.0.0.1:$PORT/")" "<html>new</html>"
check "server: started exactly one build" "$(runs)" "1"

echo; [ "$fails" = 0 ] && echo "all passed" || { echo "$fails failed"; exit 1; }
