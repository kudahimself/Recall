/**
 * Today's session over weeks: the Stage 1 gate.
 *
 * A learner on one course does the bounded Today session every day (the
 * default 20 cards, reviews capped at 60 percent), answering the way
 * App.handleAnswer records them: attempt history, sticky mastery, card
 * difficulty, the family schedule (recordAttempt) and the session
 * (recordReviewAnswer). It reports, per day and per week, the review list at
 * the start and whether it reached 0, new cards, drills, re-asks, the review
 * share of the session, the families still due once the session is over, and
 * the old card-level "owed" count the teaching-plan study used.
 *
 * Checks (no tolerance):
 *   - the review list reaches 0 every day the learner studies
 *   - from day STEADY_FROM on, reviews are at most the review share of every
 *     session
 *   - no card on a correct streak of WELL_KNOWN_STREAK or more is served
 *     before its interval (getEffectiveInterval at the moment it is served)
 *   - new cards keep coming: every studied week serves some
 *   - the families still owed after the session stay bounded and clear: from
 *     day STEADY_FROM on, at most one day's review cap (the first
 *     OWED_RUN_DAYS days back from a gap aside), and never owed more than
 *     OWED_RUN_DAYS studied days in a row
 *
 * The default run (Backend, 28 days) runs in every test run. The study's
 * scenarios:
 *   DAYS=56 OUT=<file> CI=true npx react-scripts test --testPathPattern=todaySession --watchAll=false
 *   DAYS=56 GAP=28-37 OUT=<file> ...   (10 days off)
 * Optional: COURSE (backend|web_dev|databricks|data_engineering|sql), PER_DAY
 * (session size, 20), SHARE (0.6), P_OK (0.85; a card whose latest answer was
 * wrong passes at 0.5), SEED (7), REAL_STATE (start from an exported state:
 * the realStateReplay format; its history is replayed into the family
 * schedule first), START (epoch ms of the first session).
 */
import { SpacedRepetitionSystem as SRS, WELL_KNOWN_STREAK, todayReviewCap } from '../spacedRepetition';
import { getTopicOrder } from '../courseConfig';
import { questions } from '../../data/questions';
import { Course, Question, QuestionAttempt, UserProgress } from '../../types';
import { parseStoredProgress } from '../progressStorage';
import { seedMasteredTopics } from '../masteryMigration';
import { attemptGrade, FsrsStore, nextCardDifficulty, replayHistory, recordAttempt, emptyStore } from '../familySchedule';
import { buildReviewList, recordReviewAnswer, selectSessionQuestion, startReviewSession, familyOf } from '../reviewSession';
import * as fs from 'fs';

const DAY = 24 * 60 * 60 * 1000;
const env = process.env;
const DAYS = Number(env.DAYS || 28);
const PER_DAY = Number(env.PER_DAY || 20);
const SHARE = Number(env.SHARE || 0.6);
const P_OK = Number(env.P_OK || 0.85);
const GAP = (env.GAP || '').split('-').filter(Boolean).map(Number);
const STEADY_FROM = 14;
const OWED_RUN_DAYS = 7;

interface DayRow {
  day: number;
  off: boolean;
  listStart: number;
  listEnd: number;
  overflow: number;
  answered: number;
  review: number;
  fresh: number;
  drill: number;
  again: number;
  practice: number;
  dueAfter: number;
  owedCards: number;
  seen: number;
  early: number;
}

it('Today session: list reaches 0 daily, reviews within the share, no early well-known card', () => {
  let seed = Number(env.SEED || 7);
  const rng = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  const byId = new Map(questions.map(q => [q.id, q]));

  let progress: UserProgress;
  let cardDifficulty: Record<string, number> = {};
  let course = (env.COURSE as Course) || Course.BACKEND;
  let START = Number(env.START) || Date.UTC(2026, 8, 1, 18);
  if (env.REAL_STATE) {
    const raw = JSON.parse(fs.readFileSync(env.REAL_STATE, 'utf8'));
    progress = parseStoredProgress(JSON.stringify(raw.progress), new Set(byId.keys()), h => seedMasteredTopics(questions, h)).progress;
    cardDifficulty = raw.cardDifficulty ?? {};
    course = (env.COURSE as Course) || (raw.activeCourse as Course) || course;
    const last = progress.attemptHistory.reduce((m, a) => Math.max(m, a.timestamp), 0);
    if (!env.START) START = last + DAY;
  } else {
    progress = {
      questionsAttempted: new Set(), correctAnswers: new Set(), attemptHistory: [], topicScores: new Map(),
      difficultyScores: new Map(), lastAttempt: new Map(), repetitionQueue: new Map(), masteredTopics: new Set(),
    };
  }
  const order = new Set(getTopicOrder(course));
  const pool: Question[] = questions.filter(q => order.has(q.topic));
  let store: FsrsStore = progress.attemptHistory.length > 0 ? replayHistory(progress.attemptHistory, byId) : emptyStore(byId);

  const realRandom = Math.random;
  Math.random = rng;
  let clock = START;
  const nowSpy = jest.spyOn(Date, 'now').mockImplementation(() => clock);
  const rows: DayRow[] = [];
  const earlyServes: { id: string; ratio: number }[] = [];
  let wellKnownServes = 0;
  const owedCards = (p: UserProgress): number => {
    const unlocked = SRS.getUnlockedTopics(pool, p);
    const latest = SRS.latestCorrectness(p);
    let n = 0;
    for (const q of pool) {
      if (unlocked && !unlocked.has(q.topic)) continue;
      const ok = latest.get(q.id);
      if (ok === undefined) continue;
      const last = p.lastAttempt.get(q.id) ?? 0;
      if (!ok || (clock - last) / DAY >= SRS.getEffectiveInterval(q.id, p, cardDifficulty)) n++;
    }
    return n;
  };
  try {
    for (let day = 0; day < DAYS; day++) {
      clock = START + day * DAY;
      const off = GAP.length === 2 && day >= GAP[0] && day <= GAP[1];
      const row: DayRow = {
        day, off, listStart: 0, listEnd: 0, overflow: 0, answered: 0, review: 0, fresh: 0, drill: 0,
        again: 0, practice: 0, dueAfter: 0, owedCards: 0, seen: 0, early: 0,
      };
      let servedToday: string[] = [];
      if (!off) {
        let session = startReviewSession(pool, progress, store, cardDifficulty, clock, { size: PER_DAY, reviewShare: SHARE });
        row.listStart = session.total;
        row.overflow = session.overflow;
        for (let guard = 0; guard < PER_DAY * 3; guard++) {
          const pick = selectSessionQuestion(session, pool, pool, progress, store, cardDifficulty, undefined, clock);
          if (!pick) break;
          const q = pick.question;
          const prevTs = progress.lastAttempt.get(q.id) ?? 0;
          if (prevTs > 0 && SRS.getCorrectStreak(q.id, progress) >= WELL_KNOWN_STREAK) {
            wellKnownServes++;
            const ratio = (clock - prevTs) / DAY / SRS.getEffectiveInterval(q.id, progress, cardDifficulty);
            if (ratio < 1) { earlyServes.push({ id: q.id, ratio }); row.early++; }
          }
          const wasWrong = SRS.latestCorrectness(progress).get(q.id) === false;
          const ok = rng() < (wasWrong ? 0.5 : P_OK);
          const timeSpent = 30_000 + Math.floor(rng() * 60_000);
          clock += timeSpent;
          // Mirror App.handleAnswer.
          const attempt: QuestionAttempt = {
            questionId: q.id, timestamp: clock, isCorrect: ok, attempts: 1, timeSpent, credit: ok ? 1 : 0, hintTierUsed: 0,
          };
          const attemptHistory = [...progress.attemptHistory, attempt];
          const lastAttempt = new Map(progress.lastAttempt);
          lastAttempt.set(q.id, clock);
          const questionsAttempted = new Set(progress.questionsAttempted);
          questionsAttempted.add(q.id);
          const masteredTopics = SRS.updateMasteredTopics({ ...progress, attemptHistory }, q.topic, questions);
          progress = { ...progress, attemptHistory, lastAttempt, questionsAttempted, masteredTopics };
          cardDifficulty = { ...cardDifficulty, [q.id]: nextCardDifficulty(cardDifficulty[q.id] ?? 0, attemptGrade(q, attempt)) };
          store = recordAttempt(store, q, attempt, attemptHistory);
          const before = session;
          session = recordReviewAnswer(session, q.id, ok, pick.kind, familyOf(q)).session;
          row.answered++;
          if (before.queue.some(e => e.id === q.id && e.again)) row.again++;
          else if (pick.kind === 'review') row.review++;
          else if (pick.kind === 'new') row.fresh++;
          else if (pick.kind === 'drill') row.drill++;
          else row.practice++;
        }
        row.listEnd = session.queue.length;
        servedToday = session.served;
      }
      // Families still owed today once the session is over: due, with a card
      // they may serve (not answered today, not a resting well-known card).
      // A family whose only cards rest waits for them and is not owed.
      row.dueAfter = buildReviewList(pool, progress, store, cardDifficulty, clock, 0, servedToday).due;
      row.owedCards = owedCards(progress);
      row.seen = progress.questionsAttempted.size;
      rows.push(row);
    }
  } finally {
    nowSpy.mockRestore();
    Math.random = realRandom;
  }

  // Replaying the history the simulation wrote gives the same schedule it built live.
  const replayed = replayHistory(progress.attemptHistory, byId);
  const replayMatches = JSON.stringify(replayed) === JSON.stringify(store);

  const cap = todayReviewCap(PER_DAY, SHARE);
  const lines: string[] = [];
  lines.push(`course=${course} pool=${pool.length} days=${DAYS} session=${PER_DAY} reviewCap=${cap} pOk=${P_OK} gap=${GAP.join('-') || 'none'} seed=${env.SEED || 7}${env.REAL_STATE ? ` realState=${env.REAL_STATE}` : ''}`);
  lines.push('');
  lines.push('| Week | Answers | New | Drills | Reviews | Re-asks | Review share | List reached 0 | Families still owed after the session (end of week) | Old card-level owed (end of week) |');
  lines.push('|---|---|---|---|---|---|---|---|---|---|');
  for (let w = 0; w * 7 < rows.length; w++) {
    const wk = rows.slice(w * 7, w * 7 + 7);
    const studied = wk.filter(r => !r.off);
    const sum = (k: keyof DayRow) => studied.reduce((s, r) => s + (r[k] as number), 0);
    const answers = sum('answered');
    lines.push(`| ${w + 1} | ${answers} | ${sum('fresh')} | ${sum('drill')} | ${sum('review')} | ${sum('again')} | ${answers ? Math.round(100 * sum('review') / answers) : 0}% | ${studied.filter(r => r.listEnd === 0).length}/${studied.length} days | ${wk[wk.length - 1].dueAfter} | ${wk[wk.length - 1].owedCards} |`);
  }
  lines.push('');
  for (const r of rows) {
    lines.push(r.off
      ? `day ${String(r.day).padStart(2)}: off                                                              due after ${String(r.dueAfter).padStart(3)}  owed cards ${String(r.owedCards).padStart(4)}`
      : `day ${String(r.day).padStart(2)}: list ${String(r.listStart).padStart(2)} -> ${r.listEnd}  overflow ${String(r.overflow).padStart(3)}  answers ${String(r.answered).padStart(2)}  reviews ${String(r.review).padStart(2)}  new ${String(r.fresh).padStart(2)}  drills ${String(r.drill).padStart(2)}  again ${r.again}  practice ${r.practice}  due after ${String(r.dueAfter).padStart(3)}  owed cards ${String(r.owedCards).padStart(4)}  seen ${r.seen}${r.early ? `  EARLY ${r.early}` : ''}`);
  }
  const studied = rows.filter(r => !r.off);
  const steady = studied.filter(r => r.day >= STEADY_FROM);
  lines.push('');
  lines.push(`well-known (streak >= ${WELL_KNOWN_STREAK}) serves: ${wellKnownServes}, early: ${earlyServes.length}`);
  lines.push(`steady state (day ${STEADY_FROM}+): max review share ${Math.max(0, ...steady.map(r => Math.round(100 * r.review / Math.max(1, r.answered))))}%, mean ${Math.round(100 * steady.reduce((s, r) => s + r.review, 0) / Math.max(1, steady.reduce((s, r) => s + r.answered, 0)))}%`);
  lines.push(`days the list reached 0: ${studied.filter(r => r.listEnd === 0).length}/${studied.length}`);
  lines.push(`replay of the written history matches the live schedule: ${replayMatches}`);
  const report = lines.join('\n');
  // eslint-disable-next-line no-console
  console.log(report);
  if (env.OUT) fs.writeFileSync(env.OUT, report + '\n');

  expect(studied.filter(r => r.listEnd !== 0).map(r => r.day)).toEqual([]);
  expect(steady.filter(r => r.review > cap).map(r => r.day)).toEqual([]);
  expect(earlyServes.slice(0, 5)).toEqual([]);
  expect(replayMatches).toBe(true);
  const weeksWithoutNew: number[] = [];
  for (let w = 0; w * 7 < rows.length; w++) {
    const wk = rows.slice(w * 7, w * 7 + 7).filter(r => !r.off);
    if (wk.length >= 4 && wk.reduce((s, r) => s + r.fresh, 0) === 0) weeksWithoutNew.push(w + 1);
  }
  expect(weeksWithoutNew).toEqual([]);
  const backFromGap = (day: number) => GAP.length === 2 && day > GAP[1] && day <= GAP[1] + OWED_RUN_DAYS;
  expect(steady.filter(r => !backFromGap(r.day) && r.dueAfter > cap).map(r => r.day)).toEqual([]);
  const longOwed: number[] = [];
  let owedRun = 0;
  for (const r of steady) {
    owedRun = r.dueAfter > 0 ? owedRun + 1 : 0;
    if (owedRun > OWED_RUN_DAYS) longOwed.push(r.day);
  }
  expect(longOwed).toEqual([]);
});
