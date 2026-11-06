import React, { forwardRef } from 'react';
import { Check, CircleDot, CircleHelp, X } from 'lucide-react';
import styles from './FeedbackBanner.module.css';

export type Verdict = 'right' | 'partial' | 'wrong';

interface FeedbackBannerProps {
  verdict: Verdict;
  /** The verdict word: "Correct", "Not quite", "Half credit". Never colour alone. */
  title: string;
  /** One line after the verdict: why, or what happens next. */
  detail?: React.ReactNode;
  /** The explanation and anything shown with it. */
  children?: React.ReactNode;
  className?: string;
}

const ICON: Record<Verdict, React.ReactNode> = {
  right: <Check strokeWidth={2.5} />,
  partial: <CircleDot strokeWidth={2.25} />,
  wrong: <X strokeWidth={2.5} />,
};

/**
 * The graded result: a verdict word with its icon and colour, a detail line,
 * then the explanation. Focusable (tabIndex -1) so focus can land on it after
 * a submit and Enter goes on from there.
 */
export const FeedbackBanner = forwardRef<HTMLDivElement, FeedbackBannerProps>(function FeedbackBanner(
  { verdict, title, detail, children, className },
  ref,
) {
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={[styles.banner, styles[verdict], className].filter(Boolean).join(' ')}
      data-verdict={verdict}
    >
      <div className={styles.content}>
        <p className={styles.head}>
          <span className={styles.icon} aria-hidden="true">{ICON[verdict]}</span>
          <strong className={styles.verdict}>{title}</strong>
          {detail && <span className={styles.detail}>{detail}</span>}
        </p>
        {children && <div className={styles.body}>{children}</div>}
      </div>
    </div>
  );
});

export interface ResultItem {
  /** Passed, failed, or not decided (the checker cannot tell). */
  state: 'pass' | 'fail' | 'unsure';
  text: React.ReactNode;
  /** Why it failed, or what came out. */
  detail?: React.ReactNode;
}

const RESULT_ICON: Record<ResultItem['state'], React.ReactNode> = {
  pass: <Check strokeWidth={2.5} />,
  fail: <X strokeWidth={2.5} />,
  unsure: <CircleHelp strokeWidth={2.25} />,
};

const RESULT_WORD: Record<ResultItem['state'], string> = { pass: 'Passed', fail: 'Failed', unsure: 'Not sure' };

/** The checks a banner reports (a coding question's tests): one row each, marked by icon and word. */
export function ResultList({ items, className }: { items: ResultItem[]; className?: string }) {
  return (
    <ul className={[styles.results, className].filter(Boolean).join(' ')}>
      {items.map((item, i) => (
        <li key={i} className={[styles.result, styles[item.state]].join(' ')}>
          <span className={styles.resultIcon} aria-hidden="true">{RESULT_ICON[item.state]}</span>
          <span className={styles.resultText}>
            <span className="sr-only">{RESULT_WORD[item.state]}: </span>
            {item.text}
            {item.detail && <span className={styles.resultDetail}>{item.detail}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
