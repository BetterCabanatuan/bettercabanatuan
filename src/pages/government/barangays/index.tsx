import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Text } from '../../../components/ui/Text';
import Section from '../../../components/ui/Section';
import SEO from '../../../components/SEO';
import GovernmentPageHero from '../../../components/government/GovernmentPageHero';
import { Card, CardContent } from '../../../components/ui/Card';
import { Banner } from '@bettergov/kapwa/banner';
import {
  allBarangays,
  barangaysData,
  getBarangayPopulationTrend,
  type Barangay,
} from '../../../data/yamlLoader';
import { siteConfig } from '../../../lib/siteConfig';
import {
  MapPin,
  Building2,
  TreePine,
  Search,
  ChevronDown,
  Users,
} from 'lucide-react';

const filterDescriptions: Record<string, string> = {
  urban: `Explore the urban barangays of ${siteConfig.governmentName}.`,
  rural: `Explore the rural barangays of ${siteConfig.governmentName}.`,
};

/** Most recent published population for a barangay, or 0 if none is published. */
function latestPopulation(barangay: Barangay): number {
  return getBarangayPopulationTrend(barangay).at(-1)?.population ?? 0;
}

export default function BarangaysPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('type') || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<
    'name' | 'classification' | 'population'
  >('name');

  const filteredBarangays = useMemo(() => {
    let result = [...allBarangays];

    if (filter === 'urban') {
      result = result.filter(b => b.classification === 'Urban');
    } else if (filter === 'rural') {
      result = result.filter(b => b.classification === 'Rural');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        b =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'classification') {
      result.sort(
        (a, b) =>
          a.classification.localeCompare(b.classification) ||
          a.name.localeCompare(b.name)
      );
    } else if (sortBy === 'population') {
      // Barangays with no published figure sort last rather than as zero.
      result.sort((a, b) => latestPopulation(b) - latestPopulation(a));
    }

    return result;
  }, [filter, searchQuery, sortBy]);

  const urbanCount = allBarangays.filter(
    b => b.classification === 'Urban'
  ).length;
  const ruralCount = allBarangays.filter(
    b => b.classification === 'Rural'
  ).length;

  const pageTitle =
    filter === 'urban'
      ? 'Urban Barangays'
      : filter === 'rural'
        ? 'Rural Barangays'
        : 'Barangays';

  const pageDescription =
    filterDescriptions[filter] ??
    barangaysData.description ??
    `Explore all barangays of ${siteConfig.governmentName}.`;

  const overviewCards = [
    {
      label: 'Total Barangays',
      value: String(allBarangays.length),
      note: 'Across the city',
      icon: MapPin,
      bg: 'bg-primary-50 text-primary-600',
    },
    {
      label: 'Urban',
      value: String(urbanCount),
      note: 'Urban barangays',
      icon: Building2,
      bg: 'bg-accent-50 text-accent-600',
    },
    {
      label: 'Rural',
      value: String(ruralCount),
      note: 'Rural barangays',
      icon: TreePine,
      bg: 'bg-success-50 text-success-600',
    },
  ];

  const getIcon = (classification: string) => {
    if (classification === 'Urban') {
      return <Building2 className="h-5 w-5 text-primary-600" />;
    }
    return <TreePine className="h-5 w-5 text-green-600" />;
  };

  const getBadgeClass = (classification: string) => {
    if (classification === 'Urban') {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-green-100 text-green-800';
  };

  const setFilter = (type: string) => {
    if (type) {
      setSearchParams({ type });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords="barangays, Cabanatuan City, urban barangays, rural barangays, local government, community"
        url="/government/barangays"
      />
      <GovernmentPageHero
        eyebrow="City Government"
        title={pageTitle}
        description={pageDescription}
        icon={MapPin}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Government', href: '/government' },
          { label: 'Barangays', href: '/government/barangays' },
        ]}
      />

      <Section className="p-3 mb-12 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {overviewCards.map(card => (
            <Card key={card.label} className="h-full ring-1 ring-black/[0.06]">
              <CardContent className="p-5">
                <span
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${card.bg} mb-3`}
                >
                  <card.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-2xl font-bold text-gray-900 tabular-nums mb-1">
                  {card.value}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {card.label}
                </p>
                <p className="text-xs text-gray-500 mt-1">{card.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search barangays..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={e =>
                  setSortBy(
                    e.target.value as 'name' | 'classification' | 'population'
                  )
                }
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
              >
                <option value="name">Name</option>
                <option value="classification">Classification</option>
                <option value="population">Population</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !filter
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('urban')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'urban'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Urban
          </button>
          <button
            onClick={() => setFilter('rural')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'rural'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rural
          </button>
        </div>

        <Text className="text-gray-500 mb-4 text-sm">
          Showing {filteredBarangays.length} barangay
          {filteredBarangays.length !== 1 ? 's' : ''}
        </Text>

        {filteredBarangays.length === 0 ? (
          <Banner
            type="info"
            title="No barangays found"
            description="Try adjusting your search or filters."
            icon
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBarangays.map(barangay => (
              <Link
                key={barangay.slug}
                to={`/government/barangays/${barangay.slug}`}
              >
                <Card hoverable className="h-full ring-1 ring-black/[0.06]">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getIcon(barangay.classification)}
                        <h4 className="text-lg font-medium text-gray-900">
                          {barangay.name}
                        </h4>
                      </div>
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getBadgeClass(
                          barangay.classification
                        )}`}
                      >
                        {barangay.classification}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {barangay.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      {latestPopulation(barangay) > 0
                        ? `${latestPopulation(barangay).toLocaleString()} residents`
                        : 'Population not yet published'}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
