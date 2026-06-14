import { Users } from 'lucide-react';
import PublicOfficials from '../../../components/sections/PublicOfficials';
import GovernmentPageHero from '../../../components/government/GovernmentPageHero';
import Section from '../../../components/ui/Section';
import SEO from '../../../components/SEO';
import { governmentCategories } from '../../../data/yamlLoader';
import { siteConfig } from '../../../lib/siteConfig';

const officialsSection = governmentCategories.categories.find(
  category => category.slug === 'officials'
);

const pageDescription =
  officialsSection?.description ??
  `Meet the elected officials of ${siteConfig.governmentName} for the 2025-2028 term.`;

export default function OfficialsPage() {
  return (
    <>
      <SEO
        title="Public Officials"
        description={pageDescription}
        keywords="public officials, city council, mayor, vice mayor, sangguniang panlungsod, Cabanatuan City"
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
