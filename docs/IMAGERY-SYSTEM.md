# Imagery & icon system

Every card type on the portal has a visual anchor. This is what they are, how
big they are, and what they do when the thing they point at does not exist.

**Components:** `src/components/ui/` —
`IconTile`, `OfficialPortrait`, `InitialsAvatar`, `MapBanner`, `StatusBadge`.
**Metrics:** [`src/lib/visualTokens.ts`](../src/lib/visualTokens.ts).
**Icons:** [`src/lib/iconMap.ts`](../src/lib/iconMap.ts).

---

## The two rules

**Never fabricate.** No stock photography, no generated maps, no silhouette
standing in for a person. This is a civic portal about real, identifiable
people and real places; a plausible-looking image that is not the right image is
worse than an honest blank.

**Never look broken.** A placeholder is a designed state, not a failure state.
Anything that could be mistaken for a failed image load — a browser's broken-icon
glyph, a grey box with no label, a 0×0 hole — is disqualified.

Every ratio below is fixed rather than fluid so that a stack of cards lines up
regardless of how long the names are.

---

## 1. Official portraits

`OfficialPortrait` — 1:1, square, `object-cover`.

| Size | Box  | Intrinsic | Use                                   |
| ---- | ---- | --------- | ------------------------------------- |
| `xs` | 32px | 32×32     | Dense lists                           |
| `sm` | 40px | 40×40     | Sidebars                              |
| `md` | 48px | 48×48     | **Card default** — the officials grid |
| `lg` | 64px | 64×64     | Detail page header                    |
| `xl` | 96px | 96×96     | Feature                               |

Steps are 8px apart, so a row of twelve officials is optically even. A 44px
portrait beside a 48px one is noticeable in a grid and not explicable.

`width`/`height` attributes are always set, so the browser reserves the box
before the file loads and the row does not reflow as portraits arrive.

### Three states, all intentional

1. **A photo loads** — square, `object-cover`, so any crop fills the frame. A
   portrait cropped square still reads as a face; 4:3 would cut people off at
   the shoulders.
2. **No `src` in the data** — the initials tile.
3. **`src` is set but 404s** — the initials tile, swapped in on `onError`.

The third case is the one that matters. Photo paths arrive with the data in a
later phase, and a wrong path would otherwise render as the browser's broken
image icon — which, on a page about public officials, reads as carelessness about
a real person. A bad path degrades to exactly the same tile as a missing one, so
the two are indistinguishable to the reader.

`onError` also resets when `src` changes, so one broken path cannot stick for the
life of the component across client-side navigation.

### The initials tile

`InitialsAvatar` — a flat sunken square with the person's own initials.

- **No silhouette.** A generic person icon next to a real name implies a
  photograph of that person. That is a lie, and it is what the previous
  implementation did.
- **No colour coding.** Tinting each official differently would be decoration,
  and name-hash colouring is the kind of thing that quietly becomes a category
  later.
- **Initials from first + last token.** Filipino names are long and often carry
  a middle initial — "Myca Elizabeth R. Vergara" — so first + middle would
  render **"MR"** for most of the officials here. A single-token name degrades to
  its first two letters; a name with no letters renders an em dash rather than an
  empty box.
- **`text-gray-600` on `bg-gray-100` — 5.46:1.** Not gray-400, which measures
  2.97:1 on the same tile and would be the one thing on the page a reader
  genuinely cannot see. This pairing is a documented trap in
  [DESIGN-TOKENS.md](./DESIGN-TOKENS.md).
- An inset `ring-black/[0.06]` so the tile reads as a slot awaiting a photo
  rather than as a flat swatch.

`role="img"` with `aria-label="No official photo available for {name}"`, so the
state is announced rather than merely visible.

---

## 2. Icon tiles

`IconTile` — the square anchor for a category, department, or project.

| Size | Box  | Glyph | Use                     |
| ---- | ---- | ----- | ----------------------- |
| `sm` | 36px | 16px  | Dense lists, table rows |
| `md` | 44px | 20px  | **Card default**        |
| `lg` | 56px | 28px  | Hero, detail pages      |

Sized with `size-*` rather than padding so the box is exactly square at every
breakpoint. A 44×46 tile is the kind of thing that reads as "off" without anyone
being able to say why.

### Tones

| Tone        | Tile           | Glyph           | Ratio  | Reserved for                      |
| ----------- | -------------- | --------------- | ------ | --------------------------------- |
| `primary`   | `primary-50`   | `primary-600`   | 6.22:1 | Service and government categories |
| `accent`    | `accent-50`    | `accent-600`    | 3.44:1 | Projects                          |
| `success`   | `success-50`   | `success-600`   | 3.90:1 | —                                 |
| `secondary` | `secondary-50` | `secondary-600` | 4.35:1 | —                                 |
| `neutral`   | `gray-100`     | `gray-600`      | 7.35:1 | Sections with no content yet      |

A glyph on a tinted square is a graphical object, so each pair is held to 3:1
rather than 4.5:1. All five clear it, asserted in `contrastPairs`.

One accent per section: departments and categories stay on `primary`, projects
use `accent`, and a section with nothing behind it drops to `neutral` so it
reads as _unfinished_ rather than _broken_.

Decorative by default (`aria-hidden`), because the card already names itself in
text. Pass `label` only when the tile is the sole carrier of meaning.

---

## 3. Map bands

`MapBanner` — optional, for barangay and department pages.

| Size | Ratio | Min height |
| ---- | ----- | ---------- |
| `sm` | 4:1   | 64px       |
| `md` | 3:1   | 112px      |

**Deliberately not a map.** There is no verified boundary geometry for any of
the 89 barangays, and inventing a plausible-looking map would be a fabricated
image on a civic site. Instead the band carries a schematic graticule — a
repeating SVG of 14%-opacity grid lines — a solid `primary-600` pin chip, and the
place name.

The label always sits **inside** the frame, on the tinted surface. That is what
keeps the band from being mistaken for a failed image: there is text in the
picture, so the picture is obviously a designed element. Once real geometry
exists, `MapBanner` is replaced by an actual map and the ratio holds the layout
still.

---

## 4. Status badges

`StatusBadge` — the only badge in the system. Five tones, measured 6.37:1 to
7.35:1, defined in [DESIGN-TOKENS.md](./DESIGN-TOKENS.md).

Colour is never the only signal: a badge always renders the status word, so
"Ongoing" and "Completed" are distinguishable without colour vision and in a
monochrome print. A project with no status gets **no badge** — an empty pill
reads as a failed lookup, which is worse than saying nothing.

---

## 5. Icons

`getIconComponent(name, { domain })` resolves a YAML `icon:` field to a Lucide
component.

- **Explicit allow-list.** `ICON_MAP` names every permitted icon rather than
  reaching into `lucide-react` dynamically. That keeps a tree-shaken import list
  (5,801 exports exist) and makes the allowed set reviewable.
- **Domain-aware fallback.** `service` → `ClipboardList`, `government` →
  `Landmark`, `neutral` → `LayoutGrid`. The previous single fallback was
  `Building2` for everything, which made a deliberate choice and a typo look
  identical — both rendered the same building. A mis-typed service icon now reads
  as "a service", a much cheaper mistake to spot.
- **Dev warning.** An unknown name logs a warning in development with the list of
  valid names. In production it is silent: a missing icon is not the reader's
  problem.
- `isKnownIcon()` is exported for tests.

No new icon library. Lucide was already in use.

---

## Example markup

### A category card

```tsx
<CategoryCard
  to={`/services/${category.slug}`}
  title={category.category}
  description={category.description}
  icon={getIconComponent(category.icon, { domain: 'service' })}
  tone="primary"
  cta={t('services.viewAllCategory')}
  headingLevel={3}
/>
```

Renders a 44px `primary` icon tile, a level-3 title, a 3-line clamped body, and
a footer rule with an "Explore" affordance. Named for assistive tech by its own
title.

### An official

```tsx
<OfficialPortrait
  src={official.avatar}   // optional; a bad path falls back on its own
  name={official.name}
  position={official.position}
  size="md"               // 48px
/>
<StatusBadge tone={getBadgeTone(official.position)} size="sm">
  {official.position === 'City Mayor' ? 'Mayor' : 'Councilor'}
</StatusBadge>
```

### A map band

```tsx
<MapBanner
  label={`Barangay ${barangay.name}`}
  caption={`${barangay.classification} · ${barangay.population.toLocaleString()}`}
  size="md"
/>
```

---

## Adding a visual anchor to a new card type

1. Pick the tone that matches the section's accent. Do not introduce a new one.
2. Use `CategoryCard` rather than a new card component — see
   [CARD-SYSTEM.md](./CARD-SYSTEM.md).
3. If the card needs a photograph, use `OfficialPortrait` so the missing and
   broken cases stay identical to a present one.
4. If it needs a place, use `MapBanner`. Do not add a real map until the geometry
   is verified.
5. If the placeholder would be the only thing on the card, that is a signal the
   card should show an empty state instead — see
   [RESPONSIVE-QA.md](./RESPONSIVE-QA.md).
