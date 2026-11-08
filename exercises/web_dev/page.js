/**
 * Loads an exercise's HTML page into jsdom for its tests, the way a browser of a
 * given width would style it. Leave this file as it is.
 *
 * jsdom is a browser without a screen: it parses the HTML, applies the cascade
 * (specificity, source order, inheritance) and answers getComputedStyle, but it
 * draws nothing and ignores @media rules. So loadPage reads each stylesheet the
 * page links, keeps the rules of every @media block that matches the chosen
 * width and settings, in place and in order (a media query adds no specificity),
 * drops the rest, and hands jsdom the result. jsdom also drops a shorthand that
 * reads a custom property, such as `border: 2px solid var(--accent)`, so loadPage
 * writes in the value of each custom property set only on the root element.
 */
import { existsSync, readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

/**
 * The page at `htmlUrl` (a file: URL, such as new URL('./page.html', import.meta.url)),
 * styled for a viewport `width` px wide. Returns jsdom's { window, document }.
 * `reducedMotion` answers (prefers-reduced-motion: reduce).
 */
export function loadPage(htmlUrl, { width = 1280, height = 800, reducedMotion = false } = {}) {
  const env = { width, height, reducedMotion };
  const dom = new JSDOM(readFileSync(htmlUrl, 'utf8'), {
    url: 'http://localhost/',
    pretendToBeVisual: true,
    beforeParse(window) {
      Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
    },
  });
  const { document } = dom.window;
  for (const link of document.querySelectorAll('link[rel~="stylesheet"][href]')) {
    const href = link.getAttribute('href');
    if (/^[a-z]+:|^\/\//i.test(href)) continue;
    const file = new URL(href, htmlUrl);
    const style = document.createElement('style');
    style.textContent = existsSync(file) ? readFileSync(file, 'utf8') : '';
    link.replaceWith(style);
  }
  const styles = [...document.querySelectorAll('style')];
  for (const style of styles) {
    style.textContent = flatten(style.sheet?.cssRules ?? [], env);
  }
  inlineRootProperties(dom.window, styles);
  return { window: dom.window, document };
}

const VAR = /var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*))?\)/g;
const ROOT_SELECTOR = /^\s*(:root|html)\s*$/i;

/** Replace var(--name) in every stylesheet with the root's value, for each custom property only the root sets. */
function inlineRootProperties(window, styles) {
  const elsewhere = new Set();
  for (const style of styles) {
    for (const rule of style.sheet?.cssRules ?? []) {
      if (!rule.style || ROOT_SELECTOR.test(rule.selectorText ?? '')) continue;
      for (const name of rule.style) if (name.startsWith('--')) elsewhere.add(name);
    }
  }
  const root = window.getComputedStyle(window.document.documentElement);
  const valueOf = (name, fallback) => {
    if (elsewhere.has(name)) return null;
    return root.getPropertyValue(name).trim() || (fallback ?? '').trim() || null;
  };
  for (const style of styles) {
    let css = style.textContent;
    for (let i = 0; i < 10 && css.includes('var('); i++) {
      const next = css.replace(VAR, (whole, name, fallback) => valueOf(name, fallback) ?? whole);
      if (next === css) break;
      css = next;
    }
    style.textContent = css;
  }
}

/**
 * The computed value of a CSS property (hyphenated, such as 'grid-template-columns')
 * on `el`, with any var(--name) replaced by the custom property's value; a color
 * comes back as rgb() or rgba(), however it was written.
 */
export function styleOf(el, property) {
  const window = el.ownerDocument.defaultView;
  const computed = window.getComputedStyle(el);
  let value = computed.getPropertyValue(property).trim();
  for (let i = 0; i < 10 && value.includes('var('); i++) {
    value = value.replace(VAR,
      (_, name, fallback) => computed.getPropertyValue(name).trim() || (fallback ?? '').trim());
  }
  if (/color/.test(property) && value) {
    const probe = el.ownerDocument.createElement('span');
    probe.style.color = value;
    el.ownerDocument.body.append(probe);
    value = window.getComputedStyle(probe).color || value;
    probe.remove();
  }
  return value;
}

/** The CSS text of `rules` with each @media block replaced by its rules when it matches, or nothing. */
function flatten(rules, env) {
  let css = '';
  for (const rule of rules) {
    if (rule.media && rule.cssRules) {
      if (mediaMatches(rule.media.mediaText, env)) css += flatten(rule.cssRules, env);
    } else {
      css += rule.cssText + '\n';
    }
  }
  return css;
}

/** Whether a media query list such as "screen and (min-width: 768px)" matches. */
function mediaMatches(text, env) {
  return text.split(',').some(query => {
    let q = query.trim().toLowerCase();
    const negate = q.startsWith('not ');
    if (negate) q = q.slice(4);
    if (q.startsWith('only ')) q = q.slice(5);
    const matches = q.split(/\s+and\s+/).every(part => featureMatches(part.trim(), env));
    return negate ? !matches : matches;
  });
}

function featureMatches(part, env) {
  if (part === 'all' || part === 'screen') return true;
  if (part === 'print' || part === '') return false;
  const range = part.match(/^\(\s*(width|height)\s*(>=|<=|>|<|=)\s*([\d.]+[a-z]*)\s*\)$/);
  const reversed = part.match(/^\(\s*([\d.]+[a-z]*)\s*(>=|<=|>|<|=)\s*(width|height)\s*\)$/);
  if (range || reversed) {
    const flip = { '>=': '<=', '<=': '>=', '>': '<', '<': '>', '=': '=' };
    const [side, op, size] = range ? range.slice(1) : [reversed[3], flip[reversed[2]], reversed[1]];
    const actual = env[side];
    const limit = toPx(size);
    return { '>=': actual >= limit, '<=': actual <= limit, '>': actual > limit, '<': actual < limit, '=': actual === limit }[op];
  }
  const feature = part.match(/^\(\s*([a-z-]+)\s*(?::\s*([^)]+?))?\s*\)$/);
  if (!feature) return false;
  const [, name, value] = feature;
  switch (name) {
    case 'min-width': return env.width >= toPx(value);
    case 'max-width': return env.width <= toPx(value);
    case 'min-height': return env.height >= toPx(value);
    case 'max-height': return env.height <= toPx(value);
    case 'orientation': return value === (env.width > env.height ? 'landscape' : 'portrait');
    case 'prefers-reduced-motion': return (value ?? 'reduce') === (env.reducedMotion ? 'reduce' : 'no-preference');
    case 'prefers-color-scheme': return value === 'light';
    case 'hover': return (value ?? 'hover') === 'hover';
    case 'pointer': return value === 'fine';
    default: return false;
  }
}

/** A length in px; em and rem count as 16px. */
function toPx(size = '') {
  const n = parseFloat(size);
  return /r?em$/.test(size.trim()) ? n * 16 : n;
}
