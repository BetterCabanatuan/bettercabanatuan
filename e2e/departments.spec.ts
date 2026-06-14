import { test, expect } from '@playwright/test';

test.describe('Departments', () => {
  test('lists all city departments', async ({ page }) => {
    await page.goto('/government/departments');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Departments & Offices' })
    ).toBeVisible();
    await expect(page.getByText('Showing 18 of 18 offices')).toBeVisible();
    await expect(page.getByText('Office of the City Mayor')).toBeVisible();
    await expect(
      page.getByText('Land Registration Authority — Registry of Deeds')
    ).toBeVisible();
  });

  test('opens department detail page', async ({ page }) => {
    await page.goto('/government/departments');
    await page.waitForLoadState('networkidle');

    await page.locator('a[href="/government/departments/bplo"]').click();

    await expect(page).toHaveURL(/\/government\/departments\/bplo$/);
    await expect(
      page.getByRole('heading', { name: 'Business Permits and Licensing Office' })
    ).toBeVisible();
    await expect(page.getByText('Key Services')).toBeVisible();
  });

  test('filters departments by branch', async ({ page }) => {
    await page.goto('/government/departments');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('Filter by branch').selectOption('Finance');
    await expect(page.getByText(/Showing 4 of 18 offices/)).toBeVisible();
  });
});
