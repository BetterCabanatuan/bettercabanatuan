import SEO from '../components/SEO';
import AboutHero from '../components/about/AboutHero';
import AboutMissionSection from '../components/about/AboutMissionSection';
import AboutLeadershipSection from '../components/about/AboutLeadershipSection';
import AboutServicesSection from '../components/about/AboutServicesSection';
import AboutGovernmentSection from '../components/about/AboutGovernmentSection';
import AboutValuesSection from '../components/about/AboutValuesSection';
import AboutDisclaimerSection from '../components/about/AboutDisclaimerSection';
import AboutContributeSection from '../components/about/AboutContributeSection';
import { cityStats, services, siteConfig } from '../lib/siteConfig';
import Map from '../components/home/Map';

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About"
        description={`About the ${siteConfig.governmentName} community portal — ${cityStats.totalBarangays} barangays, ${services.length} service areas, and local government information.`}
        keywords="about, community portal, local government, Cabanatuan City, Nueva Ecija, civic tech"
      />
      <main className="flex-grow">
        <AboutHero />
        <AboutMissionSection />
        <AboutLeadershipSection />
        <AboutServicesSection />
        <AboutGovernmentSection />
        <Map />
        <AboutValuesSection />
        <AboutDisclaimerSection />
        <AboutContributeSection />
      </main>
    </>
  );
}
