import { test, expect } from '@playwright/test';

test.describe('Government sections', () => {
  test('loads government overview', async ({ page }) => {
    await page.goto('/government');
    await expect(
      page.getByRole('heading', { name: 'Government Activity' })
    ).toBeVisible();
  });

  test('loads barangays listing', async ({ page }) => {
    await page.goto('/government/barangays');
    await expect(
      page.getByRole('heading', { name: 'Barangays' })
    ).toBeVisible();
    await expect(page.getByText(/Showing \d+ barangay/)).toBeVisible();
  });

  test('loads services listing', async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');
    // The page title comes from `title` in src/data/services.yaml, which is
    // "Government Services" — not the older "All local government services"
    // this assertion was written against.
    await expect(
      page.getByRole('heading', { name: 'Government Services' })
    ).toBeVisible();
    // Every service category is listed, and each card is a link named by its
    // own title — not a filler "Other / Browse all" card sitting in the grid.
    const main = page.getByRole('main');
    await expect(
      main.getByRole('link', { name: 'Health Services' })
    ).toBeVisible();
    await expect(
      main.getByRole('link', { name: 'Infrastructure & Public Works' })
    ).toBeVisible();

    // "Browse all" is a link outside the grid, not a card inside it.
    const grid = main.locator('[data-card-grid]');
    await expect(grid.getByRole('link', { name: 'Other' })).toHaveCount(0);
  });

  test('loads statistics page', async ({ page }) => {
    await page.goto('/statistics');
    await expect(
      page.getByRole('heading', { name: /Statistics/i })
    ).toBeVisible();
  });
});
