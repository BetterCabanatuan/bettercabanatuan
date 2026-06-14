import { test, expect } from '@playwright/test';

test.describe('Projects', () => {
  test('lists government projects', async ({ page }) => {
    await page.goto('/government/projects');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Government Projects' })
    ).toBeVisible();
    await expect(page.getByText('Sangitan Public Market')).toBeVisible();
  });

  test('opens project detail page', async ({ page }) => {
    await page.goto('/government/projects');
    await page.waitForLoadState('networkidle');

    await page
      .locator('a[href="/government/projects/sangitan-public-market"]')
      .click();

    await expect(page).toHaveURL(
      /\/government\/projects\/sangitan-public-market$/
    );
    await expect(page.getByText('Project Details')).toBeVisible();
    await expect(page.getByText('Ongoing')).toBeVisible();
  });
});
