#!/usr/bin/env bash
# Stop the background Recall server started by recall-start.sh.
PID_FILE="${XDG_STATE_HOME:-$HOME/.local/state}/recall/server.pid"
if [ -f "$PID_FILE" ] && kill "$(cat "$PID_FILE")" 2>/dev/null; then echo "Stopped Recall server."; else echo "No Recall server started by the launcher is running."; fi
rm -f "$PID_FILE"
