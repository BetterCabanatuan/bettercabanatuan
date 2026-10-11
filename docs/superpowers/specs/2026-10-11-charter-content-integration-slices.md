# Charter Content Integration: Sliced Specifications

**Date:** 2026-10-11

**Status:** Specification, ready for implementation

**Scope:** Service content, government directory, hotlines, transparency and
language content of the Better Cabanatuan portal. No visual or component changes.

**Source research:** `2026-10-11-cabanatuan-resident-needs-research.md` (same
folder). Section references below (§1 to §6) point into that note.

## Purpose

Turn the research note's prioritised recommendations into independently
deliverable slices. Each slice states who does it, what is already true, the
exact tasks, and how it is verified.

The build order from the research note is modified in one way: filling the
empty categories is no longer step 1. Step 1 is removing another city's facts
from the pages that already exist, because those pages are live and wrong.

## Findings that change the plan

1. **The existing service pages carry Lapu-Lapu City, Cebu facts.** Commit
   `bd33dd6` renamed the city but kept the content. Nine of the seventeen
   existing pages still name Mactan Doctors' Hospital, Hoops Dome in Gun-ob,
   City Hall in Brgy. Pajo, MAIFIPP pharmacies in Basak, Carajay and Ibo, a
   Cebu area code, University of Cebu and SunStar Cebu links. Two scholarship
   rows contain raw `:contentReference[oaicite:N]` markers.
2. **The six "empty" categories are not empty in the index.** Each
   `index.yaml` lists three or four generic starter pages whose slugs have no
   Markdown file, so every card links to the not-found guard.
3. **The Filipino UI locale is already complete.** `public/locales/fil/common.json`
   has all 345 keys; 35 values are identical to English and need review. What
   is missing is Filipino page content, and `loadMarkdownContent()` has no
   language parameter.
4. **The Citizen's Charter 2022 (2nd Edition) checks out.** Five claims from the
   research note were matched verbatim against the PDF text layer (edition,
   business permit 2 days / 1 day, OSCA ID free in 22 minutes, cedula fee
   structure, CDRRMO numbers). It is a safe primary source, dated 2022.

## Shared conventions (apply to every slice)

**Source of truth.** The Citizen's Charter 2022 (2nd Edition) PDF at
`https://www.cabanatuancity.gov.ph/uploads/photos/detail/61d7d8890742f0.14414526.pdf`.
Keep a local copy outside the repo while writing. Page numbers refer to the
printed page number in the PDF.

**Source line.** Every charter-derived Markdown page ends with a section:

```markdown
## Source

City Government of Cabanatuan, Citizen's Charter 2022 (2nd Edition), pp. N-M.
Accessed 2026-10-11. Fees cite City Ordinance No. 038-2010 (Revised Revenue
Code) and may have changed; confirm with the office before paying.
```

**No unsourced facts.** A requirement, fee, processing time, phone number,
address, office hour or programme name appears on a page only if it is in the
charter, on an official city page, or in a national law. Anything else is
written as "ask the office" with the office's charter contact.

**Fees and times in companion JSON.** When a page quotes a fee or processing
time, put the value in the companion `<slug>.json` and reference it with a
`{TOKEN}` so a future charter edition is a data edit, not a prose edit. The
token grammar is `{[A-Z0-9_]+}` as enforced by `scripts/check-content-placeholders.mjs`.

**Office naming.** Use the charter's verbatim office names (§2 table). Where
the repo slug differs from the official name, keep the slug and change only the
display name, so existing URLs do not break.

**Verification baseline for every slice.**

```bash
npm run check:placeholders
npm run check:routes
npm run typecheck
npm test
npm run build
```

**Content principle.** Follow `src/data/README.md`: pages describe what the
resident can get and do, from the resident's point of view.

## Slice map

| Phase | Slice                                                   | Depends on      |
| ----- | ------------------------------------------------------- | --------------- |
| A     | A1 Residue audit and quarantine                         | none            |
| A     | A2 Banned-terms gate in the placeholder checker         | A1              |
| A     | A3 Hotline reconciliation                               | none            |
| B     | B1 Business and permits                                 | A1              |
| B     | B2 New category: taxes, certificates and civil registry | none            |
| B     | B3 Social welfare                                       | A1              |
| B     | B4 Health services                                      | A1              |
| B     | B5 Housing and land use                                 | none            |
| B     | B6 Education rewrite                                    | A1              |
| B     | B7 Garbage and waste rewrite                            | A1              |
| C     | C1 Department directory                                 | none            |
| C     | C2 Transparency hub                                     | none            |
| C     | C3 Complaints and feedback                              | A3              |
| C     | C4 Filipino page content                                | B1 to B7        |
| D     | D1 Disaster preparedness                                | A3              |
| D     | D2 Tricycle operators guide                             | B1              |
| D     | D3 Agriculture and veterinary                           | none            |
| D     | D4 Environment                                          | none            |
| D     | D5 Infrastructure and utilities                         | none            |
| D     | D6 Livelihood and employment                            | none            |
| D     | D7 Privacy notice                                       | none            |
| D     | D8 Upstream hotlines contribution                       | A3              |
| E     | E1 to E6 Blocked items                                  | listed per item |

---

# Slice A1: Residue audit and quarantine

## Role

Content editor with the charter PDF open. Edits Markdown and YAML only. Does
not add new pages.

## Context

Seventeen pages exist under `content/services/` in `business/`, `education/`,
`garbage-waste-disposal/` and `health-services/`. Nine contain Lapu-Lapu City
facts. `src/data/hospitals.yaml` lists six hospitals; one entry, Medical City
Clinic, has an Ortigas Center, Pasig City address. The not-found guard from
commit `036335d` already handles slugs with no file.

## Tasks

1. Run the residue search and save the hit list to the slice's PR description:

   ```bash
   grep -rn -i -E "lapu|mactan|cebu|opon|basak|carajay|\bibo\b|marigondon|pusok|gun-ob|pajo|maribago|mandaue|MAIFIPP|cebuano|bisaya|oaicite|contentReference" content/ src/data/
   ```

2. For each of the seventeen pages, remove every sentence, table row, link and
   address that the charter or an official city page cannot support. Do not
   replace it with a guess. Where a section becomes empty, replace it with one
   line naming the responsible office and its charter phone number (§2 table).
3. Remove the `:contentReference[oaicite:N]{index=N}` markers from
   `apply-for-local-scholarships.md`.
4. Remove the Medical City Clinic entry from `src/data/hospitals.yaml`. Keep
   the other five only if their addresses are in Cabanatuan City. Keep
   MV Gallego Cabanatuan City General Hospital; the charter lists it at
   Maharlika Highway with 0919 089 9880 and 044 958 9774 (p.345).
5. Add the Source section (shared conventions) to every page touched, citing
   the charter page used or stating "No charter entry; office contact only".
6. Re-run the residue search; the result must be empty.

## Additional specifications

- **Files:** the seventeen `.md` files; `src/data/hospitals.yaml`.
- **Acceptance:** residue search returns zero lines; every touched page renders
  through the document route; `npm run check:placeholders` passes.
- **Out of scope:** writing new charter content (phases B and D).
- **Risk:** some pages will shrink to a heading and an office contact. That is
  acceptable; wrong content is worse than thin content.

---

# Slice A2: Banned-terms gate in the placeholder checker

## Role

Script maintainer. Node, no framework code.

## Context

`scripts/check-content-placeholders.mjs` already fails the build on `{TOKEN}`
leftovers and bracketed placeholders, and runs in `lint-staged` and CI
(`package.json` script `check:placeholders`). It scans `content/**/*.md`.

## Tasks

1. Add a `BANNED_TERMS` list to the script holding the terms from the A1
   residue search, case-insensitive, with word boundaries for short terms
   (`ibo`, `pajo`).
2. Report each hit with file, line and matched term in the same format the
   script uses for placeholders; fail with exit 1 unless `--report` is passed.
3. Extend the scan to `src/data/*.yaml` and `src/data/*.ts` for the same
   terms, reusing the file walker.
4. Document the gate in the script header comment next to the two existing
   conventions.

## Additional specifications

- **Files:** `scripts/check-content-placeholders.mjs`.
- **Acceptance:** with A1 merged, `npm run check:placeholders` passes; reverting
  one A1 edit makes it fail with the file and term named.
- **Non-goal:** no new npm script; the existing `check:placeholders` covers it.

---

# Slice A3: Hotline reconciliation

## Role

Data editor. TypeScript data file only.

## Context

`src/data/hotlines.ts` exports `emergencyHotlines` with four entries: PNP,
BFP, CDRRMO and Community Affairs. `src/data/hotline.yaml` is empty (0 lines)
and unreferenced. The research note §4 verifies the CDRRMO numbers from the
charter as Smart 0908 881 1010, Globe 0917 851 1320 and landline 044 940 0161
(pp.229, 344). The repo has 0918-881-1010. PNP and BFP numbers in the repo have
no source found. Verified additional lines (§4): City Health Office main
0919 081 1348 and 044 463 5900; MVG hospital 0919 089 9880 and 044 958 9774;
CSWDO crisis 0919 081 1345 and medical/burial 0919 081 0246; complaints text
0917 813 3247; 911; 8888.

## Tasks

1. Change the CDRRMO Smart number to `0908-881-1010`.
2. Add entries for City Health Office, MVG Cabanatuan City General Hospital and
   CSWDO with the numbers above, following the `EmergencyHotline` shape and
   using existing Lucide icons.
3. Leave the PNP and BFP entries unchanged.
4. Delete `src/data/hotline.yaml` after confirming with `grep -rn hotline.yaml
src scripts` that nothing imports it.
5. Note open question 1 (§ Open questions) in the PR so the LGU is asked for
   current PNP, BFP, CELCOR and water district numbers.

## Additional specifications

- **Files:** `src/data/hotlines.ts`, its test.
- **Acceptance:** `formatPhoneForTel` still produces `+63` numbers for every
  entry; a unit test asserts the CDRRMO Smart number equals `0908-881-1010`.
- **Decision record (2026-10-11):** the PNP and BFP numbers stay without a
  "pending verification" marker. This is a deliberate exception to the
  "no unsourced facts" convention, chosen so the emergency page always shows a
  police and fire number. Revisit when open question 1 is answered.
- **Dependency for:** C3, D1, D8.

---

# Slice B1: Business and permits

## Role

Content writer for the City Business Licensing and Investment Promotion Office
and City Planning and Development Office services.

## Context

`content/services/business/` has four pages; two carry residue (A1). The
charter publishes, with page numbers: new business permit, 2 days, pp.85-91;
renewal, 1 day, pp.91-93, including the line "Accomplish the on line
application form"; occupational (working) permit, 1 day, p.93; locational
clearance / zoning permit, 5 days 3 hours, pp.171-178; market clearance and
market certificate, ₱100, 10 and 15 minutes, pp.334-336 (CEEPUMO). The
new-permit checklist names the barangay business clearance, locational
clearance, sanitary permit, occupancy/building/electrical permits, City
Environment Certificate, market clearance for stallholders, FSIC and
SSS/PhilHealth/Pag-IBIG clearances.

## Tasks

1. Rewrite `apply-for-barangay-clearance-and-mayors-business-permits.md` from
   pp.85-91: who may avail, the checklist as a table with "where to secure",
   the steps with the responsible office, total time 2 days, fee "assessed".
2. Rewrite `renew-permits-and-pay-local-business-taxes.md` from pp.91-93 and
   the business tax payment entry pp.112-114 (Treasurer, 16 minutes). Replace
   the current Local Government Code generalities with the charter's steps.
   Mention the online application form only as "the charter refers to an
   online form" until open question 4 is answered.
3. Add `get-an-occupational-or-working-permit.md` from p.93.
4. Add `secure-a-locational-clearance-or-zoning-permit.md` from pp.171-178,
   and cross-link it from B5.
5. Rewrite `rent-stalls-in-public-markets.md` to the market clearance and
   market certificate services pp.334-336. State plainly that stall awards are
   not in the charter and name CEEPUMO's contact 0919 081 2785,
   ceepumocab@gmail.com, CEEMPUMO Bldg., Sanciangco St., Barangay Supermarket.
6. Rewrite `join-trade-fairs-business-expos-or-tourism-promotions.md` down to
   the City Information and Tourism Office contact (0919 089 9862) and the
   PESO Facebook page the official site links. Remove all venues and schedules.
7. Update `content/services/business/index.yaml` names and descriptions to
   match, adding the two new slugs.
8. Companion JSON per page for fees and times.

## Additional specifications

- **Files:** `content/services/business/*.md`, `*.json`, `index.yaml`.
- **Acceptance:** each page has a Source section with page numbers; every fee
  and time comes through a `{TOKEN}`; `npm run generate:sitemap` includes the
  new slugs.
- **Owner office display names:** "City Business Licensing and Investment
  Promotion Office" (repo slug `bplo` stays), "City Planning and Development
  Office", "City Economic Enterprise and Public Utilities Management Office".

---

# Slice B2: New category: taxes, certificates and civil registry

## Role

Content writer plus one small TypeScript change (the loader map).

## Context

No existing category holds real property tax, cedula, tax declarations or
civil registry services. The research note proposes a new `civil-registry` or
`taxes-and-certificates` category. This spec chooses one category,
`taxes-and-certificates`, named "Taxes, Certificates and Civil Registry", to
keep the category list short. Charter entries: RPT payment, 19 minutes,
pp.105-106, due 1 January or quarterly 31 March / 30 June / 30 September /
31 December, 10% on-time and 20% advance discounts, 2% monthly penalty; RPT
clearance ₱50, 21 minutes, p.111; cedula pp.109-110, 11 minutes, individuals
₱5 basic + ₱25 or ₱1 per ₱1,000 income, corporations ₱500 base; certified true
copy of tax declaration ₱50, p.67; transfer of tax declaration, 42 minutes,
pp.70-73; timely registration of birth, marriage, death, free, 15 minutes,
pp.202-203; delayed registration of birth, 10 days and 25 minutes, pp.204-206;
certification of birth, marriage or death, ₱50 per document, 27 minutes,
pp.208-210; correction of clerical error under RA 9048, ₱1,500, pp.211-212;
marriage license, ₱290 total, 35 minutes plus 10-day posting, pp.200-201.

## Tasks

1. Add the category to `src/data/services.yaml` with slug
   `taxes-and-certificates` and a Lucide icon name that exists (for example
   `Receipt`); verify with `getIconComponent`.
2. Create `content/services/taxes-and-certificates/index.yaml` with pages:
   `pay-real-property-tax`, `get-a-real-property-tax-clearance`,
   `get-a-community-tax-certificate-cedula`,
   `request-a-certified-true-copy-of-tax-declaration`,
   `transfer-a-tax-declaration`, `register-a-birth-marriage-or-death`,
   `register-a-birth-late-delayed-registration`,
   `request-a-birth-marriage-or-death-certificate`,
   `correct-a-clerical-error-in-a-civil-registry-record`,
   `apply-for-a-marriage-license`.
3. Write each page from the cited charter pages with companion JSON for fees
   and times.
4. Add the static import and `categoryIndexMap` entry in
   `src/data/yamlLoader.ts`, following the existing pattern.
5. Add the category to the search index if `src/data/searchIndex.ts` lists
   categories explicitly.
6. Run `npm run generate:sitemap`.

## Additional specifications

- **Files:** `src/data/services.yaml`, `src/data/yamlLoader.ts`,
  `content/services/taxes-and-certificates/**`, `public/sitemap.xml`.
- **Owner offices:** Office of the City Treasurer (1st Floor, 0919 089 9849,
  044 464 7696); Office of the City Assessor (1st Floor, 0919 089 9867); City
  Civil Registry Office (1st Floor, 0919 081 4548, 044 456 6920).
- **Acceptance:** `/services/taxes-and-certificates` lists ten cards and each
  resolves; `isNestedCategory('taxes-and-certificates')` is true.
- **Alternative rejected:** two categories (`civil-registry` and
  `taxes-and-certificates`). Revisit if the category exceeds twelve pages.

---

# Slice B3: Social welfare

## Role

Content writer for City Social Welfare and Development Office services.

## Context

`content/services/social-welfare/index.yaml` lists four generic starter pages
with no files. Charter entries: OSCA ID, free, 22 minutes, pp.284-285; solo
parent ID, pp.285-286; certificate of indigency and social case study report
for scholarship and SPES, free, 38 minutes, pp.294-295; 4Ps Listahanan
certification, p.283; solicitation permit, ₱300, 27-52 minutes, p.284. Not in
the charter: PWD ID (no PDAO entry), AICS and medical or burial assistance
(only the line 0919 081 0246 is listed), disaster relief distribution.

## Tasks

1. Replace the four starter entries in `index.yaml` with:
   `get-a-senior-citizen-osca-id`, `get-a-solo-parent-id`,
   `get-a-certificate-of-indigency`, `get-a-4ps-listahanan-certification`,
   `apply-for-a-solicitation-permit`, and one page
   `ask-about-pwd-id-and-medical-or-burial-assistance` that states these are
   not in the published charter and gives the CSWDO lines 0919 081 1345 and
   0919 081 0246 and the CSWDO Bldg., City Hall Compound address.
2. Write each charter page from the cited pages with companion JSON.
3. Reference RA 9994 (free OSCA ID nationally) and RA 11861 (solo parent ID
   valid one year) only as national context, cited to lawphil as in the note.

## Additional specifications

- **Files:** `content/services/social-welfare/**`.
- **Acceptance:** six cards resolve; the PWD/assistance page carries no fee,
  time or requirement.
- **Open questions carried:** 6 (PWD ID owner office; AICS amounts).

---

# Slice B4: Health services

## Role

Content writer for City Health Office and MVG hospital services.

## Context

Five pages exist; two carry residue (A1). Charter entries: sanitary permit
₱100 type A, ₱200-500 type B, 18 minutes, pp.252-253; health certificate ₱50,
32 minutes, p.251, requiring OR, working permit, chest X-ray and fecalysis;
medical certificate ₱50, 32 minutes, p.250; medical consultation face-to-face
and telemedicine, free, 20-35 minutes, pp.241-242; animal bite treatment,
TB-DOTS, immunisation, family planning and dental, free, pp.242-248; MVG
hospital OPD consultation and hemodialysis, free, 40 minutes, pp.271-276.
Health centres with numbers are in §2 (CHC 1, 2, 4, 5, 6, 7 and CESU).

## Tasks

1. Rewrite `get-free-check-ups-basic-medicines-and-vaccines.md` from
   pp.241-248. Remove MAIFIPP and partner pharmacies. Add the health centre
   table from §2 with barangay and phone.
2. Rewrite `go-to-the-local-hospital-for-treatment-or-confinement.md` around
   MVG Cabanatuan City General Hospital pp.271-276 and the entries that remain
   in `src/data/hospitals.yaml` after A1.
3. Rewrite `access-maternal-care-and-child-immunization.md` and
   `join-health-programs-nutrition-dengue-control-tb-treatment.md` to the
   charter services that exist (immunisation, family planning, TB-DOTS); drop
   programmes the charter does not name.
4. Merge `health-clinics-immunization-and-hotlines.md` into the rewritten
   check-ups page, or reduce it to the health centre directory plus the CHO
   and CDRRMO numbers from A3. Update `index.yaml` accordingly.
5. Add `get-a-sanitary-permit.md`, `get-a-health-certificate.md` and
   `get-a-medical-certificate.md`.

## Additional specifications

- **Files:** `content/services/health-services/**`, `index.yaml`.
- **Owner office display name:** "City Health Office" (CHO Bldg., City Hall
  Compound, 0919 081 1348, 044 463 5900).
- **Acceptance:** no pharmacy, hospital or programme name on these pages
  without a charter page or an official city source.

---

# Slice B5: Housing and land use

## Role

Content writer for City Planning and Development Office and Office of the City
Building Official services.

## Context

`content/services/housing-land-use/index.yaml` lists three starter pages with
no files. Charter entries: locational clearance / zoning permit pp.171-178
(written in B1, cross-linked here); building permit, highly technical,
pp.148-150; occupancy, fence, demolition, excavation and electrical permits,
complex, fence 3 hours, pp.151-160. Not in the charter: socialized housing,
relocation sites.

## Tasks

1. Replace the starter entries with `apply-for-a-building-permit`,
   `apply-for-occupancy-fence-demolition-excavation-or-electrical-permits`,
   `request-zoning-land-use-or-building-permits` (keep this existing slug as a
   short overview page linking the two above and B1's locational clearance),
   and `ask-about-socialized-housing-and-relocation` stating the charter has
   no entry and giving the CPDO contact 0919 081 3219.
2. Write the two permit pages from pp.148-160 with companion JSON.
3. Office of the City Building Official is at 1st Floor, City Hall with no
   number listed in the charter; say so rather than borrow another office's
   line.

## Additional specifications

- **Files:** `content/services/housing-land-use/**`.
- **Acceptance:** four cards resolve; the overview page links to three pages
  that exist.

---

# Slice B6: Education rewrite

## Role

Content writer. Depends on A1 having stripped the Cebu content.

## Context

All four education pages referenced Cebu institutions. Charter entries that
touch education: certificate of indigency for scholarship assistance and SPES,
pp.294-295 (written in B3); basic literacy and ALS, p.287; ECCD permit to
operate, p.290; computer certification, p.289. The charter has no city
scholarship programme entry.

## Tasks

1. Rewrite `apply-for-local-scholarships.md` to: what the charter provides
   (the indigency certificate and social case study report, linking B3), and a
   clear statement that scholarship programme details must be confirmed with
   CSWDO's Child and Youth Development Division.
2. Rewrite `enroll-children-in-lgu-daycare-or-preschool-programs.md` around
   the ECCD permit to operate (p.290, for operators) and a "ask your barangay
   day care" line for parents, with the CSWDO contact.
3. Rewrite `access-educational-support-programs-from-the-lgu.md` to ALS and
   basic literacy p.287 and SPES p.294.
4. Reduce `learn-about-supplementary-activities-for-schools-in-your-area.md`
   to verified content or merge it into the page above and remove its slug
   from `index.yaml`.

## Additional specifications

- **Files:** `content/services/education/**`.
- **Acceptance:** no university, library or news outlet named unless it is in
  Cabanatuan and sourced.

---

# Slice B7: Garbage and waste rewrite

## Role

Content writer. Depends on A1.

## Context

Four pages exist; three give a Brgy. Pajo City Hall address. The charter has
no garbage collection service and no schedule. The Cabanatuan City Environment
and Natural Resources Office is at 2nd Floor, City Hall, 0919 081 4509 (§2).
The claim that CENRO runs collection is unverified. Open question 7 covers the
schedule and responsible office.

## Tasks

1. Replace all addresses with "City Hall, Kapitan Pepe Subd. Phase II,
   Cabanatuan City 3100" and the CENRO number, marked as the office to ask.
2. Rewrite the four pages so they describe segregation rules from RA 9003 only
   where cited, and otherwise direct residents to their barangay hall and the
   CENRO line. Remove invented collection frequencies.
3. Keep the four slugs; shorten the pages rather than delete them.

## Additional specifications

- **Files:** `content/services/garbage-waste-disposal/**`.
- **Acceptance:** no schedule, frequency or truck assignment appears without
  an official source.

---

# Slice C1: Department directory

## Role

Data editor and content writer for `content/government/departments/`.

## Context

`src/data/departments.yaml` has 20 entries; markdown exists for `executive`
and `legislative` only. Four names differ from the charter: "Business Permits
and Licensing Office" vs City Business Licensing and Investment Promotion
Office; "City Legal Office" vs Office for City Legal Affairs; "Accounting
Office" vs Office of the City Accountant; "City Tourism Division" vs City
Information and Tourism Office. Three repo entries do not appear in the
charter: "Administration Office", "Information Technology Studies / Management
Office", "Land Registration Authority — Registry of Deeds". Ten charter
offices are missing: City General Services Office, Cabanatuan City Environment
and Natural Resources Office, Office of the City Engineer, Office of the City
Building Official, City Motor Pool Office, City Livelihood and Cooperatives
Development Office, City Veterinary Office, Community Affairs Office, MVG
Cabanatuan City General Hospital, and the City Health Centers.
`src/data/department-contacts.yaml` numbers already match the charter.

## Tasks

1. Change the four display names to the charter's verbatim names; keep slugs.
2. Add the ten missing offices with slugs in the existing style
   (`gso`, `cenro`, `city-engineers-office`, `city-building-official`,
   `motor-pool`, `clcdo`, `city-veterinary-office`, `community-affairs`,
   `mvg-city-general-hospital`, `city-health-centers`), each with location and
   contact from the §2 table.
3. Mark the three non-charter entries: keep "Land Registration Authority —
   Registry of Deeds" with a note that it is a national agency; move
   "Administration Office" and "Information Technology Studies / Management
   Office" to a `pendingVerification: true` flag if the schema allows, else
   remove and record them in the PR for the LGU to confirm.
4. Add matching entries to `department-contacts.yaml` for every new office
   with a number.
5. Write one Markdown page per office under
   `content/government/departments/<slug>.md`: mandate line from the charter
   if present, location, contacts, and a "Services in the charter" list that
   links to the B-phase pages the office owns. Add every slug to
   `content/government/departments/index.yaml`.
6. On the `city-health-centers` page, table the six centres and CESU with
   barangay and numbers from §2.

## Additional specifications

- **Files:** `src/data/departments.yaml`, `src/data/department-contacts.yaml`,
  `content/government/departments/**`.
- **Acceptance:** `/government/departments` shows 27 or more offices; every
  card resolves; `DepartmentDetail` renders contacts for each.
- **Design constraint:** render inside `CardGrid` with `CategoryCard`; no new
  card component (per `docs/CARD-SYSTEM.md`).

---

# Slice C2: Transparency hub

## Role

Data editor for `src/data/transparency.yaml`; no new components.

## Context

`/transparency` already has sections and links. `government.yaml` marks
`transparency-documents` as `comingSoon`. The city site posts: SEF Annual
Budgets 2025, SEF Utilization Q1-Q4 2024, BGCM, LGSF Annex C/D, a Proposed
Schedule of Market Values notice, Annual Procurement Plan FY 2026 (PDF link in
§2), and the Citizen's Charter PDF. Compliance baselines (§6): DILG MC 2024-021
Full Disclosure Policy, 14 core documents, quarterly; GAA FY2026 RA 12314
s.112 Transparency Seal, 11 items, LGU applicability not confirmed; EO 2
s.2016 FOI, city FOI presence unconfirmed.

## Tasks

1. Add a "Citizen's Charter" section linking the PDF with edition and date.
2. Add a "Full Disclosure Policy" section listing the 14 core documents as
   rows with a status of `posted` (with URL) or `not yet located`, using the
   city's posted SEF and APP documents for the rows they satisfy. Link the
   FDP Portal `https://fdpp.dilg.gov.ph/`.
3. Add a "Transparency Seal" section with the 11 items in the same row shape
   and a one-line note that LGU applicability of the current GAA text is not
   confirmed.
4. Keep `transparency-documents` as `comingSoon` until at least half of the 14
   FDP rows are `posted`; then flip the flag and update `comingSoonNote`.
5. Carry open question 9 in the PR.

## Additional specifications

- **Files:** `src/data/transparency.yaml`, `src/data/government.yaml`.
- **Acceptance:** every URL in the new sections returns 200 at time of merge;
  `StatusBadge` is used for row status.
- **Non-goal:** mirroring PDFs into the repo. Link, do not copy.

---

# Slice C3: Complaints and feedback

## Role

Content editor for the Contact page data.

## Context

Charter pp.340-341 publish: a Public Assistance and Complaint Desk at the City
Hall lobby, complaints by text to 0917 813 3247, Office of the City Mayor
0919 081 3749 and cabanatuan.lgu@gmail.com, ARTA complaints@arta.gov.ph and
8-478-5093, Presidential Complaint Center pcc@malacanang.gov.ph and 8888,
Contact Center ng Bayan email@contactcenterngbayan.gov.ph and 0908 881 6565.
RA 11032 s.6(g) requires the complaint procedure to be published with the
charter.

## Tasks

1. Add a "Complaints and feedback" block to the Contact page data with the
   seven channels above in a table: channel, who it is for, how to reach it.
2. Add a one-line footer link "How to file a complaint" on every service
   document page, pointing to the Contact page anchor.
3. State the source: Citizen's Charter 2022, pp.340-341.

## Additional specifications

- **Files:** Contact page data and `DocumentPage.tsx` footer.
- **Acceptance:** the anchor resolves from every `/services/*/*` page.

---

# Slice C4: Filipino page content

## Role

Translator working with a developer for the loader change.

## Context

`public/locales/fil/common.json` already has all 345 UI keys. Thirty-five
values are identical to English and need a review pass. `LanguageType` already
includes `fil`. `loadMarkdownContent(documentSlug, categorySlug, categoryType)`
imports `content/<dir>/<category>/<slug>.md` with no language parameter, and
routes are `/services/:categoryId/:documentSlugId` and
`/government/:categoryId/:documentSlugId`. RA 11032 s.6 allows the charter in
Filipino.

## Tasks

1. Review the 35 identical `fil` values and translate those that are prose.
2. Developer task: give `loadMarkdownContent` an optional language parameter
   that first tries `<slug>.<lang>.md` and falls back to `<slug>.md`, with the
   same companion JSON. Wire it to the active i18next language. Add a unit
   test for the fallback.
3. Translate the B-phase pages in priority order: B2 (civil registry, RPT,
   cedula), B3, B1, B4, B5, B6, B7, saving as `<slug>.fil.md` beside the
   English file.
4. Add a visible "Available in Filipino / English" switch on document pages
   only if the loader change lands; otherwise the global language switch
   suffices.

## Additional specifications

- **Files:** `public/locales/fil/common.json`, `src/lib/markdownLoader.ts`,
  `content/services/**/*.fil.md`.
- **Acceptance:** switching the UI language to Filipino shows the Filipino
  Markdown where it exists and the English file where it does not, without a
  not-found state.
- **Open question carried:** 11 (preferred Filipino register).

---

# Slice D1: Disaster preparedness

## Role

Content writer for CDRRMO services. Depends on A3.

## Context

`content/services/disaster-preparedness/index.yaml` lists three starter pages
with no files. Charter: 24/7 emergency response (EMS), free, dispatch 3-20
minutes, pp.229-230, hotlines as in A3. §1 hazards: Pampanga River flooding
affecting 13 to 25 barangays per event, Philippine Fault Gabaldon segment about
15 km away, 2015 global atlas ranking. City Ordinance 48 s.2014 created the
LDRRMC (§6). The flood-prone barangay list and evacuation centres are open
question 8 and must not be guessed.

## Tasks

1. Replace the starter entries with `call-the-cdrrmo-emergency-line`
   (pp.229-230, the three numbers, what to say, dispatch time),
   `know-your-flood-earthquake-and-typhoon-risk` (the §1 hazard facts with
   their citations, link to the CDRRMO Facebook page the official site lists),
   and `find-evacuation-centers-and-drills` which states that the current list
   is pending CDRRMO confirmation and gives the CDRRMO contact.
2. Link the hazard page to HazardHunter PH as an external tool.
3. Reuse the existing Leaflet `MapBanner` only if a confirmed evacuation
   centre list arrives; otherwise no map.

## Additional specifications

- **Files:** `content/services/disaster-preparedness/**`.
- **Acceptance:** no barangay is named as flood-prone on these pages until
  open question 8 is answered.

---

# Slice D2: Tricycle operators guide

## Role

Content writer. Depends on B1.

## Context

The charter publishes only the Mayor's clearance for MTOP, 20 minutes, pp.41-42,
issued by the City Mayor's Office Administrative Division, Community
Affairs-Traffic Management Section, requiring voter's ID or COMELEC
certificate, police clearance, barangay clearance and cedula. The franchise
itself, the fare matrix and TODA list are open question 5. The research note
offers either a new `transport-and-traffic` category or a page under
`business/`; this spec places it under `business/` until the ordinance is
obtained.

## Tasks

1. Add `content/services/business/get-a-mayors-clearance-for-a-tricycle-mtop.md`
   from pp.41-42 with companion JSON, linking the cedula page in B2.
2. State that the franchise steps and fares are not in the published charter
   and name the Community Affairs Office line 0919 081 3983.
3. Add the slug to `business/index.yaml`.

## Additional specifications

- **Acceptance:** no fare, franchise fee or TODA name appears.
- **Promotion rule:** create the `transport-and-traffic` category only when
  open question 5 yields the ordinance and fare matrix.

---

# Slice D3: Agriculture and veterinary

## Role

Content writer for City Agriculture Office and City Veterinary Office services.

## Context

`agriculture-fisheries/index.yaml` lists four starter pages. Charter: farmer
ID, RSBSA inputs, seeds, soil test, tilapia fingerlings at ₱50 per bag,
pp.188-197; free anti-rabies vaccination, pet and livestock treatment,
impounding, pp.307-331; documentation and branding of large cattle (Treasurer,
p.114). No charter entry for borrowing farm equipment.

## Tasks

1. Keep the slugs `ask-for-free-seeds-seedlings-fertilizers-or-fingerlings`,
   `get-veterinary-services-for-livestock` and
   `attend-farming-or-fishing-training`; replace
   `borrow-farm-tools-or-equipment-from-the-lgu` with
   `register-as-a-farmer-rsbsa-and-get-a-farmer-id` and add
   `get-free-anti-rabies-vaccination-for-pets`.
2. Write each from the cited pages with companion JSON. The training page
   should list only trainings the charter names; otherwise one line with the
   City Agriculture Office contact 0919 089 9925, CALMO Bldg.

## Additional specifications

- **Files:** `content/services/agriculture-fisheries/**`.
- **Owner offices:** City Agriculture Office; City Veterinary Office (CVO
  Bldg., 0919 089 9906).

---

# Slice D4: Environment

## Role

Content writer for CENRO services.

## Context

`environment/index.yaml` lists two starter pages. Charter pp.117-135: City
Environment Certificate, Permit to Operate, hauling pass, tree-cutting
clearance, environmental complaint filing (pp.117-140 in the §3 table).

## Tasks

1. Add `get-a-city-environment-certificate-or-permit-to-operate`,
   `get-a-hauling-pass`, `get-a-tree-cutting-clearance`, and
   `file-an-environmental-complaint`. Keep
   `join-clean-up-drives-and-tree-planting-activities` as a short page
   pointing to the CENRO line; retitle
   `report-illegal-logging-quarrying-or-fishing` to the complaint page or
   remove it.
2. Write from pp.117-140 with companion JSON.

## Additional specifications

- **Files:** `content/services/environment/**`.
- **Owner office:** Cabanatuan City Environment and Natural Resources Office,
  2nd Floor, 0919 081 4509.

---

# Slice D5: Infrastructure and utilities

## Role

Content writer for Office of the City Engineer services and a utilities page.

## Context

`infrastructure-public-works/index.yaml` lists four starter pages, one of
which overlaps B1 (market stalls). Charter pp.143-145: road clearing,
drainage de-clogging, streetlight repair, right-of-way certification, program
of works for barangays. §1 utilities: electricity is CELCOR under RA 9968;
water is Cabanatuan City Water District in a joint venture with PrimeWater
since 2017. No official hotline for either was found.

## Tasks

1. Replace the starter entries with `report-damaged-roads-bridges-or-drainage`
   (keep slug; pp.143-145), `request-a-right-of-way-certification`,
   `request-a-program-of-works-for-your-barangay`, and
   `electricity-and-water-providers` naming CELCOR and the water district
   with their official websites only, no numbers.
2. Remove the cemetery and market stall entry from this category (markets are
   in B1).
3. Write from the cited pages with companion JSON.

## Additional specifications

- **Files:** `content/services/infrastructure-public-works/**`.
- **Owner office:** Office of the City Engineer, CEO Bldg., 0919 081 3694.
- **Open question carried:** 1 (utility hotlines).

---

# Slice D6: Livelihood and employment

## Role

Content writer for PESO and CLCDO services.

## Context

Charter: PESO job application and recruitment activities, 22 minutes,
pp.278-281; CLCDO skills training and cooperative registration pp.261-281.
PESO Bldg., City Hall Compound, 0919 081 1300; CLCDO Bldg., 0919 089 9875.
PESO's Facebook page is linked from the official site. The research note
offers `business/` or a new `employment-livelihood/` category; this spec
places these pages under `social-welfare/`, replacing the starter slug
`join-livelihood-or-skills-training-programs`, to avoid a new category.

## Tasks

1. Under `social-welfare/`, add `apply-for-a-job-through-peso` and keep
   `join-livelihood-or-skills-training-programs` rewritten from the CLCDO
   pages; add `register-a-cooperative`.
2. Link the PESO Facebook page as the live channel for job fairs.

## Additional specifications

- **Acceptance:** no job fair date or employer name on the pages.

---

# Slice D7: Privacy notice

## Role

Content editor; legal references only from the research note §6.

## Context

RA 10173 s.11 and s.16; NPC Circular 16-01 covers LGUs; DILG MC 2018-36 on
DPO designation. The site is static and should carry no trackers. The DPO's
name is open question 9.

## Tasks

1. Add a `/privacy` route or an About-page section stating what the site
   collects (nothing beyond standard hosting logs and `localStorage` for
   language preference), the legal basis, and a placeholder line "Data
   Protection Officer: to be confirmed by the City Government" that is not a
   bracketed placeholder (the checker would fail it).
2. Link it from the footer.

## Additional specifications

- **Acceptance:** `npm run check:placeholders` passes; no analytics script is
  present in `index.html`.

---

# Slice D8: Upstream hotlines contribution

## Role

Contributor to the external `bettergovph/hotlines` repository.

## Context

The `hotlines` PWA has 451 entries and none for Nueva Ecija (§5). It accepts
schema-validated JSON.

## Tasks

1. After A3 merges, submit the charter-verified Cabanatuan numbers (CDRRMO,
   CHO, MVG hospital, CSWDO, complaints line) following that repo's schema and
   contribution guide, citing the charter PDF.
2. Do not submit PNP or BFP numbers until verified.

## Additional specifications

- **Files:** none in this repo.

---

# Phase E: Blocked items (P2)

Each item below is specified only to the point where it is blocked.

## E1 Barangay directory enrichment

Add flood-risk flag, health centre mapping and evacuation centre to
`src/data/barangays.yaml`. **Blocked on** open question 8. Health centre
mapping (CHC 1 Mayapyap Sur, CHC 2 San Josef Norte, CHC 4 Mabini Homesite,
CHC 5 General Luna, CHC 6 Caalibangbangan, CHC 7 H. Concepcion) can proceed
now for those six barangays only.

## E2 Ilocano locale

Add `ilo` to `LanguageType` and `public/locales/ilo/`. **Blocked on** open
question 11 and on C4 landing first.

## E3 Online services link hub

A `/online-services` route linking the city's BPLS online form and any eLGU or
eGovPH presence. **Blocked on** open question 4. No backend is to be built in
this repo.

## E4 FOI request flow

Add "how to request information" to `/transparency` linking foi.gov.ph.
**Blocked on** confirming the city's FOI presence (open question 9). A request
form needs a backend and is out of scope.

## E5 Announcements mirror

Manual sync of `src/data/news.yaml` from the official channel. **Blocked on**
open question 12 (canonical Facebook page). Facebook embeds stay out per the
2026-09-26 spec.

## E6 AIP and budget dashboard

Static data visualisation modelled on `bettergovph/naga`. **Blocked on**
obtaining the city's Annual Investment Program file.

---

## Implementation sequence

1. A1, A3 in parallel; then A2.
2. B2 and C1 in parallel with B1, B3, B4, B5 (B1 and B5 cross-link; land B1
   first).
3. B6, B7, C2, C3.
4. C4 loader change, then translations as B pages stabilise.
5. D1 to D8 in any order; D2 after B1.
6. Phase E as blockers clear.

## Non-goals

- No new components or visual changes; `CategoryCard`, `CardGrid`,
  `StatusBadge` and `DocumentPage` cover every slice.
- No backend, forms, payments or appointment booking.
- No copying of city PDFs into the repo.
- No content from Facebook posts unless the post is the only official source
  and is cited with its URL and date.

## Success criteria

- The residue search in A1 returns nothing and A2 keeps it that way.
- Every service page has a Source section; every fee and time is a token.
- Every `index.yaml` slug has a Markdown file.
- `/government/departments` lists every office in the charter's List of
  Offices with its charter contact.
- `/hotlines` shows the charter's CDRRMO numbers and marks unverified entries.
- A Filipino reader can read the B2 pages in Filipino.
