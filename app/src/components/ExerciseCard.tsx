/**
 * A topic's exercise (utils/exercises): the task in brief, the folder to open
 * in the learner's own editor (copyable), and a done tick the learner sets
 * once the folder's tests pass. Nothing runs here; the full task is the
 * folder's README.md.
 */
import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Copy, FolderOpen } from 'lucide-react';
import { TopicExercise } from '../types';
import { proseText } from '../utils/lessons';
import { exerciseCommand } from '../utils/exercises';
import { Inline } from './RuleCard';
import './ExerciseCard.css';

interface Props {
  exercise: TopicExercise;
  /** When the learner ticked it done (epoch ms), or undefined. */
  doneAt: number | undefined;
  /** The topic's ramp is answered, so the exercise is the next step. */
  rampDone: boolean;
  rampAnswered: number;
  rampTotal: number;
  /** "today", "2 days ago". */
  dayLabel: (ms: number) => string;
  onToggle: (id: string) => void;
}

/** Copy text to the clipboard; false when the browser refuses (the path stays selectable). */
async function copyText(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function ExerciseCard({ exercise, doneAt, rampDone, rampAnswered, rampTotal, dayLabel, onToggle }: Props) {
  const done = doneAt !== undefined;
  const [copied, setCopied] = useState<'ok' | 'failed' | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = async () => {
    const ok = await copyText(exercise.folder);
    setCopied(ok ? 'ok' : 'failed');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className={`ex-card${done ? ' ex-card-done' : ''}`} aria-label={`Exercise: ${exercise.title}`}>
      <div className="ex-head">
        <span className="ex-eyebrow">Exercise · in your own editor</span>
        <span className="ex-time">about {exercise.minutes} min</span>
      </div>
      <h3 className="ex-title">
        {done && <CheckCircle2 size={18} className="ex-done-icon" aria-hidden="true" />}
        {exercise.title}
      </h3>
      <p className="ex-task"><Inline text={proseText(exercise.task)} /></p>
      <div className="ex-folder">
        <FolderOpen size={14} aria-hidden="true" />
        <code className="ex-path">{exercise.folder}</code>
        <button
          className="tl-btn ex-copy"
          onClick={copy}
          title="Copy the folder path"
          aria-label={`Copy the folder path ${exercise.folder}`}
        >
          <Copy size={12} /> {copied === 'ok' ? 'Copied' : copied === 'failed' ? 'Select it' : 'Copy'}
        </button>
      </div>
      <p className="ex-how">
        Open the folder, read its <code className="rc-inline-code">README.md</code>, fill in{' '}
        {exercise.starter.map((f, i) => (
          <React.Fragment key={f}>
            {i > 0 && (i === exercise.starter.length - 1 ? ' and ' : ', ')}
            <code className="rc-inline-code">{f}</code>
          </React.Fragment>
        ))}
        , then run <code className="rc-inline-code">{exerciseCommand(exercise)}</code> from the repo root until <code className="rc-inline-code">{exercise.tests}</code> passes.
      </p>
      <div className="ex-foot">
        <label className="ex-check">
          <input type="checkbox" checked={done} onChange={() => onToggle(exercise.id)} />
          <span>{done ? `Done ${dayLabel(doneAt!)}` : 'Done: its tests pass'}</span>
        </label>
        <span className="ex-when">
          {done
            ? 'Untick it to do the exercise again.'
            : rampDone
              ? 'The ramp is answered: now write it yourself.'
              : `Best after the ramp (${rampAnswered}/${rampTotal} answered).`}
        </span>
      </div>
    </section>
  );
}
