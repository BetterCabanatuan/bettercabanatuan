import { LayoutGrid } from 'lucide-react';
import ServicesSection from '../../components/home/ServicesSection';
import GovernmentPageHero from '../../components/government/GovernmentPageHero';
import Section from '../../components/ui/Section';
import SEO from '../../components/SEO';
import { serviceCategories } from '../../data/yamlLoader';
import { siteConfig } from '../../lib/siteConfig';

export default function ServicesIndexPage() {
  const pageTitle = serviceCategories.title ?? 'Government Services';
  const pageDescription =
    serviceCategories.description ??
    `All services provided by the ${siteConfig.governmentName} government. Find what you need for citizenship, business, education, and more.`;

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords="government services, public services, local government, civic services"
      />
      <main className="flex-grow">
        <GovernmentPageHero
          eyebrow="City Services"
          title={pageTitle}
          description={pageDescription}
          icon={LayoutGrid}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/services' },
          ]}
        />
        <Section className="p-3 mb-12 pt-10">
          <ServicesSection showHeader={false} />
        </Section>
      </main>
    </>
  );
}
