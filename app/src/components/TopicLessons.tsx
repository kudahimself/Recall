/**
 * Progress → Topics: every topic of the course with its three steps (lesson,
 * ramp, review), and from each row the topic's rule card and a drill. The
 * selected topic shows its ramp by difficulty, its exercise to do in the
 * learner's own editor (utils/exercises) when it has one, and the review
 * schedule of each of its card families (familySchedule).
 */
import React, { useMemo, useState } from 'react';
import { BookOpen, Dumbbell, Lock } from 'lucide-react';
import { Course, Question, UserProgress } from '../types';
import { getPathOrder, getSectionUnits } from '../utils/courseConfig';
import { SpacedRepetitionSystem } from '../utils/spacedRepetition';
import { FsrsStore, State } from '../utils/familySchedule';
import { LessonsDone, TopicSteps, topicSteps } from '../utils/lessons';
import { ExercisesDone, exerciseForTopics } from '../utils/exercises';
import { ExerciseCard } from './ExerciseCard';
import './TopicLessons.css';

interface Props {
  course: Course;
  questions: Question[];
  progress: UserProgress;
  store: FsrsStore;
  lessonsDone: LessonsDone;
  exercisesDone: ExercisesDone;
  onRuleCard: (lessonId: string) => void;
  onDrill: (topicKeys: string[]) => void;
  onToggleExercise: (exerciseId: string) => void;
}

const DAY = 24 * 60 * 60 * 1000;

function relativeDay(ms: number, now: number): string {
  const days = Math.round((new Date(ms).setHours(0, 0, 0, 0) - new Date(now).setHours(0, 0, 0, 0)) / DAY);
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days === -1) return 'yesterday';
  return days > 0 ? `in ${days} days` : `${-days} days ago`;
}

function familyLabel(family: string): string {
  const concept = family.slice(family.indexOf('/') + 1);
  return concept === '*' ? 'Whole topic' : concept.replace(/[-_]/g, ' ');
}

function stateLabel(f: TopicSteps['families'][number]): { text: string; cls: string } {
  if (!f.state || f.state.state === State.New) return { text: 'not met', cls: 'tl-state-none' };
  if (!f.state.lastCorrect) return { text: 'missed last time', cls: 'tl-state-missed' };
  if (f.due) return { text: 'due', cls: 'tl-state-due' };
  return { text: f.state.state === State.Review ? 'review' : 'learning', cls: 'tl-state-ok' };
}

interface Row {
  section: string;
  name: string;
  keys: string[];
  unlocked: boolean;
  steps: TopicSteps;
}

export function TopicLessons({
  course, questions, progress, store, lessonsDone, exercisesDone, onRuleCard, onDrill, onToggleExercise,
}: Props) {
  const now = Date.now();
  const rows = useMemo<Row[]>(() => {
    const unlocked = SpacedRepetitionSystem.getUnlockedTopics(questions, progress);
    return getPathOrder(course).flatMap(section => getSectionUnits(section)
      .map(([name, keys]) => ({
        section,
        name,
        keys,
        unlocked: !unlocked || keys.some(k => unlocked.has(k)),
        steps: topicSteps(keys, questions, progress, store, lessonsDone, now),
      }))
      .filter(r => r.steps.total > 0));
  // `now` only labels days; recompute with the data.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, questions, progress, store, lessonsDone]);

  const firstOpen = rows.find(r => r.unlocked && (!r.steps.lessonMet || r.steps.rampAnswered < r.steps.rampTotal));
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const selected = rows.find(r => r.name === selectedName) ?? firstOpen ?? rows[0];
  const sections = Array.from(new Set(rows.map(r => r.section)));

  if (!selected) return <p className="no-data">This course has no topics yet.</p>;
  const s = selected.steps;
  const answered = s.lesson ? s.lesson.exercises.filter(id => progress.questionsAttempted.has(id)) : [];
  const answeredRight = answered.filter(id => progress.correctAnswers.has(id)).length;
  const exercise = exerciseForTopics(selected.keys);

  return (
    <div className="topic-lessons">
      <section className="tl-list" aria-label="Topics">
        <p className="tl-intro">
          Each topic keeps its rule card.
          Reopen it to reread the idea and its worked example, or drill the topic.
        </p>
        {sections.map(section => (
          <div key={section} className="tl-section">
            <h3 className="tl-section-name">{section}</h3>
            {rows.filter(r => r.section === section).map((r, i) => {
              const st = r.steps;
              const status = !r.unlocked ? 'locked'
                : !st.lesson ? (st.seen > 0 ? `${st.seen}/${st.total} seen` : 'not started')
                : !st.lessonMet ? 'lesson not done yet'
                : st.lessonDoneAt ? `lesson done ${relativeDay(st.lessonDoneAt, now)}`
                : 'lesson met: its exercises are answered';
              const rowExercise = exerciseForTopics(r.keys);
              const exerciseNote = rowExercise && exercisesDone[rowExercise.id] !== undefined ? ' · exercise done' : '';
              return (
                <div
                  key={r.name}
                  className={`tl-row${r === selected ? ' tl-row-selected' : ''}${r.unlocked ? '' : ' tl-row-locked'}`}
                  onClick={() => setSelectedName(r.name)}
                >
                  <span className="tl-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="tl-name">
                    <span className="tl-name-text">{r.name}</span>
                    <span className="tl-status">{status}{exerciseNote}</span>
                  </span>
                  <span className="tl-ramp">ramp {st.rampAnswered}/{st.rampTotal}</span>
                  <span className="tl-actions">
                    {st.lesson && (
                      <button
                        className="tl-btn"
                        onClick={e => { e.stopPropagation(); onRuleCard(st.lesson!.id); }}
                        title="Reopen this topic's rule card"
                      >
                        Rule card
                      </button>
                    )}
                    {r.unlocked
                      ? (
                        <button
                          className="tl-btn"
                          onClick={e => { e.stopPropagation(); onDrill(r.keys); }}
                          title="Practise this topic only"
                        >
                          Drill
                        </button>
                      )
                      : <span className="tl-locked"><Lock size={12} /></span>}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </section>

      <section className="tl-detail" aria-label={`Topic: ${selected.name}`}>
        <div className="tl-eyebrow">Topic · {selected.section}</div>
        <h2 className="tl-title">{selected.name}</h2>
        <div className="tl-stats">
          <div className="tl-stat">
            <span className="tl-stat-label">Lesson</span>
            <span className={`tl-stat-value${s.lesson && s.lessonMet ? ' tl-good' : ''}`}>
              {!s.lesson ? 'None yet' : s.lessonDoneAt ? 'Done' : s.lessonMet ? 'Met' : 'Not yet'}
            </span>
            <span className="tl-stat-note">
              {!s.lesson
                ? 'Lessons arrive one section at a time.'
                : `${answered.length}/${s.lesson.exercises.length} exercises answered, ${answeredRight} right`}
            </span>
          </div>
          <div className="tl-stat">
            <span className="tl-stat-label">Ramp</span>
            <span className="tl-stat-value">{s.rampAnswered} / {s.rampTotal}</span>
            <span className="tl-stat-note">{s.rampByDifficulty.map(d => `${d.difficulty} ${d.answered}/${d.total}`).join(' · ')}</span>
          </div>
          <div className="tl-stat">
            <span className="tl-stat-label">Review</span>
            <span className="tl-stat-value">{s.families.filter(f => f.due).length} due</span>
            <span className="tl-stat-note">
              {s.families.filter(f => f.state && f.state.state !== State.New).length} of {s.families.length} card families met
            </span>
          </div>
        </div>
        <div className="tl-buttons">
          {s.lesson && (
            <button className="start-button tl-primary" onClick={() => onRuleCard(s.lesson!.id)}>
              <BookOpen size={16} /> Reopen the rule card
            </button>
          )}
          {selected.unlocked && (
            <button className="hero-link-btn" onClick={() => onDrill(selected.keys)}>
              <Dumbbell size={14} /> Drill this topic
            </button>
          )}
        </div>
        {exercise && (
          <ExerciseCard
            exercise={exercise}
            doneAt={exercisesDone[exercise.id]}
            rampDone={s.rampAnswered >= s.rampTotal}
            rampAnswered={s.rampAnswered}
            rampTotal={s.rampTotal}
            dayLabel={ms => relativeDay(ms, now)}
            onToggle={onToggleExercise}
          />
        )}
        <h3 className="tl-sub">Review schedule</h3>
        <table className="tl-table">
          <thead>
            <tr><th>Card family</th><th>Last</th><th>Next review</th><th>State</th></tr>
          </thead>
          <tbody>
            {s.families.map(f => {
              const label = stateLabel(f);
              const met = f.state && f.state.state !== State.New;
              return (
                <tr key={f.family}>
                  <td>{familyLabel(f.family)}</td>
                  <td>{met && f.state!.last_review ? `${relativeDay(f.state!.last_review, now)} ${f.state!.lastCorrect ? '✓' : '✗'}` : '-'}</td>
                  <td>{met ? (f.due ? 'due now' : relativeDay(f.state!.due, now)) : '-'}</td>
                  <td><span className={`tl-state ${label.cls}`}>{label.text}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="tl-footnote">
          Reviews are scheduled per card family, so one review of a family can serve any of its cards.
          Due families feed today's review list, the "Reviews left" number that Home and the session count down.
        </p>
      </section>
    </div>
  );
}
