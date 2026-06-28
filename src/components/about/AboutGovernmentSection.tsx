import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import Section from '../ui/Section';
import { governmentSections } from '../../lib/siteConfig';
import { getLucideIcon } from './utils';

function getGovernmentHref(slug: string) {
  if (slug === 'officials') return '/government/officials';
  if (slug === 'barangays') return '/government/barangays';
  if (slug === 'departments') return '/government/departments';
  if (slug === 'projects') return '/government/projects';
  return `/government/${slug}`;
}

export default function AboutGovernmentSection() {
  const { t } = useTranslation('common');

  return (
    <Section>
      <Heading level={2} className="mb-2 text-balance">
        {t('about.government.title')}
      </Heading>
      <Text className="text-gray-600 mb-8 text-pretty">
        {t('about.government.description')}
      </Text>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {governmentSections.map((section, index) => (
          <Link
            key={section.slug}
            to={getGovernmentHref(section.slug)}
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-2xl active:scale-[0.96] motion-reduce:active:scale-100 motion-safe:animate-slide-in motion-reduce:animate-none"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <Card
              hoverable
              className="h-full shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] transition-[transform,box-shadow] duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.1)] motion-reduce:group-hover:translate-y-0"
            >
              <CardContent className="p-5">
                <div className="bg-primary-100 text-primary-600 p-2.5 rounded-lg w-fit mb-3 transition-colors duration-200">
                  {getLucideIcon(section.icon)}
                </div>
                <h4 className="font-semibold text-gray-900 text-balance group-hover:text-primary-700 transition-colors duration-200">
                  {section.category}
                </h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3 text-pretty">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
