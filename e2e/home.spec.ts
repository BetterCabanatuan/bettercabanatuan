import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads hero and emergency hotline bar', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      page.getByRole('region', { name: 'Emergency hotlines' })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: '(044)-463-1111' })).toBeVisible();
  });
});

test.describe('Main navigation', () => {
  test('navigates to contact page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Contact Us', exact: true }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(
      page.getByRole('heading', { name: 'Contact Us' })
    ).toBeVisible();
  });

  test('navigates to sitemap page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Sitemap', exact: true }).click();
    await expect(page).toHaveURL(/\/sitemap$/);
    await expect(page.getByRole('heading', { name: 'Sitemap' })).toBeVisible();
  });
});
