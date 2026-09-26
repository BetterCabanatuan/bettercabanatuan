import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test/test-utils';
import SEO from '../SEO';
import { BRAND_NAME } from '../../lib/siteConfig';

function renderSeo(props: Parameters<typeof SEO>[0]) {
  // react-helmet-async writes into the real document head under jsdom.
  const { unmount } = renderWithProviders(<SEO {...props} />);
  const title = document.title;
  unmount();
  return { title };
}

describe('SEO title template (P3-5)', () => {
  it('uses "<Page> | Better Cabanatuan"', () => {
    const { title } = renderSeo({ title: 'Contact' });
    expect(title).toBe(`Contact | ${BRAND_NAME}`);
  });

  it('does not double the brand when a title already contains it', () => {
    const { title } = renderSeo({ title: 'Cabanatuan City Portal' });
    expect(title).toBe(`Cabanatuan City Portal | ${BRAND_NAME}`);
    expect(title.match(/Better Cabanatuan/g)).toHaveLength(1);
  });

  it('does not repeat the brand if the title already names it', () => {
    const { title } = renderSeo({ title: BRAND_NAME });
    expect(title).toBe(BRAND_NAME);
  });

  it('never repeats the city name twice in one title', () => {
    const { title } = renderSeo({ title: 'Cabanatuan City Portal' });
    const occurrences = title.match(/Cabanatuan City/gi) ?? [];
    expect(occurrences.length).toBeLessThanOrEqual(1);
  });

  it('falls back to "<City> — Brand" with no page title', () => {
    const { title } = renderSeo({});
    expect(title).toContain(BRAND_NAME);
    expect(title).not.toMatch(/Cabanatuan City.*Cabanatuan City/);
  });

  it('trims stray whitespace in a supplied title', () => {
    const { title } = renderSeo({ title: '  Statistics  ' });
    expect(title).toBe(`Statistics | ${BRAND_NAME}`);
  });
});

describe('brand name', () => {
  it('is "Better Cabanatuan"', () => {
    expect(BRAND_NAME).toBe('Better Cabanatuan');
  });

  it('is not one of the mixed-in legacy names', () => {
    expect(BRAND_NAME).not.toMatch(/BetterGov/);
    expect(BRAND_NAME).not.toMatch(/BetterCabanatuan\.org/);
  });
});

describe('population label (P3-1)', () => {
  it('uses one shared interpolation source for every label', async () => {
    const { cityStats } = await import('../../lib/siteConfig');
    const { t } = (await import('i18next')).default;

    const year = cityStats.populationLabelValues.year;
    const program = cityStats.populationLabelValues.program;

    const homepage = t('cityStats.populationDescription', {
      year,
      program,
    });
    const about = t('about.mission.stats.populationNote', { year, program });

    expect(homepage).toBe(`As of ${year} Census (${program})`);
    expect(about).toBe(`${year} Census (${program})`);

    // No view may claim a different census year.
    expect(homepage).not.toMatch(/2020/);
    expect(about).not.toMatch(/2020/);
  });
});
