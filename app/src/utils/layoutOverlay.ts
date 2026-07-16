// Draws the flex/grid layout overlay INSIDE the preview iframe document.
// The overlay root is appended to documentElement (not body) so learner
// selectors scoped to body content can never style it, uses inline styles
// only (the frame is a white real-web document, app CSS vars don't exist
// there), and is pointer-events:none throughout.
// Coordinates are document-relative, so the overlay scrolls with the content.

import { detectLayoutContainers, LayoutKind } from './frameInspector';

export const OVERLAY_ID = 'recall-layout-overlay';

const COLORS: Record<LayoutKind, { line: string; fill: string; badgeBg: string }> = {
  flex: { line: '#0ea5e9', fill: 'rgba(14, 165, 233, 0.12)', badgeBg: 'rgba(14, 165, 233, 0.9)' },
  grid: { line: '#a855f7', fill: 'rgba(168, 85, 247, 0.12)', badgeBg: 'rgba(168, 85, 247, 0.9)' },
};

const HATCH = (color: string) =>
  `repeating-linear-gradient(45deg, ${color} 0 3px, transparent 3px 7px)`;

// "100px 240.5px 100px" -> [100, 240.5]; "none" / "" -> [].
// Computed grid-template values are already resolved to a px list.
export function parseTrackList(computedTemplate: string): number[] {
  if (!computedTemplate || computedTemplate === 'none') return [];
  return computedTemplate
    .split(/\s+/)
    .map(part => (part.endsWith('px') ? parseFloat(part) : NaN))
    .filter(n => !Number.isNaN(n));
}

export function clearLayoutOverlay(doc: Document): void {
  doc.getElementById(OVERLAY_ID)?.remove();
}

export function renderLayoutOverlay(doc: Document, win: Window): void {
  try {
    clearLayoutOverlay(doc);
    const containers = detectLayoutContainers(doc, win);
    if (containers.length === 0) return;

    const root = doc.createElement('div');
    root.id = OVERLAY_ID;
    root.setAttribute('aria-hidden', 'true');
    // Anchored at the document origin; children carry document coordinates.
    root.setAttribute(
      'style',
      'position:absolute; top:0; left:0; width:0; height:0; overflow:visible; pointer-events:none; z-index:2147483647;'
    );

    const scrollX = win.scrollX || 0;
    const scrollY = win.scrollY || 0;
    const box = (style: string) => {
      const el = doc.createElement('div');
      el.setAttribute('style', `position:absolute; pointer-events:none; ${style}`);
      root.appendChild(el);
      return el;
    };
    const place = (r: { left: number; top: number; width: number; height: number }) =>
      `left:${r.left + scrollX}px; top:${r.top + scrollY}px; width:${r.width}px; height:${r.height}px;`;

    for (const { el, kind } of containers) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      const color = COLORS[kind];
      const style = win.getComputedStyle(el);

      // Container outline + corner badge.
      box(`${place(rect)} border:1.5px dashed ${color.line}; border-radius:2px;`);
      const badge = box(
        `left:${rect.left + scrollX}px; top:${rect.top + scrollY}px; ` +
          `background:${color.badgeBg}; color:#ffffff; font:600 10px/1.4 monospace; ` +
          'padding:0 4px; border-radius:0 0 3px 0;'
      );
      badge.textContent = kind;

      // Direct children as translucent item boxes.
      const itemRects: DOMRect[] = [];
      for (const child of Array.from(el.children)) {
        const r = child.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        itemRects.push(r);
        box(`${place(r)} background:${color.fill};`);
      }

      if (kind === 'grid') {
        drawGridTracks(el, style, rect, color.line, box, scrollX, scrollY);
      } else {
        drawFlexGaps(style, itemRects, color.line, box, place);
      }
    }

    doc.documentElement.appendChild(root);
  } catch {
    // Overlay is decorative - never let it break the preview.
  }
}

type BoxFn = (style: string) => HTMLElement;

// Track boundary lines with px size labels, plus hatched gap strips.
function drawGridTracks(
  el: Element,
  style: CSSStyleDeclaration,
  rect: DOMRect,
  line: string,
  box: BoxFn,
  scrollX: number,
  scrollY: number
): void {
  const cols = parseTrackList(style.gridTemplateColumns);
  const rows = parseTrackList(style.gridTemplateRows);
  const colGap = parseFloat(style.columnGap) || 0;
  const rowGap = parseFloat(style.rowGap) || 0;
  // Tracks live inside the content box.
  const originX = rect.left + scrollX + (parseFloat(style.borderLeftWidth) || 0) + (parseFloat(style.paddingLeft) || 0);
  const originY = rect.top + scrollY + (parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.paddingTop) || 0);
  const contentH = rows.reduce((a, b) => a + b, 0) + rowGap * Math.max(0, rows.length - 1) || rect.height;
  const contentW = cols.reduce((a, b) => a + b, 0) + colGap * Math.max(0, cols.length - 1) || rect.width;

  let x = originX;
  cols.forEach((size, i) => {
    // Size label centered over the track.
    const label = box(
      `left:${x}px; top:${originY - 14}px; width:${size}px; text-align:center; ` +
        `color:${line}; font:600 10px/1.2 monospace; text-shadow:0 0 2px #ffffff;`
    );
    label.textContent = `${Math.round(size)}px`;
    x += size;
    if (i < cols.length - 1) {
      if (colGap > 0) {
        box(`left:${x}px; top:${originY}px; width:${colGap}px; height:${contentH}px; background:${HATCH(line + '55')};`);
      }
      box(`left:${x}px; top:${originY}px; width:0; height:${contentH}px; border-left:1px dashed ${line};`);
      box(`left:${x + colGap}px; top:${originY}px; width:0; height:${contentH}px; border-left:1px dashed ${line};`);
      x += colGap;
    }
  });

  let y = originY;
  rows.forEach((size, i) => {
    y += size;
    if (i < rows.length - 1) {
      if (rowGap > 0) {
        box(`left:${originX}px; top:${y}px; width:${contentW}px; height:${rowGap}px; background:${HATCH(line + '55')};`);
      }
      box(`left:${originX}px; top:${y}px; width:${contentW}px; height:0; border-top:1px dashed ${line};`);
      box(`left:${originX}px; top:${y + rowGap}px; width:${contentW}px; height:0; border-top:1px dashed ${line};`);
      y += rowGap;
    }
  });
}

// Hatched strips in the gaps between consecutive flex items (same row/column).
function drawFlexGaps(
  style: CSSStyleDeclaration,
  itemRects: DOMRect[],
  line: string,
  box: BoxFn,
  place: (r: { left: number; top: number; width: number; height: number }) => string
): void {
  const colGap = parseFloat(style.columnGap) || 0;
  const rowGap = parseFloat(style.rowGap) || 0;
  if (colGap === 0 && rowGap === 0) return;
  for (let i = 0; i < itemRects.length - 1; i++) {
    const a = itemRects[i];
    const b = itemRects[i + 1];
    const overlapsVertically = a.top < b.bottom && b.top < a.bottom;
    const overlapsHorizontally = a.left < b.right && b.left < a.right;
    if (colGap > 0 && overlapsVertically && b.left - a.right > 0.5) {
      box(
        `${place({ left: a.right, top: Math.min(a.top, b.top), width: b.left - a.right, height: Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top) })} ` +
          `background:${HATCH(line + '55')};`
      );
    } else if (rowGap > 0 && overlapsHorizontally && b.top - a.bottom > 0.5) {
      box(
        `${place({ left: Math.min(a.left, b.left), top: a.bottom, width: Math.max(a.right, b.right) - Math.min(a.left, b.left), height: b.top - a.bottom })} ` +
          `background:${HATCH(line + '55')};`
      );
    }
  }
}
