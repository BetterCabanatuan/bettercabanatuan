import { siteConfig } from '../lib/siteConfig';

function getBaseUrl(): string {
  return (
    siteConfig.siteUrl ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  );
}

export function organizationJsonLd() {
  const base = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    '@id': `${base}/#organization`,
    name: siteConfig.governmentName,
    alternateName: `${siteConfig.governmentName}, ${siteConfig.province}`,
    description: siteConfig.siteDescription,
    url: base,
    logo: `${base}/LogoLight.svg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.governmentName,
      addressRegion: siteConfig.province,
      addressCountry: 'PH',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contactPhone,
      email: siteConfig.contactEmail,
      contactType: 'customer service',
      areaServed: {
        '@type': 'City',
        name: siteConfig.governmentName,
      },
    },
    sameAs: [
      siteConfig.facebookUrl,
      siteConfig.twitterUrl,
      siteConfig.youtubeUrl,
    ].filter(Boolean),
  };
}

export function webSiteJsonLd() {
  const base = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    name: `${siteConfig.governmentName} — BetterCabanatuan.org`,
    url: base,
    description: siteConfig.siteDescription,
    publisher: { '@id': `${base}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${base}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  const base = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${base}${item.url}`,
    })),
  };
}

export function barangayJsonLd(barangay: {
  name: string;
  slug: string;
  description: string;
  classification: string;
  population: Record<string, number>;
}) {
  const base = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Place',
        '@id': `${base}/government/barangays/${barangay.slug}#place`,
        name: `Barangay ${barangay.name}`,
        description: barangay.description,
        url: `${base}/government/barangays/${barangay.slug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: barangay.name,
          addressRegion: `${siteConfig.province}, ${siteConfig.region}`,
          addressCountry: 'PH',
        },
        containedInPlace: {
          '@type': 'City',
          '@id': `${base}/#organization`,
          name: siteConfig.governmentName,
        },
      },
      breadcrumbJsonLd([
        { name: 'Home', url: '/' },
        { name: 'Government', url: '/government' },
        { name: 'Barangays', url: '/government/barangays' },
        { name: barangay.name, url: `/government/barangays/${barangay.slug}` },
      ]),
    ],
  };
}

export function departmentJsonLd(department: {
  name: string;
  slug: string;
  description: string;
  head: string;
  phone: string;
  email: string;
  office: string;
}) {
  const base = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'GovernmentOrganization',
        '@id': `${base}/government/departments/${department.slug}#department`,
        name: department.name,
        description: department.description,
        url: `${base}/government/departments/${department.slug}`,
        telephone: department.phone,
        email: department.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: department.office,
          addressLocality: siteConfig.governmentName,
          addressRegion: siteConfig.province,
          addressCountry: 'PH',
        },
        partOf: { '@id': `${base}/#organization` },
      },
      breadcrumbJsonLd([
        { name: 'Home', url: '/' },
        { name: 'Government', url: '/government' },
        { name: 'Departments', url: '/government/departments' },
        {
          name: department.name,
          url: `/government/departments/${department.slug}`,
        },
      ]),
    ],
  };
}

export function projectJsonLd(project: {
  name: string;
  slug: string;
  description: string;
  department: string;
  location: string;
  budget: string;
  startDate: string;
  endDate: string;
  status?: string;
}) {
  const base = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Project',
    '@id': `${base}/government/projects/${project.slug}#project`,
    name: project.name,
    description: project.description,
    url: `${base}/government/projects/${project.slug}`,
    location: project.location,
    budget: project.budget,
    startDate: project.startDate,
    endDate: project.endDate,
    department: project.department,
    status: project.status,
    partOf: { '@id': `${base}/#organization` },
  };
}

export function contactJsonLd() {
  const base = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${base}/contact#localbusiness`,
        name: `${siteConfig.governmentName} City Hall`,
        description: `Contact information for ${siteConfig.governmentName} local government.`,
        url: `${base}/contact`,
        telephone: siteConfig.contactPhone,
        email: siteConfig.contactEmail,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'M. De Leon Avenue',
          addressLocality: siteConfig.governmentName,
          addressRegion: siteConfig.province,
          addressCountry: 'PH',
        },
        sameAs: [siteConfig.facebookUrl, siteConfig.twitterUrl].filter(Boolean),
      },
      breadcrumbJsonLd([
        { name: 'Home', url: '/' },
        { name: 'Contact', url: '/contact' },
      ]),
    ],
  };
}

export function officialsJsonLd(
  officials: Array<{
    name: string;
    title: string;
    slug?: string;
  }>
) {
  const base = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...officials.map((official, index) => ({
        '@type': 'Person',
        '@id': official.slug
          ? `${base}/government/officials#${official.slug}`
          : `${base}/government/officials#person-${index}`,
        name: official.name,
        jobTitle: official.title,
        worksFor: { '@id': `${base}/#organization` },
      })),
      breadcrumbJsonLd([
        { name: 'Home', url: '/' },
        { name: 'Government', url: '/government' },
        { name: 'Public Officials', url: '/government/officials' },
      ]),
    ],
  };
}
