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

interface CodeBlockProps {
  code: string;
  language?: CodeLanguage;
  /** Show line numbers. */
  numbered?: boolean;
  /** A label over the code, e.g. the language. */
  label?: React.ReactNode;
  /** Smaller type for side panels; long lines wrap instead of scrolling. */
  compact?: boolean;
  /** Hide trailing comments (the rule card panel keeps only the form). */
  hideComments?: boolean;
  className?: string;
  'aria-label'?: string;
}

/** Read-only code, one style everywhere: questions, rule cards, explanations. */
export function CodeBlock({ code, language, numbered, label, compact, hideComments, className, ...aria }: CodeBlockProps) {
  return (
    <figure className={[styles.block, compact ? styles.compact : '', className].filter(Boolean).join(' ')} {...aria}>
      {label && <figcaption className={styles.label}>{label}</figcaption>}
      <pre className={styles.pre}>
        <code>
          {code.split(/\r?\n/).map((line, i) => {
            const [body, comment] = splitComment(line, language);
            const shown = hideComments ? body.replace(/\s+$/, '') : body;
            return (
              <span className={styles.line} key={i}>
                {numbered && <span className={styles.ln} aria-hidden="true">{i + 1}</span>}
                <span className={styles.text}>
                  {shown}
                  {comment && !hideComments && <span className={styles.comment}>{comment}</span>}
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
