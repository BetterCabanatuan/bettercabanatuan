#!/usr/bin/env node
/**
 * Contrast audit — the gate behind docs/DESIGN-TOKENS.md.
 *
 *   node scripts/check-contrast.mjs           # report, exit 1 on any failure
 *   node scripts/check-contrast.mjs --report  # report, always exit 0
 *
 * Three things are checked, in order:
 *
 *   1. DRIFT    every colour in src/lib/designTokens.ts still matches the
 *               `@theme` block in src/index.css. If they disagree, the token
 *               module is describing colours the site does not render.
 *   2. PAIRS    every entry in `contrastPairs` clears its WCAG 2.1 threshold.
 *   3. AUDIT    every `text-*` colour utility actually present in src/ is
 *               measured against the background it is used on, and anything
 *               below 4.5:1 is reported.
 *
 * Colours are read from the real sources — the project's `@theme` overrides and
 * `node_modules/tailwindcss/theme.css` — rather than from a hand-transcribed
 * copy of the palette, so a value that changes upstream is measured as changed.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrastRatio, roundRatio } from '../src/lib/contrast.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const reportOnly = process.argv.includes('--report');

const C = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

/* ------------------------------------------------------------- palette io */

function readCssVarBlocks(cssPath) {
  const css = readFileSync(cssPath, 'utf8');
  const vars = {};
  // `--color-primary-600` and `--color-surface-inverse` are both tokens; the
  // numeric step is optional. Matching only `family-step` silently dropped every
  // non-numeric token from the palette, which then looked like drift.
  for (const m of css.matchAll(
    /--color-([a-z][a-z0-9-]*?)(?:-(\d{2,3}))?\s*:\s*([^;]+);/g
  )) {
    const [, name, step, value] = m;
    vars[step ? `${name}-${step}` : name] = value.trim();
  }
  return vars;
}

// Project overrides win; Tailwind's shipped defaults fill the rest.
const projectTheme = readCssVarBlocks(join(root, 'src/index.css'));
const tailwindTheme = readCssVarBlocks(
  join(root, 'node_modules/tailwindcss/theme.css')
);
const palette = { ...tailwindTheme, ...projectTheme };

const SURFACES = {
  page: projectTheme['gray-50'] === undefined ? '#ffffff' : '#ffffff',
  subtle: projectTheme['gray-50'] ?? '#f8f9fa',
  sunken: projectTheme['gray-100'] ?? '#f1f3f5',
  info: projectTheme['primary-50'] ?? '#eff6ff',
  deep: projectTheme['primary-900'] ?? '#00142f',
};

/* ------------------------------------------------- 1. tokens vs stylesheet */

const tokensSrc = readFileSync(join(root, 'src/lib/designTokens.ts'), 'utf8');

/** Pull `name: '#hex'` pairs out of a token group by its source line comment. */
function tokenGroup(prefix) {
  const block = tokensSrc.match(
    new RegExp(`export const ${prefix} = \\{([\\s\\S]*?)\\n\\} as const;`)
  );
  if (!block) return {};
  const out = {};
  for (const m of block[1].matchAll(/(\w+):\s*'(#[0-9a-fA-F]{3,8})'/g)) {
    out[m[1]] = m[2];
  }
  return out;
}

const drift = [];

/**
 * Explicit token -> `@theme` key mapping. Written out rather than derived,
 * because several tokens intentionally have no theme key (page white is not a
 * palette step) and a derived mapping silently checked the wrong thing.
 */
const DRIFT_MAP = {
  'content.strong': 'gray-900',
  'content.default': 'gray-700',
  'content.muted': 'gray-600',
  'content.subtle': 'gray-500',
  'content.decorative': 'gray-400',
  'surface.subtle': 'gray-50',
  'surface.sunken': 'gray-100',
  'surface.info': 'primary-50',
  'surface.danger': 'error-50',
  'link.base': 'primary-600',
  'link.hover': 'primary-700',
  'link.visited': 'primary-800',
  focus: 'primary-600',
  'brand.tile': 'primary-50',
  'brand.solid': 'primary-600',
  'brand.solidHover': 'primary-700',
  'brand.deep': 'primary-900',
  'brand.onDeep': 'primary-200',
  'border.subtle': 'gray-200',
  'border.default': 'gray-300',
  'border.strong': 'gray-400',
  'surface.inverse': 'surface-inverse',
  'badge.info.bg': 'badge-info',
  'badge.info.fg': 'badge-info-fg',
  'badge.warning.bg': 'badge-warning',
  'badge.warning.fg': 'badge-warning-fg',
  'badge.success.bg': 'badge-success',
  'badge.success.fg': 'badge-success-fg',
  'badge.neutral.bg': 'badge-neutral',
  'badge.neutral.fg': 'badge-neutral-fg',
  'badge.accent.bg': 'badge-accent',
  'badge.accent.fg': 'badge-accent-fg',
};

/**
 * Tokens deliberately outside the palette, so the drift check skips them
 * instead of reporting a phantom mismatch. `surface.page` is literal white —
 * white is not a ramp step. `brand.onDeepBody` is an alpha-composited white
 * measured by the contrast math directly, not a standalone colour.
 */
const NOT_IN_THEME = new Set(['surface.page', 'brand.onDeepBody']);

function collectTokenGroups() {
  const out = {};
  for (const name of ['content', 'surface', 'link', 'brand', 'border']) {
    const block = tokensSrc.match(
      new RegExp(`export const ${name} = \\{([\\s\\S]*?)\\n\\} as const;`)
    );
    if (!block) continue;
    for (const m of block[1].matchAll(
      /(\w+):\s*'(#[0-9a-fA-F]{3,8}|rgba?\([^']+\))'/g
    )) {
      out[`${name}.${m[1]}`] = m[2];
    }
  }
  const focus = tokensSrc.match(/export const focus = '(#[0-9a-f]{6})';/)?.[1];
  if (focus) out.focus = focus;

  // Badge pairs are nested one level deeper: { info: { bg, fg, ring } }.
  const badgeBlock = tokensSrc.match(
    /export const badge[\s\S]*?= \{([\s\S]*?)\n {2}\};/
  );
  if (badgeBlock) {
    for (const m of badgeBlock[1].matchAll(
      /(\w+):\s*\{\s*bg:\s*'(#[0-9a-f]{6})',\s*fg:\s*'(#[0-9a-f]{6})'/g
    )) {
      out[`badge.${m[1]}.bg`] = m[2];
      out[`badge.${m[1]}.fg`] = m[3];
    }
  }
  return out;
}

const allTokens = collectTokenGroups();
for (const [name, value] of Object.entries(allTokens)) {
  if (NOT_IN_THEME.has(name)) continue;
  const themeKey = DRIFT_MAP[name];
  if (!themeKey) {
    drift.push(`${name}: no DRIFT_MAP entry in check-contrast.mjs`);
    continue;
  }
  const themed = palette[themeKey];
  if (!themed) {
    drift.push(`${name}: no --color-${themeKey} in src/index.css`);
    continue;
  }
  // Only compare when both sides are plain hex we can compare directly.
  if (!/^#[0-9a-f]{6}$/i.test(themed) || !/^#[0-9a-f]{6}$/i.test(value))
    continue;
  if (themed.toLowerCase() !== value.toLowerCase()) {
    drift.push(
      `${name}: designTokens ${value} != index.css ${themed} (--color-${themeKey})`
    );
  }
}

/* --------------------------------------------------------- 2. token pairs */

// Node strips the TypeScript annotations natively, so the pair registry is
// read from the real module rather than regex-scraped out of its source. A
// hand-rolled parser silently drifts; this cannot.
const { contrastPairs: pairs, forbiddenPairs } = await import(
  join(root, 'src/lib/designTokens.ts')
);

const pairResults = pairs.map(p => ({
  ...p,
  ratio: roundRatio(p.fg, p.bg),
}));
const pairFailures = pairResults.filter(p => p.ratio < p.min);

/**
 * Forbidden pairs are reported with their measured ratio. They do not fail the
 * build on their own — they are traps that a human opts into — but a trap that
 * measures fine is a bug in this file, so that does fail.
 */
const forbiddenResults = forbiddenPairs.map(p => ({
  ...p,
  ratio: roundRatio(p.fg, p.bg),
}));
const forbiddenNotViolating = forbiddenResults.filter(p => p.ratio >= p.min);

/* ------------------------------------------------------- 3. usage audit */

function walk(dir, exts, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, exts, out);
    else if (exts.some(e => entry.endsWith(e))) out.push(full);
  }
  return out;
}

const files = walk(join(root, 'src'), ['.tsx', '.ts']);

/** Steps dark enough that light text is the norm rather than the exception. */
const DARK_STEPS = new Set([
  'gray-800',
  'gray-900',
  'primary-700',
  'primary-800',
  'primary-900',
  'primary-950',
  'error-700',
  'error-800',
  'error-900',
  'secondary-800',
  'secondary-900',
]);

/**
 * Resolve the background a `text-*` utility actually sits on.
 *
 * Measuring everything against white produces a wall of false positives — the
 * hero band is `bg-primary-900`, so `text-primary-200` scores 1.84:1 on white
 * and a perfectly compliant 10.00:1 on the band it really renders on.
 *
 * The unit of analysis is a single quoted class string, not the line: a JSX
 * line often holds two sibling elements, and pairing one element's text with
 * the other's background invents failures that do not exist. So each quoted
 * segment is measured against the background declared in that same segment.
 * When a segment declares no background, white is the correct assumption —
 * that is the default page surface.
 */
function analyzeSegment(segment) {
  const texts = [];
  for (const m of segment.matchAll(
    /(?:^|[\s"'`])(?:text|placeholder)-([a-z]+)-(\d{2,3})\b/g
  )) {
    const key = `${m[1]}-${m[2]}`;
    if (palette[key]) texts.push(key);
  }
  if (texts.length === 0) return [];

  let bgKey = null;
  // `from-` / `via-` / `to-` are gradient stops and describe the backdrop just
  // as much as `bg-` does. The hero bands are built from stops, so without
  // this every light-on-dark hero label reads as a false failure on white.
  for (const m of segment.matchAll(
    /(?:^|[\s"'`])(?:bg|from|via|to)-([a-z]+)-(\d{2,3})(?:\/\d+)?\b/g
  )) {
    const key = `${m[1]}-${m[2]}`;
    if (!palette[key]) continue;
    // A dark step inverts the assumption and is the more informative surface;
    // otherwise the lightest tint present is the page it sits on.
    if (DARK_STEPS.has(key)) {
      bgKey = key;
      break;
    }
    if (!bgKey || Number(m[2]) < Number(bgKey.split('-')[1])) bgKey = key;
  }

  const bgValue = bgKey ? palette[bgKey] : SURFACES.page;
  const label = bgKey ?? 'white';
  return texts.map(key => ({
    key: `text-${key}`,
    ratio: roundRatio(palette[key], bgValue),
    bg: label,
  }));
}

const usage = new Map(); // utility -> [{file, line, bg, ratio}]

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  src.split('\n').forEach((line, i) => {
    // Each quoted run is one class string: double-quoted attributes, template
    // literals, and the object-literal style this codebase uses for card
    // variants ('bg-accent-50 text-accent-600').
    const segments = line.match(/"[^"]*"|'[^']*'|`[^`]*`/g) ?? [];
    const found = segments.flatMap(analyzeSegment);
    for (const hit of found) {
      if (!usage.has(hit.key)) usage.set(hit.key, []);
      usage.get(hit.key).push({
        file: relative(root, file),
        line: i + 1,
        bg: hit.bg,
        ratio: hit.ratio,
      });
    }
  });
}

/**
 * Per-utility verdict. A utility passes if every one of its sites clears
 * 4.5:1; `iconOnly` means the only sub-4.5 sites are decorative (an icon with
 * no adjacent text), which is judged by hand from the reported file:line.
 */
const audited = [];
for (const [key, sites] of [...usage.entries()].sort()) {
  const worst = sites.reduce((a, b) => (b.ratio < a.ratio ? b : a));
  const value = palette[key.replace(/^text-/, '')];
  audited.push({
    key,
    value,
    onPage: roundRatio(value, SURFACES.page),
    onSubtle: roundRatio(value, SURFACES.subtle),
    count: sites.length,
    worst,
    failing: sites.filter(s => s.ratio < 4.5),
  });
}

const severe = audited.filter(a => a.worst.ratio < 3);
const largeOnly = audited.filter(
  a => a.worst.ratio >= 3 && a.worst.ratio < 4.5
);
const textFails = audited.filter(a => a.worst.ratio < 4.5);

/* --------------------------------------------------------------- report */

const line = (ch = '-') => console.log(C.dim + ch.repeat(72) + C.reset);

console.log('');
console.log(C.bold + 'CONTRAST AUDIT' + C.reset);
line('=');

console.log('');
console.log(C.bold + '1. Token / stylesheet drift' + C.reset);
if (drift.length === 0) {
  console.log(
    `  ${C.green}ok${C.reset}  designTokens.ts and src/index.css agree`
  );
} else {
  drift.forEach(d => console.log(`  ${C.red}FAIL${C.reset} ${d}`));
}

console.log('');
console.log(C.bold + '2. Token pairs vs WCAG 2.1' + C.reset);
console.log(C.dim + '   pair'.padEnd(42) + 'ratio  min   result' + C.reset);
for (const p of pairResults) {
  const pass = p.ratio >= p.min;
  const mark = pass ? `${C.green}pass${C.reset}` : `${C.red}FAIL${C.reset}`;
  const kind = p.large ? `${C.dim} (non-text)${C.reset}` : '';
  console.log(
    '   ' +
      p.role.padEnd(42) +
      String(p.ratio.toFixed(2)).padStart(5) +
      '  ' +
      String(p.min).padStart(4) +
      '  ' +
      mark +
      kind
  );
}
if (pairFailures.length) {
  console.log(
    `   ${C.red}${pairFailures.length} pair(s) below target${C.reset}`
  );
} else {
  const worst = Math.min(...pairs.map(p => roundRatio(p.fg, p.bg) / p.min));
  console.log(
    `   ${C.green}ok${C.reset}  all ${pairs.length} pairs pass (tightest margin ${worst.toFixed(2)}x target)`
  );
}

console.log('');
console.log(C.bold + '3. text-* colour usage in src/' + C.reset);
console.log(
  C.dim + '   utility'.padEnd(22) + 'on white  worst   uses  result' + C.reset
);
for (const a of audited) {
  const result =
    a.worst.ratio < 3
      ? `${C.red}FAIL${C.reset}`
      : a.worst.ratio < 4.5
        ? `${C.yellow}large/UI only${C.reset}`
        : `${C.green}AA body${C.reset}`;
  console.log(
    '   ' +
      a.key.padEnd(22) +
      a.onPage.toFixed(2).padStart(7) +
      a.worst.ratio.toFixed(2).padStart(8) +
      ` (${a.worst.bg})`.padEnd(0) +
      ' '.repeat(Math.max(1, 14 - a.worst.bg.length)) +
      String(a.count).padStart(5) +
      '  ' +
      result
  );
}

if (textFails.length) {
  console.log('');
  console.log(
    C.bold + '   Sites below 4.5:1 — advisory. Verify each, then:' + C.reset
  );
  console.log(
    C.dim +
      '   This pass reads class strings, so it cannot see a background set on an' +
      C.reset
  );
  console.log(
    C.dim +
      '   ancestor — the hero bands are built from gradient stops on a parent,' +
      C.reset
  );
  console.log(
    C.dim +
      '   so their light-on-dark labels show up here as failures on white. The' +
      C.reset
  );
  console.log(
    C.dim +
      '   authoritative check is the rendered one in e2e/a11y-contrast.spec.ts,' +
      C.reset
  );
  console.log(
    C.dim +
      '   which reads computed styles from a live page. Treat these as a worklist.' +
      C.reset
  );
  for (const a of textFails) {
    console.log(
      `   ${C.yellow}${a.key}${C.reset} — ${a.failing.length}/${a.count} sites under 4.5`
    );
    for (const site of a.failing.slice(0, 5)) {
      console.log(
        C.dim +
          `        ${site.ratio.toFixed(2)}:1 on ${site.bg}  ${site.file}:${site.line}` +
          C.reset
      );
    }
    if (a.failing.length > 5) {
      console.log(C.dim + `        … ${a.failing.length - 5} more` + C.reset);
    }
  }
}

line('=');
console.log(C.bold + '4. Known traps' + C.reset);
console.log(
  C.dim +
    '   these measure below target by design — do not reach for them' +
    C.reset
);
for (const f of forbiddenResults) {
  console.log(
    '   ' +
      f.role.padEnd(50) +
      String(f.ratio.toFixed(2)).padStart(5) +
      `  needs ${f.min}`
  );
}
if (forbiddenNotViolating.length) {
  console.log(
    `   ${C.red}these no longer measure as traps — delete or restate them:${C.reset}`
  );
  forbiddenNotViolating.forEach(f => console.log(`     ${f.role}`));
}

line('=');
// Section 3 is advisory by design. The gate covers what static analysis can
// actually know: token/stylesheet drift, the declared token pairs, and whether
// the trap list is still truthful. Rendered contrast — where the background may
// come from an ancestor — is gated by e2e/a11y-contrast.spec.ts instead.
const failed =
  drift.length > 0 ||
  pairFailures.length > 0 ||
  forbiddenNotViolating.length > 0;

if (failed && !reportOnly) {
  console.log(
    `${C.red}FAILED${C.reset} — ${drift.length} drift, ${pairFailures.length} failing pair(s), ${forbiddenNotViolating.length} stale trap(s)`
  );
  process.exit(1);
}
console.log(
  failed
    ? `${C.yellow}ISSUES FOUND${C.reset} (not blocking in --report mode)`
    : `${C.green}PASS${C.reset} — ${pairs.length} token pairs compliant, no drift. ${textFails.length} utility/utilities flagged for rendered review.`
);
console.log('');

// Keep the unused-import linter honest about the deep import above.
void contrastRatio;
void largeOnly;
void severe;
