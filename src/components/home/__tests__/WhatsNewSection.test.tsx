import { screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../test/test-utils';
import WhatsNewSection from '../WhatsNewSection';
import * as newsModule from '../../../data/news';

const item = (n: number) => ({
  title: `Update ${n}`,
  date: `2026-09-${String(n).padStart(2, '0')}`,
  sourceName: 'City Government of Cabanatuan',
  sourceUrl: `https://www.facebook.com/lgucabanatuan/posts/${n}`,
});

// Newest first, like allNews.
const NEWS = Array.from({ length: 9 }, (_, i) => item(20 - i));

describe('WhatsNewSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows the six latest updates and links to all of them', () => {
    vi.spyOn(newsModule, 'allNews', 'get').mockReturnValue(NEWS);
    vi.spyOn(newsModule, 'getLatestNews').mockImplementation(limit =>
      NEWS.slice(0, limit)
    );

    renderWithProviders(<WhatsNewSection />);

    const region = screen.getByRole('region', { name: "What's new" });
    const cards = within(region).getAllByRole('link', { name: /Read more/ });
    expect(cards).toHaveLength(6);
    expect(cards[0]).toHaveAttribute('href', NEWS[0].sourceUrl);

    const all = within(region).getByRole('link', { name: /See all updates/ });
    expect(all).toHaveAttribute('href', '/government/news');
    expect(all).toHaveTextContent('(9)');
  });

  it('renders nothing when there is no news', () => {
    vi.spyOn(newsModule, 'allNews', 'get').mockReturnValue([]);

    const { container } = renderWithProviders(<WhatsNewSection />);

    expect(container).toBeEmptyDOMElement();
  });
});
