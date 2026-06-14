import Breadcrumbs from '../ui/Breadcrumbs';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';

interface SitemapHeroProps {
  title: string;
  description: string;
}

export default function SitemapHero({ title, description }: SitemapHeroProps) {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 md:py-16"
      aria-labelledby="sitemap-heading"
    >
      <div className="container mx-auto px-4 relative motion-safe:animate-fade-in">
        <Breadcrumbs
          className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/60"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Sitemap', href: '/sitemap' },
          ]}
        />
        <p className="text-sm tracking-[0.2em] uppercase text-primary-200 mb-3">
          Site Navigation
        </p>
        <Heading id="sitemap-heading" className="text-white mb-3 max-w-3xl">
          {title}
        </Heading>
        <Text className="text-white/85 max-w-2xl text-base md:text-lg mb-0">
          {description}
        </Text>
      </div>
    </section>
  );
}
