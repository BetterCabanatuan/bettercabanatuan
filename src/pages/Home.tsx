import Hero from '../components/sections/Hero';
import ServicesSection from '../components/home/ServicesSection';
import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
import CityStats from '../components/home/CityStats';
import Map from '../components/home/Map';
import Weather from '../components/home/Weather';
import SEO from '../components/SEO';
import { organizationJsonLd, webSiteJsonLd } from '../lib/structuredData';
import { siteConfig } from '../lib/siteConfig';

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title={`${siteConfig.governmentName} — BetterCabanatuan.org`}
        description={`Official community portal of ${siteConfig.governmentName}, ${siteConfig.province}. Access barangay info, government services, public officials, departments, and resources.`}
        keywords={`${siteConfig.governmentName}, government services, barangays, public officials, departments, community portal, ${siteConfig.province}, Philippines`}
        url="/"
        jsonLd={[organizationJsonLd(), webSiteJsonLd()]}
      />
      <main className="flex-grow">
        <Hero />
        <CityStats />
        <ServicesSection />
        <GovernmentActivitySection />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
          <Map />
          <Weather />
        </div>
      </main>
    </>
  );
};

export default Home;
