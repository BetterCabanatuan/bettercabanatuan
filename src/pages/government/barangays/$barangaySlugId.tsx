import { useParams, Link } from 'react-router-dom';
import { Heading } from '../../../components/ui/Heading';
import { Text } from '../../../components/ui/Text';
import Section from '../../../components/ui/Section';
import SEO from '../../../components/SEO';
import Breadcrumbs from '../../../components/ui/Breadcrumbs';
import MapBanner from '../../../components/ui/MapBanner';
import { Card, CardContent } from '../../../components/ui/Card';
import NotFoundGuard from '../../../components/shared/NotFoundGuard';
import {
  getBarangayBySlug,
  allBarangays,
  barangaysData,
  getBarangayPopulationTrend,
  BARANGAY_POPULATION_YEARS,
  type BarangayPopulationYear,
} from '../../../data/yamlLoader';
import { siteConfig } from '../../../lib/siteConfig';
import { barangayJsonLd } from '../../../lib/structuredData';
import {
  MapPin,
  Building2,
  TreePine,
  ChevronLeft,
  Users,
  Hash,
  History,
  Landmark,
} from 'lucide-react';

const BarangayDetail: React.FC = () => {
  const { barangaySlugId } = useParams<{ barangaySlugId: string }>();
  const barangay = barangaySlugId
    ? getBarangayBySlug(barangaySlugId)
    : undefined;

  if (!barangay) {
    return (
      <NotFoundGuard
        subject="barangay"
        backHref="/government/barangays"
        backLabel="Back to all barangays"
      />
    );
  }

  const isUrban = barangay.classification === 'Urban';

  // Years with a verified figure only — null years are omitted, never faked.
  const populationTrend = getBarangayPopulationTrend(barangay);
  const presentYears = new Set(populationTrend.map(p => p.year));
  const missingYears = BARANGAY_POPULATION_YEARS.filter(
    year => !presentYears.has(year)
  ) as BarangayPopulationYear[];
  const latestYear = populationTrend[populationTrend.length - 1]?.year;
  const latestPopulation =
    populationTrend[populationTrend.length - 1]?.population;
  const LATEST_CENSUS_YEAR =
    latestYear ??
    BARANGAY_POPULATION_YEARS[BARANGAY_POPULATION_YEARS.length - 1];

  const relatedBarangays = allBarangays
    .filter(
      b =>
        b.classification === barangay.classification && b.slug !== barangay.slug
    )
    .slice(0, 3);

  return (
    <>
      <SEO
        title={`Barangay ${barangay.name}`}
        description={barangay.description}
        keywords={`${barangay.name}, barangay, ${siteConfig.governmentName}, ${barangay.classification.toLowerCase()}, local government`}
        url={`/government/barangays/${barangay.slug}`}
        jsonLd={barangayJsonLd(barangay)}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Barangays', href: '/government/barangays' },
            {
              label: barangay.name,
              href: `/government/barangays/${barangay.slug}`,
            },
          ]}
        />

        <div className="mb-8">
          <Link
            to="/government/barangays"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 mb-4 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to all barangays
          </Link>

          <div className="flex items-center gap-3 mb-3">
            {isUrban ? (
              <Building2 className="h-8 w-8 text-primary-600" />
            ) : (
              <TreePine className="h-8 w-8 text-green-600" />
            )}
            <Heading>{barangay.name}</Heading>
          </div>

          <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
              isUrban
                ? 'bg-badge-info text-badge-info-fg'
                : 'bg-badge-success text-badge-success-fg'
            }`}
          >
            {barangay.classification}
          </span>

          {/*
            The map anchor. A schematic band rather than a map: there is no
            verified boundary geometry for any of the 89 barangays, and a
            plausible-looking map would be a fabricated image on a civic site.
            It is labelled, so it reads as "map goes here" instead of as a
            failed image load. See docs/IMAGERY-SYSTEM.md.
          */}
          <MapBanner
            className="mt-4"
            label={`Barangay ${barangay.name}`}
            caption={`${barangay.classification} barangay, Cabanatuan City`}
            size="sm"
          />
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <Heading level={3} className="mb-4">
              About
            </Heading>
            <Text className="text-gray-700 mb-6">{barangay.description}</Text>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-primary-600" />
                <div>
                  <div className="text-sm text-gray-500">
                    Population ({latestYear})
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {latestPopulation?.toLocaleString() ?? '—'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary-600" />
                <div>
                  <div className="text-sm text-gray-500">Classification</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {barangay.classification}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Hash className="h-5 w-5 text-primary-600" />
                <div>
                  <div className="text-sm text-gray-500">PSGC Code</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {barangay.psgc_code}
                  </div>
                </div>
              </div>
              {barangay.old_name && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <History className="h-5 w-5 text-primary-600" />
                  <div>
                    <div className="text-sm text-gray-500">Former Name</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {barangay.old_name}
                    </div>
                  </div>
                </div>
              )}
              {barangay.status === 'Pob.' && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Landmark className="h-5 w-5 text-primary-600" />
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="text-lg font-semibold text-gray-900">
                      Poblacion
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <Heading level={3} className="mb-4">
              Population Trend
            </Heading>
            {populationTrend.length > 0 ? (
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${populationTrend.length}, minmax(0, 1fr))`,
                }}
              >
                {populationTrend.map(({ year, population }) => {
                  const isLatest = year === LATEST_CENSUS_YEAR;
                  return (
                    <div
                      key={year}
                      className={
                        isLatest
                          ? 'text-center p-4 bg-primary-50 rounded-lg border border-primary-200'
                          : 'text-center p-4 bg-gray-50 rounded-lg'
                      }
                    >
                      <div
                        className={
                          isLatest
                            ? 'text-sm text-primary-600 mb-1'
                            : 'text-sm text-gray-500 mb-1'
                        }
                      >
                        {year}
                      </div>
                      <div
                        className={
                          isLatest
                            ? 'text-xl font-bold text-primary-700'
                            : 'text-xl font-bold text-gray-900'
                        }
                      >
                        {population.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Text className="text-gray-500 mb-0">
                Population trend data is not available for this barangay.
              </Text>
            )}
            {missingYears.length > 0 && (
              <Text className="text-xs text-gray-500 mt-4 mb-0">
                No verified {missingYears.join(' or ')} census figure is
                available for this barangay, so it is left out rather than
                estimated. Source: {barangaysData.source}.
              </Text>
            )}
          </CardContent>
        </Card>

        {relatedBarangays.length > 0 && (
          <div>
            <Heading level={3} className="mb-4">
              Other {barangay.classification} Barangays
            </Heading>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedBarangays.map(b => (
                <Link key={b.slug} to={`/government/barangays/${b.slug}`}>
                  <Card hoverable className="h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {b.classification === 'Urban' ? (
                          <Building2 className="h-4 w-4 text-primary-600" />
                        ) : (
                          <TreePine className="h-4 w-4 text-green-600" />
                        )}
                        <h4 className="font-medium text-gray-900">{b.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {b.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Section>
    </>
  );
};

export default BarangayDetail;
