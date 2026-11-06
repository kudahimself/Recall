import React from 'react';
import styles from './Kbd.module.css';

const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || '');

/** The label a key shows on this platform: Mod is Cmd on macOS and Ctrl elsewhere. */
export function keyLabel(key: string): string {
  if (key === 'Mod') return IS_MAC ? '⌘' : 'Ctrl';
  if (key === 'Escape') return 'Esc';
  return key;
}

/** One key cap. `tone="on-accent"` sits on a brand-filled button. */
export function Kbd({ k, tone }: { k: string; tone?: 'on-accent' }) {
  return <kbd className={`${styles.kbd}${tone === 'on-accent' ? ` ${styles.onAccent}` : ''}`}>{keyLabel(k)}</kbd>;
}

/** A combination such as "Shift+Enter" or "Mod+Enter", one cap per key. */
export function KeyCombo({ combo, tone }: { combo: string; tone?: 'on-accent' }) {
  const keys = combo === '+' ? ['+'] : combo.split('+');
  return (
    <span className={styles.combo}>
      {keys.map((k, i) => <Kbd key={i} k={k} tone={tone} />)}
    </span>
  );
}
