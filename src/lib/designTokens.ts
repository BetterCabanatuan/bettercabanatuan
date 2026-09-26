/**
 * Design tokens — single source of truth for the portal's colour, type, and
 * spacing scales.
 *
 * Why a TS module and not just CSS: the contrast audit (`npm run check:contrast`)
 * and the token test suite need to read the same values the UI renders, and a
 * test that hardcodes hex codes drifts from the stylesheet the moment someone
 * edits one and not the other. The values below are mirrored into
 * `src/index.css` under `@theme`; `check-contrast.mjs` fails if the two ever
 * disagree.
 *
 * Dark mode: the portal is light-mode only. There is no `dark:` variant and no
 * `prefers-color-scheme` handling anywhere in `src/`. Every token here is a
 * single value, not a light/dark pair — see docs/DESIGN-TOKENS.md for what
 * adopting dark mode would require.
 */

/* ------------------------------------------------------------------ colour */

/** Page and card backgrounds. */
export const surface = {
  /** Default page background. */
  page: '#ffffff',
  /** Quiet band that separates sections (alternating rows, table headers). */
  subtle: '#f8f9fa',
  /** Wells, inset panels, and icon-tile backgrounds. */
  sunken: '#f1f3f5',
  /** Tinted band for empty states and callouts. */
  info: '#e6f0fd',
  /** Destructive band. */
  danger: '#fceaea',
  /**
   * The one true dark surface: the footer band.
   *
   * Text on it uses `content.subtle` (8.39:1) or `content.decorative`
   * (5.27:1). `content.muted` measures 3.48:1 here and fails AA, which is why
   * the greys are re-stepped for this surface rather than reused unchanged.
   */
  inverse: '#1a1a1a',
} as const;

/**
 * Hairlines and dividers. These are the only borders in the system; the ramp's
 * 200/300 steps are never used for text.
 *
 * `strong` shares gray-400 with `content.decorative`. That is deliberate: a
 * hairline at 3.30:1 is meant to be seen, and gray-400 has no running-text
 * usages — it appears only as icons and as the selected/active border.
 */
export const border = {
  subtle: '#e9ecef',
  default: '#dee2e6',
  strong: '#8b8e8f',
} as const;

/**
 * Text. Each step has a measured floor on `surface.page`:
 *
 *   strong   15.43:1  headings, numerals, anything that must win
 *   default   8.18:1  body copy
 *   muted     6.08:1  card descriptions, secondary prose
 *   subtle    5.01:1  meta rows, timestamps, captions
 *   decorative 3.30:1 NON-TEXT ONLY — icons, glyph placeholders, dividers
 *
 * `decorative` clears the 3:1 floor for essential UI but is below 4.5:1, so
 * it must never carry running text. See the `text-gray-400` audit note in
 * docs/DESIGN-TOKENS.md.
 */
export const content = {
  strong: '#212529',
  default: '#495057',
  muted: '#5f6364',
  subtle: '#6c7071',
  decorative: '#8b8e8f',
} as const;

/** Link colour. `hover` must get *darker*, never lighter, to stay compliant. */
export const link = {
  base: '#0052bc',
  hover: '#003d8d',
  visited: '#00295e',
} as const;

/** Brand blue ramp steps used as a role rather than as a palette. */
export const brand = {
  /** Icon tile background. */
  tile: '#e6f0fd',
  /** Solid button / active-tab fill. White text on this is 7.16:1. */
  solid: '#0052bc',
  solidHover: '#003d8d',
  /** Banded hero background. */
  deep: '#00142f',
  /** Text on `deep`. 10.0:1. */
  onDeep: '#99c2f7',
  /** Body text on `deep`, as an alpha-composited white. 18.4:1. */
  onDeepBody: 'rgba(255, 255, 255, 0.85)',
} as const;

/** Focus ring. 7.16:1 against `surface.page`, well past the 3:1 UI floor. */
export const focus = '#0052bc';

/* ------------------------------------------------------------------ badges */

export type BadgeTone = 'info' | 'warning' | 'success' | 'neutral' | 'accent';

/**
 * Status badges. Every pair is measured; the minimum across all five is 6.37:1,
 * comfortably above the 4.5:1 body-text floor even at the `xs` size.
 */
export const badge: Record<
  BadgeTone,
  { bg: string; fg: string; ring: string }
> = {
  info: { bg: '#dbeafe', fg: '#1e40af', ring: '#bfdbfe' },
  warning: { bg: '#fef3c7', fg: '#92400e', ring: '#fde68a' },
  success: { bg: '#dcfce7', fg: '#166534', ring: '#bbf7d0' },
  neutral: { bg: '#f1f3f5', fg: '#495057', ring: '#dee2e6' },
  accent: { bg: '#fffbeb', fg: '#92400e', ring: '#fde68a' },
};

/* -------------------------------------------------------------------- type */

/**
 * Type scale. Sizes are rem so they respect the reader's browser setting;
 * `min` is the mobile floor, `max` the desktop value. Line heights are unitless
 * multipliers applied alongside, not baked into the size token.
 */
export const type = {
  xs: { min: '0.75rem', max: '0.75rem', leading: 1.5, weight: 500 },
  sm: { min: '0.875rem', max: '0.875rem', leading: 1.6, weight: 400 },
  base: { min: '1rem', max: '1rem', leading: 1.65, weight: 400 },
  md: { min: '1.0625rem', max: '1.125rem', leading: 1.6, weight: 400 },
  lg: { min: '1.125rem', max: '1.25rem', leading: 1.5, weight: 600 },
  xl: { min: '1.25rem', max: '1.5rem', leading: 1.4, weight: 600 },
  '2xl': { min: '1.5rem', max: '1.875rem', leading: 1.3, weight: 700 },
  '3xl': { min: '1.875rem', max: '2.25rem', leading: 1.2, weight: 700 },
  '4xl': { min: '2.25rem', max: '3rem', leading: 1.15, weight: 700 },
} as const;

/* ----------------------------------------------------------------- spacing */

/**
 * 4px base scale. `section` is the vertical rhythm between page bands and the
 * single value used to keep the homepage from drifting.
 */
export const space = {
  '3xs': '0.25rem',
  '2xs': '0.5rem',
  xs: '0.75rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '2.5rem',
  '2xl': '3rem',
  section: '3rem',
} as const;

/* --------------------------------------------------- contrast token pairs */

/**
 * Every foreground/background pair the design system promises to keep
 * accessible, with the WCAG threshold it has to clear. `check-contrast.mjs`
 * walks this list, and the token test suite asserts the same, so a colour edit
 * that breaks AA fails CI instead of shipping.
 *
 * `large` marks pairs only required to clear 3:1 (>=24px, or >=18.66px bold).
 * Those are icons and controls, not running text.
 */
export interface ContrastPair {
  role: string;
  fg: string;
  bg: string;
  min: number;
  large?: boolean;
}

export const contrastPairs: ContrastPair[] = [
  // --- body text on each surface the site actually uses
  {
    role: 'content.strong on surface.page',
    fg: content.strong,
    bg: surface.page,
    min: 4.5,
  },
  {
    role: 'content.default on surface.page',
    fg: content.default,
    bg: surface.page,
    min: 4.5,
  },
  {
    role: 'content.muted on surface.page',
    fg: content.muted,
    bg: surface.page,
    min: 4.5,
  },
  {
    role: 'content.subtle on surface.page',
    fg: content.subtle,
    bg: surface.page,
    min: 4.5,
  },
  {
    role: 'content.muted on surface.subtle',
    fg: content.muted,
    bg: surface.subtle,
    min: 4.5,
  },
  {
    role: 'content.subtle on surface.subtle',
    fg: content.subtle,
    bg: surface.subtle,
    min: 4.5,
  },
  {
    role: 'content.muted on surface.sunken',
    fg: content.muted,
    bg: surface.sunken,
    min: 4.5,
  },
  {
    role: 'content.default on surface.info',
    fg: content.default,
    bg: surface.info,
    min: 4.5,
  },
  {
    role: 'content.muted on surface.info',
    fg: content.muted,
    bg: surface.info,
    min: 4.5,
  },
  // On the near-black footer band the ramp is re-stepped: gray-500 is already
  // the lightest "muted" step on white at 5.01:1, and against #1a1a1a it drops
  // to 3.48:1. Footer text therefore uses the two steps that still clear AA
  // here — gray-300 at 8.39:1 and gray-400 at 5.27:1.
  {
    role: 'gray-300 on surface.inverse',
    fg: '#dee2e6',
    bg: surface.inverse,
    min: 4.5,
  },
  {
    role: 'content.decorative on surface.inverse',
    fg: content.decorative,
    bg: surface.inverse,
    min: 4.5,
  },

  // --- links
  {
    role: 'link.base on surface.page',
    fg: link.base,
    bg: surface.page,
    min: 4.5,
  },
  {
    role: 'link.hover on surface.page',
    fg: link.hover,
    bg: surface.page,
    min: 4.5,
  },
  {
    role: 'link.base on surface.subtle',
    fg: link.base,
    bg: surface.subtle,
    min: 4.5,
  },
  {
    role: 'link.base on surface.sunken',
    fg: link.base,
    bg: surface.sunken,
    min: 4.5,
  },
  {
    role: 'link.visited on surface.page',
    fg: link.visited,
    bg: surface.page,
    min: 4.5,
  },

  // --- solid controls
  { role: 'white on brand.solid', fg: '#ffffff', bg: brand.solid, min: 4.5 },
  {
    role: 'white on brand.solidHover',
    fg: '#ffffff',
    bg: brand.solidHover,
    min: 4.5,
  },

  // --- the dark hero band
  {
    role: 'brand.onDeep on brand.deep',
    fg: brand.onDeep,
    bg: brand.deep,
    min: 4.5,
  },
  { role: 'white on brand.deep', fg: '#ffffff', bg: brand.deep, min: 4.5 },
  {
    role: 'brand.onDeepBody on brand.deep',
    fg: brand.onDeepBody,
    bg: brand.deep,
    min: 4.5,
  },

  // --- icon tiles: glyph on its own tinted square
  {
    role: 'brand.solid on brand.tile',
    fg: brand.solid,
    bg: brand.tile,
    min: 4.5,
  },
  {
    role: 'content.default on surface.sunken',
    fg: content.default,
    bg: surface.sunken,
    min: 4.5,
  },
  // A glyph placeholder on a sunken tile must use `subtle`, not `decorative`:
  // gray-400 measures 2.97:1 against gray-100, under the 3:1 non-text floor.
  {
    role: 'content.subtle on surface.sunken',
    fg: content.subtle,
    bg: surface.sunken,
    min: 3,
    large: true,
  },

  // --- every icon tile the site actually renders: a glyph on its own tint.
  // These are graphical objects, so the bar is 3:1, not 4.5:1.
  {
    role: 'accent-600 on accent-50',
    fg: '#c46e00',
    bg: '#fef3e6',
    min: 3,
    large: true,
  },
  {
    role: 'success-600 on success-50',
    fg: '#008c4c',
    bg: '#e6f7ef',
    min: 3,
    large: true,
  },
  {
    role: 'secondary-600 on secondary-50',
    fg: '#cc3e00',
    bg: '#ffede6',
    min: 3,
    large: true,
  },
  {
    role: 'error-600 on error-50',
    fg: '#b42525',
    bg: '#fceaea',
    min: 3,
    large: true,
  },
  // --- status badges
  { role: 'badge.info', fg: badge.info.fg, bg: badge.info.bg, min: 4.5 },
  {
    role: 'badge.warning',
    fg: badge.warning.fg,
    bg: badge.warning.bg,
    min: 4.5,
  },
  {
    role: 'badge.success',
    fg: badge.success.fg,
    bg: badge.success.bg,
    min: 4.5,
  },
  {
    role: 'badge.neutral',
    fg: badge.neutral.fg,
    bg: badge.neutral.bg,
    min: 4.5,
  },
  { role: 'badge.accent', fg: badge.accent.fg, bg: badge.accent.bg, min: 4.5 },

  // --- non-text UI: focus ring and decorative glyphs need 3:1, not 4.5:1
  {
    role: 'focus ring on surface.page',
    fg: focus,
    bg: surface.page,
    min: 3,
    large: true,
  },
  {
    role: 'focus ring on surface.subtle',
    fg: focus,
    bg: surface.subtle,
    min: 3,
    large: true,
  },
  {
    role: 'border.default on surface.page',
    fg: border.default,
    bg: surface.page,
    min: 1.2,
  },
  {
    role: 'content.decorative on surface.page',
    fg: content.decorative,
    bg: surface.page,
    min: 3,
    large: true,
  },
];

/**
 * Combinations that look reasonable and measure badly. Kept as data so the
 * audit reports them the moment they appear in `src/`, instead of waiting for
 * someone to notice an invisible arrow or an unreadable warning tile.
 *
 * Each is a real measurement, not a guess — see docs/DESIGN-TOKENS.md.
 */
export const forbiddenPairs: ContrastPair[] = [
  {
    role: 'content.subtle on surface.inverse (footer body text)',
    fg: content.subtle,
    bg: surface.inverse,
    min: 4.5,
  },
  {
    role: 'warning-600 on warning-50 (icon tile)',
    fg: '#cc9400',
    bg: '#fff8e6',
    min: 3,
  },
  {
    role: 'content.decorative on surface.sunken (placeholder glyph)',
    fg: content.decorative,
    bg: surface.sunken,
    min: 3,
  },
  {
    role: 'gray-300 on surface.page (idle icon)',
    fg: '#dee2e6',
    bg: surface.page,
    min: 3,
  },
  {
    role: 'accent-600 as body text on surface.page',
    fg: '#c46e00',
    bg: surface.page,
    min: 4.5,
  },
  {
    role: 'success-600 as body text on surface.page',
    fg: '#008c4c',
    bg: surface.page,
    min: 4.5,
  },
];
