import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AlertCircle, Check, Mail, Phone } from 'lucide-react';
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

/** Mirrors the pattern in AboutHistorySection: fall back when a bundle is missing. */
function getTranslatedList<T>(t: TranslateFn, key: string, fallback: T[]): T[] {
  const value = t(key, { returnObjects: true });
  return Array.isArray(value) && value.length > 0 ? (value as T[]) : fallback;
}

const FALLBACK_MEASURES: ListItem[] = [
  {
    title: 'Keyboard and focus',
    description:
      'Interactive elements are reachable and operable with a keyboard, with a visible focus indicator.',
  },
  {
    title: 'Structure and headings',
    description:
      'Pages use a single top-level heading and a logical heading order, so screen reader users can navigate between sections.',
  },
  {
    title: 'Labels and alternative text',
    description:
      'Form fields, icon-only buttons, tables, and images carry text labels or descriptions, and decorative icons are hidden from assistive technology.',
  },
  {
    title: 'Text and contrast',
    description:
      'Body text and controls are checked for readable colour contrast, and text reflows without horizontal scrolling on small screens.',
  },
  {
    title: 'Touch targets and reduced motion',
    description:
      'Links and buttons are large enough to tap comfortably on a phone, and animations respect your device’s reduced-motion setting.',
  },
  {
    title: 'Language and translation',
    description:
      'The portal ships in English and Tagalog, so key information is not limited to a single language.',
  },
];

const FALLBACK_LIMITATIONS: ListItem[] = [
  {
    title: 'Not yet fully audited',
    description:
      'We have not yet run a complete third-party accessibility audit across every page of the portal.',
  },
  {
    title: 'Legacy content',
    description:
      'Some imported service guides and news items are plain documents. They may not yet be as navigable as our own pages.',
  },
  {
    title: 'Embedded third-party content',
    description:
      'Features such as the embedded map, weather, and Facebook feed come from outside services. We do not control their accessibility and can only report problems to their providers.',
  },
  {
    title: 'Documents and images',
    description:
      'Some attached PDFs and scanned images are not yet tagged or transcribed, which can make them harder to read with assistive technology.',
  },
];

export default function AccessibilityPage() {
  const { t } = useTranslation('common');
  const { governmentName, portalEmail } = siteConfig;

  const measures = getTranslatedList<ListItem>(
    t,
    'accessibility.measures.items',
    FALLBACK_MEASURES
  );
  const limitations = getTranslatedList<ListItem>(
    t,
    'accessibility.limitations.items',
    FALLBACK_LIMITATIONS
  );

  return (
    <>
      <SEO
        title={t('accessibility.seoTitle')}
        description={t('accessibility.seoDescription', {
          city: governmentName,
        })}
        keywords={`accessibility, WCAG 2.1 AA, ${governmentName}, inclusive design, civic portal`}
        url="/accessibility"
      />
      <PageBanner
        eyebrow={t('accessibility.eyebrow')}
        title={t('accessibility.title')}
        description={t('accessibility.intro', { city: governmentName })}
        breadcrumbs={[
          { label: t('common.home'), href: '/' },
          { label: t('accessibility.title'), href: '/accessibility' },
        ]}
      />

      <Section className="p-3 mb-12 pt-10">
        <div className="max-w-3xl">
          <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-0">
            {t('accessibility.lastReviewed')}
          </Text>
        </div>

        <div className="max-w-3xl mt-8 space-y-4">
          <Heading level={2}>{t('accessibility.commitment.title')}</Heading>
          <Text className="text-gray-600 text-pretty">
            {t('accessibility.commitment.body1')}
          </Text>
          <Text className="text-gray-600 text-pretty mb-0">
            {t('accessibility.commitment.body2')}
          </Text>
        </div>

        <div className="max-w-3xl mt-12">
          <Card className="shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.06]">
            <CardContent className="p-6">
              <Heading level={2} className="text-xl mb-3">
                {t('accessibility.standard.title')}
              </Heading>
              <Text className="text-gray-600 text-pretty">
                {t('accessibility.standard.body')}
              </Text>
              <div className="flex items-start gap-3 mt-4 rounded-lg bg-gray-50 border border-gray-200 p-4">
                <AlertCircle
                  className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <Text className="text-sm text-gray-700 mb-0 text-pretty">
                  {t('accessibility.standard.note', {
                    city: governmentName,
                  })}
                </Text>
              </div>
            </CardContent>
          </Card>
        </div>

        <section
          className="mt-12"
          aria-labelledby="accessibility-measures-heading"
        >
          <Heading level={2} id="accessibility-measures-heading">
            {t('accessibility.measures.title')}
          </Heading>
          <Text className="text-gray-600 mb-6 max-w-3xl text-pretty">
            {t('accessibility.measures.description')}
          </Text>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {measures.map(measure => (
              <li key={measure.title}>
                <Card className="h-full shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
                  <CardContent className="p-5 flex items-start gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-600 shrink-0 mt-0.5">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <Heading level={3} className="text-base mb-1">
                        {measure.title}
                      </Heading>
                      <Text className="text-sm text-gray-600 mb-0 text-pretty">
                        {measure.description}
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
          aria-labelledby="accessibility-limitations-heading"
        >
          <Heading level={2} id="accessibility-limitations-heading">
            {t('accessibility.limitations.title')}
          </Heading>
          <Text className="text-gray-600 mb-6 max-w-3xl text-pretty">
            {t('accessibility.limitations.description')}
          </Text>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {limitations.map(limitation => (
              <li key={limitation.title}>
                <Card className="h-full shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-amber-200">
                  <CardContent className="p-5">
                    <Heading level={3} className="text-base mb-1">
                      {limitation.title}
                    </Heading>
                    <Text className="text-sm text-gray-600 mb-0 text-pretty">
                      {limitation.description}
                    </Text>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="mt-12"
          aria-labelledby="accessibility-feedback-heading"
        >
          <div className="max-w-3xl">
            <Heading level={2} id="accessibility-feedback-heading">
              {t('accessibility.feedback.title')}
            </Heading>
            <Text className="text-gray-600 text-pretty">
              {t('accessibility.feedback.body1')}
            </Text>
            <Text className="text-gray-600 text-pretty">
              {t('accessibility.feedback.body2')}
            </Text>
            <Card className="mt-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.06]">
              <CardContent className="p-6">
                <a
                  href={`mailto:${portalEmail}?subject=${encodeURIComponent(
                    t('accessibility.feedback.emailSubject', {
                      city: governmentName,
                    })
                  )}`}
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-gray-700 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] hover:text-primary-700 hover:bg-primary-50 hover:shadow-[inset_0_0_0_1px_rgba(0,102,235,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-[transform,color,box-shadow,background-color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
                >
                  <Mail
                    className="h-4 w-4 text-primary-600"
                    aria-hidden="true"
                  />
                  {t('accessibility.feedback.emailLabel')}
                </a>
                <Text className="text-sm text-gray-600 mt-3 mb-0 break-all">
                  {portalEmail}
                </Text>
                <Text className="text-xs text-gray-500 mt-3 mb-0 text-pretty">
                  {t('accessibility.feedback.responseTime')}
                </Text>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="max-w-3xl mt-12">
          <Card className="rounded-2xl bg-primary-50/60 shadow-[inset_0_0_0_1px_rgba(0,102,235,0.15)]">
            <CardContent className="p-5 flex items-start gap-3">
              <Phone
                className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <Heading level={3} className="text-base mb-1">
                  {t('accessibility.helpNote.title')}
                </Heading>
                <Text className="text-sm text-gray-700 mb-2 text-pretty">
                  {t('accessibility.helpNote.body', {
                    city: governmentName,
                  })}
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
