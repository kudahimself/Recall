// Read-only introspection of the live-preview iframe document.
// Shared by the @media inspector (chips) and the flex/grid layout overlay.
// Every entry point swallows access failures and returns [] - a sandboxed or
// mid-reload frame must never break the question UI.

export interface MediaRuleStatus {
  condition: string;
  active: boolean;
}

export type LayoutKind = 'flex' | 'grid';

export interface LayoutContainerInfo {
  el: Element;
  kind: LayoutKind;
}

// Detection is capped so a pathological document can't flood the overlay.
const MAX_CONTAINERS = 20;

// CSSRule.MEDIA_RULE. Numeric type check instead of instanceof: the rules
// come from the IFRAME's realm, so instanceof against this window's
// CSSMediaRule constructor is always false.
const MEDIA_RULE_TYPE = 4;

function collectMediaConditions(rules: CSSRuleList, out: string[], depth: number): void {
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (rule.type === MEDIA_RULE_TYPE) {
      const mediaRule = rule as CSSMediaRule;
      // conditionText with media.mediaText fallback (older CSSOM impls).
      const condition = mediaRule.conditionText || mediaRule.media?.mediaText || '';
      if (condition && !out.includes(condition)) {
        out.push(condition);
      }
    } else if (depth < 1 && 'cssRules' in rule) {
      // One level into grouping rules (@supports, @layer) is enough for
      // question-scale CSS.
      collectMediaConditions((rule as CSSGroupingRule).cssRules, out, depth + 1);
    }
  }
}

// Reads @media conditions from the learner's style tag only (tagged with
// data-learner-css by buildPreviewDoc) and evaluates each against the FRAME's
// window, so activity reflects the preview's width, not the app window's.
export function readMediaRules(doc: Document, win: Window): MediaRuleStatus[] {
  try {
    const sheet = doc.querySelector<HTMLStyleElement>('style[data-learner-css]')?.sheet;
    if (!sheet) return [];
    const conditions: string[] = [];
    collectMediaConditions(sheet.cssRules, conditions, 0);
    return conditions.map(condition => {
      // Fail-soft per rule: extraction still succeeds where matchMedia is
      // unavailable (jsdom) or a condition doesn't evaluate.
      let active = false;
      try {
        active = win.matchMedia(condition).matches;
      } catch {}
      return { condition, active };
    });
  } catch {
    return [];
  }
}

// Finds elements laid out with flexbox or grid by computed display value.
// Works for authored CSS and Tailwind utilities alike - no question-data hints.
export function detectLayoutContainers(doc: Document, win: Window): LayoutContainerInfo[] {
  try {
    const found: LayoutContainerInfo[] = [];
    if (!doc.body) return found;
    // body itself can be the container (e.g. centering exercises).
    const candidates: Element[] = [doc.body, ...Array.from(doc.body.querySelectorAll('*'))];
    for (let i = 0; i < candidates.length && found.length < MAX_CONTAINERS; i++) {
      const el = candidates[i];
      const display = win.getComputedStyle(el).display;
      if (display === 'flex' || display === 'inline-flex') {
        found.push({ el, kind: 'flex' });
      } else if (display === 'grid' || display === 'inline-grid') {
        found.push({ el, kind: 'grid' });
      }
    }
    return found;
  } catch {
    return [];
  }
}
