import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getIconComponent } from '../../lib/iconMap';
import type { TransparencyResource } from '../../data/yamlLoader';
import CategoryCard from '../ui/CategoryCard';

interface TransparencyResourceCardProps {
  resource: TransparencyResource;
}

export default function TransparencyResourceCard({
  resource,
}: TransparencyResourceCardProps) {
  const { t } = useTranslation('common');
  const isExternal = resource.external || resource.href.startsWith('http');

  return (
    <CategoryCard
      to={resource.href}
      title={resource.title}
      description={resource.description}
      icon={getIconComponent(resource.icon)}
      cta={t('transparency.viewResource')}
      external={isExternal}
      headingLevel={3}
      meta={
        isExternal ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
            <ExternalLink className="size-3" aria-hidden="true" />
            {t('transparency.external')}
          </span>
        ) : undefined
      }
    />
  );
}
