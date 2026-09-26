#!/usr/bin/env node
/**
 * Responsive screenshot sweep.
 *
 *   node scripts/shoot.mjs                     # every route, every breakpoint
 *   node scripts/shoot.mjs /government/officials
 *   node scripts/shoot.mjs --widths 375,768
 *   node scripts/shoot.mjs --full              # full-page, not just the fold
 *
 * Writes PNGs to .qa-shots/<width>/<slug>.png. Used to eyeball layout at each
 * breakpoint and to attach evidence to defect reports; the assertions about
 * overlap and overflow live in e2e/, where they can fail a build.
 */

import { chromium } from '@playwright/test';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES, WIDTHS } from './routes.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(root, '.qa-shots');
const BASE = process.env.QA_BASE_URL ?? 'http://localhost:4001';

const argv = process.argv.slice(2);
const flag = name => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return undefined;
  const next = argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
};

const onlyPaths = argv.filter(a => a.startsWith('/'));
const widths = flag('widths')
  ? String(flag('widths')).split(',').map(Number)
  : WIDTHS;
const fullPage = Boolean(flag('full'));
const keep = Boolean(flag('keep'));

const routes = onlyPaths.length
  ? ROUTES.filter(r => onlyPaths.includes(r.path))
  : ROUTES;

if (!keep) {
  rmSync(OUT, { recursive: true, force: true });
}
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const errors = [];
const report = [];

for (const width of widths) {
  mkdirSync(join(OUT, String(width)), { recursive: true });
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  // The volunteer dialog covers the page on a first visit and would sit over
  // everything in the shot. Seed it dismissed so the sweep is deterministic.
  await context.addInitScript(() => {
    try {
      localStorage.setItem('bc-volunteer-popup', '0');
    } catch {}
  });

  const page = await context.newPage();
  page.on('console', m => {
    if (m.type() === 'error')
      errors.push(`[${width}] ${page.url()} ${m.text()}`);
  });
  page.on('pageerror', e =>
    errors.push(`[${width}] ${page.url()} pageerror: ${e.message}`)
  );

  for (const route of routes) {
    const url = `${BASE}${route.path}`;
    try {
      const res = await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30_000,
      });
      if (res && res.status() >= 400 && route.name !== 'not-found') {
        errors.push(`[${width}] ${route.path} -> HTTP ${res.status()}`);
      }
      // Let entrance animations settle so shots are not caught mid-fade.
      await page.waitForTimeout(350);

      const metrics = await page.evaluate(() => {
        const de = document.documentElement;
        return {
          scrollW: de.scrollWidth,
          clientW: de.clientWidth,
          scrollH: de.scrollHeight,
        };
      });

      const overflows = metrics.scrollW > metrics.clientW + 1;
      if (overflows) {
        errors.push(
          `[${width}] ${route.path} horizontal overflow: scrollWidth ${metrics.scrollW} > clientWidth ${metrics.clientW}`
        );
      }

      const file = join(OUT, String(width), `${route.name}.png`);
      await page.screenshot({ path: file, fullPage });
      report.push({ width, ...route, ...metrics, overflows, file });
      process.stdout.write(
        `${overflows ? '!' : '.'} ${String(width).padStart(4)} ${route.path}\n`
      );
    } catch (err) {
      errors.push(`[${width}] ${route.path} FAILED: ${err.message}`);
      process.stdout.write(
        `x ${String(width).padStart(4)} ${route.path} — ${err.message}\n`
      );
    }
  }
  await context.close();
}

await browser.close();

writeFileSync(
  join(OUT, 'report.json'),
  JSON.stringify({ report, errors }, null, 2)
);

console.log(`\n${report.length} shots -> ${OUT}`);
if (errors.length) {
  console.log(`\n${errors.length} issue(s):`);
  for (const e of errors) console.log(`  ${e}`);
  process.exitCode = 1;
} else {
  console.log('no console errors, no horizontal overflow');
}
