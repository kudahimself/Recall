import { validateAnswer } from './codeValidator';
import { CodeLanguage } from '../types';

// Regression: py-coll-counter-arithmetic accepts BOTH the dict-literal and the
// keyword-argument forms of Counter construction (the prompt's `apple=5`
// notation naturally implies kwargs). Both must validate.
const SOLUTION = `from collections import Counter

a = Counter({"apple": 5, "banana": 2})
b = Counter({"apple": 3, "cherry": 1})

print(a + b)
# OR
from collections import Counter

a = Counter(apple=5, banana=2)
b = Counter(apple=3, cherry=1)

print(a + b)`;

describe('Counter arithmetic question accepts both construction forms', () => {
  it('accepts the keyword-argument form (the user answer)', () => {
    const userCode = `from collections import Counter

a = Counter(apple=5, banana=2)
b = Counter(apple=3, cherry=1)

print(a + b)`;
    const res = validateAnswer(userCode, SOLUTION, CodeLanguage.PYTHON, 'Counter addition');
    expect(res.passed).toBe(true);
  });

  it('accepts the dict-literal form', () => {
    const userCode = `from collections import Counter

a = Counter({"apple": 5, "banana": 2})
b = Counter({"apple": 3, "cherry": 1})

print(a + b)`;
    const res = validateAnswer(userCode, SOLUTION, CodeLanguage.PYTHON, 'Counter addition');
    expect(res.passed).toBe(true);
  });
});
