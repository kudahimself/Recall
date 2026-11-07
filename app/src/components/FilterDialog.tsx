import React, { useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Course, Difficulty, QuestionType, Topic } from '../types';
import { getCourseForTopic, getCourseSections } from '../utils/courseConfig';
import { FilterOptions } from '../utils/questionFilters';
import { QUESTION_FORMAT } from '../utils/questionFormat';
import { questions } from '../data/questions';
import { useShortcut } from '../keyboard/shortcuts';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Eyebrow } from './ui/Card';
import { Checkbox } from './ui/Checkbox';
import { Dialog } from './ui/Dialog';
import styles from './FilterDialog.module.css';

const DIFFICULTIES = Object.values(Difficulty);
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface FilterDialogProps {
  filters: FilterOptions;
  course: Course;
  onChange: (filters: FilterOptions) => void;
  onReset: () => void;
  onClose: () => void;
}

/** Toggle every value of `group` in or out of `list` together. */
function setAll<T>(list: T[], group: T[], on: boolean): T[] {
  return on ? [...list, ...group.filter(v => !list.includes(v))] : list.filter(v => !group.includes(v));
}

/** F again closes the dialog (bound inside its own key layer, as R is for the rule card). */
function CloseOnF({ onClose }: { onClose: () => void }) {
  useShortcut('filters', () => onClose());
  return null;
}

/**
 * The quiz filters (F): which difficulties, question types and topics today's
 * session may serve. Every change applies at once; Reset selects everything.
 */
export function FilterDialog({ filters, course, onChange, onReset, onClose }: FilterDialogProps) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const sections = useMemo(() => getCourseSections(course), [course]);
  // Only the formats the course has questions of get a toggle.
  const types = useMemo(() => {
    const present = new Set(questions.filter(q => getCourseForTopic(q.topic) === course).map(q => q.type));
    return Object.values(QuestionType).filter(t => present.has(t));
  }, [course]);
  const courseTopics = useMemo(() => sections.flatMap(s => s.units.flatMap(([, keys]) => keys)) as Topic[], [sections]);
  const courseUnits = useMemo(() => sections.flatMap(s => s.units), [sections]);

  const has = (keys: string[]) => keys.filter(k => filters.topics.includes(k as Topic)).length;
  // A topic as the learner sees it (a unit) is in when every key under it is.
  const unitsIn = (units: Array<[string, string[]]>) => units.filter(([, keys]) => has(keys) === keys.length).length;
  const allTopics = has(courseTopics) === courseTopics.length;
  const allDifficulties = DIFFICULTIES.every(d => filters.difficulties.includes(d));
  const allTypes = types.every(t => filters.questionTypes.includes(t));

  const toggleOpen = (name: string) => setOpen(prev => {
    const next = new Set(prev);
    if (next.has(name)) next.delete(name); else next.add(name);
    return next;
  });
  const setTopics = (keys: string[], on: boolean) =>
    onChange({ ...filters, topics: setAll(filters.topics, keys as Topic[], on) });

  return (
    <Dialog
      title="Filters"
      onClose={onClose}
      bodyClassName={styles.body}
      footer={(
        <>
          <Button size="sm" onClick={onReset}>Reset</Button>
          <span className={styles.footNote}>Changes apply at once.</span>
          <Button variant="primary" size="sm" onClick={onClose} shortcut="F">Done</Button>
        </>
      )}
    >
      <CloseOnF onClose={onClose} />
      <p className={styles.intro}>Today's session serves only questions these allow.</p>

      <section className={styles.group} aria-labelledby="filter-difficulty">
        <div className={styles.groupHead}>
          <Eyebrow id="filter-difficulty">Difficulty</Eyebrow>
          <Button variant="ghost" size="xs" onClick={() => onChange({ ...filters, difficulties: allDifficulties ? [] : [...DIFFICULTIES] })}>
            {allDifficulties ? 'Deselect all' : 'Select all'}
          </Button>
        </div>
        <div className={styles.chips} role="group" aria-labelledby="filter-difficulty">
          {DIFFICULTIES.map((d, i) => {
            const on = filters.difficulties.includes(d);
            return (
              <Button
                key={d}
                size="sm"
                aria-pressed={on}
                icon={on ? <Check /> : undefined}
                data-autofocus={i === 0 ? true : undefined}
                onClick={() => onChange({ ...filters, difficulties: setAll(filters.difficulties, [d], !on) })}
              >
                {capital(d)}
              </Button>
            );
          })}
        </div>
      </section>

      <section className={styles.group} aria-labelledby="filter-type">
        <div className={styles.groupHead}>
          <Eyebrow id="filter-type">Question type</Eyebrow>
          <Button variant="ghost" size="xs" onClick={() => onChange({ ...filters, questionTypes: setAll(filters.questionTypes, types, !allTypes) })}>
            {allTypes ? 'Deselect all' : 'Select all'}
          </Button>
        </div>
        <div className={styles.chips} role="group" aria-labelledby="filter-type">
          {types.map(t => {
            const on = filters.questionTypes.includes(t);
            return (
              <Button
                key={t}
                size="sm"
                aria-pressed={on}
                icon={on ? <Check /> : undefined}
                onClick={() => onChange({ ...filters, questionTypes: setAll(filters.questionTypes, [t], !on) })}
              >
                {QUESTION_FORMAT[t]}
              </Button>
            );
          })}
        </div>
      </section>

      <section className={styles.group} aria-labelledby="filter-topics">
        <div className={styles.groupHead}>
          <Eyebrow id="filter-topics">Topics</Eyebrow>
          <span className={styles.count}>{unitsIn(courseUnits)} of {courseUnits.length}</span>
          <Button variant="ghost" size="xs" onClick={() => setTopics(courseTopics, !allTopics)}>
            {allTopics ? 'Deselect all' : 'Select all'}
          </Button>
        </div>
        <ul className={styles.sections}>
          {sections.map(section => {
            const keys = section.units.flatMap(([, k]) => k);
            const n = has(keys);
            const expanded = open.has(section.name);
            const unitsId = `filter-units-${section.name.replace(/\W+/g, '-')}`;
            return (
              <li key={section.name} className={styles.section}>
                <div className={styles.sectionRow}>
                  <Button
                    variant="ghost"
                    size="xs"
                    className={styles.expand}
                    icon={expanded ? <ChevronDown /> : <ChevronRight />}
                    aria-expanded={expanded}
                    aria-controls={unitsId}
                    aria-label={`${expanded ? 'Hide' : 'Show'} the topics of ${section.name}`}
                    onClick={() => toggleOpen(section.name)}
                  />
                  <Checkbox
                    className={styles.sectionBox}
                    label={section.name}
                    checked={n === keys.length}
                    indeterminate={n > 0 && n < keys.length}
                    onChange={on => setTopics(keys, on)}
                    aside={(
                      <>
                        {unitsIn(section.units)}/{section.units.length}
                        {section.weight && !/^Step /.test(section.weight) && <Badge className={styles.weight}>{section.weight}</Badge>}
                      </>
                    )}
                  />
                </div>
                {expanded && (
                  <div className={styles.units} id={unitsId}>
                    {section.units.map(([unit, unitKeys]) => {
                      const m = has(unitKeys);
                      return (
                        <Checkbox
                          key={unit}
                          label={unit}
                          title={unit}
                          checked={m === unitKeys.length}
                          indeterminate={m > 0 && m < unitKeys.length}
                          onChange={on => setTopics(unitKeys, on)}
                        />
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </Dialog>
  );
}
