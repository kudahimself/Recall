import React from 'react';
import styles from './Card.module.css';

type DivProps = React.HTMLAttributes<HTMLElement> & { as?: 'div' | 'section' | 'aside' | 'article' };

/** A raised surface: the question, the rule card panel, a dialog body. */
export function Card({ as: Tag = 'div', className, padded = true, ...rest }: DivProps & { padded?: boolean }) {
  return <Tag className={[styles.card, padded ? styles.padded : '', className].filter(Boolean).join(' ')} {...rest} />;
}

/** A sunken area inside a card: a model answer, a table, a typed answer. */
export function Panel({ as: Tag = 'div', className, ...rest }: DivProps) {
  return <Tag className={[styles.panel, className].filter(Boolean).join(' ')} {...rest} />;
}

/** The small upper-case label over a group: "Rule card", "Your answer". */
export function Eyebrow({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={[styles.eyebrow, className].filter(Boolean).join(' ')} {...rest} />;
}
