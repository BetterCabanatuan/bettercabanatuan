import { Link } from 'react-router-dom';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import {
  Globe,
  Heart,
  Users,
  CheckCircle2,
  MapPin,
  Building2,
  Crown,
  Landmark,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { getIconComponent } from '../lib/iconMap';
import {
  siteConfig,
  cityStats,
  services,
  governmentSections,
  leadership,
  cityHallAddress,
} from '../lib/siteConfig';
import { serviceCategories } from '../data/yamlLoader';

const values = [
  {
    icon: Globe,
    title: 'Open Information',
    description: 'Public data and services, organized clearly.',
  },
  {
    icon: Heart,
    title: 'Community Driven',
    description: 'Built by volunteers, maintained for residents.',
  },
  {
    icon: Users,
    title: 'Civic Engagement',
    description: 'Encouraging participation and transparency.',
  },
  {
    icon: CheckCircle2,
    title: 'Always Improving',
    description: 'Continuously updated and open source.',
  },
];

const getIcon = (iconName: string) => {
  const Icon = getIconComponent(iconName);
  return <Icon className="h-6 w-6" aria-hidden="true" />;
};

const About: React.FC = () => {
  const locationLabel = `${siteConfig.governmentName}, ${siteConfig.province}, ${siteConfig.region}`;

  return (
    <>
      <SEO
        title="About"
        description={`About the ${siteConfig.governmentName} community portal — ${cityStats.totalBarangays} barangays, ${services.length} service areas, and local government information.`}
        keywords="about, community portal, local government, Cabanatuan City, Nueva Ecija, civic tech"
      />
      <main className="flex-grow">
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
            <Heading
              id="about-heading"
              className="text-white mb-3 max-w-3xl"
            >
              About {siteConfig.governmentName}
            </Heading>
            <Text className="text-white/85 max-w-2xl text-base md:text-lg mb-0">
              An independent, volunteer-led portal helping residents navigate{' '}
              {services.length} service areas, {governmentSections.length}{' '}
              government sections, and {cityStats.totalBarangays} barangays
              across {siteConfig.province}.
            </Text>
          </div>
        </section>

        {/* City overview from YAML + JSON data */}
        <Section className="p-3 mb-0 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <Heading level={2}>
                Our Mission
              </Heading>
              <Text className="text-gray-600 mb-4">
                This portal is an independent, volunteer-led project built to
                help residents of {siteConfig.governmentName} find accurate
                information about government services, departments, and public
                programs — quickly and in plain language.
              </Text>
              <Text className="text-gray-600 mb-6">
                We believe that better access to information leads to more
                engaged citizens, stronger communities, and more accountable
                governance.
              </Text>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Location
                </p>
                <p className="text-gray-900 font-medium">{locationLabel}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {siteConfig.governmentType} · {cityStats.landArea} km² land
                  area
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: 'Population',
                  value: cityStats.totalPopulation.toLocaleString(),
                  note: '2020 Census',
                  icon: Users,
                },
                {
                  label: 'Barangays',
                  value: String(cityStats.totalBarangays),
                  note: `${cityStats.urbanBarangays} urban · ${cityStats.ruralBarangays} rural`,
                  icon: MapPin,
                },
                {
                  label: 'Service Areas',
                  value: String(services.length),
                  note: 'From services catalog',
                  icon: Heart,
                },
                {
                  label: 'Elected Officials',
                  value: String(leadership.totalOfficials),
                  note: `${leadership.councilorCount} councilors`,
                  icon: Building2,
                },
              ].map(stat => (
                <Card
                  key={stat.label}
                  className="border-t-4 border-primary-500 h-full"
                >
                  <CardContent className="p-5">
                    <stat.icon
                      className="h-5 w-5 text-primary-600 mb-2"
                      aria-hidden="true"
                    />
                    <p className="text-2xl font-bold text-gray-900 tabular-nums">
                      {stat.value}
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {stat.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{stat.note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* Leadership from publicOfficials data */}
        {(leadership.mayor || leadership.viceMayor) && (
          <Section>
            <Heading level={2} className="mb-2">
              City Leadership
            </Heading>
            <Text className="text-gray-600 mb-8">
              Elected officials serving {siteConfig.governmentName} for the
              current term.
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leadership.mayor && (
                <Card className="border-t-4 border-yellow-500">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Crown
                        className="h-6 w-6 text-yellow-600"
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full">
                        City Mayor
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {leadership.mayor.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Term {leadership.mayor.term}
                    </p>
                    <p className="text-sm text-gray-700">
                      {leadership.mayor.description}
                    </p>
                  </CardContent>
                </Card>
              )}
              {leadership.viceMayor && (
                <Card className="border-t-4 border-primary-500">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Landmark
                        className="h-6 w-6 text-primary-600"
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium text-primary-800 bg-primary-100 px-2 py-0.5 rounded-full">
                        Vice Mayor
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {leadership.viceMayor.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Term {leadership.viceMayor.term}
                    </p>
                    <p className="text-sm text-gray-700">
                      {leadership.viceMayor.description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="mt-6">
              <Link
                to="/government/officials"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md"
              >
                View all {leadership.totalOfficials} public officials
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Section>
        )}

        {/* Service categories from services.yaml */}
        <Section>
          <Heading level={2} className="mb-2">
            Services & Information
          </Heading>
          <Text className="text-gray-600 mb-8">
            {serviceCategories.description ||
              'Browse service categories curated from our local government catalog.'}
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(category => (
              <Link
                key={category.slug}
                to={`/services/${category.slug}`}
                className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-xl"
              >
                <Card
                  hoverable
                  className="h-full border-t-4 border-primary-500"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary-100 text-primary-600 p-2.5 rounded-lg shrink-0">
                        {getIcon(category.icon)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                          {category.category}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Section>

        {/* Government sections from government.yaml */}
        <Section>
          <Heading level={2} className="mb-2">
            Government Activity
          </Heading>
          <Text className="text-gray-600 mb-8">
            Explore departments, barangays, transparency documents, and more.
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {governmentSections.map(section => {
              const href =
                section.slug === 'officials'
                  ? '/government/officials'
                  : section.slug === 'barangays'
                    ? '/government/barangays'
                    : `/government/${section.slug}`;

              return (
                <Link
                  key={section.slug}
                  to={href}
                  className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-xl"
                >
                  <Card hoverable className="h-full">
                    <CardContent className="p-5">
                      <div className="bg-primary-100 text-primary-600 p-2.5 rounded-lg w-fit mb-3">
                        {getIcon(section.icon)}
                      </div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                        {section.category}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                        {section.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Section>

        {/* Values */}
        <Section>
          <Heading level={2} className="mb-8">
            What We Stand For
          </Heading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map(item => (
              <Card key={item.title} className="border-t-4 border-primary-500">
                <CardContent className="p-6">
                  <item.icon
                    className="h-6 w-6 text-primary-600 mb-3"
                    aria-hidden="true"
                  />
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* Disclaimer */}
        <Section>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className="h-6 w-6 text-amber-600 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <Heading level={3}>Independent Project Disclaimer</Heading>
                  <Text className="text-gray-700 mb-4">
                    This portal is a community-run project and is not an
                    official government website. Information is gathered from
                    public sources and official channels to the best of our
                    knowledge.
                  </Text>
                  <Text className="text-gray-700 mb-0">
                    For official transactions, verification, and the most current
                    requirements, please contact the city government directly
                    at{' '}
                    <a
                      href={`mailto:${siteConfig.contactEmail}`}
                      className="text-primary-600 hover:underline"
                    >
                      {siteConfig.contactEmail}
                    </a>{' '}
                    or visit the{' '}
                    <a
                      href={siteConfig.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      official {siteConfig.governmentName} website
                    </a>
                    .
                  </Text>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* Contribute & Contact CTA */}
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Heading level={2} className="mb-3">
                Help Us Improve
              </Heading>
              <Text className="text-gray-600 mb-0">
                Found outdated information? Have a suggestion? This project is
                open source and welcomes contributions from the community.
              </Text>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
              <a
                href="https://github.com/BetterCabanatuan/bettercabanatuan"
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contribute on GitHub
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            City Hall: {cityHallAddress}
          </p>
        </Section>
      </main>
    </>
  );
};

export default About;
