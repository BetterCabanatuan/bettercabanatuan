import { describe, expect, it } from 'vitest';
import {
  indefiniteArticle,
  normalizeBarangayDescription,
  barangayDescriptionLead,
} from '../barangayText';
import {
  allBarangays,
  barangaysData,
  getBarangayPopulationTrend,
  getBarangayBySlug,
} from '../../data/yamlLoader';
import { cityStats } from '../siteConfig';

describe('indefiniteArticle', () => {
  it('returns "an" before a word starting with a vowel', () => {
    expect(indefiniteArticle('urban')).toBe('an');
    expect(indefiniteArticle('apple')).toBe('an');
  });

  it('returns "a" before a word starting with a consonant', () => {
    expect(indefiniteArticle('rural')).toBe('a');
    expect(indefiniteArticle('city')).toBe('a');
  });

  it('ignores case and surrounding whitespace', () => {
    expect(indefiniteArticle('  Urban ')).toBe('an');
    expect(indefiniteArticle('RURAL')).toBe('a');
  });

  it('is orthographic, not phonetic — documented limitation', () => {
    // Read from the first letter, so these take the spelling-based answer.
    // Documented in the function; only urban/rural are used in this codebase.
    expect(indefiniteArticle('university')).toBe('an');
    expect(indefiniteArticle('hour')).toBe('a');
  });
});

describe('normalizeBarangayDescription', () => {
  it('fixes "is a urban barangay" to "is an urban barangay"', () => {
    expect(
      normalizeBarangayDescription(
        'Aduas Centro is a urban barangay in Cabanatuan City.',
        'Urban'
      )
    ).toBe('Aduas Centro is an urban barangay in Cabanatuan City.');
  });

  it('leaves "a rural barangay" correct', () => {
    const text = 'Bakero is a rural barangay in Cabanatuan City.';
    expect(normalizeBarangayDescription(text, 'Rural')).toBe(text);
  });

  it('preserves the rest of the sentence', () => {
    const result = normalizeBarangayDescription(
      'Aduas Centro is a urban barangay in Cabanatuan City. Formerly known as Aduas. As of 2024, it has a population of 5,151.',
      'Urban'
    );
    expect(result).toContain('Formerly known as Aduas.');
    expect(result).toContain('population of 5,151.');
    expect(result).not.toContain('a urban');
  });

  it('is idempotent', () => {
    const once = normalizeBarangayDescription(
      'X is a urban barangay here.',
      'Urban'
    );
    expect(normalizeBarangayDescription(once, 'Urban')).toBe(once);
  });

  it('does not rewrite a clause that contradicts the classification', () => {
    const text = 'X is a rural barangay here.';
    expect(normalizeBarangayDescription(text, 'Urban')).toBe(text);
  });

  it('leaves an already-correct phrase untouched', () => {
    const text = 'X is an urban barangay in the city.';
    expect(normalizeBarangayDescription(text, 'Urban')).toBe(text);
  });
});

describe('barangayDescriptionLead', () => {
  it('builds the corrected opening sentence', () => {
    expect(barangayDescriptionLead('Aduas Centro', 'Urban')).toBe(
      'Aduas Centro is an urban barangay in the city.'
    );
    expect(barangayDescriptionLead('Bakero', 'Rural')).toBe(
      'Bakero is a rural barangay in the city.'
    );
  });
});

describe('all barangay descriptions are grammatical', () => {
  it('contains no "a urban" or "an rural" anywhere', () => {
    allBarangays.forEach(barangay => {
      expect(barangay.description, barangay.name).not.toMatch(/\ba urban\b/i);
      expect(barangay.description, barangay.name).not.toMatch(/\ban rural\b/i);
    });
  });

  it('uses the article matching each record own classification', () => {
    allBarangays.forEach(barangay => {
      const expected =
        barangay.classification === 'Urban'
          ? 'is an urban barangay'
          : 'is a rural barangay';
      expect(barangay.description, barangay.name).toContain(expected);
    });
  });
});

describe('barangay population trend (P3-2)', () => {
  it('cites a source', () => {
    expect(barangaysData.source).toBeTruthy();
    expect(barangaysData.sourceUrl).toMatch(/^https?:\/\//);
  });

  it('has no barangay with duplicated consecutive-year values', () => {
    allBarangays.forEach(barangay => {
      const trend = getBarangayPopulationTrend(barangay);
      for (let i = 1; i < trend.length; i++) {
        expect(
          trend[i].population === trend[i - 1].population,
          `${barangay.name}: ${trend[i - 1].year}=${trend[i - 1].population} vs ${trend[i].year}=${trend[i].population}`
        ).toBe(false);
      }
    });
  });

  it('omits years with no verified figure rather than showing zero', () => {
    const aduas = getBarangayBySlug('aduas-centro')!;
    const trend = getBarangayPopulationTrend(aduas);

    expect(trend.map(t => t.year)).toEqual([2020, 2024]);
    expect(trend.some(t => t.population === 0)).toBe(false);
  });

  it('keeps the city totals reconcilable with the published census counts', () => {
    const sum = (year: 2015 | 2020 | 2024) =>
      allBarangays.reduce((total, b) => total + (b.population[year] ?? 0), 0);

    // The 2015 total is now 5116 short because one unverifiable figure was
    // omitted; 2020 and 2024 are complete and must match the PSA counts.
    expect(sum(2020)).toBe(327325);
    expect(sum(2024)).toBe(343672);
  });

  it('uses null, never 0 or a duplicate, for an unknown year', () => {
    const aduas = getBarangayBySlug('aduas-centro')!;
    expect(aduas.population[2015]).toBeNull();
  });
});

describe('population reference (P3-1)', () => {
  it('points at a single source of truth', () => {
    expect(cityStats.populationReference.year).toBe(2024);
    expect(cityStats.populationReference.program).toBe('POPCEN 2024');
    expect(cityStats.populationReference.source).toContain(
      'Philippine Statistics Authority'
    );
    expect(cityStats.totalPopulation).toBe(343672);
  });

  it('exposes the interpolation values used by every label', () => {
    expect(cityStats.populationLabelValues).toEqual({
      year: 2024,
      program: 'POPCEN 2024',
    });
  });

  it('matches the 2024 barangay total', () => {
    expect(cityStats.populationTrend['2024']).toBe(
      allBarangays.reduce((t, b) => t + (b.population[2024] ?? 0), 0)
    );
  });
});
