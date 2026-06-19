import { Helmet } from 'react-helmet-async';
import { buildCanonicalUrl, getSiteUrl, siteConfig } from '../lib/siteConfig';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  siteName = siteConfig.governmentName,
  noindex = false,
  jsonLd,
}: SEOProps) {
  const siteUrl = getSiteUrl();
  const defaultTitle = `${siteName} — BetterCabanatuan.org`;
  const defaultDescription =
    siteConfig.siteDescription ||
    `Official community portal of ${siteName}. Access government services, barangay information, public officials, and resources.`;
  const defaultKeywords =
    import.meta.env.VITE_SITE_KEYWORDS ||
    `${siteName}, government, local government, services, public services, civic services, barangays, Nueva Ecija, Philippines`;

  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords || defaultKeywords;
  const canonicalPath = url || '';
  const fullUrl = canonicalPath
    ? buildCanonicalUrl(
        canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`
      )
    : siteUrl;
  const fullImage = image || siteConfig.ogImageUrl || `${siteUrl}/og-image.jpg`;

  const supportedLanguages = ['en', 'fil'];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content={siteName} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_PH" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      {siteConfig.twitterHandle && (
        <meta name="twitter:site" content={siteConfig.twitterHandle} />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Hreflang - alternate language versions */}
      {supportedLanguages.map(lang => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${siteUrl}${canonicalPath.startsWith('/') ? canonicalPath : canonicalPath ? `/${canonicalPath}` : ''}?lang=${lang}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
