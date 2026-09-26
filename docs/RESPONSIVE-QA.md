# Responsive visual QA

A systematic pass over every route at 320 / 375 / 768 / 1024 / 1440px, for
gaps, overlap, truncation, discoloration, and orphaned grids.

**Tooling**

| Command                                                | What it does                                                        |
| ------------------------------------------------------ | ------------------------------------------------------------------- |
| `npm run qa:shots`                                     | Screenshots every route at every breakpoint into `.qa-shots/`       |
| `npm run qa:inspect <path> <y> <h>`                    | One viewport-tall window, for pinning a defect to a scroll position |
| `node --experimental-strip-types scripts/qa-audit.mjs` | Measures the page and prints a ranked defect list                   |
| `npx playwright test responsive.spec.ts`               | The same invariants, as a build gate                                |
| `npx playwright test a11y-contrast.spec.ts`            | Rendered contrast, live page                                        |

`QA_BASE_URL` points the scripts at a dev server; the default is
`http://localhost:4001`.

Every finding below was observed in a rendered page, not inferred from the
markup. Where a defect was a false positive in the audit itself, that is recorded
too — four of the fixes during this pass were to the measuring tool.

---

## Coverage

24 routes × 5 breakpoints = **120 route/breakpoint pairs**, each screenshotted
and measured.

`/`, `/services`, `/services/health-services`, a service document,
`/government`, `/government/officials`, `/government/barangays` + a detail,
`/government/departments` + a detail, `/government/projects` + a detail,
`/government/news`, `/statistics`, `/transparency`, `/transparency/flood-controls`,
`/transparency/legislation`, `/about`, `/contact`, `/hotlines`, `/search`,
`/sitemap`, `/accessibility`, 404.

Detail-page slugs are real ones taken from the content files. The first version of
this list used invented slugs, which rendered not-found states instead — the sweep
reported "no `<h1>`" for pages that were never meant to render, and would have
passed while auditing nothing.

### Dark mode

**Not applicable.** The site is light-mode only: zero `dark:` variants and no
`prefers-color-scheme` handling in `src/`. Each defect below would need to be
re-checked against a dark theme if one is ever added, because the greys have to
be re-stepped rather than reused. See
[DESIGN-TOKENS.md](./DESIGN-TOKENS.md#dark-mode).

---

## Result

|          | Before | After |
| -------- | ------ | ----- |
| Findings | 1,455  | **4** |
| Blockers | 105    | **0** |
| Major    | 1,247  | **0** |
| Minor    | 103    | 4     |

All 63 Playwright specs pass, 271 unit tests pass, `npm run check:contrast` is
clean, and 120 screenshots are in `.qa-shots/`.

---

## Blockers fixed

### B1 · Every page scrolled sideways at 320–375px

**Routes:** all 24 · **Breakpoints:** 320, 375 · `scrollWidth 434 > clientWidth 375`

Two independent causes.

**The hotline strip.** `<div className="flex-1 overflow-x-auto">` holds a `ul`
with `min-w-max`. A flex item defaults to `min-width: auto`, which refuses to
shrink below its content — so the strip stayed as wide as every phone number side
by side, pushed past the viewport, and dragged the whole document with it.
`overflow-x-auto` alone does not prevent this: the strip is meant to scroll
_inside itself_. Fixed with `min-w-0` on the flex item.

**The footer.** `flex flex-col ... items-center` with a child of
`flex space-x-6`. In a **column** flex container the cross axis is horizontal,
so `items-center` shrink-wraps each child to its content and centres it. The
link row is 492px of text, so at 375px it was centred in a 343px column and
spilled 59px off **both** edges. Fixed with `items-stretch` below `md` — and
from `md` up the row is horizontal again, where centring is what you want.

### B2 · White-on-white hero labels

**Routes:** `/` · `#ffffff on #ffffff` at 12–44px

The hero's translucent chips (`bg-white/10` over a gradient band) reported as
white text on a white background. The real cause was three bugs in the audit, all
worth recording because each produced confident, wrong findings:

1. Chrome reports `backgroundColor` for a Tailwind default as `oklch(...)`, and
   returns it **unchanged** from a probe element — so an `rgb()`-only parser read
   every `bg-red-700` as transparent and walked past it.
2. `bg-white/10` comes back as `oklab(... / 0.1)`, a fourth colour syntax. It was
   treated as opaque white and used as the base.
3. Tailwind v4 emits gradients as
   `linear-gradient(..., var(--color-primary-600), ...)`, so the raw
   `background-image` string contains no literal colour at all, and the stop list
   came back empty.

Fixed by parsing in one place (`src/lib/contrast.ts`, now handling hex, `rgb`,
`oklch`, and `oklab`), resolving `var()` against computed custom properties, and
modelling the paint stack properly. The chip now measures correctly: white on
`primary-600` through 10% white, which passes.

The underlying contrast was always fine. It took three fixes to the _measuring
tool_ before it could be seen, which is the argument for measuring rendered
output rather than reading class strings.

### B3 · The 404 numeral was invisible

**Route:** `/404` · 1.54:1

`text-white/20` over the hero gradient. A large-text graphic needs 3:1, and a
"404" nobody can see is a rendering artefact, not a watermark. Now `text-white/60`
(3.58:1) and `aria-hidden`, since the `<h1>` already carries the meaning.

---

## Major fixed

### M1 · Muted text failed AA site-wide

215 call sites. See [DESIGN-TOKENS.md](./DESIGN-TOKENS.md) for the full
analysis: `text-gray-500` measured 2.07:1 and `text-gray-600` 3.32:1, both used
as body copy. The neutral ramp was re-tuned at steps 400–600.

### M2 · Invisible idle icons

`text-gray-300` arrows in the search results and hero measured **1.30:1** — the
element was only visible on hover. Now `text-gray-400` (3.30:1).

### M3 · `content.subtle` on the dark footer

3.48:1. The footer band is near-black, where the grey ramp has to be re-stepped
rather than reused. Now `gray-300` (13.37:1) and `gray-400` (5.27:1).

### M4 · Hero eyebrows on the light gradient

`text-primary-200` measured 3.89:1 against `primary-600`, at 12–14px, on six
hero components that all paint the same `primary-600 → primary-700` band. Now
`text-primary-100` (5.33:1). `PageBanner` is excluded: its band is `primary-900`,
where `primary-200` is 10.00:1 and already correct.

### M5 · White at 60% on the gradient

3.58:1 at 12px. Now `text-white/75` (4.73:1).

### M6 · Ten `<h1>` elements on a department page

The markdown renderer's `h1` mapping emitted an `<h1>` for every `#` heading, and
the loader keeps the document's leading heading in the body. `executive.md` has
nine `#` sections, so the page rendered ten `<h1>`s.

Headings inside a document are now demoted one level (`#` → `<h2>`, `##` → `<h3>`,
…), with the visual size still keyed to the source level so nothing looks
different. `DocumentPage` renders the document title as the page `<h1>` and
strips the duplicate from the body — 17 of the 18 markdown documents open with a
`#` title, so the same words were printing twice, inches apart.

### M7 · Five routes had no `<main>` landmark

Nineteen of twenty-four pages carried their own `<main>`; the five detail routes
did not, which strips the skip-to-content affordance keyboard and screen-reader
users depend on.

Moved to the layout shell in `App.tsx` and removed from all 19 pages, so there is
exactly one `main` per route and a new page cannot forget it. `flex-1` keeps the
footer at the bottom of short pages.

### M8 · Sub-44px navigation targets

180 instances. Distinct causes:

|                 | Was   | Now                                                                        |
| --------------- | ----- | -------------------------------------------------------------------------- |
| Footer links    | 52×20 | `min-h-[44px]`                                                             |
| Top utility bar | 41×16 | `min-h-[44px]`, and the bar `h-10` → `min-h-[44px]` so it can contain them |
| Hamburger       | 40×40 | `size-11` (44×44)                                                          |
| Breadcrumbs     | 38×20 | `min-h-[44px]`                                                             |
| "PDF" links     | 26×20 | `min-h-[44px]`                                                             |
| Leaflet zoom    | 30×30 | 44×44 via CSS override                                                     |

Breadcrumbs are included deliberately: a trail is a list of links, not a
sentence, so WCAG 2.5.8's "inline in text" exemption does not apply. Leaflet's
buttons are set in the library's own stylesheet with no prop to change them, so
they are overridden in `index.css` rather than by forking the component.

### M9 · Long breadcrumbs overflowed at 320px

"Cabanatuan City Government: Free Health Services" is far wider than 320px, and
a non-wrapping trail pushed three document pages into a horizontal scroll. The
trail now wraps.

### M10 · Every card announced as "Service card"

Not a visual defect, but found by the sweep and severe enough to fix here. See
[CARD-SYSTEM.md](./CARD-SYSTEM.md#accessible-names).

---

## Minor accepted

### `orphan-row` — a lone card in a 3- or 4-wide grid

4 instances: `/` and `/services` at 1024px (10 items, 3 columns), `/government`
at 1024px and 1440px (9 items, 4 columns).

The final row is **centred**, which is the deliberate behaviour of `CardGrid` —
see [CARD-SYSTEM.md](./CARD-SYSTEM.md#why-flex-not-css-grid). The audit reports
it because a single stranded card can still read as a mistake rather than a
choice, and recording it is more useful than suppressing the check.

Closing it would mean hiding a category or forcing a column count that wastes a
third of a 1024px screen. On a civic portal an incomplete list is the worse
outcome, so the row stays.

---

## Audit false positives fixed during the pass

Four of the fixes in this document were to the measuring tool rather than the
site, which is worth recording because each had been producing confident, wrong
findings:

1. **`sr-only` reported as clipped text.** Visually hidden text is 1×1 _on
   purpose_. Now skipped, alongside the `clip`/`clip-path` equivalents.
2. **1,196 "element extends past the viewport" from the hotline strip.** Those
   elements are inside an `overflow-x-auto` ancestor and are clipped by
   definition. The page-level `scrollWidth` check reports the real symptom once
   instead of once per descendant.
3. **Wrapping flex rows treated as card grids.** The hotline strip's
   `lg:flex-wrap` row and the footer's link rows have last rows that are _meant_
   to sit left-aligned. The row-fill check now keys off `data-card-grid`.
4. **Colour syntax.** Described under B2.

---

## Method, and its limits

**Rendered, not inferred.** Contrast is measured from computed styles on a live
page, walking the real paint stack behind each run of text. Where a background is
a gradient, every stop is measured and the worst one decides — a label legible at
one end of a band and not the other has failed.

**Static analysis still has a job.** `npm run check:contrast` verifies the token
layer and flags off-palette values. It cannot see a background set on an
ancestor, so its usage section is advisory and says so; the authoritative check is
`e2e/a11y-contrast.spec.ts`.

**Not covered.** Only Chromium, and only horizontal overflow, row fill, tap
targets, and contrast are asserted automatically. Overlap between arbitrary
elements, and discoloration, were found by reading 120 screenshots — a real
limitation, and the reason the screenshots are committed as evidence rather than
discarded after the run. Safari and Firefox are untested; `100dvh`, `text-wrap:
balance`, and `:has()` behave differently there.

**Not fixed, filed.** Six components still paint the same hero band with
near-identical markup (`GovernmentPageHero`, `SitemapHero`, `AboutHero`,
`SearchHero`, `contact`, `statistics`). The eyebrow colour is correct in all six
now, but they should be one component. Structural, so out of scope here.
