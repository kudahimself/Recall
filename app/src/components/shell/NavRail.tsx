import React from 'react';
import { BookOpen, Home, LucideIcon, Settings, TrendingUp } from 'lucide-react';
import { SHORTCUTS, ShortcutId, sequenceKeys } from '../../keyboard/shortcuts';
import styles from './NavRail.module.css';

export type NavView = 'home' | 'quiz' | 'progress' | 'settings';

const ITEMS: Array<{ id: NavView; label: string; Icon: LucideIcon; key: ShortcutId; bottom?: boolean }> = [
  { id: 'home', label: 'Home', Icon: Home, key: 'goHome' },
  { id: 'quiz', label: 'Learn', Icon: BookOpen, key: 'goLearn' },
  { id: 'progress', label: 'Progress', Icon: TrendingUp, key: 'goProgress' },
  { id: 'settings', label: 'Settings', Icon: Settings, key: 'goSettings', bottom: true },
];

interface NavRailProps {
  active: NavView | 'filter';
  onNavigate: (view: NavView) => void;
}

/**
 * The main navigation: Home, Learn and Progress, with Settings at the foot of
 * the rail. On a phone the same four buttons are a tab bar under the screen.
 */
export function NavRail({ active, onNavigate }: NavRailProps) {
  return (
    <nav className={styles.rail} aria-label="Main navigation">
      {ITEMS.map(({ id, label, Icon, key, bottom }) => {
        const keys = sequenceKeys(SHORTCUTS[key].keys[0]);
        return (
          <button
            key={id}
            type="button"
            className={[styles.item, bottom ? styles.bottom : ''].filter(Boolean).join(' ')}
            aria-current={active === id ? 'page' : undefined}
            title={`${label} (${keys.join(' then ')})`}
            onClick={() => onNavigate(id)}
          >
            <Icon aria-hidden="true" />
            <span className={styles.label}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
