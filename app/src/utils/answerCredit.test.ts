/**
 * Grading of the decision and design types (utils/answerCredit.ts).
 *
 * Run: npm test -- --testPathPattern=answerCredit --watchAll=false
 */
import {
  chooseJustifyCredit,
  explainCredit,
  normalizeOutcome,
  outcomeMatches,
  shapeErrors,
  spotFlawCorrect,
  temptingMatch,
} from './answerCredit';
import {
  SAMPLE_CHOOSE_JUSTIFY,
  SAMPLE_EXPLAIN,
  SAMPLE_PREDICT_OUTCOME,
  SAMPLE_QUESTIONS,
  SAMPLE_SPOT_FLAW,
  sampleFromSearch,
} from '../dev/sampleQuestions';
import { ChooseJustifyQuestion, ExplainQuestion, PredictOutcomeQuestion, SpotFlawQuestion } from '../types';

describe('predict the outcome', () => {
  it('normalizes case, spacing, a full stop and the unit', () => {
    expect(normalizeOutcome('  8  ROWS. ', 'rows')).toBe('8');
    expect(normalizeOutcome('1 row', 'rows')).toBe('1');
    expect(normalizeOutcome('2026-11-19')).toBe('2026-11-19');
    expect(normalizeOutcome('Hello   World')).toBe('hello world');
  });

  it('grades exactly: the answer and accepted spellings only', () => {
    const q = SAMPLE_PREDICT_OUTCOME;
    expect(outcomeMatches(q, '8')).toBe(true);
    expect(outcomeMatches(q, '8 rows')).toBe(true);
    expect(outcomeMatches(q, ' 8 Rows ')).toBe(true);
    expect(outcomeMatches(q, '8.0')).toBe(false);
    expect(outcomeMatches(q, '10')).toBe(false);
    expect(outcomeMatches(q, '')).toBe(false);
    expect(outcomeMatches(q, 'rows')).toBe(false);
    expect(outcomeMatches({ ...q, acceptableAnswers: ['eight'] }, 'Eight')).toBe(true);
  });

  it('names the tempting wrong answer the learner typed', () => {
    expect(temptingMatch(SAMPLE_PREDICT_OUTCOME, '10 rows')?.answer).toBe('10');
    expect(temptingMatch(SAMPLE_PREDICT_OUTCOME, '4')?.answer).toBe('4');
    expect(temptingMatch(SAMPLE_PREDICT_OUTCOME, '9')).toBeUndefined();
  });
});

describe('choose and justify', () => {
  const q = SAMPLE_CHOOSE_JUSTIFY;
  it('gives 1 for both right, 0.5 for the decision alone, 0 for a wrong decision', () => {
    expect(chooseJustifyCredit(q, 'merge', 'identity')).toBe(1);
    expect(chooseJustifyCredit(q, 'merge', 'fewer-files')).toBe(0.5);
    expect(chooseJustifyCredit(q, 'overwrite', 'identity')).toBe(0);
    expect(chooseJustifyCredit(q, 'overwrite', 'fewer-files')).toBe(0);
    expect(chooseJustifyCredit(q, 'nope', 'identity')).toBe(0);
  });
});

describe('spot the flaw', () => {
  it('accepts any line marked as the cause', () => {
    expect(spotFlawCorrect(SAMPLE_SPOT_FLAW, 5)).toBe(true);
    expect(spotFlawCorrect(SAMPLE_SPOT_FLAW, 4)).toBe(false);
    expect(spotFlawCorrect({ flawLines: [4, 5] }, 4)).toBe(true);
  });
});

describe('explain', () => {
  it('is ticked key points over all key points', () => {
    expect(explainCredit(SAMPLE_EXPLAIN, [])).toBe(0);
    expect(explainCredit(SAMPLE_EXPLAIN, [0, 1, 2])).toBe(0.75);
    expect(explainCredit(SAMPLE_EXPLAIN, [0, 1, 2, 3])).toBe(1);
  });

  it('ignores repeated and out-of-range ticks', () => {
    expect(explainCredit(SAMPLE_EXPLAIN, [0, 0, 7, -1, 1.5])).toBe(0.25);
    expect(explainCredit({ keyPoints: [] }, [0])).toBe(0);
  });
});

describe('shapeErrors', () => {
  it('passes every dev sample', () => {
    for (const q of SAMPLE_QUESTIONS) expect([q.id, shapeErrors(q)]).toEqual([q.id, []]);
  });

  it('flags a predict card whose tempting answer is accepted', () => {
    const q: PredictOutcomeQuestion = { ...SAMPLE_PREDICT_OUTCOME, tempting: [{ answer: '8 rows', why: 'x' }] };
    expect(shapeErrors(q)).toEqual(['tempting answer "8 rows" is an accepted answer']);
    expect(shapeErrors({ ...SAMPLE_PREDICT_OUTCOME, answer: ' ' })).toContain('answer is empty');
  });

  it('flags a choose-and-justify step without exactly one right option', () => {
    const q: ChooseJustifyQuestion = {
      ...SAMPLE_CHOOSE_JUSTIFY,
      reasons: SAMPLE_CHOOSE_JUSTIFY.reasons.map(r => ({ ...r, isCorrect: true })),
    };
    expect(shapeErrors(q)).toEqual(['reasons has 4 correct options (1)']);
  });

  it('flags a flaw line that is not a line', () => {
    const q: SpotFlawQuestion = { ...SAMPLE_SPOT_FLAW, flawLines: [0, 9] };
    expect(shapeErrors(q)).toEqual(['flaw line 0 is not a line', 'flaw line 9 is not a line']);
    expect(shapeErrors({ ...SAMPLE_SPOT_FLAW, flawLines: [] })).toEqual(['no flaw line']);
  });

  it('flags an explain card with too few key points or no model answer', () => {
    const q: ExplainQuestion = { ...SAMPLE_EXPLAIN, keyPoints: ['only one'], modelAnswer: '' };
    expect(shapeErrors(q)).toEqual(['has 1 key points (2-5)', 'modelAnswer is empty']);
  });
});

describe('dev samples', () => {
  it('opens a sample by id outside production only', () => {
    expect(sampleFromSearch('?sample=dev-sample-spot-flaw', 'development')?.id).toBe('dev-sample-spot-flaw');
    expect(sampleFromSearch('?sample=dev-sample-spot-flaw', 'production')).toBeNull();
    expect(sampleFromSearch('?sample=nope', 'development')).toBeNull();
    expect(sampleFromSearch('', 'development')).toBeNull();
  });
});
