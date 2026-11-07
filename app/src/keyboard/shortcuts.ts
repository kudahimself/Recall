import { createContext, useContext, useEffect, useRef, useState } from 'react';

/**
 * The one shortcut registry. Key handling (useShortcut) and the help overlay
 * (ShortcutHelp, opened with ?) both read SHORTCUTS, so the help never drifts
 * from what the keys do.
 *
 * Rules that keep it from fighting text boxes and editors:
 * - Single keys never fire while typing (an input, textarea, select,
 *   contenteditable or the Monaco editor). Radios and checkboxes are not typing.
 * - Only shortcuts marked `whileTyping` (Shift+Enter, Ctrl/Cmd+Enter, Esc)
 *   work inside a text box.
 * - A held key fires once: auto-repeated keydowns are swallowed for every
 *   shortcut except Esc and a list's arrows, so holding Enter or Shift+Enter can never
 *   pick, submit or record an answer on the next step or question.
 * - Browser-reserved combinations (Ctrl+R, Ctrl+1-9 and the like) are never bound.
 * - A sequence such as "G H" is two single keys: G arms it, and the next key
 *   within SEQUENCE_MS completes it (any other key, or a pause, drops it).
 * - An open dialog takes the keys: only shortcuts registered while it is the
 *   top layer fire.
 */

export type ShortcutId =
  | 'pick'
  | 'submit'
  | 'submitTyping'
  | 'hint'
  | 'solution'
  | 'leaveTyping'
  | 'ruleCard'
  | 'startExercises'
  | 'help'
  | 'close'
  | 'nextBlank'
  | 'listMove'
  | 'listToggle'
  | 'listReorder'
  | 'listSwitch'
  | 'goHome'
  | 'goLearn'
  | 'goProgress'
  | 'goSettings'
  | 'switchCourse'
  | 'startSession'
  | 'switchTab'
  | 'moveInList'
  | 'drill';

export type ShortcutGroup = 'Answering' | 'While typing' | 'Arranging lines' | 'Lessons' | 'Anywhere' | 'Home' | 'Progress';

export interface ShortcutDef {
  /**
   * Key specs: "Enter", "H", "1-9", "Shift+Enter", "Mod+Enter" (Ctrl, or Cmd
   * on macOS), "?", "Esc", "Space", "ArrowUp" and the other arrows,
   * "Alt+ArrowUp" / "Alt+ArrowDown", or a sequence "G H".
   */
  keys: string[];
  label: string;
  group: ShortcutGroup;
  /** Fires inside text boxes too. */
  whileTyping?: boolean;
}

export const SHORTCUTS: Record<ShortcutId, ShortcutDef> = {
  pick: { keys: ['1-9'], label: 'Pick an option or a line', group: 'Answering' },
  submit: { keys: ['Enter'], label: 'Check your answer, then go to the next one', group: 'Answering' },
  hint: { keys: ['H'], label: 'Show the hint (in code: the next hint)', group: 'Answering' },
  solution: { keys: ['S'], label: 'Show the solution after a miss (in code: give up)', group: 'Answering' },
  submitTyping: { keys: ['Shift+Enter', 'Mod+Enter'], label: 'Check from a text box, a blank or the code editor', group: 'While typing', whileTyping: true },
  nextBlank: { keys: ['Enter'], label: 'In a blank: go to the next one (checks on the last)', group: 'While typing', whileTyping: true },
  leaveTyping: { keys: ['Esc'], label: 'Leave the text box or editor, so single keys work again', group: 'While typing', whileTyping: true },
  listMove: { keys: ['ArrowUp', 'ArrowDown'], label: 'Move between lines', group: 'Arranging lines' },
  listToggle: { keys: ['Space'], label: 'Add the line to your solution, or take it back', group: 'Arranging lines' },
  listReorder: { keys: ['Alt+ArrowUp', 'Alt+ArrowDown'], label: 'Move the line up or down in your solution', group: 'Arranging lines' },
  listSwitch: { keys: ['ArrowLeft', 'ArrowRight'], label: 'Switch between the lines and your solution', group: 'Arranging lines' },
  ruleCard: { keys: ['R'], label: 'Open or close the rule card', group: 'Lessons' },
  startExercises: { keys: ['Enter'], label: 'Start the exercises from a rule card', group: 'Lessons' },
  help: { keys: ['?'], label: 'Show or hide these shortcuts', group: 'Anywhere' },
  close: { keys: ['Esc'], label: 'Close a dialog or a list', group: 'Anywhere', whileTyping: true },
  goHome: { keys: ['G H'], label: 'Go to Home', group: 'Anywhere' },
  goLearn: { keys: ['G L'], label: "Go to Learn: today's session", group: 'Anywhere' },
  goProgress: { keys: ['G P'], label: 'Go to Progress', group: 'Anywhere' },
  goSettings: { keys: ['G S'], label: 'Go to Settings', group: 'Anywhere' },
  switchCourse: { keys: ['C'], label: 'Switch course, then 1-5 to pick', group: 'Anywhere' },
  startSession: { keys: ['Enter'], label: "Start today's session", group: 'Home' },
  switchTab: { keys: ['ArrowLeft', 'ArrowRight'], label: 'Previous or next tab', group: 'Progress' },
  moveInList: { keys: ['ArrowUp', 'ArrowDown'], label: 'Move through the topics or the schedule', group: 'Progress' },
  drill: { keys: ['D'], label: 'Drill the selected topic (on Overview, every weak one)', group: 'Progress' },
};

export const SHORTCUT_GROUPS: ShortcutGroup[] = ['Answering', 'While typing', 'Arranging lines', 'Lessons', 'Anywhere', 'Home', 'Progress'];

/** How long the second key of a sequence ("G H") may wait after the first. */
export const SEQUENCE_MS = 1500;

/** The keys of a sequence spec ("G H" gives ["G", "H"]); one key for anything else. */
export function sequenceKeys(spec: string): string[] {
  return /^[A-Z] [A-Z]$/.test(spec) ? spec.split(' ') : [spec];
}

/** True when the key goes into a text box or editor, where single keys must type. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target.closest('.monaco-editor')) return true;
  if (target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return true;
  if (target instanceof HTMLInputElement) {
    return !['radio', 'checkbox', 'button', 'submit', 'reset', 'range', 'color', 'file'].includes(target.type);
  }
  return false;
}

const ARROWS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

function matchesSpec(spec: string, e: KeyboardEvent): boolean {
  const mod = e.ctrlKey || e.metaKey;
  // A sequence matches on its last key, once its first key has armed it (see onKeyDown).
  const seq = sequenceKeys(spec);
  if (seq.length > 1) return pendingPrefix === seq[0] && matchesSpec(seq[1], e);
  if (spec === '1-9') return !mod && !e.altKey && /^[1-9]$/.test(e.key);
  if (spec === '?') return !mod && !e.altKey && e.key === '?';
  if (spec === 'Esc') return e.key === 'Escape';
  if (spec === 'Enter') return e.key === 'Enter' && !mod && !e.altKey && !e.shiftKey;
  if (spec === 'Shift+Enter') return e.key === 'Enter' && e.shiftKey && !mod && !e.altKey;
  if (spec === 'Mod+Enter') return e.key === 'Enter' && mod && !e.altKey;
  if (spec === 'Space') return e.key === ' ' && !mod && !e.altKey && !e.shiftKey;
  if (ARROWS.has(spec)) return e.key === spec && !mod && !e.altKey && !e.shiftKey;
  if (spec.startsWith('Alt+') && ARROWS.has(spec.slice(4))) return e.key === spec.slice(4) && e.altKey && !mod && !e.shiftKey;
  // A single letter, either case, no modifiers.
  return spec.length === 1 && !mod && !e.altKey && e.key.toLowerCase() === spec.toLowerCase();
}

export function matchesShortcut(id: ShortcutId, e: KeyboardEvent): boolean {
  return SHORTCUTS[id].keys.some(spec => matchesSpec(spec, e));
}

/** The number a "1-9" pick key stands for, 1-based. */
export function pickedNumber(e: KeyboardEvent): number {
  return Number(e.key);
}

// ---- Dispatcher: one window listener, newest binding first ----

/** Return false to let the key go on (the browser's default and older bindings). */
export type ShortcutHandler = (e: KeyboardEvent) => boolean | void;

interface Binding {
  id: ShortcutId;
  handler: { current: ShortcutHandler };
  enabled: { current: boolean };
  layer: number;
}

const bindings: Binding[] = [];
const openLayers = new Set<number>();
let layerCounter = 0;
let listening = false;

// Esc, and the arrows of a list (holding one walks or carries a line along).
const REPEATABLE = new Set<ShortcutId>(['leaveTyping', 'close', 'listMove', 'listReorder', 'moveInList']);

/** The first key of a sequence just pressed ("G"), until the next key or SEQUENCE_MS. */
let pendingPrefix: string | null = null;
let pendingTimer: ReturnType<typeof setTimeout> | null = null;

function clearPending() {
  pendingPrefix = null;
  if (pendingTimer) clearTimeout(pendingTimer);
  pendingTimer = null;
}

/** The sequence prefix this key arms ("G"), when an enabled binding on the top layer starts with it. */
function prefixFor(e: KeyboardEvent, top: number): string | null {
  if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return null;
  const key = e.key.toUpperCase();
  const armed = bindings.some(b => b.layer === top && b.enabled.current
    && SHORTCUTS[b.id].keys.some(spec => { const seq = sequenceKeys(spec); return seq.length > 1 && seq[0] === key; }));
  return armed ? key : null;
}

const topLayer = () => (openLayers.size ? Math.max(...Array.from(openLayers)) : 0);

function onKeyDown(e: KeyboardEvent) {
  if (e.defaultPrevented || e.isComposing) return;
  if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
  const typing = isTypingTarget(e.target);
  const top = topLayer();
  // The second key of a sequence: complete it below, or drop it.
  const completing = pendingPrefix !== null;
  if (!completing && !typing && !e.repeat) {
    const prefix = prefixFor(e, top);
    if (prefix) {
      pendingPrefix = prefix;
      pendingTimer = setTimeout(clearPending, SEQUENCE_MS);
      e.preventDefault();
      return;
    }
  }
  // A completed sequence ("G" then "H") wins over a single-key binding of its last key ("H" hint).
  if (completing) {
    const handled = dispatch(e, typing, top, true);
    clearPending();
    if (handled) return;
  }
  dispatch(e, typing, top, false);
}

/** Run the newest matching binding; true when one took the key. */
function dispatch(e: KeyboardEvent, typing: boolean, top: number, sequencesOnly: boolean): boolean {
  for (let i = bindings.length - 1; i >= 0; i--) {
    const b = bindings[i];
    if (b.layer !== top || !b.enabled.current) continue;
    const specs = SHORTCUTS[b.id].keys.filter(spec => !sequencesOnly || sequenceKeys(spec).length > 1);
    if (!specs.some(spec => matchesSpec(spec, e))) continue;
    if (typing && !SHORTCUTS[b.id].whileTyping) continue;
    if (e.repeat && !REPEATABLE.has(b.id)) {
      e.preventDefault();
      return true;
    }
    if (b.handler.current(e) !== false) {
      e.preventDefault();
      return true;
    }
  }
  return false;
}

function ensureListening() {
  if (listening || typeof window === 'undefined') return;
  window.addEventListener('keydown', onKeyDown);
  listening = true;
}

/** The layer a shortcut belongs to: 0 for the page, a dialog's own number inside it. */
export const ShortcutLayerContext = createContext(0);

/**
 * Open a shortcut layer for a dialog while it is mounted: until it closes,
 * only shortcuts bound inside it (under its ShortcutLayerContext) fire.
 */
export function useShortcutLayer(): number {
  const [own] = useState(() => ++layerCounter);
  useEffect(() => {
    openLayers.add(own);
    return () => { openLayers.delete(own); };
  }, [own]);
  return own;
}

/**
 * Bind a registry shortcut while the component is mounted. The handler may
 * change on every render; `enabled` switches it off without unbinding.
 */
export function useShortcut(id: ShortcutId, handler: ShortcutHandler, enabled = true) {
  const layer = useContext(ShortcutLayerContext);
  const handlerRef = useRef(handler);
  const enabledRef = useRef(enabled);
  handlerRef.current = handler;
  enabledRef.current = enabled;
  useEffect(() => {
    ensureListening();
    const binding: Binding = { id, handler: handlerRef, enabled: enabledRef, layer };
    bindings.push(binding);
    return () => {
      const at = bindings.indexOf(binding);
      if (at >= 0) bindings.splice(at, 1);
    };
  }, [id, layer]);
}
