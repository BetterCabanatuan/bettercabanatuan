import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../ui/Breadcrumbs';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import {
  cityStats,
  governmentSections,
  services,
  siteConfig,
} from '../../lib/siteConfig';

export default function AboutHero() {
  const { t } = useTranslation('common');

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 md:py-16"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4 relative motion-safe:animate-fade-in">
        <Breadcrumbs
          className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/60"
          items={[
            { label: t('common.home'), href: '/' },
            { label: t('common.about'), href: '/about' },
          ]}
        />
        <p className="text-sm tracking-[0.2em] uppercase text-primary-200 mb-3">
          {t('about.hero.eyebrow')}
        </p>
        <Heading id="about-heading" className="text-white mb-3 max-w-3xl">
          {t('about.hero.title', { city: siteConfig.governmentName })}
        </Heading>
        <Text className="text-white/85 max-w-2xl text-base md:text-lg mb-0">
          {t('about.hero.subtitle', {
            serviceCount: services.length,
            govCount: governmentSections.length,
            barangayCount: cityStats.totalBarangays,
            province: siteConfig.province,
          })}
        </Text>
      </div>
    </section>
  );
}
