import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { ShortcutId, ShortcutLayerContext, useShortcut, useShortcutLayer } from '../../keyboard/shortcuts';
import { KeyCombo, Kbd } from './Kbd';
import styles from './Menu.module.css';

export interface MenuItem {
  id: string;
  label: string;
  /** A second line under the label. */
  description?: React.ReactNode;
  icon?: React.ReactNode;
  checked?: boolean;
}

interface MenuButtonProps {
  /** The trigger's accessible name, e.g. "Course: SQL for Data Engineering. Switch course". */
  label: string;
  /** The menu's accessible name. */
  menuLabel: string;
  /** What the trigger shows. */
  children: React.ReactNode;
  items: MenuItem[];
  onSelect: (id: string) => void;
  /** The registry shortcut that opens it, and closes it again. */
  shortcut?: ShortcutId;
  /** The shortcut's key, shown on the trigger. */
  shortcutKey?: string;
  /** Number keys 1-9 pick an item. */
  numbered?: boolean;
  /** A quiet line under the items, such as key hints. */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * A button that opens a list of choices, one of them current (the WAI-ARIA
 * menu button with radio items). Open, it owns the keys: the arrows, Home and
 * End move, Enter or a number picks, Esc or the shortcut again closes, and
 * focus goes back to the button.
 */
export function MenuButton({
  label, menuLabel, children, items, onSelect, shortcut, shortcutKey, numbered, footer, className,
}: MenuButtonProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useShortcut(shortcut ?? 'switchCourse', () => setOpen(true), !!shortcut && !open);

  // A press outside closes it and leaves focus where the press put it.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && e.target instanceof Node && !wrapRef.current.contains(e.target)) close(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, close]);

  return (
    <div ref={wrapRef} className={[styles.wrap, className].filter(Boolean).join(' ')}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={label}
        aria-keyshortcuts={shortcutKey}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); }
        }}
      >
        {children}
        <ChevronDown className={styles.chevron} aria-hidden="true" />
        {shortcutKey && <span className={styles.triggerKey} aria-hidden="true"><KeyCombo combo={shortcutKey} /></span>}
      </button>
      {open && (
        <MenuPopover
          id={menuId}
          menuLabel={menuLabel}
          items={items}
          numbered={numbered}
          footer={footer}
          shortcut={shortcut}
          onPick={id => { close(true); onSelect(id); }}
          onClose={() => close(true)}
        />
      )}
    </div>
  );
}

interface PopoverProps {
  id: string;
  menuLabel: string;
  items: MenuItem[];
  numbered?: boolean;
  footer?: React.ReactNode;
  shortcut?: ShortcutId;
  onPick: (id: string) => void;
  onClose: () => void;
}

function MenuPopover(props: PopoverProps) {
  const layer = useShortcutLayer();
  return (
    <ShortcutLayerContext.Provider value={layer}>
      <MenuList {...props} />
    </ShortcutLayerContext.Provider>
  );
}

function MenuList({ id, menuLabel, items, numbered, footer, shortcut, onPick, onClose }: PopoverProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  useShortcut('close', () => onClose());
  useShortcut(shortcut ?? 'switchCourse', () => onClose(), !!shortcut);

  const buttons = () => Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? []);

  // Focus the current item when the menu opens.
  useEffect(() => {
    const all = buttons();
    const at = Math.max(0, items.findIndex(i => i.checked));
    all[at]?.focus({ preventScroll: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const all = buttons();
    const at = all.indexOf(document.activeElement as HTMLButtonElement);
    const move = (to: number) => { e.preventDefault(); all[(to + all.length) % all.length]?.focus(); };
    if (e.key === 'ArrowDown') move(at + 1);
    else if (e.key === 'ArrowUp') move(at - 1);
    else if (e.key === 'Home') move(0);
    else if (e.key === 'End') move(all.length - 1);
    else if (e.key === 'Tab') { e.preventDefault(); onClose(); }
    else if (numbered && /^[1-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const item = items[Number(e.key) - 1];
      if (item) { e.preventDefault(); onPick(item.id); }
    }
  };

  return (
    <div className={styles.popover}>
      <div ref={listRef} id={id} role="menu" aria-label={menuLabel} className={styles.menu} onKeyDown={onKeyDown}>
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="menuitemradio"
            aria-checked={!!item.checked}
            aria-labelledby={`${baseId}-${i}`}
            aria-describedby={item.description ? `${baseId}-${i}-d` : undefined}
            aria-keyshortcuts={numbered && i < 9 ? String(i + 1) : undefined}
            tabIndex={-1}
            className={styles.item}
            onClick={() => onPick(item.id)}
          >
            {numbered && i < 9 && <span className={styles.itemKey} aria-hidden="true"><Kbd k={String(i + 1)} /></span>}
            {item.icon && <span className={styles.itemIcon} aria-hidden="true">{item.icon}</span>}
            <span className={styles.itemText}>
              <span className={styles.itemLabel} id={`${baseId}-${i}`}>{item.label}</span>
              {item.description && <span className={styles.itemDesc} id={`${baseId}-${i}-d`}>{item.description}</span>}
            </span>
            <Check className={styles.itemCheck} aria-hidden="true" />
          </button>
        ))}
      </div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
