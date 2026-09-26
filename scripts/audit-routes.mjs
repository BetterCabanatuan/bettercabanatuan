#!/usr/bin/env node
/**
 * Route integrity audit.
 *
 *   node scripts/audit-routes.mjs                    # audit every route
 *   node scripts/audit-routes.mjs --base http://…    # against another origin
 *   node scripts/audit-routes.mjs --links            # also crawl internal links
 *
 * The existing e2e specs assert behaviour on routes someone chose. This walks
 * the ones nobody chose — every registered route, every detail route's
 * *invalid* slug, and every internal link the pages actually emit — and reports
 * what a resident would hit:
 *
 *   console    uncaught exception or console error on a route that should work
 *   leak       placeholder text reaching the DOM (`{TOKEN}`, `[PHONE NUMBER]`)
 *   guard      a route showing a not-found / coming-soon / empty state
 *   heading    no <h1>, or more than one
 *   link       an internal href that lands on a not-found state
 *
 * A detail route with a valid slug is expected to render content; the same route
 * with a nonsense slug is expected to render its not-found guard. Both are
 * checked, because "guarded" and "actually works" are different claims.
 */

import { chromium } from '@playwright/test';
import { ROUTES } from './routes.mjs';

const argv = process.argv.slice(2);
const flag = n => {
  const i = argv.indexOf(`--${n}`);
  return i === -1 ? undefined : argv[i + 1];
};
const base = (flag('base') ?? 'http://localhost:4000').replace(/\/$/, '');
const crawlLinks = argv.includes('--links');

const C = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

/** Markers that identify a guard state rather than a working page. */
const GUARDS = {
  'not found': /not\s*found|does not exist|404|no longer available/i,
  'coming soon': /coming soon|being prepared|not published here yet/i,
  empty: /nothing (here )?yet|no (results|items|entries) (yet|found)/i,
};

/** Placeholder shapes that must never reach a resident. Mirrored in-page. */
const LEAKS = [
  { name: 'brace token', re: /\{[A-Z][A-Z0-9_]{2,}\}/ },
  {
    name: 'bracketed placeholder',
    re: /\[[A-Z][A-Z0-9]*(?:[ ][A-Z0-9/+.,'()-]+){1,}\]/,
  },
];

/** Every route plus the guards each detail route owes us. */
const PROBES = [
  // `/404-does-not-exist` is the not-found page itself, so it is probed as a
  // guard rather than as content — otherwise the audit reports the 404 route
  // for correctly rendering a 404.
  ...ROUTES.map(r => ({
    path: r.path,
    expect: r.name === 'not-found' ? 'guard' : 'content',
    note: r.name,
  })),
  // Invalid slugs: a detail route must refuse these, not render a shell or
  // crash. A route that renders its list at a nonsense slug is a real bug —
  // the URL looks right to a resident and to a crawler.
  {
    path: '/government/departments/not-a-department',
    expect: 'guard',
    note: 'department not-found',
  },
  {
    path: '/government/barangays/not-a-town',
    expect: 'guard',
    note: 'barangay not-found',
  },
  {
    path: '/government/barangays/does-not-exist',
    expect: 'guard',
    note: 'barangay not-found',
  },
  {
    path: '/government/projects/not-a-project',
    expect: 'guard',
    note: 'project not-found',
  },
  {
    path: '/services/not-a-category',
    expect: 'guard',
    note: 'service category not-found',
  },
  {
    path: '/services/health-services/not-a-document',
    expect: 'guard',
    note: 'service doc not-found',
  },
  {
    path: '/government/not-a-section',
    expect: 'guard',
    note: 'gov category not-found',
  },
  {
    path: '/government/not-a-section/not-a-doc',
    expect: 'guard',
    note: 'gov doc not-found',
  },
  { path: '/totally/made/up/path', expect: 'guard', note: 'catch-all 404' },
];

/**
 * Runs in the page. Kept as one serialised function so it sees the real
 * rendered text and DOM.
 *
 * Every table is declared INSIDE on purpose: `page.evaluate` serialises the
 * function source, so it closes over nothing. Referencing an outer `const`
 * fails at runtime with a ReferenceError rather than at build time.
 */
function probeInPage() {
  const GUARD_RE = {
    'not found': /not\s*found|does not exist|404|no longer available/i,
    'coming soon': /coming soon|being prepared|not published here yet/i,
    empty: /nothing (here )?yet|no (results|items|entries) (yet|found)/i,
  };
  const LEAK_RE = {
    'brace token': /\{[A-Z][A-Z0-9_]{2,}\}/,
    'bracketed placeholder': /\[[A-Z][A-Z0-9]*(?:[ ][A-Z0-9/+.,'()-]+){1,}\]/,
  };

  const text = document.body.innerText || '';
  const h1s = Array.from(document.querySelectorAll('h1'))
    .map(h => (h.textContent || '').trim())
    .filter(Boolean);
  const links = Array.from(document.querySelectorAll('a[href]'))
    .map(a => a.getAttribute('href') || '')
    .filter(h => h.startsWith('/') && !h.startsWith('//'));

  const guards = [];
  for (const [name, re] of Object.entries(GUARD_RE)) {
    if (re.test(text)) guards.push(name);
  }

  const leaks = [];
  for (const [name, re] of Object.entries(LEAK_RE)) {
    const m = text.match(re);
    if (m) leaks.push(`${name}: ${m[0].slice(0, 60)}`);
  }

  return {
    title: document.title,
    textLength: text.trim().length,
    h1s,
    guards,
    leaks,
    noindex: !!document.querySelector(
      'meta[name="robots"][content*="noindex"]'
    ),
    links: [...new Set(links)],
  };
}

/* ------------------------------------------------------------------- crawl */

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
});
const findings = [];
const internalLinks = new Set();
/** The homepage's <title>; a route that sets no SEO keeps it. Filled by the `/` probe. */
let baselineTitle = '';

async function probe(path, expect, note) {
  const page = await context.newPage();
  const console_ = [];
  page.on('console', m => {
    if (m.type() === 'error') console_.push(m.text().slice(0, 200));
  });
  page.on('pageerror', e =>
    console_.push(`UNCAUGHT: ${e.message.slice(0, 200)}`)
  );

  let result;
  try {
    const res = await page.goto(base + path, {
      waitUntil: 'networkidle',
      timeout: 20000,
    });
    result = await page.evaluate(probeInPage);
    result.status = res?.status() ?? 0;
  } catch (e) {
    findings.push({
      path,
      severity: 'blocker',
      kind: 'load',
      detail: e.message.slice(0, 160),
    });
    await page.close();
    return;
  }

  /*
   * Third-party script noise, not our bugs.
   *
   * The Facebook SDK logs its own `ErrorUtils` failures and `DataStore.get`
   * warnings from inside connect.facebook.net. The embed still renders — the
   * iframe appears and the skeleton is replaced — so failing the audit on these
   * would train people to ignore the tool. Verified directly: with the SDK
   * loaded, `iframe[src*="facebook"]` is present and the component's 12s
   * fallback never fires.
   */
  const THIRD_PARTY =
    /ErrorUtils|Could not find element|DataStore\.get|fburl\.com|connect\.facebook\.net|fbroot/i;

  const realErrors = console_.filter(
    t => !/favicon|Download the React DevTools/i.test(t)
  );
  const thirdParty = realErrors.filter(t => THIRD_PARTY.test(t));
  const ours = realErrors.filter(t => !THIRD_PARTY.test(t));

  if (ours.length) {
    findings.push({
      path,
      severity: 'blocker',
      kind: 'console',
      detail: ours[0],
    });
  }
  if (thirdParty.length) {
    findings.push({
      path,
      severity: 'note',
      kind: 'third-party',
      detail: `${thirdParty.length} console error(s) from the Facebook SDK embed (renders fine)`,
    });
  }

  for (const leak of result.leaks) {
    findings.push({ path, severity: 'blocker', kind: 'leak', detail: leak });
  }

  if (expect === 'content') {
    if (result.h1s.length === 0) {
      findings.push({
        path,
        severity: 'major',
        kind: 'heading',
        detail: 'no <h1>',
      });
    } else if (result.h1s.length > 1) {
      findings.push({
        path,
        severity: 'minor',
        kind: 'heading',
        detail: `${result.h1s.length} <h1>: ${result.h1s.join(' | ').slice(0, 90)}`,
      });
    }
    if (result.textLength < 200) {
      findings.push({
        path,
        severity: 'major',
        kind: 'content',
        detail: `only ${result.textLength} chars of text — looks like an empty shell`,
      });
    }
    if (result.guards.includes('not found')) {
      findings.push({
        path,
        severity: 'blocker',
        kind: 'guard',
        detail: 'a live route is rendering a not-found state',
      });
    }
    // "coming soon" is legitimate on the five stub sections; recorded, not failed.
    for (const g of result.guards) {
      if (g !== 'not found') {
        findings.push({
          path,
          severity: 'note',
          kind: 'state',
          detail: `guarded as "${g}"`,
        });
      }
    }
  } else {
    if (!result.guards.includes('not found')) {
      findings.push({
        path,
        severity: 'major',
        kind: 'guard',
        detail: 'invalid slug did NOT render a not-found state',
      });
    }
    /*
     * The guard contract. Seven detail routes rendered a bare `Banner`, which
     * is not a heading, carried no `noindex`, and left the `<title>` at the
     * site default — so every bad slug was a headingless page titled exactly
     * like the homepage, and crawlers were free to index all of them.
     */
    if (result.h1s.length === 0) {
      findings.push({
        path,
        severity: 'major',
        kind: 'guard',
        detail: 'not-found state has no <h1> — no document outline',
      });
    }
    if (!result.noindex) {
      findings.push({
        path,
        severity: 'major',
        kind: 'guard',
        detail: 'not-found state is not noindex — crawlable',
      });
    }
    // The homepage title is the baseline: a route that renders no <SEO> keeps
    // whatever index.html declared, so every such page was a duplicate title.
    if (result.title === baselineTitle) {
      findings.push({
        path,
        severity: 'minor',
        kind: 'guard',
        detail: `not-found state kept the site default <title> "${result.title}"`,
      });
    }
  }

  for (const href of result.links) internalLinks.add(href);
  // `/` is the first probe, so by the time any guard is evaluated the baseline
  // title — what index.html declares — is known.
  if (path === '/') baselineTitle = result.title;

  await page.close();
}

for (const p of PROBES) await probe(p.path, p.expect, p.note);

/* --------------------------------------------------------- link crawl */

if (crawlLinks) {
  for (const href of internalLinks) {
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    const page = await context.newPage();
    try {
      await page.goto(base + clean, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      });
      const body = await page.evaluate(() => document.body.innerText || '');
      if (/not\s*found|does not exist|404/i.test(body)) {
        findings.push({
          path: href,
          severity: 'major',
          kind: 'link',
          detail: 'internal link lands on a not-found state',
        });
      }
    } catch {
      findings.push({
        path: href,
        severity: 'minor',
        kind: 'link',
        detail: 'could not load',
      });
    }
    await page.close();
  }
}

await browser.close();

/* ----------------------------------------------------------------- report */

console.log(
  `\n${C.bold}ROUTE INTEGRITY AUDIT${C.reset}  ${C.dim}${base}${C.reset}\n`
);
console.log(
  `${PROBES.length} routes probed · ${internalLinks.size} internal links discovered\n`
);

const order = { blocker: 0, major: 1, minor: 2, note: 3 };
findings.sort((a, b) => order[a.severity] - order[b.severity]);

for (const f of findings) {
  const tag = {
    blocker: `${C.red}BLOCKER${C.reset}`,
    major: `${C.yellow}major ${C.reset}`,
    minor: `${C.dim}minor ${C.reset}`,
    note: `${C.dim}note  ${C.reset}`,
  }[f.severity];
  console.log(
    `${tag} ${C.cyan}${f.path}${C.reset}  ${C.dim}${f.kind}${C.reset}`
  );
  console.log(`       ${f.detail}`);
}

const blockers = findings.filter(f => f.severity === 'blocker').length;
const majors = findings.filter(f => f.severity === 'major').length;
const notes = findings.filter(f => f.severity === 'note').length;
const minors = findings.filter(f => f.severity === 'minor').length;

console.log(
  `\n${blockers ? C.red : C.green}${blockers} blocker${C.reset} · ` +
    `${majors} major · ${minors} minor · ${notes} note\n`
);
process.exit(blockers || majors ? 1 : 0);
