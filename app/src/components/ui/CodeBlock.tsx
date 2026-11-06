import React from 'react';
import { CodeLanguage } from '../../types';
import styles from './CodeBlock.module.css';

const LANGUAGE_LABEL: Record<CodeLanguage, string> = {
  [CodeLanguage.PYTHON]: 'Python',
  [CodeLanguage.SQL]: 'SQL',
  [CodeLanguage.JAVASCRIPT]: 'JavaScript',
  [CodeLanguage.TYPESCRIPT]: 'TypeScript',
  [CodeLanguage.JSX]: 'JSX',
  [CodeLanguage.HTML]: 'HTML',
  [CodeLanguage.CSS]: 'CSS',
};

/** "Python", "SQL": a language as a code block's label shows it. */
export function languageLabel(language?: CodeLanguage): string | undefined {
  return language ? LANGUAGE_LABEL[language] ?? language : undefined;
}

const COMMENT_MARKER: Partial<Record<CodeLanguage, string>> = {
  [CodeLanguage.PYTHON]: '#',
  [CodeLanguage.SQL]: '--',
  [CodeLanguage.JAVASCRIPT]: '//',
  [CodeLanguage.TYPESCRIPT]: '//',
  [CodeLanguage.JSX]: '//',
};

/** Split a code line into its code and its trailing comment, ignoring markers inside quotes. */
export function splitComment(line: string, language?: CodeLanguage): [string, string] {
  const marker = language ? COMMENT_MARKER[language] : undefined;
  if (!marker) return [line, ''];
  let quote: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { quote = c; continue; }
    if (line.startsWith(marker, i)) return [line.slice(0, i), line.slice(i)];
  }
  return [line, ''];
}

/** Places in the code where something else goes: each marker becomes `render(index)`, in order. */
export interface CodeSlots {
  marker: string;
  /** What goes in the slot; null shows the marker as written (more markers than slots). */
  render: (index: number) => React.ReactNode | null;
}

interface CodeBlockProps {
  code: string;
  /** Fill-in places in the code (a cloze's blanks). */
  slots?: CodeSlots;
  language?: CodeLanguage;
  /** Show line numbers. */
  numbered?: boolean;
  /** A label over the code, e.g. the language. */
  label?: React.ReactNode;
  /** Smaller type for side panels; long lines wrap instead of scrolling. */
  compact?: boolean;
  /** Hide trailing comments (the rule card panel keeps only the form). */
  hideComments?: boolean;
  /** Take the height of its container and scroll inside it. */
  fill?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * Read-only code, one style everywhere: questions, rule cards, explanations,
 * the solution of a coding question. With `slots` it is a cloze: each blank
 * marker in the code becomes an answer field, in place in its line.
 */
export function CodeBlock({ code, slots, language, numbered, label, compact, hideComments, fill, className, ...aria }: CodeBlockProps) {
  let slot = 0;
  // Text with its slot markers replaced, counting slots across the whole block.
  const withSlots = (text: string, key: string): React.ReactNode => {
    if (!slots || !text.includes(slots.marker)) return text;
    return text.split(slots.marker).map((piece, i) => {
      if (i === 0) return piece;
      const node = slots.render(slot++);
      return (
        <React.Fragment key={`${key}-${i}`}>
          {node ?? slots.marker}
          {piece}
        </React.Fragment>
      );
    });
  };
  return (
    <figure className={[styles.block, compact ? styles.compact : '', fill ? styles.fill : '', className].filter(Boolean).join(' ')} {...aria}>
      {label && <figcaption className={styles.label}>{label}</figcaption>}
      <pre className={styles.pre}>
        <code>
          {code.split(/\r?\n/).map((line, i) => {
            const [body, comment] = splitComment(line, language);
            const shown = hideComments ? body.replace(/\s+$/, '') : body;
            return (
              <span className={[styles.line, slots ? styles.slotLine : ''].filter(Boolean).join(' ')} key={i}>
                {numbered && <span className={styles.ln} aria-hidden="true">{i + 1}</span>}
                <span className={styles.text}>
                  {withSlots(shown, `b${i}`)}
                  {comment && !hideComments && <span className={styles.comment}>{withSlots(comment, `c${i}`)}</span>}
                  {!shown && (!comment || hideComments) ? ' ' : null}
                </span>
              </span>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}
