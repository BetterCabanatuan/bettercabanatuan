import type { SearchContentType, SearchItem } from '../data/searchIndex';

export interface SearchOptions {
  query: string;
  type?: SearchContentType | 'all';
  limit?: number;
}

export interface SearchResult extends SearchItem {
  score: number;
}

function normalizeQuery(query: string): string[] {
  return query
    .trim()
    .toLowerCase()
    .replace(/\+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function scoreItem(item: SearchItem, terms: string[]): number {
  if (terms.length === 0) return 0;

  const label = item.label.toLowerCase();
  const description = (item.description ?? '').toLowerCase();
  const typeLabel = item.typeLabel.toLowerCase();
  const haystack = `${label} ${description} ${typeLabel}`;

  let score = 0;

  for (const term of terms) {
    if (label === term) {
      score += 120;
      continue;
    }

    if (label.startsWith(term)) {
      score += 80;
    } else if (label.includes(term)) {
      score += 50;
    }

    if (description.includes(term)) {
      score += 25;
    }

    if (typeLabel.includes(term)) {
      score += 10;
    }

    if (!haystack.includes(term)) {
      return 0;
    }
  }

  return score;
}

export function searchItems(
  items: SearchItem[],
  { query, type = 'all', limit = 50 }: SearchOptions
): SearchResult[] {
  const terms = normalizeQuery(query);
  if (terms.length === 0) return [];

  return items
    .filter(item => type === 'all' || item.type === type)
    .map(item => ({ ...item, score: scoreItem(item, terms) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
    .slice(0, limit);
}

export function parseSearchQuery(raw: string | null): string {
  if (!raw) return '';
  return raw.replace(/\+/g, ' ').trim();
}
