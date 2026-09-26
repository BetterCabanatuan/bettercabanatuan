import { describe, expect, it } from 'vitest';
import {
  allBarangays,
  allDepartments,
  allProjects,
  getBarangayBySlug,
  getCategoryPagesSync,
  getDepartmentBySlug,
  getProjectBySlug,
  aboutData,
  governmentCategories,
  isNestedCategory,
  serviceCategories,
} from '../yamlLoader';
import { ICON_MAP } from '../../lib/iconMap';

describe('yamlLoader data', () => {
  it('loads service and government categories', () => {
    expect(serviceCategories.categories.length).toBeGreaterThan(0);
    expect(governmentCategories.categories.length).toBeGreaterThan(0);
  });

  it('loads the departments listed in departments.yaml', () => {
    expect(allDepartments.length).toBeGreaterThan(0);
    expect(allDepartments[0].name).toBe('Office of the City Mayor');
  });

  it('gives every department a unique slug and a mapped icon', () => {
    const slugs = allDepartments.map(department => department.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    allDepartments.forEach(department => {
      expect(department.slug).toBeTruthy();
      expect(department.services.length).toBeGreaterThan(0);
      expect(ICON_MAP[department.icon]).toBeDefined();
    });
  });

  it('loads projects from projects.yaml', () => {
    expect(allProjects.length).toBeGreaterThan(0);
  });

  it('loads city history from about.yaml', () => {
    expect(aboutData.history.title).toBe('History of Cabanatuan City');
    expect(aboutData.history.paragraphs.length).toBeGreaterThan(0);
    expect(aboutData.history.fastFacts).toHaveLength(2);
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
    expect(getProjectBySlug('sangitan-public-market')?.status).toBe('ongoing');
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
