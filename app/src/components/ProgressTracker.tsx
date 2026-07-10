import React, { useState, useMemo } from 'react';
import { UserProgress, Question, Course, MisconceptionStore } from '../types';
import { DATABRICKS_SECTIONS, WEBDEV_SECTIONS, BACKEND_SECTIONS, DATA_ENG_SECTIONS, SQL_SECTIONS, getTopicKeysForSection } from '../utils/courseConfig';
import { MISCONCEPTIONS } from '../data/misconceptions';
import {
  SpacedRepetitionSystem,
  UNLOCK_COVERAGE_PCT,
  UNLOCK_ACCURACY_PCT,
  RECENT_WINDOW,
  WEAK_AREA_PCT,
  STRONG_AREA_PCT,
  MIN_ATTEMPTS_FOR_STATS,
  BAR_GOOD_PCT,
  BAR_OK_PCT,
  pct,
  recentAttempts,
} from '../utils/spacedRepetition';
import { CircularProgress } from './CircularProgress';
import { HeatmapCalendar } from './HeatmapCalendar';
import './ProgressTracker.css';

interface Props {
  progress: UserProgress;
  questions: Question[];
  course: Course;
  // Optional. When omitted, the misconception panel is hidden.
  misconceptions?: MisconceptionStore;
}

interface TopicAnalysis {
  topic: string;
  topicKey: string;
  firstAttemptCorrect: number;
  firstAttemptTotal: number;
  firstAttemptPct: number;
  recentCorrect: number;
  recentTotal: number;
  recentPct: number;
  // latest-per-question: what the unlock gate actually uses.
  // For each distinct question attempted, was the most recent attempt correct?
  latestCorrect: number;
  latestTotal: number;
  latestPct: number;
  totalAttempts: number;
  struggleQuestions: number; // questions whose latest attempt was wrong (current struggle)
  avgAttemptsToPass: number;
}

export const ProgressTracker: React.FC<Props> = ({ progress, questions, course, misconceptions }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Use course-specific section config
  const examSections = course === Course.DATABRICKS
    ? DATABRICKS_SECTIONS
    : course === Course.WEB_DEV
    ? WEBDEV_SECTIONS
    : course === Course.BACKEND
    ? BACKEND_SECTIONS
    : course === Course.SQL
    ? SQL_SECTIONS
    : DATA_ENG_SECTIONS;

  // Use the same gating logic that the question selector enforces, so the UI
  // can't disagree with what the user is actually allowed to practice.
  const { unlockedSections, unlockedTopics, pathOrder } = useMemo(() => {
    const result = SpacedRepetitionSystem.getUnlockedSections(questions, progress);
    return {
      unlockedSections: result?.sections ?? null,
      unlockedTopics: SpacedRepetitionSystem.getUnlockedTopics(questions, progress),
      pathOrder: result?.pathOrder ?? [],
    };
  }, [questions, progress]);

  // Flatten for backward compat — build topicCategories from examSections
  const topicCategories: Record<string, string[]> = {};
  for (const section of Object.values(examSections)) {
    for (const [name, topicKeys] of Object.entries(section.topics)) {
      topicCategories[name] = topicKeys;
    }
  }

  // Build a map from questionId -> topic
  const questionTopicMap = useMemo(() => {
    const map = new Map<string, string>();
    questions.forEach(q => map.set(q.id, q.topic));
    return map;
  }, [questions]);

  // Compute per-topic analysis from attempt history (filtered to current course)
  const topicAnalysis = useMemo((): Map<string, TopicAnalysis> => {
    // Only include attempts for questions in the current course
    const courseQuestionIds = new Set(questions.map(q => q.id));

    // Group attempts by question
    const byQuestion = new Map<string, typeof progress.attemptHistory>();
    for (const attempt of progress.attemptHistory) {
      if (!courseQuestionIds.has(attempt.questionId)) continue;
      const existing = byQuestion.get(attempt.questionId) || [];
      existing.push(attempt);
      byQuestion.set(attempt.questionId, existing);
    }

    // Group by topic
    const byTopic = new Map<string, {
      firstAttempts: { correct: boolean }[];
      latestAttempts: { correct: boolean }[]; // one per distinct question: its latest
      allAttempts: { correct: boolean; timestamp: number }[];
      questionAttemptCounts: number[]; // attempts per question before first correct (avg-attempts stat)
      currentlyStruggling: number; // count of questions whose latest attempt was wrong
    }>();

    byQuestion.forEach((attempts, questionId) => {
      const topic = questionTopicMap.get(questionId);
      if (!topic) return;

      const sorted = [...attempts].sort((a, b) => a.timestamp - b.timestamp);
      const topicData = byTopic.get(topic) || {
        firstAttempts: [],
        latestAttempts: [],
        allAttempts: [],
        questionAttemptCounts: [],
        currentlyStruggling: 0,
      };

      // First attempt for this question
      topicData.firstAttempts.push({ correct: sorted[0].isCorrect });

      // Latest attempt for this question (drives the unlock gate)
      const latestCorrect = sorted[sorted.length - 1].isCorrect;
      topicData.latestAttempts.push({ correct: latestCorrect });

      // Currently struggling = latest attempt was wrong (regardless of history)
      if (!latestCorrect) {
        topicData.currentlyStruggling++;
      }

      // All attempts
      for (const a of sorted) {
        topicData.allAttempts.push({ correct: a.isCorrect, timestamp: a.timestamp });
      }

      // How many attempts before first correct (or total if never correct) — used by avg-attempts stat
      const firstCorrectIdx = sorted.findIndex(a => a.isCorrect);
      topicData.questionAttemptCounts.push(
        firstCorrectIdx >= 0 ? firstCorrectIdx + 1 : sorted.length
      );

      byTopic.set(topic, topicData);
    });

    // Build analysis
    const analysis = new Map<string, TopicAnalysis>();

    byTopic.forEach((data, topicKey) => {
      const firstCorrect = data.firstAttempts.filter(a => a.correct).length;
      const firstTotal = data.firstAttempts.length;

      const latestCorrect = data.latestAttempts.filter(a => a.correct).length;
      const latestTotal = data.latestAttempts.length;

      const chronological = [...data.allAttempts].sort((a, b) => a.timestamp - b.timestamp);
      const recent = recentAttempts(chronological, RECENT_WINDOW);
      const recentCorrect = recent.filter(a => a.correct).length;
      const recentTotal = recent.length;

      const struggleQuestions = data.currentlyStruggling;
      const totalAttemptsToPass = data.questionAttemptCounts.reduce((s, c) => s + c, 0);
      const avgAttempts = data.questionAttemptCounts.length > 0
        ? totalAttemptsToPass / data.questionAttemptCounts.length
        : 0;

      analysis.set(topicKey, {
        topic: topicKey.replace(/_/g, ' '),
        topicKey,
        firstAttemptCorrect: firstCorrect,
        firstAttemptTotal: firstTotal,
        firstAttemptPct: pct(firstCorrect, firstTotal),
        recentCorrect,
        recentTotal,
        recentPct: pct(recentCorrect, recentTotal),
        latestCorrect,
        latestTotal,
        latestPct: pct(latestCorrect, latestTotal),
        totalAttempts: data.allAttempts.length,
        struggleQuestions,
        avgAttemptsToPass: avgAttempts,
      });
    });

    return analysis;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.attemptHistory, questionTopicMap]);

  // Compute overall stats from attempt history (filtered to current course)
  const overallStats = useMemo(() => {
    const courseQuestionIds = new Set(questions.map(q => q.id));
    const courseHistory = progress.attemptHistory.filter(a => courseQuestionIds.has(a.questionId));

    const byQuestion = new Map<string, typeof courseHistory>();
    for (const attempt of courseHistory) {
      const existing = byQuestion.get(attempt.questionId) || [];
      existing.push(attempt);
      byQuestion.set(attempt.questionId, existing);
    }

    let firstAttemptCorrect = 0;
    let firstAttemptTotal = 0;

    byQuestion.forEach(attempts => {
      const sorted = [...attempts].sort((a, b) => a.timestamp - b.timestamp);
      firstAttemptTotal++;
      if (sorted[0].isCorrect) firstAttemptCorrect++;
    });

    const recentSlice = recentAttempts(courseHistory, RECENT_WINDOW);
    const recentCorrect = recentSlice.filter(a => a.isCorrect).length;
    const recentTotal = recentSlice.length;

    return {
      firstAttemptCorrect,
      firstAttemptTotal,
      firstAttemptPct: pct(firstAttemptCorrect, firstAttemptTotal),
      recentPct: pct(recentCorrect, recentTotal),
      totalAttempts: courseHistory.length,
      uniqueQuestions: byQuestion.size,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.attemptHistory, questions]);

  // Count total questions per topic key
  const questionsPerTopic = useMemo(() => {
    const counts = new Map<string, number>();
    questions.forEach(q => {
      counts.set(q.topic, (counts.get(q.topic) || 0) + 1);
    });
    return counts;
  }, [questions]);

  const getCategoryAnalysis = (category: string) => {
    const topicKeys = topicCategories[category] || [];
    const topics: TopicAnalysis[] = [];

    for (const key of topicKeys) {
      const analysis = topicAnalysis.get(key);
      if (analysis) topics.push(analysis);
    }

    const firstCorrect = topics.reduce((s, t) => s + t.firstAttemptCorrect, 0);
    const firstTotal = topics.reduce((s, t) => s + t.firstAttemptTotal, 0);
    const recentCorrect = topics.reduce((s, t) => s + t.recentCorrect, 0);
    const recentTotal = topics.reduce((s, t) => s + t.recentTotal, 0);
    const latestCorrect = topics.reduce((s, t) => s + t.latestCorrect, 0);
    const latestTotal = topics.reduce((s, t) => s + t.latestTotal, 0);
    const struggleQuestions = topics.reduce((s, t) => s + t.struggleQuestions, 0);

    // Coverage: unique questions attempted / total questions in these topics
    const totalQuestionsInCategory = topicKeys.reduce(
      (s, key) => s + (questionsPerTopic.get(key) || 0), 0
    );
    const coveragePct = pct(firstTotal, totalQuestionsInCategory);

    return {
      firstAttemptPct: pct(firstCorrect, firstTotal),
      recentPct: pct(recentCorrect, recentTotal),
      latestPct: pct(latestCorrect, latestTotal),
      firstCorrect,
      firstTotal,
      recentCorrect,
      recentTotal,
      latestCorrect,
      latestTotal,
      struggleQuestions,
      topics,
      coveragePct,
      totalQuestions: totalQuestionsInCategory,
    };
  };

  const weakAreas = useMemo(() => {
    const weak: { category: string; pct: number; struggles: number }[] = [];
    for (const category of Object.keys(topicCategories)) {
      const stats = getCategoryAnalysis(category);
      if (stats.recentTotal >= MIN_ATTEMPTS_FOR_STATS && stats.recentPct < WEAK_AREA_PCT) {
        weak.push({
          category,
          pct: stats.recentPct,
          struggles: stats.struggleQuestions,
        });
      }
    }
    return weak.sort((a, b) => a.pct - b.pct);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicAnalysis]);

  const strongAreas = useMemo(() => {
    const strong: { category: string; pct: number }[] = [];
    for (const category of Object.keys(topicCategories)) {
      const stats = getCategoryAnalysis(category);
      if (stats.recentTotal >= MIN_ATTEMPTS_FOR_STATS && stats.recentPct >= STRONG_AREA_PCT) {
        strong.push({ category, pct: stats.recentPct });
      }
    }
    return strong.sort((a, b) => b.pct - a.pct);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicAnalysis]);

  // Top misconceptions: aggregate the event log by tag, sort by hit count.
  // Only show misconceptions that exist in the registry — defends against tag
  // typos in question authoring (the option's tag wouldn't have a name to
  // display, so we drop it).
  const topMisconceptions = useMemo(() => {
    if (!misconceptions || misconceptions.events.length === 0) return [];
    const counts = new Map<string, { count: number; lastSeen: number }>();
    for (const ev of misconceptions.events) {
      const cur = counts.get(ev.tag) ?? { count: 0, lastSeen: 0 };
      cur.count += 1;
      cur.lastSeen = Math.max(cur.lastSeen, ev.timestamp);
      counts.set(ev.tag, cur);
    }
    return Array.from(counts.entries())
      .filter(([tag]) => MISCONCEPTIONS[tag] !== undefined)
      .map(([tag, c]) => ({
        tag,
        name: MISCONCEPTIONS[tag].name,
        description: MISCONCEPTIONS[tag].description,
        count: c.count,
        lastSeen: c.lastSeen,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [misconceptions]);

  const getBarColor = (value: number) => {
    if (value >= BAR_GOOD_PCT) return 'linear-gradient(90deg, #10b981, #34d399)';
    if (value >= BAR_OK_PCT) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    return 'linear-gradient(90deg, #f43f5e, #fb7185)';
  };

  const getTrendArrow = (firstPct: number, recentPct: number) => {
    const diff = recentPct - firstPct;
    if (diff > 10) return { arrow: '↑', color: '#34d399', label: 'Improving' };
    if (diff < -10) return { arrow: '↓', color: '#fb7185', label: 'Declining' };
    return { arrow: '→', color: '#fbbf24', label: 'Steady' };
  };

  // Calculate overall mastery: percentage of questions with correct latest attempt
  const overallMastery = useMemo(() => {
    const totalQuestions = questions.length;
    const courseQuestionIds = new Set(questions.map(q => q.id));

    // Group by question and check latest attempt
    const byQuestion = new Map<string, typeof progress.attemptHistory>();
    for (const attempt of progress.attemptHistory) {
      if (!courseQuestionIds.has(attempt.questionId)) continue;
      const existing = byQuestion.get(attempt.questionId) || [];
      existing.push(attempt);
      byQuestion.set(attempt.questionId, existing);
    }

    let masteredCount = 0;
    byQuestion.forEach(attempts => {
      const sorted = [...attempts].sort((a, b) => a.timestamp - b.timestamp);
      if (sorted[sorted.length - 1].isCorrect) masteredCount++;
    });

    return {
      percentage: pct(masteredCount, totalQuestions),
      masteredQuestions: masteredCount,
      totalQuestions,
    };
  }, [progress.attemptHistory, questions]);

  // Generate smart insights based on progress data
  const smartInsights = useMemo(() => {
    const insights: string[] = [];

    // Strongest area
    if (strongAreas.length > 0) {
      const top = strongAreas[0];
      insights.push(`You're strongest in ${top.category.replace(/_/g, ' ')} (${top.pct.toFixed(0)}%)`);
    }

    // Next unlock target
    if (unlockedSections && pathOrder.length > 0) {
      const nextSection = pathOrder.find(s => !unlockedSections.has(s));
      if (nextSection && examSections[nextSection]) {
        insights.push(`Focus on unlocking: ${nextSection}`);
      }
    }

    // Almost mastered topics (90-94%)
    const almostMastered = Array.from(topicAnalysis.values()).filter(
      t => t.latestPct >= 90 && t.latestPct < 95 && t.latestTotal >= 5
    );
    if (almostMastered.length > 0) {
      const topic = almostMastered[0];
      const remaining = topic.latestTotal - topic.latestCorrect;
      insights.push(`${remaining} more question${remaining === 1 ? '' : 's'} to master ${topic.topic}`);
    }

    // Recent improvement
    const recentImprovements = Array.from(topicAnalysis.values()).filter(
      t => t.recentTotal >= 5 && (t.recentPct - t.firstAttemptPct) > 15
    );
    if (recentImprovements.length > 0) {
      insights.push(`Strong improvement in ${recentImprovements[0].topic} (+${(recentImprovements[0].recentPct - recentImprovements[0].firstAttemptPct).toFixed(0)}%)`);
    }

    return insights.slice(0, 3); // Max 3 insights
  }, [strongAreas, unlockedSections, pathOrder, examSections, topicAnalysis]);

  // Generate heatmap data from attempt history
  const heatmapData = useMemo(() => {
    const dailyCounts = new Map<string, number>();
    const courseQuestionIds = new Set(questions.map(q => q.id));

    progress.attemptHistory
      .filter(a => courseQuestionIds.has(a.questionId))
      .forEach(attempt => {
        const date = new Date(attempt.timestamp).toISOString().split('T')[0];
        dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
      });

    // Find max count for normalization
    const maxCount = Math.max(...Array.from(dailyCounts.values()), 1);

    return Array.from(dailyCounts.entries()).map(([date, count]) => ({
      date,
      count,
      intensity: Math.min(count / Math.max(maxCount * 0.5, 1), 1), // Normalize to 0-1
    }));
  }, [progress.attemptHistory, questions]);

  const getDifficultyStats = () => {
    // Build maps for the current course
    const questionDifficultyMap = new Map<string, string>();
    questions.forEach(q => questionDifficultyMap.set(q.id, q.difficulty));

    // Group attempts by question
    const attemptsByQuestion = new Map<string, { attempts: typeof progress.attemptHistory; difficulty: string }>();
    for (const attempt of progress.attemptHistory) {
      const difficulty = questionDifficultyMap.get(attempt.questionId);
      if (!difficulty) continue;
      const existing = attemptsByQuestion.get(attempt.questionId) || { attempts: [], difficulty };
      existing.attempts.push(attempt);
      attemptsByQuestion.set(attempt.questionId, existing);
    }

    // Compute first-try and recent accuracy per difficulty
    const diffCounts = new Map<string, { firstCorrect: number; firstTotal: number; recentCorrect: number; recentTotal: number }>();
    attemptsByQuestion.forEach(({ attempts, difficulty }) => {
      const sorted = [...attempts].sort((a, b) => a.timestamp - b.timestamp);
      const existing = diffCounts.get(difficulty) || { firstCorrect: 0, firstTotal: 0, recentCorrect: 0, recentTotal: 0 };

      // First try
      existing.firstTotal++;
      if (sorted[0].isCorrect) existing.firstCorrect++;

      // Most recent attempt
      const latest = sorted[sorted.length - 1];
      existing.recentTotal++;
      if (latest.isCorrect) existing.recentCorrect++;

      diffCounts.set(difficulty, existing);
    });

    const stats: { difficulty: string; firstCorrect: number; firstTotal: number; firstPct: number; recentCorrect: number; recentTotal: number; recentPct: number }[] = [];
    diffCounts.forEach((score, difficulty) => {
      stats.push({
        difficulty,
        firstCorrect: score.firstCorrect,
        firstTotal: score.firstTotal,
        firstPct: pct(score.firstCorrect, score.firstTotal),
        recentCorrect: score.recentCorrect,
        recentTotal: score.recentTotal,
        recentPct: pct(score.recentCorrect, score.recentTotal),
      });
    });
    return stats;
  };

  return (
    <div className="progress-tracker">
      <h2>Your Learning Progress</h2>

      {/* Dashboard Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-card">
          <div className="hero-progress">
            <CircularProgress
              percentage={overallMastery.percentage}
              size={160}
              strokeWidth={12}
              showLabel={false}
            />
            <div className="hero-progress-label">
              <div className="hero-percentage">{overallMastery.percentage.toFixed(0)}%</div>
              <div className="hero-label">Overall Mastery</div>
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-icon">📊</div>
              <div className="hero-stat-content">
                <div className="hero-stat-value">{overallMastery.masteredQuestions}/{overallMastery.totalQuestions}</div>
                <div className="hero-stat-label">Questions Mastered</div>
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-icon">🎓</div>
              <div className="hero-stat-content">
                <div className="hero-stat-value">{overallStats.recentPct.toFixed(0)}%</div>
                <div className="hero-stat-label">Recent Accuracy</div>
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-icon">🔥</div>
              <div className="hero-stat-content">
                <div className="hero-stat-value">{overallStats.totalAttempts}</div>
                <div className="hero-stat-label">Total Attempts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Insights */}
        {smartInsights.length > 0 && (
          <div className="insights-card">
            <h3>💡 Insights</h3>
            <ul className="insights-list">
              {smartInsights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Activity Heatmap */}
        {heatmapData.length > 0 && (
          <div className="heatmap-card">
            <h3>Activity Over Time</h3>
            <HeatmapCalendar data={heatmapData} weeks={26} />
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{overallStats.recentPct.toFixed(0)}%</div>
          <div className="stat-label">Recent Accuracy (last {RECENT_WINDOW})</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overallStats.uniqueQuestions}</div>
          <div className="stat-label">Questions Seen</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overallStats.firstAttemptPct.toFixed(0)}%</div>
          <div className="stat-label">First-Try Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overallStats.totalAttempts}</div>
          <div className="stat-label">Total Attempts</div>
        </div>
      </div>

      {/* Weak areas callout */}
      {weakAreas.length > 0 && (
        <div className="weak-areas-section">
          <h3>Areas to Focus On</h3>
          <div className="weak-areas-list">
            {weakAreas.map(w => (
              <div key={w.category} className="weak-area-item">
                <span className="weak-area-name">{w.category}</span>
                <span className="weak-area-stat">
                  {w.pct.toFixed(0)}% recent
                  {w.struggles > 0 && ` | ${w.struggles} struggled`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strong areas callout */}
      {strongAreas.length > 0 && (
        <div className="strong-areas-section">
          <h3>Your Strengths</h3>
          <div className="strong-areas-list">
            {strongAreas.map(s => (
              <div key={s.category} className="strong-area-item">
                <span className="strong-area-name">{s.category}</span>
                <span className="strong-area-stat">{s.pct.toFixed(0)}% recent</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Misconceptions: surfaces specific named errors the user has hit, not
          just topics they're weak in. Each row corresponds to a documented
          misconception (e.g. "off-by-one in range"). */}
      {topMisconceptions.length > 0 && (
        <div className="misconceptions-section">
          <h3>Common Misconceptions</h3>
          <p className="misconceptions-blurb">
            Specific mental-model errors picked up from your incorrect MCQ answers.
          </p>
          <div className="misconceptions-list">
            {topMisconceptions.map(m => (
              <div key={m.tag} className="misconception-item">
                <div className="misconception-header">
                  <span className="misconception-name">{m.name}</span>
                  <span className="misconception-count">{m.count} hit{m.count === 1 ? '' : 's'}</span>
                </div>
                <div className="misconception-description">{m.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="progress-sections">
        <div className="progress-section">
          <h3>Performance by Exam Section</h3>
          {topicAnalysis.size > 0 ? (
            <div className="exam-sections">
              {Object.entries(examSections).map(([sectionName, section]) => {
                const isLocked = unlockedSections !== null && !unlockedSections.has(sectionName);

                // Compute section-level stats
                const sectionTopicNames = Object.keys(section.topics);
                const sectionSubStats = sectionTopicNames.map(name => ({
                  name,
                  stats: getCategoryAnalysis(name),
                }));
                const totalFirst = sectionSubStats.reduce((s, t) => s + t.stats.firstTotal, 0);

                if (!isLocked && totalFirst === 0) {
                  // Unlocked but untouched — surface it as the next thing to start
                  // rather than hiding it (previously hidden, which made sections
                  // like Python Advanced disappear between Fundamentals and Django).
                  return (
                    <div key={sectionName} className="exam-section-group">
                      <div className="exam-section-header">
                        <div className="exam-section-header-left">
                          <span className="category-icon">🟢</span>
                          <span className="exam-section-name">{sectionName}</span>
                          {section.weight && (
                            <span className="exam-weight-badge">{section.weight}</span>
                          )}
                        </div>
                        <span className="locked-message">Ready to start — no questions attempted yet</span>
                      </div>
                    </div>
                  );
                }

                if (isLocked) {
                  const idx = pathOrder.indexOf(sectionName);
                  const prevName = idx > 0 ? pathOrder[idx - 1] : '';
                  return (
                    <div key={sectionName} className="exam-section-group locked-section">
                      <div className="exam-section-header">
                        <div className="exam-section-header-left">
                          <span className="category-icon">🔒</span>
                          <span className="exam-section-name">{sectionName}</span>
                          {section.weight && (
                            <span className="exam-weight-badge">{section.weight}</span>
                          )}
                        </div>
                        <span className="locked-message">
                          See {UNLOCK_COVERAGE_PCT}% of {prevName} and get &gt;{UNLOCK_ACCURACY_PCT}% correct on most recent attempt to unlock
                        </span>
                      </div>
                    </div>
                  );
                }

                const totalFirstCorrect = sectionSubStats.reduce((s, t) => s + t.stats.firstCorrect, 0);
                const sectionPct = pct(totalFirstCorrect, totalFirst);
                const totalRecentCorrect = sectionSubStats.reduce((s, t) => s + t.stats.recentCorrect, 0);
                const totalRecentTotal = sectionSubStats.reduce((s, t) => s + t.stats.recentTotal, 0);
                const sectionRecentPct = pct(totalRecentCorrect, totalRecentTotal);
                const totalLatestCorrect = sectionSubStats.reduce((s, t) => s + t.stats.latestCorrect, 0);
                const totalLatestTotal = sectionSubStats.reduce((s, t) => s + t.stats.latestTotal, 0);
                const sectionLatestPct = pct(totalLatestCorrect, totalLatestTotal);
                const sectionSeenTotal = sectionSubStats.reduce((s, t) => s + t.stats.firstTotal, 0);
                const sectionQuestionsTotal = sectionSubStats.reduce((s, t) => s + t.stats.totalQuestions, 0);
                const sectionCoverage = pct(sectionSeenTotal, sectionQuestionsTotal);
                const sectionTrend = getTrendArrow(sectionPct, sectionRecentPct);
                const isExpanded = expandedCategories.has(sectionName);
                // Bar = coverage * latest-correct (what the unlock gate actually uses)
                const gateMetric = totalLatestTotal > 0 ? sectionLatestPct : sectionPct;
                const barPct = (sectionCoverage / 100) * gateMetric;

                return (
                  <div key={sectionName} className="exam-section-group">
                    <button
                      type="button"
                      className="exam-section-header"
                      onClick={() => toggleCategory(sectionName)}
                      aria-expanded={isExpanded}
                    >
                      <div className="exam-section-header-left">
                        <span className="category-icon">{isExpanded ? '▼' : '▶'}</span>
                        <span className="exam-section-name">{sectionName}</span>
                        {section.weight && (
                          <span className="exam-weight-badge">Exam: {section.weight}</span>
                        )}
                      </div>
                      <div className="category-stats-summary">
                        <div className="category-bar-container">
                          <div
                            className="category-bar"
                            style={{
                              width: `${barPct}%`,
                              background: getBarColor(gateMetric),
                            }}
                          />
                        </div>
                        <span
                          className="category-score"
                          title={`Unlock gate uses latest-per-question. Recent-10: ${sectionRecentPct.toFixed(0)}%. First-try: ${sectionPct.toFixed(0)}%.`}
                        >
                          {sectionCoverage.toFixed(0)}% seen · {totalLatestCorrect}/{totalLatestTotal} latest correct ({gateMetric.toFixed(0)}%)
                        </span>
                        <span
                          className="category-trend"
                          style={{ color: sectionTrend.color }}
                          title={`${sectionTrend.label}: First-try ${sectionPct.toFixed(0)}% → Recent ${sectionRecentPct.toFixed(0)}%`}
                        >
                          {sectionTrend.arrow}
                        </span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="exam-section-topics">
                        {sectionSubStats.map(({ name, stats: catStats }, unitIdx, arr) => {
                          const topicKeys = topicCategories[name] || [];
                          const topicLocked = unlockedTopics !== null
                            && topicKeys.length > 0
                            && !topicKeys.some(k => unlockedTopics.has(k));

                          if (topicLocked) {
                            const prevName = unitIdx > 0 ? arr[unitIdx - 1].name : '';
                            return (
                              <div key={name} className="topic-stat topic-stat-empty">
                                <div className="topic-name">🔒 {name}</div>
                                <div className="topic-details">
                                  <span className="topic-not-started">
                                    Master {prevName} ({UNLOCK_COVERAGE_PCT}% seen + &gt;{UNLOCK_ACCURACY_PCT}% most-recently correct) to unlock
                                  </span>
                                </div>
                              </div>
                            );
                          }

                          if (catStats.firstTotal === 0) {
                            return (
                              <div key={name} className="topic-stat topic-stat-empty">
                                <div className="topic-name">{name}</div>
                                <div className="topic-details">
                                  <span className="topic-not-started">Not started</span>
                                </div>
                              </div>
                            );
                          }

                          const trend = getTrendArrow(catStats.firstAttemptPct, catStats.recentPct);
                          const topicGatePct = catStats.latestTotal > 0 ? catStats.latestPct : catStats.firstAttemptPct;
                          const topicBarPct = (catStats.coveragePct / 100) * topicGatePct;

                          return (
                            <div key={name} className="topic-stat">
                              <div className="topic-name">
                                {name}
                                {catStats.struggleQuestions > 0 && (
                                  <span className="topic-struggle"> ({catStats.struggleQuestions} struggled)</span>
                                )}
                              </div>
                              <div className="topic-details">
                                <div className="topic-bar-container">
                                  <div
                                    className="topic-bar"
                                    style={{
                                      width: `${topicBarPct}%`,
                                      background: getBarColor(topicGatePct),
                                    }}
                                  />
                                </div>
                                <div
                                  className="topic-score"
                                  title={`Unlock gate uses latest-per-question. Recent-10: ${catStats.recentPct.toFixed(0)}%. First-try: ${catStats.firstAttemptPct.toFixed(0)}%.`}
                                >
                                  {catStats.firstTotal}/{catStats.totalQuestions} seen · {catStats.latestCorrect}/{catStats.latestTotal} latest ({topicGatePct.toFixed(0)}%)
                                </div>
                                <span
                                  className="category-trend"
                                  style={{ color: trend.color }}
                                  title={`First-try: ${catStats.firstAttemptPct.toFixed(0)}% → Recent: ${catStats.recentPct.toFixed(0)}%`}
                                >
                                  {trend.arrow}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">No topic data yet. Start practicing!</p>
          )}
        </div>

        <div className="progress-section">
          <h3>Performance by Difficulty</h3>
          {getDifficultyStats().length > 0 ? (
            <div className="exam-section-topics">
              {getDifficultyStats().map(stat => {
                const trend = getTrendArrow(stat.firstPct, stat.recentPct);
                const recentForCalc = stat.recentTotal > 0 ? stat.recentPct : stat.firstPct;
                const totalQuestions = questions.filter(q => q.difficulty === stat.difficulty).length;
                const coveragePct = pct(stat.firstTotal, totalQuestions);
                const barPct = (coveragePct / 100) * recentForCalc;

                return (
                  <div key={stat.difficulty} className="topic-stat">
                    <div className="topic-name">
                      {stat.difficulty.toUpperCase()}
                    </div>
                    <div className="topic-details">
                      <div className="topic-bar-container">
                        <div
                          className="topic-bar"
                          style={{
                            width: `${barPct}%`,
                            background: getBarColor(recentForCalc),
                          }}
                        />
                      </div>
                      <div className="topic-score">
                        {stat.firstTotal}/{totalQuestions} seen ({recentForCalc.toFixed(0)}%)
                      </div>
                      <span
                        className="category-trend"
                        style={{ color: trend.color }}
                        title={`First-try: ${stat.firstPct.toFixed(0)}% → Recent: ${stat.recentPct.toFixed(0)}%`}
                      >
                        {trend.arrow}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">No difficulty data yet. Start practicing!</p>
          )}
        </div>
      </div>
    </div>
  );
};
