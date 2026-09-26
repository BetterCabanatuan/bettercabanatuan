#!/usr/bin/env node
/**
 * Responsive layout + rendered-contrast audit.
 *
 *   node scripts/qa-audit.mjs                 # every route, every breakpoint
 *   node scripts/qa-audit.mjs --widths 375
 *   node scripts/qa-audit.mjs --json out.json
 *
 * Complements `shoot.mjs`, which produces the pictures. This produces the
 * numbers: horizontal overflow, clipped text, orphaned grid rows, undersized
 * touch targets, uneven card heights, and contrast measured from computed
 * styles on a live page.
 *
 * Contrast is the reason this is not just the static `check-contrast` audit.
 * That one reads class strings and cannot see a background set on an ancestor,
 * so the hero band's light-on-dark labels show up as failures on white. Here
 * the real rendered pixels are measured, so a reported failure is a failure.
 *
 * Severity:
 *   blocker  content is unreachable or unreadable
 *   major    visible breakage: overlap, clipping, overflow, sub-AA text
 *   minor    visible but not broken: uneven rows, small targets, tight spacing
 *   note     worth a look, no user impact
 */

import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  roundRatio,
  parseColorChannels,
  compositeOver,
  toHex,
} from '../src/lib/contrast.ts';
import { ROUTES, WIDTHS } from './routes.mjs';

const base = process.env.QA_BASE_URL ?? 'http://localhost:4001';
const argv = process.argv.slice(2);
const flag = n => {
  const i = argv.indexOf(`--${n}`);
  return i === -1 ? undefined : argv[i + 1];
};
const widths = flag('widths') ? flag('widths').split(',').map(Number) : WIDTHS;
// Route filters are the bare arguments. A value that belongs to a flag (the
// path after `--json`, say) must not be mistaken for one.
const FLAG_VALUES = new Set(
  argv.flatMap((a, i) =>
    argv[i - 1]?.startsWith('--') && !a.startsWith('--') ? [a] : []
  )
);
const onlyPaths = argv.filter(a => a.startsWith('/') && !FLAG_VALUES.has(a));
const routes = onlyPaths.length
  ? ROUTES.filter(r => onlyPaths.includes(r.path))
  : ROUTES;

/**
 * Everything below runs inside the page. Kept as one serialised function so it
 * sees real computed styles and real layout boxes rather than guessing from the
 * markup.
 *
 * The constants are declared *inside* the function on purpose: `page.evaluate`
 * serialises the function source, so it closes over nothing. Referencing an
 * outer `const` fails at runtime with a ReferenceError rather than at build
 * time, which is exactly the kind of thing that wastes an afternoon.
 */
function auditInPage() {
  const MIN_TOUCH = 44; // WCAG 2.5.8 target size, and the repo's own convention
  const AA_BODY = 4.5;
  const AA_LARGE = 3;
  const ROW_TOLERANCE = 4; // px, for grouping items into rows
  const HEIGHT_SPREAD_LIMIT = 8; // px, below which uneven cards are invisible
  const CENTRE_TOLERANCE = 8; // px, for "is the short row centred"

  const findings = [];
  const add = (kind, severity, detail, extra = {}) =>
    findings.push({ kind, severity, detail, ...extra });

  const vw = document.documentElement.clientWidth;

  /** A short, human-usable path for the element. */
  const describe = el => {
    const parts = [];
    let node = el;
    for (let i = 0; node && i < 3; i++) {
      let part = node.tagName.toLowerCase();
      if (node.id) part += `#${node.id}`;
      const cls = (node.getAttribute?.('class') || '')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .join('.');
      if (cls) part += `.${cls}`;
      parts.push(part);
      node = node.parentElement;
    }
    return parts.join(' > ');
  };

  const text = el =>
    (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);

  const all = [...document.querySelectorAll('body *')];

  /* ------------------------------------------------ 1. horizontal overflow */

  {
    const de = document.documentElement;
    if (de.scrollWidth > de.clientWidth + 1) {
      add(
        'overflow',
        'blocker',
        `page scrolls horizontally: scrollWidth ${de.scrollWidth} > clientWidth ${de.clientWidth}`
      );
    }

    // An element sticking out past the viewport is the usual cause. Three
    // exclusions, each of which was a false positive before it was added:
    //   - fixed/absolute decoration is allowed to bleed;
    //   - anything inside a clipping ancestor (a horizontally scrollable
    //     strip, an overflow-hidden hero) is clipped by definition, so its
    //     geometry extending past the edge is invisible and harmless;
    //   - the page-level scrollWidth check above already reports the real
    //     symptom once, rather than once per descendant.
    const isClipped = el => {
      let node = el.parentElement;
      while (node && node !== document.body) {
        const cs = getComputedStyle(node);
        if (/hidden|auto|scroll|clip/.test(cs.overflowX)) return true;
        node = node.parentElement;
      }
      return false;
    };

    for (const el of all) {
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' || cs.position === 'absolute') continue;
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right <= vw + 1 && r.left >= -1) continue;
      if (isClipped(el)) continue;
      add(
        'overflow',
        'major',
        `element extends past the viewport (left ${Math.round(r.left)}, right ${Math.round(r.right)} vs ${vw})`,
        { selector: describe(el), sample: text(el) }
      );
    }
  }

  /* ------------------------------------------------------ 2. clipped text */

  /**
   * Visually hidden but exposed to assistive tech. Its whole purpose is to be
   * 1x1 and clipped, so it must never be reported as clipped text.
   */
  const isVisuallyHidden = el => {
    const cs = getComputedStyle(el);
    if (cs.clip === 'rect(0px, 0px, 0px, 0px)') return true;
    if (cs.clipPath === 'inset(50%)') return true;
    return el.closest('.sr-only') !== null;
  };

  for (const el of all) {
    if (!el.childNodes.length) continue;
    if (isVisuallyHidden(el)) continue;
    const hasDirectText = [...el.childNodes].some(
      n => n.nodeType === 3 && n.textContent.trim()
    );
    if (!hasDirectText) continue;

    const cs = getComputedStyle(el);
    if (cs.overflow === 'visible' && cs.overflowX === 'visible') continue;
    if (cs.overflowY === 'auto' || cs.overflowY === 'scroll') continue;

    // line-clamp and text-overflow are deliberate design decisions — the card
    // body is *meant* to end in an ellipsis. Only unflagged overflow counts.
    const deliberate =
      cs.webkitLineClamp !== 'none' ||
      cs.textOverflow === 'ellipsis' ||
      cs.overflowWrap === 'anywhere' ||
      cs.wordBreak === 'break-all';
    if (deliberate) continue;

    const overflowsY = el.scrollHeight > el.clientHeight + 2;
    const overflowsX = el.scrollWidth > el.clientWidth + 2;
    if (!overflowsY && !overflowsX) continue;

    add(
      'clipped-text',
      'major',
      `text is cut off (content ${el.scrollWidth}x${el.scrollHeight} in box ${el.clientWidth}x${el.clientHeight})`,
      { selector: describe(el), sample: text(el) }
    );
  }

  /* ------------------------------------------ 3. card-grid gaps and alignment */

  // Directory grids intentionally align partial rows to the reading edge.
  // Centring is reserved for a marked promotional variant. The same pass also
  // catches the original regression: cards whose width assumes a gap while the
  // container applies none.
  for (const list of document.querySelectorAll('[data-card-grid]')) {
    const items = [...list.children].filter(
      c => getComputedStyle(c).display !== 'none'
    );
    if (items.length < 2) continue;

    const rows = new Map();
    for (const item of items) {
      const r = item.getBoundingClientRect();
      if (r.height === 0) continue;
      const top = Math.round(r.top);
      // Group by vertical position, tolerating sub-pixel row alignment.
      const key =
        [...rows.keys()].find(k => Math.abs(k - top) <= ROW_TOLERANCE) ?? top;
      rows.set(key, [...(rows.get(key) ?? []), r]);
    }
    const orderedRows = [...rows.entries()].sort((a, b) => a[0] - b[0]);
    for (const [, row] of orderedRows) {
      const ordered = [...row].sort((a, b) => a.left - b.left);
      for (let i = 1; i < ordered.length; i++) {
        const gap = ordered[i].left - ordered[i - 1].right;
        if (gap < 12) {
          add(
            'card-gap',
            'major',
            `adjacent cards have only ${Math.round(gap)}px between them`,
            { selector: describe(list) }
          );
          break;
        }
      }
    }

    for (let i = 1; i < orderedRows.length; i++) {
      const previousBottom = Math.max(
        ...orderedRows[i - 1][1].map(rect => rect.bottom)
      );
      const verticalGap = orderedRows[i][0] - previousBottom;
      if (verticalGap < 12) {
        add(
          'card-gap',
          'major',
          `card rows have only ${Math.round(verticalGap)}px between them`,
          { selector: describe(list) }
        );
        break;
      }
    }

    if (orderedRows.length < 2) continue;
    const widestRow = Math.max(...orderedRows.map(([, row]) => row.length));
    const last = orderedRows.at(-1)[1];
    if (last.length >= widestRow) continue;
    if (list.dataset.cardGridAlign === 'center') continue;

    const listRect = list.getBoundingClientRect();
    const orderedLast = [...last].sort((a, b) => a.left - b.left);
    const leadGap = orderedLast[0].left - listRect.left;
    const trailGap = listRect.right - orderedLast.at(-1).right;
    if (
      leadGap > CENTRE_TOLERANCE &&
      Math.abs(leadGap - trailGap) <= CENTRE_TOLERANCE
    ) {
      add(
        'orphan-row',
        'major',
        `directory partial row is centred instead of start-aligned`,
        { selector: describe(list) }
      );
    }
  }

  /* --------------------------------------------- 4. uneven cards in a row */

  for (const list of document.querySelectorAll('[data-card-grid]')) {
    const items = [...list.children];
    if (items.length < 2) continue;

    const rows = new Map();
    for (const item of items) {
      const r = item.getBoundingClientRect();
      if (r.height === 0) continue;
      const top = Math.round(r.top);
      const key =
        [...rows.keys()].find(k => Math.abs(k - top) <= ROW_TOLERANCE) ?? top;
      rows.set(key, [...(rows.get(key) ?? []), r]);
    }

    for (const [, row] of rows) {
      if (row.length < 2) continue;
      const heights = row.map(r => Math.round(r.height));
      const spread = Math.max(...heights) - Math.min(...heights);
      // A card legitimately grows with its content when the parent does not
      // stretch it; only flag a spread that is visible at card scale.
      if (spread > HEIGHT_SPREAD_LIMIT) {
        add(
          'uneven-cards',
          'minor',
          `cards in one row differ in height by ${spread}px (${heights.join(', ')})`,
          { selector: describe(list) }
        );
      }
    }
  }

  /* ------------------------------------------- 5. touch target size */

  if (vw < 768) {
    for (const el of document.querySelectorAll(
      'a, button, select, input[type="checkbox"], input[type="radio"]'
    )) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      if (el.closest('[aria-hidden="true"]')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      // An inline link inside a paragraph is exempt: WCAG 2.5.8 carves out
      // targets inline in a sentence.
      const inlineInText =
        cs.display === 'inline' &&
        el.parentElement &&
        ['P', 'LI', 'SPAN', 'DD', 'TD'].includes(el.parentElement.tagName);
      if (inlineInText) continue;
      if (r.height >= MIN_TOUCH || r.width >= MIN_TOUCH) continue;
      add(
        'touch-target',
        'minor',
        `interactive element is ${Math.round(r.width)}x${Math.round(r.height)}, under the ${MIN_TOUCH}px minimum`,
        { selector: describe(el), sample: text(el) }
      );
    }
  }

  /* --------------------------------------- 6. rendered text contrast */

  // The page reports *raw colour strings*; all parsing, compositing, and the
  // ratio itself happen in Node via `src/lib/contrast.ts`.
  //
  // Two reasons not to do it here. `page.evaluate` serialises the function and
  // closes over nothing, so the shared import is unreachable. And normalising
  // colours in the page is a trap: Chrome returns `oklch(0.505 0.213 27.518)`
  // for `backgroundColor` and returns it *unchanged* from a probe element, so
  // an `rgb()`-only parser reads every Tailwind default as transparent, walks
  // past it, and reports the white hero text on a gradient band as white on
  // white. The Node parser handles oklch, so the strings go there untouched.

  /**
   * Colour stops inside a gradient — a band is not one colour.
   *
   * Tailwind v4 emits gradients as `linear-gradient(..., var(--color-primary-600),
   * var(--color-primary-700))`, so the raw `background-image` string contains no
   * literal colour at all. Each `var()` is resolved against the element's own
   * computed custom properties; without that step the stop list comes back
   * empty and the band silently falls back to the page background, which is how
   * white hero text on a blue band gets reported as white on white.
   */
  const gradientStops = (image, node) => {
    if (!image || image === 'none' || !image.includes('gradient')) return [];
    const resolved = image.replace(
      /var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([^)]*))?\)/gi,
      (_, name, fallback) => {
        const value = getComputedStyle(node).getPropertyValue(name).trim();
        return value || (fallback ?? '').trim();
      }
    );
    return [
      ...resolved.matchAll(
        /rgba?\([^)]+\)|oklch\([^)]+\)|oklab\([^)]+\)|hsla?\([^)]+\)|#[0-9a-f]{3,8}/gi
      ),
    ].map(m => m[0]);
  };

  /**
   * The alpha component of a computed CSS colour, or 1 when it is opaque.
   *
   * Written generically rather than per-syntax because the browser picks the
   * notation: `bg-white/10` comes back as `oklab(... / 0.1)`, a Tailwind default
   * as `oklch(...)`, a plain token as `rgb(...)`, and `color-mix` output as
   * something else again. Pattern-matching a fixed list is how the hero's
   * translucent chips came to be treated as opaque white.
   */
  const alphaOf = value => {
    if (!value || value === 'transparent') return 0;
    // Modern space-separated syntax: `rgb(0 0 0 / 0.5)`, `oklab(L a b / 0.1)`.
    const slash = value.match(/\/\s*([\d.]+%?)\s*\)/);
    if (slash) {
      const n = parseFloat(slash[1]);
      return slash[1].endsWith('%') ? n / 100 : n;
    }
    // Legacy comma syntax: `rgba(0, 0, 0, 0.5)`.
    const legacy = value.match(
      /^(?:rgba|hsla|hwb|lab|lch|oklab|oklch|color)\([^)]*,\s*([\d.]+%?)\s*\)$/i
    );
    if (legacy) {
      const n = parseFloat(legacy[1]);
      return legacy[1].endsWith('%') ? n / 100 : n;
    }
    return 1;
  };

  /**
   * The paint stack behind this element, from nearest to farthest.
   *
   * CSS paints in a fixed order that a naive "walk up and collect" gets wrong:
   * an element's own translucent `background-color` is on top, an ancestor's
   * `background-image` (a gradient) is painted above that ancestor's own
   * `background-color`, and everything further up is behind the gradient — not
   * visible at all.
   *
   * So the walk stops at the first gradient it meets and returns the gradient
   * stops as the base, with the translucent layers collected so far stacked on
   * top. Collecting all the way to `<body>` and treating the page background as
   * a candidate is what makes white hero text on a blue band get reported as
   * white on white.
   */
  const backgroundStack = el => {
    const layers = []; // translucent background-colors, nearest first
    let gradient = []; // stops of the nearest gradient, empty if none
    let node = el;

    while (node && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      const alpha = alphaOf(cs.backgroundColor);

      if (alpha > 0) {
        if (alpha >= 0.999) {
          // Fully opaque: nothing behind it can matter.
          return { layers: [...layers, cs.backgroundColor], gradient };
        }
        layers.push(cs.backgroundColor);
      }

      const stops = gradientStops(cs.backgroundImage, node);
      if (stops.length) {
        gradient = stops;
        break;
      }

      node = node.parentElement;
    }

    return { layers, gradient };
  };

  const seen = new Set();
  const contrastSamples = [];
  for (const el of document.querySelectorAll(
    'p, span, a, li, h1, h2, h3, h4, h5, h6, dt, dd, label, button, td, th, legend, figcaption'
  )) {
    const own = [...el.childNodes]
      .filter(n => n.nodeType === 3)
      .map(n => n.textContent.trim())
      .join(' ')
      .trim();
    if (own.length < 2) continue; // skip pure whitespace and single glyphs

    const cs = getComputedStyle(el);
    if (
      cs.visibility === 'hidden' ||
      cs.display === 'none' ||
      cs.opacity === '0'
    )
      continue;
    if (el.closest('[aria-hidden="true"]')) continue;
    if (isVisuallyHidden(el)) continue;

    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.bottom < 0 || r.top > window.innerHeight * 40) continue; // offscreen

    const { layers, gradient } = backgroundStack(el);

    // Deduplicate: one finding per (colour set, size, class), or a 200-row
    // table would bury the real problems.
    const key = `${layers.join('|')}|${gradient.join('|')}|${cs.fontSize}|${el.className}`;
    if (seen.has(key)) continue;
    seen.add(key);

    contrastSamples.push({
      selector: describe(el),
      sample: own.slice(0, 60),
      fg: cs.color,
      bgLayers: layers,
      bgGradient: gradient,
      fontSize: parseFloat(cs.fontSize),
      weight: Number(cs.fontWeight) || 400,
    });
  }

  /* --------------------------------- 7. headings and landmarks, for a11y */

  const h1s = document.querySelectorAll('h1');
  if (h1s.length === 0) {
    add('a11y', 'major', 'page has no <h1>');
  } else if (h1s.length > 1) {
    add('a11y', 'minor', `page has ${h1s.length} <h1> elements`);
  }
  if (!document.querySelector('main')) {
    add('a11y', 'major', 'page has no <main> landmark');
  }

  return { findings, contrastSamples, vw };
}

const SEVERITY_ORDER = { blocker: 0, major: 1, minor: 2, note: 3 };

/** WCAG "large text": >=24px, or >=18.66px when bold. */
function aaThreshold(fontSize, weight) {
  const isLarge = fontSize >= 24 || (fontSize >= 18.66 && weight >= 700);
  return { need: isLarge ? 3 : 4.5, isLarge };
}

/**
 * Every surface this text could be sitting on.
 *
 * The layers come nearest-first, so they composite in reverse: the farthest
 * layer is the base and each nearer one is alpha-blended over it. When the
 * stack bottoms out in a gradient, each of its stops is a separate candidate —
 * a band is not one colour, and a label that clears the ratio at one end and
 * fails at the other has failed.
 */
function backgroundCandidates(sample) {
  const bases = [];
  if (sample.bgGradient?.length) {
    for (const stop of sample.bgGradient) {
      try {
        bases.push(parseColorChannels(stop));
      } catch {
        /* skip an unparseable stop rather than guess at it */
      }
    }
  }
  if (bases.length === 0) bases.push({ r: 255, g: 255, b: 255, a: 1 });

  const out = new Set();
  for (const base of bases) {
    let acc = base;
    // Farthest first: the last layer in the array is the closest to the page.
    for (let i = sample.bgLayers.length - 1; i >= 0; i--) {
      let layer;
      try {
        layer = parseColorChannels(sample.bgLayers[i]);
      } catch {
        continue;
      }
      if (layer.a === 0) continue;
      acc = compositeOver(layer, acc);
    }
    out.add(toHex(acc));
  }
  return [...out];
}

/** Turn the page's colour samples into contrast findings. */
function judgeContrast(samples) {
  const out = [];
  for (const s of samples) {
    const { need, isLarge } = aaThreshold(s.fontSize, s.weight);
    const candidates = backgroundCandidates(s);

    // The text's own alpha composites over the surface too, so `text-white/85`
    // is measured as it renders rather than as pure white. Compositing needs a
    // base, and any candidate will do — the same value is then reused below
    // against every candidate, so a translucent label is judged on the same
    // footing as an opaque one.
    let fgRgba;
    try {
      fgRgba = parseColorChannels(s.fg);
    } catch {
      continue;
    }
    if (fgRgba.a === 0) continue;
    const fgHex = toHex(
      compositeOver(fgRgba, parseColorChannels(candidates[0]))
    );

    let worst = { ratio: Infinity, bg: candidates[0] };
    for (const bg of candidates) {
      const ratio = roundRatio(fgHex, bg);
      if (ratio < worst.ratio) worst = { ratio, bg };
    }
    if (worst.ratio >= need) continue;

    out.push({
      kind: 'contrast',
      severity: worst.ratio < 3 ? 'blocker' : 'major',
      detail: `text ${worst.ratio}:1, needs ${need}:1 (${Math.round(s.fontSize)}px${
        s.weight >= 700 ? ' bold' : ''
      }, ${fgHex} on ${worst.bg})`,
      selector: s.selector,
      sample: s.sample,
      isLarge,
    });
  }
  return out;
}

const browser = await chromium.launch();
const results = [];

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: 'reduce',
  });
  await context.addInitScript(() => {
    try {
      localStorage.setItem('bc-volunteer-popup', '0');
    } catch {}
  });
  const page = await context.newPage();

  for (const route of routes) {
    try {
      await page.goto(`${base}${route.path}`, {
        waitUntil: 'networkidle',
        timeout: 30_000,
      });
      await page.waitForTimeout(250);
      const { findings, contrastSamples } = await page.evaluate(auditInPage);
      const all = [...findings, ...judgeContrast(contrastSamples)];
      results.push({
        width,
        path: route.path,
        name: route.name,
        findings: all,
      });
      const worst = all.reduce(
        (acc, f) =>
          SEVERITY_ORDER[f.severity] < SEVERITY_ORDER[acc] ? f.severity : acc,
        'note'
      );
      process.stdout.write(
        `${all.length === 0 ? '.' : worst === 'blocker' ? 'B' : worst === 'major' ? 'M' : 'm'} ${String(width).padStart(4)} ${route.path} (${all.length})\n`
      );
    } catch (err) {
      results.push({
        width,
        path: route.path,
        name: route.name,
        findings: [{ kind: 'load', severity: 'blocker', detail: err.message }],
      });
      process.stdout.write(`x ${String(width).padStart(4)} ${route.path}\n`);
    }
  }
  await context.close();
}

await browser.close();

// ---------------------------------------------------------------- report

const all = results.flatMap(r =>
  r.findings.map(f => ({ ...f, width: r.width, path: r.path }))
);
const counts = all.reduce((acc, f) => {
  acc[f.severity] = (acc[f.severity] ?? 0) + 1;
  return acc;
}, {});

console.log(`\n${'='.repeat(72)}`);
console.log(
  `${results.length} route/breakpoint pairs, ${all.length} findings ` +
    `(${
      Object.entries(counts)
        .map(([k, v]) => `${v} ${k}`)
        .join(', ') || 'none'
    })`
);

const byKind = all.reduce((acc, f) => {
  acc[f.kind] = (acc[f.kind] ?? 0) + 1;
  return acc;
}, {});
console.log(
  `by kind: ${Object.entries(byKind)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} ${v}`)
    .join(', ')}`
);

const grouped = all.reduce((acc, f) => {
  const key = `${f.kind}|${f.detail.replace(/[\d]+/g, 'N')}`;
  (acc[key] ??= {
    kind: f.kind,
    detail: f.detail,
    severity: f.severity,
    sites: [],
  }).sites.push(f);
  return acc;
}, {});

console.log(`\n${'-'.repeat(72)}`);
for (const g of Object.values(grouped).sort(
  (a, b) =>
    SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
    b.sites.length - a.sites.length
)) {
  console.log(
    `\n[${g.severity.toUpperCase()}] ${g.kind} — ${g.sites.length} site(s)\n  ${g.detail}`
  );
  const sample = g.sites[0];
  if (sample.selector) console.log(`  e.g. ${sample.selector}`);
  if (sample.sample) console.log(`  text: "${sample.sample}"`);
  const where = [...new Set(g.sites.map(s => `${s.width}px ${s.path}`))];
  for (const w of where.slice(0, 8)) console.log(`  at ${w}`);
  if (where.length > 8) console.log(`  … ${where.length - 8} more locations`);
}

if (flag('json')) {
  writeFileSync(flag('json'), JSON.stringify({ results, all }, null, 2));
  console.log(`\nwritten ${flag('json')}`);
}

const blockers = all.filter(f => f.severity === 'blocker').length;
const majors = all.filter(f => f.severity === 'major').length;
console.log(
  `\n${blockers ? `${blockers} blocker(s), ` : ''}${majors ? `${majors} major` : 'no blockers or majors'}`
);
