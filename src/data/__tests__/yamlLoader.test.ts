import { describe, expect, it } from 'vitest';
import {
  allBarangays,
  allDepartments,
  allProjects,
  getBarangayBySlug,
  getCategoryPagesSync,
  getDepartmentBySlug,
  getProjectBySlug,
  governmentCategories,
  isNestedCategory,
  serviceCategories,
} from '../yamlLoader';

describe('yamlLoader data', () => {
  it('loads service and government categories', () => {
    expect(serviceCategories.categories.length).toBeGreaterThan(0);
    expect(governmentCategories.categories.length).toBeGreaterThan(0);
  });

  it('loads 18 departments from departments.yaml', () => {
    expect(allDepartments).toHaveLength(18);
    expect(allDepartments[0].name).toBe('Office of the City Mayor');
  });

  it('loads projects from projects.yaml', () => {
    expect(allProjects.length).toBeGreaterThan(0);
  });

  it('loads barangays with population data', () => {
    expect(allBarangays.length).toBeGreaterThan(0);
    expect(allBarangays[0].population['2024']).toBeTypeOf('number');
  });
});

describe('yamlLoader lookups', () => {
  it('finds departments by slug', () => {
    expect(getDepartmentBySlug('executive')?.acronym).toBe('OCM');
    expect(getDepartmentBySlug('bplo')?.name).toContain('Business Permits');
    expect(getDepartmentBySlug('missing-slug')).toBeUndefined();
  });

  it('finds projects by slug', () => {
    expect(getProjectBySlug('central-transport-terminal')?.status).toBe(
      'ongoing'
    );
    expect(getProjectBySlug('unknown')).toBeUndefined();
  });

  it('finds barangays by slug', () => {
    const first = allBarangays[0];
    expect(getBarangayBySlug(first.slug)?.name).toBe(first.name);
  });

  it('detects nested categories and pages', () => {
    expect(isNestedCategory('health-services')).toBe(true);
    expect(isNestedCategory('executive')).toBe(false);

    const pages = getCategoryPagesSync('health-services');
    expect(pages.length).toBeGreaterThan(0);
    expect(pages[0]).toMatchObject({
      name: expect.any(String),
      slug: expect.any(String),
    });
  });
});
