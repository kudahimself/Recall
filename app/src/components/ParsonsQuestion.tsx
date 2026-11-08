import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  Announcements,
  CollisionDetection,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowDown, ArrowUp, Check, X } from 'lucide-react';
import { ParsonsQuestion as ParsonsQ, CodeLanguage, Topic, QuestionType } from '../types';
import { useShortcut } from '../keyboard/shortcuts';
import { DataTables } from './DataTables';
import { Button } from './ui/Button';
import { CodeBlock, languageLabel } from './ui/CodeBlock';
import { splitComment } from '../utils/codeSyntax';
import { Prose } from './ui/InlineText';
import { AnswerColumns, QuestionRegion, QuestionShell, seededOrder } from './ui/QuestionShell';
import { LivePreview } from './visual/LivePreview';
import styles from './ParsonsQuestion.module.css';
import { QUESTION_FORMAT } from '../utils/questionFormat';

interface Props {
  question: ParsonsQ;
  onAnswer: (isCorrect: boolean) => void;
  showHints: boolean;
}

interface Line {
  id: string;
  text: string;
  isDistractor: boolean;
}

type ListId = 'pool' | 'answer';

// Python import statements are order-independent (barring rare side-effect
// imports, which these questions don't use). The strict-positional grader would
// otherwise reject any but the authored order of a multi-import block - a guess
// the user can't win. Normalize by sorting each MAXIMAL RUN of consecutive
// import lines in place, then compare positionally. Applied to both the user's
// answer and the correctOrder, so two valid import orderings collapse to the
// same sequence. Non-import siblings (e.g. two independent assignments) are NOT
// covered - those must be disambiguated in the prompt.
const IMPORT_LINE = /^\s*(import\s|from\s+\S+\s+import\s)/;
export function normalizeImportRuns(texts: string[]): string[] {
  const out = [...texts];
  let i = 0;
  while (i < out.length) {
    if (IMPORT_LINE.test(out[i])) {
      let j = i;
      while (j < out.length && IMPORT_LINE.test(out[j])) j++;
      const run = out.slice(i, j).sort();
      for (let k = i; k < j; k++) out[k] = run[k - i];
      i = j;
    } else {
      i++;
    }
  }
  return out;
}

// Droppable ids for the two lists themselves, so a drop on a list's empty space lands.
const BIN: Record<ListId, string> = { pool: 'pool-bin', answer: 'answer-bin' };

// The list droppables enclose every line, so distance-based strategies keep
// resolving to the list (= append) instead of the hovered line. Prefer line
// hits; fall back to the list only when no line is under the pointer.
const preferLineCollisions: CollisionDetection = args => {
  const pointerHits = pointerWithin(args);
  const hits = pointerHits.length > 0 ? pointerHits : rectIntersection(args);
  const lineHits = hits.filter(c => c.id !== BIN.pool && c.id !== BIN.answer);
  return lineHits.length > 0 ? lineHits : hits;
};

/** How a line reads aloud: its indentation in words, then the code. */
function spoken(text: string): string {
  const indent = text.length - text.trimStart().length;
  return `${indent > 0 ? `indented ${indent} spaces, ` : ''}${text.trim()}`;
}

/** One line of code, its comment dimmed as in every code block. */
function LineCode({ text, language }: { text: string; language: CodeLanguage }) {
  const [code, comment] = splitComment(text, language);
  return (
    <code className={styles.code}>
      {code}
      {comment && <span className={styles.comment}>{comment}</span>}
    </code>
  );
}

type Mark = 'right' | 'wrong' | 'extra';

/** A line in one of the lists: a listbox option that can also be dragged with the pointer. */
function LineItem({
  line, optionId, language, active, frozen, position, mark, onClick, controls,
}: {
  line: Line;
  optionId: string;
  language: CodeLanguage;
  active: boolean;
  frozen: boolean;
  position?: number;
  mark?: Mark;
  onClick: () => void;
  controls?: React.ReactNode;
}) {
  const { listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: line.id, disabled: frozen });
  return (
    <div
      ref={setNodeRef}
      id={optionId}
      role="option"
      aria-selected={active}
      className={[
        styles.line,
        active ? styles.active : '',
        isDragging ? styles.dragging : '',
        mark ? styles[mark] : '',
      ].filter(Boolean).join(' ')}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={frozen ? undefined : onClick}
      {...(frozen ? {} : listeners)}
    >
      {position !== undefined && (
        <span className={styles.gutter} aria-hidden="true">
          {mark === 'right' ? <Check /> : mark ? <X /> : position}
        </span>
      )}
      <LineCode text={line.text} language={language} />
      {mark === 'extra' && <span className={styles.tag}>does not belong</span>}
      {mark && <span className="sr-only">{mark === 'right' ? ', in the right place' : mark === 'extra' ? ', does not belong' : ', not in the right place'}</span>}
      {controls}
    </div>
  );
}

/** One of the two lists, a drop target for the pointer and a listbox for the keys. */
function LineList({
  id, label, listRef, lines, activeIndex, frozen, empty, children,
}: {
  id: string;
  label: string;
  listRef: React.RefObject<HTMLDivElement | null>;
  lines: Line[];
  activeIndex: number;
  frozen: boolean;
  empty: string;
  children: React.ReactNode;
}) {
  const bin = id.endsWith('answer') ? BIN.answer : BIN.pool;
  const { setNodeRef, isOver } = useDroppable({ id: bin, disabled: frozen });
  const activeLine = lines[activeIndex];
  return (
    <div
      ref={el => { setNodeRef(el); listRef.current = el; }}
      id={id}
      role="listbox"
      aria-label={label}
      aria-activedescendant={activeLine && !frozen ? `${id}-${activeLine.id}` : undefined}
      aria-disabled={frozen || undefined}
      tabIndex={frozen ? -1 : 0}
      className={[styles.list, isOver && !frozen ? styles.over : ''].filter(Boolean).join(' ')}
    >
      {lines.length === 0 && <p className={styles.empty}>{empty}</p>}
      <SortableContext items={lines.map(l => l.id)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </div>
  );
}

/**
 * Parsons: build the program from shuffled lines. Two listboxes, the lines
 * and your solution: up and down move between lines, Space adds a line or
 * takes it back, Alt+up and Alt+down move it within the solution, left and
 * right switch lists, Enter checks. A pointer can click a line to add it or
 * drag it anywhere. Every move is said in plain words.
 */
export const ParsonsQuestion: React.FC<Props> = ({ question, onAnswer, showHints }) => {
  // Empty/whitespace-only entries in correctOrder are formatting noise for the
  // assembled `solution` string; they don't belong in the pool (they'd render as
  // identical invisible lines). Strip them here and grade against the same sequence.
  const correctOrder = useMemo(
    () => question.correctOrder.filter(line => line.trim() !== ''),
    [question.correctOrder],
  );

  const allLines: Line[] = useMemo(() => {
    const correct = correctOrder.map((text, i) => ({ id: `c${i}`, text, isDistractor: false }));
    // Drop distractors that would look identical to a line of the answer (a
    // 50/50 guess) and duplicates among distractors. A line that really appears
    // twice in the answer keeps both copies.
    const correctTexts = new Set(correctOrder);
    const seen = new Set<string>();
    const distractors: Line[] = [];
    for (const text of question.distractorLines || []) {
      if (text.trim() === '' || correctTexts.has(text) || seen.has(text)) continue;
      seen.add(text);
      distractors.push({ id: `d${distractors.length}`, text, isDistractor: true });
    }
    return seededOrder([...correct, ...distractors], question.id);
  }, [question.id, correctOrder, question.distractorLines]);

  const [pool, setPool] = useState<Line[]>(allLines);
  const [answer, setAnswer] = useState<Line[]>([]);
  const [graded, setGraded] = useState(false);
  const [active, setActive] = useState<Record<ListId, number>>({ pool: 0, answer: 0 });
  const [said, setSaid] = useState('');
  const [dragId, setDragId] = useState<string | null>(null);
  const poolRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const listId: Record<ListId, string> = { pool: `${baseId}-pool`, answer: `${baseId}-answer` };

  useEffect(() => {
    setPool(allLines);
    setAnswer([]);
    setGraded(false);
    setActive({ pool: 0, answer: 0 });
  }, [question.id, allLines]);

  // Only a real pointer move starts a drag, so a click still adds a line.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const say = (text: string) => setSaid(prev => (prev === text ? `${text} ` : text));
  const clamp = (i: number, length: number) => Math.max(0, Math.min(i, length - 1));

  const add = (line: Line) => {
    if (graded) return;
    const idx = pool.findIndex(l => l.id === line.id);
    if (idx < 0) return;
    const nextPool = pool.filter(l => l.id !== line.id);
    const nextAnswer = [...answer, line];
    setPool(nextPool);
    setAnswer(nextAnswer);
    setActive({ pool: clamp(idx, nextPool.length), answer: nextAnswer.length - 1 });
    say(`Added as line ${nextAnswer.length} of ${nextAnswer.length}: ${spoken(line.text)}`);
  };

  const takeBack = (line: Line) => {
    if (graded) return;
    const idx = answer.findIndex(l => l.id === line.id);
    if (idx < 0) return;
    const nextAnswer = answer.filter(l => l.id !== line.id);
    setAnswer(nextAnswer);
    setPool(prev => [...prev, line]);
    setActive(prev => ({ ...prev, answer: clamp(idx, nextAnswer.length) }));
    say(`Took back: ${spoken(line.text)}. ${nextAnswer.length} ${nextAnswer.length === 1 ? 'line' : 'lines'} in your solution.`);
  };

  const move = (from: number, to: number) => {
    if (graded || to < 0 || to >= answer.length) return;
    const line = answer[from];
    setAnswer(prev => arrayMove(prev, from, to));
    setActive(prev => ({ ...prev, answer: to }));
    say(`Moved to line ${to + 1} of ${answer.length}: ${spoken(line.text)}`);
  };

  // A drag can shorten a list under the active line; the keys act on the nearest one.
  const at: Record<ListId, number> = { pool: clamp(active.pool, pool.length), answer: clamp(active.answer, answer.length) };

  const listOf = (target: EventTarget | null): ListId | null =>
    target === poolRef.current ? 'pool' : target === answerRef.current ? 'answer' : null;

  useShortcut('listMove', e => {
    const list = listOf(e.target);
    if (!list) return false;
    const length = (list === 'pool' ? pool : answer).length;
    const step = e.key === 'ArrowUp' ? -1 : 1;
    setActive(prev => ({ ...prev, [list]: clamp(at[list] + step, length) }));
    return true;
  }, !graded);

  useShortcut('listToggle', e => {
    const list = listOf(e.target);
    if (!list) return false;
    if (list === 'pool' && pool[at.pool]) add(pool[at.pool]);
    if (list === 'answer' && answer[at.answer]) takeBack(answer[at.answer]);
    return true;
  }, !graded);

  useShortcut('listReorder', e => {
    if (listOf(e.target) !== 'answer') return false;
    move(at.answer, at.answer + (e.key === 'ArrowUp' ? -1 : 1));
    return true;
  }, !graded);

  useShortcut('listSwitch', e => {
    if (!listOf(e.target)) return false;
    (e.key === 'ArrowLeft' ? poolRef : answerRef).current?.focus({ preventScroll: true });
    return true;
  }, !graded);

  // Keep the active line in view when the keys walk a long list.
  useEffect(() => {
    for (const list of ['pool', 'answer'] as ListId[]) {
      const line = (list === 'pool' ? pool : answer)[at[list]];
      if (line) document.getElementById(`${listId[list]}-${line.id}`)?.scrollIntoView?.({ block: 'nearest' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // ---- Pointer drag (dnd-kit) ----
  const findList = (id: string): ListId | null => {
    if (id === BIN.pool) return 'pool';
    if (id === BIN.answer) return 'answer';
    if (pool.some(l => l.id === id)) return 'pool';
    if (answer.some(l => l.id === id)) return 'answer';
    return null;
  };
  const lineById = (id: string) => pool.find(l => l.id === id) ?? answer.find(l => l.id === id);

  const handleDragStart = ({ active: a }: DragStartEvent) => {
    if (!graded) setDragId(String(a.id));
  };

  // Moves between lists happen during the drag, so the line joins the other
  // list under the pointer; a reorder within a list lands in handleDragEnd.
  const handleDragOver = ({ active: a, over }: DragOverEvent) => {
    if (graded || !over) return;
    const from = findList(String(a.id));
    const to = findList(String(over.id));
    if (!from || !to || from === to) return;
    const line = (from === 'pool' ? pool : answer).find(l => l.id === String(a.id));
    if (!line) return;
    const overId = String(over.id);
    (from === 'pool' ? setPool : setAnswer)(prev => prev.filter(l => l.id !== line.id));
    (to === 'pool' ? setPool : setAnswer)(prev => {
      // Rapid dragOver bursts must not insert it twice.
      if (prev.some(l => l.id === line.id)) return prev;
      const overIdx = prev.findIndex(l => l.id === overId);
      const idx = overIdx === -1 ? prev.length : overIdx;
      return [...prev.slice(0, idx), line, ...prev.slice(idx)];
    });
  };

  const handleDragEnd = ({ active: a, over }: DragEndEvent) => {
    setDragId(null);
    if (graded || !over || a.id === over.id) return;
    const from = findList(String(a.id));
    const to = findList(String(over.id));
    if (!from || from !== to) return;
    (from === 'pool' ? setPool : setAnswer)(prev => {
      const oldIdx = prev.findIndex(l => l.id === String(a.id));
      const newIdx = prev.findIndex(l => l.id === String(over.id));
      if (oldIdx === -1 || newIdx === -1) return prev;
      return arrayMove(prev, oldIdx, newIdx);
    });
  };

  const announcements: Announcements = {
    onDragStart: ({ active: a }) => `Picked up: ${spoken(lineById(String(a.id))?.text ?? '')}`,
    onDragOver: () => undefined,
    onDragEnd: ({ active: a, over }) => {
      const text = spoken(lineById(String(a.id))?.text ?? '');
      if (!over) return `Put back: ${text}`;
      const idx = answer.findIndex(l => l.id === String(a.id));
      return idx >= 0 ? `Dropped as line ${idx + 1} of ${answer.length} in your solution: ${text}` : `Dropped in the lines: ${text}`;
    },
    onDragCancel: ({ active: a }) => `Put back: ${spoken(lineById(String(a.id))?.text ?? '')}`,
  };

  // ---- Grading ----
  const isRight = (lines: Line[]) => {
    if (lines.length !== correctOrder.length || lines.some(l => l.isDistractor)) return false;
    const got = normalizeImportRuns(lines.map(l => l.text));
    const want = normalizeImportRuns(correctOrder);
    return got.every((text, i) => text === want[i]);
  };

  const check = () => {
    if (graded || answer.length === 0) return;
    setGraded(true);
    onAnswer(isRight(answer));
  };

  const right = graded && isRight(answer);
  // Marks compare under the grader's import-run normalization, so a valid
  // reordering of imports shows as right.
  const normAnswer = normalizeImportRuns(answer.map(l => l.text));
  const normCorrect = normalizeImportRuns(correctOrder);
  const markOf = (line: Line, idx: number): Mark =>
    line.isDistractor ? 'extra' : normAnswer[idx] === normCorrect[idx] ? 'right' : 'wrong';

  // HTML questions preview the arrangement; CSS questions render it over the question's previewHtml.
  const isHtml = question.language === CodeLanguage.HTML;
  const preview = isHtml || Boolean(question.previewHtml);
  const assembled = answer.map(l => l.text).join('\n');
  const dragLine = dragId ? lineById(dragId) ?? null : null;
  const hasDistractors = allLines.some(l => l.isDistractor);

  const columns = preview
    ? 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.9fr)'
    : 'minmax(0, 1fr) minmax(0, 1fr)';

  return (
    <QuestionShell
      question={question}
      format={QUESTION_FORMAT[QuestionType.PARSONS]}
      task={`Put the lines you need in order${hasDistractors ? '; some lines do not belong' : ''}. Click or drag a line, or use the keys.`}
      graded={graded}
      dense
      keys={[['Space', 'add'], ['Alt+ArrowUp/ArrowDown', 'move']]}
      action={{ label: 'Check answer', onAction: check, disabled: answer.length === 0 }}
      hint={showHints ? question.hints : null}
      feedback={graded ? {
        verdict: right ? 'right' : 'wrong',
        title: right ? 'Correct' : 'Not quite',
        body: <Prose text={question.explanation} />,
      } : null}
    >
      <DataTables tables={question.tables} />
      <QuestionRegion>
        <DndContext
          sensors={sensors}
          collisionDetection={preferLineCollisions}
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
          accessibility={{ announcements, screenReaderInstructions: { draggable: 'Use the arrow keys and Space, or drag with the pointer.' } }}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setDragId(null)}
        >
          <AnswerColumns columns={columns} className={[styles.board, preview ? styles.withPreview : ''].filter(Boolean).join(' ')}>
            {graded && !right ? (
              <section className={styles.column} aria-label="Correct order">
                <h3 className={styles.heading}>Correct order</h3>
                <CodeBlock code={correctOrder.join('\n')} language={question.language} label={languageLabel(question.language)} numbered fill />
              </section>
            ) : (
              <section className={styles.column}>
                <h3 className={styles.heading}>{graded ? 'Left out' : 'Lines'}</h3>
                <LineList
                  id={listId.pool}
                  label={graded ? 'Lines left out' : 'Lines to choose from'}
                  listRef={poolRef}
                  lines={pool}
                  activeIndex={at.pool}
                  frozen={graded}
                  empty={graded ? 'Every line was used.' : 'All lines placed.'}
                >
                  {pool.map((line, i) => (
                    <LineItem
                      key={line.id}
                      line={line}
                      optionId={`${listId.pool}-${line.id}`}
                      language={question.language}
                      active={!graded && i === at.pool}
                      frozen={graded}
                      onClick={() => add(line)}
                    />
                  ))}
                </LineList>
              </section>
            )}

            <section className={styles.column}>
              <h3 className={styles.heading}>Your solution</h3>
              <LineList
                id={listId.answer}
                label="Your solution"
                listRef={answerRef}
                lines={answer}
                activeIndex={at.answer}
                frozen={graded}
                empty="Press Space on a line, click it or drag it here."
              >
                {answer.map((line, i) => (
                  <LineItem
                    key={line.id}
                    line={line}
                    optionId={`${listId.answer}-${line.id}`}
                    language={question.language}
                    active={!graded && i === at.answer}
                    frozen={graded}
                    position={i + 1}
                    mark={graded ? markOf(line, i) : undefined}
                    onClick={() => setActive(prev => ({ ...prev, answer: i }))}
                    controls={!graded && (
                      <span className={styles.controls} aria-hidden="true">
                        <Button size="xs" variant="ghost" tabIndex={-1} icon={<ArrowUp />} title="Move up" disabled={i === 0}
                          onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); move(i, i - 1); }} />
                        <Button size="xs" variant="ghost" tabIndex={-1} icon={<ArrowDown />} title="Move down" disabled={i === answer.length - 1}
                          onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); move(i, i + 1); }} />
                        <Button size="xs" variant="ghost" tabIndex={-1} icon={<X />} title="Take back"
                          onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); takeBack(line); }} />
                      </span>
                    )}
                  />
                ))}
              </LineList>
            </section>

            {preview && (
              <section className={`${styles.column} ${styles.previewColumn}`} aria-label="Preview">
                <h3 className={styles.heading}>Preview</h3>
                <LivePreview
                  html={isHtml ? assembled : question.previewHtml ?? ''}
                  css={isHtml ? undefined : assembled}
                  tailwind={question.topic === Topic.TAILWIND}
                />
              </section>
            )}
          </AnswerColumns>

          <DragOverlay dropAnimation={null}>
            {dragLine ? (
              <div className={[styles.line, styles.overlay].join(' ')}>
                <LineCode text={dragLine.text} language={question.language} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </QuestionRegion>
      <div className="sr-only" aria-live="polite" aria-atomic="true">{said}</div>
    </QuestionShell>
  );
};
