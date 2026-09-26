import Section from '../ui/Section';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import EmptyState from '../ui/EmptyState';
import {
  governmentCategories,
  getCategorySubcategories,
  type Subcategory,
  type CategoryIndex,
} from '../../data/yamlLoader';
import Breadcrumbs from '../ui/Breadcrumbs';
import { getIconComponent } from '../../lib/iconMap';
import SEO from '../SEO';
import { Card, CardContent } from '../ui/Card';
import NotFoundGuard from '../shared/NotFoundGuard';
import { useState, useEffect } from 'react';
import { breadcrumbJsonLd } from '../../lib/structuredData';

interface GovernmentCategoryPageProps {
  categoryId?: string;
}

export default function GovernmentCategoryPage({
  categoryId: fixedCategoryId,
}: GovernmentCategoryPageProps) {
  const { categoryId: paramCategoryId } = useParams();
  const categoryId = fixedCategoryId ?? paramCategoryId;
  const { t } = useTranslation('common');

  const [categoryIndex, setCategoryIndex] = useState<CategoryIndex>({
    layout: 'list',
    pages: [],
  });
  const [loading, setLoading] = useState(false);
  const subcategories: Subcategory[] = categoryIndex.pages;

  const categoryData = governmentCategories.categories.find(
    c => c.slug === categoryId
  );
  const Icon = getIconComponent(categoryData?.icon);

  useEffect(() => {
    if (categoryId && categoryData) {
      setLoading(true);
      getCategorySubcategories(categoryId)
        .then(setCategoryIndex)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [categoryId, categoryData]);

  if (!categoryId || !categoryData) {
    return (
      <NotFoundGuard
        subject="section"
        backHref="/government"
        backLabel="Back to all government sections"
      />
    );
  }

  return (
    <>
      <SEO
        title={categoryData.category || categoryId}
        description={categoryData.description}
        keywords={`${categoryData.category}, government services, public services, local government`}
        url={`/government/${categoryId}`}
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Government', url: '/government' },
          { name: categoryData.category, url: `/government/${categoryId}` },
        ])}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs className="mb-8" />
        <Icon className="h-8 w-8 mb-4 text-primary-600 rounded-md" />
        <Heading>{categoryData.category || categoryId}</Heading>
        <Text className="text-gray-600 mb-6">{categoryData.description}</Text>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Text>Loading...</Text>
          </div>
        ) : subcategories.length === 0 ? (
          /* No pages published for this category yet — never render a blank
             content area. See P2-1. */
          <EmptyState
            icon={Icon}
            badge={
              categoryData.comingSoon
                ? t('emptyState.badge')
                : t('emptyState.noContentBadge')
            }
            title={
              categoryData.comingSoon
                ? t('emptyState.comingSoonTitle')
                : t('emptyState.noContentTitle')
            }
            description={
              categoryData.comingSoonNote ||
              t('emptyState.comingSoonDescription')
            }
            primaryAction={{
              href: '/government',
              label: t('emptyState.browseGovernment'),
            }}
            secondaryAction={{
              href: '/contact',
              label: t('emptyState.contactCity'),
            }}
          />
        ) : (
          <>
            {categoryIndex.title && (
              <Heading level={3}>{categoryIndex.title}</Heading>
            )}
            {categoryIndex.description && (
              <Text className="text-gray-600 mb-4">
                {categoryIndex.description}
              </Text>
            )}
            {categoryIndex.layout === 'grid' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subcategories.map(subcategory => (
                  <Link
                    key={subcategory.slug}
                    to={`/government/${categoryId}/${subcategory.slug}`}
                  >
                    <Card hoverable className="h-full ring-1 ring-black/[0.06]">
                      <CardContent>
                        <h4 className="text-lg font-medium text-gray-900">
                          {subcategory.name}
                        </h4>
                        {subcategory.description && (
                          <p className="mt-2 text-sm text-gray-600">
                            {subcategory.description}
                          </p>
                        )}
                        <span className="inline-block px-2 py-1 mt-2 text-xs font-medium rounded-sm bg-gray-100 text-gray-800">
                          {categoryData.category || categoryId}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {subcategories.map(subcategory => (
                  <Link
                    key={subcategory.slug}
                    to={`/government/${categoryId}/${subcategory.slug}`}
                  >
                    <Card hoverable className="mb-4">
                      <CardContent>
                        <h4 className="text-lg font-medium text-gray-900">
                          {subcategory.name}
                        </h4>
                        {subcategory.description && (
                          <p className="mt-2 text-sm text-gray-600">
                            {subcategory.description}
                          </p>
                        )}
                        <span className="inline-block px-2 py-1 mt-2 text-xs font-medium rounded-sm bg-gray-100 text-gray-800">
                          {categoryData.category || categoryId}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </Section>
    </>
  );
}
