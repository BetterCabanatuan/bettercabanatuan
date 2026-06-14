import { useTranslation } from 'react-i18next';
import { CheckCircle2, Globe, Heart, Users } from 'lucide-react';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Heading } from '../ui/Heading';
import Section from '../ui/Section';

const valueKeys = [
  {
    icon: Globe,
    titleKey: 'about.values.openInformation.title',
    descriptionKey: 'about.values.openInformation.description',
  },
  {
    icon: Heart,
    titleKey: 'about.values.communityDriven.title',
    descriptionKey: 'about.values.communityDriven.description',
  },
  {
    icon: Users,
    titleKey: 'about.values.civicEngagement.title',
    descriptionKey: 'about.values.civicEngagement.description',
  },
  {
    icon: CheckCircle2,
    titleKey: 'about.values.alwaysImproving.title',
    descriptionKey: 'about.values.alwaysImproving.description',
  },
] as const;

export default function AboutValuesSection() {
  const { t } = useTranslation('common');

  return (
    <Section>
      <Heading level={2} className="mb-8">
        {t('about.values.title')}
      </Heading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {valueKeys.map(item => (
          <Card key={item.titleKey} className="border-t-4 border-primary-500">
            <CardContent className="p-6">
              <item.icon
                className="h-6 w-6 text-primary-600 mb-3"
                aria-hidden="true"
              />
              <h4 className="font-semibold text-gray-900 mb-1">
                {t(item.titleKey)}
              </h4>
              <p className="text-sm text-gray-600">{t(item.descriptionKey)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
