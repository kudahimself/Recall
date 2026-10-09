# Sourced by recall-start.sh. Puts node (and npm) on PATH without relying on interactive shell setup.
# Non-interactive `wsl.exe -- bash` skips ~/.bashrc and ~/.profile does not add Nix or nvm.
recall_find_node() {
  command -v node >/dev/null 2>&1 && return 0
  local d
  for d in "$HOME/.nix-profile/bin" "${XDG_STATE_HOME:-$HOME/.local/state}/nix/profile/bin" \
           "${XDG_STATE_HOME:-$HOME/.local/state}/nix/profiles/profile/bin" \
           "/etc/profiles/per-user/${USER:-$(id -un)}/bin" /nix/var/nix/profiles/default/bin \
           "${NVM_DIR:-$HOME/.nvm}"/versions/node/*/bin "$HOME/.volta/bin" /usr/local/bin; do
    if [ -x "$d/node" ]; then PATH="$d:$PATH"; export PATH; return 0; fi
  done
  if [ -f "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]; then
    . "${NVM_DIR:-$HOME/.nvm}/nvm.sh" >/dev/null 2>&1
    command -v node >/dev/null 2>&1 && return 0
  fi
  return 1
}
