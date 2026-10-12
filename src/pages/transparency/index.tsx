import { useTranslation } from 'react-i18next';
import { ExternalLink, FileText } from 'lucide-react';
import SEO from '../../components/SEO';
import Section from '../../components/ui/Section';
import { Text } from '../../components/ui/Text';
import { Heading } from '../../components/ui/Heading';
import StatusBadge, { type BadgeTone } from '../../components/ui/StatusBadge';
import GovernmentPageHero from '../../components/government/GovernmentPageHero';
import TransparencyResourceCard from '../../components/transparency/TransparencyResourceCard';
import {
  transparencyData,
  type TransparencyDocument,
  type TransparencyDocumentStatus,
} from '../../data/yamlLoader';
import { siteConfig } from '../../lib/siteConfig';

/**
 * How each document status presents.
 *
 * `posted` is a success: the document exists and the row links to it.
 * `not-yet-located` is neutral rather than a warning, because it describes
 * this portal's search, not a failing by the city. The badge always carries
 * the word, so the two are distinguishable without colour.
 *
 * `labelKey` is resolved through i18next with the English label as the
 * default. The keys do not exist in `public/locales` yet (those files are
 * outside this slice); adding `transparency.documentStatus.posted` and
 * `transparency.documentStatus.notYetLocated` to a bundle switches the label
 * to that language with no code change.
 */
const DOCUMENT_STATUS: Record<
  TransparencyDocumentStatus,
  { tone: BadgeTone; label: string; labelKey: string }
> = {
  posted: {
    tone: 'success',
    label: 'Posted',
    labelKey: 'transparency.documentStatus.posted',
  },
  'not-yet-located': {
    tone: 'neutral',
    label: 'Not yet located',
    labelKey: 'transparency.documentStatus.notYetLocated',
  },
};

function TransparencyDocumentRow({
  document,
}: {
  document: TransparencyDocument;
}) {
  const { t } = useTranslation('common');
  const status = DOCUMENT_STATUS[document.status];
  const isExternal =
    document.external || (document.href?.startsWith('http') ?? false);

  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Heading level={3} className="mb-0 text-base md:text-base lg:text-lg">
            {document.title}
          </Heading>
          <StatusBadge tone={status.tone} size="sm">
            {t(status.labelKey, { defaultValue: status.label })}
          </StatusBadge>
        </div>
        <p className="mt-1 text-sm text-gray-600 text-pretty">
          {document.description}
        </p>
        {document.sourceNote && (
          <p className="mt-1 text-xs text-gray-500 text-pretty">
            {document.sourceNote}
          </p>
        )}
      </div>
      {document.href &&
        (isExternal ? (
          <a
            href={document.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded"
          >
            {t('transparency.viewResource')}
            <ExternalLink className="size-4" aria-hidden="true" />
            <span className="sr-only">({t('transparency.external')})</span>
          </a>
        ) : (
          <a
            href={document.href}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded"
          >
            {t('transparency.viewResource')}
          </a>
        ))}
    </li>
  );
}

export default function TransparencyPage() {
  const { t } = useTranslation('common');
  const pageDescription =
    transparencyData.description || t('transparency.description');

  return (
    <>
      <SEO
        title={t('transparency.title')}
        description={pageDescription}
        keywords={`transparency, FOI, open government, ${siteConfig.governmentName}, public documents, accountability`}
        url="/transparency"
      />
      <GovernmentPageHero
        eyebrow={t('transparency.eyebrow')}
        title={t('transparency.title')}
        description={pageDescription}
        icon={FileText}
        breadcrumbs={[
          { label: t('common.home'), href: '/' },
          { label: t('transparency.title'), href: '/transparency' },
        ]}
      />

      <Section className="p-3 mb-12 pt-10">
        <Text className="text-gray-600 mb-10 max-w-3xl">
          {t('transparency.intro', { city: siteConfig.governmentName })}
        </Text>

        <div className="space-y-12">
          {transparencyData.sections.map((section, sectionIndex) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`transparency-section-${section.id}`}
              className="motion-safe:animate-fade-in scroll-mt-28"
              style={{ animationDelay: `${sectionIndex * 80}ms` }}
            >
              <Heading
                id={`transparency-section-${section.id}`}
                level={2}
                className="mb-2"
              >
                {section.title}
              </Heading>
              <Text
                className={`text-gray-600 max-w-3xl ${section.note ? 'mb-3' : 'mb-6'}`}
              >
                {section.description}
              </Text>
              {section.note && (
                <p
                  role="note"
                  className="mb-6 max-w-3xl border-l-4 border-gray-300 pl-4 text-sm text-gray-600 text-pretty"
                >
                  {section.note}
                </p>
              )}

              {section.documents && section.documents.length > 0 && (
                <ul className="mb-8 divide-y divide-gray-200 border-y border-gray-200">
                  {section.documents.map(document => (
                    <TransparencyDocumentRow
                      key={document.title}
                      document={document}
                    />
                  ))}
                </ul>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {section.resources.map((resource, resourceIndex) => (
                  <div
                    key={resource.href}
                    className="motion-safe:animate-slide-in"
                    style={{
                      animationDelay: `${120 + resourceIndex * 50}ms`,
                    }}
                  >
                    <TransparencyResourceCard resource={resource} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
