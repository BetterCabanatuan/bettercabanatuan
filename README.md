# BetterCabanatuan

A modern, accessible website for Cabanatuan City's local government — built as an open-source starter kit that any Philippine LGU can fork and customize.

## Features

- **Multilingual** — English and Filipino today; supports Cebuano, Ilocano, Hiligaynon, Waray, Kapampangan, Bikol, Pangasinan, Maguindanao, Tausug, and Maranao out of the box
- **YAML-driven content** — Edit markdown and YAML files, never touch code
- **10 service categories** — Health, Education, Business, Social Welfare, Agriculture, Infrastructure, Waste, Environment, Disaster Preparedness, Housing
- **Full government section** — Officials, Departments, Projects, Barangays (89 urban + rural), News, Guides, Reports, Transparency, Consultations
- **Interactive maps** — Leaflet-based barangay and project maps
- **Full-text search** — Client-side search across all content
- **SEO & Open Graph** — Per-page metadata via react-helmet-async
- **Mobile-first** — Responsive layouts with Tailwind CSS v4
- **Unit & E2E tests** — Vitest + Playwright
- **One-command setup** — `npm run setup` configures branding interactively

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

| Command                | Purpose                           |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start dev server (localhost:5173) |
| `npm run build`        | Type-check + production build     |
| `npm run lint`         | ESLint check                      |
| `npm run lint:fix`     | Auto-fix lint issues              |
| `npm run format`       | Prettier formatting               |
| `npm run test`         | Vitest unit tests                 |
| `npm run test:e2e`     | Playwright end-to-end tests       |
| `npm run setup`        | Interactive LGU setup script      |
| `npm run convert-yaml` | Convert YAML content to JSON      |

## Project Structure

```
content/
├── government/           # Government pages (departments, officials, etc.)
│   └── departments/      # Department markdown & YAML
└── services/             # Service pages (10 categories)
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

| Path                            | Page                |
| ------------------------------- | ------------------- |
| `/`                             | Home                |
| `/services`                     | Services index      |
| `/services/:categoryId`         | Category listing    |
| `/services/:categoryId/:slug`   | Service document    |
| `/government`                   | Government index    |
| `/government/officials`         | Elected officials   |
| `/government/departments`       | Departments listing |
| `/government/departments/:slug` | Department detail   |
| `/government/barangays`         | Barangays listing   |
| `/government/barangays/:slug`   | Barangay detail     |
| `/government/projects`          | Projects listing    |
| `/government/projects/:slug`    | Project detail      |
| `/government/:categoryId`       | Category listing    |
| `/government/:categoryId/:slug` | Government document |
| `/about`                        | About page          |
| `/contact`                      | Contact page        |
| `/statistics`                   | Statistics page     |
| `/search`                       | Search page         |
| `/sitemap`                      | Sitemap             |

## Content System

Content lives in `content/` as YAML indexes and Markdown pages:

1. `**src/data/services.yaml**` — Service categories (name, slug, icon, description)
2. `**content/services/{slug}/index.yaml**` — Pages per category
3. `**content/services/{slug}/{page}.md**` — Markdown content

The same pattern applies to `content/government/`. See [CONTENT-GUIDE.md](CONTENT-GUIDE.md) for the full authoring guide.

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
git remote add upstream https://github.com/joshuagemvicente/bettercabanatuan.git
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
4. New page sections (News, Guides & Regulations, Reports, etc.)

## Documentation

| File                                           | Description                         |
| ---------------------------------------------- | ----------------------------------- |
| [STARTER-KIT-README.md](STARTER-KIT-README.md) | Setup & customization guide         |
| [CONTENT-GUIDE.md](CONTENT-GUIDE.md)           | Content writing guidelines          |
| [CONTENT-MANAGEMENT.md](CONTENT-MANAGEMENT.md) | Non-technical content editing guide |
| [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)     | Deploy to Vercel & other platforms  |
| [CHANGELOG.md](CHANGELOG.md)                   | Version history                     |

## License

[CC0 1.0 Universal](LICENSE) — public domain. Use, modify, and distribute freely, no attribution required.

## Acknowledgments

- [React 19](https://react.dev/) · [Vite 7](https://vite.dev/) · [TypeScript](https://www.typescriptlang.org/) · [Tailwind CSS v4](https://tailwindcss.com/)
- UI components by [@bettergov/kapwa](https://github.com/bettergov/kapwa)
- Icons by [Lucide](https://lucide.dev/) · Maps by [Leaflet](https://leafletjs.com/) · i18n by [i18next](https://www.i18next.com/)
