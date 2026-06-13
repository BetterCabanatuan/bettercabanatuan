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
    await expect(page.getByRole('heading', { name: 'Barangays' })).toBeVisible();
    await expect(page.getByText(/Showing \d+ barangay/)).toBeVisible();
  });

  test('loads services listing', async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByRole('heading', { name: 'All local government services' })
    ).toBeVisible();
  });

  test('loads statistics page', async ({ page }) => {
    await page.goto('/statistics');
    await expect(page.getByRole('heading', { name: /Statistics/i })).toBeVisible();
  });
});
