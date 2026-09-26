import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  GraduationCap,
  Heart,
  MapPin,
  Phone,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import { siteConfig, cityStats, leadership } from '../../lib/siteConfig';

const intentPathKeys = [
  {
    titleKey: 'hero.intent.findService.title',
    descriptionKey: 'hero.intent.findService.description',
    href: '/services',
    icon: Sparkles,
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
  },
  {
    titleKey: 'hero.intent.meetOfficials.title',
    descriptionKey: 'hero.intent.meetOfficials.description',
    href: '/government/officials',
    icon: Users,
  },
  {
    titleKey: 'hero.intent.getInTouch.title',
    descriptionKey: 'hero.intent.getInTouch.description',
    href: '/contact',
    icon: Phone,
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
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(
      trimmed ? `/search?${new URLSearchParams({ q: trimmed })}` : '/search'
    );
  };

  return (
    <section
      className="relative overflow-hidden bg-primary-700 py-12 text-white md:py-16 lg:py-20"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'linear-gradient(to right, transparent, black 35%, black 70%, transparent)',
        }}
      />
      <div
        className="pointer-events-none absolute -right-32 -top-32 size-[34rem] rounded-full bg-primary-400/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="motion-safe:animate-fade-in lg:col-span-7">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-50 ring-1 ring-inset ring-white/20">
              <span className="size-1.5 rounded-full bg-accent-300" />
              {t('hero.badge')}
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-100">
              {t('hero.eyebrow')}
            </p>
            <h1
              id="hero-heading"
              className="mb-5 max-w-3xl text-balance text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.7rem]"
            >
              {siteConfig.governmentName}
              <span className="mt-1 block text-primary-100">
                {t('hero.headlineAccent')}
              </span>
            </h1>
            <p className="mb-7 max-w-2xl text-pretty text-lg leading-relaxed text-white/85 md:text-xl">
              {t('hero.subtitle')}
            </p>

            <form
              role="search"
              aria-label="Search the city portal"
              onSubmit={submitSearch}
              className="max-w-2xl"
            >
              <label htmlFor="hero-search" className="sr-only">
                Search the city portal
              </label>
              <div className="flex gap-2 rounded-2xl bg-white p-2 shadow-[0_8px_30px_rgba(0,35,84,0.24)]">
                <div className="relative min-w-0 flex-1">
                  <Search
                    className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    id="hero-search"
                    type="search"
                    enterKeyHint="search"
                    autoComplete="off"
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder={t('search.placeholder')}
                    className="min-h-12 w-full rounded-xl border-0 bg-white py-3 pl-11 pr-3 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary-700 px-4 font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 sm:px-6"
                >
                  <span className="hidden sm:inline">{t('search.submit')}</span>
                  <Search className="size-5" aria-hidden="true" />
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm font-medium text-primary-100">
                {t('hero.popularTopics')}
              </span>
              {popularTopicKeys.map(topic => (
                <Link
                  key={topic.href}
                  to={topic.href}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/20 transition-[background-color,transform] duration-150 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[0.98] motion-reduce:active:scale-100"
                >
                  <topic.icon
                    className="size-4 text-primary-100"
                    aria-hidden="true"
                  />
                  {t(topic.labelKey)}
                </Link>
              ))}
            </div>
          </div>

          <aside
            className="overflow-hidden rounded-3xl bg-primary-950/30 shadow-[0_20px_60px_rgba(0,31,75,0.28)] ring-1 ring-inset ring-white/15 backdrop-blur-sm lg:col-span-5"
            aria-label={t('hero.startHere')}
          >
            <div className="border-b border-white/15 px-5 py-4 sm:px-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-100">
                {t('hero.startHere')}
              </p>
            </div>
            <nav aria-label={t('hero.startHere')}>
              <ul className="divide-y divide-white/10">
                {intentPathKeys.map(path => (
                  <li key={path.href}>
                    <Link
                      to={path.href}
                      className="group flex min-h-[88px] items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-white/10 focus:outline-none focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white sm:px-6"
                    >
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-inset ring-white/15 transition-colors group-hover:bg-white/15">
                        <path.icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-white">
                          {t(path.titleKey)}
                        </span>
                        <span className="mt-0.5 block text-sm text-white/85">
                          {t(
                            path.descriptionKey,
                            'descriptionValues' in path
                              ? path.descriptionValues
                              : undefined
                          )}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-primary-100 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="grid grid-cols-1 gap-4 border-t border-white/15 bg-black/10 px-5 py-4 text-sm sm:grid-cols-2 sm:px-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/80">
                  {t('common.location')}
                </p>
                <p className="mt-1 font-medium text-white">
                  {siteConfig.province}, {siteConfig.region}
                </p>
              </div>
              {leadership.mayor && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/80">
                    {t('common.cityMayor')}
                  </p>
                  <p className="mt-1 font-medium text-white">
                    {leadership.mayor.name}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>

        <div className="mt-8 flex justify-start lg:mt-10">
          <Link
            to="/services"
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-white underline decoration-white/30 underline-offset-4 transition-[text-decoration-color,gap] hover:gap-3 hover:decoration-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {t('hero.exploreServices')}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
