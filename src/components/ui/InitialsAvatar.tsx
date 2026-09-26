import { cn } from '../../lib/utils';
import {
  getInitials,
  AVATAR_SIZE,
  type AvatarSize,
} from '../../lib/visualTokens';

interface InitialsAvatarProps {
  name: string;
  size?: AvatarSize;
  className?: string;
}

/**
 * The neutral placeholder for a person we have no photograph of.
 *
 * Two rules, both of which the old generic-silhouette version broke:
 *
 *  - **Never invent a face.** This is a civic portal about real, identifiable
 *    people. A stock silhouette next to a real name implies a photograph of
 *    that person, which would be a lie.
 *  - **Never look like a failed image load.** The placeholder is a flat sunken
 *    square carrying the person's own initials, so a grid of twelve reads as
 *    twelve profiles awaiting a photo rather than twelve broken images.
 *
 * It is deliberately uncoloured. Tinting each official differently would be
 * decoration, and colour-coding a person by name-hash is the kind of thing
 * that quietly becomes a category later.
 *
 * The glyph is `text-gray-600` on `bg-gray-100` — 5.46:1. Not gray-400, which
 * measures 2.97:1 on the same tile and would be the one thing on the page a
 * reader genuinely cannot see.
 */
export function InitialsAvatar({
  name,
  size = 'md',
  className,
}: InitialsAvatarProps) {
  const initials = getInitials(name);

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden',
        'rounded-lg bg-gray-100 font-semibold uppercase leading-none text-gray-600',
        'ring-1 ring-inset ring-black/[0.06]',
        AVATAR_SIZE[size],
        className
      )}
      role="img"
      aria-label={
        initials
          ? `No official photo available for ${name}`
          : `Placeholder for ${name}`
      }
    >
      {initials || (
        <span aria-hidden="true" className="text-gray-400">
          —
        </span>
      )}
    </span>
  );
}

export default InitialsAvatar;
