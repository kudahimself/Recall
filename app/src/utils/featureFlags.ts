/**
 * Boolean feature flags persisted in localStorage. Each flag has a default
 * that applies when the key isn't set; an explicit 'true' / 'false' override
 * always wins.
 *
 * Disable from devtools:
 *   localStorage.setItem('recall-concept-srs-enabled', 'false')
 *   location.reload()
 *
 * Wrap localStorage in a try/catch because the platform supports private-mode
 * users where access throws.
 */

export const FEATURE_FLAGS = {
  conceptSrsEnabled: 'recall-concept-srs-enabled',
} as const;

const FLAG_DEFAULTS: Record<keyof typeof FEATURE_FLAGS, boolean> = {
  conceptSrsEnabled: true,
};

type FlagKey = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(flag: FlagKey): boolean {
  try {
    const v = localStorage.getItem(FEATURE_FLAGS[flag]);
    if (v === 'true') return true;
    if (v === 'false') return false;
    return FLAG_DEFAULTS[flag];
  } catch {
    return FLAG_DEFAULTS[flag];
  }
}

export function setFeatureEnabled(flag: FlagKey, enabled: boolean): void {
  try {
    localStorage.setItem(FEATURE_FLAGS[flag], String(enabled));
  } catch {
    /* private mode / quota — non-fatal */
  }
}
