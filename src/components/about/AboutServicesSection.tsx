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
      <Heading level={2} className="mb-2">
        {t('about.services.title')}
      </Heading>
      <Text className="text-gray-600 mb-8">
        {serviceCategories.description || t('about.services.description')}
      </Text>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(category => (
          <Link
            key={category.slug}
            to={`/services/${category.slug}`}
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-xl"
          >
            <Card hoverable className="h-full border-t-4 border-primary-500">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 text-primary-600 p-2.5 rounded-lg shrink-0">
                    {getLucideIcon(category.icon)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                      {category.category}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">
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
