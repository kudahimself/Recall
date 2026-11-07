import React from 'react';
import styles from './QuizLayout.module.css';

interface QuizLayoutProps {
  /** The quiz header row (QuizBar). */
  bar: React.ReactNode;
  /** The lesson's steps, in a lesson. */
  steps?: React.ReactNode;
  /** The column beside the question: the topic's rule card, or the topic. */
  side?: React.ReactElement<{ className?: string }> | null;
  /** Keep the column's width in the layout (a course with rule cards on a wide screen). */
  column?: boolean;
  /** The question, the rule card, the summary or a message. */
  children: React.ReactNode;
}

/**
 * The quiz screen: one quiet bar, the lesson's steps, then the stage, with
 * the question and, in a course with rule cards, one column beside it. The
 * question's width depends only on the screen and the course, never on the
 * topic, so consecutive questions sit in the same place. The stage takes the
 * height that is left and the card scrolls inside itself if it must, so the
 * page never scrolls on a laptop screen.
 */
export function QuizLayout({ bar, steps, side, column, children }: QuizLayoutProps) {
  return (
    <div className={[styles.quiz, column ? styles.withColumn : ''].filter(Boolean).join(' ')}>
      {bar}
      {steps}
      <div className={[styles.stage, side ? styles.stageColumn : ''].filter(Boolean).join(' ')}>
        <div className={styles.main}>{children}</div>
        {side && React.cloneElement(side, { className: [side.props.className, styles.side].filter(Boolean).join(' ') })}
      </div>
    </div>
  );
}
