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
import { breadcrumbJsonLd } from '../lib/structuredData';
import Map from '../components/home/Map';
import SectionJumpNav from '../components/ui/SectionJumpNav';

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
        keywords={`about, community portal, local government, ${siteConfig.governmentName}, ${siteConfig.province}, civic tech`}
        url="/about"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ])}
      />
      <AboutHero />
      <div className="container mx-auto px-4 pt-8">
        <SectionJumpNav
          items={[
            { id: 'mission', label: 'Mission' },
            { id: 'history', label: 'History' },
            { id: 'leadership', label: 'Leadership' },
            { id: 'services', label: 'Services' },
            { id: 'government', label: 'Government' },
            { id: 'values', label: 'Values' },
          ]}
        />
      </div>
      <div id="mission" className="scroll-mt-28">
        <AboutMissionSection />
      </div>
      <div id="history" className="scroll-mt-28">
        <AboutHistorySection />
      </div>
      <div id="leadership" className="scroll-mt-28">
        <AboutLeadershipSection />
      </div>
      <div id="services" className="scroll-mt-28">
        <AboutServicesSection />
      </div>
      <div id="government" className="scroll-mt-28">
        <AboutGovernmentSection />
      </div>
      <Map />
      <div id="values" className="scroll-mt-28">
        <AboutValuesSection />
      </div>
      <AboutDisclaimerSection />
      <AboutContributeSection />
    </>
  );
}
