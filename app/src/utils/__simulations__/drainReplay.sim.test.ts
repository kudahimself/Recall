/**
 * FORWARD replay of the review drain on a real exported state.
 *
 * realStateReplay asks "what would the selector serve next" from a frozen
 * snapshot. This one keeps going: it answers PER_DAY questions a day for DAYS
 * days, updating progress, sticky mastery, card difficulty and concept state
 * exactly the way App.handleAnswer does, and reports how the drain behaves for
 * someone coming back after time away:
 *   - new questions served per day (the "no new material for 11 days" symptom)
 *   - the drain queue at the end of each day and the day it first clears
 *   - how long every failed card waits before it is shown again
 *   - how early well-known cards come back relative to their interval
 *
 * Export the state the way realStateReplay's header describes, then run:
 *   REAL_STATE=<path>.json CI=true npx react-scripts test \
 *     --testPathPattern=drainReplay --watchAll=false
 *
 * Optional: REAL_COURSE (backend|webdev|databricks|data_engineering|sql,
 * default the exported active course), DAYS (30), PER_DAY (60), P_OK (0.85,
 * accuracy on cards not currently failed; failed cards pass at 0.5), SEED (7),
 * START (epoch ms of the first session, default 2026-09-21 18:00 UTC),
 * OUT (write the report to a file as well as the console).
 *
 * Skips itself when REAL_STATE is unset, so it never breaks a normal test run.
 * The state file is only ever read.
 *
 * It also pins the chosen behaviour after time away - reviews first:
 *   - no new question is served before the drain queue has first emptied
 *   - every card whose latest answer was wrong at the start is shown again by
 *     the next day's session, and every miss during the replay within two
 *     days' sessions
 * On the real Backend state of 2026-09-21 (336 cards queued after seven weeks
 * away, defaults above) that gives 0 new questions over days 0-9, the queue
 * first empty at the end of day 12, all 41 failed cards back by the next
 * session and in-replay misses back within two days.
 */
import { SpacedRepetitionSystem as SRS, ConceptSelectionContext } from '../spacedRepetition';
import { applyReview, gradeFromResponseTime, fsrsInitDifficulty, fsrsNextDifficulty, ConceptProgress } from '../conceptSRS';
import { BACKEND_CONCEPTS, WEBDEV_CONCEPTS, DATABRICKS_CONCEPTS } from '../conceptRegistry';
import { getSelectionPolicy, getTopicOrder } from '../courseConfig';
import { questions } from '../../data/questions';
import { Course, Question, QuestionAttempt, UserProgress } from '../../types';
import { seededRandom } from './simHarness';
import * as fs from 'fs';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const CONCEPT_BETAS: Record<string, number> = (() => {
  const o: Record<string, number> = {};
  for (const c of [...BACKEND_CONCEPTS, ...WEBDEV_CONCEPTS, ...DATABRICKS_CONCEPTS]) {
    if (c.beta !== undefined) o[c.id] = c.beta;
  }
  return o;
})();

const COURSE_BY_SLUG: Record<string, Course> = {
  webdev: Course.WEB_DEV,
  backend: Course.BACKEND,
  databricks: Course.DATABRICKS,
  data_engineering: Course.DATA_ENGINEERING,
  sql: Course.SQL,
};

const STATE_PATH = process.env.REAL_STATE;
const maybe = STATE_PATH && fs.existsSync(STATE_PATH) ? describe : describe.skip;

/** Mirror of App.tsx's loadProgress deserialization. */
function hydrate(p: Record<string, any>): UserProgress {
  const ids = new Set(questions.map(q => q.id));
  return {
    questionsAttempted: new Set((p.questionsAttempted ?? []).filter((id: string) => ids.has(id))),
    correctAnswers: new Set((p.correctAnswers ?? []).filter((id: string) => ids.has(id))),
    attemptHistory: (p.attemptHistory ?? []).filter((a: QuestionAttempt) => ids.has(a.questionId)),
    topicScores: new Map(Object.entries(p.topicScores ?? {})) as never,
    difficultyScores: new Map(Object.entries(p.difficultyScores ?? {})) as never,
    lastAttempt: new Map(Object.entries(p.lastAttempt ?? {})),
    repetitionQueue: new Map(),
    masteredTopics: new Set(p.masteredTopics ?? []),
  };
}

function quantile(xs: number[], q: number): number {
  if (xs.length === 0) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(q * s.length))];
}

const fmt = (x: number) => (Number.isFinite(x) ? x.toFixed(1) : '-');

maybe('drain forward replay', () => {
  it('reports new-question flow, backlog and failed-card return on a real state', () => {
    const raw = JSON.parse(fs.readFileSync(STATE_PATH as string, 'utf8'));
    const course = COURSE_BY_SLUG[process.env.REAL_COURSE ?? raw.activeCourse] ?? Course.BACKEND;
    const DAYS = Number(process.env.DAYS || 30);
    const PER_DAY = Number(process.env.PER_DAY || 60);
    const P_OK = Number(process.env.P_OK || 0.85);
    const START = Number(process.env.START || Date.UTC(2026, 8, 21, 18));

    const order = new Set(getTopicOrder(course));
    const pool = questions.filter(q => order.has(q.topic));
    const byId = new Map(questions.map(q => [q.id, q]));
    const inCourse = new Set(pool.map(q => q.id));
    const policy = getSelectionPolicy(course);

    let progress = hydrate(raw.progress);
    let concepts: ConceptProgress = raw.conceptProgress ?? {};
    let cardDifficulty: Record<string, number> = { ...(raw.cardDifficulty ?? {}) };

    const rng = seededRandom(Number(process.env.SEED || 7));
    const realRandom = Math.random;
    Math.random = rng;
    let clock = START;
    const nowSpy = jest.spyOn(Date, 'now').mockImplementation(() => clock);

    // Attribute every pick to the branch that produced it: the mastered
    // resurface (drain / due / floor), the concept-aware buckets, or the rest
    // (new-question draw and the legacy priority scorer).
    let via = 'other';
    const srsAny = SRS as any;
    const realResurface = srsAny.pickMasteredResurface.bind(SRS);
    const realConcept = srsAny.selectNextQuestionConceptAware.bind(SRS);
    const resurfaceSpy = jest.spyOn(srsAny, 'pickMasteredResurface').mockImplementation((...args: any[]) => {
      const pick = realResurface(...args);
      if (pick) via = args[3] ? 'resurface(filtered)' : 'resurface';
      return pick;
    });
    const conceptSpy = jest.spyOn(srsAny, 'selectNextQuestionConceptAware').mockImplementation((...args: any[]) => {
      const pick = realConcept(...args);
      if (pick) via = 'concept-aware';
      return pick;
    });
    const notDueByPath: Record<string, number> = {};
    const earlyByPath: Record<string, number[]> = {};

    // Failed cards waiting to be shown again: id -> when the miss happened.
    const latestAtStart = SRS.latestCorrectness(progress);
    const waitingSince = new Map<string, number>();
    const failedAtStart = new Set<string>();
    for (const id of Array.from(latestAtStart.keys())) {
      if (inCourse.has(id) && latestAtStart.get(id) === false) {
        waitingSince.set(id, progress.lastAttempt.get(id) ?? START);
        failedAtStart.add(id);
      }
    }
    const startFailWaits: number[] = [];   // days from START until a start-failed card is shown
    const simFailWaits: number[] = [];     // days from an in-sim miss until the card is shown again
    const earlyRatios: number[] = [];      // gap / interval for streak >= 5 cards shown while not due

    const lines: string[] = [];
    const log = (s: string) => lines.push(s);
    log(`course=${course} pool=${pool.length} start=${new Date(START).toISOString()} days=${DAYS} perDay=${PER_DAY} pOk=${P_OK}`);
    log(`failed (latest answer wrong) at start: ${failedAtStart.size} `
      + `(drain cards ${Array.from(failedAtStart).filter(id => SRS.isDrainCard(byId.get(id)!)).length})`);

    const newPerDay: number[] = [];
    let firstClearDay = -1;
    let firstNewDay = -1;
    for (let day = 0; day < DAYS; day++) {
      const q0 = SRS.getReviewStatus(pool, progress, policy, cardDifficulty).drainQueueCount;
      let newToday = 0;
      let failedToday = 0;
      for (let i = 0; i < PER_DAY; i++) {
        const ctx: ConceptSelectionContext = { progress: concepts, betas: CONCEPT_BETAS };
        via = 'other';
        const q: Question | null = SRS.selectNextQuestion(
          pool, progress, policy.useConceptSRS ? ctx : undefined, policy, cardDifficulty,
        );
        if (!q) break;
        const seen = progress.questionsAttempted.has(q.id);
        if (!seen) newToday++;
        const since = waitingSince.get(q.id);
        if (since !== undefined) {
          if (failedAtStart.has(q.id)) {
            startFailWaits.push((clock - START) / MS_PER_DAY);
            failedAtStart.delete(q.id);
          } else {
            simFailWaits.push((clock - since) / MS_PER_DAY);
          }
          waitingSince.delete(q.id);
        }
        const prevTs = progress.lastAttempt.get(q.id) ?? 0;
        if (seen && prevTs > 0 && SRS.latestCorrectness(progress).get(q.id) === true) {
          const ratio = (clock - prevTs) / MS_PER_DAY / SRS.getEffectiveInterval(q.id, progress, cardDifficulty);
          if (ratio < 1) {
            notDueByPath[via] = (notDueByPath[via] ?? 0) + 1;
            if (SRS.getCorrectStreak(q.id, progress) >= 5) {
              earlyRatios.push(ratio);
              (earlyByPath[via] = earlyByPath[via] ?? []).push(ratio);
            }
          }
        }

        const wasWrong = SRS.latestCorrectness(progress).get(q.id) === false;
        const ok = rng() < (wasWrong ? 0.5 : P_OK);
        if (!ok) failedToday++;
        const timeSpent = 30000 + Math.floor(rng() * 60000);
        clock += timeSpent;

        // Mirror App.handleAnswer.
        const attemptHistory = [...progress.attemptHistory, {
          questionId: q.id, timestamp: clock, isCorrect: ok, attempts: 1,
          timeSpent, credit: ok ? 1 : 0, hintTierUsed: 0,
        } as QuestionAttempt];
        const lastAttempt = new Map(progress.lastAttempt);
        lastAttempt.set(q.id, clock);
        const questionsAttempted = new Set(progress.questionsAttempted);
        questionsAttempted.add(q.id);
        const masteredTopics = SRS.updateMasteredTopics({ ...progress, attemptHistory }, q.topic, questions);
        progress = { ...progress, attemptHistory, lastAttempt, questionsAttempted, masteredTopics };
        const grade = gradeFromResponseTime(q.type, timeSpent, ok);
        const prevD = cardDifficulty[q.id] ?? 0;
        if (q.concepts && q.concepts.length > 0) {
          const r = applyReview(q.concepts, grade, prevD, prevTs > 0 ? (clock - prevTs) / MS_PER_DAY : 0,
            concepts, CONCEPT_BETAS, clock);
          concepts = { ...concepts, ...r.conceptUpdates };
        }
        cardDifficulty = { ...cardDifficulty, [q.id]: prevD <= 0 ? fsrsInitDifficulty(grade) : fsrsNextDifficulty(prevD, grade) };
        if (!ok) waitingSince.set(q.id, clock);
      }
      const q1 = SRS.getReviewStatus(pool, progress, policy, cardDifficulty).drainQueueCount;
      newPerDay.push(newToday);
      if (firstNewDay < 0 && newToday > 0) firstNewDay = day;
      if (firstClearDay < 0 && q1 === 0) firstClearDay = day;
      log(`day ${String(day).padStart(2)}: drain queue ${String(q0).padStart(3)} -> ${String(q1).padStart(3)}  new ${String(newToday).padStart(2)}/${PER_DAY}  missed ${failedToday}`);
      clock = START + (day + 1) * MS_PER_DAY;
    }
    const end = clock;

    const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
    const openWaits = Array.from(waitingSince.entries()).map(([id, t]) => ({
      id, days: (end - t) / MS_PER_DAY, atStart: failedAtStart.has(id),
    }));
    log('');
    log(`new questions: days 0-9 ${sum(newPerDay.slice(0, 10))}/${Math.min(10, DAYS) * PER_DAY}, `
      + `all ${sum(newPerDay)}/${DAYS * PER_DAY}; first new question on day ${firstNewDay}`);
    log(`drain queue first empty at the end of day ${firstClearDay}`);
    log(`start-failed cards shown again: ${startFailWaits.length}/${startFailWaits.length + failedAtStart.size}; `
      + `days after return p50 ${fmt(quantile(startFailWaits, 0.5))} p95 ${fmt(quantile(startFailWaits, 0.95))} max ${fmt(Math.max(-1, ...startFailWaits))}`);
    log(`in-sim misses shown again: ${simFailWaits.length}; days later p50 ${fmt(quantile(simFailWaits, 0.5))} `
      + `p95 ${fmt(quantile(simFailWaits, 0.95))} max ${fmt(Math.max(-1, ...simFailWaits))}`);
    const openSim = openWaits.filter(w => !w.atStart);
    log(`still waiting at the end: ${failedAtStart.size} start-failed, ${openSim.length} in-sim misses `
      + `(longest in-sim wait ${fmt(Math.max(-1, ...openSim.map(w => w.days)))} days)`);
    const stillStart = Array.from(failedAtStart).slice(0, 12)
      .map(id => `${id}(${byId.get(id)!.type}/${byId.get(id)!.difficulty})`);
    if (stillStart.length) log(`  never shown: ${stillStart.join(', ')}${failedAtStart.size > 12 ? ', ...' : ''}`);
    log(`streak>=5 cards shown before due: ${earlyRatios.length}; gap/interval p50 ${fmt(quantile(earlyRatios, 0.5) * 100)}%`);

    log(`reviews of latest-correct cards shown before due, by branch: ${JSON.stringify(notDueByPath)}`);
    log(`  streak>=5 only: ${Object.entries(earlyByPath).map(([k, v]) => `${k} ${v.length} (p50 ${fmt(quantile(v, 0.5) * 100)}%)`).join(', ')}`);

    resurfaceSpy.mockRestore();
    conceptSpy.mockRestore();
    nowSpy.mockRestore();
    Math.random = realRandom;
    const report = lines.join('\n');
    // eslint-disable-next-line no-console
    console.log(report);
    if (process.env.OUT) fs.writeFileSync(process.env.OUT, report);
    expect(newPerDay.length).toBe(DAYS);
    // Reviews first: nothing new until the backlog has cleared once. A day that
    // clears the queue may serve new questions after it clears.
    if (firstNewDay >= 0) {
      expect(firstClearDay).toBeGreaterThanOrEqual(0);
      expect(firstNewDay).toBeGreaterThanOrEqual(firstClearDay);
    }
    // Every failed card comes back, and soon. Sessions are a day apart and
    // last about an hour, so "by the next session" is under 1.5 days.
    expect(failedAtStart.size).toBe(0);
    expect(Math.max(0, ...startFailWaits)).toBeLessThan(1.5);
    expect(Math.max(0, ...simFailWaits)).toBeLessThan(2.5);
    expect(Math.max(0, ...openSim.map(w => w.days))).toBeLessThan(2.5);
  });
});
