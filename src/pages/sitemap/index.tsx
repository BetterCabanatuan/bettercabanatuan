import SEO from '../../components/SEO';
import Section from '../../components/ui/Section';
import { Text } from '../../components/ui/Text';
import SitemapHero from '../../components/sitemap/SitemapHero';
import SitemapJumpNav from '../../components/sitemap/SitemapJumpNav';
import SitemapSection from '../../components/sitemap/SitemapSection';
import SitemapStructuredData from '../../components/sitemap/SitemapStructuredData';
import {
  sitemapGroups,
  allSitemapLinks,
  getSitemapCanonicalUrl,
  sitemapSeo,
} from '../../data/sitemap';
import { siteConfig } from '../../lib/siteConfig';

export default function SitemapPage() {
  const canonicalUrl = getSitemapCanonicalUrl();
  const pageTitle = `${sitemapSeo.title} | ${siteConfig.governmentName}`;

  return (
    <>
      <SEO
        title={sitemapSeo.title}
        description={sitemapSeo.description}
        keywords={sitemapSeo.keywords}
        url={canonicalUrl}
        type="website"
      />
      <SitemapStructuredData
        pageUrl={canonicalUrl}
        pageTitle={pageTitle}
        pageDescription={sitemapSeo.description}
        links={allSitemapLinks}
      />

      <main className="flex-grow" id="main-content">
        <SitemapHero
          title="Sitemap"
          description={sitemapSeo.description}
        />

        <Section className="p-3 mb-12 pt-10">
          <SitemapJumpNav groups={sitemapGroups} />

          <Text className="text-gray-600 mb-8 max-w-3xl">
            Use this page to find any section of the{' '}
            {siteConfig.governmentName} community portal. All links open within
            this site unless marked as external resources.
          </Text>

          <div className="space-y-8">
            {sitemapGroups.map((group, index) => (
              <SitemapSection
                key={group.id}
                group={group}
                animationDelay={100 + index * 60}
                compact={group.id === 'barangays'}
              />
            ))}
          </div>
        </Section>
      </main>
    </>
  );
}
