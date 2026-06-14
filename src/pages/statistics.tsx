import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import {
  siteConfig,
  cityStats,
  serviceCount,
  leadership,
  services,
  governmentSections,
} from '../lib/siteConfig';
import {
  Users,
  MapPin,
  Heart,
  Building2,
  Maximize,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

const overviewStats = [
  {
    label: 'Total Population',
    value: cityStats.totalPopulation.toLocaleString(),
    note: '2020 Census',
    icon: Users,
    border: 'border-primary-500',
    bg: 'bg-primary-50 text-primary-600',
  },
  {
    label: 'Barangays',
    value: String(cityStats.totalBarangays),
    note: `${cityStats.urbanBarangays} urban · ${cityStats.ruralBarangays} rural`,
    icon: MapPin,
    border: 'border-accent-500',
    bg: 'bg-accent-50 text-accent-600',
  },
  {
    label: 'Land Area',
    value: `${cityStats.landArea} km²`,
    note: siteConfig.province,
    icon: Maximize,
    border: 'border-success-500',
    bg: 'bg-success-50 text-success-600',
  },
  {
    label: 'Service Areas',
    value: String(serviceCount),
    note: 'Catalogued on this portal',
    icon: Heart,
    border: 'border-secondary-500',
    bg: 'bg-secondary-50 text-secondary-600',
  },
  {
    label: 'Elected Officials',
    value: String(leadership.totalOfficials),
    note: `${leadership.councilorCount} city councilors`,
    icon: Building2,
    border: 'border-primary-500',
    bg: 'bg-primary-50 text-primary-600',
  },
  {
    label: 'Government Sections',
    value: String(governmentSections.length),
    note: 'Departments, news, transparency',
    icon: TrendingUp,
    border: 'border-accent-500',
    bg: 'bg-accent-50 text-accent-600',
  },
];

export default function StatisticsPage() {
  return (
    <>
      <SEO
        title="Statistics"
        description={`Key statistics for ${siteConfig.governmentName} — population, barangays, land area, services, and government data.`}
        keywords="statistics, Cabanatuan City, population, barangays, local government data"
      />
      <main className="flex-grow">
        {/* Hero-style header + stat cards */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 relative">
            <div className="motion-safe:animate-fade-in mb-8">
              <Breadcrumbs
                className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/60"
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Statistics', href: '/statistics' },
                ]}
              />
              <p className="text-sm tracking-[0.2em] uppercase text-primary-200 mb-3">
                City Data
              </p>
              <Heading className="text-white mb-3 max-w-3xl">
                {siteConfig.governmentName} Statistics
              </Heading>
              <Text className="text-white/85 max-w-2xl text-base md:text-lg mb-0">
                Population figures, barangay counts, service coverage, and other
                public data for {siteConfig.governmentName},{' '}
                {siteConfig.province}.
              </Text>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {overviewStats.map((stat, index) => (
                <Card
                  key={stat.label}
                  hoverable
                  className={`border-t-4 ${stat.border} h-full motion-safe:animate-stat-rise hover:-translate-y-1 transition-transform duration-300`}
                  style={{ animationDelay: `${120 + index * 80}ms` }}
                >
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex items-center justify-center w-11 h-11 rounded-lg ${stat.bg} mb-4 transition-transform duration-300 group-hover:scale-110`}
                    >
                      <stat.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 tabular-nums mb-1">
                      {stat.value}
                    </p>
                    <Heading level={6} className="text-base text-gray-900 mb-1">
                      {stat.label}
                    </Heading>
                    <Text className="text-sm text-gray-500 mb-0">
                      {stat.note}
                    </Text>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Section className="p-3 mb-12 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div
              className="motion-safe:animate-slide-in"
              style={{ animationDelay: '200ms' }}
            >
              <Heading level={2} className="mb-4">
                Service Coverage
              </Heading>
              <Text className="text-gray-600 mb-6">
                {serviceCount} service categories documented on this portal.
              </Text>
              <ul className="space-y-2">
                {services.map((service, index) => (
                  <li
                    key={service.slug}
                    className="motion-safe:animate-slide-in"
                    style={{ animationDelay: `${280 + index * 40}ms` }}
                  >
                    <Link
                      to={`/services/${service.slug}`}
                      className="flex items-center justify-between min-h-[44px] px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-800 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 hover:translate-x-0.5 transition-all duration-200"
                    >
                      {service.category}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="motion-safe:animate-slide-in"
              style={{ animationDelay: '320ms' }}
            >
              <Heading level={2} className="mb-4">
                Barangay Breakdown
              </Heading>
              <Text className="text-gray-600 mb-6">
                Explore all {cityStats.totalBarangays} barangays by
                classification.
              </Text>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Card
                  className="bg-blue-50 border-blue-200 motion-safe:animate-stat-rise hover:-translate-y-1 transition-transform duration-300"
                  style={{ animationDelay: '400ms' }}
                >
                  <CardContent className="p-5">
                    <p className="text-3xl font-bold text-blue-800 tabular-nums">
                      {cityStats.urbanBarangays}
                    </p>
                    <p className="text-sm font-medium text-blue-900">Urban</p>
                  </CardContent>
                </Card>
                <Card
                  className="bg-green-50 border-green-200 motion-safe:animate-stat-rise hover:-translate-y-1 transition-transform duration-300"
                  style={{ animationDelay: '480ms' }}
                >
                  <CardContent className="p-5">
                    <p className="text-3xl font-bold text-green-800 tabular-nums">
                      {cityStats.ruralBarangays}
                    </p>
                    <p className="text-sm font-medium text-green-900">Rural</p>
                  </CardContent>
                </Card>
              </div>
              <Link
                to="/government/barangays"
                className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 hover:gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-all duration-200 motion-safe:animate-fade-in"
                style={{ animationDelay: '560ms' }}
              >
                View all barangays
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
