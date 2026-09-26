import { test, expect } from '@playwright/test';

const STUB_SLUGS = [
  'reports-and-statistics',
  'guides-and-regulations',
  'public-consultations',
  'transparency-documents',
];

test.describe('Coming soon sections', () => {
  for (const slug of STUB_SLUGS) {
    test(`/government/${slug} shows an empty state, not a blank page`, async ({
      page,
    }) => {
      await page.goto(`/government/${slug}`);
      await page.waitForLoadState('networkidle');

      await expect(page.getByText('Coming soon').first()).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'This section is being prepared' })
      ).toBeVisible();

      // The empty state must offer a way forward.
      await expect(
        page.getByRole('link', { name: /Browse all government sections/ })
      ).toHaveAttribute('href', '/government');
      await expect(
        page.getByRole('link', { name: /Contact the city government/ })
      ).toHaveAttribute('href', '/contact');
    });
  }

  test('the government index labels upcoming sections', async ({ page }) => {
    await page.goto('/government');
    await page.waitForLoadState('networkidle');

    /*
     * Scoped to `main`. Each card is now named by its own title, so the card
     * link and the footer's government link share the label "Public Officials"
     * and an unscoped match is a strict-mode violation, not a finding.
     */
    const main = page.getByRole('main');

    // Sections with real pages are unlabelled.
    await expect(
      main.getByRole('link', { name: /Public Officials/ })
    ).toBeVisible();
    // Stub sections are marked.
    const badges = main.getByText('Coming soon');
    expect(await badges.count()).toBeGreaterThan(0);
  });

  test('every "Coming soon" card on /government still resolves', async ({
    page,
  }) => {
    test.setTimeout(90_000);

    await page.goto('/government');
    await page.waitForLoadState('networkidle');

    const hrefs = await page
      .locator('a[href^="/government/"]')
      .evaluateAll(as =>
        [...new Set(as.map(a => a.getAttribute('href')))].filter(Boolean)
      );

    expect(hrefs.length).toBeGreaterThan(0);

    const broken: string[] = [];
    for (const href of hrefs as string[]) {
      await page.goto(href, { waitUntil: 'domcontentloaded' });
      const notFound = await page
        .getByText('Category not found')
        .count()
        .catch(() => 0);
      if (notFound > 0) broken.push(href);
    }

    expect(
      broken,
      `unresolvable government links: ${broken.join(', ')}`
    ).toEqual([]);
  });
});

test.describe('News', () => {
  test('/government/news renders a deliberate empty state when no items exist', async ({
    page,
  }) => {
    await page.goto('/government/news');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { level: 1, name: 'News & Updates' })
    ).toBeVisible();

    // Either a list of items, or the shared empty state — never a blank area.
    const itemCount = await page
      .getByRole('link', { name: /Read more/ })
      .count();
    if (itemCount === 0) {
      await expect(
        page.getByRole('heading', { name: 'No news items yet' })
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: /See announcements on Facebook/ })
      ).toBeVisible();
    } else {
      expect(itemCount).toBeGreaterThan(0);
    }
  });

  test('the homepage news block is never an empty labelled region', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hasItems =
      (await page.getByRole('link', { name: /Read more/ }).count()) > 0;

    if (hasItems) {
      // Items present: the list renders, capped at three on the homepage, and
      // carries no heading of its own — the band above already names it.
      expect(
        await page.getByRole('link', { name: /Read more/ }).count()
      ).toBeLessThanOrEqual(3);
      expect(
        await page.getByRole('heading', { name: 'No news items yet' }).count()
      ).toBe(0);
      return;
    }

    /*
     * No items. The band is the official announcement channel and the Facebook
     * feed is its content, so the *list* collapses rather than rendering an
     * empty state — which is what used to leave the homepage with the same
     * heading, eyebrow, and Facebook button twice, plus a large blank card.
     *
     * Asserted positively: the channel copy and its one call to action are
     * there, and no dead region is left behind.
     */
    await expect(
      page.getByRole('heading', {
        name: 'Announcements from the city government',
      })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Follow on Facebook' })
    ).toBeVisible();

    // The empty-state card must not appear on the homepage. It still belongs on
    // /government/news, where an explanation is the point of the page.
    await expect(
      page.getByRole('heading', { name: 'No news items yet' })
    ).toHaveCount(0);
    await expect(
      page.getByRole('region', { name: 'Latest News & Updates' })
    ).toHaveCount(0);

    // And nothing untranslated leaked in to fill the gap.
    await expect(page.getByText(/newsFeed\./)).toHaveCount(0);
  });

  test('the homepage and /government/news agree on item count', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const homeItems = await page
      .getByRole('link', { name: /Read more/ })
      .count();

    await page.goto('/government/news');
    await page.waitForLoadState('networkidle');
    const allItems = await page
      .getByRole('link', { name: /Read more/ })
      .count();

    expect(homeItems).toBeLessThanOrEqual(allItems);
  });
});
