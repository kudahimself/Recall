import { validateAnswer } from './codeValidator';
import { CodeLanguage } from '../types';

describe('PySpark saveAsTable requirement', () => {
  const SOLUTION = `df.write.format("delta").mode("append").saveAsTable("output_sales")`;

  it('rejects user code using .save() instead of .saveAsTable() with clear error message', () => {
    const userCode = `df.write.format("delta").mode("append").save("output_sales")`;
    const res = validateAnswer(userCode, SOLUTION, CodeLanguage.PYTHON, 'Should write Delta in append mode');
    expect(res.passed).toBe(false);
    expect(res.error).toBe('Your .save() writes to a file path, but saving to a catalog table requires .saveAsTable("table_name").');
  });

  it('rejects user code missing saveAsTable altogether', () => {
    const userCode = `df.write.format("delta").mode("append")`;
    const res = validateAnswer(userCode, SOLUTION, CodeLanguage.PYTHON, 'Should write Delta in append mode');
    expect(res.passed).toBe(false);
    expect(res.error).toBe('Saving to a catalog Delta table requires .saveAsTable("table_name").');
  });

  it('accepts correct saveAsTable usage', () => {
    const userCode = `df.write.format("delta").mode("append").saveAsTable("output_sales")`;
    const res = validateAnswer(userCode, SOLUTION, CodeLanguage.PYTHON, 'Should write Delta in append mode');
    expect(res.passed).toBe(true);
  });

  it('enforces requires array when explicitly specified in options', () => {
    const userCode = `df.write.format("delta").mode("append").save("output_sales")`;
    const res = validateAnswer(userCode, SOLUTION, CodeLanguage.PYTHON, 'Should write Delta in append mode', undefined, { requires: ['saveAsTable'] });
    expect(res.passed).toBe(false);
    expect(res.error).toContain('missing the required keyword or pattern: "saveAsTable"');
  });
});
