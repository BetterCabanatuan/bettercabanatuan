import { getIconComponent } from '../../lib/iconMap';
import { useTranslation } from '../../hooks/useTranslation';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import CategoryCard from '../ui/CategoryCard';
import CardGrid, { CardGridItem } from '../ui/CardGrid';
import BrowseAllLink, { BrowseAllFooter } from '../ui/BrowseAllLink';
import StatusBadge from '../ui/StatusBadge';
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
  comingSoon?: boolean;
}

interface GovernmentActivitySectionProps {
  title?: string;
  description?: string;
  showHeader?: boolean;
  compact?: boolean;
}

/** Sections surfaced on the homepage; the rest live behind "browse all". */
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
  if (slug === 'news') return '/government/news';
  return `/government/${slug}`;
}

/**
 * A section with a live page is ready. Anything routed through
 * GovernmentCategoryPage depends on published content, so an unflagged section
 * has nothing to show yet.
 */
function hasDedicatedPage(slug: string): boolean {
  return ['officials', 'departments', 'projects', 'barangays', 'news'].includes(
    slug
  );
}

export default function GovernmentActivitySection({
  title,
  description,
  showHeader = true,
  compact = false,
}: GovernmentActivitySectionProps = {}) {
  const { t } = useTranslation();

  const allCategories = governmentCategories.categories as Category[];

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
            {title || t('governmentActivity.title')}
          </Heading>
          <Text className="mb-6 text-pretty text-gray-600">
            {description || t('governmentActivity.description')}
          </Text>
        </>
      )}

      <CardGrid label={t('governmentActivity.title')}>
        {categories.map((category, index) => {
          const ready = hasDedicatedPage(category.slug);

          return (
            <CardGridItem key={category.slug}>
              <CategoryCard
                to={getGovernmentHref(category.slug)}
                title={category.category}
                description={category.description}
                icon={getIconComponent(category.icon, {
                  domain: 'government',
                })}
                // A section with no content behind it reads as unfinished
                // rather than broken: muted tile, and a plain badge instead of
                // the amber "coming soon" chip that used to compete with the
                // category description for attention.
                tone={ready ? 'primary' : 'neutral'}
                meta={
                  ready ? undefined : (
                    <StatusBadge tone="neutral" size="sm">
                      {t('emptyState.badge')}
                    </StatusBadge>
                  )
                }
                cta={t('governmentActivity.viewSection')}
                animate={compact}
                animationDelay={index * 100}
              />
            </CardGridItem>
          );
        })}
      </CardGrid>

      {compact && (
        <BrowseAllFooter>
          <BrowseAllLink to="/government" count={allCategories.length}>
            {t('governmentActivity.viewAll')}
          </BrowseAllLink>
        </BrowseAllFooter>
      )}
    </>
  );

  if (showHeader) {
    return <Section id="government">{content}</Section>;
  }

  return content;
}
