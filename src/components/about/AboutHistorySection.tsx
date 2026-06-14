import { useTranslation } from 'react-i18next';
import { Calendar, ScrollText } from 'lucide-react';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import Section from '../ui/Section';
import { aboutData } from '../../data/yamlLoader';

function getHistoryParagraphs(
  t: (key: string, options?: { returnObjects?: boolean }) => unknown
) {
  const i18nParagraphs = t('about.history.paragraphs', { returnObjects: true });
  if (Array.isArray(i18nParagraphs) && i18nParagraphs.length > 0) {
    return i18nParagraphs as string[];
  }
  return aboutData.history.paragraphs;
}

function getFactLabelKey(label: string) {
  if (label === 'Date Created') return 'about.history.fastFacts.dateCreated';
  if (label === 'Enabling Law') return 'about.history.fastFacts.enablingLaw';
  return null;
}

export default function AboutHistorySection() {
  const { t } = useTranslation('common');
  const { history } = aboutData;
  const paragraphs = getHistoryParagraphs(t);

  return (
    <Section className="bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <Heading level={2} className="mb-2">
          {t('about.history.title')}
        </Heading>
        {history.description && (
          <Text className="text-gray-600 mb-8">
            {t('about.history.description')}
          </Text>
        )}

        <div className="prose prose-gray max-w-none space-y-5">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {history.fastFacts && history.fastFacts.length > 0 && (
          <div className="mt-10">
            <Heading level={3} className="mb-4">
              {t('common.fastFacts')}
            </Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {history.fastFacts.map(fact => {
                const labelKey = getFactLabelKey(fact.label);

                return (
                  <Card
                    key={fact.label}
                    className="border-t-4 border-primary-500 h-full"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        {fact.label === 'Date Created' ? (
                          <Calendar
                            className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                        ) : (
                          <ScrollText
                            className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            {labelKey ? t(labelKey) : fact.label}
                          </p>
                          <p className="text-base font-semibold text-gray-900 mt-1">
                            {fact.value}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
