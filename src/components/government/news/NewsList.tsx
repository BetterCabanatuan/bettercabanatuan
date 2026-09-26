import { useTranslation } from 'react-i18next';
import { Newspaper } from 'lucide-react';
import EmptyState from '../../ui/EmptyState';
import NewsCard from './NewsCard';
import { getLatestNews, allNews } from '../../../data/news';
import { siteConfig } from '../../../lib/siteConfig';

interface NewsListProps {
  /** Cap the number of items. Omit to render every item. */
  limit?: number;
  showHeader?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Renders dated news items newest-first, or the shared empty state pointing at
 * the official Facebook page when nothing has been published yet.
 *
 * Shared by the homepage (latest three) and /government/news (all items).
 */
export default function NewsList({
  limit,
  showHeader = true,
  title,
  description,
  className = '',
}: NewsListProps) {
  const { t } = useTranslation('common');
  const { facebookUrl, governmentName } = siteConfig;

  const items = limit === undefined ? allNews : getLatestNews(limit);

  return (
    <section className={className} aria-labelledby="news-list-heading">
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
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map(item => (
            <li key={`${item.date}-${item.title}`}>
              <NewsCard item={item} />
            </li>
          ))}
        </ul>
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
