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

interface CardHeaderProps {
  /** The small upper-case line over the title. */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  titleId?: string;
  /** The heading level; h2 for a card on a screen. */
  as?: 'h1' | 'h2' | 'h3';
  /** A leading tile, such as the course icon. */
  icon?: React.ReactNode;
  /** Quiet text or a control at the right end. */
  aside?: React.ReactNode;
  className?: string;
  /** Lets a screen move focus to its title (tabIndex -1). */
  titleRef?: React.Ref<HTMLHeadingElement>;
}

/** A card's head: optional icon, eyebrow and title, with an aside (a count or a link) at the right. */
export function CardHeader({ eyebrow, title, titleId, as: Tag = 'h2', icon, aside, className, titleRef }: CardHeaderProps) {
  return (
    <div className={[styles.header, className].filter(Boolean).join(' ')}>
      {icon && <span className={styles.headerIcon} aria-hidden="true">{icon}</span>}
      <div className={styles.headerText}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Tag className={styles.title} id={titleId} ref={titleRef} tabIndex={titleRef ? -1 : undefined}>{title}</Tag>
      </div>
      {aside && <div className={styles.aside}>{aside}</div>}
    </div>
  );
}
