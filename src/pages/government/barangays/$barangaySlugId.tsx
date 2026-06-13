import { useParams, Link } from 'react-router-dom';
import { Heading } from '../../../components/ui/Heading';
import { Text } from '../../../components/ui/Text';
import Section from '../../../components/ui/Section';
import SEO from '../../../components/SEO';
import Breadcrumbs from '../../../components/ui/Breadcrumbs';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Banner } from '@bettergov/kapwa/banner';
import { getBarangayBySlug, allBarangays } from '../../../data/yamlLoader';
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
  const barangay = barangaySlugId ? getBarangayBySlug(barangaySlugId) : undefined;

  if (!barangay) {
    return (
      <Section className="p-3 mb-12">
        <Breadcrumbs className="mb-8" />
        <Banner
          type="error"
          title="Barangay not found"
          description="The barangay you are looking for does not exist."
          icon
        />
        <div className="mt-6">
          <Link
            to="/government/barangays"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Barangays
          </Link>
        </div>
      </Section>
    );
  }

  const isUrban = barangay.classification === 'Urban';

  // Get related barangays (same classification)
  const relatedBarangays = allBarangays
    .filter(
      b =>
        b.classification === barangay.classification && b.slug !== barangay.slug
    )
    .slice(0, 3);

  return (
    <>
      <SEO
        title={barangay.name}
        description={barangay.description}
        keywords={`${barangay.name}, barangay, Cabanatuan City, ${barangay.classification.toLowerCase()}, local government`}
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

        {/* Header */}
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
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {barangay.classification}
          </span>
        </div>

        {/* Main Info Card */}
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
                  <div className="text-sm text-gray-500">Population (2024)</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {barangay.population['2024'].toLocaleString()}
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

        {/* Population Trend */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <Heading level={3} className="mb-4">
              Population Trend
            </Heading>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">2015</div>
                <div className="text-xl font-bold text-gray-900">
                  {barangay.population['2015'].toLocaleString()}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">2020</div>
                <div className="text-xl font-bold text-gray-900">
                  {barangay.population['2020'].toLocaleString()}
                </div>
              </div>
              <div className="text-center p-4 bg-primary-50 rounded-lg border border-primary-200">
                <div className="text-sm text-primary-600 mb-1">2024</div>
                <div className="text-xl font-bold text-primary-700">
                  {barangay.population['2024'].toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Barangays */}
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
