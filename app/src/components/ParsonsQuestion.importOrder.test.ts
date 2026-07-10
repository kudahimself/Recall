import { normalizeImportRuns } from './ParsonsQuestion';

// The Parsons grader normalizes consecutive import lines so any valid ordering
// of an order-independent import block is accepted. These tests pin that.

describe('normalizeImportRuns', () => {
  it('sorts a contiguous run of import lines', () => {
    expect(normalizeImportRuns(['import secrets', 'import hashlib'])).toEqual([
      'import hashlib',
      'import secrets',
    ]);
  });

  it('makes two valid orderings of an import block compare equal', () => {
    const a = normalizeImportRuns(['import hashlib', 'import secrets']);
    const b = normalizeImportRuns(['import secrets', 'import hashlib']);
    expect(a).toEqual(b);
  });

  it('normalizes mixed import / from-import lines together', () => {
    const a = normalizeImportRuns([
      'import requests',
      'from requests.adapters import HTTPAdapter',
      'from urllib3.util.retry import Retry',
    ]);
    const b = normalizeImportRuns([
      'from urllib3.util.retry import Retry',
      'import requests',
      'from requests.adapters import HTTPAdapter',
    ]);
    expect(a).toEqual(b);
  });

  it('leaves non-import body lines in place and only sorts the import run', () => {
    const out = normalizeImportRuns([
      'import os',
      'api_key = os.environ.get("API_KEY")',
      'if not api_key:',
      '    raise RuntimeError("API_KEY is not set")',
    ]);
    expect(out).toEqual([
      'import os',
      'api_key = os.environ.get("API_KEY")',
      'if not api_key:',
      '    raise RuntimeError("API_KEY is not set")',
    ]);
  });

  it('does NOT reorder body statements that merely sit between imports and code', () => {
    // body assignments are order-sensitive and must stay put
    const out = normalizeImportRuns([
      'import httpx',
      'import asyncio',
      'x = 1',
      'y = 2',
    ]);
    expect(out).toEqual(['import asyncio', 'import httpx', 'x = 1', 'y = 2']);
  });

  it('treats separate import runs (split by a body line) independently', () => {
    const out = normalizeImportRuns([
      'import b',
      'import a',
      'do_something()',
      'import d',
      'import c',
    ]);
    expect(out).toEqual([
      'import a',
      'import b',
      'do_something()',
      'import c',
      'import d',
    ]);
  });
});
