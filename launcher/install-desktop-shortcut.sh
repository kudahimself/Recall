#!/usr/bin/env bash
# One-time installer: puts a "Recall" shortcut on the Windows Desktop. Run inside WSL.
set -eu
HERE="$(cd "$(dirname "$(readlink -f "$0")")" && pwd)"
[ -n "${WSL_DISTRO_NAME:-}" ] || { echo "Run this inside WSL." >&2; exit 1; }
chmod +x "$HERE"/*.sh
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$(wslpath -w "$HERE/install-shortcut.ps1")" \
  -Distro "$WSL_DISTRO_NAME" -StartScript "$HERE/recall-start.sh" -Port "$(tr -d '[:space:]' < "$HERE/port")" \
  -LogoPng "$(wslpath -w "$HERE/../app/public/logo192.png")"
