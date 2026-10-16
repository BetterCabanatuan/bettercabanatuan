import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import NewsCard from '../government/news/NewsCard';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { getNewsByTopic } from '../../data/news';
import { siteConfig } from '../../lib/siteConfig';

const PAGE_SIZE = 6;

interface CategoryUpdatesProps {
  /** Service category slug; items tagged with it in `topics` are listed. */
  categoryId: string;
  categoryName: string;
}

/**
 * Dated posts from the city Facebook page for one service category, newest
 * first, each linking to the original post.
 *
 * Renders nothing when the category has no tagged items, so categories
 * without a feed keep their current layout.
 */
export default function CategoryUpdates({
  categoryId,
  categoryName,
}: CategoryUpdatesProps) {
  const { t } = useTranslation('common');
  const headingId = useId();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { facebookUrl, governmentName } = siteConfig;

  const items = getNewsByTopic(categoryId);
  if (items.length === 0) return null;

  const visible = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <section aria-labelledby={headingId} className="mt-14">
      <Heading level={2} id={headingId}>
        {t('newsFeed.categoryTitle')}
      </Heading>
      <Text className="text-gray-600 mb-6 max-w-2xl text-pretty">
        {t('newsFeed.categoryDescription', {
          category: categoryName.toLowerCase(),
          city: governmentName,
        })}
      </Text>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {visible.map(item => (
          <li key={item.sourceUrl}>
            <NewsCard item={item} />
          </li>
        ))}
      </ul>

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
            onClick={() => setVisibleCount(count => count + PAGE_SIZE)}
            className="min-h-[44px] px-4 rounded-md text-sm font-medium text-primary-600 ring-1 ring-primary-600/30 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-colors duration-200"
          >
            {t('newsFeed.showMore')}
          </button>
        )}
        {facebookUrl && (
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-colors duration-200"
          >
            {t('newsFeed.fallbackCta')}
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </a>
        )}
      </div>
    </section>
  );
}
