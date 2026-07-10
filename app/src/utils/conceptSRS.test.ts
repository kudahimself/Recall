/**
 * Tests for conceptSRS.ts. Targeted unit checks — the FSRS formulas are
 * non-trivial and easy to get wrong, so we lock down golden values for
 * the math the rest of the system will depend on.
 *
 * Run:  npm test -- --testPathPattern=conceptSRS
 */
import {
  applyReview,
  bucketCard,
  ConceptProgress,
  ConceptState,
  DUE_RETRIEVABILITY_GATE,
  getConceptMasteryProbability,
  getEffectiveStability,
  getMasteryProbability,
  getRetrievability,
  gradeFromResponseTime,
  MASTERY_THRESHOLD,
  PFA_GAMMA,
  PFA_RHO,
  recordSpotCheckFailure,
  ReviewGrade,
  RESPONSE_TIME_ENVELOPE_MS,
  SPOT_CHECK_AGE_DAYS,
} from './conceptSRS';

const NOW = 1_700_000_000_000; // arbitrary fixed timestamp
const DAY = 24 * 60 * 60 * 1000;

const state = (overrides: Partial<ConceptState> = {}): ConceptState => ({
  successes: 0, failures: 0, lastSeen: 0, stability: 0, ...overrides,
});

describe('getMasteryProbability', () => {
  it('returns null for an untagged question', () => {
    expect(getMasteryProbability([], {})).toBeNull();
  });

  it('returns 0.5 for an unseen concept (no evidence)', () => {
    const m = getMasteryProbability(['c1'], {});
    expect(m).toBeCloseTo(0.5, 5);
  });

  it('rises above mastery threshold after several successes', () => {
    const progress: ConceptProgress = { c1: state({ successes: 6, failures: 0 }) };
    const m = getMasteryProbability(['c1'], progress)!;
    // sigmoid(0.4 * 6) = sigmoid(2.4) ≈ 0.917
    expect(m).toBeGreaterThan(MASTERY_THRESHOLD);
  });

  it('falls below 0.5 after several failures', () => {
    const progress: ConceptProgress = { c1: state({ successes: 0, failures: 3 }) };
    const m = getMasteryProbability(['c1'], progress)!;
    expect(m).toBeLessThan(0.5);
  });

  it('aggregates multi-concept questions as mean of logits', () => {
    const progress: ConceptProgress = {
      strong: state({ successes: 8, failures: 0 }),  // logit ≈ 3.2
      weak:   state({ successes: 0, failures: 2 }),  // logit ≈ -1.2
    };
    // mean logit = (3.2 + -1.2) / 2 = 1.0 → sigmoid ≈ 0.731
    const m = getMasteryProbability(['strong', 'weak'], progress)!;
    expect(m).toBeCloseTo(1 / (1 + Math.exp(-1)), 3);
  });
});

describe('getEffectiveStability', () => {
  it('returns null for empty concept list', () => {
    expect(getEffectiveStability([], {})).toBeNull();
  });

  it('returns 0 if any concept has never been seen', () => {
    const progress: ConceptProgress = {
      seen:   state({ stability: 5, successes: 1 }),
      unseen: state({ stability: 0 }),
    };
    expect(getEffectiveStability(['seen', 'unseen'], progress)).toBe(0);
  });

  it('returns the minimum stability across concepts (Swiss-cheese guard)', () => {
    const progress: ConceptProgress = {
      strong: state({ stability: 30 }),
      weak:   state({ stability: 2 }),
    };
    expect(getEffectiveStability(['strong', 'weak'], progress)).toBe(2);
  });
});

describe('getRetrievability', () => {
  it('returns 1 at t=0', () => {
    const progress: ConceptProgress = { c1: state({ stability: 5 }) };
    expect(getRetrievability(['c1'], progress, 0)).toBe(1);
  });

  it('returns 0.9 when elapsed equals stability (FSRS calibration)', () => {
    const progress: ConceptProgress = { c1: state({ stability: 5 }) };
    expect(getRetrievability(['c1'], progress, 5)).toBeCloseTo(0.9, 5);
  });

  it('decays with elapsed time', () => {
    const progress: ConceptProgress = { c1: state({ stability: 10 }) };
    const r1 = getRetrievability(['c1'], progress, 5)!;
    const r2 = getRetrievability(['c1'], progress, 20)!;
    expect(r1).toBeGreaterThan(r2);
  });

  it('returns 0 ("always due") for never-seen concepts', () => {
    expect(getRetrievability(['unseen'], {}, 1)).toBe(0);
  });
});

describe('applyReview — first review of a concept', () => {
  it('initializes stability via FSRS init formula on grade=good', () => {
    const result = applyReview(['c1'], 3, 0, 0, {}, {}, NOW);
    // FSRS_W[2] = 2.4
    expect(result.conceptUpdates.c1.stability).toBeCloseTo(2.4, 5);
    // Difficulty init for grade=3: w[4] - 0*w[5] = 4.93
    expect(result.newCardDifficulty).toBeCloseTo(4.93, 5);
  });

  it('initializes stability higher for grade=easy than grade=hard', () => {
    const easy = applyReview(['c1'], 4, 0, 0, {}, {}, NOW);
    const hard = applyReview(['c1'], 2, 0, 0, {}, {}, NOW);
    expect(easy.conceptUpdates.c1.stability).toBeGreaterThan(
      hard.conceptUpdates.c1.stability,
    );
  });

  it('records the success and updates lastSeen', () => {
    const result = applyReview(['c1'], 3, 0, 0, {}, {}, NOW);
    expect(result.conceptUpdates.c1.successes).toBe(1);
    expect(result.conceptUpdates.c1.failures).toBe(0);
    expect(result.conceptUpdates.c1.lastSeen).toBe(NOW);
  });
});

describe('applyReview — subsequent reviews', () => {
  it('grows stability on a successful review with elapsed time', () => {
    const progress: ConceptProgress = {
      c1: state({ stability: 5, successes: 2, lastSeen: NOW - 5 * DAY }),
    };
    const result = applyReview(['c1'], 3, 5, 5, progress, {}, NOW);
    expect(result.conceptUpdates.c1.stability).toBeGreaterThan(5);
  });

  it('shrinks stability on a failed review', () => {
    const progress: ConceptProgress = {
      c1: state({ stability: 20, successes: 3, lastSeen: NOW - 20 * DAY }),
    };
    const result = applyReview(['c1'], 1, 5, 20, progress, {}, NOW);
    expect(result.conceptUpdates.c1.stability).toBeLessThan(20);
    expect(result.conceptUpdates.c1.failures).toBe(1);
  });

  it('uses per-concept R for each concept update (not min-R)', () => {
    // Card touches a strong concept (S=20) and a weak concept (S=2).
    // After 5 days elapsed, weak concept's R should be much lower than strong's,
    // so a successful review should bump the weak concept's stability MORE than
    // an equivalent card-state would predict using the min-stability R.
    const progress: ConceptProgress = {
      strong: state({ stability: 20, successes: 4, lastSeen: NOW - 5 * DAY }),
      weak:   state({ stability: 2,  successes: 4, lastSeen: NOW - 5 * DAY }),
    };
    const r = applyReview(['strong', 'weak'], 3, 5, 5, progress, {}, NOW);

    // Both should grow on success, but the weak concept's relative growth
    // (newStability / oldStability) should be larger because its R was lower
    // (more "surprising" to retrieve = stronger memory consolidation signal).
    const weakRatio = r.conceptUpdates.weak.stability / 2;
    const strongRatio = r.conceptUpdates.strong.stability / 20;
    expect(weakRatio).toBeGreaterThan(strongRatio);
  });

  it('sets masteredAt the first time mastery crosses MASTERY_THRESHOLD', () => {
    // Build progress with successes=5 already (just below threshold for γ=0.4):
    //   sigmoid(0.4 * 5) = sigmoid(2.0) ≈ 0.881 — actually above 0.85.
    // So step it down: start at successes=4 (sigmoid(1.6) ≈ 0.832, below threshold),
    // then a successful review should push to 5 → above.
    const progress: ConceptProgress = {
      c1: state({ stability: 10, successes: 4, lastSeen: NOW - 1 * DAY }),
    };
    const before = getConceptMasteryProbability('c1', progress);
    expect(before).toBeLessThan(MASTERY_THRESHOLD);

    const result = applyReview(['c1'], 3, 5, 1, progress, {}, NOW);
    expect(result.conceptUpdates.c1.masteredAt).toBe(NOW);
  });
});

describe('bucketCard', () => {
  const betas = {};

  it('returns IDLE for cards with no concepts', () => {
    expect(bucketCard([], {}, 0, betas, NOW)).toBe('IDLE');
  });

  it('returns DUE when retrievability falls below the gate', () => {
    const progress: ConceptProgress = { c1: state({ stability: 5 }) };
    // At t=10 days with S=5, R = 0.9^2 = 0.81 < 0.9
    expect(bucketCard(['c1'], progress, 10, betas, NOW)).toBe('DUE');
  });

  it('returns DUE for never-seen concepts (R=0 = always due)', () => {
    expect(bucketCard(['c1'], {}, 0, betas, NOW)).toBe('DUE');
  });

  it('returns SPOT_CHECK when a concept was mastered ≥30 days ago', () => {
    const cutoff = NOW - (SPOT_CHECK_AGE_DAYS + 5) * DAY;
    const progress: ConceptProgress = {
      c1: state({
        stability: 60,            // high enough that R won't drop below 0.9
        successes: 8,
        masteredAt: cutoff,
        lastSeen: cutoff,
      }),
    };
    // At t=5 days with S=60, R = 0.9^(5/60) ≈ 0.991 → above gate, not DUE
    expect(bucketCard(['c1'], progress, 5, betas, NOW)).toBe('SPOT_CHECK');
  });

  it('returns FRINGE for mid-mastery non-due cards', () => {
    // sigmoid(0.4 * 2) = sigmoid(0.8) ≈ 0.69 — between FRINGE_MIN (0.5) and threshold (0.85)
    const progress: ConceptProgress = {
      c1: state({ stability: 50, successes: 2, lastSeen: NOW - 1 * DAY }),
    };
    expect(bucketCard(['c1'], progress, 1, betas, NOW)).toBe('FRINGE');
  });

  it('returns IDLE for deeply-mastered, recently-seen, not-due cards', () => {
    const progress: ConceptProgress = {
      c1: state({
        stability: 100,
        successes: 12,
        masteredAt: NOW - 5 * DAY,    // mastered, but only 5 days ago, not 30+
        lastSeen: NOW - 5 * DAY,
      }),
    };
    expect(bucketCard(['c1'], progress, 5, betas, NOW)).toBe('IDLE');
  });
});

describe('recordSpotCheckFailure', () => {
  it('clears masteredAt and increments failures', () => {
    const before: ConceptState = {
      successes: 8, failures: 0, lastSeen: NOW - 60 * DAY,
      stability: 50, masteredAt: NOW - 60 * DAY,
    };
    const after = recordSpotCheckFailure(before, NOW);
    expect(after.masteredAt).toBeUndefined();
    expect(after.failures).toBe(1);
    expect(after.lastSeen).toBe(NOW);
  });
});

describe('PFA constant sanity', () => {
  it('rho > gamma so failures hurt more than successes help', () => {
    expect(PFA_RHO).toBeGreaterThan(PFA_GAMMA);
  });

  it('DUE_RETRIEVABILITY_GATE matches FSRS desired retention default', () => {
    expect(DUE_RETRIEVABILITY_GATE).toBe(0.9);
  });
});

// Suppress the unused-import lint by referencing the types we import for clarity.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _gradeTypecheck: ReviewGrade[] = [1, 2, 3, 4];

describe('gradeFromResponseTime', () => {
  it('returns 1 (fail) for any wrong answer regardless of time', () => {
    expect(gradeFromResponseTime('multiple_choice', 1_000, false)).toBe(1);
    expect(gradeFromResponseTime('coding', 60_000, false)).toBe(1);
  });

  it('returns 4 (easy) when correct and at-or-below the easy threshold', () => {
    // MCQ easy threshold is 5_000ms.
    expect(gradeFromResponseTime('multiple_choice', 4_000, true)).toBe(4);
    expect(gradeFromResponseTime('multiple_choice', 5_000, true)).toBe(4);
  });

  it('returns 3 (good) when correct and between thresholds', () => {
    expect(gradeFromResponseTime('multiple_choice', 10_000, true)).toBe(3);
    expect(gradeFromResponseTime('coding', 400_000, true)).toBe(3); // between 240k easy and 600k hard
  });

  it('returns 2 (hard) when correct but at-or-above the hard threshold', () => {
    expect(gradeFromResponseTime('multiple_choice', 20_000, true)).toBe(2);
    expect(gradeFromResponseTime('multiple_choice', 60_000, true)).toBe(2);
    expect(gradeFromResponseTime('coding', 600_000, true)).toBe(2); // ≥10 min
  });

  it('uses the per-type envelope — coding has a much wider easy band than MCQ', () => {
    // 90s on a coding question is "easy" (< 240s threshold), but on MCQ it's "hard".
    expect(gradeFromResponseTime('coding', 90_000, true)).toBe(4);
    expect(gradeFromResponseTime('multiple_choice', 90_000, true)).toBe(2);
  });

  it('falls back to multiple_choice envelope for unknown types', () => {
    expect(gradeFromResponseTime('not_a_real_type', 4_000, true)).toBe(4);
    expect(gradeFromResponseTime('not_a_real_type', 30_000, true)).toBe(2);
  });

  it('treats zero/negative time as easy (clock skew safety)', () => {
    expect(gradeFromResponseTime('coding', 0, true)).toBe(4);
    expect(gradeFromResponseTime('coding', -500, true)).toBe(4);
  });

  it('envelope ordering: easy < hard for every type', () => {
    for (const env of Object.values(RESPONSE_TIME_ENVELOPE_MS)) {
      expect(env.easy).toBeLessThan(env.hard);
    }
  });
});
