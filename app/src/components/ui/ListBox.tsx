import React, { forwardRef, useEffect, useId, useRef } from 'react';
import styles from './ListBox.module.css';

export interface ListGroup<T> {
  key: string;
  /** The group's heading, shown above its rows and read out as the group's name. */
  header: React.ReactNode;
  items: T[];
}

interface ListBoxProps<T> {
  /** The accessible name, e.g. "Topics". */
  label: string;
  groups: ReadonlyArray<ListGroup<T>>;
  itemKey: (item: T) => string;
  selectedKey: string | null;
  onSelect: (key: string) => void;
  renderItem: (item: T, selected: boolean) => React.ReactNode;
  /** A dimmed row (a locked topic); it can still be selected. */
  isMuted?: (item: T) => boolean;
  className?: string;
}

/** How far Page Up and Page Down move. */
const PAGE = 8;

/** The key `step` rows from `current` in the list's order, held at the ends; the first row when nothing is selected. */
export function stepKey(keys: string[], current: string | null, step: number): string | null {
  if (keys.length === 0) return null;
  const at = current === null ? -1 : keys.indexOf(current);
  if (at < 0) return keys[0];
  return keys[Math.max(0, Math.min(keys.length - 1, at + step))];
}

/**
 * A single-choice list in groups, one Tab stop. Up and Down move the
 * selection, Home and End go to the ends, Page Up and Page Down jump a few
 * rows; the selected row scrolls into view. The selection follows the keys,
 * so the panel beside it can show the row at once.
 */
function ListBoxInner<T>(
  { label, groups, itemKey, selectedKey, onSelect, renderItem, isMuted, className }: ListBoxProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const base = useId();
  const keys = groups.flatMap(g => g.items.map(itemKey));
  const optionId = (key: string) => `${base}-o-${keys.indexOf(key)}`;
  const listRef = useRef<HTMLDivElement | null>(null);

  // Keep the selected row in view as it moves.
  useEffect(() => {
    if (selectedKey === null || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[id="${optionId(selectedKey)}"]`);
    el?.scrollIntoView?.({ block: 'nearest' });
  // optionId only depends on the keys, which change with the groups.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || keys.length === 0) return;
    const to = e.key === 'ArrowDown' ? stepKey(keys, selectedKey, 1)
      : e.key === 'ArrowUp' ? stepKey(keys, selectedKey, -1)
      : e.key === 'Home' ? keys[0]
      : e.key === 'End' ? keys[keys.length - 1]
      : e.key === 'PageDown' ? stepKey(keys, selectedKey, PAGE)
      : e.key === 'PageUp' ? stepKey(keys, selectedKey, -PAGE)
      : null;
    if (to === null) return;
    e.preventDefault();
    onSelect(to);
  };

  const setRef = (el: HTMLDivElement | null) => {
    listRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  return (
    <div
      ref={setRef}
      role="listbox"
      tabIndex={0}
      aria-label={label}
      aria-activedescendant={selectedKey !== null && keys.includes(selectedKey) ? optionId(selectedKey) : undefined}
      className={[styles.list, className].filter(Boolean).join(' ')}
      onKeyDown={onKeyDown}
    >
      {groups.map(g => (
        <div key={g.key} role="group" aria-labelledby={`${base}-g-${g.key}`} className={styles.group}>
          <div id={`${base}-g-${g.key}`} className={styles.header}>{g.header}</div>
          {g.items.map(item => {
            const key = itemKey(item);
            const selected = key === selectedKey;
            return (
              <div
                key={key}
                id={optionId(key)}
                role="option"
                aria-selected={selected}
                className={[styles.option, isMuted?.(item) ? styles.muted : ''].filter(Boolean).join(' ')}
                onClick={() => { onSelect(key); listRef.current?.focus({ preventScroll: true }); }}
              >
                {renderItem(item, selected)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export const ListBox = forwardRef(ListBoxInner) as <T>(
  props: ListBoxProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => ReturnType<typeof ListBoxInner>;
