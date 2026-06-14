import { test, expect } from '@playwright/test';

test.describe('Projects', () => {
  test('lists government projects', async ({ page }) => {
    await page.goto('/government/projects');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Government Projects' })
    ).toBeVisible();
    await expect(
      page.getByText('Central Transport Terminal Modernization')
    ).toBeVisible();
  });

  test('opens project detail page', async ({ page }) => {
    await page.goto('/government/projects');
    await page.waitForLoadState('networkidle');

    await page
      .locator('a[href="/government/projects/central-transport-terminal"]')
      .click();

    await expect(page).toHaveURL(
      /\/government\/projects\/central-transport-terminal$/
    );
    await expect(page.getByText('Project Details')).toBeVisible();
    await expect(page.getByText('Ongoing')).toBeVisible();
  });
});
