import React from 'react';
import { CodeLanguage } from '../../types';
import { highlightLine, splitComment, TokenKind } from '../../utils/codeSyntax';
import type { LineMark } from '../../utils/lineDiff';
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

const TOKEN_CLASS: Record<Exclude<TokenKind, null>, string> = {
  kw: styles.kw,
  str: styles.str,
  num: styles.num,
  fn: styles.fn,
};

/** A line's code (no comment) in coloured pieces. */
function highlighted(text: string, language?: CodeLanguage): React.ReactNode {
  return highlightLine(text, language).map((t, i) => (
    t.kind ? <span key={i} className={TOKEN_CLASS[t.kind]}>{t.text}</span> : <React.Fragment key={i}>{t.text}</React.Fragment>
  ));
}

const MARK_LABEL: Record<LineMark, string> = { add: 'Added: ', remove: 'Removed: ' };

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
  /** Colour keywords, strings, numbers and function names (not with `slots`). */
  highlight?: boolean;
  /** Long lines wrap at full size instead of scrolling sideways (on a phone they keep their shape and scroll). */
  wrap?: boolean;
  /** A diff's marks, one per line: 'add' and 'remove' lines stand out, with + and - beside them. */
  marks?: ReadonlyArray<LineMark | null | undefined>;
  className?: string;
  'aria-label'?: string;
}

/**
 * Read-only code, one style everywhere: questions, rule cards, explanations,
 * the solution of a coding question. With `slots` it is a cloze: each blank
 * marker in the code becomes an answer field, in place in its line.
 */
export function CodeBlock({
  code, slots, language, numbered, label, compact, hideComments, fill, highlight, wrap, marks, className, ...aria
}: CodeBlockProps) {
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
    <figure
      className={[styles.block, compact ? styles.compact : '', fill ? styles.fill : '', wrap ? styles.wrap : '', marks ? styles.marked : '', className].filter(Boolean).join(' ')}
      {...aria}
    >
      {label && <figcaption className={styles.label}>{label}</figcaption>}
      <pre className={styles.pre}>
        <code>
          {code.split(/\r?\n/).map((line, i) => {
            const [body, comment] = splitComment(line, language);
            const shown = hideComments ? body.replace(/\s+$/, '') : body;
            const mark = marks?.[i] ?? undefined;
            return (
              <span
                className={[styles.line, slots ? styles.slotLine : '', mark ? styles[mark] : ''].filter(Boolean).join(' ')}
                data-mark={mark}
                key={i}
              >
                {numbered && <span className={styles.ln} aria-hidden="true">{i + 1}</span>}
                {marks && <span className={styles.sign} aria-hidden="true">{mark === 'add' ? '+' : mark === 'remove' ? '-' : ' '}</span>}
                <span className={styles.text}>
                  {mark && <span className="sr-only">{MARK_LABEL[mark]}</span>}
                  {highlight && !slots ? highlighted(shown, language) : withSlots(shown, `b${i}`)}
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
