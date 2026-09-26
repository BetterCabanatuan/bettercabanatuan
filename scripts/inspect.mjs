#!/usr/bin/env node
/**
 * Screenshot a specific scroll region of a page.
 *
 *   node scripts/inspect.mjs / 1900 900 out.png
 *   node scripts/inspect.mjs /government/officials 0 1400 --width 375
 *
 * Full-page shots of a long page are unreadable in review, so this grabs one
 * viewport-tall window at a time — which is how a defect gets pinned to a
 * scroll position in the QA log.
 */

import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const argv = process.argv.slice(2);
const positional = argv.filter(a => !a.startsWith('--'));
const flag = name => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};

const path = positional[0] ?? '/';
const scrollY = Number(positional[1] ?? 0);
const height = Number(positional[2] ?? 900);
const out = positional[3] ?? '.qa-shots/inspect.png';
const width = Number(flag('width') ?? 1440);
const base = process.env.QA_BASE_URL ?? 'http://localhost:4001';

mkdirSync(dirname(out), { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width, height },
  reducedMotion: 'reduce',
});
await context.addInitScript(() => {
  try {
    localStorage.setItem('bc-volunteer-popup', '0');
  } catch {}
});
const page = await context.newPage();
await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.evaluate(y => window.scrollTo(0, y), scrollY);
await page.waitForTimeout(250);
await page.screenshot({ path: out });
console.log(`${out}  ${width}x${height} @ y=${scrollY}  ${path}`);
await browser.close();
