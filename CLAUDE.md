# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start development server (localhost:5173)
npm run build            # TypeScript check + Vite production build (includes sitemap generation)
npm run generate:sitemap # Regenerate public/sitemap.xml from YAML content
npm test                 # Vitest unit tests
npm run test:e2e         # Playwright end-to-end tests
npm run typecheck        # tsc -b
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Format with Prettier
npm run dev:yaml         # Convert YAML to JSON, then start dev server
npm run setup            # Interactive setup script for new installations
npm run check:contrast   # Colour token + WCAG 2.1 contrast audit (fails CI)
npm run qa:shots         # Screenshot every route at every breakpoint
npm run qa:inspect       # Screenshot one scroll region, for pinning a defect
npm run update:copy      # Apply reviewed copy changes to the locale files
```

Pre-commit hook runs `lint-staged` automatically (ESLint + Prettier on staged files).

## Architecture

This is a React 19 + TypeScript + Vite app for Philippine Local Government Units (LGUs). It uses React Router, Tailwind CSS, i18next for multilingual support, and a YAML-based content system.

### Routing

`src/App.tsx` defines routes including:

- `/` — Home page
- `/services` / `/services/:category` — Services listing
- `/government` / `/government/:category` — Government section listing
- `/:documentSlug` / `/:lang/:documentSlug` — Document viewer (markdown content, used by both services and government)

### Content System

Content is stored as YAML and Markdown files under `content/`. Two parallel content trees exist:

#### Services (`content/services/`)

1. **`src/data/services.yaml`** — Top-level service categories (name, slug, icon, description). The `icon` field must be a valid Lucide React icon name.
2. **`content/services/{category-slug}/index.yaml`** — Lists pages under each category (`pages:` array with `name`, `slug`, `description`).
3. **`content/services/{category-slug}/{page-slug}.md`** — Actual markdown content for each service page.

When adding a new service category, you must:

- Add an entry to `src/data/services.yaml`
- Create `content/services/{slug}/index.yaml`
- Add the static import and mapping entry to `src/data/yamlLoader.ts` (`categoryIndexMap`)

#### Government (`content/government/`)

1. **`src/data/government.yaml`** — Top-level government categories (name, slug, icon, description).
2. **`content/government/{category-slug}/index.yaml`** — Lists pages under each category.
3. **`content/government/{category-slug}/{page-slug}.md`** — Markdown content for each department/office page.

When adding a new government category, you must:

- Add an entry to `src/data/government.yaml`
- Create `content/government/{slug}/index.yaml`
- Add the static import and mapping entry to `src/data/yamlLoader.ts` (`govCategoryIndexMap`)

Markdown files are loaded dynamically via `import()` in `src/lib/markdownLoader.ts`. The title is extracted from the first `# Heading` and the description from the first paragraph.

#### Companion JSON files

A markdown page can have an optional companion JSON file with the same slug (e.g. `executive.md` + `executive.json`). The loader attempts to import the JSON and passes it to `interpolate()`, which replaces `{PLACEHOLDER}` tokens in the markdown. Resolution order: JSON value → `VITE_<KEY>` env var → unchanged token.

Example: `{MAYOR}` in the markdown is replaced with the `MAYOR` value from `executive.json`, or `VITE_MAYOR` if no JSON file exists.

### Internationalization

- i18next with `HttpBackend` loads translation files from `public/locales/{lang}/common.json`
- Language detection order: `localStorage` → `navigator` → `htmlTag`
- Fallback language: `en`
- Supported languages are defined in `src/types/index.ts` (`LanguageType`)
- Currently only `public/locales/en/common.json` exists

### Environment Variables

The app uses `VITE_GOVERNMENT_NAME` (referenced in `Services.tsx`) for branding. Additional env vars are configured via the setup script.

### UI Components

Reusable primitives live in `src/components/ui/`: `Section`, `Heading`, `Text`,
`Card`, `CardGrid`, `CategoryCard`, `BrowseAllLink`, `ListItem`, `Breadcrumbs`,
`IconTile`, `OfficialPortrait`, `InitialsAvatar`, `MapBanner`, `StatusBadge`,
`EmptyState`, `ScrollToTop`. Use these instead of raw HTML elements for
consistency.

Import `Card` from `../ui/Card`, **not** from `@bettergov/kapwa/card` directly.
The local wrapper clears the `role="article"` and `aria-label="Service card"`
that the library hardcodes, which otherwise become the accessible name of every
link-wrapped card on the site.

### Design System

- **Tokens** — `src/lib/designTokens.ts` is the source of truth for colour, type,
  and spacing; mirrored into the `@theme` block in `src/index.css`.
  `npm run check:contrast` fails on drift between the two, on any declared pair
  dropping below its WCAG threshold, and on a documented "trap" that stops
  measuring badly. Run it after any colour change.
- **Visual metrics** — `src/lib/visualTokens.ts` holds the icon-tile and avatar
  sizes and the tint vocabulary. Kept out of the components so those files
  export components only.
- **Icons** — `getIconComponent(name, { domain })` in `src/lib/iconMap.ts`
  resolves a YAML `icon:` field. It falls back per domain rather than to one
  generic icon, so a typo is visible.
- **Docs** — `docs/DESIGN-TOKENS.md`, `docs/IMAGERY-SYSTEM.md`,
  `docs/CARD-SYSTEM.md`, `docs/RESPONSIVE-QA.md`.

### Adding a card

Extend `CategoryCard`; do not write a new card component. Render it inside
`CardGrid` + `CardGridItem` so row fill stays correct, and use `IconTile` and
`StatusBadge` for the visual anchor. See `docs/CARD-SYSTEM.md`.

### Code Style

- Single quotes, 2-space indentation, trailing commas (ES5), semicolons, 80-char line width (enforced by Prettier)
- Arrow functions omit parens for single arguments
