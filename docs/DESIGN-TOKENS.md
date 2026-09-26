# Design tokens

The portal's colour, type, and spacing scales, with measured contrast ratios for
every pair the system promises to keep accessible.

**Source of truth:** [`src/lib/designTokens.ts`](../src/lib/designTokens.ts) —
mirrored into [`src/index.css`](../src/index.css) under `@theme`.
**Enforcement:** `npm run check:contrast` (CI) and
[`designTokens.test.ts`](../src/lib/__tests__/designTokens.test.ts).

Every ratio below is produced by
[`src/lib/contrast.ts`](../src/lib/contrast.ts) — the same module the tests and
the audit use — rather than transcribed by hand. Re-run `npm run check:contrast`
to regenerate the table and confirm it still matches.

---

## The problem this solves

The portal had seven palette ramps, no documented roles, and no contrast
standard. Colours had been picked as border tints and then used as text, which
is where the failures came from:

| Utility         | Was        | Now    | Was used for                                   |
| --------------- | ---------- | ------ | ---------------------------------------------- |
| `text-gray-400` | **1.49:1** | 3.30:1 | 45 sites — icons, and 10 that were really text |
| `text-gray-500` | **2.07:1** | 5.01:1 | 71 sites — timestamps, meta rows, captions     |
| `text-gray-600` | **3.32:1** | 6.08:1 | 101 sites — card body copy                     |

All three failed WCAG AA, and `text-gray-600` was the single most common body
text colour on the site. 215 call sites were fixed by re-tuning three steps of
one ramp rather than by editing 215 files.

The ramp was re-tuned rather than the call sites rewritten because the greys
were **only ever used as text**: there is no `bg-gray-400/500/600` and no
`border-gray-400/500/600` anywhere in `src/`. Darkening them could not break a
surface.

---

## Colour

### Text

Each step has a measured floor on `surface.page`. The role is the contract, not
the step number.

| Role                 | Token                | On white | Use for                                     |
| -------------------- | -------------------- | -------- | ------------------------------------------- |
| `content.strong`     | `gray-900` `#212529` | 15.43:1  | Headings, numerals — anything that must win |
| `content.default`    | `gray-700` `#495057` | 8.18:1   | Body copy                                   |
| `content.muted`      | `gray-600` `#5f6364` | 6.08:1   | Card descriptions, secondary prose          |
| `content.subtle`     | `gray-500` `#6c7071` | 5.01:1   | Meta rows, timestamps, captions             |
| `content.decorative` | `gray-400` `#8b8e8f` | 3.30:1   | **Non-text only** — icons, dividers         |

`content.decorative` clears the 3:1 floor for essential UI but is below 4.5:1,
so it must never carry running text. Ten sites that broke this rule (input
placeholders, table labels, definition terms) were moved to `content.subtle`.

### Surfaces

| Role              | Token        | Value                       |
| ----------------- | ------------ | --------------------------- |
| `surface.page`    | literal      | `#ffffff`                   |
| `surface.subtle`  | `gray-50`    | `#f8f9fa`                   |
| `surface.sunken`  | `gray-100`   | `#f1f3f5`                   |
| `surface.info`    | `primary-50` | `#e6f0fd`                   |
| `surface.danger`  | `error-50`   | `#fceaea`                   |
| `surface.inverse` | token        | `#1a1a1a` — the footer band |

### Links

| Role           | Token         | On white |
| -------------- | ------------- | -------- |
| `link.base`    | `primary-600` | 7.16:1   |
| `link.hover`   | `primary-700` | 10.23:1  |
| `link.visited` | `primary-800` | 14.20:1  |

Hover gets **darker**, never lighter. A hover state that lightens the link is a
contrast regression, and the ramp makes that direction hard to get wrong.

### Status badges

Promoted from arbitrary values (`bg-[#dbeafe]`) to `--color-badge-*` tokens so
the pairs are greppable and audited like everything else.

| Tone      | Pair                  | Token           | Ratio  | Meaning       |
| --------- | --------------------- | --------------- | ------ | ------------- |
| `info`    | blue-100 / blue-800   | `badge.info`    | 7.15:1 | Ongoing       |
| `warning` | amber-100 / amber-800 | `badge.warning` | 6.37:1 | Planned       |
| `success` | green-100 / green-800 | `badge.success` | 6.49:1 | Completed     |
| `neutral` | gray-100 / gray-700   | `badge.neutral` | 7.35:1 | Default       |
| `accent`  | amber-50 / amber-800  | `badge.accent`  | 6.84:1 | "Coming soon" |

**Colour is never the only signal.** A badge always renders a word, so status
survives colour-blind readers and monochrome print. The lowest ratio in the set
is 6.37:1, well clear of AA at the `xs` size.

### Icon tiles

A glyph on a tinted square is a graphical object, so the bar is 3:1, not 4.5:1.
All six pass:

| Tile                              | Ratio  |
| --------------------------------- | ------ |
| `primary-600` on `primary-50`     | 6.22:1 |
| `success-600` on `success-50`     | 3.90:1 |
| `secondary-600` on `secondary-50` | 4.35:1 |
| `accent-600` on `accent-50`       | 3.44:1 |
| `error-600` on `error-50`         | 5.60:1 |
| `gray-600` on `gray-100`          | 7.35:1 |

### The dark band

`PageBanner` and the hero bands sit on `primary-900` or a
`primary-600 → primary-700` gradient. Two rules follow, both measured:

- On `primary-900`: `primary-200` is 10.00:1, fine for an eyebrow.
- On the **gradient**, `primary-200` is only 3.89:1 against the light end, so
  eyebrows there use `primary-100` (5.33:1). Six hero components were corrected.
- Text at `/60` white on the gradient is 3.58:1. At `/75` it is 4.73:1.

The footer is a different dark surface, and the greys are re-stepped for it:
`gray-300` is 13.37:1 and `gray-400` is 5.27:1 against `#1a1a1a`, but
`content.subtle` (gray-500) drops to 3.48:1 and fails.

---

## Known traps

Combinations that look reasonable and measure badly. `npm run check:contrast`
fails if one of these ever starts measuring fine, because that means the
guidance has gone stale.

| Combination                              | Ratio  | Why                                                |
| ---------------------------------------- | ------ | -------------------------------------------------- |
| `warning-600` on `warning-50`            | 2.54:1 | Even a glyph fails. Use `warning-800`.             |
| `content.decorative` on `surface.sunken` | 2.97:1 | Gray-400 on gray-100. Use `content.subtle`.        |
| `gray-300` on `surface.page`             | 1.30:1 | An idle icon at 1.30:1 is invisible until hover.   |
| `accent-600` as body text                | 3.77:1 | Fine for a glyph on its tile, not for a sentence.  |
| `success-600` as body text               | 4.32:1 | Same. Use `success-700` for text.                  |
| `content.subtle` on `surface.inverse`    | 3.48:1 | The footer is darker than white. Use gray-300/400. |

---

## Type

`rem` throughout, so browser font-size preferences are respected. `min` is the
mobile floor, `max` the desktop value; line heights are unitless multipliers
applied alongside, not baked into the size.

| Step   | min       | max      | Leading | Weight |
| ------ | --------- | -------- | ------- | ------ |
| `xs`   | 0.75rem   | 0.75rem  | 1.5     | 500    |
| `sm`   | 0.875rem  | 0.875rem | 1.6     | 400    |
| `base` | 1rem      | 1rem     | 1.65    | 400    |
| `md`   | 1.0625rem | 1.125rem | 1.6     | 400    |
| `lg`   | 1.125rem  | 1.25rem  | 1.5     | 600    |
| `xl`   | 1.25rem   | 1.5rem   | 1.4     | 600    |
| `2xl`  | 1.5rem    | 1.875rem | 1.3     | 700    |
| `3xl`  | 1.875rem  | 2.25rem  | 1.2     | 700    |
| `4xl`  | 2.25rem   | 3rem     | 1.15    | 700    |

The scale only grows at `md`. Every step between `sm` and `3xl` is tested for
monotonicity, so a scale edit that inverts the order fails the build.

## Spacing

A 4px base. Asserted to be a multiple of 4 at every step.

| Step  | Value   |     | Step      | Value  |
| ----- | ------- | --- | --------- | ------ |
| `3xs` | 0.25rem |     | `md`      | 1.5rem |
| `2xs` | 0.5rem  |     | `lg`      | 2rem   |
| `xs`  | 0.75rem |     | `xl`      | 2.5rem |
| `sm`  | 1rem    |     | `2xl`     | 3rem   |
|       |         |     | `section` | 3rem   |

`space.section` is the vertical rhythm between homepage bands — the single
value that stops the page from drifting as sections are added.

---

## Dark mode

**Not supported.** There is no `dark:` variant and no `prefers-color-scheme`
handling anywhere in `src/`. Every token here is a single value, not a
light/dark pair.

Adding it is not a matter of inverting these values. It would need:

1. A `@custom-variant dark` and a `.dark` class on `<html>`.
2. Every token above split into a light and a dark value — and the dark values
   re-measured, not derived, because the same hex that clears 4.5:1 on white
   will not clear it on a dark surface. The footer band already demonstrates
   this: the ramp has to be re-stepped, not reused.
3. The 37 pairs in `contrastPairs` doubled, and the audit taught to check both.
4. The gradient bands, the map tiles, and the Leaflet controls, none of which
   have a dark equivalent yet.

Until that work is done, adding a `dark:` class to a component would produce a
half-themed page rather than a dark one.

---

## Off-token values

`npm run check:contrast` flags `text-*` utilities that fall outside the roles
above. Current state, and how each was resolved:

| Flag                                                                     | Resolution                                                   |
| ------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `text-accent-600`, `text-success-600` (icon tiles)                       | Kept. 3.44 / 3.90:1 as glyphs; asserted in `contrastPairs`.  |
| `text-green-600`, `text-yellow-600`, `text-amber-600` (standalone icons) | Kept. 3.20–3.30:1 on white; above the 3:1 non-text floor.    |
| `text-primary-100` / `text-primary-200` on light gradients               | Corrected to `primary-100`.                                  |
| `text-red-100`, `text-red-300`                                           | On the red hotline band: 7.01:1 and 3.67:1.                  |
| `text-blue-*`, `text-orange-*`, `text-sky-*` in prose                    | Compliant (5.26–9.07:1). Left as-is.                         |
| `bg-[#1a1a1a]`, `bg-[#dbeafe]`, …                                        | Promoted to `--color-surface-inverse` and `--color-badge-*`. |

The recurring lesson: Tailwind's _default_ ramps (`blue`, `amber`, `green`,
`red`, `sky`, `orange`) are not the project's ramps, and mixing the two is how
`text-gray-500` ended up doing a badge's job in one file and a caption's in
another. Where a default ramp is genuinely correct it is now written down, with
its ratio, instead of being left to whoever edits the file next.

---

## Running the audit

```bash
npm run check:contrast          # gate — fails CI on drift or a failing pair
npm run check:contrast:report   # full report, never fails
npm test                        # 271 unit tests, including every token pair
npx playwright test a11y-contrast.spec.ts   # rendered contrast, live page
```

The static audit reads class strings. It cannot see a background set on an
ancestor, so on its own it would report the hero's light-on-dark labels as
failures on white. `e2e/a11y-contrast.spec.ts` closes that gap by measuring
computed styles on a live page, including gradient stops. Both are needed; the
split is deliberate and documented in each file.
