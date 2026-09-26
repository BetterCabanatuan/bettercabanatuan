# Portal UI/UX Refinement Design

**Date:** 2026-09-26

**Status:** Approved design

**Scope:** All public routes in the Better Cabanatuan portal

## Purpose

Improve the portal's visual rhythm, placement, consistency, and mobile usability
without replacing its civic identity, content, route structure, or accessibility
foundation.

The finished interface should make related elements feel grouped, keep unrelated
elements visually separate, avoid accidental-looking partial rows, and reduce the
effort required to navigate long pages on a phone.

## Current Problems

The review identified five system-level problems:

1. The shared card grid calculates card widths as though gaps exist but does not
   apply a gap, causing cards to touch on Home, Services, and Government pages.
2. Centered orphan cards and fixed three-column department groups produce large,
   accidental-looking holes on desktop.
3. Home, Departments, About, and Contact become extremely long mobile pages,
   followed by a fully expanded footer.
4. Related page families use different heroes, card anatomy, content widths, and
   section spacing.
5. Blocked third-party embeds leave blank regions with no explanation or useful
   alternative.

The review also found interaction and implementation issues: hover-dependent
desktop navigation, unlabeled language selectors, broad `transition-all`
animations, missing intrinsic logo dimensions, and a small number of decorative
accent treatments that add noise.

## Design Principles

- Preserve the current blue civic identity and direct, practical language.
- Repair shared primitives before applying page-specific exceptions.
- Treat directories as directories: partial rows align with the reading edge.
- Keep emergency and primary civic information immediately visible.
- Use progressive disclosure only for large, secondary mobile sections.
- Keep responsive behavior in CSS and semantic markup whenever possible.
- Preserve or improve existing keyboard access, contrast, reduced-motion support,
  and 44px minimum targets.

## Information Architecture

The route structure and content hierarchy remain unchanged. Improvements happen
inside the existing page families:

- **Landing:** Home
- **Indexes:** Services, Government, Transparency, Projects, Departments,
  Barangays, Officials, News, Sitemap
- **Categories and documents:** service categories, government categories,
  department details, project details, barangay details, Markdown documents
- **Civic information:** About, Contact, Hotlines, Statistics, Accessibility
- **System:** Search and Not Found

Long pages may add an in-page jump navigation. Jump links do not create new
routes or hide primary content.

## Shared Layout System

### Section rhythm

Use one shared spacing vocabulary for page sections:

- Compact separation for content that belongs to one group
- Standard separation between peer sections
- Large separation only when the page changes topic or surface treatment

Section headings, supporting copy, controls, and content grids should follow the
same internal order and spacing across page families.

### Content width

Keep the existing site container for broad page structure. Constrain reading and
short-list content so it does not stretch across the full desktop container.
Data tables and large directories may use the wider container.

### Page hero

Create or extend one shared page hero for index and category pages. It supports:

- Breadcrumbs
- Eyebrow
- Page title
- Short description
- Optional icon

Services category pages adopt this shell. Detail and document pages may use a
quieter variant when a large blue banner would overpower the content.

## Card and Grid System

### Gaps

The shared grid applies `gap-4 md:gap-6`. Card width calculations must account
for these actual gaps. Tests should assert that the root grid contains the gap
utilities so the regression cannot recur.

### Partial rows

Directory grids align partial rows to the start. This includes Services,
Government, Departments, Projects, and Transparency.

Curated promotional groups may opt into centered alignment explicitly. Centering
is not the default.

### Small department groups

Department branches containing one or two offices should not reserve a full
three-column row. Their cards keep the standard directory card width and align to
the start. Larger groups use the normal responsive grid.

### Card anatomy

Extend the existing shared card system instead of creating another independent
card implementation. Shared metrics include:

- Padding
- Radius and shadow
- Icon tile size
- Title and description styles
- Footer placement
- Focus and hover treatment
- Responsive gaps

Variants may change tone, metadata, and footer content. Transparency resources
must support internal and external destinations without duplicating the entire
card structure.

Thick top and side accent borders should be removed where they are decorative.
Status, category, or urgency should be conveyed through the icon tile, badge,
copy, or a restrained color treatment.

## Mobile Density

### Jump navigation

Add a compact in-page jump navigation to long structured pages, initially:

- Departments
- Contact
- About

Links use real anchors with appropriate `scroll-margin-top`. The navigation must
wrap without horizontal page overflow and remain keyboard accessible.

### Selective collapsing

Primary information remains expanded:

- Emergency hotlines
- Main contact paths
- Primary page introduction
- Core services and government destinations

Large secondary groups may collapse on small screens:

- Department branch groups after the first priority group
- Secondary Contact directories and resource collections
- Lower-priority About directories

Every control includes the section name, item count, and expanded state. Desktop
renders these groups expanded without requiring interaction. Content remains in
the DOM so headings, links, and semantics are preserved.

### Footer

On mobile, footer navigation sections become accessible disclosure groups. The
brand summary, social links, copyright, and legal links stay visible. Desktop
keeps the current multi-column footer.

### Header

Preserve immediate access to emergency information while reducing mobile chrome.
Secondary utility links should move into the mobile menu rather than occupy a
separate persistent row. The main logo and menu control remain prominent.

## Embed Resilience

Create a reusable embed state wrapper for third-party content.

It supports:

- Loading state announced politely
- Successful content
- Timeout or script failure
- Blocked/privacy-tool fallback

The fallback uses a compact branded card with a direct external link. Failed
embeds release reserved height so blank panels do not remain. The fallback text
must explain that the content is hosted externally rather than implying the
portal itself is broken.

Apply this behavior to the Home Facebook section and Contact social section.

## Navigation and Accessibility

- Add explicit accessible labels to desktop and mobile language selectors.
- Make the desktop Services menu available by keyboard and click, not hover only.
- Expose `aria-expanded` and connect triggers to their menus.
- Support Escape and outside-click dismissal where applicable.
- Keep navigation destinations as links and state-changing controls as buttons.
- Preserve visible `focus-visible` treatment.
- Mark decorative icons as hidden from assistive technology.
- Give heading anchors sufficient scroll margin.
- Keep all primary touch targets at least 44px.

## Motion and Images

- Replace `transition-all` with explicit properties.
- Continue honoring `prefers-reduced-motion`.
- Animate only transform, opacity, color, shadow, or intentional layout values.
- Preserve short, interruptible interaction feedback.
- Add intrinsic width and height to logo and other known-size images to reduce
  layout shift.

## Page-Specific Refinements

### Home

- Restore visible space between service and government cards.
- Start partial directory rows at the reading edge.
- Replace blank Facebook embed space with a fallback.
- Maintain a balanced relationship between Map and Weather at desktop and mobile.

### Services and Government

- Use the shared hero and card systems.
- Apply consistent gaps and start-aligned partial rows.
- Keep descriptions concise and card heights visually stable.

### Departments

- Add branch jump links.
- Use selective mobile disclosure for secondary branch groups.
- Avoid wide empty rows for groups with few offices.

### About

- Add section jump links.
- Consolidate repeated card treatments into the shared system.
- Keep narrative sections readable and distinct from directories.

### Contact

- Keep emergency information first and expanded.
- Add jump links for department contacts, city channels, hospitals, online
  resources, and office finder.
- Collapse secondary mobile directories selectively.
- Replace failed social embeds with direct-link fallbacks.

### Transparency

- Move resource cards onto the shared card anatomy.
- Keep external-resource labeling explicit.
- Replace broad transitions with explicit properties.

## Error and Empty States

- Loading states use an ellipsis and an appropriate live region.
- Empty directories explain how to clear or adjust filters.
- Failed embeds offer a direct external action.
- Existing search, document, and Not Found recovery paths remain intact.

## Testing Strategy

Implementation follows test-driven development for shared behavior.

### Component tests

- Card grid includes responsive gaps and defaults to start alignment.
- Center alignment remains available only through an explicit option.
- Small department groups use constrained placement.
- Mobile disclosures expose correct names, counts, and expanded state.
- Language selectors have accessible names.
- Navigation menus work with keyboard and pointer input.
- Embed wrappers show loading, success, and fallback states.

### Static and integration checks

- TypeScript build
- ESLint
- Unit tests
- Color-token contrast audit
- Impeccable detector

### Rendered QA

Run the existing 24-route inventory at 320, 375, 768, 1024, and 1440px.
Acceptance requires:

- No horizontal page overflow
- No blocking or major responsive findings
- No touching cards
- No unexplained blank embed panels
- No accidental centered orphan rows in directory grids
- No regression in focus visibility, touch targets, or contrast

Complete one combined desktop/mobile screenshot review, apply one batched repair
pass, then run one confirmation pass.

## Migration Sequence

1. Repair and test shared grid, card, section, hero, disclosure, and embed
   primitives.
2. Migrate Home, Services, Government, and Transparency.
3. Refine Departments, About, and Contact mobile navigation and disclosure.
4. Update header, footer, navigation accessibility, motion, and image dimensions.
5. Sweep remaining routes for spacing and component consistency.
6. Run static checks and full rendered QA.

## Non-Goals

- No rebrand or replacement color palette
- No route or content-management redesign
- No factual copy changes
- No new third-party UI framework
- No dark mode
- No removal of government information to shorten pages
- No hiding categories merely to produce even card rows

## Success Criteria

The work is complete when:

- Cards have intentional space at every breakpoint.
- Directory partial rows and small groups no longer look misplaced.
- Long mobile pages provide jump navigation and selective disclosure while
  keeping critical information visible.
- Related page families share the same shell, rhythm, and card anatomy.
- Failed third-party content has an understandable, compact fallback.
- Header, footer, language controls, and desktop menus are keyboard accessible.
- All existing automated checks pass and the 120-route responsive audit reports
  no blockers or majors.
