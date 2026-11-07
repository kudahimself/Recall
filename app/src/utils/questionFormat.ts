import { QuestionType } from '../types';

/**
 * The one name of each question format: the question card's format badge, the
 * lesson's exercise steps and the filters all read it, so a format is called
 * the same thing everywhere.
 */
export const QUESTION_FORMAT: Record<QuestionType, string> = {
  [QuestionType.MULTIPLE_CHOICE]: 'Multiple choice',
  [QuestionType.PREDICT_OUTPUT]: 'Predict output',
  [QuestionType.PARSONS]: 'Arrange the lines',
  [QuestionType.CLOZE_CODE]: 'Fill in the blanks',
  [QuestionType.CODING]: 'Write code',
  [QuestionType.PREDICT_OUTCOME]: 'Predict the outcome',
  [QuestionType.CHOOSE_JUSTIFY]: 'Choose & justify',
  [QuestionType.SPOT_FLAW]: 'Spot the flaw',
  [QuestionType.EXPLAIN]: 'Explain in your own words',
};
