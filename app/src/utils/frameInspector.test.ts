import { readMediaRules } from './frameInspector';

// jsdom parses <style> into CSSOM (rule types, media text), so condition
// EXTRACTION is testable here. matchMedia activity and anything needing a
// real layout engine (getComputedStyle display, rects) is manual-QA only.

function docWithLearnerCss(css: string): Document {
  const style = document.createElement('style');
  style.setAttribute('data-learner-css', '');
  style.textContent = css;
  document.head.appendChild(style);
  return document;
}

afterEach(() => {
  document.querySelectorAll('style[data-learner-css]').forEach(el => el.remove());
});

describe('readMediaRules', () => {
  it('extracts each @media condition from the learner style tag', () => {
    const doc = docWithLearnerCss(`
      .grid { display: grid; }
      @media (min-width: 768px) { .grid { grid-template-columns: repeat(3, 1fr); } }
      @media (max-width: 480px) { .grid { gap: 4px; } }
    `);
    const conditions = readMediaRules(doc, window).map(r => r.condition);
    expect(conditions).toHaveLength(2);
    expect(conditions[0]).toContain('min-width: 768px');
    expect(conditions[1]).toContain('max-width: 480px');
  });

  it('dedupes repeated conditions', () => {
    const doc = docWithLearnerCss(`
      @media (min-width: 768px) { .a { color: red; } }
      @media (min-width: 768px) { .b { color: blue; } }
    `);
    expect(readMediaRules(doc, window)).toHaveLength(1);
  });

  it('returns [] when there is no learner style tag', () => {
    expect(readMediaRules(document, window)).toEqual([]);
  });

  it('returns [] for learner CSS without media rules', () => {
    const doc = docWithLearnerCss('.a { color: red; }');
    expect(readMediaRules(doc, window)).toEqual([]);
  });
});
