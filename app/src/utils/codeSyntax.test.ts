import { CodeLanguage } from '../types';
import { highlightLine, splitComment } from './codeSyntax';

const kinds = (line: string, language?: CodeLanguage) =>
  highlightLine(line, language).filter(t => t.kind).map(t => [t.text, t.kind]);

describe('highlightLine', () => {
  it('colours Python keywords, strings, numbers and called names', () => {
    expect(kinds('    return HttpResponse("hi", status=200)', CodeLanguage.PYTHON)).toEqual([
      ['return', 'kw'],
      ['HttpResponse', 'fn'],
      ['"hi"', 'str'],
      ['200', 'num'],
    ]);
  });

  it('keeps every character, in order', () => {
    const line = 'q = request.GET.get("q", "").strip()  ';
    expect(highlightLine(line, CodeLanguage.PYTHON).map(t => t.text).join('')).toBe(line);
  });

  it('reads SQL keywords in any case', () => {
    expect(kinds('select id FROM t where x = \'a\'', CodeLanguage.SQL)).toEqual([
      ['select', 'kw'],
      ['FROM', 'kw'],
      ['where', 'kw'],
      ["'a'", 'str'],
    ]);
  });

  it('colours a Python f-string with its prefix, and a decorator', () => {
    expect(kinds('f"{a}"', CodeLanguage.PYTHON)).toEqual([['f"{a}"', 'str']]);
    expect(kinds('@login_required', CodeLanguage.PYTHON)).toEqual([['@login_required', 'fn']]);
  });

  it('colours markup tags, attributes and values', () => {
    expect(kinds('<a href="/x">Go</a>', CodeLanguage.HTML)).toEqual([
      ['a', 'kw'],
      ['href', 'fn'],
      ['"/x"', 'str'],
      ['a', 'kw'],
    ]);
  });

  it('colours CSS properties and values with units', () => {
    expect(kinds('  margin: 4px auto;', CodeLanguage.CSS)).toEqual([['margin', 'fn'], ['4px', 'num']]);
  });

  it('leaves code in no language plain', () => {
    expect(kinds('return 1')).toEqual([]);
  });
});

describe('splitComment', () => {
  it('splits a trailing comment but not a marker inside quotes', () => {
    expect(splitComment('x = "#1"  # note', CodeLanguage.PYTHON)).toEqual(['x = "#1"  ', '# note']);
  });
});
