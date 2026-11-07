import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ShortcutLayerContext, useShortcut, useShortcutLayer } from '../../keyboard/shortcuts';
import { Button } from './Button';
import styles from './Dialog.module.css';

/** True while a modal dialog is open: a screen that mounts under it must not take focus from it. */
export function dialogIsOpen(): boolean {
  return !!document.querySelector('[role="dialog"][aria-modal="true"]');
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogProps {
  /** The accessible name, shown as the heading unless `hideTitle`. */
  title: string;
  hideTitle?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** 'wide' for the full rule card. */
  size?: 'normal' | 'wide';
  /** A class for the scrolling body. */
  bodyClassName?: string;
  /** Actions under the body that stay in view while it scrolls (Reset, Done). */
  footer?: React.ReactNode;
}

/**
 * A modal dialog: labelled, takes focus when it opens, keeps Tab inside,
 * closes on Esc or a click on the scrim, and gives focus back on close.
 * While it is open it owns the keys (its own shortcut layer).
 */
export function Dialog(props: DialogProps) {
  const layer = useShortcutLayer();
  return (
    <ShortcutLayerContext.Provider value={layer}>
      <DialogFrame {...props} />
    </ShortcutLayerContext.Provider>
  );
}

function DialogFrame({ title, hideTitle, onClose, children, size = 'normal', bodyClassName, footer }: DialogProps) {
  const ref = useRef<HTMLDivElement>(null);

  useShortcut('close', () => onClose());

  // Move focus in on open and back to where it was on close.
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const first = node?.querySelector<HTMLElement>('[data-autofocus]') ?? node?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? node)?.focus({ preventScroll: true });
    return () => {
      if (before && document.contains(before)) before.focus({ preventScroll: true });
    };
  }, []);

  const trapTab = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !ref.current) return;
    const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => !el.closest('[hidden], [inert]'));
    if (items.length === 0) { e.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  return (
    <div className={styles.scrim} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={[styles.dialog, size === 'wide' ? styles.wide : ''].filter(Boolean).join(' ')}
        onKeyDown={trapTab}
      >
        {!hideTitle && (
          <div className={styles.head}>
            <h2 className={styles.title}>{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close" shortcut="Esc" icon={<X />} />
          </div>
        )}
        <div className={[styles.body, bodyClassName].filter(Boolean).join(' ')}>{children}</div>
        {footer && <div className={styles.foot}>{footer}</div>}
      </div>
    </div>
  );
}
