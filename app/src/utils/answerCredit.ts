import {
  ChooseJustifyQuestion,
  ExplainQuestion,
  PredictOutcomeQuestion,
  Question,
  QuestionType,
  SpotFlawQuestion,
  TemptingAnswer,
} from '../types';
import { CHOOSE_JUSTIFY_DECISION_CREDIT } from './spacedRepetition';

/**
 * Grading for the decision and design types (predict the outcome, choose and
 * justify, spot the flaw, explain). Pure functions, so the components stay
 * thin and the rules are unit-tested without rendering.
 *
 * What a credit means for scheduling (pass, pass under the bar, miss) lives in
 * spacedRepetition.ts (isPassingCredit, CREDIT_CORRECT_THRESHOLD).
 */

/**
 * A typed value in canonical form: trimmed, case-folded, inner whitespace
 * collapsed, a trailing full stop dropped, and the question's unit (e.g.
 * "rows", or "row" for its singular) dropped from the end, so `8`, `8 rows`
 * and ` 8 Rows.` are the same answer. Values stay exact: `8` is not `8.0`.
 */
export function normalizeOutcome(raw: string, unit?: string): string {
  let s = raw.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\.$/, '').trim();
  if (unit) {
    const u = unit.trim().toLowerCase();
    const forms = [u, u.replace(/s$/, '')].filter(f => f.length > 0);
    for (const f of forms) {
      if (s.endsWith(` ${f}`)) { s = s.slice(0, -f.length - 1).trim(); break; }
    }
  }
  return s;
}

/** True when the learner's value equals the answer or an accepted spelling. */
export function outcomeMatches(q: Pick<PredictOutcomeQuestion, 'answer' | 'acceptableAnswers' | 'unit'>, typed: string): boolean {
  const got = normalizeOutcome(typed, q.unit);
  if (got.length === 0) return false;
  return [q.answer, ...(q.acceptableAnswers ?? [])].some(a => normalizeOutcome(a, q.unit) === got);
}

/** The tempting wrong answer the learner typed, if the question names it. */
export function temptingMatch(q: Pick<PredictOutcomeQuestion, 'tempting' | 'unit'>, typed: string): TemptingAnswer | undefined {
  const got = normalizeOutcome(typed, q.unit);
  return q.tempting?.find(t => normalizeOutcome(t.answer, q.unit) === got);
}

/** Credit for a choose-and-justify answer: 1 for both right, the decision credit for the decision alone, else 0. */
export function chooseJustifyCredit(q: Pick<ChooseJustifyQuestion, 'decisions' | 'reasons'>, decisionId: string, reasonId: string): number {
  const decisionRight = q.decisions.some(o => o.id === decisionId && o.isCorrect);
  if (!decisionRight) return 0;
  const reasonRight = q.reasons.some(o => o.id === reasonId && o.isCorrect);
  return reasonRight ? 1 : CHOOSE_JUSTIFY_DECISION_CREDIT;
}

/** True when the clicked 1-based line is one the question marks as the cause. */
export function spotFlawCorrect(q: Pick<SpotFlawQuestion, 'flawLines'>, line: number): boolean {
  return q.flawLines.includes(line);
}

/** Credit for an explain card: the share of key points the learner ticked. */
export function explainCredit(q: Pick<ExplainQuestion, 'keyPoints'>, ticked: Iterable<number>): number {
  const total = q.keyPoints.length;
  if (total === 0) return 0;
  const valid = new Set(Array.from(ticked).filter(i => Number.isInteger(i) && i >= 0 && i < total));
  return valid.size / total;
}

/**
 * Structural problems that would make a decision or design card unanswerable
 * or ungradable. Empty for any other type, and for a well-formed card.
 * questionBankIntegrity.test.ts runs it over the whole bank.
 */
export function shapeErrors(q: Question): string[] {
  const errors: string[] = [];
  const blank = (s: unknown) => typeof s !== 'string' || s.trim().length === 0;
  switch (q.type) {
    case QuestionType.PREDICT_OUTCOME: {
      if (blank(q.answer)) errors.push('answer is empty');
      const answers = [q.answer, ...(q.acceptableAnswers ?? [])].map(a => normalizeOutcome(a, q.unit));
      for (const t of q.tempting ?? []) {
        if (blank(t.why)) errors.push(`tempting answer "${t.answer}" has no note`);
        if (answers.includes(normalizeOutcome(t.answer, q.unit))) errors.push(`tempting answer "${t.answer}" is an accepted answer`);
      }
      break;
    }
    case QuestionType.CHOOSE_JUSTIFY: {
      for (const [name, opts] of [['decisions', q.decisions], ['reasons', q.reasons]] as const) {
        if (!Array.isArray(opts) || opts.length < 2) { errors.push(`${name} needs at least 2 options`); continue; }
        const right = opts.filter(o => o.isCorrect).length;
        if (right !== 1) errors.push(`${name} has ${right} correct options (1)`);
        if (new Set(opts.map(o => o.id)).size !== opts.length) errors.push(`${name} repeat an option id`);
      }
      break;
    }
    case QuestionType.SPOT_FLAW: {
      if (!Array.isArray(q.lines) || q.lines.length < 2) errors.push('needs at least 2 lines');
      if (!Array.isArray(q.flawLines) || q.flawLines.length === 0) errors.push('no flaw line');
      else {
        for (const n of q.flawLines) {
          if (!Number.isInteger(n) || n < 1 || n > (q.lines?.length ?? 0)) errors.push(`flaw line ${n} is not a line`);
          else if (blank(q.lines[n - 1])) errors.push(`flaw line ${n} is blank`);
        }
        if (q.lines && q.flawLines.length >= q.lines.length) errors.push('every line is a flaw line');
      }
      break;
    }
    case QuestionType.EXPLAIN: {
      if (!Array.isArray(q.keyPoints) || q.keyPoints.length < 2 || q.keyPoints.length > 5) {
        errors.push(`has ${q.keyPoints?.length ?? 0} key points (2-5)`);
      } else if (q.keyPoints.some(blank)) errors.push('a key point is empty');
      if (blank(q.modelAnswer)) errors.push('modelAnswer is empty');
      break;
    }
    default:
      break;
  }
  return errors;
}
