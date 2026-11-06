import React from 'react';
import styles from './InlineText.module.css';

/**
 * The one renderer for question and lesson prose, in every course:
 * - a fenced block (```lang ... ```) is code, shown as written;
 * - `backticks` become inline code and **double stars** become bold;
 * - a line break in the text is a line break on screen.
 * An unpaired backtick is shown as written. Bold needs stars that hug the
 * words inside and are not glued to a word outside, so `2 ** 3` and
 * `f(**kwargs)` in prose stay as written.
 */

export type InlinePart = { kind: 'text' | 'code' | 'bold'; text: string };
export type TextBlock = { kind: 'text'; text: string } | { kind: 'fence'; code: string; lang: string };

const FENCE = /```([\w+-]*)[^\S\r\n]*\r?\n([\s\S]*?)\r?\n?[^\S\r\n]*```/g;

/** Split text into prose and fenced code blocks; prose loses the blank lines around a fence. */
export function parseBlocks(text: string): TextBlock[] {
  const blocks: TextBlock[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  FENCE.lastIndex = 0;
  const pushText = (t: string) => {
    const trimmed = t.replace(/^\s*\n|\n\s*$/g, '');
    if (trimmed.trim()) blocks.push({ kind: 'text', text: trimmed });
  };
  while ((m = FENCE.exec(text)) !== null) {
    pushText(text.slice(last, m.index));
    blocks.push({ kind: 'fence', lang: m[1], code: m[2] });
    last = m.index + m[0].length;
  }
  pushText(text.slice(last));
  return blocks;
}

function parseBold(text: string): InlinePart[] {
  const bold = /(?<![\w*])\*\*(?=[^\s*])([\s\S]*?[^\s*])\*\*(?![\w*])/g;
  const parts: InlinePart[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = bold.exec(text)) !== null) {
    if (m.index > last) parts.push({ kind: 'text', text: text.slice(last, m.index) });
    parts.push({ kind: 'bold', text: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ kind: 'text', text: text.slice(last) });
  return parts;
}

/** Backticks and bold within one run of prose (no fences). */
export function parseInline(text: string): InlinePart[] {
  const segments = text.split('`');
  // An even number of segments means an odd number of backticks: the last
  // one has no partner, so it goes back into the text as written.
  if (segments.length % 2 === 0) {
    const tail = segments.pop() as string;
    segments[segments.length - 1] += '`' + tail;
  }
  const parts: InlinePart[] = [];
  segments.forEach((seg, i) => {
    if (i % 2 === 1) parts.push({ kind: 'code', text: seg });
    else if (seg) parts.push(...parseBold(seg));
  });
  return parts;
}

function Line({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((p, i) => (
        p.kind === 'code' ? <code key={i} className={styles.code}>{p.text}</code>
          : p.kind === 'bold' ? <strong key={i} className={styles.bold}>{p.text}</strong>
          : <React.Fragment key={i}>{p.text}</React.Fragment>
      ))}
    </>
  );
}

/** Prose that sits inside a heading, a label or a sentence: phrasing content only. */
export function InlineText({ text }: { text: string }) {
  return (
    <>
      {parseBlocks(text).map((b, i) => (
        b.kind === 'fence'
          ? <code key={i} className={styles.fence} data-lang={b.lang || undefined}>{b.code}</code>
          : (
            <React.Fragment key={i}>
              {b.text.split(/\r?\n/).filter(l => l.trim()).map((line, j) => (
                <React.Fragment key={j}>{j > 0 && <br />}<Line text={line} /></React.Fragment>
              ))}
            </React.Fragment>
          )
      ))}
    </>
  );
}

/** Prose as paragraphs: one per line of the text; fenced code as its own block. */
export function Prose({ text, className }: { text: string; className?: string }) {
  const cls = [styles.paragraph, className].filter(Boolean).join(' ');
  return (
    <>
      {parseBlocks(text).map((b, i) => (
        b.kind === 'fence'
          ? <pre key={i} className={styles.fenceBlock}><code data-lang={b.lang || undefined}>{b.code}</code></pre>
          : b.text.split(/\r?\n/).map(p => p.trim()).filter(Boolean).map((p, j) => (
            <p key={`${i}-${j}`} className={cls}><Line text={p} /></p>
          ))
      ))}
    </>
  );
}
