import { useTranslation } from 'react-i18next';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import Section from '../ui/Section';
import { serviceCategories } from '../../data/yamlLoader';
import { services } from '../../lib/siteConfig';
import { getIconComponent } from '../../lib/iconMap';
import CardGrid, { CardGridItem } from '../ui/CardGrid';
import CategoryCard from '../ui/CategoryCard';

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
      <CardGrid label={t('about.services.title')}>
        {services.map((category, index) => (
          <CardGridItem key={category.slug}>
            <CategoryCard
              to={`/services/${category.slug}`}
              title={category.category}
              description={category.description}
              icon={getIconComponent(category.icon, { domain: 'service' })}
              cta="View services"
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
