import { buildPreviewDoc } from './previewDoc';

describe('buildPreviewDoc', () => {
  it('wraps the markup in a complete document', () => {
    const doc = buildPreviewDoc({ html: '<div class="box">hi</div>' });
    expect(doc).toContain('<!DOCTYPE html>');
    expect(doc).toContain('<meta charset="utf-8">');
    expect(doc).toContain('<body><div class="box">hi</div></body>');
  });

  it('injects the CSS in a style tag after the base reset', () => {
    const css = '.box { color: red; }';
    const doc = buildPreviewDoc({ html: '<div class="box"></div>', css });
    const cssIndex = doc.indexOf(css);
    expect(cssIndex).toBeGreaterThan(-1);
    expect(cssIndex).toBeGreaterThan(doc.indexOf('box-sizing: border-box'));
  });

  it('tags the learner style so frame inspectors can find it', () => {
    // Load-bearing for the @media inspector: readMediaRules looks up
    // style[data-learner-css] and ignores every other sheet (Tailwind CDN).
    const doc = buildPreviewDoc({ html: '<div></div>', css: '.a { color: red; }' });
    expect(doc).toContain('<style data-learner-css>');
  });

  it('omits the user style tag when no CSS is given', () => {
    const doc = buildPreviewDoc({ html: '<p>plain</p>' });
    // Exactly one <style> block: the base reset.
    expect(doc.match(/<style>/g)).toHaveLength(1);
  });

  it('sets real-web defaults (white background) in the base styles', () => {
    const doc = buildPreviewDoc({ html: '<p>x</p>' });
    expect(doc).toContain('background: #ffffff');
  });

  it('passes full documents through verbatim (head/metadata questions)', () => {
    const full = '<!DOCTYPE html>\n<html>\n<head><title>My Page</title></head>\n<body><p>hi</p></body>\n</html>';
    expect(buildPreviewDoc({ html: full })).toBe(full);
    const noDoctype = '<html><head><title>T</title></head><body></body></html>';
    expect(buildPreviewDoc({ html: noDoctype })).toBe(noDoctype);
  });
});
