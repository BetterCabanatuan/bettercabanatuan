import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Newspaper } from 'lucide-react';
import EmptyState from '../../ui/EmptyState';
import NewsCard from './NewsCard';
import { getLatestNews, allNews } from '../../../data/news';
import { siteConfig } from '../../../lib/siteConfig';

interface NewsListProps {
  /** Cap the number of items. Omit to render every item. */
  limit?: number;
  /**
   * Render this many items, then a "Show more" button that adds as many again.
   * Omit to render everything at once.
   */
  pageSize?: number;
  showHeader?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Renders dated news items newest-first, or the shared empty state pointing at
 * the official Facebook page when nothing has been published yet.
 *
 * Shared by the homepage "What's new" section (latest six) and
 * /government/news (every item, a page at a time).
 */
export default function NewsList({
  limit,
  pageSize,
  showHeader = true,
  title,
  description,
  className = '',
}: NewsListProps) {
  const { t } = useTranslation('common');
  const { facebookUrl, governmentName } = siteConfig;

  const [visibleCount, setVisibleCount] = useState(pageSize ?? Infinity);

  const items = limit === undefined ? allNews : getLatestNews(limit);
  const visible = items.slice(0, visibleCount);
  const hasMore = visible.length < items.length;

  return (
    <section
      className={className}
      aria-labelledby={showHeader ? 'news-list-heading' : undefined}
    >
      {showHeader && (
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600 mb-1">
            {t('newsFeed.eyebrow')}
          </p>
          <h2
            id="news-list-heading"
            className="text-2xl md:text-3xl font-bold mb-2 leading-relaxed text-balance"
          >
            {title ?? t('newsFeed.latestTitle')}
          </h2>
          {description && (
            <p className="text-gray-600 mb-0 max-w-2xl text-pretty">
              {description}
            </p>
          )}
        </div>
      )}

      {items.length > 0 ? (
        <>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {visible.map(item => (
              <li key={item.sourceUrl}>
                <NewsCard item={item} />
              </li>
            ))}
          </ul>
          {pageSize !== undefined && (
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <p className="text-xs text-gray-500 mb-0" aria-live="polite">
                {t('newsFeed.showingCount', {
                  shown: visible.length,
                  total: items.length,
                })}
              </p>
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setVisibleCount(count => count + pageSize)}
                  className="min-h-[44px] px-4 rounded-md text-sm font-medium text-primary-600 ring-1 ring-primary-600/30 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-colors duration-200"
                >
                  {t('newsFeed.showMore')}
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={Newspaper}
          badge={t('emptyState.noContentBadge')}
          title={t('newsFeed.emptyTitle')}
          description={t('newsFeed.emptyDescription', { city: governmentName })}
          primaryAction={
            facebookUrl
              ? {
                  href: facebookUrl,
                  label: t('newsFeed.fallbackCta'),
                  external: true,
                }
              : undefined
          }
          secondaryAction={{ href: '/contact', label: t('common.contact') }}
        />
      )}
    </section>
  );
}
