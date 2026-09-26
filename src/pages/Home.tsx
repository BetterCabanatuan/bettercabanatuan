import Hero from '../components/sections/Hero';
import ServicesSection from '../components/home/ServicesSection';
import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
import CityStats from '../components/home/CityStats';
import LocalConditionsSection from '../components/home/LocalConditionsSection';
import FacebookSection from '../components/home/FacebookSection';
import SEO from '../components/SEO';
import { organizationJsonLd, webSiteJsonLd } from '../lib/structuredData';
import { siteConfig } from '../lib/siteConfig';

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title={`${siteConfig.governmentName} Portal`}
        description={`Official community portal of ${siteConfig.governmentName}, ${siteConfig.province}. Access barangay info, government services, public officials, departments, and resources.`}
        keywords={`${siteConfig.governmentName}, government services, barangays, public officials, departments, community portal, ${siteConfig.province}, Philippines`}
        url="/"
        jsonLd={[organizationJsonLd(), webSiteJsonLd()]}
      />
      <Hero />
      <CityStats />
      <ServicesSection compact />
      <GovernmentActivitySection compact />
      <FacebookSection />
      <LocalConditionsSection />
    </>
  );
};

export default Home;
