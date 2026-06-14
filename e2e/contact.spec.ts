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
});
