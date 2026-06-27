import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { getIconComponent } from '../../lib/iconMap';
import { Text } from '../ui/Text';
import { useTranslation } from '../../hooks/useTranslation';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Link } from 'react-router-dom';

import { serviceCategories } from '../../data/yamlLoader';

interface Subcategory {
  name: string;
  slug: string;
}

interface Category {
  category: string;
  slug: string;
  subcategories: Subcategory[];
  description: string;
  icon: string;
}

interface ServicesSectionProps {
  title?: string;
  description?: string;
  showHeader?: boolean;
  compact?: boolean;
}

const FEATURED_SLUGS = [
  'health-services',
  'education',
  'business',
  'social-welfare',
] as const;

export default function ServicesSection({
  title,
  description,
  showHeader = true,
  compact = false,
}: ServicesSectionProps = {}) {
  const { t } = useTranslation();

  const getIcon = (iconName: string) => {
    const IconComponent = getIconComponent(iconName);
    return <IconComponent className="h-6 w-6" />;
  };

  const allCategories = serviceCategories.categories as Category[];

  const displayedCategories = compact
    ? [
        ...FEATURED_SLUGS.map(slug =>
          allCategories.find(category => category.slug === slug)
        ).filter((category): category is Category => Boolean(category)),
        {
          category: t('services.compact.other'),
          slug: 'other',
          description: t('services.compact.otherDescription'),
          icon: 'LayoutGrid',
          subcategories: [],
        },
      ]
    : allCategories;

  const content = (
    <>
      {showHeader && (
        <>
          <Heading level={2}>{title || t('services.title')}</Heading>
          <Text className="text-gray-600 mb-6">
            {description || t('services.description')}
          </Text>
        </>
      )}

      <div
        className={
          compact
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6'
            : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
        }
      >
        {displayedCategories.map(category => {
          const href =
            category.slug === 'other'
              ? '/services'
              : `/services/${category.slug}`;

          return (
            <Card
              key={category.slug}
              hoverable
              className="border-t-4 border-primary-500"
            >
              <Link
                to={href}
                className="mt-auto text-primary-600 hover:text-primary-700 font-medium transition-colors inline-flex items-center"
              >
                <CardContent className="flex flex-col h-full p-6">
                  <div className="flex gap-2">
                    <div className="bg-primary-100 text-primary-600 p-3 rounded-md mb-4 self-start">
                      {getIcon(category.icon)}
                    </div>

                    <h3 className="text-lg font-semibold mb-4 text-gray-900 self-center">
                      {category.category}
                    </h3>
                  </div>
                  <Text className="text-gray-800">{category.description}</Text>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </>
  );

  if (showHeader) {
    return <Section>{content}</Section>;
  }

  return content;
}
