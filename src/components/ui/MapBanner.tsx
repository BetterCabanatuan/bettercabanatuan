import { MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Pending location state. It deliberately contains no map-like geometry; a
 * real map must be supplied from separately cleared, barangay-specific data.
 */
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
 * Accessible pending state for a location that has not been verified. This is
 * not a map and must not be used to imply coordinates or boundary geometry.
 */
export function MapBanner({
  label,
  caption,
  className,
  size = 'md',
}: MapBannerProps) {
  return (
    <div
      role="status"
      aria-label="Map location not yet verified"
      className={cn(
        'relative isolate flex items-center overflow-hidden rounded-xl',
        'bg-primary-50 ring-1 ring-inset ring-primary-100',
        size === 'sm'
          ? 'aspect-[4/1] min-h-16 px-4'
          : 'aspect-[3/1] min-h-28 px-5',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white"
          aria-hidden="true"
        >
          <MapPin className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-primary-900">
            Map location not yet verified
          </span>
          <span className="block truncate text-xs text-gray-600">
            {label}
            {caption ? ` · ${caption}` : ''}
          </span>
        </span>
      </div>
    </div>
  );
}

export default MapBanner;
