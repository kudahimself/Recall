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
  | 'listSwitch';

export type ShortcutGroup = 'Answering' | 'While typing' | 'Arranging lines' | 'Lessons' | 'Anywhere';

export interface ShortcutDef {
  /**
   * Key specs: "Enter", "H", "1-9", "Shift+Enter", "Mod+Enter" (Ctrl, or Cmd
   * on macOS), "?", "Esc", "Space", "ArrowUp" and the other arrows, and
   * "Alt+ArrowUp" / "Alt+ArrowDown".
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
  close: { keys: ['Esc'], label: 'Close a dialog', group: 'Anywhere', whileTyping: true },
};

export const SHORTCUT_GROUPS: ShortcutGroup[] = ['Answering', 'While typing', 'Arranging lines', 'Lessons', 'Anywhere'];

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
const REPEATABLE = new Set<ShortcutId>(['leaveTyping', 'close', 'listMove', 'listReorder']);

const topLayer = () => (openLayers.size ? Math.max(...Array.from(openLayers)) : 0);

function onKeyDown(e: KeyboardEvent) {
  if (e.defaultPrevented || e.isComposing) return;
  const typing = isTypingTarget(e.target);
  const top = topLayer();
  for (let i = bindings.length - 1; i >= 0; i--) {
    const b = bindings[i];
    if (b.layer !== top || !b.enabled.current) continue;
    if (!matchesShortcut(b.id, e)) continue;
    if (typing && !SHORTCUTS[b.id].whileTyping) continue;
    if (e.repeat && !REPEATABLE.has(b.id)) {
      e.preventDefault();
      return;
    }
    if (b.handler.current(e) !== false) {
      e.preventDefault();
      return;
    }
  }
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
