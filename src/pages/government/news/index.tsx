import { useTranslation } from 'react-i18next';
import { Newspaper } from 'lucide-react';
import SEO from '../../../components/SEO';
import Section from '../../../components/ui/Section';
import GovernmentPageHero from '../../../components/government/GovernmentPageHero';
import NewsList from '../../../components/government/news/NewsList';
import { newsData } from '../../../data/news';
import { siteConfig } from '../../../lib/siteConfig';
import { breadcrumbJsonLd } from '../../../lib/structuredData';

/** Cards per "Show more" step: four full rows of the three-column grid. */
const NEWS_PAGE_SIZE = 12;

export default function NewsPage() {
  const { t } = useTranslation('common');
  const { governmentName } = siteConfig;

  const pageDescription =
    newsData.description ||
    t('newsFeed.allDescription', { city: governmentName });

  return (
    <>
      <SEO
        title={t('newsFeed.seoTitle')}
        description={t('newsFeed.seoDescription', { city: governmentName })}
        keywords={`news, announcements, advisories, ${governmentName}, local government updates`}
        url="/government/news"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Government', url: '/government' },
          { name: t('newsFeed.seoTitle'), url: '/government/news' },
        ])}
      />
      <GovernmentPageHero
        eyebrow={t('newsFeed.eyebrow')}
        title={t('newsFeed.allTitle')}
        description={pageDescription}
        icon={Newspaper}
        breadcrumbs={[
          { label: t('common.home'), href: '/' },
          { label: t('common.government'), href: '/government' },
          { label: t('newsFeed.seoTitle'), href: '/government/news' },
        ]}
      />
      <Section className="p-3 mb-12 pt-10">
        <NewsList
          showHeader={false}
          pageSize={NEWS_PAGE_SIZE}
          description={t('newsFeed.allDescription', { city: governmentName })}
        />
      </Section>
    </>
  );
}
