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
import {
  siteConfig,
  cityStats,
  services,
  leadership,
} from '../../lib/siteConfig';

const intentPathKeys = [
  {
    titleKey: 'hero.intent.findService.title',
    descriptionKey: 'hero.intent.findService.description',
    href: '/services',
    icon: Sparkles,
    accent: 'from-primary-500 to-primary-700',
  },
  {
    titleKey: 'hero.intent.exploreBarangays.title',
    descriptionKey: 'hero.intent.exploreBarangays.description',
    descriptionValues: {
      count: cityStats.totalBarangays,
      urban: cityStats.urbanBarangays,
    },
    href: '/government/barangays',
    icon: MapPin,
    accent: 'from-accent-500 to-accent-700',
  },
  {
    titleKey: 'hero.intent.meetOfficials.title',
    descriptionKey: 'hero.intent.meetOfficials.description',
    href: '/government/officials',
    icon: Users,
    accent: 'from-secondary-500 to-secondary-700',
  },
  {
    titleKey: 'hero.intent.getInTouch.title',
    descriptionKey: 'hero.intent.getInTouch.description',
    href: '/contact',
    icon: Phone,
    accent: 'from-success-500 to-success-700',
  },
] as const;

const popularTopicKeys = [
  {
    labelKey: 'hero.topics.healthServices',
    href: '/services/health-services',
    icon: Heart,
  },
  {
    labelKey: 'hero.topics.education',
    href: '/services/education',
    icon: GraduationCap,
  },
  {
    labelKey: 'hero.topics.businessPermits',
    href: '/services/business',
    icon: Building2,
  },
] as const;

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
              className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-semibold leading-[1.05] text-white mb-6 text-balance"
            >
              <span className="block">{siteConfig.governmentName}</span>
              <span className="block text-primary-100 mt-1">
                {t('hero.headlineAccent')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/85 max-w-xl leading-relaxed mb-8 text-pretty">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 py-3 bg-white text-primary-900 rounded-xl font-semibold hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700 transition-[transform,background-color,box-shadow] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
              >
                {t('hero.exploreServices')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 py-3 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700 transition-[transform,background-color,border-color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
              >
                {t('hero.learnMore')}
              </Link>
            </div>

            {/* Location + leadership strip */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-6 border-t border-white/20">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/60 mb-1">
                  {t('common.location')}
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
                    {t('common.cityMayor')}
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
              {intentPathKeys.map((path, index) => (
                <Link
                  key={path.href}
                  to={path.href}
                  className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-[transform,box-shadow] duration-200 active:scale-[0.96] motion-safe:animate-slide-in motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${path.accent}`}
                    aria-hidden="true"
                  />
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 text-primary-600 mb-4 group-hover:bg-primary-50 transition-colors duration-200">
                    <path.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="text-base font-semibold text-gray-900 mb-1 text-balance group-hover:text-primary-700 transition-colors duration-200">
                    {t(path.titleKey)}
                  </h2>
                  <p className="text-sm text-gray-500 leading-snug text-pretty">
                    {t(
                      path.descriptionKey,
                      'descriptionValues' in path
                        ? path.descriptionValues
                        : undefined
                    )}
                  </p>
                  <ArrowUpRight
                    className="absolute top-5 right-5 h-4 w-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-[transform,color] duration-200"
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
              {popularTopicKeys.map(topic => (
                <Link
                  key={topic.href}
                  to={topic.href}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-[transform,background-color,border-color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
                >
                  <topic.icon
                    className="h-4 w-4 text-primary-200"
                    aria-hidden="true"
                  />
                  {t(topic.labelKey)}
                </Link>
              ))}
              {services.slice(3, 5).map(service => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-[transform,background-color,border-color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
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
