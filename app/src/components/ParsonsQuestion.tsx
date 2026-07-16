import React, { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  CollisionDetection,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ParsonsQuestion as ParsonsQ, CodeLanguage, Topic } from '../types';
import { StyledButton } from './StyledButton';
import { LivePreview } from './visual/LivePreview';
import './ParsonsQuestion.css';

interface Props {
  question: ParsonsQ;
  onAnswer: (isCorrect: boolean) => void;
  onNext?: () => void;
  showHints: boolean;
}

interface Line {
  id: string;
  text: string;
  isDistractor: boolean;
}

// Python import statements are order-independent (barring rare side-effect
// imports, which these questions don't use). The strict-positional grader would
// otherwise reject any but the authored order of a multi-import block — a guess
// the user can't win. Normalize by sorting each MAXIMAL RUN of consecutive
// import lines in place, then compare positionally. Applied to both the user's
// answer and the correctOrder, so two valid import orderings collapse to the
// same sequence. Non-import siblings (e.g. two independent assignments) are NOT
// covered — those must be disambiguated in the prompt.
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

function seededShuffle<T>(items: T[], seedKey: string): T[] {
  let seed = 0;
  for (let i = 0; i < seedKey.length; i++) {
    seed = ((seed << 5) - seed + seedKey.charCodeAt(i)) | 0;
  }
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) | 0;
    const j = (seed >>> 0) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Bin ids used as droppable targets so drops on empty-bin background land.
const AVAILABLE_BIN = 'available-bin';
const ANSWER_BIN = 'answer-bin';

// The bin droppables enclose every tile, so distance-based strategies like
// closestCorners keep resolving to the bin (= append) instead of the hovered
// tile, breaking insert-between and multi-step reorders. Prefer tile hits;
// fall back to the bin only when no tile is under the pointer (empty bin,
// bin padding).
const preferTileCollisions: CollisionDetection = args => {
  const pointerHits = pointerWithin(args);
  const hits = pointerHits.length > 0 ? pointerHits : rectIntersection(args);
  const tileHits = hits.filter(c => c.id !== AVAILABLE_BIN && c.id !== ANSWER_BIN);
  return tileHits.length > 0 ? tileHits : hits;
};

const BinDroppable: React.FC<{
  id: string;
  className: string;
  disabled: boolean;
  children: React.ReactNode;
}> = ({ id, className, disabled, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id, disabled });
  return (
    <div ref={setNodeRef} className={`${className}${isOver && !disabled ? ' drop-active' : ''}`}>
      {children}
    </div>
  );
};

const SortableAvailableLine: React.FC<{
  line: Line;
  disabled: boolean;
  onAdd: () => void;
}> = ({ line, disabled, onAdd }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: line.id, disabled });
  return (
    <button
      ref={setNodeRef}
      type="button"
      className={`parsons-line available${isDragging ? ' dragging' : ''}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={onAdd}
      {...attributes}
      {...listeners}
    >
      <pre>{line.text}</pre>
    </button>
  );
};

const SortableAnswerLine: React.FC<{
  line: Line;
  className: string;
  disabled: boolean;
  controls: React.ReactNode;
}> = ({ line, className, disabled, controls }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: line.id, disabled });
  return (
    <div
      ref={setNodeRef}
      className={`${className}${isDragging ? ' dragging' : ''}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
    >
      <pre>{line.text}</pre>
      {controls}
    </div>
  );
};

export const ParsonsQuestion: React.FC<Props> = ({
  question,
  onAnswer,
  onNext,
  showHints,
}) => {
  // Empty/whitespace-only entries in correctOrder are formatting noise for the
  // assembled `solution` string — they don't belong in the drag-and-drop pool
  // (they'd render as identical invisible boxes the user can't tell apart).
  // Strip them here; validate against the same stripped sequence below.
  const meaningfulCorrectOrder = useMemo(
    () => question.correctOrder.filter(line => line.trim() !== ''),
    [question.correctOrder]
  );

  const allLines: Line[] = useMemo(() => {
    const correct = meaningfulCorrectOrder.map((text, i) => ({
      id: `c${i}`,
      text,
      isDistractor: false,
    }));
    // Drop distractors that would render as visually identical tiles to a
    // correctOrder line — those force a 50/50 guess. Also de-dup within
    // distractors. Multiplicity inside correctOrder is preserved (a line that
    // legitimately appears twice in the answer still gets two tiles).
    const correctTexts = new Set(meaningfulCorrectOrder);
    const seenDistractor = new Set<string>();
    const distractors: Line[] = [];
    for (const text of question.distractorLines || []) {
      if (text.trim() === '') continue;
      if (correctTexts.has(text)) continue;
      if (seenDistractor.has(text)) continue;
      seenDistractor.add(text);
      distractors.push({ id: `d${distractors.length}`, text, isDistractor: true });
    }
    return seededShuffle([...correct, ...distractors], question.id);
  }, [question.id, meaningfulCorrectOrder, question.distractorLines]);

  const [available, setAvailable] = useState<Line[]>(allLines);
  const [answer, setAnswer] = useState<Line[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setAvailable(allLines);
    setAnswer([]);
    setIsSubmitted(false);
    setShowHint(false);
    setActiveId(null);
  }, [question.id, allLines]);

  // 5px activation distance lets a plain click still fire onClick (click-to-add
  // and the ↑/↓/✕ controls) - only an actual pointer move starts a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const moveToAnswer = (line: Line) => {
    if (isSubmitted) return;
    setAvailable(prev => prev.filter(l => l.id !== line.id));
    setAnswer(prev => [...prev, line]);
  };

  const moveToAvailable = (line: Line) => {
    if (isSubmitted) return;
    setAnswer(prev => prev.filter(l => l.id !== line.id));
    setAvailable(prev => [...prev, line]);
  };

  const moveUp = (idx: number) => {
    if (isSubmitted || idx === 0) return;
    setAnswer(prev => {
      const out = [...prev];
      [out[idx - 1], out[idx]] = [out[idx], out[idx - 1]];
      return out;
    });
  };

  const moveDown = (idx: number) => {
    if (isSubmitted || idx === answer.length - 1) return;
    setAnswer(prev => {
      const out = [...prev];
      [out[idx], out[idx + 1]] = [out[idx + 1], out[idx]];
      return out;
    });
  };

  const findContainer = (id: string): 'available' | 'answer' | null => {
    if (id === AVAILABLE_BIN) return 'available';
    if (id === ANSWER_BIN) return 'answer';
    if (available.some(l => l.id === id)) return 'available';
    if (answer.some(l => l.id === id)) return 'answer';
    return null;
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (isSubmitted) return;
    setActiveId(String(active.id));
  };

  // Cross-container moves happen live during the drag so the tile visually
  // joins the target list mid-drag. Same-container reorders finalize in
  // handleDragEnd via arrayMove.
  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (isSubmitted || !over) return;
    const from = findContainer(String(active.id));
    const to = findContainer(String(over.id));
    if (!from || !to || from === to) return;

    const sourceList = from === 'available' ? available : answer;
    const line = sourceList.find(l => l.id === String(active.id));
    if (!line) return;

    const setSource = from === 'available' ? setAvailable : setAnswer;
    const setTarget = to === 'available' ? setAvailable : setAnswer;
    const overId = String(over.id);

    setSource(prev => prev.filter(l => l.id !== line.id));
    setTarget(prev => {
      // Guard against duplicate insertion during rapid dragOver bursts.
      if (prev.some(l => l.id === line.id)) return prev;
      const overIdx = prev.findIndex(l => l.id === overId);
      const idx = overIdx === -1 ? prev.length : overIdx;
      return [...prev.slice(0, idx), line, ...prev.slice(idx)];
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (isSubmitted || !over || active.id === over.id) return;
    const from = findContainer(String(active.id));
    const to = findContainer(String(over.id));
    if (!from || from !== to) return;

    const setList = from === 'available' ? setAvailable : setAnswer;
    setList(prev => {
      const oldIdx = prev.findIndex(l => l.id === String(active.id));
      const newIdx = prev.findIndex(l => l.id === String(over.id));
      if (oldIdx === -1 || newIdx === -1) return prev;
      return arrayMove(prev, oldIdx, newIdx);
    });
  };

  const evaluate = (): boolean => {
    if (answer.length !== meaningfulCorrectOrder.length) return false;
    if (answer.some(line => line.isDistractor)) return false;
    const normAnswer = normalizeImportRuns(answer.map(line => line.text));
    const normCorrect = normalizeImportRuns(meaningfulCorrectOrder);
    return normAnswer.every((text, i) => text === normCorrect[i]);
  };

  const handleSubmit = () => {
    const correct = evaluate();
    setIsSubmitted(true);
    onAnswer(correct);
  };

  const lineClass = (line: Line, idx: number): string => {
    if (!isSubmitted) return 'parsons-line';
    if (line.isDistractor) return 'parsons-line wrong';
    // Compare under the same import-run normalization the grader uses, so a
    // valid alternative import ordering is shown green rather than red.
    const normAnswer = normalizeImportRuns(answer.map(l => l.text));
    const normCorrect = normalizeImportRuns(meaningfulCorrectOrder);
    if (normAnswer[idx] !== normCorrect[idx]) return 'parsons-line wrong';
    return 'parsons-line correct';
  };

  const wasCorrect = isSubmitted && evaluate();

  // Live preview of the current arrangement (HTML/CSS questions): the answer
  // column's lines joined as-is. Renders progressively as lines are added.
  const isHtmlQuestion = question.language === CodeLanguage.HTML;
  const previewActive = isHtmlQuestion || Boolean(question.previewHtml);
  const assembledCode = answer.map(line => line.text).join('\n');

  const activeLine = activeId
    ? available.find(l => l.id === activeId) ?? answer.find(l => l.id === activeId) ?? null
    : null;

  return (
    <div className="parsons-question">
      <h3 className="question-text">{question.question}</h3>

      <div className="badges-row">
        <div className="difficulty-badge">{question.difficulty.toUpperCase()}</div>
        <div className="topic-badge">
          {question.topic.replace(/_/g, ' ').toUpperCase()}
        </div>
        <div className="format-badge">PARSONS</div>
      </div>

      <div className="parsons-instructions">
        Drag lines into your solution and drag to reorder - or click a line to add it. Use ↑/↓ to reorder, ✕ to remove.
        {question.distractorLines && question.distractorLines.length > 0 && (
          <span className="parsons-warning"> Some lines don't belong — leave them out.</span>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={preferTileCollisions}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className={`parsons-columns${activeId ? ' is-dragging' : ''}`}>
          <div className="parsons-column">
            <div className="parsons-column-header">Available lines</div>
            <BinDroppable id={AVAILABLE_BIN} className="parsons-bin" disabled={isSubmitted}>
              {available.length === 0 && (
                <div className="parsons-empty">All lines used.</div>
              )}
              <SortableContext
                items={available.map(l => l.id)}
                strategy={verticalListSortingStrategy}
              >
                {available.map(line => (
                  <SortableAvailableLine
                    key={line.id}
                    line={line}
                    disabled={isSubmitted}
                    onAdd={() => moveToAnswer(line)}
                  />
                ))}
              </SortableContext>
            </BinDroppable>
          </div>

          <div className="parsons-column">
            <div className="parsons-column-header">Your solution</div>
            <BinDroppable
              id={ANSWER_BIN}
              className="parsons-bin parsons-answer-bin"
              disabled={isSubmitted}
            >
              {answer.length === 0 && (
                <div className="parsons-empty">Drag or click a line on the left to start.</div>
              )}
              <SortableContext
                items={answer.map(l => l.id)}
                strategy={verticalListSortingStrategy}
              >
                {answer.map((line, idx) => (
                  <SortableAnswerLine
                    key={line.id}
                    line={line}
                    className={lineClass(line, idx)}
                    disabled={isSubmitted}
                    controls={
                      !isSubmitted && (
                        <div className="parsons-line-controls">
                          <button
                            onClick={() => moveUp(idx)}
                            disabled={idx === 0}
                            title="Move up"
                            aria-label="Move line up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveDown(idx)}
                            disabled={idx === answer.length - 1}
                            title="Move down"
                            aria-label="Move line down"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => moveToAvailable(line)}
                            title="Remove"
                            aria-label="Remove line"
                          >
                            ✕
                          </button>
                        </div>
                      )
                    }
                  />
                ))}
              </SortableContext>
            </BinDroppable>
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeLine ? (
            <div className="parsons-line available drag-overlay">
              <pre>{activeLine.text}</pre>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {previewActive && (
        <div className="parsons-preview-wrapper">
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
          disabled={answer.length === 0}
        >
          Submit Solution
        </button>
      ) : (
        <div className="explanation">
          <h4>{wasCorrect ? 'Correct.' : 'Not quite.'}</h4>
          <p>{question.explanation}</p>
          {!wasCorrect && (
            <div className="reference-solution">
              <div className="reference-label">Reference solution:</div>
              <pre className="reference-code">{question.solution}</pre>
            </div>
          )}
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
