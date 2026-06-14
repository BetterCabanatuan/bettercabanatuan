import { Trans, useTranslation } from 'react-i18next';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Phone, ExternalLink } from 'lucide-react';
import { emergencyHotlines, formatPhoneForTel } from '../../data/hotlines';

export default function EmergencyHotlinesSection() {
  const { t } = useTranslation('common');

  return (
    <section
      id="emergency-hotlines"
      aria-labelledby="emergency-hotlines-heading"
      className="mb-12 scroll-mt-28"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600 mb-1">
            {t('hotlines.section.eyebrow')}
          </p>
          <Heading level={2} id="emergency-hotlines-heading" className="mb-2">
            {t('hotlines.section.title')}
          </Heading>
          <Text className="text-gray-600 mb-0 max-w-2xl">
            {t('hotlines.section.description')}
          </Text>
        </div>
        <a
          href="https://bettergov.ph/philippines/hotlines"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-colors duration-200 shrink-0"
        >
          {t('hotlines.section.nationalLink')}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyHotlines.map(hotline => {
          const Icon = hotline.icon;

          return (
            <Card
              key={hotline.id}
              className="h-full border-t-4 border-red-500 overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-50 text-red-600 shrink-0">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <Heading level={3} className="text-lg mb-1">
                      {hotline.name}
                    </Heading>
                    <Text className="text-gray-500 text-sm mb-0">
                      {hotline.phones.length > 1
                        ? t('hotlines.section.multipleNumbers', {
                            count: hotline.phones.length,
                          })
                        : t('hotlines.section.directLine')}
                    </Text>
                  </div>
                </div>

                <ul className="space-y-2">
                  {hotline.phones.map(phone => (
                    <li key={phone.number}>
                      <a
                        href={`tel:${formatPhoneForTel(phone.number)}`}
                        className="group flex items-center gap-3 min-h-[44px] px-4 py-2.5 rounded-lg border border-gray-100 bg-gray-50/80 hover:border-red-200 hover:bg-red-50/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 transition-all duration-200"
                      >
                        <Phone
                          className="h-4 w-4 text-red-600 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="font-medium text-gray-900 group-hover:text-red-700 transition-colors duration-200">
                          {phone.number}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 bg-red-50 border-red-200">
        <CardContent className="p-5">
          <Text className="text-sm text-gray-700 mb-0">
            <Trans
              i18nKey="hotlines.section.disclaimer"
              components={{
                1: (
                  <a
                    href="#contact-offices"
                    className="text-primary-600 hover:underline font-medium"
                  />
                ),
              }}
            />
          </Text>
        </CardContent>
      </Card>
    </section>
  );
}
