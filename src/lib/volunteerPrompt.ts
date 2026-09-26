/**
 * Persistence for the volunteer prompt dialog.
 *
 * A single localStorage key records whether the visitor has already dismissed
 * the prompt:
 *
 *   '0' — dismissed. Do not show again.
 *   '1' — show the prompt.
 *
 * A missing or unreadable value is treated as '1', so the prompt is shown on a
 * first visit and a storage failure can never permanently hide it.
 */
export const VOLUNTEER_PROMPT_KEY = 'bc-volunteer-popup';

export type VolunteerPromptState = '0' | '1';

export const VOLUNTEER_PROMPT_SHOW: VolunteerPromptState = '1';
export const VOLUNTEER_PROMPT_HIDDEN: VolunteerPromptState = '0';

/** True when localStorage can actually be used (private mode can throw). */
function storage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Reads the stored state, or '1' when unset or unreadable. */
export function getVolunteerPromptState(): VolunteerPromptState {
  try {
    const raw = storage()?.getItem(VOLUNTEER_PROMPT_KEY);
    return raw === VOLUNTEER_PROMPT_HIDDEN
      ? VOLUNTEER_PROMPT_HIDDEN
      : VOLUNTEER_PROMPT_SHOW;
  } catch {
    return VOLUNTEER_PROMPT_SHOW;
  }
}

/** Persists the state. Returns false when storage is unavailable. */
export function setVolunteerPromptState(state: VolunteerPromptState): boolean {
  try {
    const store = storage();
    if (!store) return false;
    store.setItem(VOLUNTEER_PROMPT_KEY, state);
    return true;
  } catch {
    return false;
  }
}

/** Whether the prompt should be rendered. */
export function shouldShowVolunteerPrompt(): boolean {
  return getVolunteerPromptState() === VOLUNTEER_PROMPT_SHOW;
}

/** Hides the prompt for good. */
export function dismissVolunteerPrompt(): void {
  setVolunteerPromptState(VOLUNTEER_PROMPT_HIDDEN);
}
