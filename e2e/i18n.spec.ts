import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { test, expect, type Page } from '@playwright/test';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const bundle = JSON.parse(
  readFileSync(resolve(rootDir, 'public/locales/en/common.json'), 'utf-8')
);

/** True when the token is a real translation key (so its appearance = a bug). */
function isTranslationKey(key: string): boolean {
  const base = key.replace(/_(zero|one|two|few|many|other)$/, '');
  let node: unknown = bundle;
  for (const segment of base.split('.')) {
    if (!node || typeof node !== 'object') return false;
    const record = node as Record<string, unknown>;
    if (segment in record) node = record[segment];
    else return Object.keys(record).some(k => k.startsWith(`${segment}_`));
  }
  return true;
}

/**
 * Raw translation keys render as "news.badge" instead of copy. These assertions
 * cover the surfaces that regressed when a new `news` block displaced the old
 * one; src/test/i18nKeys.test.ts covers every key statically.
 */
async function findLeaks(page: Page) {
  const text = await page.locator('body').innerText();
  const attributes = await page.evaluate(() =>
    [
      ...document.querySelectorAll(
        '[aria-label], [alt], [title], [placeholder]'
      ),
    ]
      .flatMap(el =>
        ['aria-label', 'alt', 'title', 'placeholder'].map(a =>
          el.getAttribute(a)
        )
      )
      .filter((v): v is string => Boolean(v))
      .join(' ')
  );

  const haystack = `${text}\n${attributes}`;
  const leaks = [
    ...new Set(
      [...haystack.matchAll(/[a-z][a-zA-Z0-9]*(?:\.[a-zA-Z0-9_]+)+/g)]
        .map(m => m[0])
        .filter(isTranslationKey)
    ),
  ];
  const placeholders = [
    ...new Set(haystack.match(/\{\{\s*[a-zA-Z0-9_]+\s*\}\}/g) ?? []),
  ];

  return { leaks, placeholders };
}

test.describe('no untranslated keys leak into the UI', () => {
  const routes = [
    '/',
    '/contact',
    '/about',
    '/statistics',
    '/government',
    '/government/news',
    '/government/officials',
    '/government/departments',
    '/government/barangays',
    '/transparency',
    '/services',
    '/hotlines',
    '/accessibility',
    '/sitemap',
    '/search',
  ];

  for (const route of routes) {
    test(`${route} renders no raw keys or placeholders`, async ({ page }) => {
      test.setTimeout(30_000);
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);

      const { leaks, placeholders } = await findLeaks(page);
      expect(leaks, `raw i18n keys on ${route}`).toEqual([]);
      expect(placeholders, `un-interpolated placeholders on ${route}`).toEqual(
        []
      );
    });
  }

  test('the homepage news block shows real copy', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // The band is the city's official announcement channel, headed by
    // `news.title` with `news.badge` as its eyebrow and `news.followCta` as the
    // only call to action.
    const block = page.locator('section', {
      hasText: 'Announcements from the city government',
    });
    await expect(block.getByText('Official channel').first()).toBeVisible();
    await expect(
      block.getByRole('link', { name: 'Follow on Facebook' })
    ).toBeVisible();

    // No translation key may reach the screen, whichever band it came from.
    for (const key of [
      'news.badge',
      'news.followCta',
      'news.title',
      'news.description',
    ]) {
      await expect(block.getByText(key, { exact: false })).toHaveCount(0);
    }
  });

  test('no two homepage bands share a subtitle', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // The regression this guards: "Government Activity" and the news band both
    // opened with "Stay updated with the latest government activities and
    // announcements", so two sections competed for the same sentence.
    const subtitles = await page
      .locator('main section p')
      .evaluateAll(nodes =>
        nodes.map(n => (n.textContent || '').trim()).filter(t => t.length > 30)
      );

    const seen = new Map<string, number>();
    for (const text of subtitles) {
      seen.set(text, (seen.get(text) ?? 0) + 1);
    }
    const duplicates = [...seen.entries()]
      .filter(([, count]) => count > 1)
      .map(([text]) => text);

    expect(duplicates, 'duplicate homepage subtitles').toEqual([]);
  });

  test('the Facebook embed has a real accessible name', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const embed = page.locator('[aria-label*="Facebook page feed"]').first();
    await expect(embed).toHaveAttribute(
      'aria-label',
      /Facebook page feed for Cabanatuan City/
    );
  });

  test('the news feed page does not reuse the Facebook block copy', async ({
    page,
  }) => {
    await page.goto('/government/news', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Separate namespace: the feed shows its own empty state and never the
    // Facebook "Follow on Facebook" call to action.
    await expect(
      page.getByRole('heading', { name: 'No news items yet' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Follow on Facebook' })
    ).toHaveCount(0);
  });
});
