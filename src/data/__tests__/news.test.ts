import { describe, expect, it } from 'vitest';
import { allNews, getLatestNews, newsData, parseNewsDate } from '../news';

describe('news data source', () => {
  it('loads a description and an items collection', () => {
    expect(typeof newsData.description).toBe('string');
    expect(Array.isArray(newsData.items)).toBe(true);
  });

  it('parses a YYYY-MM-DD date as a local calendar day', () => {
    const parsed = parseNewsDate('2026-09-25');

    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(8); // September, 0-indexed
    expect(parsed.getDate()).toBe(25);
    // Guards the classic UTC-midnight off-by-one.
    expect(parsed.getHours()).toBe(0);
  });

  it('exposes every item newest-first', () => {
    const dates = allNews.map(n => n.date);
    const sorted = [...dates].sort(
      (a, b) => parseNewsDate(b).getTime() - parseNewsDate(a).getTime()
    );
    expect(dates).toEqual(sorted);
  });

  it('caps getLatestNews at the requested count', () => {
    expect(getLatestNews(3).length).toBeLessThanOrEqual(3);
    expect(getLatestNews(0)).toHaveLength(0);
    expect(getLatestNews(-5)).toHaveLength(0);
  });

  it('returns the most recent items, newest first', () => {
    const recent = getLatestNews(3);
    if (recent.length > 1) {
      expect(parseNewsDate(recent[0].date).getTime()).toBeGreaterThanOrEqual(
        parseNewsDate(recent[1].date).getTime()
      );
    }
  });

  it('exposes no item without a title, date, or source link', () => {
    allNews.forEach(news => {
      expect(news.title.trim()).toBeTruthy();
      expect(news.date.trim()).toBeTruthy();
      expect(news.sourceUrl.trim()).toBeTruthy();
    });
  });

  it('never exposes an unparseable date', () => {
    allNews.forEach(news => {
      expect(Number.isNaN(parseNewsDate(news.date).getTime())).toBe(false);
    });
  });
});
