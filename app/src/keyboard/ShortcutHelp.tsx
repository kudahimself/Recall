import React, { useState } from 'react';
import { Dialog } from '../components/ui/Dialog';
import { KeyCombo } from '../components/ui/Kbd';
import { SHORTCUT_GROUPS, SHORTCUTS, ShortcutDef, useShortcut } from './shortcuts';
import styles from './ShortcutHelp.module.css';

/** "1-9" reads as two caps with a dash; everything else is one combination. */
function KeySpec({ spec }: { spec: string }) {
  if (spec === '1-9') {
    return <span className={styles.range}><KeyCombo combo="1" /><span aria-hidden="true">-</span><KeyCombo combo="9" /></span>;
  }
  return <KeyCombo combo={spec === 'Esc' ? 'Escape' : spec} />;
}

/** The ? overlay: every shortcut, generated from the registry the keys use. */
export function ShortcutHelpDialog({ onClose }: { onClose: () => void }) {
  const defs = Object.values(SHORTCUTS) as ShortcutDef[];
  return (
    <Dialog title="Keyboard shortcuts" onClose={onClose}>
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

/** Binds ? on the page and shows the overlay. */
export function ShortcutHelp() {
  const [open, setOpen] = useState(false);
  useShortcut('help', () => setOpen(true));
  return open ? <ShortcutHelpDialog onClose={() => setOpen(false)} /> : null;
}
