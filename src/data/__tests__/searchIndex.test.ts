import { describe, expect, it } from 'vitest';
import { searchIndex, suggestedSearches } from '../searchIndex';

describe('searchIndex data', () => {
  it('indexes sitemap links', () => {
    expect(searchIndex.length).toBeGreaterThan(50);
  });

  it('includes service and government entries', () => {
    expect(searchIndex.some(item => item.type === 'services')).toBe(true);
    expect(searchIndex.some(item => item.type === 'government')).toBe(true);
    expect(searchIndex.some(item => item.type === 'barangays')).toBe(true);
  });

  it('provides suggested searches', () => {
    expect(suggestedSearches.length).toBeGreaterThan(0);
    expect(suggestedSearches).toContain('health services');
  });
});
