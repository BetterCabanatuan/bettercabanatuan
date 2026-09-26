/**
 * The route inventory the QA tools walk, and the breakpoints they check at.
 *
 * Kept apart from the tools themselves so importing the list does not *run* a
 * screenshot sweep as a side effect.
 *
 * Every route the site can render, plus one detail page per listing — a list
 * page and its detail page fail in different ways, and checking only the list
 * hides every detail-page defect.
 *
 * Detail-page slugs are real ones taken from the content files. An invented slug
 * renders a not-found state instead, which quietly turns a detail-page audit
 * into a second 404 audit: the sweep reports "no <h1>" for a page that was
 * never supposed to render.
 */

export const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/services', name: 'services-index' },
  { path: '/services/health-services', name: 'services-category' },
  {
    path: '/services/health-services/get-free-check-ups-basic-medicines-and-vaccines',
    name: 'services-subservice',
  },
  { path: '/government', name: 'government-index' },
  { path: '/government/officials', name: 'government-officials' },
  { path: '/government/barangays', name: 'government-barangays' },
  {
    path: '/government/barangays/aduas-centro',
    name: 'government-barangay-detail',
  },
  { path: '/government/departments', name: 'government-departments' },
  {
    path: '/government/departments/executive',
    name: 'government-department-detail',
  },
  { path: '/government/projects', name: 'government-projects' },
  {
    path: '/government/projects/sangitan-public-market',
    name: 'government-project-detail',
  },
  { path: '/government/news', name: 'government-news' },
  { path: '/statistics', name: 'statistics' },
  { path: '/transparency', name: 'transparency' },
  { path: '/transparency/flood-controls', name: 'transparency-flood-controls' },
  { path: '/transparency/legislation', name: 'transparency-legislation' },
  { path: '/about', name: 'about' },
  { path: '/contact', name: 'contact' },
  { path: '/hotlines', name: 'hotlines' },
  { path: '/search', name: 'search' },
  { path: '/sitemap', name: 'sitemap' },
  { path: '/accessibility', name: 'accessibility' },
  { path: '/404-does-not-exist', name: 'not-found' },
];

/** Standard breakpoints from the QA ticket. */
export const WIDTHS = [320, 375, 768, 1024, 1440];

/**
 * Every route the audit walks. Exported as a flat list of paths for the
 * Playwright specs, which assert the same things `qa-audit.mjs` reports.
 */
export const ALL_PATHS = ROUTES.map(r => r.path);
