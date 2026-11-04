# Cabanatuan City Content Gaps

**Research memo for BetterCabanatuan.org**  
**Date:** 2026-10-21  
**Scope:** City content that is missing from the portal — heritage and tourism, festivals, transport, schools, food and markets, the city profile, barangay enrichment and disaster memory. Government service and portal gaps are deliberately excluded; they are covered by `docs/superpowers/specs/2026-10-11-cabanatuan-resident-needs-research.md`.

## Bottom line

The portal is a strong civic utility: 62 service guides, 56 department pages, 89 barangay pages, 14 projects, officials, news, transparency, statistics, hotlines, and the Pamasahe fare app. It is not yet a place to learn about Cabanatuan.

The biggest gaps, in order:

1. **Heritage and tourism** — no page for the historic cathedral and Plaza Lucero, the Cabanatuan American Memorial, the old provincial capitol and Freedom Park, Museong Lazaro Francisco, Ling Hong Temple, or the new Lakewood cathedral.
2. **Festivals and civic calendar** — no page explaining Longganisa, Banatu, Foundation Day, cityhood, or the September 10 fiesta.
3. **Getting to and around** — no page for CLLEX, the central terminal, buses and vans, jeep and tricycle guidance, or the fare app.
4. **Schools and universities** — no directory for NEUST, Wesleyan, Araullo, CIC, Good Samaritan, La Fortuna or DepEd.
5. **Food, markets and malls** — no longganisa guide, no public-market status page and no mall list.
6. **City profile and about-page corrections** — the about page is the only narrative and contains at least one clear date error and one outdated population claim.

Also worth doing: barangay-profile enrichment (the 89 pages currently hold population and classification only), a careful disaster-memory page for the 1990 earthquake, and lower-priority media, sports and day-trip content.

## 1. What the portal covers today

| Section              | What exists                                                     | What it does well                                 | What is missing                                                |
| -------------------- | --------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| Services             | 62 guides in 11 categories                                      | Step-by-step transactions, requirements, contacts | No "life in the city" content                                  |
| Government           | 56 department pages, officials, 89 barangays, 14 projects, news | Offices, mandates, contacts, project tracking     | Departments are org-chart content, not city content            |
| Statistics           | Population, land area, income class, barangay table             | Quick facts                                       | No narrative profile; some figures undated                     |
| About                | Long history plus fast facts                                    | The only city story                               | Errors and outdated claims; no visitor or new-resident framing |
| Transparency         | Legislation, flood control, projects                            | Accountability                                    | No cultural or heritage spending, no tourism plan              |
| Contact and hotlines | Emergency numbers, five hospitals, department contacts          | Safety-critical                                   | Hospital list is partial; no transport or visitor information  |
| Civic apps           | Pamasahe fare calculator                                        | Ties to a real resident need                      | No transport guide to link from                                |

The route list in `src/App.tsx` confirms there is no tourism, heritage, festival, transport, school, market, media or sports route. The homepage sections are hero, city stats, services, what's new, civic apps, government activity, Facebook and local conditions — again, no city-content layer.

Counts come from the repo on 2026-10-21: `src/data/services.yaml` (services and categories), `src/data/departments.yaml` (departments), `src/data/barangays.yaml` (barangays), `src/data/projects.yaml` (projects) and `src/data/hospitals.yaml` (hospitals). Live equivalents: [services](https://bettercabanatuan.org/services), [government](https://bettercabanatuan.org/government), [barangays](https://bettercabanatuan.org/government/barangays), [projects](https://bettercabanatuan.org/government/projects) and [contact](https://bettercabanatuan.org/contact).

## 2. Method and confidence labels

- Reviewed the live portal at [bettercabanatuan.org](https://bettercabanatuan.org) and the repo on 2026-10-21.
- Preferred primary and official sources: laws and proclamations, NHCP, ABMC, CDC, DPWH, school websites, city and provincial pages, and the city's project data.
- Used reputable secondary sources (Inquirer, PIA, SunStar, Daily Tribune, Manila Bulletin, Philstar) for context and dates.
- Used Wikipedia only as a lead, except where it compiles primary markers (such as the NHCP marker list); those claims are flagged.
- Labels:
  - **[Publish-ready]** — at least one strong source; safe to draft now.
  - **[Verify]** — plausible but conflicting or secondary; confirm with the named office or source before publishing.
  - **[Lead]** — interesting but not yet sourced; do not publish.
- Every factual entry below carries the source URL next to it. Repo paths in backticks identify claims about the portal itself; they are working paths, not public URLs. Where a site blocked automated access, the URL is still given and the claim is marked **[Verify]**.

## 3. The gaps

### 3.1 Heritage and tourism

**Why it matters.** Cabanatuan has national-level heritage: the cathedral where Antonio Luna was killed, a U.S. memorial to prisoners of war, the old provincial capitol, a National Artist's house museum and one of the country's oldest Buddhist temples. The portal has none of it. The city tourism office already publishes heritage content on [Facebook (`@cabctdpo`)](https://www.facebook.com/cabctdpo/), but that content is not on the website, not searchable and not organized as a visitable trail.

**What we can publish now.** The Source column links each row to the exact page(s) used; where a row draws on several pages, all are listed.

| Site                                                             | Verified facts                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Status                                                                                                   | Source (URL)                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Historic Cabanatuan Cathedral**                                | Founded in 1700 as a visita of Gapan. The first stone church and convent were built in 1866; destroyed by the July 18, 1880 earthquake; rebuilt in 1891; burned in 1934 and again on September 28, 1972; rebuilt by November 22, 1975. The convent served as the seat of the Philippine government in 1899, and Antonio Luna and Francisco Román were killed there on June 5, 1899. NHCP installed a "Capitals" marker on June 14, 2024. Address: Del Pilar Street, Barangay General Luna.  | Publish-ready for the history; **[Verify]** the marker date and address against NHCP                     | [Diocese history](https://www.dioceseofcabanatuan.net/about-us-page/history-of-the-diocese/) · [NHCP marker list](https://en.wikipedia.org/wiki/List_of_Philippine_Nationhood_Trail_historical_markers) · [marker photos](https://commons.wikimedia.org/wiki/Category:Katedral_ng_Cabanatuan_historical_marker) · [Inquirer](https://lifestyle.inquirer.net/254192/go-cabanatuan-hardly-know-place/) |
| **Plaza Lucero**                                                 | Public plaza in front of the historic cathedral; the Luna monument stands there; the plaza and cathedral are the traditional site associated with Luna's assassination.                                                                                                                                                                                                                                                                                                                     | Publish-ready for the plaza and monument; **[Verify]** the assassination details against a local history | [Inquirer](https://lifestyle.inquirer.net/254192/go-cabanatuan-hardly-know-place/) · [city tourism heritage video](https://www.facebook.com/cabctdpo/videos/cabanatuan-heritage-places/1230501478744008/) · [Wikipedia](https://en.wikipedia.org/wiki/Cabanatuan) (lead)                                                                                                                             |
| **New St. Nicholas of Tolentine Cathedral (Lakewood)**           | In Lakewood Subdivision, Barangay Sumacab Este; begun in 1999; capacity of about 3,000; described locally as the largest Catholic cathedral in Nueva Ecija.                                                                                                                                                                                                                                                                                                                                 | Publish-ready for location; **[Verify]** capacity and the "largest" claim                                | [Diocese history](https://www.dioceseofcabanatuan.net/about-us-page/history-of-the-diocese/) · [local tourism post](https://www.facebook.com/amazingnuevaecija2016/posts/1435376068392817/)                                                                                                                                                                                                          |
| **Cabanatuan American Memorial**                                 | At the site of Camp Pangatian, about 4.5 miles northeast of the city on the south side of the Nueva Ecija–Aurora Road, 85 miles north of Manila. Erected by survivors of the Bataan Death March and the POW camp; dedicated in 1982; ABMC took over operation and maintenance in 1989; honors those who died there, with almost 3,000 U.S. names inscribed on the wall; about 20,000 Allied servicemen and civilians were held there from 1942 to 1945. Open daily, 9 a.m. to 5 p.m.; free. | Publish-ready                                                                                            | [ABMC about](https://www.abmc.gov/cemeteries-memorials/about-cabanatuan-american-memorial/) · [ABMC history](https://www.abmc.gov/history/discover-the-history-of-cabanatuan-american-memorial/) · [ABMC visit](https://www.abmc.gov/plan/plan-your-visit-to-cabanatuan-american-memorial/) · [NPS brochure](https://npshistory.com/publications/battlefield/abmc/cabanatuan/brochure-e-1.pdf)       |
| **Camp Pangatian and the Great Raid**                            | On January 30, 1945, the U.S. 6th Ranger Battalion, Alamo Scouts and Filipino guerrillas liberated the camp. The city's history records 513 prisoners (486 Americans, 23 British, 3 Dutch, 1 Norwegian); U.S. Army accounts say "more than 500."                                                                                                                                                                                                                                            | Publish-ready with a note; **[Verify]** the exact count                                                  | `src/data/about.yaml` · [U.S. Army](https://www.usarpac.army.mil/Our-Story/Our-News/Article-Display/Article/4052352/us-and-philippines-commemorate-the-80th-anniversary-of-the-cabanatuan-raid) · [NPS brochure](https://npshistory.com/publications/battlefield/abmc/cabanatuan/brochure-e-1.pdf)                                                                                                   |
| **Old Nueva Ecija Provincial Capitol**                           | American colonial-era capitol on Burgos Avenue, designed by William E. Parsons and completed in 1912 at a cost of PHP 81,225. It still houses provincial offices.                                                                                                                                                                                                                                                                                                                           | Publish-ready for Parsons, 1912 and cost; **[Verify]** current tenant mix                                | [Provincial tourism post](https://www.facebook.com/tourismnuevaecija/posts/715927050567498/) · [Inquirer](https://lifestyle.inquirer.net/254192/go-cabanatuan-hardly-know-place/)                                                                                                                                                                                                                    |
| **Freedom Park**                                                 | Provincial park in front of the old capitol; monuments to local heroes; used for civic ceremonies.                                                                                                                                                                                                                                                                                                                                                                                          | Publish-ready as a public park; **[Verify]** size, monuments and current condition                       | [Wikipedia](https://en.wikipedia.org/wiki/Cabanatuan) (lead) · [provincial tourism page](https://www.facebook.com/tourismnuevaecija/)                                                                                                                                                                                                                                                                |
| **Museong Lazaro Francisco**                                     | Former residence of Lazaro Francisco, National Artist for Literature in 2009, on Rizal Street, Barangay Bonifacio; the house was built in 1960 and is now a museum.                                                                                                                                                                                                                                                                                                                         | Publish-ready; **[Verify]** opening hours and entrance fee                                               | [Inquirer 2017](https://opinion.inquirer.net/127384/lazaro-francisco-cabanatuans-treasure) · [Inquirer 2018](https://opinion.inquirer.net/114263/lazaro-francisco-cabanatuans-pride) · [LGU Museums Month post](https://www.facebook.com/lgucabanatuan/posts/1556373783200402/)                                                                                                                      |
| **Ling Hong Temple**                                             | Buddhist temple on General Luna Street; founded in 1938; described as one of the oldest Buddhist temples in the Philippines. The "second oldest" claim needs a primary source.                                                                                                                                                                                                                                                                                                              | **[Verify]** 1938 and "second oldest"; the location is publish-ready only after a site visit             | [Wikipedia](https://en.wikipedia.org/wiki/Cabanatuan) (lead) · [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Ling_Hong_Temple)                                                                                                                                                                                                                                                     |
| **1990 Luzon earthquake / Christian College of the Philippines** | The six-story school building, reported as Christian College of the Philippines, was the only building in Cabanatuan that collapsed; 363 casualties, 154 dead (42 percent), 274 trapped, mostly students.                                                                                                                                                                                                                                                                                   | Publish-ready for the CDC figures; **[Verify]** the school name with the school or CDRRMO                | [CDC MMWR](https://www.cdc.gov/mmwr/preview/mmwrhtml/00001734.htm)                                                                                                                                                                                                                                                                                                                                   |
| **Cabanatuan City Hall and Rizal Monument**                      | Civic landmark; the Rizal monument stands in front; used for official ceremonies and public gatherings.                                                                                                                                                                                                                                                                                                                                                                                     | Publish-ready for the City Hall; **[Verify]** the Rizal Monument details                                 | [Wikipedia](https://en.wikipedia.org/wiki/Cabanatuan) (lead) · [city website](https://www.cabanatuancity.gov.ph/)                                                                                                                                                                                                                                                                                    |

**Suggested page.** `/discover/heritage` — a map-led trail with:

- A short introduction: the city's heritage is concentrated in the poblacion and along the Nueva Ecija–Aurora Road.
- Cards for each site: what it is, why it matters, address, hours or contact (or "call ahead"), accessibility, and a "last verified" date.
- A walking and driving route: Cathedral → Plaza Lucero → Old Capitol and Freedom Park → Museong Lazaro Francisco → (drive) American Memorial → (drive) Lakewood cathedral.
- A "before you visit" box: the historic cathedral is an active parish; the memorial is a sacred site; hours change; some sites require appointments.
- Links to the city tourism office and the province's tourism page.

**What to verify before publishing.**

- Hours and contacts for the historic cathedral, the new cathedral, Museong Lazaro Francisco and the old capitol.
- Whether **Museo Novo Ecijano** is in the old capitol in Cabanatuan or in the Palayan capitol complex. The [province's tourism page](https://www.nuevaecija.ph/tourism/) lists the museum but does not give a location; other sources conflict. Do not publish until the province confirms.
- Whether the historic cathedral or the Lakewood cathedral is the current ecclesiastical seat. The Diocese's own history should settle it.
- The "second oldest Buddhist temple" claim.
- The exact Great Raid count (513 versus 511 versus "more than 500").
- The Manuel V. Gallego Center for Heritage Studies, inaugurated on January 28, 2026 — confirm whether it is open to the public and whether it has exhibits.
- Photo permissions. Do not reuse Facebook images without written permission.

### 3.2 Festivals and civic calendar

**Why it matters.** The city's festival names and dates are confusing even to locals: Foundation Day, Cityhood Day, Longganisa Festival, Banatu Festival and the September 10 fiesta are different things. A single calendar page would help residents, vendors, students and visitors.

**What we can publish now.**

- **Longganisa Festival** — began in 2008 and celebrates Cabanatuan longganisa. The first edition was tied to the city's 58th Foundation Day on February 1, 2008. **[Publish-ready for the 2008 proclamation; Verify the "first edition" wording against the proclamation text]** Source: [Proclamation No. 1451, s. 2008 (PDF)](https://lawphil.net/executive/proc/proc2008/pdf/proc_1451_2008.pdf) · [LDR record](https://ldr.senate.gov.ph/executive-issuance/proclamation-no-1451-s-2008).
- **Banatu Festival** — launched in 2015 and named after the banatu vine in the city's origin story. It highlights the city's founding anniversary. The 2026 edition marked the 76th founding anniversary; the 2025 festival season ran from January 19 to March 15. **[Publish-ready for the launch year; Verify the 2026 anniversary detail and exact annual dates]** Sources: [SunStar 2025](https://www.sunstar.com.ph/pampanga/banatu-festival-to-highlightcabanatuans-75th-anniversary) · [PIA 2026](https://pia.gov.ph/news/banatu-festival-2026-spotlights-longganisa-as-cabanatuans-signature-product/) · [Daily Tribune 2026](https://tribune.net.ph/2026/02/15/solane-backs-cabanatuan-longganisa-festival).
- **Foundation Day** — February 1 per Proclamation 1451, which calls February 1, 2008 the 58th Foundation Day. **[Publish-ready for the proclamation; Verify the date the city wants used going forward]** Source: [Proclamation No. 1451, s. 2008 (PDF)](https://lawphil.net/executive/proc/proc2008/pdf/proc_1451_2008.pdf).
- **Cityhood** — Republic Act No. 526 was approved on June 16, 1950; the city began functioning on July 14, 1950; the official inauguration was on February 3, 1951. **[Publish-ready for June 16; Verify July 14 and February 3 against the charter and city history]** Sources: [RA 526 (LDR)](https://ldr.senate.gov.ph/subject/charter-of-the-city-of-cabanatuan) · [RA 526 text (Lawyerly)](https://lawyerly.ph/laws/view/l300b) · `src/data/about.yaml`.
- **City fiesta** — September 10, the feast of St. Nicholas of Tolentine, principal patron of the Diocese of Cabanatuan; fiesta masses are held at the cathedral. **[Publish-ready for the date; Verify the annual schedule]** Sources: [Manila Bulletin](https://mb.com.ph/article/299383/Philippines/feast-of-st-nicholas-of-tolentino-on-sept-10) · [Diocese history](https://www.dioceseofcabanatuan.net/about-us-page/history-of-the-diocese/).

**Suggested page.** `/discover/festivals` — a 12-month calendar with:

- Fixed civic dates: February 1 Foundation Day, June 16 Cityhood, September 10 fiesta.
- Festival windows: Longganisa and Banatu, usually January to March; confirm each year.
- "What happens" and "what to expect" sections: street closures, crowds, vendor zones.
- A short history of each name, with the 2008 and 2015 dates.
- A "for vendors and participants" box linking to the city's permits page.
- An "official schedule" link to the city tourism office. Never publish guessed dates.

**What to verify.**

- The official 2027 festival dates and whether Banatu and Longganisa are one season or two separate events.
- Whether Foundation Day is February 1 or another date. The proclamation, charter and inauguration dates do not line up.
- The fiesta schedule and whether the city government treats it as a citywide holiday.

### 3.3 Getting to and around Cabanatuan

**Why it matters.** CLLEX changed the trip from Tarlac and Manila; the central terminal is the arrival point for many residents; tricycles are the default last-mile mode; and the Pamasahe app already computes fares. The portal has no page that connects these.

**What we can publish now.**

- **CLLEX Phase 1** — a 30.7-kilometre, four-lane expressway from Tarlac to Cabanatuan with five interchanges. Contract Package 4, the Aliaga–Cabanatuan section of 10.3 kilometres, opened on March 31, 2026. It is toll-free until December 2026 and carries about 11,500 motorists daily. The expressway cuts the Tarlac–Cabanatuan trip to about 20 minutes from up to 1 hour 30 minutes. **[Publish-ready]** Sources: [DPWH project page](https://www.dpwh.gov.ph/dpwh/PPP/projs/CLLEx_phase1) · [Inquirer, March 2026](https://newsinfo.inquirer.net/2204217/marcos-on-opening-of-cllex-in-nueva-ecija-it-will-be-toll-free-until-december) · [Philstar, April 1, 2026](https://www.philstar.com/nation/2026/04/01/2518197/new-cllex-segment-opened-motorists).
- **Cabanatuan City Central Transport Terminal** — the major bus and van hub. It is in Barangay D.S. Garcia according to some sources, and in the Barrera District according to others; the phone number is +63 917 557 8648. **[Verify location and current tenants]** Sources: [commutetour terminal page](https://ph.commutetour.com/ph/terminal/cabanatuan/) · [Apple Maps pin](https://maps.apple.com/place?place-id=I507AF40842E568DC) · [terminal Facebook post](https://www.facebook.com/100065119105952/posts/1322292379951386/).
- **Bus and van routes** — Metro Manila, Baguio and nearby provinces. Companies include Five Star, Genesis, Baliwag, Victory Liner and Solid North. Schedules and terminals change, so publish these only as examples with a "confirm at the terminal" note. **[Verify]** Source: [commutetour route list](https://ph.commutetour.com/ph/terminal/cabanatuan/).
- **Tricycle capital** — the city is popularly called the "Tricycle Capital of the Philippines." A 2009 source counted about 30,000 registered tricycles. **[Publish-ready as a nickname; Verify the current count with LTO or the City Transport Management Office]** Sources: [Wikipedia](https://en.wikipedia.org/wiki/Cabanatuan) (lead) · [League of Cities profile](https://lcp.org.ph/92/cabanatuan-city) · [2009 research paper (PDF)](https://www.researchpublish.com/upload/book/Cabanatuan%20City-3270.pdf).
- **Fares** — link to [pamasahe.bettercabanatuan.org](https://pamasahe.bettercabanatuan.org) for jeep and tricycle fare estimates. Do not duplicate fare math on the portal. **[Publish-ready]**

**Suggested page.** `/discover/getting-around` — sections for:

- "By expressway": CLLEX, exits, toll status and travel times.
- "By bus or van": terminal, sample routes and what to expect.
- "Around the city": jeep, tricycle, ride-hailing and walking; fare app link.
- "Accessibility": terminal facilities, hospital access and emergency numbers.
- A "check before you go" box, because schedules and terminals change.

**What to verify.**

- The terminal's exact barangay and which companies still operate there.
- Whether CLLEX remains toll-free after December 2026.
- The current tricycle count and any city regulation on fares.
- Jeep routes and TODAs. The fare app's data is the best starting point; link rather than copy.

### 3.4 Schools and universities

**Why it matters.** Cabanatuan is a regional education hub. The portal explains how to apply for scholarships but not where the schools are. A verified directory helps parents, students and new residents.

**What we can publish now.**

| Institution                                                  | Verified facts                                                                                                                                                                                                                                                                                    | Status                                                                                   | Source (URL)                                                                                                                                                                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nueva Ecija University of Science and Technology (NEUST)** | Main campus on General Tinio Street, Barangay Quezon District. Started in June 1908 as a vocational course at the Wright Institute in San Isidro; transferred to Cabanatuan in 1931; became a university in 1998 under Republic Act No. 8612.                                                     | Publish-ready for the history; **[Verify]** the campus address and current phone         | [NEUST history](https://neust.edu.ph/historical-background/) · [NEUST official site](https://neust.edu.ph/) · [RA 8612](https://lawphil.net/statutes/repacts/ra1998/ra_8612_1998.html)                         |
| **Wesleyan University-Philippines**                          | Mabini Extension, Cabanatuan. Founded in 1946 by Methodist leaders; now a university.                                                                                                                                                                                                             | Publish-ready for the history; **[Verify]** the campus address and current official name | [Wesleyan history](https://www.wesleyan.edu.ph/history/) · [Wesleyan official site](https://www.wesleyan.edu.ph/)                                                                                              |
| **PHINMA Araullo University**                                | Main campus on Maharlika Highway, Barangay Bitas. Established in 1950. Phone: (044) 464-3399.                                                                                                                                                                                                     | Publish-ready for the history; **[Verify]** the phone and exact campus address           | [PHINMA Araullo official site](https://au.phinma.edu.ph/)                                                                                                                                                      |
| **College of the Immaculate Conception (CIC)**               | Catholic college founded in 1926 as San Nicolas Catholic School; renamed Cabanatuan Institute in 1936; became a college in 1962. The original campus was beside the historic cathedral; the current campus is on a five-hectare lot along Maharlika Highway, adjacent to Maria Assumpta Seminary. | Publish-ready for the history; **[Verify]** the exact street address                     | [CIC history](https://www.cic.edu.ph/history) · [CIC official site](https://www.cic.edu.ph/) · [Wikipedia](<https://en.wikipedia.org/wiki/College_of_the_Immaculate_Conception_(Cabanatuan)>) (lead)           |
| **Good Samaritan Colleges**                                  | Private college on Burgos Avenue; offers basic, undergraduate and graduate programs.                                                                                                                                                                                                              | **[Verify]** the current program list, exact address and which website is canonical      | [Good Samaritan official site](https://goodsamaritancolleges.squarespace.com/) · [Good Samaritan Facebook](https://www.facebook.com/goodsamcabanatuan/) · [goodsam.edu.ph](https://www.goodsam.edu.ph/)        |
| **La Fortuna College**                                       | Private college established in 1995 in Barangay Daan Sarile.                                                                                                                                                                                                                                      | Publish-ready for 1995 and location; **[Verify]** current programs                       | [LinkedIn](https://www.linkedin.com/company/la-fortuna-college) · [Facebook](https://www.facebook.com/lafortunacollegephil/) · [Scholaro](https://www.scholaro.com/u/La-Fortuna-College-Cabanatuan-City-19327) |
| **DepEd Division of Cabanatuan City**                        | Maharlika Highway. Phone: 044-456-9919.                                                                                                                                                                                                                                                           | Publish-ready; **[Verify]** the phone against the official contact page                  | [DepEd Cabanatuan](https://region3.deped.gov.ph/cabanatuan/) · [DepEd Cabanatuan history](https://region3.deped.gov.ph/cabanatuan/about-us/history/)                                                           |

**Suggested page.** `/discover/schools` — a directory with:

- Level (basic, tertiary, technical-vocational), address, contact, website and program areas.
- A "not exhaustive" note and a link to CHED, DepEd and TESDA official lists.
- A "for incoming students" box: requirements, scholarships and the city's education services.
- No rankings and no endorsements.

**What to verify.**

- The about page's line "three universities, eleven colleges and fourteen vocational schools" is undated. Replace it with a dated count from CHED, DepEd or TESDA, or drop it.
- CIC, Good Samaritan and La Fortuna addresses and programs.
- Whether "Wesleyan University-Philippines" is still the current official name.

### 3.5 Food, markets and malls

**Why it matters.** Longganisa is the city's signature product; the public market burned in 2020 and is being rebuilt; residents need to know where vendors moved; visitors need a simple "what to eat and where to buy it" guide.

**What we can publish now.**

- **Cabanatuan longganisa (batutay)** — a beef sausage, also called batutay, bototay or batotay. It is commonly sold in sweet, garlicky and skinless styles and is celebrated in the Longganisa Festival. **[Publish-ready]** Sources: [Wikipedia](https://en.wikipedia.org/wiki/Cabanatuan_longganisa) (lead) · [PIA 2026](https://pia.gov.ph/news/banatu-festival-2026-spotlights-longganisa-as-cabanatuans-signature-product/) · [Daily Tribune 2026](https://tribune.net.ph/2026/02/15/solane-backs-cabanatuan-longganisa-festival).
- **Public market fire** — on April 1, 2020, the old public market was destroyed. Vendors moved to temporary markets at Kapitan Pepe and Sangitan. **[Publish-ready for the fire; Verify current temporary-market operations]** Sources: [Punto! Central Luzon](https://punto.com.ph/cabanatuan-public-market-nasunog/) · [Inquirer](https://newsinfo.inquirer.net/1252224/cabanatuan-supermarket-destroyed-by-fire).
- **New Sangitan Public Market** — under construction in Barangay Sangitan; PHP 650 million; target completion December 2026; vendor stalls, government offices, parking and sanitation. Some local posts call it the "Magsaysay Public Market"; no stable official URL for that name was retained, so treat it as a **[Lead]**. **[Publish-ready from the city project data; Verify the official name and opening status]** Sources: `src/data/projects.yaml` · [project page](https://bettercabanatuan.org/government/projects/sangitan-public-market) · [city website](https://www.cabanatuancity.gov.ph/).
- **SM City Cabanatuan** — Barangay Hermogenes Concepcion; about 154,000 square metres of gross floor area; one of the city's largest malls. **[Publish-ready for location; Verify the floor area with SM]** Sources: [SM Supermalls](https://www.smsupermalls.com/mall-directory/sm-city-cabanatuan/information) · [Wikipedia](https://en.wikipedia.org/wiki/SM_City_Cabanatuan) (lead for floor area).
- **Robinsons Cabanatuan and NE Pacific Mall** — Maharlika Highway; about 18,000 square metres, 100 shops and 500-plus parking spaces shared with NE Pacific Mall. **[Publish-ready for the complex; Verify current tenants and hours]** Sources: [Wikipedia, Robinsons Cabanatuan](https://en.wikipedia.org/wiki/Robinsons_Cabanatuan) (lead) · [Wikipedia, NE Pacific Mall](https://en.wikipedia.org/wiki/NE_Pacific_Mall) (lead) · [NE Pacific official Facebook](https://www.facebook.com/nepacificofficial/).
- **Robinsons Townville Cabanatuan** — community mall along Maharlika Highway, Barangay H. Concepcion. **[Verify current status and tenants]** Sources: [Occupi](https://getoccupi.com/malls/robinsons-townville-cabanatuan) · [Robinsons Townville malls](https://robinsonstownvillemalls.com/our-malls).
- **SM Megacenter Cabanatuan** — smaller-format SM mall. **[Verify current tenants and hours]** Sources: [SM Supermalls](https://www.smsupermalls.com/mall-directory/sm-megacenter-cabanatuan/information) · [Wikipedia, SM City Cabanatuan](https://en.wikipedia.org/wiki/SM_City_Cabanatuan).

**Suggested page.** `/discover/food-and-markets` — sections for:

- "What to eat": longganisa styles, where to buy and how it is served.
- "Public markets": status, temporary locations, what is sold and vendor tips.
- "Malls and supermarkets": address, hours and anchor stores.
- "Food businesses": optional, and only with permission and verified details.
- A "market day" note: many vendors close early; bring cash; parking is limited.

**What to verify.**

- Whether the new market is open, partially open or still under construction. The project page says December 2026.
- The official name: Sangitan Public Market or Magsaysay Public Market.
- Temporary market locations and hours.
- Mall hours and which Robinsons brand is which (Robinsons Cabanatuan versus Robinsons Townville).

### 3.6 City profile and about-page corrections

**Why it matters.** The about page is the only narrative about the city, and it is the page most likely to be quoted. It has a clear date error and an outdated population claim; a concise, corrected city profile would serve residents and visitors better.

**What we can publish now.**

- **2024 population:** 343,672 (PSA POPCEN 2024); 89 barangays. Sources: [PSA 2024 census](https://psa.gov.ph/content/2024-census-population-popcen-population-counts-declared-official-president) · `src/data/city-data.json`.
- **Land area:** 192.29 square kilometres in the existing city data. The competing 282.75 square kilometre figure is flagged in the resident-needs research. Sources: `src/data/city-data.json` · [PhilAtlas](https://www.philatlas.com/luzon/r03/nueva-ecija/cabanatuan.html) · `docs/superpowers/specs/2026-10-11-cabanatuan-resident-needs-research.md`.
- **Class:** first-class component city; PSGC 0304903000. Sources: [PSA PSGC](https://psa.gov.ph/classification/psgc/barangays/0304903000) · `src/data/city-data.json`.
- **Role:** the largest city in Nueva Ecija by population; part of the "Rice Granary"; an economic and education hub. It is not the provincial capital; Palayan has been the capital since 1965 under Republic Act No. 4475. Sources: [PSA province page](https://psa.gov.ph/classification/psgc/citimuni/0304900000) · [RA 4475](https://lawphil.net/statutes/repacts/ra1965/ra_4475_1965.html) · [city website](https://www.cabanatuancity.gov.ph/).
- **Nicknames:** "Tricycle Capital of the Philippines" and "Gateway to the North." Sources: [Wikipedia](https://en.wikipedia.org/wiki/Cabanatuan) (lead) · [League of Cities profile](https://lcp.org.ph/92/cabanatuan-city) · [2009 research paper (PDF)](https://www.researchpublish.com/upload/book/Cabanatuan%20City-3270.pdf).
- **Geography:** Central Luzon plain, near the Pampanga River; a dense urban core surrounded by rural barangays. Sources: [Wikipedia](https://en.wikipedia.org/wiki/Cabanatuan) (lead) · [city website](https://www.cabanatuancity.gov.ph/).

**Corrections to make now in `src/data/about.yaml`.**

| Current text                                                          | Problem                                                                                                      | Fix                                                                                                | Confidence | Source (URL)                                                                                                                                                                                                                                                                                       |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Cabanatuan, on May 9, 1896, as its temporary seat of government"     | The First Philippine Republic was proclaimed in 1899; Cabanatuan was the temporary capital from May 9, 1899. | Change 1896 to 1899.                                                                               | High       | `src/data/about.yaml` · [NHCP, The First Philippine Republic](https://nhcp.gov.ph/the-first-philippine-republic/) · [Diocese history](https://www.dioceseofcabanatuan.net/about-us-page/history-of-the-diocese/)                                                                                   |
| "more than two hundred thousand inhabitants"                          | The 2024 population is 343,672.                                                                              | "more than 340,000 residents (2024 census)" or update to the current PSA figure.                   | High       | `src/data/about.yaml` · [PSA 2024 census](https://psa.gov.ph/content/2024-census-population-popcen-population-counts-declared-official-president) · `src/data/city-data.json`                                                                                                                      |
| "rescued 513 prisoners"                                               | U.S. Army accounts say "more than 500"; the city's own count is 513.                                         | Keep 513 but attribute it: "the city's history records 513; U.S. Army accounts say more than 500." | Medium     | `src/data/about.yaml` · [U.S. Army](https://www.usarpac.army.mil/Our-Story/Our-News/Article-Display/Article/4052352/us-and-philippines-commemorate-the-80th-anniversary-of-the-cabanatuan-raid) · [NPS brochure](https://npshistory.com/publications/battlefield/abmc/cabanatuan/brochure-e-1.pdf) |
| "June 4, 1980 infamous raid and burning of the City Hall"             | The date was not independently verified in this pass.                                                        | Verify with the city historian or contemporary news; if unverified, say "1980."                    | Low        | `src/data/about.yaml` only; no independent source found in this pass.                                                                                                                                                                                                                              |
| "extension of the Manila Railroad line in Cabanatuan in 1904"         | The date was not independently verified.                                                                     | Verify with Philippine National Railways history or a local history source.                        | Low        | `src/data/about.yaml` only; no independent source found in this pass.                                                                                                                                                                                                                              |
| "three universities, eleven colleges and fourteen vocational schools" | Undated and likely outdated.                                                                                 | Replace with a dated CHED, DepEd or TESDA count, or remove.                                        | Medium     | `src/data/about.yaml`; no dated source attached.                                                                                                                                                                                                                                                   |

**Suggested page.** `/discover/city-profile` — a one-screen narrative:

- "Cabanatuan at a glance": population, barangays, land area, class and role.
- "Where it is": map, Pampanga River, CLLEX and neighbouring towns.
- "What it is known for": rice, longganisa, tricycles and heritage.
- "A short history": 1777 pueblo, 1950 city, today; link to the full about page.
- "Common misconceptions": not the provincial capital; the old cathedral versus the new one.

**What to verify.**

- The 1777 founding date versus other accounts (some sources say 1750 or 1780). The city's own history says July 14, 1777; use that and note the discrepancy only if necessary. [Wikipedia](https://en.wikipedia.org/wiki/Cabanatuan) gives both 1750 and 1780 in different places, which is exactly why it is a lead, not a source.
- The 1904 railroad date and the 1980 City Hall raid date.
- The land-area figure.

### 3.7 Barangay profile enrichment

**Why it matters.** The [89 barangay pages](https://bettercabanatuan.org/government/barangays) are among the most useful URLs on the site, but each currently carries little more than a generated population and classification description. Residents want to know where the barangay hall is, which school and health centre serve them, and whether their area floods.

**What exists.** `src/data/barangays.yaml` holds the name, slug, classification, population and description; `src/data/barangays-data.json` holds the underlying population series. The live index is at [bettercabanatuan.org/government/barangays](https://bettercabanatuan.org/government/barangays).

**What to add (template).**

- Barangay hall address and contact, if available.
- Landmarks: church, school, market, covered court, terminal.
- Schools and health-centre assignment.
- Flood susceptibility and hazard notes from CDRRMO maps.
- Public transport notes: jeep and tricycle routes.
- A map pin.
- A "last verified" date and a "report an error" link.

**Approach.** Do not try to fill all 89 at once. Start with the most populous and most visited barangays, such as Kapitan Pepe, Sangitan, San Josef, Bitas, H. Concepcion and General Luna, and publish a template. Source data from the [city website](https://www.cabanatuancity.gov.ph/), [DepEd Cabanatuan](https://region3.deped.gov.ph/cabanatuan/), the [City Health Office](https://bettercabanatuan.org/government/departments/cho), [CDRRMO](https://bettercabanatuan.org/government/departments/cdrrmo) and the barangay itself. Mark every field that is not officially confirmed.

**Priority:** medium-high; high effort; do it as a program, not a single page.

### 3.8 Disaster memory and resilience

**Why it matters.** The 1990 earthquake is a defining event in Cabanatuan's recent history, and the city's preparedness pages do not mention it. A careful, sourced memory page can build trust and make preparedness concrete.

**What we can publish now.**

- On July 16, 1990, the six-story school building reported as Christian College of the Philippines collapsed in Cabanatuan. The CDC reported 363 casualties, 154 dead (42 percent) and 274 trapped, mostly students. Source: [CDC MMWR](https://www.cdc.gov/mmwr/preview/mmwrhtml/00001734.htm).
- The city's 1980 City Hall raid and fire and the 1945 liberation are already in the about page; link to them rather than repeat them. Source: `src/data/about.yaml` (city history, unverified dates).
- Flood history: the portal already has [flood-control transparency data](https://bettercabanatuan.org/transparency/flood-controls); link to it.

**Suggested page.** `/discover/disaster-memory` or a section within heritage:

- "What happened": a sourced timeline.
- "What changed": building codes, preparedness and [CDRRMO](https://bettercabanatuan.org/government/departments/cdrrmo).
- "What to do now": links to the portal's [disaster-preparedness guides](https://bettercabanatuan.org/services/disaster-preparedness), [hotlines](https://bettercabanatuan.org/hotlines) and evacuation information.
- Oral histories only with consent; no victim names without family permission.

**Priority:** medium; high sensitivity; coordinate with CDRRMO and the schools.

### 3.9 Lower-priority gaps

- **Local media** — DWNE 900 AM, NETV 48 and Punto! Central Luzon are possible entries. **[Verify]** current frequencies and programs. A small "local media" page would help residents find news, but it is not urgent. Sources: [DWNE](https://en.wikipedia.org/wiki/DWNE) (lead) · [NETV 48 Facebook](https://www.facebook.com/ne.tv48/) · [Punto! Central Luzon](https://punto.com.ph/).
- **Sports and recreation** — Lakewood Golf & Country Club (private; verify public access), city sports facilities and parks. **[Verify]**. Sources: [GolfPH](https://golfph.com/golf-courses/lakewood-golf-and-country-club/) · [Lakewood Facebook](https://www.facebook.com/p/Lakewood-Golf-and-Country-Club-100063726925870/).
- **Day trips** — Minalungao National Park in General Tinio, Pantabangan Dam and other provincial sites are promoted on [nuevaecija.ph](https://www.nuevaecija.ph/tourism/). A "Beyond Cabanatuan" page would help visitors, but it is outside the city-content scope; do it only if the site wants a regional tourism role. Source: [Minalungao National Park](https://www.nuevaecija.ph/destinations/minalungao-national-park/).
- **Visitor essentials** — ZIP 3100, area code 044, emergency hotlines, hospitals, terminal and accessibility. Most of these exist in fragments; a single "Visit Cabanatuan" landing page could tie them together once the heritage, festival and transport pages exist. Sources: [PhilAtlas](https://www.philatlas.com/luzon/r03/nueva-ecija/cabanatuan.html) · [Wikipedia](https://en.wikipedia.org/wiki/Cabanatuan) (lead for ZIP and area code) · [hotlines](https://bettercabanatuan.org/hotlines) · [contact and hospitals](https://bettercabanatuan.org/contact).

## 4. Priority matrix

| Opportunity                 | Resident value | Visitor value | Effort     | Source confidence | Recommendation                       |
| --------------------------- | -------------- | ------------- | ---------- | ----------------- | ------------------------------------ |
| Fix about-page errors       | High           | Medium        | Low        | High              | **Do now**                           |
| Heritage trail              | High           | High          | Medium     | High              | **Do first**                         |
| Festivals calendar          | High           | High          | Low-medium | Medium            | **Do first**, before the next season |
| Getting around              | High           | Medium        | Medium     | High              | **Do first**                         |
| Schools directory           | High           | Low           | Medium     | High              | **Do second**                        |
| Food and markets            | Medium         | High          | Medium     | Medium            | **Do second**                        |
| Barangay enrichment         | High           | Low           | High       | Medium            | **Program**                          |
| Disaster memory             | Medium         | Medium        | Medium     | High              | **Do with care**                     |
| Media, sports and day trips | Low            | Low           | Low        | Low               | **Later**                            |

## 5. Suggested information architecture

**Option A (recommended): add a "Discover" top-level navigation item.**

- `/discover` — landing page
- `/discover/heritage`
- `/discover/festivals`
- `/discover/food-and-markets`
- `/discover/getting-around`
- `/discover/schools`
- `/discover/city-profile`
- `/discover/visitor-essentials`

**Option B (if navigation space is tight): fold "Discover" into "About."**

- Keep `/about` as the history page and add sub-sections for heritage, festivals and the city profile.
- Keep transport and schools under "Services" or a new "Community" menu.

**Implementation notes.**

- Use the existing YAML and Markdown content pattern; add the routes and sitemap entries.
- Add SEO metadata per page: a unique title and description, an Open Graph image, and `TouristAttraction`, `Museum`, `Event` or `CollegeOrUniversity` JSON-LD where accurate.
- Add a "last verified" date and a "report an error" link to every factual card.
- Use the existing image handling and compressed local assets. Do not hotlink Facebook images.
- Keep the tone civic, not promotional: "Here is what is here and how to visit it," not "Come to Cabanatuan!"
- Add a feedback path to the city tourism office so corrections flow back.

## 6. Fact-check list for existing content

| Page                | Claim                                                                 | Issue                                          | Action                                         | Source (URL)                                                                                                                                                                                    |
| ------------------- | --------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| About               | "May 9, 1896" temporary seat                                          | Wrong year; should be 1899                     | Fix now                                        | `src/data/about.yaml` · [NHCP](https://nhcp.gov.ph/the-first-philippine-republic/) · [Diocese history](https://www.dioceseofcabanatuan.net/about-us-page/history-of-the-diocese/)               |
| About               | "more than two hundred thousand inhabitants"                          | Outdated; 2024 population is 343,672           | Fix now                                        | `src/data/about.yaml` · [PSA 2024 census](https://psa.gov.ph/content/2024-census-population-popcen-population-counts-declared-official-president)                                               |
| About               | "rescued 513 prisoners"                                               | Conflicts with "more than 500" in U.S. sources | Attribute or verify                            | `src/data/about.yaml` · [U.S. Army](https://www.usarpac.army.mil/Our-Story/Our-News/Article-Display/Article/4052352/us-and-philippines-commemorate-the-80th-anniversary-of-the-cabanatuan-raid) |
| About               | "June 4, 1980" City Hall raid                                         | Unverified date                                | Verify                                         | `src/data/about.yaml` only; no independent source found in this pass                                                                                                                            |
| About               | "Manila Railroad line in 1904"                                        | Unverified date                                | Verify                                         | `src/data/about.yaml` only; no independent source found in this pass                                                                                                                            |
| About               | "three universities, eleven colleges and fourteen vocational schools" | Undated                                        | Replace with a dated count                     | `src/data/about.yaml`; no dated source attached                                                                                                                                                 |
| About               | 1777 founding date                                                    | Other sources give 1750 or 1780                | Keep the city history and note if needed       | `src/data/about.yaml` · [Wikipedia](https://en.wikipedia.org/wiki/Cabanatuan) (lead; article gives 1750 and 1780 in different places)                                                           |
| Statistics          | Land area 192.29 square kilometres                                    | Competing 282.75 square kilometre figure       | Cross-reference the resident-needs research    | `src/data/city-data.json` · [PhilAtlas](https://www.philatlas.com/luzon/r03/nueva-ecija/cabanatuan.html) · `docs/superpowers/specs/2026-10-11-cabanatuan-resident-needs-research.md`            |
| Hospitals           | Five entries; only MV Gallego is verified to the charter              | Partial list                                   | Verify each; add PJGMRMC and private hospitals | `src/data/hospitals.yaml` · [contact and hospitals](https://bettercabanatuan.org/contact)                                                                                                       |
| Tourism office page | Only data requests and equipment                                      | No attractions content                         | Link to the new Discover pages                 | `content/government/departments/tourism.md` · [live page](https://bettercabanatuan.org/government/departments/tourism)                                                                          |

## 7. Open questions for the LGU and tourism office

1. Who owns tourism content: the City Tourism Development and Promotion Office, the IT office or the mayor's office?
2. Can the portal reuse the tourism office's Facebook text and photos? Under what licence and credit?
3. What are the official opening hours and contacts for the historic cathedral, the new cathedral, Museong Lazaro Francisco and the old capitol?
4. Is Museo Novo Ecijano in Cabanatuan or Palayan?
5. What is the official name and status of the new public market, and when will vendors move in?
6. What is the current tricycle count, and which office publishes it?
7. Where exactly is the central terminal, and which companies serve it?
8. What is the official festival calendar for 2027, and which dates are city holidays?
9. Is the Great Raid count 513, 511 or "more than 500" for the city's purposes?
10. Does the city have an official tourism plan, such as the 2023–2033 plan circulating online, that the portal should align with?

## 8. Sources

### Primary and official

- Republic Act No. 526, Charter of the City of Cabanatuan (June 16, 1950) — [LDR record](https://ldr.senate.gov.ph/subject/charter-of-the-city-of-cabanatuan) · [text on Lawyerly](https://lawyerly.ph/laws/view/l300b)
- Proclamation No. 1451, s. 2008 (February 1, 2008 special non-working day) — [LawPhil PDF](https://lawphil.net/executive/proc/proc2008/pdf/proc_1451_2008.pdf) · [LDR record](https://ldr.senate.gov.ph/executive-issuance/proclamation-no-1451-s-2008)
- Republic Act No. 4475, establishing Palayan as the new capital (June 19, 1965) — [LawPhil](https://lawphil.net/statutes/repacts/ra1965/ra_4475_1965.html)
- Republic Act No. 8612, converting Central Luzon Polytechnic College into NEUST (1998) — [LawPhil](https://lawphil.net/statutes/repacts/ra1998/ra_8612_1998.html)
- NHCP Philippine Nationhood Trail markers list (Cabanatuan marker, June 14, 2024) — [Wikipedia compilation](https://en.wikipedia.org/wiki/List_of_Philippine_Nationhood_Trail_historical_markers) · [marker photos](https://commons.wikimedia.org/wiki/Category:Katedral_ng_Cabanatuan_historical_marker) (verify against NHCP)
- NHCP, "The First Philippine Republic" — [nhcp.gov.ph](https://nhcp.gov.ph/the-first-philippine-republic/)
- Diocese of Cabanatuan, history — [dioceseofcabanatuan.net](https://www.dioceseofcabanatuan.net/about-us-page/history-of-the-diocese/)
- ABMC, Cabanatuan American Memorial — [about](https://www.abmc.gov/cemeteries-memorials/about-cabanatuan-american-memorial/) · [history](https://www.abmc.gov/history/discover-the-history-of-cabanatuan-american-memorial/) · [visit](https://www.abmc.gov/plan/plan-your-visit-to-cabanatuan-american-memorial/)
- NPS and ABMC brochure — [npshistory.com PDF](https://npshistory.com/publications/battlefield/abmc/cabanatuan/brochure-e-1.pdf)
- U.S. Army Pacific, 80th anniversary of the Cabanatuan raid — [usarpac.army.mil](https://www.usarpac.army.mil/Our-Story/Our-News/Article-Display/Article/4052352/us-and-philippines-commemorate-the-80th-anniversary-of-the-cabanatuan-raid)
- CDC MMWR, "Earthquake Disaster — Luzon, Philippines" — [cdc.gov](https://www.cdc.gov/mmwr/preview/mmwrhtml/00001734.htm)
- DPWH, CLLEX Phase 1 — [dpwh.gov.ph](https://www.dpwh.gov.ph/dpwh/PPP/projs/CLLEx_phase1)
- PSA, 2024 Census of Population — [psa.gov.ph](https://psa.gov.ph/content/2024-census-population-popcen-population-counts-declared-official-president)
- PSA PSGC, City of Cabanatuan — [psa.gov.ph](https://psa.gov.ph/classification/psgc/barangays/0304903000)
- PSA PSGC, Province of Nueva Ecija — [psa.gov.ph](https://psa.gov.ph/classification/psgc/citimuni/0304900000)
- NEUST, history — [neust.edu.ph](https://neust.edu.ph/historical-background/) · [official site](https://neust.edu.ph/)
- Wesleyan University-Philippines, history — [wesleyan.edu.ph](https://www.wesleyan.edu.ph/history/) · [official site](https://www.wesleyan.edu.ph/)
- PHINMA Araullo University — [au.phinma.edu.ph](https://au.phinma.edu.ph/)
- College of the Immaculate Conception, history — [cic.edu.ph](https://www.cic.edu.ph/history) · [official site](https://www.cic.edu.ph/)
- Good Samaritan Colleges — [official site](https://goodsamaritancolleges.squarespace.com/) · [Facebook](https://www.facebook.com/goodsamcabanatuan/) · [goodsam.edu.ph](https://www.goodsam.edu.ph/)
- La Fortuna College — [LinkedIn](https://www.linkedin.com/company/la-fortuna-college) · [Facebook](https://www.facebook.com/lafortunacollegephil/) · [Scholaro](https://www.scholaro.com/u/La-Fortuna-College-Cabanatuan-City-19327)
- DepEd Division of Cabanatuan City — [region3.deped.gov.ph](https://region3.deped.gov.ph/cabanatuan/) · [division history](https://region3.deped.gov.ph/cabanatuan/about-us/history/)
- City Government of Cabanatuan — [cabanatuancity.gov.ph](https://www.cabanatuancity.gov.ph/)
- City Government of Cabanatuan, Sangitan Public Market project — [project page](https://bettercabanatuan.org/government/projects/sangitan-public-market)
- Province of Nueva Ecija, tourism — [nuevaecija.ph](https://www.nuevaecija.ph/tourism/) · [Minalungao National Park](https://www.nuevaecija.ph/destinations/minalungao-national-park/)

### Secondary and reference

- Inquirer, "Where to go in Cabanatuan when you hardly know the place" — [lifestyle.inquirer.net](https://lifestyle.inquirer.net/254192/go-cabanatuan-hardly-know-place/) (blocked to automated fetches; use a search snippet or archive)
- Inquirer, "Lazaro Francisco, Cabanatuan's treasure" — [opinion.inquirer.net](https://opinion.inquirer.net/127384/lazaro-francisco-cabanatuans-treasure)
- Inquirer, "Lazaro Francisco, Cabanatuan's pride" — [opinion.inquirer.net](https://opinion.inquirer.net/114263/lazaro-francisco-cabanatuans-pride)
- Inquirer, CLLEX toll-free until December — [newsinfo.inquirer.net](https://newsinfo.inquirer.net/2204217/marcos-on-opening-of-cllex-in-nueva-ecija-it-will-be-toll-free-until-december)
- Philstar, "New CLLEX segment opened to motorists" — [philstar.com](https://www.philstar.com/nation/2026/04/01/2518197/new-cllex-segment-opened-motorists)
- PIA, "Banatu Festival 2026 spotlights longganisa as Cabanatuan's signature product" — [pia.gov.ph](https://pia.gov.ph/news/banatu-festival-2026-spotlights-longganisa-as-cabanatuans-signature-product/)
- SunStar, "Banatu Festival to highlight Cabanatuan's 75th anniversary" — [sunstar.com.ph](https://www.sunstar.com.ph/pampanga/banatu-festival-to-highlightcabanatuans-75th-anniversary)
- Daily Tribune, "Solane backs Cabanatuan Longganisa Festival" (February 15, 2026) — [tribune.net.ph](https://tribune.net.ph/2026/02/15/solane-backs-cabanatuan-longganisa-festival)
- Manila Bulletin, "Feast of St. Nicholas of Tolentino on Sept. 10" — [mb.com.ph](https://mb.com.ph/article/299383/Philippines/feast-of-st-nicholas-of-tolentino-on-sept-10)
- Punto! Central Luzon, "Cabanatuan public market nasunog" — [punto.com.ph](https://punto.com.ph/cabanatuan-public-market-nasunog/)
- Inquirer, "Cabanatuan supermarket destroyed by fire" — [newsinfo.inquirer.net](https://newsinfo.inquirer.net/1252224/cabanatuan-supermarket-destroyed-by-fire)
- commutetour, Cabanatuan Central Terminal — [ph.commutetour.com](https://ph.commutetour.com/ph/terminal/cabanatuan/)
- Apple Maps, Cabanatuan terminal pin — [maps.apple.com](https://maps.apple.com/place?place-id=I507AF40842E568DC)
- League of Cities of the Philippines, Cabanatuan profile — [lcp.org.ph](https://lcp.org.ph/92/cabanatuan-city)
- "Cabanatuan City: Tricycle Capital of the Philippines" (2009 research paper, PDF) — [researchpublish.com](https://www.researchpublish.com/upload/book/Cabanatuan%20City-3270.pdf)
- PhilAtlas, Cabanatuan profile — [philatlas.com](https://www.philatlas.com/luzon/r03/nueva-ecija/cabanatuan.html)
- SM Supermalls, SM City Cabanatuan — [smsupermalls.com](https://www.smsupermalls.com/mall-directory/sm-city-cabanatuan/information)
- SM Supermalls, SM Megacenter Cabanatuan — [smsupermalls.com](https://www.smsupermalls.com/mall-directory/sm-megacenter-cabanatuan/information)
- Occupi, Robinsons Townville Cabanatuan — [getoccupi.com](https://getoccupi.com/malls/robinsons-townville-cabanatuan)
- Robinsons Townville malls — [robinsonstownvillemalls.com](https://robinsonstownvillemalls.com/our-malls)
- NE Pacific Mall — [official Facebook](https://www.facebook.com/nepacificofficial/)
- Lakewood Golf & Country Club — [GolfPH](https://golfph.com/golf-courses/lakewood-golf-and-country-club/) · [Facebook](https://www.facebook.com/p/Lakewood-Golf-and-Country-Club-100063726925870/)
- DWNE 900 AM — [Wikipedia](https://en.wikipedia.org/wiki/DWNE) (lead)
- NETV 48 — [Facebook](https://www.facebook.com/ne.tv48/)
- Punto! Central Luzon — [punto.com.ph](https://punto.com.ph/)

### Social and photo sources

- City Tourism Development and Promotion Office — [Facebook](https://www.facebook.com/cabctdpo/) · [heritage video](https://www.facebook.com/cabctdpo/videos/cabanatuan-heritage-places/1230501478744008/)
- Provincial tourism — [Facebook](https://www.facebook.com/tourismnuevaecija/) · [old capitol post](https://www.facebook.com/tourismnuevaecija/posts/715927050567498/)
- LGU Cabanatuan — [Facebook](https://www.facebook.com/lgucabanatuan/) · [Museums Month post](https://www.facebook.com/lgucabanatuan/posts/1556373783200402/)
- New Lakewood cathedral — [local tourism post](https://www.facebook.com/amazingnuevaecija2016/posts/1435376068392817/)
- Cabanatuan terminal — [Facebook post](https://www.facebook.com/100065119105952/posts/1322292379951386/)

### Leads only (verify before use)

- Wikipedia, Cabanatuan — [en.wikipedia.org](https://en.wikipedia.org/wiki/Cabanatuan)
- Wikipedia, Cabanatuan Cathedral — [en.wikipedia.org](https://en.wikipedia.org/wiki/Cabanatuan_Cathedral)
- Wikipedia, Cabanatuan American Memorial — [en.wikipedia.org](https://en.wikipedia.org/wiki/Cabanatuan_American_Memorial)
- Wikipedia, College of the Immaculate Conception (Cabanatuan) — [en.wikipedia.org](<https://en.wikipedia.org/wiki/College_of_the_Immaculate_Conception_(Cabanatuan)>)
- Wikipedia, SM City Cabanatuan — [en.wikipedia.org](https://en.wikipedia.org/wiki/SM_City_Cabanatuan)
- Wikipedia, Robinsons Cabanatuan — [en.wikipedia.org](https://en.wikipedia.org/wiki/Robinsons_Cabanatuan)
- Wikipedia, NE Pacific Mall — [en.wikipedia.org](https://en.wikipedia.org/wiki/NE_Pacific_Mall)
- Wikipedia, Cabanatuan longganisa — [en.wikipedia.org](https://en.wikipedia.org/wiki/Cabanatuan_longganisa)
- Wikimedia Commons, Ling Hong Temple — [commons.wikimedia.org](https://commons.wikimedia.org/wiki/Category:Ling_Hong_Temple)

### Repo sources (paths, not public URLs)

- `src/data/about.yaml` — city history, fast facts and the current about-page text.
- `src/data/city-data.json` — population, land area, PSGC, income class and population trend.
- `src/data/projects.yaml` — Sangitan Public Market budget, location, dates and status.
- `src/data/barangays.yaml` and `src/data/barangays-data.json` — 89 barangay records and population series.
- `src/data/hospitals.yaml` — five hospital entries and their contact sources.
- `src/data/navigation.ts` — current navigation: Services, Government, Statistics, Transparency.
- `src/App.tsx` — route list; confirms there is no tourism, heritage, festival, transport, school, market, media or sports route.
- `content/government/departments/tourism.md` — current tourism office page.
- `docs/superpowers/specs/2026-10-11-cabanatuan-resident-needs-research.md` — prior research on service and portal gaps, including the land-area discrepancy.

**Access date:** all URLs were accessed on 2026-10-21. Some government and news sites returned 403 to automated fetches; those claims are marked **[Verify]**. Wikipedia is used only as a lead except where it compiles primary markers or lists (the NHCP marker list and Wikimedia Commons categories).
