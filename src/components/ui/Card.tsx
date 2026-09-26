import type { ComponentProps } from 'react';
import {
  Card as KapwaCard,
  CardContent as KapwaCardContent,
  CardFooter as KapwaCardFooter,
  CardHeader as KapwaCardHeader,
} from '@bettergov/kapwa/card';

/**
 * The portal's `Card`.
 *
 * A thin wrapper over `@bettergov/kapwa`'s Card that removes two attributes the
 * library hardcodes and that are actively wrong here:
 *
 * ```jsx
 * // in the library
 * <div role="article" aria-label="Service card" …>
 * ```
 *
 * `aria-label` on a descendant wins when a containing link computes its
 * accessible name from its contents, so every link-wrapped card on this site
 * announced as **"Service card"** — on the departments and projects grids just
 * as much as on services. Twenty-four routes of card grids, all named
 * identically. `role="article"` compounded it: a landmark per card, on a page
 * with ten of them, which is noise rather than structure.
 *
 * Both attributes are cleared by default. Callers who genuinely want a label
 * can still pass one, and it will win — the library spreads consumer props last.
 *
 * Everything else about the card (borders, radius, shadow, `hoverable`) is the
 * library's, so this stays a presentational wrapper with no opinions of its own.
 */

type CardProps = ComponentProps<typeof KapwaCard>;

export function Card({ role, 'aria-label': ariaLabel, ...props }: CardProps) {
  return (
    <KapwaCard
      {...props}
      // `undefined` rather than `null`: the library's own values are
      // overwritten by the spread, and React omits the attribute entirely.
      role={role}
      aria-label={ariaLabel}
    />
  );
}

export const CardContent = KapwaCardContent;
export const CardHeader = KapwaCardHeader;
export const CardFooter = KapwaCardFooter;

export default Card;
