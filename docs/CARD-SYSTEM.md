# Card & grid system

One card component, one grid, and a signpost that is not pretending to be a
card.

**Components:** `src/components/ui/CategoryCard.tsx`, `CardGrid.tsx`,
`BrowseAllLink.tsx`, `Card.tsx`.

---

## What was wrong

Four near-identical card implementations existed, each with its own opinion:

|                 | Service        | Government     | Department     | Project        |
| --------------- | -------------- | -------------- | -------------- | -------------- |
| Padding         | `p-6`          | `p-6`          | `p-6`          | `p-6`          |
| Tile            | `p-3` (≈38px)  | `p-3`          | `w-11` (44px)  | `w-11` (44px)  |
| Top border      | `primary-500`  | `primary-500`  | `primary-500`  | `accent-500`   |
| Body clamp      | none           | none           | `line-clamp-3` | `line-clamp-3` |
| Footer          | none           | none           | border + CTA   | border + CTA   |
| Accessible name | "Service card" | "Service card" | "Service card" | "Service card" |

A grid of departments and projects never lined up, because they were not the
same card. And the homepage's fifth "Other — Browse all" card was drawn exactly
like "Health Services", so a reader scanning a row of real categories had no way
to tell which was which.

---

## The card

`CategoryCard` is one component with two shapes:

- a **category** — icon tile, title, description, footer CTA
- an **entity** — icon tile, optional meta chip, title, description, footer

Metrics live in one exported object so a card can never drift:

| Token              | Value                                              |
| ------------------ | -------------------------------------------------- |
| `CARD.padding`     | `p-5 sm:p-6`                                       |
| `CARD.title`       | `text-base sm:text-lg font-semibold text-gray-900` |
| `CARD.body`        | `text-sm text-gray-600 line-clamp-3`               |
| `CARD.footer`      | `border-t border-gray-100 pt-3 mt-1`               |
| `CARD.cta`         | `text-sm font-medium text-primary-600`             |
| `CARD.shadow`      | contact + ambient, plus `ring-1 ring-black/[0.04]` |
| `CARD.hoverShadow` | raised shadow with a 2px lift                      |

**Padding does not change at `md`.** A card that gains padding at a breakpoint
reads as a different card that happens to be larger, not as the same card.

Used by: service categories, government sections, departments, projects.

### Accessible names

The underlying `@bettergov/kapwa` `Card` hardcodes
`role="article" aria-label="Service card"`. Because that label sits on a
descendant of the wrapping link, it becomes the **link's** accessible name — so
every card grid on the site announced as "Service card", twenty-four routes of
them, on a page of departments and projects as much as services. `role="article"`
compounded it: a landmark per card, ten on a page.

Two fixes, both in `CategoryCard`:

- `src/components/ui/Card.tsx` wraps the library's `Card` and clears both
  attributes by default. The library spreads consumer props last, so a caller who
  genuinely wants a label can still pass one. This is one file rather than ~90
  call sites, and it applies to the whole site.
- `CategoryCard` names its link with `aria-labelledby` pointing at the card
  title, so tabbing through a grid announces the ten things you can go to.

---

## The grid

`CardGrid` — a responsive column ladder of **1 / 2 / 3 / 4**, capped at four.
Five columns at 1440px would make a card roughly 240px wide, narrower than this
site's two-line titles; "Infrastructure & Public Works" breaks to three lines and
the row stops being scannable.

### Why flex, not CSS grid

A CSS grid with a fixed column count leaves a hole on the right of the last row
whenever the item count is not a multiple of it. The homepage has 5 service
categories and 9 government sections, so both 3- and 4-column layouts stranded a
card.

Flex-wrap with a percentage basis produces identical geometry — same column
count, same widths, same gaps — but `justify-content` also applies to the final,
partial row. A short row is therefore **centred** rather than trailing off to the
left with a gap beside it, which reads as deliberate.

```
basis-full
sm:basis-[calc(50%-0.625rem)]
lg:basis-[calc(33.333%-0.667rem)]
xl:basis-[calc(25%-0.75rem)]
```

**Nothing is hidden to make the arithmetic work.** On a civic portal, quietly
dropping the fifth service category to tidy a grid is the wrong trade: an
incomplete list is worse than an uneven one. The overflow is disclosed honestly,
by the count on the "browse all" link.

`CardGrid` carries `data-card-grid` so the QA audit can aim its row-fill check at
card grids specifically, rather than at every wrapping flex row on the site — the
hotline strip and the footer link rows are _meant_ to sit left-aligned.

### Known remaining case

A final row holding a **single** card in a 3- or 4-wide grid is centred and
reported as `minor` by the audit, on `/services` at 1024px (10 items, 3 columns)
and `/government` at 1440px (9 items, 4 columns). It is centred, it is
deliberate, and it is recorded rather than hidden. Closing it would mean either
hiding a category or forcing a column count that wastes a third of a 1024px
screen.

---

## "Browse all" is not a card

`BrowseAllLink` + `BrowseAllFooter`, centred on their own line below the grid.

It used to be a fifth card in the row, drawn identically to "Health Services".
Two things were wrong:

- **It lied about the grid.** A reader scanning four real categories and one
  filler had no way to tell which was which, so every card had to be read.
- **It was not a peer.** No icon that meant anything, no description of its own
  content, and it pointed at a listing rather than a subject.

So it leaves the grid. Below the cards it becomes a quiet text link carrying the
**count** of what is behind it — which is the number that makes it a signpost
rather than a category, and which tells the reader the grid above is a sample.

Rendered only where there is overflow. On `/services` every category is already
in the grid, so a "browse all" link there would point at the page you are on.

---

## Example

```tsx
<CardGrid label={t('services.title')}>
  {categories.map((category, index) => (
    <CardGridItem key={category.slug}>
      <CategoryCard
        to={`/services/${category.slug}`}
        title={category.category}
        description={category.description}
        icon={getIconComponent(category.icon, { domain: 'service' })}
        tone="primary"
        cta={t('services.viewAllCategory')}
        animate={compact}
        animationDelay={index * 100}
      />
    </CardGridItem>
  ))}
</CardGrid>;

{
  compact && (
    <BrowseAllFooter>
      <BrowseAllLink to="/services" count={allCategories.length}>
        {t('services.viewAll')}
      </BrowseAllLink>
    </BrowseAllFooter>
  );
}
```

---

## Adding a card type

1. Extend `CategoryCard`'s props. Do not write a new card component — that is how
   four of them appeared in the first place.
2. Reuse `IconTile` and `StatusBadge`; do not introduce new sizes or tones.
3. Render it inside `CardGrid` + `CardGridItem` so row fill stays correct.
4. If it points at a listing rather than a subject, it is a `BrowseAllLink`.
