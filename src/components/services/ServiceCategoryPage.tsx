import Section from '../ui/Section';
import { useParams } from 'react-router-dom';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import {
  serviceCategories,
  getCategorySubcategories,
  type Subcategory,
  type CategoryIndex,
} from '../../data/yamlLoader';
import { getIconComponent } from '../../lib/iconMap';
import SEO from '../SEO';
import NotFoundGuard from '../shared/NotFoundGuard';
import { useState, useEffect } from 'react';
import { breadcrumbJsonLd } from '../../lib/structuredData';
import GovernmentPageHero from '../government/GovernmentPageHero';
import CardGrid, { CardGridItem } from '../ui/CardGrid';
import CategoryCard from '../ui/CategoryCard';
import EmptyState from '../ui/EmptyState';
import { Inbox } from 'lucide-react';

interface ServiceCategoryPageProps {
  categoryId?: string;
}

export default function ServiceCategoryPage({
  categoryId: fixedCategoryId,
}: ServiceCategoryPageProps) {
  const { categoryId: paramCategoryId } = useParams();
  const categoryId = fixedCategoryId ?? paramCategoryId;

  const [categoryIndex, setCategoryIndex] = useState<CategoryIndex>({
    layout: 'list',
    pages: [],
  });
  const [loading, setLoading] = useState(false);
  const subcategories: Subcategory[] = categoryIndex.pages;

  const categoryData = serviceCategories.categories.find(
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
        subject="service category"
        backHref="/services"
        backLabel="Back to all services"
      />
    );
  }

  return (
    <>
      <SEO
        title={categoryData.category || categoryId}
        description={categoryData.description}
        keywords={`${categoryData.category}, government services, public services, local government`}
        url={`/services/${categoryId}`}
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: categoryData.category, url: `/services/${categoryId}` },
        ])}
      />
      <GovernmentPageHero
        eyebrow="City Services"
        title={categoryData.category || categoryId}
        description={categoryData.description}
        icon={Icon}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          {
            label: categoryData.category || categoryId,
            href: `/services/${categoryId}`,
          },
        ]}
      />
      <Section className="pb-16 pt-10">
        {loading ? (
          <div
            className="flex items-center justify-center p-8"
            role="status"
            aria-live="polite"
          >
            <Text>Loading services…</Text>
          </div>
        ) : subcategories.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No services published yet"
            description="This category does not have published service guides yet. Browse all services or contact the city for assistance."
            primaryAction={{ href: '/services', label: 'Browse all services' }}
            secondaryAction={{ href: '/contact', label: 'Contact the city' }}
          />
        ) : (
          <>
            {categoryIndex.title && (
              <Heading level={2}>{categoryIndex.title}</Heading>
            )}
            {categoryIndex.description && (
              <Text className="text-gray-600 mb-4">
                {categoryIndex.description}
              </Text>
            )}
            <CardGrid
              label={categoryData.category || categoryId}
              className="lg:grid-cols-2 xl:grid-cols-2"
            >
              {subcategories.map(subcategory => (
                <CardGridItem key={subcategory.slug}>
                  <CategoryCard
                    to={`/services/${categoryId}/${subcategory.slug}`}
                    title={subcategory.name}
                    description={subcategory.description}
                    icon={Icon}
                    cta="View service"
                    headingLevel={3}
                  />
                </CardGridItem>
              ))}
            </CardGrid>
          </>
        )}
      </Section>
    </>
  );
}
