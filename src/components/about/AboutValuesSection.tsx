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
      <Heading level={2} className="mb-8 text-balance">
        {t('about.values.title')}
      </Heading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {valueKeys.map((item, index) => (
          <Card
            key={item.titleKey}
            className="border-t-4 border-primary-500 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.1)] motion-safe:animate-slide-in motion-reduce:hover:translate-y-0 motion-reduce:animate-none"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <item.icon
                className="h-6 w-6 text-primary-600 mb-3"
                aria-hidden="true"
              />
              <h4 className="font-semibold text-gray-900 mb-1 text-balance">
                {t(item.titleKey)}
              </h4>
              <p className="text-sm text-gray-600 text-pretty">
                {t(item.descriptionKey)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
