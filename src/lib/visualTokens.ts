/**
 * Visual-anchor metrics: the tint vocabulary and the fixed sizes every card
 * icon and avatar is drawn at.
 *
 * These live apart from the components that use them so the files under
 * `components/ui/` export components and nothing else — which keeps React Fast
 * Refresh working and makes the numbers reviewable in one place.
 *
 * Every tile pair here is a glyph on a tinted square, so each is held to the
 * 3:1 non-text floor rather than 4.5:1. All six clear it; see
 * `contrastPairs` in designTokens.ts and `npm run check:contrast`.
 */

export type VisualTone =
  | 'primary'
  | 'accent'
  | 'success'
  | 'secondary'
  | 'neutral';

/** Tile background and glyph colour, keyed by tone. */
export const TONE_SURFACE: Record<VisualTone, string> = {
  primary: 'bg-primary-50 text-primary-600',
  accent: 'bg-accent-50 text-accent-600',
  success: 'bg-success-50 text-success-600',
  secondary: 'bg-secondary-50 text-secondary-600',
  neutral: 'bg-gray-100 text-gray-600',
};

/**
 * The 4px top edge of a card. Carries the same hue as its tile so a card's
 * accent is stated once, in colour, and repeated only structurally.
 */
export const TONE_BORDER: Record<VisualTone, string> = {
  primary: 'border-primary-500',
  accent: 'border-accent-500',
  success: 'border-success-500',
  secondary: 'border-secondary-500',
  neutral: 'border-gray-400',
};

export type TileSize = 'sm' | 'md' | 'lg';

/**
 * Tile boxes, in `size-*` rather than padding, so the square is exactly square
 * at every breakpoint. A 44x46 icon tile is the kind of thing that reads as
 * "off" without anyone being able to say why.
 */
export const TILE_SIZE: Record<TileSize, string> = {
  // 36px — dense lists and table rows
  sm: 'size-9 rounded-lg',
  // 44px — the default for a card in a grid
  md: 'size-11 rounded-xl',
  // 56px — hero and detail pages
  lg: 'size-14 rounded-xl',
};

export const TILE_ICON: Record<TileSize, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-7',
};

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Square avatar sizes.
 *
 * The list steps by 8px, which keeps a row of twelve officials optically even —
 * a 44px portrait beside a 48px one is noticeable in a grid and not otherwise
 * explicable.
 */
export const AVATAR_SIZE: Record<AvatarSize, string> = {
  xs: 'size-8 text-[0.625rem]',
  sm: 'size-10 text-xs',
  md: 'size-12 text-sm',
  lg: 'size-16 text-lg',
  xl: 'size-24 text-2xl',
};

/** Intrinsic pixel size, so the browser reserves the box before the file loads. */
export const AVATAR_PX: Record<AvatarSize, number> = {
  xs: 32,
  sm: 40,
  md: 48,
  lg: 64,
  xl: 96,
};

/**
 * Up to two initials from a person's name.
 *
 * Filipino names are long and often carry a middle initial
 * ("Myca Elizabeth R. Vergara"), so the rule is first token + last token —
 * never first + middle, which would render "MR" for most of the officials here.
 * A single-token name, or one with no letters at all, degrades to the first
 * available letters rather than to a blank box.
 */
export function getInitials(name: string): string {
  const tokens = (name ?? '')
    .split(/[\s.,]+/)
    .map(token => token.replace(/[^\p{L}]/gu, ''))
    .filter(Boolean);

  if (tokens.length === 0) return '';
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase();
  return (tokens[0][0] + tokens[tokens.length - 1][0]).toUpperCase();
}
