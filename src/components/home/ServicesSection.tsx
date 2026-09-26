import { getIconComponent } from '../../lib/iconMap';
import { useTranslation } from '../../hooks/useTranslation';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import CategoryCard from '../ui/CategoryCard';
import CardGrid, { CardGridItem } from '../ui/CardGrid';
import BrowseAllLink, { BrowseAllFooter } from '../ui/BrowseAllLink';
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

/**
 * The four categories surfaced on the homepage. Everything else is reached
 * through the "browse all" link underneath, which is why that link is not a
 * card: the grid holds only real categories, and the count on the link says how
 * many it is not showing.
 */
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

  const allCategories = serviceCategories.categories as Category[];

  // Compact shows the featured four; the full page shows every category.
  const categories = compact
    ? FEATURED_SLUGS.map(slug =>
        allCategories.find(category => category.slug === slug)
      ).filter((category): category is Category => Boolean(category))
    : allCategories;

  const content = (
    <>
      {showHeader && (
        <>
          <Heading level={2} className="text-balance">
            {title || t('services.title')}
          </Heading>
          <Text className="mb-6 text-pretty text-gray-600">
            {description || t('services.description')}
          </Text>
        </>
      )}

      <CardGrid label={t('services.title')}>
        {categories.map((category, index) => (
          <CardGridItem key={category.slug}>
            <CategoryCard
              to={`/services/${category.slug}`}
              title={category.category}
              description={category.description}
              icon={getIconComponent(category.icon, { domain: 'service' })}
              tone="primary"
              cta={t('services.viewAllCategory')}
              animate={compact}
              animationDelay={index * 100}
            />
          </CardGridItem>
        ))}
      </CardGrid>

      {/*
        The overflow signpost, and only where there is overflow. On /services
        every category is already in the grid, so a "browse all" link there
        would point at the page you are already on.
      */}
      {compact && (
        <BrowseAllFooter>
          <BrowseAllLink to="/services" count={allCategories.length}>
            {t('services.viewAll')}
          </BrowseAllLink>
        </BrowseAllFooter>
      )}
    </>
  );

  if (showHeader) {
    return <Section>{content}</Section>;
  }

  return content;
}
