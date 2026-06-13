import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Users,
  Phone,
  Sparkles,
  GraduationCap,
  Heart,
  Building2,
} from 'lucide-react';
import { siteConfig, cityStats, services, leadership } from '../../lib/siteConfig';

const intentPaths = [
  {
    title: 'Find a Service',
    description: 'Permits, health, education, and more',
    href: '/services',
    icon: Sparkles,
    accent: 'from-primary-500 to-primary-700',
  },
  {
    title: 'Explore Barangays',
    description: `${cityStats.totalBarangays} communities · ${cityStats.urbanBarangays} urban`,
    href: '/government/barangays',
    icon: MapPin,
    accent: 'from-accent-500 to-accent-700',
  },
  {
    title: 'Meet Officials',
    description: 'Mayor, vice mayor, and city council',
    href: '/government/officials',
    icon: Users,
    accent: 'from-secondary-500 to-secondary-700',
  },
  {
    title: 'Get in Touch',
    description: 'City hall, email, and portal support',
    href: '/contact',
    icon: Phone,
    accent: 'from-success-500 to-success-700',
  },
];

const popularTopics = [
  {
    label: 'Health Services',
    href: '/services/health-services',
    icon: Heart,
  },
  {
    label: 'Education',
    href: '/services/education',
    icon: GraduationCap,
  },
  {
    label: 'Business Permits',
    href: '/services/business',
    icon: Building2,
  },
];

export default function Hero() {
  const { t } = useTranslation('common');

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 md:py-20 lg:py-24"
      aria-labelledby="hero-heading"
    >
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            {/* Copy column */}
            <div className="lg:col-span-7 xl:col-span-6 motion-safe:animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-100 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-200" />
                {t('hero.badge')}
              </div>

              <p className="text-sm tracking-[0.22em] uppercase text-primary-200 mb-4">
                {t('hero.eyebrow')}
              </p>

              <h1
                id="hero-heading"
                className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-semibold leading-[1.05] text-white mb-6"
              >
                <span className="block">{siteConfig.governmentName}</span>
                <span className="block text-primary-100 mt-1">
                  {t('hero.headlineAccent')}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/85 max-w-xl leading-relaxed mb-8">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 py-3 bg-white text-primary-900 rounded-xl font-semibold hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700 transition-all duration-200"
                >
                  {t('hero.exploreServices')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 py-3 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700 transition-all duration-200"
                >
                  {t('hero.learnMore')}
                </Link>
              </div>

              {/* Location + leadership strip */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-6 border-t border-white/20">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/60 mb-1">
                    Location
                  </p>
                  <p className="text-sm font-medium text-white">
                    {siteConfig.province}, {siteConfig.region}
                  </p>
                </div>
                {leadership.mayor && (
                  <div className="hidden sm:block w-px h-10 bg-white/20" />
                )}
                {leadership.mayor && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-white/60 mb-1">
                      City Mayor
                    </p>
                    <p className="text-sm font-medium text-white">
                      {leadership.mayor.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bento intent grid */}
            <div className="lg:col-span-5 xl:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-200 mb-4">
                {t('hero.startHere')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {intentPaths.map((path, index) => (
                  <Link
                    key={path.href}
                    to={path.href}
                    className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-all duration-200 motion-safe:animate-fade-in"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${path.accent}`}
                      aria-hidden="true"
                    />
                    <span
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-primary-600 mb-4 group-hover:bg-primary-50 transition-colors duration-200"
                    >
                      <path.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h2 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">
                      {path.title}
                    </h2>
                    <p className="text-sm text-gray-500 leading-snug">
                      {path.description}
                    </p>
                    <ArrowUpRight
                      className="absolute top-5 right-5 h-4 w-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

        {/* Popular topics rail */}
        <div className="border-t border-white/20 py-6 md:py-8 mt-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <p className="text-sm font-semibold text-white shrink-0">
              {t('hero.popularTopics')}
            </p>
            <div className="flex flex-wrap gap-2">
              {popularTopics.map(topic => (
                <Link
                  key={topic.href}
                  to={topic.href}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all duration-200"
                >
                  <topic.icon
                    className="h-4 w-4 text-primary-200"
                    aria-hidden="true"
                  />
                  {topic.label}
                </Link>
              ))}
              {services.slice(3, 5).map(service => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all duration-200"
                >
                  {service.category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
