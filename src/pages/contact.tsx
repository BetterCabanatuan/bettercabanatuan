import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/SEO';
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
import { contactJsonLd } from '../lib/structuredData';
import type { Category } from '../data/yamlLoader';
import EmergencyHotlinesSection from '../components/contact/EmergencyHotlinesSection';
import DepartmentContactsSection from '../components/contact/DepartmentContactsSection';
import { formatPhoneForTel } from '../data/hotlines';
import { allHospitals } from '../data/hospitals';
import { Card, CardContent } from '@bettergov/kapwa/card';
import FacebookPagePlugin from '../components/FacebookPagePlugin';

export default function ContactPage() {
  const { t } = useTranslation('common');

  const contactChannels = [
    {
      id: 'cityGovernment',
      title: t('contact.channels.cityGovernment.title'),
      description: t('contact.channels.cityGovernment.description'),
      email: siteConfig.contactEmail,
      phone: siteConfig.contactPhone,
      address: cityHallAddress,
      link: siteConfig.websiteUrl,
      linkLabel: t('contact.channels.cityGovernment.linkLabel'),
      icon: Building2,
      accent: 'border-primary-500',
    },
    {
      id: 'mayorsOffice',
      title: t('contact.channels.mayorsOffice.title'),
      description: leadership.mayor?.description,
      email: leadership.mayor?.contact?.email,
      phone: leadership.mayor?.contact?.phone,
      address: leadership.mayor?.contact?.office,
      icon: Crown,
      accent: 'border-yellow-500',
    },
    {
      id: 'communityPortal',
      title: t('contact.channels.communityPortal.title'),
      description: t('contact.channels.communityPortal.description'),
      email: siteConfig.portalEmail,
      link: 'https://github.com/BetterCabanatuan/bettercabanatuan',
      linkLabel: t('contact.channels.communityPortal.linkLabel'),
      icon: MessageSquare,
      accent: 'border-secondary-500',
    },
  ];

  const hospitalsHotlines = allHospitals;

  const socialLinks = [
    {
      labelKey: 'contact.social.facebook',
      href: siteConfig.facebookUrl,
      icon: Facebook,
    },
    {
      labelKey: 'contact.social.officialWebsite',
      href: siteConfig.websiteUrl,
      icon: Globe,
    },
  ].filter(link => link.href);

  return (
    <>
      <SEO
        title={t('contact.seoTitle')}
        description={t('contact.seoDescription', {
          city: siteConfig.governmentName,
        })}
        keywords={`contact, city hall, ${siteConfig.governmentName}, local government, phone, email, address`}
        url="/contact"
        jsonLd={contactJsonLd()}
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
                { label: t('common.home'), href: '/' },
                { label: t('common.contact'), href: '/contact' },
              ]}
            />
            <p className="text-sm tracking-[0.2em] uppercase text-primary-200 mb-3">
              {t('contact.eyebrow')}
            </p>
            <Heading
              id="contact-heading"
              className="text-white mb-3 max-w-3xl text-balance"
            >
              {t('contact.title')}
            </Heading>
            <Text className="text-white/85 max-w-2xl text-base md:text-lg mb-0 text-pretty">
              {t('contact.subtitle', { city: siteConfig.governmentName })}
            </Text>
          </div>
        </section>

        <Section className="p-3 mb-0 pt-8">
          <EmergencyHotlinesSection />
          <DepartmentContactsSection />
          <div
            id="contact-offices"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 scroll-mt-28"
          >
            {contactChannels.map((channel, index) => (
              <Card
                key={channel.id}
                className={`h-full border-t-4 ${channel.accent} shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] motion-safe:animate-slide-in motion-reduce:animate-none`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600">
                      <channel.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <Heading level={3} className="mb-0 text-lg text-balance">
                      {channel.title}
                    </Heading>
                  </div>

                  {channel.description && (
                    <Text className="text-gray-600 text-sm mb-5 flex-grow text-pretty">
                      {channel.description}
                    </Text>
                  )}

                  <div className="space-y-3 mt-auto">
                    {channel.phone && (
                      <a
                        href={`tel:${formatPhoneForTel(channel.phone)}`}
                        className="flex items-start gap-3 min-h-[44px] text-gray-700 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-[transform,color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
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
                        className="flex items-start gap-3 min-h-[44px] text-gray-700 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-[transform,color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100 break-all"
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
                        className="inline-flex items-center gap-2 min-h-[44px] text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-[transform,color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
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
          {/* // Contact Offices Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <Card className="shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
              <CardContent className="p-6">
                <Heading level={3} className="mb-4 text-balance">
                  {t('contact.cityHallLocation.title')}
                </Heading>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin
                    className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {t('contact.cityHallLocation.cityHall', {
                        city: siteConfig.governmentName,
                      })}
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
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-[transform,background-color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,102,235,0.25)]"
                >
                  {t('contact.cityHallLocation.openMaps')}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </CardContent>
            </Card>
            {/* // Office hours */}
            <Card className="shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
              <CardContent className="p-6">
                <Heading level={3} className="mb-4 text-balance">
                  {t('contact.officeHours.title')}
                </Heading>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock
                      className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {t('contact.officeHours.cityOffices')}
                      </p>
                      <p className="text-sm text-gray-600 text-pretty">
                        {t('contact.officeHours.cityHours')}
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
                        {t('contact.officeHours.portalInquiries')}
                      </p>
                      <p className="text-sm text-gray-600 text-pretty">
                        {t('contact.officeHours.portalResponse')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {hospitalsHotlines.length > 0 && (
              <div className="mb-12">
                <Heading level={3} className="mb-4 text-balance">
                  {t('contact.hospitals.title')}
                </Heading>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {hospitalsHotlines.map((hospital, index) => (
                    <Card
                      key={hospital.name}
                      className="h-full shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] motion-safe:animate-slide-in motion-reduce:animate-none"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <CardContent className="p-5 flex flex-col h-full">
                        <Heading
                          level={4}
                          className="mb-2 text-base text-balance"
                        >
                          {hospital.name}
                        </Heading>
                        <Text className="text-gray-600 text-sm mb-5 flex-grow text-pretty">
                          {hospital.description}
                        </Text>
                        {hospital.phone && (
                          <a
                            href={`tel:${formatPhoneForTel(hospital.phone)}`}
                            className="flex items-start gap-3 min-h-[44px] text-gray-700 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-[transform,color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
                          >
                            <Phone
                              className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{hospital.phone}</span>
                          </a>
                        )}
                        {hospital.address && (
                          <div className="flex items-start gap-3 text-gray-700 mt-3">
                            <MapPin
                              className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span className="text-sm">{hospital.address}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {(siteConfig.facebookUrl || socialLinks.length > 0) && (
            <div className="mb-12">
              <Heading level={3} className="mb-4 text-balance">
                {t('contact.connectOnline')}
              </Heading>
              {siteConfig.facebookUrl && (
                <div className="mb-6 w-full max-w-[500px]">
                  <FacebookPagePlugin
                    href={siteConfig.facebookUrl}
                    pageName={siteConfig.governmentName}
                  />
                </div>
              )}
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map(link => (
                    <a
                      key={link.labelKey}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-gray-700 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] hover:text-primary-700 hover:bg-primary-50 hover:shadow-[inset_0_0_0_1px_rgba(0,102,235,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-[transform,background-color,box-shadow,color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
                    >
                      <link.icon className="h-4 w-4" aria-hidden="true" />
                      {t(link.labelKey)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
          <div>
            <Heading level={3} className="mb-2 text-balance">
              {t('contact.findOffice.title')}
            </Heading>
            <Text className="text-gray-600 mb-6 text-pretty">
              {t('contact.findOffice.description')}
            </Text>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {governmentSections
                .slice(0, 8)
                .map((section: Category, index) => {
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
                      className="flex items-center min-h-[44px] px-4 py-3 rounded-xl text-sm font-medium text-gray-800 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] hover:text-primary-700 hover:bg-primary-50 hover:shadow-[inset_0_0_0_1px_rgba(0,102,235,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-[transform,background-color,box-shadow,color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100 motion-safe:animate-slide-in motion-reduce:animate-none"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      {section.category}
                    </Link>
                  );
                })}
            </div>
          </div>
          <Card className="mt-12 rounded-2xl bg-amber-50 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.35)]">
            <CardContent className="p-5">
              <Text className="text-sm text-gray-700 mb-0 text-pretty">
                <Trans
                  i18nKey="contact.disclaimer"
                  values={{ city: siteConfig.governmentName }}
                  components={{
                    1: (
                      <a
                        href={siteConfig.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      />
                    ),
                  }}
                />
              </Text>
            </CardContent>
          </Card>
        </Section>
      </main>
    </>
  );
}
