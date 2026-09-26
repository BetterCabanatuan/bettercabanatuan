import { useTranslation } from 'react-i18next';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import Section from '../ui/Section';
import { governmentSections } from '../../lib/siteConfig';
import { getIconComponent } from '../../lib/iconMap';
import CardGrid, { CardGridItem } from '../ui/CardGrid';
import CategoryCard from '../ui/CategoryCard';

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
      <CardGrid label={t('about.government.title')}>
        {governmentSections.map((section, index) => (
          <CardGridItem key={section.slug}>
            <CategoryCard
              to={getGovernmentHref(section.slug)}
              title={section.category}
              description={section.description}
              icon={getIconComponent(section.icon, { domain: 'government' })}
              cta="View section"
              headingLevel={3}
              animate
              animationDelay={index * 80}
            />
          </CardGridItem>
        ))}
      </CardGrid>
    </Section>
  );
}
