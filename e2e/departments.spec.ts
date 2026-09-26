import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { test, expect } from '@playwright/test';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

interface DepartmentEntry {
  name: string;
  slug: string;
  branch: string;
}

const departments = (
  yaml.load(
    readFileSync(resolve(rootDir, 'src/data/departments.yaml'), 'utf-8')
  ) as { departments: DepartmentEntry[] }
).departments;

// Derived from departments.yaml so adding an office cannot stale these counts.
const totalOffices = departments.length;
const financeOffices = departments.filter(d => d.branch === 'Finance').length;

test.describe('Departments', () => {
  test('lists all city departments', async ({ page }) => {
    await page.goto('/government/departments');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Departments & Offices' })
    ).toBeVisible();
    await expect(
      page.getByText(`Showing ${totalOffices} of ${totalOffices} offices`)
    ).toBeVisible();
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
      page.getByRole('heading', {
        name: 'Business Permits and Licensing Office',
      })
    ).toBeVisible();
    await expect(page.getByText('Key Services')).toBeVisible();
  });

  test('filters departments by branch', async ({ page }) => {
    await page.goto('/government/departments');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('Filter by branch').selectOption('Finance');
    await expect(
      page.getByText(`Showing ${financeOffices} of ${totalOffices} offices`)
    ).toBeVisible();
  });

  test('every department slug has a reachable detail page', async ({
    page,
  }) => {
    // 21 sequential page loads — needs headroom under parallel workers.
    test.setTimeout(90_000);

    const broken: string[] = [];
    for (const department of departments) {
      await page.goto(`/government/departments/${department.slug}`, {
        waitUntil: 'domcontentloaded',
      });
      const notFound = await page
        .getByText('Department not found')
        .count()
        .catch(() => 0);
      const heading = await page
        .getByRole('heading', { level: 1, name: department.name })
        .count()
        .catch(() => 0);
      if (notFound > 0 || heading === 0) broken.push(department.slug);
    }

    expect(broken, `unreachable departments: ${broken.join(', ')}`).toEqual([]);
  });
});
