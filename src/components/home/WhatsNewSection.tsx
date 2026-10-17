import { useTranslation } from '../../hooks/useTranslation';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import BrowseAllLink, { BrowseAllFooter } from '../ui/BrowseAllLink';
import NewsList from '../government/news/NewsList';
import { allNews } from '../../data/news';
import { siteConfig } from '../../lib/siteConfig';

/** Cards on the homepage: two full rows of the three-column grid. */
const LATEST_COUNT = 6;

/**
 * The six most recent city announcements, newest first, with a way through to
 * every one of them on /government/news.
 *
 * This is the site's own copy of the posts, not the Facebook embed further
 * down: it loads without Facebook, is readable by search and screen readers,
 * and a card from today or yesterday says so. Renders nothing until there is
 * at least one item, so a fresh install keeps its current layout.
 */
export default function WhatsNewSection() {
  const { t } = useTranslation();

  if (allNews.length === 0) return null;

  return (
    <Section aria-labelledby="whats-new-title">
      <Heading level={2} id="whats-new-title" className="text-balance">
        {t('whatsNew.title')}
      </Heading>
      <Text className="mb-6 text-pretty text-gray-600">
        {t('whatsNew.description', { city: siteConfig.governmentName })}
      </Text>

      <NewsList limit={LATEST_COUNT} showHeader={false} />

      <BrowseAllFooter>
        <BrowseAllLink to="/government/news" count={allNews.length}>
          {t('whatsNew.viewAll')}
        </BrowseAllLink>
      </BrowseAllFooter>
    </Section>
  );
}
