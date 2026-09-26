import { expect, test } from '@playwright/test';
import { ALL_PATHS, WIDTHS } from '../scripts/routes.mjs';

/**
 * The responsive sweep, as a build gate.
 *
 * `scripts/qa-audit.mjs` is the working tool: it walks every route at every
 * breakpoint and prints a ranked defect list with severities, which is what the
 * QA log in docs/RESPONSIVE-QA.md is built from. This spec asserts the subset
 * that must never regress, so a new page cannot quietly reintroduce a
 * page-wide horizontal scroll or a second <h1>.
 *
 * The two overlap but do not duplicate: the script reports everything for a
 * human to triage, this file fails the build on the things that are
 * unambiguous defects rather than judgement calls.
 *
 * Everything is collected in a single pass per breakpoint. Splitting the checks
 * across separate tests would mean re-navigating every route for each one —
 * roughly 270 page loads instead of 120 — for the same coverage.
 */

const MIN_TARGET = 44; // WCAG 2.5.8 target size

test.describe('responsive layout invariants', () => {
  for (const width of WIDTHS) {
    test(`every route holds up at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });

      const problems: string[] = [];

      for (const path of ALL_PATHS) {
        await page.goto(path);

        /*
         * Two waits, and both are needed.
         *
         * `networkidle` because several pages load their content through a
         * dynamic `import()` — the sub-service and department pages fetch
         * markdown after first paint. Asserting during that window measures a
         * half-rendered page and reports "0 <h1>" for a page that has one.
         *
         * The `<main>` wait because this is a client-rendered SPA: `goto`
         * resolves when the document loads, which is before React has painted
         * anything at all.
         */
        await page.waitForLoadState('networkidle');
        await page.waitForFunction(
          () => document.querySelector('main h1') !== null,
          undefined,
          { timeout: 15_000 }
        );

        const found = await page.evaluate(minTarget => {
          const issues: string[] = [];
          const de = document.documentElement;

          /* --- the document must not scroll sideways --- */
          if (de.scrollWidth > de.clientWidth + 1) {
            // Name the widest element that is not clipped by an ancestor, so
            // the failure says what to fix rather than only that something is
            // wrong.
            const guilty = [...document.querySelectorAll('body *')]
              .map(el => ({ el, r: el.getBoundingClientRect() }))
              .filter(({ el, r }) => {
                if (!r.width) return false;
                if (r.right <= de.clientWidth + 1) return false;
                const cs = getComputedStyle(el);
                if (cs.position === 'fixed' || cs.position === 'absolute')
                  return false;
                // Clipped by a scrolling or hiding ancestor: invisible, so not
                // the cause of a document-level scroll.
                let node = el.parentElement;
                while (node && node !== document.body) {
                  if (
                    /hidden|auto|scroll|clip/.test(
                      getComputedStyle(node).overflowX
                    )
                  )
                    return false;
                  node = node.parentElement;
                }
                return true;
              })
              .sort((a, b) => b.r.right - a.r.right)[0];

            issues.push(
              `scrolls sideways: ${de.scrollWidth} > ${de.clientWidth}` +
                (guilty
                  ? `, widest offender ${guilty.el.tagName.toLowerCase()}.${(
                      guilty.el.className || ''
                    )
                      .toString()
                      .split(/\s+/)
                      .slice(0, 3)
                      .join('.')}`
                  : '')
            );
          }

          /* --- exactly one main landmark, one h1 --- */
          const mains = document.querySelectorAll('main').length;
          if (mains !== 1) issues.push(`${mains} <main> elements`);
          const h1s = document.querySelectorAll('h1').length;
          if (h1s !== 1) issues.push(`${h1s} <h1> elements`);

          /* --- a short final card row must be centred --- */
          for (const list of document.querySelectorAll('[data-card-grid]')) {
            const items = [...list.children].filter(
              c => getComputedStyle(c).display !== 'none'
            );
            if (items.length < 2) continue;

            const rows = new Map<number, number>();
            for (const item of items) {
              const r = item.getBoundingClientRect();
              if (!r.height) continue;
              const top = Math.round(r.top);
              const key =
                [...rows.keys()].find(k => Math.abs(k - top) <= 4) ?? top;
              rows.set(key, (rows.get(key) ?? 0) + 1);
            }
            if (rows.size < 2) continue;

            const counts = [...rows.entries()].sort((a, b) => a[0] - b[0]);
            const perRow = Math.max(...counts.map(([, n]) => n));
            const lastTop = counts.at(-1)![0];
            if (counts.at(-1)![1] === perRow) continue; // full final row

            // Centring the short row is the entire reason CardGrid is
            // flex-wrap rather than a CSS grid.
            const lastRow = items.filter(
              i =>
                Math.abs(Math.round(i.getBoundingClientRect().top) - lastTop) <=
                4
            );
            const listRect = list.getBoundingClientRect();
            const lead =
              lastRow[0].getBoundingClientRect().left - listRect.left;
            const trail =
              listRect.right - lastRow.at(-1)!.getBoundingClientRect().right;
            if (Math.abs(lead - trail) > 8) {
              issues.push(
                `grid "${list.getAttribute('aria-label') ?? '(unlabelled)'}" rows ${counts
                  .map(([, n]) => n)
                  .join(
                    '+'
                  )} — short final row not centred (${Math.round(lead)}px before, ${Math.round(trail)}px after)`
              );
            }
          }

          /* --- chrome targets are big enough to tap --- */
          if (de.clientWidth < 768) {
            for (const root of document.querySelectorAll(
              'nav, header, footer'
            )) {
              for (const el of root.querySelectorAll('a, button')) {
                const cs = getComputedStyle(el);
                if (cs.display === 'none' || cs.visibility === 'hidden')
                  continue;
                const r = el.getBoundingClientRect();
                if (!r.width || !r.height) continue;
                if (r.height >= minTarget || r.width >= minTarget) continue;
                issues.push(
                  `tap target ${el.tagName.toLowerCase()} "${(el.textContent || '').trim().slice(0, 24)}" is ${Math.round(r.width)}x${Math.round(r.height)}`
                );
              }
            }
          }

          return issues;
        }, MIN_TARGET);

        for (const issue of found) problems.push(`${path}: ${issue}`);
      }

      expect(problems, `layout problems at ${width}px`).toEqual([]);
    });
  }
});
