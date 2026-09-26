import { test, expect } from '@playwright/test';

test.describe('Contact page', () => {
  test('shows emergency hotlines and contact channels', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Contact Us' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Emergency Hotlines' })
    ).toBeVisible();
    await expect(page.getByText('PNP Cabanatuan')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Department Contact Numbers' })
    ).toBeVisible();
    await expect(page.getByText("City Mayor's Office - Admin")).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'City Government' })
    ).toBeVisible();
  });

  test('every "View department page" link resolves to a real department', async ({
    page,
  }) => {
    // Walks ~15 department pages, so it needs more than the default budget
    // when the suite runs with parallel workers.
    test.setTimeout(90_000);

    await page.goto('/contact#department-contacts');
    await page.waitForLoadState('networkidle');

    const links = page.getByRole('link', { name: 'View department page' });
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    const hrefs = await links.evaluateAll(nodes =>
      nodes.map(node => node.getAttribute('href') ?? '')
    );
    const uniqueHrefs = [...new Set(hrefs)];

    // Collect every failure and assert once, so one slow page cannot mask
    // the rest and a real breakage is reported in full.
    const broken: string[] = [];
    for (const href of uniqueHrefs) {
      if (!/^\/government\/departments\/[a-z0-9-]+$/.test(href)) {
        broken.push(`${href} (unexpected link shape)`);
        continue;
      }

      await page.goto(href, { waitUntil: 'domcontentloaded' });
      const notFound = await page
        .getByText('Department not found')
        .count()
        .catch(() => 0);
      const hasHeading = (await page.locator('h1').count()) > 0;
      if (notFound > 0 || !hasHeading) broken.push(href);
    }

    expect(broken, `broken department links: ${broken.join(', ')}`).toEqual([]);
  });

  test('the City Legal Office line does not link to CSWDO', async ({
    page,
  }) => {
    await page.goto('/contact#department-contacts');
    await page.waitForLoadState('networkidle');

    const row = page.getByRole('row').filter({ hasText: 'City Legal Office' });

    await expect(row).toBeVisible();
    await expect(
      row.getByRole('link', { name: 'View department page' })
    ).toHaveAttribute('href', '/government/departments/city-legal-office');
    await expect(
      row.getByRole('link', { name: '0919-081-0213' })
    ).toHaveAttribute('href', 'tel:+639190810213');
  });
});

test.describe('Hotlines page', () => {
  test('lists the same emergency numbers as the contact page', async ({
    page,
  }) => {
    await page.goto('/hotlines');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Hotlines' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Emergency Hotlines' })
    ).toBeVisible();
    await expect(page.getByText('PNP Cabanatuan')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Department Contact Numbers' })
    ).toBeVisible();
  });
});

test.describe('Accessibility page', () => {
  test('renders the accessibility statement', async ({ page }) => {
    await page.goto('/accessibility');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Accessibility Statement' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'The standard we target' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Known limitations' })
    ).toBeVisible();
    await expect(
      page.getByText('bettercabanatuan@gmail.com').first()
    ).toBeVisible();
  });
});

test.describe('Footer links', () => {
  test('the accessibility and hotlines footer links resolve', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page
      .getByRole('contentinfo')
      .getByRole('link', { name: 'Accessibility' })
      .first()
      .click();
    await expect(page).toHaveURL(/\/accessibility$/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Accessibility Statement' })
    ).toBeVisible();

    await page
      .getByRole('contentinfo')
      .getByRole('link', { name: 'Hotlines' })
      .click();
    await expect(page).toHaveURL(/\/hotlines$/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Hotlines' })
    ).toBeVisible();
  });
});
