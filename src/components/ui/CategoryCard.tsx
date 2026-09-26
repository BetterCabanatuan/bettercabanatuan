import { Link } from 'react-router-dom';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from './Card';
import { cn } from '../../lib/utils';
import IconTile from './IconTile';
import type { VisualTone } from '../../lib/visualTokens';

/**
 * Card metrics, fixed in one place.
 *
 * Four near-identical card implementations existed before this, each with its
 * own padding (p-5 vs p-6), its own tile size (36 vs 44px), its own shadow, and
 * its own idea of where the CTA went. The numbers below are the single
 * definition, and every card type now reads from it.
 */
export const CARD = {
  /** Interior padding. One value at every breakpoint — a card that gains
   *  padding at md reads as a different card, not the same one, larger. */
  padding: 'p-5 sm:p-6',
  /** Resting elevation. Two layers: a contact shadow plus a wide ambient. */
  shadow:
    'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]',
  /** Hovered elevation, plus a 2px lift. */
  hoverShadow:
    'hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.1)]',
  /** Title clamp. Three lines is the most that stays scannable in a grid. */
  title: 'text-base sm:text-lg font-semibold text-gray-900',
  /** Body clamp, so cards in a row end at the same height. */
  body: 'text-sm text-gray-600 line-clamp-3',
  /** Footer rule and meta text. */
  footer: 'border-t border-gray-100 pt-3 mt-1',
  cta: 'text-sm font-medium text-primary-600',
} as const;

interface CategoryCardProps {
  to: string;
  title: string;
  description?: string;
  /** The visual anchor. Omit only when the card genuinely has no imagery. */
  icon?: LucideIcon;
  tone?: VisualTone;
  /** Small chip in the top-right, e.g. a department acronym. */
  meta?: React.ReactNode;
  /** Left-hand text in the footer, e.g. a budget or a term. */
  footnote?: React.ReactNode;
  /** Right-hand footer affordance label. Omit for a non-interactive card. */
  cta?: string;
  /** Heading level, so the card fits its page's outline. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
  /** Stagger index for the entrance animation. */
  animationDelay?: number;
  animate?: boolean;
  /** Opens the destination as an external website. */
  external?: boolean;
}

/**
 * The one card.
 *
 * Used by service categories, government sections, departments, and projects.
 * A card is one of exactly two things:
 *
 *   - a **category** — icon tile, title, description, footer CTA
 *   - an **entity** — icon tile, optional meta chip, title, description, footer
 *
 * It is never a navigational shortcut to "everything else". Those are
 * `BrowseAllLink`, rendered outside the grid, because a generic filler card
 * sitting in the same row as a real category makes the reader count the row to
 * work out what is what.
 */
export function CategoryCard({
  to,
  title,
  description,
  icon: Icon,
  tone = 'primary',
  meta,
  footnote,
  cta,
  headingLevel = 3,
  className,
  animationDelay,
  animate = false,
  external = false,
}: CategoryCardProps) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';
  const titleId = `${to.replace(/[^\w]+/g, '-')}-title`;

  const card = (
    <Card
      hoverable
      aria-label={undefined}
      role={undefined}
      className={cn(
        'h-full transition-[transform,box-shadow] duration-200',
        'group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0',
        'active:scale-[0.99] motion-reduce:active:scale-100',
        CARD.shadow,
        CARD.hoverShadow,
        animate && 'motion-safe:animate-slide-in motion-reduce:animate-none'
      )}
      style={
        animate ? { animationDelay: `${animationDelay ?? 0}ms` } : undefined
      }
    >
      <CardContent className={cn('flex h-full flex-col', CARD.padding)}>
        {(Icon || meta) && (
          <div className="mb-4 flex items-start justify-between gap-3">
            {Icon ? <IconTile icon={Icon} tone={tone} /> : <span />}
            {meta}
          </div>
        )}

        <Heading
          id={titleId}
          className={cn(
            CARD.title,
            'mb-2 text-pretty transition-colors duration-200',
            'group-hover:text-primary-700'
          )}
        >
          {title}
        </Heading>

        {description ? (
          <p className={cn(CARD.body, 'mb-4 flex-grow text-pretty')}>
            {description}
          </p>
        ) : (
          <span className="flex-grow" />
        )}

        {(footnote || cta) && (
          <div
            className={cn(
              'flex items-center justify-between gap-3',
              CARD.footer
            )}
          >
            {footnote ? (
              <span className="min-w-0 truncate text-xs text-gray-500">
                {footnote}
              </span>
            ) : (
              <span />
            )}
            {cta && (
              <span
                className={cn(
                  CARD.cta,
                  'inline-flex shrink-0 items-center gap-1 transition-[gap,color] duration-200 group-hover:gap-2 group-hover:text-primary-700'
                )}
              >
                {cta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const linkClassName = cn(
    'group block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
    className
  );

  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        aria-labelledby={titleId}
        className={linkClassName}
      >
        {card}
      </a>
    );
  }

  return (
    <Link
      to={to}
      /*
       * Named by the card's own title.
       *
       * The underlying `Card` ships a hardcoded `aria-label="Service card"`, and
       * because that label sits on a descendant of the link, it becomes the
       * link's accessible name — so every card on the site announced as
       * "Service card", on a page of departments and projects as much as
       * services. Naming the link by its title instead means a screen-reader
       * user tabbing the grid hears the ten things they can actually go to.
       */
      aria-labelledby={titleId}
      className={linkClassName}
    >
      {card}
    </Link>
  );
}

export default CategoryCard;
