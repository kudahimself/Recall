import React from 'react';
import styles from './Kbd.module.css';

const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || '');

const NAMED: Record<string, string> = {
  Escape: 'Esc',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
};

/** The label a key shows on this platform: Mod is Cmd on macOS and Ctrl elsewhere, Alt is Option. */
export function keyLabel(key: string): string {
  if (key === 'Mod') return IS_MAC ? '⌘' : 'Ctrl';
  if (key === 'Alt') return IS_MAC ? '⌥' : 'Alt';
  return NAMED[key] ?? key;
}

/** One key cap. `tone="on-accent"` sits on a brand-filled button. */
export function Kbd({ k, tone }: { k: string; tone?: 'on-accent' }) {
  return <kbd className={`${styles.kbd}${tone === 'on-accent' ? ` ${styles.onAccent}` : ''}`}>{keyLabel(k)}</kbd>;
}

/**
 * A combination such as "Shift+Enter" or "Mod+Enter", one cap per key.
 * A slash joins keys that do the same job in two directions: "ArrowUp/ArrowDown"
 * is ↑ ↓ and "Alt+ArrowUp/ArrowDown" is Alt ↑ ↓.
 */
export function KeyCombo({ combo, tone }: { combo: string; tone?: 'on-accent' }) {
  const keys = combo === '+' ? ['+'] : combo.split('+').flatMap(k => (k.length > 1 ? k.split('/') : [k]));
  return (
    <span className={styles.combo}>
      {keys.map((k, i) => <Kbd key={i} k={k} tone={tone} />)}
    </span>
  );
}
