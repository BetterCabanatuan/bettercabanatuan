import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import {
  VOLUNTEER_PROMPT_KEY,
  VOLUNTEER_PROMPT_HIDDEN,
  VOLUNTEER_PROMPT_SHOW,
  getVolunteerPromptState,
  setVolunteerPromptState,
  shouldShowVolunteerPrompt,
  dismissVolunteerPrompt,
} from '../volunteerPrompt';

describe('volunteerPrompt storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('uses the documented key', () => {
    expect(VOLUNTEER_PROMPT_KEY).toBe('bc-volunteer-popup');
  });

  it('treats a first visit as "show"', () => {
    expect(getVolunteerPromptState()).toBe('1');
    expect(shouldShowVolunteerPrompt()).toBe(true);
  });

  it('writes and reads 0 / 1', () => {
    setVolunteerPromptState(VOLUNTEER_PROMPT_HIDDEN);
    expect(localStorage.getItem(VOLUNTEER_PROMPT_KEY)).toBe('0');
    expect(getVolunteerPromptState()).toBe('0');
    expect(shouldShowVolunteerPrompt()).toBe(false);

    setVolunteerPromptState(VOLUNTEER_PROMPT_SHOW);
    expect(localStorage.getItem(VOLUNTEER_PROMPT_KEY)).toBe('1');
    expect(getVolunteerPromptState()).toBe('1');
    expect(shouldShowVolunteerPrompt()).toBe(true);
  });

  it('dismiss() stores 0 so the dialog stays hidden', () => {
    dismissVolunteerPrompt();
    expect(localStorage.getItem(VOLUNTEER_PROMPT_KEY)).toBe('0');
    expect(shouldShowVolunteerPrompt()).toBe(false);
  });

  it('treats an unrecognised value as "show" rather than hiding it forever', () => {
    localStorage.setItem(VOLUNTEER_PROMPT_KEY, 'yes-please');
    expect(getVolunteerPromptState()).toBe('1');
    expect(shouldShowVolunteerPrompt()).toBe(true);
  });

  it('survives a storage write failure', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    expect(() => dismissVolunteerPrompt()).not.toThrow();
    expect(setVolunteerPromptState('0')).toBe(false);
    // Still shows, so a storage failure never permanently hides the prompt.
    expect(shouldShowVolunteerPrompt()).toBe(true);
  });

  it('survives a storage read failure', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    expect(getVolunteerPromptState()).toBe('1');
    expect(shouldShowVolunteerPrompt()).toBe(true);
  });
});
