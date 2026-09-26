import CategoryCard from '../../ui/CategoryCard';
import StatusBadge from '../../ui/StatusBadge';
import { getIconComponent } from '../../../lib/iconMap';
import type { Department } from '../../../data/yamlLoader';
import { useTranslation } from 'react-i18next';

interface DepartmentCardProps {
  department: Department;
}

/**
 * A department is an entity card, not a category card: it carries an acronym
 * chip and a branch line, and it is drawn by the same `CategoryCard` as every
 * other card on the site so the two never drift apart again.
 */
export default function DepartmentCard({ department }: DepartmentCardProps) {
  const { t } = useTranslation('common');

  return (
    <CategoryCard
      to={`/government/departments/${department.slug}`}
      title={department.name}
      description={department.description}
      icon={getIconComponent('Landmark', { domain: 'government' })}
      tone="primary"
      headingLevel={3}
      meta={
        <StatusBadge tone="neutral" size="sm">
          {department.acronym}
        </StatusBadge>
      }
      footnote={department.branch}
      cta={t('departments.viewDetails')}
    />
  );
}
