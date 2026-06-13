import Breadcrumbs from '../ui/Breadcrumbs';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import type { LucideIcon } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface GovernmentPageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  breadcrumbs: BreadcrumbItem[];
}

export default function GovernmentPageHero({
  eyebrow,
  title,
  description,
  icon: Icon,
  breadcrumbs,
}: GovernmentPageHeroProps) {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 md:py-16"
      aria-labelledby="government-page-heading"
    >
      <div className="container mx-auto px-4 relative motion-safe:animate-fade-in">
        <Breadcrumbs
          className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/60"
          items={breadcrumbs}
        />
        <div className="flex items-start gap-4">
          {/* {Icon && (
            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/15 text-white shrink-0">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
          )} */}
          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-primary-200 mb-3">
              {eyebrow}
            </p>
            <Heading
              id="government-page-heading"
              className="text-white mb-3 max-w-3xl"
            >
              {title}
            </Heading>
            <Text className="text-white/85 max-w-2xl text-base md:text-lg mb-0">
              {description}
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
}
