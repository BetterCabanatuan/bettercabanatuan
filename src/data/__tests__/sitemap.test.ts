import { describe, expect, it } from 'vitest';
import {
  allSitemapLinks,
  getSitemapCanonicalUrl,
  sitemapGroups,
  sitemapSeo,
} from '../sitemap';

describe('sitemap data', () => {
  it('defines main navigation groups', () => {
    const ids = sitemapGroups.map(group => group.id);
    expect(ids).toContain('main');
    expect(ids).toContain('services');
    expect(ids).toContain('government');
    expect(ids).toContain('barangays');
  });

  it('includes core pages in main group', () => {
    const mainLinks = sitemapGroups.find(g => g.id === 'main')?.links ?? [];
    const hrefs = mainLinks.map(link => link.href);
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/contact');
    expect(hrefs).toContain('/sitemap');
  });

  it('includes department and project detail links', () => {
    const governmentLinks =
      sitemapGroups.find(g => g.id === 'government')?.links ?? [];
    const hrefs = governmentLinks.map(link => link.href);
    expect(hrefs).toContain('/government/departments');
    expect(hrefs).toContain('/government/projects');
    expect(hrefs).toContain('/government/departments/bplo');
  });

  it('builds canonical sitemap url', () => {
    expect(getSitemapCanonicalUrl()).toMatch(/\/sitemap$/);
  });

  it('exports flattened link list and seo metadata', () => {
    expect(allSitemapLinks.length).toBeGreaterThan(50);
    expect(sitemapSeo.title).toBe('Sitemap');
    expect(sitemapSeo.description.length).toBeGreaterThan(0);
  });
});
