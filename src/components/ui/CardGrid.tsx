import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

const GRID =
  'grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4';
const CENTERED_PROMOTIONAL_GRID =
  'flex flex-wrap justify-center gap-4 md:gap-6 [&>li]:basis-full sm:[&>li]:basis-[calc(50%-0.5rem)] md:[&>li]:basis-[calc(50%-0.75rem)] lg:[&>li]:basis-[calc(33.333%-1rem)] xl:[&>li]:basis-[calc(25%-1.125rem)]';

interface CardGridProps {
  children: ReactNode;
  className?: string;
  /**
   * Render as a semantic list. Every card grid on this site is a list of
   * peers, and a bare run of divs reads as one undifferentiated block to a
   * screen reader — the count and the boundaries are both lost.
   */
  as?: 'ul' | 'div';
  /** Announced before the list, e.g. "Service categories". */
  label?: string;
  /** Directory rows start at the reading edge; promotional groups may opt in. */
  align?: 'start' | 'center';
}

/**
 * The card grid.
 *
 * Directory rows align to the reading edge. A centred final card looked like a
 * misplaced feature rather than the end of a list, especially on Government.
 * The explicit promotional variant uses flex-wrap only when centring is an
 * intentional part of the composition.
 */
export function CardGrid({
  children,
  className,
  as = 'ul',
  label,
  align = 'start',
}: CardGridProps) {
  const Tag = as as 'ul' | 'div';

  return (
    <Tag
      className={cn(
        align === 'center' ? CENTERED_PROMOTIONAL_GRID : GRID,
        className
      )}
      aria-label={label}
      /*
        Marks this as a card grid for the QA audit.
        `scripts/qa-audit.mjs` checks row fill and centring, and there are other
        wrapping flex rows on the site — the hotline strip, footer link rows —
        whose last row is *meant* to sit left-aligned. Keying off an explicit
        marker keeps the check aimed at card grids instead of every flex list
        that happens to wrap.
      */
      data-card-grid=""
      data-card-grid-align={align}
    >
      {children}
    </Tag>
  );
}

/**
 * Wrapper for a single grid item. Keeps children equal height regardless of
 * how much text each card holds.
 */
export function CardGridItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <li className={className}>{children}</li>;
}

export default CardGrid;
