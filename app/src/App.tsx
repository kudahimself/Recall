import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Question,
  QuestionType,
  UserProgress,
  UserProfile,
  Course,
  Topic,
  Difficulty,
  MisconceptionStore,
  AnswerMeta,
  QuestionAttempt,
} from './types';
import { questions } from './data/questions';
import {
  SpacedRepetitionSystem,
  RECENT_WINDOW,
  pct,
  recentAttempts,
  ConceptSelectionContext,
  FSRS_STORE_KEY,
  TODAY_REVIEW_SHARE_KEY,
  TODAY_SESSION_KEY,
  TODAY_SIZE_KEY,
  LESSONS_KEY,
} from './utils/spacedRepetition';
import { attemptGrade, FsrsStore, loadOrRebuild, recordAttempt, replayHistory } from './utils/familySchedule';
import { seedMasteredTopics } from './utils/masteryMigration';
import {
  ReviewSession,
  ServedKind,
  SessionPick,
  continueSession,
  familyOf,
  isSessionCurrent,
  isSessionDone,
  loadSessionSettings,
  parseStoredSessions,
  recordReviewAnswer,
  reviewsLeft,
  selectSessionQuestion,
  serializeSessions,
  startReviewSession,
} from './utils/reviewSession';
import { SessionSummary } from './components/SessionSummary';
import { LessonSteps, RuleCardOverlay, RuleCardPanel, RuleCardView, TopicPanel, TopicStats } from './components/RuleCard';
import { useMediaQuery } from './utils/useMediaQuery';
import { QuizBar, SessionStatus } from './components/QuizBar';
import { Button } from './components/ui/Button';
import { focusAnswerStart, QuestionNav, QuestionNavContext } from './components/ui/QuestionShell';
import { ShortcutHelp } from './keyboard/ShortcutHelp';
import { useShortcut } from './keyboard/shortcuts';
import {
  LessonsDone,
  getLesson,
  isTopicLessonMet,
  lessonContext,
  lessonGateFor,
  lessonsForTopic,
  nextLessonExercise,
  parseLessonsDone,
  rampAfterLessonNote,
} from './utils/lessons';
import {
  EXERCISES_KEY,
  ExercisesDone,
  getExercise,
  parseExercisesDone,
  toggleExerciseDone,
} from './utils/exercises';
import { SessionSettings } from './utils/reviewSession';
import { applyReview, ConceptProgress, fsrsInitDifficulty, fsrsNextDifficulty } from './utils/conceptSRS';
import {
  migrateProgressToConcepts,
  rebackfillConceptProgress,
  buildQuestionConceptIndex,
} from './utils/conceptMigration';
import { BACKEND_CONCEPTS, WEBDEV_CONCEPTS, DATABRICKS_CONCEPTS } from './utils/conceptRegistry';
import { isFeatureEnabled } from './utils/featureFlags';
import './utils/resetProgressFromTopic';
import {
  ProgressLoad,
  PROGRESS_KEY,
  loadProgressFrom,
  listBackupKeys,
  PROGRESS_BACKUP_PREFIX,
  PRE_IMPORT_BACKUP_KEY,
  isBackupKey,
  STORED_SETTING_KEYS,
  ProgressSummary,
  summarizeStoredProgress,
  backupBeforeImport,
  studyWritesBlocked,
  serializeProgress,
  safeSetItem,
  buildExport,
  validateExport,
  applyImport,
  downloadTextFile,
  readFileText,
  reloadPage,
} from './utils/progressStorage';
import { getCourseForTopic, getTopicPlace } from './utils/courseConfig';
import { COURSE_META } from './utils/courseMeta';
import { buildCoursePath, courseTotals, focusAreas } from './utils/coursePath';
import { MultipleChoiceQuestion } from './components/MultipleChoiceQuestion';
import { CodingQuestion } from './components/CodingQuestion';
import { ParsonsQuestion } from './components/ParsonsQuestion';
import { PredictOutputQuestion } from './components/PredictOutputQuestion';
import { ClozeCodeQuestion } from './components/ClozeCodeQuestion';
import { PredictOutcomeQuestion } from './components/PredictOutcomeQuestion';
import { ChooseJustifyQuestion } from './components/ChooseJustifyQuestion';
import { SpotFlawQuestion } from './components/SpotFlawQuestion';
import { ExplainQuestion } from './components/ExplainQuestion';
import { sampleFromSearch } from './dev/sampleQuestions';
import { activityByDay } from './components/ui/Heatmap';
import { activeFilterCount, allFilters, filterQuestions, FilterOptions, parseFilters, serializeFilters } from './utils/questionFilters';
import { FilterDialog } from './components/FilterDialog';
import { LESSONS } from './data/lessons';
import { TopBar } from './components/shell/TopBar';
import { NavRail, NavView } from './components/shell/NavRail';
import { HomeView } from './components/home/HomeView';
import { SettingsView } from './components/settings/SettingsView';
import { ProgressTab, ProgressView } from './components/progress/ProgressView';
import './App.css';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Per-concept beta values from the registry, flattened for fast lookup. */
const CONCEPT_BETAS: Record<string, number> = (() => {
  const o: Record<string, number> = {};
  for (const c of [...BACKEND_CONCEPTS, ...WEBDEV_CONCEPTS, ...DATABRICKS_CONCEPTS]) {
    if (c.beta !== undefined) o[c.id] = c.beta;
  }
  return o;
})();

type ViewMode = 'quiz' | 'progress' | 'home' | 'settings' | 'filter';

const STORAGE_KEYS = {
  progress: PROGRESS_KEY,
  profile: 'recall-profile',
  filters: 'recall-filters',
  activeCourse: 'recall-active-course',
  misconceptions: 'recall-misconceptions',
  conceptProgress: 'recall-concept-progress',
  cardDifficulty: 'recall-card-difficulty',
  conceptMigrationVersion: 'recall-concept-migration-version',
  fsrs: FSRS_STORE_KEY,
  todaySession: TODAY_SESSION_KEY,
  lessons: LESSONS_KEY,
  exercises: EXERCISES_KEY,
};

// Bump when concept tags are added to existing questions, so previously-
// computed concept progress gets rebackfilled against the latest tags.
// '1' = original one-shot migration (loadConceptProgress fallback).
// '2' = rebackfill credits historical attempts to concepts whose tags were
//        added after the initial migration ran (interpreted-language fix).
// '3' = singleton-concept consolidation (scripts/consolidate-concepts.js): the
//        Databricks compute-admin / storage-repos topics had ~one unique concept
//        per question, so 38 hyper-specific ids folded into the broader concepts
//        they were facets of. The rebackfill re-credits history to the surviving
//        ids; state stranded on a retired id is simply no longer read.
const CONCEPT_MIGRATION_VERSION = '3';

const LEGACY_STORAGE_KEYS = {
  progress: 'databricks-progress',
  profile: 'databricks-profile',
  filters: 'databricks-filters',
  activeCourse: 'databricks-active-course',
  misconceptions: 'databricks-misconceptions',
};

// One-shot migration: copy `databricks-*` keys to `recall-*` if the new keys
// don't exist yet. Legacy keys are left in place as a rollback safety net.
(function migrateLegacyStorage() {
  try {
    (Object.keys(LEGACY_STORAGE_KEYS) as Array<keyof typeof LEGACY_STORAGE_KEYS>).forEach(k => {
      if (localStorage.getItem(STORAGE_KEYS[k]) === null) {
        const legacy = localStorage.getItem(LEGACY_STORAGE_KEYS[k]);
        if (legacy !== null) localStorage.setItem(STORAGE_KEYS[k], legacy);
      }
    });
  } catch {
    // localStorage unavailable / quota / privacy mode — non-fatal.
  }
})();

function loadMisconceptions(): MisconceptionStore {
  const saved = localStorage.getItem(STORAGE_KEYS.misconceptions);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return { events: Array.isArray(parsed.events) ? parsed.events : [] };
    } catch {
      // Corrupted store; reset.
    }
  }
  return { events: [] };
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function describeProgress(summary: ProgressSummary): string {
  if (!summary.readable) return 'saved data that could not be read';
  const answers = `${summary.answers} answer${summary.answers === 1 ? '' : 's'}`;
  if (summary.lastAnsweredAt === null) return answers;
  return `${answers}, the last on ${new Date(summary.lastAnsweredAt).toISOString().split('T')[0]}`;
}

function loadProfile(): UserProfile {
  const defaults: UserProfile = {
    lastActiveDate: '',
    totalSessions: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalTimeSpentMs: 0,
    savedFilters: null,
  };
  const saved = localStorage.getItem(STORAGE_KEYS.profile);
  if (saved) {
    try {
      return { ...defaults, ...JSON.parse(saved) };
    } catch {
      // Corrupted store; use defaults.
    }
  }
  return defaults;
}

function loadActiveCourse(): Course {
  const saved = localStorage.getItem(STORAGE_KEYS.activeCourse);
  if (saved && (Object.values(Course) as string[]).includes(saved)) {
    return saved as Course;
  }
  return Course.DATABRICKS;
}

/** Below 768 px the rail is an overlay drawer (NavigationRail.css), closed until asked for. */
function isNarrowScreen(): boolean {
  return !!window.matchMedia?.('(max-width: 767px)').matches;
}

function loadProgress(): ProgressLoad {
  return loadProgressFrom(
    localStorage,
    new Set(questions.map(q => q.id)),
    history => seedMasteredTopics(questions, history),
  );
}

/**
 * Load concept-level progress, migrating from legacy `progress` if the
 * concept-progress key is empty. The migration is idempotent and runs
 * unconditionally — concept progress is cheap to maintain (≈few KB) and
 * the feature flag only gates whether the SRS *uses* it for selection.
 */
function loadConceptProgress(progress: UserProgress, canWrite: boolean): ConceptProgress {
  let existing: ConceptProgress | null = null;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.conceptProgress);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') existing = parsed as ConceptProgress;
    }
  } catch {
    /* corrupted store — fall through to fresh migration */
  }

  if (existing === null) {
    // First time: original one-shot migration.
    if (canWrite) safeSetItem(localStorage, STORAGE_KEYS.conceptMigrationVersion, CONCEPT_MIGRATION_VERSION);
    return migrateProgressToConcepts(progress, questions);
  }

  // Already migrated once. If the migration version moved on, replay history
  // against current tags so newly-tagged concepts get historical credit.
  const storedVersion = localStorage.getItem(STORAGE_KEYS.conceptMigrationVersion);
  if (storedVersion !== CONCEPT_MIGRATION_VERSION) {
    const idx = buildQuestionConceptIndex(questions);
    const betas: Record<string, number> = {};
    for (const c of [...BACKEND_CONCEPTS, ...WEBDEV_CONCEPTS, ...DATABRICKS_CONCEPTS]) {
      if (c.beta !== undefined) betas[c.id] = c.beta;
    }
    const rebackfilled = rebackfillConceptProgress(existing, progress.attemptHistory, idx, betas);
    if (canWrite) safeSetItem(localStorage, STORAGE_KEYS.conceptMigrationVersion, CONCEPT_MIGRATION_VERSION);
    return rebackfilled;
  }

  return existing;
}

const QUESTIONS_BY_ID = new Map(questions.map(q => [q.id, q]));

/**
 * The card-family schedule (`recall-fsrs`). Rebuilt from attemptHistory when
 * the key is missing, unreadable, an older schema, or built from a different
 * history (an import, or another tab's answers); the rebuild is written back
 * through safeSetItem. The older recall-progress, recall-card-difficulty and
 * recall-concept-progress keys are kept and still updated, so this change can
 * be rolled back.
 */
function loadFsrsStore(progress: UserProgress, canWrite: boolean): FsrsStore {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEYS.fsrs);
  } catch { /* unreadable storage: rebuild in memory */ }
  const { store, rebuilt } = loadOrRebuild(raw, progress, QUESTIONS_BY_ID);
  if (rebuilt && canWrite) safeSetItem(localStorage, STORAGE_KEYS.fsrs, JSON.stringify(store));
  return store;
}

/** Today's sessions that belong to today, so a reload resumes them. */
function loadTodaySessions(): Partial<Record<Course, ReviewSession>> {
  try {
    return parseStoredSessions(localStorage.getItem(STORAGE_KEYS.todaySession));
  } catch {
    return {};
  }
}

/** Completed lessons (`recall-lessons`); unreadable text gives none, and credit from history still applies. */
function loadLessonsDone(): LessonsDone {
  try {
    return parseLessonsDone(localStorage.getItem(STORAGE_KEYS.lessons));
  } catch {
    return {};
  }
}

/** Exercises ticked done (`recall-exercises`); unreadable text gives none. */
function loadExercisesDone(): ExercisesDone {
  try {
    return parseExercisesDone(localStorage.getItem(STORAGE_KEYS.exercises));
  } catch {
    return {};
  }
}

/** A lesson in progress: its rule card on screen, or its exercises being served in order. */
interface LessonFlow {
  lessonId: string;
  course: Course;
  stage: 'card' | 'exercise';
}

/** Per-card FSRS difficulty (1–10, 0=uninitialized). Persisted alongside concept progress. */
function loadCardDifficulty(): Record<string, number> {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.cardDifficulty);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') return parsed as Record<string, number>;
    }
  } catch { /* corrupted store */ }
  return {};
}

/**
 * Catches render-time crashes inside the active question component so a single
 * malformed question doesn't take down the whole quiz pane. The user can skip
 * the bad question and keep going.
 */
class QuestionErrorBoundary extends React.Component<
  { onSkip: () => void; children: React.ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Question render crashed:', error, info);
  }
  componentDidUpdate(prev: { children: React.ReactNode }) {
    // Reset after a successful skip — child key change means new content,
    // give it a chance to render before we re-show the error.
    if (prev.children !== this.props.children && this.state.error) {
      this.setState({ error: null });
    }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="quiz-message">
          <h3>This question hit a snag.</h3>
          <p>We couldn't render it. Skip to the next one: your progress is safe.</p>
          <Button variant="primary" onClick={() => { this.setState({ error: null }); this.props.onSkip(); }}>
            Skip question
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [activeCourse, setActiveCourse] = useState<Course>(loadActiveCourse);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  // Read progress once. `orphans` holds history for ids this build does not
  // know; it is written back untouched so that history is never lost.
  const [initialLoad] = useState<ProgressLoad>(loadProgress);
  const orphansRef = useRef(initialLoad.orphans);
  const [progress, setProgress] = useState<UserProgress>(initialLoad.progress);
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [filters, setFilters] = useState<FilterOptions>(() => parseFilters(localStorage.getItem(STORAGE_KEYS.filters)));
  const [misconceptions, setMisconceptions] = useState<MisconceptionStore>(loadMisconceptions);
  const [conceptProgress, setConceptProgress] = useState<ConceptProgress>(
    () => loadConceptProgress(initialLoad.progress, !studyWritesBlocked(initialLoad)),
  );
  const [cardDifficulty, setCardDifficulty] = useState<Record<string, number>>(loadCardDifficulty);
  const [fsrsStore, setFsrsStore] = useState<FsrsStore>(
    () => loadFsrsStore(initialLoad.progress, !studyWritesBlocked(initialLoad)),
  );
  const [sessionSettings, setSessionSettings] = useState(loadSessionSettings);
  // Lessons (utils/lessons): completed lessons, the lesson in progress, the
  // rule card reopened in full (R), and whether the side panel is hidden.
  const [initialLessonsDone] = useState<LessonsDone>(loadLessonsDone);
  const [lessonsDone, setLessonsDone] = useState<LessonsDone>(initialLessonsDone);
  const [lessonFlow, setLessonFlow] = useState<LessonFlow | null>(null);
  const [ruleCardOpen, setRuleCardOpen] = useState<string | null>(null);
  // The column beside a question (its rule card, or the topic when it has
  // none): 'auto' shows it on a wide screen and leaves a laptop's width to the
  // question; Hide and Show pin it either way.
  const [rulePanelPref, setRulePanelPref] = useState<'auto' | 'shown' | 'hidden'>('auto');
  const wideScreen = useMediaQuery('(min-width: 1400px)', true);
  // Exercises (utils/exercises): the ones the learner ticked done.
  const [initialExercisesDone] = useState<ExercisesDone>(loadExercisesDone);
  const [exercisesDone, setExercisesDone] = useState<ExercisesDone>(initialExercisesDone);
  // The card on screen already had its first failed coding submit recorded as
  // a miss (decision 7); its terminal answer is then a `retry` attempt.
  const firstMissRecordedRef = useRef<string | null>(null);

  // Development only: `?sample=<id>` shows one of src/dev/sampleQuestions.ts
  // in the quiz view, for screenshots and trying a question type by hand.
  const [devSample] = useState(() => sampleFromSearch(window.location.search));

  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [sessionStartTime] = useState(Date.now());
  const [sessionStats, setSessionStats] = useState({ answered: 0, correct: 0 });
  // Today's session per course (utils/reviewSession), stored so a reload the
  // same day resumes it; a new day builds a new one from progress.
  const [reviewSessions, setReviewSessions] = useState<Partial<Record<Course, ReviewSession>>>(loadTodaySessions);
  // How the card on screen was served: from today's review list, unseen, or a
  // seen card outside the list (extra practice that does not move the count).
  const [servedKind, setServedKind] = useState<ServedKind>('new');
  // True after a miss put the card back in today's list, until the next card.
  const [reaskShown, setReaskShown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(isNarrowScreen);
  const [activeProgressTab, setActiveProgressTab] = useState<ProgressTab>('overview');
  // The topic selected on Progress → Topics, kept while the learner drills it and comes back.
  const [progressTopic, setProgressTopic] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  // ── Persistence guards ──
  // Unreadable stored progress with no backup copy: study-record writes stay off
  // for this session so the only copy is never replaced by the empty in-memory
  // state. Once a backup exists, saving resumes from a fresh start.
  const progressWritesBlocked = studyWritesBlocked(initialLoad);
  // Another tab saved answers after this one loaded: this tab's copy is stale,
  // so it stops writing rather than overwrite them (last writer never clobbers).
  const [staleTab, setStaleTab] = useState(false);
  const staleTabRef = useRef(false);
  // Keys whose last write failed, with the browser's error.
  const [writeErrors, setWriteErrors] = useState<Record<string, string>>({});
  const [importError, setImportError] = useState<string | null>(null);
  const [backupKeys] = useState<string[]>(() => {
    try {
      return listBackupKeys(localStorage);
    } catch {
      return [];
    }
  });
  const unreadableBackupCount = backupKeys.filter(isBackupKey).length;
  const [backupNoticeDismissed, setBackupNoticeDismissed] = useState(false);
  const importingRef = useRef(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  // kind 'study' = answer-bearing record; 'session' = streak/time; 'ui' = view prefs.
  const persist = useCallback((key: string, value: string, kind: 'study' | 'session' | 'ui') => {
    if (importingRef.current) return;
    if (kind !== 'ui' && staleTabRef.current) return;
    if (kind === 'study' && progressWritesBlocked) return;
    const result = safeSetItem(localStorage, key, value);
    setWriteErrors(prev => {
      if (result.ok) {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      }
      const message = result.quotaExceeded ? 'browser storage is full' : result.error;
      return prev[key] === message ? prev : { ...prev, [key]: message };
    });
  }, [progressWritesBlocked]);

  useEffect(() => {
    const watched = new Set<string>([
      STORAGE_KEYS.progress,
      STORAGE_KEYS.conceptProgress,
      STORAGE_KEYS.cardDifficulty,
      STORAGE_KEYS.misconceptions,
      STORAGE_KEYS.fsrs,
      STORAGE_KEYS.lessons,
      STORAGE_KEYS.exercises,
    ]);
    const onStorage = (e: StorageEvent) => {
      // key === null means another tab cleared storage.
      if (e.key !== null && !watched.has(e.key)) return;
      staleTabRef.current = true;
      setStaleTab(true);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Change view at once: no exit animation to wait for.
  const changeView = useCallback((newView: ViewMode) => {
    setViewMode(newView);
  }, []);

  // Filter questions by active course
  const courseQuestions = useMemo(() => {
    return questions.filter(q => getCourseForTopic(q.topic) === activeCourse);
  }, [activeCourse]);

  // Concept-aware context for the review list's concept-bucket ordering.
  // Undefined when the feature flag is off: the buckets then play no part.
  const conceptCtx = useMemo<ConceptSelectionContext | undefined>(() => {
    if (!isFeatureEnabled('conceptSrsEnabled')) return undefined;
    return { progress: conceptProgress, betas: CONCEPT_BETAS };
  }, [conceptProgress]);

  // Today's review session for a course: the current one, or a new list built
  // now from that course's whole pool (filters only narrow what is served).
  const reviewSessionFor = useCallback((course: Course): ReviewSession => {
    const existing = reviewSessions[course];
    if (isSessionCurrent(existing)) return existing;
    const pool = questions.filter(q => getCourseForTopic(q.topic) === course);
    return startReviewSession(pool, progress, fsrsStore, cardDifficulty, Date.now(), sessionSettings, conceptCtx);
  }, [reviewSessions, progress, fsrsStore, cardDifficulty, sessionSettings, conceptCtx]);

  // Put a picked card on screen and remember how it was served, for the pill.
  const serveQuestion = useCallback((pick: SessionPick | null) => {
    setCurrentQuestion(pick ? pick.question : null);
    setServedKind(pick ? pick.kind : 'new');
    firstMissRecordedRef.current = null;
    setReaskShown(false);
    setQuestionStartTime(Date.now());
  }, []);

  // The lesson gate (utils/lessons). A lesson in progress serves its rule card,
  // then its next unanswered exercise, before anything else. Otherwise an
  // unseen card whose topic's lesson is not met opens that lesson's rule card
  // instead; the card itself is left for the session to serve again after the
  // lesson. Exercises are answered through handleAnswer like any new card.
  // Filters only decide which cards trigger a lesson; an open lesson serves its full exercise list.
  const serveWithLessons = useCallback((pick: SessionPick | null, course: Course, flow: LessonFlow | null) => {
    const lesson = flow && flow.course === course ? getLesson(flow.lessonId) : undefined;
    if (flow && lesson) {
      if (flow.stage === 'card') {
        setLessonFlow(flow);
        serveQuestion(null);
        return;
      }
      const exercise = nextLessonExercise(lesson, progress.questionsAttempted, QUESTIONS_BY_ID);
      if (exercise) {
        setLessonFlow(flow);
        serveQuestion({ question: exercise, kind: 'new' });
        return;
      }
    }
    const gate = pick ? lessonGateFor(pick.question, lessonsDone, progress.questionsAttempted) : null;
    if (gate) {
      setLessonFlow({ lessonId: gate.id, course, stage: 'card' });
      serveQuestion(null);
      return;
    }
    setLessonFlow(null);
    serveQuestion(pick);
  }, [serveQuestion, progress.questionsAttempted, lessonsDone]);

  // A dev sample (?sample=<id>) opens straight on the quiz view.
  useEffect(() => {
    if (!devSample) return;
    setActiveCourse(getCourseForTopic(devSample.topic));
    serveQuestion({ question: devSample, kind: 'practice' });
    setViewMode('quiz');
  }, [devSample, serveQuestion]);

  // Update streak & session count on first load
  useEffect(() => {
    const today = getToday();
    setProfile(prev => {
      const updated = { ...prev };

      if (prev.lastActiveDate !== today) {
        // New day - update streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (prev.lastActiveDate === yesterdayStr) {
          updated.currentStreak = prev.currentStreak + 1;
        } else if (prev.lastActiveDate === '') {
          updated.currentStreak = 1;
        } else {
          updated.currentStreak = 1; // streak broken
        }

        updated.longestStreak = Math.max(updated.longestStreak, updated.currentStreak);
        updated.lastActiveDate = today;
        updated.totalSessions = prev.totalSessions + 1;
      }

      return updated;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save progress. Skipped for the state just read from storage (nothing
  // changed), so merely opening the app never rewrites the record.
  useEffect(() => {
    if (progress === initialLoad.progress) return;
    persist(STORAGE_KEYS.progress, serializeProgress(progress, orphansRef.current), 'study');
  }, [progress, initialLoad.progress, persist]);

  // Save profile
  useEffect(() => {
    persist(STORAGE_KEYS.profile, JSON.stringify(profile), 'session');
  }, [profile, persist]);

  // Save filters
  useEffect(() => {
    persist(STORAGE_KEYS.filters, serializeFilters(filters), 'ui');
  }, [filters, persist]);

  // Save misconception telemetry
  useEffect(() => {
    persist(STORAGE_KEYS.misconceptions, JSON.stringify(misconceptions), 'study');
  }, [misconceptions, persist]);

  // Save concept progress. Loaded unconditionally; the feature flag only
  // gates whether the SRS reads from it for selection.
  useEffect(() => {
    persist(STORAGE_KEYS.conceptProgress, JSON.stringify(conceptProgress), 'study');
  }, [conceptProgress, persist]);

  // Save per-card FSRS difficulty.
  useEffect(() => {
    persist(STORAGE_KEYS.cardDifficulty, JSON.stringify(cardDifficulty), 'study');
  }, [cardDifficulty, persist]);

  useEffect(() => {
    persist(STORAGE_KEYS.fsrs, JSON.stringify(fsrsStore), 'study');
  }, [fsrsStore, persist]);

  useEffect(() => {
    persist(STORAGE_KEYS.todaySession, serializeSessions(reviewSessions), 'session');
  }, [reviewSessions, persist]);

  // Save completed lessons; not for the state just read, so opening the app writes nothing.
  useEffect(() => {
    if (lessonsDone === initialLessonsDone) return;
    persist(STORAGE_KEYS.lessons, JSON.stringify(lessonsDone), 'study');
  }, [lessonsDone, initialLessonsDone, persist]);

  // Save ticked exercises; likewise not for the state just read.
  useEffect(() => {
    if (exercisesDone === initialExercisesDone) return;
    persist(STORAGE_KEYS.exercises, JSON.stringify(exercisesDone), 'study');
  }, [exercisesDone, initialExercisesDone, persist]);

  const toggleExercise = useCallback((id: string) => {
    setExercisesDone(prev => toggleExerciseDone(prev, id));
  }, []);

  useEffect(() => {
    persist(TODAY_SIZE_KEY, String(sessionSettings.size), 'ui');
    persist(TODAY_REVIEW_SHARE_KEY, String(sessionSettings.reviewShare), 'ui');
  }, [sessionSettings, persist]);

  // New session settings apply at once to every session not yet started (it
  // is rebuilt); a session already under way keeps its plan until tomorrow.
  const changeSessionSettings = useCallback((next: SessionSettings) => {
    setSessionSettings(next);
    setReviewSessions(prev => {
      const kept = Object.fromEntries(Object.entries(prev).filter(([, sess]) => sess && sess.answered > 0));
      return Object.keys(kept).length === Object.keys(prev).length ? prev : kept;
    });
  }, []);

  const handleMisconception = useCallback((tag: string, questionId: string) => {
    setMisconceptions(prev => ({
      events: [...prev.events, { tag, questionId, timestamp: Date.now() }],
    }));
  }, []);

  // Save active course so the home/welcome view reflects the last-used course
  useEffect(() => {
    persist(STORAGE_KEYS.activeCourse, activeCourse, 'ui');
  }, [activeCourse, persist]);

  // ── Export / import ──
  // A stale tab holds older answers than storage, and a blocked unreadable load
  // holds nothing; exporting either and re-importing it would replace newer progress.
  const canExport = !progressWritesBlocked && !staleTab;
  // The export is built from in-memory state, which is at least as new as
  // storage (a failed write leaves memory ahead), plus the orphaned history.
  const exportProgress = () => {
    const text = buildExport({
      [STORAGE_KEYS.progress]: serializeProgress(progress, orphansRef.current),
      [STORAGE_KEYS.profile]: JSON.stringify(profile),
      [STORAGE_KEYS.filters]: serializeFilters(filters),
      [STORAGE_KEYS.activeCourse]: activeCourse,
      [STORAGE_KEYS.misconceptions]: JSON.stringify(misconceptions),
      [STORAGE_KEYS.conceptProgress]: JSON.stringify(conceptProgress),
      [STORAGE_KEYS.cardDifficulty]: JSON.stringify(cardDifficulty),
      [STORAGE_KEYS.fsrs]: JSON.stringify(fsrsStore),
      [STORAGE_KEYS.todaySession]: serializeSessions(reviewSessions),
      // Unchanged since load: exactly what is stored (nothing, for a learner without lessons yet).
      [STORAGE_KEYS.lessons]: lessonsDone === initialLessonsDone
        ? localStorage.getItem(STORAGE_KEYS.lessons)
        : JSON.stringify(lessonsDone),
      [STORAGE_KEYS.exercises]: exercisesDone === initialExercisesDone
        ? localStorage.getItem(STORAGE_KEYS.exercises)
        : JSON.stringify(exercisesDone),
      [STORAGE_KEYS.conceptMigrationVersion]: CONCEPT_MIGRATION_VERSION,
      ...Object.fromEntries(STORED_SETTING_KEYS.map(k => [k, localStorage.getItem(k)])),
      ...Object.fromEntries(listBackupKeys(localStorage).filter(isBackupKey).map(k => [k, localStorage.getItem(k)])),
    });
    downloadTextFile(`recall-progress-${getToday()}.json`, text);
  };

  const importProgress = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (importInputRef.current) importInputRef.current.value = '';
    if (!file) return;
    let text: string;
    try {
      text = await readFileText(file);
    } catch (e) {
      setImportError(`Import refused: could not read the file (${String(e)}). Nothing was changed.`);
      return;
    }
    const check = validateExport(text);
    if (!check.ok) {
      setImportError(`Import refused: ${check.error}. Nothing was changed.`);
      return;
    }
    // Progress already in this browser is replaced only with consent, and only
    // once a copy of it is kept. A browser with no answers yet is simply filled.
    const current = summarizeStoredProgress(localStorage);
    if (current !== null) {
      const when = check.file.exportedAt ? `, exported ${check.file.exportedAt},` : '';
      if (!window.confirm(
        `This browser already has Recall progress: ${describeProgress(current)}.\n\n` +
        `Importing ${file.name}${when} replaces it with ${describeProgress(check.summary)}.\n\n` +
        'A backup of the current progress is kept in this browser first. Replace it?',
      )) return;
      const backup = backupBeforeImport(localStorage);
      if (!backup.ok) {
        const reason = backup.quotaExceeded ? 'browser storage is full' : backup.error;
        setImportError(`Import refused: the current progress could not be backed up first (${reason}). Nothing was changed.`);
        return;
      }
    }
    // Stop this tab's save effects from writing its old state over the import.
    importingRef.current = true;
    const result = applyImport(localStorage, check.file);
    if (!result.ok) {
      importingRef.current = false;
      const reason = result.quotaExceeded ? 'browser storage is full' : result.error;
      setImportError(`Import failed (${reason}). Your previous progress was restored.`);
      return;
    }
    reloadPage();
  };

  // Track session time on unmount / visibility change
  useEffect(() => {
    const saveSessionTime = () => {
      const elapsed = Date.now() - sessionStartTime;
      setProfile(prev => ({
        ...prev,
        totalTimeSpentMs: prev.totalTimeSpentMs + elapsed,
      }));
    };

    window.addEventListener('beforeunload', saveSessionTime);
    return () => window.removeEventListener('beforeunload', saveSessionTime);
  }, [sessionStartTime]);

  const getFilteredQuestions = useCallback(
    (): Question[] => filterQuestions(courseQuestions, filters),
    [filters, courseQuestions],
  );

  // Bumped every time we ask for a new question. Used as a render key on the
  // question component so even when the SRS picks the SAME question reference
  // (small concept pools, edge cases) the child remounts with fresh state —
  // otherwise the child's `isSubmitted=true` from the just-answered question
  // persists and the UI looks frozen ("Next button doesn't work").
  const [questionLoadCount, setQuestionLoadCount] = useState(0);

  // Drill mode (Drill / Review weak topic on Progress): practice on the chosen
  // topics past today's bound. Held here only; today's session is never changed.
  const [drilling, setDrilling] = useState(false);
  const selectFor = useCallback((session: ReviewSession, servePool: Question[], coursePool: Question[], drill: boolean) => {
    const pick = selectSessionQuestion(drill ? continueSession(session) : session, servePool, coursePool, progress, fsrsStore, cardDifficulty, conceptCtx);
    return pick && drill && !session.queue.some(e => e.id === pick.question.id) ? { ...pick, kind: 'practice' as const } : pick;
  }, [progress, fsrsStore, cardDifficulty, conceptCtx]);

  const loadNextQuestion = useCallback(() => {
    const filteredQuestions = getFilteredQuestions();
    const session = reviewSessionFor(activeCourse);
    if (session !== reviewSessions[activeCourse]) {
      setReviewSessions(prev => ({ ...prev, [activeCourse]: session }));
    }
    const next = selectFor(session, filteredQuestions, courseQuestions, drilling);
    serveWithLessons(next, activeCourse, lessonFlow);
    setQuestionLoadCount(c => c + 1);
  }, [getFilteredQuestions, reviewSessionFor, reviewSessions, activeCourse, courseQuestions, selectFor, drilling, serveWithLessons, lessonFlow]);

  const applyFiltersAndLoadQuestion = useCallback((newFilters: FilterOptions, drill = false) => {
    setFilters(newFilters);
    setDrilling(drill);
    const filtered = filterQuestions(courseQuestions, newFilters);
    const session = reviewSessionFor(activeCourse);
    if (session !== reviewSessions[activeCourse]) {
      setReviewSessions(prev => ({ ...prev, [activeCourse]: session }));
    }
    const next = selectFor(session, filtered, courseQuestions, drill);
    // New filters end a lesson in progress; the gate still applies to what they serve.
    serveWithLessons(next, activeCourse, null);
  }, [courseQuestions, reviewSessionFor, reviewSessions, activeCourse, selectFor, serveWithLessons]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    applyFiltersAndLoadQuestion(newFilters);
  };

  const resetFilters = () => {
    applyFiltersAndLoadQuestion(allFilters());
  };

  // From the progress dashboard: filter down to one weak category's topics
  // and drop straight into practice on them (drill mode).
  const handleReviewWeakTopic = useCallback((topicKeys: string[]) => {
    applyFiltersAndLoadQuestion({ ...allFilters(), topics: topicKeys as Topic[] }, true);
    changeView('quiz');
  }, [applyFiltersAndLoadQuestion, changeView]);

  const handleAnswer = (isCorrect: boolean, meta?: AnswerMeta) => {
    if (!currentQuestion) return;
    // A dev sample (?sample=<id>) is shown, never recorded.
    if (devSample && currentQuestion.id === devSample.id) return;

    const timeSpent = Date.now() - questionStartTime;

    // Partial credit. Credit is the single source of truth for mastery math;
    // the boolean stays for legacy scoring/session stats. A component that
    // grades its own credit (choose and justify, explain) passes it in meta;
    // otherwise it comes from the hint tier (coding only): no meta => tier 0 =>
    // credit is exactly `isCorrect ? 1 : 0`, preserving prior behavior.
    const hintTierUsed = meta?.hintTierUsed ?? 0;
    const attemptCount = meta?.attempts ?? 1;
    const creditSchedule = SpacedRepetitionSystem.getHintCreditSchedule(
      currentQuestion.id,
      currentQuestion.topic,
      progress,
    );
    const credit = meta?.credit ?? (isCorrect ? creditSchedule[hintTierUsed] : 0);

    // Create truly new references so React detects the change
    const newQuestionsAttempted = new Set(progress.questionsAttempted);
    newQuestionsAttempted.add(currentQuestion.id);

    const newCorrectAnswers = new Set(progress.correctAnswers);
    if (isCorrect) {
      newCorrectAnswers.add(currentQuestion.id);
    }

    const newTopicScores = new Map(progress.topicScores);
    const topicScore = { ...(newTopicScores.get(currentQuestion.topic) || { correct: 0, total: 0 }) };
    topicScore.total += 1;
    if (isCorrect) topicScore.correct += 1;
    newTopicScores.set(currentQuestion.topic, topicScore);

    const newDifficultyScores = new Map(progress.difficultyScores);
    const difficultyScore = { ...(newDifficultyScores.get(currentQuestion.difficulty) || { correct: 0, total: 0 }) };
    difficultyScore.total += 1;
    if (isCorrect) difficultyScore.correct += 1;
    newDifficultyScores.set(currentQuestion.difficulty, difficultyScore);

    // After a first failed coding submit was recorded as the miss, this
    // terminal answer is a retry: it counts for accuracy and coverage but is
    // not a second review of the card's family.
    const attempt: QuestionAttempt = {
      questionId: currentQuestion.id,
      timestamp: Date.now(),
      isCorrect,
      attempts: attemptCount,
      timeSpent,
      credit,
      hintTierUsed,
      ...(firstMissRecordedRef.current === currentQuestion.id ? { retry: true } : {}),
    };
    const newAttemptHistory = [...progress.attemptHistory, attempt];

    const newLastAttempt = new Map(progress.lastAttempt);
    newLastAttempt.set(currentQuestion.id, Date.now());

    // Grant sticky mastery for any unlock scope this answer just completed.
    // Computed against the new history so this answer counts; the set only
    // ever grows, so a same-reference return means nothing changed.
    // The topic opens the next one only once its lesson is met as well.
    const newMasteredTopics = SpacedRepetitionSystem.updateMasteredTopics(
      { ...progress, attemptHistory: newAttemptHistory },
      currentQuestion.topic,
      questions,
      topic => isTopicLessonMet(topic, lessonsDone, newQuestionsAttempted),
    );

    const newProgress: UserProgress = {
      questionsAttempted: newQuestionsAttempted,
      correctAnswers: newCorrectAnswers,
      topicScores: newTopicScores,
      difficultyScores: newDifficultyScores,
      attemptHistory: newAttemptHistory,
      lastAttempt: newLastAttempt,
      repetitionQueue: progress.repetitionQueue,
      masteredTopics: newMasteredTopics,
    };

    setProgress(newProgress);
    const answered = currentQuestion;
    setFsrsStore(prev => recordAttempt(prev, answered, attempt, newAttemptHistory));

    // The lesson in progress is complete once its last exercise is answered.
    const flowLesson = lessonFlow?.stage === 'exercise' ? getLesson(lessonFlow.lessonId) : undefined;
    if (flowLesson && flowLesson.exercises.includes(answered.id)
      && !nextLessonExercise(flowLesson, newQuestionsAttempted, QUESTIONS_BY_ID)) {
      const completedAt = Date.now();
      setLessonsDone(prev => (prev[flowLesson.id] !== undefined ? prev : { ...prev, [flowLesson.id]: completedAt }));
    }

    // Today's session: an answered list card leaves the list (one fewer
    // review), a new card or drill uses a slot, and a first miss comes back
    // once, a few cards later (the status badge says so on hover).
    const answeredCourse = getCourseForTopic(currentQuestion.topic);
    const session = reviewSessions[answeredCourse];
    if (session) {
      const listed = session.queue.some(e => e.id === currentQuestion.id);
      const kind = drilling && !listed ? 'practice' : servedKind;
      const result = recordReviewAnswer(session, currentQuestion.id, isCorrect, kind, familyOf(currentQuestion));
      setReviewSessions(prev => ({ ...prev, [answeredCourse]: result.session }));
      setReaskShown(result.requeued);
    }

    // Next is the question's own (QuestionShell shows it once graded), so a
    // throw in the FSRS bookkeeping below (corrupt state, unknown concept id)
    // cannot strand the learner on the answered question.
    setSessionStats({
      answered: sessionStats.answered + 1,
      correct: sessionStats.correct + (isCorrect ? 1 : 0),
    });

    // Auto-grade from response time + correctness (a 4-second MCQ pass weighs more
    // than a 30-second one; envelopes are per-question-type in conceptSRS). A
    // hint-assisted pass, or a pass under the credit bar, can never earn a
    // full-confidence interval bump. The same grade the family scheduler uses.
    const cardGrade = attemptGrade(currentQuestion, attempt);

    // Per-card FSRS difficulty for EVERY answered card (concept-tagged or not) —
    // the single source of truth, so the difficulty-scaled drain interval applies
    // course-wide (incl. the no-concept Data Engineering course). The concept
    // block below reads the pre-update value and no longer writes cardDifficulty.
    setCardDifficulty(prev => {
      const prevD = prev[currentQuestion.id] ?? 0;
      const nextD = prevD <= 0 ? fsrsInitDifficulty(cardGrade) : fsrsNextDifficulty(prevD, cardGrade);
      return { ...prev, [currentQuestion.id]: nextD };
    });

    if (
      isFeatureEnabled('conceptSrsEnabled') &&
      currentQuestion.concepts &&
      currentQuestion.concepts.length > 0
    ) {
      try {
        const prevLastAttempt = progress.lastAttempt.get(currentQuestion.id) ?? 0;
        const elapsedDays = prevLastAttempt > 0
          ? (Date.now() - prevLastAttempt) / MS_PER_DAY
          : 0;
        const result = applyReview(
          currentQuestion.concepts,
          cardGrade,
          cardDifficulty[currentQuestion.id] ?? 0,
          elapsedDays,
          conceptProgress,
          CONCEPT_BETAS,
          Date.now(),
        );
        setConceptProgress(prev => ({ ...prev, ...result.conceptUpdates }));
      } catch (err) {
        console.warn('Concept FSRS update failed; advancing without it.', err);
      }
    }
  };

  // Decision 7: the first failed submit of a coding card is recorded as a miss
  // for scheduling (its family is due again tomorrow) while the learner can
  // still retry on screen. Recorded once per showing.
  const handleFirstMiss = (meta?: AnswerMeta) => {
    if (!currentQuestion || firstMissRecordedRef.current === currentQuestion.id) return;
    firstMissRecordedRef.current = currentQuestion.id;
    const now = Date.now();
    const attempt: QuestionAttempt = {
      questionId: currentQuestion.id,
      timestamp: now,
      isCorrect: false,
      attempts: 1,
      timeSpent: now - questionStartTime,
      credit: 0,
      hintTierUsed: meta?.hintTierUsed ?? 0,
    };
    const attemptHistory = [...progress.attemptHistory, attempt];
    const questionsAttempted = new Set(progress.questionsAttempted);
    questionsAttempted.add(currentQuestion.id);
    const lastAttempt = new Map(progress.lastAttempt);
    lastAttempt.set(currentQuestion.id, now);
    setProgress({ ...progress, attemptHistory, questionsAttempted, lastAttempt });
    const missed = currentQuestion;
    setFsrsStore(prev => recordAttempt(prev, missed, attempt, attemptHistory));
  };

  // Topics belong to one course: switching course selects every topic again,
  // and keeps the difficulty and question-type filters.
  const switchCourse = (course: Course): FilterOptions => {
    const next = course === activeCourse ? filters : { ...filters, topics: allFilters().topics };
    if (next !== filters) {
      setFilters(next);
      setDrilling(false);
    }
    setActiveCourse(course);
    return next;
  };

  const startQuiz = (course?: Course, keepGoing = false) => {
    const targetCourse = course || activeCourse;
    const targetFilters = switchCourse(targetCourse);
    setDrilling(false);
    // Compute questions for the target course directly (state hasn't flushed yet).
    const pool = questions.filter(q => getCourseForTopic(q.topic) === targetCourse);
    const servePool = filterQuestions(pool, targetFilters);
    const built = reviewSessionFor(targetCourse);
    const session = keepGoing && !built.keepGoing ? continueSession(built) : built;
    if (session !== reviewSessions[targetCourse]) {
      setReviewSessions(prev => ({ ...prev, [targetCourse]: session }));
    }
    const next = selectSessionQuestion(session, servePool, pool, progress, fsrsStore, cardDifficulty, conceptCtx);
    serveWithLessons(next, targetCourse, lessonFlow);
    changeView('quiz');
    setSessionStats({ answered: 0, correct: 0 });
  };

  // "Start lesson" on the learning path: the lesson's rule card, then its exercises.
  const startLesson = (lessonId: string) => {
    const session = reviewSessionFor(activeCourse);
    if (session !== reviewSessions[activeCourse]) {
      setReviewSessions(prev => ({ ...prev, [activeCourse]: session }));
    }
    serveWithLessons(null, activeCourse, { lessonId, course: activeCourse, stage: 'card' });
    changeView('quiz');
  };

  // "Try the exercises" on the rule card.
  const startLessonExercises = useCallback(() => {
    if (!lessonFlow || lessonFlow.stage !== 'card') return;
    serveWithLessons(null, lessonFlow.course, { ...lessonFlow, stage: 'exercise' });
    setQuestionLoadCount(c => c + 1);
  }, [lessonFlow, serveWithLessons]);

  const renderQuestion = () => {
    const flowLesson = lessonFlow && lessonFlow.course === activeCourse ? getLesson(lessonFlow.lessonId) : undefined;
    if (!currentQuestion && flowLesson && lessonFlow?.stage === 'card') {
      return (
        <RuleCardView
          lesson={flowLesson}
          byId={QUESTIONS_BY_ID}
          context={lessonContext(flowLesson, courseQuestions, lessonsDone, progress.questionsAttempted)}
          mode="lesson"
          onStart={startLessonExercises}
        />
      );
    }
    // Nothing to serve ends in one of three states. Every path (Start, Keep
    // going, Learn, Resume, a filter change, a lesson ending) arrives here.
    const todaySession = reviewSessions[activeCourse];
    const matching = currentQuestion ? 0 : getFilteredQuestions().length;
    const unfiltered = matching === courseQuestions.length;
    // 1. The session is really over: it is done, or nothing is servable even
    //    from the unfiltered pool.
    const sessionOver = !!todaySession && !currentQuestion && matching > 0 && (unfiltered
      || isSessionDone(todaySession)
      || !selectSessionQuestion(todaySession, courseQuestions, courseQuestions, progress, fsrsStore, cardDifficulty, conceptCtx));
    if (!currentQuestion && todaySession && sessionOver) {
      return (
        <SessionSummary
          session={todaySession}
          onKeepGoing={() => startQuiz(activeCourse, true)}
          onHome={() => changeView('home')}
        />
      );
    }
    // 2. The session is not over, but the filters have nothing left today.
    if (!currentQuestion && matching > 0 && !unfiltered) {
      return (
        <div className="quiz-message empty-pool-message">
          <h3>Nothing left today for these filters.</h3>
          <p>
            Today's session still has questions outside your current filters.
            Reset filters to carry on with them.
          </p>
          <Button variant="primary" onClick={resetFilters} data-primary-action>Reset filters</Button>
        </div>
      );
    }
    // 3. The filters match no question in this course at all.
    if (!currentQuestion) {
      return (
        <div className="quiz-message empty-pool-message">
          <h3>You're all caught up.</h3>
          <p>
            No questions match your current filters in this course's unlocked sections.
            Try resetting filters or switching courses.
          </p>
          <Button variant="primary" onClick={resetFilters} data-primary-action>Reset filters</Button>
        </div>
      );
    }

    // Combined key forces a fresh component mount on every load — even when
    // the SRS happens to pick the SAME question id back-to-back (small
    // concept pools, FRINGE bucket churn). Without this, the child keeps its
    // `isSubmitted` state and clicking Next appears to do nothing.
    const renderKey = `${currentQuestion.id}-${questionLoadCount}`;

    if (currentQuestion.type === QuestionType.MULTIPLE_CHOICE) {
      return (
        <MultipleChoiceQuestion
          key={renderKey}
          question={currentQuestion}
          onAnswer={handleAnswer}
          onMisconception={handleMisconception}
          showHints={true}
        />
      );
    } else if (currentQuestion.type === QuestionType.PARSONS) {
      return (
        <ParsonsQuestion
          key={renderKey}
          question={currentQuestion}
          onAnswer={handleAnswer}
          showHints={true}
        />
      );
    } else if (currentQuestion.type === QuestionType.PREDICT_OUTPUT) {
      return (
        <PredictOutputQuestion
          key={renderKey}
          question={currentQuestion}
          onAnswer={handleAnswer}
          showHints={true}
        />
      );
    } else if (currentQuestion.type === QuestionType.CLOZE_CODE) {
      return (
        <ClozeCodeQuestion
          key={renderKey}
          question={currentQuestion}
          onAnswer={handleAnswer}
          showHints={true}
        />
      );
    } else if (currentQuestion.type === QuestionType.PREDICT_OUTCOME) {
      return (
        <PredictOutcomeQuestion
          key={renderKey}
          question={currentQuestion}
          onAnswer={handleAnswer}
          showHints={true}
        />
      );
    } else if (currentQuestion.type === QuestionType.CHOOSE_JUSTIFY) {
      return (
        <ChooseJustifyQuestion
          key={renderKey}
          question={currentQuestion}
          onAnswer={handleAnswer}
          showHints={true}
        />
      );
    } else if (currentQuestion.type === QuestionType.SPOT_FLAW) {
      return (
        <SpotFlawQuestion
          key={renderKey}
          question={currentQuestion}
          onAnswer={handleAnswer}
          showHints={true}
        />
      );
    } else if (currentQuestion.type === QuestionType.EXPLAIN) {
      return (
        <ExplainQuestion
          key={renderKey}
          question={currentQuestion}
          onAnswer={handleAnswer}
          showHints={true}
        />
      );
    } else {
      return (
        <CodingQuestion
          key={renderKey}
          question={currentQuestion}
          onAnswer={handleAnswer}
          onFirstMiss={handleFirstMiss}
          showHints={true}
          hintCreditSchedule={SpacedRepetitionSystem.getHintCreditSchedule(
            currentQuestion.id,
            currentQuestion.topic,
            progress,
          )}
        />
      );
    }
  };

  // Scoped to the active course only (e.g. resetting Databricks & PySpark
  // leaves Web Dev / Backend / Data Engineering / SQL progress untouched).
  const resetProgress = () => {
    const courseLabel = COURSE_META[activeCourse]?.label ?? activeCourse;
    if (
      window.confirm(
        `Are you sure you want to reset all progress for ${courseLabel}? This cannot be undone.`
      )
    ) {
      // Today's review list was built from the progress being wiped.
      setReviewSessions(prev => {
        const rest = { ...prev };
        delete rest[activeCourse];
        return rest;
      });
      const courseTopics = new Set<string>(
        questions.filter(q => getCourseForTopic(q.topic) === activeCourse).map(q => q.topic)
      );
      const courseQuestionIds = new Set(
        questions.filter(q => courseTopics.has(q.topic)).map(q => q.id)
      );
      const difficultyById = new Map(questions.map(q => [q.id, q.difficulty]));

      const courseConcepts = new Set(
        (activeCourse === Course.DATABRICKS ? DATABRICKS_CONCEPTS
          : activeCourse === Course.BACKEND ? BACKEND_CONCEPTS
          : activeCourse === Course.WEB_DEV ? WEBDEV_CONCEPTS
          : []
        ).map(c => c.id)
      );

      setProgress(prev => {
        const questionsAttempted = new Set(
          Array.from(prev.questionsAttempted).filter(id => !courseQuestionIds.has(id))
        );
        const correctAnswers = new Set(
          Array.from(prev.correctAnswers).filter(id => !courseQuestionIds.has(id))
        );
        const attemptHistory = prev.attemptHistory.filter(a => !courseQuestionIds.has(a.questionId));

        const topicScores = new Map(prev.topicScores);
        courseTopics.forEach(t => topicScores.delete(t as Topic));

        const lastAttempt = new Map(prev.lastAttempt);
        const repetitionQueue = new Map(prev.repetitionQueue);
        courseQuestionIds.forEach(id => {
          lastAttempt.delete(id);
          repetitionQueue.delete(id);
        });

        const masteredTopics = new Set(
          Array.from(prev.masteredTopics).filter(t => !courseTopics.has(t))
        );

        // difficultyScores has no course dimension in its keys (Difficulty
        // only) - recompute it from the surviving attemptHistory so the
        // cross-course aggregate stays honest after the course-scoped wipe.
        const difficultyScores = new Map<Difficulty, { correct: number; total: number }>();
        attemptHistory.forEach(a => {
          const diff = difficultyById.get(a.questionId);
          if (!diff) return;
          const entry = difficultyScores.get(diff) || { correct: 0, total: 0 };
          entry.total += 1;
          if (a.isCorrect) entry.correct += 1;
          difficultyScores.set(diff, entry);
        });

        return {
          questionsAttempted,
          correctAnswers,
          attemptHistory,
          topicScores,
          difficultyScores,
          lastAttempt,
          repetitionQueue,
          masteredTopics,
        };
      });

      if (courseConcepts.size > 0) {
        setConceptProgress(prev => {
          const next = { ...prev };
          courseConcepts.forEach(id => { delete next[id]; });
          return next;
        });
      }

      setFsrsStore(replayHistory(
        progress.attemptHistory.filter(a => !courseQuestionIds.has(a.questionId)),
        QUESTIONS_BY_ID,
      ));

      setMisconceptions(prev => ({
        events: prev.events.filter(e => !courseQuestionIds.has(e.questionId)),
      }));
      // The course's completed lessons go too, so its rule cards are taught again.
      setLessonsDone(prev => Object.fromEntries(Object.entries(prev).filter(([id]) => {
        const lesson = getLesson(id);
        return !lesson || !lesson.topicKeys.some(t => courseTopics.has(t));
      })));
      // And its ticked exercises.
      setExercisesDone(prev => Object.fromEntries(Object.entries(prev).filter(([id]) => {
        const exercise = getExercise(id);
        return !exercise || !exercise.topicKeys.some(t => courseTopics.has(t));
      })));
      setLessonFlow(null);
      setSessionStats({ answered: 0, correct: 0 });
    }
  };

  // Build a map from questionId -> topic for quick lookup
  const questionTopicMap = useMemo(() => {
    const map = new Map<string, string>();
    questions.forEach(q => map.set(q.id, q.topic));
    return map;
  }, []);

  // Compute topic-based recent accuracy and coverage for the current question's topic
  const topicAccuracy = useMemo(() => {
    const topic = currentQuestion?.topic;
    if (!topic) return { pct: 'New', correct: 0, total: 0, seen: 0, topicTotal: 0 };

    const topicAttempts = recentAttempts(
      progress.attemptHistory.filter(a => questionTopicMap.get(a.questionId) === topic),
      RECENT_WINDOW,
    );

    const correct = topicAttempts.filter(a => a.isCorrect).length;
    const total = topicAttempts.length;
    const accuracyPct = total >= RECENT_WINDOW ? pct(correct, total).toFixed(0) : 'New';

    // Coverage: unique questions attempted / total questions in topic
    const topicQuestions = questions.filter(q => q.topic === topic);
    const attemptedInTopic = new Set(
      progress.attemptHistory
        .filter(a => questionTopicMap.get(a.questionId) === topic)
        .map(a => a.questionId)
    );
    return { pct: accuracyPct, correct, total, seen: attemptedInTopic.size, topicTotal: topicQuestions.length };
  }, [progress.attemptHistory, currentQuestion, questionTopicMap]);

  // Reviews left today in the active course: the live session's list, or on
  // Home before a session starts, the list Start would build right now (the
  // same builder, so Home and the first card's status badge show the same number).
  // viewMode is a dependency so coming back to Home rebuilds a preview.
  const reviewSessionNow = useMemo(
    () => reviewSessionFor(activeCourse),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reviewSessionFor, activeCourse, viewMode],
  );
  const reviewsLeftToday = reviewsLeft(reviewSessionNow);

  // The rule card that belongs to the screen: the lesson in progress while its
  // exercises are served, else the lesson of the topic of the card on screen.
  const flowLesson = lessonFlow && lessonFlow.course === activeCourse ? getLesson(lessonFlow.lessonId) : undefined;
  const inLessonExercise = !!flowLesson && lessonFlow?.stage === 'exercise'
    && !!currentQuestion && flowLesson.exercises.includes(currentQuestion.id);
  const screenLesson = inLessonExercise ? flowLesson : currentQuestion ? lessonsForTopic(currentQuestion.topic)[0] : undefined;
  // A course with rule cards keeps one column beside every question, so the
  // question has the same width and place whether or not its topic has a card.
  const courseHasLessons = useMemo(
    () => LESSONS.some(l => getCourseForTopic(l.topicKeys[0]) === activeCourse),
    [activeCourse],
  );
  const columnLayout = courseHasLessons && (rulePanelPref === 'shown' || (rulePanelPref === 'auto' && wideScreen));
  const sideColumn = viewMode === 'quiz' && !!currentQuestion && columnLayout;
  const latestAnswers = useMemo(() => SpacedRepetitionSystem.latestCorrectness(progress), [progress]);

  // Keys from the shortcut registry (keyboard/shortcuts.ts): R opens the rule
  // card in full (the overlay closes itself on R or Esc), and Enter on a
  // lesson's first rule card starts its exercises. Neither fires while typing.
  const ruleCardLesson = viewMode === 'quiz' ? (screenLesson ?? flowLesson) : undefined;
  useShortcut('ruleCard', () => {
    if (!ruleCardLesson) return false;
    setRuleCardOpen(ruleCardLesson.id);
    return true;
  }, !!ruleCardLesson && !ruleCardOpen);
  useShortcut('filters', () => {
    setShowFilters(true);
    return true;
  }, viewMode === 'quiz' && !showFilters && !ruleCardOpen);
  // The filters belong to the quiz view: leaving it closes them.
  useEffect(() => { if (viewMode !== 'quiz') setShowFilters(false); }, [viewMode]);
  const filtersActive = useMemo(() => activeFilterCount(filters, courseQuestions), [filters, courseQuestions]);
  // The dialog gives focus back to what had it; when a filter change replaced
  // that question, answering starts on the new one instead.
  const closeFilters = () => {
    setShowFilters(false);
    requestAnimationFrame(() => {
      const active = document.activeElement;
      if (active && active !== document.body) return;
      const question = document.querySelector<HTMLElement>('main article[aria-labelledby]');
      if (question) focusAnswerStart(question);
      else document.querySelector<HTMLElement>('main [data-primary-action]')?.focus({ preventScroll: true });
    });
  };
  useShortcut('startExercises', e => {
    if (e.target instanceof HTMLElement && e.target.closest('button, a[href], input, textarea, select')) return false;
    startLessonExercises();
    return true;
  }, viewMode === 'quiz' && lessonFlow?.stage === 'card' && !currentQuestion && !ruleCardOpen);

  // Per-topic measured difficulty (avg auto-graded FSRS difficulty of its drain
  // cards) → easy/medium/hard label for the current topic. Null until graded.
  const topicDifficulty = useMemo(() => {
    const topic = currentQuestion?.topic;
    if (!topic) return null;
    const tq = questions.filter(q => q.topic === topic);
    return SpacedRepetitionSystem.getTopicDifficulty(tq, cardDifficulty);
  }, [currentQuestion, cardDifficulty]);

  // Every course's totals, for the course switcher and the course card on Home.
  const totalsByCourse = useMemo(() => courseTotals(questions, progress), [progress]);

  // The active course's path (sections, units, the next lesson) for Home and Progress.
  const coursePath = useMemo(
    () => buildCoursePath(activeCourse, courseQuestions, progress, fsrsStore, lessonsDone),
    [activeCourse, courseQuestions, progress, fsrsStore, lessonsDone],
  );
  const focus = useMemo(
    () => focusAreas(coursePath, courseQuestions, misconceptions),
    [coursePath, courseQuestions, misconceptions],
  );
  const activity = useMemo(
    () => activityByDay(progress.attemptHistory, courseQuestions),
    [progress.attemptHistory, courseQuestions],
  );

  // The rail, the switcher and the G keys all move between screens here.
  const navigate = (view: NavView) => {
    if (isNarrowScreen()) setRailCollapsed(true);
    if (view === 'quiz') startQuiz(activeCourse);
    else changeView(view);
  };
  const changeCourse = (course: Course) => {
    if (isNarrowScreen()) setRailCollapsed(true);
    // Mid-question, swap the whole quiz context, so the old course's question does not linger.
    if (viewMode === 'quiz') startQuiz(course);
    else switchCourse(course);
  };
  useShortcut('goHome', () => navigate('home'));
  useShortcut('goLearn', () => navigate('quiz'));
  useShortcut('goProgress', () => navigate('progress'));
  useShortcut('goSettings', () => navigate('settings'));
  // Home's "All sections": every section's topics, on Progress → Topics.
  const openPathTab = () => {
    setActiveProgressTab('topics');
    changeView('progress');
  };

  return (
    <div className={`App ${COURSE_META[activeCourse].theme}`}>
      <h1 className="sr-only">Recall - multi-course learning platform</h1>

      <TopBar
        course={activeCourse}
        totals={totalsByCourse}
        onCourseChange={changeCourse}
        streak={profile.currentStreak}
        onToggleNav={() => setRailCollapsed(!railCollapsed)}
        onShowShortcuts={() => setHelpOpen(true)}
      />
      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        data-testid="import-progress-input"
        hidden
        onChange={e => { void importProgress(e.target.files); }}
      />

      <div className="storage-banners">
      {initialLoad.status === 'unreadable' && (
        <div className="storage-banner storage-banner-error" role="alert">
          <strong>Your saved progress could not be read</strong> ({initialLoad.error}).
          {initialLoad.backupKey
            ? <>
                {' '}The old data is safe in a backup under <code>{initialLoad.backupKey}</code>, which Recall never overwrites.
                {' '}Saving has resumed from a fresh start.
              </>
            : <>
                {' '}The old data is still under <code>{STORAGE_KEYS.progress}</code>, but a backup copy of it could not be saved,
                {' '}so saving is off to protect it and answers in this session will not be saved.
                {backupKeys.length > 0
                  ? <>{' '}Earlier backups are still kept: {backupKeys.map(k => <code key={k}>{k} </code>)}.</>
                  : <>{' '}There is no earlier backup.</>}
              </>}
          {' '}Use Import to restore from an export file.
          {initialLoad.raw !== null && (
            <>
              {' '}<button
                className="storage-banner-button"
                onClick={() => downloadTextFile(`recall-progress-unreadable-${getToday()}.json`, initialLoad.raw as string)}
              >
                Download unreadable data
              </button>
            </>
          )}
        </div>
      )}
      {backupKeys.length > 0 && !backupNoticeDismissed && (
        <div className="storage-banner storage-banner-warning" role="status">
          {unreadableBackupCount > 0 && (
            <>
              Recall keeps {unreadableBackupCount === 1 ? 'a backup' : `${unreadableBackupCount} backups`} of progress it could not read.
              {' '}Export includes them.
            </>
          )}
          {backupKeys.includes(PRE_IMPORT_BACKUP_KEY) && (
            <>
              {unreadableBackupCount > 0 && ' '}Recall keeps a backup of the progress the last import replaced.
            </>
          )}
          {backupKeys.map(k => (
            <React.Fragment key={k}>
              {' '}<button
                className="storage-banner-button"
                onClick={() => downloadTextFile(`${k.replace(/[:.]/g, '-')}.json`, localStorage.getItem(k) ?? '')}
                title={k === PRE_IMPORT_BACKUP_KEY ? 'Import the downloaded file to restore this progress' : undefined}
              >
                {k === PRE_IMPORT_BACKUP_KEY ? 'Download backup from before the last import' : `Download backup ${k.slice(PROGRESS_BACKUP_PREFIX.length)}`}
              </button>
            </React.Fragment>
          ))}
          {' '}<button className="storage-banner-button" onClick={() => setBackupNoticeDismissed(true)}>Dismiss</button>
        </div>
      )}
      {staleTab && (
        <div className="storage-banner storage-banner-warning" role="alert">
          <strong>Recall is open in another tab, and it saved answers.</strong>
          {' '}This tab has stopped saving so it cannot overwrite them. Answers you give here are not being saved.
          {' '}<button className="storage-banner-button" onClick={reloadPage}>Reload to continue here</button>
        </div>
      )}
      {Object.keys(writeErrors).length > 0 && (
        <div className="storage-banner storage-banner-error" role="alert">
          <strong>Your progress is not being saved</strong>
          {' '}({Object.entries(writeErrors).map(([k, msg]) => `${k}: ${msg}`).join('; ')}).
          {' '}Your answers are kept in this tab until you close it.
          {canExport && (
            <>
              {' '}Export now to keep them.
              {' '}<button className="storage-banner-button" onClick={exportProgress}>Export now</button>
            </>
          )}
        </div>
      )}
      {importError && (
        <div className="storage-banner storage-banner-error" role="alert">
          {importError}
          {' '}<button className="storage-banner-button" onClick={() => setImportError(null)}>Dismiss</button>
        </div>
      )}
      </div>

      {/* ── Main Body: Navigation Rail + Content ── */}
      <div className="app-body">
        <NavRail active={viewMode} onNavigate={navigate} collapsed={railCollapsed} />

        {/* Content Area */}
        <main className="content">
          <div className="view-container" key={viewMode}>
          {viewMode === 'home' && (
            <HomeView
              course={activeCourse}
              session={reviewSessionNow}
              reviewsLeft={reviewsLeftToday}
              settings={sessionSettings}
              path={coursePath}
              totals={totalsByCourse[activeCourse]}
              activity={activity}
              focus={focus}
              exercisesDone={exercisesDone}
              onStart={() => startQuiz(activeCourse)}
              onKeepGoing={() => startQuiz(activeCourse, true)}
              onStartLesson={startLesson}
              onRuleCard={setRuleCardOpen}
              onDrill={handleReviewWeakTopic}
              onAllSections={openPathTab}
              onSettings={() => changeView('settings')}
            />
          )}

          {viewMode === 'settings' && (
            <SettingsView
              course={activeCourse}
              settings={sessionSettings}
              sessionStarted={(reviewSessions[activeCourse]?.answered ?? 0) > 0 && isSessionCurrent(reviewSessions[activeCourse])}
              onSettingsChange={changeSessionSettings}
              canExport={canExport}
              exportNote={progressWritesBlocked
                ? 'Stored progress could not be read, so there is nothing to export yet.'
                : staleTab
                  ? 'Reload this tab to export the latest progress: another tab saved newer answers.'
                  : null}
              onExport={exportProgress}
              onImport={() => importInputRef.current?.click()}
              onReset={resetProgress}
              onShowShortcuts={() => setHelpOpen(true)}
            />
          )}

          {viewMode === 'quiz' && (() => {
            // The lesson's rule card before its exercises, or the card on screen.
            const lessonCard = !currentQuestion && lessonFlow?.stage === 'card' ? flowLesson : undefined;
            const placeTopic = currentQuestion ? currentQuestion.topic : lessonCard?.topicKeys[0];
            const place = placeTopic ? getTopicPlace(placeTopic) : null;
            const lastExercise = inLessonExercise && flowLesson && !nextLessonExercise(flowLesson, progress.questionsAttempted, QUESTIONS_BY_ID);
            const nav: QuestionNav = {
              label: lastExercise ? 'Finish the lesson' : inLessonExercise ? 'Next exercise' : 'Next question',
              onNext: loadNextQuestion,
              missNote: reaskShown ? 'It comes back once more, a few cards later.' : undefined,
            };
            const status: SessionStatus = {
              kind: inLessonExercise || lessonCard ? 'lesson'
                : !currentQuestion ? undefined
                : servedKind === 'review' ? 'review'
                : servedKind === 'new' ? 'new'
                : 'practice',
              answered: reviewSessionNow.answered,
              size: reviewSessionNow.size,
              keepGoing: !!reviewSessionNow.keepGoing,
              reviewsLeft: reviewsLeftToday,
              again: reaskShown,
            };
            const topicStats: TopicStats = {
              seen: topicAccuracy.seen,
              total: topicAccuracy.topicTotal,
              recent: topicAccuracy.pct === 'New' ? null : Number(topicAccuracy.pct),
              level: topicDifficulty?.label ?? null,
            };
            // Hide unmounts its own button: focus goes to the header's toggle, which brings the column back.
            const hideColumn = () => {
              setRulePanelPref('hidden');
              requestAnimationFrame(() => {
                if (document.activeElement === document.body) document.querySelector<HTMLElement>('[data-panel-toggle]')?.focus({ preventScroll: true });
              });
            };
            return (
            <div className={`quiz-view${columnLayout ? ' quiz-view-column' : ''}`}>
              <QuizBar
                onBack={() => changeView('home')}
                section={place?.section}
                topic={place?.unit}
                status={status}
                onRuleCard={currentQuestion && screenLesson ? () => setRuleCardOpen(screenLesson.id) : undefined}
                panel={currentQuestion && courseHasLessons
                  ? { shown: sideColumn, onToggle: () => setRulePanelPref(sideColumn ? 'hidden' : 'shown') }
                  : undefined}
                filters={{ active: filtersActive, onOpen: () => setShowFilters(true) }}
              />

              {flowLesson && (inLessonExercise || lessonCard) && (
                <LessonSteps
                  lesson={flowLesson}
                  byId={QUESTIONS_BY_ID}
                  latest={latestAnswers}
                  currentId={currentQuestion ? currentQuestion.id : null}
                />
              )}

              <div className={`quiz-stage${sideColumn ? ' quiz-stage-column' : ''}`}>
                <div className="quiz-main">
                  <QuestionNavContext.Provider value={nav}>
                    <QuestionErrorBoundary onSkip={loadNextQuestion}>
                      {renderQuestion()}
                    </QuestionErrorBoundary>
                  </QuestionNavContext.Provider>
                </div>
                {sideColumn && currentQuestion && (screenLesson ? (
                  <RuleCardPanel
                    className="quiz-side-panel"
                    lesson={screenLesson}
                    rampNote={rampAfterLessonNote(screenLesson, courseQuestions, progress.questionsAttempted)}
                    stats={topicStats}
                    onOpen={() => setRuleCardOpen(screenLesson.id)}
                    onHide={hideColumn}
                  />
                ) : (
                  <TopicPanel
                    className="quiz-side-panel"
                    topic={place?.unit ?? currentQuestion.topic}
                    section={place?.section}
                    stats={topicStats}
                    onHide={hideColumn}
                  />
                ))}
              </div>
            </div>
            );
          })()}

          {viewMode === 'progress' && (
            <ProgressView
              course={activeCourse}
              questions={courseQuestions}
              progress={progress}
              path={coursePath}
              misconceptions={misconceptions}
              activity={activity}
              exercisesDone={exercisesDone}
              longestStreak={profile.longestStreak}
              tab={activeProgressTab}
              onTabChange={setActiveProgressTab}
              topic={progressTopic}
              onTopicChange={setProgressTopic}
              onDrill={handleReviewWeakTopic}
              onRuleCard={setRuleCardOpen}
              onStartLesson={startLesson}
              onToggleExercise={toggleExercise}
            />
          )}
          </div>
        </main>
      </div>

      <ShortcutHelp open={helpOpen} onOpenChange={setHelpOpen} />

      {showFilters && viewMode === 'quiz' && (
        <FilterDialog
          filters={filters}
          course={activeCourse}
          onChange={handleFilterChange}
          onReset={resetFilters}
          onClose={closeFilters}
        />
      )}

      {ruleCardOpen && (() => {
        const lesson = getLesson(ruleCardOpen);
        if (!lesson) return null;
        return (
          <RuleCardOverlay
            lesson={lesson}
            byId={QUESTIONS_BY_ID}
            context={lessonContext(lesson, courseQuestions, lessonsDone, progress.questionsAttempted)}
            onClose={() => setRuleCardOpen(null)}
          />
        );
      })()}
    </div>
  );
}

export default App;
