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
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 md:py-16"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4 relative motion-safe:animate-fade-in">
        <Breadcrumbs
          className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/60"
          items={[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
          ]}
        />
        <p className="text-sm tracking-[0.2em] uppercase text-primary-200 mb-3">
          Community Portal
        </p>
        <Heading id="about-heading" className="text-white mb-3 max-w-3xl">
          About {siteConfig.governmentName}
        </Heading>
        <Text className="text-white/85 max-w-2xl text-base md:text-lg mb-0">
          An independent, volunteer-led portal helping residents navigate{' '}
          {services.length} service areas, {governmentSections.length} government
          sections, and {cityStats.totalBarangays} barangays across{' '}
          {siteConfig.province}.
        </Text>
      </div>
    </section>
  );
}
