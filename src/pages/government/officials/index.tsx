import { Users } from 'lucide-react';
import PublicOfficials from '../../../components/sections/PublicOfficials';
import GovernmentPageHero from '../../../components/government/GovernmentPageHero';
import Section from '../../../components/ui/Section';
import SEO from '../../../components/SEO';
import { governmentCategories } from '../../../data/yamlLoader';
import { siteConfig } from '../../../lib/siteConfig';
import { officialsJsonLd, breadcrumbJsonLd } from '../../../lib/structuredData';
import { mayor, viceMayor, getCouncilors } from '../../../data/publicOfficials';

const officialsSection = governmentCategories.categories.find(
  category => category.slug === 'officials'
);

const pageDescription =
  officialsSection?.description ??
  `Meet the elected officials of ${siteConfig.governmentName} for the 2025-2028 term.`;

export default function OfficialsPage() {
  const officials = [
    ...(mayor
      ? [{ name: mayor.name, title: mayor.position, slug: 'mayor' }]
      : []),
    ...(viceMayor
      ? [
          {
            name: viceMayor.name,
            title: viceMayor.position,
            slug: 'vice-mayor',
          },
        ]
      : []),
    ...getCouncilors().map((c, i) => ({
      name: c.name,
      title: c.position || 'City Councilor',
      slug: `councilor-${i}`,
    })),
  ];

  return (
    <>
      <SEO
        title="Public Officials"
        description={pageDescription}
        keywords={`public officials, city council, mayor, vice mayor, sangguniang panlungsod, ${siteConfig.governmentName}`}
        url="/government/officials"
        jsonLd={[
          ...officialsJsonLd(officials)['@graph'],
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Government', url: '/government' },
            { name: 'Public Officials', url: '/government/officials' },
          ]),
        ]}
      />
      <main className="flex-grow">
        <GovernmentPageHero
          eyebrow="City Government"
          title="Public Officials"
          description={pageDescription}
          icon={Users}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Government', href: '/government' },
            { label: 'Public Officials', href: '/government/officials' },
          ]}
        />
        <Section className="p-3 mb-12 pt-10">
          <PublicOfficials />
        </Section>
      </main>
    </>
  );
}
