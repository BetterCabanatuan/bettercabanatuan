import { Link } from 'react-router-dom';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  ExternalLink,
  Clock,
  Facebook,
  Globe,
  Crown,
  MessageSquare,
} from 'lucide-react';
import {
  siteConfig,
  leadership,
  cityHallAddress,
  governmentSections,
} from '../lib/siteConfig';
import type { Category } from '../data/yamlLoader';
import EmergencyHotlinesSection from '../components/contact/EmergencyHotlinesSection';
import { formatPhoneForTel } from '../data/hotlines';

const contactChannels = [
  {
    title: 'City Government',
    description: 'For official transactions, permits, and city services.',
    email: siteConfig.contactEmail,
    phone: siteConfig.contactPhone,
    address: cityHallAddress,
    link: siteConfig.websiteUrl,
    linkLabel: 'Official city website',
    icon: Building2,
    accent: 'border-primary-500',
  },
  {
    title: "City Mayor's Office",
    description: leadership.mayor?.description,
    email: leadership.mayor?.contact?.email,
    phone: leadership.mayor?.contact?.phone,
    address: leadership.mayor?.contact?.office,
    icon: Crown,
    accent: 'border-yellow-500',
  },
  {
    title: 'Community Portal',
    description:
      'Report outdated information, suggest improvements, or volunteer with Better Cabanatuan.',
    email: siteConfig.contactEmail,
    link: 'https://github.com/BetterCabanatuan/bettercabanatuan',
    linkLabel: 'Contribute on GitHub',
    icon: MessageSquare,
    accent: 'border-secondary-500',
  },
];

const socialLinks = [
  { label: 'Facebook', href: siteConfig.facebookUrl, icon: Facebook },
  {
    label: 'Official Website',
    href: siteConfig.websiteUrl,
    icon: Globe,
  },
].filter(link => link.href);

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Contact"
        description={`Contact ${siteConfig.governmentName} — phone, email, city hall address, and community portal support.`}
        keywords="contact, city hall, Cabanatuan City, local government, phone, email"
      />
      <main className="flex-grow">
        <section
          className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 md:py-16"
          aria-labelledby="contact-heading"
        >
          <div className="container mx-auto px-4 relative motion-safe:animate-fade-in">
            <Breadcrumbs
              className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/60"
              items={[
                { label: 'Home', href: '/' },
                { label: 'Contact', href: '/contact' },
              ]}
            />
            <p className="text-sm tracking-[0.2em] uppercase text-primary-200 mb-3">
              Get in Touch
            </p>
            <Heading id="contact-heading" className="text-white mb-3 max-w-3xl">
              Contact Us
            </Heading>
            <Text className="text-white/85 max-w-2xl text-base md:text-lg mb-0">
              Reach the {siteConfig.governmentName} government or the volunteer
              team behind this community portal. We&apos;re here to help you
              find the right office and information.
            </Text>
          </div>
        </section>

        <Section className="p-3 mb-0 pt-8">
          <EmergencyHotlinesSection />

          <div
            id="contact-offices"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 scroll-mt-28"
          >
            {contactChannels.map(channel => (
              <Card
                key={channel.title}
                className={`h-full border-t-4 ${channel.accent}`}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600">
                      <channel.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <Heading level={3} className="mb-0 text-lg">
                      {channel.title}
                    </Heading>
                  </div>

                  {channel.description && (
                    <Text className="text-gray-600 text-sm mb-5 flex-grow">
                      {channel.description}
                    </Text>
                  )}

                  <div className="space-y-3 mt-auto">
                    {channel.phone && (
                      <a
                        href={`tel:${formatPhoneForTel(channel.phone)}`}
                        className="flex items-start gap-3 min-h-[44px] text-gray-700 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-colors duration-200"
                      >
                        <Phone
                          className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{channel.phone}</span>
                      </a>
                    )}
                    {channel.email && (
                      <a
                        href={`mailto:${channel.email}`}
                        className="flex items-start gap-3 min-h-[44px] text-gray-700 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-colors duration-200 break-all"
                      >
                        <Mail
                          className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{channel.email}</span>
                      </a>
                    )}
                    {channel.address && (
                      <div className="flex items-start gap-3 text-gray-700">
                        <MapPin
                          className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span className="text-sm">{channel.address}</span>
                      </div>
                    )}
                    {channel.link && channel.linkLabel && (
                      <a
                        href={channel.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 min-h-[44px] text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-colors duration-200"
                      >
                        {channel.linkLabel}
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <Heading level={3} className="mb-4">
                  City Hall Location
                </Heading>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin
                    className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {siteConfig.governmentName} City Hall
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {cityHallAddress}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {siteConfig.province} · {siteConfig.region}
                    </p>
                  </div>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(cityHallAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-colors duration-200"
                >
                  Open in Google Maps
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Heading level={3} className="mb-4">
                  Office Hours & Response
                </Heading>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock
                      className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        City Government Offices
                      </p>
                      <p className="text-sm text-gray-600">
                        Monday to Friday, 8:00 AM – 5:00 PM (Philippine Standard
                        Time). Closed on national and local holidays.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare
                      className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        Portal Inquiries
                      </p>
                      <p className="text-sm text-gray-600">
                        Community volunteers respond to portal-related messages
                        within 2–3 business days. For urgent official matters,
                        contact the city government directly.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {socialLinks.length > 0 && (
            <div className="mb-12">
              <Heading level={3} className="mb-4">
                Connect Online
              </Heading>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-all duration-200"
                  >
                    <link.icon className="h-4 w-4" aria-hidden="true" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div>
            <Heading level={3} className="mb-2">
              Find the Right Office
            </Heading>
            <Text className="text-gray-600 mb-6">
              Browse government sections to find the department or information
              you need.
            </Text>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {governmentSections.slice(0, 8).map((section: Category) => {
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
                    className="flex items-center min-h-[44px] px-4 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-800 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-all duration-200"
                  >
                    {section.category}
                  </Link>
                );
              })}
            </div>
          </div>

          <Card className="mt-12 bg-amber-50 border-amber-200">
            <CardContent className="p-5">
              <Text className="text-sm text-gray-700 mb-0">
                This contact page is part of the Better Cabanatuan community
                portal, not an official government system. For verified
                transactions and official records, always use the{' '}
                <a
                  href={siteConfig.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  official {siteConfig.governmentName} website
                </a>{' '}
                or visit City Hall in person.
              </Text>
            </CardContent>
          </Card>
        </Section>
      </main>
    </>
  );
}
