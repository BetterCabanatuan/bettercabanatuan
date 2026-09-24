# Better Cabanatuan — Flood Control & API Data Sources

This file documents the static data files in `src/data/` that snapshot BetterGov
public API data for Cabanatuan City. All data is retrieved once and committed as
YAML; there is no runtime API client.

## Retrieval date

All snapshots below were retrieved on **2026-09-23**.

## Per-file sources

| File                     | Content                                             | Source API                            | Endpoint                                                                                                                                                               |
| ------------------------ | --------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flood-controls.yaml`    | 34 DPWH flood-control projects in Cabanatuan        | flood-control.bettergov.ph            | `flood-control.bettergov.ph/api/v1/flood-control-projects/search?q=cabanatuan`                                                                                         |
| `national-projects.yaml` | 25 curated national (GAA) budget line items         | budget.bettergov.ph                   | `budget.bettergov.ph/api/v1/gaa/search?q=cabanatuan`                                                                                                                   |
| `legislation.yaml`       | 7 RAs, 2 Supreme Court rulings, 1 pending bill      | juris.ph / bills.juris.ph             | `juris.ph/api/v1/search?dataset=republic-acts&q=cabanatuan` · `juris.ph/api/v1/search?dataset=jurisprudence&q=cabanatuan` · `bills.juris.ph/api/measures?q=cabanatuan` |
| `election-results.yaml`  | 2025 NLE results (mayor, vice mayor, 10 councilors) | dynasties.bettergov.ph (Open Halalan) | `officials.bettergov.ph/api/v1/contests/2025-nueva-ecija-cabanatuan-lone-coun`                                                                                         |

## Notes

- **flood-controls.yaml** contains the full 34-project API snapshot. A
  completion-date ordering is applied; contract IDs, program/status, funding
  source, year, and coordinates are preserved where reported.
- **national-projects.yaml** is a curated subset (25) of the ~100 GAA line items
  that mention Cabanatuan, covering roads, bridges, flood control, education,
  and agriculture. The full dump can be re-fetched from the endpoint above.
- **legislation.yaml** was verified against juris.ph record pages (url/pdfUrl)
  and bills.juris.ph for the pending bill.
- **election-results.yaml** reflects the official 2025 COMELEC ballot face,
  which states "Vote for 10" for the Sangguniang Panlungsod. The Open Halalan
  dataset caps its seat count at 8; the top 10 candidates are the elected
  councilors (including Cecilio and Liwag at ranks 9–10).

## Related YAML

- `services.yaml`, `government.yaml`, `barangays.yaml`, `departments.yaml`,
  `projects.yaml`, `about.yaml`, `transparency.yaml` — curated LGU content which
  also feeds `yamlLoader.ts`; see `src/data/README.md`.
