import { Scale, ExternalLink, FileText, Gavel, AlarmClock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../../../components/SEO';
import Section from '../../../components/ui/Section';
import { Heading } from '../../../components/ui/Heading';
import { Text } from '../../../components/ui/Text';
import GovernmentPageHero from '../../../components/government/GovernmentPageHero';
import { Card, CardContent } from '@bettergov/kapwa/card';
import {
  legislationData,
  type RepublicAct,
  type CaseLaw,
  type PendingBill,
} from '../../../data/yamlLoader';
import { siteConfig } from '../../../lib/siteConfig';

function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors duration-150 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  );
}

function RepublicActCard({ act }: { act: RepublicAct }) {
  return (
    <Card
      hoverable
      className="h-full border-t-4 border-primary-500 transition-transform duration-200 hover:-translate-y-0.5"
    >
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            {act.raNumber}
          </span>
          <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
            {act.year}
          </span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          {act.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{act.summary}</p>
        <div className="flex items-center gap-3">
          <a
            href={act.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            View full text
          </a>
          {act.pdfUrl && (
            <a
              href={act.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-500 hover:text-gray-700 hover:underline"
            >
              PDF
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CaseLawCard({ legalCase }: { legalCase: CaseLaw }) {
  return (
    <Card
      hoverable
      className="h-full border-t-4 border-secondary-500 transition-transform duration-200 hover:-translate-y-0.5"
    >
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary-50 px-3 py-1 text-xs font-semibold text-secondary-700">
            <Gavel className="h-3.5 w-3.5" aria-hidden="true" />
            {legalCase.caseNumber}
          </span>
          <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
            {legalCase.year}
          </span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          {legalCase.title}
        </h3>
        {legalCase.summary && (
          <p className="text-sm text-gray-600 mb-3 flex-grow">
            {legalCase.summary}
          </p>
        )}
        {legalCase.disposition && (
          <p className="text-sm text-gray-500 mb-4 italic">
            {legalCase.disposition}
          </p>
        )}
        <a
          href={legalCase.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
        >
          Read the ruling
        </a>
      </CardContent>
    </Card>
  );
}

function BillCard({ bill }: { bill: PendingBill }) {
  return (
    <Card className="h-full border-t-4 border-accent-500">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
            <AlarmClock className="h-3.5 w-3.5" aria-hidden="true" />
            {bill.number}
          </span>
          <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
            {bill.congress}
            {bill.congress === 1
              ? 'st'
              : bill.congress === 2
                ? 'nd'
                : bill.congress === 3
                  ? 'rd'
                  : 'th'}{' '}
            Congress
          </span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          {bill.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{bill.status}</p>
        <dl className="space-y-1 text-sm mb-4">
          {bill.authors.length > 0 && (
            <div className="flex gap-2">
              <dt className="text-gray-400 shrink-0">Authors:</dt>
              <dd className="text-gray-700">{bill.authors.join(', ')}</dd>
            </div>
          )}
          {bill.committee && (
            <div className="flex gap-2">
              <dt className="text-gray-400 shrink-0">Committee:</dt>
              <dd className="text-gray-700">{bill.committee}</dd>
            </div>
          )}
        </dl>
        <a
          href={bill.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
        >
          View on Congress
        </a>
      </CardContent>
    </Card>
  );
}

export default function LegislationPage() {
  const { t } = useTranslation('common');

  return (
    <>
      <SEO
        title={legislationData.title}
        description={legislationData.description}
        keywords={`laws, legislation, republic act, jurisprudence, bills, ${siteConfig.governmentName}`}
        url="/transparency/legislation"
      />
      <main className="flex-grow" id="main-content">
        <GovernmentPageHero
          eyebrow={t('transparency.eyebrow')}
          title={legislationData.title}
          description={legislationData.description}
          icon={Scale}
          breadcrumbs={[
            { label: t('common.home'), href: '/' },
            { label: t('transparency.title'), href: '/transparency' },
            { label: legislationData.title, href: '/transparency/legislation' },
          ]}
        />

        <Section className="p-3 mb-12 pt-10">
          <div className="space-y-12">
            <div>
              <Heading level={2} className="mb-2">
                {t('legislation.republicActs.title')}
              </Heading>
              <Text className="text-gray-600 mb-6 max-w-3xl">
                {t('legislation.republicActs.description')}
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {legislationData.republicActs.map(act => (
                  <RepublicActCard key={act.raNumber} act={act} />
                ))}
              </div>
            </div>

            <div>
              <Heading level={2} className="mb-2">
                {t('legislation.jurisprudence.title')}
              </Heading>
              <Text className="text-gray-600 mb-6 max-w-3xl">
                {t('legislation.jurisprudence.description')}
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {legislationData.jurisprudence.map(legalCase => (
                  <CaseLawCard
                    key={legalCase.caseNumber}
                    legalCase={legalCase}
                  />
                ))}
              </div>
            </div>

            <div>
              <Heading level={2} className="mb-2">
                {t('legislation.pendingBills.title')}
              </Heading>
              <Text className="text-gray-600 mb-6 max-w-3xl">
                {t('legislation.pendingBills.description')}
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {legislationData.pendingBills.map(bill => (
                  <BillCard key={bill.number} bill={bill} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end mt-10">
            <SourceLink
              href="https://juris.ph/api/v1/search?dataset=republic-acts&q=cabanatuan"
              label={t('legislation.sourceJuris')}
            />
            <SourceLink
              href="https://bills.juris.ph/api/measures?q=cabanatuan"
              label={t('legislation.sourceBills')}
            />
          </div>
        </Section>
      </main>
    </>
  );
}
