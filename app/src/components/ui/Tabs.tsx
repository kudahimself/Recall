import React from 'react';
import styles from './Tabs.module.css';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps<T extends string> {
  /** The tab list's accessible name, e.g. "Progress views". */
  label: string;
  /** Prefix for the tab and panel ids; TabPanel takes the same one. */
  idBase: string;
  tabs: ReadonlyArray<TabItem<T>>;
  value: T;
  onChange: (value: T) => void;
  /** The selected tab, so a screen can put focus on it when it opens. */
  selectedRef?: React.Ref<HTMLButtonElement>;
  className?: string;
}

export const tabId = (idBase: string, id: string) => `${idBase}-tab-${id}`;
export const panelId = (idBase: string, id: string) => `${idBase}-panel-${id}`;

/** The tab `step` places from `value`, wrapping at either end. */
export function stepTab<T extends string>(tabs: ReadonlyArray<TabItem<T>>, value: T, step: number): T {
  const at = tabs.findIndex(t => t.id === value);
  return tabs[(at + step + tabs.length) % tabs.length].id;
}

/**
 * ARIA tabs. The list is one Tab stop (the selected tab); Left and Right move
 * to the previous or next tab and show it, Home and End to the first and last.
 */
export function Tabs<T extends string>({ label, idBase, tabs, value, onChange, selectedRef, className }: TabsProps<T>) {
  const focusTab = (id: T) => {
    onChange(id);
    // Every tab is rendered, so the new one can take focus straight away.
    document.getElementById(tabId(idBase, id))?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const to = e.key === 'ArrowRight' ? stepTab(tabs, value, 1)
      : e.key === 'ArrowLeft' ? stepTab(tabs, value, -1)
      : e.key === 'Home' ? tabs[0].id
      : e.key === 'End' ? tabs[tabs.length - 1].id
      : null;
    if (to === null || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    focusTab(to);
  };

  return (
    <div role="tablist" aria-label={label} className={[styles.list, className].filter(Boolean).join(' ')} onKeyDown={onKeyDown}>
      {tabs.map(t => {
        const selected = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={tabId(idBase, t.id)}
            aria-selected={selected}
            aria-controls={panelId(idBase, t.id)}
            tabIndex={selected ? 0 : -1}
            ref={selected ? selectedRef : undefined}
            className={styles.tab}
            onClick={() => onChange(t.id)}
          >
            {t.icon && <span className={styles.icon} aria-hidden="true">{t.icon}</span>}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  idBase: string;
  id: string;
}

/** The panel a tab shows; render only the selected one. */
export function TabPanel({ idBase, id, className, ...rest }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={panelId(idBase, id)}
      aria-labelledby={tabId(idBase, id)}
      className={[styles.panel, className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}
