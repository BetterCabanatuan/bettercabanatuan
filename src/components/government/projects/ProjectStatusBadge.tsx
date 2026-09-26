import StatusBadge, { type BadgeTone } from '../../ui/StatusBadge';
import { KNOWN_PROJECT_STATUSES } from '../../../data/yamlLoader';

/**
 * Project status, expressed as one of the five system tones.
 *
 * Colour is the *last* signal here, not the only one: the badge always
 * renders the status word, so "Ongoing" and "Completed" are distinguishable
 * without colour vision and in a monochrome print.
 */
const STATUS_TONE: Record<string, BadgeTone> = {
  ongoing: 'info',
  // amber reads as caution, which is what a not-yet-started project is.
  planned: 'warning',
  completed: 'success',
};

const DEFAULT_TONE: BadgeTone = 'neutral';

/** `in_progress`, `On-Going`, `ONGOING` all present the same word. */
function formatStatusLabel(status: string): string {
  return status
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

interface ProjectStatusBadgeProps {
  status?: string;
  /** Tighter padding for badges that sit in a card's top-right corner. */
  size?: 'sm' | 'md';
}

export default function ProjectStatusBadge({
  status,
  size = 'sm',
}: ProjectStatusBadgeProps) {
  // A project with no status gets no badge. An empty pill reads as a failed
  // lookup, which is worse than saying nothing.
  if (!status?.trim()) return null;

  const normalized = status.trim().toLowerCase();
  const known = normalized as (typeof KNOWN_PROJECT_STATUSES)[number];
  const tone = STATUS_TONE[known] ?? DEFAULT_TONE;

  // Known statuses get their canonical capitalisation; anything else is
  // normalised from whatever the data file said.
  const label =
    known in STATUS_TONE
      ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      : formatStatusLabel(status);

  return (
    <StatusBadge tone={tone} size={size}>
      {label}
    </StatusBadge>
  );
}
