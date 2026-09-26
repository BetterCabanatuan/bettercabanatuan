import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { badge, type BadgeTone } from '../../lib/designTokens';

export type { BadgeTone };

/**
 * Tailwind class strings per tone.
 *
 * These resolve to the `--color-badge-*` tokens in `src/index.css`, not to
 * arbitrary hex. The values themselves live in `badge` in designTokens.ts,
 * which is what the contrast audit measures — the two are asserted to agree by
 * `src/lib/__tests__/designTokens.test.ts`.
 */
const TONE_CLASS: Record<BadgeTone, string> = {
  info: 'bg-badge-info text-badge-info-fg',
  warning: 'bg-badge-warning text-badge-warning-fg',
  success: 'bg-badge-success text-badge-success-fg',
  neutral: 'bg-badge-neutral text-badge-neutral-fg',
  accent: 'bg-badge-accent text-badge-accent-fg',
};

export type BadgeSize = 'sm' | 'md';

const SIZE_CLASS: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[0.6875rem]',
  md: 'px-2.5 py-1 text-xs',
};

interface StatusBadgeProps {
  tone: BadgeTone;
  children: ReactNode;
  size?: BadgeSize;
  className?: string;
}

/**
 * The only badge in the system.
 *
 * Two rules this enforces, both of which the ad-hoc badges got wrong:
 *
 *  - **Colour is never the only signal.** A badge always renders a text label.
 *    "Ongoing" and "Completed" are words, not coloured dots, so the status
 *    survives a colour-blind reader and a monochrome print.
 *  - **Every tone clears 4.5:1.** The measured floors are 6.37:1 (warning) to
 *    7.35:1 (neutral); these were the lowest of the set and are asserted in
 *    `src/lib/__tests__/designTokens.test.ts`.
 */
export function StatusBadge({
  tone,
  children,
  size = 'md',
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold whitespace-nowrap',
        TONE_CLASS[tone],
        SIZE_CLASS[size],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Exposed so tests and docs can assert the pairings that ship. */
export const BADGE_TOKENS = badge;

export default StatusBadge;
