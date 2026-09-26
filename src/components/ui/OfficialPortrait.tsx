import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import {
  AVATAR_PX,
  AVATAR_SIZE,
  type AvatarSize,
} from '../../lib/visualTokens';
import InitialsAvatar from './InitialsAvatar';

interface OfficialPortraitProps {
  /** Path to the photograph. Absent, empty, or broken all mean "no photo". */
  src?: string;
  /** Full name, used for the initials fallback and the accessible label. */
  name: string;
  /** Position, appended to the alt text so a screen reader says who this is. */
  position?: string;
  size?: AvatarSize;
  className?: string;
  /** Above-the-fold portraits should skip lazy loading. */
  priority?: boolean;
}

/**
 * An official's portrait, or their initials when we do not have one.
 *
 * Three states, all of them intentional-looking:
 *
 *   1. a photo loads            — square, `object-cover`, so any crop fills
 *   2. no `src` in the data     — initials tile
 *   3. `src` is set but 404s    — initials tile, swapped in on error
 *
 * The third case is the one that matters. Photo paths arrive with the data in
 * a later phase, and a wrong path would otherwise render as a browser's broken
 * image icon — which on a page about public officials reads as carelessness
 * about a real person. `onError` makes a bad path degrade to exactly the same
 * tile as a missing one, so the two are indistinguishable to the reader.
 */
export function OfficialPortrait({
  src,
  name,
  position,
  size = 'md',
  className,
  priority = false,
}: OfficialPortraitProps) {
  const [failed, setFailed] = useState(false);

  // A new src deserves a fresh attempt; without this, one broken path would
  // stick for the life of the component across client-side navigation.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const trimmed = src?.trim();
  const showPhoto = Boolean(trimmed) && !failed;
  const label = position ? `${name}, ${position}` : name;
  const px = AVATAR_PX[size];

  if (!showPhoto) {
    return <InitialsAvatar name={name} size={size} className={className} />;
  }

  return (
    <img
      src={trimmed}
      alt={label}
      width={px}
      height={px}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      // 1:1 with object-cover: a portrait cropped to a square still reads as a
      // face, where a 4:3 crop would cut people off at the shoulders.
      className={cn(
        'shrink-0 rounded-lg object-cover bg-gray-100',
        'ring-1 ring-inset ring-black/[0.06]',
        AVATAR_SIZE[size],
        className
      )}
      onError={() => setFailed(true)}
    />
  );
}

export default OfficialPortrait;
