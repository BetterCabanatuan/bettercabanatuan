import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  TONE_SURFACE,
  TILE_SIZE,
  TILE_ICON,
  type TileSize,
  type VisualTone,
} from '../../lib/visualTokens';

interface IconTileProps {
  icon: LucideIcon;
  tone?: VisualTone;
  size?: TileSize;
  /**
   * Rendered as a decorative anchor when the card already names itself in
   * text. Pass a label only when the tile is the sole carrier of meaning.
   */
  label?: string;
  className?: string;
}

/**
 * The square icon anchor at the top of a card.
 *
 * This is what gives a card its visual anchor without a photograph. Every
 * service, government section, department, and project has one, at the same
 * optical weight, so a mixed grid reads as a set rather than a collection of
 * unrelated text blocks.
 */
export function IconTile({
  icon: Icon,
  tone = 'primary',
  size = 'md',
  label,
  className,
}: IconTileProps) {
  const decorative = !label;

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        TILE_SIZE[size],
        TONE_SURFACE[tone],
        className
      )}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? 'true' : undefined}
    >
      <Icon className={TILE_ICON[size]} aria-hidden="true" />
    </span>
  );
}

export default IconTile;
