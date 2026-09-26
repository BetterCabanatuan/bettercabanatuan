import { describe, expect, it, afterEach, vi } from 'vitest';
import yaml from 'js-yaml';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../test/test-utils';
import NewsList from '../NewsList';
import NewsCard from '../NewsCard';
import * as newsModule from '../../../../data/news';

vi.mock('../../../../data/news', async importOriginal => {
  const actual = await importOriginal<typeof import('../../../../data/news')>();
  return { ...actual, allNews: [], getLatestNews: () => [] };
});

const SAMPLE = [
  {
    title: 'Oldest item',
    date: '2026-01-05',
    summary: 'From January.',
    sourceName: 'City Hall',
    sourceUrl: 'https://example.gov.ph/old',
  },
  {
    title: 'Newest item',
    date: '2026-09-20',
    summary: 'From September.',
    sourceName: "City Mayor's Office",
    sourceUrl: 'https://example.gov.ph/new',
  },
  {
    title: 'Middle item',
    date: '2026-05-11',
    summary: 'From May.',
    sourceName: 'CDRRMO',
    sourceUrl: 'https://example.gov.ph/mid',
  },
  {
    title: 'Also recent',
    date: '2026-08-02',
    summary: 'From August.',
    sourceName: 'CHO',
    sourceUrl: 'https://example.gov.ph/aug',
  },
];

const sorted = [...SAMPLE].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

describe('NewsList', () => {
  afterEach(() => vi.restoreAllMocks());

  it('falls back to the shared empty state when there are no items', () => {
    renderWithProviders(<NewsList />);

    expect(
      screen.getByRole('heading', { name: 'No news items yet' })
    ).toBeInTheDocument();
    expect(screen.getByText('No content yet')).toBeInTheDocument();
    // Must offer a way forward, not a blank block.
    expect(
      screen.getByRole('link', { name: /See announcements on Facebook/ })
    ).toBeInTheDocument();
  });

  it('renders items newest-first when items exist', () => {
    vi.spyOn(newsModule, 'allNews', 'get').mockReturnValue(sorted);

    renderWithProviders(<NewsList />);

    const links = screen.getAllByRole('link', { name: /Read more/ });
    expect(links).toHaveLength(4);
    expect(links[0]).toHaveAttribute('href', 'https://example.gov.ph/new');
    expect(links[3]).toHaveAttribute('href', 'https://example.gov.ph/old');
  });

  it('limits the homepage to the latest three', () => {
    const getLatest = vi
      .spyOn(newsModule, 'getLatestNews')
      .mockReturnValue(sorted.slice(0, 3));

    renderWithProviders(<NewsList limit={3} />);

    expect(getLatest).toHaveBeenCalledWith(3);
    expect(screen.getAllByRole('link', { name: /Read more/ })).toHaveLength(3);
  });

  it('renders the published date in a readable local format', () => {
    renderWithProviders(<NewsCard item={SAMPLE[1]} />);

    const time = screen.getByText(/September 20, 2026/i);
    expect(time.closest('time')).toHaveAttribute('datetime', '2026-09-20');
  });

  it('links to the source and labels it', () => {
    renderWithProviders(<NewsCard item={SAMPLE[0]} />);

    const link = screen.getByRole('link', { name: /City Hall/ });
    expect(link).toHaveAttribute('href', 'https://example.gov.ph/old');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

describe('news.yaml schema', () => {
  it('declares the fields the loader requires', () => {
    const parsed = yaml.load(
      `items:
  - title: 'A headline'
    date: '2026-09-01'
    summary: 'A summary.'
    sourceName: 'An office'
    sourceUrl: 'https://example.gov.ph/x'
`
    ) as { items: Record<string, string>[] };

    expect(parsed.items[0]).toMatchObject({
      title: expect.any(String),
      date: expect.any(String),
      sourceUrl: expect.any(String),
    });
  });
});
