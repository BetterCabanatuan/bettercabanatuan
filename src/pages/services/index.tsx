import ServicesSection from '../../components/home/ServicesSection';
import SEO from '../../components/SEO';
import { siteConfig } from '../../lib/siteConfig';

export default function ServicesIndexPage() {
  return (
    <>
      <SEO
        title="Services"
        description={`All services provided by the ${siteConfig.governmentName} government. Find what you need for citizenship, business, education, and more.`}
        keywords="government services, public services, local government, civic services"
      />
      <ServicesSection
        title="All local government services"
        description={`All services provided by the ${siteConfig.governmentName} government. Find what you need for citizenship, business, education, and more.`}
      />
    </>
  );
}
