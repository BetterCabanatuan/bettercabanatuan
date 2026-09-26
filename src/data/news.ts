import yaml from 'js-yaml';
import newsYaml from './news.yaml?raw';

export interface NewsItem {
  title: string;
  /** ISO date string, `YYYY-MM-DD`. */
  date: string;
  summary?: string;
  sourceName?: string;
  sourceUrl: string;
}

export interface NewsData {
  description: string;
  items: NewsItem[];
}

export const newsData: NewsData = (() => {
  try {
    return yaml.load(newsYaml) as NewsData;
  } catch (error) {
    // A malformed news file must not take the homepage or /government/news down.
    console.error('Failed to parse news.yaml:', error);
    return { description: '', items: [] };
  }
})();

/**
 * Valid items, newest first.
 *
 * Anything missing a title, date, or source link is dropped rather than
 * rendered as a broken card, so a half-finished edit degrades to "no items"
 * instead of breaking the page.
 */
export const allNews: NewsItem[] = (newsData.items ?? [])
  .filter(
    (item): item is NewsItem =>
      Boolean(item?.title?.trim()) &&
      Boolean(item?.date?.trim()) &&
      Boolean(item?.sourceUrl?.trim()) &&
      !Number.isNaN(parseNewsDate(item.date).getTime())
  )
  .sort(
    (a, b) => parseNewsDate(b.date).getTime() - parseNewsDate(a.date).getTime()
  );

/** The `limit` most recent items, newest first. */
export function getLatestNews(limit: number): NewsItem[] {
  return allNews.slice(0, Math.max(0, limit));
}

/**
 * Parses a `YYYY-MM-DD` string as a local calendar date.
 *
 * `new Date('2026-09-25')` is parsed as UTC midnight, which renders as the
 * previous day for anyone west of Greenwich. Anchoring to local midnight keeps
 * the published date stable for every reader.
 */
export function parseNewsDate(date: string): Date {
  return new Date(`${date}T00:00:00`);
}
