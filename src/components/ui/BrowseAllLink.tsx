import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BrowseAllLinkProps {
  to: string;
  children: React.ReactNode;
  /**
   * How many items sit behind the link. Renders as "(10)" next to the label so
   * the reader knows the grid above is a sample, not the whole list — which is
   * the number that makes this a signpost rather than a category.
   */
  count?: number;
  className?: string;
  external?: boolean;
}

/**
 * The "browse everything" affordance, and the reason it is not a card.
 *
 * This used to be a fifth card in the row, drawn in exactly the same way as
 * "Health Services" and "Education". Two things were wrong with that:
 *
 *  - **It lied about the grid.** A reader scanning four real categories and one
 *    filler had no way to tell which was which, so every card had to be read.
 *  - **It was not a peer.** It had no icon that meant anything, no
 *    description of its own content, and it pointed at a listing rather than a
 *    subject.
 *
 * So it leaves the grid entirely. Below the cards it becomes a quiet text link
 * with a count, which is what it always actually was: a signpost, not a
 * category. It sits on its own line, centred, so the eye finishes the grid and
 * then finds the exit.
 */
export function BrowseAllLink({
  to,
  children,
  count,
  className,
  external,
}: BrowseAllLinkProps) {
  const content = (
    <>
      {children}
      {typeof count === 'number' && (
        <span className="text-gray-500"> ({count})</span>
      )}
      <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
    </>
  );

  const classes = cn(
    'group inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 py-2',
    'text-sm font-medium text-primary-600',
    'transition-colors duration-200 hover:text-primary-700 hover:underline',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
    className
  );

  if (external) {
    return (
      <a href={to} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link to={to} className={classes}>
      {content}
    </Link>
  );
}

/**
 * Centres a footer CTA under a grid and gives it breathing room, so every
 * section with a "browse all" ends the same way.
 */
export function BrowseAllFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('mt-8 flex justify-center', className)}>{children}</div>
  );
}

export default BrowseAllLink;
