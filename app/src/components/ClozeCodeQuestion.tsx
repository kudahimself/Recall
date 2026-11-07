import React, { useMemo, useRef, useState } from 'react';
import { ClozeCodeQuestion as ClozeQ, CodeLanguage, Topic, QuestionType } from '../types';
import { useShortcut } from '../keyboard/shortcuts';
import { DataTables } from './DataTables';
import { CodeBlock, languageLabel } from './ui/CodeBlock';
import { Prose } from './ui/InlineText';
import { AnswerColumns, QuestionShell } from './ui/QuestionShell';
import { Blank } from './ui/TextAnswer';
import { LivePreview } from './visual/LivePreview';
import { QUESTION_FORMAT } from '../utils/questionFormat';

interface Props {
  question: ClozeQ;
  onAnswer: (isCorrect: boolean) => void;
  showHints: boolean;
}

const BLANK_MARKER = '___';

// Normalize a blank value for comparison so cosmetic whitespace around operators
// and punctuation doesn't cause false rejections (e.g. `[0]*3` vs `[0] * 3`,
// `lambda x: x` vs `lambda x : x`, `f(1, 2)` vs `f(1,2)`). Whitespace INSIDE
// string literals is preserved - we walk single/double-quoted regions and skip
// them. Whitespace between two word characters (e.g. `for x in range`) is also
// preserved, since the collapse only fires around non-word non-space characters.
function normalizeBlank(s: string, caseInsensitive = false): string {
  const segments: { quoted: boolean; text: string }[] = [];
  let buf = '';
  let quote: string | null = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    const prev = i > 0 ? s[i - 1] : '';
    if (quote) {
      buf += c;
      if (c === quote && prev !== '\\') {
        segments.push({ quoted: true, text: buf });
        buf = '';
        quote = null;
      }
    } else if (c === '"' || c === "'") {
      if (buf) segments.push({ quoted: false, text: buf });
      buf = c;
      quote = c;
    } else {
      buf += c;
    }
  }
  if (buf) segments.push({ quoted: !!quote, text: buf });
  return segments
    .map(seg => {
      // Quoted string literals are preserved verbatim (case-sensitive data).
      if (seg.quoted) return seg.text;
      const collapsed = seg.text.replace(/\s*([^\w\s])\s*/g, '$1');
      // SQL keywords/identifiers are case-insensitive, so lowercase the
      // unquoted code so `select` ≡ `SELECT` while string data stays exact.
      return caseInsensitive ? collapsed.toLowerCase() : collapsed;
    })
    .join('')
    .trim();
}

export function blankMatches(
  question: Pick<ClozeQ, 'blanks' | 'blankAlternates' | 'language'>,
  idx: number,
  value: string | undefined,
): boolean {
  const expected = question.blanks[idx];
  if (expected === undefined) return false;
  const ci = question.language === CodeLanguage.SQL;
  const got = normalizeBlank(value ?? '', ci);
  if (got === normalizeBlank(expected, ci)) return true;
  const alts = question.blankAlternates?.[idx];
  return !!alts && alts.some(a => normalizeBlank(a, ci) === got);
}

/**
 * The template with each blank filled in, for the live preview. A template
 * with more `___` markers than blanks (a data slip) keeps the extras as
 * written, as the code block shows them.
 */
function assemble(template: string, values: readonly string[]): string {
  return template.split(BLANK_MARKER).reduce(
    (out, piece, i) => (i === 0 ? piece : out + (i - 1 < values.length ? values[i - 1] : BLANK_MARKER) + piece),
    '',
  );
}

/**
 * Fill in the blanks: the worked example as a code block with an answer
 * field in place of each blank. Enter goes to the next blank and checks on
 * the last; Shift+Enter or Ctrl/Cmd+Enter check from any blank. Once checked,
 * each blank shows what was typed, and a wrong one shows the answer beside it.
 */
export const ClozeCodeQuestion: React.FC<Props> = ({ question, onAnswer, showHints }) => {
  const count = question.blanks.length;
  const [values, setValues] = useState<string[]>(() => Array(count).fill(''));
  const [graded, setGraded] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const allFilled = values.every(v => v.trim().length > 0);
  const right = graded && values.every((v, i) => blankMatches(question, i, v));

  const setBlank = (idx: number, value: string) =>
    setValues(prev => prev.map((v, i) => (i === idx ? value : v)));

  const check = () => {
    if (graded || !allFilled) return;
    setGraded(true);
    onAnswer(values.every((v, i) => blankMatches(question, i, v)));
  };

  const blankIndex = (target: EventTarget | null) => inputs.current.findIndex(el => el === target);
  const focusBlank = (idx: number) => inputs.current[idx]?.focus();
  const firstEmpty = () => values.findIndex(v => v.trim().length === 0);

  // Enter in a blank: on to the next one; on the last, check (or go back to one still empty).
  useShortcut('nextBlank', e => {
    const idx = blankIndex(e.target);
    if (idx < 0) return false;
    if (idx < count - 1) focusBlank(idx + 1);
    else if (allFilled) check();
    else focusBlank(firstEmpty());
    return true;
  }, !graded);

  // Shift+Enter with a blank still empty goes to it; otherwise the shell checks.
  useShortcut('submitTyping', e => {
    if (blankIndex(e.target) < 0 || allFilled) return false;
    focusBlank(firstEmpty());
    return true;
  }, !graded);

  // HTML questions preview the assembled markup; CSS questions render it over the question's previewHtml.
  const isHtml = question.language === CodeLanguage.HTML;
  const preview = isHtml || Boolean(question.previewHtml);
  const assembled = useMemo(() => assemble(question.template, values), [question.template, values]);

  const code = (
    <CodeBlock
      code={question.template}
      language={question.language}
      label={languageLabel(question.language)}
      numbered
      aria-label="Code with blanks"
      slots={{
        marker: BLANK_MARKER,
        render: idx => {
          if (idx >= count) return null;
          const longest = Math.max(
            question.blanks[idx].length,
            ...(question.blankAlternates?.[idx] ?? []).map(a => a.length),
            values[idx].length,
            3,
          );
          return (
            <Blank
              index={idx}
              count={count}
              value={values[idx]}
              onChange={v => setBlank(idx, v)}
              widthCh={longest + 1}
              inputRef={el => { inputs.current[idx] = el; }}
              status={graded ? (blankMatches(question, idx, values[idx]) ? 'right' : 'wrong') : undefined}
              expected={question.blanks[idx]}
            />
          );
        },
      }}
    />
  );

  return (
    <QuestionShell
      question={question}
      format={QUESTION_FORMAT[QuestionType.CLOZE_CODE]}
      task={count === 1 ? 'The code around the blank is already right; type what is missing.' : 'The code around the blanks is already right; type what is missing.'}
      graded={graded}
      typed
      action={{ label: 'Check answer', onAction: check, disabled: !allFilled }}
      hint={showHints ? question.hints : null}
      feedback={graded ? {
        verdict: right ? 'right' : 'wrong',
        title: right ? 'Correct' : 'Not quite',
        body: <Prose text={question.explanation} />,
      } : null}
    >
      <DataTables tables={question.tables} />
      {preview ? (
        <AnswerColumns columns="minmax(0, 1.2fr) minmax(0, 1fr)">
          {code}
          <LivePreview
            html={isHtml ? assembled : question.previewHtml ?? ''}
            css={isHtml ? undefined : assembled}
            tailwind={question.topic === Topic.TAILWIND}
          />
        </AnswerColumns>
      ) : code}
    </QuestionShell>
  );
};
