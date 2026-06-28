import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { getIconComponent } from '../../lib/iconMap';
import { Text } from '../ui/Text';
import { useTranslation } from '../../hooks/useTranslation';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Link } from 'react-router-dom';

import { governmentCategories } from '../../data/yamlLoader';

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

interface GovernmentActivitySectionProps {
  title?: string;
  description?: string;
  showHeader?: boolean;
  compact?: boolean;
}

const FEATURED_SLUGS = [
  'officials',
  'departments',
  'projects',
  'barangays',
] as const;

function getGovernmentHref(slug: string): string {
  if (slug === 'officials') return '/government/officials';
  if (slug === 'barangays') return '/government/barangays';
  if (slug === 'departments') return '/government/departments';
  if (slug === 'projects') return '/government/projects';
  return `/government/${slug}`;
}

export default function GovernmentActivitySection({
  title,
  description,
  showHeader = true,
  compact = false,
}: GovernmentActivitySectionProps = {}) {
  const { t } = useTranslation();

  const getIcon = (iconName: string) => {
    const IconComponent = getIconComponent(iconName);
    return <IconComponent className="h-6 w-6" />;
  };

  const allCategories = governmentCategories.categories as Category[];

  const displayedCategories = compact
    ? [
        ...FEATURED_SLUGS.map(slug =>
          allCategories.find(category => category.slug === slug)
        ).filter((category): category is Category => Boolean(category)),
        {
          category: t('governmentActivity.compact.other'),
          slug: 'other',
          description: t('governmentActivity.compact.otherDescription'),
          icon: 'LayoutGrid',
          subcategories: [],
        },
      ]
    : allCategories;

  const content = (
    <>
      {showHeader && (
        <>
          <Heading level={2} className="text-balance">
            {title || t('governmentActivity.title')}
          </Heading>
          <Text className="text-gray-600 mb-6 text-pretty">
            {description || t('governmentActivity.description')}
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
        {displayedCategories.map((category, index) => {
          const href =
            category.slug === 'other'
              ? '/government'
              : getGovernmentHref(category.slug);

          return (
            <Card
              key={category.slug}
              hoverable
              className={`border-t-4 border-primary-500 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.1)] motion-reduce:hover:translate-y-0 ${compact ? 'motion-safe:animate-slide-in' : ''}`}
              style={
                compact ? { animationDelay: `${index * 100}ms` } : undefined
              }
            >
              <Link
                to={href}
                className="mt-auto text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 inline-flex items-center active:scale-[0.96] motion-reduce:active:scale-100"
              >
                <CardContent className="flex flex-col h-full p-6">
                  <div className="flex gap-2">
                    <div className="bg-primary-100 text-primary-600 p-3 rounded-lg mb-4 self-start transition-colors duration-200">
                      {getIcon(category.icon)}
                    </div>

                    <h3 className="text-lg font-semibold mb-4 text-gray-900 self-center text-balance">
                      {category.category}
                    </h3>
                  </div>
                  <Text className="text-gray-800 text-pretty">
                    {category.description}
                  </Text>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </>
  );

  if (showHeader) {
    return <Section id="#government">{content}</Section>;
  }

  return content;
}
