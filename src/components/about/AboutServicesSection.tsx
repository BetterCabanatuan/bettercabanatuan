import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import Section from '../ui/Section';
import { serviceCategories } from '../../data/yamlLoader';
import { services } from '../../lib/siteConfig';
import { getLucideIcon } from './utils';

export default function AboutServicesSection() {
  const { t } = useTranslation('common');

  return (
    <Section>
      <Heading level={2} className="mb-2 text-balance">
        {t('about.services.title')}
      </Heading>
      <Text className="text-gray-600 mb-8 text-pretty">
        {serviceCategories.description || t('about.services.description')}
      </Text>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((category, index) => (
          <Link
            key={category.slug}
            to={`/services/${category.slug}`}
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-2xl active:scale-[0.96] motion-reduce:active:scale-100 motion-safe:animate-slide-in motion-reduce:animate-none"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <Card
              hoverable
              className="h-full border-t-4 border-primary-500 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] transition-[transform,box-shadow] duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.1)] motion-reduce:group-hover:translate-y-0"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 text-primary-600 p-2.5 rounded-lg shrink-0 transition-colors duration-200">
                    {getLucideIcon(category.icon)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-balance group-hover:text-primary-700 transition-colors duration-200">
                      {category.category}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-3 text-pretty">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
