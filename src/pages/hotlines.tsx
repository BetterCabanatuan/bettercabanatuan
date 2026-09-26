import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import PageBanner from '../components/ui/PageBanner';
import { Text } from '../components/ui/Text';
import { Heading } from '../components/ui/Heading';
import EmergencyHotlinesSection from '../components/contact/EmergencyHotlinesSection';
import DepartmentContactsSection from '../components/contact/DepartmentContactsSection';
import { siteConfig } from '../lib/siteConfig';

export default function HotlinesPage() {
  const { t } = useTranslation('common');
  const { governmentName } = siteConfig;

  return (
    <>
      <SEO
        title={t('hotlines.page.seoTitle')}
        description={t('hotlines.page.seoDescription', {
          city: governmentName,
        })}
        keywords={`hotlines, emergency numbers, ${governmentName}, PNP, BFP, CDRRMO, department contacts`}
        url="/hotlines"
      />
      <PageBanner
        eyebrow={t('hotlines.page.eyebrow')}
        title={t('hotlines.page.title')}
        description={t('hotlines.page.description', { city: governmentName })}
        breadcrumbs={[
          { label: t('common.home'), href: '/' },
          { label: t('hotlines.page.title'), href: '/hotlines' },
        ]}
      />

      <Section className="p-3 mb-12 pt-10">
        {/* Emergency numbers come from src/data/hotlines.ts — the same source
              that powers the /contact page, so the two never drift. */}
        <EmergencyHotlinesSection officesHref="#department-contacts" />
        <DepartmentContactsSection />

        <Card className="rounded-2xl bg-primary-50/60 shadow-[inset_0_0_0_1px_rgba(0,102,235,0.15)]">
          <CardContent className="p-5 flex items-start gap-3">
            <Phone
              className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <Heading level={2} className="text-base mb-1">
                {t('hotlines.page.moreHelp.title')}
              </Heading>
              <Text className="text-sm text-gray-700 mb-2 text-pretty">
                {t('hotlines.page.moreHelp.body', { city: governmentName })}
              </Text>
              <Link
                to="/contact"
                className="inline-flex items-center min-h-[44px] text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md"
              >
                {t('hotlines.page.moreHelp.link')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
