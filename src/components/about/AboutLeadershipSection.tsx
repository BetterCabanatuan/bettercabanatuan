import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Crown, ExternalLink, Landmark } from 'lucide-react';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import Section from '../ui/Section';
import { leadership, siteConfig } from '../../lib/siteConfig';

export default function AboutLeadershipSection() {
  const { t } = useTranslation('common');

  if (!leadership.mayor && !leadership.viceMayor) {
    return null;
  }

  return (
    <Section>
      <Heading level={2} className="mb-2 text-balance">
        {t('about.leadership.title')}
      </Heading>
      <Text className="text-gray-600 mb-8 text-pretty">
        {t('about.leadership.description', { city: siteConfig.governmentName })}
      </Text>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leadership.mayor && (
          <Card className="border-t-4 border-yellow-500 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] motion-safe:animate-slide-in motion-reduce:animate-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                <span className="text-sm font-medium text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full">
                  {t('about.leadership.cityMayor')}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {leadership.mayor.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {t('common.term', { term: leadership.mayor.term })}
              </p>
              <p className="text-sm text-gray-700">
                {leadership.mayor.description}
              </p>
            </CardContent>
          </Card>
        )}
        {leadership.viceMayor && (
          <Card
            className="border-t-4 border-primary-500 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] motion-safe:animate-slide-in motion-reduce:animate-none"
            style={{ animationDelay: '100ms' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Landmark
                  className="h-6 w-6 text-primary-600"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-primary-800 bg-primary-100 px-2 py-0.5 rounded-full">
                  {t('about.leadership.viceMayor')}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {leadership.viceMayor.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {t('common.term', { term: leadership.viceMayor.term })}
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
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-[transform,color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
        >
          {t('about.leadership.viewAll', { count: leadership.totalOfficials })}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}
