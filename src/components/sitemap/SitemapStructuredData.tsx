import { Helmet } from 'react-helmet-async';
import type { SitemapLink } from '../../data/sitemap';
import { siteConfig } from '../../lib/siteConfig';

interface SitemapStructuredDataProps {
  pageUrl: string;
  pageTitle: string;
  pageDescription: string;
  links: SitemapLink[];
}

export default function SitemapStructuredData({
  pageUrl,
  pageTitle,
  pageDescription,
  links,
}: SitemapStructuredDataProps) {
  const origin = pageUrl.replace(/\/sitemap$/, '');

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageTitle,
        description: pageDescription,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          name: `${siteConfig.governmentName} — BetterCabanatuan.org`,
          url: origin || pageUrl,
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: origin || '/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Sitemap',
              item: pageUrl,
            },
          ],
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#itemlist`,
        name: `${siteConfig.governmentName} Sitemap`,
        numberOfItems: links.length,
        itemListElement: links.slice(0, 100).map((link, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: link.label,
          url: link.external
            ? link.href
            : `${origin}${link.href.startsWith('/') ? link.href : `/${link.href}`}`,
        })),
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
