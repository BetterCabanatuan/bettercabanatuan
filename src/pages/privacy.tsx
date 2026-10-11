import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Globe,
  Landmark,
  Mail,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import PageBanner from '../components/ui/PageBanner';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { siteConfig } from '../lib/siteConfig';

interface ListItem {
  title: string;
  description: string;
}

type TranslateFn = (
  key: string,
  options?: { returnObjects?: boolean }
) => unknown;

/** Mirrors the pattern in AccessibilityPage: fall back when a bundle is missing. */
function getTranslatedList<T>(t: TranslateFn, key: string, fallback: T[]): T[] {
  const value = t(key, { returnObjects: true });
  return Array.isArray(value) && value.length > 0 ? (value as T[]) : fallback;
}

/**
 * Primary sources for the legal section. The notice names the law and the
 * circular and links only to the publisher's own domain, so a reader can
 * verify the text rather than trust ours.
 */
export const RA_10173_URL =
  'https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html';
export const NPC_CIRCULAR_16_01_URL = 'https://privacy.gov.ph/?p=35285';

/**
 * Every record the site creates because someone visited. Each item must stay
 * true of the code: `i18nextLng` is the i18next-browser-languagedetector
 * default key (src/i18n.ts sets no override) and `bc-volunteer-popup` is
 * VOLUNTEER_PROMPT_KEY in src/lib/volunteerPrompt.ts.
 */
const FALLBACK_COLLECTS: ListItem[] = [
  {
    title: 'Browser storage for your language',
    description:
      'When you switch between English and Tagalog, the choice is saved in your browser’s localStorage under the key i18nextLng so the next page loads in the same language. It never leaves your device.',
  },
  {
    title: 'Browser storage for the volunteer prompt',
    description:
      'When you close the volunteer invitation that appears on a first visit, the key bc-volunteer-popup is saved in localStorage so the invitation stays closed. Nothing else is stored.',
  },
  {
    title: 'Server access logs',
    description:
      'Like every website, the server that delivers these pages may record the IP address, the page requested, the date and time, and the browser type in standard access logs. We use them only to keep the site running and to spot abuse. We do not match them to a named person.',
  },
  {
    title: 'Nothing else',
    description:
      'There are no accounts, no cookies set by this site, no analytics, no advertising, no fingerprinting, and no form that stores what you type.',
  },
];

/** Outside hosts the browser contacts, taken from the components that load them. */
const FALLBACK_THIRD_PARTY: ListItem[] = [
  {
    title: 'Weather (Open-Meteo)',
    description:
      'The home page asks api.open-meteo.com for the forecast at a fixed point in Cabanatuan City. Your own location is never read or sent.',
  },
  {
    title: 'Map tiles (OpenStreetMap)',
    description:
      'The map on the home page draws its tiles from tile.openstreetmap.org.',
  },
  {
    title: 'Facebook Page Plugin',
    description:
      'The news feed on the home page loads Facebook’s script from connect.facebook.net to show the city’s public page. Facebook’s own privacy policy governs what it records when that script loads.',
  },
  {
    title: 'Google Fonts',
    description:
      'The typeface is served from fonts.googleapis.com and fonts.gstatic.com.',
  },
];

const externalLinkClass =
  'inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md';

export default function PrivacyPage() {
  const { t } = useTranslation('common');
  const { governmentName, portalEmail } = siteConfig;

  const collects = getTranslatedList<ListItem>(
    t,
    'privacy.collects.items',
    FALLBACK_COLLECTS
  );
  const thirdParty = getTranslatedList<ListItem>(
    t,
    'privacy.thirdParty.items',
    FALLBACK_THIRD_PARTY
  );

  return (
    <>
      <SEO
        title={t('privacy.seoTitle')}
        description={t('privacy.seoDescription', { city: governmentName })}
        keywords={`privacy notice, data privacy, RA 10173, ${governmentName}, community portal`}
        url="/privacy"
      />
      <PageBanner
        eyebrow={t('privacy.eyebrow')}
        title={t('privacy.title')}
        description={t('privacy.intro', { city: governmentName })}
        breadcrumbs={[
          { label: t('common.home'), href: '/' },
          { label: t('privacy.title'), href: '/privacy' },
        ]}
      />

      <Section className="p-3 mb-12 pt-10">
        <div className="max-w-3xl">
          <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-0">
            {t('privacy.lastReviewed')}
          </Text>
        </div>

        <div className="max-w-3xl mt-8 space-y-4">
          <Heading level={2}>{t('privacy.summary.title')}</Heading>
          <Text className="text-gray-600 text-pretty">
            {t('privacy.summary.body1')}
          </Text>
          <Text className="text-gray-600 text-pretty mb-0">
            {t('privacy.summary.body2')}
          </Text>
        </div>

        <section className="mt-12" aria-labelledby="privacy-collects-heading">
          <Heading level={2} id="privacy-collects-heading">
            {t('privacy.collects.title')}
          </Heading>
          <Text className="text-gray-600 mb-6 max-w-3xl text-pretty">
            {t('privacy.collects.description')}
          </Text>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {collects.map(item => (
              <li key={item.title}>
                <Card className="h-full shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.06]">
                  <CardContent className="p-5 flex items-start gap-3">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 mt-0.5">
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <Heading level={3} className="text-base mb-1">
                        {item.title}
                      </Heading>
                      <Text className="text-sm text-gray-600 mb-0 text-pretty">
                        {item.description}
                      </Text>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="mt-12"
          aria-labelledby="privacy-third-party-heading"
        >
          <Heading level={2} id="privacy-third-party-heading">
            {t('privacy.thirdParty.title')}
          </Heading>
          <Text className="text-gray-600 mb-6 max-w-3xl text-pretty">
            {t('privacy.thirdParty.description')}
          </Text>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {thirdParty.map(item => (
              <li key={item.title}>
                <Card className="h-full shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-amber-200">
                  <CardContent className="p-5 flex items-start gap-3">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 mt-0.5">
                      <Globe className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <Heading level={3} className="text-base mb-1">
                        {item.title}
                      </Heading>
                      <Text className="text-sm text-gray-600 mb-0 text-pretty">
                        {item.description}
                      </Text>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
          <Text className="text-sm text-gray-600 mt-6 mb-0 max-w-3xl text-pretty">
            {t('privacy.thirdParty.note')}
          </Text>
        </section>

        <section className="mt-12" aria-labelledby="privacy-legal-heading">
          <div className="max-w-3xl">
            <Heading level={2} id="privacy-legal-heading">
              {t('privacy.legal.title')}
            </Heading>
            <Text className="text-gray-600 text-pretty">
              {t('privacy.legal.body1')}
            </Text>
            <Text className="text-gray-600 text-pretty">
              {t('privacy.legal.body2', { city: governmentName })}
            </Text>
            <ul className="mt-2 space-y-1">
              <li>
                <a
                  href={RA_10173_URL}
                  className={externalLinkClass}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('privacy.legal.lawLinkLabel')}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={NPC_CIRCULAR_16_01_URL}
                  className={externalLinkClass}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('privacy.legal.npcLinkLabel')}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            </ul>

            <Card className="mt-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.06]">
              <CardContent className="p-6 flex items-start gap-3">
                <Scale
                  className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <Text className="font-semibold text-gray-900 mb-2">
                    {t('privacy.legal.dpoLine')}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-0 text-pretty">
                    {t('privacy.legal.dpoNote')}
                  </Text>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="privacy-rights-heading">
          <div className="max-w-3xl">
            <Heading level={2} id="privacy-rights-heading">
              {t('privacy.rights.title')}
            </Heading>
            <Text className="text-gray-600 text-pretty">
              {t('privacy.rights.body1')}
            </Text>
            <Text className="text-gray-600 text-pretty mb-0">
              {t('privacy.rights.body2')}
            </Text>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="privacy-contact-heading">
          <div className="max-w-3xl">
            <Heading level={2} id="privacy-contact-heading">
              {t('privacy.contact.title')}
            </Heading>
            <Text className="text-gray-600 text-pretty">
              {t('privacy.contact.body')}
            </Text>
            <Card className="mt-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.06]">
              <CardContent className="p-6">
                <a
                  href={`mailto:${portalEmail}?subject=${encodeURIComponent(
                    t('privacy.contact.emailSubject', { city: governmentName })
                  )}`}
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-gray-700 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] hover:text-primary-700 hover:bg-primary-50 hover:shadow-[inset_0_0_0_1px_rgba(0,102,235,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-[transform,color,box-shadow,background-color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
                >
                  <Mail
                    className="h-4 w-4 text-primary-600"
                    aria-hidden="true"
                  />
                  {t('privacy.contact.emailLabel')}
                </a>
                <Text className="text-sm text-gray-600 mt-3 mb-0 break-all">
                  {portalEmail}
                </Text>
                <Text className="text-xs text-gray-500 mt-3 mb-0 text-pretty">
                  {t('privacy.contact.responseTime')}
                </Text>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="max-w-3xl mt-12">
          <Card className="rounded-2xl bg-primary-50/60 shadow-[inset_0_0_0_1px_rgba(0,102,235,0.15)]">
            <CardContent className="p-5 flex items-start gap-3">
              <Landmark
                className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <Heading level={3} className="text-base mb-1">
                  {t('privacy.officialNote.title')}
                </Heading>
                <Text className="text-sm text-gray-700 mb-2 text-pretty">
                  {t('privacy.officialNote.body', { city: governmentName })}
                </Text>
                <Link
                  to="/contact"
                  className="inline-flex items-center min-h-[44px] text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md"
                >
                  {t('common.contact')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
