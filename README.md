# BetterCabanatuan

A modern, accessible website for Cabanatuan City's local government — built as an open-source starter kit that any Philippine LGU can fork and customize.

**Live site:** [bettercabanatuan.org](https://bettercabanatuan.org)

## Features

- **Multilingual** — English and Filipino today; supports Cebuano, Ilocano, Hiligaynon, Waray, Kapampangan, Bikol, Pangasinan, Maguindanao, Tausug, and Maranao out of the box
- **YAML-driven content** — Edit markdown and YAML files, never touch code
- **11 service categories** — Health, Education, Business, Social Welfare, Agriculture, Infrastructure, Waste, Environment, Disaster Preparedness, Housing, and Taxes, Certificates & Civil Registry
- **Full government section** — Officials, Departments, Projects, Barangays (89 urban + rural), News, Guides, Reports, Transparency, Consultations
- **Transparency** — Citizen's Charter and Transparency Seal documents, flood control projects, and city legislation
- **City news** — Updates imported from the city's Facebook posts and sorted by service topic
- **Tools for residents** — Links to standalone city apps such as [Pamasahe](https://pamasahe.bettercabanatuan.org), the jeep and tricycle fare checker
- **Interactive maps** — Leaflet-based barangay and project maps
- **Full-text search** — Client-side search across all content
- **SEO & Open Graph** — Per-page metadata via react-helmet-async
- **Accessible design system** — Shared colour, type and spacing tokens with an automated WCAG 2.1 contrast check
- **Mobile-first** — Responsive layouts with Tailwind CSS v4
- **Unit & E2E tests** — Vitest + Playwright
- **One-command setup** — `npm run setup` configures branding interactively

## Tools for Residents

Standalone apps built by the Better Cabanatuan community, linked from the homepage, navbar and footer:

| App                                               | What it does                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------------ |
| [Pamasahe](https://pamasahe.bettercabanatuan.org) | Check the legal jeep and tricycle fare in Cabanatuan City before you pay |

To add one, append an entry to `CIVIC_APPS` in `src/components/home/CivicAppsSection.tsx` and add its title and description under `civicApps.apps` in each `public/locales/*/common.json`.

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
# Fork & clone
git clone https://github.com/YOUR-USERNAME/bettercabanatuan.git
cd bettercabanatuan

# Install
npm install

# Configure your LGU (optional — defaults to Cabanatuan City)
npm run setup

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Scripts

| Command                         | Purpose                                                      |
| ------------------------------- | ------------------------------------------------------------ |
| `npm run dev`                   | Start dev server (localhost:5173)                            |
| `npm run build`                 | Type-check + production build (also regenerates the sitemap) |
| `npm run typecheck`             | TypeScript check only                                        |
| `npm run lint`                  | ESLint check                                                 |
| `npm run lint:fix`              | Auto-fix lint issues                                         |
| `npm run format`                | Prettier formatting                                          |
| `npm run test`                  | Vitest unit tests                                            |
| `npm run test:e2e`              | Playwright end-to-end tests                                  |
| `npm run check:contrast`        | Colour token + WCAG 2.1 contrast audit                       |
| `npm run qa:shots`              | Screenshot every route at every breakpoint                   |
| `npm run generate:sitemap`      | Regenerate `public/sitemap.xml` from content                 |
| `npm run import:posts -- <dir>` | Regenerate Facebook news updates from scraped posts          |
| `npm run setup`                 | Interactive LGU setup script                                 |
| `npm run convert-yaml`          | Convert YAML content to JSON                                 |

## Project Structure

```
content/
├── government/           # Government pages (departments, officials, etc.)
│   └── departments/      # Department markdown & YAML
└── services/             # Service pages (11 categories)
    ├── health-services/
    ├── education/
    ├── business/
    ├── social-welfare/
    └── ...

public/
└── locales/              # i18next translation files (en, fil, …)

src/
├── components/
│   ├── home/             # Home page sections
│   ├── layout/           # Navbar, Footer, Hotline
│   └── ui/               # Shared UI primitives
├── data/                 # Top-level YAML configs
├── i18n/                 # i18next setup
├── lib/                  # Utilities (markdownLoader, yamlLoader)
├── pages/                # Route components
│   ├── services/         # /services/*
│   ├── government/       # /government/*
│   ├── contact.tsx
│   ├── statistics.tsx
│   └── ...
└── types/                # TypeScript types
```

## Routes

| Path                            | Page                    |
| ------------------------------- | ----------------------- |
| `/`                             | Home                    |
| `/services`                     | Services index          |
| `/services/:categoryId`         | Category listing        |
| `/services/:categoryId/:slug`   | Service document        |
| `/government`                   | Government index        |
| `/government/officials`         | Elected officials       |
| `/government/departments`       | Departments listing     |
| `/government/departments/:slug` | Department detail       |
| `/government/barangays`         | Barangays listing       |
| `/government/barangays/:slug`   | Barangay detail         |
| `/government/projects`          | Projects listing        |
| `/government/projects/:slug`    | Project detail          |
| `/government/news`              | City news               |
| `/government/:categoryId`       | Category listing        |
| `/government/:categoryId/:slug` | Government document     |
| `/transparency`                 | Transparency documents  |
| `/transparency/flood-controls`  | Flood control projects  |
| `/transparency/legislation`     | City legislation        |
| `/hotlines`                     | Emergency hotlines      |
| `/about`                        | About page              |
| `/contact`                      | Contact page            |
| `/statistics`                   | Statistics page         |
| `/search`                       | Search page             |
| `/privacy`                      | Privacy notice          |
| `/accessibility`                | Accessibility statement |
| `/sitemap`                      | Sitemap                 |

## Content System

Content lives in `content/` as YAML indexes and Markdown pages:

1. `src/data/services.yaml` — Service categories (name, slug, icon, description)
2. `content/services/{slug}/index.yaml` — Pages per category
3. `content/services/{slug}/{page}.md` — Markdown content

A new category also needs its `index.yaml` imported in `src/data/yamlLoader.ts`. The same pattern applies to `content/government/`. See [CONTENT-GUIDE.md](CONTENT-GUIDE.md) for the full authoring guide.

Markdown pages support `{PLACEHOLDER}` tokens resolved from companion `.json` files or `VITE_*` env vars.

## Contributing

We welcome contributions from developers and non-technical contributors alike.

### Non-technical contributors

You can edit content directly on GitHub — no Git required:

1. Navigate to any `.md` or `.yaml` file under `content/`
2. Click the pencil icon (✏️) to edit
3. Add, fix, or improve the content
4. Click **Commit changes** and submit

See [CONTENT-MANAGEMENT.md](CONTENT-MANAGEMENT.md) for a step-by-step guide.

### Developers

```bash
# Fork the repo, then:
git clone https://github.com/YOUR-USERNAME/bettercabanatuan.git
cd bettercabanatuan
git remote add upstream https://github.com/BetterCabanatuan/bettercabanatuan.git
npm install

# Create a branch
git checkout -b feature/your-feature

# Make changes, then verify
npm run lint
npm run build
npm run test

# Push and open a PR
git push -u origin feature/your-feature
```

Keep your fork in sync:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### Contribution guidelines

- **Content** — accuracy first, plain language, include all details (requirements, steps, contacts)
- **Code** — follow existing patterns, single quotes, 2-space indent, trailing commas, 80-char width
- **Tests** — add tests for new features; ensure `npm run lint && npm run build && npm run test` passes
- **Accessibility** — use semantic HTML, proper heading hierarchy, ARIA labels where needed

### Priority areas

1. Translations (Filipino, Cebuano, and other Philippine languages)
2. Service content (add missing programs, fix outdated info)
3. Accessibility improvements
4. New page sections (Guides & Regulations, Reports, etc.)
5. More tools for residents, like [Pamasahe](https://pamasahe.bettercabanatuan.org)

## Documentation

| File                                             | Description                         |
| ------------------------------------------------ | ----------------------------------- |
| [STARTER-KIT-README.md](STARTER-KIT-README.md)   | Setup & customization guide         |
| [CONTENT-GUIDE.md](CONTENT-GUIDE.md)             | Content writing guidelines          |
| [CONTENT-MANAGEMENT.md](CONTENT-MANAGEMENT.md)   | Non-technical content editing guide |
| [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)       | Deploy to Vercel & other platforms  |
| [CHANGELOG.md](CHANGELOG.md)                     | Version history                     |
| [docs/DESIGN-TOKENS.md](docs/DESIGN-TOKENS.md)   | Colour, type and spacing tokens     |
| [docs/CARD-SYSTEM.md](docs/CARD-SYSTEM.md)       | Card and grid components            |
| [docs/IMAGERY-SYSTEM.md](docs/IMAGERY-SYSTEM.md) | Icons, portraits and imagery        |
| [docs/RESPONSIVE-QA.md](docs/RESPONSIVE-QA.md)   | Responsive screenshot QA            |

## License

[CC0 1.0 Universal](LICENSE) — public domain. Use, modify, and distribute freely, no attribution required.

## Acknowledgments

- [React 19](https://react.dev/) · [Vite 7](https://vite.dev/) · [TypeScript](https://www.typescriptlang.org/) · [Tailwind CSS v4](https://tailwindcss.com/)
- UI components by [@bettergov/kapwa](https://github.com/bettergov/kapwa)
- Icons by [Lucide](https://lucide.dev/) · Maps by [Leaflet](https://leafletjs.com/) · i18n by [i18next](https://www.i18next.com/)
