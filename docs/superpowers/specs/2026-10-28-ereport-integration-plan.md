# eReport Integration: File a Report

**Date:** 2026-10-28

**Status:** Plan. Slice E1 can ship now. Slices E2 to E5 are blocked on
Slice E0 (partnership and API access).

**Feature name:** File a Report. User-facing label "File a report", with
"Powered by eReport, eGov PH" shown under the form.

**Scope:** A new `/report` flow that sends a resident's complaint to the
national eReport system (DICT), plus a status page at `/report/track`. It
also adds an eReport row to the complaints table on `/contact`.

**Source research:** eGov API Marketplace catalog review, 2026-10-28.
eReport spec: `https://platforms.e.gov.ph/api-catalogs/ereport`. The spec is a
Postman collection embedded in that page; there is no separate OpenAPI file.

## Purpose

eReport lets citizens submit a complaint, verify it by email OTP, and track
its status by case number. Better Cabanatuan already lists complaint channels
on `/contact#complaints` (the City Hall desk, Office of the City Mayor, ARTA,
PCC, CCB). This plan adds eReport as a channel that residents can file
through directly from the site, not just read about.

## Findings that shape the plan

1. **Access is gated.** The Terms say access is "intended for government
   agencies, accredited companies, and organizations with a legitimate
   integration need". An administrator "verifies your organization and the
   declared use case before any credentials are issued". Better Cabanatuan
   describes itself as volunteer-run and "not the official website of the
   {{city}} government" (`public/locales/en/common.json:507`). A partner
   organization therefore has to hold the credentials (Slice E0).
2. **Every call needs a secret.** `POST /api/integration/token` exchanges a
   pre-issued `access_code` for a bearer `access_token` with an `expires_at`
   about one day out. The site is a static Vite SPA with no backend, so every
   call has to go through Vercel serverless functions (Slice E2).
3. **Every call costs a credit.** The marketplace is "free to build on, within
   a per-service call allowance", and calls are rejected once the allowance
   runs out "until an administrator tops it up". The allowance size is not
   stated. Abuse protection is therefore a cost control, not optional.
4. **The site starts collecting personal data.** `submit_complaint` needs
   mobile, first and last name, gender, email and location codes. That
   contradicts the privacy page's "built to be read, not to collect", so the
   privacy page must change before launch (Slice E5).
5. **Tracking access is unclear.** The OTP confirm docs describe `email` as
   "the email address associated with the integration account". They also say
   the `report_view_token` "is issued per integration". If that token can
   read every report filed through the integration, it must never reach a
   browser, and citizen tracking would need a different design. Slice E4 is
   blocked until DICT answers this (question Q3).
6. **The report types are national.** The `report_types` dataset returns
   `crime`, `red_tape`, `scam`, `child_abuse`, `women_abuse`, `overpricing`,
   `fire`, `accident` and `gas_station_concerns`. Nothing in the spec says a
   Cabanatuan report reaches City Hall (question Q2). Several of these types
   are emergencies, so the form must send emergencies to hotlines first.

## Shared conventions (apply to every slice)

**Secrets stay server-side.** Use the env vars `EREPORT_BASE_URL` and
`EREPORT_ACCESS_CODE`. Never prefix them with `VITE_`, because Vite inlines
every `VITE_*` variable into the client bundle.

**Store nothing.** The proxy holds no database, writes no request bodies to
logs, and never `console.log`s personal fields. eReport is the system of
record.

**Content rules.** Every user-facing string goes in
`public/locales/{en,fil}/common.json`. Filipino strings get a human review.
Use the `src/components/ui/` primitives, and `Card` from `../ui/Card`.

**Verification baseline.** Each PR passes `npm run typecheck`,
`npm run lint`, `npm test` and `npm run check:contrast`. Any slice with UI
also passes `npm run test:e2e` and `npm run qa:shots`.

## Slice map

| Slice | Name                       | Branch                  | Blocked by | Effort |
| ----- | -------------------------- | ----------------------- | ---------- | ------ |
| E0    | Partnership and API access | (no code)               | nothing    | n/a    |
| E1    | eReport complaint channel  | `feat/ereport-channel`  | nothing    | S      |
| E2    | eReport server proxy       | `feat/ereport-proxy`    | E0         | M      |
| E3    | File a Report form         | `feat/ereport-form`     | E2         | M      |
| E4    | Track a Report             | `feat/ereport-tracking` | E2, Q3     | S–M    |
| E5    | Privacy and launch gate    | `feat/ereport-launch`   | E3         | S      |

---

# Slice E0: Partnership and API access

## Role

Project lead, working with the City Information Office or the Public
Assistance and Complaint Desk. No code.

## Context

Credentials are issued to an approved organization for a declared use case,
and the Terms forbid sharing them. Two routes would work. The city applies as
the organization and lists Better Cabanatuan volunteers as its developers. Or
an accredited partner applies and the city endorses it in writing.

## Tasks

1. Pitch the feature to the City Information Office, using E1 as the
   working demo. The ask: a signed letter or MOA naming the city as
   the integration owner and Better Cabanatuan as the developer.
2. Register on `platforms.e.gov.ph` (sign-in is through eGovPH SSO), complete
   the organization profile, and apply for eReport. Declared use case:
   "Citizen complaint intake for Cabanatuan City residents through
   bettercabanatuan.ph, proxied server-side, no data retained."
3. Get answers in writing from DICT to the open questions below.
4. Obtain sandbox credentials first, then production. Record the production
   `EREPORT_BASE_URL`.

## Open questions for DICT

- **Q1. Credits.** What is the per-service call allowance, and how is it topped
  up?
- **Q2. Routing.** When a report's `municipality_code` is Cabanatuan City,
  which office receives it? Can the City Government see reports for its own
  jurisdiction?
- **Q3. Tracking.** Is the OTP and `report_view_token` scoped to one
  complainant's email, or to the whole integration? Can a citizen safely hold
  their own view token?
- **Q4. Evidence.** Must `evidences` be public URLs that we host, or does
  eReport accept uploads?
- **Q5. Required fields.** Is `gender` required, and which values does it
  accept? Is `complainant_email` required?
- **Q6. Privacy roles.** Under RA 10173, is DICT the personal information
  controller and the integrator a processor? Is a data sharing agreement
  needed?

## Done when

Credentials are issued, Q1 to Q3 have written answers, and the city's
endorsement is on file.

---

# Slice E1: eReport complaint channel

## Role

One frontend contributor.

## Context

`src/pages/contact.tsx` renders `complaintChannels` as a table under
`#complaints`, with strings under `contact.complaints.channels.*` in the
locale files. This slice needs no credentials and gives residents a working
path right away.

## Tasks

1. Confirm that eReport is available to citizens in the eGovPH app or on the
   web, and record the exact public URL or app-store links. If it isn't
   available, stop the slice.
2. Add an `ereport` channel to `complaintChannels`, with `title`, `audience`
   (red tape, scams, overpricing, abuse, and the other national report types)
   and `reach` lines that link out.
3. Add the matching `contact.complaints.channels.ereport.*` keys in `en` and
   `fil`.
4. Add a source line for the row, citing the URL checked and the date.

## Verification

The baseline checks pass. Every link in the new row resolves. The table
still scrolls correctly at 320 px (`npm run qa:shots`).

---

# Slice E2: eReport server proxy

## Role

One contributor with Vercel project access.

## Context

`vercel.json` currently rewrites every path (`"/(.*)"`) to `/index.html`, and
there is no `api/` directory. Vercel builds TypeScript files in `api/` as
Node functions.

## Tasks

1. Narrow the SPA rewrite so it can't capture functions:
   `"source": "/((?!api/).*)"`. Confirm on a preview deployment that `/api/*`
   reaches the function.
2. Create `api/_lib/ereport.ts`:
   - `getToken()`: calls `POST /api/integration/token` with
     `EREPORT_ACCESS_CODE`, and caches the token in module scope until
     `expires_at` minus 5 minutes.
   - `ereportFetch(path, init)`: adds the bearer token. On a 401 it refreshes
     the token once and retries.
   - Maps upstream errors to `{ error: code }` without echoing upstream
     bodies, which may contain personal data.
3. Write the functions:

   | Function                          | Upstream                                    |
   | --------------------------------- | ------------------------------------------- |
   | `POST /api/ereport/submit`        | `POST /api/integration/submit_complaint`    |
   | `POST /api/ereport/otp/request`   | `POST /api/integration/verify/request`¹     |
   | `POST /api/ereport/otp/confirm`   | `POST /api/integration/verify/confirm`      |
   | `GET /api/ereport/reports/[case]` | `GET /api/integration/reports/:case_number` |

   ¹ Check the exact OTP request path against the spec; only `verify/confirm`
   was confirmed in the review.

4. **Validate on the server** with a schema. In `submit`:
   - Require `report_type` from the allowlist.
   - Force `region_code`, `province_code` and `municipality_code` to
     Cabanatuan's values; the client sends only `barangay_code`, checked
     against the imported list.
   - Normalise `mobile` from `09XXXXXXXXX` to `639XXXXXXXXX`.
   - Cap `subject` and `message` lengths.
   - Do not send `evidences` in v1 (see Q4).
5. **Abuse and credit control:**
   - Add a Vercel WAF rate-limit rule on `/api/ereport/*`, per IP.
   - Add a honeypot field and a minimum fill time in `submit`.
   - Accept only same-origin requests (check `Origin`).
6. **Build-time datasets.** Add `scripts/import-ereport-datasets.mjs` and
   `npm run import:ereport` to fetch `report_types` and the Cabanatuan
   `barangays` once, writing `src/data/ereport-datasets.json`. This matches
   `import:app` and `import:posts`, costs credits only when it's re-run, and
   keeps those dropdowns static.
   - Cabanatuan's municipality code is expected to be `034903000` (PSGC). Read
     the real value from the `municipalities` dataset for Nueva Ecija rather
     than hard-coding it.
   - Cross-check the barangay names against the existing
     `/government/barangays` data.
7. Make sure `tsc -b` and ESLint cover `api/`, either through a
   `tsconfig.api.json` reference or by adding `api/` to an existing project.
8. Document both env vars and `import:ereport` in `CLAUDE.md`.

## Verification

- Vitest unit tests for each function cover: valid input, rejected input,
  upstream 401 with retry, upstream 429 returned as `quota_exceeded`, and no
  personal fields in thrown errors. Mock `fetch`.
- A sandbox submit from the preview deployment returns a `case_number`.

---

# Slice E3: File a Report form

## Role

One frontend contributor.

## Context

The flow lives at a new `/report` route, declared in `src/App.tsx` before the
catch-all. React Router ranks the static path above `/:documentSlug`.

## Tasks

1. **Emergency gate first.** Before showing the form, add a short panel: "Is
   this happening now? Call 911", with the CDRRMO, BFP and PNP numbers from
   the existing hotlines data. Repeat it when `fire`, `accident` or `crime`
   is chosen. For `women_abuse` and `child_abuse`, show the relevant hotlines
   too.
2. Build the form from `src/data/ereport-datasets.json`:
   - Fields: report type, subject, message, barangay (with a searchable
     select), first name, last name, gender, mobile and email.
   - An optional map pin (Leaflet is already a dependency) sets `latitude` and
     `longitude`. Use browser geolocation only when the user clicks a button.
3. Add a required consent checkbox. Its text names DICT eReport as the
   recipient, links to the eReport privacy terms and to `/privacy#report`,
   and says the site keeps no copy.
4. Write the states:
   - submitting
   - success, showing the `case_number` with a copy button and a "Track this
     report" link
   - validation errors on each field
   - rate-limited
   - quota exhausted, falling back to the E1 link-out
5. Accessibility:
   - Every field has a visible label.
   - Errors are linked with `aria-describedby`.
   - Focus moves to the error summary on a failed submit.
   - The success message is in a live region.
   - Work through the checklist in `src/pages/accessibility.tsx`.
6. Link to `/report` from `/contact#complaints`, `/hotlines`, the header or
   footer navigation, and the sitemap (`npm run generate:sitemap`).

## Verification

- Playwright, with `page.route('**/api/ereport/**')` mocked, tests the happy
  path, a validation error, a 429, and that the emergency gate appears for
  `fire`.
- `npm run qa:shots` passes at every breakpoint.

---

# Slice E4: Track a Report

## Role

One frontend contributor.

## Context

This slice is blocked on Q3. Build it only if DICT confirms that the OTP and
view token are scoped to the complainant's own email.

## Tasks

1. At `/report/track`, the resident enters a case number and email, requests
   an OTP, and enters the code. The view token stays in memory only; there is
   no `localStorage` and no cookie.
2. Show the report's `status` with `StatusBadge`, and its `history[]` as a
   timeline. Show only fields the complainant already gave us.
3. If Q3 comes back "per integration", drop this slice. Instead, the success
   screen tells residents to track the report in the eGovPH app using their
   case number.

## Verification

Playwright tests with mocked OTP request, confirm and report responses,
including a wrong-OTP case and an expired-token case.

---

# Slice E5: Privacy and launch gate

## Role

The project lead approves; one contributor writes the copy.

## Tasks

1. Update `src/pages/privacy.tsx` and `privacy.*` locale keys:
   - Add a `#report` section listing what is collected, why, the recipient
     (DICT eReport), and that the site keeps none of it.
   - List the Vercel function as a processor and eReport as an outside
     service.
   - Reword the intro's "built to be read, not to collect" so it is still
     true for the rest of the site.
2. Have the city's or DICT's Data Protection Officer review the consent text,
   based on the Q6 answer.
3. Switch from sandbox to production credentials in Vercel's production
   environment only. Preview deployments keep using the sandbox.
4. Launch checklist:
   - Rate limits are active.
   - The quota fallback has been tested.
   - The emergency gate has been reviewed by CDRRMO, or at least checked
     against the hotlines page.
   - Filipino strings have been reviewed.

## Done when

The privacy page matches what the code does. The DPO review is recorded. A
production test report has been filed and then withdrawn with DICT's
knowledge.
