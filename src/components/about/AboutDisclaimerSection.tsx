import { Trans, useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import Section from '../ui/Section';
import { siteConfig } from '../../lib/siteConfig';

export default function AboutDisclaimerSection() {
  const { t } = useTranslation('common');

  return (
    <Section>
      <Card className="rounded-2xl bg-amber-50 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.35)]">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="h-6 w-6 text-amber-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <Heading level={3} className="text-balance">
                {t('about.disclaimer.title')}
              </Heading>
              <Text className="text-gray-700 mb-4 text-pretty">
                {t('about.disclaimer.body1')}
              </Text>
              <Text className="text-gray-700 mb-0">
                <Trans
                  i18nKey="about.disclaimer.body2"
                  values={{
                    email: siteConfig.contactEmail,
                    city: siteConfig.governmentName,
                  }}
                  components={{
                    1: (
                      <a
                        href={`mailto:${siteConfig.contactEmail}`}
                        className="text-primary-600 hover:underline"
                      />
                    ),
                    2: (
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
            </div>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}
