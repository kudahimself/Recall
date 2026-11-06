import React, { forwardRef } from 'react';
import { Check, CircleDot, X } from 'lucide-react';
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
