import { test, expect } from '@playwright/test';

const KEY = 'bc-volunteer-popup';

// This spec needs a first-time visitor: no stored dismissal, so the dialog
// actually appears. Overrides the suite-wide seeded storage state.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Volunteer dialog', () => {
  test('appears on a first visit with the recruitment content', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('heading', { name: 'Be Part of Something Greater' })
    ).toBeVisible();
    await expect(
      dialog.getByText(/deserves a world-class digital government/)
    ).toBeVisible();

    for (const role of [
      'Software Dev',
      'UI/UX Design',
      'Graphic Design',
      'Content Creation',
      'Digital Marketing',
      'Research',
    ]) {
      await expect(dialog.getByText(role, { exact: true })).toBeVisible();
    }
  });

  test('the call to action opens the volunteer mailbox', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const cta = page.getByRole('link', { name: /I Want to Volunteer/ });
    await expect(cta).toHaveAttribute(
      'href',
      /^mailto:bettercabanatuan@gmail\.com/
    );
  });

  test('"Maybe Later" stores 0 and hides the dialog for good', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Maybe Later' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    expect(
      await page.evaluate(key => window.localStorage.getItem(key), KEY)
    ).toBe('0');

    // Gone on the next page load and on other routes.
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('the close button stores 0', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page
      .getByRole('button', { name: 'Close volunteer invitation' })
      .click();

    expect(
      await page.evaluate(key => window.localStorage.getItem(key), KEY)
    ).toBe('0');
  });

  test('closes on Escape', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('following the volunteer link stores 0', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.getByRole('link', { name: /I Want to Volunteer/ }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    expect(
      await page.evaluate(key => window.localStorage.getItem(key), KEY)
    ).toBe('0');
  });

  test('a stored 1 keeps it visible, a stored 0 hides it', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(
      ([key]) => window.localStorage.setItem(key!, '1'),
      [KEY]
    );
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.evaluate(
      ([key]) => window.localStorage.setItem(key!, '0'),
      [KEY]
    );
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('is dismissible by keyboard alone', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const dialog = page.getByRole('dialog');
    // Focus must stay inside while tabbing.
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      const inside = await dialog.evaluate(
        (el, active) => el.contains(active),
        await page.evaluateHandle(() => document.activeElement)
      );
      expect(inside).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });

  test('locks background scrolling while open', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(await page.evaluate(() => document.body.style.overflow)).toBe(
      'hidden'
    );

    await page.keyboard.press('Escape');
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
      'hidden'
    );
  });
});
