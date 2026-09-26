import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FacebookPagePlugin from '../FacebookPagePlugin';

describe('FacebookPagePlugin', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('replaces a blocked embed with a compact external fallback', () => {
    vi.useFakeTimers();
    render(
      <FacebookPagePlugin
        href="https://facebook.com/cabanatuan"
        pageName="Cabanatuan City"
        height={500}
      />
    );

    act(() => {
      vi.advanceTimersByTime(12_000);
    });

    const fallback = screen.getByRole('link', {
      name: /Open Cabanatuan City on Facebook/i,
    });
    expect(fallback).toHaveAttribute('href', 'https://facebook.com/cabanatuan');
    expect(fallback.closest('[data-embed-fallback]')).toBeInTheDocument();
    expect(fallback.closest('[data-embed-fallback]')).not.toHaveStyle({
      minHeight: '500px',
    });
  });
});
