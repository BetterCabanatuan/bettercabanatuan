import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import AboutHero from '../components/about/AboutHero';
import AboutMissionSection from '../components/about/AboutMissionSection';
import AboutHistorySection from '../components/about/AboutHistorySection';
import AboutLeadershipSection from '../components/about/AboutLeadershipSection';
import AboutServicesSection from '../components/about/AboutServicesSection';
import AboutGovernmentSection from '../components/about/AboutGovernmentSection';
import AboutValuesSection from '../components/about/AboutValuesSection';
import AboutDisclaimerSection from '../components/about/AboutDisclaimerSection';
import AboutContributeSection from '../components/about/AboutContributeSection';
import { cityStats, services, siteConfig } from '../lib/siteConfig';
import Map from '../components/home/Map';

export default function AboutPage() {
  const { t } = useTranslation('common');

  return (
    <>
      <SEO
        title={t('about.seoTitle')}
        description={t('about.seoDescription', {
          city: siteConfig.governmentName,
          barangays: cityStats.totalBarangays,
          services: services.length,
        })}
        keywords="about, community portal, local government, Cabanatuan City, Nueva Ecija, civic tech"
      />
      <main className="grow">
        <AboutHero />
        <AboutMissionSection />
        <AboutHistorySection />
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
