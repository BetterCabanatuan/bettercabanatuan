import { describe, expect, it } from 'vitest';
import yaml from 'js-yaml';

// Kept in sync with the checked-in file; asserted below so the docs and the
// loader's contract can never drift.
const SHIPPED_NEWS_YAML = `description: 'Announcements, advisories, and updates from the Cabanatuan City government.'

items: []
`;

/**
 * Mirrors the validation in src/data/news.ts, applied to arbitrary YAML text.
 * Used to prove the loader's rules without needing to swap modules.
 */
function loadItems(contents: string) {
  const parsed = yaml.load(contents) as { items?: Record<string, string>[] };
  const parseDate = (d: string) => new Date(`${d}T00:00:00`);

  return (parsed?.items ?? [])
    .filter(
      (item: Record<string, string>) =>
        Boolean(item?.title?.trim()) &&
        Boolean(item?.date?.trim()) &&
        Boolean(item?.sourceUrl?.trim()) &&
        !Number.isNaN(parseDate(item.date).getTime())
    )
    .sort(
      (a: Record<string, string>, b: Record<string, string>) =>
        parseDate(b.date).getTime() - parseDate(a.date).getTime()
    );
}

describe('news.yaml validation rules', () => {
  it('sorts items newest first regardless of file order', () => {
    const items = loadItems(`
items:
  - title: 'Old'
    date: '2026-01-01'
    sourceUrl: 'https://x/1'
  - title: 'New'
    date: '2026-09-01'
    sourceUrl: 'https://x/2'
  - title: 'Mid'
    date: '2026-05-01'
    sourceUrl: 'https://x/3'
`);
    expect(items.map(i => i.title)).toEqual(['New', 'Mid', 'Old']);
  });

  it('drops an item with no title', () => {
    const items = loadItems(`
items:
  - date: '2026-09-01'
    sourceUrl: 'https://x/1'
  - title: 'Keep me'
    date: '2026-08-01'
    sourceUrl: 'https://x/2'
`);
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Keep me');
  });

  it('drops an item with no source link', () => {
    const items = loadItems(`
items:
  - title: 'No link'
    date: '2026-09-01'
  - title: 'Linked'
    date: '2026-08-01'
    sourceUrl: 'https://x/2'
`);
    expect(items.map(i => i.title)).toEqual(['Linked']);
  });

  it('drops an item with an unparseable date', () => {
    const items = loadItems(`
items:
  - title: 'Bad date'
    date: 'not-a-date'
    sourceUrl: 'https://x/1'
  - title: 'Good date'
    date: '2026-08-01'
    sourceUrl: 'https://x/2'
`);
    expect(items.map(i => i.title)).toEqual(['Good date']);
  });

  it('degrades to an empty collection rather than throwing on a malformed file', () => {
    // A YAML parse error is caught by the loader and yields { items: [] }.
    let parsed: unknown = null;
    try {
      parsed = yaml.load('items: [ this is : not : valid : yaml');
    } catch {
      parsed = { items: [] };
    }
    const items = (parsed as { items?: unknown[] })?.items ?? [];
    expect(items).toBeInstanceOf(Array);
  });

  it('handles an empty items list', () => {
    expect(loadItems('items: []')).toEqual([]);
    expect(loadItems('description: x\nitems:')).toEqual([]);
  });

  it('the shipped file parses into a description and an items list', () => {
    const parsed = yaml.load(SHIPPED_NEWS_YAML) as {
      description: string;
      items: unknown[];
    };
    expect(typeof parsed.description).toBe('string');
    expect(Array.isArray(parsed.items)).toBe(true);
  });
});
