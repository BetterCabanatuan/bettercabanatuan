import { describe, expect, it } from 'vitest';
import { allNationalProjects, nationalProjectsData } from '../yamlLoader';

describe('national projects data', () => {
  it('loads curated national budget projects', () => {
    expect(nationalProjectsData.title).toBeTruthy();
    expect(allNationalProjects).toHaveLength(25);
  });

  it('includes required project fields', () => {
    const project = allNationalProjects[0];
    expect(project).toMatchObject({
      slug: expect.any(String),
      name: expect.any(String),
      department: expect.any(String),
      category: expect.any(String),
      location: expect.any(String),
      years: expect.any(Array),
      amount: expect.any(Number),
      amountLabel: expect.stringMatching(/^PHP /),
    });
    expect(project.amount).toBeGreaterThan(0);
  });

  it('uses unique slugs', () => {
    const slugs = allNationalProjects.map(p => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
