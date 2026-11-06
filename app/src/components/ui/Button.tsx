import React, { forwardRef } from 'react';
import { KeyCombo } from './Kbd';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** A leading icon (a lucide icon element). */
  icon?: React.ReactNode;
  /** The shortcut shown as a key cap, e.g. "Enter" or "Mod+Enter". Not part of the accessible name. */
  shortcut?: string;
  /** Stretch to the container's width. */
  block?: boolean;
}

/**
 * The one button: primary (brand fill), secondary, ghost or danger, in four
 * sizes. With `aria-pressed` it is a toggle and shows when it is on.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', icon, shortcut, block, className, children, type = 'button', ...rest },
  ref,
) {
  const cls = [styles.button, styles[variant], styles[size], block ? styles.block : '', className].filter(Boolean).join(' ');
  return (
    <button
      ref={ref}
      type={type}
      className={cls}
      aria-keyshortcuts={shortcut ? shortcut.replace('Mod', 'Control').replace(/^Esc$/, 'Escape') : undefined}
      {...rest}
    >
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      {children}
      {shortcut && (
        <span className={styles.shortcut} aria-hidden="true">
          <KeyCombo combo={shortcut} tone={variant === 'primary' ? 'on-accent' : undefined} />
        </span>
      )}
    </button>
  );
});
