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
} from './types';
import { questions } from './data/questions';
import { SpacedRepetitionSystem, RECENT_WINDOW, pct, recentAttempts, ConceptSelectionContext } from './utils/spacedRepetition';
import { seedMasteredTopics } from './utils/masteryMigration';
import { applyReview, ConceptProgress, gradeFromResponseTime, fsrsInitDifficulty, fsrsNextDifficulty } from './utils/conceptSRS';
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
import {
  getCourseForTopic,
  WEBDEV_PATH_ORDER,
  BACKEND_PATH_ORDER,
  DATABRICKS_PATH_ORDER,
  DATA_ENG_PATH_ORDER,
  SQL_PATH_ORDER,
  WEBDEV_SECTIONS,
  BACKEND_SECTIONS,
  DATABRICKS_SECTIONS,
  DATA_ENG_SECTIONS,
  SQL_SECTIONS,
  getSectionUnits,
  getSelectionPolicy,
} from './utils/courseConfig';
import { MultipleChoiceQuestion } from './components/MultipleChoiceQuestion';
import { CodingQuestion } from './components/CodingQuestion';
import { ParsonsQuestion } from './components/ParsonsQuestion';
import { PredictOutputQuestion } from './components/PredictOutputQuestion';
import { ClozeCodeQuestion } from './components/ClozeCodeQuestion';
import { ProgressTracker } from './components/ProgressTracker';
import { QuestionFilter } from './components/QuestionFilter';
import { NavigationRail } from './components/NavigationRail';
import {
  Database,
  Globe,
  Server,
  Network,
  Table2,
  Activity,
  Filter,
  ListChecks,
  Flame,
  Target,
  ArrowRight,
  TrendingUp,
  Eye,
  BookOpen,
  Lock,
  CheckCircle2,
  PlayCircle,
  Download,
  Upload,
  LucideIcon,
} from 'lucide-react';
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

const COURSE_META: Record<Course, { label: string; Icon: LucideIcon; tagline: string; accent: string }> = {
  [Course.DATABRICKS]: {
    label: 'Databricks & PySpark',
    Icon: Database,
    tagline: 'Master the lakehouse — Spark SQL, Delta Lake, streaming, governance, dimensional modeling.',
    accent: '#fb923c',
  },
  [Course.WEB_DEV]: {
    label: 'Web Development',
    Icon: Globe,
    tagline: 'Build production Next.js apps — TypeScript, React, Prisma, accessibility, design patterns.',
    accent: '#06b6d4',
  },
  [Course.BACKEND]: {
    label: 'Backend Engineering',
    Icon: Server,
    tagline: 'Engineer Python backends — Django, DRF, Celery, Postgres, deployment, real infrastructure.',
    accent: '#10b981',
  },
  [Course.DATA_ENGINEERING]: {
    label: 'Data Engineering',
    Icon: Network,
    tagline: 'Decision-making across the modern stack — open table formats, streaming, distributed systems.',
    accent: '#a78bfa',
  },
  [Course.SQL]: {
    label: 'SQL for Data Engineering',
    Icon: Table2,
    tagline: 'Write production warehouse T-SQL — DDL, dimensional modelling, MERGE/ELT procedures, performance.',
    accent: '#38bdf8',
  },
};

type ViewMode = 'quiz' | 'progress' | 'home' | 'filter';

interface FilterOptions {
  topics: Topic[];
  difficulties: Difficulty[];
  questionTypes: QuestionType[];
}

const STORAGE_KEYS = {
  progress: PROGRESS_KEY,
  profile: 'recall-profile',
  filters: 'recall-filters',
  activeCourse: 'recall-active-course',
  misconceptions: 'recall-misconceptions',
  conceptProgress: 'recall-concept-progress',
  cardDifficulty: 'recall-card-difficulty',
  conceptMigrationVersion: 'recall-concept-migration-version',
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

function loadFilters(): FilterOptions {
  const defaults: FilterOptions = {
    topics: Object.values(Topic),
    difficulties: Object.values(Difficulty),
    questionTypes: Object.values(QuestionType),
  };
  const saved = localStorage.getItem(STORAGE_KEYS.filters);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        topics: parsed.topics || defaults.topics,
        difficulties: parsed.difficulties || defaults.difficulties,
        questionTypes: parsed.questionTypes || defaults.questionTypes,
      };
    } catch {
      // Corrupted store; use defaults.
    }
  }
  return defaults;
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
        <div className="question-error-fallback" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>This question hit a snag.</h3>
          <p style={{ opacity: 0.75, marginBottom: '1rem' }}>
            We couldn't render it. Skip to the next one — your progress is safe.
          </p>
          <button className="next-button" onClick={() => { this.setState({ error: null }); this.props.onSkip(); }}>
            Skip question
          </button>
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
  const [filters, setFilters] = useState<FilterOptions>(loadFilters);
  const [misconceptions, setMisconceptions] = useState<MisconceptionStore>(loadMisconceptions);
  const [conceptProgress, setConceptProgress] = useState<ConceptProgress>(
    () => loadConceptProgress(initialLoad.progress, !studyWritesBlocked(initialLoad)),
  );
  const [cardDifficulty, setCardDifficulty] = useState<Record<string, number>>(loadCardDifficulty);

  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [sessionStartTime] = useState(Date.now());
  const [showNextButton, setShowNextButton] = useState(false);
  const [sessionStats, setSessionStats] = useState({ answered: 0, correct: 0 });
  const [showFilters, setShowFilters] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'slide-left' | 'slide-right' | 'fade'>('fade');
  const [activeProgressTab, setActiveProgressTab] = useState<'overview' | 'topics' | 'heatmap'>('overview');

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

  // Get transition direction based on view hierarchy
  const getTransitionDirection = useCallback((from: ViewMode, to: ViewMode): 'slide-left' | 'slide-right' | 'fade' => {
    // Filter out 'filter' mode from transition logic
    if (from === 'filter' || to === 'filter') return 'fade';

    const hierarchy = ['home', 'quiz', 'progress'];
    const fromIdx = hierarchy.indexOf(from);
    const toIdx = hierarchy.indexOf(to);

    if (toIdx > fromIdx) return 'slide-left';   // Deeper into app
    if (toIdx < fromIdx) return 'slide-right';  // Back to shallower view
    return 'fade';  // Same level
  }, []);

  // Change view with transition
  const changeView = useCallback((newView: ViewMode) => {
    if (newView === viewMode) return;

    setTransitionDirection(getTransitionDirection(viewMode, newView));
    setIsTransitioning(true);

    setTimeout(() => {
      setViewMode(newView);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300); // Match exit animation duration
  }, [viewMode, getTransitionDirection]);

  // Filter questions by active course
  const courseQuestions = useMemo(() => {
    return questions.filter(q => getCourseForTopic(q.topic) === activeCourse);
  }, [activeCourse]);

  // Per-course selection policy. Centralises topic order + concept-SRS flag
  // so the selector doesn't have to special-case courses internally.
  const selectionPolicy = useMemo(() => getSelectionPolicy(activeCourse), [activeCourse]);

  // Count only seen questions that still exist (excludes deleted variation IDs from localStorage)
  const validSeenCount = useMemo(() => {
    const currentIds = new Set(courseQuestions.map(q => q.id));
    let count = 0;
    progress.questionsAttempted.forEach(id => {
      if (currentIds.has(id)) count++;
    });
    return count;
  }, [courseQuestions, progress.questionsAttempted]);

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
    persist(STORAGE_KEYS.filters, JSON.stringify(filters), 'ui');
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

  // Concept-aware selection context. Memoized so SpacedRepetitionSystem only
  // sees a new ctx when conceptProgress actually changes. Returns undefined
  // when the feature flag is off → existing legacy selection runs unchanged.
  const conceptCtx = useMemo<ConceptSelectionContext | undefined>(() => {
    if (!isFeatureEnabled('conceptSrsEnabled')) return undefined;
    return { progress: conceptProgress, betas: CONCEPT_BETAS };
  }, [conceptProgress]);

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
      [STORAGE_KEYS.filters]: JSON.stringify(filters),
      [STORAGE_KEYS.activeCourse]: activeCourse,
      [STORAGE_KEYS.misconceptions]: JSON.stringify(misconceptions),
      [STORAGE_KEYS.conceptProgress]: JSON.stringify(conceptProgress),
      [STORAGE_KEYS.cardDifficulty]: JSON.stringify(cardDifficulty),
      [STORAGE_KEYS.conceptMigrationVersion]: CONCEPT_MIGRATION_VERSION,
      ...Object.fromEntries(listBackupKeys(localStorage).map(k => [k, localStorage.getItem(k)])),
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
    const when = check.file.exportedAt ? ` exported ${check.file.exportedAt}` : '';
    if (!window.confirm(
      `Replace ALL Recall progress in this browser with ${file.name}${when} (${check.attemptCount} answers)? ` +
      'Export your current progress first if you might want it back.',
    )) return;
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

  // Mouse spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const spotlight = document.documentElement;
      spotlight.style.setProperty('--mouse-x', `${e.clientX}px`);
      spotlight.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getFilteredQuestions = useCallback((): Question[] => {
    return courseQuestions.filter(q => {
      const topicMatch = filters.topics.length === 0 || filters.topics.includes(q.topic);
      const difficultyMatch = filters.difficulties.length === 0 || filters.difficulties.includes(q.difficulty);
      const typeMatch = filters.questionTypes.length === 0 || filters.questionTypes.includes(q.type);
      return topicMatch && difficultyMatch && typeMatch;
    });
  }, [filters, courseQuestions]);

  // Bumped every time we ask for a new question. Used as a render key on the
  // question component so even when the SRS picks the SAME question reference
  // (small concept pools, edge cases) the child remounts with fresh state —
  // otherwise the child's `isSubmitted=true` from the just-answered question
  // persists and the UI looks frozen ("Next button doesn't work").
  const [questionLoadCount, setQuestionLoadCount] = useState(0);

  const loadNextQuestion = useCallback(() => {
    const filteredQuestions = getFilteredQuestions();
    const next = SpacedRepetitionSystem.selectNextQuestion(filteredQuestions, progress, conceptCtx, selectionPolicy, cardDifficulty);
    setCurrentQuestion(next);
    setQuestionStartTime(Date.now());
    setShowNextButton(false);
    setQuestionLoadCount(c => c + 1);
  }, [getFilteredQuestions, progress, conceptCtx, selectionPolicy, cardDifficulty]);

  const applyFiltersAndLoadQuestion = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    const filtered = courseQuestions.filter(q => {
      const topicMatch = newFilters.topics.length === 0 || newFilters.topics.includes(q.topic);
      const difficultyMatch = newFilters.difficulties.length === 0 || newFilters.difficulties.includes(q.difficulty);
      const typeMatch = newFilters.questionTypes.length === 0 || newFilters.questionTypes.includes(q.type);
      return topicMatch && difficultyMatch && typeMatch;
    });
    const next = SpacedRepetitionSystem.selectNextQuestion(filtered, progress, conceptCtx, selectionPolicy, cardDifficulty);
    setCurrentQuestion(next);
    setQuestionStartTime(Date.now());
    setShowNextButton(false);
  }, [courseQuestions, progress, conceptCtx, selectionPolicy, cardDifficulty]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    applyFiltersAndLoadQuestion(newFilters);
  };

  const resetFilters = () => {
    applyFiltersAndLoadQuestion({
      topics: Object.values(Topic),
      difficulties: Object.values(Difficulty),
      questionTypes: Object.values(QuestionType),
    });
  };

  // From the progress dashboard: filter down to one weak category's topics
  // and drop straight into question mode.
  const handleReviewWeakTopic = useCallback((topicKeys: string[]) => {
    applyFiltersAndLoadQuestion({
      topics: topicKeys as Topic[],
      difficulties: Object.values(Difficulty),
      questionTypes: Object.values(QuestionType),
    });
    changeView('quiz');
  }, [applyFiltersAndLoadQuestion, changeView]);

  const handleAnswer = (isCorrect: boolean, meta?: AnswerMeta) => {
    if (!currentQuestion) return;

    const timeSpent = Date.now() - questionStartTime;

    // Tiered-hint partial credit (coding only). Credit is the single source of
    // truth for mastery math; the boolean stays for legacy scoring/session stats.
    // No meta (other 4 question types, or an untiered coding pass) => tier 0 =>
    // credit is exactly `isCorrect ? 1 : 0`, preserving prior behavior.
    const hintTierUsed = meta?.hintTierUsed ?? 0;
    const attemptCount = meta?.attempts ?? 1;
    const creditSchedule = SpacedRepetitionSystem.getHintCreditSchedule(
      currentQuestion.id,
      currentQuestion.topic,
      progress,
    );
    const credit = isCorrect ? creditSchedule[hintTierUsed] : 0;

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

    const newAttemptHistory = [...progress.attemptHistory, {
      questionId: currentQuestion.id,
      timestamp: Date.now(),
      isCorrect,
      attempts: attemptCount,
      timeSpent,
      credit,
      hintTierUsed,
    }];

    const newLastAttempt = new Map(progress.lastAttempt);
    newLastAttempt.set(currentQuestion.id, Date.now());

    // Grant sticky mastery for any unlock scope this answer just completed.
    // Computed against the new history so this answer counts; the set only
    // ever grows, so a same-reference return means nothing changed.
    const newMasteredTopics = SpacedRepetitionSystem.updateMasteredTopics(
      { ...progress, attemptHistory: newAttemptHistory },
      currentQuestion.topic,
      questions,
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

    // Reveal Next BEFORE the FSRS bookkeeping. If applyReview throws (corrupt
    // state, unknown concept id, etc.) the user can still advance — losing one
    // concept update is acceptable; stranding the user on the just-answered
    // question is not.
    setShowNextButton(true);
    setSessionStats({
      answered: sessionStats.answered + 1,
      correct: sessionStats.correct + (isCorrect ? 1 : 0),
    });

    // Auto-grade from response time + correctness (a 4-second MCQ pass weighs more
    // than a 30-second one; envelopes are per-question-type in conceptSRS).
    const rawGrade = gradeFromResponseTime(currentQuestion.type, timeSpent, isCorrect);
    // A hint-assisted pass can never earn a full-confidence interval bump.
    const cardGrade = SpacedRepetitionSystem.capGradeForHints(rawGrade, hintTierUsed);

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

  const startQuiz = (course?: Course) => {
    const targetCourse = course || activeCourse;
    if (course) {
      setActiveCourse(course);
    }
    // Reset filters when switching courses so topic filters don't block
    setFilters({
      topics: Object.values(Topic),
      difficulties: Object.values(Difficulty),
      questionTypes: Object.values(QuestionType),
    });
    // Compute questions for the target course directly (state hasn't flushed yet).
    // Build a fresh policy from targetCourse — selectionPolicy useMemo hasn't
    // updated yet for this render either.
    const pool = questions.filter(q => getCourseForTopic(q.topic) === targetCourse);
    const targetPolicy = getSelectionPolicy(targetCourse);
    const next = SpacedRepetitionSystem.selectNextQuestion(pool, progress, conceptCtx, targetPolicy, cardDifficulty);
    setCurrentQuestion(next);
    setQuestionStartTime(Date.now());
    setShowNextButton(false);
    changeView('quiz');
    setSessionStats({ answered: 0, correct: 0 });
  };

  const renderQuestion = () => {
    if (!currentQuestion) {
      // selectNextQuestion returned null — the unlocked pool is empty under
      // current filters. Tell the user clearly and offer a way out.
      return (
        <div className="empty-pool-message" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>You're all caught up.</h3>
          <p style={{ opacity: 0.75, marginBottom: '1rem' }}>
            No questions match your current filters in this course's unlocked sections.
            Try resetting filters or switching courses.
          </p>
          <button className="next-button" onClick={resetFilters}>
            Reset filters
          </button>
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
          onNext={showNextButton ? loadNextQuestion : undefined}
          showHints={true}
        />
      );
    } else if (currentQuestion.type === QuestionType.PARSONS) {
      return (
        <ParsonsQuestion
          key={renderKey}
          question={currentQuestion}
          onAnswer={handleAnswer}
          onNext={showNextButton ? loadNextQuestion : undefined}
          showHints={true}
        />
      );
    } else if (currentQuestion.type === QuestionType.PREDICT_OUTPUT) {
      return (
        <PredictOutputQuestion
          key={renderKey}
          question={currentQuestion}
          onAnswer={handleAnswer}
          onNext={showNextButton ? loadNextQuestion : undefined}
          showHints={true}
        />
      );
    } else if (currentQuestion.type === QuestionType.CLOZE_CODE) {
      return (
        <ClozeCodeQuestion
          key={renderKey}
          question={currentQuestion}
          onAnswer={handleAnswer}
          onNext={showNextButton ? loadNextQuestion : undefined}
          showHints={true}
        />
      );
    } else {
      return (
        <CodingQuestion
          key={renderKey}
          question={currentQuestion}
          onAnswer={handleAnswer}
          onNext={showNextButton ? loadNextQuestion : undefined}
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

      setMisconceptions(prev => ({
        events: prev.events.filter(e => !courseQuestionIds.has(e.questionId)),
      }));
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
    if (!topic) return { pct: '0', correct: 0, total: 0, topicName: '', coverage: '' };

    const topicAttempts = recentAttempts(
      progress.attemptHistory.filter(a => questionTopicMap.get(a.questionId) === topic),
      RECENT_WINDOW,
    );

    const correct = topicAttempts.filter(a => a.isCorrect).length;
    const total = topicAttempts.length;
    const accuracyPct = total >= RECENT_WINDOW ? pct(correct, total).toFixed(0) : 'New';
    const topicName = topic.replace(/_/g, ' ');

    // Coverage: unique questions attempted / total questions in topic
    const topicQuestions = questions.filter(q => q.topic === topic);
    const attemptedInTopic = new Set(
      progress.attemptHistory
        .filter(a => questionTopicMap.get(a.questionId) === topic)
        .map(a => a.questionId)
    );
    const coveragePct = Math.round(pct(attemptedInTopic.size, topicQuestions.length));
    const coverage = `${attemptedInTopic.size}/${topicQuestions.length}`;

    return { pct: accuracyPct, correct, total, topicName, coverage, coveragePct };
  }, [progress.attemptHistory, currentQuestion, questionTopicMap]);

  // Review/new-topic mode + due drain-queue size, for the breadcrumb mode pill.
  const reviewStatus = useMemo(
    () => SpacedRepetitionSystem.getReviewStatus(getFilteredQuestions(), progress, selectionPolicy, cardDifficulty),
    [getFilteredQuestions, progress, selectionPolicy, cardDifficulty],
  );

  // Per-topic measured difficulty (avg auto-graded FSRS difficulty of its drain
  // cards) → easy/medium/hard label for the current topic. Null until graded.
  const topicDifficulty = useMemo(() => {
    const topic = currentQuestion?.topic;
    if (!topic) return null;
    const tq = questions.filter(q => q.topic === topic);
    return SpacedRepetitionSystem.getTopicDifficulty(tq, cardDifficulty);
  }, [currentQuestion, cardDifficulty]);

  // Review cards due in the CURRENT topic (the pill's count). Scoped to where
  // the learner is — 0 while a topic is still new/in-review, rising once it's
  // mastered and its cards age past their review intervals.
  const topicReviewCount = useMemo(() => {
    const topic = currentQuestion?.topic;
    if (!topic) return 0;
    const tq = questions.filter(q => q.topic === topic);
    return SpacedRepetitionSystem.getTopicDueReviewCount(tq, progress, cardDifficulty);
  }, [currentQuestion, progress, cardDifficulty]);

  // Whether the card on screen was unseen when it was served. Deliberately
  // memoized on the question alone: answering it adds it to questionsAttempted,
  // and recomputing then would flip the pill to "Review" mid-card.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isUnseenCard = useMemo(
    () => !!currentQuestion && !progress.questionsAttempted.has(currentQuestion.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentQuestion]
  );

  // Pill mode reflects the CURRENT card, not the global bank state. The old
  // check (any unseen question anywhere in the course) made "New topic" the
  // permanent default mid-course, even while answering review cards.
  const pillMode: 'drain' | 'new' | 'review' =
    reviewStatus.mode === 'drain' ? 'drain' : isUnseenCard ? 'new' : 'review';

  // Number on the mode pill. While DRAINING it's the global drain-queue
  // countdown (falls by one per correct answer, holds on a miss) - the
  // per-topic due count would jump around as the drain serves cards from
  // different topics. Outside a drain it's the current topic's due count.
  const modePillCount = pillMode === 'drain'
    ? reviewStatus.drainQueueCount
    : topicReviewCount;

  const overallRecentAccuracy = useMemo(() => {
    const recent = recentAttempts(progress.attemptHistory, RECENT_WINDOW);
    const correct = recent.filter(a => a.isCorrect).length;
    return pct(correct, recent.length).toFixed(1);
  }, [progress.attemptHistory]);

  // Per-course aggregate stats for the course-switcher tiles on the home view.
  const courseStats = useMemo(() => {
    const out: Record<Course, { seen: number; total: number; coveragePct: number; recentPct: number; recentTotal: number }> = {
      [Course.DATABRICKS]: { seen: 0, total: 0, coveragePct: 0, recentPct: 0, recentTotal: 0 },
      [Course.WEB_DEV]: { seen: 0, total: 0, coveragePct: 0, recentPct: 0, recentTotal: 0 },
      [Course.BACKEND]: { seen: 0, total: 0, coveragePct: 0, recentPct: 0, recentTotal: 0 },
      [Course.DATA_ENGINEERING]: { seen: 0, total: 0, coveragePct: 0, recentPct: 0, recentTotal: 0 },
      [Course.SQL]: { seen: 0, total: 0, coveragePct: 0, recentPct: 0, recentTotal: 0 },
    };
    const idToCourse = new Map<string, Course>();
    questions.forEach(q => {
      const c = getCourseForTopic(q.topic);
      idToCourse.set(q.id, c);
      out[c].total += 1;
    });
    progress.questionsAttempted.forEach(id => {
      const c = idToCourse.get(id);
      if (c) out[c].seen += 1;
    });
    const recentByCourse: Record<Course, { correct: number; total: number }> = {
      [Course.DATABRICKS]: { correct: 0, total: 0 },
      [Course.WEB_DEV]: { correct: 0, total: 0 },
      [Course.BACKEND]: { correct: 0, total: 0 },
      [Course.DATA_ENGINEERING]: { correct: 0, total: 0 },
      [Course.SQL]: { correct: 0, total: 0 },
    };
    for (const a of progress.attemptHistory) {
      const c = idToCourse.get(a.questionId);
      if (!c) continue;
      const bucket = recentByCourse[c];
      bucket.total += 1;
      if (a.isCorrect) bucket.correct += 1;
    }
    (Object.keys(out) as Course[]).forEach(c => {
      out[c].coveragePct = Math.round(pct(out[c].seen, out[c].total));
      const r = recentByCourse[c];
      const window = Math.min(r.total, RECENT_WINDOW);
      out[c].recentPct = window > 0 ? Math.round(pct(r.correct, r.total) ) : 0;
      out[c].recentTotal = r.total;
    });
    return out;
  }, [progress.questionsAttempted, progress.attemptHistory]);

  // Path overview for the active course — computes section status (mastered /
  // current / locked) plus current-section topic breakdown so the home view
  // can show "where you are" and which topics are still locked.
  const coursePath = useMemo(() => {
    const pathOrder =
      activeCourse === Course.WEB_DEV ? WEBDEV_PATH_ORDER
      : activeCourse === Course.BACKEND ? BACKEND_PATH_ORDER
      : activeCourse === Course.DATABRICKS ? DATABRICKS_PATH_ORDER
      : activeCourse === Course.SQL ? SQL_PATH_ORDER
      : DATA_ENG_PATH_ORDER;

    const sections =
      activeCourse === Course.WEB_DEV ? WEBDEV_SECTIONS
      : activeCourse === Course.BACKEND ? BACKEND_SECTIONS
      : activeCourse === Course.DATABRICKS ? DATABRICKS_SECTIONS
      : activeCourse === Course.SQL ? SQL_SECTIONS
      : DATA_ENG_SECTIONS;

    const unlocked = SpacedRepetitionSystem.getUnlockedSections(courseQuestions, progress);
    const unlockedSet = unlocked?.sections ?? new Set<string>([pathOrder[0]]);
    const unlockedTopics = SpacedRepetitionSystem.getUnlockedTopics(courseQuestions, progress) ?? new Set<string>();

    type SectionStatus = 'mastered' | 'current' | 'locked';
    type SectionRow = {
      name: string;
      status: SectionStatus;
      seen: number;
      total: number;
      pct: number;
      recentPct: number;
      units: Array<{
        displayName: string;
        topicKeys: string[];
        seen: number;
        total: number;
        recentPct: number;
        unlocked: boolean;
        coveragePct: number;
      }>;
    };

    const rows: SectionRow[] = [];
    let currentFound = false;

    for (const sectionName of pathOrder) {
      const section = sections[sectionName];
      if (!section) continue;
      const allKeys = new Set(Object.values(section.topics).flat());
      const sectionQs = courseQuestions.filter(q => allKeys.has(q.topic));
      const total = sectionQs.length;
      let seen = 0;
      sectionQs.forEach(q => { if (progress.questionsAttempted.has(q.id)) seen += 1; });
      const sectionIds = new Set(sectionQs.map(q => q.id));
      const sectionAttempts = progress.attemptHistory.filter(a => sectionIds.has(a.questionId));
      const recent = recentAttempts(sectionAttempts, RECENT_WINDOW);
      const recentCorrect = recent.filter(a => a.isCorrect).length;
      const recentPct = recent.length > 0 ? Math.round(pct(recentCorrect, recent.length)) : 0;

      const isUnlocked = unlockedSet.has(sectionName);
      let status: SectionStatus;
      if (!isUnlocked) {
        status = 'locked';
      } else if (currentFound) {
        // A later unlocked section after the current one means the current was
        // mastered — but we want exactly one "current" badge. Treat any further
        // unlocked sections as current too is wrong; instead the LAST unlocked
        // section is "current" and earlier unlocked sections are "mastered".
        status = 'current';
      } else {
        status = 'current';
        currentFound = true;
      }

      const units = getSectionUnits(sectionName).map(([displayName, topicKeys]) => {
        const unitQs = courseQuestions.filter(q => topicKeys.includes(q.topic));
        let unitSeen = 0;
        unitQs.forEach(q => { if (progress.questionsAttempted.has(q.id)) unitSeen += 1; });
        const unitIds = new Set(unitQs.map(q => q.id));
        const unitAttempts = progress.attemptHistory.filter(a => unitIds.has(a.questionId));
        const unitRecent = recentAttempts(unitAttempts, RECENT_WINDOW);
        const unitRecentCorrect = unitRecent.filter(a => a.isCorrect).length;
        const unitRecentPct = unitRecent.length > 0 ? Math.round(pct(unitRecentCorrect, unitRecent.length)) : 0;
        const unitUnlocked = topicKeys.some(t => unlockedTopics.has(t));
        const unitCoverage = unitQs.length > 0 ? Math.round(pct(unitSeen, unitQs.length)) : 0;
        return {
          displayName,
          topicKeys,
          seen: unitSeen,
          total: unitQs.length,
          recentPct: unitRecentPct,
          unlocked: unitUnlocked,
          coveragePct: unitCoverage,
        };
      });

      rows.push({
        name: sectionName,
        status,
        seen,
        total,
        pct: total > 0 ? Math.round(pct(seen, total)) : 0,
        recentPct,
        units,
      });
    }

    // Promote earlier unlocked sections to "mastered" — keep only the last
    // unlocked section as "current".
    let lastCurrentIdx = -1;
    rows.forEach((r, i) => { if (r.status === 'current') lastCurrentIdx = i; });
    rows.forEach((r, i) => {
      if (r.status === 'current' && i < lastCurrentIdx) r.status = 'mastered';
    });

    const currentSection = rows.find(r => r.status === 'current');
    const nextLocked = rows.find(r => r.status === 'locked');

    return { rows, currentSection, nextLocked };
  }, [activeCourse, courseQuestions, progress]);

  const isReturningUser = profile.totalSessions > 1 || progress.questionsAttempted.size > 0;

  // Get theme class based on active course
  const getThemeClass = () => {
    switch (activeCourse) {
      case Course.DATABRICKS:
        return 'theme-databricks';
      case Course.WEB_DEV:
        return 'theme-webdev';
      case Course.BACKEND:
        return 'theme-backend';
      case Course.DATA_ENGINEERING:
        return 'theme-dataeng';
      case Course.SQL:
        return 'theme-sql';
      default:
        return 'theme-webdev';
    }
  };

  return (
    <div className={`App ${getThemeClass()}`}>
      <h1 className="sr-only">Recall — multi-course learning platform</h1>

      {/* ── Simplified Header: brand + stats ── */}
      <header className="app-header">
        <div className="header-left">
          <button
            className="menu-toggle"
            onClick={() => setRailCollapsed(!railCollapsed)}
            aria-label="Toggle navigation"
            title="Toggle navigation"
          >
            <ListChecks size={20} />
          </button>
          <div className="app-brand">
            <span className="app-brand-mark" role="img" aria-label="Recall logo">
              🐘
            </span>
            <span className="app-brand-name">Recall</span>
          </div>
        </div>
        <div className="header-right">
          <span className="header-stat" title="Current streak">
            <Flame className="stat-icon" size={14} />
            {profile.currentStreak}
          </span>
          <span className="header-stat" title="Questions seen">
            <Eye className="stat-icon" size={14} />
            {validSeenCount}
          </span>
          <span className="header-stat" title="Recent accuracy">
            <Target className="stat-icon" size={14} />
            {overallRecentAccuracy}%
          </span>
          {staleTab && (
            <span className="header-note">Reload this tab to export the latest progress</span>
          )}
          <button
            className="header-action"
            onClick={exportProgress}
            disabled={!canExport}
            title={progressWritesBlocked
              ? 'Stored progress could not be read, so there is nothing to export yet'
              : staleTab
                ? 'Another tab saved newer answers; reload this tab to export the latest'
                : 'Save all your progress to a file'}
          >
            <Download size={14} />
            <span>Export</span>
          </button>
          <button
            className="header-action"
            onClick={() => importInputRef.current?.click()}
            title="Replace progress in this browser with an exported file"
          >
            <Upload size={14} />
            <span>Import</span>
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            data-testid="import-progress-input"
            style={{ display: 'none' }}
            onChange={e => { void importProgress(e.target.files); }}
          />
        </div>
      </header>

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
          Recall keeps {backupKeys.length === 1 ? 'a backup' : `${backupKeys.length} backups`} of progress it could not read.
          {' '}Export includes them.
          {backupKeys.map(k => (
            <React.Fragment key={k}>
              {' '}<button
                className="storage-banner-button"
                onClick={() => downloadTextFile(`${k.replace(/[:.]/g, '-')}.json`, localStorage.getItem(k) ?? '')}
              >
                Download backup {k.slice(PROGRESS_BACKUP_PREFIX.length)}
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
        <NavigationRail
          activeView={viewMode}
          activeCourse={activeCourse}
          onViewChange={(view) => {
            if (view === 'quiz') {
              startQuiz(activeCourse);
            } else {
              changeView(view);
            }
          }}
          onCourseChange={(course) => {
            if (viewMode === 'quiz') {
              // Mid-question course switch: swap the whole quiz context, not
              // just the theme — otherwise the old course's question lingers.
              startQuiz(course);
            } else {
              setActiveCourse(course);
            }
          }}
          collapsed={railCollapsed}
        />

        {/* Content Area */}
        <main className="content">
          <div className={`view-container ${transitionDirection} ${isTransitioning ? 'exiting' : 'entering'}`}>
          {viewMode === 'home' && (
            <div className="home-view">
              {(() => {
                const meta = COURSE_META[activeCourse];
                const stats = courseStats[activeCourse];
                const ActiveIcon = meta.Icon;
                const current = coursePath.currentSection;
                const nextLocked = coursePath.nextLocked;
                const courseSeen = stats.seen;
                const courseTotal = stats.total;
                const courseRecent = stats.recentTotal > 0 ? `${stats.recentPct}%` : 'New';

                // Get last active topic for "Continue Learning" CTA
                const lastAttempt = progress.attemptHistory.length > 0
                  ? progress.attemptHistory[progress.attemptHistory.length - 1]
                  : null;
                const lastTopic = lastAttempt
                  ? questions.find(q => q.id === lastAttempt.questionId)?.topic
                  : null;
                const lastTopicName = lastTopic?.replace(/_/g, ' ') || 'your journey';

                return (
                  <>
                    {/* Personalized greeting */}
                    <section className="welcome-section">
                      <h2 className="welcome-greeting">
                        {isReturningUser ? 'Welcome back!' : 'Welcome to Recall!'}
                      </h2>
                      <div className="welcome-stats">
                        <span className="welcome-stat">
                          <Flame size={16} />
                          {profile.currentStreak} day streak
                        </span>
                        <span className="welcome-stat-divider">·</span>
                        <span className="welcome-stat">
                          <Target size={16} />
                          {progress.questionsAttempted.size}/{questions.length} questions
                        </span>
                      </div>
                    </section>

                    {/* Continue Learning CTA */}
                    {isReturningUser && lastTopic && (
                      <section className="continue-learning-cta">
                        <div className="cta-content">
                          <div className="cta-header">
                            <BookOpen size={20} />
                            <div>
                              <div className="cta-label">Continue Learning</div>
                              <div className="cta-topic">{lastTopicName}</div>
                            </div>
                          </div>
                          <button className="cta-button" onClick={() => startQuiz(activeCourse)}>
                            Resume
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </section>
                    )}

                    {/* Course-specific hero */}
                    <section
                      className="course-hero"
                      style={{ ['--course-accent' as string]: meta.accent }}
                    >
                      <div className="course-hero-head">
                        <span className="course-hero-icon">
                          <ActiveIcon size={26} />
                        </span>
                        <div>
                          <div className="course-hero-eyebrow">
                            {isReturningUser ? 'Continue your path' : 'Start a new path'}
                          </div>
                          <h2 className="course-hero-title">{meta.label}</h2>
                        </div>
                      </div>
                      <p className="course-hero-tagline">{meta.tagline}</p>

                      <div className="course-hero-stats">
                        <div className="hero-stat">
                          <span className="hero-stat-value">{courseSeen}<span className="hero-stat-divider">/</span>{courseTotal}</span>
                          <span className="hero-stat-label">Questions seen</span>
                        </div>
                        <div className="hero-stat">
                          <span className="hero-stat-value">{courseRecent}</span>
                          <span className="hero-stat-label">Recent accuracy</span>
                        </div>
                        <div className="hero-stat">
                          <span className="hero-stat-value">{profile.currentStreak}</span>
                          <span className="hero-stat-label">Day streak</span>
                        </div>
                        <div className="hero-stat hero-stat-wide">
                          <span className="hero-stat-value hero-stat-section">
                            {current ? current.name : 'All caught up'}
                          </span>
                          <span className="hero-stat-label">Currently in</span>
                        </div>
                      </div>

                      <div className="course-hero-cta-row">
                        <button className="start-button" onClick={() => startQuiz(activeCourse)}>
                          {isReturningUser ? 'Continue learning' : 'Start learning'}
                          <ArrowRight className="start-button-icon" size={18} />
                        </button>
                        <button className="hero-link-btn" onClick={() => changeView('progress')}>
                          <Activity size={14} />
                          Detailed progress
                        </button>
                      </div>

                      {nextLocked && (
                        <div className="hero-locked-hint">
                          <Lock size={13} />
                          <span>
                            <strong>{nextLocked.name}</strong> unlocks once {current ? current.name : 'the current section'} reaches 100% coverage and 80%+ recent accuracy.
                          </span>
                        </div>
                      )}
                    </section>

                    {/* Course switcher tiles */}
                    <section className="course-switcher">
                      <h3 className="home-section-title">Switch course</h3>
                      <div className="course-tile-grid">
                        {(Object.keys(COURSE_META) as Course[]).map(course => {
                          const m = COURSE_META[course];
                          const s = courseStats[course];
                          const Icon = m.Icon;
                          const isActive = course === activeCourse;
                          return (
                            <button
                              key={course}
                              className={`course-tile ${isActive ? 'active' : ''}`}
                              style={{ ['--course-accent' as string]: m.accent }}
                              onClick={() => setActiveCourse(course)}
                            >
                              <div className="course-tile-head">
                                <span className="course-tile-icon">
                                  <Icon size={18} />
                                </span>
                                <span className="course-tile-label">{m.label}</span>
                                {isActive && <span className="course-tile-badge">Active</span>}
                              </div>
                              <div className="course-tile-bar">
                                <div
                                  className="course-tile-bar-fill"
                                  style={{ width: `${s.coveragePct}%` }}
                                />
                              </div>
                              <div className="course-tile-meta">
                                <span>{s.seen}/{s.total}</span>
                                <span className="course-tile-meta-sep">·</span>
                                <span>{s.recentTotal > 0 ? `${s.recentPct}% accuracy` : 'Not started'}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </section>

                    {/* Path overview — sections + topics with lock status */}
                    <section className="course-path">
                      <h3 className="home-section-title">Your learning path</h3>
                      <ol className="path-list">
                        {coursePath.rows.map((row, idx) => {
                          const StatusIcon =
                            row.status === 'mastered' ? CheckCircle2
                            : row.status === 'current' ? PlayCircle
                            : Lock;
                          return (
                            <li key={row.name} className={`path-row path-row-${row.status}`}>
                              <div className="path-row-head">
                                <span className="path-row-num">{String(idx + 1).padStart(2, '0')}</span>
                                <span className="path-row-status">
                                  <StatusIcon size={16} />
                                </span>
                                <span className="path-row-name">{row.name}</span>
                                <span className="path-row-stats">
                                  {row.total > 0 && (
                                    <>
                                      <span>{row.seen}/{row.total}</span>
                                      {row.status !== 'locked' && row.recentPct > 0 && (
                                        <>
                                          <span className="path-row-stats-sep">·</span>
                                          <span>{row.recentPct}%</span>
                                        </>
                                      )}
                                    </>
                                  )}
                                </span>
                              </div>
                              {row.status !== 'locked' && row.units.length > 0 && (
                                <ul className="path-units">
                                  {row.units.map(u => (
                                    <li
                                      key={u.displayName}
                                      className={`path-unit ${u.unlocked ? '' : 'locked'}`}
                                    >
                                      {u.unlocked
                                        ? (u.coveragePct === 100 && u.recentPct >= 80
                                          ? <CheckCircle2 size={12} />
                                          : <PlayCircle size={12} />)
                                        : <Lock size={12} />
                                      }
                                      <span className="path-unit-name">{u.displayName}</span>
                                      {u.total > 0 && (
                                        <span className="path-unit-meta">
                                          {u.seen}/{u.total}
                                        </span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {row.status === 'locked' && (
                                <div className="path-locked-note">
                                  Locked — finish the previous section to unlock {row.units.length} topics.
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    </section>
                  </>
                );
              })()}
            </div>
          )}

          {viewMode === 'quiz' && (
            <div className="quiz-view">
              {/* Breadcrumb bar */}
              {currentQuestion && (
                <div className="quiz-breadcrumb">
                  <button className="breadcrumb-back" onClick={() => changeView('home')}>
                    <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
                    Back
                  </button>
                  <div className="breadcrumb-info">
                    <span className="breadcrumb-topic">
                      {currentQuestion.topic.replace(/_/g, ' ')}
                    </span>
                    <span className="breadcrumb-meta">
                      {topicAccuracy.coverage} · {topicAccuracy.pct === 'New' ? 'new topic' : `${topicAccuracy.pct}% recent`}
                    </span>
                  </div>
                  <span
                    className={`mode-pill mode-pill-${pillMode}`}
                    title={
                      pillMode === 'drain'
                        ? `${modePillCount} coding/advanced card${modePillCount === 1 ? '' : 's'} left in the review drain before the next topic.`
                        : pillMode === 'new'
                        ? 'First time seeing this question.'
                        : modePillCount > 0
                        ? `${modePillCount} review card${modePillCount === 1 ? '' : 's'} due in this topic.`
                        : 'Revisiting a question you have seen before.'
                    }
                  >
                    {pillMode === 'drain'
                      ? 'Review drain'
                      : pillMode === 'new'
                      ? 'New'
                      : 'Review'}
                    {modePillCount > 0 && (
                      <span className="mode-pill-count">{modePillCount}</span>
                    )}
                  </span>
                  {topicDifficulty && (
                    <span
                      className={`topic-diff-pill topic-diff-${topicDifficulty.label}`}
                      title={`Measured topic difficulty: ${topicDifficulty.label} (avg FSRS difficulty ${topicDifficulty.avg.toFixed(1)}/10). Harder topics come due for review sooner.`}
                    >
                      {topicDifficulty.label}
                    </span>
                  )}
                  <button
                    className="breadcrumb-filter"
                    onClick={() => setShowFilters(!showFilters)}
                    title={showFilters ? 'Hide filters' : 'Show filters'}
                  >
                    <Filter size={16} />
                  </button>
                </div>
              )}

              {/* Topic progress bar */}
              {currentQuestion && topicAccuracy.coverage !== 'New' && (
                <div className="topic-progress-bar">
                  <div
                    className="topic-progress-fill"
                    style={{
                      width: `${topicAccuracy.coveragePct ?? 0}%`,
                      background: topicAccuracy.pct !== 'New' && parseInt(topicAccuracy.pct) >= 80
                        ? 'var(--success)'
                        : 'var(--primary)'
                    }}
                  />
                </div>
              )}

              {showFilters && (
                <QuestionFilter
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={resetFilters}
                  activeCourse={activeCourse}
                />
              )}

              <QuestionErrorBoundary onSkip={loadNextQuestion}>
                {renderQuestion()}
              </QuestionErrorBoundary>

              {showNextButton && (
                <div className="next-button-container">
                  <button className="next-button" onClick={loadNextQuestion}>
                    Next question
                    <ArrowRight className="next-button-icon" size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {viewMode === 'progress' && (
            <div className="progress-view">
              {/* Tab Navigation */}
              <div className="progress-tabs">
                <button
                  className={`progress-tab ${activeProgressTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveProgressTab('overview')}
                >
                  <TrendingUp size={16} />
                  Overview
                </button>
                <button
                  className={`progress-tab ${activeProgressTab === 'topics' ? 'active' : ''}`}
                  onClick={() => setActiveProgressTab('topics')}
                >
                  <BookOpen size={16} />
                  By Topic
                </button>
                <button
                  className={`progress-tab ${activeProgressTab === 'heatmap' ? 'active' : ''}`}
                  onClick={() => setActiveProgressTab('heatmap')}
                >
                  <Activity size={16} />
                  Activity
                </button>
              </div>

              {/* Tab Content */}
              <div className="progress-tab-content">
                {activeProgressTab === 'overview' && (
                  <div className="tab-panel">
                    {/* The dashboard that's already in ProgressTracker */}
                    <ProgressTracker
                      progress={progress}
                      questions={courseQuestions}
                      course={activeCourse}
                      misconceptions={misconceptions}
                      onReviewTopic={handleReviewWeakTopic}
                    />
                  </div>
                )}

                {activeProgressTab === 'topics' && (
                  <div className="tab-panel">
                    {/* Detailed topic breakdown */}
                    <ProgressTracker
                      progress={progress}
                      questions={courseQuestions}
                      course={activeCourse}
                      misconceptions={misconceptions}
                      onReviewTopic={handleReviewWeakTopic}
                    />
                  </div>
                )}

                {activeProgressTab === 'heatmap' && (
                  <div className="tab-panel">
                    <h3 style={{ marginBottom: 'var(--space-lg)', color: 'var(--text)' }}>Learning Activity</h3>
                    {/* Heatmap is already inside ProgressTracker, we'll show just that section */}
                    <ProgressTracker
                      progress={progress}
                      questions={courseQuestions}
                      course={activeCourse}
                      misconceptions={misconceptions}
                    />
                  </div>
                )}
              </div>

              <div className="progress-actions">
                <button className="reset-button-danger" onClick={resetProgress}>
                  Reset {COURSE_META[activeCourse]?.label ?? 'Course'} Progress
                </button>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
