import { Landmark } from 'lucide-react';
import GovernmentActivitySection from '../../components/home/GovernmentActivitySection';
import GovernmentPageHero from '../../components/government/GovernmentPageHero';
import Section from '../../components/ui/Section';
import SEO from '../../components/SEO';
import { governmentCategories } from '../../data/yamlLoader';
import { siteConfig } from '../../lib/siteConfig';

export default function GovernmentIndexPage() {
  const pageTitle = governmentCategories.title ?? 'Government Activity';
  const pageDescription =
    governmentCategories.description ??
    `Government activity and information for ${siteConfig.governmentName}. Explore departments, officials, barangays, and more.`;

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords="government, local government, departments, officials, barangays"
      />
      <main className="flex-grow">
        <GovernmentPageHero
          eyebrow="City Government"
          title={pageTitle}
          description={pageDescription}
          icon={Landmark}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Government', href: '/government' },
          ]}
        />
        <Section className="p-3 mb-12 pt-10">
          <GovernmentActivitySection showHeader={false} />
        </Section>
      </main>
    </>
  );
}
