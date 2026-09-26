# Better Cabanatuan — BetterGov Projects & Data Sources

This portal is one of several projects in the BetterGov ecosystem. The data
behind `/transparency` and `/government` is drawn from sibling BetterGov
projects and their public APIs.

All API data is retrieved once and committed as YAML. **There is no runtime API
client** — the deployed site never calls these endpoints, so a BetterGov outage
cannot break a page. `scripts/generate-sitemap.mjs` and `src/data/yamlLoader.ts`
are the only consumers of the committed files.

## Projects

| Project                      | URL                                                                         | Provides                                  | Used here |
| ---------------------------- | --------------------------------------------------------------------------- | ----------------------------------------- | --------- |
| Budget                       | https://budget.bettergov.ph/docs                                            | National budget browser API & MCP         | Yes       |
| Juris                        | https://juris.ph/api                                                        | Republic acts and jurisprudence API & MCP | Yes       |
| Bills                        | https://bills.juris.ph/api                                                  | Senate and House bills API & MCP          | Yes       |
| Officials                    | https://officials.bettergov.ph                                              | Officials database portal (ongoing)       | Yes       |
| DPWH                         | https://api.dpwh.bettergov.ph/projects                                      | DPWH transparency portal API              | Yes       |
| Statistics                   | https://statistics.bettergov.ph/api                                         | PSA API & MCP                             | Indirect  |
| Statistics — classifications | https://statistics.bettergov.ph/api#classification                          | PSA classifications API                   | Indirect  |
| ASEAN                        | https://asean.bettergov.ph/api                                              | ASEAN economic indicators API & MCP       | No        |
| Flood control                | https://flood-control.bettergov.ph/api/flood-control-projects?q=&limit=1200 | DPWH flood-control projects index         | Yes       |

Notes on the endpoints above:

- **`api.dpwh.bettergov.ph`** serves the `flood-control-core` service. The bare
  host has no index route and returns `404 Route GET:/ not found`, so the table
  links to a concrete route instead. `/health` and `/projects` both respond.
- **`statistics.bettergov.ph`** backs `barangays.yaml` and `city-data.json` via
  PSGC/PSA data. Those files were generated from PSGC data rather than pulled
  live, so nothing re-fetches them today — hence "Indirect".
- **`asean.bettergov.ph`** is listed for completeness. No ASEAN figures are
  surfaced on this portal.

## Where each snapshot comes from

| Local file                        | Content                                                    | Source project           |
| --------------------------------- | ---------------------------------------------------------- | ------------------------ |
| `src/data/flood-controls.yaml`    | 34 DPWH flood-control projects in Cabanatuan               | DPWH                     |
| `src/data/national-projects.yaml` | 25 curated national (GAA) budget line items                | Budget                   |
| `src/data/legislation.yaml`       | 7 RAs, 2 Supreme Court rulings, 1 pending bill             | Juris, Bills             |
| `src/data/election-results.yaml`  | 2025 NLE results (mayor, vice mayor, 10 councilors)        | Officials (Open Halalan) |
| `src/data/barangays.yaml`         | 89 barangays with PSGC codes and 2015/2020/2024 population | Statistics (PSGC)        |
| `src/data/city-data.json`         | Population, land area, PSGC code, income class             | Statistics (PSGC)        |

Retrieval dates, per-file notes, and the exact query strings used are documented
in [`FLOOD_CONTROLS.md`](./FLOOD_CONTROLS.md).

## Query endpoints used for retrieval

| Dataset                | Endpoint                                                                       |
| ---------------------- | ------------------------------------------------------------------------------ |
| Flood-control projects | `flood-control.bettergov.ph/api/v1/flood-control-projects/search?q=cabanatuan` |
| GAA budget line items  | `budget.bettergov.ph/api/v1/gaa/search?q=cabanatuan`                           |
| Republic Acts          | `juris.ph/api/v1/search?dataset=republic-acts&q=cabanatuan`                    |
| Jurisprudence          | `juris.ph/api/v1/search?dataset=jurisprudence&q=cabanatuan`                    |
| Pending bills          | `bills.juris.ph/api/measures?q=cabanatuan`                                     |
| 2025 NLE contests      | `officials.bettergov.ph/api/v1/contests/2025-nueva-ecija-cabanatuan-lone-coun` |

Snapshots were retrieved on **2026-09-23**. The endpoints in this document were
re-checked for availability on **2026-09-26**.

## Re-fetching a snapshot

1. Query the endpoint above for `cabanatuan`.
2. Update the corresponding YAML in `src/data/`, preserving the existing field
   shape and comment header.
3. Run `npm run typecheck` and `npm test` — the data tests assert record counts
   and field shapes.
4. Run `npm run build`; the `prebuild` hook regenerates `public/sitemap.xml`.

## Sources not from BetterGov

Some portal data is fetched from third parties or maintained by hand. These are
**not** part of the BetterGov ecosystem:

- `src/data/hospitals.yaml` — manually curated contact details
  (see [`HOSPITALS_DATA.md`](./HOSPITALS_DATA.md)).
- `src/data/departments.yaml`, `src/data/department-contacts.yaml`,
  `src/data/hotline.yaml` — city directory data, maintained by hand.
- `src/pages/government/projects/FloodControlsFeatured.tsx` and the home page
  weather widget — Open-Meteo, called live at runtime.
- `src/data/national-projects.yaml` is a _curated subset_ of the ~100 GAA line
  items that mention Cabanatuan; the full dump is available from Budget.

## Related docs

- [`FLOOD_CONTROLS.md`](./FLOOD_CONTROLS.md) — per-file snapshot provenance.
- [`src/data/README.md`](./src/data/README.md) — how to edit the YAML content.
- [`CONTENT-MANAGEMENT.md`](./CONTENT-MANAGEMENT.md) — content workflow.
