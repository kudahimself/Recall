import React, { useEffect, useMemo, useState } from 'react';
import { ClozeCodeQuestion as ClozeQ, CodeLanguage, Topic } from '../types';
import { StyledButton } from './StyledButton';
import { LivePreview } from './visual/LivePreview';
import './ClozeCodeQuestion.css';

interface Props {
  question: ClozeQ;
  onAnswer: (isCorrect: boolean) => void;
  onNext?: () => void;
  showHints: boolean;
}

const BLANK_MARKER = '___';

// Normalize a blank value for comparison so cosmetic whitespace around operators
// and punctuation doesn't cause false rejections (e.g. `[0]*3` vs `[0] * 3`,
// `lambda x: x` vs `lambda x : x`, `f(1, 2)` vs `f(1,2)`). Whitespace INSIDE
// string literals is preserved — we walk single/double-quoted regions and skip
// them. Whitespace between two word characters (e.g. `for x in range`) is also
// preserved, since the collapse only fires around non-word non-space characters.
function normalizeBlank(s: string): string {
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
    .map(seg =>
      seg.quoted ? seg.text : seg.text.replace(/\s*([^\w\s])\s*/g, '$1'),
    )
    .join('')
    .trim();
}

// Split the template into segments alternating between code text and blank slots.
// Returns: [textSegment, textSegment, ...] where blank slots are represented as
// `null` in a parallel array. We split on the literal `___` token.
interface Segment {
  kind: 'text' | 'blank';
  // For text: the literal code. For blank: the blank index.
  text?: string;
  blankIndex?: number;
}

// Convert the template into alternating text/blank segments. If the template
// contains more `___` markers than `blanks` entries (data bug), the extras are
// folded back into the trailing text segment as literal `___` so they render
// as static text rather than producing out-of-range inputs that crash on submit.
function tokenize(template: string, blankCount: number): Segment[] {
  const parts = template.split(BLANK_MARKER);
  const segments: Segment[] = [];
  parts.forEach((text, i) => {
    if (i <= blankCount) {
      segments.push({ kind: 'text', text });
      if (i < parts.length - 1 && i < blankCount) {
        segments.push({ kind: 'blank', blankIndex: i });
      }
    } else {
      // Stitch overflow markers + their following text back into the previous
      // text segment so the rendered code reads correctly.
      const last = segments[segments.length - 1];
      if (last && last.kind === 'text') {
        last.text = (last.text ?? '') + BLANK_MARKER + text;
      }
    }
  });
  return segments;
}

export const ClozeCodeQuestion: React.FC<Props> = ({
  question,
  onAnswer,
  onNext,
  showHints,
}) => {
  const blankCount = question.blanks.length;
  const segments = useMemo(
    () => tokenize(question.template, blankCount),
    [question.template, blankCount],
  );

  const [values, setValues] = useState<string[]>(() => Array(blankCount).fill(''));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setValues(Array(blankCount).fill(''));
    setIsSubmitted(false);
    setShowHint(false);
  }, [question.id, blankCount]);

  const setBlank = (idx: number, value: string) => {
    setValues(prev => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  const checkBlank = (idx: number, value: string | undefined): boolean => {
    const expected = question.blanks[idx];
    if (expected === undefined) return false;
    const got = normalizeBlank(value ?? '');
    if (got === normalizeBlank(expected)) return true;
    const alts = question.blankAlternates?.[idx];
    if (alts && alts.some(a => normalizeBlank(a) === got)) return true;
    return false;
  };

  const evaluate = (): boolean => {
    return values.every((v, i) => checkBlank(i, v));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    onAnswer(evaluate());
  };

  const allFilled = values.every(v => v.trim().length > 0);
  const wasCorrect = isSubmitted && evaluate();

  // Live preview: assemble the template with the current blank values so the
  // learner sees their fills render as they type. HTML questions preview the
  // assembled markup; CSS questions render it over the question's previewHtml.
  const isHtmlQuestion = question.language === CodeLanguage.HTML;
  const previewActive = isHtmlQuestion || Boolean(question.previewHtml);
  const assembledCode = useMemo(
    () =>
      segments
        .map(seg =>
          seg.kind === 'text' ? seg.text ?? '' : values[seg.blankIndex ?? 0] ?? '',
        )
        .join(''),
    [segments, values],
  );

  const blankClass = (idx: number): string => {
    if (!isSubmitted) return 'cloze-blank';
    return checkBlank(idx, values[idx])
      ? 'cloze-blank correct'
      : 'cloze-blank wrong';
  };

  return (
    <div className="cloze-code-question">
      <h3 className="question-text">{question.question}</h3>

      <div className="badges-row">
        <div className="difficulty-badge">{question.difficulty.toUpperCase()}</div>
        <div className="topic-badge">
          {question.topic.replace(/_/g, ' ').toUpperCase()}
        </div>
        <div className="format-badge">FILL IN BLANKS</div>
      </div>

      <div className="cloze-instructions">
        Complete the worked example by filling in the blanks. The surrounding code is
        already correct — focus on what's missing.
      </div>

      <div className="cloze-block-wrapper">
        <div className="cloze-block-header">{question.language.toUpperCase()}</div>
        <pre className="cloze-block">
          {segments.map((seg, i) => {
            if (seg.kind === 'text') {
              return <span key={`text-${i}`}>{seg.text}</span>;
            }
            if (seg.blankIndex === undefined) return null;
            const idx = seg.blankIndex;
            const expectedLen = question.blanks[idx]?.length ?? 0;
            const altMaxLen = (question.blankAlternates?.[idx] ?? [])
              .reduce((m, a) => Math.max(m, a.length), 0);
            const typedLen = values[idx]?.length ?? 0;
            const ch = Math.max(expectedLen, altMaxLen, typedLen, 3) + 2;
            return (
              <input
                key={`blank-${idx}`}
                aria-label={`Blank ${idx + 1}`}
                className={blankClass(idx)}
                value={values[idx]}
                onChange={e => setBlank(idx, e.target.value)}
                disabled={isSubmitted}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                style={{ width: `${ch}ch` }}
              />
            );
          })}
        </pre>
      </div>

      {previewActive && (
        <div className="cloze-preview-wrapper">
          <LivePreview
            html={isHtmlQuestion ? assembledCode : question.previewHtml ?? ''}
            css={isHtmlQuestion ? undefined : assembledCode}
            tailwind={question.topic === Topic.TAILWIND}
          />
        </div>
      )}

      {!isSubmitted && showHints && question.hints && question.hints.length > 0 && (
        <div className="hints-section">
          <button className="hint-button" onClick={() => setShowHint(!showHint)}>
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          {showHint && <div className="hint">{question.hints[0]}</div>}
        </div>
      )}

      {!isSubmitted ? (
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={!allFilled}
        >
          Submit
        </button>
      ) : (
        <div className="explanation">
          <h4>{wasCorrect ? 'Correct.' : 'Not quite.'}</h4>
          {!wasCorrect && (
            <div className="reference-solution">
              <div className="reference-label">Reference solution:</div>
              <pre className="reference-code">{question.solution}</pre>
            </div>
          )}
          <p>{question.explanation}</p>
          {onNext && (
            <StyledButton variant="primary" onClick={onNext}>
              Next Question →
            </StyledButton>
          )}
        </div>
      )}

    </div>
  );
};
