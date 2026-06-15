import { describe, expect, it } from 'vitest';
import { searchIndex } from '../../data/searchIndex';
import { parseSearchQuery, searchItems } from '../search';

describe('search', () => {
  it('parses plus-encoded queries', () => {
    expect(parseSearchQuery('health+services')).toBe('health services');
    expect(parseSearchQuery('  sample  ')).toBe('sample');
  });

  it('returns empty results for blank queries', () => {
    expect(searchItems(searchIndex, { query: '' })).toEqual([]);
    expect(searchItems(searchIndex, { query: '   ' })).toEqual([]);
  });

  it('finds service pages by label and description', () => {
    const results = searchItems(searchIndex, { query: 'health services' });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.some(result => result.label.includes('Health Services'))
    ).toBe(true);
  });

  it('supports multi-term matching', () => {
    const results = searchItems(searchIndex, { query: 'business permits' });
    expect(results.length).toBeGreaterThan(0);
  });

  it('filters results by content type', () => {
    const results = searchItems(searchIndex, {
      query: 'barangay',
      type: 'barangays',
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every(result => result.type === 'barangays')).toBe(true);
  });

  it('ranks exact label matches higher', () => {
    const results = searchItems(searchIndex, { query: 'contact' });
    expect(results[0]?.label.toLowerCase()).toContain('contact');
  });
});
