import React, { useState } from 'react';
import { Dialog } from '../components/ui/Dialog';
import { KeySpec } from '../components/ui/Kbd';
import { SHORTCUT_GROUPS, SHORTCUTS, ShortcutDef, useShortcut } from './shortcuts';
import styles from './ShortcutHelp.module.css';

/** The ? overlay: every shortcut, generated from the registry the keys use. */
export function ShortcutHelpDialog({ onClose }: { onClose: () => void }) {
  const defs = Object.values(SHORTCUTS) as ShortcutDef[];
  return (
    <Dialog title="Keyboard shortcuts" onClose={onClose} size="wide">
      <HelpToggle onToggle={onClose} />
      <div className={styles.groups}>
        {SHORTCUT_GROUPS.map(group => (
          <section key={group} className={styles.group} aria-label={group}>
            <h3 className={styles.groupTitle}>{group}</h3>
            <dl className={styles.list}>
              {defs.filter(d => d.group === group).map(d => (
                <div key={d.label} className={styles.row}>
                  <dt className={styles.keys}>
                    {d.keys.map((k, i) => (
                      <React.Fragment key={k}>
                        {i > 0 && <span className={styles.or}>or</span>}
                        <KeySpec spec={k} />
                      </React.Fragment>
                    ))}
                  </dt>
                  <dd className={styles.label}>{d.label}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </Dialog>
  );
}

/** ? again closes the overlay (bound inside the dialog's key layer). */
function HelpToggle({ onToggle }: { onToggle: () => void }) {
  useShortcut('help', () => onToggle());
  return null;
}

/**
 * Binds ? on the page and shows the overlay. Pass `open` and `onOpenChange`
 * to open it from a button too (the top bar's keyboard button).
 */
export function ShortcutHelp({ open: controlled, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void } = {}) {
  const [own, setOwn] = useState(false);
  const open = controlled ?? own;
  const setOpen = (next: boolean) => { setOwn(next); onOpenChange?.(next); };
  useShortcut('help', () => setOpen(true));
  return open ? <ShortcutHelpDialog onClose={() => setOpen(false)} /> : null;
}
