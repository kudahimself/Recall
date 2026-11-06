import React from 'react';
import { SHORTCUTS, ShortcutId, sequenceKeys } from '../../keyboard/shortcuts';
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

/** A registry key spec: "1-9" as two caps with a dash, a sequence "G H" as two caps with "then", else one combination. */
export function KeySpec({ spec }: { spec: string }) {
  const range = /^(\d)-(\d)$/.exec(spec);
  if (range) {
    return <span className={styles.spec}><KeyCombo combo={range[1]} /><span aria-hidden="true">-</span><KeyCombo combo={range[2]} /></span>;
  }
  const seq = sequenceKeys(spec);
  if (seq.length > 1) {
    return <span className={styles.spec}><KeyCombo combo={seq[0]} /><span>then</span><KeyCombo combo={seq[1]} /></span>;
  }
  return <KeyCombo combo={spec === 'Esc' ? 'Escape' : spec} />;
}

/**
 * A quiet row of the keys a screen answers to. A hint names a registry
 * shortcut ("goLearn"), so it never drifts from what the keys do, or gives a
 * key spec of a widget's own ("1-5"). Each has a short label; the registry's
 * long label is the ? overlay's.
 */
export function KeyHints({ hints, className }: { hints: Array<[ShortcutId | string, string]>; className?: string }) {
  return (
    <p className={[styles.hints, className].filter(Boolean).join(' ')} aria-hidden="true">
      {hints.map(([key, label]) => (
        <span key={key + label} className={styles.hint}>
          <KeySpec spec={key in SHORTCUTS ? SHORTCUTS[key as ShortcutId].keys[0] : key} />
          {label}
        </span>
      ))}
    </p>
  );
}
