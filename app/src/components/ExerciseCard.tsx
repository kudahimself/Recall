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
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Panel } from './ui/Card';
import { InlineText } from './ui/InlineText';
import styles from './ExerciseCard.module.css';

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
  className?: string;
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

/** "a.py", "a.py and b.py", "a.py, b.py and c.py", each in backticks for InlineText. */
function fileList(files: string[]): string {
  const code = files.map(f => `\`${f}\``);
  return code.length < 2 ? code.join('') : `${code.slice(0, -1).join(', ')} and ${code[code.length - 1]}`;
}

export function ExerciseCard({ exercise, doneAt, rampDone, rampAnswered, rampTotal, dayLabel, onToggle, className }: Props) {
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

  const how = `In your own editor, fill in ${fileList(exercise.starter)}, then run \`${exerciseCommand(exercise)}\` `
    + `until \`${exercise.tests}\` passes; \`README.md\` has the whole task.`;

  return (
    <Panel as="section" className={[styles.card, done ? styles.done : '', className].filter(Boolean).join(' ')} aria-label={`Exercise: ${exercise.title}`}>
      <div className={styles.head}>
        <h3 className={styles.title}>
          <Badge tone="accent" className={styles.kind}>Exercise</Badge>
          {done && <CheckCircle2 className={styles.doneIcon} aria-hidden="true" />}
          {exercise.title}
        </h3>
        <Badge>about {exercise.minutes} min</Badge>
      </div>
      <p className={styles.task}><InlineText text={proseText(exercise.task)} /></p>
      <div className={styles.folder}>
        <FolderOpen className={styles.folderIcon} aria-hidden="true" />
        <code className={styles.path}>{exercise.folder}</code>
        <Button
          size="sm"
          variant="ghost"
          icon={<Copy />}
          onClick={copy}
          title="Copy the folder path"
          aria-label={`Copy the folder path ${exercise.folder}`}
        >
          {copied === 'ok' ? 'Copied' : copied === 'failed' ? 'Select it' : 'Copy'}
        </Button>
      </div>
      <p className={styles.how}><InlineText text={how} /></p>
      <div className={styles.foot}>
        <label className={styles.check}>
          <input type="checkbox" checked={done} onChange={() => onToggle(exercise.id)} />
          <span>{done ? `Done ${dayLabel(doneAt!)}` : 'Done: its tests pass'}</span>
        </label>
        <span className={styles.when}>
          {done
            ? 'Untick it to do the exercise again.'
            : rampDone
              ? 'The ramp is answered: now write it yourself.'
              : `Best after the ramp (${rampAnswered}/${rampTotal} answered).`}
        </span>
      </div>
    </Panel>
  );
}
