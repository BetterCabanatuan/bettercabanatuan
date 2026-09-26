import { MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * A schematic graticule, drawn as a repeating SVG data URI.
 *
 * Deliberately not a map. We have no verified boundary geometry for any of the
 * 89 barangays, and inventing a plausible-looking map would be a fabricated
 * image on a civic site — worse than an honest blank. The pattern reads as
 * "map goes here" and, once real geometry exists, gets replaced by an actual
 * map without the layout moving.
 */
const GRATICULE =
  "url(\"data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230066eb' stroke-opacity='0.14' stroke-width='1'%3E%3Cpath d='M0 36h72M36 0v72'/%3E%3Cpath d='M0 18h72M0 54h72M18 0v72M54 0v72' stroke-opacity='0.07'/%3E%3C/g%3E%3C/svg%3E\")";

interface MapBannerProps {
  /** The place being described, e.g. "Barangay San Juan". */
  label: string;
  /** Optional supporting line under the label. */
  caption?: string;
  className?: string;
  /** Compact ratio for list headers; the default is the wide detail-page band. */
  size?: 'sm' | 'md';
}

/**
 * Optional map anchor for barangay and department pages.
 *
 * Ratio is fixed at 4:1 (`sm`) or 3:1 (`md`) so a stack of these lines up
 * regardless of how long the names are. The label always sits inside the band
 * on a solid chip, which is what keeps a placeholder from being mistaken for a
 * failed image: there is text in the frame, so the frame is obviously a
 * designed element.
 */
export function MapBanner({
  label,
  caption,
  className,
  size = 'md',
}: MapBannerProps) {
  return (
    <div
      className={cn(
        'relative isolate flex items-center overflow-hidden rounded-xl',
        'bg-primary-50 ring-1 ring-inset ring-primary-100',
        size === 'sm'
          ? 'aspect-[4/1] min-h-16 px-4'
          : 'aspect-[3/1] min-h-28 px-5',
        className
      )}
    >
      <div
        className="absolute inset-0 -z-10"
        style={{ backgroundImage: GRATICULE }}
        aria-hidden="true"
      />
      <div className="flex items-center gap-3">
        <span
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white"
          aria-hidden="true"
        >
          <MapPin className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-primary-900">
            {label}
          </span>
          {caption && (
            <span className="block truncate text-xs text-gray-600">
              {caption}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

export default MapBanner;
